// ==UserScript==
// @name ChatGPT - Copy Button
// @description Adds a copy button that copies all text-based content from the chat.
// @match https://chat.openai.com/chat
// @require https://code.jquery.com/jquery-3.6.2.min.js
// @version 0.0.1
// @license MIT
// @namespace https://greasyfork.org/users/994237
// @downloadURL https://update.greasyfork.org/scripts/456642/ChatGPT%20-%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/456642/ChatGPT%20-%20Copy%20Button.meta.js
// ==/UserScript==

// Globals
/* globals jQuery, $, waitForKeyElements */

// Add the stylesheet to the page
let materialSymbolsOutlinedCSS = document.createElement('link');
materialSymbolsOutlinedCSS.rel = 'stylesheet';
materialSymbolsOutlinedCSS.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0';
document.head.appendChild(materialSymbolsOutlinedCSS);

// Add copy button to top right corner
$('body').prepend('<button type="button" class="copy-button" title="Copy content">' +
    '<span class="material-symbols-outlined">content_copy</span>' +
    '</button>');

// Add CSS styling to the button
$('.copy-button').css({
    'background-color': '#2f9c2f',
    'border-radius': '20%',
    'color': 'white',
    'padding': '4px',
    'position': 'absolute',
    'margin-right': '10px',
    'margin-top': '10px',
    'right': '0',
    'top': '0',
    'cursor': 'pointer',
    'display': 'block',
    'pointer-events': 'all',
    'z-index': '10000',
});
$('.copy-button > span').css({
    'vertical-align': 'top',
});

// Add event handler to the button
$('.copy-button').on('click', function () {
    // Get all the divs with class 'text-base' that are several children down inside divs with class 'w-full'
    let text = $('div.w-full').find('div.text-base').map(function(index,element) {
        // Get the text of each div, stripping out html tags, removing buttons all together
        let prompt = 'You: ';
        (index % 2 == 0) ? prompt : prompt = 'ChatGPT: '

        let innerText = $(element).html();
        return prompt + innerText
            .replace(/<button[^>]*>.*?<\/button>/g, '')
            .replace("<pre>", "\n```\n")
            .replace("</pre>", "\n```\n")
            .replace(/<[^>]*>/g, '');
    }).get();

    // Copy the text to clipboard
    navigator.clipboard.writeText(text.join('\n\n'));

    // Show the 'copied' message
    $('.copy-button').html('<span class="material-symbols-outlined">done</span>');
    setTimeout(function() {
        $('.copy-button').html('<span class="material-symbols-outlined">content_copy</span>');
    }, 1000);
});