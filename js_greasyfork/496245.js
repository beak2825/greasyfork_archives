// ==UserScript==
// @name         bulk paste
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Paste clipboard content into all input fields on a webpage with one click
// @author       You
// @author       You
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496245/bulk%20paste.user.js
// @updateURL https://update.greasyfork.org/scripts/496245/bulk%20paste.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let isEnabled = true
    // Create a button to trigger the paste function
    const div = document.createElement('button');
    div.textContent = "Active";
    div.style.position = 'fixed';
    div.style.top = '10px';
    div.style.right = '10px';
    div.style.backgroundColor="black"
    div.style.color="white"
    div.style.padding="0.5rem"
    div.style.borderRadius="10px"
    div.style.zIndex = 1000;
    const ref = document.body.appendChild(div);

    ref.addEventListener("click",(e)=>{
        isEnabled = !isEnabled
        if(isEnabled) ref.textContent = "Active"
        else ref.textContent = "Inactive"
    })

    // Function to paste clipboard content into input
    async function pasteClipboard(event) {
        try {
            const clipboardText = await navigator.clipboard.readText();
            event.target.value = clipboardText;
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    }

    // Add event listener to all input elements
    document.addEventListener('click', function(event) {
        if (event.target.tagName === 'INPUT' && event.target.type === 'text' && isEnabled) {
            pasteClipboard(event);
        }
    });

})();