// ==UserScript==
// @name        F95zone > threads > HTML <title> rearrangement
// @namespace   Violentmonkey Scripts
// @match       *://f95zone.to/threads/*
// @grant       none
// @version     0.1.12
// #timestamp   2025-03-28 18:39:11
// @author      BtDt
// @license     MIT
// @description F95zone threads pages - HTML <title> rearrangement - moving labels from the beginning of the title to after the developer name.
// @downloadURL https://update.greasyfork.org/scripts/531152/F95zone%20%3E%20threads%20%3E%20HTML%20%3Ctitle%3E%20rearrangement.user.js
// @updateURL https://update.greasyfork.org/scripts/531152/F95zone%20%3E%20threads%20%3E%20HTML%20%3Ctitle%3E%20rearrangement.meta.js
// ==/UserScript==

(function() {
    'use strict'; 

    function XPathEvalAndIter(
      xpath,
      ctxNode,
      callback = (subnode) => {})
    {
        const result = document.evaluate(
          xpath,
          ctxNode,
          null,
          XPathResult.ORDERED_NODE_ITERATOR_TYPE,
          null);
        let node = result.iterateNext();
        while (node) {
            callback(node);
            node = result.iterateNext();
        }
    }
    
    let title = '';
    let labels = '';
    
    function ProcessTitle(subnode) {
        XPathEvalAndIter(
           "text()",
           subnode,
           (subnode) => { title += subnode.textContent; });
        XPathEvalAndIter(
           "a[@class='labelLink']/span",
           subnode,
           (subnode) => { labels += ` #${subnode.textContent}`; });
    }
    
    XPathEvalAndIter(
      "//h1[@class='p-title-value']",
      document,
      ProcessTitle);
    document.title = `${title} ${labels} | F95zone`;

})();
