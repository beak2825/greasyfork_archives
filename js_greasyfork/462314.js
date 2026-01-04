// ==UserScript==
// @name         hCaptcha Autoclick
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Automatically click hCaptcha checkbox button when detected it and doesn't solve the captcha for you!
// @author       Streampunk
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAe1BMVEVHcEwAq78Anb8A1L8Aub8Agb8Aj78Axr8AdL8A1b8Axr8Aub8AdL8Aj78Agr8Apb8AxL8Avr8Ag78Agr8ApL8Ajr8Ac78Agb+i0998xdT///8Aq78AuL4Axr8Agb4Anb8Aj7/o9fjJ5uwAp7wAkbhTuskAoLcws8JJnceA1XrHAAAAGnRSTlMAs7OBzMnMyrKysoKAgLLHeqzQi6x6erD++4jlpAEAAAJ2SURBVFiF7ZbbctowFEUNrZOWAuMYU3RxsSX59v9fWEvnSAbJMg7J9CVdzgwZcfbKlkRmSBKPb8hPD7vuzwd8liD79AbZV2qQwRM0gPW44PV1Zx7LHw/3Bs6Fgh3wSPCGY4Fgt1KwiwnWNoCpt3/egH6sQcsYo48aLAj6Mc9ErMEv5DtShjAj0L/1ZWnnbG6FQBhBW5at1ti5zBNkMQGHPDV5xmSsQVQgTZ6UJWV3gpsGmS/oJZP3eclLwmAn8w2yO4GJQJ74+dszyPTfnmlgZgWf8qLkLh/eQjZ6NJNgujXYNiu5dPmpAZJsNNtNwREFKaq4aiHWd5jvleoJUTBXbIAEX52gM9cmOpdvXR6WpFoWtLZADzEKRp3v4CS6RYGSOKT8vMK3yHIDhUOYEzbPFTaS3eIZKGhp8w7VUduILwowKIO8vUjFlwU9m0Eo5Q6SB4KtoSgqA5kTNHihoqqapkIKCG5RsAVBI+cEuCibhgrWLgvEnAAgjdGLJhQUawS0GcDzZIO2wf/s5okz0MeHavLgEOdvgbGqtfuoYoItLLeRBvAyVBM2l5wP4zPyYkijhzhaas0LcjbBwzk5AFYQ2YM+vuu9AIOeIF6BQP6h4GWYz1PMPxZcZzcx1LUnOMQE9YxB1HUgiDao6yudP75IgxNwmAR1Pdx9osltfhJg0H1PSC/H42UkNVCnEMPVkCKXcW4kDb6hmOVRkePgQOUIwbgT5JC/hIIUDXmqnzS9eqRmPUdBtIEWmHwoAPPaBnmkQbqmQWQL72mgf959BnjKxxzxBXb9iLcRCCz738APD1zeR4OW094QCmD99LRg/1HB/wbxBn8Bz8LnyLIM2vkAAAAASUVORK5CYII=
// @match        https://*.hcaptcha.com/*hcaptcha-challenge*
// @match        https://*.hcaptcha.com/*checkbox*
// @match        https://*.hcaptcha.com/*captcha*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462314/hCaptcha%20Autoclick.user.js
// @updateURL https://update.greasyfork.org/scripts/462314/hCaptcha%20Autoclick.meta.js
// ==/UserScript==

(function() {

    var CHECKBOX = "#checkbox";
    var ARIA_CHECKED = "aria-checked";

    function qSelector(selector) {
        return document.querySelector(selector);
    }

    function isHidden(el) {
        return (el.offsetParent === null)
    }

    if (window.location.href.includes("checkbox")) {
        var checkboxInterval = setInterval(function() {
            if (!qSelector(CHECKBOX)) {
            } else if (qSelector(CHECKBOX).getAttribute(ARIA_CHECKED) == "true") {
                clearInterval(checkboxInterval);
            } else if (!isHidden(qSelector(CHECKBOX)) && qSelector(CHECKBOX).getAttribute(ARIA_CHECKED) == "false") {
                qSelector(CHECKBOX).click();
            } else {
                return;
            }

        }, 500);
    }

})();