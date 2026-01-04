// ==UserScript==
// @name         Raindrop Bookmarklet Auto Focus On Tag
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  when open Raindrop.io popup window, auto focus on tag inbox
// @author       Kevin Xi
// @match        https://app.raindrop.io/add?link=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=raindrop.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484231/Raindrop%20Bookmarklet%20Auto%20Focus%20On%20Tag.user.js
// @updateURL https://update.greasyfork.org/scripts/484231/Raindrop%20Bookmarklet%20Auto%20Focus%20On%20Tag.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const RETRY = 500;
    function getInputElement() {
        if (document.querySelector('#react > div > div.edit-nTT_ > form > div > div.buttons-qsoR > div')?.firstChild?.tagName === 'DIV') {    // would be "SPAN" when loading
            return Promise.resolve(document.querySelector("#downshift-0-input"));
        }
        return new Promise(res => setTimeout(
            async () => res(await getInputElement()),
            RETRY)
        );
    }
    const inputElement = await getInputElement();
    inputElement.focus();
})();