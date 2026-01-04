// ==UserScript==
// @name         YouTube outgoing external hyper links fixer
// @version      1.0.0
// @description  Replaces Leave YouTube Warning Links with just the link
// @author       bigguy
// @match        https://www.youtube.com/*
// @grant        none
// @license      GPLv3+
// @namespace https://greasyfork.org/users/771007
// @downloadURL https://update.greasyfork.org/scripts/443800/YouTube%20outgoing%20external%20hyper%20links%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/443800/YouTube%20outgoing%20external%20hyper%20links%20fixer.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // from https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function replaceLinks(ms=3000) {
    console.log('replacing bad youtube links')
    await sleep(ms); // bit of a hack: seems we need to wait for YouTube to do its stuff before we act
    let outgoing_links = document.querySelectorAll('a[href^="https://www.youtube.com/redirect"]');
    for (let i = 0; i < outgoing_links.length; i++) {
        let original_destination = outgoing_links[i].href;
        let new_destination = decodeURIComponent(original_destination.split("&").filter(arg => arg.startsWith("q="))[0].substring(2));
        outgoing_links[i].href = new_destination;
        outgoing_links[i].data = null; // remove some YouTube specific stuff that tries to open youtube.com/redirect on click
    }
    
    //let outgoing_links2 = document.querySelectorAll('a.yt-simple-endpoint:not([href^="http"]')
    //let outgoing_links2 = document.getElementsByTagName('a')
    
    let outgoing_links2 = document.querySelectorAll('a:not([href]')
    for (let i = 0; i < outgoing_links2.length; i++) {
      if ((outgoing_links2[i].innerText.startsWith('https://') || outgoing_links2[i].innerText.startsWith('http://'))){
        console.log(outgoing_links2[i].innerText)
        console.log(outgoing_links2[i])
        outgoing_links2[i].href = outgoing_links2[i].innerText;
      } 
    }
  }

  window.addEventListener('yt-navigate-finish', replaceLinks );
  //window.addEventListener('ytd-continuation-item-renderer', replaceLinks );
  
  //window.addEventListener('onclick', replaceLinks );
  document.ondblclick = function () { 
    replaceLinks(0)
  }

})();