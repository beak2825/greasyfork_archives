// ==UserScript==
// @name         answer machine
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  answer machine unlearn 
// @author       Your Name
// @match        https://web.uplearn.co.uk/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508591/answer%20machine.user.js
// @updateURL https://update.greasyfork.org/scripts/508591/answer%20machine.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    // Create a button element
    const button = document.createElement("button");
    button.innerHTML = "Answers(Please Dont Abuse)";
    button.style.position = "fixed"; // Fix the position so it stays visible
    button.style.top = "310px";
    button.style.right = "10px";
    button.style.zIndex = "1000"; // Ensure it stays on top of other elements
    button.style.padding = "10px";
    button.style.backgroundColor = "#4CAF50";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    document.body.appendChild(button); // Append the button to the page
 
    // Create a textbox element
    const textbox = document.createElement("textarea");
    textbox.style.position = "fixed";
    textbox.style.top = "350px";
    textbox.style.right = "10px";
    textbox.style.width = "300px";
    textbox.style.height = "150px";
    textbox.style.zIndex = "1000";
    textbox.style.padding = "10px";
    textbox.style.border = "1px solid #ccc";
    document.body.appendChild(textbox); // Append the textbox to the page
 
    // Function to prompt user for login credentials and get auth token
    async function authenticateUser(email, password) {
        try {
            const response = await fetch("https://web.uplearn.co.uk/api/", {
                method: "POST",
                headers: {
                    "accept": "*/*",
                    "accept-language": "en-GB,en;q=0.9",
                    "content-type": "application/json",
                    "priority": "u=1, i",
                    "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                referrer: "https://web.uplearn.co.uk/login",
                referrerPolicy: "strict-origin-when-cross-origin",
                body: JSON.stringify({
                    operationName: "AuthenticateUserByEmail",
                    variables: {
                        email: email,
                        password: password
                    },
                    query: `
                        mutation AuthenticateUserByEmail($email: String!, $password: String!) {
                            authenticationResult: authenticateUserByEmail(email: $email, password: $password) {
                                token
                            }
                        }
                    `
                }),
                method: "POST",
                mode: "cors",
                credentials: "include"
            });
 
            const data = await response.json();
            const token = data?.data?.authenticationResult?.token;
 
            if (token) {
                // Store token in localStorage for later use
                localStorage.setItem('auth_token', token);
                return token;
            } else {
                alert("Login failed. Please check your credentials.");
                return null;
            }
        } catch (error) {
            console.error('Error during authentication:', error);
            alert('Error during authentication. Please check the console for details.');
            return null;
        }
    }
 
    // Function to get the authentication token from localStorage
    function getAuthToken() {
        return localStorage.getItem('auth_token');
    }
 
    // Function to extract codes from the URL
    function extractQuizDetailsFromURL() {
        const url = window.location.href;
        const parts = url.split('/');
 
        // Adjust the index based on the URL structure
        const moduleUniqueCode = parts[4]; // Example index for module code
        const subsectionUniqueCode = parts[5]; // Example index for subsection code
        const uniqueCode = parts[6]; // Example index for unique code
        return {
            moduleUniqueCode: moduleUniqueCode || null,
            subsectionUniqueCode: subsectionUniqueCode || null,
            uniqueCode: uniqueCode || null
        };
    }
 
    // Function to get question IDs from the quiz
    async function getQuestionIds(uniqueCode, moduleUniqueCode, subsectionUniqueCode) {
        const authToken = getAuthToken();
 
        if (!authToken) {
            alert("Authorization token is missing.");
            return null;
        }
 
        try {
            const response = await fetch("https://web.uplearn.co.uk/api/", {
                headers: {
                    "accept": "*/*",
                    "accept-language": "en-GB,en;q=0.9",
                    "authorization": `Bearer ${authToken}`,
                    "content-type": "application/json",
                    "priority": "u=1, i",
                },
                referrerPolicy: "strict-origin-when-cross-origin",
                body: JSON.stringify({
                    operationName: "GetProgressQuizGroup",
                    variables: {
                        uniqueCode: uniqueCode,
                        moduleUniqueCode: moduleUniqueCode,
                        subsectionUniqueCode: subsectionUniqueCode,
                        progressQuizQuestionOrder: [
                            { field: "QUESTION_NUMBER", direction: "ASC" }
                        ]
                    },
                    query: `
                        query GetProgressQuizGroup($uniqueCode: String!, $subsectionUniqueCode: String!, $moduleUniqueCode: String!, $progressQuizQuestionOrder: [ProgressQuizQuestionOrdering],) {
                            progressQuizGroup(filter: {uniqueCode: $uniqueCode, subsectionUniqueCode: $subsectionUniqueCode, moduleUniqueCode: $moduleUniqueCode}) {
                                progressQuizQuestions(order: $progressQuizQuestionOrder) {
                                    id
                                    questionNumber
                                }
                            }
                        }
                    `
                }),
                method: "POST",
                mode: "cors",
                credentials: "include"
            });
 
            const data = await response.json();
            const questionData = data?.data?.progressQuizGroup?.progressQuizQuestions;
 
            // Map question IDs to their original numbers
            const questionMap = {};
            questionData.forEach(q => {
                questionMap[q.id] = q.questionNumber;
            });
 
            const questionIds = questionData.map(q => q.id);
            return { questionIds, questionMap };
        } catch (error) {
            console.error('Error fetching question IDs:', error);
            alert('Error fetching question IDs. Please check the console for details.');
            return null;
        }
    }
 
    // Function to fetch answers for all question IDs
    async function fetchAllAnswers(questionIds, questionMap) {
        const authToken = getAuthToken();
 
        if (!authToken) {
            alert("Authorization token is missing.");
            return null;
        }
 
        let allFeedbackMessages = [];
        let feedbackMessageIndex = 1;
 
        for (const questionId of questionIds) {
            try {
                const response = await fetch("https://web.uplearn.co.uk/api/", {
                    headers: {
                        "accept": "*/*",
                        "accept-language": "en-GB,en;q=0.9",
                        "authorization": `Bearer ${authToken}`,
                        "content-type": "application/json",
                        "priority": "u=1, i",
                    },
                    referrerPolicy: "strict-origin-when-cross-origin",
                    body: JSON.stringify({
                        operationName: "AnswerProgressQuizQuestion",
                        variables: {
                            questionId: questionId,
                            responses: [{
                                answer: "{\"value\":\"\"}",
                                timeSpent: "PT24.64S"
                            }]
                        },
                        query: `
                            mutation AnswerProgressQuizQuestion($questionId: ID!, $responses: [QuestionResponse]!) {
                                answerProgressQuizQuestion(questionId: $questionId, responses: $responses) {
                                    responses {
                                        feedbacks {
                                            messages {
                                                type
                                                content
                                                __typename
                                            }
                                            __typename
                                        }
                                        __typename
                                    }
                                }
                            }
                        `
                    }),
                    method: "POST",
                    mode: "cors",
                    credentials: "include"
                });
 
                const data = await response.json();
 
                // Extract feedback messages
                const feedbackMessages = data?.data?.answerProgressQuizQuestion?.responses?.flatMap(response =>
                    response?.feedbacks?.flatMap(feedback =>
                        feedback?.messages?.filter(message => message.__typename === "FeedbackMessage")
                    )
                );
 
                if (feedbackMessages && feedbackMessages.length > 0) {
                    // Map the feedback message index to the original question number
                    const questionNumber = questionMap[questionId];
                    const formattedMessages = feedbackMessages.map(message => formatTextWithBoldTags(message.content)).join("\n");
                    allFeedbackMessages.push(`${questionNumber}. ${formattedMessages}`);
                }
            } catch (error) {
                console.error(`Error fetching answers for question ID ${questionId}:`, error);
                alert(`Error fetching answers for question ID ${questionId}. Check the console for details.`);
            }
        }
 
        return allFeedbackMessages;
    }
 
    // Function to format text with bold tags
    function formatTextWithBoldTags(text) {
        // Convert <strong> tags to bold text
        return text.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
    }
 
    // Function to get quiz details and display all feedback messages
    async function fetchAndDisplayFeedbackMessages() {
        let authToken = getAuthToken(); // Check if token is stored
 
        if (!authToken) {
            // Prompt user for login credentials if token is not available
            const email = prompt("Please enter your email:");
            const password = prompt("Please enter your password:");
 
            if (email && password) {
                authToken = await authenticateUser(email, password);
                if (!authToken) return; // Exit if authentication failed
            } else {
                alert("Email and password are required.");
                return;
            }
        }
 
        const { uniqueCode, moduleUniqueCode, subsectionUniqueCode } = extractQuizDetailsFromURL();
 
        if (!uniqueCode || !moduleUniqueCode || !subsectionUniqueCode) {
            textbox.value = "Quiz details could not be extracted from the URL.";
            return;
        }
 
        const { questionIds, questionMap } = await getQuestionIds(uniqueCode, moduleUniqueCode, subsectionUniqueCode);
 
        if (!questionIds || questionIds.length === 0) {
            textbox.value = "No question IDs found.";
            return;
        }
 
        const feedbackMessages = await fetchAllAnswers(questionIds, questionMap);
 
        if (feedbackMessages && feedbackMessages.length > 0) {
            const formattedMessages = feedbackMessages.join("\n\n");
            textbox.value = formattedMessages;
        } else {
            textbox.value = "No feedback messages found.";
        }
    }
 
    // Add event listener to the button
    button.addEventListener("click", fetchAndDisplayFeedbackMessages);
})();