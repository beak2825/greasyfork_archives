// ==UserScript==
// @name         ZeriusSecret
// @namespace    http://tampermonkey.net/
// @version      2nd-time.html
// @description  Secondary website /time.html (it's a secret)
// @author       Owner, Creator, and Programmer of the ZeriusLearning websites.
// @match        https://zerius-learning.w3spaces.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=w3spaces.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442495/ZeriusSecret.user.js
// @updateURL https://update.greasyfork.org/scripts/442495/ZeriusSecret.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementById("aux_tags").innerHTML+="<hr/><h1>Secoundary Website</h1><hr/><h3><a href=\"https://zerius-learning-2nd.w3spaces.com/time.html\">Clock (notifications)</a></h3>";
})();