// ==UserScript==
// @name         Tinychat Trivia Game Master with Auto-Answer
// @version      1.1
// @author       Bort
// @description  Assists in hosting trivia games on Tinychat with automatic answering
// @match        https://tinychat.com/room/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/1024912
// @downloadURL https://update.greasyfork.org/scripts/503576/Tinychat%20Trivia%20Game%20Master%20with%20Auto-Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/503576/Tinychat%20Trivia%20Game%20Master%20with%20Auto-Answer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let triviaQuestions = [];
    let currentQuestion = null;
    let gameInProgress = false;
    let scores = {};
    let autoAnswerDelay = 5000; // 5 seconds delay before auto-answering

    function monitorChat() {
        const chatObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    const newMessage = mutation.addedNodes[0];
                    if (newMessage.nodeType === 1) {
                        const messageText = newMessage.innerText;
                        if (messageText.includes('[Trivia]') && messageText.includes('?')) {
                            handleTriviaQuestion(messageText);
                        }
                    }
                }
            });
        });

        const chatContainer = document.querySelector("tinychat-webrtc-app")
            .shadowRoot.querySelector("tc-chatlog")
            .shadowRoot.querySelector("#chat");
        if (chatContainer) {
            chatObserver.observe(chatContainer, { childList: true, subtree: true });
        }
    }

    function handleTriviaQuestion(questionText) {
        const questionMatch = questionText.match(/\[Trivia\](.*?)(\?)/);
        if (questionMatch) {
            const question = questionMatch[1].trim();
            fetchCorrectAnswer(question);
        }
    }

    function fetchCorrectAnswer(question) {
        // In a real scenario, you'd fetch this from your question database
        // For this example, we'll use a simple matching system
        const matchingQuestion = triviaQuestions.find(q => q.question.includes(question));
        if (matchingQuestion) {
            currentQuestion = matchingQuestion;
            setTimeout(() => sendAnswer(matchingQuestion.correct_answer), autoAnswerDelay);
        }
    }

    function sendAnswer(answer) {
        const options = ['A', 'B', 'C', 'D'];
        const answerIndex = currentQuestion.incorrect_answers.concat(currentQuestion.correct_answer).indexOf(answer);
        if (answerIndex !== -1) {
            sendMessage(options[answerIndex]);
        }
    }

    function fetchQuestions() {
        $.getJSON('https://opentdb.com/api.php?amount=50&type=multiple', data => {
            triviaQuestions = data.results;
            console.log(`[Trivia] Loaded ${triviaQuestions.length} questions.`);
        });
    }

    function sendMessage(message) {
        const chatInput = document.querySelector('tinychat-webrtc-app')
            .shadowRoot.querySelector('tc-chatlog')
            .shadowRoot.querySelector('#textarea');
        const sendButton = document.querySelector('tinychat-webrtc-app')
            .shadowRoot.querySelector('tc-chatlog')
            .shadowRoot.querySelector('#chat-send');
        
        chatInput.value = message;
        sendButton.click();
    }

    // Initialize
    monitorChat();
    fetchQuestions();

    // Expose some functions to the global scope for manual control
    window.startTrivia = fetchQuestions;
    window.setAutoAnswerDelay = (delay) => {
        autoAnswerDelay = delay;
        console.log(`Auto-answer delay set to ${delay} ms`);
    };
})();