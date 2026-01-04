// ==UserScript==
// @name         AO3: Copy Work Link as HTML
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description  Copy an HTML link to the work you're viewing to your clipboard
// @author       escctrl
// @version      1.1
// @match        *://*.archiveofourown.org/works/*
// @match        *://*.archiveofourown.org/tags/*
// @match        *://*.archiveofourown.org/users/*
// @match        *://*.archiveofourown.org/collections/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491837/AO3%3A%20Copy%20Work%20Link%20as%20HTML.user.js
// @updateURL https://update.greasyfork.org/scripts/491837/AO3%3A%20Copy%20Work%20Link%20as%20HTML.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    $('.work.blurb .datetime, .bookmark.blurb .datetime').append(`<br/><button type='button' class='copyBlurbLink' style='font-size: 80%;'>Copy Link</button>`);
    $('.work.navigation.actions').append(`<button type='button' class='copyWorkLink' style='padding: 0.25em 0.75em'>Copy Link</button>`);

    $('.copyBlurbLink').on('click', function(e) {
        let a = $(e.target).parent().parent().find('h4 a:first-of-type');
        let href = $(a).prop('href').includes("/collections") ? $(a).prop('href').replace(/\/collections\/\w*/ig, "") : $(a).prop('href');
        copy2Clipboard(e, `<a href='${href}'>${$(a).text()}</a>`);
    });
    $('.copyWorkLink').on('click', function(e) {
        let link = $('.work.navigation.actions li.share a').prop('href').slice(0, -6);
        let title = $('h2.title.heading').text().trim();
        copy2Clipboard(e, `<a href='${link}'>${title}</a>`);
    });
})(jQuery);

// solution for setting richtext clipboard content found at https://jsfiddle.net/jdhenckel/km7prgv4/3/
// and https://stackoverflow.com/questions/34191780/javascript-copy-string-to-clipboard-as-text-html/74216984#74216984
function copy2Clipboard(e, str) {
    // trying first with the new Clipboard API
    try {
        const clipboardItem = new ClipboardItem({'text/html': new Blob([str], {type: 'text/html'}),
                                                 'text/plain': new Blob([str], {type: 'text/plain'})});
        navigator.clipboard.write([clipboardItem]);
    }
    // fallback method in case clipboard.write is not enabled - especially in Firefox it's disabled by default
    // to enable, go to about:config and turn dom.events.asyncClipboard.clipboardItem to true
    catch {
        console.log('Copy Tag to Clipboard: Clipboard API is not enabled in your browser - fallback option used');
        function listener(e) {
            e.clipboardData.setData("text/html", str);
            e.clipboardData.setData("text/plain", str);
            e.preventDefault();
        }
        document.addEventListener("copy", listener);
        document.execCommand("copy");
        document.removeEventListener("copy", listener);
    }
}