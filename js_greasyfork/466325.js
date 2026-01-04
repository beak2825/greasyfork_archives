// ==UserScript==
// @name         ChatGPT Replace Profile Picture
// @namespace    https://github.com/wbrandon25/ChatGPT-Change-Profile-Picture
// @version      1.1
// @description  Replace user profile picture with custom image
// @author       wbrandon25
// @match        https://chat.openai.com/*
// @grant        none
// @homepageURL  https://github.com/wbrandon25/ChatGPT-Change-Profile-Picture

// @downloadURL https://update.greasyfork.org/scripts/466325/ChatGPT%20Replace%20Profile%20Picture.user.js
// @updateURL https://update.greasyfork.org/scripts/466325/ChatGPT%20Replace%20Profile%20Picture.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ENTER YOUR CUSTOM IMAGE URL HERE
    const customImageUrl = 'https://cdn.discordapp.com/attachments/1092885792298373200/1107555201382109194/firefox_zrFofziNad.png';

    function replaceProfilePictures() {
        const images = document.getElementsByTagName('img');

        for (let i = 0; i < images.length; i++) {
            const img = images[i];

            if (img.classList.contains('rounded-sm') && img.getAttribute('data-nimg') === '1') {
                img.src = customImageUrl;
                img.srcset = customImageUrl;
            }
        }
    }

    replaceProfilePictures();

    document.addEventListener('DOMNodeInserted', function() {
        replaceProfilePictures();
    });
})();
