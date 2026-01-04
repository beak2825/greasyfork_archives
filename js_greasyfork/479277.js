// ==UserScript==
// @name         Soyjak.Party Filename Randomizer
// @namespace    datamining
// @version      1.0
// @description  Rename uploaded images and videos with random filenames 
// @include      https://soyjak.party/static/front-page/soyberg.png  
// @license      MIT 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479277/SoyjakParty%20Filename%20Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/479277/SoyjakParty%20Filename%20Randomizer.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function generateRandomString(length) {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let randomString = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters.charAt(randomIndex);
        }
        return randomString;
    }

    function renameFileInput(input) {
        if (input && input.files.length > 0) {
            const file = input.files[0];
            const extension = file.name.split('.').pop().toLowerCase();
            const randomString = generateRandomString(10);
            let newName = '';

            if (['jpeg', 'png', 'gif', 'jpg'].includes(extension)) {
                newName = 'IMG_' + randomString + '.' + extension;
            } else if (['mp4', 'mkv', 'webm', 'mov', 'wmv'].includes(extension)) {
                newName = 'VID_' + randomString + '.' + extension;
            }

            if (newName) {
                Object.defineProperty(file, 'name', {
                    value: newName,
                    writable: true,
                });
            }
        }
    }


    const fileInputs = document.querySelectorAll('input[type="file"]');
    if (fileInputs) {
        fileInputs.forEach(input => {
            input.addEventListener('change', () => {
                renameFileInput(input);
            });
        });
    }
})();
