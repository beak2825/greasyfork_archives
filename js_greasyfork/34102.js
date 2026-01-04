// ==UserScript==
// @name         Page Contents View Mode
// @namespace    PageContentsViewMode
// @version      1.0.2
// @license      AGPL v3
// @description  The main purpose of this script is to show only the main content or page article. It is designed to be used with a bookmarklet whose URL is (no quote) "javascript:void(PCVM())".
// @author       jcunews
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34102/Page%20Contents%20View%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/34102/Page%20Contents%20View%20Mode.meta.js
// ==/UserScript==

/*
There can be up to 5 to 7 view modes depending on the layout of the web page. The first time the bookmarklet is clicked, the script will try to show only the main content. Depending on the web page layout, it may not show all of the main content. So, subsequent click to the bookmarklet will widen the visibility of the content. e.g. content title, then content footer, then sidebars, etc.

The first time the bookmarklet is clicked, the script will try to show only the main content (i.e. without page header & footer, top menu, sidebar, etc.). Depending on the web page layout, it may not show all of the main content. So, subsequent click to the bookmarklet will widen the visibility of the content. e.g. content title, then content footer, then sidebars, etc.

https://greasyfork.org/en/scripts/34102-page-contents-view-mode
*/

(function(i, j, k, l) {
  //*** Tweakable Configuration Start ***
  var minimumTextLength = 30; //in characters (in its container element)
  var minimumTextPosition = 10; //in percents (of page)
  var maximumTextPosition = 90; //in percents (of page)
  var maximumVisibilityLevel = 5;
  //*** Tweakable Configuration End ***

  if (!(document instanceof HTMLDocument)) return;

  var excludedElements = ["NOSCRIPT", "SCRIPT", "STYLE"];
  var bodyHTML = document.body.innerHTML, texts = [];
  function checkNode(node, i, t) {
    switch (node.nodeType) {
      case Element.ELEMENT_NODE:
        if (excludedElements.indexOf(node.tagName) < 0) {
          for (i = 0; i < node.childNodes.length; i++) {
            checkNode(node.childNodes[i]);
          }
        }
        break;
      case Element.TEXT_NODE:
        t = node.data.trim();
        if (t.length >= minimumTextLength) {
          i = (bodyHTML.indexOf(t) / bodyHTML.length) * 100;
          if ((i >= minimumTextPosition) && (i <= maximumTextPosition)) {
            texts.push({node: node, text: t, position: i, levelWeight: node.parentNode.parentNode.textContent.trim().length});
          }
        }
    }
  }
  checkNode(document.body);
  if (!texts.length) return;
  for (i = 0; i < texts.length-1; i++) {
    j = texts[i].node.parentNode.parentNode;
    k = false;
    l = i+1;
    while (l < texts.length) {
      if (texts[l].node.parentNode.parentNode === j) {
        texts.splice(l, 1);
        continue;
      } else l++;
    }
  }
  if (!texts.length) return;
  texts.sort(function(i1, i2) {
    return i2.levelWeight - i1.levelWeight;
  });
  if (!window.PCVM) {
    window.PCVM = function(ele, lvl, node) {
      ele = document.getElementById("spaStyle");
      if (!ele) {
        ele = document.createElement("STYLE");
        ele.innerHTML = '.spaHidden{display:none!important}';
        document.head.appendChild(ele);
      }
      if (++window.PCVM.level > 999) {
        window.PCVM.level = 0;
      } else if (window.PCVM.level > maximumVisibilityLevel) {
        window.PCVM.level = 999;
      }
      lvl = 0;
      ele = texts[0].node.parentNode;
      while (ele !== document.body) {
        node = ele.previousElementSibling;
        while (node) {
          if (lvl <= window.PCVM.level) {
            node.classList.remove("spaHidden");
          } else node.classList.add("spaHidden");
          node = node.previousElementSibling;
        }
        node = ele.nextElementSibling;
        while (node) {
          if (lvl <= window.PCVM.level) {
            node.classList.remove("spaHidden");
          } else node.classList.add("spaHidden");
          node = node.nextElementSibling;
        }
        ele = ele.parentNode;
        lvl++;
      }
    };
    window.PCVM.level = 999;
  }
})();
