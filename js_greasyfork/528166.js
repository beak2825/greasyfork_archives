// ==UserScript==
// @name         Reddit duplicate posts remover
// @namespace    fuckspez
// @version      1.0
// @description  Removes duplicate entries from reddit
// @author       fuck spez
// @match        https://*.reddit.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528166/Reddit%20duplicate%20posts%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/528166/Reddit%20duplicate%20posts%20remover.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(function() {

  let mainMemory = [];
  let elementSelector = 'div[class*="thing id-t3_"]';

  function initializeMemory() {
    let mainPostList = document.getElementById('siteTable');

    for (let elem of mainPostList.querySelectorAll(elementSelector)) {
      mainMemory.push(elem.id);
    }

    let observer = new MutationObserver(mutations => {
      for (let mutation of mutations) {
        for (let node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) {
            continue;
          }

          if (node.matches(elementSelector)) {
            checkAndRemoveDuplicate(node);
          }

          for (let elem of node.querySelectorAll(elementSelector)) {
            checkAndRemoveDuplicate(elem);
          }
        }
      }
    });

    observer.observe(mainPostList, {
      childList: true,
      subtree: true
    });
  }

  function checkAndRemoveDuplicate(node) {
    //console.log("checkAndRemoveDuplicate node id=" + node.id);
    if (mainMemory.find(elemId => elemId === node.id)) {
      //console.log("found dupe " + node.id);
      node.remove();
    } else {
      mainMemory.push(node.id);
    }
  }

  window.addEventListener("load", setTimeout(function() {
    //console.log("window on load: initialize memory");
    initializeMemory();
  }, 1000));

  //console.log("main script start");

})();