// ==UserScript==
// @name         YouTube Code Highlighter
// @namespace    https://greasyfork.org/ru/users/901750-gooseob
// @version      1.1.2
// @description  Highlight code in YouTube comments
// @author       GooseOb
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/505024/YouTube%20Code%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/505024/YouTube%20Code%20Highlighter.meta.js
// ==/UserScript==

(function(){// index.ts
var until = (getItem, check, msToWait = 1e4, msReqTimeout = 20) => new Promise((res, rej) => {
  const reqLimit = msToWait / msReqTimeout;
  let i = 0;
  const interval = setInterval(() => {
    if (i++ > reqLimit)
      exit(rej);
    const item = getItem();
    if (!check(item))
      return;
    exit(() => res(item));
  }, msReqTimeout);
  const exit = (cb) => {
    clearInterval(interval);
    cb();
  };
});
var untilAppear = (getItem, msToWait) => until(getItem, Boolean, msToWait);
untilAppear(() => document.getElementById("comments")).then((comments) => {
  let isCSSLoaded = false;
  const visitedComments = new Set;
  const loadCSS = () => {
    fetch("https://cdn.jsdelivr.net/npm/highlight.js/styles/atom-one-dark.css").then((r) => r.text()).then((cssText) => {
      const style = document.createElement("style");
      style.innerHTML = cssText;
      document.head.appendChild(style);
    });
  };
  const _highlighter = {
    createHTML: (code) => code.replace(/```(\S*)\n(.+?)```/gs, (_$0, $1, $2) => `<code>\`\`\`${$1}
${($1 ? hljs.highlight($2, { language: $1 }) : hljs.highlightAuto($2)).value}\`\`\`</code>`)
  };
  const highlighter = window.trustedTypes?.createPolicy?.("highlightedCode", _highlighter) || _highlighter;
  setInterval(() => {
    for (const comment of comments.querySelectorAll("ytd-comment-view-model #content .yt-core-attributed-string")) {
      if (!visitedComments.has(comment) && /```\S*\n/.test(comment.textContent)) {
        visitedComments.add(comment);
        if (!isCSSLoaded) {
          loadCSS();
          isCSSLoaded = true;
        }
        comment.innerHTML = highlighter.createHTML(comment.textContent);
      }
    }
  }, 3000);
  document.addEventListener("yt-navigate-finish", () => {
    visitedComments.clear();
  });
});
})()