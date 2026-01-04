// ==UserScript==
// @name     Twitch - Clean up GUI
// @description Hides multiple distracting controllers on twitch.tv
// @version  1.0.2
// @grant    none
// @include	*://twitch.tv/*
// @include	*://*.twitch.tv/*
// @author	@sverigevader
// @namespace https://greasyfork.org/en/users/692021-sverigevader
// @downloadURL https://update.greasyfork.org/scripts/429771/Twitch%20-%20Clean%20up%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/429771/Twitch%20-%20Clean%20up%20GUI.meta.js
// ==/UserScript==

window.setTimeout(
    function check() {
        const recommendedChannelsName = '[aria-label="Recommended Channels"]';
        const primeRewardsName = '.sc-AxjAm.iJZwey.top-nav__prime';
        const getBits = '.sc-AxiKw.jbTKml.top-nav__prime';

        SetInnerHtmlEmptyString(recommendedChannelsName);
        SetInnerHtmlEmptyString(primeRewardsName);
        SetInnerHtmlEmptyString(getBits);
        window.setTimeout(check, 250);
    }, 250
);
    
function SetInnerHtmlEmptyString(elementName) {
    var node = document.querySelector(elementName);
    if(node) {     
        node.innerHTML = "";
    }
}   