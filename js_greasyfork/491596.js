// ==UserScript==
// @name         Remove Popup Ads on mp4upload.com & aniwave.to
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Remove all popup ads on both mp4upload.com and aniwave.to, including within media players
// @author       Goku
// @match        https://www.mp4upload.com/*
// @match        https://aniwave.to/*
// @grant        GM_config
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/491596/Remove%20Popup%20Ads%20on%20mp4uploadcom%20%20aniwaveto.user.js
// @updateURL https://update.greasyfork.org/scripts/491596/Remove%20Popup%20Ads%20on%20mp4uploadcom%20%20aniwaveto.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================== CONFIG =================================
    var bDisplayMessageOnPopupBlocked = true;
    var bDisplayOpenPopupLink = true;
    var bDisplayWhiteListThisDomainLink = true;
    var LOG_ID = "ultimate_popup_blocker"; // HTML ID in the page

    // Function to remove popup ads indefinitely
    function removePopupAds() {
        // Remove popups every second from the whole page
        setInterval(function() {
            removePopups(document.body);
        }, 1000); // Check every 1 second

        // Remove popups every second from the player wrapper on aniwave.to
        if (window.location.hostname === "aniwave.to") {
            var playerWrapper = document.getElementById('player-wrapper');
            if (playerWrapper) {
                setInterval(function() {
                    removePopups(playerWrapper);
                }, 1000); // Check every 1 second
            }
        }
    }

    // Function to remove popups within a specific container
    function removePopups(container) {
        var popupAds = container.querySelectorAll('a[href^="http://"]');
        popupAds.forEach(function(popupAd) {
            popupAd.remove();
        });
    }

    // Helper to create a button with inner text @text executing onclick @clickCallback
    var putButton = function (logDiv, text, clickCallback, inlineStyle) {
        var button = document.createElement("button");
        button.innerHTML = text;
        button.style.cssText = "text-decoration:none; color:black; cursor:pointer;\
            margin: 0 5px; font: 8pt microsoft sans serif; padding: 1px 3px;\
            background-color:rgb(212,208,200); border-width:2px; border-style:outset;\
            border-color:#eee #555 #555 #eee; color:black;" + inlineStyle;
        logDiv.appendChild(button);
        button.addEventListener("click", clickCallback);
    };

    // Helper to create a button (child of @logDiv) which onclick whitelists @domain
    var putWhitelistButton = function (logDiv, domain) {
        putButton(logDiv, domain, function(){
            GM_setValue("whitelisted_" + domain, true);
        });
    };

    // Helper to create a text node with @text and append to @logDiv
    var putText = function (logDiv, text) {
        var node = document.createTextNode(text);
        logDiv.appendChild(node);
    };

    // Return logger div, or create it ad-hoc.
    var getLogDiv = function () {
        var logDiv = document.getElementById(LOG_ID);
        if(!logDiv){
            logDiv = document.createElement("div");
            logDiv.setAttribute("id", LOG_ID);
            logDiv.style.cssText="position:fixed; top:0; left:0; width:100%;\
                padding:5px 5px 5px 29px; font: 8pt microsoft sans serif;\
                background-color: linen; color:black; border:1px solid black;\
                ";
            document.body.appendChild(logDiv);
        }
        return logDiv;
    };

    // Get array of domains for which it would make sense to whitelist them.
    var getDomainsArray = function(documentDomain){
        var d1 = documentDomain;
        var domainsArr = [];
        
        var lastDot1 = d1.lastIndexOf('.');
        if(lastDot1 != -1){
            var lastDot2 = d1.lastIndexOf('.', lastDot1-1);
            if(lastDot2 != -1 && lastDot2 != lastDot1) {
                var d2 = d1.substr(lastDot2 + 1);
                domainsArr.push(d2);
  
                var lastDot3 = d1.lastIndexOf('.', lastDot2-1);
                if(lastDot3 != -1 && lastDot3 != lastDot2) {
                    var d3 = d1.substr(lastDot3 + 1);
                    domainsArr.push(d3);
                }
            }
        }
        
        domainsArr.push(d1);
        return domainsArr;
    };

    // Checks if domain we're currently browsing has been whitelisted by the user
    var isCurrentDomainWhiteListed = function() {
        var domains = getDomainsArray(document.domain);
        var whitelisted = domains.some(function(d){
            return GM_getValue("whitelisted_" + d);
        });
        return whitelisted;
    };

    // FakeWindow to prevent popup focusing
    var FakeWindow = {
        blur: function() {return false;},
        focus: function() {return false;}
    };

    // Store a reference to real "window.open" method
    var realWindowOpen = window.open;

    // Override browser's "window.open" with our own implementation
    var fakeWindowOpen = function(url){
        if(!bDisplayMessageOnPopupBlocked){
            return FakeWindow;
        }
        var logDiv = getLogDiv();
        logMessage(logDiv, url);
        
        if(bDisplayOpenPopupLink){
            displayOpenPopupLink(logDiv, arguments);
        }
        if(bDisplayWhiteListThisDomainLink) {
            displayWhiteListThisDomainLink(logDiv);
        }
        displayCloseButton(logDiv);
        return FakeWindow;
    };

    var logMessage = function (logDiv, url) {
        window.upb_counter = (window.upb_counter || 0);
        url = (url[0] == '/') ? document.domain + url : url;
        var msg = ["UPB has blocked <b>", ++window.upb_counter, "</b> popup windows, last: <u>", url, "</u>"].join("");
        logDiv.innerHTML = msg;
        console.log(msg);
        logDiv.style.display = "block";
    };

    var displayOpenPopupLink = function (logDiv, realArguments){
        putButton (logDiv, "open the popup", function(){
            realWindowOpen.apply(null, realArguments);
        });
    };

    var displayWhiteListThisDomainLink = function(logDiv) {
        var domainsArr = getDomainsArray(document.domain);
        
        putText(logDiv, ' whitelist the domain: ');
        putWhitelistButton(logDiv, domainsArr[0]);
        if(domainsArr[1]){
            putWhitelistButton(logDiv, domainsArr[1]);
        }
        if(domainsArr[2]){
            putWhitelistButton(logDiv, domainsArr[2]);
        }
    };

    var displayCloseButton = function(logDiv) {
        putButton (logDiv, "x", function(){
            logDiv.style.display = 'none';
        }, 'background-color: #a00; color:white; margin:0 32px 0 0; float:right');
    };

    // Activate popup blocker
    var activateBlocker = function() {
        window.open = fakeWindowOpen;
    };

    // ============================ LET'S RUN IT ================================

    // Function to remove popups from mp4upload.com and aniwave.to
    removePopupAds();

    var disabled = isCurrentDomainWhiteListed();
    if(disabled){
        console.log('[UPB] Current domain was found on a white list. UPB disabled.');
    }else{
        activateBlocker();
    }
})();