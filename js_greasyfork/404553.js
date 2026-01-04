// ==UserScript==
// @name         Nitter, Please!
// @namespace    https://twitter.com/aloneunix
// @version      1.0
// @description  Converts twitter.com links to nitter.net links. A fork of the script Nitter, Please! (Mobile) (https://greasyfork.org/en/scripts/403784-nitter-please-mobile)
// @author       aloneunix
// @match        twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=www.nitter.net
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/404553/Nitter%2C%20Please%21.user.js
// @updateURL https://update.greasyfork.org/scripts/404553/Nitter%2C%20Please%21.meta.js
// ==/UserScript==

function test(url){
    return !!url.match(/^(|http(s?):\/\/)(|www.)twitter.com(\/.*|$)/gim);
}

function getNewPagePlease(url){
    return 'https://nitter.net' + url.split('twitter.com').pop();
}

if(test(window.location.href)){window.location.assign(getNewPagePlease(window.location.href));}