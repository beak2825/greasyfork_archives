// ==UserScript==
// @name         Remnant: From the Ashes World Analyzer 中文化
// @name:zh-TW   遺跡：來自灰燼分析 網頁中文化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change the page to Chinese
// @description:zh-TW 把遺跡：來自灰燼分析的網頁換成中文 由https://reurl.cc/V62jAY提供
// @author       x778888778 <https://greasyfork.org/zh-TW/users/570210-x778888778>
// @match        https://hzla.github.io/Remnant-World-Analyzer/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403879/Remnant%3A%20From%20the%20Ashes%20World%20Analyzer%20%E4%B8%AD%E6%96%87%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/403879/Remnant%3A%20From%20the%20Ashes%20World%20Analyzer%20%E4%B8%AD%E6%96%87%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    javascript:(function(){var s=document.createElement('script');s.setAttribute('type','text/javascript');s.setAttribute('onload','alert("Done\\n中文化資料載入完畢")');s.setAttribute('src','https://dl.dropbox.com/s/2jblht9awcxnuvm/ContentScript-Remnant.js?raw=0');document.getElementsByTagName('head')[0].appendChild(s);})()
})();