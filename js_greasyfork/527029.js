// ==UserScript==
// @name         TutorMe By U.K
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Provides step-by-step mathematical explanations for mathspace.co
// @author       U.K
// @match        https://*.mathspace.co/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.openai.com
// @downloadURL https://update.greasyfork.org/scripts/527029/TutorMe%20By%20UK.user.js
// @updateURL https://update.greasyfork.org/scripts/527029/TutorMe%20By%20UK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants
    const OPENAI_API_KEY = 'YOUR_API_KEY'; // Replace with actual API key
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
    const OPENAI_MODEL = 'gpt-4o';

    // Styles for the UI
    const styles = `
        .tutorme-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
            font-family: Arial, sans-serif;
        }
        .tutorme-header {
            padding: 10px;
            background: #4a90e2;
            color: white;
            border-radius: 8px 8px 0 0;
            cursor: move;
        }
        .tutorme-content {
            padding: 15px;
            max-height: 400px;
            overflow-y: auto;
        }
        .tutorme-button {
            background: #4a90e2;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
        }
        .tutorme-button:hover {
            background: #357abd;
        }
        .tutorme-step {
            margin: 10px 0;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 4px;
        }
        .tutorme-latex {
            font-family: 'Computer Modern', serif;
        }
    `;

    // Add styles to the page
    GM_addStyle(styles);

    // Create UI elements
    function createUI() {
        const container = document.createElement('div');
        container.className = 'tutorme-container';
        
        const header = document.createElement('div');
        header.className = 'tutorme-header';
        header.textContent = 'TutorMe By U.K';
        
        const content = document.createElement('div');
        content.className = 'tutorme-content';
        
        const analyzeButton = document.createElement('button');
        analyzeButton.className = 'tutorme-button';
        analyzeButton.textContent = 'Analyze Problem';
        
        content.appendChild(analyzeButton);
        container.appendChild(header);
        container.appendChild(content);
        
        document.body.appendChild(container);
        
        // Make the container draggable
        makeDraggable(container, header);
        
        return { container, content, analyzeButton };
    }

    // Make an element draggable
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Extract math problem from the page
    function extractMathProblem() {
        // This function needs to be customized based on mathspace.co's DOM structure
        const problemElements = document.querySelectorAll('.question-text, .math-content');
        let problem = '';
        
        problemElements.forEach(element => {
            problem += element.textContent + ' ';
        });
        
        return problem.trim();
    }

    // Generate explanation using OpenAI API
    async function generateExplanation(problem) {
        const prompt = `
            Please provide a step-by-step explanation for solving this math problem:
            ${problem}
            
            Format your response as JSON with the following structure:
            {
                "steps": [
                    {
                        "explanation": "text explanation of the step",
                        "formula": "mathematical formula if applicable"
                    }
                ],
                "finalAnswer": "the final answer",
                "conceptExplanation": "brief explanation of the mathematical concept"
            }
        `;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: OPENAI_MODEL,
                    messages: [
                        { role: "user", content: prompt }
                    ],
                    response_format: { type: "json_object" }
                })
            });

            const data = await response.json();
            return JSON.parse(data.choices[0].message.content);
        } catch (error) {
            console.error('Error generating explanation:', error);
            return null;
        }
    }

    // Display explanation in the UI
    function displayExplanation(explanation, contentElement) {
        contentElement.innerHTML = '';
        
        const conceptDiv = document.createElement('div');
        conceptDiv.className = 'tutorme-step';
        conceptDiv.innerHTML = `<strong>Concept:</strong> ${explanation.conceptExplanation}`;
        contentElement.appendChild(conceptDiv);

        explanation.steps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'tutorme-step';
            stepDiv.innerHTML = `
                <strong>Step ${index + 1}:</strong>
                <div>${step.explanation}</div>
                ${step.formula ? `<div class="tutorme-latex">${step.formula}</div>` : ''}
            `;
            contentElement.appendChild(stepDiv);
        });

        const answerDiv = document.createElement('div');
        answerDiv.className = 'tutorme-step';
        answerDiv.innerHTML = `<strong>Final Answer:</strong> ${explanation.finalAnswer}`;
        contentElement.appendChild(answerDiv);
    }

    // Initialize the userscript
    function init() {
        const ui = createUI();
        
        ui.analyzeButton.addEventListener('click', async () => {
            const problem = extractMathProblem();
            if (problem) {
                ui.content.innerHTML = 'Generating explanation...';
                const explanation = await generateExplanation(problem);
                if (explanation) {
                    displayExplanation(explanation, ui.content);
                } else {
                    ui.content.innerHTML = 'Error generating explanation. Please try again.';
                }
            } else {
                ui.content.innerHTML = 'No math problem detected. Please make sure you\'re on a problem page.';
            }
        });
    }

    // Start the script
    init();
})();

