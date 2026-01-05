// ==UserScript==
// @name         Egyptian Egg
// @namespace    https://www.facebook.com/EgyptianEgg
// @version      0.1
// @description  hq hq hq hq
// @author       Kippykip
// @match        https://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17972/Egyptian%20Egg.user.js
// @updateURL https://update.greasyfork.org/scripts/17972/Egyptian%20Egg.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

//Replace the images and... that's it.
addGlobalStyle('._2p7a.anger{background-image:url(http://i.imgur.com/yGyPdu2.png) !important;background-repeat:no-repeat;background-size:auto;background-position:-17px -116px}');
addGlobalStyle('._2p79.anger{background-image:url(http://i.imgur.com/yGyPdu2.png) !important;background-repeat:no-repeat;background-size:auto;background-position:0 -218px}');

addGlobalStyle('._2p7a.sorry{background-image:url(http://i.imgur.com/yGyPdu2.png) !important;background-repeat:no-repeat;background-size:auto;background-position:-17px -168px}');
addGlobalStyle('._2p79.sorry{background-image:url(http://i.imgur.com/yGyPdu2.png) !important;background-repeat:no-repeat;background-size:auto;background-position:0 -261px}');

addGlobalStyle('._2p7a.wow{background-image:url(http://i.imgur.com/yGyPdu2.png) !important;background-repeat:no-repeat;background-size:auto;background-position:-16px -184px}');
addGlobalStyle('._2p79.wow{background-image:url(http://i.imgur.com/yGyPdu2.png) !important;background-repeat:no-repeat;background-size:auto;background-position:0 -275px}');

addGlobalStyle('._2p7a.haha{background-image:url(http://i.imgur.com/yGyPdu2.png) !important;background-repeat:no-repeat;background-size:auto;background-position:-0x -151px}');
addGlobalStyle('._2p79.haha{background-image:url(http://i.imgur.com/yGyPdu2.png) !important;background-repeat:no-repeat;background-size:auto;background-position:14 -232px}');

addGlobalStyle('._2p7a.love{background-image:url(http://i.imgur.com/yGyPdu2.png) !important;background-repeat:no-repeat;background-size:auto;background-position:-1x -168px}');
addGlobalStyle('._2p79.love{background-image:url(http://i.imgur.com/yGyPdu2.png) !important;background-repeat:no-repeat;background-size:auto;background-position:15 -247px}');

addGlobalStyle('._2p7a.like{background-image:url(http://i.imgur.com/yGyPdu2.png) !important;background-repeat:no-repeat;background-size:auto;background-position:-17x -133px}');
addGlobalStyle('._2p79.like{background-image:url(http://i.imgur.com/yGyPdu2.png) !important;background-repeat:no-repeat;background-size:auto;background-position:17 -151px}');
addGlobalStyle('._2p79.like{background-image:url(http://i.imgur.com/yGyPdu2.png) !important;background-repeat:no-repeat;background-size:auto;background-position:0 -233px}');
addGlobalStyle('._2p79.like{background-image:url(http://i.imgur.com/yGyPdu2.png) !important;background-repeat:no-repeat;background-size:auto;background-position:0 -247px}');
addGlobalStyle('._2p79.like{background-image:url(http://i.imgur.com/yGyPdu2.png) !important;background-repeat:no-repeat;background-size:auto;background-position:14 -261px}');


addGlobalStyle('._iuz{background-image:url(http://store2.up-00.com/2016-03/145794249250311.png) !important;background-repeat:no-repeat}');