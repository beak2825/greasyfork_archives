// ==UserScript==
// @name            Look up in Cambridge Dictionary
// @description     Look up the selected word in Cambridge Dictionary
// @iconURL         https://dictionary.cambridge.org/favicon.ico
// @version         0.2
// @author          LocVo
// @match           https://*/*
// @grant           GM_openInTab
// @grant           GM_getValue
// @run-at          context-menu
// @license         MIT
// @namespace https://greasyfork.org/users/366837
// @downloadURL https://update.greasyfork.org/scripts/463418/Look%20up%20in%20Cambridge%20Dictionary.user.js
// @updateURL https://update.greasyfork.org/scripts/463418/Look%20up%20in%20Cambridge%20Dictionary.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const selectedText = window.getSelection().toString()
    if(!selectedText) {
        return;
    }
    GM_openInTab(`https://dictionary.cambridge.org/dictionary/english/${selectedText}`, { active: true });
})();