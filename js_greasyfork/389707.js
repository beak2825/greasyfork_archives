// ==UserScript==
// @name         Use PInterest Raw Image
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.2
// @license      AGPLv3
// @description  Changes all PInterest hosted images to use the raw/original version or largest available
// @author       jcunews
// @match        https://*.pinterest.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/389707/Use%20PInterest%20Raw%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/389707/Use%20PInterest%20Raw%20Image.meta.js
// ==/UserScript==

(function() {

  var regex  = /^(https?:\/\/i\.pinimg\.com)\/\d+x(\/[0-9a-f]{2}\/[0-9a-f]{2}\/[0-9a-f]{2}\/[0-9a-f]{32}\.(?:jpg|png))$/;

  function setSrc(ele, url) {
    if (url) {
      ele.utri_skip = 1;
      if (ele.getAttribute("data-src") === ele.src) ele.setAttribute("data-src", url);
      ele.src = url;
    }
  }

  function tryLoad(ele, url1, url2, i, m, e) {
    i = document.createElement("IMG");
    i.onerror = function() {
      if (i.src === url1) {
        setSrc(i, url2);
      } else {
        i.remove();
        e.remove();
      }
    };
    i.onload = function() {
      setSrc(ele, i.src);
      i.remove();
      e.remove();
    };
    i.style.cssText = "position:absolute;z-index:-9999;opacity:.1;visibility:hidden;left:-9999px;top:-9999px;width:1px;height:1px";
    setSrc(i, url1);
    e = document.createElement("DIV");
    e.utri_skip = 1;
    e.textContent = "Optimizing...";
    e.style.cssText = "position:absolute;z-index:9;border-bottom-right-radius:1rem;padding:.1em 2.5ex .2em 2ex;background:#000;color:#fff;line-height:normal;font-size:8pt;font-weight:normal";
    ele.parentNode.insertBefore(e, ele);
    document.body.appendChild(i);
  }

  function processSrc(ele, match) {
    if ((ele.tagName !== "IMG") || !ele.src || ele.utri_skip) return;
    if (match = ele.src.match(regex)) tryLoad(ele, match[1] + "/originals" + match[2], match[1] + "/736x" + match[2]);
  }

  function processContainer(container, eles) {
    if (container.nodeType !== Node.ELEMENT_NODE) return;
    eles = container.querySelectorAll('img[src^="https://i.pinimg.com/"]');
    processSrc(container);
    eles.forEach(processSrc);
  }

  addEventListener("load", function() {
    processContainer(document.body);
    (new MutationObserver(function(records) {
      records.forEach(function(record) {
        if (record.attributeName === "src") {
          processSrc(record.target);
        } else record.addedNodes.forEach(processContainer);
      });
    })).observe(document.body, { childList: true, attributes: true, subtree: true });
  });

})();
