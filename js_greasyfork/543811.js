// ==UserScript==
// @name         t3chat recent models
// @namespace    https://t3.chat/
// @version      2025-12-19
// @description  adds buttons for recently used models to the sidebar
// @author       arturmarc
// @match        https://t3.chat/*
// @icon         https://t3.chat/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543811/t3chat%20recent%20models.user.js
// @updateURL https://update.greasyfork.org/scripts/543811/t3chat%20recent%20models.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const NUM_RECENT_MODELS = 4;
  const $$ = document.querySelectorAll.bind(document);
  const $ = (selector) => {
    const el = document.querySelector(selector);
    if (!(el instanceof HTMLElement || el instanceof SVGElement)) {
      throw new Error(
        `[recent-models UserScript] Element not found for selector: ${selector}`
      );
    }
    return el;
  };
  const asElementOrSvgItems = (nodeList) => [...nodeList].filter(
    (el) => el instanceof HTMLElement || el instanceof SVGElement
  );
  const clickElement = (element, triggerNativeClick = false) => {
    if (!element) {
      console.warn(
        "[recent-models UserScript] Cannot click null/undefined element"
      );
      return false;
    }
    try {
      element.focus();
      const keyEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        bubbles: true,
        cancelable: true
      });
      element.dispatchEvent(keyEvent);
      if (triggerNativeClick) {
        element.click();
      }
      return true;
    } catch (error) {
      console.warn("[recent-models UserScript] Click failed:", error);
      return false;
    }
  };
  function assertExists(value, message) {
    if (value === null || value === void 0) {
      console.error(message);
      throw new Error(message);
    }
  }
  async function waitForElements(selector, timeoutMs = 500) {
    const els = await waitForSelectorAll(selector, timeoutMs);
    const res = [...els].filter(
      (el) => el instanceof HTMLElement
    );
    if (res.length === 0) {
      throw new Error(
        `[recent-models UserScript] No elements found for selector: ${selector}`
      );
    }
    return res;
  }
  function waitForSelectorAll(selector, timeoutMs = 500) {
    return new Promise((resolve, reject) => {
      const immediateResult = asElementOrSvgItems($$(selector));
      if (immediateResult.length > 0) {
        return resolve(immediateResult);
      }
      const observer = new MutationObserver(() => {
        const res = asElementOrSvgItems($$(selector));
        if (res.length > 0) {
          observer.disconnect();
          clearTimeout(timeout);
          resolve(res);
        }
      });
      const timeout = setTimeout(() => {
        observer.disconnect();
        reject(
          new Error(
            `[recent-models UserScript] Selector "${selector}" not found within ${timeoutMs}ms`
          )
        );
      }, timeoutMs);
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
  const waitForSelector = async (selector, timeoutMs = 500) => {
    const elements = await waitForSelectorAll(selector, timeoutMs);
    return elements[0];
  };
  const setRecentModels = (currentModelName) => {
    const recentModels = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "[]"
    );
    const newRecentModels = [
      currentModelName,
      ...recentModels.filter((model) => model !== currentModelName).slice(0, 8)
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecentModels));
  };
  const createModelButton = ({
    modelName,
    modelMenu,
    newChatButton
  }) => {
    const svg = modelSVGSs.get(modelName);
    if (!svg) {
      console.log(
        `[recent-models UserScript] skipping model: ${modelName} - svg not found`
      );
      return null;
    }
    const svgElement = svg.cloneNode(true);
    const button = document.createElement("button");
    button.className = newChatButton.className;
    newChatButton.parentElement?.classList.add("flex", "flex-col", "gap-2");
    button.appendChild(svgElement);
    button.appendChild(document.createTextNode(modelName));
    button.addEventListener("click", async () => {
      clickElement(newChatButton);
      if (!modelMenu?.isConnected) {
        modelMenu = (await waitForSelector("button[aria-haspopup] > svg.lucide-chevron-down")).parentElement;
      }
      clickElement(modelMenu);
      const findAndClickModelMenuItem = async (modelName2) => {
        const items = await waitForElements(
          "div[data-radix-menu-content] div[data-radix-collection-item]"
        );
        const foundItem = items.find(
          (item) => item.querySelector("span")?.textContent === modelName2
        );
        if (foundItem) {
          setRecentModels(modelName2);
          renderRecentModels();
          clickElement(foundItem);
        }
      };
      try {
        await findAndClickModelMenuItem(modelName);
      } catch (error) {
        const backToFavoritesButtonVisible = await waitForSelector(
          "button > svg.lucide-chevron-left"
        );
        if (backToFavoritesButtonVisible) {
          const buttonsInMenu = await waitForSelectorAll(
            "div[data-radix-menu-content] button"
          );
          const foundBackToFavoritesButton = [...buttonsInMenu].reverse().find(
            (button2) => button2.querySelector("span")?.textContent.includes(" Favorites")
          );
          if (foundBackToFavoritesButton) {
            clickElement(foundBackToFavoritesButton, true);
          }
        }
        findAndClickModelMenuItem(modelName);
      }
    });
    return button;
  };
  const STORAGE_KEY = "t3chatCustom:recentModels";
  const modelSVGSs = /* @__PURE__ */ new Map();
  const getAllModelSVGSs = (modelMenuItems) => {
    modelMenuItems.forEach((item) => {
      const svg = item.querySelector("svg");
      if (svg) {
        modelSVGSs.set(
          (item.querySelector("span")?.textContent || "").trim(),
          svg
        );
      }
    });
  };
  const renderRecentModels = async () => {
    let extraButtonsContainer = $$("[data-t3chat-custom-extra-buttons]")[0];
    const startingHtml = `
      <div data-sidebar="group-label" class="flex h-8 shrink-0 select-none items-center rounded-md text-xs font-medium outline-none ring-sidebar-ring transition-[margin,opa] duration-200 ease-snappy focus-visible:ring-2 [&amp;&gt;svg]:size-4 [&amp;&gt;svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 px-3.5 text-color-heading pt-4">
        <span>Recent models</span>
      </div>
    `;
    if (extraButtonsContainer) {
      extraButtonsContainer.innerHTML = startingHtml;
    }
    const links = await waitForElements("a[href='/']");
    const newChatButton = links.find(
      (link) => (link.textContent ?? "").trim().toLocaleLowerCase().includes("new chat")
    );
    if (!newChatButton) {
      console.log("[recent-models UserScript] new chat button not found");
      return;
    }
    const modelMenu = (await waitForSelector("button[aria-haspopup] > svg.lucide-chevron-down")).parentElement;
    assertExists(modelMenu, "modelMenu not found");
    let currentModelName = modelMenu.textContent;
    const storageItem = localStorage.getItem(STORAGE_KEY);
    let recentModels = [];
    if (!storageItem) {
      clickElement(modelMenu);
      const modelMenuItems = await waitForSelectorAll(
        "div[data-radix-menu-content] div[data-radix-collection-item]"
      );
      getAllModelSVGSs(modelMenuItems);
      const defaultRecentModels = [
        currentModelName || "",
        // take 5 items from the model menu items as default recent models
        ...[...modelMenuItems].map((item) => item.querySelector("span")?.textContent || "").filter((item) => item !== currentModelName).slice(0, 3)
      ];
      clickElement(modelMenu);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRecentModels));
      recentModels = defaultRecentModels;
    } else {
      recentModels = JSON.parse(storageItem);
    }
    if (!extraButtonsContainer) {
      const newExtraButtonsContainer = document.createElement("div");
      newExtraButtonsContainer.className = "flex flex-col gap-2";
      newExtraButtonsContainer.setAttribute(
        "data-t3chat-custom-extra-buttons",
        ""
      );
      newChatButton.parentElement?.insertAdjacentElement(
        "afterend",
        newExtraButtonsContainer
      );
      extraButtonsContainer = newExtraButtonsContainer;
      extraButtonsContainer.innerHTML = startingHtml;
    }
    const recentModelsToRender = recentModels.slice(0, NUM_RECENT_MODELS);
    if (!recentModelsToRender.every((model) => modelSVGSs.has(model))) {
      clickElement(modelMenu);
      try {
        const modelMenuItems = await waitForSelectorAll(
          "div[data-radix-menu-content] div[data-radix-collection-item]"
        );
        getAllModelSVGSs(modelMenuItems);
        clickElement(modelMenu);
      } catch (error) {
        console.log(
          "[recent-models UserScript] error getting model menu items",
          error
        );
      }
    }
    recentModelsToRender.forEach((model) => {
      if (!modelSVGSs.has(model)) {
        console.log(
          "[recent-models UserScript] skipping - model svg not found for model",
          model
        );
      }
    });
    recentModels.filter((model) => modelSVGSs.has(model)).slice(0, NUM_RECENT_MODELS).forEach((model) => {
      const button = createModelButton({
        modelName: model,
        modelMenu,
        newChatButton
      });
      if (button) {
        extraButtonsContainer.appendChild(button);
      }
    });
  };
  waitForSelector("button[aria-haspopup] > svg.lucide-chevron-down").then(
    async (dropdownSvg) => {
      const modelMenu = dropdownSvg.parentElement;
      assertExists(modelMenu, "modelMenu not found");
      renderRecentModels();
      let sidebarRendered = $$("div[data-sidebar]").length > 0;
      let extraButtonsContainerRendered = $$("[data-t3chat-custom-extra-buttons]").length > 0;
      let modelMenuRendered = true;
      const mutationObserver = new MutationObserver(
        (mutations) => {
          const sidebarRenderedAfterMutation = $$("div[data-sidebar]").length > 0;
          if (sidebarRenderedAfterMutation && !sidebarRendered) {
            renderRecentModels();
          }
          sidebarRendered = sidebarRenderedAfterMutation;
          const extraButtonsContainerRenderedAfterMutation = $$("[data-t3chat-custom-extra-buttons]").length > 0;
          if (!extraButtonsContainerRenderedAfterMutation && extraButtonsContainerRendered) {
            renderRecentModels();
          }
          extraButtonsContainerRendered = extraButtonsContainerRenderedAfterMutation;
          const allRemovedNodes = mutations.flatMap((mutation) => [
            ...mutation.removedNodes
          ]);
          const modelMenuRemoved = allRemovedNodes.some(
            (node) => node instanceof HTMLElement && node.querySelector(
              "button[aria-haspopup] > svg.lucide-chevron-down"
            )
          );
          if (modelMenuRemoved) {
            modelMenuObserver?.disconnect();
          }
          const modelMenuRenderedAfterMutation = $$("button[aria-haspopup] > svg.lucide-chevron-down").length > 0;
          if (!modelMenuRenderedAfterMutation && modelMenuRendered) {
            modelMenuObserver?.disconnect();
          }
          if (modelMenuRenderedAfterMutation && (!modelMenuRendered || modelMenuRemoved)) {
            observeModelMenu(
              $$("button[aria-haspopup] > svg.lucide-chevron-down")[0].parentElement
            );
          }
          modelMenuRendered = modelMenuRenderedAfterMutation;
        }
      );
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
      observeModelMenu(modelMenu);
    }
  );
  let modelMenuObserver = null;
  function observeModelMenu(modelMenu) {
    let currentModelName = (modelMenu.textContent ?? "").replace(
      /(\w)\(/g,
      "$1 ("
      // text before the bracket is missing a space
    );
    setRecentModels(currentModelName);
    modelMenuObserver = new MutationObserver(() => {
      if (modelMenu.textContent !== currentModelName) {
        currentModelName = (modelMenu.textContent ?? "").replace(
          /(\w)\(/g,
          "$1 ("
          // text before the bracket is missing a space
        );
        setRecentModels(currentModelName);
        renderRecentModels();
      }
    });
    modelMenuObserver.observe(modelMenu, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

})();
