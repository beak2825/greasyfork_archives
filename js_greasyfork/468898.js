// ==UserScript==
// @name         KBin Redirect dev
// @namespace    http://herzberd.dev/
// @version      0.1.3
// @description  redirects Lemmy shortlinks to the appropriate page on KBin
// @author       @herzberd@kbin.social https://github.com/herzberd https://herzberd.dev/
// @match        https://*.kbin.social/*
// @match        https://*.fedia.io/*
// @match        https://*.karab.in/*
// @match        https://*.readit.buzz/*
// @match        https://*.open-source.social/*
// @match        https://*.forum.fail/*
// @match        https://*.fedi196.gay/*
// @match        https://*.kbin.cafe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// @grant        none
// @license      CC0 1.0 Universal
// @downloadURL https://update.greasyfork.org/scripts/468898/KBin%20Redirect%20dev.user.js
// @updateURL https://update.greasyfork.org/scripts/468898/KBin%20Redirect%20dev.meta.js
// ==/UserScript==

'use strict';
const bangPattern = /!([A-Za-z0-9_]+)@([A-Za-z0-9.-]+)\b/g
const cSlashPattern = /^\/c\/([A-Za-z0-9_]+)(@([A-Za-z0-9.-]+))?$/g;
const linkRegex = /^https?:\/\/([^/]+)\/c\/(\w+)$/;

var elements =  document.getElementsByTagName('a')
var mediaLinks = document.getElementsByClassName('kbin-media-link')

for (var i = 0; i < elements.length; i++) {
    const matches = [...elements[i].innerText.matchAll(bangPattern)]
    const cSlashMatches = [...elements[i].innerText.matchAll(cSlashPattern)]
    if (matches.length > 0) {
        matches.forEach((match) => {
            const topic = match[1]
            const domain = match[2]
            elements[i].href = '/m/' + topic + '@' + domain
        })
    }
    else if (cSlashMatches.length > 0) {
        cSlashMatches.forEach((match) => {
            const topic = match[1]
            const domain = match[2]
            elements[i].href = '/m/' + topic + '@' + domain
        })
    }
}


console.log("CHECK FOR EXISTING LINKS")
// if already linked, match
for(var j = 0; j < mediaLinks.length; j++){
    const checkHref = mediaLinks[j].href
    const newMatch = checkHref.match(linkRegex)
    if(newMatch && newMatch.length > 0){
        const newLink = "/m/" + newMatch[2] + "@" + newMatch[1]
        mediaLinks[j].href = newLink
    }
}