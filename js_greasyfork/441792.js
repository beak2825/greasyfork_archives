// ==UserScript==
// @name         CIDWWA
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  Code I don't want to write again
// @author       Gorbit99
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        none
// @license      MIT
// ==/UserScript==
"use strict";

const version = 6;

class Modal {
  #container;
  #itemContainer;
  #modal;

  #open = false;
  #onOpen = [];
  #onClose = [];

  #draggable;

  constructor(config) {
    this.#container = document.createElement("div");
    const dashboard = document.querySelector(".dashboard");
    if (dashboard) {
      dashboard.append(this.#container);
    } else {
      document.body.append(this.#container);
    }
    this.#container.style.position = "fixed";
    this.#container.style.inset = "0";
    this.#container.style.display = "none";
    if ((config.clickOutAction ?? "none") === "none") {
      this.#container.style.pointerEvents = "none";
    } else {
      this.#container.style.pointerEvents = "auto";
    }
    this.#container.style.zIndex = "9999";
    this.#container.style.background = config.tintBackground
      ? "#000a"
      : "transparent";

    this.#draggable = !config.preventDragging;

    const modalStyle = new Style();
    modalStyle.setStyle({
      ".cidwwa-modal": {
        background: "var(--color-menu,#f4f4f4)",
        border: "1px solid black",
        borderRadius: "5px",
        padding: "16px 12px 16px",
        pointerEvents: "auto",
        margin: "0",
        position: "absolute",
      },
    });

    const itemContainerStyle = new Style();
    itemContainerStyle.setStyle({
      ".modal-itemcontainer": {
        background: "var(--color-menu, white)",
        borderRadius: "5px",
        padding: "16px",
        display: "flex",
        justifyContent: "center",
        overflowX: config.overflowX ?? "initial",
        overflowY: config.overflowY ?? "initial",
        height: config.height ?? "initial",
        width: config.width ?? "initial",
      },
    });

    const modalTitleStyle = new Style();
    modalTitleStyle.setStyle({
      ".cidwwa-modal-title": {
        fontSize: "18px",
        fontFamily:
          "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontWeight: "300",
      },
    });

    const headerStyle = new Style();
    headerStyle.setStyle({
      ".cidwwa-header": {
        display: "flex",
        justifyContent: "space-between",
        userSelect: "none",
      },
    });

    const dragStyle = new Style();
    dragStyle.setStyle({
      ".cidwwa-drag": {
        position: "absolute",
        top: "0",
        left: "0",
        height: "48px",
        width: "calc(100% - 48px)",
      },
    });

    if (config.preventDragging) {
      modalStyle.addStyle({
        ".cidwwa-modal": {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        },
      });
    } else {
      dragStyle.addStyle({
        ".cidwwa-drag": {
          cursor: "move",
        },
      });
    }

    this.#container.innerHTML = `
      <section class="cidwwa-modal">
        <div class="cidwwa-header">
          <h3 style="margin: 0 0 10px 12px" class="cidwwa-modal-title">${
            config.title ?? ""
          }</h3>
          <i class="fa fa-times" style="font-size: 20px; cursor: pointer;"></i>
        </div>
        <div class="cidwwa-drag" style="${dragStyle}"></div>
        <div class="modal-itemcontainer">

        </div>
      </div>
    `;

    if (config.clickOutAction === "close") {
      this.#container.addEventListener("click", () => this.close());
    }

    this.#itemContainer = this.#container.querySelector(".modal-itemcontainer");
    this.#container
      .querySelector("i")
      .addEventListener("click", () => this.close());

    if (!config.preventDragging) {
      const drag = this.#container.querySelector(".cidwwa-drag");
      this.#modal = this.#container.querySelector(".cidwwa-modal");

      let startX;
      let startY;
      let isDragging = false;
      drag.addEventListener("mousedown", (e) => {
        if (e.button !== 0) {
          return;
        }
        startX = e.offsetX;
        startY = e.offsetY;
        isDragging = true;
      });

      window.addEventListener("mousemove", (e) => {
        if (!isDragging) {
          return;
        }
        e.preventDefault();
        const mousePosX = e.clientX;
        const mousePosY = e.clientY;

        let newPosX = mousePosX - startX;
        let newPosY = mousePosY - startY;

        const screenWidth = document.body.clientWidth;
        const screenHeight = document.body.clientHeight;

        newPosX = Math.min(
          Math.max(newPosX, 0),
          screenWidth - this.#modal.offsetWidth - 1,
        );
        newPosY = Math.min(
          Math.max(newPosY, 0),
          screenHeight - this.#modal.offsetHeight - 1,
        );

        this.#modal.style.left = `${newPosX}px`;
        this.#modal.style.top = `${newPosY}px`;
      });

      window.addEventListener("mouseup", (e) => {
        if (!isDragging) {
          return;
        }

        if (e.button !== 0) {
          return;
        }
        isDragging = false;
      });
    }

    this.#modal.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  toggle() {
    this.#open = !this.#open;
    this.#container.style.display = this.#open ? "block" : "none";

    if (this.#open) {
      this.#onOpen.forEach((callback) => callback());
      if (this.#draggable) {
        const screenWidth = document.body.clientWidth;
        const screenHeight = document.body.clientHeight;

        const modalWidth = this.#modal.offsetWidth;
        const modalHeight = this.#modal.offsetHeight;

        const newPosX = (screenWidth - modalWidth) / 2;
        const newPosY = (screenHeight - modalHeight) / 2;

        this.#modal.style.left = `${newPosX}px`;
        this.#modal.style.top = `${newPosY}px`;
      }
    } else {
      this.#onClose.forEach((callback) => callback());
    }
    return this.#open;
  }

  open() {
    if (this.#open) {
      return;
    }
    this.toggle();
  }

  close() {
    if (!this.#open) {
      return;
    }
    this.toggle();
  }

  onOpen(callback) {
    this.#onOpen.push(callback);
  }

  onClose(callback) {
    this.#onClose.push(callback);
  }

  setContent(content) {
    if (typeof content === "string") {
      this.#itemContainer.innerHTML = content;
    } else {
      this.#itemContainer.children.forEach((child) => child.remove());
      this.#itemContainer.append(content);
    }
  }

  resetScroll() {
    this.#itemContainer.scrollTo(0, 0);
  }
}

class WKButton {
  #container;
  #button;
  #dropdown;

  #onTurnOn = [];
  #onTurnOff = [];
  #state = false;

  constructor(config) {
    this.#container = document.createElement("li");
    this.#container.classList.add("sitemap__section");
    this.#container.innerHTML = `
        <button class="sitemap__section-header wk-custom-button">
            <span lang="ja">${config.japaneseText}</span>
            <span lang="en">${config.englishText}</span>
        </button>
    `;

    const addToSite = () => {
      const sitemap = document.querySelector("#sitemap,#sitmap");
      sitemap.insertBefore(this.#container, sitemap.firstChild);
    };

    addToSite();

    const observer = new MutationObserver(() => {
      if (!document.body.contains(this.#container)) {
        addToSite();
      }
    });
    observer.observe(document.body, {
      childList: true,
    });

    this.#button = this.#container.querySelector(".wk-custom-button");

    if (config.color) {
      this.#button.dataset.color = config.color;
      this.#button.style.setProperty("--focus-color", config.color);
    }
    if (config.hoverColor) {
      this.#button.dataset.hoverColor = config.hoverColor;
      this.#button.style.setProperty("--hover-color", config.hoverColor);
    }

    this.#button.addEventListener("click", () => {
      this.setState(!this.#state);
      if (this.#state) {
        this.#onTurnOn.forEach((callback) => callback());
      } else {
        this.#onTurnOff.forEach((callback) => callback());
      }
    });

    if (config.withDropdown) {
      this.attachDropdown(config.withDropdown);
    }
  }

  attachDropdown(config) {
    if (this.#dropdown) {
      throw "A dropdown is already attached!";
    }

    this.#dropdown = document.createElement("div");
    this.#dropdown.style.zIndex = 899;
    this.#dropdown.classList.add("sitemap__expandable-chunk");
    this.#dropdown.dataset.expanded = false;
    this.#container.append(this.#dropdown);

    this.#dropdown.style.setProperty("--dropdown-background", config.bgColor);

    let clickIn = false;
    document.addEventListener("click", () => {
      if (!clickIn && this.#state) {
        this.setState(false);
        this.#onTurnOff.forEach((callback) => callback());
      }
      clickIn = false;
    });

    this.#dropdown.addEventListener("click", () => {
      clickIn = true;
    });

    this.#button.addEventListener("click", () => {
      clickIn = true;
    });
  }

  setDropdownContent(content) {
    if (typeof content === "string") {
      this.#dropdown.innerHTML = content;
    } else {
      this.#dropdown.children.forEach((child) => child.remove());
      this.#dropdown.append(content);
    }
  }

  attachSubtext() {
    let subtext = this.#button.parentNode.querySelector(".button-subtext");
    if (subtext) {
      return subtext;
    }

    const subtextContainerStyle = `
      width: 100%;
      display: inline-flex;
      justify-content: center;
      position: absolute;
      margin-top: 4px;
    `;

    const subtextStyle = `
      color: #999;
      font-size: 14px;
      line-height: 0;
    `;

    this.#button.insertAdjacentHTML(
      "afterend",
      `
      <span class="button-subtext-container" style="${subtextContainerStyle}">
        <span class="button-subtext" style="${subtextStyle}"></span>
      </span>
    `,
    );

    subtext = this.#button.parentNode.querySelector(".button-subtext");
    return subtext;
  }

  onTurnOn(callback) {
    this.#onTurnOn.push(callback);
  }

  onTurnOff(callback) {
    this.#onTurnOff.push(callback);
  }

  setState(state) {
    this.#state = state;
    this.#button.dataset.expanded = state;
    if (this.#dropdown) {
      this.#dropdown.dataset.expanded = state;
    }
  }
}

class Style {
  #styleElement;

  constructor() {
    this.#styleElement = document.createElement("style");
    document.head.append(this.#styleElement);
  }

  setStyle(styleData) {
    this.#styleElement.innerHTML = "";

    this.addStyle(styleData);
  }

  addStyle(styleData) {
    const blocks = [];
    for (let key in styleData) {
      blocks.push(this.#parseStyleBlock(key, styleData[key]));
    }

    this.#styleElement.innerHTML += blocks.join("\n");
  }

  #parseStyleBlock(selector, styleBlock) {
    const properties = [];
    const blocks = [];
    for (let key in styleBlock) {
      if (typeof styleBlock[key] === "object") {
        let newSelector = key;
        if (newSelector.includes("&")) {
          newSelector = newSelector.replaceAll("&", selector);
        } else {
          newSelector = selector + " " + newSelector;
        }
        blocks.push(this.#parseStyleBlock(newSelector, styleBlock[key]));
      } else {
        let property = key.replaceAll(
          /[A-Z]/g,
          (match) => "-" + match.toLowerCase(),
        );
        properties.push(property + ":" + styleBlock[key]);
      }
    }

    blocks.unshift(`${selector}{${properties.join(";")}}`);

    return blocks.join("\n");
  }
}

if (!window.cidwwaVersion || window.cidwwaVersion < version) {
  window.cidwwaVersion = version;

  window.createModal = function (config) {
    return new Modal(config);
  };

  window.createButton = function (config) {
    return new WKButton(config);
  };

  window.createStyle = function (config) {
    return new Style(config);
  };

  const styleElement = document.createElement("style");
  document.head.append(styleElement);
  styleElement.innerHTML = `
    .wk-custom-button[data-color][data-expanded="true"],
    .wk-custom-button[data-color]:focus {
      color: var(--focus-color);
      border-color: var(--focus-color);
    }

    .wk-custom-button[data-hover-color]:not([data-expanded="true"]):not(:focus):hover {
      color: var(--focus-color);
      border-color: var(--hover-color);
    }

    .wk-custom-button + .sitemap__expandable-chunk,
    .wk-custom-button + .sitemap__expandable-chunk:before {
      background-color: var(--color-menu, var(--dropdown-background));
    }
  `;
}