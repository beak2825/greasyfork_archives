// ==UserScript==
// @name         iWubbz's Candy Animation for Toradorable Skin Changer
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Dabasaur  Animation for a Toradorable skin changer.
// @author       Toradorable
// @grant        none
// @require      https://greasyfork.org/scripts/24894-toradorable-animator/code/Toradorable%20Animator.js
// ==/UserScript==

// Add animation
animator.importSkinList(
    // First argument is a skin list array.
    // Below is iWubbz's candy skinList, all credit for thease images goes to them.
    // https://greasyfork.org/en/scripts/23677-iwubbz-candy-skin-changer/code
    ["http://i.imgur.com/1JQqUzR.png",
    "http://i.imgur.com/VKcEy4k.png",
    "http://i.imgur.com/FKsf0PC.png",
    "http://i.imgur.com/zg6Oxzo.png",
    "http://i.imgur.com/EPawa6H.png",
    "http://i.imgur.com/NyKl8tG.png"
    ],
    // Second argument is optional. However, I recomend setting title at the least.
    //defaultDisplayTime is 1000 (1 second) by default.
    //All frames will be displayed for defaultDisplayTime milliseconds.
    //Use animator.addAnimation if you want different display times per frame.
    {title: "iWubbz's Candy", defaultDisplayTime: 500}
);
// ^^ Importing skin lists is as easy as stealing candy from iWubbz. ^^
