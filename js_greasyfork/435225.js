// ==UserScript==
// @name         		Sim Companies Visual Improvements
// @namespace		https://www.simcompanies.com/company/Andrew%20Corp/
// @version		0.2.1.1
// @description		Visual Improvements to the desktop version of Sim Companies
// @author		Andrew Corp
// @Translater to German	Sperlingsfedern
// @match		https://*.simcompanies.com/*
// @grant		GM_addStyle
// @grant		GM.setValue
// @grant		GM.getValue
// @require		https://code.jquery.com/jquery-latest.js
// @run-at		document-idle
// @downloadURL https://update.greasyfork.org/scripts/435225/Sim%20Companies%20Visual%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/435225/Sim%20Companies%20Visual%20Improvements.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements, await */
/* jshint esversion:6 */

// Customize text and colors (ideal for different languages)

// New in 0.2: Some settings are now accessible on your profile settings page,
//     you will have to F5 the page (until I get more kinks worked out) to get
//     it to load

var textMap = "Karte";
var textMapShort = "M";
var textWarehouse = "Lager";
var textWarehouseShort = "WH";
var textSearch = "Suche";
var textSearchShort = "S";
var textChat = "Chat";
var textChatShort = "C";
var textExchange = "Börse";
var textExchangeShort = "EX";
var showLibraryinTopBar = JSON.parse(await (GM.getValue("showLibraryinTopBar", true)));
var textLibrary = "Bibliothek";
var textLibraryShort = "Lib";
var showEncyclopediainTopBar = JSON.parse(await (GM.getValue("showEncyclopediainTopBar", true)));
var textEncyclopedia = "Enzyklopädie";
var textEncyclopediaShort = "Enc";

var nonLiveTopBarColor = "#0018A3";
var nonLiveTopBarTextColor = "#FFF";
var hideIncomingBadge = JSON.parse(await (GM.getValue("hideIncomingBadge", false)));
var noticeableCollections = JSON.parse(await (GM.getValue("noticeableCollections", false)));
/**
 * A utility function for userscripts that detects and handles AJAXed content.
 * Source: https://github.com/CoeJoder/waitForKeyElements.js
 * @example
 * waitForKeyElements("div.comments", (element) => {
 *   element.innerHTML = "This text inserted by waitForKeyElements().";
 * });
 *
 * waitForKeyElements(() => {
 *   const iframe = document.querySelector('iframe');
 *   if (iframe) {
 *     const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
 *     return iframeDoc.querySelectorAll("div.comments");
 *   }
 *   return null;
 * }, callbackFunc);
 *
 * @param {(string|function)} selectorOrFunction - The selector string or function.
 * @param {function}          callback           - The callback function; takes a single DOM element as parameter.
 *                                                 If returns true, element will be processed again on subsequent iterations.
 * @param {boolean}           [waitOnce=true]    - Whether to stop after the first elements are found.
 * @param {number}            [interval=300]     - The time (ms) to wait between iterations.
 * @param {number}            [maxIntervals=-1]  - The max number of intervals to run (negative number for unlimited).
 */
function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
    if (typeof waitOnce === "undefined") {
        waitOnce = true;
    }
    if (typeof interval === "undefined") {
        interval = 300;
    }
    if (typeof maxIntervals === "undefined") {
        maxIntervals = -1;
    }
    var targetNodes = (typeof selectorOrFunction === "function")
            ? selectorOrFunction()
            : document.querySelectorAll(selectorOrFunction);

    var targetsFound = targetNodes && targetNodes.length > 0;
    if (targetsFound) {
        targetNodes.forEach(function(targetNode) {
            var attrAlreadyFound = "data-userscript-alreadyFound";
            var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
            if (!alreadyFound) {
                var cancelFound = callback(targetNode);
                if (cancelFound) {
                    targetsFound = false;
                }
                else {
                    targetNode.setAttribute(attrAlreadyFound, true);
                }
            }
        });
    }

    if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
        maxIntervals -= 1;
        setTimeout(function() {
            waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
        }, interval);
    }
}

waitForKeyElements (".fa-map", moveTheMenu);
//waitForKeyElements (".company-info", SCVIsettingsPanel);



//window.addEventListener('popstate', function(e) {
//    console.log(window.location.href);
//    alert('test');
//});


(function() {
    'use strict';
GM_addStyle ( `
    #__AmCharts_React_1__ {
        height: 600px !important;
    }
    #__AmCharts_React_2__ {
        height: 600px !important;
    }
    #__AmCharts_React_3__ {
        height: 600px !important;
    }
    #__AmCharts_React_4__ {
        height: 600px !important;
    }
    #__AmCharts_React_5__ {
        height: 600px !important;
    }
    a > .fa-map, a > .fa-boxes, a > .fa-search, a > .fa-comment-alt, a > .fa-exchange-alt, a > .fa-book, a > .fa-bookmark {
        font-size: 24px !important;
    }
    @media screen and (min-width: 1000px) {
        .vi-wide {
            display: inline;
        }
        .vi-narrow {
            display: none;
        }
    }
    @media screen and (max-width: 999px) {
        .vi-wide {
            display: none;
        }
        .vi-narrow {
            display: inline;
        }
    }
    a[href$='/messages/'] > span.badge, a[href$='/headquarters/warehouse/'] > span.badge {
        left: 35px !important;
    }
` );
if (hideIncomingBadge) {
    GM_addStyle ( `
        a[href$='/headquarters/warehouse/'] > span.badge {
            visibility: hidden;
        }
    ` );
}
if (noticeableCollections) {
    GM_addStyle ( `
        .anim-ghost {
            color: black;
            font-weight: 600;
            font-size: x-large;
            -webkit-text-stroke-width: thin;
            -webkit-text-stroke-color: white;
            animation-duration: 2s;
        }
    ` );
}
})();

function moveTheMenu (jNode) {
    $( "<span class='vi-wide'>"+textMap+"</span><span class='vi-narrow'>"+textMapShort+"</span>" ).insertAfter( "a > .fa-map" );
    $( "<span class='vi-wide'>"+textWarehouse+"</span><span class='vi-narrow'>"+textWarehouseShort+"</span>" ).insertAfter( "a > .fa-boxes" );
    $( "<span class='vi-wide'>"+textSearch+"</span><span class='vi-narrow'>"+textSearchShort+"</span>" ).insertAfter( "a > .fa-search" );
    $( "<span class='vi-wide'>"+textChat+"</span><span class='vi-narrow'>"+textChatShort+"</span>" ).insertAfter( "a > .fa-comment-alt" );
    $( "<span class='vi-wide'>"+textExchange+"</span><span class='vi-narrow'>"+textExchangeShort+"</span>" ).insertAfter( "a > .fa-exchange-alt" );
    var bottomMenu = $(".fa-map").parent().parent().detach();
    bottomMenu.addClass("movedTopMenu");
    bottomMenu.insertAfter(".fa-bars");

    SCVIsettingsPanel();

    var topButtonAClass = "";
    var topButtonIClass = "";
    if (window.location.href.indexOf("/landscape/") != -1) {
        topButtonAClass=$(".movedTopMenu a").next().attr("class");
        topButtonIClass=$(".movedTopMenu a").next().children("i").attr("class").replace(/fa-([a-z]*)/,"");
    } else {
        topButtonAClass=$(".movedTopMenu a").attr("class");
        topButtonIClass=$(".movedTopMenu a").children("i").attr("class").replace(/fa-([a-z]*)/,"");
    }

    if (showLibraryinTopBar) {
        $(".movedTopMenu").append("<a class='"+topButtonAClass+"' href='/newspaper/'><i class='"+topButtonIClass+" fa-book' type='book'> </i><span class='vi-wide'>"+textLibrary+"</span><span class='vi-narrow'>"+textLibraryShort+"</span>");
    }
    if (showEncyclopediainTopBar) {
        $(".movedTopMenu").append("<a class='"+topButtonAClass+"' href='/encyclopedia/'><i class='"+topButtonIClass+" fa-bookmark' type='bookmark'> </i><span class='vi-wide'>"+textEncyclopedia+"</span><span class='vi-narrow'>"+textEncyclopediaShort+"</span>");
    }

    // hide bottom bar now that we got rid of everything in it -- Removing it breaks going from the map to the homepage
    $(".chat-notifications").next().hide();

    if (window.location.href.indexOf("www.simcompanies") == -1) {
        $(".fa-bars").parent().parent().css("background-color", nonLiveTopBarColor);
        $( "a > .fa-map" ).parent().css({"color": nonLiveTopBarTextColor, "background-color": nonLiveTopBarColor});
        $( "a > .fa-boxes" ).parent().css({"color": nonLiveTopBarTextColor, "background-color": nonLiveTopBarColor});
        $( "a > .fa-search" ).parent().css({"color": nonLiveTopBarTextColor, "background-color": nonLiveTopBarColor});
        $( "a > .fa-comment-alt" ).parent().css({"color": nonLiveTopBarTextColor, "background-color": nonLiveTopBarColor});
        $( "a > .fa-exchange-alt" ).parent().css({"color": nonLiveTopBarTextColor, "background-color": nonLiveTopBarColor});
    }

}

function SCVIsettingsPanel (jNode) {

    $(".company-info").append("<div><label>Andrew's <a href='https://greasyfork.org/en/scripts/432355-sim-companies-visual-improvements' target='_blank'>Sim Companies Visual Improvements</a> settings:</input></label></div>");
    $(".company-info").append("<div><label><input type='checkbox' name='hideIncomingBadge'>&nbsp;Hide incoming count</input></label></div>");
    if (hideIncomingBadge) {
        $("input[name='hideIncomingBadge']").prop("checked", true);
    }
    $("input[name='hideIncomingBadge']").change(function() {
        if ($(this).is(':checked')) {
            GM.setValue("hideIncomingBadge", true);
        }
        else {
            GM.setValue("hideIncomingBadge", false);
        }
    });
    $(".company-info").append("<div><label><input type='checkbox' name='showLibraryinTopBar'>&nbsp;Show Library in Top Bar</input></label></div>");
    if (showLibraryinTopBar) {
        $("input[name='showLibraryinTopBar']").prop("checked", true);
    }
    $("input[name='showLibraryinTopBar']").change(function() {
        if ($(this).is(':checked')) {
            GM.setValue("showLibraryinTopBar", true);
        }
        else {
            GM.setValue("showLibraryinTopBar", false);
        }
    });
    $(".company-info").append("<div><label><input type='checkbox' name='showEncyclopediainTopBar'>&nbsp;Show Encyclopedia in Top Bar</input></label></div>");
    if (showEncyclopediainTopBar) {
        $("input[name='showEncyclopediainTopBar']").prop("checked", true);
    }
    $("input[name='showEncyclopediainTopBar']").change(function() {
        if ($(this).is(':checked')) {
            GM.setValue("showEncyclopediainTopBar", true);
        }
        else {
            GM.setValue("showEncyclopediainTopBar", false);
        }
    });
    $(".company-info").append("<div><label><input type='checkbox' name='noticeableCollections'>&nbsp;Make the collections stand out</input></label></div>");
    if (noticeableCollections) {
        $("input[name='noticeableCollections']").prop("checked", true);
    }
    $("input[name='noticeableCollections']").change(function() {
        if ($(this).is(':checked')) {
            GM.setValue("noticeableCollections", true);
        }
        else {
            GM.setValue("noticeableCollections", false);
        }
    });
    $(".company-info").append("<div><label><input type='button' name='applySettings' value='Apply SCVI Setting Changes'></input></label></div>");
    $("input[name='applySettings']").click(function() {
        location.reload();
    });
}