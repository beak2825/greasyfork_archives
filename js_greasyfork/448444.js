// ==UserScript==
// @name         【聊天室反引用刷屏】
// @version      0.2.3
// @description  在hackchat聊天室、十字街聊天室、XChat（圈聊）聊天室增大引用块宽度，防止markdown生成的blockquote标签大量堆叠后产生刷屏现象。存在副作用，会一定程度上破坏引用块的外观。
// @author       firetree
// @match        https://crosst.chat/?*
// @match        https://hack.chat/?*
// @match        https://xq.kzw.ink/?*
// @match        *://tanchat.fun/?*
// @icon         none
// @grant        none
// @license      WTFPL
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/448444/%E3%80%90%E8%81%8A%E5%A4%A9%E5%AE%A4%E5%8F%8D%E5%BC%95%E7%94%A8%E5%88%B7%E5%B1%8F%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/448444/%E3%80%90%E8%81%8A%E5%A4%A9%E5%AE%A4%E5%8F%8D%E5%BC%95%E7%94%A8%E5%88%B7%E5%B1%8F%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement("style");
    style.type = "text/css";
    var text = document.createTextNode("blockquote {padding: 2px 2px;margin: 0px;}"); /* 这里编写css代码 */
    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
})();