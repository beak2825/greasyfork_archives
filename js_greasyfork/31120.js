// ==UserScript==
// @name         Hide ReSteems
// @namespace    https://steemit.com/@alexpmorris
// @version      0.16
// @description  Button to Toggle ReSTEEMs from a User's steemit.com or golos.io Profile and Feed Pages
// @author       @alexpmorris
// @source       https://github.com/alexpmorris/HideResteems
// @match        https://steemit.com/*
// @match        https://golos.io/*
// @grant        none
// @require https://code.jquery.com/jquery-1.12.4.min.js
// @require https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @downloadURL https://update.greasyfork.org/scripts/31120/Hide%20ReSteems.user.js
// @updateURL https://update.greasyfork.org/scripts/31120/Hide%20ReSteems.meta.js
// ==/UserScript==

// to avoid conflicts if using "Hide Resteems" (HR) with "Steemit Post Vote Slider and Past Payout Monetizer" (SPVS),
// TamperMonkey *must load* HR first (ie. "Settings -> Position" should be lower for HR than for SPVS)!

(function() {
    'use strict';

    var isHiding = false;
    var lastPathStr = "";
    var lastQueryStr = "";
    var showResteemsBtnSrc = "";
    var hideResteemsBtnSrc = "";
    var validUrl = "";
    var totPosts = 0;
    var targetTag = "";

    function triggerRefresh(cnt) {
        if ((cnt===null) || (cnt !== totPosts)) {
            totPosts = cnt;
            lastPathStr="";
        }
    }
    
    function urlCheckFunction() {
        if (lastPathStr !== location.pathname || lastQueryStr !== location.search || 
            lastPathStr === null || lastQueryStr === null) {
            lastPathStr = location.pathname;
            lastQueryStr = location.search;
            addReSteemToggleBtn();
        }
    }
    
    var steemitURLCheckTimer = setInterval (function() { urlCheckFunction(); }, 250);

    waitForKeyElements ("#posts_list", domCreateHooks);
    
    function domCreateHooks() {
        //to capture ajax additions to feeds
        var elem = $("#posts_list").parent();
        $(elem).unbind('DOMSubtreeModified.hrs');
        $(elem).on('DOMSubtreeModified.hrs', "div", function () { 
            triggerRefresh($("#posts_list ul").length);
        });
        lastPathStr="";
    }

    function addReSteemToggleBtn() {
        validUrl = document.URL;
        if (validUrl.startsWith("https://s")) {
            validUrl = validUrl.replace("https://steemit.com/","");
            targetTag = ".articles__resteem";
        } else {
            validUrl = validUrl.replace("https://golos.io/","");
            targetTag = ".PostSummary__reblogged_by";
        }

        //language support for buttons
        var lang = localStorage.getItem("language");
        if ((lang === null) || (localStorage.getItem("language") == "en")) {
            showResteemsBtnSrc = "https://steemitimages.com/DQmaRcPxCKNV45aPVaWMbBkP7WvJatgkKqtih7ZCfVsLs4r/button_show-resteems.png";
            hideResteemsBtnSrc = "https://steemitimages.com/DQmQYXHkLv4A3h8pZ1ntQM1FTTT6knt5EaVUo7hdj2nNAcR/button_hide-resteems.png";
        } else {
            showResteemsBtnSrc = "https://steemitimages.com/DQmQeP7KVWpKvm3eNepS8HuwHri6BAJaa8XLYvsyXUWP8E6/button_show-resteems_ru.png";
            hideResteemsBtnSrc = "https://steemitimages.com/DQmVds1u5g4W1jRnLNtYDEK8Bnt8WaiA3ueg81HMY3fssav/button_hide-resteems_ru.png";
        }

        var userDiv = $("#posts_list");

        if ((userDiv.length) && (validUrl.startsWith("@")) && ((validUrl.indexOf("/")==-1) || (validUrl.endsWith("/feed"))) ) {

            if (!$("#rsButton").length) {
                var divData = '<button id="rsButton" type="button" style="width:120px; margin-bottom:10px; outline:none;"><img id="rsBtnImg" src="'+hideResteemsBtnSrc+'"></button>';
                $(userDiv).prepend(divData);
                var elem = $("#rsButton");
                $(elem).click(function (e) { toggleResteemsClick(e); });
                if (isHiding) { isHiding = false; $(elem).click(); }
            } else {
                if (isHiding) hidePosts();
            }

        } else {
            if (!$("#post_overlay").length) $("#rsButton").remove();
        }
    }

    function hidePosts() {
        if (validUrl.endsWith("/feed")) $(targetTag).parent('').hide(); else
            $(targetTag).filter(function () {return ($(".UserNames",this)[0] == null);}).parent('').hide();
    }
    
    function toggleResteemsClick(e) {
        if (!isHiding) {
            $("#rsBtnImg").attr('src', showResteemsBtnSrc);
            hidePosts();
        } else {
            $("#rsBtnImg").attr('src', hideResteemsBtnSrc);
            $(targetTag).parent('').show();
        }
        isHiding = !isHiding;
    }

})();