// ==UserScript==
// @name         Airbnb Fenced Yard Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filter Airbnb results for fenced yards
// @author       Matthieu GB
// @match        https://www.airbnb.com/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403871/Airbnb%20Fenced%20Yard%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/403871/Airbnb%20Fenced%20Yard%20Filter.meta.js
// ==/UserScript==

function onNodeAdded(target, callback) {
  var observer = new MutationObserver(mutations => {
    for (const node of mutations.flatMap(mut => [...mut.addedNodes] || [])) {
      callback(node);
    }
  });
  observer.observe(target, { attributes: false, childList: true, characterData: false });
}

function fetchListingDetails(listingId) {
  return fetch(
    `https://www.airbnb.com/api/v3?locale=en&currency=USD&operationName=PdpPlatformSections&variables=%7B%22request%22%3A%7B%22id%22%3A%22${listingId}%22%2C%22layouts%22%3A%5B%22SIDEBAR%22%2C%22SINGLE_COLUMN%22%5D%2C%22translateUgc%22%3Afalse%2C%22preview%22%3Afalse%2C%22bypassTargetings%22%3Afalse%7D%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22ad801b9c5317e98d4829206a76a262e7f4d3dc7915c27c6a6663434c004900b5%22%7D%7D`,
    {
      "headers": {
        "x-airbnb-api-key": "d306zoyjsyarp7ifhu67rjxn52tv0t20",
        "x-airbnb-graphql-platform": "web",
      },
    }
  ).then(res => res.text());
}

const searchPattern = /fence.{0,50}yard/igm;

function resultHandler(node) {
  var url = node.getElementsByTagName('a')[0].getAttribute('href');
  fetchListingDetails(url.match(/rooms\/(\d+)\?/)[1]).then(body => {
    if (!searchPattern.test(body)) {
      node.remove();
    }
  });
}

(function() {
  'use strict';

  var main = document.getElementsByTagName('main')[0];
  onNodeAdded(main, node => {
    var itemList = [...node.getElementsByTagName('DIV')].find(element => element.getAttribute('itemprop') === 'itemList');
    onNodeAdded(itemList, node => onNodeAdded(node, innerNode => {
      [...innerNode.getElementsByClassName('_8ssblpx')].forEach(resultHandler);
    }));
  });
})();