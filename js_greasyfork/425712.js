// ==UserScript==
// @name         Old Mobile Reddit Please!
// @namespace    http://example.com/
// @version      1.0
// @description  Converts reddit.com links to i.reddit.com links
// @author       jXBtyqBwV1TgEFhJ8I4W
// @match        *://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?domain=www.reddit.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/425712/Old%20Mobile%20Reddit%20Please%21.user.js
// @updateURL https://update.greasyfork.org/scripts/425712/Old%20Mobile%20Reddit%20Please%21.meta.js
// ==/UserScript==

function test(url){
    return !!url.match(/^(|http(s?):\/\/)(|www.)reddit.com(\/.*|$)/gim);
}

function getNewPagePlease(url){
    return 'https://i.reddit.com' + url.split('reddit.com').pop();
}

function fixRedditStuff(){
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

window.onload = fixRedditStuff;
setInterval(fixRedditStuff, 50);