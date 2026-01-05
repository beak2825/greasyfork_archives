// ==UserScript==
// @description    Highlights comments for Reddit stories based on comment points
// @grant          none
// @match          *://*.reddit.com/*/comments/*
// @name           Reddit Comment Highlighter (Chrome)
// @namespace      http://userscripts.org/scripts/show/120788
// @require        http://code.jquery.com/jquery-latest.min.js
// @version        1.7
// @downloadURL https://update.greasyfork.org/scripts/5104/Reddit%20Comment%20Highlighter%20%28Chrome%29.user.js
// @updateURL https://update.greasyfork.org/scripts/5104/Reddit%20Comment%20Highlighter%20%28Chrome%29.meta.js
// ==/UserScript==
/*
    Author: Kilo G
    Updated version of Erik Wannebo's script (http://userscripts.org/scripts/show/84313)


    Version 1.7
    Added handling of k suffix

    Version 1.6
    Fixed errors such as voting arrows would stop functioning and other script related problems. Thanks to jesuis parapluie and Ignix!
    Cleaned up the code

    Version 1.5
    Added @grant header
    Updated @match headerq

    Version 1.4
    Added HTTPS match
    Updated to use external jQuery

    Version 1.3
    Added Reddit Blue color and made it the default
    Updated jQuery to v2.0.2

    Version 1.2
    Updated jQuery to v1.7.2
*/
this.$ = this.jQuery = jQuery.noConflict(true);

var thresholds = {
    0.75: '#edf5fc',
    0.9: '#d9eafa',
    0.95: '#c8e0f7',
    0.98: '#b5d5f5'
};

var prevFontFactor = "";
var fontFactor = 2;
var highlightColor = "redditblue";

function highlightComments()
{
    var arRecs = [];

    $(".nestedlisting .entry .score.unvoted").each(function()
    {
        var recs = $(this).text().split(' ')[0];

        if (recs.slice(-1) == 'k')
        {
            recs = 1000 * parseFloat(recs)
        }

        arRecs.push(parseInt(recs));
    });

    arRecs.sort(function(a, b)
    {
        return a - b;
    });

    $(".nestedlisting .entry .score.unvoted").each(function()
    {
        var recs = $(this).text().split(' ')[0];

        if (recs.slice(-1) == 'k')
        {
            recs = 1000 * parseFloat(recs)
        }

        var numrecs = parseInt(recs);
        var newbgcolor = '';
        var newfontsize = 13;

        for (var t in thresholds)
        {
            if (numrecs >= arRecs[Math.floor(arRecs.length * t)])
            {
                newbgcolor = thresholds[t];
                newfontsize += fontFactor;
            }
            else
            {
                break;
            }
        }

        if (newbgcolor !== '')
        {
            $(this).parents("div.entry").css(
            {
                backgroundColor: newbgcolor,
                '-moz-border-radius': '7px',
                'webkit-border-radius': '7px',
                'padding': '2px 2px 2px 6px',
                'border': 'solid black 1px'
            });

            if (fontFactor > 0 || prevFontFactor !== "")
            {
                $(this).parents("div.entry").find(".md").css(
                {
                    fontSize: newfontsize
                });

                $(this).parents('.tagline').css(
                {
                    fontSize: newfontsize,
                    color: 'black'
                });

                $(this).css(
                {
                    fontSize: newfontsize,
                    color: 'black'
                });
            }
        }
    });
}

$(document).ready(function()
{
    highlightComments();
});