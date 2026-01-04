// ==UserScript==
// @name         Bonk.io global chat
// @namespace    reactoimpcact
// @version      2024-08-03
// @description  Replaces the text at the bottom of the page with an IRC client that allows Bonk.io to have a global chat! You can also use the webpage at https://web.libera.chat/gamja/?nick=Guest#bonkio
// @author       Reactoimpact
// @match        https://bonk.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502633/Bonkio%20global%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/502633/Bonkio%20global%20chat.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // loads an iframe to the IRC client by librachat thats hosted by Liberachat from https://libera.chat/guides/webchat
    // The channel is made by me (reactoimpact)
    // if you have any questions you can find me on the chat or visit the website version of the webchat https://web.libera.chat/gamja/?nick=Guest#bonkio
    // :)


    // Not that much code tbh
    document
        .getElementById('descriptioncontainer')
        .innerHTML = `<iframe src="https://web.libera.chat/?nick=Guest?#bonkio" style="border:0; width:850px; height:1046px;"></iframe>`;

})();