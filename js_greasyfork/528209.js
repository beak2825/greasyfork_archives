// ==UserScript==
// @name         Improved Claude Voice Interface
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Voice interface for Claude with TTS functionality, speech recognition, auto-reading and drag positioning
// @author       You
// @match        https://claude.ai/chat/*
// @match        https://claude.ai/*
// @match        https://claude.ai
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528209/Improved%20Claude%20Voice%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/528209/Improved%20Claude%20Voice%20Interface.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const config = {
        buttonHeight: '50px',
        activeBackgroundColor: '#4a86e8',
        inactiveBackgroundColor: '#6c757d',
        activeTextColor: 'white',
        inactiveTextColor: '#e0e0e0',
        readRateMultiplier: 1.0,
        autoReadNewMessages: true,
        checkInterval: 1000, // Check for new messages every 1 second
        readingDelay: 100,   // Delay to check if 50 characters of message have been loaded
        startAfterCharacters: 50 //Number of characters to require before starting reading
    };

    // State variables
    let isSpeaking = false;
    let isRecording = false;
    let currentMessageElement = null;
    let lastMessageElement = null;
    let checkIntervalId = null;
    let processingMessage = false;
    let recognition = null;

    // Drag state variables
    let isDragging = false;
    let startY = 0;
    let startTop = 0;

    // Wait for the page to fully load
    window.addEventListener('load', function() {
        setTimeout(initializeVoiceInterface, 1500);
    });

    function initializeVoiceInterface() {
        console.log('Claude Voice Interface: Initializing...');

        // CSS for highlighting (can be customized)
        const highlightStyle = document.createElement('style');
        highlightStyle.textContent = `
          .active-highlight {
               background-color: #e6e6d8;
               border-radius: 5px;
           }
        `;
        document.head.appendChild(highlightStyle);

        // Create the voice interface bar
        const voiceBar = document.createElement('div');
        voiceBar.id = 'claude-voice-bar';
        voiceBar.style.width = '100%';
        voiceBar.style.display = 'flex';
        voiceBar.style.justifyContent = 'space-between';
        voiceBar.style.alignItems = 'center';
        voiceBar.style.boxSizing = 'border-box';
        voiceBar.style.padding = '10px';
        voiceBar.style.backgroundColor = '#f8f9fa';
        voiceBar.style.borderTop = '1px solid #dee2e6';
        voiceBar.style.position = 'fixed';
        voiceBar.style.top = '0';
        voiceBar.style.left = '0';
        voiceBar.style.zIndex = '10000'; // Increased z-index to make sure it's above other elements

        // Create the left button (Read/Pause)
        const speakButton = document.createElement('button');
        speakButton.id = 'claude-speak-button';
        speakButton.innerHTML = `${createPlayIcon()} <span style="margin-left: 8px;">READ</span>`;
        speakButton.style.width = '48%';
        speakButton.style.height = config.buttonHeight;
        speakButton.style.borderRadius = '8px';
        speakButton.style.border = 'none';
        speakButton.style.backgroundColor = config.inactiveBackgroundColor;
        speakButton.style.color = config.inactiveTextColor;
        speakButton.style.cursor = 'pointer';
        speakButton.style.display = 'flex';
        speakButton.style.justifyContent = 'center';
        speakButton.style.alignItems = 'center';
        speakButton.style.transition = 'all 0.3s';
        speakButton.style.fontWeight = 'bold';

        // Create the right button (Speech-to-Text)
        const recordButton = document.createElement('button');
        recordButton.id = 'claude-record-button';
        recordButton.innerHTML = `${createEmptyCircleIcon()} <span style="margin-left: 8px;">LISTEN</span>`;
        recordButton.style.width = '48%';
        recordButton.style.height = config.buttonHeight;
        recordButton.style.borderRadius = '8px';
        recordButton.style.border = 'none';
        recordButton.style.backgroundColor = config.inactiveBackgroundColor;
        recordButton.style.color = config.inactiveTextColor;
        recordButton.style.cursor = 'pointer';
        recordButton.style.display = 'flex';
        recordButton.style.justifyContent = 'center';
        recordButton.style.alignItems = 'center';
        recordButton.style.transition = 'all 0.3s';
        recordButton.style.fontWeight = 'bold';

        // Create drag handle
        const dragHandle = document.createElement('div');
        dragHandle.id = 'claude-voice-drag-handle';
		dragHandle.innerHTML = createDragIcon();
        dragHandle.style.width = '50px';
        dragHandle.style.left = '50%'; // Center it
        dragHandle.style.cursor = 'ns-resize';
        dragHandle.style.display = 'flex';
        dragHandle.style.justifyContent = 'center';
        dragHandle.style.alignItems = 'center';

        // Add elements to voice bar
        voiceBar.appendChild(speakButton);
        voiceBar.appendChild(recordButton);
        voiceBar.appendChild(dragHandle);

        // Simply append to the body
        document.body.appendChild(voiceBar);

        console.log('Claude Voice Interface: Interface added to page');

        // Add event listeners
        speakButton.addEventListener('click', toggleSpeaking);
        recordButton.addEventListener('click', toggleRecording);

        // Add drag functionality
        setupDragHandlers(voiceBar, dragHandle);

        // Initialize speech recognition if available
        initializeSpeechRecognition();

        // Start monitoring for new messages if auto-read is enabled
        if (config.autoReadNewMessages) {
            startMessageMonitoring();
        }
    }

    function initializeSpeechRecognition() {
        // Check if browser supports speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.continuous = true;

            recognition.onend = function (e) {
                if (isRecording) {
                    recognition.start();
                }
            }

            recognition.onresult = function (e) {
                let results = e.results

                let str = results[results.length - 1][0].transcript;

                if (str[0] === ' ') {
                    str =  ' ' + str[1].toUpperCase() + str.slice(2) + '. ';
                } else {
                    str = str[0].toUpperCase() + str.slice(1) + '. ';
                }

                document.querySelector('.ProseMirror').innerText += str;
            }

            recognition.onerror = function(event) {
                console.error('Recognition error:', event.error);
            };

            // Enable the record button
            const recordButton = document.getElementById('claude-record-button');
            if (recordButton) {
                recordButton.disabled = false;
                recordButton.style.opacity = '1';
            }
        } else {
            console.warn('Speech Recognition not supported in this browser');
        }
    }

    function setupDragHandlers(voiceBar, dragHandle) {
        // Mouse events for desktop
        dragHandle.addEventListener('mousedown', function(e) {
            e.preventDefault();
            startDrag(e.clientY);
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                doDrag(e.clientY);
            }
        });

        document.addEventListener('mouseup', function() {
            endDrag();
        });

        // Touch events for mobile
        dragHandle.addEventListener('touchstart', function(e) {
            e.preventDefault();
            startDrag(e.touches[0].clientY);
        });

        document.addEventListener('touchmove', function(e) {
            if (isDragging) {
                doDrag(e.touches[0].clientY);
            }
        });

        document.addEventListener('touchend', function() {
            endDrag();
        });

        function startDrag(clientY) {
            isDragging = true;
            startY = clientY;
            startTop = parseInt(voiceBar.style.top || '0');
        }

        function doDrag(clientY) {
            const deltaY = startY - clientY;
            const newTop = Math.max(0, startTop - deltaY);
            voiceBar.style.top = `${newTop}px`;
        }

        function endDrag() {
            if (isDragging) {
                isDragging = false;
            }
        }
    }

    function startMessageMonitoring() {
        console.log('Claude Voice Interface: Starting message monitoring');

        // Store the current last message ID
        const currentLastMessage = findLatestClaudeMessage();
        if (currentLastMessage) {
            lastMessageElement = currentLastMessage
            console.log('Claude Voice Interface: Initial message:', lastMessageElement);
        }

        // Start checking for new messages
        checkIntervalId = setInterval(checkForNewMessages, config.checkInterval);
    }

    function checkForNewMessages() {
        if (processingMessage) return; // Don't check for new messages if we're already processing one

        const latestMessage = findLatestClaudeMessage();
        if (!latestMessage || latestMessage === lastMessageElement) return;

        // If we aren't reading something else
        if (!isSpeaking) {
            console.log('Claude Voice Interface: New message detected');
            lastMessageElement = latestMessage;

            // Check if the message has finished generating
            let isLoading = latestMessage.dataset.isStreaming === 'true';

            //if it's still loading, wait for startAfterReading (50) characters or it to finish loading
            if (!isLoading) {
                readMessage(latestMessage, isLoading);
            } else {
                let lengthCheckInterval = setInterval(() => {
                    try {
                        isLoading = latestMessage.dataset.isStreaming === 'true';

                        if (latestMessage.textContent.trim().length >= config.startAfterCharacters || !isLoading) {
                            readMessage(latestMessage, isLoading);
                            clearInterval(lengthCheckInterval);
                        }
                    } catch (e) {
                        clearInterval(lengthCheckInterval);
                        console.error(`Error: ${e.message}`);
                    }
                }, config.readingDelay);
            }
        }
    }

    function toggleSpeaking() {
        const speakButton = document.getElementById('claude-speak-button');

        // Always cancel existing speech first to avoid buggy behavior
        window.speechSynthesis.cancel();

        if (!isSpeaking) {
            console.log('Claude Voice Interface: Starting speech');
            // Start reading the last message
            const message = findLatestClaudeMessage();
            if (message) {
                readMessage(message);
            }
            return;
        } else {
            console.log('Claude Voice Interface: Stopping speech');
            // Instead of pausing, we'll cancel and remember we want to resume
            resetSpeechState();
            speakButton.innerHTML = `${createPlayIcon()} <span style="margin-left: 8px;">RESUME</span>`;
            return;
        }
    }

    function readMessage(message, isLoading = false, spokenSegments = []) {
        if (!message) {
            console.log('Claude Voice Interface: No message to read');
            return;
        }

        currentMessageElement = message;

        // Prepare the text to be read
        if (!message.textContent.trim()) {
            console.log('Claude Voice Interface: Message has no text content');
            return;
        }

        // Recursively process the DOM to wrap words for highlighting
        function traverse(node) {
            let segments = [];

            // Skip script, style, and other non-content elements
            if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName ? node.tagName.toLowerCase() : null;

                //Skip these tag types
                if (['script', 'style', 'noscript', 'svg', 'canvas', 'button', 'text-reader'].includes(tagName)) {
                    return segments;
                }

                //Special processing for preformatted code blocks
                if (tagName === 'pre') {
                    let codeBlockType = node?.children[0]?.children[0]?.textContent;
                    if (codeBlockType) {
                        segments.push({
                            text: `, ${codeBlockType} section detected, please view in chat, `,
                            el: node?.children[0]?.children[0]
                        });
                    }

                    //Skip further processing, ignore unknown pre block types
                    return segments;
                }

                // Process this element's children recursively
                for (let child of node.childNodes) {segments = segments.concat(traverse(child));}
                return segments;
            }

            // Process text nodes that have content
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim();
                if (text === '') return segments;

                // Split into words
                const words = node.textContent.split(' ');

                // Split into individual words
                for (const [i, word] of words.entries()) {
                    const wrapper = document.createElement('text-reader');
                    if (i < words.length - 1) {
                        //Put a space back in
                        segments.push({
                            text: word + ' ',
                            el: node.parentElement
                        });
                    } else {
                        //Add a comma and space to get  a brief pause in spoken version and keep separation from the next line of text
                        segments.push({
                            text: word + ', ',
                            el: node.parentElement
                        });
                    }
                }
            }

            return segments;
        }

        // Start the traversal
        let segments = traverse(message);

        //Remove the last segment if we are still streaming in case it is a partial word
        if (isLoading) {
            segments.pop();
        }

        //Remove any previously spoken segments if we started speaking before it finished streaming
        segments = segments.slice(spokenSegments.length);

        //Collect all the readable fragments and create a map to track the current word location
        function updateCharacterMap(segments) {
            let text = '',
            characterMap = {};

            for (let segment of segments) {
                //Create a map of every character location from the previous max to our new max after appending the text together
                let oldLength = text.length;
                text += segment.text;
                let newLength = text.length;

                for (let i = oldLength; i < newLength; i++) {
                    characterMap[i] = segment.el;
                }
            }

            return {text, characterMap};
        }

        let {text, characterMap} = updateCharacterMap(segments);

        // Cancel any ongoing speech first
        window.speechSynthesis.cancel();

        // Create new utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = config.readRateMultiplier;
        /*let voice = speechSynthesis.getVoices().find(voice => {return voice.voiceURI === localStorage['claude-text-reader-voice'];})
        if (voice) {
            utterance.voice = voice;
        }*/

        // Set up events
        let updatedSegments = segments,
            updatedCharacterMap = characterMap;
        utterance.onboundary = function (e) {
            try {
                //console.log(e.name, e.charIndex, characterMap[e.charIndex].classList, characterMap[e.charIndex]);

                //Check to make sure our segments still exist, rebuild the elements/segments list if it's been updated by streaming
                let el = updatedCharacterMap[e.charIndex];
                console.log(document.body.contains(el), el);
                if (!document.body.contains(el)) {
                    console.log('Claud Voice Interface: DOM Refreshed, Updating Element References');
                    updatedSegments = traverse(message);
                    let results = updateCharacterMap(updatedSegments);
                    updatedCharacterMap = results.characterMap
                    el = updatedCharacterMap[e.charIndex];
                }
                if (!el.classList.contains('active-highlight')) {
                    //Remove the class from all the other elements
                    for (let oldEl of Array.from(message.querySelectorAll('.active-highlight'))) {
                        oldEl.classList.remove('active-highlight');
                    }
                    //Add highlight class to the new element
                    el.classList.add('active-highlight');
                }
            } catch (e) {console.error('Claude Voice Interface - error in highlighting');}
        }

        utterance.onstart = function() {
            console.log('Claude Voice Interface: Speech started');
            isSpeaking = true;
            const speakButton = document.getElementById('claude-speak-button');
            speakButton.innerHTML = `${createPauseIcon()} <span style="margin-left: 8px;">PAUSE</span>`;
            speakButton.style.backgroundColor = config.activeBackgroundColor;
            speakButton.style.color = config.activeTextColor;
            speakButton.style.fontWeight = 'bold';
        };

        utterance.onend = function() {
            //Check to see if it was still loading when we started to play the message
            if (isLoading) {
                //Get the updated message and play it, checking to see if it's still loading now and pass in what we've read so far
                console.log('Claude Voice Intercace speech continuing streaming message');
                isLoading = message.dataset.isStreaming === 'true';
                readMessage(message, isLoading, segments);
            } else {
                console.log('Claude Voice Interface: Speech ended');
                resetSpeechState();
            }
        };

        utterance.onerror = function(event) {
            console.error('Claude Voice Interface: Speech synthesis error:', event.error);
            resetSpeechState();
        };

        // Start speaking - slight delay to try and get the boundary event to fire consistently
        setTimeout(() => {
            window.speechSynthesis.speak(utterance);
        }, 50);
    }

    function findLatestClaudeMessage() {
        try {
			return document.querySelectorAll('div[data-test-render-count]')[Array.from(document.querySelectorAll('div[data-test-render-count]')).length - 1].querySelector('div[data-is-streaming]')
		} catch (e) {
			return null;
		}
    }

    function resetSpeechState() {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // Reset speech state
        isSpeaking = false;

        // Reset button appearance
        const speakButton = document.getElementById('claude-speak-button');
        speakButton.innerHTML = `${createPlayIcon()} <span style="margin-left: 8px;">READ</span>`;
        speakButton.style.backgroundColor = config.inactiveBackgroundColor;
        speakButton.style.color = config.inactiveTextColor;
        speakButton.style.fontWeight = 'normal';

        // Remove any highlighting
        document.querySelectorAll('.active-highlight').forEach(el => el.classList.remove('active-highlight'));
    }

    function toggleRecording() {
        if (!recognition) {
            console.warn('Speech Recognition not initialized');
            alert('Speech Recognition is not supported in this browser');
            return;
        }

        const recordButton = document.getElementById('claude-record-button');

        if (!isRecording) {
            // Start recording
            isRecording = true;

            try {
                recognition.start();

                recordButton.innerHTML = `${createFilledCircleIcon()} <span style="margin-left: 8px;">LISTENING</span>`;
                recordButton.style.backgroundColor = config.activeBackgroundColor;
                recordButton.style.color = config.activeTextColor;
                recordButton.style.fontWeight = 'bold';

                console.log('Claude Voice Interface: Started listening');
            } catch (e) {
                console.error('Error starting recognition:', e);
                isRecording = false;
                alert('Error starting speech recognition: ' + e.message);
            }
        } else {
            // Stop recording
            isRecording = false;

            try {
                recognition.stop();
            } catch (e) {
                console.error('Error stopping recognition:', e);
            }

            recordButton.innerHTML = `${createEmptyCircleIcon()} <span style="margin-left: 8px;">LISTEN</span>`;
            recordButton.style.backgroundColor = config.inactiveBackgroundColor;
            recordButton.style.color = config.inactiveTextColor;
            recordButton.style.fontWeight = 'normal';

            //And try and click the submit button
            document.querySelector('button svg path[d="M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z"]').parentElement.parentElement.click()
        }
    }

    function insertTextToInput(text) {
        if (!text.trim()) return;

        // First, try the specific selector for Claude's input field
        let inputField = document.querySelector('div.ProseMirror[contenteditable="true"]');

        if (!inputField) {
            console.log('Could not find Claude input with ProseMirror class, trying alternative selectors');

            // If not found, try backup selectors
            const potentialSelectors = [
                'textarea',
                '[role="textbox"]',
                '[contenteditable="true"]',
                'input[type="text"]',
                '.chat-input',
                '[class*="promptTextarea"]',
                '[class*="TextInput"]'
            ];

            for (const selector of potentialSelectors) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    // Skip hidden elements or elements not visible in the viewport
                    if (element.offsetParent === null) continue;

                    // Check if this is likely to be the chat input
                    const placeholder = element.getAttribute('placeholder') || '';
                    const aria = element.getAttribute('aria-label') || '';
                    const classes = element.className || '';

                    if (placeholder.includes('message') ||
                        placeholder.includes('Message') ||
                        aria.includes('message') ||
                        aria.includes('Message') ||
                        classes.includes('message') ||
                        classes.includes('Message') ||
                        classes.includes('input') ||
                        classes.includes('Input')) {
                        inputField = element;
                        break;
                    }
                }
                if (inputField) break;
            }
        } else {
            console.log('Found Claude input with ProseMirror class');
        }

        if (inputField) {
            console.log('Claude Voice Interface: Found input field, inserting text');

            // For textarea or input elements
            if (inputField.tagName === 'TEXTAREA' || inputField.tagName === 'INPUT') {
                inputField.value = text;

                // Trigger multiple events to ensure the UI updates
                inputField.dispatchEvent(new Event('input', { bubbles: true }));
                inputField.dispatchEvent(new Event('change', { bubbles: true }));
                inputField.focus();
            }
            // For contenteditable divs (including ProseMirror)
            else if (inputField.getAttribute('contenteditable') === 'true') {
                // Focus the element first
                inputField.focus();

                // Clear existing content
                inputField.innerHTML = '';

                // Insert text properly for contenteditable
                // Using document.execCommand for better compatibility with contenteditable
                document.execCommand('insertText', false, text);

                // Backup - use innerHTML if document.execCommand didn't work
                if (!inputField.textContent) {
                    inputField.innerHTML = text;
                }

                // Fire several events to make sure Claude's UI notices the change
                inputField.dispatchEvent(new Event('input', { bubbles: true }));
                inputField.dispatchEvent(new Event('change', { bubbles: true }));

                // Additional event for React-based UIs
                const customEvent = new CustomEvent('input-change', { bubbles: true, detail: { text } });
                inputField.dispatchEvent(customEvent);
            }

            console.log('Text inserted into input field');
        } else {
            console.warn('Claude Voice Interface: Could not find input field');
            alert('Could not find input field to insert text. Check console for details.');
            console.error('Failed to find any matching input field. Text was:', text);
        }
    }

    function resetRecordingState() {
        // Stop recognition if active
        if (recognition && isRecording) {
            try {
                recognition.stop();
            } catch (e) {
                console.error('Error stopping recognition during reset:', e);
            }
        }

        // Reset recording state
        isRecording = false;
        recognizedText = '';
        collectedSpeechSegments = [];

        // Clear any pending timeouts
        if (listeningTimeoutId) {
            clearTimeout(listeningTimeoutId);
            listeningTimeoutId = null;
        }

        // Reset button appearance
        const recordButton = document.getElementById('claude-record-button');
        if (recordButton) {
            recordButton.innerHTML = `${createEmptyCircleIcon()} <span style="margin-left: 8px;">LISTEN</span>`;
            recordButton.style.backgroundColor = config.inactiveBackgroundColor;
            recordButton.style.color = config.inactiveTextColor;
            recordButton.style.fontWeight = 'normal';
        }
    }

    // Icon creation functions
    function createPlayIcon() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
        </svg>`;
    }

    function createPauseIcon() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
        </svg>`;
    }

    function createEmptyCircleIcon() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" fill="none"/>
        </svg>`;
    }

    function createFilledCircleIcon() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="7" fill="currentColor"/>
        </svg>`;
    }

    function createDragIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
			<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
			<g id="SVGRepo_iconCarrier">
				<path d="M5 9H13H19M5 15H19" stroke="#878787" stroke-width="2" stroke-linecap="round"></path>
			</g>
		</svg>`
    }
})();