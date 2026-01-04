// ==UserScript==
// @name         Custom Profile Background 2
// @namespace    http://tampermonkey.net/
// @version      2
// @description  background
// @author       Ghost
// @match        https://pixelplace.io/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/547128/Custom%20Profile%20Background%202.user.js
// @updateURL https://update.greasyfork.org/scripts/547128/Custom%20Profile%20Background%202.meta.js
// ==/UserScript==


const lastBackgroundImage = GM_getValue('lastBackgroundImage', '');
let isTiled = GM_getValue('isTiled', false);

// press Ctrl+M
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

// press ctrl+1 to change to tile mode
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'i') {
        isTiled = !isTiled;
        GM_setValue('isTiled', isTiled);
        applyBackgroundImage(GM_getValue('lastBackgroundImage', ''), isTiled);
    }
});


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


if (lastBackgroundImage) {
    applyBackgroundImage(GM_getValue('lastBackgroundImage', ''), isTiled);
}
