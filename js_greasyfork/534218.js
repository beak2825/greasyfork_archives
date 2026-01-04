// ==UserScript==
// @name         Enhanced Google AI Studio Chat Navigator
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Adds a floating Table of Contents with code block detection for navigating chat messages in Google AI Studio
// @author       Claude
// @match        https://aistudio.google.com/prompts/*
// @match        https://aistudio.google.com/*/prompts/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534218/Enhanced%20Google%20AI%20Studio%20Chat%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/534218/Enhanced%20Google%20AI%20Studio%20Chat%20Navigator.meta.js
// ==/UserScript==

/*
 * This script adds a floating navigation button to Google AI Studio that displays
 * a table of contents for all chat messages in the conversation.
 *
 * Features:
 * - Shows both user messages and AI responses in chronological order
 * - Each item is numbered sequentially from top to bottom
 * - Displays file attachments along with regular chat messages
 * - Detects and lists code blocks as sub-items under their parent messages
 * - Clicking an item scrolls to that message and highlights it
 * - Supports both light and dark themes
 */

(function() {
    'use strict';

    // Configuration
    const config = {
        buttonPosition: { bottom: '90px', right: '18px' },
        buttonStyle: {
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#4285F4',
            color: 'white',
            border: 'none',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px'
        },
        tocPanelStyle: {
            position: 'fixed',
            top: '60px',
            right: '16px',
            width: '280px',
            maxHeight: 'calc(100vh - 120px)',
            background: '#1e1e1e',
            color: '#e0e0e0',
            borderRadius: '6px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            zIndex: '9998',
            overflowY: 'auto',
            display: 'none',
            padding: '10px 8px',
            fontFamily: 'Google Sans, Roboto, sans-serif'
        },
        darkModeClass: 'dark-theme'
    };

    // Create and append styles
    function addStyles() {
        try {
            const style = document.createElement('style');
            style.textContent = `
                .chat-navigator-toc {
                    transition: transform 0.3s ease, opacity 0.3s ease;
                    transform: translateY(10px);
                    opacity: 0;
                    scrollbar-width: thin;
                }

                .chat-navigator-toc::-webkit-scrollbar {
                    width: 6px;
                }

                .chat-navigator-toc::-webkit-scrollbar-track {
                    background: #2d2d2d;
                }

                .chat-navigator-toc::-webkit-scrollbar-thumb {
                    background: #555;
                    border-radius: 3px;
                }

                .chat-navigator-toc.visible {
                    transform: translateY(0);
                    opacity: 1;
                }

                .chat-navigator-item {
                    padding: 4px 6px;
                    margin: 2px 0;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    display: flex;
                    align-items: center;
                    border-left-width: 2px;
                    font-size: 10px;
                }

                .chat-navigator-item:hover {
                    background-color: #333;
                }

                .chat-navigator-item.user {
                    border-left: 4px solid #4285F4;
                }

                .chat-navigator-item.agent {
                    border-left: 4px solid #34A853;
                }

                .chat-navigator-item-icon {
                    margin-right: 4px;
                    width: 14px;
                    height: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .chat-navigator-item-icon .material-symbols-outlined {
                    font-size: 12px;
                    font-weight: normal;
                }

                .chat-navigator-item-text {
                    font-size: 10px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    color: #e0e0e0;
                    line-height: 1.2;
                }

                .chat-navigator-toc-header {
                    font-size: 11px;
                    font-weight: 500;
                    margin-bottom: 8px;
                    padding-bottom: 6px;
                    border-bottom: 1px solid #3d3d3d;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: #e0e0e0;
                }

                .chat-navigator-close {
                    cursor: pointer;
                    padding: 2px;
                    border-radius: 50%;
                    font-size: 14px;
                }

                .chat-navigator-close:hover {
                    background-color: #3d3d3d;
                }

                @keyframes highlightFade {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }

                .chat-navigator-user-icon, .chat-navigator-ai-icon {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 4px;
                    flex-shrink: 0;
                }

                .chat-navigator-user-icon {
                    background-color: #bbb;
                    color: #222;
                    font-size: 8px;
                }

                .chat-navigator-ai-icon {
                    background-color: #4285F4;
                    color: white;
                    font-size: 8px;
                }

                /* Code block items styling */
                .chat-navigator-code-item {
                    padding: 3px 6px 3px 24px;
                    margin: 1px 0;
                    border-radius: 3px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    display: flex;
                    align-items: center;
                    border-left: 3px solid #F9AB00;
                    font-size: 9px;
                }

                .chat-navigator-code-item:hover {
                    background-color: #333;
                }

                .chat-navigator-code-icon {
                    margin-right: 4px;
                    width: 11px;
                    height: 11px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    color: #F9AB00;
                    font-size: 7px;
                    background-color: rgba(249, 171, 0, 0.2);
                    border-radius: 3px;
                }

                /* Dark mode support */
                .${config.darkModeClass} .chat-navigator-toc {
                    background-color: #1e1e1e;
                    color: #e0e0e0;
                    border: 1px solid #3d3d3d;
                }

                .${config.darkModeClass} .chat-navigator-item:hover,
                .${config.darkModeClass} .chat-navigator-code-item:hover {
                    background-color: #333;
                }

                .${config.darkModeClass} .chat-navigator-toc-header {
                    border-bottom-color: #3d3d3d;
                    color: #e0e0e0;
                }

                .${config.darkModeClass} .chat-navigator-close:hover {
                    background-color: #3d3d3d;
                }

                .${config.darkModeClass} .chat-navigator-item-text {
                    color: #e0e0e0;
                }

                /* Light mode support */
                .chat-navigator-toc:not(.${config.darkModeClass}) {
                    background-color: white;
                    color: #333;
                    border: 1px solid #e0e0e0;
                }

                .chat-navigator-toc:not(.${config.darkModeClass}) .chat-navigator-item-text {
                    color: #333;
                }

                .chat-navigator-toc:not(.${config.darkModeClass}) .chat-navigator-item:hover,
                .chat-navigator-toc:not(.${config.darkModeClass}) .chat-navigator-code-item:hover {
                    background-color: #f1f3f4;
                }

                .chat-navigator-toc:not(.${config.darkModeClass}) .chat-navigator-toc-header {
                    border-bottom-color: #e0e0e0;
                    color: #333;
                }

                .${config.darkModeClass} .chat-navigator-item-icon .material-symbols-outlined {
                    color: #e0e0e0;
                }

                /* Collapsible section controls */
                .chat-navigator-toggle {
                    cursor: pointer;
                    font-size: 10px;
                    margin-left: auto;
                    padding: 0 3px;
                    border-radius: 3px;
                    color: #999;
                }

                .chat-navigator-toggle:hover {
                    color: #ccc;
                    background-color: rgba(255, 255, 255, 0.1);
                }

                .chat-navigator-collapsed .chat-navigator-code-items-container {
                    display: none;
                }

				.chat-navigator-copy-btn {
					margin-left: 4px;
					width: 16px;
					height: 16px;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 3px;
					cursor: pointer;
					font-size: 10px;
					opacity: 0.7;
				}

				.chat-navigator-copy-btn:hover {
					background-color: rgba(255, 255, 255, 0.2);
					opacity: 1;
				}
            `;
            document.head.appendChild(style);
        } catch (err) {
            console.error('Error adding styles:', err);
        }
    }

    // Create the floating TOC button
    function createTocButton() {
        try {
            const button = document.createElement('button');
            button.id = 'chat-navigator-button';
            button.title = 'Chat Navigator';
            button.setAttribute('aria-label', 'Open Chat Navigator');

            // Apply button styles
            Object.assign(button.style, config.buttonStyle, {
                position: 'fixed',
                ...config.buttonPosition
            });

            // Add icon safely with DOM methods
            const iconSpan = document.createElement('span');
            iconSpan.className = 'material-symbols-outlined notranslate';
            iconSpan.textContent = 'menu';  // Changed from 'list' to 'menu' for better appearance
            iconSpan.style.fontSize = '14px'; // Smaller icon size
            iconSpan.style.fontWeight = 'normal'; // Normal weight for icon
            button.appendChild(iconSpan);

            // Add click event
            button.addEventListener('click', toggleTocPanel);

            document.body.appendChild(button);
            return button;
        } catch (err) {
            console.error('Error creating TOC button:', err);
            return null;
        }
    }

    // Create the TOC panel
    function createTocPanel() {
        try {
            const panel = document.createElement('div');
            panel.id = 'chat-navigator-toc';
            panel.className = 'chat-navigator-toc';

            // Apply panel styles
            Object.assign(panel.style, config.tocPanelStyle);

            // Create header using safe DOM methods
            const header = document.createElement('div');
            header.className = 'chat-navigator-toc-header';

            // Add title text
            const titleSpan = document.createElement('span');
            titleSpan.textContent = 'Chat Navigator';
            header.appendChild(titleSpan);

            // Add close button
            const closeSpan = document.createElement('span');
            closeSpan.className = 'chat-navigator-close material-symbols-outlined notranslate';
            closeSpan.textContent = 'close';
            closeSpan.style.fontSize = '14px';
            closeSpan.style.fontWeight = 'normal';
            header.appendChild(closeSpan);

            // Create content container
            const content = document.createElement('div');
            content.className = 'chat-navigator-toc-content';

            panel.appendChild(header);
            panel.appendChild(content);

            // Add close button event
            closeSpan.addEventListener('click', toggleTocPanel);

            document.body.appendChild(panel);
            return panel;
        } catch (err) {
            console.error('Error creating TOC panel:', err);
            return null;
        }
    }

    // Toggle TOC panel visibility
    function toggleTocPanel() {
        try {
            const panel = document.getElementById('chat-navigator-toc');
            if (!panel) {
                console.warn('TOC panel not found');
                return;
            }

            const isVisible = panel.style.display === 'block';

            if (isVisible) {
                panel.style.display = 'none';
                panel.classList.remove('visible');
            } else {
                // Update TOC content before showing
                updateTocContent();
                panel.style.display = 'block';
                setTimeout(() => {
                    panel.classList.add('visible');
                }, 10);
            }
        } catch (err) {
            console.error('Error toggling TOC panel:', err);
        }
    }

    // Toggle code blocks visibility
    function toggleCodeBlocks(event, itemId) {
        try {
            const item = document.getElementById(itemId);
            if (item) {
                item.classList.toggle('chat-navigator-collapsed');

                // Update toggle icon
                const toggle = event.currentTarget;
                toggle.textContent = item.classList.contains('chat-navigator-collapsed') ? 'expand_more' : 'expand_less';
            }

            // Prevent the click from propagating to the parent item
            event.stopPropagation();
        } catch (err) {
            console.error('Error toggling code blocks:', err);
        }
    }

    // Update TOC content based on current chat messages
    function updateTocContent() {
        try {
            const panel = document.getElementById('chat-navigator-toc');
            if (!panel) {
                console.warn('TOC panel not found for updating content');
                return;
            }

            const content = panel.querySelector('.chat-navigator-toc-content');
            if (!content) {
                console.warn('TOC content container not found');
                return;
            }

            // Clear previous content
            while (content.firstChild) {
                content.removeChild(content.firstChild);
            }

            // Try multiple selectors to find chat turns
            const selectors = [
                'ms-chat-turn',
                '.chat-turn-container',
                '.turn-content',
                '.user-prompt-container, .model-prompt-container',
                '.chat-message'
            ];

            let chatTurns = [];
            for (const selector of selectors) {
                chatTurns = document.querySelectorAll(selector);
                if (chatTurns.length > 0) {
                    console.log(`Found ${chatTurns.length} chat turns using selector: ${selector}`);
                    break;
                }
            }

            if (chatTurns.length === 0) {
                const noMessagesDiv = document.createElement('div');
                noMessagesDiv.style.padding = '8px';
                noMessagesDiv.textContent = 'No chat messages found';
                content.appendChild(noMessagesDiv);
                return;
            }

            // Process each chat turn
            chatTurns.forEach((turn, index) => {
                try {
                    // Determine if user or AI message
                    // Try multiple ways to detect the role
                    let isUser = false;
                    if (turn.querySelector('.user-prompt-container')) {
                        isUser = true;
                    } else if (turn.classList.contains('user')) {
                        isUser = true;
                    } else if (turn.getAttribute('data-turn-role') === 'User') {
                        isUser = true;
                    } else if (turn.closest('.user-message')) {
                        isUser = true;
                    }

                    const role = isUser ? 'user' : 'agent';

                    // Create unique ID for this chat item
                    const chatItemId = `chat-item-${index}`;

                    // Extract content snippet for the TOC entry
                    let snippet = getContentSnippet(turn, role);

                    // Create TOC item
                    const item = document.createElement('div');
                    item.className = `chat-navigator-item ${role}`;
                    item.id = chatItemId;
                    item.dataset.index = index;
                    item.dataset.serialNumber = index + 1; // Store the serial number for reference

                    // Create elements using safe DOM methods
                    const iconDiv = document.createElement('div');
                    iconDiv.className = 'chat-navigator-item-icon';

                    // Use custom user/AI icons instead of material icons
                    if (isUser) {
                        const userIcon = document.createElement('div');
                        userIcon.className = 'chat-navigator-user-icon';
                        userIcon.textContent = 'U';
                        iconDiv.appendChild(userIcon);
                    } else {
                        const aiIcon = document.createElement('div');
                        aiIcon.className = 'chat-navigator-ai-icon';
                        aiIcon.textContent = 'AI';
                        iconDiv.appendChild(aiIcon);
                    }

                    const textDiv = document.createElement('div');
                    textDiv.className = 'chat-navigator-item-text';

                    // Add serial number prefix to each item
                    const serialNum = (index + 1).toString().padStart(2, '0');

                    // Extract the first few meaningful words from the message
                    if (snippet.length > 5 && !snippet.startsWith('[')) {
                        // Clean up common prefixes
                        snippet = snippet.replace(/^(User message|AI response|User input):\s*/i, '');
                    }

                    textDiv.textContent = `${serialNum}. ${snippet}`;

                    // Create a container for the main item elements
                    const itemContent = document.createElement('div');
                    itemContent.style.display = 'flex';
                    itemContent.style.flexGrow = '1';
                    itemContent.style.alignItems = 'center';

                    itemContent.appendChild(iconDiv);
                    itemContent.appendChild(textDiv);
                    item.appendChild(itemContent);

                    // Find code blocks in the message
                    const codeBlocks = findCodeBlocks(turn);

                    // If there are code blocks, add a toggle control
                    if (codeBlocks.length > 0) {
                        const toggleDiv = document.createElement('div');
                        toggleDiv.className = 'chat-navigator-toggle material-symbols-outlined notranslate';
                        toggleDiv.textContent = 'expand_less'; // Default to expanded
                        toggleDiv.addEventListener('click', (e) => toggleCodeBlocks(e, chatItemId));
                        item.appendChild(toggleDiv);
                    }

                    // Add click event to scroll to message
                    item.addEventListener('click', () => {
                        scrollToMessage(turn);
                        // Don't close the panel when clicking on a parent item
                    });

                    content.appendChild(item);

                    // Add code blocks as sub-items if any were found
                    if (codeBlocks.length > 0) {
                        const codeItemsContainer = document.createElement('div');
                        codeItemsContainer.className = 'chat-navigator-code-items-container';

                        codeBlocks.forEach((codeData, codeIndex) => {
                            try {
                                const codeItem = document.createElement('div');
                                codeItem.className = 'chat-navigator-code-item';

                                const codeIconDiv = document.createElement('div');
                                codeIconDiv.className = 'chat-navigator-code-icon';
                                codeIconDiv.textContent = '</>';

                                const codeTextDiv = document.createElement('div');
                                codeTextDiv.className = 'chat-navigator-item-text';

                                // Add a prefix based on the language if available
                                let language = codeData.language || 'Code';
                                if (language.toLowerCase() === 'code') {
                                    language = detectLanguage(codeData.text);
                                }

								// Add serial number to code blocks
								const serialNum = ((index + 1) + "." + (codeIndex + 1)).toString().padStart(4, '0');

								let codeSnippet = codeData.text.trim().split('\n')[0].substring(0, 25) || 'Code block';

								// Check if this looks like Java code by searching for package or import statements
								// or class declarations at the beginning of lines
								const codeText = codeData.text.trim();
								let packageName = null;
								let fullClassName = null;
								const looksLikeJava = /^package\s+[\w.]+;|^import\s+[\w.*]+;|^(public\s+|private\s+|protected\s+)?(abstract\s+|final\s+)?\s*class\s+\w+/m.test(codeText);

								if (looksLikeJava) {
									// Extract package name if present
									const packageMatch = codeText.match(/package\s+([\w.]+);/);
									if (packageMatch && packageMatch[1]) {
										packageName = packageMatch[1];
									}

									// Look for class declaration pattern
									const classMatch = codeText.match(/class\s+(\w+)[\s{]/);
									if (classMatch && classMatch[1]) {
										// Use the class name if found
										codeSnippet = `${classMatch[1]}`;
										language = 'Java'; // Override language detection

										// Create fully qualified class name if package exists
										if (packageName) {
											fullClassName = `${packageName}.${classMatch[1]}`;
										} else {
											fullClassName = classMatch[1];
										}
									}
								}

								if (language && language.toLowerCase() === 'java') {
									codeTextDiv.textContent = `${serialNum}. ${codeSnippet}`;
								} else {
									codeTextDiv.textContent = `${serialNum}. ${language}: ${codeSnippet}...`;
								}

								codeItem.appendChild(codeIconDiv);
								codeItem.appendChild(codeTextDiv);

								// Create copy button for code
								const copyBtn = document.createElement('div');
								copyBtn.className = 'chat-navigator-copy-btn';
								copyBtn.textContent = '📋'; // Unicode clipboard symbol
								copyBtn.title = 'Copy code';

								// Add click event for copying code
								copyBtn.addEventListener('click', (e) => {
									e.stopPropagation(); // Prevent navigation to the code block
									navigator.clipboard.writeText(codeData.text)
										.then(() => {
											// Show temporary feedback
											const originalText = copyBtn.textContent;
											copyBtn.textContent = '✓';
											setTimeout(() => {
												copyBtn.textContent = originalText;
											}, 1500);
										})
										.catch(err => {
											console.error('Failed to copy code:', err);
										});
								});

								codeItem.appendChild(copyBtn);

								// Add full class name copy button for Java classes
								if (fullClassName) {
									const copyClassNameBtn = document.createElement('div');
									copyClassNameBtn.className = 'chat-navigator-copy-btn';
									copyClassNameBtn.textContent = '⊕'; // Different symbol for class name copy
									copyClassNameBtn.title = 'Copy fully qualified class name';
									copyClassNameBtn.style.marginLeft = '2px';

									// Add click event for copying class name
									copyClassNameBtn.addEventListener('click', (e) => {
										e.stopPropagation(); // Prevent navigation to the code block
										navigator.clipboard.writeText(fullClassName)
											.then(() => {
												// Show temporary feedback
												const originalText = copyClassNameBtn.textContent;
												copyClassNameBtn.textContent = '✓';
												setTimeout(() => {
													copyClassNameBtn.textContent = originalText;
												}, 1500);
											})
											.catch(err => {
												console.error('Failed to copy class name:', err);
											});
									});

									codeItem.appendChild(copyClassNameBtn);
								}

                                /*codeItem.appendChild(codeIconDiv);
                                codeItem.appendChild(copyBtn);
								codeItem.appendChild(codeTextDiv); */


                                // Add click event to scroll to the specific code block
                                codeItem.addEventListener('click', () => {
                                    scrollToElement(codeData.element);
                                    // Don't close TOC when navigating to keep context
                                });

                                codeItemsContainer.appendChild(codeItem);
                            } catch (err) {
                                console.warn('Error creating code item:', err);
                            }
                        });

                        // Add the container after the main chat item
                        content.appendChild(codeItemsContainer);
                    }
                } catch (err) {
                    console.warn(`Error processing chat turn ${index}:`, err);
                }
            });
        } catch (err) {
            console.error('Error updating TOC content:', err);
        }
    }

    // Extract content snippet from chat turn
    function getContentSnippet(turn, role) {
        try {
            let text = '';

            if (role === 'user') {
                // Try to extract user text
                const textElem = turn.querySelector('.turn-content, .message-content');
                if (textElem) {
                    // Check for text content
                    text = textElem.textContent.trim();

                    // Check for file attachments
                    const fileChunk = turn.querySelector('ms-file-chunk, .file-attachment');
                    if (fileChunk) {
                        const fileName = fileChunk.querySelector('.name, .filename')?.textContent || 'File';
                        text = `[${fileName}]`;
                    }

                    // If still empty, check for other content types
                    if (!text) {
                        const hasContent = textElem.querySelector('*');
                        text = hasContent ? 'User input' : 'Empty message';
                    }
                }
            } else {
                // AI message
                const contentElem = turn.querySelector('.render.agent .turn-content, .model-response, .message-content');
                if (contentElem) {
                    text = contentElem.textContent.trim();

                    // Handle code blocks or other special content
                    if (!text) {
                        if (contentElem.querySelector('pre') || contentElem.querySelector('code')) {
                            text = 'Code block';
                        } else if (contentElem.querySelector('img')) {
                            text = 'Image';
                        } else if (contentElem.querySelector('table')) {
                            text = 'Table';
                        } else {
                            text = 'AI response';
                        }
                    }
                }
            }

            // Extract first few meaningful words for better identification
            if (text.length > 5) {
                // Remove common prefixes that don't add value
                text = text.replace(/^(User message|AI response|User input):\s*/i, '');

                // Split into words and take first few
                const words = text.split(/\s+/);
                if (words.length > 3) {
                    // Take up to 4-5 meaningful words
                    text = words.slice(0, 4).join(' ');
                    if (text.length < 20 && words.length > 4) {
                        text += ' ' + words[4];
                    }
                    text += '...';
                }
            }

            // Limit text length
            return text.length > 30 ? text.substring(0, 30) + '...' : text || (role === 'user' ? 'User input' : 'AI response');
        } catch (err) {
            console.warn('Error getting content snippet:', err);
            return role === 'user' ? 'User input' : 'AI response';
        }
    }

    // Find code blocks in a message
    function findCodeBlocks(turn) {
        const codeBlocks = [];

        try {
            // Check for pre elements (code blocks)
            const preElements = turn.querySelectorAll('pre');
            preElements.forEach(pre => {
                try {
                    // Check if there's a code element inside the pre
                    const codeElement = pre.querySelector('code');
                    if (codeElement) {
                        // Try to detect language from class name (common pattern: language-xyz)
                        let language = 'Code';
                        const classes = codeElement.className.split(' ');
                        for (const cls of classes) {
                            if (cls.startsWith('language-')) {
                                language = cls.replace('language-', '');
                                // Capitalize first letter
                                language = language.charAt(0).toUpperCase() + language.slice(1);
                                break;
                            }
                        }

                        codeBlocks.push({
                            element: pre,
                            text: codeElement.textContent || pre.textContent,
                            language: language
                        });
                    } else {
                        // If no code element, use the pre element itself
                        codeBlocks.push({
                            element: pre,
                            text: pre.textContent,
                            language: 'Code'
                        });
                    }
                } catch (err) {
                    console.warn('Error processing pre element:', err);
                }
            });

            // Check for Google AI Studio specific code elements
            // These are common patterns in Google AI Studio's DOM structure
            const studioCodeBlocks = turn.querySelectorAll('.code-block-wrapper, .code-wrapper, .render pre, [data-code=true]');
            studioCodeBlocks.forEach(block => {
                try {
                    if (!codeBlocks.some(existing => existing.element === block)) { // Avoid duplicates
                        codeBlocks.push({
                            element: block,
                            text: block.textContent,
                            language: 'Code'
                        });
                    }
                } catch (err) {
                    console.warn('Error processing studio code block:', err);
                }
            });

            // Also check for inline code elements that are not inside pre blocks
            const inlineCodeElements = turn.querySelectorAll('code:not(pre code)');
            inlineCodeElements.forEach(code => {
                try {
                    if (code.textContent.trim().length > 0) {
                        codeBlocks.push({
                            element: code,
                            text: code.textContent,
                            language: 'Inline'
                        });
                    }
                } catch (err) {
                    console.warn('Error processing inline code element:', err);
                }
            });

            // Check for special code renderers (Gemini sometimes uses these)
            const customCodeBlocks = turn.querySelectorAll('.code-block, .language-*, [data-code-block]');
            customCodeBlocks.forEach(block => {
                try {
                    if (!block.closest('pre') && !codeBlocks.some(existing => existing.element === block)) { // Avoid duplicates
                        // Look for language indicator
                        let language = 'Code';

                        // Check if the block has a language indicator
                        const langIndicator = block.querySelector('.language-indicator, [data-language]');
                        if (langIndicator) {
                            language = langIndicator.textContent || langIndicator.getAttribute('data-language') || 'Code';
                        }

                        codeBlocks.push({
                            element: block,
                            text: block.textContent,
                            language: language
                        });
                    }
                } catch (err) {
                    console.warn('Error processing custom code block:', err);
                }
            });
        } catch (err) {
            console.error('Error finding code blocks:', err);
        }

        return codeBlocks;
    }

    // Try to detect language from code content
    function detectLanguage(code) {
        try {
            const firstLine = code.trim().split('\n')[0].toLowerCase();

            // Simple language detection based on first line
            if (firstLine.includes('python') || firstLine.startsWith('import ') || firstLine.startsWith('from ') || firstLine.includes('def ')) {
                return 'Python';
            } else if (firstLine.includes('javascript') || firstLine.includes('const ') || firstLine.includes('let ') || firstLine.includes('function ')) {
                return 'JavaScript';
            } else if (firstLine.includes('html') || firstLine.includes('<!doctype') || firstLine.includes('<html')) {
                return 'HTML';
            } else if (firstLine.includes('css') || firstLine.includes('{') && firstLine.includes(':')) {
                return 'CSS';
            } else if (firstLine.includes('java') || firstLine.includes('public class')) {
                return 'Java';
            } else if (firstLine.includes('sql') || firstLine.includes('select ') || firstLine.includes('create table')) {
                return 'SQL';
            } else if (firstLine.includes('bash') || firstLine.startsWith('#!') || firstLine.startsWith('#!/')) {
                return 'Bash';
            }

            return 'Code';
        } catch (err) {
            console.warn('Error detecting language:', err);
            return 'Code';
        }
    }

    // Scroll to specific message
    function scrollToMessage(element) {
        try {
            if (!element) {
                console.warn('No element provided to scroll to');
                return;
            }
            scrollToElement(element);
        } catch (err) {
            console.error('Error scrolling to message:', err);
        }
    }

    // Scroll to a specific element with highlight effect
    // Scroll to a specific element with highlight effect
    function scrollToElement(element) {
        try {
            if (!element) {
                console.warn('No element provided to scroll to');
                return;
            }

            // Scroll element into view with smooth animation
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Add highlight effect
            const highlight = document.createElement('div');
            Object.assign(highlight.style, {
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                backgroundColor: 'rgba(66, 133, 244, 0.15)', // Lighter blue highlight for better visibility
                borderRadius: '4px',
                pointerEvents: 'none',
                zIndex: '1',
                animation: 'highlightFade 1.5s ease-out forwards'
            });

            // Position the element relatively if needed
            const currentPosition = window.getComputedStyle(element).position;
            if (currentPosition === 'static') {
                element.style.position = 'relative';
            }

            element.appendChild(highlight);
            setTimeout(() => {
                if (element.contains(highlight)) {
                    element.removeChild(highlight);
                }
                if (currentPosition === 'static') {
                    element.style.position = '';
                }
            }, 1500);
        } catch (err) {
            console.error('Error in scrollToElement:', err);
        }
    }

    // Check if dark mode is active
    function isDarkMode() {
        try {
            return document.body.classList.contains('dark-theme') ||
                   document.documentElement.classList.contains('dark-theme') ||
                   document.body.classList.contains('dark') ||
                   document.documentElement.classList.contains('dark') ||
                   window.matchMedia('(prefers-color-scheme: dark)').matches;
        } catch (err) {
            console.warn('Error checking dark mode:', err);
            return true; // Default to dark mode for safety
        }
    }

    // Update dark mode status
    function updateDarkMode() {
        try {
            const panel = document.getElementById('chat-navigator-toc');
            if (!panel) {
                console.warn('TOC panel not found for dark mode update');
                return;
            }

            if (isDarkMode()) {
                panel.classList.add(config.darkModeClass);
            } else {
                panel.classList.remove(config.darkModeClass);
            }
        } catch (err) {
            console.error('Error updating dark mode:', err);
        }
    }

    // Initialize the script
    function init() {
        try {
            console.log('Initializing Enhanced Google AI Studio Chat Navigator...');

            // Add CSS styles
            addStyles();

            // Create UI components
            createTocButton();
            createTocPanel();

            // Force dark mode as we're using dark theme for Google AI Studio
            const tocPanel = document.getElementById('chat-navigator-toc');
            if (tocPanel) {
                tocPanel.classList.add(config.darkModeClass);
            } else {
                console.warn('TOC panel not found after creation');
            }

            // Set up dark mode detection
            updateDarkMode();

            // Watch for theme changes
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.attributeName === 'class') {
                        updateDarkMode();
                    }
                }
            });

            observer.observe(document.body, { attributes: true });
            observer.observe(document.documentElement, { attributes: true });

            // Set up mutation observer to detect new chat messages
            const chatObserver = new MutationObserver(() => {
                const panel = document.getElementById('chat-navigator-toc');
                if (panel && panel.style.display === 'block') {
                    updateTocContent();
                }
            });

            // Start observing when chat container becomes available
            function observeChatContainer() {
                // Try multiple possible selectors to find the chat container
                const selectors = [
                    'ms-chat-session',
                    '.chat-view-container',
                    '.chat-container',
                    '.turn-content',
                    '[role="main"]'
                ];

                let chatContainer = null;
                for (const selector of selectors) {
                    chatContainer = document.querySelector(selector);
                    if (chatContainer) break;
                }

                if (chatContainer) {
                    chatObserver.observe(chatContainer, {
                        childList: true,
                        subtree: true
                    });
                    console.log('Chat container observed for changes using selector: ' +
                               (chatContainer.tagName || 'unknown'));

                    // Also observe the body for larger structural changes
                    chatObserver.observe(document.body, {
                        childList: true,
                        subtree: false
                    });
                } else {
                    console.log('Chat container not found, retrying in 1 second...');
                    setTimeout(observeChatContainer, 1000);
                }
            }

            observeChatContainer();

            console.log('Enhanced Google AI Studio Chat Navigator initialized');
        } catch (err) {
            console.error('Error in initialization:', err);
        }
    }

    // Run initialization when document is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Give a moment for the AI Studio UI to fully initialize
        setTimeout(init, 1000);
    }
})();