// ==UserScript==
// @name         Scroll to dead YT Videos
// @namespace    SomeYoutubeFan
// @version      0.0.1
// @description  In order to quickly find YT videos that are dead in discord, scroll up to them
// @author       Some youtube fan
// @license MIT
// @match        https://discord.com/channels/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484468/Scroll%20to%20dead%20YT%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/484468/Scroll%20to%20dead%20YT%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var foundDead = false
    var lastLiveDiv

    function divIsLive(contentDiv) {

        var live = false;

        contentDiv.querySelectorAll("img.embedVideoImageComponentInner__6c3d8").forEach(videoDiv => {
            live = true;
        });

        // Already marked dead?
        if(!live) {
            var markedDead = false;
            var markedZombie = false
            contentDiv.querySelectorAll("img").forEach(imgDiv => {
                if(imgDiv.alt == "dead_link") {
                    markedDead = true;
                }
                if(imgDiv.alt == "🧟") {
                    markedZombie = true;
                }
            });

            if(markedDead && markedZombie) {
                live = true;
            }
        }

        // Not a valid youtube preview?
        if(!live) {
            var hasArticle = false
            contentDiv.querySelectorAll("article").forEach(articleDiv => {
                hasArticle = true;
            });
            if(!hasArticle) {
                live = true
            }
        }

        return live
    }

	// Periodically scroll up to the most recent dead video (or to the top, if nothing is dead)
	const interval = setInterval(() => {
        var divCount = 0;
        var LastLiveDiv = null;
        var scrollDiv = document.querySelector("div.managedReactiveScroller__79923")
        var scrollToTop = null;
        var scrollToDead = null;
        var deadDiv = null;
        document.querySelectorAll("li.messageListItem__6a4fb").forEach(contentDiv => {
            divCount++;

            console.log("divCount: " + divCount);

            if(divIsLive(contentDiv)) {

                if(scrollToTop === null) {
                    scrollToTop = contentDiv.offsetTop;
                }
                if(contentDiv.style.visibility != 'hidden') {
                    lastLiveDiv = contentDiv;
                }
            } else {
                lastLiveDiv = null;
                scrollToDead = contentDiv.offsetTop;
                deadDiv = contentDiv;
            }

       });


        console.log("scrollToDead: " + scrollToDead);
        console.log("scrollToTop: " + scrollToTop);
        console.log("scrollDiv.scrollTop: " + scrollDiv.scrollTop);
        if(scrollToDead) {
            if(scrollDiv.scrollTop > scrollToDead - 100) {
                scrollDiv.scrollTop = scrollToDead - 100;

            }
        } else if(scrollToTop) {
            if(scrollDiv.scrollTop > scrollToTop - 100) {
                scrollDiv.scrollTop = scrollToTop - 100;
            }
        }
        console.log("scrollDiv.scrollTop2: " + scrollDiv.scrollTop);
	}, 1000);
})();