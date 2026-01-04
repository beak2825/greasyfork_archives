// ==UserScript==
// @name        Hovering Bird
// @namespace   http://tantusar.github.io
// @include     https://twitter.com/*
// @include     https://tweetdeck.com/*
// @version     2
// @grant       none
// @description Makes Twitter alt tags appear as tooltips.
// @downloadURL https://update.greasyfork.org/scripts/412500/Hovering%20Bird.user.js
// @updateURL https://update.greasyfork.org/scripts/412500/Hovering%20Bird.meta.js
// ==/UserScript==

var targetNode = document;

var config = { childList: true, subtree: true };

var callback = function(mutationsList) {
    document.querySelectorAll("img").forEach(img => {
        if(img.alt && img.alt != "Image"){
            img.setAttribute("title", img.alt);
        }
    });
};

var observer = new MutationObserver(callback);

observer.observe(targetNode, config);