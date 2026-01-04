// ==UserScript==
// @name         Remove Sponsored Posts on Facebook
// @namespace    https://tampermonkey.net/
// @version      1.1.3
// @description  Remove sponsored posts from your Facebook feed
// @author       Alexander Uhl
// @match        https://www.facebook.com/*
// @license MIT
// @grant GM_log
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/402189/Remove%20Sponsored%20Posts%20on%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/402189/Remove%20Sponsored%20Posts%20on%20Facebook.meta.js
// ==/UserScript==

var feed = $('div[role="feed"]');

function hideFacebookAds(){
    if (feed.length == 0)
    {
        feed = $('div[role="feed"]');
    }

    if (feed.length == 0)
    {
        GM_log('no feed found');
        return;
    }

    var articles = feed.find('[data-pagelet^="FeedUnit"]:not(.not-sponsored)');

    //GM_log('checking ' + articles.length + ' articles for sponsored posts');

    $.each(articles, function(i, article){
        var $article = $(article);

        // remove dummy characters
        $article.find('span[style="position: absolute; top: 3em;"]').remove();

        var arcticleText = $(article).text();
        var textParts    = arcticleText.split('·');
        var isSponsored  = false;

        $.each(textParts, function(i, text){
            text = $.trim(text);

            if (text.indexOf('Gesponsert') > -1)
            {
                isSponsored = true;
                return false;
            }
        })

        if (isSponsored)
        {
            $article.remove();
            GM_log('article removed:', arcticleText);
        }
        else
            $article.addClass('not-sponsored');
    })
}

/*
function findCharsInString(text, findWord)
{
    var wordFound = true;

    var textStop = 0;
    for (var i = 0; i < findWord.length; i++)
    {
        var charToFind = findWord[i];
        var charFound  = false;

        for (var n = textStop; n < text.length; n++)
        {
            if (text[n] == charToFind)
            {
                charFound = true;
                textStop  = n;
                break;
            }
        }

        if (!charFound)
        {
            wordFound = false;
            break;
        }
    }

    return wordFound;
}
*/

var scrollTimeout;
var scrollTimeoutDelayed;
scrollTimeout = setTimeout(hideFacebookAds, 1000);

$(window).on('scroll', function(){
    clearTimeout(scrollTimeout);
    clearTimeout(scrollTimeoutDelayed);

    scrollTimeout = setTimeout(function(){
        hideFacebookAds();
        scrollTimeoutDelayed = setTimeout(hideFacebookAds, 1000);
    },100);
});