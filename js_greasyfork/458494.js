// ==UserScript==
// @name         Old Wikipedia Layout
// @namespace    http://greasyfork.org/
// @version      0.1
// @description  Redirects Wikipedia to use the good (pre-2023) skin.
// @author       Sheer Anger
// @match        *://*.wikipedia.org/*
// @icon         https://www.google.com/s2/favicons?domain=www.wikipedia.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458494/Old%20Wikipedia%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/458494/Old%20Wikipedia%20Layout.meta.js
// ==/UserScript==

const skinchoice = 'vector';

function test(url){
    return !!url.match(/(?!.*useskin)^(|http(s?):\/\/)(|www\.|\w{2,6}\.)(|m\.)wikipedia.org(\/.*|$)/gim);
}

function getNewPage(url){
    var que = '?';
    if(url.includes("?")){que = '&'};
    return url.concat(que,"useskin=",skinchoice);
}

function fixWikiLinks(){
    var links = Array.prototype.slice.call(document.links, 0);
    links.filter(function(link){
        if(test(link.href)){
            var greatNewLink = getNewPage(link.href);
            if(link.hasAttribute('data-outbound-url')) link.setAttribute('data-outbound-url', greatNewLink);
            link.setAttribute('href', greatNewLink);
        }
    });
}

if(test(window.location.href)){window.location.assign(getNewPage(window.location.href));}

window.onload = fixWikiLinks;
setInterval(fixWikiLinks, 50);