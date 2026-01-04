// ==UserScript==
// @name         Lenna-Copilot
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Add suggestion (copilot) button to prefill some simple responses for CX
// @author       Richard
// @match        https://platform.lenna.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lenna.ai
// @grant        GM_xmlhttpRequest
// @antifeature  tracking    PostHog
// @downloadURL https://update.greasyfork.org/scripts/533794/Lenna-Copilot.user.js
// @updateURL https://update.greasyfork.org/scripts/533794/Lenna-Copilot.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function injectPosthogScript() {
    console.log("Injecting PostHog script into page");

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.textContent = `
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
        posthog.init('phc_STYxozWdZBFvH9hfHhrLDQGBcK8oUNiuZZ4iISotqxS', {
            api_host: 'https://us.i.posthog.com',
            person_profiles: 'always', // or 'always' to create profiles for anonymous users as well
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

  function extractChatHistory() {
    const chatNodes = document.querySelectorAll(".chat-list");

    const chatHistory = [];

    chatNodes.forEach((node) => {
      // Skip if it's not a message node
      if (
        !node.classList.contains("left") &&
        !node.classList.contains("right")
      ) {
        return;
      }

      // Determine if it's a user or assistant message
      const isUser = node.classList.contains("left");
      const role = isUser ? "user" : "assistant";

      // Get the message content
      const contentElements = node.querySelectorAll(".ctext-wrap-content");
      if (!contentElements) return;

      let nodeMessage = "";

      // Extract text content, handling both plain text and HTML content
      contentElements.forEach((element) => {
        let messageFragment = "";
        if (element.querySelector("p")) {
          messageFragment = element.querySelector("p").textContent.trim();
        } else {
          messageFragment = element.textContent.trim();
        }
        if (!messageFragment) return;
        if (messageFragment.includes("Instagram Ads")) return;

        nodeMessage += messageFragment;
      });

      chatHistory.push({
        role: role,
        message: nodeMessage,
      });
    });

    return chatHistory;
  }

  function addSuggestButton() {
    const buttonContainer = document.querySelector(".editor__header");

    if (!buttonContainer) {
      console.error("Button container not found");
      return;
    }

    // Create the suggest button
    const suggestButton = document.createElement("button");
    suggestButton.type = "button";
    suggestButton.className = "menu-item";
    suggestButton.title = "Suggest Response";
    suggestButton.id = "btnSuggest";

    // Add the icon
    const icon = document.createElement("i");
    icon.className = "ri-lightbulb-flash-line";
    suggestButton.appendChild(icon);

    // Add click event listener
    suggestButton.addEventListener("click", () => {
      const chatHistory = extractChatHistory();
      getSuggestedResponse(chatHistory);
      posthog.capture("jibai_cx_copilot_suggest_button_click");
    });

    // Insert the suggest button before the send button
    const sendButton = buttonContainer.querySelector(".btn-primary");
    if (sendButton) {
      buttonContainer.insertBefore(suggestButton, sendButton);
    } else {
      buttonContainer.appendChild(suggestButton);
    }

    console.log("Suggest button added successfully");
  }

  // Convert our chat history format to the LLM API format
  function formatForLLM(chatHistory) {
    // Start with the system message
    const formattedMessages = [
      {
        role: "system",
        content:
          "You're a customer service bot. Please autocomplete the next assistant response given this chat history in 30 words or less. Be helpful, concise, and maintain a professional tone.",
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
    const icon = button.querySelector("i");
    const originalClass = icon.className;
    icon.className = "ri-loader-4-line spin";
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
          icon.className = originalClass;
          button.disabled = false;

          // Get the editor content div
          const editor = document.querySelector(".tiptap.ProseMirror");
          if (editor) {
            // Update the editor content
            editor.innerHTML = `<p>${responseText}</p>`;

            // Focus on the editor
            editor.focus();

            // Show success message on button
            icon.className = "ri-check-line";
            setTimeout(() => {
              icon.className = originalClass;
              button.disabled = false;
            }, 1500);
          } else {
            console.error("Editor not found");
            handleError(button, icon, originalClass);
          }
        } catch (error) {
          console.error("Error parsing response:", error);
          handleError(button, icon, originalClass);
        }
      },
      onerror: function (error) {
        console.error("Error getting suggested response:", error);
        handleError(button, icon, originalClass);
      },
    });
  }

  function handleError(button, icon, originalClass) {
    // Reset button state if there was an error
    if (button && icon) {
      icon.className = originalClass;
      button.disabled = false;
    }
  }

  function waitForEditorHeader() {
    const observer = new MutationObserver((mutations, obs) => {
      const editorHeader = document.querySelector(".editor__header");
      if (editorHeader) {
        injectPosthogScript();
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
  waitForEditorHeader();
})();
