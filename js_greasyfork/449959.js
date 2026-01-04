// ==UserScript==
// @name        LeetCode Contest: Open All Problems
// @namespace   JohnZhu04
// @match       https://leetcode.com/contest/*-contest-*/
// @grant       none
// @version     1.1
// @author      JohnZhu04
// @license     MIT
// @supportURL  https://github.com/JohnZhu04/LeetScript/issues
// @icon        https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @exclude     https://leetcode.com/contest/*/problems/*/
// @description Add an "Open All Problems" button on the LeetCode Contest page. Note that Pop-up windows need to be allowed in the web browser.
// @downloadURL https://update.greasyfork.org/scripts/449959/LeetCode%20Contest%3A%20Open%20All%20Problems.user.js
// @updateURL https://update.greasyfork.org/scripts/449959/LeetCode%20Contest%3A%20Open%20All%20Problems.meta.js
// ==/UserScript==

const openAllProblems = () => {
  const problemsClass = "ul.contest-question-list li a";
  const problems = document.querySelectorAll(problemsClass);
  // console.log(problems.length);
  problems.forEach((problem) => {
    window.open(problem.href);
  });
};

const main = () => {
  const whichClass = ".col-md-6";
  const buttonClass = "btn btn-default panel-hover";
  const buttonText = "Open All Problems";
  if (document.querySelector(whichClass) === null) {
    // wait for the page to load
    window.setTimeout(main, 2000);
  }
  const button = document.createElement("button");
  button.innerText = buttonText;
  button.addEventListener("click", openAllProblems);
  button.className = buttonClass;
  document.querySelector(whichClass).appendChild(button);
};

main();
