// ==UserScript==
// @name         Lines button in Splunk
// @namespace    http://enco.io/
// @version      0.7
// @description  try to take over the world!
// @author       Brent
// @include      http://10.1.50.50:8000/*/app/search/search*
// @include      https://splunk.dev.enco.io/*/app/search/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383426/Lines%20button%20in%20Splunk.user.js
// @updateURL https://update.greasyfork.org/scripts/383426/Lines%20button%20in%20Splunk.meta.js
// ==/UserScript==

(function() {
    var splunkNewLinesText = ' | rex mode=sed "s/\\\\\\\\\\\\\\n/\\n/g" | rex mode=sed "s/\\\\\\\\n/\\n/g" | rex mode=sed "s/\\\\\\\\u003c/</g" | rex mode=sed "s/\\\\\\\\u003e/>/g" | rex mode=sed "s/\\\\\\\\\\\\\\x22/\\"/g" | rex mode=sed "s/\\\\\\\\\\\\\\x0D\\\\\\\\\\\\\\x0A//g"';
    var searchInput;

    'use strict';
    var intervalHandle = setInterval(addButton, 100);
    var tryCount = 0;
    function addButton() {
        if(tryCount >= 100) {
               console.log("Failed inserting new button");
             clearInterval(intervalHandle);
        }
        tryCount++;
        var searchAppsTd = document.querySelector('.search-apps');
        if(searchAppsTd == null) {
           //console.log("Search apps is null");
            return;
        }

        clearInterval(intervalHandle);
        searchInput = document.querySelector('.ace_text-input');

        if(searchInput == null) {
           console.log("Unable to find search input.");
        }

        window.addLineFormat = addLineFormat;

        console.log(searchAppsTd);
        var newButton = document.createElement('td');
        newButton.classList.add("search-apps");
        newButton.innerHTML = '<div class="shared-searchbar-submit"><a class="btn" href="#" onclick="window.addLineFormat()"><span>Add newline format</span></div>';
        insertAfter(newButton, searchAppsTd);
    }

    function addLineFormat() {
        //searchInput.value = searchInput.value + " | wow";
        var aceEditorObj = document.querySelector('.ace_editor');
        console.log("Editing ace with ID " + aceEditorObj);
        var editor = ace.edit(aceEditorObj);
        var currentValue = editor.getSession().getValue();
        if(currentValue.indexOf(splunkNewLinesText) >= 0) {
            console.log("Line is already present.");
            return;
        }
        editor.getSession().setValue(currentValue + splunkNewLinesText);
        editor.renderer.updateFull();
    }

    function insertAfter(el, referenceNode) {
        referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
    }

    //document.addEventListener('DOMContentLoaded', addButton, false);
})();