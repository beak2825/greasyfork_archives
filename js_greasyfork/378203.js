// ==UserScript==
// @name         谷歌搜索结果居中
// @namespace    http://tampermonkey.net/
// @version 1.3
// @description  Center the Google search results.
// @author       GDUFXRT
// @match        https://www.google.com/search*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378203/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B1%85%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/378203/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B1%85%E4%B8%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement('style');
    var cssStyle = '@media(min-width:1410px){#extabar {display: flex;justify-content: center;} #slim_appbar {width: 1280px;margin-left:0;padding-left: 150px;box-sizing: border-box;} #searchform .tsf{margin:0 auto}#hdtb-s{display:flex;justify-content:center}.mw{margin:0 auto}#fbar{text-align:center}#topabar{max-width:1197px;margin:0 auto;min-width:1100px}.K1fSEd{text-align:center;}';

    style.innerText = cssStyle;
    document.querySelector('head').appendChild(style);
})();