// ==UserScript==
// @name         Trello Chronological Comment Order
// @namespace    https://github.com/sudokai
// @version      2023.07.24
// @description  Order Trello comments by ascending date
// @author       sudokai (https://github.com/sudokai)
// @match        https://trello.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390119/Trello%20Chronological%20Comment%20Order.user.js
// @updateURL https://update.greasyfork.org/scripts/390119/Trello%20Chronological%20Comment%20Order.meta.js
// ==/UserScript==

(function() {
  "use strict";

  function withDomReady(fn) {
    // If we're early to the party
    document.addEventListener("DOMContentLoaded", fn);
    // If late; I mean on time.
    if (
      document.readyState === "interactive" ||
      document.readyState === "complete"
    ) {
      fn();
    }
  }

  withDomReady(function() {
    const reverseCommentsCss = document.createElement("style");
    reverseCommentsCss.innerHTML = `
            .mod-card-back.reverse {
                display: flex;
                flex-direction: column-reverse;
            }
            .sort-comments-btn.reverse {
                background-color: #6C7A90;
                color: white;
            }
            .sort-comments-btn.reverse {
                background-color: #6C7A90;
                color: white !important;
            }
            .sort-comments-btn.reverse:hover {
                background: #7e8da5;
            }
        `;
    document.head.appendChild(reverseCommentsCss);

    const reverseCommentsBtn = document.createElement("a");
    reverseCommentsBtn.href = "#";
    reverseCommentsBtn.classList.add("subtle", "button", "sort-comments-btn");
    reverseCommentsBtn.innerHTML = "Oldest comments first";
    reverseCommentsBtn.addEventListener("click", function() {
      const commentList = document.querySelector(
        ".js-list-actions.mod-card-back"
      );
      commentList.classList.toggle("reverse");
      reverseCommentsBtn.classList.toggle("reverse");
      const isReversed = commentList.classList.contains("reverse");
      document.cookie =
        "reverse-comments=" +
        isReversed +
        "; path=/; domain=trello.com; max-age=31536000";
    });

    new MutationObserver(function(mutations, observer) {
      for (let mutation of mutations) {
        if (mutation.type === "childList") {
          if (
            (Array.prototype.filter.call(mutation.addedNodes, function(node) {
              return (
                node.classList && node.classList.contains("window-main-col")
              );
            }).length > 0 ||
              mutation.target.classList.contains("window-main-col")) &&
            !mutation.target.classList.contains("sort-comments-btn-added")
          ) {
            const btnContainer = Array.prototype.slice.call(
              mutation.target.querySelectorAll(".window-module-title-options"),
              -1
            )[0];
            if (btnContainer) {
              for (let cookie of document.cookie.split(";")) {
                const [name, value] = cookie.split("=");
                if (name.trim() === "reverse-comments") {
                  const commentList = document.querySelector(
                    ".js-list-actions.mod-card-back"
                  );
                  if (value === "true") {
                    reverseCommentsBtn.classList.add("reverse");
                    commentList.classList.add("reverse");
                  } else {
                    reverseCommentsBtn.classList.remove("reverse");
                    commentList.classList.remove("reverse");
                  }
                }
              }
              btnContainer.prepend(reverseCommentsBtn);
              mutation.target.classList.add("sort-comments-btn-added");
              break;
            }
          }
        }
      }
    }).observe(document.querySelector("body"), {
      childList: true,
      subtree: true
    });
  });
})();
