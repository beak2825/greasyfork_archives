// ==UserScript==
// @name         Custom Profile Background 2
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Style the profile section on PixelPlace with a toggleable background tiling option
// @author       Ghost
// @match        https://pixelplace.io/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/492946/Custom%20Profile%20Background%202.user.js
// @updateURL https://update.greasyfork.org/scripts/492946/Custom%20Profile%20Background%202.meta.js
// ==/UserScript==

// Retrieve stored values
const lastBackgroundImage = GM_getValue('lastBackgroundImage', '');
let isTiled = GM_getValue('isTiled', false);

// Add an event listener to handle Ctrl+M key press for image upload
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'm') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.addEventListener('change', function() {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function() {
                    const imageUrl = reader.result;
                    GM_setValue('lastBackgroundImage', imageUrl);
                    applyBackgroundImage(imageUrl, isTiled);
                };
                reader.readAsDataURL(file);
            }
        });
        input.click();
    }
});

// Add an event listener to toggle tiling with Ctrl+1
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'i') {
        isTiled = !isTiled;
        GM_setValue('isTiled', isTiled);
        applyBackgroundImage(GM_getValue('lastBackgroundImage', ''), isTiled);
    }
});

// Function to apply the background image
function applyBackgroundImage(imageUrl, tile) {
    GM_addStyle(`
        .box-x {
            background-image: url('${imageUrl}');
            background-size: ${tile ? '100px auto' : 'cover'};
            background-position: ${tile ? 'top left' : 'center'};
            background-repeat: ${tile ? 'repeat' : 'no-repeat'};
            background-origin: border-box;
            background-clip: content-box;
        }
        }
    `);
}

// Apply the last set background image and tiling mode on page load
if (lastBackgroundImage) {
    applyBackgroundImage(GM_getValue('lastBackgroundImage', ''), isTiled);
}
