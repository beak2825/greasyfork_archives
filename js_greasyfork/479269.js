// ==UserScript==
// @name         FadBlock AD Block
// @name:zh-TW   FadBlock 贊助廣告過濾
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  remove the ad from FadBlock
// @description:zh-TW  移除 FadBlock 的贊助廣告
// @author       Archer_Wn
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @notice       If you are a supporter of the "FadBlock" plugin, please consider contributing on FadBlock's GitHub.
// @notice:zh-TW 如果你是 FadBlock 的支持者，請考慮在 FadBlock 的 GitHub 上貢獻。
// @downloadURL https://update.greasyfork.org/scripts/479269/FadBlock%20AD%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/479269/FadBlock%20AD%20Block.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // wait for the body to load
    waitForElement('body', 0).then(() => {
        main();
    });
    
    function main() {
        // observe the body for changes
        var target = document.querySelector('body');
        var observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length < 1) return;

                for (const node of mutation.addedNodes) {
                    if (node.nodeName !== 'DIALOG') continue;

                    // iter subnodes
                    for (const subnode of node.childNodes) {
                        // id contains 'fadblock-popup'
                        if (subnode.id.includes('fadblock-popup')) {
                            // remove the popup
                            node.remove();
                            break;
                        }
                    }
                }
            });
        });
        var config = { childList: true, characterData: true };
        observer.observe(target, config);
    }

})();

/**
 * Wait for an element before resolving a promise
 * @param {String} querySelector - Selector of element to wait for
 * @param {Integer} timeout - Milliseconds to wait before timing out, or 0 for no timeout
 * @returns {Promise}
 *
 * @ref https://stackoverflow.com/questions/34863788/how-to-check-if-an-element-has-been-loaded-on-a-page-before-running-a-script
 */
function waitForElement(querySelector, timeout) {
    return new Promise((resolve, reject) => {
      var timer = false;
      if (document.querySelectorAll(querySelector).length) return resolve();
      const observer = new MutationObserver(() => {
        if (document.querySelectorAll(querySelector).length) {
          observer.disconnect();
          if (timer !== false) clearTimeout(timer);
          return resolve();
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      if (timeout) {
        timer = setTimeout(() => {
          observer.disconnect();
          reject();
        }, timeout);
      }
    });
  }