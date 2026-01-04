// ==UserScript==
// @name         Change the black bar text
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change the bar text
// @include      https://vanced-youtube.neocities.org/2011/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469385/Change%20the%20black%20bar%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/469385/Change%20the%20black%20bar%20text.meta.js
// ==/UserScript==

function replaceText(original, replacement) {
    const elements = document.getElementsByClassName('gbts');
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.innerHTML === original) {
            element.innerHTML = replacement;
        }
    }
}

replaceText('Web', 'Search');
replaceText('Videos', 'Maps');
replaceText('Maps', 'Play');
replaceText('News', 'YouTube');
replaceText('Shopping', 'News');