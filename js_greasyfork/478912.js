(function() {
    'use strict';

    ```
// ==UserScript==
// @name         Remove Popup 715967
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Remove Adblock Window
// @author       Prynamiq
// @match        https://www.fcportables.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478912/Remove%20Popup%20715967.user.js
// @updateURL https://update.greasyfork.org/scripts/478912/Remove%20Popup%20715967.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var targetId = '715967';

    // Function to remove the specific popup element
    function removePopupElement() {
        var targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.remove();
        }
    }

    // Wait for the page to load and remove the popup element
    window.addEventListener('load', function() {
        removePopupElement();
    });
})();
```
})();