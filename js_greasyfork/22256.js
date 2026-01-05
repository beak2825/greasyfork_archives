// ==UserScript==
// @name        Unsurly
// @namespace   binoc.software.projects.userscript.unsurly
// @description Rewrites sur.ly links back to their original form
// @include     http://forum.palemoon.org/*
// @include     https://forum.palemoon.org/*
// @version     1.0b1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22256/Unsurly.user.js
// @updateURL https://update.greasyfork.org/scripts/22256/Unsurly.meta.js
// ==/UserScript==

// Polyfill ES6 string.prototype.includes
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }
    
    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

// Actual Script
function funcRewriteSurly() {
    var links, thisLink;
    links = document.evaluate("//a[@href]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    for (var i=0;i<links.snapshotLength;i++) {
        var thisLink = links.snapshotItem(i);
        
        if (thisLink.href.includes('outbound.palemoon.org')) {
            thisLink.href = thisLink.href.replace('outbound.palemoon.org/', '');
            thisLink.href = unescape(thisLink.href);
        }
        else if (thisLink.href.includes('sur.ly')) {
            thisLink.href = thisLink.href.replace('sur.ly/o/', '');
            thisLink.href = thisLink.href.replace('/AA010667', '');
            thisLink.href = unescape(thisLink.href);
        }
    }
}

window.onload = funcRewriteSurly;