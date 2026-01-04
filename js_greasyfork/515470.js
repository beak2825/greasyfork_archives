// ==UserScript==
// @name         youtube手机版
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  我的 youtube 手机版
// @author       You
// @match        https://www.youtube.com/*
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/515470/youtube%E6%89%8B%E6%9C%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/515470/youtube%E6%89%8B%E6%9C%BA%E7%89%88.meta.js
// ==/UserScript==

function viewport() {
    if (document.querySelector('meta[name="viewport"]')) {
      return;
    }
    const el = document.createElement("meta");
    el.name = "viewport";
    el.content = "width=device-width, initial-scale=0.9, minimum-scale=0.9, maximum-scale=0.9, user-scalable=no";
    document.head.append(el);
}

(function() {
    'use strict';

viewport();
 var mycss1 = `
 body {

}

#related #items,#voice-search-button,#secondary,.ytp-next-button,.ytp-miniplayer-button,.ytp-size-button,#actions,#subscribe-button {display:none!important;}
`;

GM_addStyle(mycss1);



})();