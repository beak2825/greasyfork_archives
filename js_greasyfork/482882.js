// ==UserScript==
// @name         Restore old codeforces languages
// @version      20240128.09.52
// @namespace    http://tampermonkey.net/
// @description  Restore codeforces old languages status filter
// @author       nullchilly
// @license      MIT
// @match        *://*.codeforces.com/*
// @downloadURL https://update.greasyfork.org/scripts/482882/Restore%20old%20codeforces%20languages.user.js
// @updateURL https://update.greasyfork.org/scripts/482882/Restore%20old%20codeforces%20languages.meta.js
// ==/UserScript==

(function() {
    let filter = document.querySelector("#programTypeForInvoker");
    [
        ["c.gcc", "GNU C"],
        ["cpp.g++", "GNU C++"],
        ["cpp.g++0x", "GNU C++0x"],
        ["cpp.g++11", "GNU C++11"],
        ["cpp.g++14", "GNU C++14"],
        ["java11", "Java 11"],
        ["java17", "Java 17"],
        ["kotlin15", "Kotlin 1.5"],
        ["kotlin16", "Kotlin 1.6"]
    ].forEach(function(optionData) {
        let option = document.createElement("option");
        option.value = optionData[0];
        option.textContent = optionData[1];
        filter.appendChild(option);
    });
})();