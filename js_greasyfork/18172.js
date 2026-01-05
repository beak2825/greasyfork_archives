// ==UserScript==
// @name        mmmturkeybacon Show Hidden Content in Quotes
// @version     1.01
// @description Replaces ***Hidden content cannot be quoted.*** with the hidden content if the quoted post is on the same page as the post that is quoting it.
// @author      mmmturkeybacon
// @namespace   http://userscripts.org/users/523367
// @match       http://mturkgrind.com/threads/*
// @match       http://www.mturkgrind.com/threads/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/18172/mmmturkeybacon%20Show%20Hidden%20Content%20in%20Quotes.user.js
// @updateURL https://update.greasyfork.org/scripts/18172/mmmturkeybacon%20Show%20Hidden%20Content%20in%20Quotes.meta.js
// ==/UserScript==


function replace_hidden_quote()
{
    $('blockquote[class="quoteContainer"] > div[class="quote"] > b:contains("***Hidden content cannot be quoted.***")').each(function()
    {
        var post_id = $(this).parent().parent().prev().find('a[href^="goto"]').attr('href').split('#')[1];
        var $hidden_content = $('li[id="'+post_id+'"] div[class="bbCodeBlock bbCodeVfcHH UnhiddenContent"] blockquote');
        if ($hidden_content.length > 0)
        {
            $(this).parent().parent().addClass('expanded');
            $(this).after($hidden_content.html());
            $(this).remove();
        }

    });
}

$(document).ready(function()
{
    replace_hidden_quote();
});

$(window).load(function()
{
    var observer = new MutationObserver(function(mutations, obs)
    {
        var new_hidden_quote = false;
        for (var i = 0; i < mutations.length; i++)
        {
            for (var j = 0; j < mutations[i].addedNodes.length; j++)
            {
                var new_tag = mutations[i].addedNodes[j];
                if ($(new_tag).find('blockquote[class="quoteContainer"] > div[class="quote"] > b:contains("***Hidden content cannot be quoted.***")').length > 0)
                {
                    new_hidden_quote = true;
                    break;
                }
            }
            if (new_hidden_quote)
            {
                break;
            }
        }

        if (new_hidden_quote)
        {
            replace_hidden_quote();
        }
    });

    observer.observe(document.documentElement,
    {
        childList: true,
        subtree: true
    });
});