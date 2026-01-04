// ==UserScript==
// @name         Google Sheets Hyperlink Alt+Click Trigger
// @version      2.11
// @description  Open hyperlinks in Google Sheets by holding Alt key and clicking on the cell itself
// @match        https://docs.google.com/spreadsheets/*
// @icon         https://ssl.gstatic.com/docs/spreadsheets/favicon3.ico
// @require      https://update.greasyfork.org/scripts/433051/Trusted-Types%20Helper.user.js
// @require		 https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require		 https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.full.js
// @grant        none
// @license      MIT
// @namespace    https://www.fiverr.com/web_coder_nsd
// @downloadURL https://update.greasyfork.org/scripts/483447/Google%20Sheets%20Hyperlink%20Alt%2BClick%20Trigger.user.js
// @updateURL https://update.greasyfork.org/scripts/483447/Google%20Sheets%20Hyperlink%20Alt%2BClick%20Trigger.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var laComments = [
        "Be sure that every page is submitted, in-focus, and has your Student ID # and Period #.",
        "Be sure to complete Part 2.",
        "Be sure to complete Part 3 and use complete sentences.",
        "Be sure to complete Part 4 and use complete sentences.",
        "You completed the activity, but some of your answers do not make sense.",
        "You completed the activity, and all of your answers are valid."
    ];

    var czComments = [
        "Be sure the desk number is visible in the picture.",
        "Be sure the entire desk and chair are visible in the picture.",
        "Be sure to not leave any marks on the desk or report them to the teacher.",
        "Be sure to not leave any pens, pencils, or paper on the desk.",
        "Be sure to push your chair in.",
        "Your desk is clean and your chair is pushed in."
    ];

    var DATE_COLUMN = "A"
    var STUDENT_ID_COLUMN = "B"
    var CLASS_PERIOD_COLUMN = "C"
    var SCORE_COLUMN = "D"
    var CITIZENSHIP_SCORE_COLUMN = "E"
    var IMAGES_COLUMN = "F"
    var FAMILY_NAME_COLUMN = "G"
    var FIRST_NAME_COLUMN = "H"
    var ASSIGNED_SEAT_COLUMN = "I"
    var COMMENT_COLUMN = "J"
    var STATUS_COLUMN = "L"
    var AI_COLUMN = "N"

    var isAltKeyPressed = false;
    var nonReactive = false;

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Alt') {
            isAltKeyPressed = true;
        }
    });

    document.addEventListener('keyup', function (event) {
        if (event.key === 'Alt') {
            isAltKeyPressed = false;
        }
    });

    document.addEventListener('click', async function (event) {
        if (isAltKeyPressed && document.querySelector('.cell-input') && !nonReactive) {
            triggerImagePopup()
        }
    });


    function getOSName() {
        const platform = navigator.platform.toLowerCase();

        if (platform.includes('win')) {
            return 'Windows';
        } else if (platform.includes('mac')) {
            return 'MacOS';
        } else if (platform.includes('linux')) {
            return 'Linux';
        } else if (platform.includes('android')) {
            return 'Android';
        } else if (platform.includes('iphone') || platform.includes('ipad') || platform.includes('ipod')) {
            return 'iOS';
        } else if (platform.includes('chromebook')) {
            return 'Chromebook';
        } else {
            return 'Unknown';
        }
    }

    async function triggerImagePopup() {
        var modalContainers = document.querySelectorAll('.modal-container');
        var modalOverlays = document.querySelectorAll('.modal-overlay');
        // Remove modal containers
        for (var i = 0; i < modalContainers.length; i++) {
            modalContainers[i].remove();
        }
        // Remove modal overlays
        for (var j = 0; j < modalOverlays.length; j++) {
            modalOverlays[j].remove();
        }
        var cellValue = document.querySelector('.cell-input').innerText;
        if (cellValue.indexOf('=HYPERLINK') === 0) {
            var url = cellValue.match(/"(.*?)"/)[1];
            await openPopupWithContent(url);
        }
    }

    async function setCellValue(cellIndex, value, preservePrevCellIndex = true) {
        await setCurrentCellIndex(cellIndex);

        await simulateValueSet(value)
        await simulateValueSet(value)

        if (preservePrevCellIndex) {
            await setCurrentCellIndex(cellIndex);
        }
    }

    async function setMultipleCellValuesSequentially(cellValues) {
        for (const cellValue of cellValues) {
            await setCellValue({ column: cellValue.column, row: cellValue.row }, cellValue.value);
        }
    }

    async function simulateValueSet(value) {
        var inputBox = document.querySelector('.cell-input');

        if (inputBox) {
            // Trigger click event
            nonReactive = true;
            var clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
            });
            inputBox.dispatchEvent(clickEvent);
            nonReactive = false;

            await delay(80); // Delay for smoother execution

            // Trigger keydown event
            var keydownEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                view: window,
                bubbles: true,
                cancelable: true,
            });
            inputBox.dispatchEvent(keydownEvent);

            // Set the cell value
            inputBox.innerText = value;

            // Trigger input event
            var inputEvent = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            inputBox.dispatchEvent(inputEvent);

            // Trigger keydown event
            var keydownPress = new KeyboardEvent('keypress', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                view: window,
                bubbles: true,
                cancelable: true,
            });
            inputBox.dispatchEvent(keydownPress);
        }
    }

    function getCurrentCellValue() {
        if (document.querySelector('.cell-input')) {
            var cellValue = document.querySelector('.cell-input').innerText;
            return cellValue.trim();
        }
        return null
    }

    function getCurrentCellIndex(returnAsObj = false) {
        if (document.querySelector('.waffle-name-box')) {
            var cellIndex = document.querySelector('.waffle-name-box').value;

            if (returnAsObj) {
                var column = cellIndex.match(/[A-Z]+/i)[0];
                var row = cellIndex.match(/\d+/)[0];
                return {
                    column: column,
                    row: row,
                };
            }
            return cellIndex;
        }
        return null
    }

    async function setCurrentCellIndex(cellIndex) {
        if (document.querySelector('.waffle-name-box')) {
            nonReactive = true;
            var inputBox = document.querySelector('.waffle-name-box');

            if (typeof cellIndex === 'string') {
                inputBox.value = cellIndex;
            } else if (typeof cellIndex === 'object') {
                var column = cellIndex.column || '';
                var row = cellIndex.row || '';
                inputBox.value = column + row;
            }

            await delay(80); // Delay for smoother execution

            // Trigger click event
            var clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
            });
            inputBox.dispatchEvent(clickEvent);

            await delay(80); // Delay for smoother execution

            // Trigger enter key event
            var enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                view: window,
                bubbles: true,
                cancelable: true,
            });
            inputBox.dispatchEvent(enterEvent);

            nonReactive = false;
        }
    }

    async function getValueFromCell(cellIndex, goPreviousCell = true) {
        if (goPreviousCell) {
            var previousCellIndex = getCurrentCellIndex();
        }

        if (typeof cellIndex === 'string') {
            await setCurrentCellIndex(cellIndex);
        } else if (typeof cellIndex === 'object') {
            await setCurrentCellIndex(cellIndex.column + cellIndex.row);
        }

        var cellValue = getCurrentCellValue();
        if (goPreviousCell) {
            await setCurrentCellIndex(previousCellIndex);
        }
        return cellValue;
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function openPopupWithContent(url) {
        var modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.style.position = 'fixed';
        modalOverlay.style.top = '0';
        modalOverlay.style.left = '0';
        modalOverlay.style.width = '100%';
        modalOverlay.style.height = '100%';
        modalOverlay.style.background = 'rgba(0, 0, 0, 0.5)';
        modalOverlay.style.zIndex = '9999';

        var modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        modalContainer.style.position = 'fixed';
        modalContainer.style.top = '50%';
        modalContainer.style.left = '50%';
        modalContainer.style.transform = getOSName() == "Windows" ? 'translate(-30%, -50%)' : 'translate(-28%, -50%) scale(0.73)';
        modalContainer.style.width = '850px';
        modalContainer.style.minHeight = '700px';
        modalContainer.style.background = '#fff';
        modalContainer.style.borderRadius = '8px';
        modalContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
        modalContainer.style.overflow = 'hidden';

        var modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        modalHeader.style.padding = '16px';
        modalHeader.style.background = '#f0f0f0';
        modalHeader.style.borderBottom = '1px solid #ccc';
        modalHeader.style.display = 'flex';
        modalHeader.style.justifyContent = 'space-between';

        var modalTitle = document.createElement('h2');
        modalTitle.id = 'modal-title';
        modalTitle.style.margin = '0';

        var prevCellIndex = getCurrentCellIndex().row
        var current_row = getCurrentCellIndex(true).row

        modalTitle.textContent = `${await getValueFromCell({ column: FAMILY_NAME_COLUMN, row: current_row }, false)}, (${await getValueFromCell({ column: CLASS_PERIOD_COLUMN, row: current_row }, false)}) ${await getValueFromCell({ column: DATE_COLUMN, row: current_row }, false)} D${await getValueFromCell({ column: ASSIGNED_SEAT_COLUMN, row: current_row }, false)}`;

        await setCurrentCellIndex(prevCellIndex);

        var modalCloseButton = document.createElement('button');
        modalCloseButton.id = 'modal-close-btn';
        modalCloseButton.type = 'button';
        modalCloseButton.style.border = 'none';
        modalCloseButton.style.background = 'none';
        modalCloseButton.style.fontFamily = 'Arial, sans-serif';
        modalCloseButton.style.fontSize = '16px';
        modalCloseButton.style.fontWeight = 'bold';
        modalCloseButton.style.cursor = 'pointer';
        modalCloseButton.textContent = '✕';

        modalCloseButton.addEventListener('click', function () {
            closeModal();
        });

        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(modalCloseButton);

        var modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        modalBody.style.padding = '16px';
        modalBody.style.height = '550px';

        var iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';

        modalBody.appendChild(iframe);

        var modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';
        modalFooter.style.display = 'flex';
        modalFooter.style.justifyContent = 'space-between';
        modalFooter.style.padding = '16px';
        modalFooter.style.background = '#f0f0f0';
        modalFooter.style.borderTop = '1px solid #ccc';
        modalFooter.style.alignItems = "center";

        console.log('hi from creating')
        var studentText = document.createElement('span');
        studentText.textContent = `Student ID: ${await getValueFromCell({ column: STUDENT_ID_COLUMN, row: getCurrentCellIndex(true).row })}`;

        var statusDiv = document.createElement('div');
        statusDiv.id = 'status-div';
        statusDiv.style.display = 'flex';
        statusDiv.style.alignItems = 'center';
        statusDiv.style.placeContent = 'center';

        var scoreDiv = document.createElement('div');
        scoreDiv.id = 'score-div';
        scoreDiv.style.display = 'flex';
        scoreDiv.style.alignItems = 'center';

        // Create a checkbox
        var approvalCheckbox = document.createElement('input');
        approvalCheckbox.type = 'checkbox';
        approvalCheckbox.id = 'approval-checkbox';

        // Create a label for the checkbox
        var approvalLabel = document.createElement('label');
        approvalLabel.innerHTML = 'Approving?';
        approvalLabel.setAttribute('for', 'approval-checkbox');

        // Create a checkbox
        var AICheckbox = document.createElement('input');
        AICheckbox.type = 'checkbox';
        AICheckbox.id = 'AI-checkbox';

        // Create a label for the AI checkbox
        var AILabel = document.createElement('label');
        AILabel.innerHTML = 'AI?';
        AILabel.setAttribute('for', 'AI-checkbox');

        // Append the checkbox and label to the statusDiv
        statusDiv.appendChild(AICheckbox);
        statusDiv.appendChild(AILabel);
        statusDiv.appendChild(approvalCheckbox);
        statusDiv.appendChild(approvalLabel);

        var inputDiv = document.createElement('div');
        inputDiv.id = 'input-div';
        inputDiv.style.display = 'flex';
        inputDiv.style.alignItems = 'center';

        var input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'LA';
        input.style.border = '1px solid black';
        input.style.borderRadius = '1px solid black';
        input.style.height = '1.6em';
        input.style.width = '3em';
        input.style.marginRight = '3px';
        input.style.marginLeft = '3px';

        var cinput = document.createElement('input');
        cinput.type = 'text';
        cinput.placeholder = 'CZ';
        cinput.style.border = '1px solid black';
        cinput.style.borderRadius = '1px solid black';
        cinput.style.height = '1.6em';
        cinput.style.width = '3em';
        cinput.style.marginRight = '3px';
        cinput.style.marginLeft = '3px';

        var nextButton = document.createElement('button');
        nextButton.type = 'button';
        nextButton.textContent = 'Next';
        nextButton.style.border = 'none';
        nextButton.style.background = 'none';
        nextButton.style.fontFamily = 'Arial, sans-serif';
        nextButton.style.fontSize = '16px';
        nextButton.style.fontWeight = 'bold';
        nextButton.style.cursor = 'pointer';

        var prevButton = document.createElement('button');
        prevButton.type = 'button';
        prevButton.textContent = 'Prev';
        prevButton.style.border = 'none';
        prevButton.style.background = 'none';
        prevButton.style.fontFamily = 'Arial, sans-serif';
        prevButton.style.fontSize = '16px';
        prevButton.style.fontWeight = 'bold';
        prevButton.style.cursor = 'pointer';

        nextButton.addEventListener('click', async function () {

            var currentIndex = getCurrentCellIndex(true);
            var currentRow = Number(currentIndex.row);
            const cellValues = [
                { column: SCORE_COLUMN, row: currentRow, value: input.value },
                { column: CITIZENSHIP_SCORE_COLUMN, row: currentRow, value: cinput.value },
                { column: COMMENT_COLUMN, row: currentRow, value: textarea.value },
            ];

            // Check if AICheckbox is checked
            if (AICheckbox.checked) {
                cellValues.push({ column: AI_COLUMN, row: currentRow, value: "TRUE" });
            }

            // Check if approvalCheckbox is checked
            if (approvalCheckbox.checked) {
                cellValues.push({ column: STATUS_COLUMN, row: currentRow, value: "Approving" });
            }

            if (AICheckbox.checked || approvalCheckbox.checked || textarea.value || input.value || cinput.value) {
                await setMultipleCellValuesSequentially(cellValues);
            }
            var nextRow = currentRow + 1;

            // Navigate to the next row
            await setCurrentCellIndex({ column: IMAGES_COLUMN, row: nextRow });
            await triggerImagePopup()
        });

        prevButton.addEventListener('click', async function () {
            var currentIndex = getCurrentCellIndex(true);
            var currentRow = Number(currentIndex.row);
            const cellValues = [
                { column: SCORE_COLUMN, row: currentRow, value: input.value },
                { column: CITIZENSHIP_SCORE_COLUMN, row: currentRow, value: cinput.value },
                { column: COMMENT_COLUMN, row: currentRow, value: textarea.value },
            ];

            // Check if AICheckbox is checked
            if (AICheckbox.checked) {
                cellValues.push({ column: AI_COLUMN, row: currentRow, value: "TRUE" });
            }

            // Check if approvalCheckbox is checked
            if (approvalCheckbox.checked) {
                cellValues.push({ column: STATUS_COLUMN, row: currentRow, value: "Approving" });
            }

            if (AICheckbox.checked || approvalCheckbox.checked || textarea.value || input.value || cinput.value) {
                await setMultipleCellValuesSequentially(cellValues);
            }
            var prevRow = currentRow - 1;

            // Navigate to the previous row
            await setCurrentCellIndex({ column: IMAGES_COLUMN, row: prevRow });
            await triggerImagePopup()
        });

        var inpControlDiv = document.createElement('div');
        inpControlDiv.id = 'inpControl-div';

        var controlDiv = document.createElement('div');
        controlDiv.id = 'control-div';

        inputDiv.appendChild(prevButton);
        inputDiv.appendChild(input);
        inputDiv.appendChild(cinput);
        inputDiv.appendChild(nextButton);

        var information = `LA
0: Be sure that every page is submitted, in-focus, and has your Student ID # and Period #.
1: Be sure to complete Part 2
2: Be sure to complete Part 3 and use complete sentences.
3: Be sure to complete Part 4 and use complete sentences.
4: You completed the activity, but some of your answers do not make sense.
5: You completed the activity, and all of your answers are valid.

CZ
0: Be sure that the desk number is visible on your desk caddy, calculator, and desk.
1: Be sure to clean the top of your desk.
2: Be sure there are four blue pens (capped and correctly positioned).
3: Be sure each folder is spine-down and in the correct sleeve.
4: Be sure to remove any loose papers.
5: You cleaned your desk and organized your desk caddy.`;

        // Create a span element for the tooltip
        var infoSpan = document.createElement('span');
        infoSpan.title = information;
        infoSpan.textContent = '🛈';
        infoSpan.style.cursor = 'help';

        // Append the created span to the inpControlDiv
        inpControlDiv.appendChild(infoSpan);
        inpControlDiv.appendChild(inputDiv);
        inpControlDiv.appendChild(statusDiv);

        scoreDiv.appendChild(studentText);

        var textarea = document.createElement('textarea');
        textarea.cols = '40';
        textarea.placeholder = 'Comments';
        textarea.style.border = '1px solid black';
        textarea.style.fontFamily = 'unset';
        textarea.style.borderRadius = '1px solid black';
        textarea.style.marginRight = '3px';
        textarea.style.marginLeft = '3px';
        textarea.style.height = '58px';

        var closeButton = document.createElement('button');
        closeButton.id = 'modal-close-btn';
        closeButton.type = 'button';
        closeButton.style.border = 'none';
        closeButton.style.background = 'none';
        closeButton.style.fontFamily = 'Arial, sans-serif';
        closeButton.style.fontSize = '16px';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.cursor = 'pointer';
        closeButton.textContent = 'Close';

        closeButton.addEventListener('click', function () {
            closeModal();
        });

        controlDiv.appendChild(textarea)
        controlDiv.appendChild(closeButton)

        // Update the input event listeners for LA and CZ inputs
        input.addEventListener('input', function () {
            updateCommentsBasedOnScores(input.value, cinput.value);
        });

        cinput.addEventListener('input', function () {
            updateCommentsBasedOnScores(input.value, cinput.value);
        });

        // Define the function to update comments based on scores
        function updateCommentsBasedOnScores(laScore, czScore) {


            var laIndex = parseInt(laScore, 10);
            var czIndex = parseInt(czScore, 10);

            var finalComment = '';
            if (!isNaN(laIndex) && laIndex >= 0 && laIndex < laComments.length) {
                finalComment += laComments[laIndex];
            }
            if (!isNaN(czIndex) && czIndex >= 0 && czIndex < czComments.length) {
                finalComment += (finalComment ? ' ' : '') + czComments[czIndex];
            }

            textarea.value = finalComment;
        }

        modalFooter.appendChild(scoreDiv);
        modalFooter.appendChild(inpControlDiv);
        modalFooter.appendChild(controlDiv);

        modalContainer.appendChild(modalHeader);
        modalContainer.appendChild(modalBody);
        modalContainer.appendChild(modalFooter);

        modalOverlay.appendChild(modalContainer);
        document.body.appendChild(modalOverlay);

        function closeModal() {
            document.body.removeChild(modalOverlay);
        }
    }

    // Add tooltip message below the spreadsheet
    var tooltip = document.createElement('div');
    tooltip.innerText = getOSName() == "Windows" ? 'ALT+CLICK - Popup' : 'Cell + Here';
    tooltip.style.position = 'fixed';
    tooltip.style.bottom = '40px';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translateX(-50%)';
    tooltip.style.padding = '4px 8px';
    tooltip.style.background = '#000';
    tooltip.style.color = '#fff';
    tooltip.style.fontFamily = 'Arial, sans-serif';
    tooltip.style.fontSize = '12px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.opacity = '0.7';
    tooltip.style.zIndex = '9999';
    tooltip.addEventListener('click', async function () {
        if (document.querySelector('.cell-input') && !nonReactive) {
            triggerImagePopup()
        }
    });
    document.body.appendChild(tooltip);

    // Remove tooltip after a short delay
    //setTimeout(function() {
    //tooltip.parentNode.removeChild(tooltip);
    //}, 3000);
})();
