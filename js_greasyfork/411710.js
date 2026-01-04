// ==UserScript==
// @name         Zhipin Greet Helper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  BOSS直聘打招呼助手
// @author       Hanai
// @match        https://www.zhipin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411710/Zhipin%20Greet%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/411710/Zhipin%20Greet%20Helper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var matches = function (el, selector) {
    return (
      el.matches ||
      el.matchesSelector ||
      el.msMatchesSelector ||
      el.mozMatchesSelector ||
      el.webkitMatchesSelector ||
      el.oMatchesSelector
    ).call(el, selector);
  };

  var closest = (el, selector) => {
    while (el.parentNode) {
      el = el.parentNode;
      if (matches(el, selector)) {
        return el;
      }
    }
    return null;
  };

  setInterval(() => {
    if (document.querySelector(".recommend-card-list")) {
      const list = document.querySelector(".recommend-card-list");
      const els = list.querySelectorAll(".label-text");
      Array.prototype.filter
        .call(els, (el) => {
          return el.textContent === "大专";
        })
        .forEach((el) => {
          const card = closest(el, "li");
          card.parentNode.removeChild(card);
        });
    }

    if (document.querySelectorAll(".resume-dialog").length) {
      const dialog = document.querySelectorAll(".resume-dialog")[0];
      let jobCount = 0;
      let workYear = 0;

      let els;
      els = dialog.querySelectorAll(".resume-dialog .jobs:not(.education)");
      if (els.length) {
        jobCount = els[0].querySelectorAll("li").length;
      }
      // console.log(jobCount)

      els = dialog.querySelectorAll(".label-text");
      els = Array.prototype.filter.call(els, (el) => {
        return /\d+年/.test(el.textContent);
      });
      if (els.length) {
        workYear = els[0].textContent.match(/(\d+)年/)[1];
      }
      // console.log(workYear)

      if (
        (workYear == 1 && jobCount > 1) ||
        ((workYear > 1 && jobCount > 1) && (jobCount / workYear > 0.7))
      ) {
        dialog.querySelector(
          ".dialog-container .resume-item.item-base"
        ).style.backgroundColor = "red";
      }
    }
  }, 1000);

  const keyStack = [];
  let timer;

  document.addEventListener("keydown", (e) => {
    if (timer) {
      clearTimeout(timer);
    }

    keyStack.push(e.key);

    if (
      e.key === "C" &&
      keyStack.slice(-2, keyStack.length).every((e) => e === "C")
    ) {
      document
        .querySelector(
          ".resume-dialog .dialog-container .dialog-body .btn.btn-greet"
        )
        .click();
      keyStack.splice(0, keyStack.length);
    } else if (e.key === "Escape") {
      Array.prototype.forEach.call(
        document.querySelectorAll(".resume-dialog .close"),
        (el) => {
          el.click();
        }
      );
      keyStack.splice(0, keyStack.length);
    } else {
      timer = setTimeout(() => {
        keyStack.splice(0, keyStack.length);
      }, 1000);
    }
  });
})();
