// ==UserScript==
// @name         Jira Utils
// @namespace    http://tampermonkey.net/
// @version      2024-06-10
// @description  Adds a new line containing the issue name and code, below the summary field.
// @author       You
// @match        https://jira.nelogica.com.br/browse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nelogica.com.br
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497558/Jira%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/497558/Jira%20Utils.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const summaryH1 = document.querySelector("#summary-val");
  const issuePW =
    summaryH1.parentElement.querySelector(`a.issue-link`)?.textContent ?? "";
  const newDiv = document.createElement("div");

  summaryH1.insertAdjacentElement("afterend", newDiv);

  newDiv.innerHTML = `https://jira.nelogica.com.br/browse/${issuePW} - ${summaryH1.textContent}`;
})();
