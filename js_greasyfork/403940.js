// ==UserScript==
// @name         Taller Plex metadata modal
// @version      0.1
// @description  Makes the Plex metadata modal taller so it doesn't cut off the collections dropdown
// @author       Jim Leirvik <jim@jimleirvik.no>
// @match        https://app.plex.tv/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/570718
// @downloadURL https://update.greasyfork.org/scripts/403940/Taller%20Plex%20metadata%20modal.user.js
// @updateURL https://update.greasyfork.org/scripts/403940/Taller%20Plex%20metadata%20modal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('.edit-metadata-modal .modal-body { max-height: 730px; }');
    GM_addStyle('.edit-metadata-modal .modal-body-pane { height: 730px; }');
    GM_addStyle('.edit-metadata-modal .selectize-dropdown-content { max-height: 338px; }');
})();