// ==UserScript==
// @name        e-hentai retriever
// @namespace   https://github.com/s25g5d4/e-hentai-retriever
// @description e-hentai & exhentai image url retriever
// @include     /^https?://e-hentai.org/s/.*/
// @include     /^https?://exhentai.org/s/.*/
// @version     4.4.1
// @author      s25g5d4
// @homepageURL https://github.com/s25g5d4/e-hentai-retriever
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/31703/e-hentai%20retriever.user.js
// @updateURL https://update.greasyfork.org/scripts/31703/e-hentai%20retriever.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = "#i3 a {\n  display: inline-block;\n  position: relative;\n}\n\n#i3.force-img-full-height a img {\n\twidth:auto !important;\n\theight:100vh !important;\n}\n\n.close,\n.swap,\n.page-number {\n\tposition: absolute;\n\twidth: 32px;\n\theight: 32px;\n\tmargin: 8px;\n\tz-index: 999;\n  opacity: 0;\n  transition: opacity 0.25s;\n\tbackground-color: rgba(255, 255, 255, 0.3);\n}\n\n.close {\n\ttop: 0;\n\tright: 0;\n\tbackground-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAmElEQVRYhc2USQ6AMAwD+/9PhyuRAs3igVrqCTR2m2UtL1u8Hj3sdkjz0MOCQ5o7j+iDOsTWgwyRZhMhykxliDZLEWLMmABkr9gByfuoAsQmKQPGd8mbAW7eDYHoV/NsCFxH3/6I+h8xAZ/tgMo/mDkWogOUhZiAxiEUt2gzlHUss4hOTjPJWd6y8UXSDaFWqQyUUo1Iy3lcN6p2mB7qGCwAAAAASUVORK5CYII=);\n}\n\n.swap {\n\ttop: 0;\n\tleft: 0;\n\tbackground-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAdklEQVRYhe3TwQ0AIQhE0enA7b9JS2BPezExERb9HpiEI/KiIlUqZ2I3AFCECUaYYMQI+IXokwMjhQNCCPwGmqTHWal/IJKrtsDVlA3Y17Bwnns4/lb4TzX5161lDo9UJ4eHAZmIMGCGOB4cMCKw4IAPUalszwvTfbCPlftI4QAAAABJRU5ErkJggg==);\n}\n\n.page-number {\n\tbottom: 0;\n\tright: 0;\n\tfont-size: 16px;\n\tline-height: 32px;\n\tcolor: black;\n}\n\n.close:hover,\n.swap:hover,\n.page-number:hover {\n  opacity: 1;\n}\n\n.hidden {\n\tdisplay: none !important;\n}\n\n.show-hidden {\n\tfont-size: larger;\n\tmargin-left: 5px;\n}\n";
  styleInject(css_248z);

  class Queue {
      constructor(limit, timeout = 0, delay = 0) {
          this.limit = limit;
          this.timeout = timeout;
          this.delay = delay;
          this.slot = [];
          this.q = [];
      }
      queue(executor, name) {
          const job = new Promise((resolve, reject) => {
              this.q.push({
                  name,
                  run: executor,
                  resolve,
                  reject,
                  isTimeout: false,
                  timeoutId: undefined
              });
          });
          // console.log(`queue: job ${name} queued`);
          this.dequeue();
          return job;
      }
      dequeue() {
          const { q, slot, limit, timeout, delay } = this;
          if (slot.length < limit && q.length >= 1) {
              const job = q.shift();
              slot.push(job);
              // console.log(`queue: job ${job.name} started`);
              if (timeout) {
                  job.timeoutId = window.setTimeout(() => this.jobTimeout(job), timeout);
              }
              const onFulfilled = (data) => {
                  if (job.isTimeout) {
                      return;
                  }
                  this.removeJob(job);
                  window.setTimeout(() => this.dequeue(), delay); // force dequeue() run after current dequeue()
                  if (job.timeoutId) {
                      window.clearTimeout(job.timeoutId);
                  }
                  // console.log(`queue: job ${job.name} resolved`);
                  job.resolve(data);
              };
              const onRejected = (reason) => {
                  if (job.isTimeout) {
                      return;
                  }
                  this.removeJob(job);
                  setTimeout(() => this.dequeue(), delay);
                  if (job.timeoutId) {
                      window.clearTimeout(job.timeoutId);
                  }
                  // console.log(`queue: job ${job.name} rejected`);
                  job.reject(reason);
              };
              job.run(onFulfilled, onRejected);
          }
      }
      jobTimeout(job) {
          this.removeJob(job);
          // console.log(`queue: job ${job.name} timeout`);
          job.reject(new Error(`queue: job ${job.name} timeout`));
          job = null;
      }
      removeJob(job) {
          let index = this.slot.indexOf(job);
          if (index >= 0) {
              this.slot.splice(index, 1);
              return;
          }
          index = this.q.indexOf(job);
          if (index >= 0) {
              this.q.splice(index, 1);
          }
      }
  }

  // Origin from window.fetch polyfill
  // https://github.com/github/fetch
  // License https://github.com/github/fetch/blob/master/LICENSE
  const COFetch = (input, init = {}) => {
      let request;
      if (Request.prototype.isPrototypeOf(input) && !init) {
          request = input;
      }
      else {
          request = new Request(input, init);
      }
      const headers = Object.assign({}, request.headers);
      let anonymous = true;
      if (request.credentials === 'include') {
          anonymous = false;
      }
      const onload = (resolve, reject, gmxhr) => {
          const init = {
              url: gmxhr.finalUrl || request.url,
              status: gmxhr.status,
              statusText: gmxhr.statusText,
              headers: undefined
          };
          try {
              const rawHeaders = gmxhr.responseHeaders.trim().replace(/\r\n(\s+)/g, '$1').split('\r\n').map(e => e.split(/:/));
              const header = new Headers();
              rawHeaders.forEach(e => {
                  header.append(e[0].trim(), e[1].trim());
              });
              init.headers = header;
              const res = new Response(gmxhr.response, init);
              resolve(res);
          }
          catch (e) {
              reject(e);
          }
      };
      const onerror = (resolve, reject, gmxhr) => {
          reject(new TypeError('Network request failed'));
      };
      return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
              anonymous,
              method: request.method,
              url: request.url,
              headers: headers,
              responseType: 'blob',
              data: init.body,
              onload: onload.bind(null, resolve, reject),
              onerror: onerror.bind(null, resolve, reject)
          });
      });
  };

  var domain;

  // This constructor is used to store event handlers. Instantiating this is
  // faster than explicitly calling `Object.create(null)` to get a "clean" empty
  // object (tested with v8 v4.9).
  function EventHandlers() {}
  EventHandlers.prototype = Object.create(null);

  function EventEmitter() {
    EventEmitter.init.call(this);
  }

  // nodejs oddity
  // require('events') === require('events').EventEmitter
  EventEmitter.EventEmitter = EventEmitter;

  EventEmitter.usingDomains = false;

  EventEmitter.prototype.domain = undefined;
  EventEmitter.prototype._events = undefined;
  EventEmitter.prototype._maxListeners = undefined;

  // By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.
  EventEmitter.defaultMaxListeners = 10;

  EventEmitter.init = function() {
    this.domain = null;
    if (EventEmitter.usingDomains) {
      // if there is an active domain, then attach to it.
      if (domain.active ) ;
    }

    if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
      this._events = new EventHandlers();
      this._eventsCount = 0;
    }

    this._maxListeners = this._maxListeners || undefined;
  };

  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.
  EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || isNaN(n))
      throw new TypeError('"n" argument must be a positive number');
    this._maxListeners = n;
    return this;
  };

  function $getMaxListeners(that) {
    if (that._maxListeners === undefined)
      return EventEmitter.defaultMaxListeners;
    return that._maxListeners;
  }

  EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return $getMaxListeners(this);
  };

  // These standalone emit* functions are used to optimize calling of event
  // handlers for fast cases because emit() itself often has a variable number of
  // arguments and can be deoptimized because of that. These functions always have
  // the same number of arguments and thus do not get deoptimized, so the code
  // inside them can execute faster.
  function emitNone(handler, isFn, self) {
    if (isFn)
      handler.call(self);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self);
    }
  }
  function emitOne(handler, isFn, self, arg1) {
    if (isFn)
      handler.call(self, arg1);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self, arg1);
    }
  }
  function emitTwo(handler, isFn, self, arg1, arg2) {
    if (isFn)
      handler.call(self, arg1, arg2);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self, arg1, arg2);
    }
  }
  function emitThree(handler, isFn, self, arg1, arg2, arg3) {
    if (isFn)
      handler.call(self, arg1, arg2, arg3);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self, arg1, arg2, arg3);
    }
  }

  function emitMany(handler, isFn, self, args) {
    if (isFn)
      handler.apply(self, args);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].apply(self, args);
    }
  }

  EventEmitter.prototype.emit = function emit(type) {
    var er, handler, len, args, i, events, domain;
    var doError = (type === 'error');

    events = this._events;
    if (events)
      doError = (doError && events.error == null);
    else if (!doError)
      return false;

    domain = this.domain;

    // If there is no 'error' event listener then throw.
    if (doError) {
      er = arguments[1];
      if (domain) {
        if (!er)
          er = new Error('Uncaught, unspecified "error" event');
        er.domainEmitter = this;
        er.domain = domain;
        er.domainThrown = false;
        domain.emit('error', er);
      } else if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
      return false;
    }

    handler = events[type];

    if (!handler)
      return false;

    var isFn = typeof handler === 'function';
    len = arguments.length;
    switch (len) {
      // fast cases
      case 1:
        emitNone(handler, isFn, this);
        break;
      case 2:
        emitOne(handler, isFn, this, arguments[1]);
        break;
      case 3:
        emitTwo(handler, isFn, this, arguments[1], arguments[2]);
        break;
      case 4:
        emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
        break;
      // slower
      default:
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        emitMany(handler, isFn, this, args);
    }

    return true;
  };

  function _addListener(target, type, listener, prepend) {
    var m;
    var events;
    var existing;

    if (typeof listener !== 'function')
      throw new TypeError('"listener" argument must be a function');

    events = target._events;
    if (!events) {
      events = target._events = new EventHandlers();
      target._eventsCount = 0;
    } else {
      // To avoid recursion in the case that type === "newListener"! Before
      // adding it to the listeners, first emit "newListener".
      if (events.newListener) {
        target.emit('newListener', type,
                    listener.listener ? listener.listener : listener);

        // Re-assign `events` because a newListener handler could have caused the
        // this._events to be assigned to a new object
        events = target._events;
      }
      existing = events[type];
    }

    if (!existing) {
      // Optimize the case of one listener. Don't need the extra array object.
      existing = events[type] = listener;
      ++target._eventsCount;
    } else {
      if (typeof existing === 'function') {
        // Adding the second element, need to change to array.
        existing = events[type] = prepend ? [listener, existing] :
                                            [existing, listener];
      } else {
        // If we've already got an array, just append.
        if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
      }

      // Check for listener leak
      if (!existing.warned) {
        m = $getMaxListeners(target);
        if (m && m > 0 && existing.length > m) {
          existing.warned = true;
          var w = new Error('Possible EventEmitter memory leak detected. ' +
                              existing.length + ' ' + type + ' listeners added. ' +
                              'Use emitter.setMaxListeners() to increase limit');
          w.name = 'MaxListenersExceededWarning';
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          emitWarning(w);
        }
      }
    }

    return target;
  }
  function emitWarning(e) {
    typeof console.warn === 'function' ? console.warn(e) : console.log(e);
  }
  EventEmitter.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.prependListener =
      function prependListener(type, listener) {
        return _addListener(this, type, listener, true);
      };

  function _onceWrap(target, type, listener) {
    var fired = false;
    function g() {
      target.removeListener(type, g);
      if (!fired) {
        fired = true;
        listener.apply(target, arguments);
      }
    }
    g.listener = listener;
    return g;
  }

  EventEmitter.prototype.once = function once(type, listener) {
    if (typeof listener !== 'function')
      throw new TypeError('"listener" argument must be a function');
    this.on(type, _onceWrap(this, type, listener));
    return this;
  };

  EventEmitter.prototype.prependOnceListener =
      function prependOnceListener(type, listener) {
        if (typeof listener !== 'function')
          throw new TypeError('"listener" argument must be a function');
        this.prependListener(type, _onceWrap(this, type, listener));
        return this;
      };

  // emits a 'removeListener' event iff the listener was removed
  EventEmitter.prototype.removeListener =
      function removeListener(type, listener) {
        var list, events, position, i, originalListener;

        if (typeof listener !== 'function')
          throw new TypeError('"listener" argument must be a function');

        events = this._events;
        if (!events)
          return this;

        list = events[type];
        if (!list)
          return this;

        if (list === listener || (list.listener && list.listener === listener)) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else {
            delete events[type];
            if (events.removeListener)
              this.emit('removeListener', type, list.listener || listener);
          }
        } else if (typeof list !== 'function') {
          position = -1;

          for (i = list.length; i-- > 0;) {
            if (list[i] === listener ||
                (list[i].listener && list[i].listener === listener)) {
              originalListener = list[i].listener;
              position = i;
              break;
            }
          }

          if (position < 0)
            return this;

          if (list.length === 1) {
            list[0] = undefined;
            if (--this._eventsCount === 0) {
              this._events = new EventHandlers();
              return this;
            } else {
              delete events[type];
            }
          } else {
            spliceOne(list, position);
          }

          if (events.removeListener)
            this.emit('removeListener', type, originalListener || listener);
        }

        return this;
      };
      
  // Alias for removeListener added in NodeJS 10.0
  // https://nodejs.org/api/events.html#events_emitter_off_eventname_listener
  EventEmitter.prototype.off = function(type, listener){
      return this.removeListener(type, listener);
  };

  EventEmitter.prototype.removeAllListeners =
      function removeAllListeners(type) {
        var listeners, events;

        events = this._events;
        if (!events)
          return this;

        // not listening for removeListener, no need to emit
        if (!events.removeListener) {
          if (arguments.length === 0) {
            this._events = new EventHandlers();
            this._eventsCount = 0;
          } else if (events[type]) {
            if (--this._eventsCount === 0)
              this._events = new EventHandlers();
            else
              delete events[type];
          }
          return this;
        }

        // emit removeListener for all listeners on all events
        if (arguments.length === 0) {
          var keys = Object.keys(events);
          for (var i = 0, key; i < keys.length; ++i) {
            key = keys[i];
            if (key === 'removeListener') continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners('removeListener');
          this._events = new EventHandlers();
          this._eventsCount = 0;
          return this;
        }

        listeners = events[type];

        if (typeof listeners === 'function') {
          this.removeListener(type, listeners);
        } else if (listeners) {
          // LIFO order
          do {
            this.removeListener(type, listeners[listeners.length - 1]);
          } while (listeners[0]);
        }

        return this;
      };

  EventEmitter.prototype.listeners = function listeners(type) {
    var evlistener;
    var ret;
    var events = this._events;

    if (!events)
      ret = [];
    else {
      evlistener = events[type];
      if (!evlistener)
        ret = [];
      else if (typeof evlistener === 'function')
        ret = [evlistener.listener || evlistener];
      else
        ret = unwrapListeners(evlistener);
    }

    return ret;
  };

  EventEmitter.listenerCount = function(emitter, type) {
    if (typeof emitter.listenerCount === 'function') {
      return emitter.listenerCount(type);
    } else {
      return listenerCount.call(emitter, type);
    }
  };

  EventEmitter.prototype.listenerCount = listenerCount;
  function listenerCount(type) {
    var events = this._events;

    if (events) {
      var evlistener = events[type];

      if (typeof evlistener === 'function') {
        return 1;
      } else if (evlistener) {
        return evlistener.length;
      }
    }

    return 0;
  }

  EventEmitter.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
  };

  // About 1.5x faster than the two-arg version of Array#splice().
  function spliceOne(list, index) {
    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
      list[i] = list[k];
    list.pop();
  }

  function arrayClone(arr, i) {
    var copy = new Array(i);
    while (i--)
      copy[i] = arr[i];
    return copy;
  }

  function unwrapListeners(arr) {
    var ret = new Array(arr.length);
    for (var i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }
    return ret;
  }

  class EhRetriever extends EventEmitter {
      constructor(url, html) {
          super();
          const testEXHentaiUrl = /^https?:\/\/(?:e-|ex)hentai\.org\//;
          if (typeof url !== 'string') {
              throw new TypeError('invalid `url`, expected a string');
          }
          if (!testEXHentaiUrl.test(url)) {
              throw new TypeError(`invalid url: ${url}`);
          }
          this.url = url;
          this.html = html;
          this.gallery = { gid: '', token: '' };
          this.referer = url;
          this.showkey = '';
          this.ehentaiHost = testEXHentaiUrl.exec(url)[0].slice(0, -1);
          this.q = new Queue(3, 3000, 1000);
          this.pages = this.init();
          this.pages.then(() => this.emit('ready'));
      }
      async init() {
          if (!this.html) {
              this.html = await this.fetch(this.url).then(res => res.text());
          }
          const galleryURL = this.html.match(/hentai\.org\/g\/(\d+)\/([a-z0-9]+)/i);
          const showkey = this.html.match(/showkey="([^"]+)"/i);
          if (galleryURL) {
              this.gallery.gid = galleryURL[1];
              this.gallery.token = galleryURL[2];
          }
          else {
              throw new Error("Can't get gallery URL");
          }
          if (showkey) {
              this.showkey = showkey[1];
          }
          else {
              throw new Error("Can't get showkey");
          }
          return await this.getAllPageURL();
      }
      async getAllPageURL() {
          const { ehentaiHost, gallery: { gid, token } } = this;
          const firstPage = await this.fetch(`${ehentaiHost}/g/${gid}/${token}`).then(res => res.text());
          let pageNum;
          const pageLinksTable = firstPage.match(/<table[^>]*class="ptt"[^>]*>((?:[^<]*)(?:<(?!\/table>)[^<]*)*)<\/table>/);
          if (pageLinksTable) {
              const pageLinks = pageLinksTable[1].match(/g\/[^/]+\/[^/]+\/\?p=\d+/g);
              if (pageLinks) {
                  pageNum = Math.max.apply(null, pageLinks.map(e => parseInt(/\d+$/.exec(e)[0], 10)));
              }
              else {
                  pageNum = 0;
              }
          }
          else {
              throw new Error('Cant get page numbers');
          }
          const allPages = await Promise.all(Array(pageNum).fill(undefined).map((e, i) => {
              return this.fetch(`${ehentaiHost}/g/${gid}/${token}/?p=${i + 1}`).then(res => res.text());
          }));
          allPages.unshift(firstPage);
          return allPages
              .map(p => this.parsePage(p))
              .reduce((p, c) => p.concat(c), []); // 2d array to 1d
      }
      parsePage(page) {
          const gdtMatcher = /<div[^>]*id="gdt"[^>]*>/g;
          gdtMatcher.exec(page);
          const gtbMatcher = /<div[^>]*class="gtb"[^>]*>/g;
          gtbMatcher.lastIndex = gdtMatcher.lastIndex;
          gtbMatcher.exec(page);
          const gdtContent = page.substring(gdtMatcher.lastIndex, gtbMatcher.lastIndex);
          return Array.from(gdtContent.matchAll(/s\/(\w+)\/\d+-(\d+)/g)).map(([, imgkey, page]) => ({ imgkey, page: parseInt(page, 10) }));
      }
      fetch(url, options = {}) {
          if (typeof url !== 'string') {
              return Promise.reject(new TypeError('invalid `url`, expected a string'));
          }
          if (url.search(/^https?:\/\//) < 0) {
              return Promise.reject(new TypeError(`invalid url: ${url}`));
          }
          const cofetchOptions = {
              method: 'GET',
              credentials: 'include',
              headers: {
                  'User-Agent': navigator.userAgent,
                  Referer: this.referer
              }
          };
          for (const key of Object.keys(options)) {
              if (key === 'headers') {
                  Object.assign(cofetchOptions.headers, options.headers);
              }
              else {
                  cofetchOptions[key] = options[key];
              }
          }
          return this.q.queue((resolve, reject) => {
              COFetch(url, cofetchOptions).then(resolve).catch(reject);
          }, `Fetch ${url} ${JSON.stringify(cofetchOptions)}`);
      }
      async retrieve(start = 0, stop = -1) {
          const pages = await this.pages;
          if (start < 0 || start >= pages.length || isNaN(start)) {
              throw new RangeError(`invalid start number: ${start}`);
          }
          if (stop < 0) {
              stop = pages.length - 1;
          }
          else if (stop < start || stop >= pages.length || isNaN(stop)) {
              throw new RangeError(`invalid stop number: ${stop}, start: ${start}`);
          }
          const retrievePages = pages.slice(start, stop + 1);
          const loadPage = async (e) => {
              if (e.imgsrc && e.filename) {
                  return Promise.resolve(e);
              }
              const fetchPage = await this.fetch(`${this.ehentaiHost}/api.php`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  // assign e = {'imgkey': ..., 'page': ...} to object literal {'method': ..., 'gid': ..., 'showkey': ...}
                  // does not modify e
                  body: JSON.stringify(Object.assign({
                      method: 'showpage',
                      gid: this.gallery.gid,
                      showkey: this.showkey
                  }, e))
              }).then(res => res.json());
              this.emit('load', {
                  current: e.page - start,
                  total: stop - start + 1
              });
              return fetchPage;
          };
          const imagePages = await Promise.all(retrievePages.map(loadPage));
          imagePages.forEach((e, i) => {
              retrievePages[i].filename = e.i.match(/>([^:]+):/)[1].trim();
              retrievePages[i].imgsrc = e.i3.match(/src="([^"]+)"/)[1];
              retrievePages[i].failnl = new Set([e.i6.match(/nl\('([^']+)'/)[1]]);
              retrievePages[i].style = e.i3.match(/style="([^"]+)"/)[1];
              retrievePages[i].url = e.s;
          });
          return retrievePages;
      }
      async fail(index) {
          const pages = await this.pages;
          const failPage = pages[index - 1];
          const failnl = [...failPage.failnl.values()].map(e => `nl=${e}`).join('&');
          const res = await this.fetch(`${this.ehentaiHost}/${failPage.url}?${failnl}`).then(res => res.text());
          const parsed = res.match(/<img[^>]*id="img"[^>]*src="([^"]+)"[^>]*.*onclick="return nl\('([^']+)'\)/i);
          if (parsed) {
              failPage.imgsrc = parsed[1];
              failPage.failnl.add(parsed[2]);
              return failPage;
          }
          return null;
      }
  }

  const LoadTimeout = 10000;
  // helper functions
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const buttonsFragment = document.createDocumentFragment();
  const buttonReverse = document.createElement('button');
  const buttonDoubleFrame = document.createElement('button');
  const buttonRetrieve = document.createElement('button');
  const buttonRange = document.createElement('button');
  const buttonFullHeight = document.createElement('button');
  buttonsFragment.appendChild(buttonReverse);
  buttonsFragment.appendChild(buttonDoubleFrame);
  buttonsFragment.appendChild(buttonFullHeight);
  buttonsFragment.appendChild(buttonRetrieve);
  buttonsFragment.appendChild(buttonRange);
  buttonReverse.textContent = 'Reverse';
  buttonDoubleFrame.textContent = 'Double Frame';
  buttonRetrieve.textContent = 'Retrieve!';
  buttonRange.textContent = 'Set Range';
  buttonFullHeight.textContent = 'View Height';
  $('#i1').insertBefore(buttonsFragment, $('#i2'));
  let ehentaiResize;
  let originalWidth;
  let ehr;
  let showHiddenImageLink = false;
  const reload = (event) => {
      event.stopPropagation();
      event.preventDefault();
      const target = event.target;
      if (target.dataset.locked === 'true') {
          return;
      }
      target.dataset.locked = 'true';
      ehr.fail(parseInt(target.dataset.page, 10)).then(imgInfo => {
          target.src = imgInfo.imgsrc;
          target.parentElement.href = imgInfo.imgsrc;
          target.dataset.locked = 'false';
      });
  };
  const showImage = (event) => {
      event.stopPropagation();
      event.preventDefault();
      $$('#i3 a').forEach(e => {
          e.classList.remove('hidden');
      });
      event.target.remove();
      showHiddenImageLink = false;
  };
  const hideImage = (event) => {
      event.stopPropagation();
      event.preventDefault();
      event.target.parentElement.classList.add('hidden');
      if (!showHiddenImageLink) {
          const showHiddenImage = document.createElement('a');
          showHiddenImage.href = '';
          showHiddenImage.textContent = 'show hidden image';
          showHiddenImage.classList.add('show-hidden');
          showHiddenImage.addEventListener('click', showImage);
          buttonRetrieve.insertAdjacentElement('afterend', showHiddenImage);
          showHiddenImageLink = true;
      }
  };
  const swapImage = (event) => {
      event.stopPropagation();
      event.preventDefault();
      const right = event.target.parentElement;
      const left = right.previousElementSibling;
      if (left) {
          left.parentElement.insertBefore(right, left);
      }
  };
  const scrollNextImage = (event) => {
      if (event.keyCode !== 9) {
          return;
      }
      event.preventDefault();
      const bodyOffset = document.body.getBoundingClientRect().top;
      const pageY = window.pageYOffset;
      const imgs = Array.from($$('#i3 a img'));
      const isLast = !imgs.some((e, i) => {
          const imgOffset = e.getBoundingClientRect().top - bodyOffset;
          if (pageY - imgOffset < -1) {
              window.scrollTo(0, imgOffset);
              return true;
          }
      });
      if (isLast) {
          window.scrollTo(0, imgs[0].getBoundingClientRect().top - bodyOffset);
      }
  };
  buttonReverse.addEventListener('click', event => {
      const i3 = $('#i3');
      const imgs = $$('#i3 > a[data-page]');
      if (buttonReverse.textContent === 'Reverse') {
          buttonReverse.textContent = 'Original Order';
          imgs
              .sort((a, b) => a.offsetTop - b.offsetTop)
              .reduce((p, c) => {
              const l = p.at(-1);
              if (!l || l.at(-1).offsetTop !== c.offsetTop) {
                  return [...p, [c]];
              }
              l.push(c);
              return p;
          }, [])
              .flatMap(e => e.reverse())
              .forEach(e => i3.appendChild(e));
      }
      else {
          buttonReverse.textContent = 'Reverse';
          imgs
              .sort((a, b) => parseInt(a.dataset.page, 10) - parseInt(b.dataset.page, 10))
              .forEach(e => i3.appendChild(e));
      }
  });
  buttonDoubleFrame.addEventListener('click', event => {
      if (!ehentaiResize) {
          try {
              ehentaiResize = unsafeWindow.onresize;
          }
          catch (e) {
              console.log(e);
          }
      }
      const imgWidths = $$('#i3 a:not(.hidden) img').map(e => e.getBoundingClientRect().width);
      const avg = imgWidths.reduce((p, c) => p + c) / imgWidths.length;
      const filtered = imgWidths.filter(v => (v < avg * 1.5 && v > avg * 0.5));
      const filteredMax = Math.max.apply(null, filtered);
      if (!originalWidth) {
          originalWidth = parseInt($('#i1').style.width, 10);
      }
      if (buttonDoubleFrame.textContent === 'Double Frame') {
          buttonDoubleFrame.textContent = 'Reset Frame';
          try {
              unsafeWindow.onresize = null;
          }
          catch (e) {
              console.log(e);
          }
          $('#i1').style.maxWidth = (filteredMax * 2 + 20) + 'px';
          $('#i1').style.width = (filteredMax * 2 + 20) + 'px';
      }
      else {
          buttonDoubleFrame.textContent = 'Double Frame';
          try {
              unsafeWindow.onresize = ehentaiResize;
              ehentaiResize();
          }
          catch (e) {
              console.log(e);
              $('#i1').style.maxWidth = originalWidth + 'px';
              $('#i1').style.width = originalWidth + 'px';
          }
      }
  });
  buttonRetrieve.addEventListener('click', event => {
      buttonRetrieve.setAttribute('disabled', '');
      buttonRange.setAttribute('disabled', '');
      buttonRetrieve.textContent = 'Initializing...';
      if (!ehr) {
          ehr = new EhRetriever(location.href, document.body.innerHTML);
      }
      ehr.on('ready', () => {
          buttonRetrieve.textContent = `Ready to retrieve`;
      });
      ehr.on('load', (progress) => {
          buttonRetrieve.textContent = `Retrieving ${progress.current}/${progress.total}`;
      });
      let retrieve;
      if ($('#ehrstart')) {
          const start = parseInt($('#ehrstart').value, 10);
          const stop = parseInt($('#ehrstop').value, 10);
          const pageNumMax = parseInt($('div.sn').textContent.match(/\/\s*(\d+)/)[1], 10);
          if (stop < start || start <= 0 || start > pageNumMax || stop > pageNumMax) {
              window.alert(`invalid range: ${start} - ${stop}, accepted range: 1 - ${pageNumMax}`);
              buttonRetrieve.textContent = 'Retrieve!';
              buttonRetrieve.removeAttribute('disabled');
              return;
          }
          retrieve = ehr.retrieve(start - 1, stop - 1);
          $('#ehrsetrange').remove();
      }
      else {
          retrieve = ehr.retrieve();
          buttonRange.remove();
      }
      retrieve.then(pages => {
          $('#i3 a').remove();
          const template = document.createElement('template');
          template.innerHTML = pages
              .map(e => `
        <a href="${e.imgsrc}" data-page="${e.page}">
          <img src="${e.imgsrc}" style="${e.style}" data-page="${e.page}" data-locked="false" />
          <div class="close"></div>
          <div class="swap"></div>
          <div class="page-number">${e.page}</div>
        </a>`)
              .join('');
          template.content.querySelectorAll('img').forEach(e => {
              e.addEventListener('error', function onError(event) {
                  e.removeEventListener('error', onError);
                  reload(event);
              });
              let timeout;
              {
                  timeout = window.setTimeout(() => {
                      console.log(`timeout: page ${e.dataset.page}`);
                      const clickEvent = new MouseEvent('click', {
                          bubbles: true,
                          cancelable: true,
                          view: window
                      });
                      e.dispatchEvent(clickEvent);
                  }, LoadTimeout);
                  e.addEventListener('load', function onload() {
                      e.removeEventListener('load', onload);
                      clearTimeout(timeout);
                  });
              }
          });
          $('#i3').appendChild(template.content);
          $('#i3').addEventListener('click', event => {
              if (event.target.nodeName === 'IMG') {
                  reload(event);
              }
              else if (event.target.classList.contains('close')) {
                  hideImage(event);
              }
              else if (event.target.classList.contains('swap')) {
                  swapImage(event);
              }
              else if (event.target.classList.contains('page-number')) {
                  event.preventDefault();
                  event.stopPropagation();
              }
          });
          buttonRetrieve.textContent = 'Done!';
          buttonDoubleFrame.removeAttribute('disabled');
          buttonFullHeight.removeAttribute('disabled');
          document.onkeydown = null;
          document.addEventListener('keydown', scrollNextImage);
      }).catch(e => { console.log(e); });
  });
  buttonRange.addEventListener('click', event => {
      // override e-hentai's viewing shortcut
      document.onkeydown = undefined;
      const pageNum = $('div.sn').textContent.match(/(\d+)\s*\/\s*(\d+)/).slice(1);
      buttonRange.insertAdjacentHTML('afterend', `<span id="ehrsetrange"><input type="number" id="ehrstart" value="${pageNum[0]}" min="1" max="${pageNum[1]}"> - <input type="number" id="ehrstop" value="${pageNum[1]}" min="1" max="${pageNum[1]}"></span>`);
      buttonRange.remove();
  });
  buttonFullHeight.addEventListener('click', event => {
      $('#i3').classList.toggle('force-img-full-height');
  });

})();
