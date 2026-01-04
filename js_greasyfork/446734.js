// ==UserScript==
// @name         Bonk Clear Chat
// @version      1.1
// @author       Salama
// @description  Adds a button to clear chat
// @match        https://*.bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @supportURL   https://discord.gg/Dj6usq7ww3
// @namespace    https://greasyfork.org/users/824888
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446734/Bonk%20Clear%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/446734/Bonk%20Clear%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let button = document.createElement('div');
    document.getElementById("newbonklobby_chatbox").getElementsByClassName("newbonklobby_boxtop newbonklobby_boxtop_classic")[0].appendChild(button);
    button.outerHTML = `<div id="clearchatbutton" class="brownButton brownButton_classic buttonShadow" style="line-height: 24px;visibility: inherit;margin: 0;top: 4;left: 4;font-family: 'futurept_b1';font-size: 16px;width: 100px;height: 24px;position: absolute;">CLEAR</div>`;
    document.getElementById("clearchatbutton").addEventListener('click', () => {
        for(let msg of [...document.getElementById("newbonklobby_chat_content").children].concat([...document.getElementById("ingamechatcontent").children])) {
            msg.remove();
        }
    });
    console.log("Clear chat button added");
})();