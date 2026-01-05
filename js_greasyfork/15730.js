// ==UserScript==
// @name        Duck Hide Sites
// @namespace   IzzySoft
// @description Hide specific sites from DuckDuckGo search results
// @include     https://duckduckgo.com/*
// @include     http://duckduckgo.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15730/Duck%20Hide%20Sites.user.js
// @updateURL https://update.greasyfork.org/scripts/15730/Duck%20Hide%20Sites.meta.js
// ==/UserScript==
// For our eventListener, FF complains "Use of Mutation Events is deprecated. Use MutationObserver instead." So alternatively:
// For Ajax reloads (paging), see solution at [Fire Greasemonkey script on AJAX request](http://stackoverflow.com/q/8281441/2533433)
// and [waitForKeyElements](https://greasyfork.org/en/scripts/6250-waitforkeyelements) (JQuery required)

var unwanted = ['experts-exchange.com'];
var unwantedWild = [];
var debug = false;

function getElementsByXpath(path, doc=document, ptype=XPathResult.ORDERED_NODE_SNAPSHOT_TYPE) {
  return document.evaluate(path,doc,null,ptype,null)
}
function dlog(msg) {
  if (debug) console.log(msg);
}

function hideResults() {
  var res = getElementsByXpath('//div[contains(@class,"results_links_deep")]',document);
  if (res.snapshotLength > 0) for ( i=0; i < res.snapshotLength; i++ ) {
    var link = getElementsByXpath('//a[@class="result__a"]',res.snapshotItem(i));
    if (link.snapshotLength>0) {
      if ( unwanted.indexOf(link.snapshotItem(i).hostname) > -1 ) {
        dlog('Removed result for: '+link.snapshotItem(i).hostname + ' ('+link.snapshotItem(i).getAttribute('href')+')');
        res.snapshotItem(i).style.display = 'none';
      }
      if (unwantedWild.length>0) for (var wild in unwantedWild) {
        var reg = new RegExp(unwantedWild[wild],'i');
        if ( link.snapshotItem(i).hostname.match(reg) ) {
          dlog('Removed wild result ('+unwantedWild[wild]+') for: '+link.snapshotItem(i).hostname + ' ('+link.snapshotItem(i).getAttribute('href')+')');
          res.snapshotItem(i).style.display = 'none';
        }
      }
    }
  }
}

//window.addEventListener('load', hideResults, false); // only run when page is loaded completely
document.addEventListener("DOMNodeInserted", hideResults, false); // Works on initial and additional (paged) results, as both are loaded via Ajax
