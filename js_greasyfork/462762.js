// ==UserScript==
// @name         Auto Try again CAI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-clicks "Try Again" everytime you trigger the filter in CAI. Checks for pop-up every 50 miliseconds
// @author       u/SweetCommieTears
// @match        https://beta.character.ai/chat*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=character.ai
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462762/Auto%20Try%20again%20CAI.user.js
// @updateURL https://update.greasyfork.org/scripts/462762/Auto%20Try%20again%20CAI.meta.js
// ==/UserScript==

(function() {
    let counter = 0
    var interval = setInterval(function() {
        var toastify = document.querySelectorAll('[role="alert"]');
        if (toastify.length > 0) {
            for (var i = 0; i < toastify.length; i++) {
                if (toastify[i].innerHTML.indexOf("Try Again") !== -1) {
                    toastify[i].querySelector(".btn-primary").click();
                    counter++
                    console.log('Auto-clicked %s times', counter)
                    break;
                }
            }
        }
    }, 50);
})();