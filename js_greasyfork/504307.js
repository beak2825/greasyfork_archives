// ==UserScript==
// @name         ChatGPT Text Definition
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Define highlighted text using ChatGPT with improved streaming and state management
// @match        https://forums.spacebattles.com/*
// @match        https://forums.sufficientvelocity.com/*
// @match        https://questionablequesting.com/*
// @match        https://forum.questionablequesting.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504307/ChatGPT%20Text%20Definition.user.js
// @updateURL https://update.greasyfork.org/scripts/504307/ChatGPT%20Text%20Definition.meta.js
// ==/UserScript==

(function() {
  "use strict";
    
    const createStyleElement = () => {
  //console.log("Creating new style element");
  const style = document.createElement("style");
  style.id = "dynamic-styles";
  style.textContent = `
    /* Remove left gray area */
    .p-body-inner {
      padding-left: 10px !important;
      margin-left: 0 !important;
    }
    /* Double the right gray area */
    .p-body-inner {
      padding-right: calc(var(--columnPadding) * 4) !important;
    }
    /* Shift the content to the left */
    .p-body-inner {
      transform: translateX(calc(var(--columnPadding) * -1));
    }
    /* Adjust the main content width */
    .p-body-main {
      max-width: calc(100% - var(--columnPadding) * 4) !important;
    }
  `;
  //console.log("New style element created:", style);
  return style;
};

const getOrCreateStyleElement = () => {
  //console.log("Attempting to get or create style element");
  let style = document.getElementById("dynamic-styles");
  if (!style) {
    //console.log("Style element not found, creating new one");
    style = createStyleElement();
    document.head.appendChild(style);
    //console.log("New style element appended to head");
  } else {
    //console.log("Existing style element found:", style);
  }
  return style;
};

const isWidthLessThan1918 = () => {
  const width = window.innerWidth;
  //console.log("Current window width:", width);
  const isLess = width < 1918;
  //console.log("Is width less than 1918?", isLess);
  return isLess;
};

const toggleStylesBasedOnWidth = () => {
  //console.log("Toggling styles based on width");
  const style = getOrCreateStyleElement();
  const shouldEnable = isWidthLessThan1918();
  style.disabled = !shouldEnable;
  //console.log("Style element disabled?", style.disabled);
};

// Run the function when the page loads
window.addEventListener('load', () => {
  //console.log("Page loaded, running toggleStylesBasedOnWidth");
  toggleStylesBasedOnWidth();
});

// Also run the function when the window is resized
window.addEventListener('resize', () => {
  //console.log("Window resized, running toggleStylesBasedOnWidth");
  toggleStylesBasedOnWidth();
});

// Immediate invocation to check if it runs on script load
//console.log("Script loaded, running toggleStylesBasedOnWidth immediately");
toggleStylesBasedOnWidth();

  const calculateAvailableSpace = () => {
    const contentElement = document.querySelector(".p-body-inner");
    if (!contentElement) return { width: window.innerWidth, height: window.innerHeight };

    const contentRect = contentElement.getBoundingClientRect();
    const availableWidth = window.innerWidth - contentRect.right;
    const availableHeight = window.innerHeight;

    return { width: availableWidth, height: availableHeight };
  };

  // Configuration
  const API_CONFIG = {
    url: "https://willthereader-openaidefiner.web.val.run",
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
  };

  // State management
  const initialState = {
    definition: "",
    error: null,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "RESET_STATE":
        return { ...initialState };
      case "CHUNK_RECEIVED":
        return {
          ...state,
          definition: state.definition + action.payload,
        };
      case "ERROR":
        return { ...state, error: action.payload };
      default:
        return state;
    }
  };

  const createStore = (reducer, initialState) => {
    let state = initialState;
    let listeners = [];

    const getState = () => state;

    const dispatch = (action) => {
      state = reducer(state, action);
      listeners.forEach(listener => listener(state));
    };

    const subscribe = (listener) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter(l => l !== listener);
      };
    };

    return { getState, dispatch, subscribe };
  };

  const store = createStore(reducer, initialState);

  // UI update

  // Update UI logic to ensure it only updates the current definition
  const updateUI = (state) => {
  const popup = document.getElementById("definition-popup");
  if (!popup) return;

  const innerContent = popup.querySelector(".inner-content");
  if (!innerContent) {
    console.error("Inner content area not found in popup");
    return;
  }

  // Target the last (latest) section added
  const latestSection = innerContent.lastElementChild;
  if (!latestSection || !latestSection.classList.contains("definition-section")) {
    console.error("Latest definition section not found");
    return;
  }

  const contentElement = latestSection.querySelector(".definition-content");
  if (!contentElement) {
    console.error("Definition content element not found");
    return;
  }

  // Remove loading message if it exists
  const loadingMessage = contentElement.querySelector("#loading-message");
  if (loadingMessage) {
    loadingMessage.remove();
  }

  // Update content
  contentElement.innerHTML = state.definition.replace(/\n/g, "<br>");

  // Handle error display
  if (state.error) {
    const errorElement = document.createElement("div");
    errorElement.className = "definition-error";
    errorElement.textContent = `Error: ${state.error}`;
    contentElement.appendChild(errorElement);
  }

  // Apply dynamic sizing after content update
  applyDynamicSizing(popup);
};

  store.subscribe(updateUI);

  // Stream processing
  async function* streamProcessor(reader) {
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim()) {
          yield line;
        }
      }
    }

    if (buffer.trim()) {
      yield buffer;
    }
  }

  const processChunk = (chunk) => {
    try {
      const parsedChunk = JSON.parse(chunk);
      if (parsedChunk.chunk) {
        store.dispatch({ type: "CHUNK_RECEIVED", payload: parsedChunk.chunk });
      }
    } catch (error) {
      console.warn("Error parsing chunk:", error);
    }
  };

  // API response handling
  async function processApiResponse(response) {
    const reader = response.body.getReader();

    try {
      for await (const chunk of streamProcessor(reader)) {
        processChunk(chunk);
      }
      store.dispatch({ type: "COMPLETED" });
    } catch (error) {
      store.dispatch({ type: "ERROR", payload: error.message });
    } finally {
      reader.releaseLock();
    }
  }

  // Selection handling
  async function handleSelection() {
      console.log(`Event target: ${event.target.tagName}, Time: ${performance.now()}`);
    //console.time('handleSelection');
    const selectedText = getSelectedText();
    console.log(`Selected text: "${selectedText}", Time: ${performance.now()}`);

    // Function to check if an element or its ancestors are interactive
    function isInteractiveElement(element) {
        while (element && element !== document.body) {
            if (element.tagName === 'A' || 
                element.tagName === 'BUTTON' || 
                element.role === 'button' ||
                element.tagName === 'INPUT' ||
                element.tagName === 'SELECT' ||
                element.tagName === 'TEXTAREA') {
                return true;
            }
            element = element.parentElement;
        }
        return false;
    }

    // Check if the click was on or within an interactive element
    if (isInteractiveElement(event.target)) {
        console.log("Clicked on or within interactive element, ignoring");
        return;
    }
      
    if (event.target.closest("#definition-popup")) {
        //console.timeEnd('handleSelection');
        return;
    }

    if (!selectedText) {
        console.log("No text selected, exiting handleSelection");
        //console.timeEnd('handleSelection');
        return;
    }
    console.log(`Proceeding with definition process, Time: ${performance.now()}`);
    //console.time('showLoadingPopup');
    const contentElement = showLoadingPopup(selectedText);
    //console.timeEnd('showLoadingPopup');
    //console.log("Loading popup shown");

    ////console.time('resetState');
    store.dispatch({ type: "RESET_STATE" });
    ////console.timeEnd('resetState');

    try {
        //console.time('makeApiRequest');
        const response = await makeApiRequest(selectedText);
        //console.timeEnd('makeApiRequest');

        //console.time('processApiResponse');
        await processApiResponse(response);
        //console.timeEnd('processApiResponse');
    } catch (error) {
        store.dispatch({ type: "ERROR", payload: error.message });
    }
    //console.timeEnd('handleSelection');
}

  // Helper functions
  function getSelectedText() {
    return window.getSelection().toString().trim();
  }

  const createPopupContent = (selectedText) => {
    const wrapper = document.createElement("div");
    wrapper.className = "definition-wrapper";

    const header = document.createElement("h3");
    header.textContent = selectedText || "Selected Text";
    header.style.textAlign = "center";

    const loadingElement = document.createElement("p");
    loadingElement.textContent = "Loading...";
    loadingElement.id = "loading-message";

    return {
      appendTo: (parent) => {
        wrapper.appendChild(header);
        wrapper.appendChild(loadingElement);
        parent.appendChild(wrapper);
        return wrapper;
      },
    };
  };

  const createContentSection = (selectedText) => {
  const section = document.createElement("div");
  section.className = "definition-section";

  const header = document.createElement("div");
  header.className = "selected-text";
  header.textContent = selectedText;
  header.style.textAlign = "center";
  header.style.marginTop = "20px";
  header.style.marginBottom = "20px";

  const content = document.createElement("div");
  content.className = "definition-content";

  const loading = document.createElement("p");
  loading.textContent = "Loading...";
  loading.id = "loading-message";

  content.appendChild(loading);
  section.appendChild(header);
  section.appendChild(content);

  return section;
};

  // Function to create a new section and append it properly
  const showLoadingPopup = (selectedText) => {
  const popup = createPopup();
  const innerContent = popup.querySelector(".inner-content");

  if (!innerContent) {
    console.error("Inner content area not found in popup");
    return null;
  }

  // Create a new section for the new definition
  const newSection = createContentSection(selectedText);
  innerContent.appendChild(newSection);

  popup.focus();

  return newSection.querySelector(".definition-content");
};

  function clearPreviousPopup() {
    const previousPopup = document.getElementById("definition-popup");
    if (previousPopup) {
      previousPopup.remove();
    }
  }

  const createScrollableContent = () => {
  const scrollableContent = document.createElement("div");
  scrollableContent.className = "scrollable-content";
  scrollableContent.style = `
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    padding: 10px;
  `;

  const innerContent = document.createElement("div");
  innerContent.className = "inner-content";
  innerContent.style = `
    padding-bottom: 40px; // This creates the buffer at the bottom
  `;

  scrollableContent.appendChild(innerContent);

  return scrollableContent;
};

  const createPopup = () => {
    //console.log("Creating or retrieving popup");

    let popup = document.getElementById("definition-popup");

    if (!popup) {
      //console.log("Popup doesn't exist, creating new one");
      popup = document.createElement("div");
      popup.id = "definition-popup";
      popup.style = popupStyles;

      const scrollableContent = createScrollableContent();
      const closeBtn = createCloseButton();

      const appendChildren = (parent, ...children) => {
        children.forEach(child => child && parent.appendChild(child));
        return parent;
      };

      appendChildren(popup, closeBtn, scrollableContent);

      applyDynamicSizing(popup);

      const handleResize = () => {
        applyDynamicSizing(popup);
      };
      window.addEventListener("resize", handleResize);

      document.body.appendChild(popup);
      //console.log("New popup appended to body");
    } else {
      //console.log("Existing popup found");
      applyDynamicSizing(popup);
    }

    return popup;
  };

  function createCloseButton() {
    //console.log("Creating close button");

    try {
      const closeBtn = document.createElement("button");
      closeBtn.innerText = "x";
      closeBtn.style = closeBtnStyles;
      closeBtn.addEventListener("click", (event) => {
        //console.log("Close button clicked");
        try {
          event.stopPropagation();
          //console.log("Event propagation stopped");
          const popup = document.getElementById("definition-popup");
          //console.log("Popup element:", popup);
          if (popup) {
            //console.log("Attempting to remove popup");
            popup.remove();
            //console.log("Popup removal attempted");
            //console.log("Popup still in DOM:", !!document.getElementById("definition-popup"));
          } else {
            //console.log("Popup not found");
          }
        } catch (error) {
          console.error("Error in close button click handler:", error);
        }
      }); // <-- This closes the addEventListener method
      closeBtn.setAttribute("aria-label", "Close");

      //console.log("Close button created:", closeBtn);
      return closeBtn;
    } catch (error) {
      console.error("Error creating close button:", error);
      return null;
    }
  }

  async function makeApiRequest(text) {
    console.log(`Preparing to send fetch request for text: "${text}"`);
    try {
      const response = await fetch(API_CONFIG.url, {
        ...API_CONFIG,
        body: JSON.stringify({ selection: text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error("Error making API request:", error);
      throw new Error("Failed to fetch definition from the server. Please try again.");
    }
  }

  // Pure functions to calculate dimensions and positioning
  const calculateCharacterSize = () => {
    const tempElement = document.createElement("span");
    tempElement.style.visibility = "hidden";
    tempElement.textContent = "A";
    document.body.appendChild(tempElement);
    const size = {
      width: tempElement.offsetWidth,
      height: tempElement.offsetHeight,
    };
    document.body.removeChild(tempElement);
    return size;
  };

  const calculatePopupStyles = (content) => {
    const { width: availableWidth, height: availableHeight } = calculateAvailableSpace();
    const { width: charWidth, height: charHeight } = calculateCharacterSize();

    const contentLength = content.length;

    const maxWidth = Math.min(availableWidth * 0.9, 350);
    const maxHeight = Math.min(availableHeight * 0.8, window.innerHeight - 20);

    const width = Math.min(charWidth * contentLength, maxWidth);
    const height = Math.min(charHeight * Math.ceil(contentLength / (maxWidth / charWidth)), maxHeight);

    const padding = Math.min(availableWidth * 0.03, 15);

    return {
      width: `${width}px`,
      height: `${height}px`,
      padding: `${padding}px`,
      right: `${Math.max(10, (availableWidth - width) / 2)}px`,
      top: `${Math.max(10, window.scrollY + 10)}px`, // This line has been changed
    };
  };

  const applyStyles = (element, styles) => Object.assign(element.style, styles);

  const applyDynamicSizing = (popup) => {
  const content = popup.querySelector(".inner-content").textContent;
    const { width: availableWidth, height: availableHeight } = calculateAvailableSpace();
    const { width: charWidth, height: charHeight } = calculateCharacterSize();

    const contentLength = content.length;
    const maxWidth = Math.min(availableWidth * 0.9, 350);
    const maxHeight = Math.min(availableHeight * 0.9, window.innerHeight - 10);

    const width = Math.min(charWidth * contentLength, maxWidth);
    const height = Math.min(charHeight * Math.ceil(contentLength / (maxWidth / charWidth)), maxHeight);

    const padding = Math.min(availableWidth * 0.03, 15);

    const styles = {
      width: `${width}px`,
      maxHeight: `${maxHeight}px`,
      padding: `${padding}px`,
      right: `${Math.max(10, (availableWidth - width) / 2)}px`,
      top: "60px", // Changed to a static value
      position: "fixed", // Changed from 'absolute' to 'fixed'
      overflowY: "auto",
    };

    applyStyles(popup, styles);
  };
  // Styles
  const popupStyles = `
    position: fixed;
    background-color: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    border-radius: 8px;
    z-index: 1000;
    word-wrap: break-word;
    overflow: hidden;
`;

  const closeBtnStyles = `
        position: absolute;
        top: 5px;
        right: 10px;
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 16px;
    `;

  const scrollableContentStyles = `
    max-height: calc(100% - 40px);
    overflow-y: auto;
    padding: 10px;
`;

  // Event listener
  document.addEventListener("mouseup", handleSelection);
    
  // Add this new event listener
document.addEventListener("click", function(event) {
    if (event.target.tagName === "BUTTON") {
        window.getSelection().removeAllRanges();
    }
});

  window.addEventListener("scroll", () => {
    const popup = document.getElementById("definition-popup");
    if (popup) applyDynamicSizing(popup);
  });
})();