// ==UserScript==
// @name     Feedly : get back Keep Unread button
// @namespace JML
// @version  1
// @grant    none
// @include  https://feedly.com/*
// @license MIT 
// @description Get back the Keep Unread button visible when reading an article in Feedly.
// @downloadURL https://update.greasyfork.org/scripts/531507/Feedly%20%3A%20get%20back%20Keep%20Unread%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/531507/Feedly%20%3A%20get%20back%20Keep%20Unread%20button.meta.js
// ==/UserScript==

function simulateKey(letter) {
  // Use the currently active element or body
  const el = document.activeElement || document.body;
  
  // Get the code for the letter
  const code = 'Key' + letter.toUpperCase();
  // Get the keyCode (ASCII code)
  const keyCode = letter.charCodeAt(0);
  
  // Trigger keydown event
  el.dispatchEvent(new KeyboardEvent('keydown', {
    key: letter,
    code: code,
    keyCode: keyCode,
    bubbles: true
  }));
  
  // Trigger keyup event
  el.dispatchEvent(new KeyboardEvent('keyup', {
    key: letter,
    code: code,
    keyCode: keyCode,
    bubbles: true
  }));
}

(function() {
    'use strict';
    function modifyButtonBar() {
        console.log("🔍 Attempting to modify the button bar...");
        
        // Check if the button already exists
        if (document.querySelector('.keep-unread-button')) {
            console.log("✅ Button already exists.");
            return; // If the button already exists, don't create it again.
        }
        const buttonBar = document.querySelector('.ShareBar__wrapper');
        
        if (buttonBar) {
            console.log("✅ Button bar found");
          
            // get the "..." menu
            const bMoreServices = document.querySelector('button[title="More services"]');
            if (!bMoreServices) {
                console.log("❌ More services not found!");
                return;
            }
            
            // Create Keep Unread button:
            const bKeepUnread = document.createElement('button');
          
            bKeepUnread.addEventListener('click', function() {
                simulateKey("m");
            });
            
            bKeepUnread.classList.add('keep-unread-button'); // Add a class to avoid recreating it
            bKeepUnread.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon__B4xp9 icon color--secondary__WX5GF">
                    <g fill="currentColor" fill-rule="nonzero">
                        <path d="M15.429 8.5a6.071 6.071 0 0 1 .227 12.139l-.227.004h-4.286a.5.5 0 0 1-.09-.992l.09-.008h4.286a5.071 5.071 0 0 0 .22-10.138l-.22-.005H2.57a.5.5 0 0 1-.09-.992l.09-.008z"></path>
                        <path d="M6.504 4.358a.5.5 0 0 1 .765.638l-.058.07-3.933 3.93 3.933 3.934a.5.5 0 0 1 .058.637l-.058.07a.5.5 0 0 1-.638.058l-.07-.058L2.219 9.35a.5.5 0 0 1-.058-.638l.058-.07z"></path>
                    </g>
                </svg>
                Keep Unread`;
            
            // Add classes css from "..." menu
            bKeepUnread.classList.add(...bMoreServices.classList);
            
            // Add the button to the bar
            //buttonBar.appendChild(bKeepUnread);
            buttonBar.insertBefore(bKeepUnread, buttonBar.firstChild);
        }
    }
    // Execute the function after the page has loaded
    window.addEventListener('load', modifyButtonBar);
    // Observe changes in the DOM in case new elements are added dynamically
    const observer = new MutationObserver(modifyButtonBar);
    observer.observe(document.body, { childList: true, subtree: true });
})();