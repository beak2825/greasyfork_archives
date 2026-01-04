// ==UserScript==
// @name         Torn Mail Autofill - Mobile/Desktop Fix
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds working autofill button to Torn mail (mobile + desktop compatible, with reload bug fixed)
// @author       Optimus/Hwa
// @match        https://www.torn.com/messages.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538843/Torn%20Mail%20Autofill%20-%20MobileDesktop%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/538843/Torn%20Mail%20Autofill%20-%20MobileDesktop%20Fix.meta.js
// ==/UserScript==


(function () {
    'use strict';


    const titleText = "Trolling Offertory [2487783]";
    const bodyText = `<p>Howdy,&nbsp;<br /><br />I am writing to you today for a good cause, as many people are no strangers to Offertorys offensive habits which has garnered them over 900 people adding them to their enemies list. It seems that now Offertory is activly trying to reach 1000 people enemy listing them.</p><p>I would like to to offer a chance to really troll them in this endeavor, im working on messaging all 931 people that have added them as an enemy, and all im asking is for you to remove them from your enemy list.<br /><br /></p><p>
Imagine the frustration Offertory will feel while getting further and further away from their goal of 1k enemies.<br /><br /></p><p>I hope today treats you well :)</p><p>&nbsp;</p><p>Fairywren</p>`;


    function fillMail(event) {
        if (event) event.preventDefault();  // ✅ Prevent form submission


        const titleBox = document.querySelector('input[name="subject"]');
        if (titleBox) {
            titleBox.value = titleText;
        }


        const iframe = document.querySelector('iframe.cke_wysiwyg_frame');
        if (iframe && iframe.contentDocument) {
            iframe.contentDocument.body.innerHTML = bodyText;
        } else {
            const editableDiv = document.querySelector('div[contenteditable="true"]');
            if (editableDiv) {
                editableDiv.innerHTML = bodyText;
            }
        }
    }


    function addButtonWhenReady() {
        const toolbar =
            document.querySelector('.title-black-wrap') ||
            document.querySelector('div[class*="form-title-input-text"]');


        if (toolbar && !document.getElementById("fillMailButton")) {
            const button = document.createElement('button');
            button.id = "fillMailButton";
            button.innerText = "Enemy Slot";
            button.style.cssText =
                "margin-left: 10px; padding: 5px 10px; background-color: #4CAF50; color: white; border: none; cursor: pointer; border-radius: 5px;";


            button.addEventListener("click", (e) => fillMail(e));  // ✅ Prevent reload


            toolbar.appendChild(button);
        }
    }


    function waitForComposePage() {
        const observer = new MutationObserver(() => {
            if (window.location.href.includes("p=compose")) {
                addButtonWhenReady();
            }
        });


        observer.observe(document.body, { childList: true, subtree: true });
    }


    waitForComposePage();
})();