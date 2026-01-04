// ==UserScript==
// @name         Bypass Google Sorry (reCAPTCHA)
// @namespace    http://angli.io/
// @version      0.4
// @description  Redirect Google reCAPTCHA to new search
// @author       Ang Li
// @include      *://ipv4.google.*/sorry/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/33226/Bypass%20Google%20Sorry%20%28reCAPTCHA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/33226/Bypass%20Google%20Sorry%20%28reCAPTCHA%29.meta.js
// ==/UserScript==

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getRandomGoogleURL() {
    var newURL;
    var n = Math.floor(Math.random()*3);
    switch(n) {
        case 0:
            newURL = "https://www.google.co.jp/search?q=";
            break;
        case 1:
            newURL = "https://www.google.com.tw/search?q=";
            break;
        default:
            newURL = "https://www.google.com.hk/search?q=";
            break;
    }
    return newURL;
}

(function() {
    'use strict';
    var googleSorryUrl = decodeURIComponent(window.location.href);
    var targetDomain = getParameterByName('continue', googleSorryUrl);
    if(targetDomain.match("google")){
        window.location.replace(getRandomGoogleURL() + getParameterByName('q', googleSorryUrl));
    }
})();