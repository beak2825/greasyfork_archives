// ==UserScript==
// @name        pepecine: remove non latino episodes
// @namespace   nil
// @description remove non latino episodes
// @include     http://pepecine.net/episodio-online/*
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25672/pepecine%3A%20remove%20non%20latino%20episodes.user.js
// @updateURL https://update.greasyfork.org/scripts/25672/pepecine%3A%20remove%20non%20latino%20episodes.meta.js
// ==/UserScript==

"use strict";

function delete_nonlatino_episodes() {
  var xpathExpression = '//div[@id = "videos"]//li[.//b[text() != "Latino " and ./img]]';
  var node_snapshot = document.evaluate( xpathExpression, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null );
  for (var node, i = 0; node = node_snapshot.snapshotItem(i); i++) {
    node.parentNode.removeChild(node);
  }
}
  
function init_keep_latino() {
  delete_nonlatino_episodes();
}
  
document.addEventListener('DOMContentLoaded', init_keep_latino);
