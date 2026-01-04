// ==UserScript==
// @name         Заповнити підсумкове оцінювання
// @namespace    http://tampermonkey.net/
// @version      2024-05-31
// @description  Розширення для заповнення таблиці із підсумковим оцінюванням 5-6 класів
// @author       Valerii Kolesnik
// @license      MIT
// @match        https://journal.eschool-ua.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eschool-ua.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496935/%D0%97%D0%B0%D0%BF%D0%BE%D0%B2%D0%BD%D0%B8%D1%82%D0%B8%20%D0%BF%D1%96%D0%B4%D1%81%D1%83%D0%BC%D0%BA%D0%BE%D0%B2%D0%B5%20%D0%BE%D1%86%D1%96%D0%BD%D1%8E%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/496935/%D0%97%D0%B0%D0%BF%D0%BE%D0%B2%D0%BD%D0%B8%D1%82%D0%B8%20%D0%BF%D1%96%D0%B4%D1%81%D1%83%D0%BC%D0%BA%D0%BE%D0%B2%D0%B5%20%D0%BE%D1%86%D1%96%D0%BD%D1%8E%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const REFRESH_DELAY = 500;
    const PENCIL_ICON = '\u270E';

    function createInputDiv(placeholder, inputId) {
        const inputDiv = document.createElement("div");

        const input = document.createElement("input");

        input.setAttribute("placeholder", placeholder);
        input.id = inputId;
        inputDiv.append(input);

        return inputDiv;
    }

    function createMarkDialog() {
        const markForm = document.createElement("form");

        markForm.className = "markFormDialog";

        const labelPupil = document.createElement("label");
        labelPupil.className = "pupilNameLabel";
        const semestr1 = createInputDiv("1 семестр", "semestr-1");
        const semestr2 = createInputDiv("2 семестр", "semestr-2");
        const year = createInputDiv("річна", "year");
        const submit = document.createElement("button");
        submit.setAttribute("type", "button")
        submit.innerHTML = "Заповнити";
        submit.onclick = (event) => {
            var pupilObject = JSON.parse(localStorage.getItem("currentPupilObject"));

            var currentPupilTd = [...document.querySelectorAll(`td[class='${pupilObject.tdClassName}']`)]
                .find(td => td.innerText === pupilObject.pupilNameSurname);

            var currentPupilTr = currentPupilTd.parentElement;

            var startPuttingMarks = false;
            var skipNonMarksCellCount = 0;
            var markGroups = ["semestr1", "semestr2", "year"]

            if (currentPupilTr && currentPupilTr.hasChildNodes()) {
                // Update current pupil object from form
                pupilObject = getCurrentPupilObjectFromForm(currentPupilTr);

                for (var i = 0; i < currentPupilTr.children.length; i++) {

                    // Find first table cell (td) content of which is equal to name and surname of saved pupil object
                    var currentTd = currentPupilTr.children[i];

                    if (!startPuttingMarks) {
                        startPuttingMarks = currentTd.innerText === pupilObject.pupilNameSurname;
                        if (startPuttingMarks) {
                            skipNonMarksCellCount = i + 1;
                        }
                        continue;
                    }

                    currentTd.click()

                    // Find modal dialog with marks
                    const markSplashDialog = document.querySelector("div[class*='MuiDialogContent-root summaryRating_flex-center__']");

                    var currentMarkGroupIndex = Math.floor((i - skipNonMarksCellCount) / 5);
                    var currentMarkGroup = markGroups[currentMarkGroupIndex];

                    var currentMarkButton = [...document.querySelectorAll("[class='MuiButton-label']")]
                        .find(label => label.innerText == pupilObject[currentMarkGroup])
                        .parentElement;

                    currentMarkButton.click()
                }

                const markDialog = tryGetMarkDialog()
                markDialog.reset()
                markDialog.style.display = 'none';
            }
        }

        markForm.append(labelPupil, semestr1, semestr2, year, submit);

        markForm.style.display = 'none';
        markForm.style['background-color'] = '#E6E6FA';
        markForm.style.position = 'absolute';
        markForm.style.top = '50%';
        markForm.style.left = '50%';
        markForm.style.padding = '10px';
        markForm.style.border = '2px solid black';
        document.body.append(markForm)
    }

    function tryGetMarkDialog() {
        var markDialog = document.querySelector(".markFormDialog");
        return markDialog;
    }

    function createFillButton() {
        const fillMarksButton = document.createElement("button");
        fillMarksButton.className = "btn-icon tgico-download tel-download";
        fillMarksButton.innerHTML = `<span class="tgico button-icon">${PENCIL_ICON}</span>`;
        fillMarksButton.setAttribute("type", "button");
        fillMarksButton.setAttribute("title", "Fill marks");
        fillMarksButton.setAttribute("aria-label", "Fill marks");
        fillMarksButton.style = "font-size: 30px;";
        fillMarksButton.onclick = (event) => {
            var pupilTr = fillMarksButton.parentElement.parentElement; // button is located in td, which is in tr, therefore we need tr to get info about all fields
            const markDialog = tryGetMarkDialog()

            if (pupilTr) {
                var pupilNameSurnameTd = pupilTr.querySelector("td[class*='summaryRating_second_']"); //summaryRating_second_ contains information about pupil's name, surname
                var pupilNameLabel = markDialog.querySelector(".pupilNameLabel");

                var currentPupilObject = getCurrentPupilObjectFromForm(pupilTr);

                localStorage.setItem("currentPupilObject", JSON.stringify(currentPupilObject));
                pupilNameLabel.innerHTML = pupilNameSurnameTd.innerHTML;
            }

            markDialog.style.display = 'block';
        }
        return fillMarksButton;
    }

    function getCurrentPupilObjectFromForm(pupilTableRecord) {
        const markDialog = tryGetMarkDialog();

        var pupilNameSurnameTd = pupilTableRecord.querySelector("td[class*='summaryRating_second_']"); //summaryRating_second_ contains information about pupil's name, surname
        var pupilNameLabel = markDialog.querySelector(".pupilNameLabel");

        var currentPupilObject = {
            pupilNameSurname: pupilNameSurnameTd.innerText,
            tdClassName: pupilNameSurnameTd.className,
            semestr1: markDialog.querySelector("#semestr-1").value,
            semestr2: markDialog.querySelector("#semestr-2").value,
            year: markDialog.querySelector("#year").value
        }

        return currentPupilObject;
    }

    function getFirstChildOrDefault(element, childClass) {
        if (!element) return null;

        var children = element.getElementsByClassName(childClass)

        if (children && children.length > 0) {
            return children[0];
        }

        return null;
    }

    setInterval(() => {
        var allColumnsWithSurname = document.querySelectorAll("td[class*='summaryRating_second_']");

        var markFormDialog = document.querySelector(".markFormDialog");

        if (!markFormDialog) {
            createMarkDialog();
        }

        for (var i = 0; i < allColumnsWithSurname.length; i++) {
            var surnameTd = allColumnsWithSurname[i];
            var pupilTr = surnameTd.parentElement;

            var fillMarksCell = getFirstChildOrDefault(pupilTr, 'fillMarksCell');

            if (!fillMarksCell) {
                const fillMarkColumn = document.createElement(`td`);
                const fillMarkButton = createFillButton()
                fillMarkColumn.className = "MuiTableCell-root MuiTableCell-body summaryRating_table__border_regular__2WMkZ MuiTableCell-sizeSmall fillMarksCell";
                fillMarkColumn.append(fillMarkButton);
                pupilTr.prepend(fillMarkColumn);

                const firstHeaderColumnWithNumber = document.querySelector("tr[class='MuiTableRow-root MuiTableRow-head'] > th");
                firstHeaderColumnWithNumber.setAttribute('colSpan', 2);
            }
        }

    }, REFRESH_DELAY)
})();