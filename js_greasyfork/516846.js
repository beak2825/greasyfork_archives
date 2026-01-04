// ==UserScript==
// @name              无剑3.0
// @description       无剑ZH,TW
// @namespace         http://tampermonkey.net/
// @version           3.0.1
// @license           MIT
// @author            燕飞、东方鸣、懒人、九
// @match             http://swordman-s1.yytou.com/*
// @match             http://swordman-inter.yytou.com/*
// @match             http://118.178.84.7/*
// @match             http://110.42.64.223/*
// @match             http://121.40.177.24/*
// @grant             unsafeWindow
// @grant             GM_info
// @grant             GM_setClipboard
// @grant             GM_xmlhttpRequest
// @connect           greasyfork.org
// @connect           update.greasyfork.org
// @run-at            document-end
// @compatible        Chrome >= 80
// @compatible        Edge >= 80
// @compatible        Firefox PC >= 74
// @compatible        Opera >= 67
// @compatible        Safari MacOS >= 13.1
// @compatible        Firefox Android >= 79
// @compatible        Opera Android >= 57
// @compatible        Safari iOS >= 13.4
// @compatible        WebView Android >= 80
// @require https://update.greasyfork.org/scripts/516836/1481930/Greasys%20Fork%20API20.js
// @downloadURL https://update.greasyfork.org/scripts/516846/%E6%97%A0%E5%89%9130.user.js
// @updateURL https://update.greasyfork.org/scripts/516846/%E6%97%A0%E5%89%9130.meta.js
// ==/UserScript==
 
(function () {
  "use strict";
  GreasyFork.getScriptCode("516845",true).then(data => {
    eval("(function (){" + data + "})()");
  });
  
})();