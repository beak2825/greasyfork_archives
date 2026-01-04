// ==UserScript==
// @name         EvilTVHelper
// @namespace    eviltv.vercel.app
// @version      1.8.7
// @description  kuss geht raus an chatgpt für das script <3; needed to scrape links for eviltv with clients ip
// @author       JB/ChatGPT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/524052/EvilTVHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/524052/EvilTVHelper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Get the base URL of the current website dynamically
  const baseUrl = window.location.origin;

  // Listen for messages from the web page
  window.addEventListener("message", (event) => {
    // Ensure the message contains the expected data
    if (event.data.type === "FETCH_URL") {
      const targetUrl = event.data.url;
      const headers = event.data.headers || {}; // Optional headers

      if (!targetUrl) {
        console.error("No URL provided to fetch.");
        return;
      }

      // Fetch the HTML from the provided URL with optional headers
      GM_xmlhttpRequest({
        method: "GET",
        url: targetUrl,
        headers: headers,
        onload: function (response) {
          console.log("HTML fetched successfully!");
          // Send the HTML back to the Flask backend
          sendToFlaskBackend(response.responseText, response.finalUrl || targetUrl, targetUrl);
        },
        onerror: function (error) {
          console.error("Error fetching the URL:", error);
        },
      });
    }
  });

  // Send the fetched HTML to the Flask backend
  function sendToFlaskBackend(htmlContent, finalUrl, targetUrl) {
    const apiEndpoint = `${baseUrl}/api/receive_html`; // Dynamically build the API URL
    fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html: htmlContent,
        final_url: finalUrl,
        original_url: targetUrl
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.redirect_url) {
          // Notify the frontend to redirect
          window.postMessage(
            {
              type: "REDIRECT",
              redirect_url: data.redirect_url,
            },
            "*"
          );
        }
      })
      .catch((error) => {
        console.error("Error sending data to Flask backend:", error);
      });
  }
})();

document.getElementById("install-button").style.display = "None";
