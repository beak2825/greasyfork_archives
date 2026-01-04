// ==UserScript==
// @name         Rippling expand app review
// @namespace    http://tampermonkey.net/
// @version      2025-01-15.0
// @description  Expand the application review, highlight some answers, add quick reject and shortlist buttons
// @author       You
// @match        https://app.rippling.com/ats/job-requisitions/*/applicants/review/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rippling.com
// @grant        none
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/523071/Rippling%20expand%20app%20review.user.js
// @updateURL https://update.greasyfork.org/scripts/523071/Rippling%20expand%20app%20review.meta.js
// ==/UserScript==

(function () {
  ("use strict");

  // generic async action performer with retries
  var performAction = async ({
    callback,
    waitMs,
    checkCanStartFn,
    name,
    selector,
    selectorIncludes,
  }) => {
    return new Promise((resolve, reject) => {
      var checkTimer = undefined;
      var doProcess = () => {
        if (
          (!checkCanStartFn ||
            checkCanStartFn(document.querySelector(selector))) &&
          (!selector ||
            (document.querySelector(selector) &&
              (!selectorIncludes ||
                document
                  .querySelector(selector)
                  .textContent.toLowerCase()
                  .includes(selectorIncludes.toLowerCase()))))
        ) {
          try {
            console.log(`performing action: ${name}`);
            callback(document.querySelector(selector));
          } catch (e) {
            reject(e);
            return;
          } finally {
            if (checkTimer) {
              clearInterval(checkTimer);
            }
          }
          resolve();
        } else {
          // wait again
          console.log(`waiting to perform action: ${name}`);
        }
      };
      if (waitMs) {
        checkTimer = setInterval(doProcess, waitMs);
      } else {
        doProcess();
      }
    });
  };

  var markAnswerStyle = (answer, correct) => {
    answer.style.padding = ".5em 1em";
    answer.style.color = "white";
    answer.style.borderRadius = ".5em";
    if (correct) {
      answer.style.backgroundColor = "green";
    } else {
      answer.style.backgroundColor = "red";
    }
  };
  var superReject = async () => {
    await performAction({
      name: "main reject",
      selector: '[data-testid="No-reject"]',
      selectorIncludes: "reject",
      callback: (rejectBtn) => {
        rejectBtn.click();
      },
      waitMs: 500,
    });

    if (
      !document.querySelector(
        '[data-testid="rejectionReason"] [data-input="select-search-input"]'
      ).value
    ) {
      alert(
        "You must reject at least one candidate in this session before using Quick Reject"
      );
      return;
    }
    await performAction({
      name: "popup reject",
      selector: '[data-testid="Reject Candidate"]',
      selectorIncludes: "reject",
      callback: (rejectBtn2) => {
        rejectBtn2.click();
      },
      waitMs: 500,
      checkCanStartFn: (rejectBtn2) => {
        return rejectBtn2.getAttribute("data-disabled") !== "true";
      },
    });

    await performAction({
      name: "close",
      selector: 'button[aria-label="Close Dialog"]',
      callback: (closeBtn) => {
        closeBtn.click();
      },
      waitMs: 500,
      checkCanStartFn: (closeBtn) => closeBtn,
    });

    await performAction({
      name: "skip",
      selector: '[data-testid="Skip"]',
      selectorIncludes: "skip",
      callback: (skipBtn) => {
        skipBtn.click();
      },
      waitMs: 500,
    });
  };
  var shortlist = async () => {
    await performAction({
      name: "priority",
      selector: ':not(button[aria-label="Add Tag"]) > [data-icon="ADD"]',
      callback: (priorityBtn) => {
        priorityBtn.click();
      },
      waitMs: 500,
    });

    await performAction({
      name: "skip",
      selector: '[data-testid="Skip"]',
      selectorIncludes: "skip",
      callback: (skipBtn) => {
        skipBtn.click();
      },
      waitMs: 500,
    });
  };

  var process = () => {
    var expandBtn = document.querySelector('[data-testid="Expand"]');
    if (expandBtn && expandBtn.textContent.toLowerCase().includes("expand")) {
      expandBtn.click();
    }

    var responses =
      document.querySelector('[data-testid="textclip"]')?.children || [];
    [...responses].forEach((item) => {
      var question = item.querySelector("h6");
      var answer = item.querySelector("p");
      if (question.textContent.toLowerCase().includes("authorized to work")) {
        markAnswerStyle(
          answer,
          answer.textContent.toLowerCase().includes("yes")
        );
      }
      if (question.textContent.toLowerCase().includes("require sponsorship")) {
        markAnswerStyle(
          answer,
          answer.textContent.toLowerCase().includes("no")
        );
      }
      if (question.textContent.toLowerCase().includes("currently reside")) {
        markAnswerStyle(
          answer,
          answer.textContent.toLowerCase().includes("yes")
        );
      }
    });

    var rejectBtn = document.querySelector('[data-testid="No-reject"]');
    if (
      !document.querySelector("#super-reject") &&
      rejectBtn &&
      rejectBtn.textContent.toLowerCase().includes("reject")
    ) {
      var newSuperRejectBtn = document.createElement("button");
      newSuperRejectBtn.classList = rejectBtn.classList;
      newSuperRejectBtn.style.fontWeight = "bold";
      newSuperRejectBtn.id = "super-reject";
      newSuperRejectBtn.innerHTML = "Quick Reject";

      newSuperRejectBtn.addEventListener("click", superReject);

      rejectBtn.parentElement.appendChild(newSuperRejectBtn);
    }

    if (!document.querySelector("#shortlist") && rejectBtn) {
      var skipBtn = document.querySelector('[data-testid="Skip"]');
      if (skipBtn && skipBtn.textContent.toLowerCase().includes("skip")) {
        var newShortlistBtn = document.createElement("button");
        newShortlistBtn.classList = skipBtn.classList;
        newShortlistBtn.style.fontWeight = "bold";
        newShortlistBtn.style.flex = "1";
        newShortlistBtn.id = "shortlist";
        newShortlistBtn.innerHTML = "Shortlist";

        newShortlistBtn.addEventListener("click", shortlist);

        rejectBtn.parentElement.appendChild(newShortlistBtn);
      }
    }
  };

  setInterval(process, 1000);
})();
