// ==UserScript==
// @name         Mathspace Auto Solver with Explanations
// @namespace    http://mathspace.co/
// @version      1.0
// @description  Automatically solves problems on Mathspace.co and collects explanations
// @author       You
// @match        https://mathspace.co/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/532171/Mathspace%20Auto%20Solver%20with%20Explanations.user.js
// @updateURL https://update.greasyfork.org/scripts/532171/Mathspace%20Auto%20Solver%20with%20Explanations.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Store explanations for all problems
    let problemExplanations = [];
    let currentProblemIndex = 0;
    let solverActive = true;
    
    // Add control panel to toggle functionality
    const addControlPanel = () => {
        const controlPanel = document.createElement('div');
        controlPanel.style.position = 'fixed';
        controlPanel.style.top = '10px';
        controlPanel.style.right = '10px';
        controlPanel.style.zIndex = '9999';
        controlPanel.style.backgroundColor = '#f0f0f0';
        controlPanel.style.padding = '10px';
        controlPanel.style.borderRadius = '5px';
        controlPanel.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        
        const toggleButton = document.createElement('button');
        toggleButton.innerText = solverActive ? 'Pause Solver' : 'Start Solver';
        toggleButton.style.marginRight = '10px';
        toggleButton.onclick = () => {
            solverActive = !solverActive;
            toggleButton.innerText = solverActive ? 'Pause Solver' : 'Start Solver';
            if (solverActive) {
                processProblem();
            }
        };
        
        const showExplanationsButton = document.createElement('button');
        showExplanationsButton.innerText = 'Show Explanations';
        showExplanationsButton.onclick = showExplanations;
        
        controlPanel.appendChild(toggleButton);
        controlPanel.appendChild(showExplanationsButton);
        document.body.appendChild(controlPanel);
    };
    
    // Process the current problem
    const processProblem = () => {
        if (!solverActive) return;
        
        console.log('Processing problem...');
        
        // Check if we are on a problem page
        const problemContainer = findProblemContainer();
        if (!problemContainer) {
            console.log('No problem container found, waiting...');
            setTimeout(processProblem, 1000);
            return;
        }
        
        // Get the problem information
        const problemTitle = findProblemTitle();
        const problemText = findProblemText();
        
        console.log('Problem found:', problemTitle);
        
        // First, collect the solution for this problem
        collectExplanation(problemTitle, problemText).then(() => {
            // Then look for the answer input field
            const answerInput = findAnswerInput();
            if (!answerInput) {
                console.log('No answer input found, waiting...');
                setTimeout(processProblem, 1000);
                return;
            }
            
            // Try to solve the problem by entering the final answer
            enterFinalAnswer(answerInput).then(success => {
                if (success) {
                    console.log('Answer submitted successfully');
                    // Wait for the answer to be processed
                    setTimeout(() => {
                        // Click the next button to proceed to next problem
                        clickNextButton();
                    }, 2000);
                } else {
                    console.log('Could not submit answer, trying step-by-step');
                    // If direct answer failed, try step-by-step approach
                    solveStepByStep();
                }
            });
        });
    };
    
    // Find the problem container element
    const findProblemContainer = () => {
        // Look for common containers that might hold the problem
        return document.querySelector('.problem-container') || 
               document.querySelector('.question-container') || 
               document.querySelector('.workbook-problem');
    };
    
    // Find the problem title
    const findProblemTitle = () => {
        const titleElement = document.querySelector('.problem-title') || 
                            document.querySelector('.question-title') ||
                            document.querySelector('h1');
        return titleElement ? titleElement.textContent.trim() : `Problem ${currentProblemIndex + 1}`;
    };
    
    // Find the problem text
    const findProblemText = () => {
        const textElement = document.querySelector('.problem-text') || 
                           document.querySelector('.question-text') ||
                           document.querySelector('.problem-statement');
        return textElement ? textElement.textContent.trim() : 'No problem text found';
    };
    
    // Find the answer input field
    const findAnswerInput = () => {
        // Look for the main input element or math editor
        return document.querySelector('.mathspace-editor') || 
               document.querySelector('input[type="text"]') ||
               document.querySelector('textarea') ||
               document.querySelector('.math-input');
    };
    
    // Collect the explanation for the current problem
    const collectExplanation = async (title, text) => {
        // Find the worked solutions or explanations
        try {
            // Click on hints or worked examples to reveal solutions
            const hintButton = document.querySelector('button:contains("Hint")') || 
                              document.querySelector('button:contains("hint")') ||
                              document.querySelector('.hint-button');
            
            const workedExampleButton = document.querySelector('button:contains("Worked Example")') || 
                                      document.querySelector('button:contains("worked example")') ||
                                      document.querySelector('.worked-example-button');
            
            const videoButton = document.querySelector('button:contains("Video")') || 
                              document.querySelector('button:contains("video")') ||
                              document.querySelector('.video-button');
            
            if (hintButton) {
                hintButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            if (workedExampleButton) {
                workedExampleButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            // Extract the explanation content
            const explanationElement = document.querySelector('.hint-content') ||
                                     document.querySelector('.worked-example-content') ||
                                     document.querySelector('.solution-steps');
            
            let explanation = explanationElement ? explanationElement.textContent.trim() : 'No explanation found';
            
            // Store the explanation
            problemExplanations.push({
                index: currentProblemIndex + 1,
                title: title,
                problem: text,
                explanation: explanation
            });
            
            currentProblemIndex++;
            console.log('Explanation collected:', explanation.substring(0, 50) + '...');
            
            // Close any open modal dialogs
            const closeButtons = document.querySelectorAll('.modal-close, .close-button, button:contains("Close")');
            closeButtons.forEach(button => button.click());
            
            return true;
        } catch (error) {
            console.error('Error collecting explanation:', error);
            return false;
        }
    };
    
    // Enter the final answer directly
    const enterFinalAnswer = async (inputElement) => {
        try {
            // Look for worked solutions or the final answer
            const workedSolutionButton = document.querySelector('button:contains("Worked Solution")') ||
                                       document.querySelector('button:contains("worked solution")');
            
            if (workedSolutionButton) {
                workedSolutionButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Extract the final answer from the worked solution
                const solutionContainer = document.querySelector('.worked-solution-container') ||
                                        document.querySelector('.solution-steps');
                
                if (solutionContainer) {
                    const steps = solutionContainer.querySelectorAll('p, div, span');
                    const lastStep = steps[steps.length - 1];
                    const finalAnswer = lastStep ? lastStep.textContent.trim() : null;
                    
                    if (finalAnswer) {
                        // Close the worked solution modal
                        const closeButton = document.querySelector('.modal-close, .close-button, button:contains("Close")');
                        if (closeButton) closeButton.click();
                        
                        // Input the final answer
                        inputElement.value = finalAnswer;
                        // Trigger change event
                        const event = new Event('input', { bubbles: true });
                        inputElement.dispatchEvent(event);
                        
                        // Click submit button
                        const submitButton = document.querySelector('button:contains("Submit")') ||
                                           document.querySelector('button:contains("submit")') ||
                                           document.querySelector('.submit-button');
                        
                        if (submitButton) {
                            submitButton.click();
                            return true;
                        }
                    }
                }
            }
            
            // If we couldn't find worked solutions, try skipping to the answer
            const skipButton = document.querySelector('button:contains("Skip Step")') ||
                             document.querySelector('button:contains("skip step")') ||
                             document.querySelector('.skip-step-button');
            
            if (skipButton) {
                skipButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // After skipping, try to find the final answer
                const finalAnswerElement = document.querySelector('.final-answer') ||
                                         document.querySelector('.solution-step:last-child');
                
                if (finalAnswerElement) {
                    const finalAnswer = finalAnswerElement.textContent.trim();
                    
                    // Input the final answer
                    inputElement.value = finalAnswer;
                    // Trigger change event
                    const event = new Event('input', { bubbles: true });
                    inputElement.dispatchEvent(event);
                    
                    // Click submit button
                    const submitButton = document.querySelector('button:contains("Submit")') ||
                                       document.querySelector('button:contains("submit")') ||
                                       document.querySelector('.submit-button');
                    
                    if (submitButton) {
                        submitButton.click();
                        return true;
                    }
                }
            }
            
            return false;
        } catch (error) {
            console.error('Error entering final answer:', error);
            return false;
        }
    };
    
    // Solve the problem step-by-step
    const solveStepByStep = async () => {
        try {
            let solved = false;
            let maxSteps = 10; // Limit the number of steps to prevent infinite loops
            
            for (let i = 0; i < maxSteps && !solved; i++) {
                // Click the "Skip Step" button to get the next step
                const skipButton = document.querySelector('button:contains("Skip Step")') ||
                                 document.querySelector('button:contains("skip step")') ||
                                 document.querySelector('.skip-step-button');
                
                if (skipButton) {
                    skipButton.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Check if we've solved the problem (look for a filled green tick/check)
                    const solvedIndicator = document.querySelector('.filled-green-tick') ||
                                          document.querySelector('.correct-final-answer');
                    
                    if (solvedIndicator) {
                        solved = true;
                        console.log('Problem solved step-by-step');
                        
                        // Click the next button after a delay
                        setTimeout(clickNextButton, 2000);
                        break;
                    }
                } else {
                    console.log('No skip button found, cannot continue step-by-step');
                    break;
                }
            }
            
            if (!solved) {
                console.log('Could not solve step-by-step, clicking next anyway');
                setTimeout(clickNextButton, 2000);
            }
        } catch (error) {
            console.error('Error in step-by-step solving:', error);
            setTimeout(clickNextButton, 2000);
        }
    };
    
    // Click the next button to proceed to the next problem
    const clickNextButton = () => {
        const nextButton = document.querySelector('button:contains("Next")') ||
                         document.querySelector('button:contains("next")') ||
                         document.querySelector('.next-button') ||
                         document.querySelector('button[aria-label="Next"]');
        
        if (nextButton) {
            console.log('Clicking next button');
            nextButton.click();
            
            // Wait for the next problem to load
            setTimeout(processProblem, 2000);
        } else {
            console.log('No next button found, might be at the end of problems');
            // Try again after a short delay
            setTimeout(() => {
                const retryNextButton = document.querySelector('button:contains("Next")') ||
                                      document.querySelector('button:contains("next")') ||
                                      document.querySelector('.next-button') ||
                                      document.querySelector('button[aria-label="Next"]');
                
                if (retryNextButton) {
                    console.log('Found next button on retry');
                    retryNextButton.click();
                    setTimeout(processProblem, 2000);
                } else {
                    console.log('Still no next button, might be finished');
                }
            }, 1000);
        }
    };
    
    // Display all collected explanations
    const showExplanations = () => {
        // Create a modal to display all explanations
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
        modal.style.zIndex = '10000';
        modal.style.overflowY = 'auto';
        modal.style.padding = '20px';
        
        const content = document.createElement('div');
        content.style.backgroundColor = 'white';
        content.style.borderRadius = '5px';
        content.style.padding = '20px';
        content.style.maxWidth = '800px';
        content.style.margin = '20px auto';
        
        // Add a close button
        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.float = 'right';
        closeButton.onclick = () => {
            document.body.removeChild(modal);
        };
        
        // Add heading
        const heading = document.createElement('h2');
        heading.innerText = 'Problem Explanations';
        
        content.appendChild(closeButton);
        content.appendChild(heading);
        
        // Add each explanation
        if (problemExplanations.length === 0) {
            const noData = document.createElement('p');
            noData.innerText = 'No explanations collected yet.';
            content.appendChild(noData);
        } else {
            problemExplanations.forEach(item => {
                const container = document.createElement('div');
                container.style.borderBottom = '1px solid #ccc';
                container.style.marginBottom = '20px';
                container.style.paddingBottom = '20px';
                
                const title = document.createElement('h3');
                title.innerText = `Problem ${item.index}: ${item.title}`;
                
                const problem = document.createElement('div');
                problem.innerHTML = '<strong>Problem:</strong><br>' + item.problem;
                problem.style.marginBottom = '10px';
                
                const explanation = document.createElement('div');
                explanation.innerHTML = '<strong>Explanation:</strong><br>' + item.explanation;
                
                container.appendChild(title);
                container.appendChild(problem);
                container.appendChild(explanation);
                
                content.appendChild(container);
            });
        }
        
        // Add an export button
        const exportButton = document.createElement('button');
        exportButton.innerText = 'Export to JSON';
        exportButton.onclick = () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(problemExplanations, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "mathspace_explanations.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        };
        
        content.appendChild(document.createElement('br'));
        content.appendChild(exportButton);
        
        modal.appendChild(content);
        document.body.appendChild(modal);
    };
    
    // Extended querySelector to support :contains selector
    const originalQuerySelector = Element.prototype.querySelector;
    Element.prototype.querySelector = function(selector) {
        if (selector.includes(':contains(')) {
            const match = selector.match(/:contains\(["']?([^)"']+)["']?\)/);
            if (match) {
                const text = match[1];
                const newSelector = selector.replace(/:contains\(["']?([^)"']+)["']?\)/, '');
                const elements = this.querySelectorAll(newSelector || '*');
                for (let i = 0; i < elements.length; i++) {
                    if (elements[i].textContent.includes(text)) {
                        return elements[i];
                    }
                }
                return null;
            }
        }
        return originalQuerySelector.call(this, selector);
    };
    
    const originalDocumentQuerySelector = Document.prototype.querySelector;
    Document.prototype.querySelector = function(selector) {
        if (selector.includes(':contains(')) {
            const match = selector.match(/:contains\(["']?([^)"']+)["']?\)/);
            if (match) {
                const text = match[1];
                const newSelector = selector.replace(/:contains\(["']?([^)"']+)["']?\)/, '');
                const elements = this.querySelectorAll(newSelector || '*');
                for (let i = 0; i < elements.length; i++) {
                    if (elements[i].textContent.includes(text)) {
                        return elements[i];
                    }
                }
                return null;
            }
        }
        return originalDocumentQuerySelector.call(this, selector);
    };
    
    // Initialize the script
    const initialize = () => {
        console.log('Mathspace Auto Solver initialized');
        addControlPanel();
        
        // Start processing after a short delay
        setTimeout(processProblem, 2000);
    };
    
    // Run the script when the page is fully loaded
    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }
})();
