// ==UserScript==
// @name         Automated Modules Customization
// @version      1.0.1
// @namespace    http://tampermonkey.net/
// @description  Automatically apply customizations to Canvas modules: check 'mark done' checkbox before navigating to the next video in Canvas; reduce the size of large images; increase the size of Kaltura video player.
// @author       Kyle Nakamura
// @match        https://gatech.instructure.com/courses/*/pages/*
// @icon         https://www.google.com/s2/favicons?domain=instructure.com
// @downloadURL https://update.greasyfork.org/scripts/427922/Automated%20Modules%20Customization.user.js
// @updateURL https://update.greasyfork.org/scripts/427922/Automated%20Modules%20Customization.meta.js
// ==/UserScript==

// Quick note about delays (timeouts):
// Canvas loads the video player and images last, so customizations to
// those elements must be delayed. You can adjust the delay if your elements
// seem to load slower or faster than the pre-set 1.5 seconds.
(() => {
    'use strict';

    // Enable auto-checkbox toggle with a delay of 500ms
    setTimeout(enableAutoCheckboxToggle, 500);

    // Reduce the size of images with a delay of 1500ms
    setTimeout(reduceTranscriptImageSizes, 1500);

    // Increase the size of the Kaltura video player with a delay of 1500ms
    setTimeout(increaseKalturaSize, 1500);
})();

function enableAutoCheckboxToggle() {
    try {
        const checkbox = $('button#mark-as-done-checkbox'),
              checkboxIconClass = $(checkbox).find('i')[0].className,
              buttonNext = $('span.module-sequence-footer-button--next').find('a');

        buttonNext.on('click', () => {
            if (checkboxIconClass === 'icon-empty') checkbox.click();
        });
    } catch (err) {
        console.error('Tampermonkey script "Auto Checkbox Toggle" failed.\nDetails:', err);
    }
}

function reduceTranscriptImageSizes() {
    try {
        $('.user_content img').each(function() {
            $(this).css('max-width', '30%');
        });
    } catch (err) {
        console.error('Tampermonkey script "Reduce Transcript Image Sizes" failed.\nDetails:', err);
    }
}

function increaseKalturaSize() {
    try {
        const kalturaPlayer = $('iframe[src^="https://gatech.instructure.com"')[0];
        kalturaPlayer.width = '';
        kalturaPlayer.height = '';
        kalturaPlayer.style.width = '100%';

        helperFuncApplyNewHeight(kalturaPlayer);

        let resizeTimer;
        $(window).on('resize', e => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                helperFuncApplyNewHeight(kalturaPlayer);
            }, 250);
        });
    } catch (err) {
        console.error('Tampermonkey script "Increase Kaltura Size" failed.\nDetails:', err);
    }
}

// Helper function for `increaseKalturaSize()`
const helperFuncApplyNewHeight = player => {
    // Calculate the new width after window size changed
    const newWidth = parseInt(window.getComputedStyle(player).width.split('px')[0]);

    let divider = 1.5;
    if (newWidth < 600) divider = 1.8;

    player.style.height = newWidth / divider + 'px';
}