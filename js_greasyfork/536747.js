// ==UserScript==
// @name         YouTube Remove Inline Shorts
// @namespace    PoKeRGT
// @version      0.2.1
// @description  Removes inline YouTube shorts from the feed by targeting 'ytm-shorts-lockup-view-model-v2' and removing its parent.
// @author       PoKeRGT
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @homepageURL  https://github.com/PoKeRGT/userscripts
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536747/YouTube%20Remove%20Inline%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/536747/YouTube%20Remove%20Inline%20Shorts.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SHORTS_SELECTOR = 'ytm-shorts-lockup-view-model-v2';

  function removeParentOfShort(shortElement) {
    if (shortElement && shortElement.parentNode) {
      shortElement.parentNode.remove();
    }
  }

  function removeInlineShorts() {
    const shortsElements = document.querySelectorAll(SHORTS_SELECTOR);
    shortsElements.forEach(removeParentOfShort);
  }

  // Ejecutar la función al cargar inicialmente la página
  removeInlineShorts();

  // Configurar un MutationObserver para observar cambios en el DOM
  const observer = new MutationObserver(function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Caso 1: El nodo añadido es directamente un short.
            if (node.matches(SHORTS_SELECTOR)) {
              removeParentOfShort(node);
            } else {
              // Caso 2: El nodo añadido es un contenedor que podría tener shorts dentro.
              // Buscamos shorts solo si el nodo en sí no es un short (manejado arriba).
              const shortsInsideNode = node.querySelectorAll(SHORTS_SELECTOR);
              shortsInsideNode.forEach(removeParentOfShort);
            }
          }
        }
      }
    }
  });

  // Empezar a observar el documentElement para elementos hijos añadidos y modificaciones en el subárbol
  observer.observe(document.documentElement, { childList: true, subtree: true });

})();
