// ==UserScript==
// @name         Koohi story copier with html
// @namespace    https://kanji.koohii.com
// @version      0.4
// @description  Copy stories from kanji koohii page
// @author       You
// @match        https://kanji.koohii.com/study/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40058/Koohi%20story%20copier%20with%20html.user.js
// @updateURL https://update.greasyfork.org/scripts/40058/Koohi%20story%20copier%20with%20html.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var stories = document.getElementsByClassName("story");

    for(var i=0; i<stories.length; i++) {
        // Create copy button
        var copyButton = document.createElement("span");
        copyButton.appendChild(document.createTextNode("Copy"));
        copyButton.style = "cursor: pointer; color: #bababa";
        stories[i].insertAdjacentElement("afterend", copyButton);

        (function(copyButton, storyText) {
            copyButton.addEventListener("click", () => copyStory(copyButton, storyText));
        })(copyButton, stories[i].textContent);

        // Create copy raw button
        var copyButtonRaw = document.createElement("span");
        copyButtonRaw.appendChild(document.createTextNode("Copy raw, "));
        copyButtonRaw.style = "cursor: pointer; color: #bababa";
        stories[i].insertAdjacentElement("afterend", copyButtonRaw);

        (function(copyButtonRaw, copyButton, storyText) {
            copyButtonRaw.addEventListener("click", () => copyStory(copyButton, storyText));
        })(copyButtonRaw, copyButton, stories[i].innerHTML);
    }

    function copyStory(button, storyText) {
        // console.log(storyText);

        // create input field so we can coppy the text
        var copyField = document.createElement("input");
        copyField.value = storyText;
        button.insertAdjacentElement("afterend", copyField);

        // copy the text in input field
        copyField.select();
        document.execCommand("copy");

        // after short delay remove the copy field
        setTimeout(
            function() {
                copyField.parentElement.removeChild(copyField);
            }, 500);
    }
})();