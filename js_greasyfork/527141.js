// ==UserScript==
// @name         AI Email Assistant for GMAIL
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  Assist in generating email replies using AI.
// @author       Morgan Schaefer
// @match        https://mail.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527141/AI%20Email%20Assistant%20for%20GMAIL.user.js
// @updateURL https://update.greasyfork.org/scripts/527141/AI%20Email%20Assistant%20for%20GMAIL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LOCAL_STORAGE_KEY = 'openai_api_key';

    function promptForApiKey() {
        let apiKey = window.prompt("Enter your OpenAI API Key:");
        if (apiKey) {
            localStorage.setItem(LOCAL_STORAGE_KEY, apiKey);
            return apiKey;
        }
        alert("API Key is required to use this script.");
        return null;
    }

    function getApiKey() {
        let apiKey = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!apiKey) {
            apiKey = promptForApiKey();
        }
        return apiKey;
    }

    const API_KEY = getApiKey();
    if (!API_KEY) return;

    function createButton(label, onClick) {
        const button = document.createElement('button');
        button.textContent = label;
        styleButton(button);
        button.addEventListener('click', onClick);
        return button;
    }

    function styleButton(button) {
        Object.assign(button.style, {
            margin: '5px',
            padding: '5px',
            backgroundColor: '#1a73e8',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
        });
    }

    function appendButtonsToComposeWindow() {
        const composeWindow = document.querySelector('td.I5 form.bAs');
        if (composeWindow) {
            const targetTable = composeWindow.querySelector('table.IG');
            if (targetTable && !document.getElementById('ai-assistant-button')) {
                const newTr = document.createElement('tr');
                newTr.id = 'ai-assistant-row';

                const newTd = document.createElement('td');
                newTd.colSpan = 2;

                // Create the AI Assistant button
                const assistantButton = createButton('Assistant AI', onButtonClick);
                assistantButton.id = 'ai-assistant-button';

                // Create the input field
                const inputField = document.createElement('input');
                inputField.type = 'text';
                inputField.id = 'ai-input-field';
                inputField.placeholder = 'Instructions supplémentaires...';
                styleInputField(inputField);

                // Append the button and input field to the table cell
                newTd.appendChild(assistantButton);
                newTd.appendChild(inputField);
                newTr.appendChild(newTd);
                targetTable.querySelector('tbody').appendChild(newTr);
            }
        }
    }

    function styleInputField(input) {
        Object.assign(input.style, {
            marginLeft: '10px',
            padding: '5px',
            border: '1px solid #ccc',
            borderRadius: '3px',
            width: '200px'
        });
    }

    function getEmailAddresses() {
        const fromElement = document.querySelector('span#\\:vf');
        const toElement = document.querySelector('div.afZ.af1 div.akl');

        const from = fromElement ? fromElement.textContent.trim() : 'Unknown Sender';
        const to = toElement ? toElement.textContent.trim() : 'Unknown Recipient';

        return { from, to };
    }

    function getConversationContent() {
        const messages = document.querySelectorAll('.ii.gt .a3s.aiL');
        return Array.from(messages).map(msg => {
            const parentContainer = msg.closest('.adn.ads');
            const senderNameElement = parentContainer.querySelector('.gD span');
            const senderName = senderNameElement ? senderNameElement.textContent : 'Unknown Sender';

            const dateTimeElement = parentContainer.querySelector('.g3');
            const dateTime = dateTimeElement ? dateTimeElement.getAttribute('title') : 'Unknown Date/Time';

            const messageContent = msg.innerText.trim();
            console.log(`Sender: ${senderName}, Date/Time: ${dateTime}`);
            return `Sender: ${senderName}, Date/Time: ${dateTime}\n${messageContent}`;
        }).join('\n\n').trim();
    }

    async function fetchOpenAIResponse(endpoint, payload) {
        try {
            const response = await fetch(`https://api.openai.com/v1/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            return response.ok ? data.choices.map(choice => choice.message.content.trim()) : ['Failed to generate response.'];
        } catch (error) {
            console.error('Error fetching AI responses:', error);
            return ['Failed to generate response.'];
        }
    }

    async function generateAIResponses(prompt) {
        return fetchOpenAIResponse('chat/completions', {
            model: "gpt-4o-2024-08-06",
            messages: [
                { role: "system", content: `You are an assistant that responds in the same language as the input.` },
                { role: "user", content: prompt }
            ],
            max_tokens: 1500,
            temperature: 0.9
        });
    }

    async function identifyKeyPointsAndVariables(conversation) {
        return fetchOpenAIResponse('chat/completions', {
            model: "gpt-4o-2024-08-06",
            messages: [
                { role: "system", content: `Tu es un assistant qui analyse un mail reçu et extrait les éléments de réponse que l'interlocuteur attend.` },
                { role: "user", content: `${conversation}` }
            ],
            max_tokens: 150
        });
    }

    async function generateThreeDistinctResponses(keyPoints, additionalInstructions) {
        const initialResponse = await fetchOpenAIResponse('chat/completions', {
            model: "gpt-4o-2024-08-06",
            messages: [
                { role: "system", content: `You are an assistant that provides concise and distinct responses. Generate three distinct short responses to the following key points. The response should not be longer than 6 words per key point.` },
                { role: "user", content: `Provide three distinct responses for these key points or questions:\n\n${keyPoints}\n\n the responses must be variation of the response : ${additionalInstructions}` }
            ],
            max_tokens: 150,
            n: 1,
            temperature: 0.8
        });

        if (initialResponse && initialResponse.length > 0) {
            return initialResponse[0].split('\n').map(resp => resp.trim()).filter(Boolean).slice(0, 3);
        }
        return ['Failed to generate responses.'];
    }

    async function insertResponseInEmailBody(emailBody, response) {
        const fragment = document.createDocumentFragment();
        response.split('\n').forEach((line) => {
            const textNode = document.createTextNode(line);
            fragment.appendChild(textNode);
            fragment.appendChild(document.createElement('br'));
        });
        emailBody.appendChild(fragment);
    }

    async function onButtonClick() {
        const emailBody = document.querySelector('div[contenteditable="true"][role="textbox"]');
        if (emailBody) {
            emailBody.focus();
            const conversationContent = getConversationContent();
            const { from, to } = getEmailAddresses();

            // Get the additional instructions from the input field
            const additionalInstructions = document.getElementById('ai-input-field').value || '';

            try {
                const keyPointsAndVariables = await identifyKeyPointsAndVariables(conversationContent);
                const shortResponses = await generateThreeDistinctResponses(keyPointsAndVariables, additionalInstructions); // Pass additional instructions here

                let buttonContainer = document.querySelector('#response-options-container');
                if (!buttonContainer) {
                    buttonContainer = document.createElement('div');
                    buttonContainer.id = 'response-options-container';

                    const composeWindow = document.querySelector('td.I5 form.bAs');
                    if (composeWindow) {
                        composeWindow.appendChild(buttonContainer);
                    }
                }

                displayResponseOptions(shortResponses, emailBody, conversationContent, buttonContainer, from, to, additionalInstructions);
            } catch (error) {
                console.error('Error inserting AI response:', error);
            }
        }
    }

    function displayResponseOptions(responses, emailBody, conversationContent, buttonContainer, from, to, additionalInstructions) {
        responses.forEach((response) => {
            const responseButton = createButton(response, async () => {
                const aiPrompt = `You are an email assistant tasked with generating a detailed response. The response is as follows:\n\nFrom: ${from}\nTo: ${to}\n\n${conversationContent}\n\n The reponse must be a elaboration of: ${additionalInstructions}\n\nBased on the above conversation, generate a detailed response using the selected short response option:\n\n${response}. You should generate only the body of the response`;
                const aiResponses = await generateAIResponses(aiPrompt);
                await insertResponseInEmailBody(emailBody, aiResponses[0]);
            });

            buttonContainer.appendChild(responseButton);
        });
    }

    function observeDOMChanges() {
        const observer = new MutationObserver(() => appendButtonsToComposeWindow());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    observeDOMChanges();

})();