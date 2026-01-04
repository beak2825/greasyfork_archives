// ==UserScript==
// @name         kaldata quoted images
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shrink quoted images
// @author       bornofash
// @match        https://www.kaldata.com/forums/topic/*
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @require https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @downloadURL https://update.greasyfork.org/scripts/376407/kaldata%20quoted%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/376407/kaldata%20quoted%20images.meta.js
// ==/UserScript==

waitForKeyElements('blockquote', shrink_images)

function shrink_images(blockquote) {
    blockquote.find('img').each(function() {
        var width = $(this).css('width');
        if (parseInt(width) > 200) {
            $(this).css('width', '200px');
            $(this).attr('title', 'Преоразмерена картинка (на ширина беше ' + width + ', а сега е 200px)');
        }
    });
};