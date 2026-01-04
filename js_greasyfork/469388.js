// ==UserScript==
// @name         Change the black bar text4
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change the bar text
// @include      https://vanced-youtube.neocities.org/2011/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469388/Change%20the%20black%20bar%20text4.user.js
// @updateURL https://update.greasyfork.org/scripts/469388/Change%20the%20black%20bar%20text4.meta.js
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
replaceText('Videos', 'Mаps');
replaceText('Maps', 'Play');
replaceText('News', 'YouTube');
replaceText('Shopping', 'News');
replaceText('more', 'Мore');