// ==UserScript==
// @name         Scorpion Count To Zero!
// @version      0.1
// @description  Scorpion count to zero.
// @author       You
// @match        https://www.youtube.com/channel/UCuju_80sobo8BRXRD9B2QpA
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @namespace https://greasyfork.org/users/746166
// @downloadURL https://update.greasyfork.org/scripts/433125/Scorpion%20Count%20To%20Zero%21.user.js
// @updateURL https://update.greasyfork.org/scripts/433125/Scorpion%20Count%20To%20Zero%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("subscriber-count").innerHTML = "0 subscribers";
})();