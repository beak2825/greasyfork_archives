// ==UserScript==
// @name         Gradescope Paste and Drag to Upload (WIP)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  very work in progress
// @author       You
// @match        https://www.gradescope.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gradescope.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460222/Gradescope%20Paste%20and%20Drag%20to%20Upload%20%28WIP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/460222/Gradescope%20Paste%20and%20Drag%20to%20Upload%20%28WIP%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

   // button element to hopefully implement button based pasting in the future
    /*var button = document.createElement("button");
    button.innerHTML = "Paste";
    button.classList.add('paste-button')
    document.getElementById("submit-variable-length-pdf").addEventListener("click", function() {
        var elementExists = !!document.getElementById("ControlID-2");
        if (!elementExists) {
            setTimeout(() => {
                                var styles = `
    .paste-button {
        border-color: var(--tdl-color-outline);
        background-color: var(--tdl-color-surface);
        color: var(--tdl-color-on-surface);
        display: inline-block;
        padding: 7px 15px;
        -webkit-transition: 0.15s ease;
        transition: 0.15s ease;
        border-width: 1px;
        border-style: solid;
        border-radius: 2px;
        font: var(--tdl-font-label-medium);
        letter-spacing: var(--tdl-letter-spacing-normal);
        text-align: center;
        text-decoration: none;
        text-transform: none;
        cursor: pointer;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }
    .paste-button:hover {
        background-color: var(--tdl-color-state-hover-surface);
    }
`
                var styleSheet = document.createElement("style")
                styleSheet.innerText = styles
                document.head.appendChild(styleSheet)
                var footerButtons = document.querySelector(".tiiBtn.tiiBtn-tertiary");
                footerButtons.before(button);
                //button.addEventListener ("click", pastePDF);
            }, 0); // end of timeout
        }
    }); */

    /*async function pastePDF() {
        try {
            const permission = await navigator.permissions.query({
                name: "clipboard-read",
            });
            if (permission.state === "denied") {
                throw new Error("Not allowed to read clipboard.");
            }
            const clipboardContents = await navigator.clipboard.read();
            for (const item of clipboardContents) {
                console.log(item)
                //const blob = await item.getType("file");

                console.log(blob)
                if (blob.files.length > 0) {
                    const fileInput = document.querySelector("#submission_pdf_attachment");
                    //console.dir(fileInput);
                    //console.log(e.clipboardData.files);
                    fileInput.files = blob.files;
                    document.querySelector(".js-fileUploadPrompt").innerText = blob.files[0].name;
                }
            }
        } catch (error) {
            console.error(error.message);
        }
    }*/

    window.addEventListener("paste", async e => {
        e.preventDefault();
        if (e.clipboardData.files.length > 0) {
            const fileInput = document.querySelector("#submission_pdf_attachment");
            //console.dir(fileInput);
            //console.log(e.clipboardData.files);
            fileInput.files = e.clipboardData.files;
            document.querySelector(".js-fileUploadPrompt").innerText = e.clipboardData.files[0].name;
        }
    });

    // clear out anything from .js-fileUploadPrompt
    document.getElementById("submit-variable-length-pdf").addEventListener("click", function() {
        document.querySelector(".js-fileUploadPrompt").innerText = "Please select a file";
    });
    //console.log(document.querySelectorAll(".form--group"));
    //console.log(document.querySelectorAll("[id^=assignment_submission_]"));


    //// Drag-Aand-Drop

    // pdf submission
    dragAndDrop(document.querySelector("#submit-fixed-length-modal"),document.querySelector("#submission_pdf_attachment"))

    // for image submissions
    let dropElements = document.querySelectorAll(".form--group");
    let submissionElements = document.querySelectorAll("[id^=assignment_submission_]");

    for (let i = 0; i < dropElements.length; i++) {
        //console.log(dropElements[i], submissionElements[i])
        dragAndDrop(dropElements[i], submissionElements[i])
    }


    function dragAndDrop(dropArea, submissionElement) {
        //let dropArea = dropElement
        ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false)
        })

        function preventDefaults (e) {
            e.preventDefault()
            e.stopPropagation()
        }

        ;['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false)
        })

        ;['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false)
        })

        function highlight(e) {
            dropArea.classList.add('highlight')
        }

        function unhighlight(e) {
            dropArea.classList.remove('highlight')
        }

        dropArea.addEventListener('drop', handleDrop, false)

        function handleDrop(e) {
            let dt = e.dataTransfer
            let files = dt.files

            handleFiles(files)
        }
        function handleFiles(files) {
            //([...files]).forEach(uploadFile)
            const fileInput = submissionElement;
            fileInput.files = files;
            submissionElement.parentElement.childNodes[3].innerText = files[0].name;
        }
    }

})();