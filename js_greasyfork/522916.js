// ==UserScript==
// @name        Restore Right Click for Gallery Images
// @name:ru     Убирает блок правого клика по фото в галлерее
// @namespace   Violentmonkey Scripts
// @match       *://boosty.to/*
// @grant       none
// @version     1.0
// @author      raefraem
// @description The name says it all
// @description:ru Очевидно из названия
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522916/Restore%20Right%20Click%20for%20Gallery%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/522916/Restore%20Right%20Click%20for%20Gallery%20Images.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var observeDOM = (function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    return function (obj, callback) {
      if (!obj || obj.nodeType !== 1) {
        return;
      }

      if (MutationObserver) {
        // define a new observer
        var mutationObserver = new MutationObserver(callback);

        // have the observer observe for changes in children
        mutationObserver.observe(obj, { childList: true, subtree: true });
        return mutationObserver;
      } else if (window.addEventListener) {
        // browser support fallback
        obj.addEventListener('DOMNodeInserted', callback, false);
        obj.addEventListener('DOMNodeRemoved', callback, false);
      }
    };
  })();

  function recreateNode(el, withChildren) {
    if (withChildren) {
      el.parentNode.replaceChild(el.cloneNode(true), el);
    } else {
      var newEl = el.cloneNode(false);
      while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
      el.parentNode.replaceChild(newEl, el);
    }
  }

  function getGalleryEl() {
    return document.getElementById('gallery');
  }

  function handleLoad() {
    observeDOM(getGalleryEl(), handleChange);

    function handleChange(m) {
      recreateNode(getGalleryEl());

      setTimeout(() => {
        observeDOM(getGalleryEl(), handleChange);
      }, 200);
    }
  }

  window.addEventListener('load', handleLoad, false);
})();
