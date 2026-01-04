// ==UserScript==
// @name         Hacker News Double Click Collapse and Better Styles
// @namespace    https://greasyfork.org/en/users/1019658-aayush-dutt
// @version      2.1
// @description  A user script to enchance Hacker News page styles
// @author       aayushdutt
// @match        https://news.ycombinator.com/*
// @grant        none
// @link         https://greasyfork.org/en/scripts/459217-better-hackernews-styles
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459217/Hacker%20News%20Double%20Click%20Collapse%20and%20Better%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/459217/Hacker%20News%20Double%20Click%20Collapse%20and%20Better%20Styles.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const styles = `<style>
    .comment,
    .toptext,
    .subtext,
    .spacer {
        font-size: 15px;
        line-height: 1.5;
    }

    .toptext {
      color: black;
    }

    .title {
        font-size: 16px;
    }

    .title a:hover {
      text-decoration: underline;
    }

    .comhead,
    .pagetop {
        font-size: 14px;
        line-height: 1.5;
    }

    .spacer {
      height: 12px !important;
    }

    td > table {
      padding-left: 14px;
    }
  </style>`;

  document.head.insertAdjacentHTML("beforeend", styles);

  document.querySelectorAll(".comtr").forEach((comment) => {
    let collapseTimeout = null;

    comment.addEventListener("dblclick", function (e) {
      const commentId = this.id;
      const toggler = document.querySelector(`a.togg[id="${commentId}"]`);

      if (toggler) {
        // Use a small timeout to allow text selection to complete
        clearTimeout(collapseTimeout);
        collapseTimeout = setTimeout(() => {
          toggler.click();
        }, 50);
      }
    });

    // Add subtle hover effect
    comment.style.transition = "background-color 0.3s ease";
    comment.addEventListener("mouseenter", () => {
      comment.style.backgroundColor = "rgba(255,102,0,0.03)";
    });
    comment.addEventListener("mouseleave", () => {
      comment.style.backgroundColor = "";
    });
  });

  // Add style for visual feedback
  const style = document.createElement("style");
  style.textContent = `
        .comtr {
            position: relative;
            border-radius: 3px;
        }
        .comtr:hover:after {
            content: '';
            position: absolute;
            left: -8px;
            top: 0;
            height: 100%;
            width: 3px;
            background: rgba(255,102,0,0.3);
        }
    `;
  document.head.appendChild(style);
})();
