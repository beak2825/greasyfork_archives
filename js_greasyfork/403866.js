// ==UserScript==
// @name         VRBO Fenced Yard Filter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Filter VRBO results for fenced yards
// @author       Matthieu GB
// @match        https://www.vrbo.com/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403866/VRBO%20Fenced%20Yard%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/403866/VRBO%20Fenced%20Yard%20Filter.meta.js
// ==/UserScript==

function onNodeAdded(target, callback) {
  var observer = new MutationObserver(mutations => {
    for (const node of mutations.flatMap(mut => [...mut.addedNodes] || [])) {
      callback(node);
    }
  });
  observer.observe(target, { attributes: false, childList: true, characterData: false });
}

const fencedYardPattern = /fence.{0,50}yard/igm;
const min25Pattern = /"minimumAge":25/igm;

function resultHandler(node) {
  var url = [...node.children].find(element => element.tagName === 'A').getAttribute('href');
  fetch(url).then(res => res.text()).then(body => {
    if (!fencedYardPattern.test(body) || min25Pattern.test(body)) {
      node.style.display = 'none';
    }
  });
}

(function() {
  'use strict';

  var applicationResults = document.getElementsByClassName('Application__results')[0];
  onNodeAdded(applicationResults, node => {
    if (node.className === 'Results') {
      var hitCollection = node.getElementsByClassName('HitCollection')[0];
      for (var hit of [...hitCollection.getElementsByTagName('div')].filter(el => el.hasAttribute('style'))) {
        onNodeAdded(hit, resultHandler);
      }
    }
  });
})();