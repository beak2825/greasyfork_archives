// ==UserScript==
// @name         Straw.Page Masto Share Button
// @namespace    http://tampermonkey.net/
// @version      2024-08-19
// @description  Add Masto Share Button to Straw.Page
// @author       gaylie
// @match        https://straw.page/draw
// @icon         view-source:https://straw.page/favicon-32x32.png?v=2
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/504318/StrawPage%20Masto%20Share%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/504318/StrawPage%20Masto%20Share%20Button.meta.js
// ==/UserScript==

(function() {
    // !!! THESE TWO MUST BE FILLED OUT
    const sharelink = null; // Your instances share-link. Usually looks like "https://instance.com/share?text="
    const markdown = false; // Use Mastodon Markdown true or false

    if (sharelink == null || markdown == null)
        alert('Please fill out necessary variables (Add Masto Share Button to Straw.Page script)');

    $('*[data-target="gimmicks"]').on('click', function(){
        setTimeout(() => {
            $('.gimmickItem.itemAsk').each(function(){
                var page = "https://" + $(this).find('.gimmickTraffic p').text().substring(2); // This is the URL to the strawpage the ask came from
                var ask = $(this).find('.asker p').text(); // Text of the ask

                // These Strings represent the text that will appear in your posting box. %0A is a new-line
                var query = "";
                if (markdown)
                    query = '> ["' + ask + '"](' + page + ')%0A%0Ayour answer ';
                else
                    query = '"' + ask + '"%0A%0Ayour answer%0A' + page;

                // Share button gets added to menu
                var sharemenu = $(this).find('.itemMenu .itemMenuOptions');

                var sharebutton = sharemenu.children('a').first().clone();
                sharebutton.children('i').attr('class', 'fab fa-mastodon');
                sharebutton.attr('href', sharelink + query);
                sharemenu.prepend(sharebutton);
            });
        }, 500);
    });
})();