// ==UserScript==
// @name         XML to JSON Converter
// @namespace    none
// @version      1.0.1
// @license MIT
// @description  Upload an XML file and convert it to JSON format, then display the result on the page
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463328/XML%20to%20JSON%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/463328/XML%20to%20JSON%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // create a form for uploading files
    var form = document.createElement("form");
    form.style.margin = "20px";

    // create an input element for the file
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.name = "file";
    fileInput.accept = "application/xml";
    form.appendChild(fileInput);

    // create a submit button
    var submitButton = document.createElement("input");
    submitButton.type = "submit";
    submitButton.value = "Convert to JSON";
    form.appendChild(submitButton);

    // append the form to the body
    document.body.appendChild(form);

    // create a div for displaying the result
    var resultDiv = document.createElement("div");
    resultDiv.style.margin = "20px";
    document.body.appendChild(resultDiv);

    // add an event listener for form submission
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        // create a new FormData object and add the file to it
        var formData = new FormData();
        formData.append("file", fileInput.files[0]);

        // send a POST request to the server to convert the file
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/convert", true);
        xhr.onload = function() {
            // display the result
            resultDiv.innerHTML = xhr.responseText;
        };
        xhr.send(formData);
    });
})();