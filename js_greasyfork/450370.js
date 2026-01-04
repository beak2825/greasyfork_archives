// ==UserScript==
// @name         XVideos Pornstar Reddit Search
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Creates a link on the Pornstar name which will do a reddit search on said pornstar
// @author       You
// @match        https://www.xvideos.com/pornstars/*
// @match        https://www.xvideos.com/models/*
// @match        https://www.xvideos.com/model-channels/*
// @match        https://www.xvideos.com/pornstar-channels/*
// @match        https://www.xvideos.com/amateur-channels/*
// @match        https://www.xvideos.com/amateurs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xvideos.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450370/XVideos%20Pornstar%20Reddit%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/450370/XVideos%20Pornstar%20Reddit%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var urlPattern = "https://new.reddit.com/search/?type=sr&q="

    var heading = document.querySelector('h2 > .text-danger');
    var headingWithLink = document.createElement('a');
    headingWithLink.href= urlPattern + heading.innerText
    headingWithLink.appendChild(heading.cloneNode(true));
    heading.replaceWith(headingWithLink);
})();