// ==UserScript==
// @name         Hide feeds
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide youtube and bilibili home page recommendations 90% (so you still have chance to know what's trending) of the time. Preventing the algorithm steal you time.
// @author       zplay
// @match        https://*.youtube.com/
// @require  https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @match       (https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)*
// @match      https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471243/Hide%20feeds.user.js
// @updateURL https://update.greasyfork.org/scripts/471243/Hide%20feeds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css,id) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.getElementById(id);
        if (!style){
            style = document.createElement('style');
        }
        style.id=id;
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }


    function removeElementById(elementId) {
        const element = document.getElementById(elementId);
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }


   function isYouTubeHomepage() {
        const youtubeHomepageRegex =/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/?$/;

        return youtubeHomepageRegex.test(window.location.href);
    }


    function runScript() {
        if (isYouTubeHomepage()){
            const hideFeed = `  #contents {   display: none !important;  }  `;
            addGlobalStyle(hideFeed,"yt-feed");
        }
        else
        {
            removeElementById("yt-feed");
        }
    }


    if(Math.random()>0.9){
        return;
    }
   waitForKeyElements ("div", runScript);
    runScript();

    const hideFeed = `  #related {   display: none !important;  }  `;
    addGlobalStyle(hideFeed,"yt-related");

    const hideBiliFeed = `  .feed2, .rec-list {   display: none !important;  }  `;
    addGlobalStyle(hideBiliFeed,"bili-feed");


    // Your code here...
})();