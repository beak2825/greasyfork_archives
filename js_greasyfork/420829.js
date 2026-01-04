// ==UserScript==
// @name         CollabVM Dark Mode
// @namespace    somebody
// @version      6.9
// @description  idk i stole this from the fylrobot code
// @author       ass
// @match        http://computernewb.com/collab-vm/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420829/CollabVM%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/420829/CollabVM%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var styleElem = document.createElement("style"); styleElem.type = "text/css"; styleElem.innerHTML = ` body { background-color: #222; } .navbar>.container-fluid, .thumbnail { background-color: #333 !important; background-image: none !important; } .btn { background-color: #333 !important; background-image: none !important; border-color: #444 !important; color: #ccc !important; text-shadow: none !important; } .list-group-item.disabled { background-color: #444 !important; color: #ccc; filter: none; } .list-group-item { background-color: black; } #chat-panel, #chat-input, #chat-user, .guac-keyboard-disabled, .modal-content, .alert { color: white; background-color: #111; } .message-pane li { border-bottom: 1px solid #333; box-shadow: 0 1px 0 0 #666; } .navbar, .page-header, .thumbnail { border-color: #444 !important; border-bottom-color: #444 !important; } .navbar-brand, .navbar-collapse>ul>li>a, .page-header>h2, #vm-list, .thumbnail>.caption>h4 { color: #ddd !important; } .username::before { color: #fff; } .username, .message-pane .username { color: white; } .input-group-addon, .form-control { border-color: #333; } .list-group-item { border-color: #444; } .panel { border-color: #444; } .message-pane li:hover { background-color: #2b2b2b; } .has-turn.list-group-item { background-color: #365c6b; color: white; } .waiting-turn.list-group-item { background-color: #66662C; color: white; } .alert-info { background-image: none; border-color: #434343; color: white; } `; document.head.appendChild(styleElem);
})();