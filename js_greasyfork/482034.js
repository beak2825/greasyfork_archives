// ==UserScript==
// @name         下載北科i學員PDF
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  下載北科i學員上面的教材檔案
// @author       umeow0716
// @match        https://istudy.ntut.edu.tw/learn/index.php
// @connect      istream.ntut.edu.tw
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482034/%E4%B8%8B%E8%BC%89%E5%8C%97%E7%A7%91i%E5%AD%B8%E5%93%A1PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/482034/%E4%B8%8B%E8%BC%89%E5%8C%97%E7%A7%91i%E5%AD%B8%E5%93%A1PDF.meta.js
// ==/UserScript==

const parser = new DOMParser();
const ErrorFileChar = [ "/" , "|" ,'\\',"?",'"' ,'*' ,":" ,"<" ,">" , "/" , "："];

const GM_fetch = getGM_fetch();

const saveData = (function () {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  return function (blob, fileName) {
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
}());

const GET = async (url, old = false, headers = {}, args = {}) => {
  const res = await GM_fetch(url, {
    ...args,
    headers,
    method: "GET"
  });

  if (old) {
    const data = await res.text();
    const status = res.status;
    return { data, status }
  }

  return res;
}

const POST = async (url, data = {}, dataType = "form", headers = {}, args = {}) => {
  const ContentType = dataType === "form" ?
    "application/x-www-form-urlencoded" :
    "application/json"

  const body = dataType === "form" ?
    new URLSearchParams(data).toString() :
    JSON.stringify(data);

  const res = await GM_fetch(url, {
    ...args,
    body,
    headers: {
      ...headers,
      "Content-Type": ContentType,
      "Access-Control-Allow-Origin": "*"
    },
    method: "POST"
  });

  return res;
}

const get_cid = async () => {
  const cidURL = "https://istudy.ntut.edu.tw/learn/path/launch.php";

  const cidResponse = await GET(cidURL, true);

  const cidHTML = parser.parseFromString(cidResponse['data'], 'text/html');

  const cidScriptHTML = [...cidHTML.getElementsByTagName('script')].filter(ele => ele.innerHTML.includes('cid='))[0].innerHTML;

  const cidLine = cidScriptHTML.split("\n").filter(str => str.includes('cid'))[0];

  const cidStartIndex = cidLine.indexOf('/learn');

  const cidResultURL = 'https://istudy.ntut.edu.tw' + cidLine.slice(cidStartIndex).slice(0, -3);

  const cidResultURLObj = new URL(cidResultURL);

  const cid = cidResultURLObj.searchParams.get('cid');
  return cid;
}

const getDownloadArguments = async (cid) => {
  const URL = `https://istudy.ntut.edu.tw/learn/path/pathtree.php?cid=${cid}`;
  const DownloadData = {
    'is_player'			: false,
    'href'				: '',
    'prev_href'			: '',
	  'prev_node_id'		: '',
    'prev_node_title'	: '',
	  'is_download'		: false,
	  'begin_time'		: '',
	  'course_id'			: '',
	  'read_key'			: ''
  }

  const Response = await GET(URL, old = true);
  const HTML = parser.parseFromString(Response['data'], 'text/html');
  const FormElement = HTML.getElementById('fetchResourceForm');
  const InputList = [...FormElement.getElementsByTagName('input')];

  InputList.forEach((InputElement) => {
    const key = InputElement.getAttribute('name');
    if(key === "is_download" || key === "is_player") return;

    const value = InputElement.getAttribute('value') || '';

    DownloadData[key] = value;
  });

  return DownloadData
}

const getFileList = async () => {
  const FileList = [];
  const FileListURL = 'https://istudy.ntut.edu.tw/learn/path/SCORM_loadCA.php';
  const FileListResponse = await GET(FileListURL, old = true);
  const FileListXML = parser.parseFromString(FileListResponse['data'], "text/xml");
  const FileListItems = [...FileListXML.getElementsByTagName('item')].filter((ele) => ele.getAttribute('identifierref'));
  const FileListElements = [...FileListXML.getElementsByTagName('resource')].filter((ele) => ele.getAttribute('identifier'));

  FileListElements.forEach((element) => {
    const identifier = element.getAttribute('identifier');
    const href = '@' + element.getAttribute('href');

    const item = FileListItems.filter((ele) => ele.getAttribute('identifierref') === identifier)[0];
    const name = item.getElementsByTagName('title')[0].innerHTML.split("\t")[0].replace("\n" , "");

    const file = { href, name };
    FileList.push(file);
  });

  return FileList;
}

const getFileType = async (html) => {
    const LocationStartIndex = html.indexOf('location.replace(');
    if(LocationStartIndex !== -1) {
        console.log(html);
        let ResponseLocation = html.slice(LocationStartIndex + 18);
        const EndIndex = ResponseLocation.indexOf(')');
        ResponseLocation = ResponseLocation.slice(0, EndIndex - 1);
        console.log(ResponseLocation);
        
        if(ResponseLocation.includes("viewPDF.php")) {
            const ViewPDFURL = 'https://istudy.ntut.edu.tw/learn/path/' + ResponseLocation;
            const ViewPDF = await GET(ViewPDFURL, old = true);
            const getPDFLine = ViewPDF['data'].split('\n').filter(str => str.includes('getPDF.php'))[0];
            const StartIndex = getPDFLine.indexOf('"');
            const EndIndex = getPDFLine.lastIndexOf('"');
            
            const getPDFURL = getPDFLine.slice(StartIndex + 1, EndIndex);
            const DownloadLink = 'https://istudy.ntut.edu.tw/learn/path/' + getPDFURL;
            return { type: "pdf", DownloadLink , headers: { referer: ViewPDFURL } }
        }

        if(ResponseLocation.includes("player.php")) {
          const PlayerResponse = await GET(ResponseLocation, false);
          const PlayerHTML = await PlayerResponse.text();
          const PlayerHTMLObj = parser.parseFromString(PlayerHTML, "text/html");
          const PlayerList = [...PlayerHTMLObj.getElementsByTagName("video")];

          const DownloadLink = PlayerList.map(ele => {
            const source = ele.getElementsByTagName('source')[0]
            const href = source.getAttribute('src')
            return 'https://istream.ntut.edu.tw/videoplayer/' + href;
          });

          return { type: "record", DownloadLink }
        }

        return { type: "link", DownloadLink: ResponseLocation }
    }

    if(html.includes(`<button onClick="download('`)) {
        const type = "file";
        const ButtonStartIndex = html.indexOf(`<button onClick="download('`);
        const pathStart = html.slice(ButtonStartIndex +  27);

        const ButtonEndIndex = pathStart.indexOf("'");
        const path = pathStart.slice(0, ButtonEndIndex);

        const DownloadLink = "https://istudy.ntut.edu.tw/learn/path/download.php?path=" + encodeURIComponent(path);

        return { type, DownloadLink }
    }

    return { type: null }
}

const DownloadFile = async (DownloadData, file) => {
  let filename = file['name'];
  while(ErrorFileChar.map( c => filename.includes(c) ).filter(bool => bool).length) ErrorFileChar.forEach( c => filename = filename.replace(c, ' '));

  DownloadData['href'] = file['href'];

  const URL =  "https://istudy.ntut.edu.tw/learn/path/SCORM_fetchResource.php";
  
  const Response = await POST(URL, DownloadData);
  const ResponseText = await Response.text();
  
  const FileData = await getFileType(ResponseText);

  const headers = FileData["headers"] || {};
  console.log("headers: ", headers);

  console.log(FileData);

  if(!FileData['type']) {
    alert("無法擷取檔案連結");
    return;
  }

  if(FileData['type'] === 'record') {
    if(!confirm(`即將開啟 ${FileData['DownloadLink'].length} 個錄影影像分頁 是否確定？`)) return;
    for(let i = 0 ; i < FileData['DownloadLink'].length ; i++) {
      const url = FileData['DownloadLink'][i];
      window.open(url);
    }
    return;
  }

  if(FileData['type'] === 'link') {
    if(!confirm(`此教材為外部連結 是否開啟？`)) return;
    window.open(FileData['DownloadLink']);
    return;
  }

  const FileResponse = await GET(FileData['DownloadLink'],
    old = false,
    headers,
  );

  console.log(FileResponse);
    
  const FileBlob = await FileResponse.blob();
  saveData(FileBlob, filename);
}

const getFileListWithDownload = async () => {
  const cid = await get_cid();

  const DownloadData = await getDownloadArguments(cid);
  const FileList = await getFileList();

  FileList.forEach( file => {
    file['download'] = () => DownloadFile(DownloadData, file)
  });

  return FileList;
} 

const makeHTML = (FileList) => {
  const doc = createElement({ tag: "html" });
  createElement({ 
    tag: "head", 
    childs: [
      createElement({ 
        tag: "meta", 
        charset: "utf-8", 
      })
    ],
    appendTo: doc 
  });

  const body = createElement({ 
    tag: "body", 
    style: 'display: flex;flex-direction: column;', 
    appendTo: doc 
  });

  FileList.forEach(file => 
    createElement({
      tag: "div",
      
      childs: [
        createElement({
          tag: "span",
          innerHTML: file['name'],
          style: "margin-right: 10px;"
        }),
        
        createElement({
          tag: "button",
          innerHTML: "下載",
          onclick: file.download
        }),

        createElement({ tag: "br" })
      ],

      style: "margin: 8px;",
      appendTo: body
    })
  );

  return doc;
}

const main = async () => {
  try {
    
    const FileList = await getFileListWithDownload();

    const html = makeHTML(FileList);

    window.open('', 'i學員檔案列表', config='height=500,width=500')
      .document.body.appendChild(html);
  
  } catch(err) {
    
    console.error(err);
    
    alert("請確認是否位於正確的頁面");
    
    return;

  }
}

GM_registerMenuCommand('擷取目前頁面的檔案', main, 'r');

//前端 Element Manager author: Umeow

function createElement({
  tag = 'div',
  classes = [],
  innerHTML = '',
  childs = [],
  appendTo = null,
  onclick = null,
  ...attrs
}) {
  const result = document.createElement(tag)

  classes.filter((c) => c).forEach((c) => result.classList.add(c))
  Object.keys(attrs)
    .filter((attr) => attrs[attr] !== null)
    .forEach((attr) => result.setAttribute(attr, attrs[attr]))
  childs.filter((c) => c).forEach((c) => result.appendChild(c))

  if (innerHTML) result.innerHTML += innerHTML
  if (appendTo instanceof HTMLElement) appendTo.appendChild(result)
  if (onclick instanceof Function) result.onclick = onclick

  return result
}

/*! GM_fetch — v0.3.6-2022.06.04-dev — https://github.com/AlttiRi/gm_fetch */
function getGM_fetch() {
  const GM_XHR = (typeof GM_xmlhttpRequest === "function") ? GM_xmlhttpRequest : (GM?.xmlHttpRequest);
  const isStreamSupported = GM_XHR?.RESPONSE_TYPE_STREAM;
  let firefoxFixedFetch = false;
  const fetch = getWebPageFetch();

  const crError = new Error().stack.startsWith("Error"); // Chromium Error
  // In Chromium original `DOMException` contains stack trace, however, manually created does not have it.

  /**
   * @param {string, URL, Request} resource
   * @param fetchInit */
  async function handleBaseParams(resource, fetchInit = {}) {
      let url;
      if (resource?.url) {
          const {url: u, init} = await destroyRequest(resource);
          url = u;
          fetchInit = {...init, ...fetchInit};
      } else {
          url = new URL(resource, location).href;
      }
      return {url, fetchInit};
  }
  /** @param {Request} request */
  async function destroyRequest(request) {
      const url = request.url;
      const method = request.method;
      const headers = request.headers;
      const signal = request.signal;
      const referrer = request.referrer !== "referrer" ? request.referrer : undefined; // todo test

      let body;
      if (!["GET", "HEAD"].includes(method)) {
          body = await request.blob();
      }
      return {url, init: {method, signal, headers, body}};
  }

  function getWebPageFetch() {
      let fetch = globalThis.fetch;
      // [VM/GM/FM + Firefox with "Enhanced Tracking Protection" set to "Strict" (Or "Custom" with enabled "Fingerprinters" option)
      // on sites with CSP (like Twitter, GitHub)] requires this fix.
      // They run the code as a content script. TM disables CSP with extra HTTP headers.
      // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Sharing_objects_with_page_scripts
      function fixFirefoxFetchOnPageWithCSP() {
          const wrappedJSObject = globalThis.wrappedJSObject;
          const fixRequired = wrappedJSObject && typeof wrappedJSObject.fetch === "function";
          if (!fixRequired) {
              return;
          }
          const isTM = (function() {
              const request = new wrappedJSObject.Request(""); // Firefox content script's `Request` does not support relative URLs
              try {
                  return request === cloneInto(request);
              } catch {
                  console.log("[ujs][fixFirefoxFetchOnPageWithCSP] Request:", Request);
                  return false;
              }
          })();
          if (isTM) {
              return;
          }
          async function fixedFetch(resource, opts = {}) {
              const {url, fetchInit: init} = await handleBaseParams(resource, opts);
              if (init.headers instanceof Headers) {
                  console.log("[ujs][fixedFetch] Headers", init.headers);
                  // Since `Headers` are not allowed for structured cloning.
                  init.headers = Object.fromEntries(init.headers.entries());
              }
              if (/** @type {AbortSignal} */ init.signal) {
                  if (init.signal.aborted) {
                      throw new DOMException("The user aborted a request." + (crError ? new Error().stack.slice(5) : ""), "AbortError");
                  }
                  console.warn("[ujs][fixedFetch] delete signal");
                  delete init.signal; // Can't be structured cloned
              }
              return wrappedJSObject.fetch(cloneInto(url, document), cloneInto(init, document/*, {cloneFunctions: true}*/));
          }
          fetch = fixedFetch;
          firefoxFixedFetch = true;
      }
      fixFirefoxFetchOnPageWithCSP();
      console.log({firefoxFixedFetch});

      async function enhancedFetch(resource, opts) {
          const onprogress = opts.extra?.onprogress;
          delete opts.extra;
          const response = await fetch(resource, opts);
          if (onprogress) {
              return responseProgressProxy(response, onprogress);
          }
          return response;
      }

      return enhancedFetch;
  }

  /** The default Response always has {type: "default", redirected: false, url: ""} */
  class ResponseEx extends Response {
      [Symbol.toStringTag] = "ResponseEx";
      constructor(body, {headers, status, statusText, url, redirected, type, ok}) {
          super(body, {status, statusText, headers: {
                  ...headers,
                  "content-type": headers.get("content-type")?.split("; ")[0] // Fixes Blob type ("text/html; charset=UTF-8") in TM
              }});
          this._type = type;
          this._url = url;
          this._redirected = redirected;
          this._ok = ok;
          this._headers = headers; // `HeadersLike` is more user-friendly for debug than the original `Headers` object
      }
      get redirected() { return this._redirected; }
      get url() { return this._url; }
      get type() { return this._type || "basic"; } // todo: if "cors"
      get ok() { return this._ok; }
      /** @returns {HeadersLike} */
      get headers() { return this._headers; }
  }
  class HeadersLike { // Note: the original `Headers` throws an error if `key` requires `.trim()`
      constructor(headers) {
          headers && Object.entries(headers).forEach(([key, value]) => {
              this.append(key, value);
          });
      }
      get(key) {
          const value = this[key.trim().toLowerCase()];
          return value === undefined ? null : value;
      }
      append(key, value) {
          this[key.trim().toLowerCase()] = value.trim();
      }
      has(key) {
          return this.get(key) !== null;
      }
  }
  /**
   * Parses headers from `XMLHttpRequest.getAllResponseHeaders()` string
   * @returns {HeadersLike} */
  function parseHeaders(headersString) {
      const headers = new HeadersLike();
      for (const line of headersString.trim().split("\n")) {
          const [key, ...valueParts] = line.split(":"); // last-modified: Fri, 21 May 2021 14:46:56 GMT
          const value = valueParts.join(":");
          headers.append(key, value);
      }
      return headers;
  }

  class ReaderLike {
      constructor(blobPromise, body) {
          /** @type {Promise<Blob>} */
          this._blobPromise = blobPromise;
          /** @type {ReadableStreamDefaultReader} */
          this._reader = null;
          /** @type {ReadableStreamLike} */
          this._body = body;
          this._released = false;
      }
      /** @return {Promise<{value: Uint8Array, done: boolean}>} */
      read() {
          if (this._released) {
              throw new TypeError("This readable stream reader has been released and cannot be used to read from its previous owner stream");
          }
          this._body._used = true;
          if (this._reader === null) {
              return new Promise(async (resolve) => {
                  const blob = await this._blobPromise;
                  const response = new Response(blob);
                  this._reader = response.body.getReader();
                  const result = await this._reader.read();
                  resolve(result);
              });
          }
          return this._reader.read();
      }
      releaseLock() {
          this._body.locked = false;
          this._released = true;
      }
  }
  class ReadableStreamLike { // BodyLike
      constructor(blobPromise) {
          this.locked = false;
          this._used = false;
          this._blobPromise = blobPromise;
      }
      getReader() {
          if (this.locked) {
              throw new TypeError("ReadableStreamReader constructor can only accept readable streams that are not yet locked to a reader");
          }
          this._reader = new ReaderLike(this._blobPromise, this);
          this.locked = true;
          return this._reader;
      }
  }
  class ResponseLike {
      constructor(blobPromise, {headers, status, statusText, url, finalUrl}) {
          /** @type {Promise<Blob>} */
          this._blobPromise = blobPromise;
          this.headers = headers;
          this.status = status;
          this.statusText = statusText;
          this.url = finalUrl;
          this.redirected = url !== finalUrl;
          this.type = "basic"; // todo: if "cors"
          this.ok = status.toString().startsWith("2");
          this._bodyUsed = false;
          this.body = new ReadableStreamLike(blobPromise);
      }
      get bodyUsed() {
          return this._bodyUsed || this.body._used;
      }
      blob() {
          if (this.bodyUsed) {
              throw new TypeError("body stream already read");
          }
          if (this.body.locked) {
              throw new TypeError("body stream is locked");
          }
          this._bodyUsed = true;
          this.body.locked = true;
          return this._blobPromise;
      }
      arrayBuffer() { return this.blob().then(blob => blob.arrayBuffer()); }
      text() {        return this.blob().then(blob => blob.text()); }
      json() {        return this.text().then(text => JSON.parse(text)); }
  }

  const identityContentEncodings = new Set([null, "identity", "no encoding"]);
  function getOnProgressProps(response) {
      const {headers, status, statusText, url, redirected, ok} = response;
      const isIdentity = identityContentEncodings.has(headers.get("Content-Encoding"));
      const compressed = !isIdentity;
      const _contentLength = parseInt(headers.get("Content-Length")); // `get()` returns `null` if no header present
      const contentLength = isNaN(_contentLength) ? null : _contentLength;
      const lengthComputable = isIdentity && _contentLength !== null;

      // Original XHR behaviour; in TM it equals to `contentLength`, or `-1` if `contentLength` is `null` (and `0`?).
      const total = lengthComputable ? contentLength : 0;
      const gmTotal = contentLength > 0 ? contentLength : -1; // Like `total` is in TM and GM.

      return {
          gmTotal, total, lengthComputable,
          compressed, contentLength,
          headers, status, statusText, url, redirected, ok
      };
  }

  function responseProgressProxy(response, onProgress) {
      const onProgressProps = getOnProgressProps(response);
      let loaded = 0;
      const reader = response.body.getReader();
      const readableStream = new ReadableStream({
          async start(controller) {
              while (true) {
                  const {done, /** @type {Uint8Array} */ value} = await reader.read();
                  if (done) {
                      break;
                  }
                  loaded += value.length;
                  try {
                      onProgress({loaded, ...onProgressProps});
                  } catch (e) {
                      console.error("[onProgress]:", e);
                  }
                  controller.enqueue(value);
              }
              controller.close();
              reader.releaseLock();
          },
          cancel() {
              void reader.cancel();
          }
      });
      return new ResponseEx(readableStream, response);
  }



  /**
   * The simplified `fetch` — a wrapper for `GM_xmlHttpRequest`.
   * @example
   // @grant       GM_xmlhttpRequest
   const response = await fetch(url);
   const {status, statusText} = response;
   const lastModified = response.headers.get("last-modified");
   const blob = await response.blob();
   * @return {Promise<Response>} */
  async function GM_fetch(url, fetchInit = {}) {
      ({url, fetchInit} = await handleBaseParams(url, fetchInit));

      if (fetchInit.extra?.webContext) {
          delete fetchInit.extra;
          return fetch(url, fetchInit);
      }

      function handleParams(fetchInit) {
          const defaultFetchInit = {method: "GET", headers: {}};
          const defaultExtra = {useStream: true, onprogress: null};
          const opts = {
              ...defaultFetchInit,
              ...fetchInit,
              extra: {
                  ...defaultExtra,
                  ...fetchInit.extra
              }
          };

          const {headers, method, body, referrer, signal, extra: {useStream, onprogress}} = opts;
          delete opts.extra.useStream;
          delete opts.extra.onprogress;

          const _headers = new HeadersLike(headers);
          if (referrer && !_headers.has("referer")) {
              _headers.append("referer", referrer); // todo: handle referrer
          }

          return {
              method, headers: _headers, body, signal,
              useStream, onprogress, extra: opts.extra
          };
      }

      const {
          method, headers, body, signal,
          useStream, onprogress, extra
      } = handleParams(fetchInit);

      if (signal?.aborted) {
          throw new DOMException("The user aborted a request." + (crError ? new Error().stack.slice(5) : ""), "AbortError");
      }
      let abortCallback;
      let done = false;
      function handleAbort(gmAbort) {
          if (!signal) {
              return;
          }
          if (signal.aborted) {
              gmAbort();
              const id = setInterval(() => done ? clearInterval(id) : gmAbort(), 1); // VM fix.
              return;
          }
          abortCallback = () => gmAbort();
          signal.addEventListener("abort", abortCallback);
      }
      function onDone() {
          signal?.removeEventListener("abort", abortCallback);
          done = true;
      }

      const HEADERS_RECEIVED = 2;
      const DONE = 4;
      function getOnReadyStateChange({onHeadersReceived}) {
          return function onReadyStatechange(gmResponse) {
              const {readyState} = gmResponse;
              if (readyState === HEADERS_RECEIVED) {
                  onHeadersReceived(gmResponse);
              }
              // It does not trigger on `abort` and `error`, while native XHR does. (In both TM and VM)
              // Fires only on `onload`. Is a bug? // Also it fires (`readyState === DONE`) multiple times in non the latest VM beta.
              // else if (readyState === DONE) {
              //     onDone();
              // }
          }
      }

      function getOnDones({resolve, reject}) {
          return {
              onload(gmResponse) {
                  onDone();
                  resolve?.(gmResponse.response); // Not required for `responseType: "stream"`
              },
              onerror() {
                  onDone();
                  reject(new TypeError("Failed to fetch"));
              },
              onabort() {
                  onDone();
                  reject(new DOMException("The user aborted a request." + (crError ? new Error().stack.slice(5) : ""), "AbortError"));
              }
          };
      }

      function nonStreamFetch() {
          const _onprogress = onprogress;
          let onProgressProps = {}; // Will be inited on HEADERS_RECEIVED. It used to have the same behaviour in TM and VM.
          return new Promise((resolve, _reject) => {
              function onHeadersReceived(gmResponse) {
                  const {responseHeaders, status, statusText, finalUrl} = gmResponse;
                  const headers = parseHeaders(responseHeaders);
                  const response = new ResponseLike(blobPromise, {
                      headers, status, statusText, url, finalUrl
                  });
                  onProgressProps = getOnProgressProps(response);
                  resolve(response);
              }
              const onreadystatechange = getOnReadyStateChange({onHeadersReceived});
              const blobPromise = new Promise((resolve, reject) => {
                  const {onload, onabort, onerror} = getOnDones({resolve, reject});
                  const {abort} = GM_XHR({
                      ...extra,
                      url,
                      method,
                      headers,
                      responseType: "blob",
                      onreadystatechange,
                      onprogress: _onprogress ? ({loaded/*, total, lengthComputable*/}) => {
                          _onprogress({loaded, ...onProgressProps});
                      } : undefined,
                      onload,
                      onerror,
                      onabort,
                      data: body,
                  });
                  handleAbort(abort);
              });
              blobPromise.catch(_reject);
          });
      }

      function streamFetch() {
          return new Promise((resolve, reject) => {
              function onHeadersReceived(gmResponse) {
                  const {
                      responseHeaders, status, statusText, finalUrl, response: readableStream
                  } = gmResponse;
                  const headers = parseHeaders(responseHeaders);
                  const redirected = url !== finalUrl;
                  let response = new ResponseEx(readableStream, {headers, status, statusText, url: finalUrl, redirected});
                  if (onprogress) {
                      response = responseProgressProxy(response, onprogress);
                  }
                  resolve(response);
              }
              const onreadystatechange = getOnReadyStateChange({onHeadersReceived});
              const {onload, onabort, onerror} = getOnDones({reject});
              const {abort} = GM_XHR({
                  ...extra,
                  url,
                  method,
                  headers,
                  responseType: "stream",
                  /* fetch: true, */ // Not required, since it already has `responseType: "stream"`.
                  onreadystatechange,
                  onload,
                  onerror,
                  onabort,
                  data: body,
              });
              handleAbort(abort);
          });
      }

      if (!isStreamSupported || !useStream) {
          return nonStreamFetch();
      } else {
          return streamFetch();
      }
  }

  GM_fetch.isStreamSupported = isStreamSupported;
  GM_fetch.webContextFetch = fetch;
  GM_fetch.firefoxFixedFetch = firefoxFixedFetch;

  return GM_fetch;
}