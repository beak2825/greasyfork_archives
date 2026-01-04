// ==UserScript==
// @name     YouTube Fuck Autoplay
// @description Hey YouTube, I'm the one to say what I watch. Fuck you.
// @include  https://www.youtube.com/*
// @version  2
// @grant    none
// @noframes
// @namespace https://greasyfork.org/en/users/175405-anao9aaw/wtf2
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440977/YouTube%20Fuck%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/440977/YouTube%20Fuck%20Autoplay.meta.js
// ==/UserScript==

function turnOffAutoplay() {
    var l = document.getElementsByClassName("ytp-button");
    var l2 = Array.from(l).filter(e => {return e.dataset.tooltipTargetId == "ytp-autonav-toggle-button";});
    console.log(`Seeing ${l2.length} elements: ${l2}`);
    var e = l2[0];
    console.log(e.title);
    if (e.title.endsWith("on")) {
        e.click();
        console.log(e.title);
    }
}
setInterval(turnOffAutoplay, 30 * 1000); // 30 seconds
// Can't use setTimeout because apparently the UI doesn't work while the tab isn't active. Ugh!
