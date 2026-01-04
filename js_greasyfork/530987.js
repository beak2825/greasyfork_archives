// ==UserScript==
// @name         TomatoMTL Auto Copy Cleaner (Button Fix)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically removes boilerplate when copying text via button or selection on tomatomtl.com.
// @author       tertium
// @match        *://tomatomtl.com/*
// @license      MIT
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530987/TomatoMTL%20Auto%20Copy%20Cleaner%20%28Button%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530987/TomatoMTL%20Auto%20Copy%20Cleaner%20%28Button%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Use unsafeWindow to access the page's native navigator object
    const realNavigator = typeof unsafeWindow !== 'undefined' ? unsafeWindow.navigator : window.navigator;

    if (!realNavigator.clipboard || !realNavigator.clipboard.writeText) {
        console.warn('TomatoMTL Cleaner: navigator.clipboard.writeText is not available. Script cannot function.');
        return;
    }

    // --- Your Cleaning Logic ---
    const boilerplateRegex = /TomatoMTL – Simple MTL Reading Assist Tool[\s\S]*?URL: [\s\S]*(?=\n|$)/g;
    const extraNewlinesRegex = /\n{3,}/g;

    function cleanText(text) {
        if (typeof text !== 'string') {
            return text; // Don't process non-strings
        }
        console.log("Original text length:", text.length); // Debug: See original
        let cleaned = text.replace(boilerplateRegex, '').replace(extraNewlinesRegex, '\n\n').trim();
        console.log("Cleaned text length:", cleaned.length); // Debug: See cleaned
        // Debug: Check if cleaning actually happened
        // if (text.length !== cleaned.length) {
        //    console.log("TomatoMTL Cleaner: Text was modified.");
        // } else {
        //     console.log("TomatoMTL Cleaner: Text was NOT modified (boilerplate likely not found).");
        // }
        return cleaned;
    }
    // --- End Cleaning Logic ---


    // --- Intercept clipboard.writeText ---

    // Store the original function safely, ensuring 'this' context is preserved
    const originalWriteText = realNavigator.clipboard.writeText.bind(realNavigator.clipboard);

    // Create our wrapper function
    const modifiedWriteText = async function(text) {
        // console.log('TomatoMTL Cleaner: Intercepting writeText...'); // Debug
        const cleanedText = cleanText(text);
        // Call the original function with the cleaned text
        return originalWriteText(cleanedText);
    };

    // Replace the original function with our modified one
    // We need to make the property writable first on some browsers/strict modes
    try {
         Object.defineProperty(realNavigator.clipboard, 'writeText', {
             value: modifiedWriteText,
             writable: true, // Keep it potentially replaceable by other scripts if needed
             configurable: true,
         });
         console.log('TomatoMTL Cleaner: Successfully intercepted navigator.clipboard.writeText.');
    } catch (e) {
        console.error('TomatoMTL Cleaner: Failed to intercept navigator.clipboard.writeText.', e);
         // Fallback attempt (less robust)
         try {
              realNavigator.clipboard.writeText = modifiedWriteText;
              console.log('TomatoMTL Cleaner: Successfully intercepted navigator.clipboard.writeText (fallback method).');
         } catch (e2) {
               console.error('TomatoMTL Cleaner: Fallback interception failed too.', e2);
         }
    }


    // --- Optional: Also keep the 'copy' event listener as a fallback/complement ---
    // This might help if some copy actions DON'T use writeText, though less likely for custom buttons.
    document.addEventListener('copy', function(event) {
        const selectedText = unsafeWindow.getSelection().toString(); // Use unsafeWindow here too
        if (selectedText) {
            const cleanedSelectedText = cleanText(selectedText);
            // Only intervene if cleaning actually changed something OR if clipboardData is available
            if (cleanedSelectedText !== selectedText && event.clipboardData) {
                event.preventDefault();
                event.clipboardData.setData('text/plain', cleanedSelectedText);
                // console.log('TomatoMTL Cleaner: Cleaned text via "copy" event.'); // Debug
            }
        }
    }, true); // Use capture phase


    // console.log('TomatoMTL Auto Copy Cleaner (Button Fix) script loaded.'); // Debug

})();