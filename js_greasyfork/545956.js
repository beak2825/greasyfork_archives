// ==UserScript==
// @name            Remove not-supported-screen (Yandex Quasar)
// @name:ru         Удаляет not-supported-screen (Yandex Quasar)
// @namespace       https://github.com/davidaganov
// @description     Removes the 'Update the app' banner on Yandex Quasar that blocks access to smart home controls via the browser
// @description:ru  Удаляет баннер "Обновите приложение" на Yandex Quasar, блокирующий доступ к управлению умным домом через браузер
// @author          davidaganov
// @version         1.3
// @grant           none
// @match           *://*.yandex.ru/quasar*
// @license         MIT
// @run-at          document-start

// @downloadURL https://update.greasyfork.org/scripts/545956/Remove%20not-supported-screen%20%28Yandex%20Quasar%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545956/Remove%20not-supported-screen%20%28Yandex%20Quasar%29.meta.js
// ==/UserScript==
(function () {
  "use strict";

  // Function to remove the not-supported-screen element and iot-app-banner
  function removeBlockingElements() {
    const selectors = [
      '.not-supported-screen',
      '[class*="not-supported"]',
      '[data-testid*="not-supported"]',
      '.iot-app-banner__wrapper'
    ];

    let removed = false;
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.remove();
        removed = true;
      });
    });

    return removed;
  }

  // Function to remove no-scroll class from body
  function removeNoScrollFromBody() {
    if (document.body) {
      if (document.body.classList.contains('no-scroll')) {
        document.body.classList.remove('no-scroll');
        return true;
      }
      // Also check for other common scroll-blocking classes
      const scrollBlockingClasses = ['no-scroll', 'overflow-hidden', 'scroll-disabled', 'modal-open'];
      let removed = false;
      scrollBlockingClasses.forEach(className => {
        if (document.body.classList.contains(className)) {
          document.body.classList.remove(className);
          removed = true;
        }
      });

      // Also remove inline styles that might block scrolling
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = '';
        removed = true;
      }

      return removed;
    }
    return false;
  }

  // Combined function to clean up blocking elements and styles
  function cleanupPage() {
    const elementsRemoved = removeBlockingElements();
    const scrollRestored = removeNoScrollFromBody();

    if (elementsRemoved || scrollRestored) {
      console.log('Yandex Quasar cleanup:', {
        elementsRemoved,
        scrollRestored
      });
    }
  }

  // Try to clean up immediately
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      cleanupPage();
    });
  } else {
    cleanupPage();
  }

  // Observer for DOM changes (in case of dynamic loading)
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        cleanupPage();
      }
      // Also watch for class changes on body element
      if (mutation.type === "attributes" &&
          mutation.target === document.body &&
          mutation.attributeName === "class") {
        removeNoScrollFromBody();
      }
    });
  });

  // Start the observer when the DOM is ready
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    // Also observe the document for body changes
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    });
  }
})();