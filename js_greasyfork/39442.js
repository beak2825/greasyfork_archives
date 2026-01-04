// ==UserScript==
// @name         Unrandomize Tumblr Image Server
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @description  Changes all Tumblr hosted images to use a fixed server name. e.g. "78.media.tumblr.com" to "media.tumblr.com"
// @author       jcunews
// @version      1.0.1
// @license      GNU AGPLv3
// @match        *://*.tumblr.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/39442/Unrandomize%20Tumblr%20Image%20Server.user.js
// @updateURL https://update.greasyfork.org/scripts/39442/Unrandomize%20Tumblr%20Image%20Server.meta.js
// ==/UserScript==

(function() {

  var regex = /^(https?:\/\/)\d+\.(media\.tumblr\.com\/[0-9a-f]{32}\/tumblr_.*)$/;

  function processSrc(ele) {
    if (!ele.src || (ele.tagName !== "IMG")) return;
    var match = ele.src.match(regex);
    if (!match) return;
    ele.src = match[1] + match[2];
  }

  function processContainer(container) {
    var eles = container.querySelectorAll('img[src*=".media.tumblr.com/"]');
    processSrc(container);
    Array.prototype.slice.call(eles).forEach(processSrc);
  }

  var observer = new MutationObserver(function(records) {
    records.forEach(function(record) {
      if (record.attributeName) {
        if (record.attributeName === "src") processSrc(record.target);
      } else {
        var nodes = Array.prototype.slice.call(record.addedNodes);
        nodes.forEach(function(node) {
          if (node.nodeType === 1) processContainer(node);
        });
      }
    });
  });

  addEventListener("load", function() {
    processContainer(document.body);
    observer.observe(document.body, {
      childList: true,
      attributes: true,
      subtree: true
    });
  });

})();
