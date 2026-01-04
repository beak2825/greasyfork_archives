// ==UserScript==
// @name         Birthday Buddy
// @version      0.4
// @namespace    https://spoonstudios.dev/
// @description  Helps you remember birthdays!
// @author       EthanSpoon
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539917/Birthday%20Buddy.user.js
// @updateURL https://update.greasyfork.org/scripts/539917/Birthday%20Buddy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the popup container
    const popup = document.createElement('div');
    let rand = Math.floor(Math.random() * 5) + 1;
    if (rand==1) {
        popup.textContent = "you suck";
    } else if(rand==2){
        popup.textContent = "you are stinky";
    } else if(rand==3){
        popup.textContent = "you smell like fishy fish";
    } else if(rand==4){
        popup.textContent = "panko awesome";
    } else{
        popup.textContent = "never gonna give you up";
    }


    // Style the popup (centered, visible, nice background)
    Object.assign(popup.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#222',
        color: '#fff',
        padding: '20px 40px',
        fontSize: '24px',
        fontFamily: 'Arial, sans-serif',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
        zIndex: 99999,
        cursor: 'pointer',
        userSelect: 'none',
    });

    // Remove popup when clicked
    popup.addEventListener('click', () => popup.remove());

    // Add popup to body
    document.body.appendChild(popup);

    // Optional: remove popup automatically after 5 seconds
    setTimeout(() => popup.remove(), 5000);
})();