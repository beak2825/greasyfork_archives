// ==UserScript==
// @name         Kira's Add-To-Favorites Hotkey For Rule34.xxx
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Press R to Add to favorites int Rule34.xxx
// @author       Kiramastercrack
// @match        https://rule34.xxx/index.php?page=post&s=view&id=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439393/Kira%27s%20Add-To-Favorites%20Hotkey%20For%20Rule34xxx.user.js
// @updateURL https://update.greasyfork.org/scripts/439393/Kira%27s%20Add-To-Favorites%20Hotkey%20For%20Rule34xxx.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var searchString = "Add to favorites";
    var hotkey = "KeyR";
    var found ="";

    document.addEventListener('keydown', logKey);

    function logKey(e) {
        if(e.code==hotkey){
            var tagNames = Array.from(document.getElementsByTagName('a'))
            for (var i = 0; i < tagNames.length; i++) {
                if (tagNames[i].textContent.includes(searchString)) {
                    found = tagNames[i];
                    found.click();
                    break;
                }
            }
        }
    }
})();