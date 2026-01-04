// ==UserScript==
// @name         Twitter to Nitter
// @namespace    http://andev.me/
// @version      1.1
// @description  Converts twitter.com links to nitter.net links
// @author       Andy (andev.me)
// @match        *://*.twitter.com/*
// @icon         https://nitter.net/logo.png
// @grant        none
// @run-at       document-start
// @license      gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/437398/Twitter%20to%20Nitter.user.js
// @updateURL https://update.greasyfork.org/scripts/437398/Twitter%20to%20Nitter.meta.js
// ==/UserScript==

function test(url){
    return !!url.match(/^(|http(s?):\/\/)(|www.)twitter.com(\/.*|$)/gim);
}

function getNewPagePlease(url){
    return 'https://nitter.net' + url.split('twitter.com').pop();
}

function fixTwitterStuff(){
    var links = Array.prototype.slice.call(document.links, 0);
    links.filter(function(link){
        if(test(link.href)){
            var greatNewLink = getNewPagePlease(link.href);
            if(link.hasAttribute('data-outbound-url')) link.setAttribute('data-outbound-url', greatNewLink);
            link.setAttribute('href', greatNewLink);
        }
    });
}

if(test(window.location.href)){window.location.assign(getNewPagePlease(window.location.href));}

window.onload = fixTwitterStuff;
setInterval(fixTwitterStuff, 50);