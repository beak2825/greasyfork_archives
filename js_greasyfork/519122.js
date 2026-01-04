// ==UserScript==
// @name         NEU evaluatevl
// @namespace    http://tampermonkey.net/
// @version      2024-11-30
// @description  neu 评教助手
// @author       yukaChen
// @match        http://210.30.204.138/school/proj/evaluatevl-0/module/task/org/*/mytask*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=204.138
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519122/NEU%20evaluatevl.user.js
// @updateURL https://update.greasyfork.org/scripts/519122/NEU%20evaluatevl.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const currentUrl = window.location.href;
  let urlArr = currentUrl.split("/");

  function delay(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
  async function evaluate() {
    console.log("start evaluating....");
    let tableRows = document.querySelectorAll("tr"); // btw I don't know why someone still use <table> tag today XD
    let saveResultBtn = document.querySelector("#btn-saveResult"); // the The second to last to submit

    function checkAllRadio(tableRows) {
      tableRows.forEach((item) => {
        const itemChildren = item.children;
        // console.log(itemChildren.length);
        if (itemChildren.length > 5) {
          Array.from(itemChildren).forEach((child, index) => {
            // what index equals to will be varied based on many things.......
            // basically, it matched the scores you give your teacher
            if (index === 4) {
              const inputButton = child.querySelector("input[type='radio']");
              // console.log(child);
              if (inputButton) {
                // console.log(inputButton);
                inputButton.click();
              }
            }
          });
        }
      });
    }
    async function submitResult(saveResultBtn) {
      saveResultBtn.click();
      await delay(1 * 500);
      let confirmBtn = document.querySelector("button.confirm"); // confirm button, it's not on the dom
      confirmBtn.click();
    }

    function next() {
      let returnBtn = document.querySelector("#btn-goBack");
      returnBtn.click();
    }
    checkAllRadio(tableRows);
    await delay(1 * 1000);
    submitResult(saveResultBtn);
    await delay(1 * 1000);
    next();
  }

  function startNextEvaluate() {
    console.log("start next evaluating....");
    let startButton = document.querySelector("a.btn-primary");
    if (startButton) {
      startButton.click();
    }
  }

  function main() {
    // usually, there is a detail path (/detail/...) in evaluate page
    if (urlArr.find((item) => item === "detail")) {
      setTimeout(evaluate, 1 * 1000);
    } else {
      setTimeout(startNextEvaluate, 1 * 1000);
    }
  }
  setTimeout(main, 2 * 1000);
})();