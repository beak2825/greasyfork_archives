// ==UserScript==
// @license MIT
// @name         Milk Man
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Milk man's package
// @author       Milks Man
// @match        *://*.torbox.app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525526/Milk%20Man.user.js
// @updateURL https://update.greasyfork.org/scripts/525526/Milk%20Man.meta.js
// ==/UserScript==

'use strict';

function removeHiddenClass() {
    document.querySelectorAll('.flex.justify-center.bg-\\[\\#0f1117\\].p-2.hidden')
        .forEach(element => element.classList.remove('hidden'));
}

const observer = new MutationObserver(removeHiddenClass);

observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
});

removeHiddenClass();