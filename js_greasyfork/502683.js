// ==UserScript==
// @name        Remove YouTube Premium promotion pop-up
// @namespace   @lamrongol
// @match       https://www.youtube.com/watch*
// @version     0.1
// @author      Lamron🖇
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @description ja: YouTubeプレミアムの勧誘ポップアップを削除するスクリプト
// @downloadURL https://update.greasyfork.org/scripts/502683/Remove%20YouTube%20Premium%20promotion%20pop-up.user.js
// @updateURL https://update.greasyfork.org/scripts/502683/Remove%20YouTube%20Premium%20promotion%20pop-up.meta.js
// ==/UserScript==

//TODO: First detect 'ytd-popup-container' tag by MutationObserver 
//      and observing only the tag for 'tp-yt-paper-dialog' is light process.
//      However, first I prioritize simple code

//see -> MutationObserver - Web APIs | MDN https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
const targetNode = document.getElementsByTagName("ytd-app")[0];

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = (mutationList, _observer) => {
  for (const mutation of mutationList) {
    for (const node of mutation.addedNodes) {
        if(node.nodeName == 'TP-YT-PAPER-DIALOG'){
            node.remove();
        }
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);



//Failed way
      /*
      const style = document.createElement('style');
      //style.innerHTML = 'tp-yt-paper-dialog.style-scope.ytd-popup-container:has([href^="/premium?ybp="]) {    display: none !important;}';//ytd-popup-container//tp-yt-paper-dialog
      //style.innerHTML = 'ytd-offline-promo-renderer[dialog][dialog][dialog] {display: none;} html body[modern-dialog] {--iron-overlay-backdrop-opacity: 0.0;}';

      style.innerHTML = 'ytd-popup-container !important {  display: none;}';

      document.head.appendChild(style);
      */