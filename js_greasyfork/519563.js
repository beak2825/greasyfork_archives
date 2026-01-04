// ==UserScript==
// @name         Web Highlighter
// @author       Damodar Rajbhandari
// @namespace    physicslog.com.web-highlighter
// @version      1.33
// @description  Highlight selected text, saves locally, and edit or delete highlights
// @license      GNU GPL v3
// @match        *://*.wikipedia.org/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/519563/Web%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/519563/Web%20Highlighter.meta.js
// ==/UserScript==

// @note: Please read any news or bugs at https://github.com/physicslog/web-highlighter.user.js

(function() {
    'use strict';

    const colors = ['#E5AE26', '#B895FF', '#54D171', '#D02848']; 
    const colors_title = ['Introduction / General / Well-known', 'Important / Spectacle / Interesting', 'Answer / Hint / Idea', 'Question / Critical / Hard / Sceptical'];
    let selectedColor = colors[0];

    // Load highlights from local storage
    const highlights = JSON.parse(localStorage.getItem('highlights') || '[]');
    
    // Adds a yellow dot at the top right corner of the webpage if highlights is present.
    if (highlights.length !== 0) {
        const dot = document.createElement('div');
        dot.title = 'Highlights exists! To view: do cmd+shift+v in the Mac';
        dot.style.width = '10px';
        dot.style.height = '10px';
        dot.style.backgroundColor = '#E5AE26';
        dot.style.borderRadius = '50%';
        dot.style.position = 'fixed';
        dot.style.top = '5px';
        dot.style.right = '5px';
        dot.style.zIndex = '1000';
        document.body.appendChild(dot);
    }

    console.log("Loaded highlights:", highlights);
    highlights.forEach(hl => {
        if (hl.url === window.location.href) {
            console.log("Restoring highlight:", hl);
            restoreHighlight(hl);
        }
    });

    // Save highlights to local storage
    function saveHighlights() {
        const serialized = Array.from(document.querySelectorAll('.highlighted')).map(el => ({
            text: el.innerText,
            color: el.style.backgroundColor,
            parentPath: getElementXPath(el.parentElement),
            url: window.location.href,
            timestamp: new Date().toISOString()
        }));
        console.log("Saving highlights to local storage:", serialized);
        localStorage.setItem('highlights', JSON.stringify(serialized));
    }

    // Restore a highlight
    function restoreHighlight({ text, color, parentPath }) {
        const parentElement = getElementByXPath(parentPath);
        if (parentElement) {
            const nodes = Array.from(parentElement.childNodes);
            nodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && node.nodeValue.includes(text)) {
                    const range = document.createRange();
                    range.setStart(node, node.nodeValue.indexOf(text));
                    range.setEnd(node, node.nodeValue.indexOf(text) + text.length);
                    wrapHighlight(range, color);
                    console.log("Highlight restored for text:", text);
                }
            });
        } else {
            console.error("Parent element not found for XPath:", parentPath);
        }
    }

    // Highlight selected text
    function wrapHighlight(range, color) {
        const span = document.createElement('span');
        span.style.backgroundColor = color;
        span.classList.add('highlighted');
        range.surroundContents(span);
    }

    // Get an XPath to an element
    function getElementXPath(element) {
        const paths = [];
        while (element && element.nodeType === Node.ELEMENT_NODE) {
            let index = 0;
            let sibling = element.previousSibling;
            while (sibling) {
                if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === element.nodeName) {
                    index++;
                }
                sibling = sibling.previousSibling;
            }
            const tagName = element.nodeName.toLowerCase();
            const pathIndex = index ? `[${index + 1}]` : '';
            paths.unshift(`${tagName}${pathIndex}`);
            element = element.parentNode;
        }
        return paths.length ? `/${paths.join('/')}` : null;
    }

    // Retrieve an element by its XPath
    function getElementByXPath(xpath) {
        try {
            return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        } catch (e) {
            console.error("Error evaluating XPath:", xpath, e);
            return null;
        }
    }

    // Event listener for text selection and highlighting
    document.addEventListener('mouseup', () => {
        const selection = window.getSelection();
        if (!event.target.closest('#displayHighlightsPopUp')) { // ignore if that is a popup to list all the highlights
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const selectedText = selection.toString().trim();
                if (selectedText.length > 0) {
                    wrapHighlight(range, selectedColor);
                    saveHighlights();
                    selection.removeAllRanges();
                }
            }
        }
    });

    // Event listener for clicking on existing highlights
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('highlighted')) {
            createPopup(event.target);
        }
    });

    // Popup for editing or deleting highlights
    function createPopup(element) {
        const popup = document.createElement('div');
        popup.style.position = 'absolute';
        popup.style.background = 'rgba(255, 255, 255, 0.9)';
        popup.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        popup.style.border = '1px solid #ccc';
        popup.style.borderRadius = '8px';
        popup.style.padding = '5px';
        popup.style.zIndex = '1001';
        popup.style.transition = 'all 0.3s ease';

        // Color selection buttons to popup
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        colors.forEach((color, index) => {
            const colorButton = document.createElement('button');
            colorButton.style.backgroundColor = color;
            colorButton.style.width = '20px';
            colorButton.style.height = '20px';
            colorButton.style.margin = '2px';
            colorButton.style.borderRadius = '50%';
            colorButton.style.border = 'none';
            colorButton.style.cursor = 'pointer';
            colorButton.title = colors_title[index];
            colorButton.onclick = () => {
                element.style.backgroundColor = color;
                saveHighlights();
            };
            buttonContainer.appendChild(colorButton);
        });

        // Add "X" button to popup
        const closeButton = document.createElement('button');
        closeButton.title = 'Delete';
        closeButton.innerText = '\u00D7';
        closeButton.style.width = '20px';
        closeButton.style.height = '20px';
        closeButton.style.margin = '2px';
        closeButton.style.lineHeight = '15px';
        closeButton.style.textAlign = 'center';
        closeButton.style.border = 'none';
        closeButton.style.backgroundColor = 'gray';
        closeButton.style.color = 'white';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.borderRadius = '50%';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => {
            const parent = element.parentNode;
            parent.replaceChild(document.createTextNode(element.innerText), element);
            saveHighlights();
            document.body.removeChild(popup);
        };

        buttonContainer.appendChild(closeButton);
        popup.appendChild(buttonContainer);
        document.body.appendChild(popup);

        // Position the popup near the element
        const rect = element.getBoundingClientRect();
        popup.style.left = `${rect.left}px`;
        popup.style.top = `${rect.bottom + window.scrollY + 10}px`;

        // Remove popup when clicking outside        
        const outsideClickListener = (event) => { 
            if (!popup.contains(event.target)) { 
                document.body.removeChild(popup); 
                document.removeEventListener('click', outsideClickListener); 
            }
        };
        document.addEventListener('click', outsideClickListener); 
    } 
    
    // Another popup to show all the highlighted text on the present webpage
    // Get the XPath of the element
    function getElementByXPath(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // Highlight the target element
    function flashingElement(element, color) {
        const originalBackgroundColor = element.style.backgroundColor;
        element.style.backgroundColor = color; // Flashing color
        setTimeout(() => {
            element.style.backgroundColor = originalBackgroundColor; // Restore original background color
        }, 1000); // flashing color duration
    }

    // Display highlights in a popup window
    function displayHighlightsPopup() {
        const highlights = JSON.parse(localStorage.getItem('highlights') || '[]');
        const popup = document.createElement('div');
        popup.id = 'displayHighlightsPopUp';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.width = '600px';
        popup.style.height = '400px';
        popup.style.backgroundColor = 'black';
        popup.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        popup.style.border = '1px solid #ccc';
        popup.style.borderRadius = '8px';
        popup.style.padding = '10px';
        popup.style.zIndex = '1002';
        popup.style.overflowY = 'scroll';
        popup.style.userSelect = 'none'; // Disable text selection

        popup.innerHTML = '<h3>All Saved Highlights of this webpage</h3><ul></ul>';
        const list = popup.querySelector('ul');
        highlights.forEach((hl, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<b>${new Date(hl.timestamp).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}:</b> <span style="color:${hl.color}">${hl.text}</span><button style="margin-left:10px;" class="delete-btn" data-index="${index}">X</button>`;
            listItem.style.cursor = 'pointer';
            listItem.onclick = (event) => {
                if (event.target.classList.contains('delete-btn')) {
                    event.stopPropagation(); // Prevent event propagation to the popup
                    const index = event.target.getAttribute('data-index');
                    deleteHighlight(index);
                } else {
                    console.log(`XPath: ${hl.parentPath}`); // Debug log
                    const parentElement = getElementByXPath(hl.parentPath);
                    if (parentElement) {
                        parentElement.scrollIntoView({ behavior: 'smooth' });
                        flashingElement(parentElement, hl.color); // Highlight the target element
                    } else {
                        console.error('Element not found for XPath:', hl.parentPath); // Debug error
                    }
                }
            };
            list.appendChild(listItem);
        });

        document.body.appendChild(popup);

        // Remove popup when clicking outside
        const outsideClickListener = (event) => {
            if (!popup.contains(event.target)) {
                document.body.removeChild(popup);
                document.removeEventListener('click', outsideClickListener);
            }
        };
        document.addEventListener('click', outsideClickListener);
    }

    // Delete highlight function 
    function deleteHighlight(index) { 
        let highlights = JSON.parse(localStorage.getItem('highlights') || '[]');
        if (index >= 0 && index < highlights.length) {
            // Remove highlight from local storage
            const [deletedHighlight] = highlights.splice(index, 1);
            localStorage.setItem('highlights', JSON.stringify(highlights));

            // Remove highlight from the DOM
            removeHighlight(deletedHighlight.parentPath, deletedHighlight.text);

            // Update indices
            document.getElementById('displayHighlightsPopUp').remove(); 
            displayHighlightsPopup();
        }
    }

    // Remove highlight from the DOM
    function removeHighlight(parentPath, text) {
        const parentElement = getElementByXPath(parentPath);
        if (parentElement) {
            const highlights = Array.from(parentElement.querySelectorAll('.highlighted'));
            const span = highlights.find(span => span.textContent.includes(text));
            if (span) {
                while (span.firstChild) {
                    parentElement.insertBefore(span.firstChild, span);
                }
                parentElement.removeChild(span);
            }
        }
    }

    // Listen for Command + V to display highlights popup
    document.addEventListener('keydown', (event) => {
        if (event.key === 'v' && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            displayHighlightsPopup();
        }
    });

})();
