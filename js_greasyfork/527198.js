// ==UserScript==
// @name         Mathspace Interface with AI
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds AI capabilities to Mathspace
// @author       PrimeMinisteModiji1111111111
// @match        https://*.mathspace.co/*
// @match        https://mathspace.co/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/527198/Mathspace%20Interface%20with%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/527198/Mathspace%20Interface%20with%20AI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add required styles - keeping most of the original styles but adjusting for Mathspace's design
    const styles = `
        /* Original styles remain largely the same, but with Mathspace-specific adjustments */
        .ms-ai-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            width: 400px;
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: none;
        }

        .ms-ai-header {
            padding: 16px;
            border-bottom: 1px solid #E5E7EB;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .ms-ai-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #12957D;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        /* Reuse existing styles with ms- prefix */
        .ms-search-form {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
            height: 40px;
            background: white;
            border: 1px solid #E5E7EB;
            border-radius: 9999px;
            padding: 8px 75px 8px 16px;
            margin: 16px;
        }

        /* Rest of the styles remain the same but with ms- prefix */
        ${styles.replace(/mathful-/g, 'ms-')}
    `;

    GM_addStyle(styles);

    // Create floating AI helper button and panel
    function createAIHelper() {
        // Create toggle button
        const toggleButton = document.createElement('div');
        toggleButton.className = 'ms-ai-toggle';
        toggleButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16h2v-2h-2v2zm1.61-7.83c.04-.16.06-.32.06-.48 0-.88-.72-1.6-1.6-1.6s-1.6.72-1.6 1.6.72 1.6 1.6 1.6h.48l1.06 1.06v.52l-.72.72v.88l-.88.88v1.2h3.12v-1.2l-.88-.88v-.88l-.72-.72V11l1.08-1.08c.16.04.32.06.48.06.88 0 1.6-.72 1.6-1.6s-.72-1.6-1.6-1.6-1.6.72-1.6 1.6c0 .16.02.32.06.48L12 9.93l-.39-.39z" fill="currentColor"/>
            </svg>
        `;

        // Create AI helper panel
        const helperPanel = document.createElement('div');
        helperPanel.className = 'ms-ai-container';
        helperPanel.innerHTML = `
            <div class="ms-ai-header">
                <h3>Math AI Assistant</h3>
                <button class="ms-close-button">×</button>
            </div>
            <form class="ms-search-form">
                <input type="text" 
                       class="ms-search-input" 
                       placeholder="Ask about this problem" 
                       required />
                <button type="submit" class="submit-button">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                </button>
            </form>
            <div class="ms-ai-content"></div>
        `;

        // Add to page
        document.body.appendChild(toggleButton);
        document.body.appendChild(helperPanel);

        // Toggle panel visibility
        toggleButton.addEventListener('click', () => {
            helperPanel.style.display = helperPanel.style.display === 'none' ? 'block' : 'none';
        });

        // Close button functionality
        const closeButton = helperPanel.querySelector('.ms-close-button');
        closeButton.addEventListener('click', () => {
            helperPanel.style.display = 'none';
        });

        // Handle form submission
        const searchForm = helperPanel.querySelector('.ms-search-form');
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = searchForm.querySelector('.ms-search-input');
            const query = input.value.trim();
            if (query) {
                // Get current problem context
                const problemContext = getCurrentProblemContext();
                await handleAIQuery(query, problemContext);
            }
        });
    }

    // Get the current problem context from Mathspace
    function getCurrentProblemContext() {
        // Extract problem information from the current page
        const problemElement = document.querySelector('.question-text, .problem-statement');
        const problemText = problemElement ? problemElement.textContent.trim() : '';
        
        // Get any relevant images
        const problemImages = Array.from(document.querySelectorAll('.question-image, .problem-image'))
            .map(img => img.src);

        return {
            problemText,
            problemImages,
            url: window.location.href,
            timestamp: new Date().toISOString()
        };
    }

    // Handle AI query
    async function handleAIQuery(query, context) {
        const aiContent = document.querySelector('.ms-ai-content');
        aiContent.innerHTML = '<div class="loading">Processing your request...</div>';

        try {
            // TODO: Replace with actual API call
            const response = await simulateAIResponse(query, context);
            
            aiContent.innerHTML = `
                <div class="ms-ai-response">
                    <div class="ms-ai-answer">${response.answer}</div>
                    ${response.steps ? `<div class="ms-ai-steps">${response.steps}</div>` : ''}
                </div>
            `;
        } catch (error) {
            aiContent.innerHTML = `<div class="error">Sorry, there was an error processing your request.</div>`;
        }
    }

    // Temporary function to simulate AI response
    function simulateAIResponse(query, context) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    answer: `Here's how to solve this problem: ${query}`,
                    steps: `<ol>
                        <li>First, understand the problem</li>
                        <li>Break it down into steps</li>
                        <li>Apply relevant formulas</li>
                        <li>Check your work</li>
                    </ol>`
                });
            }, 1000);
        });
    }

    // Initialize when page is loaded
    window.addEventListener('load', () => {
        createAIHelper();
    });

})();

