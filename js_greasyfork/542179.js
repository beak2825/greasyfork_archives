// ==UserScript==
// @name         Torn PDA - DOM Inspector Tool
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  A diagnostic tool to inspect the DOM. Results box is now scrollable.
// @author       BazookaJoe & Gemini
// @match        https://www.torn.com/*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/542179/Torn%20PDA%20-%20DOM%20Inspector%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/542179/Torn%20PDA%20-%20DOM%20Inspector%20Tool.meta.js
// ==/UserScript==

/* globals jQuery, $ */

(function() {
    'use-strict';

    let isInspecting = false;

    // --- 1. STYLING ---
    function addStyles() {
        const styles = `
            #pda-inspector-container {
                position: fixed;
                top: 130px;
                right: -300px;
                width: 300px;
                z-index: 10005;
                transition: right 0.3s ease-in-out;
                font-family: Arial, sans-serif;
                color: #333;
            }
            #pda-inspector-container.expanded {
                right: 0;
            }
            #pda-inspector-panel {
                background: #f0f0f0;
                border: 2px solid #007bff;
                border-right: none;
                padding: 0;
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
                box-shadow: -2px 2px 10px rgba(0,0,0,0.4);
                height: calc(100vh - 180px); /* Give panel a max height */
                max-height: 500px;
                display: flex;
                flex-direction: column;
            }
            #pda-inspector-panel h4 {
                margin: 0; padding: 10px; font-size: 16px;
                background-color: #dbeafe; border-bottom: 1px solid #b0c4de;
                flex-shrink: 0; /* Prevent header from shrinking */
            }
            .pda-inspector-section {
                padding: 10px;
                border-bottom: 1px solid #eee;
            }
            /* Make the results section grow and allow its contents to scroll */
            .pda-inspector-section.results-section {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                min-height: 0; /* Flexbox hack for scrolling */
            }
            #pda-inspector-instructions {
                font-size: 13px;
                color: #555;
                margin-bottom: 15px;
            }
            #inspector-results-wrapper {
                flex-grow: 1; /* Make this wrapper take up the space */
                overflow-y: auto; /* Add a scrollbar only when needed */
                background: #222;
                border: 1px solid #444;
                border-radius: 5px;
                padding: 10px;
            }
            #inspector-results {
                color: #0f0;
                font-family: monospace;
                white-space: pre-wrap;
                word-break: break-all;
                font-size: 12px;
            }
            .pda-inspector-button {
                padding: 8px 12px; border: 1px solid #999;
                background-color: #007bff; color: white;
                border-radius: 3px; cursor: pointer; width: 100%;
                margin-top: 10px; font-weight: bold;
            }
            .pda-inspector-button.stop-inspecting {
                background-color: #dc3545;
            }
            #inspector-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                z-index: 10000;
                background: rgba(0, 123, 255, 0.15);
                border: 2px dashed #007bff;
                cursor: crosshair;
                pointer-events: none;
            }
            #pda-inspector-toggle {
                position: fixed;
                top: 130px;
                right: 0;
                width: 35px;
                height: 50px;
                background-color: #007bff;
                color: white;
                border: 2px solid #007bff;
                border-right: none;
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 24px;
                z-index: 10006;
            }
        `;
        const styleEl = document.createElement('style');
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
    }

    // --- 2. CORE LOGIC ---
    function startInspecting() {
        if (isInspecting) return;
        isInspecting = true;

        $('<div id="inspector-overlay"></div>').appendTo('body');
        $('#inspector-toggle-btn').text('Stop Inspecting').addClass('stop-inspecting');

        $('body').on('click.pdaInspector', function(event) {
            const target = $(event.target);
            if (target.closest('#pda-inspector-container').length || target.is('#pda-inspector-toggle')) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            displayElementInfo(target[0]);
            stopInspecting();
        });
    }

    function stopInspecting() {
        if (!isInspecting) return;
        isInspecting = false;
        $('#inspector-overlay').remove();
        $('body').off('click.pdaInspector');
        $('#inspector-toggle-btn').text('Start Inspecting').removeClass('stop-inspecting');
    }

    function displayElementInfo(element) {
        const resultsBox = $('#inspector-results');
        if (!element) {
            resultsBox.text("Could not identify the element.");
            return;
        }
        const tagName = element.tagName;
        const id = element.id ? `#${element.id}` : "(no id)";
        const classes = element.className && typeof element.className === 'string' ? `.${element.className.split(' ').join('.')}` : "(no classes)";
        const output = `--- Element Details ---\n\n` +
                     `Tag Name:  ${tagName}\n` +
                     `ID:        ${id}\n` +
                     `Classes:   ${classes}\n\n` +
                     `--- Outer HTML ---\n${element.outerHTML}`;
        resultsBox.text(output);
    }

    // --- 3. UI CREATION & EVENT HANDLERS ---
    function createPanel() {
        if (document.getElementById('pda-inspector-container')) return;

        const panelHTML = `
            <div id="pda-inspector-container">
                <div id="pda-inspector-panel">
                    <h4>PDA Inspector Tool</h4>
                    <div class="pda-inspector-section">
                        <div id="pda-inspector-instructions">
                            1. Click "Start Inspecting".<br>
                            2. Tap any element on the page.<br>
                            3. Use "Copy Results" to get the details.
                        </div>
                        <button id="inspector-toggle-btn" class="pda-inspector-button">Start Inspecting</button>
                    </div>
                    <div class="pda-inspector-section results-section">
                        <label for="inspector-results">Results:</label>
                        <div id="inspector-results-wrapper">
                            <pre id="inspector-results">Click "Start Inspecting" and tap an element.</pre>
                        </div>
                        <button id="inspector-copy-btn" class="pda-inspector-button">Copy Results</button>
                    </div>
                </div>
            </div>
        `;
        const toggleButtonHTML = `<div id="pda-inspector-toggle">i</div>`;

        $('body').append(panelHTML).append(toggleButtonHTML);

        $('#pda-inspector-toggle').on('click', function() {
            $('#pda-inspector-container').toggleClass('expanded');
        });

        $('#inspector-toggle-btn').on('click', function() {
            if (isInspecting) {
                stopInspecting();
            } else {
                startInspecting();
            }
        });

        $('#inspector-copy-btn').on('click', function() {
            const resultsText = $('#inspector-results').text();
            navigator.clipboard.writeText(resultsText).then(() => {
                alert("Results copied to clipboard!");
            }, () => {
                const textArea = document.createElement("textarea");
                textArea.value = resultsText;
                document.body.appendChild(textArea);
                textArea.focus(); textArea.select();
                try {
                    document.execCommand('copy');
                    alert("Results copied to clipboard!");
                } catch (err) {
                    alert("Failed to copy. Please copy manually.");
                }
                document.body.removeChild(textArea);
            });
        });
    }

    // --- 4. INITIALIZATION ---
    $(document).ready(function() {
        addStyles();
        createPanel();
    });

})();