// ==UserScript==
// @name         Bypass Google Sorry (reCAPTCHA)
// @version      1.0.0
// @description  Redirect Google reCAPTCHA to new search
// @author       lord_ne (modified from script by Ang Li)
// @include      *://www.google.*/sorry/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/230713
// @downloadURL https://update.greasyfork.org/scripts/421597/Bypass%20Google%20Sorry%20%28reCAPTCHA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/421597/Bypass%20Google%20Sorry%20%28reCAPTCHA%29.meta.js
// ==/UserScript==

// Redirects Google Sorry page to a different search engine
// Original script: https://greasyfork.org/en/scripts/33226-bypass-google-sorry-recaptcha

function getParameterByName(name, url, decode) {
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    let results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    if (decode) {
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    } else {
        return results[2];
    }
}

(function() {
    'use strict';
    var searchEngineURL = "https://www.bing.com/search?q=";
    //var searchEngineURL = "https://duckduckgo.com/?q=";
    //var searchEngineURL = "https://search.yahoo.com/search?p=";
    //var searchEngineURL = "https://www.ecosia.org/search?q=";
    //var searchEngineURL = "https://www.lukol.com/s.php?q=";
    var googleSorryUrl = window.location.href;
    var targetDomain = getParameterByName('continue', googleSorryUrl, true);
    if(targetDomain.match("google")) {
        window.location.replace(searchEngineURL + getParameterByName('q', targetDomain, false));
    }
})();