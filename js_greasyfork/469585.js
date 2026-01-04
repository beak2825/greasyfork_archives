// ==UserScript==
// @name         KBin.social add community link + name to entry meta
// @namespace    https://kbin.social/
// @version      0.1
// @description  Says it right in the title
// @author       H2SO4
// @match        https://kbin.social/*
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/469585/KBinsocial%20add%20community%20link%20%2B%20name%20to%20entry%20meta.user.js
// @updateURL https://update.greasyfork.org/scripts/469585/KBinsocial%20add%20community%20link%20%2B%20name%20to%20entry%20meta.meta.js
// ==/UserScript==
     
(function() {
    'use strict';
    let link = document.querySelector("#options .options__main li:first-child a");
    if(link && link.href) {
        let community = link.href.match(/\/m\/([a-zA-Z@\.]+)/);
        if(community) {
            community = community[1];
            let communityLink = document.createElement("a");
            communityLink.href = "/m/"+community;
            communityLink.innerText = " to " + community;
            document.querySelector("#content .entry__meta").append(communityLink);
        }
    }
})();

