// ==UserScript==
// @name           Niconama auto low
// @namespace      Niconama auto low
// @description    To low quality niconama images automatically
// @match        http://live.nicovideo.jp/watch/*
// @match        http://live2.nicovideo.jp/watch/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_addStyle
// @version 0.0.1.20170513035325
// @downloadURL https://update.greasyfork.org/scripts/29405/Niconama%20auto%20low.user.js
// @updateURL https://update.greasyfork.org/scripts/29405/Niconama%20auto%20low.meta.js
// ==/UserScript==

(function(){
   if(document.URL.match('?low=1w')) {
    }
    else {
      location.href = document.URL + '?low=1w';
    }
})();