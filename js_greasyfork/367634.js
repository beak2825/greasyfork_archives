// ==UserScript==
// @name         YouTube Embedder
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @description  Convert links and optionally URL text which points to a YouTube video, into embedded YouTube frame. For URL text, it can be converted to a link only. The main function can be configured for on-demand-only for slow computers. If enabled, the main function can be executed via bookmarklet using this URL: javascript:yte_ujs()
// @author       jcunews
// @version      1.0.6
// @license      GNU AGPLv3
// @match        *://*/*
// @exclude      *://www.youtube.com/embed/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367634/YouTube%20Embedder.user.js
// @updateURL https://update.greasyfork.org/scripts/367634/YouTube%20Embedder.meta.js
// ==/UserScript==

(function(xe, fe, ce, rx, trx, trxg, hrx, lo, qu) {

  //===== CONFIGURATION BEGIN =====

  //The minimum width & height of the container element where the link or URL text is found, in order to apply the conversion.
  var minimumWidth  = 256;
  var minimumHeight = 144;

  //Embedded YouTube frame width in pixels (should be multiplication of 16).
  //If zero, the width is the container element width of the link or URL text, and the height is calculated using 16:9 ratio (widescreen video dimension).
  //If the final width is smaller than the minimum width setting, and if the source is an URL text, it will be converted to a link instead.
  var frameWidth = 0;

  //Enable URL text to YouTube frame converter (aside from links).
  var convertUrlText = true;

  //Convert to link only, when on these domains.
  var convertToLinkOnlyDomains = /somesite\.info|subnet\d+\.other\.net/i;

  //Delay between processing each node scanning queue. Lower value means faster scanning, but more CPU intensive.
  //Higher value means lesser CPU usage, but also means slower scanning.
  var queueDelay = 50; //in milliseconds. 1000ms = 1 second.

  //Number of nodes to process at a time. Adjust this and queueDelay settings to find the best performance without triggering the web browser's busy dialog.
  //Lower value means lesser CPU usage, but also means slower scanning.
  var nodesPerProcessing = 5;

  //The onDemandOnlyDomains makes the main function available on-demand-only for specific or all sites.
  //If enabled, it's accessible via bookmarklet using this URL: javascript:yte_ujs()
  //This setting is for slow computers, since the main function is CPU intensive.
  var onDemandOnlyDomains = /somesite\.info|subnet\d+\.other\.net/i;

  //===== CONFIGURATION END =====

  function linkToFrame(node, m, pn, w, h, a) {
    if (node.ytebd_nocovert || !node.offsetWidth || !node.offsetHeight) return;
    if (!lo && (m = node.href.match(rx))) {
      m = "https://www.youtube.com/embed/" + m[1];
      pn = node.parentNode;
      while (pn) {
        if (pn.scrollHeight > pn.offsetHeight) break;
        pn = pn.parentNode;
      }
      h = ((pn || node.parentNode).offsetHeight * 0.9) >> 0;
      w = frameWidth > 0 ? frameWidth : node.parentNode.offsetWidth;
      if ((pn = (w / 16 * 9) >> 0) > h) {
        w = (h / 9 * 16) >> 0;
      } else h = pn;
      if ((w >= minimumWidth) && (h >= minimumHeight)) {
        c = document.createElement("IFRAME");
        c.src = m;
        c.allowFullscreen = true;
        c.referrerPolicy = "no-referrer";
        c.style.border = "none";
        c.width = w;
        c.height = h;
        c.ytebd_nocovert = 1;
        node.replaceWith(c);
      } else if (w && h) node.ytebd_nocovert = 1;
    } else node.ytebd_nocovert = 1;
  }

  function processNode(node, c, m, w, h, pn) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
      case Node.DOCUMENT_NODE:
        if (node.ytebd_nocovert) break;
        if (node.nodeName === "A") {
          linkToFrame(node);
          node = null;
        }
        if (node && (xe.indexOf(node.nodeName) < 0)) {
          if (fe.indexOf(node.nodeName) >= 0) {
            m = (m = node.src.match(/:\/\/(.*?)\//)) && (m[1] === location.hostname);
          } else m = true;
          if (m && ((node.nodeName !== "A") || convertUrlText)) {
            node.childNodes.forEach(queue);
          }
        }
        break;
      case Node.TEXT_NODE:
        if (convertUrlText && (m = node.nodeValue.match(trx))) {
          w = node.nodeValue;
          h = -1;
          a = [];
          while (c = trxg.exec(w)) {
            if (c.index > 0) a.push(w.substring(h, c.index));
            a.push(c);
            h = c.index + c[0].length;
          }
          if ((h > 0) && (h < w.length)) a.push(w.substr(h));
          for (c = a.length - 1; c >= 0; c--) {
            if (!Array.isArray(a[c]) && !a[c].replace(/^\s+|\s+$/g, "")) a.splice(c, 1);
          }
          if (node.parentNode.nodeName === "A") {
            if (a.length === 1) {
              node.href = "https://www.youtube.com/embed/" + a[0][1];
              node.rel = "nofollow noopener noreferrer";
              node.target = "_blank";
            }
            a = null;
          }
          if (a) {
            pn = node.parentNode;
            c = node.nextSibling;
            a.forEach(function(v, i, n) {
              if (!Array.isArray(v)) {
                n = document.createTextNode(v);
              } else {
                n = document.createElement("A");
                n.textContent = v[0];
                n.title = v[1];
                n.href = "https://www.youtube.com/embed/" + v[1];
                n.rel = "nofollow noopener noreferrer";
                n.target = "_blank";
              }
              if (i > 0) {
                pn.insertBefore(n, c);
              } else {
                node.replaceWith(n);
              }
              linkToFrame(n);
            });
          }
        }
    }
  }

  function processQueue() {
    setTimeout(function(nodes) {
      nodes.forEach(processNode);
      if (qu.length) setTimeout(processQueue, queueDelay);
    }, queueDelay, qu.splice(0, nodesPerProcessing));
  }

  function queue(node) {
    qu.push(node);
    if (qu.length === 1) setTimeout(processQueue, queueDelay);
  }

  xe = ["BUTTON", "INPUT", "SCRIPT", "SELECT", "STYLE"];
  fe = ["FRAME", "IFRAME"];
  rx = /^(?:https?:\/\/)?(?:(?:(?:www\.)?youtube\.com\/)(?:embed\/|watch\?.*v=)|youtu\.be\/)([0-9a-z_\-]{11})/i;
  trx = /(?:https?:\/\/)?(?:(?:(?:www\.)?youtube\.com\/)(?:embed\/|watch\?.*v=)|youtu\.be\/)([0-9a-z_\-]{11})[^\s,'")\]}>]*/i;
  trxg = /(?:https?:\/\/)?(?:(?:(?:www\.)?youtube\.com\/)(?:embed\/|watch\?.*v=)|youtu\.be\/)([0-9a-z_\-]{11})[^\s,'")\]}>]*/gi;
  hrx = /^(?:(?:www\.)?youtube\.com|youtu\.be)$/i;
  lo = convertToLinkOnlyDomains.test(location.hostname);
  qu = [];

  if (nodesPerProcessing <= 0) nodesPerProcessing = 1;
  if (!document.body) return;

  if (onDemandOnlyDomains.test(location.hostname)) {
    window.yte_ujs = function() {
      queue(document.body);
      return undefined;
    };
  } else {
    if (document.body) queue(document.body);
    (new MutationObserver(function(records) {
      records.forEach(function(record) {
        if (record.type === "childList") {
          record.addedNodes.forEach(queue);
        } else queue(record.target);
      });
    })).observe(document.body, {attributes: true, attributeFilter: ["class", "style"], childList: true, subtree: true});
  }

})();
