// ==UserScript==
// @name         Narrow emoji helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows you to add emoji easily while chatting with squad memebers.
// @author       Python
// @match        https://narrow.one/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518581/Narrow%20emoji%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/518581/Narrow%20emoji%20helper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Utility functions
  function randRangeHelper(t, e, i) {
    return i * (e - t) + t;
  }
  function randRange(t, e) {
    return randRangeHelper(t, e, Math.random());
  }

  function randInt(t, e) {
    return Math.floor(randRange(t, e));
  }

  const emojiModalHTML = `
<div id="emoji-modal" class="emoji-modal wrinkledPaper">
  <div class="emoji-modal-content">
    <ul id="emoji-list"></ul>
  </div>
</div>
`;

  const emojiModalCSS = `
.emoji-modal {
  display: none;
  position: absolute;
  z-index: 9999;
  background: ##454545; /* Dark theme background */
  border: 1px solid #4d453e; /* Wrinkled paper style */
  border-radius: 5px;
  padding: 10px;
  color: white;
}

.emoji-modal-content {
  max-height: 200px;
  overflow-y: auto;
}

.emoji-modal-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.emoji-modal-content li {
  cursor: pointer;
  padding: 5px;
  background-color: #454545; /* Match modal background */
}

.emoji-modal-content li:hover,
.emoji-modal-content li.active {
  background-color: #605f5f; /* Highlight color */
}
`;

  /**
   * Injects the emoji modal and its associated styles into the chat container.
   * Ensures the modal is ready to display emoji suggestions.
   */
  const injectEmojiModal = (chatContainer) => {
    const head = document.getElementsByTagName("head")[0];
    const style = document.createElement("style");
    style.innerHTML = emojiModalCSS;
    head.appendChild(style);

    chatContainer.insertAdjacentHTML("beforeend", emojiModalHTML);
    chatContainer.style.zIndex = 10;
    chatContainer.classList.add("emoji-modal-added");
    console.log(
      "%cChat Helper Script Inserted",
      "color: #6ee4ff; font-size: 14px;"
    );
  };

  /**
   * Displays emoji suggestions based on the user's input.
   * @param {string} input - The current input value from the chat input field.
   * @param {Object} emojis - A dictionary of emoji names and their corresponding emoji characters.
   */
  const showEmojiSuggestions = (input, emojis) => {
    const emojiList = document.getElementById("emoji-list");
    emojiList.innerHTML = ""; // Clear previous suggestions

    const query = input.split(":").pop();

    // Hide the modal if the query is less than 2 characters
    if (query.length < 2) {
      document.getElementById("emoji-modal").style.display = "none";
      return;
    }

    const suggestions = Object.entries(emojis)
      .filter(([name]) => name.startsWith(query))
      .map(([name, emoji]) => ({ name, emoji }));

    suggestions.forEach(({ name, emoji }, index) => {
      const li = document.createElement("li");
      li.textContent = `${emoji} :${name}:`;
      if (index === 0) li.classList.add("active"); // Highlight the first suggestion
      li.addEventListener("click", () => {
        const chatInput = document.querySelector(".chat-input");
        const cursorPosition = chatInput.selectionStart;
        const textBeforeCursor = chatInput.value.substring(0, cursorPosition);
        const lastColonIndex = textBeforeCursor.lastIndexOf(`:${query}`);
        if (lastColonIndex !== -1) {
          chatInput.value =
            chatInput.value.substring(0, lastColonIndex) +
            emoji +
            chatInput.value.substring(cursorPosition);
          chatInput.setSelectionRange(
            lastColonIndex + emoji.length,
            lastColonIndex + emoji.length
          );
        }
        document.getElementById("emoji-modal").style.display = "none";
      });
      emojiList.appendChild(li);
    });

    if (suggestions.length > 0) {
      const modal = document.getElementById("emoji-modal");
      modal.style.border = "none";
      modal.style.display = "block";
      modal.style.bottom = "50px"; // Adjust as needed
      modal.style.setProperty("--wrinkled-paper-seed", randInt(1, 99999));
      emojiList.parentElement.scrollTop = 0; // Reset scroll position
    } else {
      document.getElementById("emoji-modal").style.display = "none";
    }
  };

  /**
   * Handles navigation through emoji suggestions using arrow keys.
   * Allows selection of emojis with the Enter key and hides the modal with the Space key.
   * @param {KeyboardEvent} event - The keyboard event triggered by user interaction.
   */
  const handleArrowNavigation = (event) => {
    const emojiModal = document.getElementById("emoji-modal");
    const emojiList = document.getElementById("emoji-list");
    const items = emojiList.querySelectorAll("li");
    let currentIndex = Array.from(items).findIndex((item) =>
      item.classList.contains("active")
    );

    if (event.key === "ArrowDown") {
      items[currentIndex].classList.remove("active");
      currentIndex = (currentIndex + 1) % items.length;
      items[currentIndex].classList.add("active");
      items[currentIndex].scrollIntoView({ block: "nearest" });
      event.preventDefault(); // Prevent default scrolling behavior
    } else if (event.key === "ArrowUp") {
      items[currentIndex].classList.remove("active");
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      items[currentIndex].classList.add("active");
      items[currentIndex].scrollIntoView({ block: "nearest" });
      event.preventDefault(); // Prevent default scrolling behavior
    } else if (event.key === "Enter") {
      if (emojiModal.style.display === "block" && items.length > 0) {
        items[currentIndex].click();
        event.preventDefault(); // Prevent sending the message if modal is active
      }
    } else if (event.key === " ") {
      // Space key
      emojiModal.style.display = "none";
    }
  };

  /**
   * Activates mutation observers to detect when the chat container is added to the DOM.
   * Sets up event listeners for input and keydown events on the chat input field.
   * @param {Object} emojis - A dictionary of emoji names and their corresponding emoji characters.
   */
  const activateChatMutations = (emojis) => {
    const chatInput = document.querySelector(".chat-input");
    chatInput.addEventListener("input", (e) => {
      const input = e.target.value;
      if (input.includes(":")) {
        showEmojiSuggestions(input, emojis);
      } else {
        document.getElementById("emoji-modal").style.display = "none";
      }
    });
    chatInput.addEventListener("keydown", handleArrowNavigation);
  };

  /**
   * Fetches the emoji data from a remote JSON file.
   * @returns {Promise<Object[]>} A promise that resolves to an array of emoji objects.
   * @throws Will throw an error if the network request fails.
   */
  const fetchEmojis = async () => {
    try {
      const emojiUrl =
        "https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json";
      const response = await fetch(emojiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching emojis:", error);
    }
  };

  /**
   * Parses the emoji data to create a dictionary of emoji names and their corresponding characters.
   * @param {Object[]} emojis - An array of emoji objects.
   * @returns {Object} A dictionary with emoji names as keys and emoji characters as values.
   */
  const parseEmojis = (emojis) => {
    return emojis.reduce((acc, emojiObj) => {
      const name = emojiObj.aliases ? emojiObj.aliases[0] : undefined;
      if (name) {
        acc[name] = emojiObj.emoji;
      }
      return acc;
    }, {});
  };

  /**
   * Fetches emojis and saves them to local storage if not already present.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  const fetchAndSaveEmojis = async () => {
    if (!window.localStorage.getItem("chatHelperEmojis")) {
      const emojis = await fetchEmojis();
      const parsedEmojis = parseEmojis(emojis);
      window.localStorage.setItem(
        "chatHelperEmojis",
        JSON.stringify(parsedEmojis)
      );
    }
  };

  // Observer for chat container mutations
  const targetNode = document.querySelector("body");

  const bodyObserver = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === "childList") {
        handleMutations(mutation);
      }
    });
  });

  const handleMutations = (mutation) => {
    handleNodes(mutation.addedNodes, handleChatContainerAdded, "added");
    handleNodes(mutation.removedNodes, handleChatContainerRemoved, "removed");
  };

  const handleNodes = (nodes, handler, action) => {
    nodes.forEach((node) => {
      if (isChatContainer(node)) {
        handler(node);
      }
    });
  };

  const isChatContainer = (node) =>
    node instanceof HTMLElement && node.classList.contains("chat-container");

  const handleChatContainerAdded = (container) => {
    if (!container.classList.contains("emoji-modal-added")) {
      injectEmojiModal(container);
      const emojis = getStoredEmojis();
      activateChatMutations(emojis);
    }
  };

  const handleChatContainerRemoved = () => {
    const emojis = getStoredEmojis();
    activateChatMutations(emojis);
  };

  const getStoredEmojis = () =>
    JSON.parse(window.localStorage.getItem("chatHelperEmojis"));

  const config = { childList: true, subtree: true };
  bodyObserver.observe(targetNode, config);

  fetchAndSaveEmojis();
})();
