// ==UserScript==
// @name            Better Reddit Spoiler
// @version         0.3
// @description     Improved spoiler formatting for Reddit
// @author          Drazen Bjelovuk
// @match           *://www.reddit.com/*/comments/*
// @grant           none
// @run-at          document-end
// @namespace       https://greasyfork.org/users/11679
// @contributionURL https://goo.gl/dYIygm
// @downloadURL https://update.greasyfork.org/scripts/23803/Better%20Reddit%20Spoiler.user.js
// @updateURL https://update.greasyfork.org/scripts/23803/Better%20Reddit%20Spoiler.meta.js
// ==/UserScript==

var anchors = document.getElementsByTagName('a');
for (var i = 0; i < anchors.length; i++) {
    var anchor = anchors[i];
    if (anchor.href === 'https://www.reddit.com/s' || anchor.href === 'https://www.reddit.com/spoiler') {
        var spoiler = document.createElement('span');
        spoiler.innerHTML = anchor.title || anchor.textContent;
        spoiler.style.backgroundColor = '#222222';
        spoiler.onmouseover = function() { this.style.backgroundColor = 'white'; };
        spoiler.onmouseout  = function() { this.style.backgroundColor = '#222222'; };
        anchor.parentNode.replaceChild(spoiler, anchor);
    }
}