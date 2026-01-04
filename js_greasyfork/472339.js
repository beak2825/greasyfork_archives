// ==UserScript==
// @name         Fowcy . Auto Shortlinks
// @namespace    fowcy.autoshortlinks
// @version      1.1
// @description  Automatically clicks shortlink buttons. Made in Trinidad - https://fowcy.xyz/
// @author       stealtosvra
// @match        https://fowcy.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryptofy.club
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472339/Fowcy%20%20Auto%20Shortlinks.user.js
// @updateURL https://update.greasyfork.org/scripts/472339/Fowcy%20%20Auto%20Shortlinks.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.href.includes('https://fowcy.xyz/')) {


        const email = 'email@gmail.com'; // INSERT YOUR EMAIL


        const emailInput = document.querySelector('input[name="email"]');
        if (document.querySelector('input[name="email"]')) {
        emailInput.value = email;}}


    if (window.location.href === 'https://fowcy.xyz/home.php' && window.location.href !== 'https://link1s.com/wO3mIM') {
        window.location.href = 'https://fowcy.xyz/short.php';
    } else {

        setTimeout(() => {
            const loginButton = document.querySelector('button[name="btn-start"]');
            loginButton.click();
        }, 5000); // 5000 milliseconds = 5 seconds

}

            if (window.location.href === 'https://fowcy.xyz/short.php') {
            setTimeout(() => {
                // Select all buttons with type "submit"
                const buttons = document.querySelectorAll("button.btn.btn-block.btn-primary");
                const bypassList = ['megaurl' , 'megafly' , 'linksly']; // Add the names of buttons to bypass

                buttons.forEach(buttons => {
                    if (!bypassList.includes(buttons.name)) {
                        buttons.click();
                    }
                });
            }, 5000); // 5000 milliseconds = 5 seconds
        }

})();