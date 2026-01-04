// ==UserScript==
// @name         Itsnotlupus' MiddleMan
// @namespace    Itsnotlupus Industries
// @version      1.5.2
// @description  inspect/intercept/modify any network requests
// @author       Itsnotlupus
// @license      MIT
// ==/UserScript==

/* global globalThis */

const middleMan = (function(window) {

  /**
   * A small class that lets you register middleware for Fetch/XHR traffic.
   *
   */
  class MiddleMan {
    routes = {
      Request: {},
      Response: {}
    };
    regexps = {};

    addHook(route, {requestHandler, responseHandler}) {
      if (requestHandler) {
        this.routes.Request[route]??=[];
        this.routes.Request[route].push(requestHandler);
      }
      if (responseHandler) {
        this.routes.Response[route]??=[];
        this.routes.Response[route].push(responseHandler);
      }
      this.regexps[route]??=this.routeToRegexp(route);
    }

    removeHook(route, {requestHandler, responseHandler}) {
      if (requestHandler && this.routes.Request[route]?.includes(requestHandler)) {
        const i = this.routes.Request[route].indexOf(requestHandler);
        this.routes.Request[route].splice(i,1);
      }
      if (responseHandler && this.routes.Response[route]?.includes(responseHandler)) {
        const i = this.routes.Response[route].indexOf(responseHandler);
        this.routes.Response[route].splice(i,1);
      }
    }

    // 2 modes: start with '/' => full regexp, otherwise we only recognize '*" as a wildcard.
    routeToRegexp(path) {
      const r = path instanceof RegExp ? path :
        path.startsWith('/') ?
          path.split('/').slice(1,-1).join('') :
          ['^', ...path.split(/([*])/).map((chunk, i) => i%2==0 ? chunk.replace(/([^a-zA-Z0-9])/g, "\\$1") : '.'+chunk), '$'].join('');
      return new RegExp(r);
    }

    /**
     * Call this with a Request or a Response, and it'll loop through
     * each relevant hook to inspect and/or transform it.
     */
    async process(type, req, res, err) {
      const name = type.name;
      const routes = this.routes[name], hooks = [];
      Object.keys(routes).forEach(k => {
        if (req.url.match(this.regexps[k]) || res?.url.match(this.regexps[k])) hooks.push(...routes[k]);
      });
      for (const hook of hooks) {
        try {
          switch (type) {
            case Request: if (req instanceof type) req = await hook(req.clone()) ?? req; break;
            case Response: if (res instanceof type || err) res = await hook(req.clone(), res?.clone(), err) ?? res; break;
          }
        } catch (e) {
          console.error(`MiddleMan: Uncaught exception in ${name} hook for ${req.method??''} ${req.url}!`, e);
        }
      }
      return type == Request ? req : res;
    }
  }

  // The only instance we'll need
  const middleMan = new MiddleMan;

  // A wrapper for fetch() that plugs into middleMan.
  const _fetch = window.fetch;
  async function fetch(resource, options) {
    const request = new Request(resource, options);
    const result = await middleMan.process(Request, request);
    const clonedResult = result.clone();
    try {
      const response = result instanceof Request ? await _fetch(result) : result;
      return middleMan.process(Response, clonedResult, response);
    } catch (err) {
      const otherResponse = middleMan.process(Response, clonedResult, undefined, err);
      if (otherResponse instanceof Response) {
        return otherResponse;
      }
      throw err;
    }
  }

  /**
   * Polyfill a subset of EventTarget, for the sole purpose of being used in the XHR polyfill below.
   * Primarily written to allow Safari to extend it without tripping on itself.
   * Various liberties were taken.
   * We call ourselves XMLHttpRequestEventTarget because that's a thing, and some well-meaning libraries (zone.js)
   * feel compelled to grab methods from this object and call them on XHR instances, so let's make them happy.
   */
  class XMLHttpRequestEventTarget {
    #listeners = {};
    #events = {};
    #setEvent(type, f) {
      if (this.#events[type]) this.removeEventListener(type, this.#events[type]);
      this.#events[type] = typeof f == 'function' ? f : null;
      if (this.#events[type]) this.addEventListener(type, this.#events[type]);
    }
    #getEvent(type) {
      return this.#events[type];
    }
    constructor(events = []) {
      events.forEach(type => {
        Object.defineProperty(this, "on"+type, {
          get() { return this.#getEvent(type); },
          set(f) { this.#setEvent(type, f); }
        });
      });
    }
    addEventListener(type, listener, options = {}) {
      if (options === true) { options = { capture: true }; }
      this.#listeners[type]??=[];
      this.#listeners[type].push({ listener, options });
      options.signal?.addEventListener?.('abort', () => this.removeEventListener(type, listener, options));
    }
    removeEventListener(type, listener, options = {}) {
      if (options === true) { options = { capture: true }; }
      if (!this.#listeners[type]) return;
      const index = this.#listeners[type].findIndex(slot => slot.listener === listener && slot.options.capture === options.capture);
      if (index > -1) {
        this.#listeners[type].splice(index,1);
      }
    }
    dispatchEvent(event) {
      // no capturing, no bubbling, no preventDefault, no stopPropagation, and a general disdain for most of the event featureset.
      const listeners = this.#listeners[event.type];
      if (!listeners) return;
      // since I can't set event.target, or generally do anything useful with an Event instance, let's Proxy it.
      let immediateStop = false;
      const eventProxy = new Proxy(event, {
        get: (event, prop) => {
          switch (prop) {
            case "target":
            case "currentTarget":
              return this;
            case "isTrusted":
              return true; // you betcha
            case "stopImmediatePropagation":
              return () => { immediateStop = true };
            default: {
              const val = Reflect.get(event, prop);
              return typeof val =='function' ? new Proxy(val, {
                apply(fn, _, args) {
                  return Reflect.apply(fn, event, args);
                }
              }) : val;
            }
          }
        }
      });
      listeners.forEach(({listener, options}) => {
        if (immediateStop) return;
        if (options.once) this.removeEventListener(eventProxy.type, listener, options);
        try {
          listener.call(this, eventProxy);
        } catch (e) {
          // We can't match EventTarget::dispatchEvent throwing behavior in pure JS. oh well. fudge the timing and keep on trucking.
          setTimeout(() =>{ throw e });
        }
      });
      return true;
    }
    get [Symbol.toStringTag]() {
      return 'XMLHttpRequestEventTarget';
    }
    static toString = ()=> 'function XMLHttpRequestEventTarget() { [native code] }';
  }
  XMLHttpRequestEventTarget.prototype.__proto__ = EventTarget.prototype;

  class XMLHttpRequestUpload extends XMLHttpRequestEventTarget {
    constructor() {
      super(["loadstart","progress","abort","error","load","timeout","loadend"]);
    }
    get [Symbol.toStringTag]() {
      return 'XMLHttpRequestUpload';
    }
    static toString = ()=> 'function XMLHttpRequestUpload() { [native code] }';
  }

  /**
   * An XMLHttpRequest polyfill written on top of fetch().
   * Nothing special here, but this allows MiddleMan to work on XHR too.
   *
   * A few gotchas:
   * - synchronous xhr is not implemented. all my homies hate sync xhr anyway.
   * - https://xhr.spec.whatwg.org/ was gently perused, and https://wpt.live/tools/runner/index.html 's output was pondered.
   * - In short, this is not spec-compliant. But it can work on a bunch of websites anyway.
   */
  class XMLHttpRequest extends XMLHttpRequestEventTarget {
    #readyState;

    #requestOptions = {};
    #requestURL;
    #abortController;
    #timeout = 0;
    #responseType = '';
    #mimeTypeOverride = null;

    #response;
    #responseText;
    #responseXML;
    #responseAny;
    #status; // a response.status override for error conditions.
    #finalMimeType;
    #finalResponseType;
    #finalResponseCharset;
    #finalContentType; // mimetype + charset
    #textDecoder;

    #dataLengthComputable = false;
    #dataLoaded = 0;
    #dataTotal = 0;

    #uploadEventTarget;
    #emitUploadErrorEvent;

    #errorEvent;
    #sendFlag;

    UNSENT = 0;
    OPENED = 1;
    HEADERS_RECEIVED = 2;
    LOADING = 3;
    DONE = 4;
    static UNSENT = 0;
    static OPENED = 1;
    static HEADERS_RECEIVED = 2;
    static LOADING = 3;
    static DONE = 4;

    constructor() {
      super(['abort','error','load','loadend','loadstart','progress','readystatechange','timeout']);
      this.#readyState = 0;
    }

    get readyState() {
      return this.#readyState;
    }
    #assertReadyState(...validValues) {
      if (!validValues.includes(this.#readyState)) {
        throw new new DOMException("", "InvalidStateError");
      }
    }
    #updateReadyState(value) {
      this.#readyState = value;
      this.#emitEvent("readystatechange");
    }

    // Request setup
    open(method, url, async, user, password) {
      this.#requestOptions.method = method.toString().toUpperCase();
      this.#requestOptions.headers = new Headers()
      this.#requestURL = url;
      this.#abortController = null;
      this.#response = null;
      this.#responseText = '';
      this.#responseAny = null;
      this.#responseXML = null;
      this.#status = null;
      this.#dataLengthComputable = false;
      this.#dataLoaded = 0;
      this.#dataTotal = 0;
      this.#sendFlag = false;

      if (async === false) {
        throw new Error("Synchronous XHR is not supported.");
        // I suspect that if I just let those run asynchronously, it'd be fine 80%+ of the time.
        // on the other hand, it's been deprecated for many years, and seems to be primarily used
        // for user tracking by devs who can't be bothered to hit newer APIs. so..
      }
      if (user || password) {
        this.#requestOptions.headers.set('Authorization', 'Basic '+btoa(`${user??''}:${password??''}`));
      }
      this.#updateReadyState(1);
    }
    setRequestHeader(header, value) {
      this.#assertReadyState(1);
      if (this.#sendFlag) throw new DOMException("", "InvalidStateError");
      this.#requestOptions.headers.set(header, value);
    }
    overrideMimeType(mimeType) {
      this.#assertReadyState(0,1,2);
      this.#mimeTypeOverride = mimeType;
    }
    set responseType(type) {
      this.#assertReadyState(0,1,2);
      if (!["","arraybuffer","blob","document","json","text"].includes(type)) {
        console.warn(`The provided value '${type}' is not a valid enum value of type XMLHttpRequestResponseType.`);
        return;
      }
      this.#responseType = type;
    }
    get responseType() {
      return this.#responseType;
    }
    set timeout(value) {
      const ms = isNaN(Number(value)) ? 0 : Math.floor(Number(value));
      this.#timeout = value;
    }
    get timeout() {
      return this.#timeout;
    }
    get upload() {
      Promise.resolve(()=>{ throw new Error("XMLHttpRequestUpload is not implemented."); });
      if (!this.#uploadEventTarget) {
        this.#uploadEventTarget = new XMLHttpRequestUpload();
      }
      return this.#uploadEventTarget;
      // if the request has a body, we'll dispatch events on the upload event target in the next method.
    }
    #trackUploadEvents() {

      const USE_READABLE_STREAM = false;
      let loaded =0, total = 0, hasSize = false, error = false;;
      const emitUploadEvent = type => {
        this.#uploadEventTarget.dispatchEvent(new ProgressEvent(type, {
          lengthComputable: hasSize,
          loaded,
          total
        }));
      }

      if (!USE_READABLE_STREAM) {
        // No good way to track upload progress with fetch() yet. Fake something.
        loaded = total;
        this.addEventListener("progress", () => {
          emitUploadEvent('progress');
          emitUploadEvent('load');
          emitUploadEvent('loadend');
        }, { once: true });
        emitUploadEvent('loadstart');
        return;
      }

      this.#emitUploadErrorEvent = type => {
        error = true;
        hasSize = false;
        loaded = total = 0;
        emitUploadEvent(type);
        emitUploadEvent("loadend");
      };
      const trackBlob = (blob) => {
        total = blob.size;
        hasSize = total>0;
        this.#requestOptions.duplex = "half";
        this.#requestOptions.body = blob.stream().pipeThrough(new TransformStream({
          start(controller) {
          },
          transform(chunk, controller) {
            if (error) return;
            controller.enqueue(chunk);
            loaded += chunk.byteLength;
            emitUploadEvent('progress');
          },
          flush(controller) {
            if (error) return;
            emitUploadEvent('progress');
            emitUploadEvent('load');
            emitUploadEvent('loadend');
          }
        }));
        emitUploadEvent('loadstart');
      }
      const { body } = this.#requestOptions;
      if (body instanceof FormData || body instanceof URLSearchParams) {
        return new Response(this.#requestOptions.body).blob().then(blob => trackBlob(blob));
      } else {
        trackBlob(new Blob([body??'']));
      }
    }
    set withCredentials(flag) {
      if (this.#sendFlag) throw new DOMException("", "InvalidStateError");
      this.#requestOptions.credentials = flag ? "include" : "same-origin";
    }
    get withCredentials() {
      return this.#requestOptions.credentials == "include";
    }
    send(body = null) {
      this.#assertReadyState(1);
      if (this.#requestOptions.method != 'GET' && this.#requestOptions.method != 'HEAD') {
        switch (true) {
          case body instanceof Document: this.#requestOptions.body = body.documentElement.outerHTML; break;
          case body instanceof Blob:
          case body instanceof ArrayBuffer:
          case ArrayBuffer.isView(body): // true for TypedArray and DataView
          case body instanceof FormData:
          case body instanceof URLSearchParams:
            this.#requestOptions.body = body;
            break;
          default:
            this.#requestOptions.body = (body??'')+'';
            break;
        }
      }
      if (this.#sendFlag) throw new DOMException("", "InvalidStateError");
      this.#sendFlag = true;
      const innerSend = () => {
        const request = new Request(this.#requestURL, this.#requestOptions);
        this.#abortController = new AbortController();
        const signal = this.#abortController.signal;
        if (this.#timeout) {
          setTimeout(()=> this.#timedOut(), this.#timeout);
        }
        this.#emitEvent("loadstart");
        (async ()=> {
          let response;
          try {
            this.#response = await fetch(request, { signal });
            let finalResponseType = this.#responseType;
            let mimeType = this.#mimeTypeOverride ?? this.#response.headers.get('content-type') ?? 'text/xml';
            this.#finalMimeType = mimeType.split(';')[0].trim() ; // header parsing is still iffy
            this.#finalResponseCharset = mimeType.match(/;charset=(?<charset>[^;]*)/i)?.groups?.charset ?? "";
            try {
              this.#textDecoder = new TextDecoder(this.#finalResponseCharset)
            } catch {
              // garbage charset seen. you get utf-8 and you like it.
              this.#textDecoder = new TextDecoder;
            }
            if (!finalResponseType) {
              finalResponseType = ([ 'text/html', 'text/xml', 'application/xml'].includes(this.#finalMimeType) || this.#finalMimeType.endsWith("+xml")) ? 'document' : 'text';
            }
            this.#finalResponseType = finalResponseType;
            this.#finalContentType = (this.#finalMimeType || 'text/xml') + (this.#finalResponseCharset ? ';charset='+this.#finalResponseCharset : '')
            this.#updateReadyState(2);
            const isNotCompressed = this.#response.type == 'basic' && !this.#response.headers.get('content-encoding');
            if (isNotCompressed) {
              this.#dataTotal = this.#response.headers.get('content-length') ?? 0;
              this.#dataLengthComputable = this.#dataTotal !== 0;
            }
            await this.#processResponse();
          } catch (e) {
            return this.#error();
          } finally {
            this.#sendFlag = false;
          }
         })();
      }
      if (this.#uploadEventTarget && this.#requestOptions.body) {
        // user asked for .upload, and the request has a body. track upload events.
        const promise = this.#trackUploadEvents(this.#requestOptions);
        // sadly, some body types cannot be handled synchronously (FormData and URLSearchParams) when using ReadableStream to track upload progress.
        // those turn this flow asynchronous (and break some expectations around sync state immediately after send() )
        if (promise) return promise.then(innerSend);
      }
      innerSend();
    }
    /**
     * Spec breakage: When readyState == 1, abort will happen asynchronously.
     * (ie nothing will have changed when this function returns.)
     */
    abort() {
      this.#abortController?.abort();
      this.#errorEvent = "abort";
      if (this.#readyState > 1) { // too late to send signal abort the fetch itself, resolve manually.
        this.#error(true);
      }
    }
    #timedOut() {
      this.#abortController?.abort(`XHR aborted due to timeout after ${this.#timeout} ms.`);
      this.#errorEvent = "timeout";
    }
    #error(late) {
      // abort and timeout end up here.
      this.#response = new Response();
      this.#status = 0;
      this.#responseText = ''
      this.#responseAny = null;
      this.#responseXML = null;
      this.#dataLoaded = 0;
      this.#readyState = 0; // event-less readyState change. somehow.
      if (!late) {
        this.#updateReadyState(4);
        this.#emitUploadErrorEvent?.(this.#errorEvent ?? "error");
        this.#emitEvent(this.#errorEvent ?? "error");
        this.#emitEvent("loadend");
      }
      this.#errorEvent = null;
    }
    async #processResponse() {
      this.#trackProgress(this.#response.clone());

      switch (this.#finalResponseType) {
        case 'arraybuffer':
          try {
            this.#responseAny = await this.#response.arrayBuffer();
          } catch {
            this.#responseAny = null;
          }
          break;
        case 'blob':
          try {
            this.#responseAny = new Blob([await this.#response.arrayBuffer()], { type: this.#finalContentType });
          } catch {
            this.#responseAny = null;
          }
          break;
        case 'document': {
          this.#responseText = this.#textDecoder.decode(await this.#response.arrayBuffer());
          try {
            this.#responseAny = this.#responseXML = new DOMParser().parseFromString(this.#responseText, this.#finalMimeType);
          } catch {
            this.#responseAny = null;
          }
          break;
        }
        case 'json':
          try {
            this.#responseAny = await this.#response.json();
          } catch {
            this.#responseAny = null;
          }
          break;
        case 'text':
        default:
          this.#responseAny = this.#responseText = this.#textDecoder.decode(await this.#response.arrayBuffer());
          break;
      }
      if (this.#status == 0) {
        // blank out the responses.
        this.#responseAny = null;
        this.#responseXML = null;
        this.#responseText = '';
      } else {
        this.#readyState = 4; //XXX
        this.#emitEvent("load");
      }
      this.#updateReadyState(4);
      this.#emitEvent("loadend");
    }
    async #trackProgress(response) {
      if (!response.body) return;
      // count the bytes to update #dataLoaded, and add text into #responseText if appropriate
      const isText = this.#finalResponseType == 'text';

      const reader = response.body.getReader();
      const handleChunk = ({ done, value }) => {
        if (done) return;
        this.#dataLoaded += value.length;
        if (isText) {
          this.#responseText += this.#textDecoder.decode(value);
          this.#responseAny = this.#responseText;
        }
        if (this.#readyState == 2) this.#updateReadyState(3);
        this.#emitEvent('progress');
        reader.read().then(handleChunk).catch(()=>0);
      };
      reader.read().then(handleChunk).catch(()=>0);
    }
    // Response access
    getResponseHeader(header) {
      try {
        return this.#response?.headers.get(header) ?? null;
      } catch {
        return null;
      }
    }
    getAllResponseHeaders() {
      return [...this.#response?.headers.entries()??[]].map(([key,value]) => `${key}: ${value}\r\n`).join('');
    }
    get response() {
      return this.#responseAny;
    }
    get responseText() {
      if (this.#finalResponseType !== 'text' && this.#responseType !== '') {
        throw new DOMException(`Failed to read the 'responseText' property from 'XMLHttpRequest': The value is only accessible if the object's 'responseType' is '' or 'text' (was '${this.#responseType}').`, "InvalidStateError");
      }
      return this.#responseText;
    }
    get responseXML() {
      if (this.#finalResponseType !== 'document' && this.#responseType !== '') {
        throw new DOMException(`Failed to read the 'responseXML' property from 'XMLHttpRequest': The value is only accessible if the object's 'responseType' is '' or 'document' (was '${this.#responseType}').`, "InvalidStateError");
      }
      return this.#responseXML;
    }
    get responseURL() {
      return this.#response?.url;
    }
    get status() {
      return this.#status ?? this.#response?.status ?? 0;
    }
    get statusText() {
      return this.#response?.statusText ?? '';
    }

    async #emitEvent(type) {
      this.dispatchEvent(new ProgressEvent(type, {
        lengthComputable: this.#dataLengthComputable,
        loaded: this.#dataLoaded,
        total: this.#dataTotal
      }));
    }
    // I've got the perfect disguise..
    get [Symbol.toStringTag]() {
      return 'XMLHttpRequest';
    }
    static toString = ()=> 'function XMLHttpRequest() { [native code] }';
  }

  window.XMLHttpRequestEventTarget = XMLHttpRequestEventTarget;
  window.XMLHttpRequestUpload = XMLHttpRequestUpload;
  window.XMLHttpRequest = XMLHttpRequest;
  window.fetch = fetch;

  return middleMan;

})(globalThis.unsafeWindow ?? window);