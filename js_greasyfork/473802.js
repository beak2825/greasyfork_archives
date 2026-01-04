// ==UserScript==
// @name         Wanikani Review Summary
// @namespace    https://tampermonkey.net/
// @version      0.7.3
// @license      MIT
// @description  Show a popup with statistics about the review session when returning to the dashboard
// @author       leohumnew
// @match        https://www.wanikani.com/*
// @require      https://greasyfork.org/scripts/489759-wk-custom-icons/code/CustomIcons.js?version=1417568
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473802/Wanikani%20Review%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/473802/Wanikani%20Review%20Summary.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let eventListenersAdded = false;

    window.addEventListener("turbo:load", function(e) {
        if (e.detail.url === "https://www.wanikani.com/subjects/review") {
            setTimeout(runScript, 0);
        }
    });
    if ("https://www.wanikani.com/subjects/review" === (window.Turbo?.session.history.pageLoaded ? window.Turbo.session.history.location.href : (document.readyState === "complete" ? window.location.href : null))) {
        runScript();
    }
    function keyListener(e) {
        // If statistics screen is open, set the right arrow key and the escape key to go back to the dashboard
        if (document.getElementById("summary-popup") != null) {
            switch (e.key) {
                case "ArrowRight":
                case "Enter":
                case "Escape":
                    e.preventDefault();
                    document.body.removeEventListener("keydown", keyListener);
                    if (window.Turbo) window.Turbo.visit("https://www.wanikani.com/dashboard");
                    else window.location.href = "https://www.wanikani.com/dashboard";
                    break;
            }
        }
    }

    // Global variables to hold current question state
    let currentQuestionType = "";
    let currentSubjectId = 0;
    let currentCategory = "";
    let currentWord = "";
    let currentSRSLevel = -1;

    async function runScript() {
        // Variables to store the statistics
        let questionsAnswered = 0;
        let itemsCorrect = 0;
        let itemsIncorrect = 0;
        let meaningCorrect = 0;
        let meaningIncorrect = 0;
        let readingCorrect = 0;
        let readingIncorrect = 0;
        let correctHistory = [];
        let incorrectEntered = new Map();
        let itemsList = []; // Array to store the items reviewed
        let quizQueueSRS = [];

        // Variables for answer time tracking
        let startTime = performance.now();
        let meaningAnswerTimes = [];
        let readingAnswerTimes = [];
        let itemTimeMap = new Map(); // Using a map to store time per item ID

        // Other Variables
        let SRSLevelNames = ["Lesson", "Appr. I", "Appr. II", "Appr. III", "Appr. IV", "Guru I", "Guru II", "Master", "Enl.", "Burned", "Error"];
        const GRAPH_HEIGHT = 120;

        // Create style element with popup styles and append it to the document head
        let style = document.createElement("style");
        style.id = "summary-popup-styles";
        style.textContent = ".summary-popup { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; color: var(--color-text); background-color: var(--color-wk-panel-content-background, #eee); padding: 50px; overflow-y: auto; font-size: var(--font-size-large); }";
        style.textContent += ".summary-popup .wk-icon { vertical-align: bottom; }";
        style.textContent += ".summary-popup > a { background-color: transparent; text-decoration: none; text-align: center; margin: 30px 50px; position: absolute; top: 0px; right: 0px; cursor: pointer; padding: 10px; border-radius: 5px; outline: 1px solid var(--color-tertiary, black); color: var(--color-text) } .summary-popup > a:hover { color: var(--color-tertiary, #bbb); }";
        style.textContent += ".summary-popup table { border-collapse: collapse; border-radius: 5px; width: 100%; background-color: var(--color-wk-panel-background, #000); } .summary-popup td { border: none; padding: 5px; text-align: center; }";
        style.textContent += ".summary-popup h1 { margin-bottom: 10px; font-weight: bold; font-size: var(--font-size-xlarge); } .summary-popup h2 { font-weight: bold; margin-top: 20px; padding: 20px; color: #fff; font-size: var(--font-size-large); border-radius: 5px 5px 0 0; }";
        style.textContent += ".summary-popup ul { background-color: var(--color-wk-panel-background, #fff); padding: 5px; border-radius: 0 0 5px 5px; } .summary-popup li { display: inline-block; } .summary-popup li a { display: block; margin: 10px 5px; padding: 10px; color: var(--color-text-dark, #fff); font-size: 1.5rem; height: 2.6rem; border-radius: 5px; text-decoration: none; position: relative; } .summary-popup li a img { filter: invert(var(--img-invert-value, 1)); height: 1em; vertical-align: middle; }";
        style.textContent += ".summary-popup .summary-popup__popup { background-color: var(--color-menu, #ddd); color: var(--color-text, #fff); text-decoration: none; padding: 10px; border-radius: 5px; position: fixed; z-index: 9999; display: none; font-size: var(--font-size-medium); box-shadow: 0 2px 3px rgba(0, 0, 0, 0.5); width: max-content; line-height: 1.3; }";
        style.textContent += ".summary-popup .summary-popup__popup:after { content: ''; position: absolute; top: -8px; margin-left: -10px; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 10px solid var(--color-menu, #ddd); }";
        style.textContent += ".summary-popup .summary-popup__popup--left:after { right: 15px; } .summary-popup .summary-popup__popup--right:after { left: 25px; }";
        style.textContent += ".summary-popup .accuracy-graph { position: relative; height: " + (GRAPH_HEIGHT + 42) + "px; width: 100%; background-color: var(--color-wk-panel-background, #fff); padding: 25px 1% 15px 1%; border-radius: 0 0 5px 5px; }";
        style.textContent += ".summary-popup .accuracy-graph span { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: var(--font-size-xlarge); color: var(--color-text); }";
        style.textContent += ".summary-popup ul .wk-icon { position: absolute; top: -8px; right: -8px; text-align: center; color: white; background-color: var(--color-burned); padding: 3px; border-radius: 50%; border: white solid 1px }";
        style.textContent += ".summary-popup ul .incorrect-text { color: var(--color-incorrect, #cc4343); font-size: var(--font-size-small); vertical-align: top; }";
        style.textContent += ".summary-tooltip { position: fixed; display: none; padding: 5px 10px; background-color: #333; color: white; border-radius: 5px; z-index: 10000; pointer-events: none; font-size: var(--font-size-medium); }";
        if(window.matchMedia('(prefers-color-scheme: dark)').matches) style.textContent += ".summary-popup ul .incorrect-text { filter: brightness(3) }";

        if(!document.getElementById("summary-popup-styles")) document.head.appendChild(style);

        // Function to calculate the percentage
        function percentage(numerator, denominator) {
            if(denominator == 0) return "--";
            return Math.round(numerator / denominator * 100) + "%";
        }

        // Function to get quiz queue SRS
        async function getQuizQueueSRS() {
            let elementArr = document.querySelector("#quiz-queue script[data-quiz-queue-target='subjectIdsWithSRS']");
            if(elementArr) {
                quizQueueSRS = JSON.parse(elementArr.innerHTML);
                quizQueueSRS = quizQueueSRS.subject_ids_with_srs_info;
            } else setTimeout(getQuizQueueSRS, 500);
        }
        getQuizQueueSRS();

        function injectEndCode() {
            // Clear the data-quiz-queue-done-url-value and data-quiz-queue-completion-url-value parameters on #quiz-queue
            function get_controller(name) { // Thanks to @rfindley for this function
                return Stimulus.getControllerForElementAndIdentifier(document.querySelector(`[data-controller~="${name}"]`),name);
            }
            let quizQueueController = get_controller("quiz-queue");
            let quizOnDoneReplacement = function() { setTimeout(showStatistics, 0); };
            quizQueueController.onDone = quizOnDoneReplacement.bind(quizQueueController);
            quizQueueController.quizQueue.onDone = quizQueueController.onDone;
        }

        // Function to create a popup element
        function createPopup(content) {
            // Create a div element with some styles
            let popup = document.createElement("div");
            popup.id = "summary-popup";
            popup.className = "summary-popup";

            // Create a close button with some styles and functionality
            let closeButton = document.createElement("a");
            closeButton.textContent = "Dashboard";
            closeButton.href = "https://www.wanikani.com/dashboard";
            closeButton.addEventListener('click', function() {
                document.body.removeEventListener("keydown", keyListener);
                document.getElementById('summary-popup')?.remove();
            });

            // Append the content and the close button to the popup
            popup.append(content, closeButton);

            return popup;
        }

        // Function to create a table element with some data
        function createTable(data) {
            // Create a table
            let table = document.createElement("table");
            let row = document.createElement("tr");
            let row2 = document.createElement("tr");
            let row3 = document.createElement("tr");

            // Loop through the data array
            for (let i = 0; i < data.length; i++) {
                // Create table cell elements
                let cell = document.createElement("td");
                cell.textContent = data[i][0];
                cell.style.fontSize = "var(--font-size-xxlarge)";
                cell.style.fontWeight = "bold";
                cell.style.padding = "25px 0 0 0";
                row.appendChild(cell);

                let cell2 = document.createElement("td");
                cell2.textContent = data[i][1];
                cell2.style.fontSize = "var(--font-size-small)";
                cell2.style.fontStyle = "italic";
                cell2.style.color = "var(--color-text-mid, #999)";
                cell2.style.padding = "4px 0 10px 0";
                row2.appendChild(cell2);

                let cell3 = document.createElement("td");
                cell3.textContent = data[i][2];
                cell3.style.fontSize = "var(--font-size-medium)";
                cell3.style.paddingBottom = "25px";
                row3.appendChild(cell3);
            }
            // Append the rows to the table
            table.append(row, row2, row3);

            // Return the table element
            return table;
        }

        // Function to create summary section
        function createSummarySectionTitle(title, icon, bgColor) {
            let sectionTitle = document.createElement("h2");
            sectionTitle.appendChild(Icons.customIcon(icon));
            sectionTitle.innerHTML += " " + title;
            sectionTitle.style.backgroundColor = bgColor;
            return sectionTitle;
        }

        // Function to create graph
        function createGraph(data, canvas, congratulationMessageText, labels) {
            let graphWidth = canvas.getBoundingClientRect().width;
            canvas.height = GRAPH_HEIGHT + 2;
            canvas.width = graphWidth;
            let sidesOffset = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--font-size-small')); // Offset to apply to sides so that label text will fit - is applied to sides and bottom
            let bottomOffset = sidesOffset * 1.3;
            let graphStep = (graphWidth - (sidesOffset * 2)) / (data.length - 1);
            let isAllPerfect = true;
            let ctx = canvas.getContext("2d");
            // Draw background horizontal lines
            ctx.beginPath();
            if(window.getComputedStyle(document.documentElement).getPropertyValue('--color-text-mid') == "") ctx.strokeStyle = "#aaa";
            else ctx.strokeStyle = window.getComputedStyle(document.documentElement).getPropertyValue('--color-wk-panel-content-background');
            ctx.lineWidth = 1;
            for (let i = 0; i < 4; i++) {
                let y = Math.round((GRAPH_HEIGHT - bottomOffset) / 3 * i) + 0.5;
                ctx.moveTo(0, y);
                ctx.lineTo(graphWidth, y);
            }
            ctx.stroke();
            // Draw graph
            ctx.beginPath();
            ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text');
            ctx.lineWidth = 2;
            for (let i = 0; i < data.length; i++) {
                let x = graphStep * i + sidesOffset;
                let y = (GRAPH_HEIGHT - bottomOffset) * (1 - data[i]) + 1;
                if(data[i] != 1) isAllPerfect = false;
                // Draw line
                if(i == 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            // Draw labels
            if(labels != null) {
                let lastLabel = "";
                let isDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].includes(labels[0]);
                ctx.fillStyle = window.getComputedStyle(document.documentElement).getPropertyValue('--color-text');
                ctx.font = window.getComputedStyle(document.documentElement).getPropertyValue('--font-size-small') + " sans-serif";
                ctx.textAlign = "center";
                for (let i = 0; i < data.length; i++) {
                    if(labels[i] != lastLabel) {
                        let x = graphStep * i + sidesOffset;
                        let y = GRAPH_HEIGHT - 1;
                        ctx.fillText(labels[i], x, y);
                        lastLabel = labels[i];
                    } else if(isDays && i == data.length - 1) {
                        let x = graphStep * i + sidesOffset;
                        let y = GRAPH_HEIGHT - 1;
                        ctx.fillText("Now", x, y);
                    }
                }
            }
            // Show congratulation message if all perfect
            if(isAllPerfect) {
                let congratulationMessage = document.createElement("span");
                congratulationMessage.textContent = congratulationMessageText;
                canvas.parentNode.appendChild(congratulationMessage);
            }
        }

        // Function to create a line graph for answer times
        function createTimeGraph(data, canvas, titleText) {
            if (!data || data.length === 0) return;

            const parentStyle = getComputedStyle(canvas.parentElement);
            const graphWidth = parseFloat(parentStyle.width);
            canvas.height = GRAPH_HEIGHT + 42;
            canvas.width = graphWidth;

            let ctx = canvas.getContext("2d");

            const padding = 30;
            const graphContentWidth = graphWidth - padding * 2;
            const graphContentHeight = GRAPH_HEIGHT;
            const maxTime = Math.ceil(Math.max(...data));
            const stepX = data.length > 1 ? graphContentWidth / (data.length - 1) : graphContentWidth;

            // --- Draw Y-axis labels and grid lines ---
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)';
            ctx.lineWidth = 1;
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text');
            ctx.font = "12px sans-serif";
            ctx.textAlign = "right";
            const numGridLines = 4;
            for (let i = 0; i <= numGridLines; i++) {
                const y = padding + (i * (graphContentHeight / numGridLines));
                const labelValue = (maxTime * (1 - i / numGridLines));
                const label = (maxTime > 10 ? Math.round(labelValue) : labelValue.toFixed(1)) + 's';
                ctx.fillText(label, padding - 5, y + 4);
                ctx.moveTo(padding, y);
                ctx.lineTo(padding + graphContentWidth, y);
            }
            ctx.stroke();

            // --- Draw data line ---
            ctx.beginPath();
            ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text');
            ctx.lineWidth = 2;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            data.forEach((value, i) => {
                const x = padding + i * stepX;
                const y = padding + graphContentHeight * (1 - (value / maxTime));
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();

            // --- Draw title ---
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text');
            ctx.font = "bold 14px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(titleText, graphWidth / 2, padding - 10);
        }

        // Function to create a bar chart for total time per item with tooltips
        function createTimeBarChart(items, canvas, titleText, tooltipEl) {
            if (!items || items.length === 0) return;

            const data = items.map(item => item.totalTime);
            const labels = items.map(item => item.characters.url ? '🖼️' : item.characters); // Handle image radicals

            const parentStyle = getComputedStyle(canvas.parentElement);
            const graphWidth = parseFloat(parentStyle.width);
            canvas.height = GRAPH_HEIGHT + 60;
            canvas.width = graphWidth;

            let ctx = canvas.getContext("2d");

            const topPadding = 30;
            const sidePadding = 25;
            const bottomPadding = 30;
            const graphContentWidth = graphWidth - sidePadding * 2;
            const graphContentHeight = canvas.height - topPadding - bottomPadding;
            const maxTime = Math.ceil(Math.max(...data, 1)); // Avoid maxTime being 0

            function drawChart() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // --- Draw Y-axis labels and grid lines ---
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)';
                ctx.lineWidth = 1;
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text');
                ctx.font = "12px sans-serif";
                ctx.textAlign = "right";
                const numGridLines = 4;
                for (let i = 0; i <= numGridLines; i++) {
                    const y = topPadding + (i * (graphContentHeight / numGridLines));
                    const labelValue = (maxTime * (1 - i / numGridLines));
                    const label = (maxTime > 10 ? Math.round(labelValue) : labelValue.toFixed(1)) + 's';
                    ctx.fillText(label, sidePadding - 5, y + 4);
                    ctx.moveTo(sidePadding, y);
                    ctx.lineTo(sidePadding + graphContentWidth, y);
                }
                ctx.stroke();

                // --- Draw Bars ---
                const barWidth = graphContentWidth / data.length;

                data.forEach((value, i) => {
                    const barHeight = graphContentHeight * (value / maxTime);
                    const x = sidePadding + i * barWidth;
                    const y = topPadding + graphContentHeight - barHeight;

                    const itemType = items[i].type;
                    if (itemType === "Radical") {
                        ctx.fillStyle = "var(--color-radical, #00aaff)";
                    } else if (itemType === "Kanji") {
                        ctx.fillStyle = "var(--color-kanji, #ff00aa)";
                    } else {
                        ctx.fillStyle = "var(--color-vocabulary, #aa00ff)";
                    }
                    ctx.fillRect(x + barWidth * 0.1, y, barWidth * 0.8, barHeight > 0 ? barHeight : 0);
                });


                // --- Draw title ---
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text');
                ctx.font = "bold 14px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(titleText, graphWidth / 2, topPadding - 10);
            }
            drawChart(); // Initial draw

            // --- Tooltip Logic ---
            canvas.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                const barWidth = graphContentWidth / data.length;
                const index = Math.floor((mouseX - sidePadding) / barWidth);

                if (index >= 0 && index < data.length) {
                    const item = items[index];
                    const barHeight = graphContentHeight * (item.totalTime / maxTime);
                    const barX = sidePadding + index * barWidth;
                    const barY = topPadding + graphContentHeight - barHeight;

                    // Check if mouse is within the bar's bounds
                    if (mouseX >= barX && mouseX <= barX + barWidth && mouseY >= barY && mouseY <= topPadding + graphContentHeight) {
                        const character = item.characters.url ? '🖼️' : item.characters;
                        tooltipEl.innerHTML = `<span style="font-size: 1.5rem; vertical-align: middle;">${character}</span> ${item.totalTime.toFixed(2)}s`;
                        tooltipEl.style.left = `${e.pageX + 15}px`;
                        tooltipEl.style.top = `${e.pageY}px`;
                        tooltipEl.style.display = 'block';
                        return;
                    }
                }
                tooltipEl.style.display = 'none';
            });

            canvas.addEventListener('mouseout', () => {
                tooltipEl.style.display = 'none';
            });
        }


        // Function to show the statistics when returning to the dashboard
        function showStatistics() {
            // Check if there are any items reviewed
            if (itemsList.length > 0) {
                // Create a heading element with some text and styles
                let headingText = document.createElement("h1");
                headingText.appendChild(Icons.customIcon("check-checked"));
                headingText.innerHTML += " Review Summary";
                let heading = document.createElement("div");
                heading.append(headingText);

                // Create an unordered list element
                let listCorrect = document.createElement("ul");
                let listIncorrect = document.createElement("ul");

                // Loop through the items list array
                let srsUpNum = 0;
                let typeNum = [0, 0, 0];
                for (let i = 0; i < itemsList.length; i++) {
                    // Create a list item element with the character or image
                    let listItem = document.createElement("li");
                    let listItemLink = document.createElement("a");
                    if(itemsList[i].characters.url == null) listItemLink.textContent = itemsList[i].characters;
                    else {
                        let listItemImage = document.createElement("img");
                        listItemImage.src = itemsList[i].characters.url;
                        listItemLink.appendChild(listItemImage);
                    }
                    if (itemsList[i].type === "Radical") {
                        listItemLink.style.backgroundColor = "var(--color-radical, #00aaff)";
                        listItemLink.href = "https://www.wanikani.com/radicals/" + itemsList[i].meanings[0];
                    } else if (itemsList[i].type === "Kanji") {
                        listItemLink.style.backgroundColor = "var(--color-kanji, #ff00aa)";
                        listItemLink.href = "https://www.wanikani.com/kanji/" + itemsList[i].characters;
                    }
                    else {
                        listItemLink.style.backgroundColor = "var(--color-vocabulary, #aa00ff)";
                        listItemLink.href = "https://www.wanikani.com/vocabulary/" + itemsList[i].characters;
                    }

                    // Make link open in new tab
                    listItemLink.target = "_blank";

                    // Badge if burned or if warning
                    if(itemsList[i].newSRS == 9) {
                        listItemLink.style.paddingRight = "15px";
                        listItemLink.appendChild(Icons.customIcon("fire"));
                    } else if(itemsList[i].isWarning) {
                        listItemLink.style.paddingRight = "15px";
                        listItemLink.appendChild(Icons.customIcon("warning"));
                    }

                    // Create popup with meaning and reading info on hover
                    let popup = document.createElement("div");
                    popup.className = "summary-popup__popup";
                    popup.innerHTML = "Meaning: <strong>" + itemsList[i].meanings.slice(0, 2).join(", ") + "</strong>";
                    if(itemsList[i].incorrectEntered != null && itemsList[i].incorrectEntered[0].length > 0) popup.innerHTML += '<br><span class="incorrect-text">&nbsp;&nbsp;&nbsp;<strong>X</strong>&nbsp;' + itemsList[i].incorrectEntered[0].join(", ") + "</span>";
                    if(itemsList[i].type == "Kanji") {
                        typeNum[1]++;
                        for (let k = 0; k < itemsList[i].readings.length; k++) { // Nanori, Onyomi, Kunyomi readings if kanji
                            if (itemsList[i].readings[k] != null) {
                                let label = "";
                                switch (k) {
                                case 0:
                                    label = "Nanori";
                                    break;
                                case 1:
                                    label = "Onyomi";
                                    break;
                                case 2:
                                    label = "Kunyomi";
                                    break;
                                }
                                popup.innerHTML += "<br>" + label + ": <strong>" + itemsList[i].readings[k].join(", ") + "</strong>";
                            }
                        }
                    }
                    else if(itemsList[i].type != "Radical" && itemsList[i].readings.length > 0) { // Reading if vocabulary
                        typeNum[2]++;
                        popup.innerHTML += "<br>Reading: <strong>" +
                                        itemsList[i].readings.join(", ") +
                                        "</strong>";
                    } else { // No reading if radical
                        typeNum[0]++;
                    }
                    if(itemsList[i].incorrectEntered != null && itemsList[i].incorrectEntered[1].length > 0) popup.innerHTML += '<br><span class="incorrect-text">&nbsp;&nbsp;&nbsp;<strong>X</strong>&nbsp;' + itemsList[i].incorrectEntered[1].join(", ") + "</span>";
                    popup.innerHTML += "<br>SRS: " + SRSLevelNames[itemsList[i].oldSRS] + " -> " + SRSLevelNames[itemsList[i].newSRS];

                    popup.style.display = "block";
                    popup.style.visibility = "hidden";
                    listItemLink.addEventListener("mouseover", function(e) {
                        // Position the popup element relative to the parent item element: to the right of the parent unless that would cause the popup to go off the screen
                        let infoPos = listItemLink.getBoundingClientRect();
                        let popupPos = popup.getBoundingClientRect();
                        if (infoPos.left + popupPos.width + 5 > window.innerWidth) {
                            popup.style.right = window.innerWidth - infoPos.right + "px";
                            popup.style.removeProperty("left");
                            popup.className = "summary-popup__popup summary-popup__popup--left";
                        } else {
                            popup.style.left = infoPos.left + "px";
                            popup.style.removeProperty("right");
                            popup.className = "summary-popup__popup summary-popup__popup--right";
                        }
                        popup.style.top = infoPos.bottom + 5 + "px";
                        popup.style.visibility = "visible";
                    });

                    listItemLink.addEventListener("mouseout", function(e) {
                        popup.style.visibility = "hidden";
                    });
                    popup.style.visibility = "hidden";

                    // Append the list item to the list
                    listItemLink.appendChild(popup);
                    listItem.appendChild(listItemLink);
                    if (itemsList[i].SRSUp) {
                        listCorrect.appendChild(listItem);
                        srsUpNum++;
                    }
                    else listIncorrect.appendChild(listItem);
                }

                // Create a header table with main stats
                let data = [
                    [itemsList.length, "R: " + typeNum[0] + " / K: " + typeNum[1] + " / V: " + typeNum[2], "Items Completed"],
                    [percentage(srsUpNum, itemsList.length), srsUpNum + " out of " + itemsList.length, "Items Correct"],
                    [percentage(itemsCorrect, questionsAnswered), itemsCorrect + " out of " + questionsAnswered , "Questions Correct"],
                    [percentage(meaningCorrect, meaningCorrect + meaningIncorrect), meaningCorrect + " out of " + (meaningCorrect + meaningIncorrect), "Meanings Correct"],
                    [percentage(readingCorrect, readingCorrect + readingIncorrect), readingCorrect + " out of " + (readingCorrect + readingIncorrect), "Readings Correct"]
                ];
                let table = createTable(data);

                // Create h2 titles for the lists
                let correctTitle = createSummarySectionTitle(srsUpNum + " Items SRS Up", "srs-up", "var(--color-quiz-correct-background, #88cc00)");
                let incorrectTitle = createSummarySectionTitle((itemsList.length - srsUpNum) + " Items SRS Down", "srs-down", "var(--color-quiz-incorrect-background, #ff0033)");

                // Create a graph showing accuracy throughout the session using the correctHistory array, with an average of 3 elements
                let graphTitle, graphDiv;
                if(itemsList.length > 4) {
                    graphTitle = createSummarySectionTitle(" Session Accuracy", "chart-line", "var(--color-menu, #777)");
                    // Graph
                    graphDiv = document.createElement("div");
                    graphDiv.classList = "accuracy-graph";
                    let graph = document.createElement("canvas");
                    graph.style.width = "100%";
                    graph.style.height = "100%";
                    graphDiv.appendChild(graph);
                }

                // Get existing accuracy history array from local storage or create new one, then append the current accuracy to it and store it again
                let accuracyArray = JSON.parse(localStorage.getItem("WKSummaryAccuracyHistory")) || [];
                if(accuracyArray != [] && !Array.isArray(accuracyArray[0])) accuracyArray = [];
                accuracyArray.push([Math.round(srsUpNum / itemsList.length * 100) / 100, new Date().toLocaleString("en-US", {weekday: "short"})]);
                if(accuracyArray.length > 15) accuracyArray.shift(); // If the array is longer than 10 elements, remove the first one
                localStorage.setItem("WKSummaryAccuracyHistory", JSON.stringify(accuracyArray));

                // Create a graph showing accuracy throughout the last 10 (or less) sessions
                let graphTitle2, graphDiv2;
                if(accuracyArray.length > 3) {
                    graphTitle2 = createSummarySectionTitle(" Accuracy History", "chart-line", "var(--color-menu, #777)");
                    // Graph
                    graphDiv2 = document.createElement("div");
                    graphDiv2.classList = "accuracy-graph";
                    let graph = document.createElement("canvas");
                    graph.style.width = "100%";
                    graph.style.height = "100%";
                    graphDiv2.appendChild(graph);
                }

                // Create time tracking graphs
                let timeGraphTitle, timeGraphContainer;
                if (meaningAnswerTimes.length > 1 || readingAnswerTimes.length > 1) {
                    timeGraphTitle = createSummarySectionTitle("Answer Time Analysis", "chart-line", "var(--color-menu, #777)");

                    timeGraphContainer = document.createElement("div");
                    timeGraphContainer.className = "accuracy-graph";
                    timeGraphContainer.style.display = "flex";
                    timeGraphContainer.style.flexWrap = "wrap";
                    timeGraphContainer.style.gap = "20px";
                    timeGraphContainer.style.height = "auto";
                    timeGraphContainer.style.padding = "20px";
                    timeGraphContainer.style.position = "relative";


                    const graphWrapperStyle = `flex: 1 1 320px; min-width:320px; height: ${GRAPH_HEIGHT + 42}px;`;
                    const barGraphWrapperStyle = `flex: 2 1 660px; min-width:320px; height: ${GRAPH_HEIGHT + 60}px;`;

                    if (meaningAnswerTimes.length > 1) {
                        let wrapper = document.createElement('div');
                        wrapper.style.cssText = graphWrapperStyle;
                        let canvas = document.createElement("canvas");
                        canvas.className = "time-graph-meaning";
                        wrapper.appendChild(canvas);
                        timeGraphContainer.appendChild(wrapper);
                    }

                    if (readingAnswerTimes.length > 1) {
                        let wrapper = document.createElement('div');
                        wrapper.style.cssText = graphWrapperStyle;
                        let canvas = document.createElement("canvas");
                        canvas.className = "time-graph-reading";
                        wrapper.appendChild(canvas);
                        timeGraphContainer.appendChild(wrapper);
                    }

                    if (itemsList.some(item => item.totalTime > 0)) {
                        let wrapper = document.createElement('div');
                        wrapper.style.cssText = barGraphWrapperStyle;
                        wrapper.style.flexBasis = '100%'; // Make bar chart take full width
                        let canvas = document.createElement("canvas");
                        canvas.className = "time-graph-item-bar";
                        wrapper.appendChild(canvas);
                        timeGraphContainer.appendChild(wrapper);
                    }
                }


                // Create a div element to wrap everything
                let content = document.createElement("div");
                content.append(heading, table, incorrectTitle, listIncorrect, correctTitle, listCorrect, graphTitle ? graphTitle : "", graphDiv ? graphDiv : "", graphTitle2 ? graphTitle2 : "", graphDiv2 ? graphDiv2 : "", timeGraphTitle ? timeGraphTitle : "", timeGraphContainer ? timeGraphContainer : "");
                // Create a popup element with all the summary content
                let popup = createPopup(content);

                // Create a single tooltip element for the bar chart
                let barChartTooltip = document.createElement('div');
                barChartTooltip.className = 'summary-tooltip';
                popup.appendChild(barChartTooltip);

                (document.getElementById('turbo-body') ?? document.body).appendChild(popup);

                document.body.addEventListener("keydown", keyListener);

                // If it exists, fill the graph with the correctHistory array
                if(graphDiv) {
                    let graph = graphDiv.querySelector("canvas");
                    // Calculate graph data
                    let graphData = [];
                    for (let i = 1; i < correctHistory.length - 1; i++) {
                        graphData.push((correctHistory[i-1] + correctHistory[i] + correctHistory[i+1]) / 3);
                    }
                    createGraph(graphData, graph, "🎉 Perfect session! 🎉");
                }
                // If it exists, fill the second graph with the accuracyArray array
                if(graphDiv2) {
                    let graph = graphDiv2.querySelector("canvas");
                    createGraph(accuracyArray.map(tuple => tuple[0]), graph, "🎉 Perfect history! 🎉", accuracyArray.map(tuple => tuple[1]));
                }

                // Draw the time graphs
                if (timeGraphContainer) {
                    const meaningCanvas = timeGraphContainer.querySelector('.time-graph-meaning');
                    if (meaningCanvas) createTimeGraph(meaningAnswerTimes, meaningCanvas, "Meaning Answer Time (s)");

                    const readingCanvas = timeGraphContainer.querySelector('.time-graph-reading');
                    if (readingCanvas) createTimeGraph(readingAnswerTimes, readingCanvas, "Reading Answer Time (s)");

                    const itemBarCanvas = timeGraphContainer.querySelector('.time-graph-item-bar');
                    if (itemBarCanvas) createTimeBarChart(itemsList, itemBarCanvas, "Total Time per Item (s)", barChartTooltip);
                }

                // Reset the statistics variables
                questionsAnswered = 0;
                itemsCorrect = 0;
                itemsIncorrect = 0;
                meaningCorrect = 0;
                meaningIncorrect = 0;
                readingCorrect = 0;
                readingIncorrect = 0;
                itemsList = [];
                // Reset time tracking variables
                meaningAnswerTimes = [];
                readingAnswerTimes = [];
                itemTimeMap.clear();
                startTime = 0;

            } else {
                if (window.Turbo) window.Turbo.visit("https://www.wanikani.com/dashboard");
                else window.location.href = "https://www.wanikani.com/dashboard";
            }
        }

        function addEventListeners() {
            if (eventListenersAdded) return;
            eventListenersAdded = true;

            const isDoubleCheckEnabled = window.doublecheck != null;
            // Add an event listener for the didAnswerQuestion event
            window.addEventListener(isDoubleCheckEnabled ? "didFinalAnswer" : "didAnswerQuestion", function(e) {
                if(questionsAnswered == 0) {
                    injectEndCode();
                }

                // Check if the answer was correct or not by looking for the correct attribute
                let correct = e.detail.results.action == "pass";
                console.log(correct ? "Correct answer!" : "Incorrect answer!");
                correctHistory.push(correct);

                // Record the answer entered if incorrect
                if (!correct) {
                    if(!incorrectEntered.has(e.detail.subjectWithStats.subject.id)) incorrectEntered.set(e.detail.subjectWithStats.subject.id, [[], []]);
                    if(currentQuestionType === "meaning") incorrectEntered.get(e.detail.subjectWithStats.subject.id)[0].push(e.detail.answer);
                    else if(currentQuestionType === "reading") incorrectEntered.get(e.detail.subjectWithStats.subject.id)[1].push(e.detail.answer);
                }

                // Increment the questions answered and correct/incorrect counters
                questionsAnswered++;
                if (currentQuestionType === "meaning") {
                    correct ? meaningCorrect++ : meaningIncorrect++;
                } else if (currentQuestionType === "reading") {
                    correct ? readingCorrect++ : readingIncorrect++;
                }
                if (correct) itemsCorrect++;
                else itemsIncorrect++;
            });

            // Add an event listener for the didAnswerQuestion event
            window.addEventListener("didAnswerQuestion", function(e) {
                // Calculate and store answer time
                if (((isDoubleCheckEnabled && e.constructor.name === "CustomEvent") || (!isDoubleCheckEnabled && e.constructor.name === "DidAnswerQuestionEvent")) && startTime > 0) {
                    const timeTaken = (performance.now() - startTime) / 1000; // Time in seconds
                    if (currentQuestionType === "meaning") {
                        meaningAnswerTimes.push(timeTaken);
                    } else if (currentQuestionType === "reading") {
                        readingAnswerTimes.push(timeTaken);
                    }
                    // Add time to the current item's total time
                    const currentTime = itemTimeMap.get(currentSubjectId) || 0;
                    itemTimeMap.set(currentSubjectId, currentTime + timeTaken);
                }
            });

            // Add an event listener for the didCompleteSubject event
            window.addEventListener("didCompleteSubject", function(e) {
                // Get the subject data from the event detail
                let subject = e.detail.subjectWithStats.subject;
                let didSRSUp = e.detail.subjectWithStats.stats.meaning.incorrect === 0 && e.detail.subjectWithStats.stats.reading.incorrect === 0;
                let reading = null;
                if(subject.type == "Vocabulary" || subject.type == "KanaVocabulary") {
                    reading = subject.readings?.filter(m => ["primary", "alternative"].includes(m.kind)).map(m => m.text);
                } else if (subject.type == "Kanji") {
                    reading = [
                        subject.readings?.filter(r => r.type === "nanori").map(r => r.text),
                        subject.readings?.filter(r => r.type === "onyomi").map(r => r.text),
                        subject.readings?.filter(r => r.type === "kunyomi").map(r => r.text),
                    ].map(r => r?.length > 0 ? r : null);
                }

                let isWarning = e.detail.subjectWithStats.stats.meaning.incorrect + e.detail.subjectWithStats.stats.reading.incorrect > 2 || (e.detail.subjectWithStats.stats.meaning.incorrect > 0 && e.detail.subjectWithStats.stats.reading.incorrect > 0);

                // Calculate the new SRS level
                let newSRSLevel = didSRSUp ? currentSRSLevel + 1 : (currentSRSLevel < 2 ? currentSRSLevel : (currentSRSLevel < 5 ? currentSRSLevel - 1 : currentSRSLevel - 2));

                // Get total time for this item from the map
                const totalTime = itemTimeMap.get(subject.id) || 0;

                // Push the subject data to the items list array
                let subjectInfoToSave = { characters: subject.characters, type: subject.type, id: subject.id, SRSUp: didSRSUp, meanings: subject.meanings?.filter(m => ["primary", "alternative"].includes(m.kind)).map(m => m.text), readings: reading, oldSRS: currentSRSLevel, newSRS: newSRSLevel, isWarning: isWarning, incorrectEntered: incorrectEntered.get(subject.id), totalTime: totalTime };
                itemsList.push(subjectInfoToSave);

            }, {passive: true});

            // Add an event listener for the didUnanswerQuestion event
            window.addEventListener("didUnanswerQuestion", function(e) {
                // Reset the start time for the next question
                startTime = performance.now();
            }, {passive: true});

            // Add an event listener for the willShowNextQuestion event
            window.addEventListener("willShowNextQuestion", function(e) {
                // Record start time for the question
                startTime = performance.now();

                currentSRSLevel = quizQueueSRS.find(function(element) { return element[0] == e.detail.subject.id; });
                if(currentSRSLevel == undefined) {
                    getQuizQueueSRS();
                    currentSRSLevel = quizQueueSRS.find(function(element) { return element[0] == e.detail.subject.id; });
                    if(currentSRSLevel == undefined) currentSRSLevel = [e.detail.subject.id, 10];
                }
                currentSRSLevel = currentSRSLevel[1];
                if(currentSRSLevel == null) {
                    getQuizQueueSRS();
                    currentSRSLevel = quizQueueSRS.find(function(element) { return element[0] == e.detail.subject.id; })[1];
                    if(currentSRSLevel == null) currentSRSLevel = 10;
                }
            }, {passive: true});

            // Add an event listener for the turbo before-visit event
            window.addEventListener("turbo:before-visit", function(e) {
                // Show stats if .summary-popup is not already visible and there are items reviewed
                if (questionsAnswered > 0 && document.getElementById("summary-popup") == null) {
                    e.preventDefault();
                    setTimeout(showStatistics, 0);
                }
            });
        }

        // Home button override
        async function getHomeButton() {
            let homeButton = document.querySelector(".summary-button");
            if(!homeButton) setTimeout(getHomeButton, 500);
            else {
                homeButton.setAttribute("title", "Show statistics and return to dashboard");
                homeButton.addEventListener("click", function(e) {
                    // Show stats if .summary-popup is not already visible and there are items reviewed
                    if (questionsAnswered > 0 && document.getElementById("summary-popup") == null) {
                        e.preventDefault();
                        setTimeout(showStatistics, 0);
                    }
                });
            }
        }

        addEventListeners();
        getHomeButton();
    }

    // Add an event listener for the willShowNextQuestion event, catching the first one as well
    window.addEventListener("willShowNextQuestion", function(e) {
        // Set current question variables with event info
        currentQuestionType = e.detail.questionType;
        currentSubjectId = e.detail.subject.id;
        currentCategory = e.detail.subject.type;
        currentWord = e.detail.subject.characters;
    }, {passive: true});
})();