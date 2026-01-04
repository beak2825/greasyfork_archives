// ==UserScript==
// @name                ChatGPT Keep-Alive
// @description         每隔30秒自动发送一次请求到ChatGPT，防止出现错误提示: "Something went wrong. If this issue persists, please contact us through our helper center at help.openai.com."
// @version             0.2
// @author              eiyen
// @namespace           https://github.com/eiyen/ChatGPT-Keep-Alive
// @description:zh-CN   每隔30秒自动发送一次请求到ChatGPT，防止出现错误提示: "Something went wrong. If this issue persists, please contact us through our helper center at help.openai.com."
// @description:en      Automatically ping ChatGPT every 30 seconds to prevent the error message: "Something went wrong. If this issue persists, please contact us through our helper center at help.openai.com."
// @match               https://chat.openai.com/*
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/464804/ChatGPT%20Keep-Alive.user.js
// @updateURL https://update.greasyfork.org/scripts/464804/ChatGPT%20Keep-Alive.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // Helper function to check if user is on the chat page
  const isUserOnChatPage = () => {
    const navSelector = "nav>a.flex";
    const buttonSelector = "button.justify-center";

    return (
      document.querySelector(navSelector) ||
      document.querySelector(buttonSelector)
    );
  };

  // Function to ping ChatGPT API every 30 seconds
  const pingChatGPT = () => {
    const apiEndpoint = `/api/auth/session`;

    // Request session data from the API
    fetch(apiEndpoint)
      .then((response) => {
        if (!response.ok) {
          const currentTime = new Date().toLocaleString();
          throw new Error(`Network response was not ok. Error occurred at: ${currentTime}`);
        }
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  };

  // Main function to initialize the script
  const main = () => {
    setInterval(() => {
      if (isUserOnChatPage()) {
        pingChatGPT();
      }
    }, 1000 * 30);
  };

  main();
})();
