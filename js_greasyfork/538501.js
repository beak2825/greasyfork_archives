// ==UserScript==
// @name         Wellio Locked Question Unblurrer
// @namespace    http://tampermonkey.net/
// @version      2025-06-06
// @description  Userscript which unblurs all locked questions in a Wellio quiz, so one may do them before their peasantly friends are able to. However, one will only be able to submit them successfully once they are unlocked.
// @author       redbackspider69 on Github
// @match        https://app.wellioeducation.com/schools/*/classes/*/lessons/*/learn
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wellioeducation.com
// @grant        none
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/538501/Wellio%20Locked%20Question%20Unblurrer.user.js
// @updateURL https://update.greasyfork.org/scripts/538501/Wellio%20Locked%20Question%20Unblurrer.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', function() {
        var blurs = Array.from(document.getElementsByClassName('bg-blur'));
        blurs.forEach(function(blur) {
            blur.remove();
        });
    }, false);
})();