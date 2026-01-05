// installXHook - v0.0.1
////////// Original copyright notice //////////
// XHook - v1.3.3 - https://github.com/jpillora/xhook
// Jaime Pillora <dev@jpillora.com> - MIT Copyright 2015
function installXHook(window) {
  'use strict';
  var
    AFTER,
    BEFORE,
    COMMON_EVENTS,
    FIRE,
    FormData,
    NativeFormData,
    NativeXMLHttp,
    OFF,
    ON,
    READY_STATE,
    UPLOAD_EVENTS,
    XMLHTTP,
    document,
    msie,
    xhook;

  //for compression
  document = window.document;
  BEFORE = 'before';
  AFTER = 'after';
  READY_STATE = 'readyState';
  ON = 'addEventListener';
  OFF = 'removeEventListener';
  FIRE = 'dispatchEvent';
  XMLHTTP = 'XMLHttpRequest';
  FormData = 'FormData';

  //parse IE version
  UPLOAD_EVENTS = ['load', 'loadend', 'loadstart'];
  COMMON_EVENTS = ['progress', 'abort', 'error', 'timeout'];

  msie = parseInt((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);
  if (isNaN(msie)) {
    msie = parseInt((/trident\/.*; rv:(\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);
  }

  //if required, add 'indexOf' method to Array
  if (!('indexOf' in Array.prototype)) {
    Array.prototype.indexOf = function(item) {
      for (var i = 0, l = this.length; i < l; i++) {
        if (i in this && this[i] === item) {
          return i;
        }
      }
      return -1;
    };
  }

  function slice(o, n) {
    return Array.prototype.slice.call(o, n);
  }

  function depricatedProp(p) {
    return p === 'returnValue' || p === 'totalSize' || p === 'position';
  }

  function mergeObjects(src, dst) {
    var k;
    for (k in src) {
      if (depricatedProp(k)) {
        continue;
      }
      try {
        dst[k] = src[k];
      } catch (_error) {}
    }
    return dst;
  }

  //proxy events from one emitter to another
  function proxyEvents(events, src, dst) {
    var event, i, len;
    function p(event) {
      return function(e) {
        var clone, k, val;
        clone = {};
        //copies event, with dst emitter inplace of src
        for (k in e) {
          if (depricatedProp(k)) {
            continue;
          }
          val = e[k];
          clone[k] = val === src ? dst : val;
        }
        //emits out the dst
        return dst[FIRE](event, clone);
      };
    }
    //dont proxy manual events
    for (i = 0, len = events.length; i < len; i++) {
      event = events[i];
      if (dst._has(event)) {
        src['on' + event] = p(event);
      }
    }
  }

  //create fake event
  function fakeEvent(type) {
    var msieEventObject;
    if (document.createEventObject != null) {
      msieEventObject = document.createEventObject();
      msieEventObject.type = type;
      return msieEventObject;
    } else {
      // on some platforms like android 4.1.2 and safari on windows, it appears
      // that new Event is not allowed
      try {
        return new Event(type);
      } catch (_error) {
        return {
          type: type
        };
      }
    }
  }

  //tiny event emitter
  function EventEmitter(nodeStyle) {
    var emitter, events;
    //private
    events = {};
    function listeners(event) {
      return events[event] || [];
    }
    //public
    emitter = {};
    emitter[ON] = function(event, callback, i) {
      events[event] = listeners(event);
      if (events[event].indexOf(callback) >= 0) {
        return;
      }
      if (i === void 0) {
        i = events[event].length;
      }
      events[event].splice(i, 0, callback);
    };
    emitter[OFF] = function(event, callback) {
      var i;
      //remove all
      if (event === void 0) {
        events = {};
        return;
      }
      //remove all of type event
      if (callback === void 0) {
        events[event] = [];
      }
      //remove particular handler
      i = listeners(event).indexOf(callback);
      if (i === -1) {
        return;
      }
      listeners(event).splice(i, 1);
    };
    emitter[FIRE] = function() {
      var args, event, i, legacylistener, listener, _i, _len, _ref;
      args = slice(arguments);
      event = args.shift();
      if (!nodeStyle) {
        args[0] = mergeObjects(args[0], fakeEvent(event));
      }
      legacylistener = emitter['on' + event];
      if (legacylistener) {
        legacylistener.apply(void 0, args);
      }
      _ref = listeners(event).concat(listeners('*'));
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        listener = _ref[i];
        listener.apply(void 0, args);
      }
    };
    emitter._has = function(event) {
      return !!(events[event] || emitter['on' + event]);
    };
    //add extra aliases
    if (nodeStyle) {
      emitter.listeners = function(event) {
        return slice(listeners(event));
      };
      emitter.on = emitter[ON];
      emitter.off = emitter[OFF];
      emitter.fire = emitter[FIRE];
      emitter.once = function(e, fn) {
        function fire() {
          emitter.off(e, fire);
          return fn.apply(null, arguments);
        }
        return emitter.on(e, fire);
      };
      emitter.destroy = function() {
        events = {};
      };
    }
    return emitter;
  }

  //use event emitter to store hooks
  xhook = EventEmitter(true);
  xhook.EventEmitter = EventEmitter;
  xhook[BEFORE] = function(handler, i) {
    if (handler.length < 1 || handler.length > 2) {
      throw 'invalid hook';
    }
    return xhook[ON](BEFORE, handler, i);
  };
  xhook[AFTER] = function(handler, i) {
    if (handler.length < 2 || handler.length > 3) {
      throw 'invalid hook';
    }
    return xhook[ON](AFTER, handler, i);
  };
  xhook.enable = function() {
    window[XMLHTTP] = XHookHttpRequest;
    if (NativeFormData) {
      window[FormData] = XHookFormData;
    }
    return xhook;
  };
  xhook.disable = function() {
    window[XMLHTTP] = xhook[XMLHTTP];
    if (NativeFormData) {
      window[FormData] = NativeFormData;
    }
    return xhook;
  };

  //helper
  function convertHeaders(h, dest) {
    var header, headers, k, name, v, value, _i, _len, _ref;
    if (dest == null) {
      dest = {};
    }
    switch (typeof h) {
      case 'object':
        headers = [];
        for (k in h) {
          v = h[k];
          name = k.toLowerCase();
          headers.push('' + name + ':\t' + v);
        }
        return headers.join('\n');
      case 'string':
        headers = h.split('\n');
        for (_i = 0, _len = headers.length; _i < _len; _i++) {
          header = headers[_i];
          if (/([^:]+):\s*(.+)/.test(header)) {
            name = RegExp.$1.toLowerCase();
            value = RegExp.$2;
            if (dest[name] == null) {
              dest[name] = value;
            }
          }
        }
        return dest;
    }
  }
  xhook.headers = convertHeaders;

  //patch FormData
  // we can do this safely because all XHR
  // is hooked, so we can ensure the real FormData
  // object is used on send
  NativeFormData = window[FormData];
  function XHookFormData(form) {
    var entries;
    this.fd = form ? new NativeFormData(form) : new NativeFormData();
    this.form = form;
    entries = [];
    Object.defineProperty(this, 'entries', {
      get: function() {
        var fentries;
        //extract form entries
        fentries = !form ? [] : slice(form.querySelectorAll('input,select')).filter(function(e) {
          var _ref;
          return ((_ref = e.type) !== 'checkbox' && _ref !== 'radio') || e.checked;
        }).map(function(e) {
          return [e.name, e.type === 'file' ? e.files : e.value];
        });
        //combine with js entries
        return fentries.concat(entries);
      }
    });
    this.append = (function(_this) {
      return function() {
        var args;
        args = slice(arguments);
        entries.push(args);
        return _this.fd.append.apply(_this.fd, args);
      };
    })(this);
  }

  if (NativeFormData) {
    //expose native formdata as xhook.FormData incase its needed
    xhook[FormData] = NativeFormData;
  }

  //patch XHR
  NativeXMLHttp = window[XMLHTTP];
  xhook[XMLHTTP] = NativeXMLHttp;
  function XHookHttpRequest() {
    var
      ABORTED,
      currentState,
      facade,
      hasError,
      request,
      response,
      status,
      transiting,
      xhr;
    ABORTED = -1;
    xhr = new xhook[XMLHTTP]();

    //==========================
    // Extra state
    request = {};
    status = null;
    hasError = void 0;
    transiting = void 0;
    response = void 0;

    //==========================
    // Private API

    //read results from real xhr into response
    function readHead() {
      var key, name, val, _ref;
      // Accessing attributes on an aborted xhr object will
      // throw an 'c00c023f error' in IE9 and lower, don't touch it.
      response.status = status || xhr.status;
      if (!(status === ABORTED && msie < 10)) {
        response.statusText = xhr.statusText;
      }
      if (status !== ABORTED) {
        _ref = convertHeaders(xhr.getAllResponseHeaders());
        for (key in _ref) {
          val = _ref[key];
          if (!response.headers[key]) {
            name = key.toLowerCase();
            response.headers[name] = val;
          }
        }
      }
    }

    function readBody() {
      //https://xhr.spec.whatwg.org/
      if (!xhr.responseType || xhr.responseType === 'text') {
        response.text = xhr.responseText;
        response.data = xhr.responseText;
      } else if (xhr.responseType === 'document') {
        response.xml = xhr.responseXML;
        response.data = xhr.responseXML;
      } else {
        response.data = xhr.response;
      }
      //new in some browsers
      if ('responseURL' in xhr) {
        response.finalUrl = xhr.responseURL;
      }
    }

    //write response into facade xhr
    function writeHead() {
      facade.status = response.status;
      facade.statusText = response.statusText;
    }

    function writeBody() {
      if ('text' in response) {
        facade.responseText = response.text;
      }
      if ('xml' in response) {
        facade.responseXML = response.xml;
      }
      if ('data' in response) {
        facade.response = response.data;
      }
      if ('finalUrl' in response) {
        facade.responseURL = response.finalUrl;
      }
    }

    //ensure ready state 0 through 4 is handled
    function emitReadyState(n) {
      while (n > currentState && currentState < 4) {
        facade[READY_STATE] = ++currentState;
        // make fake events for libraries that actually check the type on
        // the event object
        if (currentState === 1) {
          facade[FIRE]('loadstart', {});
        }
        if (currentState === 2) {
          writeHead();
        }
        if (currentState === 4) {
          writeHead();
          writeBody();
        }
        facade[FIRE]('readystatechange', {});
        //delay final events incase of error
        if (currentState === 4) {
          setTimeout(emitFinal, 0);
        }
      }
    }

    function emitFinal() {
      if (!hasError) {
        facade[FIRE]('load', {});
      }
      facade[FIRE]('loadend', {});
      if (hasError) {
        facade[READY_STATE] = 0;
      }
    }

    //control facade ready state
    currentState = 0;
    function setReadyState(n) {
      var hooks;
      //emit events until readyState reaches 4
      if (n !== 4) {
        emitReadyState(n);
        return;
      }
      //before emitting 4, run all 'after' hooks in sequence
      hooks = xhook.listeners(AFTER);
      function process() {
        var hook;
        if (!hooks.length) {
          emitReadyState(4);
          return;
        }
        hook = hooks.shift();
        if (hook.length === 2) {
          hook(request, response);
          process();
        } else if (hook.length === 3 && request.async) {
          hook(request, response, process);
        } else {
          process();
        }
      }
      process();
    }

    //==========================
    // Facade XHR
    facade = request.xhr = EventEmitter();

    //==========================
    // Handle the underlying ready state
    xhr.onreadystatechange = function(event) {
      //pull status and headers
      try {
        if (xhr[READY_STATE] === 2) {
          readHead();
        }
      } catch (_error) {}
      //pull response data
      if (xhr[READY_STATE] === 4) {
        transiting = false;
        readHead();
        readBody();
      }

      setReadyState(xhr[READY_STATE]);
    };

    //mark this xhr as errored
    function hasErrorHandler() {
      hasError = true;
    }
    facade[ON]('error', hasErrorHandler);
    facade[ON]('timeout', hasErrorHandler);
    facade[ON]('abort', hasErrorHandler);
    // progress means we're current downloading...
    facade[ON]('progress', function() {
      //progress events are followed by readystatechange for some reason...
      if (currentState < 3) {
        setReadyState(3);
      } else {
        facade[FIRE]('readystatechange', {}); //TODO fake an XHR event
      }
    });

    // initialise 'withCredentials' on facade xhr in browsers with it
    // or if explicitly told to do so
    if ('withCredentials' in xhr || xhook.addWithCredentials) {
      facade.withCredentials = false;
    }
    facade.status = 0;
    facade.open = function(method, url, async, user, pass) {
      // Initailize empty XHR facade
      currentState = 0;
      hasError = false;
      transiting = false;
      request.headers = {};
      request.headerNames = {};
      request.status = 0;
      response = {};
      response.headers = {};

      request.method = method;
      request.url = url;
      request.async = async !== false;
      request.user = user;
      request.pass = pass;
      // openned facade xhr (not real xhr)
      setReadyState(1);
    };

    facade.send = function(body) {
      var hooks, k, modk, _i, _len, _ref;
      //read xhr settings before hooking
      _ref = ['type', 'timeout', 'withCredentials'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        k = _ref[_i];
        modk = k === 'type' ? 'responseType' : k;
        if (modk in facade) {
          request[k] = facade[modk];
        }
      }

      request.body = body;
      function send() {
        var header, value, _i, _len, _ref;
        //proxy all events from real xhr to facade
        proxyEvents(COMMON_EVENTS, xhr, facade);
        if (facade.upload) {
          proxyEvents(COMMON_EVENTS.concat(UPLOAD_EVENTS), xhr.upload, facade.upload);
        }

        //prepare request all at once
        transiting = true;
        //perform open
        xhr.open(request.method, request.url, request.async, request.user, request.pass);

        //write xhr settings
        _ref = ['type', 'timeout', 'withCredentials'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          k = _ref[_i];
          modk = k === 'type' ? 'responseType' : k;
          if (k in request) {
            xhr[modk] = request[k];
          }
        }

        //insert headers
        _ref = request.headers;
        for (header in _ref) {
          value = _ref[header];
          xhr.setRequestHeader(header, value);
        }
        //extract real formdata
        if (request.body instanceof XHookFormData) {
          request.body = request.body.fd;
        }
        //real send!
        xhr.send(request.body);
      }

      hooks = xhook.listeners(BEFORE);
      //process hooks sequentially
      function process() {
        var hook;
        if (!hooks.length) {
          return send();
        }
        //go to next hook OR optionally provide response
        function done(userResponse) {
          //break chain - provide dummy response (readyState 4)
          if (typeof userResponse === 'object' && (typeof userResponse.status === 'number' || typeof response.status === 'number')) {
            if (!('data' in userResponse)) {
              userResponse.data = userResponse.response || userResponse.text;
            }
            mergeObjects(userResponse, response);
            setReadyState(4);
            return;
          }
          //continue processing until no hooks left
          process();
        }
        //specifically provide headers (readyState 2)
        done.head = function(userResponse) {
          mergeObjects(userResponse, response);
          return setReadyState(2);
        };
        //specifically provide partial text (responseText  readyState 3)
        done.progress = function(userResponse) {
          mergeObjects(userResponse, response);
          return setReadyState(3);
        };

        hook = hooks.shift();
        //async or sync?
        if (hook.length === 1) {
          done(hook(request));
        } else if (hook.length === 2 && request.async) {
          //async handlers must use an async xhr
          hook(request, done);
        } else {
          //skip async hook on sync requests
          done();
        }
      }
      //kick off
      process();
    };

    facade.abort = function() {
      status = ABORTED;
      if (transiting) {
        xhr.abort(); //this will emit an 'abort' for us
      } else {
        facade[FIRE]('abort', {});
      }
    };
    facade.setRequestHeader = function(header, value) {
      var lName, name;
      //the first header set is used for all future case-alternatives of 'name'
      lName = header != null ? header.toLowerCase() : void 0;
      name = request.headerNames[lName] = request.headerNames[lName] || header;
      //append header to any previous values
      if (request.headers[name]) {
        value = request.headers[name] + ', ' + value;
      }
      request.headers[name] = value;
    };
    facade.getResponseHeader = function(header) {
      var name;
      name = header != null ? header.toLowerCase() : void 0;
      return response.headers[name];
    };
    facade.getAllResponseHeaders = function() {
      return convertHeaders(response.headers);
    };

    //proxy call only when supported
    if (xhr.overrideMimeType) {
      facade.overrideMimeType = function() {
        return xhr.overrideMimeType.apply(xhr, arguments);
      };
    }

    //create emitter when supported
    if (xhr.upload) {
      facade.upload = request.upload = EventEmitter();
    }
    this._facade = facade;
  }
  [
    'readyState', 'open', 'setRequestHeader', 'timeout', 'withCredentials',
    'upload', 'send', 'abort', 'status', 'statusText', 'getResponseHeader',
    'getAllResponseHeaders', 'overrideMimeType', 'responseType', 'response',
    'responseText', 'responseXML',
    ON, OFF, FIRE,
    'onreadystatechange', 'onloadstart', 'onprogress', 'onabort', 'onerror',
    'onload', 'ontimeout', 'onloadend'
  ].forEach(function(k) {
    Object.defineProperty(XHookHttpRequest.prototype, k, {
      configurable: true,
      enumerable: true,
      get: function() {
        return this._facade[k];
      },
      set: function(v) {
        this._facade[k] = v;
      }
    });
  });

  return xhook;
}
