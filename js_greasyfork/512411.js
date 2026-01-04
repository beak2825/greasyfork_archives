// ==UserScript==
// @name         Base
// @namespace    http://tampermonkey.net/
// @version      2024-10-13
// @description  Base script for other eRep scripts
// @license      MIT
// @author       You
// @match        https://www.erepublik.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erepublik.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/512411/Base.user.js
// @updateURL https://update.greasyfork.org/scripts/512411/Base.meta.js
// ==/UserScript==
(function() {
    'use strict';

    class TokenProvider {
        static get crsfToken() {
            return unsafeWindow.SERVER_DATA.csrfToken;
        }

        static get authToken() {
            return unsafeWindow.erepublik.settings.pomelo.authToken;
        }

        static get battleStartAt() {
            return unsafeWindow.SERVER_DATA.battle_start_at;

        }
    }

    unsafeWindow.TokenProvider = TokenProvider;

    function getContainer() {
        const container = document.createElement('div');
        container.textContent = 'hello world';
        container.style.backgroundColor = 'white';
        container.style.position = 'fixed';
        container.style.zindex = 9999;
        container.style.width = '300px';
        container.style.padding = '4px';
        container.style.border = 'solid 1px #000';

        return container;
    }

    function getP(text) {
        const p = document.createElement('p');
        p.style.fontSize = '8px';
        p.textContent = text;
        return p;
    }

    const body = document.querySelector('body');
    const container = getContainer();

    const crsf = getP(`CRSF: ${TokenProvider.crsfToken}`);
    const auth = getP(`Auth: ${TokenProvider.authToken}`);

    container.appendChild(crsf);
    container.appendChild(auth);

    // body.insertBefore(container, body.firstChild);

})();