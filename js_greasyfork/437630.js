// ==UserScript==
// @name         谷歌搜索结果居中
// @namespace    http://tampermonkey.net/
// @version 2.0.7
// @description  Center the Google search results.
// @author       old.xiao
// @match        https://www.google.com/search*
// @match        https://www.google.com.hk/search*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437630/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B1%85%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/437630/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B1%85%E4%B8%AD.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var style = document.createElement('style');
    var cssStyle = '@media(min-width:1410px){#extabar {display: flex;justify-content: center;} #slim_appbar {width: 1280px;margin-left:0;padding-left: 221px;box-sizing: border-box;} '+
    '#searchform .tsf{margin:0 auto}#hdtb-s{display:flex;justify-content:center}.mw{margin:0 auto}#fbar{text-align:center}#topabar{max-width:1197px;margin:0 auto;min-width:1100px}.K1fSEd{text-align:center;} .yg51vc,.GyAeWb{margin:0 auto;min-width:1100px} .A8SBwf{margin-left: -27px!important;;} .IC1Ck{float: none;} .GLcBOb{width:1307px;margin:0 auto;} .fvRoCd{width: 1307px; margin: 0 auto;}';

    style.innerText = cssStyle;
    document.querySelector('head').appendChild(style);
})();