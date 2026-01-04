// ==UserScript==
// @name         ArcGIS Server Fields to GIS-L
// @namespace    https://fxzfun.com/
// @version      0.2
// @description  copies field names in a format to paste into the GIS-L spreadsheet
// @author       FXZFun
// @match        *://*/*rest/services*/*Server/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/457539/ArcGIS%20Server%20Fields%20to%20GIS-L.user.js
// @updateURL https://update.greasyfork.org/scripts/457539/ArcGIS%20Server%20Fields%20to%20GIS-L.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var fieldsHeading = [...document.querySelectorAll("b")].filter(_ => _.innerText == "Fields:")[0];

    for (var field of fieldsHeading.nextElementSibling.children) {
        field.innerHTML = `<label id="${field.innerText.split("(")[0]}"><input type="checkbox" />${field.innerHTML}</label>`;
    }

    fieldsHeading.outerHTML += "<button id='copyBtn' onclick='copyFields()'>Copy Selected Fields</button>";

    window.copyFields = function() {
        var fields = [...document.querySelectorAll("input")].filter(_ => _.checked).map(_ => _.parentElement.id.trim()).join(", ");
        copyTextToClipboard(location.href + "		" + fields);
    }

    // from https://stackoverflow.com/a/30810322
    function fallbackCopyTextToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            if (msg) document.getElementById("copyBtn").innerText = "Copied";
        } catch (err) {
            document.getElementById("copyBtn").innerText = "Error copying";
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    function copyTextToClipboard(text) {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }
        navigator.clipboard.writeText(text).then(function() {
            document.getElementById("copyBtn").innerText = "Copied";
        }, function(err) {
            document.getElementById("copyBtn").innerText = "Error copying";
            console.error('Fallback: Oops, unable to copy', err);
        });
    }
})();