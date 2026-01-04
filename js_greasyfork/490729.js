// ==UserScript==
// @name         AO3 Spacing Adjuster
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows removal and re-addition of line breaks on AO3 work pages.
// @author       futureaceofkarasuno
// @match        https?://archiveofourown\.org/.*works/\d+/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490729/AO3%20Spacing%20Adjuster.user.js
// @updateURL https://update.greasyfork.org/scripts/490729/AO3%20Spacing%20Adjuster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove extra line breaks
    function removeLineBreaks() {
        var chapterContent = document.getElementById('chapters');
        if (chapterContent) {
            chapterContent.innerHTML = chapterContent.innerHTML.replace(/<br>\s*<br>/g, '<br>');
        }
    }

    // Function to add extra line breaks
    function addLineBreaks() {
        var chapterContent = document.getElementById('chapters');
        if (chapterContent) {
            chapterContent.innerHTML = chapterContent.innerHTML.replace(/<br>/g, '<br><br>');
        }
    }

    // Create the dropdown menu
    var menu = document.createElement('div');
    menu.innerHTML = `
<div class="ao3ft-menu" style="position: fixed; top: 20px; right: 20px; background-color: white; border: 1px solid black; padding: 5px; z-index: 1000;">
  <select id="ao3ft-select">
    <option value="">Select Format Option</option>
    <option value="removeLB">Remove Line Breaks</option>
    <option value="addLB">Add Line Breaks</option>
  </select>
</div>
`;

    document.body.appendChild(menu); // Append the menu to the body

    // Add event listener to the select element
    document.getElementById('ao3ft-select').addEventListener('change', function() {
        var selectedOption = this.value;
        if (selectedOption === 'removeLB') {
            removeLineBreaks();
        } else if (selectedOption === 'addLB') {
            addLineBreaks();
        }
    });
})();