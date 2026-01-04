// ==UserScript==
// @name         WaniKani Dashboard Progress Sorter
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Sorts the items on WaniKani based on their completion
// @author       Gorbit99
// @include      /^https://(preview\.|www\.)?wanikani.com/(dashboard)?$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441938/WaniKani%20Dashboard%20Progress%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/441938/WaniKani%20Dashboard%20Progress%20Sorter.meta.js
// ==/UserScript==
'use strict';

(function() {
  [...document.querySelectorAll(".level-progress-dashboard__items")].forEach((container) => {
    const entries = [...container.querySelectorAll(".level-progress-dashboard__item")];
    entries.sort((a, b) =>
      b.querySelectorAll(".subject-srs-progress__stages--complete").length - a.querySelectorAll(".subject-srs-progress__stages--complete").length
    );

    entries.forEach((entry) => container.append(entry));
  });
})();