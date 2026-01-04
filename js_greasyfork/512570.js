// ==UserScript==
// @name         Section Completer
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Extract modalUniqueCode and uniqueCode for quizzes and videos, fetch video ID and quiz ID via API calls, and complete quizzes and videos with a delay.
// @author       You
// @match        https://web.uplearn.co.uk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512570/Section%20Completer.user.js
// @updateURL https://update.greasyfork.org/scripts/512570/Section%20Completer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button to trigger the extraction
    const extractButton = document.createElement('button');
    extractButton.textContent = 'Complete Section';
    extractButton.style.position = 'fixed';
    extractButton.style.top = '100px';
    extractButton.style.left = '10px';
    extractButton.style.zIndex = '9999';
    extractButton.style.backgroundColor = '#4CAF50';
    extractButton.style.color = 'white';
    extractButton.style.padding = '10px 20px';
    extractButton.style.border = 'none';
    extractButton.style.cursor = 'pointer';

    const overlay = document.createElement("div");
    overlay.id = "please-wait-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)"; // semi-transparent black
    overlay.style.zIndex = "9999"; // Ensure it's on top of everything
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.color = "white";
    overlay.style.fontSize = "48px";
    overlay.style.fontWeight = "bold";
    overlay.style.textAlign = "center";
    overlay.innerText = "Please wait...";

    document.body.appendChild(extractButton);

    // Array to store quiz IDs
    const quizIds = [];

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

    function getAuthToken() {
        return localStorage.getItem('auth_token');
    }

    function extractCodesFromUrl(url) {
        const pathParts = new URL(url).pathname.split('/').filter(Boolean);
        if (pathParts.length >= 4) {
            const modalUniqueCode = pathParts[1];
            const subsectionUniqueCode = pathParts[2];
            const uniqueCode = pathParts[3];
            return { modalUniqueCode, subsectionUniqueCode, uniqueCode };
        }
        return null;
    }

    // Wait for 10 seconds
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function to fetch video details and get video ID
    async function fetchVideoId(modalUniqueCode, subsectionUniqueCode, uniqueCode) {
        const authToken = getAuthToken();

        if (!authToken) {
            alert("Authorization token is missing.");
            return null;
        }
        return fetch("https://web.uplearn.co.uk/api/", {
            headers: {
                accept: "*/*",
                authorization: `Bearer ${authToken}`,
                "content-type": "application/json",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            body: JSON.stringify({
                operationName: "GetVideoLesson",
                variables: {
                    moduleUniqueCode: modalUniqueCode,
                    subsectionUniqueCode: subsectionUniqueCode,
                    uniqueCode: uniqueCode,
                },
                query: `
                query GetVideoLesson($uniqueCode: String!, $subsectionUniqueCode: String!, $moduleUniqueCode: String!) {
                    videoLesson(filter: {uniqueCode: $uniqueCode, subsectionUniqueCode: $subsectionUniqueCode, moduleUniqueCode: $moduleUniqueCode}) {
                        id
                        wistiaId
                        uniqueCode
                        title
                        length
                        duration
                    }
                }`
            }),
            method: "POST"
        }).then(response => response.json())
        .then(data => {
            const videoId = data.data.videoLesson.id;
            return videoId; // Return the videoId to complete later
        })
        .catch(error => console.error('Error fetching video details:', error));
    }

    // Function to complete a video lesson
    async function completeVideoLesson(lessonId) {
        const authToken = getAuthToken();

        if (!authToken) {
            alert("Authorization token is missing.");
            return null;
        }
        return fetch("https://web.uplearn.co.uk/api/", {
            headers: {
                accept: "*/*",
                authorization: `Bearer ${authToken}`,
                "content-type": "application/json",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            body: JSON.stringify({
                operationName: "CompleteVideoLesson",
                variables: {
                    lessonId: lessonId,
                    percentWatched: 1.00,
                    timeSpent: 9999.99
                },
                query: `
                mutation CompleteVideoLesson($lessonId: ID!, $timeSpent: Decimal!, $percentWatched: Decimal!) {
                    completeVideoLesson(lessonId: $lessonId, timeSpent: $timeSpent, percentWatched: $percentWatched) {
                        id
                        timeSpent
                        __typename
                    }
                }`
            }),
            method: "POST"
        }).then(response => response.json())
        .then(data => {
        })
        .catch(error => console.error('Error completing video lesson:', error));
    }

    // Function to fetch quiz details and get quiz ID
    async function fetchQuizId(modalUniqueCode, subsectionUniqueCode, uniqueCode) {
        const authToken = getAuthToken();

        if (!authToken) {
            alert("Authorization token is missing.");
            return null;
        }
        return fetch("https://web.uplearn.co.uk/api/", {
            headers: {
                accept: "*/*",
                authorization: `Bearer ${authToken}`,
                "content-type": "application/json",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            body: JSON.stringify({
                operationName: "GetProgressQuizGroup",
                variables: {
                    uniqueCode: uniqueCode,
                    moduleUniqueCode: modalUniqueCode,
                    subsectionUniqueCode: subsectionUniqueCode
                },
                query: `
                query GetProgressQuizGroup($uniqueCode: String!, $subsectionUniqueCode: String!, $moduleUniqueCode: String!) {
                    progressQuizGroup(filter: {uniqueCode: $uniqueCode, subsectionUniqueCode: $subsectionUniqueCode, moduleUniqueCode: $moduleUniqueCode}) {
                        id
                        uniqueCode
                        name
                    }
                }`
            }),
            method: "POST"
        }).then(response => response.json())
        .then(data => {
            const quizId = data.data.progressQuizGroup.id;
            return quizId; // Return the quizId to complete later
        })
        .catch(error => console.error('Error fetching quiz details:', error));
    }

    // Function to complete a quiz
    // Function to complete a quiz using dynamic authToken and quizId (progressQuizGroupId)
async function completeQuiz(quizId) {
    const authToken = getAuthToken(); // Get the stored auth token

    if (!authToken) {
        alert("Authorization token is missing.");
        return null;
    }

    return fetch("https://web.uplearn.co.uk/api/", {
        headers: {
            "accept": "*/*",
            "authorization": `Bearer ${authToken}`, // Dynamic auth token
            "content-type": "application/json",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
        },
        referrer: window.location.href, // Dynamically sets the current URL as the referrer
        referrerPolicy: "strict-origin-when-cross-origin",
        body: JSON.stringify({
            operationName: "CompleteProgressQuizGroup",
            variables: {
                progressQuizGroupId: quizId // Dynamic quiz ID
            },
            query: `
            mutation CompleteProgressQuizGroup($progressQuizGroupId: ID!) {
                completeProgressQuizGroup(progressQuizGroupId: $progressQuizGroupId)
            }`
        }),
        method: "POST",
        mode: "cors",
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {
    })
    .catch(error => console.error('Error completing quiz group:', error));
}


    // Function to extract codes and complete them with delay
    async function extractAndCompleteCodes() {
        let authToken = getAuthToken();

        if (!authToken) {
            const email = prompt("Please enter your email:");
            const password = prompt("Please enter your password:");

            if (email && password) {
                authToken = await authenticateUser(email, password);
                if (!authToken) return;
            } else {
                alert("Email and password are required.");
                return;
            }
        }

        const uniqueCodes = [];

        // Find all button and anchor elements
        const buttons = document.querySelectorAll('button, a');

        document.body.appendChild(overlay);

        for (const button of buttons) {
            const url = button.href || button.dataset.url;
            if (url) {
                const codes = extractCodesFromUrl(url);
                if (codes) {
                    uniqueCodes.push(codes);

                    // Fetch video ID and complete video lesson
                    const videoId = await fetchVideoId(codes.modalUniqueCode, codes.subsectionUniqueCode, codes.uniqueCode);
                    if (videoId) {
                        await completeVideoLesson(videoId);
                        await delay(10000); // Wait 10 seconds before next action
                    }

                    // Fetch quiz ID and complete quiz
                    const quizId = await fetchQuizId(codes.modalUniqueCode, codes.subsectionUniqueCode, codes.uniqueCode);
                    if (quizId) {
                        await completeQuiz(quizId);
                        await delay(10000); // Wait 10 seconds before next action
                    }
                }
            }
        }

        document.body.removeChild(overlay);
        window.location.reload()
    }

    // Add event listener to the button
    extractButton.addEventListener('click', extractAndCompleteCodes);
})();