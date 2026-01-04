// ==UserScript==
// @name         Hollow favi replacement thingy skibidi
// @namespace    https://github.com/Nublord33
// @version      0.1
// @description  akane do your job
// @author       Nublord33/skibidiskid
// @license      Do whatever you want
// @match        https://hollow.live/*
// @grant        whats this?
// @downloadURL https://update.greasyfork.org/scripts/532931/Hollow%20favi%20replacement%20thingy%20skibidi.user.js
// @updateURL https://update.greasyfork.org/scripts/532931/Hollow%20favi%20replacement%20thingy%20skibidi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let iconTitleValue = '';
    let iconUrlValue = '';

    // Function svg to favicon
    function replaceSpecificSpanText() {
        const container = document.querySelector('div.grid.grid-cols-5.gap-6.relative');
        if (container) {
            const spans = container.querySelectorAll('span');
            const divs = container.querySelectorAll('div'); // div getter yayyyyyyyyy

            if (spans.length === 0) {
                console.error('[Userscript] no hyperlinks');
            } else {
                console.log('[Userscript] hyperlinks:');
                spans.forEach(span => {
                    console.log(span.textContent.trim());
                });

                spans.forEach(span => {
                    // Check if the span text matches the iconTitleValue
                    if (span.textContent.trim().toLowerCase() === iconTitleValue.trim().toLowerCase()) {
                        // Now get svg and stuff
                        const divContainingSpan = span.closest('div');
                        if (divContainingSpan) {
                            const svg = divContainingSpan.querySelector('svg'); // Find the SVG element
                            if (svg) {
                                // Replace svg with image
                                const faviconUrl = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(iconUrlValue)}&size=32`;
                                const img = document.createElement('img');
                                img.src = faviconUrl;
                                img.alt = 'Favicon';
                                img.style.width = '32px';
                                img.style.height = '32px';
                                svg.replaceWith(img); // Replace the SVG with the image
                                console.log('[Userscript] svg to favicon now.');
                            }
                        }
                    }
                });
            }
        } else {
            console.log('[Userscript] no divs either he changed it or you bricked it.');
        }
    }

    //  addEventListener slop
    function trackIconTitleInput() {
        const CrossReference = document.querySelector('input#icon-title[placeholder="Icon title"]');
        if (CrossReference) {
            CrossReference.addEventListener('input', () => {
                iconTitleValue = CrossReference.value;
            });
        } else {
            setTimeout(trackIconTitleInput, 500);
        }
    }

    //   addEventListener slop
    function trackIconUrlInput() {
        const Url = document.querySelector('input#icon-url[placeholder="https://example.com"]');
        if (Url) {
            Url.addEventListener('input', () => {
                iconUrlValue = Url.value;
            });
        } else {
            setTimeout(trackIconUrlInput, 500);
        }
    }

    // some more ddEventListener slop
    function waitForSaveButton() {
        const saveButton = document.querySelector('button') && Array.from(document.querySelectorAll('button')).find(button => button.textContent.trim() === 'Save');

        if (saveButton) {
            console.log('[Userscript] Found Save button.');

            saveButton.addEventListener('click', () => {
                console.log('[Userscript] you clicked save good job.');
                console.log('[Userscript] your title is ', iconTitleValue);
                console.log('[Userscript] your url is:', iconUrlValue);

                // wait a bit
                setTimeout(() => {
                    console.log('[Userscript] waited long enough');
                    replaceSpecificSpanText();
                }, 1000);
            });
        } else {
            setTimeout(waitForSaveButton, 500);
        }
    }

    // Wait some more
    function waitForAddIconButton() {
        const addButton = document.querySelector('button[aria-label="Add new icon"]');

        if (addButton) {
            console.log('[Userscript] found the button.');

            addButton.addEventListener('click', () => {
                console.log('[Userscript] you clicked the button want a prize or smth?.');
                trackIconTitleInput();
                trackIconUrlInput();
            });
        } else {
            setTimeout(waitForAddIconButton, 500);
        }
    }

    // load it babyyyyyyyy
    window.addEventListener('load', () => {
        waitForAddIconButton();
        waitForSaveButton();
    });
})();
