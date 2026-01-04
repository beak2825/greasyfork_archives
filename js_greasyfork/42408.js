// ==UserScript==
// @name        Remove HTML5 Audio/Video and Flash
// @namespace   https://greasyfork.org/en/users/85671-jcunews
// @description Remove HTML5 Video (and optionally Audio too) and Flash from any web page. This is somewhat an aggresive measure to disable audio, video and Flash when there's no other option is available.
// @version     1.0.1
// @license     AGPL v3
// @author      jcunews
// @include     *://*/*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/42408/Remove%20HTML5%20AudioVideo%20and%20Flash.user.js
// @updateURL https://update.greasyfork.org/scripts/42408/Remove%20HTML5%20AudioVideo%20and%20Flash.meta.js
// ==/UserScript==

(function(tagNamesArray, tagNamesStr, rx, observer) {

  //===== CONFIGURATION BEGIN =====

  //if removeAudio is enabled, HTML5 Audio is removed also.
  var removeAudio = true;
  //if tryToRemoveContainer is enabled, any relevant container elements are removed also.
  var tryToRemoveContainer = true;

  //===== CONFIGURATION BEGIN =====

  tagNamesArray = ["EMBED", "IFRAME", "VIDEO"];
  rx = /embed|flash|player|media|video/i;
  if (removeAudio) {
    tagNamesArray.push("AUDIO");
    rx.source += "|audio";
  }
  tagNamesStr = tagNamesArray.join(",");

  function removeContainer(ele, last) {
    last = ele;
    while (ele.parentNode) {
      ele = ele.parentNode;
      if (rx.test(ele.id) || rx.test(ele.className)) last = ele;
    }
    if (last) last.remove();
  }

  function removeEle(ele) {
    if (tryToRemoveContainer) {
      removeContainer(ele);
    } else ele.remove();
  }

  function processNode(node) {
    if ((tagNamesArray.indexOf(node.tagName) >= 0) && (node.tagName !== "IFRAME")) {
      removeEle(node);
    } else if ((node.tagName === "IFRAME") && (rx.test(node.id) || rx.test(node.className))) {
      removeEle(node);
    } else if (node.tagName === "IFRAME") {
      if (node.parentNode && (rx.test(node.parentNode.id) || rx.test(node.parentNode.className))) {
        removeEle(node.parentNode);
      } else if (node.parentNode.parentNode && (rx.test(node.parentNode.parentNode.id) || rx.test(node.parentNode.parentNode.className))) {
        removeEle(node.parentNode.parentNode);
      }
    } else {
      node.querySelectorAll(tagNamesStr).forEach(function(ele) {
        removeEle(ele);
      });
    }
  }

  function processPage() {
    document.body.querySelectorAll(tagNamesStr).forEach(function(ele) {
      processNode(ele);
    });
  }

  observer = new MutationObserver(function(records) {
    records.forEach(function(record) {
      Array.prototype.slice.call(record.addedNodes).forEach(function(node) {
        if (node.nodeType === 1) processNode(node);
      });
    });
  });

  addEventListener("spfprocess", processPage);
  addEventListener("spfdone", processPage);
  addEventListener("DOMContentLoaded", function() {
    processPage();
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
  addEventListener("load", processPage);
})();
