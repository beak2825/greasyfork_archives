// ==UserScript==
// @name         הודעות לעורכי תוכי
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  מוסיף שלושה כפתורים חדשים לצד פרסום הודעה: הגהה, לפרסם ואלוף
// @match      *://*/*
// @author       ilay a tinok
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415958/%D7%94%D7%95%D7%93%D7%A2%D7%95%D7%AA%20%D7%9C%D7%A2%D7%95%D7%A8%D7%9B%D7%99%20%D7%AA%D7%95%D7%9B%D7%99.user.js
// @updateURL https://update.greasyfork.org/scripts/415958/%D7%94%D7%95%D7%93%D7%A2%D7%95%D7%AA%20%D7%9C%D7%A2%D7%95%D7%A8%D7%9B%D7%99%20%D7%AA%D7%95%D7%9B%D7%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = (event) => {
    let group = document.getElementsByClassName("group")[2];

    let Mahlaka = document.getElementsByClassName("navbit")[4];
        if (Mahlaka.innerText == "מחלקת תוכן כללי") {
            group.innerHTML += `<br>
<input style="margin-top: 3px" type="button" class="button" value="הגהה" title="הגהה" name="Hagaha" tabindex="1" id="qr_hagaha" onclick="document.querySelector('#cke_contents_vB_Editor_QR_editor > iframe').contentWindow.document.body.append(\`מועבר להגהה\`); $('#qr_submit').click();">
<input type="button" class="button" value="לפרסם" title="לפרסם" name="HMuhana" tabindex="1" id="qr_lefarsem" onclick="document.querySelector('#cke_contents_vB_Editor_QR_editor > iframe').contentWindow.document.body.append(\`יש אישור לפרסם\`); $('#qr_submit').click();">
<input type="button" class="button" value="אלוף" title="אלוף" name="Aluf" tabindex="1" id="qr_aluf" onclick="document.querySelector('#cke_contents_vB_Editor_QR_editor > iframe').contentWindow.document.body.append(\`אלוף\`); $('#qr_submit').click();">`;
        }
        else {}
    };
})();