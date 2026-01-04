// ==UserScript==
// @name WhatYouClickIsWhatYouGet
// @namespace whatyouclickiswhatyouget
// @author elypter
// @match *://*/*
// @grant none
// @version     3
// @description Userscript that removes all event listeners and replaces all data-outbound-url attrbutes from links
// @downloadURL https://update.greasyfork.org/scripts/36745/WhatYouClickIsWhatYouGet.user.js
// @updateURL https://update.greasyfork.org/scripts/36745/WhatYouClickIsWhatYouGet.meta.js
// ==/UserScript==

//Do you hate it when you hover over a link and it looks completely normal
//but when you click on it it takes you somewhere else or redirects you over some logging page?
//this script gets rid of all that fuckery so that what you click is what you get.
//Userscript that removes all event listeners and replaces all data-outbound-url attrbutes from links
//License: GPL3

//this script isnt particularly lean on performance but nothing to worry about. it took over 100ms on my over 10 year old laptop

var remove_all_listeners=false;

var suffixes=["yahoo.com","duckduckgo.com"]; //list of domains where all listeners are removed

if(remove_all_listeners)for(var i = 0; i < suffixes.length; i++) {
    var suffix=suffixes[i];
    if (window.location.hostname.substr(-suffix.length) == suffix){
        //removing listeners by adding one and then stopping others from running with stopPropagation()
        window.addEventListener("click", function (event) {
            event.stopPropagation();
        }, true);
        window.addEventListener("contextmenu", function (event) {
            event.stopPropagation();
        }, true);
        window.addEventListener("mousedown", function (event) {
            event.stopPropagation();
        }, true);
        window.addEventListener("onmouseup", function (event) {
            event.stopPropagation();
        }, true);
    }
}

var as = document.getElementsByTagName('a');
var a, actual_url;
for(var i = 0; i < as.length; i++) {
    a = as[i];

    //replace the data-outbound-url with the actual shown in the statusbar
    if(ValidURL(a.getAttribute('data-href-url'))&&ValidURL(a.getAttribute('data-outbound-url'))){
        actual_url = a.getAttribute('data-href-url');
        if(actual_url&&a.hostname!=location.hostname) a.setAttribute('data-outbound-url', actual_url); //not sure if a.hostname picks the right one
    }
    if(ValidURL(a.getAttribute('href'))&&ValidURL(a.getAttribute('data-outbound-url'))){
        actual_url = a.getAttribute('href');
        if(actual_url&&a.hostname!=location.hostname) a.setAttribute('data-outbound-url', actual_url);
    }

    if (a.hostname!=location.hostname){
        //removing listeners by cloning the element. listeners are supposedly not cloned with this method
        aClone = a.cloneNode(true);
        a.parentNode.replaceChild(aClone, a);

        //removing listeners by adding one and then stopping others from running with stopPropagation()
        a.addEventListener("click", function (event) {
            event.stopPropagation();
        }, true);
        a.addEventListener("contextmenu", function (event) {
            event.stopPropagation();
        }, true);
        a.addEventListener("mousedown", function (event) {
            event.stopPropagation();
        }, true);
        a.addEventListener("onmouseup", function (event) {
            event.stopPropagation();
        }, true);
    }
}

function ValidURL(url){
    if (url) if(url.indexOf('https://') == 0 || url.indexOf('http://') == 0);
    else return false;
}
