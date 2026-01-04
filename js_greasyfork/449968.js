// ==UserScript==
// @name        LeetCode Contest: Open at leetcode.cn
// @namespace   JohnZhu04
// @match       https://leetcode.com/contest/*/problems/*
// @grant       none
// @version     1.0
// @author      JohnZhu04
// @license     MIT
// @supportURL  https://github.com/JohnZhu04/LeetScript/issues
// @icon        https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @description Add an "Open at LeetCode.cn" button on the LeetCode Contest page.
// @downloadURL https://update.greasyfork.org/scripts/449968/LeetCode%20Contest%3A%20Open%20at%20leetcodecn.user.js
// @updateURL https://update.greasyfork.org/scripts/449968/LeetCode%20Contest%3A%20Open%20at%20leetcodecn.meta.js
// ==/UserScript==

const openCNURL = () => {
  const url = window.location.href.replace("leetcode.com", "leetcode.cn");
  window.open(url);
};

const main = () => {
  const whichDiv = ".question-title";
  const buttonClass = "btn btn-default panel-hover";
  const buttonText = "Open at LeetCode.cn";
  if (!document.querySelector(whichDiv)) {
    window.setTimeout(main, 2000);
  }
  const button = document.createElement("button");
  button.innerText = buttonText;
  button.addEventListener("click", openCNURL);
  button.className = buttonClass;
  document.querySelector(whichDiv).appendChild(button);
};

main();
