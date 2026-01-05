// ==UserScript==
// @name        AmazonSmile Redirect
// @icon        http://i.imgur.com/HKxjaKP.jpg
// @namespace   skoshy.com
// @author      Stefan Koshy
// @description Redirect to AmazonSmile
// @include     http://*.amazon.com/*
// @version     0.6
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21721/AmazonSmile%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/21721/AmazonSmile%20Redirect.meta.js
// ==/UserScript==
 
var url = window.location.host;
 
if (url.match("smile.amazon") == null) {
    url = window.location.href;
    if  (url.match("//www.") != null){
        url = url.replace("//www.", "//smile.");
    } else if (url.match("//amazon.") != null){
        url = url.replace("//amazon.", "//smile.amazon.");
    }
    window.location.replace(url);
}