// ==UserScript==
// @name        SC: un-gate outgoing links
// @namespace   Violentmonkey Scripts
// @match       *://soundcloud.com/*
// @grant       none
// @version     0.1.5
// @license     GPLv3
// @author      -
// @description make outgoing links into direct links.
// @downloadURL https://update.greasyfork.org/scripts/464642/SC%3A%20un-gate%20outgoing%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/464642/SC%3A%20un-gate%20outgoing%20links.meta.js
// ==/UserScript==

(function() { /////////////////

function process(a) {
  console.log(a);
  a.classList.add('ungate-processed');


  if (a.href.includes('https://gate.sc', 0)) {
    var newurl = /https:\/\/gate.sc\/\?url=(.*)&token/.exec(a.href)[1];
    a.href = decodeURIComponent(newurl);
    a.setAttribute('rel', 'noopener noreferrer');
  }
}

const observer = new MutationObserver(() => {
    document.querySelectorAll('a:not(.ungate-processed)').forEach(a => process(a) );
  });
observer.observe(document.body, { childList: true, subtree: true });


})();  ///////////////