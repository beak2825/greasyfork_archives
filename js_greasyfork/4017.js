// ==UserScript==
// @name       Freesound.org - license filter
// @namespace  http://monnef.tk/
// @version    0.1
// @description   Keeps only cc0 and (optionally) cc-by and sampling+ found items in search results page.
// @match      http://www.freesound.org/search/*
// @copyright  2014+, monnef
// @require     https://code.jquery.com/jquery-2.1.1.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4017/Freesoundorg%20-%20license%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/4017/Freesoundorg%20-%20license%20filter.meta.js
// ==/UserScript==

var ACTION_ENUM = {
    REMOVE: "remove", // completely removes element
    FOLD: "fold", // folds element, can be unfolded by a click
    TRANSPARENT: "transparent" // makes element partially transparent, on mouse over is fully visible
};

// settigns
var action = ACTION_ENUM.FOLD; // see ACTION_ENUM
var showCCBY = true; // CC-Attribution
var showSampling = false; // CC-Sampling+
// end of settings

var debug = false;

this.$ = this.jQuery = jQuery.noConflict(true);

function addStyle(style) {
    style = style instanceof Array ? style.join('\n') : style;
    $("head").append($('<style type="text/css">' + style + '</style>'));
}

var prClass = "hideable1357210";
var prAnimLen = "0.5";

addStyle([
    '.' + prClass + ' {',
    '    -webkit-transition: opacity ' + prAnimLen + 's;',
    '    -moz-transition: opacity ' + prAnimLen + 's;',
    '    -ms-transition: opacity ' + prAnimLen + 's;',
    '    transition: opacity ' + prAnimLen + 's;',
    '    opacity: 0.05;',
    '}',
    '.' + prClass + ':hover {',
    '    opacity: 1;',
    '}'
]);

function doHide(elem) {
    var e = $(elem);
    console.log("Hiding " + e.attr("id") + ".");
    switch (action) {
        case ACTION_ENUM.REMOVE:
            e.remove();
            break;

        case ACTION_ENUM.FOLD:
            var title = $("a.title", e).html();
            var id = e.attr("id");
            var text = $("<span />").html("[+] "+title);
            text.css("cursor","pointer");
            text.click(function() {
                $("#" + id).toggle("fast");
            });
            var divLink = $("<div />").html(text).css("margin-bottom", "8px");
            e.before(divLink);
            e.hide();
            e.wrap("<div style=\"border-left: 2px solid #ccc; margin-left:8px; padding-left:4px;\"></div>");
            break;

        case ACTION_ENUM.TRANSPARENT:
            e.addClass(prClass);
            break;

        default:
            console.log("Unknown action: " + action);
    }
}

var licRegex = /\/([^/]*?)\.png/;

$(document).ready(function() {
    var items = $(".sample_player_small");
    console.log("Found " + items.size() + " items.");
    items.each(function(index, elem) {
        // console.log("Processing " + $(this).attr("id") + " ("+index+").");
        if (debug) $(this).css("border", "1px solid red");
        var img = $("img.cc_license", this);
        var imgSrc = img.attr("src");
        if (licRegex.test(imgSrc)) {
            var lic = licRegex.exec(imgSrc)[1];
            var hide;
            if (lic === "nolaw") {
                // cc0, fine
                hide = false;
            } else if (lic === "by") {
                hide = !showCCBY;
            } else if (lic === "sampling") {
                hide = !showSampling;
            } else if (lic === "bync") {
                hide = true;
            } else {
                console.log("Unknown license: " + lic);
                hide = false;
            }

            if (hide) {
                doHide(this);
            }
        } else {
            console.log("Can't get source of image.");
        }
    });
    $(".search_paginator").last().before($("<div>Script for filtering by license was created by <a href='http://monnef.tk'>monnef</a>. Please consider supporting me via <a href='https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=U6PGB7P24WWSU&lc=EC&item_name=freesound%2eorg%20filtering%20script&currency_code=CZK&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted'>PayPal</a> or <a href='http://adf.ly/2536344/freesoundorg-script'>AdFly</a>.</div>"));
});
