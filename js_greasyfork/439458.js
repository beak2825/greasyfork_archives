// ==UserScript==
// @name         YouTube outgoing links fix
// @version      1.0.2
// @description  Replaces outgoing links to avoid the YouTube "are you sure you want to leave" page
// @author       Thomas van der Berg
// @namespace    tmsbrg
// @match        https://www.youtube.com/*
// @grant        none
// @license      GPLv3+
// @downloadURL https://update.greasyfork.org/scripts/439458/YouTube%20outgoing%20links%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/439458/YouTube%20outgoing%20links%20fix.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // from https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function replaceLinks() {
    await sleep(2000); // bit of a hack: seems we need to wait for YouTube to do its stuff before we act
    let outgoing_links = document.querySelectorAll('a[href^="https://www.youtube.com/redirect"]');
    for (let i = 0; i < outgoing_links.length; i++) {
        let original_destination = outgoing_links[i].href;
        let new_destination = decodeURIComponent(original_destination.split("&").filter(arg => arg.startsWith("q="))[0].substring(2));
        outgoing_links[i].href = new_destination;
        outgoing_links[i].data = null; // remove some YouTube specific stuff that tries to open youtube.com/redirect on click
    }
  }

  window.addEventListener('yt-navigate-finish', replaceLinks );

})();