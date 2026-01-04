// ==UserScript==
// @name         MaruMori Font Changer with Webfonts
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Randomly change font of vocabulary or kani review items on marumori.io, including webfonts found under the SIL Open Font License. Font change reverts on hover.
// @author       You
// @match        https://marumori.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marumori.io
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511162/MaruMori%20Font%20Changer%20with%20Webfonts.user.js
// @updateURL https://update.greasyfork.org/scripts/511162/MaruMori%20Font%20Changer%20with%20Webfonts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Marumori Font Changer script has started.');

    // Local fonts (installed on your system)
    const localFonts = [
        'MS Gothic',
        'MS Mincho',
        'Meiryo',
        'Yu Gothic',
        'Yu Mincho',
        'Hiragino Kaku Gothic Pro',
        'Hiragino Mincho Pro',
        'Osaka',
        'TakaoGothic',
        'TakaoMincho',
        'Kochi Gothic',
        'Kochi Mincho'
    ];

    // Webfonts available on Google Fonts
    const webFonts = [
        'Noto Sans JP',
        'Noto Serif JP',
        'Sawarabi Gothic',
        'Sawarabi Mincho',
        'M PLUS Rounded 1c',
        'M PLUS 1p',
        'Kosugi',
        'Kosugi Maru',
        'Shippori Mincho',
        'Yuji Syuku',
        'Yuji Mai',
        'Yuji Boku',
        'Reggae One',
        'RocknRoll One',
        'Zen Kurenaido',
        'Zen Antique',
        'Zen Antique Soft',
        'Zen Maru Gothic',
        'Zen Kaku Gothic New',
        'Zen Old Mincho'
    ];

    // Combine both arrays for font selection
    const fonts = [...localFonts, ...webFonts];

    // Variable to store the previous item text
    let previousItemText = null;

    // Functions to get and set the locked font using GM_setValue and GM_getValue
    function setLockedFont(font) {
        GM_setValue('lockedFont', font);
        console.log('Locked font set to:', font);
    }

    function getLockedFont() {
        const font = GM_getValue('lockedFont', null);
        console.log('Retrieved locked font:', font);
        return font;
    }

    function getRandomFont() {
        const font = fonts[Math.floor(Math.random() * fonts.length)];
        console.log('Selected random font:', font);
        return font;
    }

    function addGoogleFont(fontName) {
        if (webFonts.includes(fontName)) {
            const linkId = 'google-font-' + fontName.replace(/\s+/g, '-');
            if (!document.getElementById(linkId)) {
                const link = document.createElement('link');
                link.id = linkId;
                link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}&display=swap`;
                link.rel = 'stylesheet';
                document.head.appendChild(link);
                console.log('Added Google Font link for:', fontName);
            }
        } else {
            console.log('Font is local, no need to add Google Font link:', fontName);
        }
    }

function showMessage(targetElement, message) {
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.textContent = message;

    // Style the message element
    messageElement.style.position = 'absolute';
    messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    messageElement.style.color = 'white';
    messageElement.style.padding = '5px 10px';
    messageElement.style.borderRadius = '5px';
    messageElement.style.fontSize = '12px';
    messageElement.style.zIndex = '1000';
    messageElement.style.pointerEvents = 'none'; // So it doesn't block clicks

    // Position the message element above the target element
    const rect = targetElement.getBoundingClientRect();
    messageElement.style.left = rect.left + window.pageXOffset + 'px';
    messageElement.style.top = rect.top + window.pageYOffset - 30 + 'px'; // Adjust as needed

    // Add to document
    document.body.appendChild(messageElement);

    // Remove after 1.5 seconds
    setTimeout(() => {
        document.body.removeChild(messageElement);
    }, 1500);
}

    function applyFontChange(targetElement) {
        // Store the original font family if not already stored
        if (!targetElement._originalFont) {
            targetElement._originalFont = window.getComputedStyle(targetElement).fontFamily;
            console.log('Original font:', targetElement._originalFont);
        }

        // Determine the font to use
        let lockedFont = getLockedFont();
        let newFont;
        if (lockedFont) {
            newFont = lockedFont;
            console.log('Using locked font:', newFont);
        } else {
            newFont = getRandomFont();
            console.log('Using new random font:', newFont);
        }

        // Store the new font on the target element
        targetElement._newFont = newFont;

        // Add the webfont if necessary
        addGoogleFont(newFont);

        // Apply the new font with !important
        targetElement.style.setProperty('font-family', `'${newFont}', sans-serif`, 'important');
        console.log('Applied font to target element:', newFont);

        // Remove existing event listeners to prevent duplicates
        targetElement.removeEventListener('mouseenter', targetElement._mouseenterHandler);
        targetElement.removeEventListener('mouseleave', targetElement._mouseleaveHandler);
        targetElement.removeEventListener('click', targetElement._clickHandler);

        // Define event handlers
        targetElement._mouseenterHandler = function() {
            this.style.setProperty('font-family', this._originalFont, 'important');
            console.log('Reverted to original font on hover:', this._originalFont);
        };

        targetElement._mouseleaveHandler = function() {
            // Reapply the same font after hover
            this.style.setProperty('font-family', `'${this._newFont}', sans-serif`, 'important');
            console.log('Reapplied font after hover:', this._newFont);
        };

targetElement._clickHandler = function(event) {
    if (event.shiftKey) {
        // Toggle font lock
        let lockedFont = getLockedFont();
        if (!lockedFont) {
            lockedFont = this._newFont;
            setLockedFont(lockedFont);
            console.log('Font locked:', lockedFont);
            showMessage(targetElement, 'Font Locked');
        } else {
            setLockedFont(null);
            console.log('Font unlocked');
            showMessage(targetElement, 'Font Unlocked');
        }
            } else {
                // Apply a new random font on click
                let newFont = getRandomFont();
                this._newFont = newFont;
                addGoogleFont(newFont);
                this.style.setProperty('font-family', `'${newFont}', sans-serif`, 'important');
                console.log('Applied new font on click:', newFont);

                let lockedFont = getLockedFont();
                if (lockedFont) {
                    // Update the locked font to the new font
                    setLockedFont(newFont);
                    console.log('Updated locked font to:', newFont);
                }
            }
        };

        // Attach event listeners
        targetElement.addEventListener('mouseenter', targetElement._mouseenterHandler);
        targetElement.addEventListener('mouseleave', targetElement._mouseleaveHandler);
        targetElement.addEventListener('click', targetElement._clickHandler);
    }

   function checkAndApply() {
    const targetElement = document.querySelector('#main .main_form, #main > span');
    if (targetElement) {
        console.log('Found target element:', targetElement);

        // Get the current item text
        const currentItemText = targetElement.textContent.trim();

        // Compare with the previous item text
        if (previousItemText !== currentItemText) {
            console.log('Item text has changed from', previousItemText, 'to', currentItemText);
            previousItemText = currentItemText;
            applyFontChange(targetElement);
        } else {
            console.log('Item text has not changed. No need to reapply font.');
        }
    } else {
        console.log('Target element not found.');
    }
}

    // Observe the body for changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Call checkAndApply on any mutation
            checkAndApply();
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check
    checkAndApply();

})();
