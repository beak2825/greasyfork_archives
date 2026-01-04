// ==UserScript==
// @name         Remove Promoted Tweets
// @namespace    https://github.com/jogerj
// @source       https://gist.github.com/jogerj/333221ea0b5e8e09a051c38a09150127
// @version      0.1
// @description  Remove promoted tweets on twitter.com
// @author       JogerJ
// @author       cb372
// @icon         https://abs.twimg.com/favicons/favicon.ico
// @grant        none
// @match        *://twitter.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447872/Remove%20Promoted%20Tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/447872/Remove%20Promoted%20Tweets.meta.js
// ==/UserScript==
var elems = document.getElementsByClassName('tweet')
for (var i=0; i < elems.length; i++) {
  var e = elems[i];
  if (e.nodeName.toLowerCase() == 'div' &&
    e.attributes['data-promoted'] &&
    e.attributes['data-promoted'].value == "true") {
    // Just hiding the elem doesn't work, as this is
    // not actually the elem that gets rendered to screen.
    // Twitter's script will later convert it into
    // another, visible, element.
    //e.style.display = 'none';
    e.parentNode.removeChild(e);
    console.debug('Deleted a promoted tweet', e);
  }
}