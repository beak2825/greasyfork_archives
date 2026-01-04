// ==UserScript==
// @name         Annoyer Bot
// @version      0.4
// @namespace    https://spoonstudios.dev/
// @description  Annoys you
// @author       EthanSpoon
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539921/Annoyer%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/539921/Annoyer%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the popup container
    const popup = document.createElement('div');
    let rand = Math.floor(Math.random() * 10) + 1;
    if (rand==1) {
        popup.textContent = "hello";
    } else if(rand==2){
        popup.textContent = "ping";
    } else if(rand==3){
        popup.textContent = "never gonna give you up";
    } else if(rand==4){
        popup.textContent = "get back to work";
    } else if(rand==5){
        popup.textContent = "take a chill pill";
    }else if(rand==6){
        popup.textContent = "meow";
    }else if(rand==7){
        popup.textContent = "made by spoonstudios";
    }else if(rand==8){
        popup.textContent = "learn more coding";
    }else if(rand==9){
        popup.textContent = "qwerty123456";
    }else if(rand==5){
        popup.textContent = "how are you?";
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