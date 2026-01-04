// ==UserScript==
// @name         Sorry, simplywall.st
// @namespace    simplywall.st
// @version      1.001
// @description  simplywall.st hide banner
// @author       Anton
// @match        https://simplywall.st/stocks/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/394960/Sorry%2C%20simplywallst.user.js
// @updateURL https://update.greasyfork.org/scripts/394960/Sorry%2C%20simplywallst.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(
`
div[data-cy-id^='modal-ModalPortal-'] { display: none !important; }
#root { filter: none !important; }
`
    );
})();