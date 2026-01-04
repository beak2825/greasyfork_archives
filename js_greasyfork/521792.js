// ==UserScript==
// @name         KhanHack
// @namespace    http://khan.dyntech.cc
// @version      6.0
// @description  Sloppy lazybones anti-homework production
// @author       DynTech
// @match        *://*.khanacademy.org/*
// @oicon        https://dyntech.cc/favicon?q=khan.dyntech.cc
// @icon         https://cdn.dyntech.cc/r/khanhack.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521792/KhanHack.user.js
// @updateURL https://update.greasyfork.org/scripts/521792/KhanHack.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // This FREE script was extracted from a $7.99/month extension. You're welcome.
    (function() {
    const originalFetch = window.fetch;

    // Check for an existing container and restore it if minimized
    let mainContainer = document.getElementById('questionDataContainer');
    if (mainContainer) {
        // If the container is minimized, restore it
        if (mainContainer.classList.contains('minimized')) {
            mainContainer.classList.remove('minimized');
            const restoreButton = document.getElementById('restoreButton');
            restoreButton.classList.remove('minimized');
            const minimizeButton = document.getElementById('minimizeButton');
            minimizeButton.style.display = 'block';
        }
        return; // Prevent adding a new container
    }

    // Create a new main container to hold the output data
    mainContainer = document.createElement('div');
    mainContainer.id = 'questionDataContainer';

    // Ensure the body is loaded before appending
    if (document.body) {
        document.body.appendChild(mainContainer);
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            document.body.appendChild(mainContainer);
        });
    }

    // Style for the main container and question divs
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap');

        #questionDataContainer {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            height: 500px;
            overflow-y: auto;
            background-color: #1a1a1a;
            border: 2px solid #131313;
            padding: 10px;
            z-index: 9999;
            font-family: Poppins, sans-serif;
            font-size: 12px;
            border-radius: .8vw;
            color: white;
            transition: all .3s ease;
        }

        #questionDataContainer::-webkit-scrollbar {
            width: .6vw;
            height: 12px;
        }

        #questionDataContainer::-webkit-scrollbar-track {
            background: #141414;
        }

        #questionDataContainer::-webkit-scrollbar-thumb {
            background-color: #24c39d;
            border-radius: 1vw;
        }

        #questionDataContainer.minimized {
            width: 67px;
            height: 38px;
            overflow: hidden;
            border-radius: 10px;
            padding: 0;
        }

        #minimizeButton {
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: #333;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 12px;
            padding: 5px;
            cursor: pointer;
            font-family: Poppins, sans-serif;
            transition: all .3s ease;
        }

        #minimizeButton:hover {
            background-color: #444;
            transition: all .3s ease;
        }

        #questionDataContainer.minimized #khanHackHeader {
            opacity: 0;
        }

        #khanHackHeader {
            text-align: center;
            font-family: Poppins, sans-serif;
            margin-bottom: 0px;
            font-size: 28px;
            color: #fff;
        }

        #khanHackHeader span {
            color: #24c39d;
        }

        .question-div {
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 5px;
            color: black;
            overflow: hidden;
        }

        .radio-div {
            background-color: #e0ffe0;
        }

        .expression-div {
            background-color: #fff0f0;
        }

        .dropdown-div {
            background-color: #f0f0ff;
        }

        .orderer-div {
            background-color: #f5f5dc;
        }

        .input-div {
            background-color: #ffefd5;
        }

        .plotter-div {
            background-color: #ffe4b5;
        }

        .no-support-div {
            background-color: #ffcccc;
        }

        #answerToggle, #refreshButton {
            display: block;
            margin: 10px auto;
            padding: 5px;
            font-size: 14px;
            background-color: #333;
            color: white;
            border: 1px solid #444;
            cursor: pointer;
            border-radius: 5px;
            font-family: Poppins, sans-serif;
            font-weight: 400;
            transition: all .3s ease;
        }

        #answerToggle:hover, #refreshButton:hover {
            background-color: #444;
            transition: all .3s ease;
        }

        #answerContainer {
            display: block;
        }

        #restoreButton {
            display: none;
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: #333;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 12px;
            padding: 5px;
            cursor: pointer;
            font-family: Poppins, sans-serif;
        }

        #restoreButton.minimized {
            display: block;
        }

        img.img-ans {
            max-width: 100%;
            height: auto;
            border-radius: 5px;
            margin-top: 10px;
        }
    `;
    document.head.appendChild(style);

    // Add header, buttons, and answer container
    const header = document.createElement('h1');
    header.id = 'khanHackHeader';
    header.innerHTML = 'Khan<span>Hack</span>';

    const answerToggle = document.createElement('button');
    answerToggle.id = 'answerToggle';
    answerToggle.textContent = 'Hide Answers';
    let answersVisible = true;

    const refreshButton = document.createElement('button');
    refreshButton.id = 'refreshButton';
    refreshButton.textContent = 'Reset Answer List';

    const minimizeButton = document.createElement('button');
    minimizeButton.id = 'minimizeButton';
    minimizeButton.textContent = 'Minimize';

    const restoreButton = document.createElement('button');
    restoreButton.id = 'restoreButton';
    restoreButton.textContent = 'Restore';

    const answerContainer = document.createElement('div');
    answerContainer.id = 'answerContainer';

    mainContainer.appendChild(minimizeButton);
    mainContainer.appendChild(header);
    mainContainer.appendChild(answerToggle);
    mainContainer.appendChild(refreshButton);
    mainContainer.appendChild(answerContainer);
    mainContainer.appendChild(restoreButton);

    // Add functionality to hide/unhide the answers
    answerToggle.addEventListener('click', () => {
        answersVisible = !answersVisible;
        answerContainer.style.display = answersVisible ? 'block' : 'none';
        answerToggle.textContent = answersVisible ? 'Hide Answers' : 'Unhide Answers';
    });

    // Add functionality to refresh the page
    refreshButton.addEventListener('click', () => {
        location.reload();
    });

    // Add functionality to minimize the entire container
    minimizeButton.addEventListener('click', () => {
        mainContainer.classList.add('minimized');
        restoreButton.classList.add('minimized');
        minimizeButton.style.display = 'none';
    });

    // Add functionality to restore the container
    restoreButton.addEventListener('click', () => {
        mainContainer.classList.remove('minimized');
        restoreButton.classList.remove('minimized');
        minimizeButton.style.display = 'block';
    });

    // Utility function to convert decimal to simplified fraction
    function decimalToFraction(decimal) {
        if (decimal === 0) return "0";

        let negative = decimal < 0;
        decimal = Math.abs(decimal); // Make it positive to simplify calculations

        let whole = Math.trunc(decimal);
        let fraction = decimal - whole;

        const gcd = (a, b) => b ? gcd(b, a % b) : a;
        const precision = 1000000;
        let numerator = Math.round(fraction * precision);
        let denominator = precision;

        let commonDenominator = gcd(numerator, denominator);
        numerator = numerator / commonDenominator;
        denominator = denominator / commonDenominator;

        let fractionString = numerator === 0 ? '' : `${Math.abs(numerator)}/${denominator}`;
        let result = whole !== 0 ? `${whole} ${fractionString}`.trim() : fractionString;

        if (negative && result) {
            result = `-${result}`;
        }

        if (whole === 0 && numerator !== 0) {
            result = `${negative ? '-' : ''}${numerator}/${denominator}`;
        }

        return result;
    }

    // Function to handle image replacement
    function replaceGraphieImage(content) {
        const imageRegex = /!\[.*?\]\(web\+graphie:\/\/cdn.kastatic.org\/ka-perseus-graphie\/([a-f0-9]+)\)/;
        const match = content.match(imageRegex);
        if (match && match[1]) {
            const imageId = match[1];
            return `<img src="https://cdn.kastatic.org/ka-perseus-graphie/${imageId}.svg" class="img-ans" />`;
        }
        return content;
    }

    // Function to append content to the main container
    function appendToGUI(content, questionType) {
        try {
            const div = document.createElement('div');
            div.classList.add('question-div');

            // Add specific class based on question type
            if (questionType === 'radio') {
                div.classList.add('radio-div');
            } else if (questionType === 'expression') {
                div.classList.add('expression-div');
            } else if (questionType === 'dropdown') {
                div.classList.add('dropdown-div');
            } else if (questionType === 'orderer') {
                div.classList.add('orderer-div');
            } else if (questionType === 'input') {
                div.classList.add('input-div');
            } else if (questionType === 'plotter') {
                div.classList.add('plotter-div');
            } else if (questionType === 'no-support') {
                div.classList.add('no-support-div');
            }

            // Replace image markdown with <img> tag
            content = replaceGraphieImage(content);

            div.innerHTML = content; // Use innerHTML to allow image rendering
            answerContainer.appendChild(div); // Append answers to the answer container
        } catch (error) {
            console.error("Failed to append content to GUI:", error);
        }
    }

    // Function to clean up LaTeX-like expressions
    function cleanLatexExpression(expr) {
        if (typeof expr !== 'string') return expr; // Ensure it's a string before processing
        return expr.replace(/\\dfrac{(.+?)}{(.+?)}/g, '$1/$2')  // Fractions
                   .replace(/\\frac{(.+?)}{(.+?)}/g, '$1/$2')   // Fractions
                   .replace(/\\dfrac(\d+)(\d+)/g, '$1/$2')      // Handle shorthand \\dfrac12 as 1/2
                   .replace(/\\frac(\d+)(\d+)/g, '$1/$2')       // Handle shorthand \\frac12 as 1/2
                   .replace(/\\left\(/g, '(')
                   .replace(/\\right\)/g, ')')
                   .replace(/\\cdot/g, '*')
                   .replace(/\\times/g, '*')
                   .replace(/\\div/g, '/')
                   .replace(/\\\\/g, '')
                   .replace(/\\,/g, '')
                   .replace(/\\sqrt{(.+?)}(.*?)/g, '√($1)')
                   .replace(/\\sqrt/g, '√')
                   .replace(/\\cos/g, 'cos')                   // Handle cosine function
                   .replace(/\\sin/g, 'sin')                   // Handle sine function (in case you encounter it)
                   .replace(/\\tan/g, 'tan')                   // Handle tangent function (in case you encounter it)
                   .replace(/\\degree/g, '°')                  // Handle degree symbol
                   .replace(/\\,/g, '')
                   .replace(/\\\[/g, '[')
                   .replace(/\\\]/g, ']')
                   .replace(/\$/g, '');                        // Remove dollar signs
    }

    // Override fetch to capture /getAssessmentItem response
    window.fetch = function() {
        return originalFetch.apply(this, arguments).then(async (response) => {
            try {
                // Only handle responses that contain assessment items (questions/answers)
                if (response.url.includes("/getAssessmentItem")) {
                    const clonedResponse = response.clone();
                    const jsonData = await clonedResponse.json();
                    const itemData = jsonData.data.assessmentItem.item.itemData;
                    const questionData = JSON.parse(itemData).question;

                    // Log the full question data for debugging
                    console.log('Full question data:', questionData);

                    // Initialize a variable to hold the combined answers for dropdowns per question
                    const combinedAnswersPerQuestion = {};
                    let numericInputAnswers = [];

                    // Iterate over each widget and handle the answer logic
                    Object.keys(questionData.widgets).forEach(widgetKey => {
                        const widget = questionData.widgets[widgetKey];
                        let answer = "No answer available";

                        // Log the entire widget for debugging
                        console.log('Widget data:', widget);

                        try {
                            // Handle numeric-input type questions
                            if (widget.type === "input-number" || widget.type === "numeric-input") {
                                let answer;

                                // Check different possible paths for the answer, ensuring 0 is treated as a valid answer
                                if (widget.options?.value !== undefined && widget.options?.value !== null) {
                                    answer = widget.options.value;
                                } else if (widget.options?.answers?.[0]?.value !== undefined && widget.options?.answers?.[0]?.value !== null) {
                                    answer = widget.options.answers[0].value;
                                }

                                // If the answer is found, push it to the numericInputAnswers array
                                if (answer !== undefined && answer !== null) {
                                    numericInputAnswers.push(answer); // Add the answer to the array
                                } else {
                                    console.error("Answer not found for widget:", widget);
                                }
                            }

                            // Handle graphing type questions
                            else if (widget.type === "grapher" || widget.type === "interactive-graph") {
                                if (widget.options?.correct?.coords && widget.options.correct.coords.length > 0) {
                                    const coords = widget.options.correct.coords.map(coord => `(${coord.join(", ")})`);
                                    appendToGUI(`Graphing Question: Correct Coordinates: ${coords.join(" and ")}`, 'plotter');
                                    console.log('Graphing answers (coordinates):', coords);
                                } else {
                                    appendToGUI(`Graphing Question: No valid coordinates found`, 'plotter');
                                    console.log('Graphing Question: No valid coordinates found');
                                }
                            }

                            // Handle unsupported marker type questions
                            else if (widget.type === "label-image") {
                                appendToGUI("No hack support for this problem", 'no-support');
                            }

                            // Handle intercept type questions
                            else if (widget.type === "numeric-input" && widget.options?.answers) {
                                const yIntercept = `(0, ${widget.options.answers[0].value})`;
                                const xIntercept = `(${widget.options.answers[1].value}, 0)`;
                                appendToGUI(`y-intercept: ${yIntercept}, x-intercept: ${xIntercept}`, 'input');
                            }

                            // Handle dropdown type questions
                            else if (widget.type === "dropdown") {
                                if (widget.options?.choices) {
                                    answer = widget.options.choices.filter(c => c.correct).map(c => cleanLatexExpression(c.content));
                                }
                                const questionContent = questionData.content;
                                if (!combinedAnswersPerQuestion[questionContent]) {
                                    combinedAnswersPerQuestion[questionContent] = [];
                                }
                                combinedAnswersPerQuestion[questionContent].push(...answer);
                            }

                            // Handle expression type questions
                            else if (widget.type === "expression") {
                                if (widget.options?.answerForms && widget.options.answerForms.length > 1) {
                                    answer = widget.options.answerForms.filter(af => af.considered === "correct").map(af => cleanLatexExpression(af.value));
                                    appendToGUI(`Any of the following: ${JSON.stringify(answer, null, 2)}`, 'expression');
                                } else {
                                    answer = widget.options.answerForms.filter(af => af.considered === "correct").map(af => cleanLatexExpression(af.value));
                                    appendToGUI(`Question Type: expression, Answer: ${JSON.stringify(answer, null, 2)}`, 'expression');
                                }
                                console.log('Expression answers:', answer);
                            }

                            // Handle orderer type questions
                            else if (widget.type === "orderer") {
                                if (widget.options?.correctOptions) {
                                    const correctOrder = widget.options.correctOptions.map(option => option.content);
                                    appendToGUI(`Orderer Question: Correct Order: ${JSON.stringify(correctOrder, null, 2)}`, 'orderer');
                                    console.log('Orderer answers:', answer);
                                }
                            }

                            // Handle radio type questions
                            else if (widget.type === "radio") {
                                if (widget.options?.choices) {
                                    const correctChoices = widget.options.choices.filter(c => c.correct).map(c => cleanLatexExpression(c.content || "None of the above"));
                                    answer = correctChoices;
                                    answer = answer.map(choice => replaceGraphieImage(choice)); // Replace image markdown
                                }
                                appendToGUI(`Question Type: radio, Answer: ${answer.join(', ')}`, 'radio');
                                console.log('Radio answers:', answer);
                            }

                            // Handle plotter type questions
                            else if (widget.type === "plotter") {
                                const correctAnswers = widget.options?.correct || [];
                                appendToGUI(`Data Plot Locations in Order: Answers: ${correctAnswers.join(", ")}`, 'plotter');
                                console.log('Plotter correct answers:', correctAnswers);
                            }

                        } catch (innerError) {
                            console.error("Error processing widget:", widget, innerError);
                        }
                    });

                    if (numericInputAnswers.length > 0) {
                        appendToGUI(`Numeric Input Question: Correct Answer(s): [${numericInputAnswers.join(', ')}]`, 'input');
                        console.log(`Numeric Input Answers: [${numericInputAnswers.join(', ')}]`);
                    }

                    // Display combined dropdown answers at once after all widgets are processed
                    Object.keys(combinedAnswersPerQuestion).forEach(questionContent => {
                        const finalCombinedAnswers = combinedAnswersPerQuestion[questionContent];
                        appendToGUI(`Combined Answers: ${JSON.stringify(finalCombinedAnswers, null, 2)}`, 'dropdown');
                        console.log('Dropdown combined answers:', finalCombinedAnswers);
                    });

                }
                return response;
            } catch (error) {
                console.error('Failed to fetch assessment data:', error);
            }
        }).catch((error) => {
            console.error("Network or fetch error:", error);
        });
    };
})();
})();