// ==UserScript==
// @name         Sorter Labor Kiosk
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Will Log associate into Sorter function
// @author       cpatters
// @match        https://aftlite-portal.amazon.com/indirect_action*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375229/Sorter%20Labor%20Kiosk.user.js
// @updateURL https://update.greasyfork.org/scripts/375229/Sorter%20Labor%20Kiosk.meta.js
// ==/UserScript==


  var login= prompt( "SORTER");
    document.querySelector("input[name='scan_name']").value= login
    document.querySelector("input[name='scan_code']").value= 'sorter'
    document.querySelector("input[type='submit']").click();