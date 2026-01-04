"use strict";
// ==UserScript==
// @name         Sauce Opener
// @namespace    https://9gag.com/
// @version      1.1.5
// @description  For when your pasta feels too dry. Highlight text and Alt+T to open sauce. Highlighting numbers will open the holy scriptures, urls will open themselves and strings will open a Google search
// @author       Redeven
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416622/Sauce%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/416622/Sauce%20Opener.meta.js
// ==/UserScript==
(function () {
    'use strict';
    function getSauce() {
        const SELECTION = window.getSelection();
        if (SELECTION === null || SELECTION === void 0 ? void 0 : SELECTION.toString()) {
            const SAUCE_REGEX = /^[0-9]{1,6}$/g;
            const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
            const SAUCE = SELECTION.toString().trim();
            if (SAUCE_REGEX.test(SAUCE)) {
                window.open(`https://nhentai.net/g/${SAUCE}`, '_blank');
            }
            else if (URL_REGEX.test(SAUCE)) {
                window.open(SAUCE);
            }
            else {
                window.open(`https://www.google.com/search?q=${SAUCE}`);
            }
        }
    }
    document.addEventListener('keydown', (event) => {
        if (event.key === 't' && event.altKey) {
            event.preventDefault();
            getSauce();
        }
    });
})();