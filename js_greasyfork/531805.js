// ==UserScript==
// @name         Hide Spanish Language Div on Bloomberg
// @description  Hides divs with Spanish language section on bloomberg.com
// @match        https://www.bloomberg.com/*
// @version 0.0.1.20250404070600
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/531805/Hide%20Spanish%20Language%20Div%20on%20Bloomberg.user.js
// @updateURL https://update.greasyfork.org/scripts/531805/Hide%20Spanish%20Language%20Div%20on%20Bloomberg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        const allDivs = document.querySelectorAll('div[data-component="grid-module"]');

        allDivs.forEach(div => {
            const section = div.querySelector('section[data-canonical="spanish_language"]');
            if (section) {
                div.style.display = 'none';
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
