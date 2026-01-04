// ==UserScript==
// @name         HackTheBox Seasons Banner Remover (OldUI)
// @author       torry2

// @version      6.9
// @description  Removes the "This interface is not supported for playing Seasonal machines." Banner from the OldUI

// @match        https://www.hackthebox.com/home*
// @match        https://www.hackthebox.eu/home*
// @icon         https://www.hackthebox.com/images/favicon.png

// @compatible   Tampermonkey
// @grant        none

// @license      MIT
// @namespace https://greasyfork.org/users/1072956
// @downloadURL https://update.greasyfork.org/scripts/465506/HackTheBox%20Seasons%20Banner%20Remover%20%28OldUI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/465506/HackTheBox%20Seasons%20Banner%20Remover%20%28OldUI%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const banner = '.alert.alert-danger';

    const remove = () => {
        const div = document.querySelector(banner);
        if (div) {
            div.remove();
        }
    };
    remove();

    const loop = () => {
        const observer = new MutationObserver(() => {
            const div = document.querySelector(banner);
            if (div) {
                div.remove();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };
    loop();
})();

// shoutout cre4k