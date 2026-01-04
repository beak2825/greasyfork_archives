// ==UserScript==
// @name         AoE2.net sidebar remover
// @namespace    https://github.com/Heistergand/aoe2.net-chat-remover
// @version      0.1
// @supportURL   https://github.com/Heistergand/aoe2.net-chat-remover/issues
// @description  Remove that toxic chat
// @author       Heistergand
// @license      Unlicense
// @match        https://aoe2.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aoe2.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449675/AoE2net%20sidebar%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/449675/AoE2net%20sidebar%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sidebar = document.getElementById("sidebar");
    sidebar.style.visibility = "hidden";
    sidebar.classList.replace('col-md-2', 'col-md-auto');

    const content = document.getElementById("content");
    content.classList.replace('col-md-10', 'col-md-12');


})();
