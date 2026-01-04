// ==UserScript==
// @name         Sorozatbarat 1001 hider
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  When you get 1001 error it automatically goes to previous page.
// @author       Mosomedve
// @match        https://www.sorozatbarat.club/?code=1001
// @downloadURL https://update.greasyfork.org/scripts/434890/Sorozatbarat%201001%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/434890/Sorozatbarat%201001%20hider.meta.js
// ==/UserScript==

(function (){
    var currentPage = window.location.href;
    if(currentPage.includes("code=1001")) history.back(); 
})();