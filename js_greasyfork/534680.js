// ==UserScript==
// @name     Get out from X -今すぐXから立ち去れ-
// @namespace http://tampermonkey.net/
// @version   2025-05-02
// @description You can't get into X anymore. please logout from x.com
// @author    masavo
// @match     https://x.com/*
// @icon      https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant     none
// @downloadURL https://update.greasyfork.org/scripts/534680/Get%20out%20from%20X%20-%E4%BB%8A%E3%81%99%E3%81%90X%E3%81%8B%E3%82%89%E7%AB%8B%E3%81%A1%E5%8E%BB%E3%82%8C-.user.js
// @updateURL https://update.greasyfork.org/scripts/534680/Get%20out%20from%20X%20-%E4%BB%8A%E3%81%99%E3%81%90X%E3%81%8B%E3%82%89%E7%AB%8B%E3%81%A1%E5%8E%BB%E3%82%8C-.meta.js
// ==/UserScript==

(function () {
  "use strict";

  class DOMObserver {
    constructor(root) {
      this.reactRoot = root?.querySelector("#react-root") || null;
    }

    observeElementAppendedTiming(
      targetSelector,
      parentSelector,
      callback,
      options = { childList: true, subtree: true }
    ) {
      const parentElement = document.querySelector(parentSelector);
      this.#setupObserver(parentElement, targetSelector, callback, options);
    }

    #setupObserver(parentElement, targetSelector, callback, options) {
      const observer = new MutationObserver((mutations) => {
        this.#handleMutations(mutations, targetSelector, callback);
      });

      if (parentElement) {
        observer.observe(parentElement, options);
      }
    }

    #handleMutations(mutations, targetSelector, callback) {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (this.#isValidElement(node, targetSelector)) {
            const element = this.#getTargetElement(node, targetSelector);
            if (element) {
              callback(element);
            }
          }
        });
      });
    }

    #isValidElement(node, targetSelector) {
      return node instanceof HTMLElement && node.querySelector(targetSelector);
    }

    #getTargetElement(node, targetSelector) {
      const element = node.querySelector(targetSelector);
      return element instanceof HTMLElement ? element : null;
    }
  }

  class SignInContainerManager {
    constructor(domObserver) {
      this.domObserver = domObserver;
    }

    observe(callback) {
      this.domObserver.observeElementAppendedTiming(
        '[data-testid="google_sign_in_container"]',
        "#react-root",
        (element) => callback(element)
      );
    }

    remove() {
      this.#getElement().remove();
    }

    #getElement() {
      return document.querySelector('[data-testid="google_sign_in_container"]')
        .parentNode;
    }
  }

  class TextBoxManager {
    constructor(domObserver) {
      this.domObserver = domObserver;
      this.texts = [
        "お前の居場所は、ここではない。",
        "今すぐここから立ち去りなさい。",
      ];
    }

    observe(callback) {
      this.domObserver.observeElementAppendedTiming(
        'div[dir="ltr"] > span',
        "#react-root",
        (element) => callback(element)
      );
    }

    overwrite(element, newText) {
      if (element) {
        element.textContent = newText;
        console.log(`要素のテキストを上書きしました: ${newText}`, element);
      }
    }

    overwriteAll() {
      this.#getElements().forEach((targetElement, index) => {
        if (this.texts[index]) {
          this.overwrite(targetElement, this.texts[index]);
        }
      });
    }

    #getElements() {
      return document.querySelectorAll('div[dir="ltr"] > span');
    }
  }

  // 処理
  const domObserver = new DOMObserver(document);
  const signInContainerManager = new SignInContainerManager(domObserver);
  signInContainerManager.observe(() => {
    signInContainerManager.remove();
  });

  const textBoxManager = new TextBoxManager(domObserver);
  textBoxManager.observe(() => {
    textBoxManager.overwriteAll();
  });
})();
