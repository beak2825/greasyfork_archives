// ==UserScript==
// @name         ChatGPT - Pin Conversation
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @author       Light Yagmi
// @description  Pin ChatGPT conversions for quick access.
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520379/ChatGPT%20-%20Pin%20Conversation.user.js
// @updateURL https://update.greasyfork.org/scripts/520379/ChatGPT%20-%20Pin%20Conversation.meta.js
// ==/UserScript==

(function() {
    'use strict';
     console.log('Temper monky is running');
    // Your code here...
    const intervelID = setInterval(() => {
        const targetElement = document.querySelector('.flex.flex-col.gap-2.text-token-text-primary.text-sm.false.mt-5.pb-2 div');
        if (targetElement) {
            new ChatHistoryUI();
            console.log("Pins injected");
            clearInterval(intervelID);
        }
    }, 100);

    setTimeout(() => clearInterval(intervelID), 500 * 100);

})();

class DocumentManager {
  constructor() {
    if (new.target === DocumentManager) {
      throw new Error("Cannot instantiate an abstract class");
    }
  }
  selector(selector) {
    return document.querySelector(selector);
  }

  createElement(tagName) {
    return document.createElement(tagName);
  }

  cloneElement(element) {
    return element.cloneNode(true);
  }

  createAndAppendPinButtonStyles() {
    const styleElement = this.createElement("style");
    styleElement.innerHTML = `
      .pin-button-tooltip {
        display: none;
        position: absolute;
        background: #212121;
        box-shadow: #212121 -1rem 0 1.5rem;
        right: 1.7rem;
        padding: 0.3rem;
        z-index: 1000;
      }
      .active {
        background-color: #34d3990f !important;
      }
      .active div[title] {
        color: #34d399 !important;
        font-weight: 500;
      }
      .unpin-button-tooltip {
        padding: 0.3rem;
        background: #212121;
        box-shadow: #212121 -1rem 0 1.5rem;
      }
      .unpin-button-tooltip .unpin-icon,
      .pin-button-tooltip .pin-icon {
        width: 15px;
        aspect-ratio: 1;
        cursor: pointer;
      }

      .unpin-button-tooltip:hover .unpin-icon,
      .unpin-button-tooltip:hover .unpin-icon * {
        fill: red;
      }
      .pin-button-tooltip:hover .unpin-icon,
      .pin-button-tooltip:hover .pin-icon * {
        fill: #34d399;
      }

      .unpin-icon,
      .unpin-icon * {
        fill: #ffffff;
      }
      .pin-icon,
      .pin-icon * {
        fill: #ffffff;
      }

      li[data-testid^="history"] > div:has(:hover) .pin-button-tooltip {
        display: block;
      }

      li[data-testid^="history"] a:not([href]) {
        cursor: pointer;
      }
    `;
    document.head.appendChild(styleElement);
  }
}

class ChatHistoryStorage {
  constructor() {
    this.pinnedConversations = this.loadPinnedConversations();
  }

  loadPinnedConversations() {
    return JSON.parse(localStorage.getItem("pinnedConversations")) ?? {};
  }

  savePinnedConversations() {
    localStorage.setItem("pinnedConversations", JSON.stringify(this.pinnedConversations));
  }

  pinConversation(conversationId, title) {
    if ((!conversationId || !title) && this.isConversationPinned(conversationId)) return false;
    this.pinnedConversations[conversationId] = title;
    this.savePinnedConversations();
    return true;
  }

  updatedPinnedConversation(conversationId, title) {
    if ((!conversationId || !title) && !this.isConversationPinned(conversationId)) return false;
    this.pinnedConversations[conversationId] = title;
    this.savePinnedConversations();
    return true;
  }

  unpinConversation(conversationId) {
    if (!conversationId || !this.isConversationPinned(conversationId)) {
      return false;
    }
    delete this.pinnedConversations[conversationId];
    this.savePinnedConversations();
    return true;
  }

  getPinnedConversations() {
    return this.pinnedConversations;
  }

  isConversationPinned(conversationId) {
    return conversationId in this.pinnedConversations;
  }
}

class URLTracker {
  constructor(pattern) {
    this.pattern = pattern;
    this.onChangeCallback = null;
    this.init();
  }

  // Initialize the event listeners for URL changes
  init() {
    const originalPushState = history.pushState;

    history.pushState = function (state, title, url) {
      originalPushState.apply(history, arguments);
      const event = new CustomEvent("conversationChanged", { detail: { url } });
      window.dispatchEvent(event);
    };

    window.addEventListener("conversationChanged", ({ detail }) => {
      this.checkUrlChange(detail.url);
    });
  }

  setupOnChangeCallback(callback) {
    this.onChangeCallback = callback;
  }

  checkUrlChange(url) {
    if (this.pattern.test(url)) {
      if (this.onChangeCallback) {
        this.onChangeCallback(url); // Call the provided callback
      }
    }
  }
}

class ChatHistoryUI extends DocumentManager {
  constructor() {
    super();
    this.storageManager = new ChatHistoryStorage();
    this.chatContainer = this.selector(".flex-col.flex-1.transition-opacity.duration-500.relative.-mr-2.pr-2.overflow-y-auto");
    this.sectionContainer = null;
    this.initialize();
  }

  initialize() {
    this.templateHistoryItem = this.cloneElement(this.getTemplateHistoryItem());
    this.setupEventListeners();
    this.setUpURLTracker();
    this.createAndAppendPinButtonStyles();
    this.createPinnedSection();
    this.loadPinnedConversations();
    this.setUpTitleChangeObserver();
  }

  setupEventListeners() {
    this.chatContainer.addEventListener("mouseover", this.handleConversationHover);
    window.addEventListener("pinConversation", this.handlePinConversation);
    window.addEventListener("unpinConversation", this.handleUnpinConversation);
  }

  setUpTitleChangeObserver() {
    const observer = new MutationObserver(this.handleTitleChange);
    const config = {
        attributes: true,
        attributeFilter: ['title'],
        subtree: true,
    };
    observer.observe(this.chatContainer, config);
  }

  handleTitleChange = (mutationsList) => {
    for(const mutation of mutationsList) {
      if (mutation.type === 'attributes') {

        const title = mutation.target.attributes.title.value;
        const conversationId = mutation.target.getAttribute('data-id');

        if (title && conversationId) {
          this.storageManager.updatedPinnedConversation(conversationId, title);
          this.updatePinnedConversation(conversationId, title);
        }
      }
    }
  }

  getRawHistoryItems() {
    return this.chatContainer.querySelectorAll("li[data-testid^='history']");
  }

  updatePinnedConversation(conversationId, title) {
    if(!conversationId || !title) return;
    this.sectionContainer.querySelector(`div[data-id="${conversationId}"]`).textContent = title;
  }

  getTemplateHistoryItem() {
    const historyItems = this.getRawHistoryItems();
    return historyItems.length > 1 ? historyItems[1] : historyItems[0];
  }

  createPinnedSection() {
    const sidebarPanel = this.chatContainer.querySelector(".flex.flex-col.gap-2.text-token-text-primary.text-sm.false.mt-5.pb-2");
    if (!sidebarPanel) return;

    const pinnedSectionHTML = `
      <div class="relative mt-5 first:mt-0 last:mb-5">
        <div class="sticky bg-token-sidebar-surface-primary top-0 z-20">
          <span class="flex h-9 items-center">
            <h3 class="px-2 text-xs font-semibold text-ellipsis overflow-hidden break-all pt-3 pb-2 text-token-text-primary">
              Pinned Conversations
            </h3>
          </span>
        </div>
        <ol id="pinned-conversations-list"></ol>
      </div>
    `;

    const sectionContainer = this.createElement("div");
    sectionContainer.setAttribute("id", "pinned-conversations-section");
    sectionContainer.innerHTML = pinnedSectionHTML;
    sidebarPanel.firstElementChild.prepend(sectionContainer);
    this.sectionContainer = sectionContainer;
  }

  handlePinConversation = ({ detail }) => {
    if (this.storageManager.pinConversation(detail.conversationId, detail.title)) {
      this.addPinnedConversationToUI(detail);
      if (this.getURL() === detail.conversationId) {
        this.conversationChanged(detail.conversationId);
      }
    }
  };
  handleUnpinConversation = ({ detail }) => {
    if (this.storageManager.unpinConversation(detail.conversationId)) {
      this.removePinnedConversationFromUI(detail.conversationId);
      if (this.getURL() === detail.conversationId) {
        this.conversationChanged(detail.conversationId);
      }
    }
  };

  removePinnedConversationFromUI(conversationId) {
    const pinnedList = this.chatContainer.querySelector("#pinned-conversations-list");
    const conversationItem = pinnedList.querySelector(`li:has(a[chatLink="${conversationId}"])`);
    if (conversationItem) {
      conversationItem.remove();
    }
  }

  addPinnedConversationToUI({ title, conversationId, isActiveConversation }) {
    const pinnedList = this.chatContainer.querySelector("#pinned-conversations-list");
    const conversationItem = this.cloneElement(this.templateHistoryItem);
    const conversationLink = conversationItem.querySelector("a");
    const conversationText = conversationLink.querySelector("div[title]");
    if (isActiveConversation) {
      conversationItem.firstChild.classList.add("active");
    }
    conversationText.setAttribute("title", title);
    conversationText.setAttribute("data-id", conversationId);
    conversationText.innerHTML = title;

    conversationLink.removeAttribute("href");
    conversationLink.setAttribute("chatLink", conversationId);
    conversationLink.setAttribute("data-processed", true);
    conversationLink.setAttribute("data-discover", true);
    conversationLink.addEventListener("click", this.handleNavigation);

    conversationItem.querySelector("span[data-state='closed']").replaceWith(this.createUnpinButton({ title, conversationId }));

    pinnedList.appendChild(conversationItem);
  }

  handleConversationHover = ({ target }) => {
    if (!this.isValidConversationTarget(target)) return;

    const conversationId = target.getAttribute("href");
    const conversationTitle = target?.firstElementChild?.textContent;

    if (!conversationId || !conversationTitle) return;

    target.setAttribute("data-processed", true);
    target.querySelector("div[title]")?.setAttribute("data-id", conversationId);
    this.addPinButtonToConversation(target, {
      conversationId,
      conversationTitle,
    });
  };

  isValidConversationTarget(target) {
    return target && target.getAttribute("data-discover") && !target.getAttribute("data-processed");
  }

  getURL() {
    let currentUrl = window.location.href.split("/c/")[1];
    if (currentUrl) {
      currentUrl = "/c/" + currentUrl;
      return currentUrl;
    }
    return "";
  }

  addPinButtonToConversation(target, data) {
    const pinButton = this.createPinButton(data);
    target.appendChild(pinButton);
  }

  createPinButton(data) {
    const buttonContainer = this.createElement("div");
    buttonContainer.classList.add("pin-button-tooltip");
    buttonContainer.setAttribute("data-conversation-id", data.conversationId);
    buttonContainer.setAttribute("data-conversation-title", data.conversationTitle);
    buttonContainer.addEventListener("click", this.handlePinButtonClick);
    buttonContainer.innerHTML = this.getPinIconSVG();
    return buttonContainer;
  }

  createUnpinButton(data) {
    const buttonContainer = this.createElement("div");
    buttonContainer.classList.add("unpin-button-tooltip");
    buttonContainer.setAttribute("data-conversation-id", data.conversationId);
    buttonContainer.setAttribute("data-conversation-title", data.conversationTitle);
    buttonContainer.addEventListener("click", this.handleUnpinButtonClick);
    buttonContainer.innerHTML = this.getUnpinIconSVG();
    return buttonContainer;
  }

  getPinIconSVG() {
    // return <button>PIN</button>
    return `<svg class="pin-icon" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.192"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M17.1218 1.87023C15.7573 0.505682 13.4779 0.76575 12.4558 2.40261L9.61062 6.95916C9.61033 6.95965 9.60913 6.96167 9.6038 6.96549C9.59728 6.97016 9.58336 6.97822 9.56001 6.9848C9.50899 6.99916 9.44234 6.99805 9.38281 6.97599C8.41173 6.61599 6.74483 6.22052 5.01389 6.87251C4.08132 7.22378 3.61596 8.03222 3.56525 8.85243C3.51687 9.63502 3.83293 10.4395 4.41425 11.0208L7.94975 14.5563L1.26973 21.2363C0.879206 21.6269 0.879206 22.26 1.26973 22.6506C1.66025 23.0411 2.29342 23.0411 2.68394 22.6506L9.36397 15.9705L12.8995 19.5061C13.4808 20.0874 14.2853 20.4035 15.0679 20.3551C15.8881 20.3044 16.6966 19.839 17.0478 18.9065C17.6998 17.1755 17.3043 15.5086 16.9444 14.5375C16.9223 14.478 16.9212 14.4114 16.9355 14.3603C16.9421 14.337 16.9502 14.3231 16.9549 14.3165C16.9587 14.3112 16.9606 14.31 16.9611 14.3098L21.5177 11.4645C23.1546 10.4424 23.4147 8.16307 22.0501 6.79853L17.1218 1.87023ZM14.1523 3.46191C14.493 2.91629 15.2528 2.8296 15.7076 3.28445L20.6359 8.21274C21.0907 8.66759 21.0041 9.42737 20.4584 9.76806L15.9019 12.6133C14.9572 13.2032 14.7469 14.3637 15.0691 15.2327C15.3549 16.0037 15.5829 17.1217 15.1762 18.2015C15.1484 18.2752 15.1175 18.3018 15.0985 18.3149C15.0743 18.3316 15.0266 18.3538 14.9445 18.3589C14.767 18.3699 14.5135 18.2916 14.3137 18.0919L5.82846 9.6066C5.62872 9.40686 5.55046 9.15333 5.56144 8.97583C5.56651 8.8937 5.58877 8.84605 5.60548 8.82181C5.61855 8.80285 5.64516 8.7719 5.71886 8.74414C6.79869 8.33741 7.91661 8.56545 8.68762 8.85128C9.55668 9.17345 10.7171 8.96318 11.3071 8.01845L14.1523 3.46191Z" fill=""></path> </g></svg>`;
  }

  getUnpinIconSVG() {
    return `<svg class="unpin-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17.1218 1.87023C15.7573 0.505682 13.4779 0.76575 12.4558 2.40261L9.75191 6.73289L11.1969 8.17793C11.2355 8.1273 11.2723 8.07415 11.3071 8.01845L14.1523 3.46191C14.493 2.91629 15.2528 2.8296 15.7076 3.28445L20.6359 8.21274C21.0907 8.66759 21.0041 9.42737 20.4584 9.76806L15.9019 12.6133C15.8462 12.6481 15.793 12.6848 15.7424 12.7234L17.1874 14.1684L21.5177 11.4645C23.1546 10.4424 23.4147 8.16307 22.0501 6.79852L17.1218 1.87023Z"></path> <path d="M3.56525 8.85242C3.6015 8.26612 3.84962 7.68582 4.32883 7.27422L5.77735 8.72274C5.75784 8.72967 5.73835 8.7368 5.71886 8.74414C5.64516 8.7719 5.61855 8.80285 5.60548 8.82181C5.58877 8.84604 5.56651 8.8937 5.56144 8.97583C5.55046 9.15333 5.62872 9.40686 5.82846 9.6066L14.3137 18.0919C14.5135 18.2916 14.767 18.3699 14.9445 18.3589C15.0266 18.3538 15.0743 18.3316 15.0985 18.3149C15.1175 18.3018 15.1484 18.2752 15.1762 18.2015C15.1835 18.182 15.1907 18.1625 15.1976 18.143L16.6461 19.5915C16.2345 20.0707 15.6542 20.3188 15.0679 20.3551C14.2853 20.4035 13.4808 20.0874 12.8995 19.5061L9.36397 15.9705L2.68394 22.6506C2.29342 23.0411 1.66025 23.0411 1.26973 22.6506C0.879206 22.26 0.879206 21.6269 1.26973 21.2363L7.94975 14.5563L4.41425 11.0208C3.83293 10.4395 3.51687 9.63502 3.56525 8.85242Z" fill="#ffffff"></path> <path d="M2.00789 2.00786C1.61736 2.39838 1.61736 3.03155 2.00789 3.42207L20.5862 22.0004C20.9767 22.3909 21.6099 22.3909 22.0004 22.0004C22.391 21.6099 22.391 20.9767 22.0004 20.5862L3.4221 2.00786C3.03158 1.61733 2.39841 1.61733 2.00789 2.00786Z" fill="#ffffff"></path> </g></svg>`;
  }

  loadPinnedConversations() {
    const pinnedConversations = this.storageManager.getPinnedConversations();
    Object.entries(pinnedConversations).forEach(([conversationId, title]) => {
      let isActiveConversation = false;
      if (this.getURL() === conversationId) isActiveConversation = true;
      this.addPinnedConversationToUI({
        title,
        conversationId,
        isActiveConversation,
      });
    });
  }

  handlePinButtonClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const conversationId = e.currentTarget.getAttribute("data-conversation-id");
    const title = e.currentTarget.getAttribute("data-conversation-title");

    if (!conversationId || !title) return;

    const event = new CustomEvent("pinConversation", {
      detail: { conversationId, title },
    });
    window.dispatchEvent(event);
  };

  handleUnpinButtonClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const conversationId = e.currentTarget.getAttribute("data-conversation-id");
    const title = e.currentTarget.getAttribute("data-conversation-title");

    if (!conversationId || !title) return;

    const event = new CustomEvent("unpinConversation", {
      detail: { conversationId, title },
    });
    window.dispatchEvent(event);
  };

  conversationChanged(url) {
    const addCLass = (url) => {
      const a = this.selector(`#pinned-conversations-list a[href="${url}"]`) ?? this.selector(`#pinned-conversations-list a[chatLink="${url}"]`);
      if (a) a.parentNode.classList.add("active");
    };
    const removeClass = (url) => {
      const a = this.selector(`#pinned-conversations-list a[href="${url}"]`) ?? this.selector(`#pinned-conversations-list a[chatLink="${url}"]`);
      if (a) a.parentNode.classList.remove("active");
    };

    document.querySelectorAll("#pinned-conversations-list .active").forEach((el) => el.classList.remove("active"));
    if (this.storageManager.isConversationPinned(url)) {
      addCLass(url);
    }
  }

  setUpURLTracker() {
    const urlPattern = /^\/c\/[a-f0-9-]+$/;
    const tracker = new URLTracker(urlPattern);
    tracker.setupOnChangeCallback((url) => {
      this.conversationChanged(url);
    });
  }

  handleNavigation = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const conversationLink = e.target.closest("a");
    const conversationId = conversationLink.attributes.chatLink.value;

    const allConversationLinks = this.chatContainer.querySelectorAll("a[href]");
    const originalConversation = Array.from(allConversationLinks).find((link) => link.getAttribute("href") === conversationId);

    if (originalConversation) {
      originalConversation.click();
    } else {
      const conversationLink = document.createElement("a");
      conversationLink.setAttribute("href", conversationId);
      conversationLink.click();
    }
  };
}

