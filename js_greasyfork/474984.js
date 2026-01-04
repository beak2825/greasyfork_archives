// ==UserScript==
// @name        CyTube Max Viewers
// @namespace   lig
// @license     GNU GPLv3
// @match       https://cytu.be/r/*
// @grant       GM.info
// @version     1.0
// @author      MFG
// @description Keep track of max viewers
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/474984/CyTube%20Max%20Viewers.user.js
// @updateURL https://update.greasyfork.org/scripts/474984/CyTube%20Max%20Viewers.meta.js
// ==/UserScript==

let viewerMax = 0;

let cytube = location.pathname.match(/([^\/]+)$/)[0];
(() => {
  let localMax = localStorage.getItem(cytube+'_VIEWER_MAX');
  if(localMax) viewerMax = localMax;
})();

function getViewers() {
	let r = target.innerText.match(/^(\d+)/);
  if(r && r[1]) r = parseInt(r[1])
	else r = 0
  return r;
}

let target = document.querySelector('#usercount');
target.insertAdjacentHTML('afterend', `<span id="viewerMax" title="Max Viewers">(N/A)</span><span id="reset" class="pointer label label-default">Reset</span>`);

let viewerMaxOut = document.querySelector('#viewerMax');
function updateViewerMax() {
  let viewers = getViewers();
  if(viewers > viewerMax || viewerMax == 0) {
    viewerMax = viewers;
    localStorage.setItem(cytube+'_VIEWER_MAX', ''+viewerMax)
  }
  viewerMaxOut.innerHTML = `(${viewerMax})&nbsp;`;
}

function mutate(mutations) {
  mutations.forEach(function(mutation) {
    updateViewerMax();
  });
}

let reset = document.querySelector('#reset');
reset.addEventListener('click', e => {
	viewerMax = 0;
  updateViewerMax();
});

let observer = new MutationObserver(mutate);
let config = { characterData: false, attributes: false, childList: true, subtree: false };

observer.observe(target, config);
updateViewerMax();