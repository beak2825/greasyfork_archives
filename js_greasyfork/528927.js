// ==UserScript==
// @name         Next/Prev Page
// @version      1
// @description  Allows you to press ,/. in order to navigate pages.
// @author       Yoboies
// @match        https://rule34.xxx/index.php?page=post&s=list*
// @match        https://rule34.xxx/index.php?page=favorites&s=view*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34.xxx
// @license      MIT
// @namespace https://greasyfork.org/users/1345312
// @downloadURL https://update.greasyfork.org/scripts/528927/NextPrev%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/528927/NextPrev%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var searchStringNext = ">";
    var searchStringPrev = "<";
    var hotkeyNext = "Period";
    var hotkeyPrev = "Comma";
    var found ="";

    document.addEventListener('keydown', logKey);

    function logKey(e) {
        if(e.code==hotkeyNext){
            var tagNames = Array.from(document.getElementsByTagName('a'))
            for (var i = 0; i < tagNames.length; i++) {
                if (tagNames[i].textContent == (searchStringNext)) {
                    found = tagNames[i];
                    found.click();
                    break;
                }
            }
        }else if (e.code==hotkeyPrev){
            var tagNames = Array.from(document.getElementsByTagName('a'))
            for (var i = 0; i < tagNames.length; i++) {
                if (tagNames[i].textContent == (searchStringPrev)) {
                    found = tagNames[i];
                    found.click();
                    break;
                }
            }
        }
    }
})();