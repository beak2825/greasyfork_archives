// ==UserScript==
// @name         NZBGrabit ImgProxy Button
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @run-at       document-end
// @version      3.2
// @description  Inserts a button to modify image URL with optional crop size
// @author       JRem
// @match        https://www.nzbgrabit.org/managenzb.php?do=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529938/NZBGrabit%20ImgProxy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/529938/NZBGrabit%20ImgProxy%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to generate a random string of 1-5 characters
    function getRandomString() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const length = Math.floor(Math.random() * 5) + 1; // Random length between 1 and 5
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Function to find all input fields ending with '_nzbimage'
    function findTargetInputs() {
        return document.querySelectorAll('input[id$="_nzbimage"]');
    }

    // Function to add UI elements
    function addUIElements() {
        const targetInputs = findTargetInputs();

        if (!targetInputs.length) return;

        targetInputs.forEach(targetInput => {
            // Generate a random string for each button instance
            const randomString = getRandomString();
            
            // Create the Resize button
            const buttonResize = document.createElement('button');
            buttonResize.textContent = 'JPG';
            buttonResize.style.marginLeft = '10px';
            buttonResize.type = 'button'; // Prevents form submission

            // Button click event (Resize)
            buttonResize.addEventListener('click', function(event) {
                event.preventDefault(); // Prevents unintended form submission
                if (targetInput.value.trim()) {
                    targetInput.value = `https://imgproxy.jrem.org/${randomString}/f:jpg/mb:1000000/plain/` + targetInput.value;
                }
            });
            // Create the Resize2 button
            const buttonResize2 = document.createElement('button');
            buttonResize2.textContent = 'FlyIMG';
            buttonResize2.style.marginLeft = '10px';
            buttonResize2.type = 'button'; // Prevents form submission

            // Button click event (Resize)
            buttonResize2.addEventListener('click', function(event) {
                event.preventDefault(); // Prevents unintended form submission
                if (targetInput.value.trim()) {
                    targetInput.value = `https://demo.flyimg.io/upload/q_90,o_png/` + targetInput.value;
                }
            });

            // Create the button without resize
            const buttonWithoutResize = document.createElement('button');
            buttonWithoutResize.textContent = 'PNG';
            buttonWithoutResize.style.marginLeft = '10px';
            buttonWithoutResize.type = 'button'; // Prevents form submission

            // Button click event (without resize)
            buttonWithoutResize.addEventListener('click', function(event) {
                event.preventDefault(); // Prevents unintended form submission
                if (targetInput.value.trim()) {
                    targetInput.value = `https://demo.flyimg.io/upload/o_png,c_1/` + targetInput.value;
                    //https://imgproxy.jrem.org/${randomString}/f:png/q:50/plain/
                }
            });

            // Insert elements after the target input
            targetInput.parentNode.insertBefore(buttonWithoutResize, targetInput.nextSibling);
            targetInput.parentNode.insertBefore(buttonResize, buttonWithoutResize.nextSibling);
            targetInput.parentNode.insertBefore(buttonResize2, buttonResize.nextSibling);
        });
    }

    // Run the function when the page loads
    window.addEventListener('load', addUIElements);
})();