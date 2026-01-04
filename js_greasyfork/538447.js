// ==UserScript==
// @name         RatingGraph keyboard controls
// @version      0.3.0
// @description  Control the search bar, suggestion list, and result grid entirely with the keyboard on RatingGraph
// @author       CennoxX
// @namespace    https://greasyfork.org/users/21515
// @homepage     https://github.com/CennoxX/userscripts
// @supportURL   https://github.com/CennoxX/userscripts/issues/new?title=[RatingGraph%20keyboard%20controls]%20
// @match        https://www.ratingraph.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ratingraph.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538447/RatingGraph%20keyboard%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/538447/RatingGraph%20keyboard%20controls.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
/* eslint curly: "off" */

(function() {
    "use strict";
    var currentIndex = -1;
    var search = document.querySelector("#search");
    var styleTag = document.createElement("style");
    styleTag.textContent = `
.results a.selected {
  background: #ffeebb;
  box-shadow: inset 4px 0 0 #e04e4e;
}
.titles.results a:focus span {
  color: black;
  background: #ffeebb;
  box-shadow: inset 4px 0 0 #e04e4e;
}
`;
    document.head.appendChild(styleTag);
    document.querySelector(".titles.results a")?.focus();

    document.addEventListener("keydown", (e) => {
        if (e.key == "q" && e.ctrlKey) {
            search.focus();
        } else if (e.key == "Escape") {
            search.blur();
            document.querySelector(".titles.results a")?.focus();
        }
    });

    document.querySelector(".titles.results")?.addEventListener("keydown", (e) => {
        if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key))
            return;
        var focusables = [...document.querySelectorAll(".titles.results a")].filter(el => el.offsetParent);
        var idx = focusables.indexOf(document.activeElement);
        if (idx == -1)
            idx = 0;
        switch (e.key) {
            case "ArrowRight":
                idx++;
                break;
            case "ArrowLeft":
                idx--;
                break;
            case "ArrowDown":
                idx = idx + 7 < focusables.length ? idx + 7 : idx % 7;
                break;
            case "ArrowUp":
                if (idx - 7 >= 0) idx -= 7;
                else {
                    var i = focusables.length - 1;
                    while (i % 7 !== idx % 7) i--;
                    idx = i;
                }
                break;
        }
        idx = (idx + focusables.length) % focusables.length;
        focusables[idx].focus();
        e.preventDefault();
    });

    search?.addEventListener("keydown", (e) => {
        var results = document.querySelectorAll("a.result");
        if (!results.length)
            return;
        if (e.key == "ArrowDown") {
            e.preventDefault();
            currentIndex = (currentIndex + 1) % results.length;
        } else if (e.key == "ArrowUp") {
            e.preventDefault();
            currentIndex = currentIndex <= 0 ? results.length - 1 : currentIndex - 1;
        } else if (e.key == "Enter") {
            e.preventDefault();
            results[(currentIndex == -1 ? results.length - 1 : currentIndex)].click();
        } else {
            currentIndex = -1;
        }
        updateSelection(results);
    });

    function updateSelection(results) {
        results.forEach((result, index) => { result.classList.toggle("selected", index == currentIndex) });
    }
})();