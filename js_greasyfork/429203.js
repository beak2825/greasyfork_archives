// ==UserScript==
// @name         Async xmlhttpRequest
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  封装 GM_xmlhttpRequest
// @author       LinHQ
// @match        *
// @grant        GM_xmlhttprequest
// ==/UserScript==

function req(details){
  return new Promise((res, rej) => {
    details.onload = res;
    details.ontimeout = rej;
    details.onabort = rej;
    details.onerror = rej;

    GM_xmlhttpRequest(
      details
    );
  });
}