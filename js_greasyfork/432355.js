// ==UserScript==
// @name         Sim Companies Visual Improvements
// @namespace    https://www.simcompanies.com/company/Andrew%20Corp/
// @version      0.2.9.6
// @description  Visual Improvements to the desktop version of Sim Companies
// @author       Andrew Corp
// @match        https://*.simcompanies.com/*
// @grant        GM_addStyle
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.listValues
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/432355/Sim%20Companies%20Visual%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/432355/Sim%20Companies%20Visual%20Improvements.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements, await */
/* jshint esversion:6 */

// Customize text and colors (ideal for different languages)

// New in 0.2: Some settings are now accessible on your profile settings page,
//     you will have to F5 the page (until I get more kinks worked out) to get
//     it to load


var showLibraryinTopBar = await (GM.getValue("showLibraryinTopBar", false));
var textChat = await (GM.getValue("textChat", "Chat"));
var textMap = await (GM.getValue("textMap", "Map"));
var textMapShort = await (GM.getValue("textMapShort", "M"));
var textWarehouse = await (GM.getValue("textWarehouse", "Warehouse"));
var textWarehouseShort = await (GM.getValue("textWarehouseShort", "WH"));
var textSearch = await (GM.getValue("textSearch", "Search"));
var textSearchShort = await (GM.getValue("textSearchShort", "S"));
var textChatShort = await (GM.getValue("textChatShort", "C"));
var textExchange = await (GM.getValue("textExchange", "Exchange"));
var textExchangeShort = await (GM.getValue("textExchangeShort", "EX"));
var textLibrary = await (GM.getValue("textLibrary", "Library"));
var textLibraryShort = await (GM.getValue("textLibraryShort", "Lib"));
var showEncyclopediainTopBar = await (GM.getValue("showEncyclopediainTopBar", false));
var textEncyclopedia = await (GM.getValue("textEncyclopedia", "Encyclopedia"));
var textEncyclopediaShort = await (GM.getValue("textEncyclopediaShort", "Enc"));



var nonLiveTopBarColor = "#0018A3";
var nonLiveTopBarTextColor = "#FFF";
var hideIncomingBadge = await (GM.getValue("hideIncomingBadge", false));
var noticeableCollections = await (GM.getValue("noticeableCollections", false));
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
// disabling the top menu move until I can fully fix it
//waitForKeyElements (".fa-map", moveTheMenu);


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
    a > .fa-map, a > .fa-boxes, a > .fa-search, a > .fa-comment-alt, a > .fa-exchange-alt, a > .fa-book, a > .fa-bookmark, a > .fa-egg {
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
    // Determine if Realms Icon is present
    var realmsEnabled = false;
    var currentRealm = -1;
    var currentSpeedBoost = false;
    var activeContest = false;
    var realmIcon = "";

    try {
        realmIcon = $(".navbar-container").children().next().children().children().children().children().attr("src");
        if (realmIcon) {
            realmsEnabled = true; }
    }
    catch(err) {
        realmsEnabled = false;
    }

    if (realmsEnabled) {
        if (realmIcon.indexOf("Magnates") > 0) {
            currentRealm = 0; }
        else if (realmIcon.indexOf("Entrepeneurs") > 0) {
            currentRealm = 1; }
    }

    try {
        if ($(".fa-bars").next().children().next().children().children().attr("alt") == "speed up") {
            currentSpeedBoost = true; }
    }
    catch(err) {
        currentSpeedBoost = false;
    }

    try {
        if ($(".fa-bars").next().children().next().children().attr("href").includes("contest")) {
            activeContest = true; }
    }
    catch(err) {
        activeContest = false;
    }



    // if (realmsEnabled) {
        // remove Realm name
        // This might be temprary, as it looks poor right now and might be removed by default soon
    //    $(".fa-bars").next().children().children().children().last().hide();
    //}


    $( "<span class='vi-wide'>"+textMap+"</span><span class='vi-narrow'>"+textMapShort+"</span>" ).insertAfter( "a > .fa-map" );
    $( "<span class='vi-wide'>"+textWarehouse+"</span><span class='vi-narrow'>"+textWarehouseShort+"</span>" ).insertAfter( "div.container > div > div > a > .fa-boxes" );
    $( "<span class='vi-wide'>"+textSearch+"</span><span class='vi-narrow'>"+textSearchShort+"</span>" ).insertAfter( "a > .fa-search" );
    $( "<span class='vi-wide'>"+textChat+"</span><span class='vi-narrow'>"+textChatShort+"</span>" ).insertAfter( "a > .fa-comment-alt" );
    $( "<span class='vi-wide'>"+textExchange+"</span><span class='vi-narrow'>"+textExchangeShort+"</span>" ).insertAfter( "a > .fa-exchange-alt" );
    var bottomMenu = $(".fa-map").parent().parent().detach();
    bottomMenu.addClass("movedTopMenu");
    if (realmsEnabled) {
        bottomMenu.insertAfter( $(".navbar-container").children("div").first().children() );
    }
    else {
        bottomMenu.insertAfter( $(".fa-bars") );
    }




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

    /*
    var libsource = $("#gameMenuToggle > div > li:nth-child(2) > a ");
    var encsource = $("#gameMenuToggle > div > li:nth-child(3) > a ");

    if (showLibraryinTopBar && !currentSpeedBoost && !activeContest) {
        var librarylink = libsource.detach();
        librarylink.removeAttr("data-target");
        librarylink.removeAttr("data-toggle");
        librarylink.removeAttr("aria-expanded");
        librarylink.removeAttr("style");
        librarylink.addClass(topButtonAClass);
        librarylink.prepend("<i class='"+topButtonIClass+" fa-book' type='book'></i>");
        librarylink.insertAfter($(".movedTopMenu").children().last());
    }

    if (showEncyclopediainTopBar) {
        var encyclopedialink = encsource.detach();
        encyclopedialink.removeAttr("data-target");
        encyclopedialink.removeAttr("data-toggle");
        encyclopedialink.removeAttr("aria-expanded");
        encyclopedialink.removeAttr("style");
        encyclopedialink.addClass(topButtonAClass);
        encyclopedialink.prepend("<i class='"+topButtonIClass+" fa-bookmark' type='bookmark'></i>");
        encyclopedialink.insertAfter($(".movedTopMenu").children().last());
    }
    */

    if (showLibraryinTopBar && !currentSpeedBoost && !activeContest) {
        var librarylink = $("<a class='"+topButtonAClass+"' href='/newspaper/"+currentRealm+"/'><i class='"+topButtonIClass+" fa-book' type='book'></i><span class='vi-wide'>"+textLibrary+"</span><span class='vi-narrow'>"+textLibraryShort+"</span></a>");
        librarylink.insertAfter($(".movedTopMenu").children().last());
    }
    if (showEncyclopediainTopBar) {
        // currently not grabbing the recently viewed page
        var encyclopedialink = $("<a class='"+topButtonAClass+"' href='/encyclopedia/"+currentRealm+"/resource/'><i class='"+topButtonIClass+" fa-book' type='book'></i><span class='vi-wide'>"+textEncyclopedia+"</span><span class='vi-narrow'>"+textEncyclopediaShort+"</span></a>");
        encyclopedialink.insertAfter($(".movedTopMenu").children().last());
    }

    $(".movedTopMenu").append("<a href='/account-settings/' style='font-family: Sail, cursive; color: #b8b8b8'>A</a>");

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

    var today = new Date( Date.now());
    if (today.getDate() == '17' && today.getMonth() == '3') {
        $( "a > .fa-comment-alt" ).addClass("fa-egg");
        $( "a > .fa-comment-alt" ).removeClass("fa-comment-alt");
    }

}

function SCVIsettingsPanel (jNode) {
    if (window.location.pathname.endsWith("/account-settings/")) {
        var settingsregion = $(".row").children().last();

        settingsregion.append("<div class='well-ice well-ice-whiter settingsarea' style='padding: 15px; background-color: #fff;'></div>");

        var settingsarea = $(".settingsarea");

        settingsarea.append("<div><label>Andrew's <a href='https://greasyfork.org/en/scripts/432355-sim-companies-visual-improvements' target='_blank'>Sim Companies Visual Improvements</a> settings:</input></label></div>");
        settingsarea.append("<div><label><input type='checkbox' name='hideIncomingBadge'>&nbsp;Hide incoming count</input></label></div>");
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

        settingsarea.append("<div><label><input type='checkbox' name='noticeableCollections'>&nbsp;Make the collections stand out</input></label></div>");
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

        settingsarea.append("<div><label><input type='checkbox' name='showLibraryinTopBar'>&nbsp;Show Library in Top Bar -- If you currently have a speed-up (early game), or there is an active contest the library will be hidden regardless of your choice here</input></label></div>");
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
        settingsarea.append("<div><label><input type='checkbox' name='showEncyclopediainTopBar'>&nbsp;Show Encyclopedia in Top Bar</input></label></div>");
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

        settingsarea.append("<p>Enabling both the library and encyclopedia links are highly encouraged, but disabled by default as they are likely to hide the starting speed boost and maybe contest icon. I will address that before releasing 0.3.0.0.</p>");
        settingsarea.append("<hr />");

        settingsarea.append("<div><label for'textMap'>Map Name (normal, short)</label><br /><input type='text' name='textMap' value='"+textMap+"'/><input type='text' name='textMapShort' value='"+textMapShort+"'/></div>");
        $("input[name='textMap']").change(function() {
            GM.setValue("textMap", $(this).val());
        });
        $("input[name='textMapShort']").change(function() {
            GM.setValue("textMapShort", $(this).val());
        });

        settingsarea.append("<div><label for'textMap'>Warehouse Name (normal, short)</label><br /><input type='text' name='textWarehouse' value='"+textWarehouse+"'/><input type='text' name='textWarehouseShort' value='"+textWarehouseShort+"'/></div>");
        $("input[name='textWarehouse']").change(function() {
            GM.setValue("textWarehouse", $(this).val());
        });
        $("input[name='textWarehouseShort']").change(function() {
            GM.setValue("textWarehouseShort", $(this).val());
        });

        settingsarea.append("<div><label for'textMap'>Search Name (normal, short)</label><br /><input type='text' name='textSearch' value='"+textSearch+"'/><input type='text' name='textSearchShort' value='"+textSearchShort+"'/></div>");
        $("input[name='textSearch']").change(function() {
            GM.setValue("textSearch", $(this).val());
        });
        $("input[name='textSearchShort']").change(function() {
            GM.setValue("textSearchShort", $(this).val());
        });

        settingsarea.append("<div><label for'textMap'>Chat Name (normal, short)</label><br /><input type='text' name='textChat' value='"+textChat+"'/><input type='text' name='textChatShort' value='"+textChatShort+"'/></div>");
        $("input[name='textChat']").change(function() {
            GM.setValue("textChat", $(this).val());
        });
        $("input[name='textChatShort']").change(function() {
            GM.setValue("textChatShort", $(this).val());
        });

        settingsarea.append("<div><label for'textMap'>Exchange Name (normal, short)</label><br /><input type='text' name='textExchange' value='"+textExchange+"'/><input type='text' name='textExchangeShort' value='"+textExchangeShort+"'/></div>");
        $("input[name='textExchange']").change(function() {
            GM.setValue("textExchange", $(this).val());
        });
        $("input[name='textExchangeShort']").change(function() {
            GM.setValue("textExchangeShort", $(this).val());
        });

        settingsarea.append("<div><label for'textMap'>Library Name (normal, short)</label><br /><input type='text' name='textLibrary' value='"+textLibrary+"'/><input type='text' name='textLibraryShort' value='"+textLibraryShort+"'/></div>");
        $("input[name='textLibrary']").change(function() {
            GM.setValue("textLibrary", $(this).val());
        });
        $("input[name='textLibraryShort']").change(function() {
            GM.setValue("textLibraryShort", $(this).val());
        });

        settingsarea.append("<div><label for'textMap'>Encyclopedia Name (normal, short)</label><br /><input type='text' name='textEncyclopedia' value='"+textEncyclopedia+"'/><input type='text' name='textEncyclopediaShort' value='"+textEncyclopediaShort+"'/></div>");
        $("input[name='textEncyclopedia']").change(function() {
            GM.setValue("textEncyclopedia", $(this).val());
        });
        $("input[name='textEncyclopediaShort']").change(function() {
            GM.setValue("textEncyclopediaShort", $(this).val());
        });


        settingsarea.append("<div><label><input type='button' name='applySettings' value='Apply SCVI Setting Changes'></input></label></div>");
        $("input[name='applySettings']").click(function() {
            location.reload();
        });
    }
}