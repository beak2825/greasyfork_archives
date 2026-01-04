// ==UserScript==
// @name           eBonus.gg Skip ad
// @namespace      AdsBypasser
// @description    Bypass Ads
// @copyright      2012+, Wei-Cheng Pan (legnaleurc)
// @version        1.0
// @license        BSD
// @homepageURL    https://adsbypasser.github.io/
// @supportURL     https://github.com/adsbypasser/adsbypasser/issues
// @icon           https://raw.githubusercontent.com/adsbypasser/adsbypasser/v5.73.0/img/logo.png
// @grant          unsafeWindow
// @grant          GM_xmlhttpRequest
// @grant          GM_getValue
// @grant          GM_openInTab
// @grant          GM_registerMenuCommand
// @grant          GM_setValue
// @run-at         document-start
// @include        http://*
// @include        https://*
// @connect        *
// @downloadURL https://update.greasyfork.org/scripts/376476/eBonusgg%20Skip%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/376476/eBonusgg%20Skip%20ad.meta.js
// ==/UserScript==
(function (context, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(context, Promise);
  } else {
    var P = null;
    if (context.unsafeWindow.Future) {
      P = function (fn) {
        return context.unsafeWindow.Future.call(this, function (fr) {
          fn(fr.resolve.bind(fr), fr.reject.bind(fr));
        });
      };
    } else if (context.PromiseResolver) {
      P = function (fn) {
        return new context.Promise(function (pr) {
          fn(pr.resolve.bind(pr), pr.reject.bind(pr));
        });
      };
    } else if (typeof context.Promise === 'function') {
      P = context.Promise;
    } else {
      P = this.Promise;
    }
    factory(context, P);
  }
}(this, function (context, Promise) {
  'use strict';
  var _ = context._ = {};
  function setupStack () {
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else if (!this.hasOwnProperty('stack')) {
      var stack = (new Error()).stack.split('\n').slice(2);
      var e = stack[0].match(/^.*@(.*):(\d*)$/);
      this.fileName = e[1];
      this.lineNumber = parseInt(e[2], 10);
      this.stack = stack.join('\n');
    }
  }
  function AdsBypasserError (message) {
    setupStack.call(this);
    this.message = message;
  }
  AdsBypasserError.prototype = Object.create(Error.prototype);
  AdsBypasserError.prototype.constructor = AdsBypasserError;
  AdsBypasserError.prototype.name = 'AdsBypasserError';
  AdsBypasserError.extend = function (protoProps, staticProps) {
    var parent = this, child = function () {
      setupStack.call(this);
      protoProps.constructor.apply(this, arguments);
    };
    extend(child, parent, staticProps);
    child.prototype = Object.create(parent.prototype);
    extend(child.prototype, protoProps);
    child.prototype.constructor = child;
    child.super = parent.prototype;
    return child;
  };
  AdsBypasserError.super = null;
  _.AdsBypasserError = AdsBypasserError;
  function any (c, fn) {
    if (c.some) {
      return c.some(fn);
    }
    if (typeof c.length === 'number') {
      return Array.prototype.some.call(c, fn);
    }
    return Object.keys(c).some(function (k) {
      return fn(c[k], k, c);
    });
  }
  function all (c, fn) {
    if (c.every) {
      return c.every(fn);
    }
    if (typeof c.length === 'number') {
      return Array.prototype.every.call(c, fn);
    }
    return Object.keys(c).every(function (k) {
      return fn(c[k], k, c);
    });
  }
  function each (c, fn) {
    if (c.forEach) {
      c.forEach(fn);
    } else if (typeof c.length === 'number') {
      Array.prototype.forEach.call(c, fn);
    } else {
      Object.keys(c).forEach(function (k) {
        fn(c[k], k, c);
      });
    }
  }
  function map (c, fn) {
    if (c.map) {
      return c.map(fn);
    }
    if (typeof c.length === 'number') {
      return Array.prototype.map.call(c, fn);
    }
    return Object.keys(c).map(function (k) {
      return fn(c[k], k, c);
    });
  }
  function extend(c) {
    Array.prototype.slice.call(arguments, 1).forEach(function (source) {
      if (!source) {
        return;
      }
      _.C(source).each(function (v, k) {
        c[k] = v;
      });
    });
    return c;
  }
  function CollectionProxy (collection) {
    this._c = collection;
  }
  CollectionProxy.prototype.size = function () {
    if (typeof this._c.length === 'number') {
      return this._c.length;
    }
    return Object.keys(c).length;
  };
  CollectionProxy.prototype.at = function (k) {
    return this._c[k];
  };
  CollectionProxy.prototype.each = function (fn) {
    each(this._c, fn);
    return this;
  };
  CollectionProxy.prototype.find = function (fn) {
    var result;
    any(this._c, function (value, index, self) {
      var tmp = fn(value, index, self);
      if (tmp !== _.none) {
        result = {
          key: index,
          value: value,
          payload: tmp,
        };
        return true;
      }
      return false;
    });
    return result;
  };
  CollectionProxy.prototype.all = function (fn) {
    return all(this._c, fn);
  };
  CollectionProxy.prototype.map = function (fn) {
    return map(this._c, fn);
  };
  _.C = function (collection) {
    return new CollectionProxy(collection);
  };
  _.T = function (s) {
    if (typeof s === 'string') {
    } else if (s instanceof String) {
      s = s.toString();
    } else {
      throw new AdsBypasserError('template must be a string');
    }
    var T = {
      '{{': '{',
      '}}': '}',
    };
    return function () {
      var args = Array.prototype.slice.call(arguments);
      var kwargs = args[args.length-1];
      return s.replace(/\{\{|\}\}|\{([^\}]+)\}/g, function (m, key) {
        if (T.hasOwnProperty(m)) {
          return T[m];
        }
        if (args.hasOwnProperty(key)) {
          return args[key];
        }
        if (kwargs.hasOwnProperty(key)) {
          return kwargs[key];
        }
        return m;
      });
    };
  };
  _.P = function (fn) {
    if (typeof fn !== 'function') {
      throw new _.AdsBypasserError('must give a function');
    }
    var slice = Array.prototype.slice;
    var args = slice.call(arguments, 1);
    return function () {
      return fn.apply(this, args.concat(slice.call(arguments)));
    };
  };
  _.D = function (fn) {
    return new Promise(fn);
  };
  _.parseJSON = function (json) {
    try {
      return JSON.parse(json);
    } catch (e) {
      _.warn(e, json);
    }
    return _.none;
  };
  _.isString = function (value) {
    return (typeof value === 'string') || (value instanceof String);
  };
  _.nop = function () {
  };
  _.none = _.nop;
  _.wait = function (msDelay) {
    return _.D(function (resolve, reject) {
      setTimeout(resolve, msDelay);
    });
  };
  _.try = function (msInterval, fn) {
    return _.D(function (resolve, reject) {
      var handle = setInterval(function () {
        var result = fn();
        if (result !== _.none) {
          clearInterval(handle);
          resolve(result);
        }
      }, msInterval);
    });
  };
  function log (method, args) {
    if (_._quiet) {
      return;
    }
    args = Array.prototype.slice.call(args);
    if (_.isString(args[0])) {
      args[0] = 'AdsBypasser: ' + args[0];
    } else {
      args.unshift('AdsBypasser:');
    }
    var f = console[method];
    if (typeof f === 'function') {
      f.apply(console, args);
    }
  }
  _._quiet = false;
  _.info = function () {
    log('info', arguments);
  };
  _.warn = function () {
    log('warn', arguments);
  };
  return _;
}));
(function (context, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = function (context) {
      var core = require('./core.js');
      return factory(context, core);
    };
  } else {
    context.$ = factory(context, context._);
  }
}(this, function (context, _) {
  'use strict';
  var window = context.window;
  var document = window.document;
  var DomNotFoundError = _.AdsBypasserError.extend({
    name: 'DomNotFoundError',
    constructor: function (selector) {
      DomNotFoundError.super.constructor.call(this, _.T('`{0}` not found')(selector));
    },
  });
  var $ = function (selector, context) {
    if (!context || !context.querySelector) {
      context = document;
    }
    var n = context.querySelector(selector);
    if (!n) {
      throw new DomNotFoundError(selector);
    }
    return n;
  };
  $.$ = function (selector, context) {
    try {
      return $(selector, context);
    } catch (e) {
      return null;
    }
  };
  $.$$ = function (selector, context) {
    if (!context || !context.querySelectorAll) {
      context = document;
    }
    var ns = context.querySelectorAll(selector);
    return _.C(ns);
  };
  $.toDOM = function(rawHTML) {
    try {
      var parser = new DOMParser();
      var DOMHTML = parser.parseFromString(rawHTML, "text/html");
      return DOMHTML;
    } catch (e) {
      throw new _.AdsBypasserError('could not parse HTML to DOM');
    }
  };
  $.removeNodes = function (selector, context) {
    $.$$(selector, context).each(function (e) {
      e.parentNode.removeChild(e);
    });
  };
  function searchScriptsByRegExp (pattern, context) {
    var m = $.$$('script', context).find(function (s) {
      var m = s.innerHTML.match(pattern);
      if (!m) {
        return _.none;
      }
      return m;
    });
    if (!m) {
      return null;
    }
    return m.payload;
  }
  function searchScriptsByString (pattern, context) {
    var m = $.$$('script', context).find(function (s) {
      var m = s.innerHTML.indexOf(pattern);
      if (m < 0) {
        return _.none;
      }
      return m;
    });
    if (!m) {
      return null;
    }
    return m.value.innerHTML;
  }
  $.searchScripts = function (pattern, context) {
    if (pattern instanceof RegExp) {
      return searchScriptsByRegExp(pattern, context);
    } else if (_.isString(pattern)) {
      return searchScriptsByString(pattern, context);
    } else {
      return null;
    }
  };
  return $;
}));
(function (context, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = function (context, GM) {
      var core = require('./core.js');
      return factory(context, GM, core);
    };
  } else {
    factory(context, {
      xmlhttpRequest: GM_xmlhttpRequest,
    }, context._);
  }
}(this, function (context, GM, _) {
  'use strict';
  var window = context.window;
  var document = window.document;
  var $ = context.$ || {};
  function deepJoin (prefix, object) {
    return _.C(object).map(function (v, k) {
      var key = _.T('{0}[{1}]')(prefix, k);
      if (typeof v === 'object') {
        return deepJoin(key, v);
      }
      return _.T('{0}={1}').apply(this, [key, v].map(encodeURIComponent));
    }).join('&');
  }
  function toQuery (data) {
    var type = typeof data;
    if (data === null || (type !== 'string' && type !== 'object')) {
      return '';
    }
    if (type === 'string') {
      return data;
    }
    if (data instanceof String) {
      return data.toString();
    }
    return _.C(data).map(function (v, k) {
      if (typeof v === 'object') {
        return deepJoin(k, v);
      }
      return _.T('{0}={1}').apply(this, [k, v].map(encodeURIComponent));
    }).join('&');
  }
  function ajax (method, url, data, headers) {
    var l = document.createElement('a');
    l.href = url;
    var reqHost = l.hostname;
    var overrideHeaders = {
      Host: reqHost || window.location.host,
      Origin: window.location.origin,
      Referer: window.location.href,
      'X-Requested-With': 'XMLHttpRequest',
    };
    _.C(overrideHeaders).each(function (v, k, c) {
      if (headers[k] === _.none) {
        delete headers[k];
      } else {
        headers[k] = v;
      }
    });
    if (data) {
      if (headers['Content-Type'].indexOf('json') >= 0) {
        data = JSON.stringify(data);
      } else {
        data = toQuery(data);
      }
      headers['Content-Length'] = data.length;
    }
    var xhr = null;
    var promise = _.D(function (resolve, reject) {
      xhr = GM.xmlhttpRequest({
        method: method,
        url: url,
        data: data,
        headers: headers,
        onload: function (response) {
          response = (typeof response.responseText !== 'undefined') ? response : this;
          if (response.status !== 200) {
            reject(response.responseText);
          } else {
            resolve(response.responseText);
          }
        },
        onerror: function (response) {
          response = (typeof response.responseText !== 'undefined') ? response : this;
          reject(response.responseText);
        },
      });
    });
    promise.abort = function () {
      xhr.abort();
    };
    return promise;
  }
  $.get = function (url, data, headers) {
    data = toQuery(data);
    data = data ? '?' + data : '';
    headers = headers || {};
    return ajax('GET', url + data, '', headers);
  };
  $.post = function (url, data, headers) {
    var h = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    };
    if (headers) {
      _.C(headers).each(function (v, k) {
        h[k] = v;
      });
    }
    return ajax('POST', url, data, h);
  };
  return $;
}));
(function (context, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = function (context) {
      var core = require('./core.js');
      return factory(context, core);
    };
  } else {
    factory(context, context._);
  }
}(this, function (context, _) {
  'use strict';
  var window = context.window;
  var document = window.document;
  var $ = context.$ || {};
  $.setCookie = function (key, value) {
    var now = new Date();
    now.setTime(now.getTime() + 3600 * 1000);
    var tpl = _.T('{0}={1};path={2};');
    document.cookie = tpl(key, value, window.location.pathname, now.toUTCString());
  };
  $.getCookie = function (key) {
    var c = _.C(document.cookie.split(';')).find(function (v) {
      var k = v.replace(/^\s*([a-zA-Z0-9-_]+)=.+$/, '$1');
      if (k !== key) {
        return _.none;
      }
    });
    if (!c) {
      return null;
    }
    c = c.value.replace(/^\s*[a-zA-Z0-9-_]+=([^;]+).?$/, '$1');
    if (!c) {
      return null;
    }
    return c;
  };
  $.resetCookies = function () {
    var a = document.domain;
    var b = document.domain.replace(/^www\./, '');
    var c = document.domain.replace(/^(\w+\.)+?(\w+\.\w+)$/, '$2');
    var d = (new Date(1e3)).toUTCString();
    _.C(document.cookie.split(';')).each(function (v) {
      var k = v.replace(/^\s*(\w+)=.+$/, '$1');
      document.cookie = _.T('{0}=;expires={1};')(k, d);
      document.cookie = _.T('{0}=;path=/;expires={1};')(k, d);
      var e = _.T('{0}=;path=/;domain={1};expires={2};');
      document.cookie = e(k, a, d);
      document.cookie = e(k, b, d);
      document.cookie = e(k, c, d);
    });
  };
  return $;
}));
(function (context, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = function (context) {
      var core = require('./core.js');
      return factory(context, core);
    };
  } else {
    factory(context, context._);
  }
}(this, function (context, _) {
  'use strict';
  var window = context.window;
  var document = window.document;
  var $ = context.$ || {};
  var patterns = [];
  $.register = function (pattern) {
    patterns.push(pattern);
  };
  function dispatchByObject (rule, url_6) {
    var matched = {};
    var passed = _.C(rule).all(function (pattern, part) {
      if (pattern instanceof RegExp) {
        matched[part] = url_6[part].match(pattern);
      } else if (pattern instanceof Array) {
        var r = _.C(pattern).find(function (p) {
          var m = url_6[part].match(p);
          return m || _.none;
        });
        matched[part] = r ? r.payload : null;
      }
      return !!matched[part];
    });
    return passed ? matched : null;
  }
  function dispatchByRegExp (rule, url_1) {
    return url_1.match(rule);
  }
  function dispatchByArray (rules, url_1, url_3, url_6) {
    var tmp = _.C(rules).find(function (rule) {
      var m = dispatch(rule, url_1, url_3, url_6);
      if (!m) {
        return _.none;
      }
      return m;
    });
    return tmp ? tmp.payload : null;
  }
  function dispatchByString (rule, url_3) {
    var scheme = /\*|https?|file|ftp|chrome-extension/;
    var host = /\*|(\*\.)?([^\/*]+)/;
    var path = /\/.*/;
    var up = new RegExp(_.T('^({scheme})://({host})?({path})$')({
      scheme: scheme.source,
      host: host.source,
      path: path.source,
    }));
    var matched = rule.match(up);
    if (!matched) {
      return null;
    }
    scheme = matched[1];
    host = matched[2];
    var wc = matched[3];
    var sd = matched[4];
    path = matched[5];
    if (scheme === '*' && !/https?/.test(url_3.scheme)) {
      return null;
    } else if (scheme !== url_3.scheme) {
      return null;
    }
    if (scheme !== 'file' && host !== '*') {
      if (wc) {
        up = url_3.host.indexOf(sd);
        if (up < 0 || up + sd.length !== url_3.host.length) {
          return null;
        }
      } else if (host !== url_3.host) {
        return null;
      }
    }
    path = new RegExp(_.T('^{0}$')(path.replace(/[*.\[\]?+#]/g, function (c) {
      if (c === '*') {
        return '.*';
      }
      return '\\' + c;
    })));
    if (!path.test(url_3.path)) {
      return null;
    }
    return url_3;
  }
  function dispatchByFunction (rule, url_1, url_3, url_6) {
    return rule(url_1, url_3, url_6);
  }
  function dispatch (rule, url_1, url_3, url_6) {
    if (rule instanceof Array) {
      return dispatchByArray(rule, url_1, url_3, url_6);
    }
    if (typeof rule === 'function') {
      return dispatchByFunction(rule, url_1, url_3, url_6);
    }
    if (rule instanceof RegExp) {
      return dispatchByRegExp(rule, url_1);
    }
    if (_.isString(rule)) {
      return dispatchByString(rule, url_3);
    }
    return dispatchByObject(rule, url_6);
  }
  $._findHandler = function () {
    var url_1 = window.location.toString();
    var url_3 = {
      scheme: window.location.protocol.slice(0, -1),
      host: window.location.host,
      path: window.location.pathname + window.location.search + window.location.hash,
    };
    var url_6 = {
      scheme: window.location.protocol,
      host: window.location.hostname,
      port: window.location.port,
      path: window.location.pathname,
      query: window.location.search,
      hash: window.location.hash,
    };
    var pattern = _.C(patterns).find(function (pattern) {
      var m = dispatch(pattern.rule, url_1, url_3, url_6);
      if (!m) {
        return _.none;
      }
      return m;
    });
    if (!pattern) {
      return null;
    }
    var matched = pattern.payload;
    pattern = pattern.value;
    if (!pattern.start && !pattern.ready) {
      return null;
    }
    return {
      start: pattern.start ? _.P(pattern.start, matched) : _.nop,
      ready: pattern.ready ? _.P(pattern.ready, matched) : _.nop,
    };
  };
  return $;
}));
(function (context, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = function (context) {
      var core = require('./core.js');
      return factory(context, core);
    };
  } else {
    factory(context, context._);
  }
}(this, function (context, _) {
  'use strict';
  var window = context.window;
  var document = window.document;
  var $ = context.$ || {};
  function prepare (e) {
    if (!document.body) {
      document.body = document.createElement('body');
    }
    document.body.appendChild(e);
    return _.wait(0);
  }
  function get (url) {
    var a = document.createElement('a');
    a.href = url;
    var clicked = false;
    a.addEventListener('click', function (event) {
      event.stopPropagation();
      clicked = true;
    });
    prepare(a).then(() => {
      a.click();
      var tick = setInterval(function () {
        if (clicked) {
          _.info('already clicked');
          clearInterval(tick);
          return;
        }
        _.info('try again');
        a.click();
      }, 50);
    });
  }
  function post (path, params) {
    params = params || {};
    var form = document.createElement('form');
    form.method = 'post';
    form.action = path;
    _.C(params).each(function (value, key) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
    });
    prepare(form);
    form.submit();
  }
  $.openLink = function (to, options) {
    if (!_.isString(to) && !to) {
      _.warn('false URL');
      return;
    }
    options = options || {};
    var withReferer = typeof options.referer === 'undefined' ? true : options.referer;
    var postData = options.post;
    var from = window.location.toString();
    _.info(_.T('{0} -> {1}')(from, to));
    if (postData) {
      post(to, postData);
      return;
    }
    if (withReferer) {
      get(to);
      return;
    }
    window.top.location.replace(to);
  };
  return $;
}));
(function (context, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = function (context) {
      var core = require('./core.js');
      var ajax = require('./ajax.js');
      var $ = ajax(context);
      return factory(context, core, $);
    };
  } else {
    factory(context, context._, context.$);
  }
}(this, function (context, _, $) {
  'use strict';
  var window = context.window;
  var unsafeWindow = context.unsafeWindow || (0, eval)('this').window;
  var document = window.document;
  $.removeAllTimer = function () {
    var handle = window.setInterval(_.nop, 10);
    while (handle > 0) {
      window.clearInterval(handle--);
    }
    handle = window.setTimeout(_.nop, 10);
    while (handle > 0) {
      window.clearTimeout(handle--);
    }
  };
  $.nuke = function (url) {
    try {
      $.window.document.write('nuked by AdsBypasser, leading to ...<br/>');
    } catch (e) {
      _.warn('nuke failed', e);
    }
    var a = document.createElement('a');
    a.href = url;
    a.textContent = url;
    document.body.appendChild(a);
  };
  $.generateRandomIP = function () {
    return [0,0,0,0].map(function () {
      return Math.floor(Math.random() * 256);
    }).join('.');
  };
  $.captcha = function (imgSrc, cb) {
    if (!$.config.externalServerSupport) {
      return;
    }
    var a = document.createElement('canvas');
    var b = a.getContext('2d');
    var c = new Image();
    c.src = imgSrc;
    c.onload = function () {
      a.width = c.width;
      a.height = c.height;
      b.drawImage(c, 0, 0);
      var d = a.toDataURL();
      var e = d.substr(d.indexOf(',') + 1);
      $.post('http://www.wcpan.info/cgi-bin/captcha.cgi', {
        i: e,
      }, cb);
    };
  };
  function clone (safe) {
    if (safe === null || !(safe instanceof Object)) {
      return safe;
    }
    if (safe === unsafeWindow) {
      return safe;
    }
    if (safe instanceof String) {
      return safe.toString();
    }
    if (safe instanceof Function) {
      return exportFunction(safe, unsafeWindow, {
        allowCrossOriginArguments: true,
      });
    }
    if (safe instanceof Array) {
      var unsafe = new unsafeWindow.Array();
      for (var i = 0; i < safe.length; ++i) {
        unsafe.push(clone(safe[i]));
      }
      return unsafe;
    }
    var unsafe = new unsafeWindow.Object();
    _.C(safe).each(function (v, k) {
      unsafe[k] = clone(v);
    });
    return unsafe;
  }
  var MAGIC_KEY = '__adsbypasser_reverse_proxy__';
  $.window = (function () {
    var isFirefox = typeof InstallTrigger !== 'undefined';
    if (!isFirefox) {
      return unsafeWindow;
    }
    var decorator = {
      set: function (target, key, value) {
        if (key === MAGIC_KEY) {
          return false;
        }
        if (target === unsafeWindow && key === 'open') {
          var d = Object.getOwnPropertyDescriptor(target, key);
          d.value = clone(function () {
            var rv = value();
            return cloneInto(rv, unsafeWindow);
          });
          Object.defineProperty(target, key, d);
        } else {
          target[key] = clone(value);
        }
        return true;
      },
      get: function (target, key) {
        if (key === MAGIC_KEY) {
          return target;
        }
        var value = target[key];
        var type = typeof value;
        if (value === null || (type !== 'function' && type !== 'object')) {
          return value;
        }
        return new Proxy(value, decorator);
      },
      apply: function (target, self, args) {
        args = Array.prototype.slice.call(args);
        if (target === unsafeWindow.Object.defineProperty) {
          args[0] = args[0][MAGIC_KEY];
        }
        if (target === unsafeWindow.Function.apply) {
          self = self[MAGIC_KEY];
          args[1] = Array.prototype.slice.call(args[1]);
        }
        if (target === unsafeWindow.document.querySelector) {
          self = self[MAGIC_KEY];
        }
        if (target === unsafeWindow.document.write) {
          self = self[MAGIC_KEY];
        }
        var usargs = clone(args);
        return target.apply(self, usargs);
      },
      construct: function (target, args) {
        args = Array.prototype.slice.call(args);
        args.unshift(undefined);
        var usargs = clone(args);
        var bind = unsafeWindow.Function.prototype.bind;
        return new (bind.apply(target, usargs));
      },
    };
    return new Proxy(unsafeWindow, decorator);
  })();
  return $;
}));
(function (context, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = function (context, GM) {
      var _ = require('lodash');
      var core = require('./core.js');
      var misc = require('./misc.js');
      var dispatcher = require('./dispatcher.js');
      var modules = [misc, dispatcher].map(function (v) {
        return v.call(null, context, GM);
      });
      var $ = _.assign.apply(null, modules);
      return factory(context, GM, core, $);
    };
  } else {
    factory(context, {
      getValue: GM_getValue,
      setValue: GM_setValue,
    }, context._, context.$);
  }
}(this, function (context, GM, _, $) {
  'use strict';
  var MANIFEST = [
    {
      name: 'version',
      key: 'version',
      default_: 0,
      verify: function (v) {
        return typeof v === 'number' && v >= 0;
      },
      normalize: toNumber,
    },
    {
      name: 'alignCenter',
      key: 'align_center',
      default_: true,
      verify: isBoolean,
      normalize: toBoolean,
    },
    {
      name: 'changeBackground',
      key: 'change_background',
      default_: true,
      verify: isBoolean,
      normalize: toBoolean,
    },
    {
      name: 'externalServerSupport',
      key: 'external_server_support',
      default_: false,
      verify: isBoolean,
      normalize: toBoolean,
    },
    {
      name: 'redirectImage',
      key: 'redirect_image',
      default_: true,
      verify: isBoolean,
      normalize: toBoolean,
    },
    {
      name: 'scaleImage',
      key: 'scale_image',
      default_: true,
      verify: isBoolean,
      normalize: toBoolean,
    },
    {
      name: 'logLevel',
      key: 'log_level',
      default_: 1,
      verify: function (v) {
        return typeof v === 'number' && v >= 0 && v <= 2;
      },
      normalize: toNumber,
    },
  ];
  var PATCHES = [
    function (c) {
      var ac = typeof c.alignCenter === 'boolean';
      if (typeof c.changeBackground !== 'boolean') {
        c.changeBackground = ac ? c.alignCenter : true;
      }
      if (typeof c.scaleImage !== 'boolean') {
        c.scaleImage = ac ? c.alignCenter : true;
      }
      if (!ac) {
        c.alignCenter = true;
      }
      if (typeof c.redirectImage !== 'boolean') {
        c.redirectImage = true;
      }
    },
    function (c) {
      if (typeof c.externalServerSupport !== 'boolean') {
        c.externalServerSupport = false;
      }
    },
    function (c) {
      if (typeof c.logLevel !== 'number') {
        c.logLevel = 1;
      }
    },
  ];
  var window = context.window;
  function isBoolean (v) {
    return typeof v === 'boolean';
  }
  function toBoolean (v) {
    return !!v;
  }
  function toNumber (v) {
    return parseInt(v, 10);
  }
  function createConfig () {
    var c = {};
    _.C(MANIFEST).each(function (m) {
      Object.defineProperty(c, m.name, {
        configurable: true,
        enumerable: true,
        get: function () {
          return GM.getValue(m.key, m.default_);
        },
        set: function (v) {
          GM.setValue(m.key, v);
          var nv = GM.getValue(m.key, m.default_);
          if (nv !== v) {
            var s = _.T('failed to write config, key: {0}, value: {1}, new: {2}');
            throw new _.AdsBypasserError(s(s.key, nv, v));
          }
        },
      });
    });
    return c;
  }
  function senityCheck (c) {
    var ok = _.C(MANIFEST).all(function (m) {
      return m.verify(c[m.name]);
    });
    if (!ok) {
      c.version = 0;
    }
    return c;
  }
  function migrate (c) {
    if (typeof c.version !== 'number' || c.version < 0) {
      throw new _.AdsBypasserError('wrong config version: ' + c.version);
    }
    while (c.version < PATCHES.length) {
      PATCHES[c.version](c);
      ++c.version;
    }
    return c;
  }
  $.config = migrate(senityCheck(createConfig()));
  $.register({
    rule: {
      host: /^adsbypasser\.github\.io$/,
      path: /^\/configure\.html$/,
    },
    ready: function () {
      $.window.commit = function (data) {
        data.version = $.config.version;
        _.C(data).each(function (v, k) {
          $.config[k] = v;
        });
      };
      $.window.render({
        version: $.config.version,
        options: {
          alignCenter: {
            type: 'checkbox',
            value: $.config.alignCenter,
            label: 'Align Center',
            help: 'Align image to the center if possible. (default: enabled)',
          },
          changeBackground: {
            type: 'checkbox',
            value: $.config.changeBackground,
            label: 'Change Background',
            help: 'Use Firefox-like image background if possible. (default: enabled)',
          },
          redirectImage: {
            type: 'checkbox',
            value: $.config.redirectImage,
            label: 'Redirect Image',
            help: [
              'Directly open image link if possible. (default: enabled)',
              'If disabled, redirection will only works on link shortener sites.',
            ].join('<br/>\n'),
          },
          scaleImage: {
            type: 'checkbox',
            value: $.config.scaleImage,
            label: 'Scale Image',
            help: 'When image loaded, scale it to fit window if possible. (default: enabled)',
          },
          externalServerSupport: {
            type: 'checkbox',
            value: $.config.externalServerSupport,
            label: 'External Server Support',
            help: [
              'Send URL information to external server to enhance features (e.g.: captcha resolving). (default: disabled)',
              'Affected sites:',
              'setlinks.us (captcha)',
            ].join('<br/>\n'),
          },
          logLevel: {
            type: 'select',
            value: $.config.logLevel,
            menu: [
              [0, '0 (quiet)'],
              [1, '1 (default)'],
              [2, '2 (verbose)'],
            ],
            label: 'Log Level',
            help: [
              'Log level in developer console. (default: 1)',
              '0 will not print anything in console.',
              '1 will only print logs on affected sites.',
              '2 will print on any sites.',
            ].join('<br/>\n'),
          },
        },
      });
    },
  });
  return $;
}));
$.register({
  rule: {
    host: /^01\.nl$/,
  },
  ready: function () {
    'use strict';
    var f = $('iframe#redirectframe');
    $.openLink(f.src);
  },
});
$.register({
  rule: {
    host: /^10co\.(biz|xyz|co|me)$/,
  },
  ready: function () {
    'use strict';
    var d = $('.go');
    $.openLink(d.dataset.href);
  },
});
$.register({
  rule: {
    host: /^(www\.)?1be\.biz$/,
    path: /^\/s\.php$/,
    query: /^\?(.+)/,
  },
  start: function (m) {
    'use strict';
    $.openLink(m.query[1]);
  },
});
$.register({
  rule: {
    host: /^(www\.)?1tiny\.net$/,
    path: /\/\w+/
  },
  ready: function () {
    'use strict';
    var directUrl = $.searchScripts(/window\.location='([^']+)';/);
    if (!directUrl) {
      throw new _.AdsBypasserError('script content changed');
    }
    $.openLink(directUrl[1]);
  },
});
$.register({
  rule: {
    host: /^2ty\.cc$/,
    path: /^\/.+/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var a = $('#close');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^(www\.)?3ra\.be$/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var f = $.window.fc;
    if (!f) {
      throw new _.AdsBypasserError('window.fc is undefined');
    }
    f = f.toString();
    f = f.match(/href="([^"]*)/);
    if (!f) {
      throw new _.AdsBypasserError('url pattern outdated');
    }
    $.openLink(f[1]);
  },
});
$.register({
  rule: {
    host: /^(www\.)?4fun\.tw$/,
  },
  ready: function () {
    'use strict';
    var i = $('#original_url');
    $.openLink(i.value);
  },
});
$.register({
  rule: {
    host: /^ad2links\.com$/,
    path: /^\/\w-.+$/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    $.openLinkByPost(window.location.toString(), {
      post: {
        image: 'Skip Ad.',
      },
    });
  },
});
$.register({
  rule: {
    host: /^ad4\.fr$/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var s = $.searchScripts(/"src", "([^"]+)"/);
    if (!s) {
      _.warn('changed');
      return;
    }
    $.openLink(s[1]);
  },
});
(function () {
  'use strict';
  $.register({
    rule: {
      host: /^ad7\.biz$/,
      path: /^\/\d+\/(.*)$/,
    },
    start: function (m) {
      $.removeNodes('iframe');
      var redirectLink = m.path[1];
      if (!redirectLink.match(/^https?:\/\//)) {
        redirectLink = "http://" + redirectLink;
      }
      $.openLink(redirectLink);
    },
  });
  $.register({
    rule: {
      host: /^ad7\.biz$/,
      path: /^\/\w+$/,
    },
    ready: function () {
      $.removeNodes('iframe');
      var script = $.searchScripts('var r_url');
      var url = script.match(/&url=([^&]+)/);
      url = url[1];
      $.openLink(url);
    },
  });
})();
(function () {
  'use strict';
  $.register({
    rule: {
      host: [
        /^(www\.)?adb\.ug$/,
        /^(www\.)?lynk\.my$/,
        /^adyou\.me$/,
      ],
      path: /^(?!\/(?:privacy|terms|contact(\/.*)?|#.*)?$).*$/
    },
    ready: function () {
      'use strict';
      $.removeNodes('iframe');
      var m = $.searchScripts(/top\.location\.href="([^"]+)"/);
      if (m) {
        $.openLink(m[1]);
        return;
      }
      getArguments().then(function (args) {
        tryLink(args);
      });
    },
  });
  function getArguments () {
    var PATTERN = /\{\s*_args[^}]+\}[^}]+\}/;
    return _.D(function (resolve, reject) {
      var m = $.searchScripts(PATTERN);
      if (m) {
        resolve(m);
        return;
      }
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          mutation.addedNodes.forEach(function (node) {
            if (node.localName === 'script') {
              var m = node.textContent.match(PATTERN);
              if (m) {
                resolve(m);
                observer.disconnect();
              }
            }
          });
        });
      });
      observer.observe(document.body, {
        childList: true,
      });
    }).then(function (m) {
      return eval('(' + m[0] + ')');
    });
  }
  function tryLink (args) {
    var url = window.location.pathname + '/skip_timer';
    var i = setInterval(function () {
      $.post(url, args).then(function (text) {
        var jj = _.parseJSON(text);
        if (!jj.errors && jj.messages) {
          clearInterval(i);
          $.openLink(jj.messages.url);
        }
      });
    }, 1000);
  }
})();
(function () {
  'use strict';
  function getTokenFromRocketScript () {
    var a = $.searchScripts(/var eu = '(?!false)(.*)'/);
    return a ? a[1] : null;
  }
  $.register({
    rule: {
      host: /^adf\.ly$/,
      path: /^\/redirecting\/(.+)$/,
    },
    start: function (m) {
      var url = atob(m.path[1]);
      $.openLink(url);
    },
  });
  $.register({
    rule: {
      path: /\/locked$/,
      query: /url=([^&]+)/,
    },
    start: function (m) {
      $.resetCookies();
      var url = decodeURIComponent(m.query[1]);
      if (url.match(/^http/)) {
        $.openLink(url);
      } else {
        $.openLink('/' + url);
      }
    },
  });
  $.register({
    rule: function () {
      var h = $.$('html[id="main_html"]');
      if (h) {
        return true;
      } else {
        return null;
      }
    },
    start: function () {
      $.window.document.write = _.nop;
      $.window.btoa = _.nop;
      waitToken().then(function (token) {
        var url = decodeToken(token);
        $.openLink(url);
      }).catch(function (e) {
        _.warn(e);
      });
    },
    ready: function () {
      var h = $.$('#main_html'), b = $.$('#home');
      if (!h || !b || h.nodeName !== 'HTML' || b.nodeName !== 'BODY') {
        return;
      }
      $.removeNodes('iframe');
      $.window.cookieCheck = _.nop;
      h = getTokenFromRocketScript();
      if (!h) {
        h = $('#adfly_bar');
        $.window.close_bar();
        return;
      }
      h = decodeToken(h);
      $.openLink(h);
    },
  });
  function waitToken () {
    return _.D(function (resolve) {
      var o = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          _.C(mutation.addedNodes).each(function (node) {
            if (node.localName === 'script') {
              var m = node.textContent.match(/var ysmm = '([^']+)'/);
              if (m) {
                o.disconnect();
                resolve(m[1]);
              }
            }
          });
        });
      });
      o.observe(document.head, {
        childList: true,
      });
    });
  }
  function decodeToken (token) {
    var a = token.indexOf('!HiTommy');
    if (a >= 0) {
      token = token.substring(0, a);
    }
    a = '';
    var b = '';
    for (var i = 0; i < token.length; ++i) {
      if (i % 2 === 0) {
        a = a + token.charAt(i);
      } else {
        b = token.charAt(i) + b;
      }
    }
    token = atob(a + b);
    token = token.substr(2);
    if (location.hash) {
      token += location.hash;
    }
    return token;
  }
})();
$.register({
  rule: {
    host: /^(www\.)?adfe\.es$/,
    path: /^\/\w+$/,
  },
  ready: function () {
    'use strict';
    var f = $('#frmvideo');
    if (!f.STEP4) {
      return;
    }
    f.submit();
  },
});
$.register({
  rule: 'http://adfoc.us/*',
  ready: function () {
    'use strict';
    var root = document.body;
    var observer = new MutationObserver(function (mutations) {
      var o = $.$('#showSkip');
      if (o) {
        observer.disconnect();
        o = o.querySelector('a');
        $.openLink(o.href);
      }
    });
    observer.observe(root, {
      childList: true,
      subtree: true,
    });
  },
});
$.register({
  rule: {
    host: /^(www\.)?adjet\.biz$/,
  },
  ready: function () {
    'use strict';
    var m = $.searchScripts(/href=(\S+)/);
    if (!m) {
      throw new _.AdsBypasserError('site changed');
    }
    $.openLink(m[1]);
  },
});
(function () {
  'use strict';
  $.register({
    rule: {
      host: [
        /^adlink\.guru$/,
        /^cypt\.ga$/,
        /^(filesbucks|tmearn|cut-urls)\.com$/,
        /^elink\.link$/,
        /^(payurl|urlst)\.me$/,
        /^url\.ht$/,
        /^urle\.co$/,
        /^(hashe|trlink|adshort)\.in$/,
        /^www\.worldhack\.net$/,
        /^123link\.top$/,
        /^pir\.im$/,
        /^bol\.tl$/,
        /^(tl|adfly)\.tc$/,
        /^(adfu|linkhits)\.us$/,
        /^short\.pastewma\.com$/,
        /^linkfly\.gaosmedia\.com$/,
      ],
    },
    ready: function () {
      $.removeNodes('iframe', '.BJPPopAdsOverlay');
      firstStage().then(function (page) {
        return secondStage(page);
      }).then(function (url) {
        $.nuke(url);
        $.openLink(url);
      }).catch(function (e) {
        _.warn(e);
      });
    },
  });
  function firstStage () {
    return _.D(function (resolve, reject) {
      var f = $.$('#link-view');
      if (!f) {
        resolve(document);
        return;
      }
      var args = extractArgument(f);
      var url = f.getAttribute('action');
      var p = $.post(url, args).then(function (data) {
        return $.toDOM(data);
      });
      resolve(p);
    });
  }
  function secondStage (page) {
    var f = $('#go-link', page);
    var args = extractArgument(f);
    var url = f.getAttribute('action');
    return $.post(url, args).then(function (data) {
      data = JSON.parse(data);
      if (data && data.url) {
        return data.url;
      }
      throw new _.AdsBypasserError('wrong data');
    });
  }
  function extractArgument (form) {
    var args = {};
    $.$$('input', form).each(function (v) {
      args[v.name] = v.value;
    });
    return args;
  }
})();
$.register({
  rule: {
    host: /^adlock\.org$/,
  },
  ready: function () {
    'use strict';
    var a = $.$('#xre a.xxr, #downloadButton1');
    if (a) {
      $.openLink(a.href);
      return;
    }
    a = $.window.fileLocation;
    if (a) {
      $.openLink(a);
    }
  },
});
$.register({
  rule: {
    host: /^(www\.)?adlot\.us$/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var script = $.searchScripts('form');
    var p = /name='([^']+)' value='([^']+)'/g;
    var opt = {
      image: ' ',
    };
    var tmp = null;
    while (tmp = p.exec(script)) {
      opt[tmp[1]] = tmp[2];
    }
    $.openLink('', {
      path: opt,
    });
  },
});
$.register({
  rule: {
    host: /^admy\.link$/,
  },
  ready: function () {
    'use strict';
    var f = $('form.edit_link');
    f.submit();
  },
});
$.register({
  rule: {
    host: /^(www\.)?ah-informatique\.com$/,
    path: /^\/ZipUrl/,
  },
  ready: function () {
    'use strict';
    var a = $('#zip3 a');
    $.openLink(a.href);
  },
});
(function () {
  'use strict';
  function decodeScript (encoded) {
    var a = encoded.match(/^\s*;eval\((.+)\);\s*$/);
    a = a[1];
    var b = a.match(/^(.+)\('([^']+)','([^']+)','([^']+)','([^']+)'\)$/);
    var c = eval('(' + b[1] + ')');
    return c(b[2], b[3], b[4], b[5]);
  }
  $.register({
    rule: {
      host: /^ah\.pe$/,
    },
    ready: function () {
      var script = $.searchScripts('eval');
      script = decodeScript(script);
      script = decodeScript(script);
      script = decodeScript(script);
      var path = script.match(/([^;= ]+)=([^+ ;]+)\+"\."\+([^+ ]+)\+"\."\+([^; ]+);/);
      if (!path) {
        throw new _.AdsBypasserError('script changed');
      }
      if (typeof $.window[path[2]] === 'undefined') {
        _.info('recaptcha');
        return;
      }
      path = _.T('{0}.{1}.{2}')($.window[path[2]], $.window[path[3]], $.window[path[4]]);
      $.openLink(path);
    },
  });
})();
$.register({
  rule: {
    host: /^aka\.gr$/
  },
  ready: function () {
    'use strict';
    var l = $('iframe#yourls-frame');
    $.openLink(l.src);
  },
});
$.register({
  rule: {
    host: [
      /^al\.ly$/,
      /^ally\.sh$/,
    ],
  },
  ready: function () {
    'use strict';
    var i = $.$('body > section > iframe');
    if (i) {
      i.src = 'about:blank';
      _.wait(3000).then(function () {
        var a = $('a.redirect');
        a.click();
      });
      return;
    }
    i = $.searchScripts(/"href","([^"]+)"\)\.remove/);
    if (!i) {
      _.warn('site changed');
      return;
    }
    i = i[1];
    $.openLink(i);
  },
});
$.register({
  rule: {
    host: [
      /^(www\.)?allkeyshop\.com$/,
      /^cshort\.org$/,
    ],
  },
  ready: function (m) {
    'use strict';
    var matches = $.searchScripts(/window\.location\.href = "([^"]+)"/);
    matches = matches[1];
    $.nuke(matches);
    $.openLink(matches);
  },
});
$.register({
  rule: {
    host: /^anonymbucks\.com$/,
  },
  ready: function () {
    'use strict';
    var a = $('#boton-continuar');
    a.click();
  },
});
(function () {
  'use strict';
  var ajaxPattern = /\$.post\('([^']*)'[^{]+(\{\s*opt:\s*'make_log'[^}]+\}\s*\}),/i;
  $.register({
    rule: {
      host: [
        /^bc\.vc$/,
        /^linc\.ml$/,
      ],
      path: /^.+(https?:\/\/.+)$/,
    },
    start: function (m) {
      $.openLink(m.path[1] + document.location.search + document.location.hash);
    },
  });
  function decompress (script, unzip) {
    if (!unzip) {
      return script;
    }
    var matches = script.match(/eval(.*)/);
    if (!matches) {
      throw new _.AdsBypasserError('no script matches /eval(.*)/');
    }
    matches = matches[1];
    script = eval(matches);
    return script;
  }
  function searchScript (unzip) {
    var content = $.searchScripts('make_log');
    if (content) {
      return {
        direct: false,
        script: decompress(content, unzip),
      };
    }
    content = $.searchScripts('click_log');
    if (content) {
      return {
        direct: true,
        script: decompress(content, unzip),
      };
    }
    throw new _.AdsBypasserError('script changed');
  }
  function knockServer (script, dirtyFix) {
    var matches = script.match(ajaxPattern);
    if (!matches) {
      throw new _.AdsBypasserError('(in knock server) no script matches $.post');
    }
    var make_url = matches[1];
    var make_opts = eval('(' + matches[2] + ')');
    var i = setInterval(function () {
      $.post(make_url, make_opts).then(function (text) {
        if (dirtyFix) {
          text = text.match(/\{.+\}/)[0];
        }
        var jj = _.parseJSON(text);
        if (jj.message) {
          clearInterval(i);
          $.openLink(jj.message.url);
        }
      });
    }, 1000);
  }
  $.register({
    rule: {
      host: /^bc\.vc$/,
      path: /^\/.+/,
    },
    ready: function () {
      $.removeNodes('iframe');
      var token = findAJAXToken();
      var time = fakeAJAXToken();
      var url = _.T('/fly/ajax.php?wds={0}&time={1}');
      url = url(token.wds, time);
      _.wait(5000).then(function () {
        return $.post(url, {
          xdf: {
            afg: $.window.tZ,
            bfg: $.window.cW,
            cfg: $.window.cH,
            jki: token.jki,
            dfg: $.window.sW,
            efg: $.window.sH,
          },
          ojk: token.ojk,
        });
      }).then(function (rv) {
        rv = JSON.parse(rv);
        if (rv.error) {
          throw new _.AdsBypasserError('auth error');
        }
        $.openLink(rv.message.url);
      }).catch(function (e) {
        _.warn('ajax error', e);
      });
    },
  });
  function run (dirtyFix) {
    $.removeNodes('iframe');
    var result = searchScript(true);
    if (!result.direct) {
      knockServer(result.script,dirtyFix);
    } else {
      result = result.script.match(/top\.location\.href='([^']+)'/);
      if (!result) {
        throw new _.AdsBypasserError('script changed');
      }
      result = result[1];
      $.openLink(result);
    }
  }
  $.register({
    rule: {
      host: /^adcrun\.ch$/,
      path: /^\/\w+$/,
    },
    ready: function () {
      $.removeNodes('.user_content');
      var rSurveyLink = /http\.open\("GET", "api_ajax\.php\?sid=\d*&ip=[^&]*&longurl=([^"]+)" \+ first_time, (?:true|false)\);/;
      var l = $.searchScripts(rSurveyLink);
      if (l) {
        $.openLink(l[1]);
        return;
      }
      run(true);
    },
  });
  $.register({
    rule: {
      host: [
        /^(1tk|hit|adbla|tl7|mylink)\.us$/,
        /^gx\.si$/,
        /^adwat\.ch$/,
        /^(fly2url|urlwiz|xafox)\.com$/,
        /^(zpoz|ultry)\.net$/,
        /^(wwy|myam)\.me$/,
        /^(ssl|srk)\.gs$/,
        /^shortit\.in$/,
        /^www\.adjet\.eu$/,
        /^cun\.bz$/,
        /^miniurl\.tk$/,
        /^vizzy\.es$/,
        /^kazan\.vc$/,
        /^linkcash\.ml$/,
      ],
      path: /^\/.+/,
    },
    ready: run,
  });
  $.register({
    rule: {
      host: [
        /^adtr\.im$/,
        /^ysear\.ch$/,
        /^xip\.ir$/,
      ],
      path: /^\/.+/,
    },
    ready: function () {
      var a = $.$('div.fly_head a.close');
      var f = $.$('iframe.fly_frame');
      if (a && f) {
        $.openLink(f.src);
      } else {
        run();
      }
    },
  });
  $.register({
    rule: {
      host: /^ad5\.eu$/,
      path: /^\/[^.]+$/,
    },
    ready: function() {
      $.removeNodes('iframe');
      var s = searchScript(true);
      var m = s.script.match(/(<form name="form1"method="post".*(?!<\\form>)<\/form>)/);
      if (!m) {return;}
      m = m[1];
      var tz = -(new Date().getTimezoneOffset()/60);
      m = m.replace("'+timezone+'",tz);
      var d = document.createElement('div');
      d.setAttribute('id','AdsBypasserFTW');
      d.setAttribute('style', 'display:none;');
      d.innerHTML = m;
      document.body.appendChild(d);
      $('#AdsBypasserFTW > form[name=form1]').submit();
    },
  });
  $.register({
    rule: {
      host: /^tr5\.in$/,
      path: /^\/.+/,
    },
    ready: function () {
      run(true);
    },
  });
  function findAJAXToken () {
    var rv = $.searchScripts('/fly/ajax.php');
    if (!rv) {
      throw new _.AdsBypasserError('script changed');
    }
    var wds = rv.match(/\?wds=([^&]+)/);
    if (!wds) {
      throw new _.AdsBypasserError('script changed');
    }
    wds = wds[1];
    var jki = rv.match(/jki:\s*'([^']+)'/);
    if (!jki) {
      throw new _.AdsBypasserError('script changed');
    }
    jki = jki[1];
    var ojk = rv.match(/ojk:\s*'([^']+)'/);
    if (!ojk) {
      throw new _.AdsBypasserError('script changed');
    }
    ojk = ojk[1];
    return {
      wds: wds,
      jki: jki,
      ojk: ojk,
    };
  }
  function fakeAJAXToken () {
    var skipAd = $('div.fly_head span#redirectin').parentElement;
    var margin = 6;
    var fakePageX = skipAd.offsetLeft + margin + 50 + (Math.random() * 10);
    var fakePageY = skipAd.offsetTop + margin + 15 + (Math.random() * 1);
    var po = fakePageX + ',' + fakePageY;
    var posX = jQueryOffset(skipAd).left + margin;
    var posY = jQueryOffset(skipAd).top + margin;
    var pos = (fakePageX - posX) + ',' + (fakePageY - posY);
    var tsta_ = Math.floor((5 + Math.random()) * 1000);
    var time = po + ':' + pos + ':' + tsta_;
    return time;
  }
  function jQueryOffset (element) {
    var r = element.getBoundingClientRect();
    return {
      top: r.top + document.body.scrollTop,
      left: r.left + document.body.scrollLeft,
    };
  }
})();
$.register({
  rule: {
    host: /^(www\.)?biglistofwebsites\.com$/,
    path: /^\/go\/(\w+\.\w+)$/
  },
  start: function (m) {
    'use strict';
    $.openLink('http://' + m.path[1]);
  },
});
$.register({
  rule: 'http://www.bild.me/bild.php?file=*',
  ready: function () {
    'use strict';
    var i = $('#Bild');
    $.openLink(i.src);
  },
});
$.register({
  rule: 'http://bildr.no/view/*',
  ready: function () {
    'use strict';
    var i = $('img.bilde');
    $.openLink(i.src);
  },
});
$.register({
  rule: {
    host: /^(www\.)?([a-zA-Z0-9]+\.)?binbox\.io$/,
    path: /\/o\/([a-zA-Z0-9]+)/,
  },
  start: function (m) {
    'use strict';
    var direct_link = window.atob(m.path[1]);
    $.openLink(direct_link);
  },
});
$.register({
  rule: {
    host: /^(www\.)?boxcash\.net$/,
    path: /^\/[\w~]+$/,
  },
  ready: function () {
    'use strict';
    var m = $.searchScripts(/\'\/ajax_link\.php\',\s*\{key:\s*'(\w+)',\s*url:\s*'(\d+)',\s*t:\s*'(\d+)',\s*r:\s*'(\w*)'\}/);
    if (!m) {
      return;
    }
    $.post('/ajax_link.php', {
      key: m[1],
      url: m[2],
      t: m[3],
      r: m[4],
    }).then(function (response) {
      var l = response.match(/window(?:.top.window)\.location="([^"]+)"/);
      $.openLink(l[1]);
    });
  },
});
$.register({
  rule: {
    host: /^(www\.)?boxcash\.net$/,
    path: /^\/redirect\.html$/,
    query: /url=(.+)$/,
  },
  start: function (m) {
    'use strict';
    var l = decodeURIComponent(m.query[1]);
    $.openLink(l);
  },
});
$.register({
  rule: {
    host: /^(www\.)?(buz|vzt)url\.com$/,
  },
  ready: function () {
    'use strict';
    var frame = $('frame[scrolling=yes]');
    $.openLink(frame.src);
  },
});
$.register({
  rule: {
    host: /^(cf|ex|xt)\d\.(me|co)$/,
  },
  ready: function (m) {
    'use strict';
    $.removeNodes('iframe');
    var a = $('#skip_button');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^catcut\.net$/,
  },
  ready: function () {
    'use strict';
    var a = $('#rbs');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^cf\.ly$/,
    path: /^\/[^\/]+$/,
  },
  start: function (m) {
    'use strict';
    $.removeNodes('iframe');
    $.openLink('/skip' + m.path[0]);
  },
});
$.register({
  rule: {
    host: /^(www\.)?cli\.gs$/,
  },
  ready: function () {
    'use strict';
    var a = $('a.RedirectLink');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^(www\.)?clictune\.com$/,
    path: /^\/id=\d+/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var matches = $.searchScripts(/<a href="http:\/\/(?:www.)?clictune\.com\/redirect\.php\?url=([^&]+)&/);
    var url = decodeURIComponent(matches[1]);
    $.openLink(url);
  },
});
$.register({
  rule: {
    host: /^clk\.im$/,
  },
  ready: function (m) {
    'use strict';
    $.removeNodes('iframe');
    var matches = $.searchScripts(/\$\("\.countdown"\)\.attr\("href","([^"]+)"\)/);
    $.openLink(matches[1]);
  },
});
$.register({
  rule: {
    host: /^cocoleech\.com$/,
  },
  ready: function () {
    'use strict';
    var a = $('#download');
    $.openLink(a.href);
  },
});
(function () {
  'use strict';
  function hostMapper (host) {
    switch (host) {
    case 'disingkat.in':
      return function () {
        var a = $('a.btn-block.redirect');
        return a.href;
      };
    case 'link.animagz.org':
      return function () {
        var a = $('a.redirect');
        a = a.onclick.toString();
        a = a.match(/window\.open \('([^']+)'\)/);
        return a[1];
      };
    case 'coeg.in':
    case 'www.telondasmu.com':
      return function () {
        var a = $('.download-link a');
        return a.href;
      };
    case 'gunting.in':
      return function () {
        var a = $('div.col-sm-6:nth-child(1) > center:nth-child(1) > a:nth-child(1)');
        return a.href;
      };
    default:
      return null;
    }
  }
  $.register({
    rule: {
      host: [
        /^link\.animagz\.org$/,
        /^(coeg|disingkat|gunting)\.in$/,
        /^www\.telondasmu\.com$/,
      ],
      path: /^\/\w+$/,
    },
    ready: function (m) {
      var mapper = hostMapper(m.host[0]);
      var b64 = mapper().match(/\?r=(\w+={0,2}?)/);
      $.openLink(atob(b64[1]));
    },
  });
  $.register({
    rule: {
      host: /^sipkur\.(net|us)$/,
      path: [
        /^\/\w+$/,
        /^\/menujulink\//,
      ],
    },
    ready: function () {
      var d = $('#testapk > div');
      d = d.onclick.toString();
      d = d.match(/window\.open\('([^']+)'/);
      $.openLink(d[1]);
    },
  });
})();
$.register({
  rule: {
    host: /^coinlink\.co$/,
    path: /^\/i\//,
  },
  ready: function (m) {
    'use strict';
    var a = $('a#btn-main, a.btn.btn-block.btn-warning, a.btn.btn-block.btn-success');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^(?:(\w+)\.)?(coinurl\.com|cur\.lv)$/,
    path: /^\/([-\w]+)$/
  },
  ready: function (m) {
    'use strict';
    $.removeNodes('iframe');
    var host = 'http://cur.lv/redirect_curlv.php';
    var param = m.host[1] === undefined ? {
      code: m.path[1],
    } : {
      zone: m.host[1],
      name: m.path[1],
    };
    $.get(host, param).then(function(mainFrameContent) {
      try {
        var docMainFrame = $.toDOM(mainFrameContent);
      } catch (e) {
        throw new _.AdsBypasserError('main frame changed');
      }
      var rExtractLink = /onclick="open_url\('([^']+)',\s*'go'\)/;
      var innerFrames = $.$$('iframe', docMainFrame).each(function (currFrame) {
        var currFrameAddr = currFrame.getAttribute('src');
        $.get(currFrameAddr).then(function(currFrameContent) {
          var aRealLink = rExtractLink.exec(currFrameContent);
          if (aRealLink === undefined || aRealLink[1] === undefined) {
            return;
          }
          var realLink = aRealLink[1];
          $.openLink(realLink);
        });
      });
    });
  },
});
$.register({
  rule: {
    host: /^comyonet\.com$/,
  },
  ready: function () {
    'use strict';
    var input = $('input[name="enter"]');
    input.click();
  },
});
$.register({
  rule: {
    host: /^(www\.)?cvc\.la$/,
    path: /^\/\w+$/,
  },
  start: function () {
    'use strict';
    $.post(document.location.href, {
      hidden: 24, 
      image: ' ',
    }).then(function (text) {
      var matches = text.match(/window\.location\.replace\('([^']+)'\);/);
      $.openLink(matches[1]);
    });
  },
});
$.register({
  rule: {
    host: /^(www\.)?dapat\.in$/,
  },
  ready: function () {
    'use strict';
    var f = $('iframe[name=pagetext]');
    $.openLink(f.src);
  },
});
$.register({
  rule: {
    host: /^(www\.)?dd\.ma$/,
  },
  ready: function (m) {
    'use strict';
    var i = $.$('#mainframe');
    if (i) {
      $.openLink(i.src);
      return;
    }
    var a = $('#btn_open a');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^(www\.)?dereferer\.website$/,
    query: /^\?(.+)/,
  },
  start: function (m) {
    'use strict';
    $.openLink(m.query[1]);
  },
});
$.register({
  rule: {
    host: /^dikit\.in$/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var a = $('.disclaimer a');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^durl\.me$/,
  },
  ready: function () {
    'use strict';
    var a = $('a[class="proceedBtn"]');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: [
      /^easyurl\.net$/,
      /^(atu|clickthru|redirects|readthis)\.ca$/,
      /^goshrink\.com$/,
    ],
  },
  ready: function () {
    'use strict';
    var f = $('frame[name=main]');
    $.openLink(f.src);
  },
});
$.register({
  rule: {
    host: /^elde\.me$/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe:not([name=undefined])');
    var a = $('#modal-alert');
    a.style.display = 'block';
    a.style.top = 0;
    a.style.left = 0;
  },
});
$.register({
  rule: {
    host: [
    	/^ethi\.in$/,
    	/^st\.wardhanime\.net$/,
    ],
    path: /^\/i\/\d+$/,
  },
  ready: function () {
    'use strict';
    var a = $('#wrapper > [class^="tombo"] > a[target="_blank"]');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^(www\.)?filoops\.info$/,
  },
  ready: function () {
    'use strict';
    var a = $('#text > center a, #text > div[align=center] a');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^fit\.sh$/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('.container-body');
    var m = $.searchScripts(/token="([^"]+)"/);
    if (!m) {
      throw new _.AdsBypasserError('site changed');
    }
    m = m[1];
    var interLink = '/go/' + m + '?fa=15466&a=' + window.location.hash.substr(1);
    setTimeout(function () {
      $.openLink(interLink);
    }, 6000);
  },
});
$.register({
  rule: {
    host: /^(www\.)?fiuxy\.co$/,
    path: /^\/links?\/$/,
  },
  ready: function () {
    $.openLink($('a.btn.a').href);
  }
});
(function () {
  'use strict';
  $.register({
    rule: {
      host: /^(www\.)?fundurl\.com$/,
      query: /i=([^&]+)/,
    },
    start: function (m) {
      $.openLink(m.query[1]);
    },
  });
  $.register({
    rule: {
      host: /^(www\.)?fundurl\.com$/,
      path: /^\/(go-\w+|load\.php)$/,
    },
    ready: function () {
      var f = $('iframe[name=fpage3]');
      $.openLink(f.src);
    },
  });
})();
(function () {
  var hosts = /^gca\.sh|repla\.cr$/;
  $.register({
    rule: {
      host: hosts,
      path: /^\/adv\/\w+\/(.*)$/,
      query: /^(.*)$/,
      hash: /^(.*)$/,
    },
    start: function (m) {
      'use strict';
      var l = m.path[1] + m.query[1] + m.hash[1];
      $.openLink(l);
    },
  });
  $.register({
    rule: {
      host: hosts,
    },
    ready: function () {
      'use strict';
      $.removeNodes('iframe');
      var jQuery = $.window.$;
      setTimeout(function () {
        jQuery("#captcha-dialog").dialog("open");
      }, 1000);
    },
  });
})();
$.register({
  rule: {
    host: /^gkurl\.us$/,
  },
  ready: function () {
    'use strict';
    var iframe = $('#gkurl-frame');
    $.openLink(iframe.src);
  },
});
$.register({
  rule: {
    host: /^u\.go2\.me$/,
  },
  ready: function () {
    'use strict';
    var iframe = $('iframe');
    $.openLink(iframe.src);
  },
});
$.register({
  rule: {
    host: /^goto\.loncat\.in$/,
    query: /open=(.+)/,
  },
  start: function (m) {
    'use strict';
    var url = atob(atob(m.query[1]));
    $.openLink(url);
  },
});
$.register({
  rule: {
    host: [
      /^gsurl\.(me|in)$/,
      /^g5u\.pw$/,
    ],
  },
  ready: function () {
    'use strict';
    $.removeNodes('#container');
    var a = $('#link');
    _.wait(5000).then(function () {
      $.openLink(a.href);
    });
  },
});
$.register({
  rule: {
    host: /^hotshorturl\.com$/,
  },
  ready: function () {
    'use strict';
    var frame = $('frame[scrolling=yes]');
    $.openLink(frame.src);
  },
});
$.register({
  rule: {
    host: /^(www\.)?(ilix\.in|priva\.us)$/,
    path: /\/(\w+)/,
  },
  ready: function (m) {
    'use strict';
    var realHost = 'ilix.in';
    if (m.host[2] !== realHost) {
      var realURL = location.href.replace(m.host[2], realHost);
      $.openLink(realURL);
      return;
    }
    var f = $.$('iframe[name=ifram]');
    if (f) {
      $.openLink(f.src);
      return;
    }
    if (!$.$('img#captcha')) {
      $('form[name=frm]').submit();
    }
  },
});
$.register({
  rule: {
    host: /^ilovebanten\.com$/,
  },
  ready: function () {
    'use strict';
    var p = $('.notblocked');
    $.openLink(p.textContent);
  },
});
$.register({
  rule: {
    host: /^indexmovie\.me$/,
    path: /^\/([^\/]+)$/,
  },
  start: function (m) {
    'use strict';
    $.openLink('/get/' + m.path[1]);
  },
});
$.register({
  rule: {
    host: /^itw\.me$/,
    path: /^\/r\//,
  },
  ready: function () {
    'use strict';
    var f = $('.go-form');
    f.submit();
  },
});
$.register({
  rule: {
    host: /^ity\.im$/,
  },
  ready: function () {
    'use strict';
    var f = $.$('#main');
    if (f) {
      $.openLink(f.src);
      return;
    }
    f = $.$$('frame').find(function (frame) {
      if (frame.src.indexOf('interheader.php') < 0) {
        return _.none;
      }
      return frame.src;
    });
    if (f) {
      $.openLink(f.payload);
      return;
    }
    f = $.searchScripts(/krypted=([^&]+)/);
    if (!f) {
      throw new _.AdsBypasserError('site changed');
    }
    f = f[1];
    var data = $.window.des('ksnslmtmk0v4Pdviusajqu', $.window.hexToString(f), 0, 0);
    if (data) {
      $.openLink('http://ity.im/1104_21_50846_' + data);
    }
  },
});
$.register({
  rule: {
    host: /^(www\.)?kingofshrink\.com$/,
  },
  ready: function () {
    'use strict';
    var l = $('#textresult > a');
    $.openLink(l.href);
  },
});
$.register({
  rule: {
    host: /^st\.kurogaze\.net$/,
    query: /r=(.+)/,
  },
  start: function (m) {
    'use strict';
    var r = atob(m.query[1]);
    $.openLink(r);
  },
});
$.register({
  rule: {
    host: /^st\.kurogaze\.net$/,
  },
  ready: function () {
    'use strict';
    var a = $('a.redirect');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^(www\.)?leechbd\.tk$/,
    path: /^\/Shortener\/(\w+)$/,
  },
  start: function (m) {
    'use strict';
    $.get('/Shortener/API/read/get', {id: m.path[1], type: 'json'}).then(function (text) {
      var r = _.parseJSON(text);
      if (r.success == true && r.data.full) {
        $.openLink(r.data.full);
      } else {
        _.warn('API Error ' + r.error.code + ' : ' + r.error.msg);
      }
    });
  },
});
$.register({
  rule: 'http://www.lienscash.com/l/*',
  ready: function () {
    'use strict';
    var a = $('#redir_btn');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^(www\.)?\w+\.link-protector\.com$/,
  },
  ready: function (m) {
    'use strict';
    var f = $('form[style="font-weight:normal;font-size:12;font-family:Verdana;"]');
    $.openLink(f.action);
  },
});
$.register({
  rule: {
    host: /^(www\.)?link\.im$/,
    path: /^\/\w+$/,
  },
  start: function () {
    'use strict';
    $.post(document.location.href, {
      image: 'Continue',
    }).then(function (text) {
      var m = text.match(/window\.location\.replace\('([^']+)'\)/);
      $.openLink(m[1]);
    });
  },
});
$.register({
  rule: {
    host: /^link\.tl$/,
    path: /^\/fly\/site\.php$/,
    query: /^\?to=(.+)$/,
  },
  ready: function () {
    'use strict';
    var a = $('.skip > .btn');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^link\.tl$/,
    path: /[^^](https?:\/\/.+)$/,
  },
  start: function (m) {
    'use strict';
    $.openLink(m.path[1]);
  },
});
$.register({
  rule: {
    host: /^link\.tl$/,
    path: /^\/(.+)$/,
  },
  start: function (m) {
    'use strict';
    $.openLink('/fly/site.php?to=' + m.path[1]);
  },
});
$.register({
  rule: {
    host: /\.link2dollar\.com$/,
    path: /^\/\d+$/,
  },
  ready: function () {
    'use strict';
    var m = $.searchScripts(/var rlink = '([^']+)';/);
    if (!m) {
      throw new _.AdsBypasserError('site changed');
    }
    m = m[1];
    $.openLink(m);
  },
});
$.register({
  rule: {
    host: /^link2you\.ru$/,
    path: /^\/\d+\/(.+)$/,
  },
  start: function (m) {
    'use strict';
    var url = m.path[1];
    if (!url.match(/^https?:\/\//)) {
      url = '//' + url;
    }
    $.openLink(url);
  },
});
$.register({
  rule: {
    host: /^link(4ad|ajc)\.com$/,
    path: /^\/(.+)$/,
  },
  ready: function (m) {
    'use strict';
    var d = $('div[id^=module_]');
    d = d.id.match(/module_(\d+)/);
    d = d[1];
    $.post('form.php?block_id=' + d, {
      cmd: 'get_source',
      act: 'waiting',
      id: m.path[1],
    }).then(function (url) {
      $.openLink(url);
    }).catch(function (e) {
      _.warn(e);
    });
  },
});
(function () {
  'use strict';
  function sendRequest (opts) {
    return $.post('/ajax/r.php', opts).then(function (data) {
      if (data.length <= 1) {
        return sendRequest(opts);
      }
      var a = $.toDOM(data);
      a = $('a', a);
      return a.href;
    });
  }
  $.register({
    rule: {
      host: /^link5s\.com$/,
      path: /^\/([^\/]+)$/,
    },
    ready: function (m) {
      $.window.$ = null;
      var i = $('#iframeID');
      var opts = {
        page: m.path[1],
        advID: i.dataset.cmp,
        u: i.dataset.u,
      };
      $.removeNodes('iframe');
      sendRequest(opts).then(function (url) {
        $.openLink(url);
      });
    },
  });
})();
(function() {
  function ConvertFromHex (str) {
    var result = [];
    while (str.length >= 2) {
      result.push(String.fromCharCode(parseInt(str.substring(0, 2), 16)));
      str = str.substring(2, str.length);
    }
    return result.join("");
  }
  var Encode = function (str) {
    var s = [], j = 0, x, res = '', k = arguments.callee.toString().replace(/\s+/g, "");
    for (var i = 0; i < 256; i++) {
      s[i] = i;
    }
    for (i = 0; i < 256; i++) {
      j = (j + s[i] + k.charCodeAt(i % k.length)) % 256;
      x = s[i];
      s[i] = s[j];
      s[j] = x;
    }
    i = 0;
    j = 0;
    for (var y = 0; y < str.length; y++) {
      i = (i + 1) % 256;
      j = (j + s[i]) % 256;
      x = s[i];
      s[i] = s[j];
      s[j] = x;
      res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
    }
    return res;
  };
  var hostRules = [
    /^(([\w]{8}|www)\.)?(allanalpass|cash4files|drstickyfingers|fapoff|freegaysitepass|(gone|tube)viral|(pic|tna)bucks|whackyvidz|fuestfka)\.com$/,
    /^(([\w]{8}|www)\.)?(a[mn]y|deb|dyo|sexpalace)\.gs$/,
    /^(([\w]{8}|www)\.)?(filesonthe|poontown|seriousdeals|ultrafiles|urlbeat|zatnawqy|zytpirwai|jzrputtbut)\.net$/,
    /^(([\w]{8}|www)\.)?freean\.us$/,
    /^(([\w]{8}|www)\.)?galleries\.bz$/,
    /^(([\w]{8}|www)\.)?hornywood\.tv$/,
    /^(([\w]{8}|www)\.)?link(babes|bucks)\.com$/,
    /^(([\w]{8}|www)\.)?(megaline|miniurls|qqc|rqq|tinylinks|yyv|zff)\.co$/,
    /^(([\w]{8}|www)\.)?(these(blog|forum)s)\.com$/,
    /^(([\w]{8}|www)\.)?youfap\.me$/,
    /^warning-this-linkcode-will-cease-working-soon\.www\.linkbucksdns\.com$/,
  ];
  (function () {
    'use strict';
    function findToken (context) {
      var script = $.searchScripts('    var f = window[\'init\' + \'Lb\' + \'js\' + \'\']', context);
      if (!script) {
        _.warn('pattern changed');
        return null;
      }
      var adurl = script.match(/AdUrl\s*:\s*'([^']+)'/);
      if (!adurl) {
        return null;
      }
      adurl = adurl[1];
      var m1 = script.match(/AdPopUrl\s*:\s*'.+\?[^=]+=([\w\d]+)'/);
      var m2 = script.match(/Token\s*:\s*'([\w\d]+)'/);
      var token = m1[1] || m2[1];
      var m = script.match(/=\s*(\d+);/);
      var ak = parseInt(m[1], 10);
      var re = /\+\s*(\d+);/g;
      var tmp = null;
      while((m = re.exec(script)) !== null) {
        tmp = m[1];
      }
      ak += parseInt(tmp, 10);
      return {
        t: token,
        aK: ak,
        adurl: adurl,
      };
    }
    function sendRequest (token) {
      $.get(token.adurl);
      delete token.adurl;
      token.a_b = false;
      _.info('waiting the interval');
      return _.wait(5000).then(function () {
        _.info('sending token: %o', token);
        return $.get('/intermission/loadTargetUrl', token, {
          'X-Requested-With': _.none,
          Origin: _.none,
        });
      }).then(function (text) {
        var data = _.parseJSON(text);
        _.info('response: %o', data);
        if (!data.Success && data.Errors[0] === 'Invalid token') {
          _.warn('got invalid token');
          return retry();
        }
        if (data.AdBlockSpotted) {
          _.warn('adblock spotted');
          return;
        }
        if (data.Success && !data.AdBlockSpotted && data.Url) {
          return data.Url;
        }
      });
    }
    function retry () {
      return $.get(window.location.toString(), {}, {
        'X-Forwarded-For': $.generateRandomIP(),
      }).then(function (text) {
        var d = $.toDOM(text);
        var t = findToken(d);
        if (!t) {
          return _.wait(1000).then(retry);
        }
        return sendRequest(t);
      });
    }
    $.register({
      rule: {
        host: hostRules,
        path: /^\/\w+\/url\/(.+)$/,
      },
      ready: function(m) {
        $.removeAllTimer();
        $.resetCookies();
        $.removeNodes('iframe');
        var url = m.path[1] + window.location.search;
        var match = $.searchScripts(/UrlEncoded: ([^,]+)/);
        if (match && match[1] === 'true') {
          url = Encode(ConvertFromHex(url));
        }
        $.openLink(url);
      }
    });
    $.register({
      rule: {
        host: hostRules,
      },
      start: function () {
        $.window.XMLHttpRequest = _.nop;
      },
      ready: function () {
        $.removeAllTimer();
        $.resetCookies();
        $.removeNodes('iframe');
        if (window.location.pathname.indexOf('verify') >= 0) {
          var path = window.location.pathname.replace('/verify', '');
          $.openLink(path);
          return;
        }
        var token = findToken(document);
        sendRequest(token).then(function (url) {
          $.nuke(url);
          $.openLink(url);
        });
      },
    });
    $.register({
      rule: {
        query: /^(.*)[?&]_lbGate=\d+$/,
      },
      start: function (m) {
        $.setCookie('_lbGatePassed', 'true');
        $.openLink(window.location.pathname + m.query[1]);
      },
    });
  })();
})();
$.register({
  rule: {
    host: [
      /^www\.linkdecode\.com$/,
      /^www\.fastdecode\.com$/,
    ],
    path: /^\/$/,
    query: /^\?(.+)$/,
  },
  ready: function (m) {
    'use strict';
    $.removeNodes('iframe');
    var lnk = m.query[1];
    if (m.query[1].match(/^https?:\/\//)) {
    	$.openLink(lnk);
    	return;
    }
    var b = $.$('#popup');
    if (b && b.href) {
      $.openLink(b.href);
      return;
    }
    b = $('#m > .Visit_Link');
    b = b.onclick.toString().match(/window\.open\(\'([^']+)\'/);
    if (!b) {
      throw new _.AdsBypasser('pattern changed');
    }
    lnk = b[1].match(/\?(https?:\/\/.*)$/);
    if (lnk) {
        $.openLink(lnk[1]);
        return;
    }
    $.openLink(b[1]);
  },
});
$.register({
  rule: {
    host: /^linkdolar\.xyz$/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var s = $.searchScripts(/^\s*eval\((.+)\)\s*$/);
    if (!s) {
      _.warn('site changed');
      return;
    }
    s = eval('(' + s[1] + ')');
    s = s.match(/\$\.post\('([^']+)',(\{.+\}),function/);
    if (!s) {
      _.warn('site changed');
    }
    var url = s[1];
    var args = eval('(' + s[2] + ')');
    $.post(url, args).then(function (target) {
      $.openLink(target);
    });
  },
});
(function () {
  'use strict';
  $.register({
    rule: {
      host: [
        /^(www\.)?linkdrop\.net$/,
        /^dmus\.in$/,
        /^ulshare\.net$/,
        /^adurl\.id$/,
        /^goolink\.me$/,
        /^earningurl\.com$/,
      ],
    },
    ready: function () {
      $.removeNodes('iframe');
      var f = getForm();
      if (!f) {
        return;
      }
      sendRequest(f);
    },
  });
  $.register({
    rule: {
      host: /^sflnk\.me$/,
    },
    ready: function () {
      $.removeNodes('iframe');
      var f = getForm();
      if (!f) {
        f = $('#link-view');
        f.submit();
        return;
      }
      sendRequest(f);
    },
  });
  function getForm () {
    var jQuery = $.window.$;
    var f = jQuery('form[action="/links/go"], form[action="/links/linkdropgo"]');
    if (f.length > 0) {
      return f;
    }
    return null;
  }
  function sendRequest (f) {
    var jQuery = $.window.$;
    jQuery.ajax({
      dataType: 'json',
      type: 'POST',
      url: f.attr('action'),
      data: f.serialize(),
      success: function (result, status, xhr) {
        if (result.url) {
          $.openLink(result.url);
        } else {
          _.warn(result.message);
        }
      },
      error: function (xhr, status, error) {
        _.warn(xhr, status, error);
      },
    });
  }
})();
$.register({
  rule: {
    host: /^linkpaid\.net$/,
    path: /^\/go\//,
  },
  ready: function () {
    'use strict';
    var f = $('#btn-main');
    f.click();
  },
});
$.register({
  rule: {
    host: /^(www\.)?linkplugapp\.com$/,
  },
  ready: function () {
    'use strict'
    var a = $('#mc_embed_signup_scroll a')
    $.openLink(a.href)
  },
})
$.register({
  rule: {
    host: /^linksas\.us$/,
    path: /^(\/\w+)$/,
  },
  ready: function (m) {
    'use strict';
    _.try(1000, function () {
      var recaptcha = $('#g-recaptcha-response');
      if (!recaptcha) {
        return null;
      }
      if (!recaptcha.value) {
        return _.none;
      }
      return recaptcha.value;
    }).then(function (recaptcha) {
      var url = _.T('http://ipinfo.io/{0}/json')($.generateRandomIP());
      return $.get(url).then(function (ipinfo) {
        ipinfo = _.parseJSON(ipinfo);
        return {
          codeAds: 1,
          country: ipinfo.country,
          ipAddress: ipinfo.ip,
          recaptcha: recaptcha,
        };
      });
    }).then(function (payload) {
      var token = $.getCookie('XSRF-TOKEN');
      return $.post('/go' + m.path[1], payload, {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': token,
      });
    }).then(function (data) {
      data = _.parseJSON(data);
      $.openLink(data.message);
    }).catch(function (e) {
      _.warn(e);
    });
  },
});
$.register({
  rule: {
    host: /^linksas\.us$/,
    path: /^\/go\//,
  },
  ready: function () {
    'use strict';
    var a = $.$('#btnSubmit');
    if (!a) {
      return;
    }
    var url = a.href;
    var pattern = /https?:\/\//g;
    var lastURL = '';
    while (true) {
      var matched = pattern.exec(url);
      if (!matched) {
        break;
      }
      lastURL = matched + url.substring(pattern.lastIndex);
    }
    $.openLink(lastURL);
  },
});
$.register({
  rule: {
    host: /^linkshrink\.net$/,
    path: /^\/[a-zA-Z0-9]+$/,
  },
  start: function () {
    'use strict';
    $.window._impspcabe = 0;
  },
  ready: function () {
    'use strict';
    var l = $.searchScripts(/revC\("([^"]+)"\)/);
    l = atob(l[1]);
    $.openLink('/' + l);
  },
});
$.register({
  rule: {
    host: /^linkshrink\.net$/,
    path: /=(.+)$/,
  },
  start: function (m) {
    'use strict';
    $.openLink(m.path[1]);
  },
});
$.register({
  rule: 'http://lix.in/-*',
  ready: function () {
    'use strict';
    var i = $.$('#ibdc');
    if (i) {
      return;
    }
    i = $.$('form');
    if (i) {
      i.submit();
      return;
    }
    i = $('iframe');
    $.openLink(i.src);
  },
});
$.register({
  rule: {
    host: /^lnk\.in$/,
  },
  ready: function () {
    'use strict';
    var a = $('#divRedirectText a');
    $.openLink(a.innerHTML);
  },
});
$.register({
  rule: {
    host: /^(rd?)lnk\.co|reducelnk\.com$/,
    path: /^\/[^.]+$/,
  },
  ready: function () {
    'use strict';
    var f = $.$('iframe#dest');
    if (f) {
      $.openLink(f.src);
      return;
    }
    $.removeNodes('iframe');
    var o = $.$('#urlholder');
    if (o) {
      $.openLink(o.value);
      return;
    }
    o = $.$('#skipBtn');
    if (o) {
      o = o.querySelector('a');
      $.openLink(o.href);
      return;
    }
    o = document.title.replace(/(LNK.co|Linkbee)\s*:\s*/, '');
    $.openLink(o);
  },
});
$.register({
  rule: {
    host: [
      /^lnx\.lu$/,
      /^url\.fm$/,
      /^z\.gs$/,
    ],
  },
  ready: function () {
    'use strict';
    var a = $('#clickbtn a');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^www\.lolinez\.com$/,
    query: /\?(.+)/,
  },
  start: function (m) {
    'use strict';
    $.openLink(m.query[1]);
  },
});
$.register({
  rule: {
    host: /^(www\.)?loook\.ga$/,
    path: /^\/\d+$/
  },
  ready: function (m) {
    'use strict';
    var a = $('#download_link > a.btn');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^looy\.in$/,
    path: /^\/Pro\/(.+)$/,
  },
  ready: function (m) {
    'use strict';
    $.post('http://looy.in/Go/Index/ProSkipAd', {
      code: m.path[1],
      server: '',
    }).then(function (url) {
      $.openLink(url);
    }).catch(function (e) {
      _.warn(e);
    });
  },
});
$.register({
  rule: {
    host: /^looy\.in$/,
    path: /^\/(.+)$/,
  },
  start: function (m) {
    'use strict';
    $.openLink('/Pro/' + m.path[1]);
  },
});
$.register({
  rule: [
    'http://madlink.sk/',
    'http://madlink.sk/*.html',
  ],
});
$.register({
  rule: 'http://madlink.sk/*',
  start: function (m) {
    'use strict';
    $.removeNodes('iframe');
    $.post('/ajax/check_redirect.php', {
      link: m[1],
    }).then(function (text) {
      $.openLink(text);
    });
  },
});
$.register({
  rule: {
    host: [
      /^mant[ae][pb]\.in$/,
      /^st\.oploverz\.net$/,
      /^minidroid\.net$/,
      /^ww3\.awaremmxv\.com$/,
      /^linkpoi\.in$/,
    ],
  },
  ready: function () {
    'use strict';
    var a = $('a.redirect, a[target=_blank][rel=nofollow]');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^susutin\.com$/,
  },
  ready: function () {
    'use strict';
    var s = $.searchScripts(/="([^"]+)",/);
    $.openLink(s[1]);
  },
});
$.register({
  rule: {
    host: /^www\.mije\.net$/,
    path: /^\/\w+\/(.+)$/,
  },
  start: function (m) {
    'use strict';
    var url = atob(m.path[1]);
    $.openLink(url);
  },
});
$.register({
  rule: {
    host: /^mirrorfilehost\.com$/,
  },
  ready: function () {
    'use strict';
    _.wait(3 * 1000).then(function () {
      var frame = frames[0];
      var form = frame.document.createElement('form');
      form.target = '_parent';
      form.action = location.toString();
      var input = frame.document.createElement('input');
      input.value = 'Download';
      input.type = 'submit';
      form.appendChild(input);
      frame.document.body.appendChild(form);
      input.click();
    });
  },
});
$.register({
  rule: {
    host: [
      /^moe\.god\.jp$/,
      /^moesubs\.akurapopo\.pro$/,
      /^dl\.nsfk\.in$/,
    ]
  },
  ready: function () {
    'use strict';
    var a = $('div div center a');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^moesubs\.com$/,
    path: /^\/url\//,
  },
  ready: function () {
    'use strict';
    var a = $('body > div:nth-child(4) > i:nth-child(1)');
    a = a.textContent;
    var i = a.lastIndexOf('http');
    a = a.substr(i);
    $.openLink(a);
  },
});
$.register({
  rule: {
    host: /^mt0\.org$/,
    path: /^\/[^\/]+\/$/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('frame[name=bottom]');
    var f = $('frame[name=top]');
    var i = setInterval(function () {
      var a = $.$('div a', f.contentDocument);
      if (!a) {
        return;
      }
      clearInterval(i);
      $.openLink(a.href)
    }, 1000);
  },
});
$.register({
  rule: 'http://my-link.pro/*',
  ready: function () {
    'use strict';
    var i = $('iframe[scrolling=auto]');
    if (i) {
      $.openLink(i.src);
    }
  },
});
$.register({
  rule: {
    host: /^nmac\.to$/,
    path: /^\/download\/(.+)/,
  },
  start: function (m) {
    'use strict';
    var url = atob(m.path[1]);
    $.openLink(url);
  },
});
$.register({
  rule: {
    host: /^nsfw\.in$/,
  },
  ready: function () {
    'use strict';
    var a = $('#long_url a');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^nutshellurl\.com$/,
  },
  ready: function () {
    'use strict';
    var iframe = $('iframe');
    $.openLink(iframe.src);
  },
});
$.register({
  rule: {
    host: /^(www\.)?ohleech\.com$/,
    path: /^\/dl\/$/,
  },
  ready: function () {
    'use strict';
    $.window.startdl();
  },
});
$.register({
  rule: {
    host: /^www\.oni\.vn$/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var data = $.searchScripts(/data:"([^"]+)"/);
    if (!data) {
      throw new _.AdsBypasserError('pattern changed');
    }
    data = data[1];
    $.get('/click.html', data).then(function (url) {
      $.openLink(url);
    });
  },
});
$.register({
  rule: {
    host: /^(www\.)?ouo\.(io|press)$/,
    path: /^\/go\/\w+$/,
  },
  ready: function (m) {
    'use strict';
    $('form').submit();
  },
});
$.register({
  rule: {
    host: /^oxyl\.me$/,
  },
  ready: function () {
    'use strict';
    var l = $.$$('.links-container.result-form > a.result-a');
    if (l.size() > 1) {
      return;
    }
    $.openLink(l.at(0).href);
  },
});
$.register({
  rule: {
    host: /^p\.pw$/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var m = $.searchScripts(/window\.location = "(.*)";/);
    m = m[1];
    $.openLink(m);
  },
});
$.register({
  rule: {
    host: /^pdi2\.net$/,
  },
  ready: function () {
    'use strict';
    var s = $.searchScripts(/top\.location = '([^']+)'/);
    s = s[1];
    $.openLink(s);
  },
});
$.register({
  rule: {
    host: /^(www\.)?\w+\.rapeit\.net$/,
    path: /^\/(go|prepair|request|collect|analyze)\/[a-f0-9]+$/,
  },
  ready: function (m) {
    'use strict';
    var a = $('a#download_link');
    $.openLink(a.href);
  },
});
$.register({
  rule: 'http://reffbux.com/refflinx/view/*',
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var m = $.searchScripts(/skip_this_ad_(\d+)_(\d+)/);
    var id = m[1];
    var share = m[2];
    var location = window.location.toString();
    $.post('http://reffbux.com/refflinx/register', {
      id: id,
      share: share,
      fp: 0,
      location: location,
      referer: '',
    }).then(function (text) {
      var m = text.match(/'([^']+)'/);
      if (!m) {
        throw new _.AdsBypasserError('pattern changed');
      }
      $.openLink(m[1]);
    });
  },
});
$.register({
  rule: 'http://richlink.com/app/webscr?cmd=_click&key=*',
  ready: function () {
    'use strict';
    var f = $('frameset');
    f = f.onload.toString();
    f = f.match(/url=([^&]+)/);
    if (f) {
      f = decodeURIComponent(f[1]);
    } else {
      f = $('frame[name=site]');
      f = f.src;
    }
    $.openLink(f);
  },
});
$.register({
  rule: 'http://rijaliti.info/*.php',
  ready: function () {
    'use strict';
    var a = $('#main td[align="center"] a');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^riurl\.com$/,
    path: /^\/.+/,
  },
  ready: function () {
    'use strict';
    var s = $.$('body script');
    if (s) {
      s = s.innerHTML.indexOf('window.location.replace');
      if (s >= 0) {
        return;
      }
    }
    $.openLink('', {
      path: {
        hidden: '1',
        image: ' ',
      },
    });
  },
});
$.register({
  rule: {
    host: /^preview\.rlu\.ru$/,
  },
  ready: function () {
    'use strict';
    var a = $('#content > .long_url > a');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^robo\.us$/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var url = atob($.window.fl);
    $.openLink(url);
  },
});
$.register({
  rule: {
    host: /^www\.ron\.vn$/,
  },
  ready: function () {
    'use strict';
    var script = $.searchScripts('linknexttop');
    var data = script.match(/data:"([^"]+)"/);
    var url = $.window.domain + 'click.html?' + data[1];
    $.get(url, {}, {
      'Content-Type': 'application/json; charset=utf-8',
    }).then(function (url) {
      $.openLink(url);
    });
  },
});
$.register({
  rule: {
    host: /^(www\.)?sa\.ae$/,
    path: /^\/\w+\/$/,
  },
  ready: function () {
    'use strict';
    var m = $.searchScripts(/var real_link = '([^']+)';/);
    $.openLink(m[1]);
  },
});
$.register({
  rule: {
    host: /^(www\.)?safeurl\.eu$/,
    path: /\/\w+/,
  },
  ready: function () {
    'use strict';
    var directUrl = $.searchScripts(/window\.open\("([^"]+)"\);/);
    if (!directUrl) {
      throw new _.AdsBypasserError('script content changed');
    }
    directUrl = directUrl[1];
    $.openLink(directUrl);
  },
});
$.register({
  rule: {
    host: [
      /^segmentnext\.com$/,
      /^(www\.)?videogamesblogger.com$/,
    ],
    path: /^\/interstitial\.html$/,
    query: /return_url=([^&]+)/,
  },
  start: function (m) {
    'use strict';
    $.openLink(decodeURIComponent(m.query[1]));
  },
});
$.register({
  rule: {
    host: /^(www\.)?(apploadz\.ru|seomafia\.net)$/
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var a = $('table a');
    $.openLink(a.href);
  },
});
$.register({
  rule: /http:\/\/setlinks\.us\/(p|t|d).*/,
  ready: function () {
    'use strict';
    var k = $.searchScripts(/window\.location='([^']+)'/);
    if (k) {
      $.openLink(k[1]);
      return;
    }
    var aLinks = $.$$('div.links-container.result-form:not(.p-links-container) > span.dlinks > a');
    if (aLinks.size() === 1) {
      $.openLink(aLinks.at(0).href);
      return;
    }
    k = $('img[alt=captcha]');
    $.captcha(k.src, function (a) {
      var b = $('#captcha');
      var c = $('input[name=Submit]');
      b.value = a;
      c.click();
    });
  },
});
(function () {
  'use strict';
  function afterGotSessionId (sessionId) {
    var X_NewRelic_ID = $.searchScripts(/xpid:"([^"]+)"/);
    var data = {
      adSessionId: sessionId,
    };
    var header = {
      Accept: 'application/json, text/javascript',
    };
    if (X_NewRelic_ID) {
      header['X-NewRelic-ID'] = X_NewRelic_ID;
    }
    var i = setInterval(function () {
      $.get('/shortest-url/end-adsession', data, header).then(function (text) {
        var r = _.parseJSON(text);
        if (r.status == "ok" && r.destinationUrl) {
          clearInterval(i);
          $.removeAllTimer();
          var url = decodeURIComponent(r.destinationUrl);
          $.openLink(url);
        }
      });
    }, 1000);
  }
  var hostRules = [
    /^sh\.st$/,
    /^(dh10thbvu|u2ks|jnw0|qaafa|xiw34|cllkme|clkmein|corneey|ceesty)\.com$/,
    /^[dfg]estyy\.com$/,
    /^digg\.to$/,
    /^([vw]iid|clkme)\.me$/,
    /^short\.est$/,
  ];
  $.register({
    rule: {
      host: hostRules,
      path: /^\/freeze\/.+/,
    },
    ready: function () {
      var o = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.target.getAttribute('class').match(/active/)) {
            o.disconnect();
            $.openLink(mutation.target.href);
          }
        });
      });
      o.observe($('#skip_button'), {
        attributes: true,
        attributeFilter: ['class'],
      });
    },
  });
  $.register({
    rule: {
      host: hostRules,
      path: /https?:\/\//,
    },
    start: function () {
      var url = window.location.pathname + window.location.search + window.location.hash;
      url = url.match(/(https?:\/\/.*)$/);
      url = url[1];
      $.openLink(url);
    },
  });
  $.register({
    rule: {
      host: hostRules,
      path: /^\/[\d\w]+/,
    },
    start: function () {
      $.window._impspcabe = 0;
    },
    ready: function () {
      $.removeNodes('iframe');
      $.removeAllTimer();
      var m = $.searchScripts(/sessionId: "([\d\w]+)",/);
      if (m) {
        afterGotSessionId(m[1]);
        return;
      }
      var o = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          var m = $.searchScripts(/sessionId: "([\d\w]+)",/);
          if (m) {
            o.disconnect();
            afterGotSessionId(m[1]);
          }
        });
      });
      o.observe(document.body, {
        childList: true,
      });
    },
  });
})();
$.register({
  rule: {
    host: [
      /^(www\.)?shink\.in$/,
      /^fas\.li$/,
      /^(www\.)?croco\.(me|site)$/,
      /^cpmlink\.net$/,
    ],
    path: /^\/\w+$/,
  },
  ready: function () {
    'use strict';
    var f = $('#skip');
    if (!$.$('#captcha')) {
      f.submit();
      return;
    }
    var o = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.localName === 'div') {
            if (node.style.zIndex === '2147483647') {
              node.parentNode.removeChild(node);
              return;
            }
          }
        });
      });
    });
    o.observe(document.body, {
      childList: true,
      subtree: true,
    });
  },
});
$.register({
  rule: [
    {
      host: [
        /^fas\.li$/,
        /^cpmlink\.net$/,
      ],
      path: /^\/go\/\w+$/,
    },
    {
      host: /^(www\.)?croco\.(me|site)$/,
      path: /^\/ok\/\w+$/,
    },
  ],
  ready: function () {
    'use strict';
    var a = $('#btn-main');
    var i = a.href.lastIndexOf('http');
    a = a.href.substr(i);
    $.openLink(a);
  },
});
$.register({
  rule: {
    host: /^(www\.)?shink\.in$/,
    path: /^\/go\/\w+$/,
  },
  ready: function () {
    'use strict';
    var f = $('#skip');
    f.submit();
  },
});
$.register({
  rule: {
    host: /^short\.am$/,
  },
  ready: function () {
    'use strict';
    _.wait(5000).then(function () {
      $.openLink('', {
        post: {
          image: 'Continue',
        },
      });
    });
  },
});
$.register({
  rule: {
    host: [
      /^(www\.)?shortenurl\.tk$/,
      /^(www\.)?pengaman\.link$/,
      /^urlgo\.gs$/,
      /^gunting\.web\.id$/,
    ],
    path: /^\/\w+$/,
  },
  ready: function (m) {
    'use strict';
    var l = $('a.btn-block.redirect');
    $.openLink(l.href);
  },
});
$.register({
  rule: {
    host: /^(www\.)?shorti\.ga$/,
    path: [
      /^\/\w+$/,
      /^\/url_redirector\.html$/,
    ],
  },
  ready: function () {
    'use strict';
    var f = $.$$('frame');
    var fl = f.find(function(value, key, self) {
      if (value.getAttribute('class')) {
        return _.none;
      }
      return 'Target frame found';
    });
    $.openLink(fl.value.src);
  },
});
$.register({
  rule: {
    host: /^www\.shortskip\.com$/,
    path: /^\/short\.php$/,
    query: /i=([^&]+)/,
  },
  start: function (m) {
    'use strict';
    var url = decodeURIComponent(m.query[1]);
    $.openLink(url);
  },
});
$.register({
  rule: {
    host: /^get\.shrink-service\.it$/,
    path: /^\/(.+)/,
  },
  start: function (m) {
    'use strict';
    var url = _.T('//www.shrink-service.it/shrinked/{0}');
    $.openLink(url(m.path[1]));
  },
});
$.register({
  rule: {
    host: /^www\.shrink-service\.it$/,
    path: /^\/shrinked\//,
  },
  ready: function () {
    'use strict';
    var i = $('input[id][name]');
    $.openLink(i.value);
  },
});
$.register({
  rule: {
    host: /^www\.shrink-service\.it$/,
    path: /^\/[se]\//,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var i = $('body > input[id][name]');
    $.openLink(i.value);
  },
});
$.register({
  rule: {
    host: /^sht\.io$/,
    path: /^\/\d+\/(.+)$/,
  },
  start: function (m) {
    'use strict';
    var url = atob(m.path[1]);
    url = url.match(/\{sht-io\}(.+)\{sht-io\}.*\{sht-io\}/);
    $.openLink(url[1]);
  },
});
$.register({
  rule: {
    host: /^(www\.)?similarsites\.com$/,
    path: /^\/goto\/([^?]+)/
  },
  start: function (m) {
    'use strict';
    var l = m.path[1];
    if (!/^https?:\/\//.test(l)) {
      l = 'http://' + l;
    }
    $.openLink(l);
  },
});
$.register({
  rule: {
    host: /^smll\.io$/,
  },
  ready: function () {
    'use strict';
    var m = $.searchScripts(/window\.location="([^"]*)";/);
    $.openLink(m[1]);
  },
});
$.register({
  rule: {
    host: /^www\.spaste\.com$/,
    path: /^\/go\/\w+$/,
  },
  ready: function () {
    'use strict';
    var id = $.searchScripts(/\{id:'(\d+)'\}/);
    _.wait(3000).then(function () {
      return $.post('/site/getRedirectLink', {
        id: id,
      }).then(function (url) {
        $.openLink(url);
      });
    });
  },
});
$.register({
  rule: {
    host: /^srnk\.co$/,
    path: /^\/i\//,
  },
  ready: function () {
    'use strict';
    var a = $.$('#btn-with-link');
    if (!a) {
      return;
    }
    var href = a.href;
    var method = a.dataset.method;
    if (method) {
      var csrfParam = $('meta[name="csrf-param"]').content;
      var csrfToken = $('meta[name="csrf-token"]').content;
      var form = document.createElement('form');
      form.method = 'post';
      form.action = href;
      var input = document.createElement('input');
      input.name = '_method';
      input.value = method;
      form.appendChild(input);
      input = document.createElement('input');
      input.name = csrfParam;
      input.value = csrfToken;
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
      return;
    }
    $.post(location.pathname + '.js').then(function (script) {
      var m = script.match(/var link = "([^"]+)";/);
      if (!m) {
        _.warn('script changed');
        return;
      }
      $.openLink(m[1]);
    });
  },
});
$.register({
  rule: {
    host: /^stash-coins\.com$/,
  },
  start: function () {
    'use strict';
    var url = window.location.toString();
    var i = url.lastIndexOf('http');
    url = url.substr(i);
    $.openLink(url);
  },
});
$.register({
  rule: {
    host: /^streamingfrench\.net$/,
    path: /^\/$/,
    query: /^\?xb=(.+)$/,
  },
  start: function (m) {
    'use strict';
    var url = decodeURIComponent(m.query[1]);
    $.openLink(url);
  },
});
$.register({
  rule: {
    host: /^(www\.)?supercheats\.com$/,
    path: /^\/interstitial\.html$/,
    query: /(?:\?|&)oldurl=([^&]+)(?:$|&)/,
  },
  start: function (m) {
    'use strict';
    $.openLink(m.query[1]);
  },
});
$.register({
  rule: [
    {
      host: [
        /^(www\.)?sylnk\.net$/,
        /^dlneko\.(com|net|org)$/,
        /^rumahsimpel\.com$/,
      ],
      query: /link=([^&]+)/,
    },
    {
      host: /^(www\.)?compul\.in$/,
      path: /^\/[np]\.php$/,
      query: /v=([^&]+)/,
    },
    {
      host: /^(www\.)?safelinkair\.com$/,
      path: /^\/code$/,
      query: /(?:\?|&)link=([a-zA-Z0-9\/=]+)(?:$|&)/,
    },
    {
      host: [
        /^link\.filmku\.net$/,
        /^www\.healthygress24\.ga$/,
        /^kombatch\.amankan\.link$/,
      ],
      path: /^\/p\/(go|healty-lie)\.html$/,
      query: /^\?url=([a-zA-Z0-9\/=]+)$/,
    },
    {
      host: [
        /^(gadget|auto|sports)14\.pw$/,
        /^motosport\.pw$/,
        /^nar-04\.tk$/,
        /^lindung\.in$/,
        /^motonews\.club$/,
        /^ww[23]\.picnictrans\.com$/,
        /^gadget13\.com$/,
        /^azhie\.net$/,
        /^ww2\.awsubs\.co$/,
        /^autorp\.us$/
      ],
      query: /^\?d=([a-zA-Z0-9\/=]+)$/,
    },
    {
      host: /^www\.anisubsia\.tk$/,
      path: /^\/p\/link\.html$/,
      query: /^\?url=([a-zA-Z0-9\/=]+)$/,
    },
    {
      host: [
        /^www\.insurance1\.tech$/,
        /^www\.freeanimeonline\.xyz$/,
      ],
      query: /^\?site=([a-zA-Z0-9\/=]+)/,
    },
    {
      host: /^i\.gtaind\.com$/,
      query: /^\?([a-zA-Z0-9\/=]+)$/,
    },
    {
      host: /\.blogspot\.com?/,
      query: [
        /^\?url=([a-zA-Z0-9\/=]+)$/,
        /^\?id=([a-zA-Z0-9\/=]+)$/,
      ],
    },
    {
      host: /^sehatlega\.com$/,
      query: /^\?lanjut=([a-zA-Z0-9\/=]+)$/,
    },
    {
      host: /^shorten\.id$/,
      query: /^\?url=([a-zA-Z0-9\/=]+)=$/,
    },
  ],
  start: function (m) {
    'use strict';
    var rawLink = atob(m.query[1]);
    $.openLink(rawLink);
  },
});
$.register({
  rule: [
    {
      host: [
        /(^|\.)safelinkconverter2?\.com$/,
        /^safelink(s?review(er)?)\.com?$/,
        /^susutin\.com$/,
        /^(getcomics|miuitutorial)\.gq$/,
        /^awsubs\.cf$/,
        /^awsubsco\.ga$/,
      ],
      query: /id=([\w\\]+=*)/,
    },
    {
      host: [
        /^(www\.)?dlneko\.com$/,
        /^(satuasia|tawaku)\.com$/,
        /^ww3\.manteb\.in$/,
        /^link\.filmku\.net$/,
        /^www\.muucih\.com$/,
        /^(naisho|filmku)\.lompat\.in$/,
        /^edogawa\.lon\.pw$/,
        /^telolet\.in$/,
      ],
      query: /go=([\w\\]+=*)/,
    },
  ],
  start: function (m) {
    'use strict';
    var l = atob(m.query[1]);
    var table = {
      '!': 'a',
      ')': 'e',
      '_': 'i',
      '(': 'o',
      '*': 'u',
    };
    l = l.replace(/[!)_(*]/g, function (m) {
      return table[m];
    });
    $.openLink(l);
  },
});
$.register({
  rule: {
    host: /^(www\.)?safelinkreview\.com$/,
    path: /^\/\w+\/cost\/([\w\.]+)\/?$/,
  },
  start: function (m) {
    'use strict';
    var l = 'http://' + m.path[1];
    $.openLink(l);
  },
});
$.register({
  rule: {
    host: [
      /^(designinghomey|ani-share|sinopsisfilmku)\.com$/,
      /^motonews\.club$/,
      /^(autofans|landscapenature)\.pw$/,
      /^(sidespace|erogedownload)\.net$/,
    ],
    query: /get=([^&]+)/,
  },
  ready: function (m) {
    'use strict';
    var s = $.searchScripts(/var a='([^']+)'/);
    if (s) {
      $.openLink(s[1]);
      return;
    }
    s = atob(m.query[1]);
    $.openLink(s);
  },
});
$.register({
  rule: {
    host: /^kombatch\.loncat\.pw$/,
  },
  ready: function () {
    'use strict';
    var s = $.searchScripts(/\.open\("([^"]+)",/);
    s = s[1].match(/go=([^&]+)/);
    s = atob(s[1]);
    $.openLink(s);
  },
});
$.register({
  rule: {
    host: [
      /^ww[23]\.picnictrans\.com$/,
      /^short\.awsubs\.(co|me)$/,
    ],
  },
  ready: function () {
    'use strict';
    var a = $('div.kiri > center > a');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^techfunda\.net$/,
    path: [
        /^\/link\//,
        /^\/safe\//,
    ],
  },
  ready: function () {
    'use strict';
    var a = $('.hide a.btn');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^thinfi\.com$/,
  },
  ready: function () {
    'use strict';
    var a = $('div p a');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^tinyarrows\.com$/,
    path: /^\/preview\.php$/,
    query: /^\?page=([^&]+)/,
  },
  start: function (m) {
    'use strict';
    $.openLink(decodeURIComponent(m.query[1]));
  },
});
$.register({
  rule: {
    host: /^topload\.pro$/,
  },
  ready: function () {
    'use strict';
    var a = $('.hide a.btn');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^(www\.)?totaldebrid\.org$/,
    path:/\/l\/(l\.php)?$/,
    query: /\?ads=([a-zA-Z0-9=]+)$/,
  },
  start: function (m) {
    'use strict';
    var l = atob(m.query[1]);
    $.openLink(l);
  },
});
$.register({
  rule: {
    host: /^(www\.)?typ\.me$/,
  },
  ready: function (m) {
    'use strict';
    var a = $('#skipAdBtn');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^(www\.)?ultshare\.com$/,
    path: /^\/(?:(?:\d-)?(\d+)|index\.php)$/,
    query: /^(?:\?a=\d&c=(\d+))?$/
  },
  start: function (m) {
    'use strict';
    var linkId = m.path[1]?m.path[1]:m.query[1];
    var directLink = '/3-' + linkId;
    $.openLink(directLink);
  },
});
$.register({
  rule: {
    host: /^unfake\.it$/,
  },
  ready: function () {
    'use strict';
    var frame = $('frame');
    var i = frame.src.lastIndexOf('http://');
    $.openLink(frame.src.substr(i));
  },
});
$.register({
  rule: {
    host: /^(www\.)?(upan|gxp)\.so$/,
    path: /^\/\w+$/,
  },
  ready: function () {
    'use strict';
    var a = $('table.td_line a[onclick="down_process_s();"]');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^url\.ie$/,
  },
  ready: function () {
    'use strict';
    var a = $('a[title="Link to original URL"]');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: [
      /^urlcash\.(com|net|org)$/,
      /^(bat5|detonating|celebclk|eightteen|smilinglinks|peekatmygirlfriend|pornyhost|clb1|urlgalleries)\.com$/,
      /^looble\.net$/,
      /^xxxs\.org$/,
    ],
  },
  ready: function () {
    'use strict';
    if ($.window && $.window.linkDestUrl) {
      $.openLink($.window.linkDestUrl);
      return;
    }
    var matches = document.body.innerHTML.match(/linkDestUrl = '(.+)'/);
    if (matches) {
      $.openLink(matches[1]);
      return;
    }
  },
});
$.register({
  rule: {
    host: /^urlinn\.com$/,
  },
  ready: function () {
    'use strict';
    var m = $('META[HTTP-EQUIV=refresh]').getAttribute('CONTENT').match(/url='([^']+)'/);
    if (m) {
      $.openLink(m[1]);
    }
  },
});
$.register({
  rule: {
    host: /^urlms\.com$/,
  },
  ready: function () {
    'use strict';
    var iframe = $('#content');
    $.openLink(iframe.src);
  },
});
$.register({
  rule: {
    host: /^(www\.)?urlv2\.com$/,
  },
  ready: function (m) {
    'use strict';
    if (window.location.pathname.indexOf('locked') >= 0) {
      var path = window.location.pathname.replace('/locked', '');
      $.openLink(path);
      return;
    }
    var m = $.searchScripts(/jeton=([\w]+)/);
    var l = 'http://urlv2.com/algo.php?action=passer&px=0&so=1&jeton=' + m[1];
    window.setTimeout(function() {$.openLink(l)}, 5000);
  },
});
$.register({
  rule: {
    host: /^(www\.)?uskip\.me$/,
    path: /^\/go\/\w+$/,
  },
  ready: function (m) {
    'use strict';
    var a = $('#btn-main');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^vavi\.co$/,
  },
  ready: function () {
    'use strict';
    var l = $('#goLink');
    $.openLink(l.href);
  },
});
$.register({
  rule: {
    host: /^(www\.)?victly\.com$/,
    path: /^\/\w+$/,
  },
  start: function () {
    'use strict';
    $.post(document.location.href, {
      hidden: '',
      image: 'Skip+Ads',
    }).then(function (text) {
      var m = text.match(/window\.location\.replace\('([^']+)'\)/);
      $.openLink(m[1]);
    });
  },
});
$.register({
  rule: {
    host: /^www\.viidii\.info$/,
  },
  ready: function () {
    'use strict';
    var o = $('#directlink');
    $.openLink(o.href);
  },
});
$.register({
  rule: {
    host: /^(www\.)?vir\.al$/,
  },
  ready: function () {
    'use strict';
    var m = $.searchScripts(/var target_url = '([^']+)';/);
    if (!m) {
      throw new _.AdsBypasserError('site changed');
    }
    $.openLink(m[1]);
  },
});
$.register({
  rule: {
    host: /^(www\.)?wzzq\.me$/,
  },
  ready: function () {
    'use strict';
    try {
      var l = $('#img_loading_table2  div.wz_img_hit a[target=_blank]').href;
      $.openLink(l);
    } catch (e) {
    }
  },
});
$.register({
  rule: {
    host: /^xlink\.me$/
  },
  ready: function () {
    'use strict';
    var a = $('#main_form > center > a');
    if (!a) {return;}
    $.openLink(a.href);
  },
});
$.register({
  rule: 'http://yep.it/preview.php?p=*',
  ready: function () {
    'use strict';
    var link = $('font[color="grey"]').innerHTML;
    $.openLink(link);
  },
});
$.register({
  rule: 'http://www.yooclick.com/l/*',
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var uniq = $.window.uniq || $.window.uniqi;
    if (!uniq) {return;}
    var path = window.location.pathname;
    var url = _.T('{0}?ajax=true&adblock=false&old=false&framed=false&uniq={1}')(path, uniq);
    var getURL = function() {
      $.get(url).then(function (text) {
        var goodURL = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(text);
        if (goodURL) {
          $.openLink(text);
        } else {
          setTimeout(getURL, 500);
        }
      });
    }
    getURL();
  },
});
$.register({
  rule: {
    host: /^ysf\.pl$/,
    path: /^\/3\/(.+)$/,
  },
  start: function (m) {
    'use strict';
    var url = atob(m.path[1]);
    $.openLink(url);
  },
});
$.register({
  rule: {
    host: /^ysf\.pl$/,
    path: /^\/2\/(.+)$/,
  },
  start: function (m) {
    'use strict';
    var url = m.path[1].match(/.{2}/g).map(function (h) {
      return String.fromCharCode(parseInt(h, 16));
    }).join('');
    $.openLink(url);
  },
});
$.register({
  rule: {
    host: /^www\.zintata\.com$/,
    path: /^\/link\/$/,
  },
  ready: function () {
    'use strict';
    var a = $('#one > center:nth-child(3) > a:nth-child(1)');
    $.openLink(a.href);
  },
});
$.register({
  rule: 'http://zo.mu/redirector/process?link=*',
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    window.location.reload();
  },
});
$.register({
  rule: {
    host: /^zzz\.gl$/,
  },
  ready: function () {
    'use strict';
    var m = $.searchScripts(/var domainurl = '([^']+)';/);
    if (!m) {
      throw new _.AdsBypasserError('site changed');
    }
    $.openLink(m[1]);
  },
});
$.register({
  rule: {
    host: /^akoam\.com$/,
    path: /^\/download\//,
  },
  start: function () {
    'use strict';
    var location_link = location.hash;
    $.post(location_link).then(function (data) {
      data = JSON.parse(data);
      if (!data.hash_data) {
        _.warn('rule changed');
        return;
      }
      $.openLink(data.direct_link);
    });
  },
});
$.register({
  rule: {
    host: /^www\.anafile\.com$/,
  },
  ready: function () {
    'use strict';
    var b = $.$('#btn_download');
    if (b) {
      b.disabled = false;
      $.removeNodes('div[align=center]');
      return;
    }
    b = $('#plans_free form [type=submit]');
    b.click();
  },
});
$.register({
  rule: {
    host: /^(www\.)?arab\.sh$/,
    path: /^\/\w+$/,
  },
  ready: function () {
    'use strict';
    var f = $('form[name=F1]');
    setTimeout(function() {
        f.submit();
    }, 20000);
  },
});
$.register({
  rule: {
    host: /^(www\.)?coolrom\.com$/,
    path: /^\/dlpop\.php$/,
  },
  ready: function () {
    'use strict';
    var matches = $.searchScripts(/<form method="POST" action="([^"]+)">/);
    $.openLink(matches[1]);
  },
});
(function() {
  'use strict';
  $.register({
    rule: {
      host: /^(www\.)?dl-protect\.com$/,
      path: /\/[A-Z0-9]+/,
    },
    ready: function () {
      if ($.$('#captcha')) {
        return;
      }
      var f = $.$('form[name=ccerure]');
      if (f) {
        var observer = new MutationObserver(function (mutations) {
          var iIn = $('input[id=in]');
          for (var i = 0; i < mutations.length; i++) {
            if (mutations[i].target.value && mutations[i].attributeName === 'value') {
              observer.disconnect();
              iIn.value = "Tracking too much hurts users' privacy";
              if (!canFastRedirect()) {
                return;
              }
              setTimeout(function() {
                f.submit();
              }, 600);
              break;
            }
          }
        });
        var iIn = $('input[id=in]');
        if (iIn.value) {
          setTimeout(function() {
            f.submit();
          }, 600);
        } else {
          observer.observe(iIn, {
            attributes: true,
          });
        }
        return;
      }
      var l = $.$$('#slinks > a');
      if (l.size() === 1) {
        $.openLink(l.at(0).href);
      }
    },
  });
  function canFastRedirect () {
    return !$.$('form[name=ccerure]').onsubmit && !$.$('form[name=ccerure] input[name=pwd]');
  }
})();
$.register({
  rule: {
    host: /^(www\.)?embedupload\.com$/,
    path: /^\/$/,
    query: /^\?\w{2}=\w+$/
  },
  ready: function () {
    'use strict';
    var downloadPage = $('.categories a[target=_blank]');
    $.openLink(downloadPage);
  },
});
$.register({
  rule: {
    host: /^www\.fileproject\.com\.br$/,
    path: /^\/files\/+/,
  },
  ready: function () {
    'use strict';
    var m = $.searchScripts(/<a id="down" href="([^"]+)">/);
    $.openLink(m[1]);
  },
});
$.register({
  rule: {
    host: /^(www\.)?(firedrive|putlocker)\.com$/,
    path: /^\/file\/[0-9A-F]+$/,
  },
  ready: function () {
    'use strict';
    var c = $('#confirm_form');
    c.submit();
  },
});
$.register({
  rule: {
    host: /^iori\.us$/,
  },
  ready: function () {
    'use strict';
    var a = $('#wrapper .tombol a');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: /^(www\.)?jheberg\.net$/,
    path: /^\/captcha\//,
  },
  ready: function () {
    'use strict';
    $('.dl-button').click();
  },
});
$.register({
  rule: {
    host: /^(www\.)?jheberg\.net$/,
    path: /^\/redirect\//,
  },
  ready: function () {
    'use strict';
    $.removeAllTimer();
    var matches = $.searchScripts(/'slug':\s*'([^']+)',\s*'hoster':\s*'([^']+)'/);
    var slug = matches[1];
    var hoster = matches[2];
    $.post('/get/link/', {
      'slug': slug,
      'hoster': hoster
    }).then(function(response) {
      var respJSON = _.parseJSON(response);
      $.openLink(respJSON.url);
    });
  },
});
$.register({
  rule: {
    host: /^(www\.)?larashare\.com$/,
    path: /^\/do\.php$/,
    query: /id=\d+/,
  },
  start: function () {
    'use strict';
    $.openLink(document.location.href.replace('id=','down='));
  },
});
$.register({
  rule: {
    host: /^(www\.)?maxmirror\.com$/,
    path: /^\/redirect\//,
  },
  ready: function () {
    'use strict';
    var l = $('#download_url > a');
    $.openLink(l.href);
  },
});
$.register({
  rule: {
    host: /^(www\.)?mirrorcreator\.com$/,
    path: /^\/showurl\.php$/,
  },
  ready: function () {
    'use strict';
    var a = $.$('#redirectlink a');
    if (a) {
      $.openLink(a.href);
      return;
    }
    a = $('#redirectlink > div.redirecturl');
    a = a.innerHTML;
    if (!a.match(/^http/)) {
      throw new _.AdsBypasserError('not a valid URL');
    }
    $.openLink(a);
  },
});
$.register({
  rule: {
    host: /^www\.multiupfile\.com$/,
    path: /^\/f\//,
  },
  ready: function () {
    'use strict';
    var f = $('#yw0');
    f.submit();
  },
});
$.register({
  rule: {
    host: /^mylinkgen\.com$/,
    path: /^\/p\/(.+)$/,
  },
  start: function (m) {
    'use strict';
    $.openLink('/g/' + m.path[1]);
  },
});
$.register({
  rule: {
    host: /^mylinkgen\.com$/,
    path: /^\/g\//,
  },
  ready: function () {
    'use strict';
    var a = $('#main-content a.btn.btn-default');
    $.openLink(a.href);
  },
});
$.register({
  rule: {
    host: [
      /^openload\.co$/,
      /^oload\.tv$/,
    ],
    path: /^\/f\/.*/,
  },
  start: function (m) {
    $.window.adblock = false;
    $.window.adblock2 = false;
    $.window.popAdsLoaded = true;
  },
  ready: function () {
    'use strict';
    setTimeout(function () {
      var timer = $('#downloadTimer');
      timer.style.display = 'none';
      var dlCtn = $('#realdl');
      dlCtn.style.display = 'inline-block';
      var dlBtn = $('a', dlCtn);
      var ePath = $('#streamurl');
      dlBtn.href = "/stream/" + ePath.textContent;
      var videoCtn = $.$('.videocontainer');
      if (videoCtn) {
        var overlay = $('#videooverlay', videoCtn);
        overlay.click();
        dlBtn.addEventListener('click', function (evt) {
          evt.preventDefault();
          var iframe = document.createElement('iframe');
          iframe.src = dlBtn.href;
          document.body.appendChild(iframe);
        });
        _.info(_.T('{0} -> {1}')(window.location, dlBtn.href));
        dlBtn.click();
      } else {
        $.openLink(dlBtn.href);
      }
    }, 500);
  }
});
$.register({
  rule: {
    host: /^(www\.)?upmirror\.info$/,
  },
  ready: function () {
    'use strict';
    $.setCookie('user', 'ppp');
    if ($.$('#countDownText')) {
        $.openLink(document.location.toString());
    }
  },
});
$.register({
  rule: {
    host: /^(www\.)?vidto\.me$/,
  },
  ready: function () {
    'use strict';
    var f = $('#btn_download').form;
    setTimeout(function() {
        f.submit();
    }, 6000);
  },
});
(function () {
  'use strict';
  var sUrl = '(\\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])';
  function isLink (text) {
    var rUrl = new RegExp(_.T('^{0}$')(sUrl), 'i');
    return rUrl.test(text);
  }
  function linkify (text) {
    var rUrl = new RegExp(sUrl, 'ig');
    return text.replace(rUrl, function(match) {
      return _.T("<a href='{0}'>{0}</a>")(match);
    });
  }
  $.register({
    rule: {
      host: /^(www\.)?([a-zA-Z0-9]+\.)?binbox\.io$/,
      path: /\/([a-zA-Z0-9]+)/,
      hash: /(?:#([a-zA-Z0-9]+))?/,
    },
    ready: function (m) {
      var sjcl = $.window.sjcl;
      var paste_id = m.path[1];
      var paste_salt = m.hash[1];
      var API_URL = _.T('https://binbox.io/{0}.json')(paste_id);
      $.get(API_URL, false, {
        Origin: _.none,
        Referer: _.none,
        Cookie: 'referrer=1',
        'X-Requested-With': _.none,
      }).then(function (pasteInfo) {
        pasteInfo = _.parseJSON(pasteInfo);
        if (!pasteInfo.ok) {
          throw new _.AdsBypasserError("error when getting paste information");
        }
        if (pasteInfo.paste.url) {
          $.openLink(pasteInfo.paste.url);
          return;
        }
        var raw_paste = sjcl.decrypt(paste_salt, pasteInfo.paste.text);
        if (isLink(raw_paste)) {
          $.openLink(raw_paste);
          return;
        }
        var elm = document.createElement('pre');
        elm.id = 'paste-text';
        elm.innerHTML = linkify(raw_paste);
        var frame = $('#paste-frame, #captcha-page');
        frame.parentNode.replaceChild(elm, frame);
      });
    },
  });
})();
$.register({
  rule: {
    host: /^(www\.)?pasted\.co$/,
    path: /^\/\w+$/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('#captcha_overlay');
  },
});
(function (context, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = function (context, GM) {
      var _ = require('lodash');
      var core = require('./core.js');
      var misc = require('./misc.js');
      var dispatcher = require('./dispatcher.js');
      var modules = [misc, dispatcher].map(function (v) {
        return v.call(null, context, GM);
      });
      var $ = _.assign.apply(_, modules);
      return factory(context, GM, core, $);
    };
  } else {
    factory(context, {
      openInTab: GM_openInTab,
      registerMenuCommand: GM_registerMenuCommand,
    }, context._, context.$);
  }
}(this, function (context, GM, _, $) {
  'use strict';
  var window = context.window;
  var document = window.document;
  var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
  function disableWindowOpen () {
    $.window.open = function () {
      return {
        closed: false,
      };
    };
    $.window.alert = _.nop;
    $.window.confirm = _.nop;
  }
  function disableLeavePrompt (element) {
    if (!element) {
      return;
    }
    var seal = {
      set: function () {
        _.info('blocked onbeforeunload');
      },
    };
    element.onbeforeunload = undefined;
    if (isSafari) {
      element.__defineSetter__('onbeforeunload', seal.set);
    } else {
      $.window.Object.defineProperty(element, 'onbeforeunload', {
        configurable: true,
        enumerable: false,
        get: undefined,
        set: seal.set,
      });
    }
    var oael = element.addEventListener;
    var nael = function (type) {
      if (type === 'beforeunload') {
        _.info('blocked addEventListener onbeforeunload');
        return;
      }
      return oael.apply(this, arguments);
    };
    element.addEventListener = nael;
  }
  function changeTitle () {
    document.title += ' - AdsBypasser';
  }
  function beforeDOMReady (handler) {
    _.info('working on\n%s \nwith\n%s', window.location.toString(), JSON.stringify($.config));
    disableLeavePrompt($.window);
    disableWindowOpen();
    handler.start();
  }
  function afterDOMReady (handler) {
    disableLeavePrompt($.window.document.body);
    changeTitle();
    handler.ready();
  }
  function waitDOM () {
    return _.D(function (resolve, reject) {
      if (document.readyState !== 'loading') {
        resolve();
        return;
      }
      document.addEventListener('DOMContentLoaded', function () {
        resolve();
      });
    });
  }
  $._main = function () {
    var findHandler = $._findHandler;
    delete $._main;
    delete $._findHandler;
    if (unsafeWindow.top !== unsafeWindow.self) {
      return;
    }
    GM.registerMenuCommand('AdsBypasser - Configure', function () {
      GM.openInTab('https://adsbypasser.github.io/configure.html');
    });
    var handler = findHandler();
    if (handler) {
      if ($.config.logLevel <= 0) {
        _._quiet = true;
      }
      beforeDOMReady(handler);
      waitDOM().then(function () {
        afterDOMReady(handler);
      });
      return;
    }
  };
  return $;
}));
$._main();