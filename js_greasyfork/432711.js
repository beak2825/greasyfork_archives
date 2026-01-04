// ==UserScript==
// @name         Libreddit Converter
// @namespace    https://msd3.io/
// @version      1.0
// @description  Converts reddit.com links to libreddit.it links
// @author       Kain (ksir.pw), with additions by Scott (msd3.io)
// @match        *://*.reddit.com/*
// @icon         https://www.google.com/s2/favicons?domain=www.reddit.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/432711/Libreddit%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/432711/Libreddit%20Converter.meta.js
// ==/UserScript==

function test(url){
    return !!url.match(/^(|http(s?):\/\/)(.*\.)?reddit.com(\/.*|$)/gim);
}

function getNewPagePlease(url){
    return 'https://libredd.it' + url.split('reddit.com').pop();
}

if(test(window.location.href)){window.location.assign(getNewPagePlease(window.location.href));}