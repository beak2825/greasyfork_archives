// ==UserScript==
// @name         cobalt-clicker
// @namespace    http://sandrin.dev
// @version      1.0.4
// @description  When navigating to gadeloitte.com, automatically click on the button to access Cobalt
// @author       https://github.com/matteosandrin
// @match        https://app3.gadeloitte.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gadeloitte.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465459/cobalt-clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/465459/cobalt-clicker.meta.js
// ==/UserScript==

function getTextNodesIn(elem, filterFunction) {
  var textNodes = [];
  if (elem) {
    for (var nodes = elem.childNodes, i = nodes.length; i--; ) {
      var node = nodes[i],
        nodeType = node.nodeType;
      if (nodeType == 3) {
        if (!filterFunction || filterFunction(node, elem)) {
          textNodes.push(node);
        }
      } else if (nodeType == 1 || nodeType == 9 || nodeType == 11) {
        textNodes = textNodes.concat(getTextNodesIn(node, filterFunction));
      }
    }
  }
  return textNodes;
}

function isImmigrationNode(node, parent) {
  return /Enter your immigration details/.test(node.nodeValue);
}

function waitUntilPageReady() {
  var navbar = document.querySelector("mat-sidenav");
  if (!navbar) {
    console.log("[0] page is not ready yet, waiting...");
    setTimeout(waitUntilPageReady, 200);
    return;
  }
  var matching_text_nodes = getTextNodesIn(navbar, isImmigrationNode);
  if (matching_text_nodes.length == 0) {
    console.log("[1] page is not ready yet, waiting...");
    setTimeout(waitUntilPageReady, 200);
    return;
  }
  console.log("[2] page is ready!");
  clickImmigrationButton();
}

function clickImmigrationButton() {
  var navbar_buttons = document.querySelectorAll("mat-list-item");
  for (let i = 0; i < navbar_buttons.length; i++) {
    var button = navbar_buttons[i];
    var matching_text_nodes = getTextNodesIn(button, isImmigrationNode);
    if (matching_text_nodes.length > 0) {
      console.log("[3] clicking immigration button");
      button.click();
      waitUntilTabLosesFocusThenClose();
      return;
    }
  }
  console.log("[5] ERROR: could not find button to click");
}

function waitUntilTabLosesFocusThenClose() {
  if (document.hasFocus()) {
    setTimeout(waitUntilTabLosesFocusThenClose, 200);
    return;
  }
  closeThisTab();
}

function closeThisTab() {
  console.log("[4] closing this tab");
  window.close();
}

(function () {
  "use strict";
  setTimeout(waitUntilPageReady, 200);
})();
