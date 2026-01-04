// ==UserScript==
// @name         Copy Crushon Story
// @namespace    https://crushon.ai/
// @version      0.2
// @description  Copies all listed chat bubbles with formatting
// @author       dbzfanatic
// @match        *://crushon.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crushon.ai
// @grant        GM_setClipboard
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/499796/Copy%20Crushon%20Story.user.js
// @updateURL https://update.greasyfork.org/scripts/499796/Copy%20Crushon%20Story.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the custom context menu
    const menu = document.createElement('ul');
    menu.id = 'custom-menu';
    menu.style.display = 'none';
    menu.style.position = 'absolute';
    menu.style.backgroundColor = 'black';
    menu.style.border = '1px solid #ccc';
    menu.style.zIndex = '1000';
    menu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    document.body.appendChild(menu);

    const copyStoryMenuItem = document.createElement('li');
    copyStoryMenuItem.id = 'copy-story';
    copyStoryMenuItem.textContent = 'Copy Story';
    copyStoryMenuItem.style.padding = '5px';
    copyStoryMenuItem.style.cursor = 'pointer';
    copyStoryMenuItem.style.color = 'white';
    copyStoryMenuItem.style.listStyleType = 'none';
    copyStoryMenuItem.onmouseover = function() {
        copyStoryMenuItem.style.backgroundColor = '#222';
    };
    copyStoryMenuItem.onmouseout = function() {
        copyStoryMenuItem.style.backgroundColor = 'black';
    };
    menu.appendChild(copyStoryMenuItem);

    const copyAsPlainMenuItem = document.createElement('li');
    copyAsPlainMenuItem.id = 'copy-as-plain';
    copyAsPlainMenuItem.textContent = 'Copy as Plain';
    copyAsPlainMenuItem.style.padding = '5px';
    copyAsPlainMenuItem.style.cursor = 'pointer';
    copyAsPlainMenuItem.style.color = 'white';
    copyAsPlainMenuItem.style.listStyleType = 'none';
    copyAsPlainMenuItem.onmouseover = function() {
        copyAsPlainMenuItem.style.backgroundColor = '#222';
    };
    copyAsPlainMenuItem.onmouseout = function() {
        copyAsPlainMenuItem.style.backgroundColor = 'black';
    };
    menu.appendChild(copyAsPlainMenuItem);

    const copyAsHTMLMenuItem = document.createElement('li');
    copyAsHTMLMenuItem.id = 'copy-as-html';
    copyAsHTMLMenuItem.textContent = 'Copy as HTML';
    copyAsHTMLMenuItem.style.padding = '5px';
    copyAsHTMLMenuItem.style.cursor = 'pointer';
    copyAsHTMLMenuItem.style.color = 'white';
    copyAsHTMLMenuItem.style.listStyleType = 'none';
    copyAsHTMLMenuItem.onmouseover = function() {
        copyAsHTMLMenuItem.style.backgroundColor = '#222';
    };
    copyAsHTMLMenuItem.onmouseout = function() {
        copyAsHTMLMenuItem.style.backgroundColor = 'black';
    };
    menu.appendChild(copyAsHTMLMenuItem);

    const copyForTelegramMenuItem = document.createElement('li');
    copyForTelegramMenuItem.id = 'copy-for-telegram';
    copyForTelegramMenuItem.textContent = 'Copy for Telegram';
    copyForTelegramMenuItem.style.padding = '5px';
    copyForTelegramMenuItem.style.cursor = 'pointer';
    copyForTelegramMenuItem.style.color = 'white';
    copyForTelegramMenuItem.style.listStyleType = 'none';
    copyForTelegramMenuItem.onmouseover = function() {
        copyForTelegramMenuItem.style.backgroundColor = '#222';
    };
    copyForTelegramMenuItem.onmouseout = function() {
        copyForTelegramMenuItem.style.backgroundColor = 'black';
    };
    menu.appendChild(copyForTelegramMenuItem);

    // Function to check if the event target is inside an excluded div
    function isInsideExcludedDiv(target) {
        return target.closest('.flex.flex-col.gap-3.self-stretch, .flex.w-full.items-start.justify-between.gap-4') !== null;
    }

    // Show the custom context menu on right-click, unless inside the excluded div
    document.addEventListener('contextmenu', function(event) {
        if (isInsideExcludedDiv(event.target)) {
            menu.style.display = 'none';
            return; // Do nothing if inside the excluded div
        }

        event.preventDefault();
        menu.style.top = `${event.pageY}px`;
        menu.style.left = `${event.pageX}px`;
        menu.style.display = 'block';
    });

    // Hide the custom menu on click elsewhere
    document.addEventListener('click', function() {
        menu.style.display = 'none';
    });

    // Function to extract text between <span> and </span>
    function extractSpanText(html) {
        const spanMatches = html.match(/<span[^>]*>(.*?)<\/span>/g);
        if (spanMatches) {
            return spanMatches.map(span => span.replace(/<\/?span[^>]*>/g, ''));
        }
        return [];
    }

    // Function to convert HTML to rich text with text formatting only
    function htmlToRichText(html) {
        // Replace <strong> with bold formatting
        html = html.replace(/<strong>/g, '<b>');
        html = html.replace(/<\/strong>/g, '</b>');
        // Replace <em> with italic formatting
        html = html.replace(/<em>/g, '<i>');
        html = html.replace(/<\/em>/g, '</i>');
        // Add more replacements as needed for other HTML tags

        // Create a temporary div element
        const tempDiv = document.createElement('div');
        // Set its innerHTML
        tempDiv.innerHTML = html;

        // Strip any unwanted styles
        tempDiv.querySelectorAll('*').forEach(node => {
            node.removeAttribute('style'); // Remove all inline styles
            node.removeAttribute('bgcolor'); // Remove background color attribute
            // Add more style removals as necessary
        });

        // Return the innerText of the temporary div
        return tempDiv.innerHTML;
    }

    // Function to handle copying story as rich text
    function copyStory() {
        // Get all divs with the specified class
        const charDivs = document.querySelectorAll('.flex.flex-1.flex-col.items-start.gap-2');
        // Create a string array containing the innerHTML of each div
        const charDivContents = Array.from(charDivs).map(div => div.innerHTML);

        // Extract span contents from charDivContents
        const extractedCharContents = charDivContents.flatMap(html => extractSpanText(html));

        // Get all divs with the specified class
        const markdownDivs = document.querySelectorAll('.not-prose.w-full.MarkdownText_CustomMarkdownText__P3bB6');
        // Create a string array containing the innerHTML of each div
        const markdownContents = Array.from(markdownDivs).map(div => div.innerHTML);

        // Create a string to store the final story
        let storyString = '';

        // Iterate through the indices of markdownContents
        for (let i = 0; i < markdownContents.length; i++) {
            // Convert HTML to rich text
            let richTextContent = htmlToRichText(markdownContents[i]);

            if (i % 2 === 0 && extractedCharContents.length > 0) {
                storyString += "\n" + extractedCharContents[0] + ": \n" + richTextContent + "\n";
            } else {
                storyString += "\n{{user}}: \n" + richTextContent + "\n";
            }
        }

        // Create a temporary element to hold the HTML
        const tempCopyDiv = document.createElement('div');

        tempCopyDiv.innerHTML = storyString;
        document.body.appendChild(tempCopyDiv);

        // Create a range and selection to select the contents of the tempCopyDiv
        const range = document.createRange();
        range.selectNodeContents(tempCopyDiv);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        // Copy the selection to the clipboard
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Unable to copy to clipboard', err);
        }

        // Clean up the selection and remove the temporary element
        selection.removeAllRanges();
        document.body.removeChild(tempCopyDiv);

        // Hide the custom menu after click
        menu.style.display = 'none';
    }



    // Function to handle copying story as plain text for Telegram
    function copyAsPlain() {
        // Get all divs with the specified class
        const charDivs = document.querySelectorAll('.flex.flex-1.flex-col.items-start.gap-2');
        // Create a string array containing the innerHTML of each div
        const charDivContents = Array.from(charDivs).map(div => div.innerHTML);

        // Extract span contents from charDivContents
        const extractedCharContents = charDivContents.flatMap(html => extractSpanText(html));

        // Get all divs with the specified class
        const markdownDivs = document.querySelectorAll('.not-prose.w-full.MarkdownText_CustomMarkdownText__P3bB6');
        // Create a string array containing the innerHTML of each div
        const markdownContents = Array.from(markdownDivs).map(div => div.innerHTML);

        // Create a string to store the final story
        let storyString = '';

        // Iterate through the indices of markdownContents
        for (let i = 0; i < markdownContents.length; i++) {
            // Convert HTML to plain text
            let plainTextContent = htmlToPlainText(markdownContents[i]);

            if (i % 2 === 0 && extractedCharContents.length > 0) {
                storyString += "\n" + extractedCharContents[0] + ": \n" + plainTextContent + "\n";
            } else {
                storyString += "\n{{user}}: \n" + plainTextContent + "\n";
            }
        }

        // Copy storyString to clipboard as plain text for Telegram
        GM_setClipboard(storyString, 'text/plain');

        // Hide the custom menu after click
        menu.style.display = 'none';
    }

    // Function to handle copying for Telegram
    function copyForTelegram() {
        // Get all divs with the specified class
        const charDivs = document.querySelectorAll('.flex.flex-1.flex-col.items-start.gap-2');
        // Create a string array containing the innerHTML of each div
        const charDivContents = Array.from(charDivs).map(div => div.innerHTML);

        // Extract span contents from charDivContents
        const extractedCharContents = charDivContents.flatMap(html => extractSpanText(html));

        // Get all divs with the specified class
        const markdownDivs = document.querySelectorAll('.not-prose.w-full.MarkdownText_CustomMarkdownText__P3bB6');
        // Create a string array containing the innerHTML of each div
        const markdownContents = Array.from(markdownDivs).map(div => div.innerHTML);

        // Create a string to store the final story
        let storyString = '';

        // Iterate through the indices of markdownContents
        for (let i = 0; i < markdownContents.length; i++) {
            // Convert HTML to rich text
            let richTextContent = htmlToTelegram(markdownContents[i]);

            if (i % 2 === 0 && extractedCharContents.length > 0) {
                storyString += "\n" + extractedCharContents[0] + ": " + richTextContent + "\n";
            } else {
                storyString += "\n{{user}}: " + richTextContent + "\n";
            }
        }

        // Copy storyString to clipboard as plain text for Telegram
        GM_setClipboard(storyString, 'text/plain');
    }

    // Function to handle copying for Telegram
    function copyWithHtml() {
        // Get all divs with the specified class
        const charDivs = document.querySelectorAll('.flex.flex-1.flex-col.items-start.gap-2');
        // Create a string array containing the innerHTML of each div
        const charDivContents = Array.from(charDivs).map(div => div.innerHTML);

        // Extract span contents from charDivContents
        const extractedCharContents = charDivContents.flatMap(html => extractSpanText(html));

        // Get all divs with the specified class
        const markdownDivs = document.querySelectorAll('.not-prose.w-full.MarkdownText_CustomMarkdownText__P3bB6');
        // Create a string array containing the innerHTML of each div
        const markdownContents = Array.from(markdownDivs).map(div => div.innerHTML);

        // Create a string to store the final story
        let storyString = '';

        // Iterate through the indices of markdownContents
        for (let i = 0; i < markdownContents.length; i++) {
            // Convert HTML to rich text
            let richTextContent = htmlToRichText(markdownContents[i]);

            if (i % 2 === 0 && extractedCharContents.length > 0) {
                storyString += "\n" + extractedCharContents[0] + ": \n" + richTextContent + "\n";
            } else {
                storyString += "\n{{user}}: \n" + richTextContent + "\n";
            }
        }

        // Copy storyString to clipboard as plain text for Telegram
        GM_setClipboard(storyString, 'text/plain');
    }

    // Function to convert HTML to plain text
    function htmlToPlainText(html) {
        // Create a temporary div element
        const tempDiv = document.createElement('div');
        // Set its innerHTML
        tempDiv.innerHTML = html;

        // Return the innerText of the temporary div
        return tempDiv.innerText;
    }

    // Function to convert HTML to rich text with text formatting only
    function htmlToTelegram(html) {
        // Replace <strong> with bold formatting
        html = html.replace(/(<strong.*>)\b/g, '**');
        html = html.replace(/<\/strong>/g, '**');
        // Replace <em> with italic formatting
        html = html.replace(/(<em.*>)\b/g, '__');
        html = html.replace(/<\/em>/g, '__');
        // Replace <p> with new line
        html = html.replace(/<p>/g, '\n');
        html = html.replace(/<\/p>/g, '');

        // Create a temporary div element
        const tempDiv = document.createElement('div');
        // Set its innerHTML
        tempDiv.innerHTML = html;

        // Strip any unwanted styles
        tempDiv.querySelectorAll('*').forEach(node => {
            node.removeAttribute('style'); // Remove all inline styles
            node.removeAttribute('bgcolor'); // Remove background color attribute
            // Add more style removals as necessary
        });

        // Return the innerText of the temporary div
        return tempDiv.innerText;
    }

    // Add the click event listener to the "Copy Story" item
    document.getElementById('copy-story').addEventListener('click', function() {
        copyStory();
    });

    // Add the click event listener to the "Copy as HTML" item
    document.getElementById('copy-as-html').addEventListener('click', function() {
        copyWithHtml();
    });

    // Add the click event listener to the "Copy as Plain" item
    document.getElementById('copy-as-plain').addEventListener('click', function() {
        copyAsPlain();
    });

    // Add the click event listener to the "Copy for Telegram" item
    document.getElementById('copy-for-telegram').addEventListener('click', function() {
        copyForTelegram();
    });
})();
