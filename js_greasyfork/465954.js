// ==UserScript==
// @name        Remove "People Also Search For" Box
// @namespace   Violentmonkey Scripts
// @match       https://www.google.com/search*
// @grant       none
// @license     MIT
// @version     1.1
// @author      Thomas Orlita
// @description Removes the annoying "People also search for" box that pops up in Google Search and causes layout shift after a navigation.
// @homepageURL https://github.com/ThomasOrlita/remove-people-also-search-for-box
// @icon        https://lh3.googleusercontent.com/p2DRlj5cKHhXhUSkeD1q3qVIptdOFc4X7K-qodU1kyzhKnQBXPn1P5ECXed5GMdMoiSJufKXKcQnieTVuY6twgXoXA=w128-h128-e365-rj-sc0x00ffffff
// @downloadURL https://update.greasyfork.org/scripts/465954/Remove%20%22People%20Also%20Search%20For%22%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/465954/Remove%20%22People%20Also%20Search%20For%22%20Box.meta.js
// ==/UserScript==

// removes the "people also search for" box
document.querySelectorAll('div[id^=eob], div[id^=aob]').forEach(e => {
    const parentElement = e.parentElement;
    e.remove();
    parentElement.style.height = 'auto';
});