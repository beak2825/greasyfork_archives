// ==UserScript==
// @name         כפתור "העבירו לחברים"
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  מוסיף כפתור לפרסום האשכול שלכם
// @author       avishaiUniverse
// @match        https://www.fxp.co.il/showthread.php?t=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414550/%D7%9B%D7%A4%D7%AA%D7%95%D7%A8%20%22%D7%94%D7%A2%D7%91%D7%99%D7%A8%D7%95%20%D7%9C%D7%97%D7%91%D7%A8%D7%99%D7%9D%22.user.js
// @updateURL https://update.greasyfork.org/scripts/414550/%D7%9B%D7%A4%D7%AA%D7%95%D7%A8%20%22%D7%94%D7%A2%D7%91%D7%99%D7%A8%D7%95%20%D7%9C%D7%97%D7%91%D7%A8%D7%99%D7%9D%22.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = (event) => {
    let group = document.getElementsByClassName("group")[2];
            group.innerHTML += `<br>
<input style="margin-top: 3px" type="button" class="button" value="העבירו לחברים" title="העבירו לחברים" name="Hagaha" tabindex="1" id="qr_forwardtofriends" onclick="document.querySelector('#cke_contents_vB_Editor_QR_editor > iframe').contentWindow.document.body.append(\`[addthis]1[/addthis]\`);">`;
        }
})();