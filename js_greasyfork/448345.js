// ==UserScript==
// @name         Make in-game chat messages selectable
// @version      0.1
// @author       SneezingCactus
// @namespace    https://github.com/SneezingCactus
// @description  Simple bonk.io mod that allows you to select chatbox message content in-game.
// @match        https://*.bonk.io/gameframe-release.html
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448345/Make%20in-game%20chat%20messages%20selectable.user.js
// @updateURL https://update.greasyfork.org/scripts/448345/Make%20in-game%20chat%20messages%20selectable.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = '#ingamechatcontent { pointer-events: all; } .ingamechatname, .ingamechatmessage { user-select: text; }';
    document.head.appendChild(style);
})();