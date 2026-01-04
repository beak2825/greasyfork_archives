// ==UserScript==
// @name         c-plusplus.net Alternating Post Backgrounds
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  try to take over the world!
// @author       Swordfishx86
// @include      https://www.c-plusplus.net/*
// @include      http://www.c-plusplus.net/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/370973/c-plusplusnet%20Alternating%20Post%20Backgrounds.user.js
// @updateURL https://update.greasyfork.org/scripts/370973/c-plusplusnet%20Alternating%20Post%20Backgrounds.meta.js
// ==/UserScript==

var background_colors = [ "#f2f2f2", "#f9f9f9" ];
var blockquote_line_color = "#c9c9c9";

GM_addStyle( "div.post-bar > hr { display: none; }" );
GM_addStyle( "#content > div.row > div.topic.col-lg-12 > ul > li > div.content > blockquote { border-left: 5px solid " + blockquote_line_color + "; margin: 0 0 10px; padding: 10px 10px; }" );
GM_addStyle( "#content > div.row > div.topic.col-lg-12 > ul > li > hr:last-of-type { display: none; }" );
GM_addStyle( "#content > div.row > div.topic.col-lg-12 > ul > li, #content > div.row > div.category.col-lg-12 > ul > li, #content > div.row > div.col-lg-12 > ul > li, #content > div.row > div.category.col-lg-12 > div.subcategory > ul > li, #content > div.recent > div.category > ul > li, #content > div.popular > div.category > ul > li, #content > div.unread > div.category > ul > li { padding: 15px 10px 15px 10px; margin: 18px 0px 18px 0px; }");

function beautifier(selector, jNode) {
    var x = document.querySelectorAll(selector);
    for (i = 0; i < x.length; ++i) {
        x[i].style.backgroundColor = background_colors[i % 2];
        var bq = x[i].querySelectorAll("blockquote");
        for(var n = 0; n < bq.length; ++n ) {
            bq[n].style.backgroundColor = background_colors[(i + 1) % 2];
        }
    }
}

function waitForKeyElements(selectorTxt, actionFunction)
{
    var targetNodes = $(selectorTxt), btargetsFound;

    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        targetNodes.each ( function () {
            var jThis = $(this);
            var alreadyFound = jThis.data ('alreadyFound') || false;

            if (!alreadyFound) {
                var cancelFound = actionFunction (jThis);
                if (cancelFound) {
                    btargetsFound = false;
                } else {
                    jThis.data ('alreadyFound', true);
                }
            }
        } );
    }
    else {
        btargetsFound = false;
    }

    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl = controlObj [controlKey];

    if ( ! timeControl) {
        timeControl = setInterval(function(){waitForKeyElements(selectorTxt, actionFunction, false, false);}, 500);
        controlObj [controlKey] = timeControl;
    }
    waitForKeyElements.controlObj = controlObj;
}

var selectors = [
    "#content > div.row > div.topic.col-lg-12 > ul > li",
    "#content > div.row > div.category.col-lg-12 > ul > li",
    "#content > div.row > div.col-lg-12 > ul > li",
    "#content > div.row > div.category.col-lg-12 > div.subcategory > ul > li",
    "#content > div.recent > div.category > ul > li",
    "#content > div.popular > div.category > ul > li",
    "#content > div.unread > div.category > ul > li"
];

for(var i = 0; i < selectors.length; ++i) {
    waitForKeyElements(selectors[i], beautifier.bind(null, selectors[i]));
}

