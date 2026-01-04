// ==UserScript==
// @name        phteven
// @namespace   github.com/shmup
// @match       https://www.c82.net/euclid/*
// @grant       none
// @version     1.0
// @author      jtm
// @license MIT 
// @description 5/18/2022, 5:31:40 PM
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/445192/phteven.user.js
// @updateURL https://update.greasyfork.org/scripts/445192/phteven.meta.js
// ==/UserScript==


const startObserving = (targetNode, callback, options={}) => {
  const mutationSettings = Object.assign({ attributes: false, childList: true, characterData: true, subtree: true }, options);

  const observer = new MutationObserver(callback);

  observer.observe(targetNode, mutationSettings);
}

const observed = (mutations, observer) => {
  for (const thing of mutations) {
    if (thing.type !== "childList") continue;

    if (thing.target.innerHTML.includes('ſ')) {
      thing.target.innerHTML = thing.target.innerHTML.replaceAll('ſ', 's')
    }
  }
}

startObserving(document.body, observed);