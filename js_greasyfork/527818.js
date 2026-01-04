// ==UserScript==
// @name         Web Archive Helper
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Add options to search or save pages on web.archive.org and archive.today
// @author       maanimis
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527818/Web%20Archive%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/527818/Web%20Archive%20Helper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function showWebArchive(url) {
    GM_openInTab("https://web.archive.org/web/*/" + url, { active: true });
  }

  function saveWebArchive(url) {
    if (confirm("Do you want to save this page to Web Archive?")) {
      let form = document.createElement("form");
      form.method = "POST";
      form.action = "https://web.archive.org/save/";
      form.target = "_blank";

      let inputs = [
        { name: "url", value: url },
        { name: "capture_outlinks", value: "1" },
        { name: "capture_all", value: "on" },
        { name: "capture_screenshot", value: "on" },
      ];

      inputs.forEach((data) => {
        let input = document.createElement("input");
        input.type = "hidden";
        input.name = data.name;
        input.value = data.value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    }
  }

  function showArchiveToday(url) {
    GM_openInTab("https://archive.today/search/?q=" + encodeURIComponent(url), {
      active: true,
    });
  }

  function saveArchiveToday(url) {
    GM_openInTab(
      "https://archive.today/?run=1&url=" + encodeURIComponent(url),
      { active: true }
    );
  }

  function saveInBoth(url) {
    saveWebArchive(url);
    saveArchiveToday(url);
  }

  function searchInBoth(url) {
    showWebArchive(url);
    showArchiveToday(url);
  }

  // Web Archive Commands
  GM_registerMenuCommand("Web Archive: Show this page", function () {
    showWebArchive(window.location.href);
  });

  GM_registerMenuCommand("Web Archive: Save this page", function () {
    saveWebArchive(window.location.href);
  });

  // Archive.today Commands
  GM_registerMenuCommand("Archive.today: Search this page", function () {
    showArchiveToday(window.location.href);
  });

  GM_registerMenuCommand("Archive.today: Save this page", function () {
    saveArchiveToday(window.location.href);
  });

  GM_registerMenuCommand("===============", () => {});

  GM_registerMenuCommand("Save on Both Archives", function () {
    saveInBoth(window.location.href);
  });

  GM_registerMenuCommand("Search on Both Archives", function () {
    searchInBoth(window.location.href);
  });
})();
