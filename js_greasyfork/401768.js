// ==UserScript==
// @name        redirect gawker/go media sites to latest
// @namespace   Violentmonkey Scripts
// @match       *://*.gizmodo.com/*
// @match       *://*.jalopnik.com/*
// @match       *://*.jezebel.com/*
// @match       *://*.kotaku.com/*
// @match       *://*.lifehacker.com/*
// @match       *://*.deadspin.com/*
// @match       *://*.theroot.com/*
// @match       *://*.thetakeout.com/*
// @match       *://*.theonion.com/*
// @match       *://*.theinventory.com/*
// @match       *://*.kinja.com/*
// @match       *://*.avclub.com/*
// @grant       none
// @version     2020-01-01
// @author      jccalhoun
// @description redirects avclub.com to avclub.com/latest
// @downloadURL https://update.greasyfork.org/scripts/401768/redirect%20gawkergo%20media%20sites%20to%20latest.user.js
// @updateURL https://update.greasyfork.org/scripts/401768/redirect%20gawkergo%20media%20sites%20to%20latest.meta.js
// ==/UserScript==

for (var i = 0; i < 11; i++) {
        document.getElementsByClassName("js_topbar")[0].getElementsByTagName('a')[i].href += "latest";
    };
//the writing of this was aided by using the answers here: https://stackoverflow.com/questions/39899504/how-to-replace-a-link-text-using-javascript/39899712 and https://www.w3schools.com/jsref/prop_html_innerhtml.asp