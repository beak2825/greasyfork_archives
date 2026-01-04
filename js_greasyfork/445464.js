// ==UserScript==
// @name         StartPage AD
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  StartPage ADs
// @author       You
// @match        https://www.startpage.com/sp/search
// @icon         https://www.google.com/s2/favicons?domain=startpage.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445464/StartPage%20AD.user.js
// @updateURL https://update.greasyfork.org/scripts/445464/StartPage%20AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("gcsa-top").style.display = 'none'
    console.log("StartPageAD")
    // Your code here...
})();