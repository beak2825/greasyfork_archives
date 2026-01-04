// ==UserScript==
// @name         Quickly edit question for Superpower ChatGPT
// @description  Press Ctrl + Alt + Left click on the text of the question you asked to jump in at the current mouse position to quickly edit the question
// @author       NWP
// @namespace    https://greasyfork.org/users/877912
// @version      0.4
// @license      MIT
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488336/Quickly%20edit%20question%20for%20Superpower%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/488336/Quickly%20edit%20question%20for%20Superpower%20ChatGPT.meta.js
// ==/UserScript==

// TODO:
// 1. Fix the screen flicker due to the fast jumping to the Save & Submit button and then
// jumping back to the current position of the caret in the textarea, except for Chrome
// 2. Launch a version for pure OpenAI

// DONE:
// Fixed code for Firefox, enabled instant scrolling instead of smooth scrolling
// Fixed flicker for Chrome

(function() {

    if (navigator.userAgent.toLowerCase().includes('firefox')) {
        document.addEventListener('mousedown', function(event) {
            if (event.ctrlKey && event.altKey && event.button === 0) {
                const targetDiv = event.target;
                if (targetDiv.tagName === 'DIV') {
                    let textNode, offset;
                    if (document.caretPositionFromPoint) {
                        const caretPos = document.caretPositionFromPoint(event.clientX, event.clientY);
                        if (caretPos) {
                            textNode = caretPos.offsetNode;
                            offset = caretPos.offset;
                        }
                    } else if (document.caretRangeFromPoint) {
                        const range = document.caretRangeFromPoint(event.clientX, event.clientY);
                        if (range) {
                            textNode = range.startContainer;
                            offset = range.startOffset;
                        }
                    }
                    if (textNode && (offset !== undefined)) {
                        if (targetDiv) {
                            const uniqueID = targetDiv.id.replace('message-text-', '');
                            const button = document.getElementById(`message-edit-button-${uniqueID}`);
                            if (button) {
                                // scrollableContainer WILL LIKELY BREAK IN THE FUTURE
                                const scrollableContainer = document.querySelector('div#conversation-inner-div.h-full.overflow-y-auto');
                                const y = scrollableContainer.scrollTop;

                                button.click();
                                event.preventDefault();

                                setTimeout(function() {
                                    const textarea = document.getElementById(`message-text-${uniqueID}`);
                                    if (textarea) {
                                        textarea.focus({preventScroll: true});
                                        textarea.setSelectionRange(offset, offset);

                                        scrollableContainer.scrollTo({
                                            top: y,
                                            behavior: 'instant'
                                        })
                                    }
                                }, 0);
                            }
                        }
                    }
                }
            }
        });

        console.log("The browser is Firefox.")

    } else {
        document.addEventListener('mousedown', function(event) {
            if (event.ctrlKey && event.altKey && event.button === 0) {
                const targetDiv = event.target;
                if (targetDiv.tagName === 'DIV' && targetDiv.id.startsWith('message-text-')) {
                    event.preventDefault();
                    let textNode, offset;
                    const pointMethod = document.caretPositionFromPoint ? 'caretPositionFromPoint' : 'caretRangeFromPoint';
                    const caretResult = document[pointMethod](event.clientX, event.clientY);

                    if (caretResult) {
                        textNode = caretResult.offsetNode || caretResult.startContainer;
                        offset = caretResult.offset !== undefined ? caretResult.offset : caretResult.startOffset;
                    }

                    if (textNode && offset !== undefined) {
                        const uniqueID = targetDiv.id.replace('message-text-', '');
                        const button = document.getElementById(`message-edit-button-${uniqueID}`);
                        if (button) {
                            // scrollableContainer WILL LIKELY BREAK IN THE FUTURE
                            const scrollableContainer = document.querySelector('div#conversation-inner-div.h-full.overflow-y-auto');
                            const originalScroll = { x: scrollableContainer.scrollLeft, y: scrollableContainer.scrollTop };

                            button.click();

                            const observer = new MutationObserver((mutations, obs) => {
                                const textarea = document.getElementById(`message-text-${uniqueID}`);
                                if (textarea && textarea.offsetHeight > 0 && document.activeElement === textarea) {
                                    textarea.setSelectionRange(offset, offset);
                                    scrollableContainer.scrollTo({
                                        top: originalScroll.y,
                                        behavior: 'instant'
                                    });
                                    obs.disconnect();
                                }
                            });

                            observer.observe(document.body, { childList: true, subtree: true });
                        }
                    }
                }
            }
        });

        console.log("The browser is not Firefox.")
    }


})();


// When scrollableContainer breaks use this code to find the new scrollableContainer element:

// function isScrollable(element) {
//     const hasScrollableContent = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
//     const overflowStyle = window.getComputedStyle(element).overflow;
//     return hasScrollableContent && (overflowStyle === 'scroll' || overflowStyle === 'auto');
//   }

//   // Find all elements in the body
//   const allElements = document.querySelectorAll('body, body *');

//   // Counter variable to track index
//   let index = 1;

//   // Filter out scrollable elements and apply a red border
//   Array.from(allElements).forEach(element => {
//     if (isScrollable(element)) {
//       element.style.border = '2px solid red';
//       console.log("Scrollable Element " + index + ":", element);
//       console.log("Scroll Position " + index + " (x, y):", element.scrollLeft, element.scrollTop);
//       index++; // Increment index for the next scrollable element
//     }
//   });