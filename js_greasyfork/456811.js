// ==UserScript==
// @name         【聊天室输入框占位符】
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  可以时刻提醒你注意在聊天室的言行（
// @author       Fyratree
// @match        *://hack.chat/?*
// @match        *://crosst.chat/?*
// @match        *://tanchat.fun/?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/456811/%E3%80%90%E8%81%8A%E5%A4%A9%E5%AE%A4%E8%BE%93%E5%85%A5%E6%A1%86%E5%8D%A0%E4%BD%8D%E7%AC%A6%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/456811/%E3%80%90%E8%81%8A%E5%A4%A9%E5%AE%A4%E8%BE%93%E5%85%A5%E6%A1%86%E5%8D%A0%E4%BD%8D%E7%AC%A6%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
        if (!GM_getValue('placeholder')) {
        GM_setValue('placeholder','发一条友善的消息')
    }
    document.getElementById('chatinput').placeholder = GM_getValue('placeholder')
})();