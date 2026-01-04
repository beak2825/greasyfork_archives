// ==UserScript==
// @name         Quill.org Cheat
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Get answers for Quill.org
// @author       Caden Finkelstein
// @match        https://www.quill.org/connect/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513798/Quillorg%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/513798/Quillorg%20Cheat.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Function to clear existing content
    function clearContent() {
      const contentDiv = document.querySelector("main");
      const styles = document.createElement("style");
      styles.innerText = `
      .questions {
        color: red;
        background: black;
        z-index: 99;
        position: absolute;
      }
      `
      document.body.appendChild(styles);
      if (contentDiv) {
        console.log("Content container found.");
      } else {
        console.error("Content container not found.");
      }
    }

    // Function to get URL parameters
    function getUrlParams(url) {
      const match = url.match(/\/lesson\/([^?#/]+)/);
      if (match) {
        const id = match[1];
        return { id };
      }
      return { id: null }; // Return null if ID is not found
    }

    // Function to display questions and answers
    function displayQuestionsAndAnswers(questions, responses) {
      const contentDiv = document.querySelector("main");
      if (contentDiv) {
        questions.forEach((question, index) => {
          const questionDiv = document.createElement("div");
          questionDiv.className = "question";
          questionDiv.textContent = `Question: ${question.key}`;
          contentDiv.appendChild(questionDiv);

          const responseDiv = document.createElement("div");
          responseDiv.className="answer";
          responseDiv.textContent = `Response: ${responses[index]}`;
          contentDiv.appendChild(responseDiv);

          const separator = document.createElement("hr");
          contentDiv.appendChild(separator);
        });
      } else {
        console.error("Content container not found.");
      }
    }

    // Function to fetch responses for questions
    async function fetchResponses(questions) {
      const responses = [];
      for (const question of questions) {
        const questionId = question.key;
        try {
          const responseUrl = `https://cms.quill.org/questions/${questionId}/responses`;
          const response = await fetch(responseUrl);
          const responseData = await response.json();

          // Check if responseData is an array of objects
          if (
            Array.isArray(responseData) &&
            responseData.length > 0 &&
            typeof responseData[0] === "object"
          ) {
            // Extract relevant information from each object and concatenate into a string
            // const responseText = responseData.map((obj) => obj.text).join(", ");
            // responses.push(responseText);
            responses.push(responseData[0].text);
          } else {
            console.error(
              `Invalid response data format for question ${questionId}`
            );
            responses.push("Error fetching response");
          }
        } catch (error) {
          console.error(
            `Error fetching responses for question ${questionId}:`,
            error
          );
          responses.push("Error fetching response");
        }
      }
      return responses;
    }

    // Function to start the script
    async function start() {
      clearContent(); // Clear existing content
      const currentUrl = window.location.href;
      const { id } = getUrlParams(currentUrl);
      const jsonUrl = `https://www.quill.org/api/v1/lessons/${id}.json`;

      try {
        const response = await fetch(jsonUrl);
        const jsonData = await response.json();
        const questions = jsonData.questions;

        const responses = await fetchResponses(questions);
        displayQuestionsAndAnswers(questions, responses);
      } catch (error) {
        console.error("Error fetching JSON data:", error);
      }
    }

    // Function to initialize the script
    function initialize() {
      const quillButton = document.querySelector(".quill-button");
      if (quillButton) {
        quillButton.addEventListener("click", start);
      } else {
        console.error("Quill button not found, waiting for it to appear.");
        waitForQuillButton();
      }
    }

    // Function to wait for the Quill button
    function waitForQuillButton() {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          const quillButton = document.querySelector(".quill-button");
          if (quillButton) {
            observer.disconnect();
            quillButton.addEventListener("click", start);
            console.log("Quill button found and event listener attached.");
          }
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }

    // Call the initialize function
    initialize();
  })();
