// ==UserScript==
// @name         PLGradingHelper
// @namespace    http://tampermonkey.net/
// @version      2024-04-04
// @description  Usage: This script makes copying rubrics easier. Navigate to the grading page containing your desired rubric. In the Rubric dialog, click on "Copy Rubric" to copy the rubric. Navigate to the grading page where you wish to apply the rubric. In the Rubric dialog, press "Ctrl+V" to paste the rubric. Don't forget to click "Save rubric".
// @author       Yufeng Du
// @match        https://us.prairielearn.com/pl/course_instance/*/instructor/assessment/*/manual_grading/instance_question/*
// @icon         https://us.prairielearn.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486929/PLGradingHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/486929/PLGradingHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let modal = document.querySelector('.modal');
    let modalContent = document.querySelector('.modal-content');
    // find the first div with class 'modal-body'
    let modalBody = document.querySelector('.modal-body');
    // create a new div inside the modal header to hold the "Copy" button
    let ButtonDiv = document.createElement('div');
    // create a new button inside the new div
    let copyButton = document.createElement('div');
    // add the classes 'btn' 'btn-light' to the new button
    // newButton.classList.add('btn', 'btn-sm', 'btn-secondary', 'js-add-rubric-item-button');
    // add the text "Copy" to the new button
    copyButton.textContent = 'Copy Rubric';
    // set the width to auto
    copyButton.style.width = 'auto';
    copyButton.style.color = 'red';
    copyButton.style.cursor = 'pointer';
    copyButton.style.textDecoration = 'underline';

    copyButton.style.display = "inline-block";
    // append the new button to the new div
    ButtonDiv.appendChild(copyButton);
    // insert a space
    let space = document.createElement('div');
    space.textContent = ' ';
    space.style.display = "inline-block";
    space.style.width = "10px";
    ButtonDiv.appendChild(space);

    let pastePseudoButton = document.createElement('div');
    let col6 = modalBody.querySelector('.col-6');
    // add the classes 'btn' 'btn-light' to the new button
    // newButton.classList.add('btn', 'btn-sm', 'btn-secondary', 'js-add-rubric-item-button');
    // add the text "Copy" to the new button
    pastePseudoButton.textContent = 'Paste Rubric (Ctrl+V)';
    // set the width to auto
    pastePseudoButton.style.width = 'auto';
    pastePseudoButton.style.color = '#888888';

    pastePseudoButton.style.display = "inline-block";
    // append the new button to the new div
    ButtonDiv.appendChild(pastePseudoButton);

    // insert help button
    let divHTML = `
    <button type="button" class="btn btn-sm" data-toggle="tooltip" data-placement="bottom" title="" data-original-title='Click on "Copy Rubric" to copy the rubric. Press "Ctrl+V" to paste the rubric. Click this information button for details.'>
                      <svg class="svg-inline--fa fa-circle-info text-info" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-info" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></svg><!-- <i class="text-info fas fa-circle-info"></i> Font Awesome fontawesome.com -->
                    </button>
                    `;
    // create a new button inside the new div
    let helpButton = document.createElement('div');
    helpButton.style.display = "inline-block";
    helpButton.innerHTML = divHTML;
    ButtonDiv.appendChild(helpButton);

    // insert the new div
    modalBody.insertBefore(ButtonDiv, modalBody.firstChild);

    // create a function to parse the data from the modal body
    function getParsedData() {
        // find the first "col-6" div inside modalBody

        // there are two checkboxes inside col6. Get these two checkboxes
        let checkboxes = col6.querySelectorAll('input');
        // create an array to hold the values of the checkboxes. Look at the "checked" property of each checkbox.
        let checkboxValues = 0;
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked === false) {
                checkboxValues = checkboxValues * 2;
            } else {
                checkboxValues = checkboxValues * 2 + 1;
            }
        }
        let minPoints = modalBody.querySelector('input[name="min_points"]').value;
        let maxExtraPoints = modalBody.querySelector('input[name="max_extra_points"]').value;

        let rubricItemTable = modalBody.querySelector('.js-rubric-items-table');
        let rubricItemRows = rubricItemTable.querySelectorAll('tr');
        let rubricItemData = [];
        for (let i = 1; i < rubricItemRows.length; i++) {
            let rubricItemRow = rubricItemRows[i];
            if (rubricItemRow.classList.contains('js-no-rubric-item-note')) {
                continue;
            }
            let rubricItemCells = rubricItemRow.querySelectorAll('td');
            if (rubricItemCells.length < 6) {
                continue;
            }
            function getTextContent(element) {
                // if first child is a label tag, return the data-current-value
                let secondChild = element.firstChild.nextSibling;
                if (secondChild.tagName === "LABEL") {
                    return secondChild.getAttribute('data-current-value');
                } else {
                    return secondChild.innerHTML;
                }
            }
            let rubricItem = {
                "points": rubricItemCells[1].querySelector('input').value,
                "description": rubricItemCells[2].querySelector('input').value,
                "detailedExplanation": getTextContent(rubricItemCells[3]),
                "graderNote": getTextContent(rubricItemCells[4]),
                "showToStudents": rubricItemCells[5].querySelector('input').checked ? "always" : "ifSelected",
            };
            rubricItemData.push(rubricItem);
        }

        let ret_json = {
            "checkboxValues": checkboxValues,
            "minimumRubricScore": minPoints,
            "maximumExtraCredit": maxExtraPoints,
            "rubricItems": rubricItemData
        };
        return JSON.stringify(ret_json);
    }
    function restoreParsedData(ret_json_string) {
        // update the rubric settings with the parsed data

        let ret_json;
        try {
            ret_json = JSON.parse(ret_json_string);
        } catch {
            return false;
        }
        let checkboxValues = ret_json.checkboxValues;
        let minPoints = ret_json.minimumRubricScore;
        let maxExtraPoints = ret_json.maximumExtraCredit;
        let rubricItemData = ret_json.rubricItems;
        // check the validity of the parsed data
        if (checkboxValues !== 1 && checkboxValues !== 2) {
            console.log("Invalid checkboxValues: " + checkboxValues);
            checkboxValues = 2;  // default to positive grading
            // return false;
        }
        // check if minPoints and maxExtraPoints are integers
        if (isNaN(minPoints)) {
            console.log("Invalid minPoints: " + minPoints);
            minPoints = 0;  // default
            // return false;
        }
        if (isNaN(maxExtraPoints)) {
            console.log("Invalid maxExtraPoints: " + maxExtraPoints);
            maxExtraPoints = 0; // default
            // return false;
        }
        // check each rubric item
        for (let i = 0; i < rubricItemData.length; i++) {
            let rubricItem = rubricItemData[i];
            if (isNaN(rubricItem.points)) {
                console.log("Invalid rubricItem.points: " + rubricItem.points);
                return false;
            }
            // if rubricItem.description is not a string, return
            if (typeof rubricItem.description !== "string") {
                console.log("Invalid rubricItem.description: " + rubricItem.description);
                return false;
            }
            // if rubricItem.detailedExplanation is not a string, return
            if (typeof rubricItem.detailedExplanation !== "string") {
                console.log("Invalid rubricItem.detailedExplanation: " + rubricItem.detailedExplanation);
                return false;
            }
            // if rubricItem.graderNote is not a string, return
            if (typeof rubricItem.graderNote !== "string") {
                console.log("Invalid rubricItem.graderNote: " + rubricItem.graderNote);
                return false;
            }
            // if rubricItem.showToStudents is not one of the two strings, return
            if (rubricItem.showToStudents !== "always" && rubricItem.showToStudents !== "ifSelected") {
                console.log("Invalid rubricItem.showToStudents: " + rubricItem.showToStudents);
                return false;
            }
        }
        console.log("Validation passed");
        // update the checkboxes
        let checkboxes = col6.querySelectorAll('input');
        if (checkboxValues === 1) {
            checkboxes[1].checked = true;
        }
        if (checkboxValues === 2) {
            checkboxes[0].checked = true;
        }
        // update the minPoints and maxExtraPoints
        modalBody.querySelector('input[name="min_points"]').value = +minPoints;
        modalBody.querySelector('input[name="max_extra_points"]').value = +maxExtraPoints;
        // update the rubric items
        let rubricItemTable = modalBody.querySelector('.js-rubric-items-table');
        let rubricItemBody = rubricItemTable.querySelector('tbody');
        let rubricItemRows = rubricItemBody.querySelectorAll('tr');
        let _j = 0;
        while (rubricItemRows.length > _j) {
            let deleteButton = rubricItemRows[_j].querySelector('.js-rubric-item-delete');
            if (deleteButton) {
                deleteButton.click();
                rubricItemRows = rubricItemBody.querySelectorAll('tr');
            } else {
                _j += 1;
            }
        }
        let addRubricItemButton = modalBody.querySelector('.js-add-rubric-item-button');
        for (let i = 0; i < rubricItemData.length; i++) {
            addRubricItemButton.click();
        }
        rubricItemRows = rubricItemBody.querySelectorAll('tr');
        _j = 0;
        for (let i = 0; i < rubricItemRows.length; i++) {
            let rubricItem = rubricItemData[_j];
            let rubricItemCells = rubricItemRows[i].querySelectorAll('td');
            if (rubricItemCells.length < 6) {
                continue;
            }
            rubricItemCells[1].querySelector('input').value = +rubricItem.points;
            rubricItemCells[2].querySelector('input').value = rubricItem.description;
            let modifyDetailedExplanationButton = rubricItemCells[3].querySelector('button');
            modifyDetailedExplanationButton.click();
            rubricItemCells[3].querySelector('textarea').value = rubricItem.detailedExplanation;
            let modifyGraderNoteButton = rubricItemCells[4].querySelector('button');
            modifyGraderNoteButton.click();
            rubricItemCells[4].querySelector('textarea').value = rubricItem.graderNote;
            if (rubricItem.showToStudents === "always") {
                rubricItemCells[5].querySelectorAll('input')[0].checked = true;
            }
            else {
                rubricItemCells[5].querySelectorAll('input')[1].checked = true;
            }
            _j = _j + 1;
        }
        return true;
    }

    function popup(Button, popupText) {
        let absolutePos = Button.getBoundingClientRect();
        let width = Button.offsetWidth;
        let height = Button.offsetHeight;
// get absolute position of the modal
        let modalPos = modalBody.getBoundingClientRect();
// get the relative position of the button
        let relativePos = {
            x: absolutePos.x - modalPos.x + width,
            y: absolutePos.y - modalPos.y - height / 2
        };
        let divtext = "<div class=\"popover fade bs-popover-right show\" role=\"tooltip\" id=\"popover687467\" " +
            "x-placement=\"right\" style=\"position: absolute; transform: translate3d(" + relativePos.x + "px, " +
            relativePos.y + "px, 0px); top: 0px; left: 0px; will-change: transform;\"><div class=\"arrow\" styl" +
            "e=\"top: 6px;\"></div><h3 class=\"popover-header\"></h3><div class=\"popover-body\">" + popupText + "</div></div>";
// create a new div that lasts for 3 seconds
        let popup = document.createElement('div');
        let styles = document.createElement('style');
        styles.innerHTML = ".BtnPopupFadeOut {opacity: 0; animation: btnPopupFadeOut 1s;}\n@keyframes btnPopupFadeOut {0% {opacity: 1;} 50% {opacity: 1;}  100% {opacity: 0;}}\n";
        document.head.appendChild(styles);
        popup.classList.add('BtnPopupFadeOut');
        popup.innerHTML = divtext;
// append the new div to the body
        ButtonDiv.appendChild(popup);
        setTimeout(function() {
            popup.remove();
        }, 1300);
    }
// call getParsedData() when the new button is clicked and copy the result to the clipboard
    copyButton.addEventListener('click', function() {
        let parsedData = getParsedData();
        navigator.clipboard.writeText(parsedData).then((e)=>{
            console.log("DUMP DATA");
            console.log(parsedData);
// get absolute position of the button
            popup(copyButton, "Copied!");
        });
    });

    document.addEventListener("paste", (event) => {
        if (modal.style.display !== "none") {
            if (event.target.tagName === "TEXTAREA" || event.target.tagName === "INPUT") {
                return;
            }

            let parsedData;
            try {
                parsedData = (event.clipboardData || window.clipboardData).getData("text");
            } catch {
                return;
            };

            let response = restoreParsedData(parsedData);
            console.log("LOAD DATA");
            console.log(parsedData);
            // get absolute position of the button
            if (response) {
                popup(pastePseudoButton, "Pasted!");
                event.preventDefault();
            } else {
                popup(pastePseudoButton, "Invalid data from clipboard!");
            }
        }
    }, false);
    pastePseudoButton.addEventListener('click', function() {
        popup(pastePseudoButton, "Press Ctrl+V!");
    });
    helpButton.addEventListener('click', function() {
        // create a dialog box with a close button
        let dialog = document.createElement('dialog');
        dialog.innerHTML = "<div>" +
            "<h2>What do the buttons do</h2>" +
            "<p>These buttons make copying rubrics easier. The original process of creating rubric by hand is tiring. With this script, you can copy the rubric from one question, and apply it to another question within just a few steps. </p>" +
            "<h2>How to use this script</h2>" +
            "<p>1. Navigate to the grading page containing your desired rubric. </p>" +
            "<p>2. In the Rubric dialog, click on \"Copy Rubric\" to copy the rubric. </p>" +
            "<p>3. Navigate to the grading page where you wish to apply the rubric.  </p>" +
            "<p>4. In the Rubric dialog, press \"Ctrl+V\" to paste the rubric. </p>" +
            "<p>5. Don't forget to click \"Save rubric\".</p>" +
            "<h2>What is done during this process</h2>" +
            "<p>The script will copy the rubric to the clipboard in JSON. You can view and modify the copied string in a text editor before pasting back to the question. When Ctrl+V is pressed, the script will validate the JSON string first. If everything is correct, the script will add the rubric as described in the JSON string.</p>" +
            "</div>";
        let closeButton = document.createElement('button');
        closeButton.innerHTML = "Close";
        closeButton.addEventListener('click', function() {
                dialog.close();

            }
        );
        dialog.appendChild(closeButton);
        document.body.appendChild(dialog);
        dialog.showModal();

    });

    // Graded instance counter
    // get username
    let usernameNavBar = document.getElementById("navbarDropdown");
    let span = usernameNavBar.querySelector("span");
    // username = usernameNavBar.innerText - span.innerText
    let username = usernameNavBar.innerText.replace(span.innerText, "").trim();
    // get div with class "js-main-grading-panel"
    let mainGradingPanel = document.querySelector(".js-main-grading-panel");
    // get li with class "list-group-item" "d-flex" and "align-items-center" from mainGradingPanel
    let listGroupItem = mainGradingPanel.querySelectorAll(".list-group-item.d-flex.align-items-center");
    // find the li that contains <a> with class "btn btn-primary", role "button"
    let backButton;
    for (let i = 0; i < listGroupItem.length; i++) {
        let button = listGroupItem[i].querySelector("a.btn.btn-primary");
        if (button) {
            backButton = button;
            break;
        }
    }
    // get href from the button
    let href = backButton.getAttribute("href");
    // get the html content from the href
    function getQuestionName(data) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(data, "text/html");

        // get question name from div class="card-header bg-primary text-white", child of div class="card mb-4", child of main id="content"
        let docMainContent = doc.getElementById("content");
        let card = docMainContent.querySelector(".card.mb-4");
        let questionNameHeader = card.querySelector(".card-header.bg-primary.text-white");
        let questionName = questionNameHeader.innerText.trim();
        console.log(questionName);
        return questionName;
    }
    let mainContent = document.getElementById("content");
    let sideBar = mainContent.querySelector(".col-lg-4.col-12");
    let cardHeader = sideBar.querySelector(".card-header.bg-info.text-white");
    function appendGradedInstanceCounter(questionName, gradedInstanceCounter, totalInstances) {
        console.log("appendGradedInstanceCounter");
        // look at document for the div with class "card-header bg-info text-white"
        // create a new div with class "text-white"
        let div = document.createElement("div");
        div.classList.add("text-white");
        // add the gradedInstanceCounter to the div
        div.innerHTML = gradedInstanceCounter + "/" + totalInstances + " Graded by you for " + questionName;
        // append the new div to the cardHeader
        cardHeader.appendChild(div);
        console.log(div);
    }
    let instancesJsonURL = href + "/instances.json";
    fetch(instancesJsonURL).then(response => response.json()).then(data => {
        let gradedInstanceCounter = 0;
        for (let i = 0; i < data.instance_questions.length; i++) {
            let instance = data.instance_questions[i];
            if (instance.last_grader_name === username) {
                gradedInstanceCounter++;
            }
        }
        let totalInstances = data.instance_questions.length;
        console.log(gradedInstanceCounter);
        fetch(href).then(response => response.text()).then(data => {
            let questionName = getQuestionName(data);
            appendGradedInstanceCounter(questionName, gradedInstanceCounter, totalInstances);
        });
    })

    // comment templates
    function createCommentTemplateBox() {
        let gradingForm = sideBar.querySelector("form[name='manual-grading-form']");
        let _ = gradingForm.querySelector("li.form-group.list-group-item");
        if (!_) {
            return 1;
        }
        let feedBackList = _.querySelector("label");
        let help = document.getElementById("submission-feedback-help-main");
        // create a new div and insert it before the help
        let commentTemplates = document.createElement("div");
        // the div has a rounded border
        commentTemplates.style.border = "1px solid #d1d5da";
        commentTemplates.style.borderRadius = "3px";
        commentTemplates.style.padding = "10px";
        // the div has a title: "Comment Templates"
        let title = document.createElement("h6");
        title.innerHTML = "Comment Templates";
        commentTemplates.appendChild(title);
        // create a separator
        let separator = document.createElement("hr");
        commentTemplates.appendChild(separator);

        feedBackList.insertBefore(commentTemplates, help);
        // commentTemplates consists of a list. Each element has two buttons: one shows the comment, the other deletes the comment
        let commentList = document.createElement("ul");
        commentTemplates.appendChild(commentList);
        // get the template from the local storage
        let commentTemplateList = localStorage.getItem("commentTemplates");
        if (commentTemplateList) {
            commentTemplateList = JSON.parse(commentTemplateList);
        } else {
            commentTemplateList = [];
        }
        function setCommentButtonStyle(button) {
            button.style.border = "1px solid #d1d5da";
            button.style.borderRadius = "3px";
            // the button has a pale blue background
            button.style.backgroundColor = "#f1f8ff";
            // the button has a margin
            button.style.margin = "1px";
            button.style.display = "inline-block";
            button.style.cursor = "pointer";
        }
        function createCommentTemplateItem(comment) {
            let li = document.createElement("li");
            // don't show the bullet point
            li.style.listStyleType = "none";
            // ignore the indentation by ul
            li.style.marginLeft = "-40px";
            let label = document.createElement("div");
            label.style.display = "inline-block";
            label.innerHTML = comment;
            label.style.margin = "1px";
            label.style.border = "1px solid #d1d5da";

            let deleteButton = document.createElement("div");
            deleteButton.innerHTML = "Delete";
            setCommentButtonStyle(deleteButton);
            // the delete button is aligned to the right
            deleteButton.style.float = "right";

            let dummy = document.createElement("div");
            dummy.appendChild(label);
            dummy.appendChild(deleteButton);
            li.appendChild(dummy);
            // get the index of li
            let index = commentList.children.length;
            // if the index is even, the background is pale gray
            if (index % 2 === 0) {
                li.style.backgroundColor = "#f5f5f5";
            }
            // if mouse hovers over the li, the background becomes pale blue
            li.addEventListener('mouseover', function () {
                li.style.backgroundColor = "#e1e8ff";
            }
            );
            li.addEventListener('mouseout', function () {
                if (index % 2 === 0) {
                    li.style.backgroundColor = "#f5f5f5";
                } else {
                    li.style.backgroundColor = "white";
                }
            });
            commentList.appendChild(li);
            li.addEventListener('click', function () {
                let commentBox = feedBackList.querySelector("textarea.form-control.js-submission-feedback");
                // insert the comment to the comment box where the cursor is
                let cursorPosition = commentBox.selectionStart;
                let textBefore = commentBox.value.substring(0, cursorPosition);
                let textAfter = commentBox.value.substring(commentBox.selectionEnd, commentBox.value.length);
                // if the comment contains "[cursor]", remember the position and remove it
                let offset = comment.indexOf("[cursor]");
                if (offset !== -1) {
                    comment = comment.replace("[cursor]", "");
                }
                else {
                    offset = comment.length;
                }
                commentBox.value = textBefore + comment + textAfter;

                // move the cursor to the end of the inserted comment
                commentBox.selectionStart = cursorPosition + offset;
                commentBox.selectionEnd = cursorPosition + offset;

            });
            deleteButton.addEventListener('click', function (e) {
                commentList.removeChild(li);
                commentTemplateList.splice(commentTemplateList.indexOf(comment), 1);
                localStorage.setItem("commentTemplates", JSON.stringify(commentTemplateList));
                e.stopPropagation();
            });
        }

        for (let i = 0; i < commentTemplateList.length; i++) {
            let comment = commentTemplateList[i];
            createCommentTemplateItem(comment);
        }
        // create a new button to add a new comment
        let newCommentDiv = document.createElement("div");
        let newCommentTextArea = document.createElement("textarea");
        let newCommentButton = document.createElement("div");
        newCommentButton.innerHTML = "add";
        setCommentButtonStyle(newCommentButton);
        newCommentButton.style.float = "right";

        newCommentTextArea.style.display = "inline-block";
        // the text area has the same height as the newcommentbutton
        newCommentTextArea.style.height = "30px";
        newCommentTextArea.style.width = "80%";
        newCommentDiv.style.marginTop = "10px";

        newCommentDiv.appendChild(newCommentTextArea);
        newCommentDiv.appendChild(newCommentButton);
        commentTemplates.appendChild(newCommentDiv);
        newCommentButton.addEventListener('click', function () {
            let comment = newCommentTextArea.value;
            commentTemplateList.push(comment);
            localStorage.setItem("commentTemplates", JSON.stringify(commentTemplateList));
            createCommentTemplateItem(comment);
            // clear the text area
            newCommentTextArea.value = "";
        });
        return 0;
    }
    // frequently check if the grading form is loaded using async method
    async function checkGradingForm() {
        if (createCommentTemplateBox()) {
            setTimeout(checkGradingForm, 10);
            console.log("retrying");
        }
        else {
            console.log("done");
        }

    }
    checkGradingForm();
})();
