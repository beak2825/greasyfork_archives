// ==UserScript==
// @name         Old Meneame
// @version      0.0.1
// @description  Converts meneame.net links to old.meneame.net links.
// @author       rob1
// @match        *://www.meneame.net/*
// @icon         https://www.google.com/s2/favicons?domain=www.meneame.net
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1098696
// @downloadURL https://update.greasyfork.org/scripts/468658/Old%20Meneame.user.js
// @updateURL https://update.greasyfork.org/scripts/468658/Old%20Meneame.meta.js
// ==/UserScript==

function test(url){
    return !!url.match(/^(|http(s?):\/\/)(|www.)meneame.net(\/.*|$)/gim);
}

function getNewPagePlease(url){
    return 'https://old.meneame.net' + url.split('meneame.net').pop();
}

function fixMeneameStuff(){
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

window.onload = fixMeneameStuff;
setInterval(fixMeneameStuff, 50);