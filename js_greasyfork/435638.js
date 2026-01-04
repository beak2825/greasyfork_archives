// ==UserScript==
// @name         Nitter Please!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Converts twitter.com links to nitter.42l.fr links (fork of Old Reddit Please!) 
// @author       OJ7
// @match        *://*.twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=www.twitter.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/435638/Nitter%20Please%21.user.js
// @updateURL https://update.greasyfork.org/scripts/435638/Nitter%20Please%21.meta.js
// ==/UserScript==

function test(url){
    return !!url.match(/^(|http(s?):\/\/)(|www.)twitter.com(\/.*|$)/gim);
}

function getNewPagePlease(url){
    return 'https://nitter.42l.fr' + url.split('twitter.com').pop();
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

// window.onload = fixTwitterStuff;
// setInterval(fixTwitterStuff, 50);