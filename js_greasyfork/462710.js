// ==UserScript==
// @name        UnDonate: Youtube
// @namespace   pwa
// @license MIT
// @match       https://*youtube.com/*
// @icon https://youtube.com/favicon.ico
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant       none
// @version     1.0
// @author      pwa
// @description 7/6/2022, 4:54:57 PM

// @downloadURL https://update.greasyfork.org/scripts/462710/UnDonate%3A%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/462710/UnDonate%3A%20Youtube.meta.js
// ==/UserScript==

var observer = new MutationObserver(resetTimer);
var timer = setTimeout(action, 3000, observer); // wait for the page to stay still for 3 seconds
observer.observe(document, {childList: true, subtree: true});

// reset timer every time something changes
function resetTimer(changes, observer) {
    clearTimeout(timer);
    timer = setTimeout(action, 3000, observer);
}

function action(observer) {
    observer.disconnect();

    console.log("unDonate >:)");
    elt = document.getElementById("donation-shelf");
    elt.hidden = true
    // code
}


observer.observe(document, {childList: true, attributes: true, characterData: true, subtree: true});
