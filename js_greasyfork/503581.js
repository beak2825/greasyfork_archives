// ==UserScript==
// @name         Tinychat Trivia Auto-Responder
// @author       AllAccessEvIL with help from Bort & x0r
// @version      11.1
// @description  Automatically answers trivia questions on Tinychat with enhanced debugging and error handling
// @match        https://tinychat.com/room/*
// @grant        none
// @run-at       document-start
// @license MIT
// @namespace    https://greasyfork.org/users/1351339
// @downloadURL https://update.greasyfork.org/scripts/503581/Tinychat%20Trivia%20Auto-Responder.user.js
// @updateURL https://update.greasyfork.org/scripts/503581/Tinychat%20Trivia%20Auto-Responder.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function () {
  "use strict";

  // Debugging and Logging Setup
  function log(message) {
    console.log(`[Tinychat Trivia Auto-Responder] ${message}`);
    var logContainer = document.getElementById("logContainer");
    if (logContainer) {
      logContainer.innerHTML += `<div>${message}</div>`;
    }
  }

  // Create a logging window for debugging
  function createLogWindow() {
    var logWindow = document.createElement('div');
    logWindow.id = 'logWindow';
    logWindow.style.position = 'fixed';
    logWindow.style.bottom = '0';
    logWindow.style.right = '0';
    logWindow.style.width = '300px';
    logWindow.style.height = '200px';
    logWindow.style.overflow = 'auto';
    logWindow.style.backgroundColor = 'rgba(0,0,0,0.7)';
    logWindow.style.color = 'white';
    logWindow.style.padding = '10px';
    logWindow.style.zIndex = '9999';
    logWindow.style.fontSize = '12px';
    logWindow.innerHTML = '<div id="logContainer"></div>';
    document.body.appendChild(logWindow);
  }

  // Track trivia questions asked
  var triviaQuestionCount = 0;

  // Send a custom message
  function sendMessage(message) {
    if (CTS.SocketTarget && CTS.SocketTarget.send) {
      var formattedMessage = JSON.stringify({"tc": "msg", "text": message});
      log(`Sending message: ${message}`);
      CTS.SocketTarget.send(formattedMessage);
    } else {
      log("WebSocket connection not available for sending messages.");
      sendError("WebSocket connection lost.");
    }
  }

  // Send special messages after certain trivia questions
  function sendSpecialMessages() {
    if (triviaQuestionCount === 4 || triviaQuestionCount === 9) {
      sendMessage("Who's Ready to Smoke with 😈 𝐀𝐥𝐥𝐀𝐜𝐜𝐞𝐬𝐬𝐄𝐯𝐈𝐋😈 ");
      log("Special message sent after trivia question count: " + triviaQuestionCount);
    }
  }

  // WebSocket Proxy Integration
  function CTSWebSocket() {
    if (window.Proxy === undefined) return;

    // WebSocket handler to intercept and log messages
    var handler = {
      set: function(Target, prop, value) {
        if (prop === "onmessage") {
          var oldMessage = value;
          value = function(event) {
            var data = JSON.parse(event.data);
            if (data.tc === "msg") {
              log(`Received message: ${data.text}`);
              handleMessage(data.text);
            }
            oldMessage(event);
          };
        }
        return (Target[prop] = value);
      },
      get: function(Target, prop) {
        var value = Target[prop];
        if (prop === "send") {
          value = function(event) {
            var data = JSON.parse(event);
            log(`Sending message: ${data.text}`);
            Target.send(event);
          };
        } else if (typeof value === 'function') {
          value = value.bind(Target);
        }
        return value;
      }
    };

    var WebSocketProxy = new window.Proxy(window.WebSocket, {
      construct: function(Target, args) {
        CTS.SocketTarget = new Target(args[0]);
        log(`SOCKET::CONNECTING ${args[0]}`);
        return new window.Proxy(CTS.SocketTarget, handler);
      }
    });
    window.WebSocket = WebSocketProxy;
  }

  // Handle incoming chat messages
  function handleMessage(text) {
    // Detect if the message starts with "[TRIVIA]"
    if (text.includes("[TRIVIA]")) {
      triviaQuestionCount++;
      log("Trivia question detected.");
      sendSpecialMessages(); // Check if a special message needs to be sent

      // Updated regular expression for matching trivia questions and answers
      var questionMatch = text.match(/\[TRIVIA\]\s*QUESTION:\s*(.*?)\s*Worth:\d+ IQ points!.*?(\["A", "B", "C", "D"\])/);
      if (questionMatch) {
        var question = questionMatch[1].trim();
        var answers = {
          "A": questionMatch[2].trim(),
          "B": questionMatch[3].trim(),
          "C": questionMatch[4].trim(),
          "D": questionMatch[5].trim()
        };

        log(`Question detected: ${question}`);
        log(`Answers detected: ${JSON.stringify(answers)}`);
        fetchCorrectAnswer(question, answers);
      } else {
        log("No trivia question match found.");
      }
    }
  }

  // Fetch the correct answer from the Open Trivia Database
  function fetchCorrectAnswer(question, answers) {
    var apiUrl = "https://opentdb.com/api.php?amount=50&type=multiple";
    log(`Fetching trivia data from API URL: ${apiUrl}`);

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        log(`API response data: ${JSON.stringify(data)}`);
        var questionData = data.results.find(q => q.question.toLowerCase().includes(question.toLowerCase()));
        if (questionData) {
          var correctAnswer = questionData.correct_answer;
          var answerOptions = {
            "A": questionData.correct_answer,
            "B": questionData.incorrect_answers[0],
            "C": questionData.incorrect_answers[1],
            "D": questionData.incorrect_answers[2]
          };
          var selectedOption = Object.keys(answerOptions).find(option => answerOptions[option] === correctAnswer);

          if (selectedOption) {
            log(`Correct answer identified: ${selectedOption}`);
            sendAnswer(selectedOption);
          } else {
            log("Correct answer not found in options.");
            sendError("Correct answer not found in options.");
          }
        } else {
          log("Question not found in trivia data.");
          sendError("Trivia question not found in database.");
        }
      })
      .catch(error => {
        log(`API request failed: ${error}`);
        sendError("API request failed.");
      });
  }

  // Send the correct answer to the chat
  function sendAnswer(option) {
    var message = JSON.stringify({"tc": "msg", "text": option});
    log(`Sending answer: ${option}`);
    sendMessage(option);

    // Wait for a response and send a follow-up message if correct
    setTimeout(() => {
      var responseMessage = JSON.stringify({"tc": "msg", "text": "Your answer was correct!"});
      log(`Sending follow-up message: "Your answer was correct!"`);
      sendMessage("Your answer was correct!");

      // Send additional message after another 3 seconds
      setTimeout(() => {
        var additionalMessage = JSON.stringify({"tc": "msg", "text": "𝕐𝕒𝕝𝕝 𝔾𝕠𝕟𝕖 𝕃𝕖𝕒𝕣𝕟 𝕋𝕠𝕕𝕒𝕪"});
        log(`Sending additional message: "𝕐𝕒𝕝𝕝 𝔾𝕠𝕟𝕖 𝕃𝕖𝕒𝕣𝕟 𝕋𝕠𝕕𝕒𝕪"`);
        sendMessage("Y'all gone learn today");
      }, 3000); // 3-second delay
    }, 3000); // 3-second delay after the answer
  }

  // Send an error message to the chat and log it
  function sendError(errorMessage) {
    var message = JSON.stringify({"tc": "msg", "text": `Error: ${errorMessage}`});
    log(`Sending error message: ${errorMessage}`);
    sendMessage(`Error: ${errorMessage}`);
  }

  // Initialize WebSocket proxy
  CTSWebSocket();

  // Start the logging window
  createLogWindow();

  // Initialize and run the script
  var e = 0, i;
  var error_code = [
    "Timeout",
    "Bad Code",
    "More Than One Addon Running",
    "Version Mismatch"
  ];

  var CTS = {
    Init: function Init() {
      e++;
      if (CTS.PageLoaded()) {
        try {
          if (window.CTS === undefined) {
            window.CTS = true;
            CTS.Dispose();
            if (CTS.Version()) {
              log("Script initialized.");
            } else {
              CTS.Flag(
                3,
                "ReqVersion:" +
                  Project.RequiredVersion.Major +
                  "." +
                  Project.RequiredVersion.Minor +
                  "." +
                  Project.RequiredVersion.Patch +
                  "\nCTSVersion:" +
                  (window.CTSVersion ? window.CTSVersion.Major : "N/A") +
                  "." +
                  (window.CTSVersion ? window.CTSVersion.Minor : "N/A") +
                  "." +
                  (window.CTSVersion ? window.CTSVersion.Patch : "N/A")
              );
            }
          } else {
            CTS.Flag(2);
          }
        } catch (e) {
          CTS.Flag(1, e);
        }
        if (e >= 20) CTS.Flag(0);
      }
    },
    Load: function Load() {
      var val = localStorage.getItem("CTS_" + arguments[0]);
      if (val === null && typeof arguments[1] !== "undefined") {
        CTS.Save(arguments[0], arguments[1]);
        return arguments[1];
      }
      return val;
    },
    Save: function Save() {
      localStorage.setItem("CTS_" + arguments[0], arguments[1]);
    },
    PageLoaded: function PageLoaded() {
      return document.querySelector("tinychat-webrtc-app") &&
             document.querySelector("tinychat-webrtc-app").shadowRoot;
    },
    Dispose: function Dispose() {
      clearInterval(i);
    },
    Version: function Version() {
      var ctsVersion = window.CTSVersion || { Major: 0, Minor: 0, Patch: 0 };
      return (
        (Project.RequiredVersion.Major < ctsVersion.Major) ||
        (Project.RequiredVersion.Major === ctsVersion.Major && Project.RequiredVersion.Minor < ctsVersion.Minor) ||
        (Project.RequiredVersion.Major === ctsVersion.Major && Project.RequiredVersion.Minor === ctsVersion.Minor && Project.RequiredVersion.Patch <= ctsVersion.Patch)
      );
    },
    Flag: function Flag(err, caught) {
      clearInterval(i);
      if (error_code[err] !== undefined) {
        log(
          "CTS ADDON ERROR\nCould not load!\nError: " +
            error_code[err] +
            (caught !== undefined ? "\n" + caught : "") +
            "\n\nProject Name:\n" +
            Project.Name
        );
      } else {
        log("Unknown error occurred.");
      }
    }
  };

  i = setInterval(CTS.Init, 500);
})();
