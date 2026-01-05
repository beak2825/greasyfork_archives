// ==UserScript==
// @name         Steamgifts Hide Joined Giveaways
// @namespace    http://your.homepage/
// @version      0.2
// @description  Automatically hides all giveaways on steamgifts.com that you've already joined
// @author       Zarnaik
// @match        http://www.steamgifts.com/
// @includes     http://www.steamgifts.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13897/Steamgifts%20Hide%20Joined%20Giveaways.user.js
// @updateURL https://update.greasyfork.org/scripts/13897/Steamgifts%20Hide%20Joined%20Giveaways.meta.js
// ==/UserScript==

var pinned = document.querySelector('div.pinned-giveaways__inner-wrap');
var node = document.querySelector("body > div.page__outer-wrap > div > div > div:nth-child(2) > div:nth-child(3)");
//console.log(node);
if (node === undefined | node.classList[0] !== undefined){var node = document.querySelector("body > div.page__outer-wrap > div > div > div:nth-child(2) > div:nth-child(2)");}
//If using some sort of autopager, the joined giveaways on following pages will be hidden as well.

//console.log(node);
var obtest = new MutationObserver(function(mutrec){
    var added = mutrec[0].addedNodes;
    for (var i = 0; i<added.length;i++)
        if (added[i].children[0].classList.contains('is-faded'))
            added[i].style.display = 'none';
});
obtest.observe(node,{attributes: true, childList: true, characterData: true});
if (pinned !== null) initClean(pinned);
initClean(node);

function initClean(giveaways){
    var init = giveaways.children;
    for (var i = 0; i < init.length; i++)
        if (init[i].children[0].classList.contains('is-faded'))
            init[i].style.display = 'none';
}