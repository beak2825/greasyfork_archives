// ==UserScript==
// @name         Full Screen Games on Typing.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Full Screen the Games
// @author       Zen
// @match        https://www.typing.com/student/game/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535697/Full%20Screen%20Games%20on%20Typingcom.user.js
// @updateURL https://update.greasyfork.org/scripts/535697/Full%20Screen%20Games%20on%20Typingcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutations, obs) => {
        const container = document.getElementById('js-game');
        container.style = "width: 100vw; height: auto; max-height: 100vh; aspect-ratio: 916 / 400; display: block;"
        const canvas = container && container.querySelector('canvas');

        if (canvas) {
            document.body.innerHTML = '';
            document.body.append(container);
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();