// ==UserScript==
// @name         Partner Login AutoClick
// @namespace    christhielen
// @version      1.0
// @description  Auto click "Sign in with Google" on the Netflix Partner Login screen
// @author       Chris Thielen
// @license      MIT
// @match        https://meechum.netflix.com/as/authorization.oauth2*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.net

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469791/Partner%20Login%20AutoClick.user.js
// @updateURL https://update.greasyfork.org/scripts/469791/Partner%20Login%20AutoClick.meta.js
// ==/UserScript==

(function() {
    function waitforit() {
        const button = [...document.querySelectorAll('a span')].find(x => x.innerText.toLowerCase().includes('sign in with google'));
        if (button) {
            button.click();
            button.parentElement.style.transition = "transform 4s ease-out";
            button.parentElement.style.transform = "scale(10)";
            pulse(button, 0);
        } else {
            console.log('Still waiting for "Sign in with Google"');
            setTimeout(waitforit, 100);
        }
    }

    function pulse(element, opacity) {
        element.style.opacity = opacity + "%";
        setTimeout(() => pulse(element, opacity === 0 ? 100 : 0), 200);
    }

    waitforit();
})();