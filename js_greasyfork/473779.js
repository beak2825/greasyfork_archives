// ==UserScript==
// @name         No NetEase Popup 无网易弹窗
// @namespace    https://gist.github.com/ral-hole/d4a33d94d1284bdf529ddb2c3302ac82
// @version      0.1
// @description  Bypass NetEase promotion popup when you visit Minecraft.net in China. 在中国访问 Minecraft.net 时，绕过网易的弹出窗口。
// @author       Ral Hole
// @match        *://*.minecraft.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/473779/No%20NetEase%20Popup%20%E6%97%A0%E7%BD%91%E6%98%93%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/473779/No%20NetEase%20Popup%20%E6%97%A0%E7%BD%91%E6%98%93%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var popup = document.getElementById('popup-btn');
    popup.click();
})();