// ==UserScript==
// @name         mention-link-right
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  mention link text align right
// @author       You
// @license       MIT
// @match        https://mm.paodingai.com/cheftin/channels/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/530161/mention-link-right.user.js
// @updateURL https://update.greasyfork.org/scripts/530161/mention-link-right.meta.js
// ==/UserScript==

(function () {
  "use strict";

  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      textAlignRight();
    }
  };

  function textAlignRight() {
    const targetNode = document.getElementsByTagName("body")[0];
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList) {
      for (let mutation of mutationsList) {
        const botTags = mutation.target.querySelectorAll(".BotTag");
        botTags.forEach((item) => {
          if (item.previousElementSibling.ariaLabel !== "ci") {
            const mentionLinks =
              item.parentNode.parentNode.parentNode.querySelectorAll(
                ".post-message__text [data-mention]"
              );
            mentionLinks.forEach((mentionLink) => {
              if (
                mentionLink &&
                mentionLink.parentNode.parentNode.parentNode.classList.contains(
                  "mention--highlight"
                )
              ) {
                mentionLink.parentNode.parentNode.parentNode.style.backgroundColor =
                  "transparent";
              }
              mentionLink.classList.add("mention-link-right");
            });
          }
        });
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
  }

  GM_addStyle(`
    .mention-link-right {
      float: right;
      opacity: 0.3;
    }
    .mention--highlight{
      .mention-link-right {
        background-color: var(--mention-highlight-bg);
        border-radius: 4px;
      }
    }
    .post-message__text{
      overflow: hidden;
    }
  `);
})();
