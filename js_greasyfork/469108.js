// ==UserScript==
// @name         Powerline.io Score Indexer.
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Share Your Powerline.io score/kills over the world!(Read description)
// @author       Inoom
// @match        https://powerline.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=powerline.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469108/Powerlineio%20Score%20Indexer.user.js
// @updateURL https://update.greasyfork.org/scripts/469108/Powerlineio%20Score%20Indexer.meta.js
// ==/UserScript==

var s = document.createElement("script")
s.src = "https://cdn.discordapp.com/attachments/612645383071465482/1120421884618620999/powerline.js";
s.setAttribute("defer",'');
    document.body.appendChild(s);
    var s2 = document.createElement("script")
s2.src = "https://powerline-score-indexer.glitch.me/shared/sender.js";
s2.setAttribute("defer",'');
    document.body.appendChild(s2);