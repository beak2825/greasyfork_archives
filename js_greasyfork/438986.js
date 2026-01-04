// ==UserScript==
// @name         github-copy-title-link
// @namespace    https://github.com
// @version      0.0.2
// @description  Copy the title and URL of the Pull request and Issue pages. Then, you can paste them directly into Google Docs.
// @include      /^https://github.com/.*/
// @author       proshunsuke
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438986/github-copy-title-link.user.js
// @updateURL https://update.greasyfork.org/scripts/438986/github-copy-title-link.meta.js
// ==/UserScript==
(() => {
  // pnp:/home/pro_shunsuke/Documents/github-copy-title-link/src/feedback.ts
  var duration = 2e3;
  var feedback = (copyElement2) => {
    const message = copyElement2.getAttribute("data-copy-feedback");
    if (!message)
      return;
    const originalLabel = copyElement2.getAttribute("aria-label");
    const direction = copyElement2.getAttribute("data-tooltip-direction") || "s";
    copyElement2.setAttribute("aria-label", message);
    copyElement2.classList.add("tooltipped", `tooltipped-${direction}`);
    if (!(copyElement2 instanceof HTMLElement))
      return;
    setTimeout(() => {
      if (originalLabel) {
        copyElement2.setAttribute("aria-label", originalLabel);
      } else {
        copyElement2.removeAttribute("aria-label");
      }
      copyElement2.classList.remove("tooltipped", `tooltipped-${direction}`);
    }, duration);
  };

  // pnp:/home/pro_shunsuke/Documents/github-copy-title-link/src/copy.ts
  var createNode = (copyElement2, title, url) => {
    const node = document.createElement("a");
    node.href = url;
    node.style.textDecoration = "underline";
    node.style.color = "#1155cc";
    node.style.fontSize = "14.63px";
    node.appendChild(document.createTextNode(title));
    return node;
  };
  var copyTitleLink = (copyElement2) => {
    const body = document.body;
    if (!body)
      return Promise.reject(new Error());
    const titleElement = document.querySelector(".js-issue-title");
    if (!titleElement)
      return Promise.reject(new Error());
    const title = titleElement.innerText.trim();
    const url = location.href.replace(/\/pull\/(\d*).*/g, "/pull/$1");
    const node = createNode(copyElement2, title, url);
    body.appendChild(node);
    const range = document.createRange();
    range.selectNodeContents(node);
    const selection = window.getSelection();
    if (!selection)
      return Promise.reject(new Error());
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    node.remove();
    return Promise.resolve();
  };
  var copy = (event) => {
    const copyElement2 = event.currentTarget;
    if (!(copyElement2 instanceof HTMLDivElement))
      return;
    copyTitleLink(copyElement2).then(() => feedback(copyElement2)).catch(() => {
    });
  };

  // pnp:/home/pro_shunsuke/Documents/github-copy-title-link/src/index.ts
  var createCopyTitleLinkElement = () => {
    const copyElement2 = document.createElement("div");
    copyElement2.setAttribute("data-copy-feedback", "Copied!");
    copyElement2.setAttribute("tabindex", "0");
    copyElement2.setAttribute("role", "button");
    copyElement2.innerHTML = "Copy title link";
    return copyElement2;
  };
  var appendNodeToHeader = (copyElement2) => {
    const aTag = document.createElement("a");
    aTag.classList.add("js-selected-navigation-item", "Header-link", "mt-md-n3", "mb-md-n3", "py-2", "py-md-3", "mr-0", "mr-md-3", "border-top", "border-md-top-0", "border-white-fade");
    aTag.setAttribute("href", "#");
    aTag.appendChild(copyElement2);
    const ariaGlobalSel = document.querySelectorAll("[aria-label=Global]")[0];
    ariaGlobalSel.appendChild(aTag);
  };
  var copyElement = createCopyTitleLinkElement();
  appendNodeToHeader(copyElement);
  copyElement.addEventListener("click", copy);
})();
