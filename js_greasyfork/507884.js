// ==UserScript==
// @name         Notion Toggles: Floating Heads, Comment Highlights, and Margin Comments
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Toggle visibility of floating head icons, comment highlighting, and margin comment boxes in Notion
// @match        https://www.notion.so/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507884/Notion%20Toggles%3A%20Floating%20Heads%2C%20Comment%20Highlights%2C%20and%20Margin%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/507884/Notion%20Toggles%3A%20Floating%20Heads%2C%20Comment%20Highlights%2C%20and%20Margin%20Comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isHeadsVisible = GM_getValue('isHeadsVisible', true);
    let isCommentsHighlighted = GM_getValue('isCommentsHighlighted', true);
    let isMarginCommentsVisible = GM_getValue('isMarginCommentsVisible', true);

    // Add custom styles
    GM_addStyle(`
        #notionToggleButtonContainer {
            position: fixed;
            bottom: calc(100px + env(safe-area-inset-bottom));
            right: 16px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            z-index: 110;
            transition: transform 200ms;
        }
        #notionToggleButtonContainer button {
            width: 36px;
            height: 36px;
            border-radius: 100%;
            background: rgb(239, 239, 238);
            box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        #notionToggleButtonContainer button:hover {
            background-color: #e0e0e0;
        }
        #notionToggleButtonContainer svg {
            width: 20px;
            height: 20px;
        }
    `);

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const updateFloatingHeadsVisibility = debounce(() => {
        const containers = document.querySelectorAll('.notion-presence-container');
        containers.forEach(container => {
            container.style.setProperty('display', isHeadsVisible ? '' : 'none', 'important');
        });
    }, 100);

    const updateCommentHighlighting = debounce(() => {
        const commentedElements = document.querySelectorAll('.discussion-level-1');

        commentedElements.forEach(element => {
            if (isCommentsHighlighted) {
                element.style.setProperty('background-color','rgba(255,203,0,.12');
                element.style.setProperty('border-bottom', '2px solid rgba(255,203,0,.35)');
            } else {
                element.style.setProperty('background-color', 'transparent', 'important');
                element.style.setProperty('border-bottom', 'none', 'important');
            }

            // Also update child elements
            element.querySelectorAll('*').forEach(child => {
                if (isCommentsHighlighted) {
                    element.style.setProperty('background-color','rgba(255,203,0,.12');
                    element.style.setProperty('border-bottom', '2px solid rgba(255,203,0,.35)');
                } else {
                    child.style.setProperty('background-color', 'transparent', 'important');
                    child.style.setProperty('border-bottom', 'none', 'important');
                }
            });
        });
    }, 100);

    const updateMarginCommentsVisibility = debounce(() => {
        const marginComments = document.querySelectorAll('.notion-margin-discussion-item');
        marginComments.forEach(comment => {
            comment.style.setProperty('display', isMarginCommentsVisible ? '' : 'none', 'important');
        });
    }, 100);

    function toggleFloatingHeads() {
        isHeadsVisible = !isHeadsVisible;
        GM_setValue('isHeadsVisible', isHeadsVisible);
        updateFloatingHeadsVisibility();
        updateButtonAppearance('heads');
    }

    function toggleCommentHighlighting() {
        isCommentsHighlighted = !isCommentsHighlighted;
        GM_setValue('isCommentsHighlighted', isCommentsHighlighted);
        updateCommentHighlighting();
        updateButtonAppearance('comments');
    }

    function toggleMarginComments() {
        isMarginCommentsVisible = !isMarginCommentsVisible;
        GM_setValue('isMarginCommentsVisible', isMarginCommentsVisible);
        updateMarginCommentsVisibility();
        updateButtonAppearance('margin');
    }

    function updateButtonAppearance(buttonType) {
        const button = document.getElementById(`toggle${buttonType === 'heads' ? 'Heads' : buttonType === 'comments' ? 'Comments' : 'Margin'}Btn`);
        if (button) {
            const isVisible = buttonType === 'heads' ? isHeadsVisible :
                              buttonType === 'comments' ? isCommentsHighlighted :
                              isMarginCommentsVisible;
            const iconColor = isVisible ? '#2eaadc' : '#ff4d4d';
            button.querySelector('svg').style.fill = iconColor;
            button.title = `${isVisible ? 'Hide' : 'Show'} ${buttonType === 'heads' ? 'Floating Heads' : buttonType === 'comments' ? 'Comment Highlights' : 'Margin Comments'}`;
        }
    }

    function createFloatingButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'notionToggleButtonContainer';

        const commentButton = createButton('Comments', 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z');
        const headsButton = createButton('Heads', 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z');
        const marginButton = createButton('Margin', 'M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z');

        buttonContainer.appendChild(commentButton);
        buttonContainer.appendChild(headsButton);
        buttonContainer.appendChild(marginButton);
        document.body.appendChild(buttonContainer);

        updateButtonAppearance('comments');
        updateButtonAppearance('heads');
        updateButtonAppearance('margin');
    }

    function createButton(type, svgPath) {
        const button = document.createElement('button');
        button.id = `toggle${type}Btn`;
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path d="${svgPath}"/>
            </svg>
        `;
        button.addEventListener('click', type === 'Comments' ? toggleCommentHighlighting :
                                        type === 'Heads' ? toggleFloatingHeads :
                                        toggleMarginComments);
        return button;
    }

    function init() {
        console.log('Notion Toggles: Script started');
        createFloatingButtons();
        applyInitialState();
        console.log('Notion Toggles: Initial state applied');

        // Set up a MutationObserver to apply our changes when new content is added
        const observer = new MutationObserver(debounce((mutations) => {
            let shouldUpdate = false;
            for (let mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldUpdate = true;
                    break;
                }
            }
            if (shouldUpdate) {
                updateFloatingHeadsVisibility();
                updateCommentHighlighting();
                updateMarginCommentsVisibility();
            }
        }, 200));

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function applyInitialState() {
        updateFloatingHeadsVisibility();
        updateCommentHighlighting();
        updateMarginCommentsVisibility();
    }

    // Run the script after a short delay to ensure Notion's UI is loaded
    setTimeout(init, 2000);
})();