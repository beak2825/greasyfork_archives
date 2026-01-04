// ==UserScript==
// @name         TutorMe By U.K - MathSpace Helper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Provides step-by-step math solutions on mathspace.co
// @author       U.K
// @match        *://*.mathspace.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527165/TutorMe%20By%20UK%20-%20MathSpace%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/527165/TutorMe%20By%20UK%20-%20MathSpace%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create UI elements
    function createInterface() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.right = '20px';
        container.style.top = '20px';
        container.style.zIndex = '9999';
        
        const button = document.createElement('button');
        button.innerHTML = 'Analyze Question';
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        
        button.addEventListener('click', analyzeQuestion);
        container.appendChild(button);
        document.body.appendChild(container);
    }

    // Extract question content
    function getQuestionContent() {
        // Updated selector to target multiple possible question elements
        const selectors = [
            '.question-content',
            '.question-text',
            '.problem-statement',
            '[data-testid="question"]',
            '.question',
            '#question-container'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }
        
        // Fallback: Try to find any element containing the word "question"
        const allElements = document.getElementsByTagName('*');
        for (const element of allElements) {
            if (element.textContent.includes('Question') || 
                element.textContent.includes('question') ||
                element.textContent.includes('Problem') ||
                element.textContent.includes('problem')) {
                return element.textContent.trim();
            }
        }
        
        return '';
    }

    // Analyze and solve the math problem
    function analyzeQuestion() {
        const question = getQuestionContent();
        if (!question) {
            alert('No question found on this page. Please ensure you are on a question page.');
            console.log('Debug: Unable to find question content');
            return;
        }

        // Create solution display panel
        const solutionPanel = document.createElement('div');
        solutionPanel.style.position = 'fixed';
        solutionPanel.style.right = '20px';
        solutionPanel.style.top = '80px';
        solutionPanel.style.width = '300px';
        solutionPanel.style.backgroundColor = 'white';
        solutionPanel.style.padding = '20px';
        solutionPanel.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
        solutionPanel.style.borderRadius = '5px';
        solutionPanel.style.maxHeight = '80vh';
        solutionPanel.style.overflowY = 'auto';

        // Generate step-by-step solution
        const steps = generateSolution(question);
        steps.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.innerHTML = `<b>Step ${index + 1}:</b> ${step}`;
            stepElement.style.marginBottom = '10px';
            solutionPanel.appendChild(stepElement);
        });

        document.body.appendChild(solutionPanel);
    }

    // Generate solution steps
    function generateSolution(question) {
        // This function should be expanded based on different types of math problems
        // Example implementation for basic problems
        const steps = [];
        
        // Add mathematical analysis logic here
        // This is where you would implement specific math problem solving algorithms
        steps.push('Understanding the problem');
        steps.push('Breaking down the components');
        steps.push('Applying relevant formulas');
        steps.push('Calculating the solution');
        steps.push('Verifying the answer');

        return steps;
    }

    // Initialize the script
    createInterface();
})();


