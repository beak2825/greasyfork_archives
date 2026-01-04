// ==UserScript==
// @name         Get Random Github Issue
// @namespace    https://github.com/veryCrunchy/random-issue-user-script
// @version      1.0.0
// @description  Adds a button to get random github issues from the repo you're on, respects your filter options
// @author       veryCrunchy
// @contributors joerkig
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486096/Get%20Random%20Github%20Issue.user.js
// @updateURL https://update.greasyfork.org/scripts/486096/Get%20Random%20Github%20Issue.meta.js
// ==/UserScript==

(function () {
  "use strict";
  (() => {
    const oldPushState = history.pushState;
    history.pushState = function pushState() {
      const ret = oldPushState.apply(this, arguments);
      window.dispatchEvent(new Event("pushstate"));
      window.dispatchEvent(new Event("locationchange"));
      return ret;
    };

    const oldReplaceState = history.replaceState;
    history.replaceState = function replaceState() {
      const ret = oldReplaceState.apply(this, arguments);
      window.dispatchEvent(new Event("replacestate"));
      window.dispatchEvent(new Event("locationchange"));
      return ret;
    };

    window.addEventListener("popstate", () => {
      window.dispatchEvent(new Event("locationchange"));
    });
  })();

  window.addEventListener("locationchange", function () {
    const { pathname, hash } = document.location;
    const searchParams = new URLSearchParams(window.location.search);
    function getRandomNumber(max) {
      return Math.floor(Math.random() * Number(max));
    }

    if (hash === "#randomPage") {
      randomPage();
    }
    if (hash.startsWith("#randomIssue")) {
      randomIssue();
    }

    function randomIssue() {
      const randomIssue = getRandomNumber(
        document.querySelectorAll("div[id^='issue_']").length
      );
      window.location.href =
        document
          .querySelectorAll("div[id^='issue_']")
          [randomIssue].querySelector("div > a").href +
        "?" +
        searchParams;
    }
    function randomPage() {
      console.log(
        document.querySelector(".next_page")?.previousSibling?.previousSibling
          ?.text
      );
      const randomNumber = getRandomNumber(
        document.querySelector(".next_page")?.previousSibling?.previousSibling
          ?.text || 1
      );
      searchParams.set("page", randomNumber + 1);
      window.location.href = pathname + "?" + searchParams + "#randomIssue";
    }
    const newButton = document.createElement("button");
    const defaultButton = document.querySelector(".Button--primary");
    newButton.textContent = "Random issue";
    newButton.id = "randomIssueButton";
    newButton.classList.add(
      "Button--secondary",
      "Button--medium",
      "subnav-item"
    );
    if (!document.querySelector("#randomIssueButton")) {
      if (pathname.match(/\/issues\/?$/)) {
        newButton.onclick = function () {
          randomPage();
        };
        document
          .querySelector(".Button--primary")
          .parentElement?.prepend(newButton);
        document.querySelector(".Button--primary").classList.remove("Button");
        document.querySelector(".Button--primary").classList.add("subnav-item");
      } else if (pathname.match(/\/issues\/(\d+)/)) {
        newButton.onclick = function () {
          window.location.href =
            pathname.replace(/\/issues\/(\d+)/, "/issues") +
            "?" +
            searchParams +
            "#randomPage";
        };
        defaultButton.parentElement.classList.remove("gap-1");
        defaultButton.parentElement?.prepend(newButton);
        defaultButton.classList.remove("Button", "Button--small");
        defaultButton.classList.add("Button--medium", "subnav-item");
        defaultButton.nextElementSibling.remove();
      }
    }
  });
})();
