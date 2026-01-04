// ==UserScript==
// @name         Chuyển mã Unicode tổ hợp sang Unicode dựng sẵn
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  Chuyển nội dung trang web mã Unicode tổ hợp sang Unicode dựng sẵn
// @author       Hồng Minh Tâm
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34774/Chuy%C3%AA%CC%89n%20ma%CC%83%20Unicode%20t%C3%B4%CC%89%20h%C6%A1%CC%A3p%20sang%20Unicode%20d%C6%B0%CC%A3ng%20s%C4%83%CC%83n.user.js
// @updateURL https://update.greasyfork.org/scripts/34774/Chuy%C3%AA%CC%89n%20ma%CC%83%20Unicode%20t%C3%B4%CC%89%20h%C6%A1%CC%A3p%20sang%20Unicode%20d%C6%B0%CC%A3ng%20s%C4%83%CC%83n.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function getTextNodesIn(elem, opt_fnFilter) {
    var node, textNodes = [],
      walk = document.createTreeWalker(elem, NodeFilter.SHOW_TEXT, null, false);
    while (node = walk.nextNode()) {
      if (!opt_fnFilter || opt_fnFilter(node)) {
        textNodes.push(node);
      }
    }
    return textNodes;
  }

  function replaceAllText(selector) {
    var elems;
    if (typeof selector === 'string' || selector instanceof String) {
      elems = document.querySelectorAll(selector);
    } else if (selector instanceof NodeList || selector instanceof HTMLCollection) {
      elems = selector;
    } else if (selector instanceof Element || selector instanceof Document) {
      elems = [selector];
    } else if (typeof jQuery != 'undefined' && selector instanceof jQuery) {
      elems = selector.get(0);
    } else {
      return;
    }
    elems.forEach(function (elem) {
      getTextNodesIn(elem, function (textNode) {
        return textNode.parentElement.closest('body') && textNode.parentElement.localName !== 'body' && textNode.parentElement.localName !== 'script' && textNode.parentElement.localName !== 'noscript' && textNode.parentElement.localName !== 'style';
      }).forEach(function (textNode) {
        textNode.textContent = textNode.textContent.replace(/.[\u0300-\u036F]/g, function (match) {
          return match.normalize('NFKC');
        });
      });
    });
  }

  var observeDOM = (function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
      eventListenerSupported = window.addEventListener;

    return function (obj, callback) {
      if (MutationObserver) {
        var obs = new MutationObserver(function (mutations, observer) {
          if (mutations[0].addedNodes.length) {
            callback(mutations[0].addedNodes);
          }
        });
        obs.observe(obj, {
          childList: true,
          subtree: true
        });
      } else if (eventListenerSupported) {
        obj.addEventListener('DOMNodeInserted', callback, false);
        obj.addEventListener('DOMNodeRemoved', callback, false);
      }
    };
  })();

  replaceAllText(document);
  observeDOM(document, function (elems) {
    replaceAllText(elems);
  });
})();