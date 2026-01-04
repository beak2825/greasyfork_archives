// ==UserScript==
// @name        Displays full video titles on rumble.
// @namespace   edisondotme
// @version     
// @description Untruncates video titles
// @author      edisondotme
// @license GPL
// @match        *://rumble.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492180/Displays%20full%20video%20titles%20on%20rumble.user.js
// @updateURL https://update.greasyfork.org/scripts/492180/Displays%20full%20video%20titles%20on%20rumble.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Modify inline stylesheet
    modifyInlineStylesheet();

    function modifyInlineStylesheet() {
        // Get all <style> elements in the <head>
        const styleElements = document.head.getElementsByTagName('style');

        // Loop through each <style> element
        for (const styleElement of styleElements) {
            // Get the CSS text content
            const cssText = styleElement.textContent;

            // Replace the CSS rule
            const modifiedCssText = cssText.replace(/.clamp-2{-webkit-line-clamp:2}/g, '.clamp-2{/*! -webkit-line-clamp:2 */}');

            // Update the CSS text content
            if (modifiedCssText !== cssText) {
                styleElement.textContent = modifiedCssText;
            }
        }
    }
})();


