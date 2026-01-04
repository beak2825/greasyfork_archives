// ==UserScript==
// @name        WiderMoodle
// @description This is your new file, start writing code
// @match        https://moodle.tu-dortmund.de/*
// @version 0.0.1.20250113212548
// @namespace https://greasyfork.org/users/1422973
// @downloadURL https://update.greasyfork.org/scripts/523693/WiderMoodle.user.js
// @updateURL https://update.greasyfork.org/scripts/523693/WiderMoodle.meta.js
// ==/UserScript==
(function() {
    function applyStyles() {
        var mainInnerElements = document.querySelectorAll('.main-inner');
        if (mainInnerElements.length === 0) {
        } else {
        }

        mainInnerElements.forEach(function(element) {
            element.style.maxWidth = '100%';
            element.style.paddingLeft = '1rem';
            element.style.paddingRight = '1rem';
        });
    }

    // Check if DOM is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        applyStyles();
    } else {
        document.addEventListener('DOMContentLoaded', applyStyles);
    }
})();
