// ==UserScript==
// @name         MyEpisodes.com: mobile-friendly
// @namespace    myepisodes-mobilefriendly
// @version      1.04
// @description  Make Site more mobile-friendly
// @author       Scriptonomics
// @match        https://*.myepisodes.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myepisodes.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524442/MyEpisodescom%3A%20mobile-friendly.user.js
// @updateURL https://update.greasyfork.org/scripts/524442/MyEpisodescom%3A%20mobile-friendly.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let mvp = document.querySelector('meta[name="viewport"]');
    if (!mvp) {
        mvp = document.createElement('meta');
        mvp.name = "viewport";
        document.head.appendChild(mvp);
    }
    mvp.setAttribute('content', 'width=device-width');

    const style = document.createElement('style');
    style.textContent = `
        body, form, tr, input, ul, pre, button {
            _font-size: 1rem;
        }

        #divContainer {
            width: auto;
        }

        td[width="50%"] {
            width: auto;
        }

        td[width="760px"] {
            width: auto;
        }



    `;
    document.head.appendChild(style);
})();
