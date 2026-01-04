// ==UserScript==
// @name         YouTube Transcript search
// @namespace    https://greasyfork.org/en/users/1436613-gosha305
// @version      2.1.1
// @license      MIT
// @description  Adds a search input box on top of the YouTube transcript. Press enter on it to only show lines containing the inputted search term.
// @author       gosha305
// @match        https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/528485/YouTube%20Transcript%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/528485/YouTube%20Transcript%20search.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const removeInnateTranscriptSearch = document.createElement("style");
  removeInnateTranscriptSearch.textContent = "ytd-transcript-search-box-renderer { display: none; }";
  document.head.appendChild(removeInnateTranscriptSearch);

  const inputContainer = document.createElement("div");
  inputContainer.style.padding = "10px";
  inputContainer.style.display = "block";
  inputContainer.classList.add("ytSearchboxComponentInput");

  const inputBox = document.createElement("input");
  inputBox.type = "text";
  inputBox.placeholder = "Search...";
  inputBox.style.color = "white";
  inputBox.style.backgroundColor = "black";
  inputBox.style.width = "90%";

  inputContainer.appendChild(inputBox);
  const secondaryInputContainer = inputContainer.cloneNode(true);
  const secondaryInputBox = secondaryInputContainer.firstChild;
  let segments;
  let headers;

  function search(filterWord) {
    segments.forEach((segment) => {
      if (!segment.textContent.toLowerCase().includes(filterWord)) {
        segment.style.display = "none";
      } else {
        segment.style.display = "flex";
      }
    });
    if (headers) {
      headers.forEach((header) => {
        if (!header.textContent.toLowerCase().includes(filterWord)) {
          header.style.display = "none";
        } else {
          header.style.display = "flex";
        }
      });
    }
  }

  function clearSearch() {
    segments.forEach((segment) => {
      segment.style.display = "flex";
    });
    if (headers) {
      headers.forEach((header) => {
        header.style.display = "flex";
      });
    }
  }

  const inputObserver = new MutationObserver(function () {
    if (inputContainer.getBoundingClientRect().width == 0 && secondaryInputContainer.getBoundingClientRect().width == 0) {
      return;
    }
    if (inputContainer.getBoundingClientRect().width != 0) {
      inputBox.value = "";
      inputBox.focus();
    }
    else {
      secondaryInputBox.value = "";
      secondaryInputBox.focus();
    }
    if (segments) { clearSearch() }
  });

  function detectTranscriptPanel() {
    if (
      document.querySelector(
        "ytd-engagement-panel-section-list-renderer:not([target-id])"
      ) && document.querySelector(
        "ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-searchable-transcript']"
      )
    ) {
      const transcriptPanel = document.querySelector(
        "ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-searchable-transcript']"
      )
      const secondaryTranscriptPanel = document.querySelector(
        "ytd-engagement-panel-section-list-renderer:not([target-id])"
      );
      secondaryTranscriptPanel.insertBefore(secondaryInputContainer, secondaryTranscriptPanel.querySelector("#content"));
      transcriptPanel.insertBefore(inputContainer, transcriptPanel.querySelector("#content"));
      inputObserver.observe(transcriptPanel, { attributes: true });
      inputObserver.observe(secondaryTranscriptPanel, { attributes: true });
    }
  }

  const documentObserver = new MutationObserver(() => {
    if (document.getElementById("panels")) {
      documentObserver.disconnect();
      const panelObserver = new MutationObserver(detectTranscriptPanel);
      panelObserver.observe(document.getElementById("panels"), { childList: true });
    }
  });
  documentObserver.observe(document.body, { childList: true, subtree: true });

  document.addEventListener("keydown", function (event) {
    if (document.activeElement === inputBox || document.activeElement === secondaryInputBox) {
      if (event.key === "Enter") {
        if (
          !segments
          || segments[0] != inputContainer?.parentElement?.querySelector(
            "div.segment.style-scope.ytd-transcript-segment-renderer"
          )
          && segments[0] != secondaryInputContainer?.parentElement?.querySelector(
            "div.segment.style-scope.ytd-transcript-segment-renderer"
          )
        ) {
          segments = document.querySelectorAll(
            "div.segment.style-scope.ytd-transcript-segment-renderer"
          );
          headers = document.querySelectorAll(
            "div.ytd-transcript-section-header-renderer"
          );
        }
        const filterWord = inputBox.value.trim().toLowerCase() || secondaryInputBox.value.trim().toLowerCase();
        if (!filterWord) {
          clearSearch();
        } else {
          search(filterWord);
        }
      }
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key == "Escape") {
      if (document.activeElement === inputBox) inputBox.blur();
      if (document.activeElement === secondaryInputBox) secondaryInputBox.blur();
    }
  });
})();
