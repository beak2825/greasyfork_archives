// ==UserScript==
// @name        FT bondholders fix
// @namespace   https://greasyfork.org/en/users/824490-elliot
// @description corrects certain inaccuracies in articles
// @version     1
// @match       https://*.ft.com/*
// @grant       none
// @license     public domain
// @downloadURL https://update.greasyfork.org/scripts/433788/FT%20bondholders%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/433788/FT%20bondholders%20fix.meta.js
// ==/UserScript==

'use strict';
let textNodes = document.evaluate("//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

let w = [["Bondholders", "Bagholders"], ["bondholders", "bagholders"]];
for (let n in w) {
  let f = new RegExp(w[n][0], 'g');
  let r = w[n][1];
  for (var i = 0; i < textNodes.snapshotLength; ++i) {
    let node = textNodes.snapshotItem(i);
    node.data = node.data.replace(f, r);
  }
}