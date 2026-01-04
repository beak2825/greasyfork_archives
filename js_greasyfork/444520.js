// ==UserScript==
// @name         Twitter to Nitter (Improved) - No Longer Maintained
// @namespace    https://greasyfork.org/
// @homepage     https://greasyfork.org/en/scripts/
// @version      1.5
// @description  Redirects twitter links to nitter
// @author       iralakaelah
// @author       Andy (andev.me)
// @match        *://*.twitter.com/*
// @icon         https://nitter.projectsegfau.lt/logo.png
// @grant        none
// @run-at       document-start
// @license      gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/444520/Twitter%20to%20Nitter%20%28Improved%29%20-%20No%20Longer%20Maintained.user.js
// @updateURL https://update.greasyfork.org/scripts/444520/Twitter%20to%20Nitter%20%28Improved%29%20-%20No%20Longer%20Maintained.meta.js
// ==/UserScript==

function test(url){
    return !!url.match(/^(|http(s?):\/\/)(|m.)(|mobile.)(|www.)twitter.com(\/.*|$)/gim);
}

function getNewPagePlease(url){
    return 'https://nitter.projectsegfau.lt' + url.split('twitter.com').pop();
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