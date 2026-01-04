// ==UserScript==
// @name         [DEPRECATED] lol just redirect to nitter
// @namespace    https://git.froggi.es/tom/redirect-to-nitter-n-shit/
// @namespace    https://greasyfork.org/en/scripts/448085-lol-just-redirect-to-nitter
// @version      0.10211
// @license      GNU GPLv3
// @description  Nitter is basically dead. This essentially redirects to a dead site now, making this script essentially pointless. Thanks, Elon.
// @author       tom
// @match        https://twitter.com/*
// @icon         https://git.froggi.es/tom/redirect-to-nitter-n-shit/raw/branch/main/icon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448085/%5BDEPRECATED%5D%20lol%20just%20redirect%20to%20nitter.user.js
// @updateURL https://update.greasyfork.org/scripts/448085/%5BDEPRECATED%5D%20lol%20just%20redirect%20to%20nitter.meta.js
// ==/UserScript==
// Settings
 
let timelineRedirect = true; // Redirect on main home page/timeline? true/false (script's still a wip so getting redirected to nitter by clicking on a tweet on the twitter timeline isn't programmed in yet. true by default until then.)
let nitterInstance = "https://nitter.ca/"; // (PLEASE INCLUDE "https://" AT THE START OF THE DOMAIN AND "/" AT THE END) | What Nitter instance you'd like to be redirected to. Using ".ca" as default because it's the best instance I personally know, I also recommend "twiit.com", which selects an instance that's running well and isn't rate-limited.
 
//
 
// console.log("is this even loading");
 
let href = document.location.href;
var ofm = href.split("/");
 
for (var i = 0; i < 2; i++) {
    ofm.shift();
}
 
// console.log(ofm);
 
var goTo = nitterInstance;
 
if (ofm[1] == "home" || ofm[1] == "" || ofm[1] == "i") {
    console.log("j");
    if (timelineRedirect == false) {
        goTo = "false";
    }
} else {
    for (var m = 1; m < ofm.length; m++) {
        goTo += ofm[m] + "/";
    }
}
 
if (goTo == "false") {
    // console.log("no");
} else {
    // console.info("this was supposed to redirect to " + goTo);
    document.location = goTo;
}