// ==UserScript==
// @name         photopea
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       You
// @match        https://www.photopea.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @description photopea adblock
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449417/photopea.user.js
// @updateURL https://update.greasyfork.org/scripts/449417/photopea.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
style.textContent = '.app > div:not(:first-child) { visibility: hidden; }';
document.head.appendChild(style);
function addCustomEvent() {
    const ADS_WIDTH = 320;
    document.addEventListener('resizecanvas', (e) => {
        // push the ads container outside of the viewport
        window.innerWidth = document.documentElement.clientWidth + ADS_WIDTH;
    });
}
// inject our custom event listener into the "main world"
document.documentElement.setAttribute('onreset', `(${addCustomEvent})()`);
document.documentElement.dispatchEvent(new CustomEvent('reset'));
document.documentElement.removeAttribute('onreset');
function resize(event = {}) {
    if (!event.skip) {
        document.dispatchEvent(new CustomEvent('resizecanvas'));
        // trigger another resize event to update any listeners with the new window.innerWidth
        const resizeEvent = new Event('resize');
        resizeEvent.skip = true;
        window.dispatchEvent(resizeEvent);
    }
}
let debounce;
window.addEventListener('resize', event => {
    clearTimeout(debounce);
    debounce = setTimeout(() => resize(event), 100);
});
resize();
})();