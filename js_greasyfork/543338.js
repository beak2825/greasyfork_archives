// ==UserScript==
// @name         T3 Chat Keyboard shortcuts
// @namespace    http://tampermonkey.net/
// @version      2025-07-22.1
// @description  Adds keyboard shortcuts for model selection and search on t3.chat
// @author       Yassine Safraoui
// @match        https://t3.chat/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=t3.chat
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543338/T3%20Chat%20Keyboard%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/543338/T3%20Chat%20Keyboard%20shortcuts.meta.js
// ==/UserScript==

(function () {
  setTimeout(() => {
    let debug = false;
    let log = (...e) => {
      if (debug) console.log(...e)
    }
    function selectDropdownItem(index) {
      log('selectDropdownItem called with index:', index);
      let modelSelectButton = document.querySelector("form button:has(.lucide-chevron-down)");
      log('modelSelectButton:', modelSelectButton);
      if (!modelSelectButton) {
        log('modelSelectButton not found');
        return;
      }
      const observer = new MutationObserver((mutations) => {
        log('Mutations detected:', mutations);
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            log('Added node:', node);
            if (node.nodeType === Node.ELEMENT_NODE &&
              node.tagName === 'DIV' &&
              node.hasAttribute('data-radix-popper-content-wrapper')) {
              log('Found dropdown element:', node);
              const menuItems = node.querySelectorAll('[role=menuitem]');
              log('menuItems:', menuItems);
              if (menuItems.length > index) {
                log('Found target model element:', menuItems[index]);
                menuItems[index].click();
              } else {
                log('Target model element not found for index:', index);
              }

              observer.disconnect();
              log('Observer disconnected after selection');
              return;
            }
          });
        });
      });

      observer.observe(document.body, { childList: true });
      log('Observer started');

      setTimeout(() => {
        observer.disconnect();
        log('Observer disconnected after timeout');
      }, 1000);
      log('Dispatching pointerdown event to modelSelectButton');
      modelSelectButton.dispatchEvent(new MouseEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        view: window
      }));
    }

    document.addEventListener('keydown', function (event) {
      log('keydown event:', event);
      if (event.altKey) {
        log('Alt key pressed');
        if (event.code.startsWith('Digit')) {
          const num = parseInt(event.code.slice(5), 10);
          log('Digit key pressed:', num);
          if (num >= 1 && num <= 5) {
            log('Calling selectDropdownItem with:', num);
            selectDropdownItem(num - 1)
          } else {
            log('Digit out of range:', num);
          }
        }
        if (event.key == "s") {
          log('Alt+S pressed');
          let searchButton = document.querySelector("form button:has(.lucide-globe)");
          log('searchButton:', searchButton);
          if (searchButton) {
            log('Clicking searchButton');
            searchButton.click()
          } else {
            log('searchButton not found');
          }
        }
      }
    });
    log('Script initialized');
  }, 500)
})();