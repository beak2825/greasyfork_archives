// ==UserScript==
// @name         Qiscus-Copilot
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  Add suggestion (copilot) button to prefill some simple responses for CX
// @author       Richard
// @match        https://omnichannel.qiscus.com/*
// @match        https://multichannel.qiscus.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qiscus.com
// @grant        GM_xmlhttpRequest
// @antifeature  tracking    PostHog
// @downloadURL https://update.greasyfork.org/scripts/533600/Qiscus-Copilot.user.js
// @updateURL https://update.greasyfork.org/scripts/533600/Qiscus-Copilot.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function injectPosthogScript() {
    console.log("Injecting PostHog script into page");

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.textContent = `

    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init('phc_a5Xp2wFUp8Cd41Hyzyer27QqREp4OA3ebH6uyp4jzxm', {
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
    })
  `;

    const head = document.head || document.getElementsByTagName("head")[0];
    if (head) {
      head.insertBefore(script, head.firstChild);
    } else {
      // If head isn't available yet, wait for it
      document.addEventListener("DOMContentLoaded", function () {
        const head = document.head || document.getElementsByTagName("head")[0];
        head.insertBefore(script, head.firstChild);
      });
    }
  }

  injectPosthogScript();

  function extractChatHistory() {
    const commentNodes = document.querySelectorAll(".qcw-comment-container");

    const chatHistory = [];

    let currentMessage = null;

    commentNodes.forEach((node) => {
      const isUser = node.className.includes("qcw-comment--cust");
      const role = isUser ? "user" : "assistant";

      const contentElement = node.querySelector(".qcw-comment__content");
      const message = contentElement ? contentElement.textContent.trim() : "";

      if (!message) return;

      if (!currentMessage || currentMessage.role !== role) {
        if (currentMessage) {
          chatHistory.push(currentMessage);
        }

        currentMessage = {
          role: role,
          message: message,
        };
      } else {
        currentMessage.message += " " + message;
      }
    });

    if (currentMessage) {
      chatHistory.push(currentMessage);
    }

    return chatHistory;
  }

  function addSuggestButton() {
    const buttonContainer = document.querySelector(
      ".qcw-comment-form div div:nth-child(2) div:first-child"
    );

    if (!buttonContainer) {
      console.error("Button container not found");
      return;
    }
    // Create the history button
    const suggestButton = document.createElement("button");

    // Style the button
    suggestButton.textContent = "Suggest";
    suggestButton.id = "btnSuggest";
    suggestButton.style.cssText = `
      background-color: #fff;
      color: #666;
      border: 1px solid #ccc;
      border-radius: 15px;
      padding: 4px 10px;
      font-size: 12px;
      margin-right: 5px;
      cursor: pointer;
      font-weight: 500;
      outline: none;
    `;

    // Add hover effect
    suggestButton.addEventListener("mouseover", () => {
      suggestButton.style.backgroundColor = "#e0e0e0";
    });

    suggestButton.addEventListener("mouseout", () => {
      suggestButton.style.backgroundColor = "#fff";
    });

    // Add click event listener
    suggestButton.addEventListener("click", () => {
      const chatHistory = extractChatHistory();
      getSuggestedResponse(chatHistory);
      posthog.capture("jibai_cx_copilot_suggest_button_click");
    });

    // Insert the history button as the first child
    buttonContainer.insertAdjacentElement("beforeend", suggestButton);

    console.log("History button added successfully");
  }

  // Convert our chat history format to the LLM API format
  function formatForLLM(chatHistory) {
    // Start with the system message
    const formattedMessages = [
      {
        role: "system",
        content:
          "You're a customer service bot. Please autocomplete the next assistant response given this chat history in 100 words or less. Be helpful, concise, and maintain a professional tone.",
      },
    ];

    // Add the chat history messages
    chatHistory.forEach((item) => {
      formattedMessages.push({
        role: item.role,
        content: item.message,
      });
    });

    return formattedMessages;
  }

  // Send chat history to LLM endpoint and get a suggested response
  function getSuggestedResponse(chatHistory) {
    // Replace with your actual LLM API endpoint
    const apiEndpoint =
      "https://pinocchio-snapshot-dot-omnichannel-ai-integration.et.r.appspot.com/co_pilot";

    // Update button to show loading state
    const button = document.querySelector("#btnSuggest");
    const originalText = button.textContent;
    button.textContent = "Loading...";
    button.disabled = true;

    // Convert our chat history to the format expected by the LLM API
    const messages = formatForLLM(chatHistory);

    console.log("Messages:", messages);

    // Make the API request using GM_xmlhttpRequest
    GM_xmlhttpRequest({
      method: "POST",
      url: apiEndpoint,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        messages: messages,
      }),
      onload: function (response) {
        try {
          const responseText = response.responseText;
          console.log("Suggested response:", responseText);

          // Reset button state
          button.textContent = originalText;
          button.disabled = false;

          // Get the textarea element
          const textarea = document.querySelector(".qcw-comment-form textarea");
          if (textarea) {
            // Update the textarea with the LLM response
            textarea.value = responseText;

            // Trigger input event to resize textarea if needed
            const inputEvent = new Event("input", { bubbles: true });
            textarea.dispatchEvent(inputEvent);

            // Focus on the textarea
            textarea.focus();
            textarea.style.height = "100px";

            // Show success message on button
            button.textContent = "Done!";
            setTimeout(() => {
              button.textContent = originalText;
              button.disabled = false;
            }, 1500);
          } else {
            console.error("Textarea not found");
            handleError(button);
          }
        } catch (error) {
          console.error("Error parsing response:", error);
          handleError(button);
        }
      },
      onerror: function (error) {
        console.error("Error getting suggested response:", error);
        handleError(button);
      },
    });
  }

  function handleError(button) {
    // Reset button state if there was an error
    if (button) {
      button.textContent = "Suggest";
      button.disabled = false;
    }
    return "I apologize, but I couldn't generate a suggested response at this time.";
  }

  function waitForCommentForm() {
    const observer = new MutationObserver((mutations, obs) => {
      const commentForm = document.querySelector(".qcw-comment-form");
      if (commentForm) {
        addSuggestButton();
        obs.disconnect(); // Stop observing once we find the element
      }
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Initialize the observer
  waitForCommentForm();
})();
