// ==UserScript==
// @name         谷歌学术自动复制 BiBTeX (Enhanced BibTeX Fetcher with Filtering and Highlighting)
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  Fetch and copy BibTeX citations from academic papers, with advanced filtering and highlighting
// @author       Apricity
// @match        https://scholar.google.com/*
// @match        https://scholar.googleusercontent.com/scholar.bib*
// @icon         https://scholar.google.com/favicon.ico
// @grant        GM_setClipboard
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/485856/%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AF%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%20BiBTeX%20%28Enhanced%20BibTeX%20Fetcher%20with%20Filtering%20and%20Highlighting%29.user.js
// @updateURL https://update.greasyfork.org/scripts/485856/%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AF%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%20BiBTeX%20%28Enhanced%20BibTeX%20Fetcher%20with%20Filtering%20and%20Highlighting%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function copyToClipboard(text) {
    GM_setClipboard(text, "text");
  }

  function endsWithAny(strings, url) {
    for (var i = 0; i < strings.length; i++) {
      if (url.endsWith(strings[i])) {
        return true;
      }
    }
    return false;
  }

  function containsAny(strings, url) {
    for (var i = 0; i < strings.length; i++) {
      if (url.includes(strings[i])) {
        return true;
      }
    }
    return false;
  }

  function processEntries() {
    // Select all entries
    var entries = document.querySelectorAll(".gs_ri");

    // Iterate over each entry
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];

      // Select the description element
      var description = entry.querySelector(".gs_a");

      // If the description exists and the URL ends with .edu, .de, .jp, or contains amazonaws, hide the entry
      if (
        description &&
        (endsWithAny([".edu", ".de", ".jp"], description.innerText) ||
          containsAny(
            ["amazonaws", "thetalkingmachines"],
            description.innerText
          ))
      ) {
        entry.parentNode.style.display = "none";
      }

      // If the description exists and the URL contains meethings, highlight the entry
      if (
        description &&
        containsAny(
          ["aclanthology.org", "openreview.net", "neurips.cc", "dl.acm.org"],
          description.innerText
        )
      ) {
        entry.parentNode.style.backgroundColor = "#e4efff";
      }
    }
  }

  if (window.location.href.includes("scholar.bib")) {
    // Wait for the BibTeX text to load, then copy it
    setTimeout(function () {
      var bibtexText = document.body.innerText;
      if (bibtexText) {
        copyToClipboard(bibtexText);
        alert("BibTeX citation copied to clipboard!");
      }
    }, 2000); // Adjust timing as needed
    return;
  }

  var logoLink = document.querySelector("#gs_hdr_lgo");
  if (logoLink && logoLink.href.includes("zh-CN")) {
    // Copy the first citation
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (!mutation.addedNodes) return;

        for (var i = 0; i < mutation.addedNodes.length; i++) {
          var node = mutation.addedNodes[i];
          var citationDiv = node.querySelector(".gs_citr");
          if (citationDiv) {
            // Copy the first citation
            var citationText = citationDiv.textContent;
            copyToClipboard(citationText);
            alert("Citation copied to clipboard!");
          }
        }
      });
    });
  } else {
    observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (!mutation.addedNodes) return;

        for (var i = 0; i < mutation.addedNodes.length; i++) {
          var node = mutation.addedNodes[i];
          var bibtexButton = node.querySelector("#gs_citi a.gs_citi");
          if (bibtexButton) {
            window.location.href = bibtexButton.href;
            observer.disconnect();
            return;
          }
        }
      });
    });
  }

  processEntries();
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
  var processObserver = new MutationObserver(processEntries);
  processObserver.observe(document.body, { childList: true, subtree: true });
})();
