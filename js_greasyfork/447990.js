// ==UserScript==
// @name         Drawception image fixes
// @namespace    mailto:snr0nface@gmail.com
// @version      1.2
// @description  Workaround for broken images on Drawception
// @author       snr0n
// @match        https://*.drawception.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawception.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/447990/Drawception%20image%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/447990/Drawception%20image%20fixes.meta.js
// ==/UserScript==
/* global waitForKeyElements */
/* eslint-disable no-multi-spaces, curly */
'use strict';


// How many panels do you want to load at once?
var panelLoadCount =    5    ;


const re = /data:image\S*[^"]/;
var feedPanels;
var visiblePanels;

if (document.URL.match(/player\S*/)) {
    waitForKeyElements (".thumbpanel-tools > object > a", imgSwapProfile);
}

else if (document.URL.match(/panel\/caption\S*/)) {
    waitForKeyElements (".thumbpanel", imgSwapPanel);
}

else if (document.URL.match(/recent-games/)) {
    waitForKeyElements ("#main > div.thumbpanel-container > div > a", imgSwapRecent);
}

else if (document.URL.match(/dashboard/)) {
    waitForKeyElements ("#main > div.grid.dashboard > div.dashboard-side > div:nth-child(8) > div > a", imgSwapRecent);
    feedPanels = document.querySelectorAll(".thumbpanel-base");
    for (i = 0; i < feedPanels.length; i++) { $(feedPanels[i]).parent().parent().hide(); }
    visiblePanels = $(".thumbpanel-base:visible");
    console.log("visiblePanels.length: " + visiblePanels.length);
    GM_addStyle ( ` .btnContainer{ display: flex; justify-content: center; align-items: center; } .btnMore{ text-align: center; width: 90%; height: 90%; margin: auto; color: #3333ff; background-color: #ffffff; font-size: 22px; font-weight: bolder; border: 2px dashed #2596be; } ` );
    loadMore();
}

function loadMore() {
    console.log("loading more panels");
    (visiblePanels.length > 0) ? $(".btnContainer").remove() : null;
    for (i = visiblePanels.length; i < visiblePanels.length + panelLoadCount; i++) { $(feedPanels[i]).parent().parent().show(); imgSwapFeed($(feedPanels[i])); }
    visiblePanels = $(".thumbpanel-base:visible");
    console.log("visiblePanels.length: " + visiblePanels.length);
    console.log("feedPanels.length: " + feedPanels.length);
    if (visiblePanels.length < feedPanels.length) {
        var zNode = document.createElement ('div');
        zNode.innerHTML = '<button class="btn btnPrimary btnMore" type="button">'+ 'More</button>';
        zNode.setAttribute ('class', 'btnContainer');
        $(feedPanels[visiblePanels.length - 1]).parent().parent().append(zNode);
        document.querySelector(".btnMore").addEventListener ("click", loadMore, false);
    }
}

function imgSwapProfile (jNode) {
    GM_xmlhttpRequest(
    {
        method: "GET",
        url: jNode.attr("href"),
        onload: function(response) {
            const svg = response.responseText.match(re);
            const fixedURL = svg[0].slice(0, svg[0].length-2);
            $('img', jNode.parent().parent().parent()).attr("src", fixedURL);
        }
    }
);
}

function imgSwapPanel (jNode) {
    const username = $('#main > div.text-center > p.lead > a').text();
    console.log(username);
    var link;
    let test = $('#main > div.text-center > p:nth-child(4) > a').attr("href");
    console.log(test);
    link = (test == undefined? $('#main > div.text-center > p.text-center > a').attr("href") : test);
     console.log(link);
    GM_xmlhttpRequest(
        {
            method: "GET",
            url: link,
            response: document,
            onload: function(response) {
                var responseHTML = null;
                if (!response.responseHTML) {
                    responseHTML = new DOMParser()
                        .parseFromString(response.responseText, "text/html");
                }
                const entryPanel = $('#main > div.row.add-margin-top3x > div > div.gamepanel-holder > div.panel-details.flex-space-between > div.panel-user > a', responseHTML).filter(function(index) { return $(this).text() === username; });
                const entryPanelNum = $('a', entryPanel.parent().parent().parent()).text();
                const newPanelNum = parseInt(entryPanelNum) - 1;
                const newPanel = $('#main > div.row.add-margin-top3x > div > div.gamepanel-holder > a', responseHTML).filter(function(index) { return $(this).text() === newPanelNum.toString(); });
                const svg = $('> div.gamepanel > img', newPanel.parent()).attr("src");
                $('img', jNode).attr("src", svg);
            }
        }
        );
    }

function imgSwapRecent (jNode) {
    GM_xmlhttpRequest(
        {
            method: "GET",
            url: jNode.attr("href"),
            response: document,
            onload: function(response) {
                var responseHTML = null;
                if (!response.responseHTML) {
                    responseHTML = new DOMParser()
                        .parseFromString(response.responseText, "text/html");
                }
                svg = $('#main > div.row.add-margin-top3x > div:nth-child(1) > div.gamepanel-holder > .gamepanel > img', responseHTML).attr("src");
                if (svg == undefined) {
                    svg = $('#main > div.row.add-margin-top3x > div:nth-child(2) > div.gamepanel-holder > .gamepanel > img', responseHTML).attr("src");
                }
                $('img', jNode).attr("src", svg);
            }
        }
    );
}

function imgSwapFeed (jNode) {
    const panelType = $('> div.flex-v-center > div > p.text-muted', jNode.parent().parent()).text();
    if (panelType.includes("drew this panel")) {
        const username = $('> div.flex-v-center > div > p.lead.clear-bot > b > a', jNode.parent().parent()).text();
        GM_xmlhttpRequest(
        {
            method: "GET",
            url: jNode.attr("href"),
            response: document,
            onload: function(response) {
                var responseHTML = null;
               if (!response.responseHTML) {
                    responseHTML = new DOMParser()
                        .parseFromString(response.responseText, "text/html");
                }
                const entryPanel = $('#main > div.row.add-margin-top3x > div > div.gamepanel-holder > div.panel-details.flex-space-between > div.panel-user > a', responseHTML).filter(function(index) { return $(this).text() === username; });
                const svg = $('> div.gamepanel > img', entryPanel.parent().parent().parent()).attr("src");
                $('img', jNode).attr("src", svg);
            }
        }
        );
    }
    else if (panelType.includes("wrote this caption")) {
         const username = $('> div.flex-v-center > div > p.lead.clear-bot > b > a', jNode.parent().parent()).text();
        GM_xmlhttpRequest(
        {
            method: "GET",
            url: jNode.attr("href"),
            response: document,
            onload: function(response) {
                var responseHTML = null;
                if (!response.responseHTML) {
                    responseHTML = new DOMParser()
                        .parseFromString(response.responseText, "text/html");
                }
                const entryPanel = $('#main > div.row.add-margin-top3x > div > div.gamepanel-holder > div.panel-details.flex-space-between > div.panel-user > a', responseHTML).filter(function(index) { return $(this).text() === username; });
                const entryPanelNum = $('a', entryPanel.parent().parent().parent()).text();
                const newPanelNum = parseInt(entryPanelNum) - 1;
                const newPanel = $('#main > div.row.add-margin-top3x > div > div.gamepanel-holder > a', responseHTML).filter(function(index) { return $(this).text() === newPanelNum.toString(); });
                const svg = $('> div.gamepanel > img', newPanel.parent()).attr("src");
                $('img', jNode).attr("src", svg);
            }
        }
        );
    }
    else if (panelType.includes("started a game with this caption")) {
           GM_xmlhttpRequest(
        {
            method: "GET",
            url: jNode.attr("href"),
            response: document,
            onload: function(response) {
                var responseHTML = null;
                if (!response.responseHTML) {
                    responseHTML = new DOMParser()
                        .parseFromString(response.responseText, "text/html");
                }
              const svg = $('#main > div.row.add-margin-top3x > div:nth-child(2) > div.gamepanel-holder > .gamepanel > img', responseHTML).attr("src");
                $('img', jNode).attr("src", svg);
            }
        }
        );
    }
    else if (panelType.includes("started a game with this drawing")) {
           GM_xmlhttpRequest(
        {
            method: "GET",
            url: jNode.attr("href"),
            response: document,
            onload: function(response) {
                var responseHTML = null;
                if (!response.responseHTML) {
                    responseHTML = new DOMParser()
                        .parseFromString(response.responseText, "text/html");
                }
              const svg = $('#main > div.row.add-margin-top3x > div:nth-child(1) > div.gamepanel-holder > .gamepanel > img', responseHTML).attr("src");
                $('img', jNode).attr("src", svg);
            }
        }
        );
    }
}





/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}