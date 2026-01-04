// ==UserScript==
// @name         Discord Orange status
// @namespace    https://greasyfork.org/en/users/3372-nixxquality
// @version      1.1
// @description  Improve the orange status on Discord
// @author       nixx <nixx@is-fantabulo.us>
// @match        https://discordapp.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/34862/Discord%20Orange%20status.user.js
// @updateURL https://update.greasyfork.org/scripts/34862/Discord%20Orange%20status.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
.status-idle, .avatarStatusIdle-3ADLtR {
    background-size: contain;
    background-image: url("https://cdn.discordapp.com/avatars/135790374269485056/c24425dbca0343fc5a959e8de167de97.png?size=128");;
}
`);
})();