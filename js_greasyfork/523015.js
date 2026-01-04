// ==UserScript==
// @license      JazzMedo
// @name         TryHackMe Copy to Clipboard and add notes
// @version      1.0.2
// @description  this script will allow you to copy the content from the room and save notes at the bottom right of the page 
// @author       JazzMedo
// @match        https://tryhackme.com/r/*
// @include      https://tryhackme.com/r/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tryhackme.com
// @grant        none
// @namespace https://greasyfork.org/users/1420266
// @downloadURL https://update.greasyfork.org/scripts/523015/TryHackMe%20Copy%20to%20Clipboard%20and%20add%20notes.user.js
// @updateURL https://update.greasyfork.org/scripts/523015/TryHackMe%20Copy%20to%20Clipboard%20and%20add%20notes.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(() => {
        (function () {
            // Select all elements with data-sentry-component="AccordionDetails"
            const accordionDetailsList = document.querySelectorAll('[data-sentry-component="AccordionDetails"]');

            // Function to get text excluding images and handling links
            const getTextExcludingImages = (element) => {
                let textContent = '';

                // Loop through the child nodes of the element
                Array.from(element.childNodes).forEach((child) => {
                    // Skip if the child or its parent is inside a <pre> tag
                    const isInsidePre = (node) => {
                        while (node && node !== element) {
                            if (node.tagName === 'PRE' || node.tagName === 'pre') {
                                return true;
                            }
                            node = node.parentNode;
                        }
                        return false;
                    };

                    if (isInsidePre(child.nodeType === Node.TEXT_NODE ? child.parentNode : child)) {
                        return;
                    }

                    // Only consider text nodes or elements that aren't images
                    if (child.nodeType === Node.TEXT_NODE) {
                        let text = child.textContent.trim();
                        if (text) {
                            // Check if the parent element is a <p> tag
                            const parentElement = child.parentElement;
                            const isParagraph = parentElement && parentElement.tagName === 'P';

                            // Add newline if the text ends with a period in a <p> tag
                            if ((isParagraph && text.trim(" ").endsWith('.')) || text.endsWith('?') || text.endsWith(':')) {
                                textContent += text + '\n\n';
                            } else {
                                textContent += text;
                            }
                        }
                    }
                    else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'IMG') {
                        // Skip <pre> tags and their contents

                        if (child.tagName === 'PRE' || child.tagName === 'pre') {
                            return;
                        }

                        // If it's an element and not an image, recurse into it
                        if (child.tagName === 'A' || child.tagName === 'a') {
                            // If it's a link, add the text and a newline after it
                            textContent += ' ' + child.textContent.trim() + ' ';
                        }
                        else if (child.tagName === 'B' || child.tagName === 'b') {
                            // If the element is a <b> tag, add the text and a newline after the paragraph
                            textContent += child.textContent.trim() + '\n\n';
                        } else if (child.tagName === 'span' || child.tagName === 'SPAN') {
                            // If the element is a <b> tag, add the text and a newline after the paragraph
                            textContent += " " + child.textContent.trim() + ' ';
                        }
                        else if (child.tagName === 'UL' || child.tagName === 'ul') {
                            // Add newline after a <ul> tag
                            textContent += getTextExcludingImages(child) + '\n';
                        } else if (child.tagName === 'LI' || child.tagName === 'li') {
                            // Add newline after a <li> tag
                            textContent += child.textContent.trim() + '\n';
                        } else if (child.tagName === 'P' || child.tagName === 'p') {
                            // If <p> contains <b>, add \n\n before <p>
                            if (child.querySelector('b') || child.querySelector('B')) {
                                textContent += '\n\n' + getTextExcludingImages(child);
                            } else {
                                textContent += getTextExcludingImages(child) + '\n\n';
                            }
                        } else if (child.tagName === 'TABLE' || child.tagName === 'table') {
                            // Format the table content
                            textContent += formatTable(child) + '\n\n'; // Call a new function to format the table
                        } else if (child.tagName === 'DIV' || child.tagName === 'div') {
                            // Add double newlines before and after the <div> content
                            textContent += '\n\n' + getTextExcludingImages(child) + '\n\n';
                        } else if (child.tagName === 'H2' || child.tagName === 'h2') {
                            // Add newline after <h2> tag
                            textContent += child.textContent.trim() + '\n\n';
                        } else if (child.tagName === 'code' || child.tagName === 'CODE') {
                            // Add newline after <h2> tag
                            textContent += ' `' + child.textContent.trim() + '` ';
                        } else {
                            // Otherwise, continue recursively
                            textContent += getTextExcludingImages(child);
                        }
                    }
                });

                // Filter excessive newlines (replace \n\n\n with \n\n)
                textContent = textContent.replace(/\n{3,}/g, '\n\n');

                return textContent;
            };

            // New function to format the table
            function formatTable(table) {
                let formattedTable = '----------------------------\n';
                const rows = table.querySelectorAll('tr');
                rows.forEach((row) => {
                    const cells = row.querySelectorAll('th, td');
                    const rowContent = Array.from(cells).map(cell => cell.textContent.trim()).join(' | '); // Join cell content with a separator
                    formattedTable += '| ' + rowContent + ' |\n'; // Add a newline after each row
                });

                // Add a newline after each row for separation
                formattedTable += '----------------------------\n'; // Ensure there's a newline after the last row

                return formattedTable;
            }

            // Loop through all the matched elements
            accordionDetailsList.forEach((accordionDetails) => {
                // Create a button for each AccordionDetails element
                const button = document.createElement('button');
                // Replace text with SVG icon
                button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>`;
                button.title = 'Copy Text Only';
                button.style.position = 'absolute';
                button.style.bottom = '10px';
                button.style.right = '10px'; // Position the button in the top-right corner
                // button.style.zIndex = '1000';
                button.style.padding = '8px 8px 4px 8px';  // Make the button more square-shaped for the icon
                button.style.borderRadius = '5px';
                button.style.backgroundColor = '#47acee'; // Green background
                button.style.color = 'white';
                button.style.border = 'none';
                button.style.cursor = 'pointer';
                button.style.transition = 'all ease-in-out 0.3s';

                // Position the region element relative to show the button correctly
                accordionDetails.style.position = 'relative';

                // Add the button to the accordion details element
                accordionDetails.appendChild(button);

                // Flag to track whether the button was already clicked
                let isClicked = false;

                // Set up button click event to copy the text
                button.addEventListener('click', () => {
                    if (isClicked) return; // Prevent further clicks if already clicked

                    isClicked = true; // Mark as clicked

                    let textContent = getTextExcludingImages(accordionDetails);


                    // Use the Clipboard API to copy text
                    if (textContent) {
                        navigator.clipboard.writeText(textContent).then(() => {
                            // Change button icon to checkmark when copied
                            button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>`;
                            button.style.backgroundColor = '#4CAF50';
                            setTimeout(() => {
                                // Reset to copy icon
                                button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>`;
                                button.style.backgroundColor = '#47acee';
                                isClicked = false;
                            }, 1000);
                        }).catch((err) => {
                            console.error('Failed to copy text: ', err);
                            isClicked = false; // Reset flag in case of error
                        });
                    }
                });
            });


            // Inject CSS into the document
            const style = document.createElement('style');
            style.innerHTML = `
    pre {
        position: relative; /* Ensure the button is positioned relative to the pre block */
    }
    .copy-button {
        position: absolute;
        bottom: 10px;
        right: 10px;

        background-color: #47acee; /* Dark yellow background */
        color: white;
        border: none;
        padding: 8px 8px 4px;
        cursor: pointer;
        border-radius: 5px;
        transition: all ease-in-out 0.2s; /* Animation for button press */

    }
    .copy-button:hover {

        background-color: #8cd1ff; /* Darker green on hover */
    }
    .copy-button:active {
        transform: scale(0.95); /* Slightly shrink the button on click */
    }
`;
            document.head.appendChild(style);

            document.querySelectorAll('pre code').forEach(block => {
                const copyButton = document.createElement('button');
                copyButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>`;
                copyButton.className = 'copy-button'; // Add class for styling
                copyButton.title = 'Copy Commands Only';
                block.parentElement.style.position = 'relative'; // Ensure the parent is positioned
                block.parentElement.appendChild(copyButton);

                copyButton.addEventListener('click', () => {
                    const lines = block.innerText.split('\n');
                    const commands = lines.map(line => {
                        if (line.includes('$ ')) {
                            const parts = line.split('$ ');
                            return parts.length > 1 ? parts[1] : '';
                        } else if (line.includes('>')) {
                            const parts = line.split('>');
                            return parts.length > 1 ? parts[1].trim() : '';
                        }
                        return '';
                    }).filter(command => command !== '').join('\n');

                    navigator.clipboard.writeText(commands).then(() => {
                        const originalText = copyButton.innerHTML;
                        copyButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>`;
                        copyButton.style.backgroundColor = '#4CAF50';
                        setTimeout(() => {
                            copyButton.innerHTML = originalText;
                            copyButton.style.backgroundColor = '#47acee';
                        }, 2000);
                    });
                });
            });


            // تعديل مكان الزر العائم ليكون في الزاوية السفلى اليسرى// تعديل مكان الزر العائم ليكون في الزاوية السفلى اليسرى
            function createCommandPopupUI() {
                if (document.querySelector('#command-popup-ui')) return;

                const floatingButton = document.createElement('button');
                floatingButton.id = 'floating-button';
                floatingButton.innerHTML = `+`;
                floatingButton.style.position = 'fixed';
                floatingButton.style.fontSize = '2rem';
                floatingButton.style.bottom = '20px';
                floatingButton.style.left = '20px'; // استخدام left بدلاً من right
                floatingButton.style.width = '33px';
                floatingButton.style.height = '33px';
                floatingButton.style.borderRadius = '5px';
                floatingButton.style.border = 'none';
                floatingButton.style.backgroundColor = '#61dafb';
                floatingButton.style.color = 'white';
                floatingButton.style.fontSize = '24px';
                floatingButton.style.cursor = 'pointer';
                floatingButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                floatingButton.style.zIndex = '9999';
                floatingButton.style.transition = 'all ease-in-out 0.3s';

                const popup = document.createElement('div');
                popup.id = 'command-popup-ui';
                popup.style.position = 'fixed';
                popup.style.bottom = '80px';
                popup.style.left = '20px'; // تغيير الموضع إلى يسار الصفحة
                popup.style.width = '400px';
                popup.style.backgroundColor = '#282c34';
                popup.style.color = 'white';
                popup.style.padding = '15px';
                popup.style.borderRadius = '8px';
                popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                popup.style.display = 'none';
                popup.style.zIndex = '9999';

                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = 'Write you command here ...';
                input.style.width = 'calc(100% - 50px)';
                input.style.padding = '10px';
                input.style.borderRadius = '4px';
                input.style.border = 'none';
                input.style.marginRight = '10px';

                // Add keypress event listener for Enter key
                input.addEventListener('keypress', (event) => {
                    if (event.key === 'Enter') {
                        const command = input.value.trim();
                        if (command) {
                            const originalContent = runButton.innerHTML;
                            runButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>`;
                            runButton.style.transform = 'scale(0.95)';

                            output.appendChild(createCommandElement(command));
                            saveCommand(command);
                            input.value = '';

                            setTimeout(() => {
                                runButton.innerHTML = originalContent;
                                runButton.style.transform = 'scale(1)';
                            }, 1000);
                        }
                    }
                });

                const inputContainer = document.createElement('div');
                inputContainer.style.display = 'flex';
                inputContainer.style.alignItems = 'center';
                inputContainer.style.marginBottom = '10px';

                const runButton = document.createElement('button');
                runButton.innerText = "➕";
                runButton.style.backgroundColor = '#61dafb';
                runButton.style.color = '#282c34';
                runButton.style.border = 'none';
                runButton.style.padding = '10px';
                runButton.style.borderRadius = '4px';
                runButton.style.cursor = 'pointer';
                runButton.style.width = '40px';
                runButton.style.height = '38px';

                const output = document.createElement('div');
                output.style.marginTop = '10px';
                output.style.fontSize = '14px';
                output.style.overflowY = 'auto';
                output.style.maxHeight = '200px';
                output.style.transition = 'all 0.3s ease';

                const savedCommands = JSON.parse(localStorage.getItem('commands')) || [];

                function createCommandElement(command) {
                    const commandContainer = document.createElement('div');
                    commandContainer.style.display = 'flex';
                    commandContainer.style.alignItems = 'center';
                    commandContainer.style.marginBottom = '8px';
                    commandContainer.style.animation = 'slideIn 0.3s ease';

                    const commandText = document.createElement('div');
                    commandText.innerHTML = `$ ${command}`;
                    commandText.style.color = '#61dafb';
                    commandText.style.flex = '1';

                    const buttonsContainer = document.createElement('div');
                    buttonsContainer.style.display = 'flex';
                    buttonsContainer.style.gap = '5px';

                    const cmdCopyBtn = document.createElement('button');
                    cmdCopyBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>`;
                    cmdCopyBtn.style.backgroundColor = '#98c379';
                    cmdCopyBtn.style.color = 'white';
                    cmdCopyBtn.style.border = 'none';
                    cmdCopyBtn.style.padding = '8px 8px 4px';
                    cmdCopyBtn.style.borderRadius = '4px';
                    cmdCopyBtn.style.cursor = 'pointer';
                    cmdCopyBtn.style.fontSize = '12px';
                    cmdCopyBtn.style.marginLeft = '10px';
                    cmdCopyBtn.style.transition = 'transform 0.2s ease';

                    const deleteBtn = document.createElement('button');
                    deleteBtn.innerText = '🗑';
                    deleteBtn.style.backgroundColor = '#e06c75';
                    deleteBtn.style.color = 'white';
                    deleteBtn.style.border = 'none';
                    deleteBtn.style.padding = '5px 10px';
                    deleteBtn.style.borderRadius = '4px';
                    deleteBtn.style.cursor = 'pointer';
                    deleteBtn.style.fontSize = '12px';
                    deleteBtn.style.transition = 'transform 0.2s ease';

                    cmdCopyBtn.addEventListener('click', () => {
                        navigator.clipboard.writeText(command);
                        const originalSvg = cmdCopyBtn.innerHTML;
                        cmdCopyBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>`;
                        cmdCopyBtn.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            cmdCopyBtn.style.transform = 'scale(1)';
                            cmdCopyBtn.innerHTML = originalSvg;
                        }, 1000);
                    });

                    deleteBtn.addEventListener('click', () => {
                        const originalContent = commandContainer.innerHTML;
                        commandContainer.style.backgroundColor = '#ff000015';
                        commandContainer.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <span style="color: #e06c75;">Are you sure you want to delete this command?</span>
            <div style="display: flex; gap: 8px;">
              <button id="confirm-delete" style="background: #e06c75; border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Yes</button>
              <button id="cancel-delete" style="background: #98c379; border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer;">No</button>
            </div>
          </div>
        `;

                        const confirmBtn = commandContainer.querySelector('#confirm-delete');
                        const cancelBtn = commandContainer.querySelector('#cancel-delete');

                        confirmBtn.addEventListener('click', () => {
                            commandContainer.style.animation = 'slideOut 0.3s ease';
                            setTimeout(() => {
                                commandContainer.remove();
                                const index = savedCommands.indexOf(command);
                                if (index > -1) {
                                    savedCommands.splice(index, 1);
                                    localStorage.setItem('commands', JSON.stringify(savedCommands));
                                }
                            }, 280);
                        });

                        cancelBtn.addEventListener('click', () => {
                            commandContainer.style.backgroundColor = 'transparent';
                            commandContainer.innerHTML = originalContent;
                        });
                    });

                    buttonsContainer.appendChild(cmdCopyBtn);
                    buttonsContainer.appendChild(deleteBtn);
                    commandContainer.appendChild(commandText);
                    commandContainer.appendChild(buttonsContainer);
                    return commandContainer;
                }

                savedCommands.forEach(command => {
                    output.appendChild(createCommandElement(command));
                });

                function saveCommand(command) {
                    savedCommands.push(command);
                    localStorage.setItem('commands', JSON.stringify(savedCommands));
                }

                runButton.addEventListener('click', () => {
                    const command = input.value.trim();
                    if (command) {
                        const originalContent = runButton.innerHTML;
                        runButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>`;
                        runButton.style.transform = 'scale(0.95)';

                        output.appendChild(createCommandElement(command));
                        saveCommand(command);
                        input.value = '';

                        setTimeout(() => {
                            runButton.innerHTML = originalContent;
                            runButton.style.transform = 'scale(1)';
                        }, 1000);
                    }
                });

                floatingButton.addEventListener('click', () => {
                    if (popup.style.display === 'none') {
                        popup.style.display = 'block';
                        popup.style.opacity = '0';
                        popup.style.transform = 'scale(0.95) translateY(20px)';
                        floatingButton.innerHTML = `-`;
                        floatingButton.style.backgroundColor = '#ffcdd2';
                        setTimeout(() => {
                            popup.style.opacity = '1';
                            popup.style.transform = 'scale(1) translateY(0)';
                        }, 0);
                    } else {
                        popup.style.opacity = '0';
                        popup.style.transform = 'scale(0.95) translateY(20px)';
                        floatingButton.innerHTML = `+`;
                        floatingButton.style.backgroundColor = '#61dafb';
                        setTimeout(() => {
                            popup.style.display = 'none';
                        }, 300);
                    }
                });

                const style = document.createElement('style');
                style.textContent = `
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(-100%); }
      }

      @keyframes popIn {
        0% { transform: scale(0) rotate(-180deg); opacity: 0; }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }

      #floating-button {
        transition: transform 0.3s ease;
        animation: popIn 0.5s ease;
      }

      #floating-button:hover {
        transform: scale(1.1);
      }

      #command-popup-ui {
        transition: opacity 0.3s ease, transform 0.3s ease;
        transform-origin: bottom left;
      }
    `;
                document.head.appendChild(style);

                inputContainer.appendChild(input);
                inputContainer.appendChild(runButton);
                popup.appendChild(inputContainer);
                popup.appendChild(output);

                document.body.appendChild(floatingButton);
                document.body.appendChild(popup);
            }

            createCommandPopupUI();

        })();
    }, 2000); // Delay the execution by 2 seconds
    // Your code here...
})();