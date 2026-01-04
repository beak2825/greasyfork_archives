// ==UserScript==
// @name         Get Song Links
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Adds "Get links" button at the bottom of the page that lists song links (from song-filename information).
// @author       Tim Abdiukov
// @match        https://demodb.org/*
// @grant        none
// @license      Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/473287/Get%20Song%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/473287/Get%20Song%20Links.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
	// Add event listener on page load
    window.addEventListener('load', function() {
        // Create "Get links" button
        var button = document.createElement('button');
        button.innerHTML = 'Get links';
 
        // make button BIG
        button.style.fontWeight = "bold"; // Make the text bold
        button.style.fontSize = "24px"; // Set the font size
        button.style.padding = "12px 24px"; // Set the padding
 
 
 
        // Find the target div to insert the button
        let targetDiv = document.querySelector('.page.group.content_initial');
        let commentWrapper = document.querySelector('.comment_wrapper');
 
        if (commentWrapper && targetDiv.contains(commentWrapper)) {
            targetDiv.insertBefore(button, commentWrapper);
        } else {
            targetDiv.appendChild(button);
        }
 
        // Add event listener to the button
        button.addEventListener('click', function() {
			// for accounting and tracking
            let lastElement = button;
 
            let items = document.getElementsByClassName('song-filename');
            if (!items) {
                printError('No "song-filename" found.', lastElement);
                return;
            }
 
            if (!items.length) {
                printError('No items inside "song-filename" found.', lastElement);
                return;
            }
 
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                if (!item.dataset.src) {
                    lastElement = printError('Item ' + i + ' does not have a dataset.src attribute.', lastElement);
                    continue;
                }
                try {
                    let decoded = decodeBase64(item.dataset.src);
                    lastElement = printLink(decoded, lastElement);
                } catch (e) {
                    lastElement = printError('Could not decode base64 value for item ' + i + ': ' + e.message, lastElement);
                }
            }
        });
    }, false);
 
 
 
    // Function to decode base64 into UTF-8
    function decodeBase64(base64) {
        let text = atob(base64);
        let bytes = new Uint8Array(text.length);
        for (let i = 0; i < text.length; i++) {
            bytes[i] = text.charCodeAt(i);
        }
        let decoder = new TextDecoder('utf-8');
        return decoder.decode(bytes);
    }
 
    // Function to print a link
    function printLink(txt, n) {
        let p = document.createElement('div');
        p.textContent = txt;
        n.parentNode.insertBefore(p, n.nextSibling);
        return p;
    }
 
    // Function to print an error message
    function printError(txt, n) {
        let p = document.createElement('div');
        p.textContent = txt;
        p.style.color = 'darkred';
        n.parentNode.insertBefore(p, n.nextSibling);
        return p;
    }
})();
