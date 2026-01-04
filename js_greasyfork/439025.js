// ==UserScript==
// @name     RARBG Pagination Arrows
// @namespace DaBaldEagul
// @description Allows the usage of ← and → arrow keys to navigate between pages.
// @grant    none
// @license  MIT
// @match    *://rarbg.to/torrents.php*
// @match    *://rarbg2018.org/torrents.php*    
// @match    *://rarbg2019.org/torrents.php*    
// @match    *://rarbg2020.org/torrents.php*    
// @match    *://rarbg2021.org/torrents.php*    
// @match    *://rarbgaccess.org/torrents.php*  
// @match    *://rarbgaccessed.org/torrents.php*
// @match    *://rarbgcdn.org/torrents.php*     
// @match    *://rarbgcore.org/torrents.php*    
// @match    *://rarbgdata.org/torrents.php*    
// @match    *://rarbgenter.org/torrents.php*   
// @match    *://rarbgget.org/torrents.php*     
// @match    *://rarbggo.org/torrents.php*      
// @match    *://rarbgindex.org/torrents.php*
// @match    *://rarbgmirror.org/torrents.php*
// @match    *://rarbgmirrored.org/torrents.php*
// @match    *://rarbgp2p.org/torrents.php*
// @match    *://rarbgproxied.org/torrents.php*
// @match    *://rarbgproxies.org/torrents.php*
// @match    *://rarbgproxy.org/torrents.php*
// @match    *://rarbgprx.org/torrents.php*
// @match    *://rarbgto.org/torrents.php*
// @match    *://rarbgtor.org/torrents.php*
// @match    *://rarbgtorrents.org/torrents.php*
// @match    *://rarbgunblock.org/torrents.php*
// @match    *://rarbgunblocked.org/torrents.php*
// @match    *://rarbgway.org/torrents.php*
// @match    *://rarbgweb.org/torrents.php*
// @match    *://proxyrarbg.org/torrents.php*
// @match    *://unblockedrarbg.org/torrents.php*
// @match    *://rarbg.com/torrents.php*
// @match    *://rarbgmirror.com/torrents.php*
// @match    *://rarbgproxy.com/torrents.php*
// @match    *://rarbgunblock.com/torrents.php*
// @version 0.0.1.20220123201843
// @downloadURL https://update.greasyfork.org/scripts/439025/RARBG%20Pagination%20Arrows.user.js
// @updateURL https://update.greasyfork.org/scripts/439025/RARBG%20Pagination%20Arrows.meta.js
// ==/UserScript==

function getPreviousLink() {
    for(i=0;i<document.links.length;i++){
        if(document.links[i].title == 'previous page') {
            return document.links[i]
         }
    }
}
function getNextLink() {
    for(i=0;i<document.links.length;i++){
        if(document.links[i].title == 'next page') {
            return document.links[i]
         }
    }
}

document.onkeydown = checkKey;

var prevlink = false;
var nextlink = false;

if(getPreviousLink()) {
    prevlink = getPreviousLink().href;
}
if(getNextLink()) {
    nextlink = getNextLink().href;
}

function checkKey(e) {
  e = e || window.event;

  if (document.activeElement.toString().search(/(Input|TextArea)/) < 0) {
    if (e.keyCode == '37') {
      if (prevlink)
        location.href = prevlink;
    }
    else if (e.keyCode == '39') {
      if (nextlink)
        location.href = nextlink;
    }
  }
}