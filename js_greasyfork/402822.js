// ==UserScript==
// @name         Fur Affinity:  Fit image to window by default
// @namespace    https://greasyfork.org/en/users/553652-lutris
// @version      1
// @description  Clicks on the submission image, triggering the full window + dark background view.  Click on the image to return to the default view.  Only works in the new UI.
// @author       Lutris
// @match        https://www.furaffinity.net/view/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402822/Fur%20Affinity%3A%20%20Fit%20image%20to%20window%20by%20default.user.js
// @updateURL https://update.greasyfork.org/scripts/402822/Fur%20Affinity%3A%20%20Fit%20image%20to%20window%20by%20default.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });

    document.getElementById("submissionImg").dispatchEvent(clickEvent);

})();