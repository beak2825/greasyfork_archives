// ==UserScript==
// @name          Reddit Reveal
// @author        buddydvd
// @description   Reveal hidden information on reddit
// @namespace      Reddit Revealer
// @include        http://www.reddit.com/*
// @include        http://www.baconbuzz.com/*
// @include        http://reddit.destructoid.com/*
// @include        http://www.thecutelist.com/*
// @include        http://reddit.independent.co.uk/*
// @include        http://www.redditgadgetguide.com/*
// @include        http://www.weheartgossip.com/*
// @include        http://www.idealistnews.com/*
// @include        https://www.reddit.com/*
// @include        https://www.baconbuzz.com/*
// @include        https://reddit.destructoid.com/*
// @include        https://www.thecutelist.com/*
// @include        https://reddit.independent.co.uk/*
// @include        https://www.redditgadgetguide.com/*
// @include        https://www.weheartgossip.com/*
// @include        https://www.idealistnews.com/*
// @version        1.1
// @downloadURL https://update.greasyfork.org/scripts/1501/Reddit%20Reveal.user.js
// @updateURL https://update.greasyfork.org/scripts/1501/Reddit%20Reveal.meta.js
// ==/UserScript==

function reveal() {
 
  
  }
  
  
(function () {
        var s = document.createElement('script');
        s.textContent = "(" + reveal.toString() + ')();';
        document.head.appendChild(s);
})();
