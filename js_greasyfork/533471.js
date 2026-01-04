// ==UserScript==
// @name         Kira's Previous-Next Hotkey For Rule34.xxx
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Press Q or E for previous or next image in Rule34.xxx
// @author       Kiramastercrack
// @match        https://rule34.xxx/index.php?page=post&s=view&id=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533471/Kira%27s%20Previous-Next%20Hotkey%20For%20Rule34xxx.user.js
// @updateURL https://update.greasyfork.org/scripts/533471/Kira%27s%20Previous-Next%20Hotkey%20For%20Rule34xxx.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    var searchStringP = "< previous";
    var searchStringN = "next >";
    var hotkeyP = "KeyQ";
    var hotkeyN = "KeyE";
    var found ="";
 
    document.addEventListener('keydown', logKey);
 
    function logKey(e) {
        if(e.code==hotkeyP){
            var tagNames = Array.from(document.getElementsByTagName('a'))
            for (var i = 0; i < tagNames.length; i++) {
                if (tagNames[i].textContent.includes(searchStringP)) {
                    found = tagNames[i];
                    found.click();
                    break;
                }
            }
        }
        if(e.code==hotkeyN){
            var tagNames = Array.from(document.getElementsByTagName('a'))
            for (var i = 0; i < tagNames.length; i++) {
                if (tagNames[i].textContent.includes(searchStringN)) {
                    found = tagNames[i];
                    found.click();
                    break;
                }
            }
        }
    }
})();