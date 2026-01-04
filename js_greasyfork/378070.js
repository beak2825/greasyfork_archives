// ==UserScript==
// @name         AdBlock for Facebook
// @namespace    fb-adblock
// @version      1.6
// @description  Block / Hide "Sponsored" posts on Facebook
// @author       Thor Lancaster
// @match        https://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378070/AdBlock%20for%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/378070/AdBlock%20for%20Facebook.meta.js
// ==/UserScript==

// Add abDbg=true as a URL parameter to debug ad classification

(function() {
    'use strict';
    var initialWait = 1500;
    setTimeout(function(){
    if(document.getElementById("stream_pagelet") == null){
        console.log("AdBlock for Facebook currently only works on news feeds. Aborting.");
        return;
    }
    console.log("AdBlock for Facebook running");
    document.abDbg = window.location.href.includes("abDbg=true");
    document.abCheckAll = false; // If true, check every post every time. Comsumes more CPU
    document.abTestCheck = null; // Set to an element for debugging to determine if this script thinks it's an ad
    var el = (document.getElementById("stream_pagelet"));
    var feed = el.querySelectorAll('[role="feed"]')[0];
    setInterval(function(f){
        try{
            checkAds(f);
            if(document.abTestCheck != null){ // Check test element to determine whether it is an article and/or an and
                var el = document.abTestCheck;
                document.abTestCheck = null;
                if(!el.getAttribute("role") == "article"){
                    console.log("Element is not an article");
                }
                if(isAd(el)){
                    console.log("Element is an ad");
                } else {
                    console.log("Element is not an ad");
                }
            }
        } catch(e){ // Log error before it is swallowed by FB's obfusicated debugging maw
            console.error(e);
        }
    }, 2000, document);
    // TODO check for ads when feed updates rather than every 2 seconds
    }, initialWait);

    function checkAds(feed){
        document.lastABRun = new Date().getTime();
        var posts = feed.querySelectorAll('[role="article"]');
        for(var x = 0; x < posts.length; x++){
            var post = posts[x];
            // Calculate a quick checksum so that if text changes, the post will be re-scanned
            // I suspect that FB was creating non-ad posts and inserting them after a delay
            // To spoof the previous version of this script
            if(!post.abCheckSum || post.abCheckSum != abCheckSum(post) || document.abCheckAll){
                post.abCheckSum = abCheckSum(post);
                var isAdType = isAd(post);
                if(isAdType == 1){
                    if(document.abDbg){
                        markPost(post, "#F70");
                    } else {
                        removePost(post);
                    }
                }
                // Blank post, should never happen
                else if(isAdType == -1){
                    //console.log("ABCHECK blank post");
                }
                else if(isAdType == 0 && document.abDbg){
                    markPost(post, "#0F7"); // for debugging
                }
            }
        }
    }
    // Color a FB post for debugging purposes
    function markPost(post, color){
        var els = post.querySelectorAll("*");
        for(var x = 0; x < els.length; x++){
            els[x].style.background = color;
        }
    }
    function removePost(post){
        post.parentElement.removeChild(post);
        //post.style.height = "0px";
        //post.style.opacity = "0";
    }
    function isAd(post){
        if(post.getAttribute("aria-label") == "Comment"){ // Don't scan comments for ads
            return 0;
        }
        var scan = post.innerText.substring(0, 128);
        if(scan.length == 0){
            return -1; // Blank post
        }
        if(scan.includes("·")){
            var start = scan.substring(0, scan.indexOf("·"));
            if(isSpnsrd(start)){
                //console.log("IS AN AD");
                return 1;
            }
        }
        //console.log("IS NOT AN AD");
        return 0;
    }
    // Scan for a string that represents "Sponsored"
    var SPONSORED = "Sponsored";
    function isSpnsrd(str){
        var spPtr = 0;
        for(var x = 0; x < str.length; x++){
            var chr = str[x];
            if(chr == SPONSORED[spPtr]){
                spPtr++;
                if(spPtr == SPONSORED.length){
                    return true;
                }
            } else {
                var toReset = true;
                if(chr == "\n"){
                    toReset = false;
                } else{
                    for(var y = spPtr; y >= 0; y--){
                        if(chr == SPONSORED[y]){
                            toReset = false;
                        }
                    }
                }
                if(toReset){
                    spPtr = 0;
                }
            }
        }
        return false;
    }

    // Calculate the checksum of an element through it's innerText
    function abCheckSum(el){
        return checkSum(el.innerText);
    }

    // Fast Checksum algorithm. Works great, open-source
    // See https://stackoverflow.com/questions/811195/fast-open-source-checksum-for-small-strings
    function checkSum(s)
    {
        var chk = 0x12345678;
        var len = s.length;
        for (var i = 0; i < len; i++) {
            chk += (s.charCodeAt(i) * (i + 1));
        }
        return (chk & 0xffffffff).toString(16);
    }
})();