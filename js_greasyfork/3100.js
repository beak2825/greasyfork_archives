// ==UserScript==
// @name        mmmturkeybacon Ghost HIT Buster for Forums
// @version     1.39
// @description Searches forum posts for HIT links, follows them, determines if the HIT is still available, and strikes the post if the HIT is a ghost or changes the link text to show the automatic approval time and number remaining if the HIT is available. Works with Live Update. Uses just-in-time link checking to reduce "maximum allowed page request rate" errors. Uncomment CHIME to receive an audio alert if there is a new HIT post.
// @author      mmmturkeybacon
// @namespace   http://userscripts.org/users/523367
// @match       http://mturkgrind.com/threads/*
// @match       http://www.mturkgrind.com/threads/*
// @match       http://mturkforum.com/showthread.php?*
// @match       http://www.mturkforum.com/showthread.php?*
// @match       http://turkernation.com/showthread.php?*
// @match       http://www.turkernation.com/showthread.php?*
// @match       http://mturkcrowd.com/threads/*
// @match       http://www.mturkcrowd.com/threads/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_log
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/3100/mmmturkeybacon%20Ghost%20HIT%20Buster%20for%20Forums.user.js
// @updateURL https://update.greasyfork.org/scripts/3100/mmmturkeybacon%20Ghost%20HIT%20Buster%20for%20Forums.meta.js
// ==/UserScript==

var REQUEST_DELAY = 500; // milliseconds
var LINK_POSITION_OFFSET = 400; // number of pixels abover or below viewport to trigger link check
// remove the // on the next line to enable audio notification
//var CHIME = 'data:audio/ogg;base64, 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Y5l93VlmX3eO4Rg6v/Djqaqvm64rDKcsC7/t68az+76yjK7r+6osC78q28Kx677z/L6wLKPs+sJqy8Kw2rYx3L5uLL9wHMtr68ox675RtnV8X3gKw/N0dV15Zl3H9nV040c4fsoAAIABBwCAABPKQKEhKwKAOAEAjySJomRZoihZliiKpui6omi6rqRppqlpnmlammeapmmqsimarixpmmlanmaamqeZpmiarmuapqyKpinLpmrKsmmasuy6sm27rmzbomnKsmmasmyapiy7sqvbruzquqRZpql5nmlqnmeapmrKsmmarqt5nmp6nmiqniiqqmqqqq2qqixbnmeamuippieKqmqqpq2aqirLpqrasmmqtmyqqm27quz6sm3rummqsm2qpi2bqmrbruzqsizbui9pmmlqnmeamueZpmmasmyaqitbnqeaniiqquaJpmqqqiybpqrKlueZqieKquqJnmuaqirLpmraqmmatmyqqi2bpirLrm37vuvKsm6qqmybqmrrpmrKsmzLvu/Kqu6KpinLpqrasmmqsi3bsu/Lsqz7omnKsmmqsm2qqi7Lsm0bs2z7umiasm2qpi2bqirbsi37uizbuu/Krm+rqqzrsi37uu76rnDrujC8smz7qqz6uivbum/rMtv2fUTTlGVTNW3bVFVZdmXZ9mXb9n3RNG1bVVVbNk3VtmVZ9n1Ztm1hNE3ZNlVV1k3VtG1Zlm1htmXhdmXZt2Vb9nXXlXVf133j12Xd5rqy7cuyrfuqq/q27vvCcOuu8AoAABhwAAAIMKEMFBqyEgCIAgAAjGGMMQiNUs45B6FRyjnnIGTOQQghlcw5CCGUkjkHoZSUMucglJJSCKGUlFoLIZSUUmsFAAAUOAAABNigKbE4QKEhKwGAVAAAg+NYlueZomrasmNJnieKqqmqtu1IlueJommqqm1bnieKpqmqruvrmueJommqquvqumiapqmqruu6ui6aoqmqquu6sq6bpqqqriu7suzrpqqqquvKriz7wqq6rivLsm3rwrCqruvKsmzbtm/cuq7rvu/7wpGt67ou/MIxDEcBAOAJDgBABTasjnBSNBZYaMhKACADAIAwBiGDEEIGIYSQUkohpZQSAAAw4AAAEGBCGSg0ZEUAECcAABhDKaSUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJIKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKqaSUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKZVSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUgoAkIpwAJB6MKEMFBqyEgBIBQAAjFFKKcacgxAx5hhj0EkoKWLMOcYclJJS5RyEEFJpLbfKOQghpNRSbZlzUlqLMeYYM+ekpBRbzTmHUlKLseaaa+6ktFZrrjXnWlqrNdecc825tBZrrjnXnHPLMdecc8455xhzzjnnnHPOBQDgNDgAgB7YsDrCSdFYYKEhKwGAVAAAAhmlGHPOOegQUow55xyEECKFGHPOOQghVIw55xx0EEKoGHPMOQghhJA55xyEEEIIIXMOOugghBBCBx2EEEIIoZTOQQghhBBKKCGEEEIIIYQQOgghhBBCCCGEEEIIIYRSSgghhBBCCaGUUAAAYIEDAECADasjnBSNBRYashIAAAIAgByWoFLOhEGOQY8NQcpRMw1CTDnRmWJOajMVU5A5EJ10EhlqQdleMgsAAIAgACDABBAYICj4QgiIMQAAQYjMEAmFVbDAoAwaHOYBwANEhEQAkJigSLu4gC4DXNDFXQdCCEIQglgcQAEJODjhhife8IQbnKBTVOogAAAAAAAMAOABAOCgACIimquwuMDI0Njg6PAIAAAAAAAWAPgAADg+gIiI5iosLjAyNDY4OjwCAAAAAAAAAACAgIAAAAAAAEAAAACAgE9nZ1MABKqeAAAAAAAAcIMRZAIAAABPPJt5Kh0YKh4eIB4eHh8fHh4eHiAfHh4eHh8fIB4eHh4eHiAeIiMmKC01PUBATnTp9+Cu+MEFMImro6Hixysv30/P/74ZP0/l5Xs9jPPu9fcg6B866L7djw5BTS9KLyWoJhUNmlvfg5tUOrtR71MEICEKAAAAAAAAAAAUgIS2r6+fPn1Hk6EoSd7eHgAA3ms/7ZtUpoSjnlMFrAbAPfUAAAAAAAAAAEAhcFgA3ms/rZsUpoSjnlMDVgPQP18BAAAAAAAAAADgOgYA3ls/1ZsUJodQ71MDTgoAAAAAAAAAAJwLAECEzfFnAgDeWz/Vm1SmhKPepwpYDUD/7QIAAAAAAAAAAAW1ugK+Wz+smxSWhKOeUwNWA9A/XwUAAAAAAAAAAAIvwQK+Wz/tm1SmhKOeUxysBsBdZRMAAAAAAAAAAIF4PwO+Sz+tm1SmhKPepzg4KQAAAAAAAAAAoAQAIBRdhDMCnks/rJsUloQjn1MDTgoAAAAAAAAAAKwSAICAXrfLCJ5LP62bFKaEo55TA1YDsP+eAgAAAAAAAAAAYK1oAZ47P62bFKaEo96nOFgNwP67AQAAAAAAAACUg1cEAH47P+ybVJaEI59TA1YDsL9XBwAAAAAAAACAw7pWAH47P62bFKaEo55TA1YD4Gu1AwAAAAAAAAAAhec2C34rP62bFCZHot6nODgpAAAAAAAAAACgAACgguSrRQMAXis/7atUloSjnlMcnBQAAAAAAAAAAFAAAFCBfzlgAF4bP62bFCaHo96nBqwGwMepAwAAAAAAAAAA2FY0AD4bP+ybVJaEI59TA1YD0D9PAwAAAAAAAACg4C4RAD4LP62bFCaHo96nGFgNQP9tBgAAAAAAAABAUeUDAB4LP+ybVJaEI59TA1YD0D9fBgAAAAAAAABAwXVrAR4LP62bFKaEo55TBawGwMcqLwEAAAAAAAAAENjrMAD++j7tq1SWhKOeUxycFAAAAAAAAAAAUAIAEIqOTY0A/uo+rZtUpoSj3qcKOCkAAAAAAAAAALBKAAAC8uZMIwDe6j6tmxSmhKOeUwNWA+D3qQAAAAAAAAAAAFy3FgC+2j7sm1SWhFDPqQJWA7D/HgAAAAAAAAAAcFgrKwC+yj6tmxSmhKPepwpYDcD+uwYAAAAAAAAAUA5LkgCeuj6tm1Qmh1DvUwdWA7C/VwsAAAAAAAAAAAqrmgF+uj7tm1SmRKKeUwNWA+BVpQAAAAAAAAAAQOEhWQBeqj7tq1SWhFDPKQxOCgAAAAAAAAAAKAAAqEBQZAA+mn7nVqnxSaTo7S4OVgOgrwCAAAAAAAAAABTC2g0AGh6KfudWqfFJpOjtLg5WA+DjNAAAAAAAAAAAFNZNAv55fmdXqf5JuOjtLgZWA9A/L4BQAAAAAAAABfc1gASQAFjeWX5nd2n+crjo6xQHqwHojxcAQgAAAAAAAADuHhRAMAHQAJ5JfuZ3afFLpOjpFF+F1QC4KwFUAAAAAAAAll8LQAEWLJAAsA0Afil+53ap8Upkip528S2sBkBXBVABABAAAAAC0dWCCSgAEAALdAWAAh4ZfuVXKfFJpOjpFNuH1QBQFUCFAggIAAAAUfSeFpYFJmhAB3SgSQBogA4kAP74/Z9hUaos9c+CnZkVgtUAeE0BUFWhAAAAal0LFjxcQaBAXwAFD1AAdKADYIEOFBIAEiABHtn9PwNRhmzqX+qxLzFcGFYD4DUAoapCAQAgcJ+p0AFQDJcK54VHS8+cB04SCWBBB6CRADABCZiABtCABv7I/Z+BIlO7+p967GIVWA2AVwNCVFUAADjc5wGAIWQD+s31+taUot9kTuwToT9kgsVDgwWwPMACNDABEKABBAD+yP2fXJHuXUOpwy5WhtUAeBUAsqpCAQDgyimgqVB4BXOm8hCJp7r7nQdoqTNAwoECPAAPgKQAQAALWB2AAJAAfsj9N1Mkza5uN3bWkxZOAAuep8GoqlAAXmut6+XZEQUYjUZz80Sj0ejdxcX1dWGK09DaMSRJRy+C+RKYcwFA92BBAjwIEIAETAAEeIAF';
var VOLUME = 0.1; // volume of chime

var audio;
var $preview_links;
var posts_dict = {};
var delay_counter = 0;

function mark_hit_post($link)
{
    $link.text($link.text().replace('[Page Request Rate Error] -- ', ''));
    GM_xmlhttpRequest(
    {
        method: "GET",
        url: $link.attr('href'),
        onerror: function()
        {
            delay_counter--;
            alert('mmmturkeybacon Ghost HIT Buster for Forums: Page request failed.');
        },
        onload: function (response)
        {
            delay_counter--;
            var $src = $(response.responseText);
            var id = $link.closest('div[id^="post_message_"], li[id^="post-"]').attr('id');
            var maxpagerate = $src.find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
            if (maxpagerate.length == 0)
            {
                var is_a_HIT = $src.find('input[type="hidden"][name="isAccepted"]').length > 0;
                var not_qualified = $src.find('span[id="alertboxHeader"]:contains("Your Qualifications do not meet the requirements to preview HITs in this group.")').length > 0;
                var requester_results = $src.find('td[class="title_orange_text_bold"]:contains("HITs Created by")').length > 0;
                if (is_a_HIT)
                {
                    var hitAutoAppDelayInSeconds = $src.find('input[type="hidden"][name="hitAutoAppDelayInSeconds"]').val();
                    var num_available = $src.find('a[id="number_of_hits.tooltip"]').parent().next().text().trim();
        
                    // time formatting code modified from http://userscripts.org/scripts/show/169154
                    var days  = Math.floor((hitAutoAppDelayInSeconds/(60*60*24)));
                    var hours = Math.floor((hitAutoAppDelayInSeconds/(60*60)) % 24);
                    var mins  = Math.floor((hitAutoAppDelayInSeconds/60) % 60);
                    var secs  = hitAutoAppDelayInSeconds % 60;
            
                    var time_str = (days  == 0 ? '' : days  + (days  > 1 ? ' days '    : ' day '))    +
                                   (hours == 0 ? '' : hours + (hours > 1 ? ' hours '   : ' hour '))   + 
                                   (mins  == 0 ? '' : mins  + (mins  > 1 ? ' minutes ' : ' minute ')) + 
                                   (secs  == 0 ? '' : secs  + (secs  > 1 ? ' seconds ' : ' second '));

                    time_str = time_str.replace(/\s+$/, ''); 

                    if (hitAutoAppDelayInSeconds == 0)
                    {
                        time_str = "0 seconds";
                    }
                    $link.text('['+time_str+'|'+num_available+'] -- ' + $link.text());
                    posts_dict[id].link_cnt++;
                    posts_dict[id].strike_all_override = true;
                }
                else if (not_qualified)
                {
                    $link.text('[not qualified] -- ' + $link.text());
                }
                else if (!is_a_HIT && !requester_results)
                {
                    var $hit_container = $link.closest('table[class^="cms_table"], table[class^="ctaBbcodeTable"]');
                    if ($hit_container.length > 0)
                    {
                        $hit_container.css('text-decoration', 'line-through');
                        posts_dict[id].link_cnt++;
                    }
                    else
                    {
                        $link.css('text-decoration', 'line-through');
                        posts_dict[id].link_cnt++;
                        posts_dict[id].strike_all = true;
                    }
                }
            }
            else
            {
                $link.text('[Page Request Rate Error] -- ' + $link.text());
                posts_dict[id].link_cnt++;
                posts_dict[id].strike_all_override = true;
                $link.attr('mtbghbff_checked', 'false');
            }

            if ((posts_dict[id].strike_all_override == false) &&
                (posts_dict[id].strike_all == true) &&
                (posts_dict[id].link_cnt == posts_dict[id].num_links))
            {
                $link.closest('div[id^="'+id+'"], li[id^="'+id+'"]').css('text-decoration', 'line-through');
            }
        }
    });
}

function check_link_position()
{
    $preview_links.each(function()
    {
        var $link = $(this);
        if ($link.attr('mtbghbff_checked') != 'true')
        {
            var link_position = $link.offset().top;
            var top_of_viewport = $(window).scrollTop();
            var bottom_of_viewport = $(window).scrollTop() + $(window).height();

            if(top_of_viewport-LINK_POSITION_OFFSET < link_position && bottom_of_viewport+LINK_POSITION_OFFSET > link_position)
            {
                setTimeout(function(){mark_hit_post($link)}, REQUEST_DELAY*delay_counter);
                $link.attr('mtbghbff_checked', 'true');
                delay_counter++;
            }
        }
    }); 
}

function bustin_makes_me_feel_good()
{
    $preview_links = $('a[href*="/mturk/preview?"][mtbghbff_checked!="true"], a[href*="/mturk/searchbar?"][mtbghbff_checked!="true"]:contains("(Requester link substituted)")');

    if ($preview_links.length > 0)
    {
        var $hit_posts = $('div[id^="post_message_"], li[id^="post-"]').has('a[href*="/mturk/preview?"][mtbghbff_checked!="true"], a[href*="/mturk/searchbar?"][mtbghbff_checked!="true"]:contains("(Requester link substituted)")');

        $hit_posts.each(function()
        {
            var num_links = $(this).find('a[href*="/mturk/preview?"][mtbghbff_checked!="true"], a[href*="/mturk/searchbar?"][mtbghbff_checked!="true"]:contains("(Requester link substituted)")').length;
            posts_dict[$(this).attr('id')] = {num_links: num_links, link_cnt: 0, strike_all: false, strike_all_override: false};
        });

        if (typeof CHIME != 'undefined' && CHIME != '')
        {
            audio.play();
        }

        check_link_position();
    }
}

$(document).ready(function()
{
    if (typeof CHIME != 'undefined' && CHIME != '')
    {
        audio = document.createElement('audio');
        audio.src = CHIME;        
        audio.volume = VOLUME;
        document.body.appendChild(audio);
    }

    bustin_makes_me_feel_good();
});


$(window).scroll(check_link_position);

$(window).load(function()
{
    var observer = new MutationObserver(function(mutations, obs)
    {
        var new_links_available = false;
        for(var i = 0; i < mutations.length; i++)
        {
            for(var j = 0; j < mutations[i].addedNodes.length; j++)
            {
                var new_tag = mutations[i].addedNodes[j];
                if ($(new_tag).find('a[href*="/mturk/preview?"][mtbghbff_checked!="true"], a[href*="/mturk/searchbar?"][mtbghbff_checked!="true"]:contains("(Requester link substituted)")').length > 0)
                {
                    new_links_available = true;
                    break;
                }
            }
            if (new_links_available)
            {
                break;
            }
        }

        if (new_links_available)
        {
            bustin_makes_me_feel_good();
        }
    });

    observer.observe(document.documentElement,
    {
        childList: true,
        subtree: true
    });
});