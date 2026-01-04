// ==UserScript==
// @name            Vulkr Visual Editor
// @namespace       github.com/zr0x8
// @version         1.5
// @description     visually changes your test result
// @author          0x8
// @match           https://azota.vn/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/498243/Vulkr%20Visual%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/498243/Vulkr%20Visual%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //functions for local usage
    function roundNumber(num) {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }
    //actual script

    // Define CSS variables for GUI colors
    var root = document.documentElement;
    root.style.setProperty('--gui-background-color', '#fff'); // Default background color
    root.style.setProperty('--gui-text-color', 'black'); // Default text color
    root.style.setProperty('--gui-border-color', 'purple'); // Default border color
    root.style.setProperty('--gui-input-border-color', 'red'); // Input border color

    // Wait for the DOM to be fully loaded
    window.addEventListener('load', function() {
        // Create the GUI container
        var guiContainer = document.createElement('div');
        guiContainer.id = 'vulkyr-visual-editor';
        guiContainer.style.position = 'fixed';
        guiContainer.style.top = '10%';
        guiContainer.style.left = '5%';
        guiContainer.style.padding = '20px';
        guiContainer.style.backgroundColor = 'var(--gui-background-color)';
        guiContainer.style.color = 'var(--gui-text-color)'; // Text color
        guiContainer.style.border = '2px solid var(--gui-border-color)';
        guiContainer.style.zIndex = '10000';
        guiContainer.style.width = '90%';
        guiContainer.style.maxWidth = '400px';
        guiContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        guiContainer.style.display = 'none'; // Initially hidden
        guiContainer.style.borderRadius = '10px'; // Rounded corners

        // Add the minimize button
        var minimizeButton = document.createElement('div');
        minimizeButton.textContent = '–';
        minimizeButton.style.position = 'absolute';
        minimizeButton.style.top = '5px';
        minimizeButton.style.right = '5px';
        minimizeButton.style.width = '20px';
        minimizeButton.style.height = '20px';
        minimizeButton.style.borderRadius = '50%';
        minimizeButton.style.backgroundColor = 'darkred';
        minimizeButton.style.color = 'white';
        minimizeButton.style.display = 'flex';
        minimizeButton.style.justifyContent = 'center';
        minimizeButton.style.alignItems = 'center';
        minimizeButton.style.cursor = 'pointer';
        minimizeButton.style.fontSize = '14px';
        guiContainer.appendChild(minimizeButton);

        // Add the title
        var title = document.createElement('h2');
        title.textContent = 'Vulkr Visual Editor';
        title.style.color = 'red';
        guiContainer.appendChild(title);

        var subtitle = document.createElement('span');
        subtitle.textContent = 'by 0x8';
        subtitle.style.fontSize = 'smaller';
        subtitle.style.color = 'red';
        guiContainer.appendChild(subtitle);

        // Add a horizontal rule
        guiContainer.appendChild(document.createElement('hr'));

        // Create a content container for the input fields and button
        var contentContainer = document.createElement('div');
        guiContainer.appendChild(contentContainer);

        // Function to create a labeled input field
        function createInputField(labelText) {
            var container = document.createElement('div');
            container.style.marginBottom = '10px';

            var label = document.createElement('label');
            label.textContent = labelText;
            label.style.display = 'block';
            label.style.color = 'var(--gui-text-color)'; // Label text color
            container.appendChild(label);

            var input = document.createElement('input');
            input.type = 'text';
            input.style.border = 'none';
            input.style.borderBottom = '2px dashed var(--gui-input-border-color)';
            input.style.width = '100%';
            input.style.padding = '5px 0';
            input.style.color = 'var(--gui-text-color)'; // Input text color
            container.appendChild(input);

            return {
                label: label,
                input: input
            };
        }

        // Add input fields to the content container and store references
        var timeField = createInputField('Thời gian làm bài');
        contentContainer.appendChild(timeField.label);
        contentContainer.appendChild(timeField.input);

        var correctField = createInputField('Số câu đúng');
        contentContainer.appendChild(correctField.label);
        contentContainer.appendChild(correctField.input);

        // Add the button to the content container
        var editButton = document.createElement('button');
        editButton.textContent = 'Chỉnh sửa';
        editButton.style.marginTop = '20px';
        editButton.style.padding = '10px 20px';
        editButton.style.border = '2px solid var(--gui-text-color)';
        editButton.style.backgroundColor = 'white';
        editButton.style.cursor = 'pointer';
        editButton.style.borderRadius = '10px'; // Rounded button
        editButton.onclick = function() {
            // Get input values
            var timeElapsed = timeField.input.value.toString();
            var correctAnswer = parseInt(correctField.input.value);
            var totalQuestion = parseInt(document.querySelector("#azt-layout > div.azt-body.ng-star-inserted > div.flex.md\\:mt-0.mt-\\[4\\.7rem\\] > div > div.azt-content > azt-parent-checking-box > div > div > div.col-span-12.md\\:col-span-8 > div.box.mx-auto.mt-5 > div.azt-info-exam.mt-5.px-5.ng-star-inserted > div:nth-child(5) > p.text-md.text-slate-500.font-medium.ml-auto").textContent);
            var originalScore = document.querySelector("#azt-layout > div.azt-body.ng-star-inserted > div.flex.md\\:mt-0.mt-\\[4\\.7rem\\] > div > div.azt-content > azt-parent-checking-box > div > div > div.col-span-12.md\\:col-span-8 > div.box.mx-auto.mt-5 > div.text-center.border-b.border-slate-200\\/60.dark\\:border-darkmode-400.p-5.ng-star-inserted > span.font-medium.text-lg.ng-star-inserted").textContent;
            var maxScore = parseInt(originalScore.split('/')[1])
            
            // Find the element containing the text
            var timeElement = document.querySelector("#azt-layout > div.azt-body.ng-star-inserted > div.flex.md\\:mt-0.mt-\\[4\\.7rem\\] > div > div.azt-content > azt-parent-checking-box > div > div > div.col-span-12.md\\:col-span-8 > div.box.mx-auto.mt-5 > div.azt-info-exam.mt-5.px-5.ng-star-inserted > div:nth-child(2) > p.text-md.font-medium.ml-auto");
            var correctElement = document.querySelector("#azt-layout > div.azt-body.ng-star-inserted > div.flex.md\\:mt-0.mt-\\[4\\.7rem\\] > div > div.azt-content > azt-parent-checking-box > div > div > div.col-span-12.md\\:col-span-8 > div.box.mx-auto.mt-5 > div.azt-info-exam.mt-5.px-5.ng-star-inserted > div:nth-child(3) > p.text-md.font-medium.text-success.ml-auto")
            var falseElement = document.querySelector("#azt-layout > div.azt-body.ng-star-inserted > div.flex.md\\:mt-0.mt-\\[4\\.7rem\\] > div > div.azt-content > azt-parent-checking-box > div > div > div.col-span-12.md\\:col-span-8 > div.box.mx-auto.mt-5 > div.azt-info-exam.mt-5.px-5.ng-star-inserted > div:nth-child(4) > p.text-md.font-medium.text-danger.ml-auto")
            var scoreElement = document.querySelector("#azt-layout > div.azt-body.ng-star-inserted > div.flex.md\\:mt-0.mt-\\[4\\.7rem\\] > div > div.azt-content > azt-parent-checking-box > div > div > div.col-span-12.md\\:col-span-8 > div.box.mx-auto.mt-5 > div.text-center.border-b.border-slate-200\\/60.dark\\:border-darkmode-400.p-5.ng-star-inserted > span.font-medium.text-lg.ng-star-inserted")
                // Check if the element exists
                if (timeElement && correctElement && falseElement && scoreElement) {
                    if (isNaN(correctAnswer) || isNaN(totalQuestion)) {
                        alert("Lỗi, bạn có nhập sai dữ liệu không?")
                    }
                    else if (correctAnswer <= totalQuestion) {
                        // Modify the duration text
                        if (timeElapsed.toString() != "") {
                            timeElement.textContent = timeElapsed.toString();
                        }
                        //Modify the score text
                        scoreElement.textContent = roundNumber(maxScore/totalQuestion * correctAnswer).toString() + "/" + maxScore.toString();
                        //Modify the correct text
                        correctElement.textContent = correctAnswer.toString();
                        //Modify the wrong text
                        falseElement.textContent = (totalQuestion - correctAnswer).toString();
                        //returning result to alert
                        alert("Thành công!");
                    } else {
                        alert("Làm kiểu cặc gì mà số câu đúng còn hơn tổng số câu vậy cu?")
                    }
                }
                else {
                    alert("Không thể tìm thấy thứ cần chỉnh sửa, bạn có đang ở trong màn hình nộp bài không?");
                }

            // Example: Displaying an alert with the input values
        };
        contentContainer.appendChild(editButton);

        // Create the small circle button
        var circleButton = document.createElement('div');
        circleButton.id = 'circle-button';
        circleButton.style.position = 'fixed';
        circleButton.style.bottom = '20px';
        circleButton.style.right = '20px';
        circleButton.style.width = '40px';
        circleButton.style.height = '40px';
        circleButton.style.borderRadius = '50%';
        circleButton.style.backgroundColor = 'darkred';
        circleButton.style.color = 'white';
        circleButton.style.display = 'flex';
        circleButton.style.justifyContent = 'center';
        circleButton.style.alignItems = 'center';
        circleButton.style.cursor = 'pointer';
        circleButton.style.zIndex = '10001';
        circleButton.textContent = '+';
        circleButton.style.fontSize = '24px';
        circleButton.style.border = '2px solid var(--gui-text-color)'; // Button border
        circleButton.style.borderRadius = '50%'; // Rounded button

        // Add the GUI container and circle button to the document body
        document.body.appendChild(guiContainer);
        document.body.appendChild(circleButton);

        // Toggle the visibility of the GUI container and circle button
        circleButton.addEventListener('click', function() {
            guiContainer.style.display = 'block';
            circleButton.style.display = 'none';
        });

        minimizeButton.addEventListener('click', function() {
            guiContainer.style.display = 'none';
            circleButton.style.display = 'flex';
        });
    }, false);
})();
