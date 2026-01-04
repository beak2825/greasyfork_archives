// ==UserScript==
// @name        AO3: [Wrangling] Edit Tag buttons on inbox comments
// @description add a button to the tag edit page next to the Reply button
//              and make sure other links to tags inside the comment also lead to edit pages
// @version     0.2
// @author      Rhine
// @namespace   https://github.com/RhineCloud
// @match       http*://*archiveofourown.org
// @match       http*://*archiveofourown.org/
// @match       http*://*archiveofourown.org/users/*/inbox*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/432958/AO3%3A%20%5BWrangling%5D%20Edit%20Tag%20buttons%20on%20inbox%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/432958/AO3%3A%20%5BWrangling%5D%20Edit%20Tag%20buttons%20on%20inbox%20comments.meta.js
// ==/UserScript==

(function($) {
    // go through each tag comment
    $('li.comment:has(a:nth-of-type(2)[href^="/tags/"])').each(function() {
        // add a button to the tag's edit page
        let tag = $(this).find('a:nth-of-type(2)').attr('href').split('/')[2];
        let buttonHTML = '<li><a href="/tags/' + tag + '/edit">Edit Tag</a></li>';
        $(this).find('ul.actions li:has(a[href*="/inbox/reply"])').after(buttonHTML);
        
        // go through each link to a tags page inside the comment text
        $(this).find('blockquote.userstuff a[href*="/tags/"]').each(function() {
            // make sure it leads to the edit page
            if (!$(this).attr('href').endsWith('/edit')) {
                let linkParts = $(this).attr('href').split('/');
                let linkTag = linkParts[linkParts.indexOf('tags') + 1];
                $(this).attr('href', '/tags/' + linkTag + '/edit');
            }
        });
    });
})(jQuery);
