// ==UserScript==
// @name        _Domain force top gallery
// @namespace   _pc
// @run-at      document-start
// @version     0.1
// @description Forces domain to use it's new gallery on all listings
// @match       *://*.domain.com.au/*
// @downloadURL https://update.greasyfork.org/scripts/11902/_Domain%20force%20top%20gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/11902/_Domain%20force%20top%20gallery.meta.js
// ==/UserScript==

function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

var oldUrlPath  = window.location.pathname;
var urlSearch  = window.location.search;
var validPaths =  ["for-rent", "for-sale", "for-share"];
var path = oldUrlPath.match(/\/(.*?)\//)

if (path)
{
    var found = inArray(path, validPaths) > -1;
}

if (!(/(\?topspot=1)+/.test (urlSearch)) && found ) {

    var newURL  = window.location.protocol + "//"
                + window.location.host
                + oldUrlPath + "?topspot=1"
                + window.location.hash
                ;
    window.location.replace (newURL);
}


