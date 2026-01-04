// ==UserScript==
// @name Equip-Bid Keyboard Nav
// @namespace https://github.com/bricemciver/GreasemonekeyScripts
// @description Use Feedly-style navigation on Equip Bid auctions
// @license MIT
// @version 0.2
// @match https://www.equip-bid.com/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=equip-bid.com
// @grant GM_xmlhttpRequest
// @grant GM.xmlHttpRequest
// @connect equip-bid.com
// @downloadURL https://update.greasyfork.org/scripts/468327/Equip-Bid%20Keyboard%20Nav.user.js
// @updateURL https://update.greasyfork.org/scripts/468327/Equip-Bid%20Keyboard%20Nav.meta.js
// ==/UserScript==



/* jshint esversion: 6 */
"use strict";
(() => {
  // src/main/equip-bid-keyboard-navigation/equip-bid-keyboard-navigation.user.ts
  (() => {
    const indexAction = (action) => {
      if (index === 0 && prevLink && action === "minus") {
        prevLink.click();
      } else if (index > lots.length - 2 && nextLink && action === "plus") {
        nextLink.click();
      } else if (action === "plus") {
        lots[index].classList.toggle("selected_lot", false);
        index++;
        lots[index].classList.toggle("selected_lot", true);
        lots[index].scrollIntoView({
          block: "center"
        });
      } else if (action === "minus") {
        lots[index].classList.toggle("selected_lot", false);
        index--;
        lots[index].classList.toggle("selected_lot", true);
        lots[index].scrollIntoView({
          block: "center"
        });
      }
    };
    const addToWatchList = () => {
      const watchlistButton = lots[index].querySelector("a.item-watch-up");
      if (watchlistButton) {
        watchlistButton.click();
      }
    };
    const openInNewTab = () => {
      const url = lots[index].getAttribute("data-url");
      if (url) {
        window.open(url, "_blank");
      }
    };
    const showHelp = () => {
      var _a;
      (_a = document.querySelector("dialog.ShortcutsHelp")) == null ? void 0 : _a.showModal();
    };
    const hideHelp = () => {
      var _a;
      (_a = document.querySelector("dialog.ShortcutsHelp")) == null ? void 0 : _a.close();
    };
    const createHelp = () => {
      const helpDiv = document.createElement("dialog");
      helpDiv.classList.add("ShortcutsHelp");
      const hintDiv = document.createElement("div");
      hintDiv.classList.add("ShortcutsHelp__hint");
      hintDiv.insertAdjacentText("afterbegin", "ESC to close");
      const title = document.createElement("div");
      title.classList.add("ShortcutsHelp__title");
      title.insertAdjacentText("afterbegin", "Keyboard Shortcuts Help");
      helpDiv.appendChild(hintDiv);
      helpDiv.appendChild(title);
      helpTopics.forEach((topic) => {
        const section = document.createElement("div");
        section.classList.add("ShortcutsHelp__section");
        const sectionTitle = document.createElement("div");
        sectionTitle.classList.add("ShortcutsHelp__section-title");
        sectionTitle.insertAdjacentText("afterbegin", topic.section);
        section.appendChild(sectionTitle);
        helpDiv.appendChild(section);
        topic.items.forEach((item) => {
          const itemDiv = document.createElement("div");
          const itemKey = document.createElement("span");
          itemKey.classList.add("ShortcutsHelp__shortcut");
          itemKey.insertAdjacentText("afterbegin", item.key);
          const itemValue = document.createTextNode(item.description);
          itemDiv.appendChild(itemKey);
          itemDiv.appendChild(itemValue);
          section.appendChild(itemDiv);
        });
      });
      return helpDiv;
    };
    const initScript = () => {
      const head = document.getElementsByTagName("head")[0];
      const style = document.createElement("style");
      style.setAttribute("type", "text/css");
      head.appendChild(style);
      if (style.sheet) {
        style.sheet.insertRule(`.ShortcutsHelp {
        animation: shortcuts-help-fade-in .25s ease-in-out;
        background-color: #111;
        border-radius: .25rem;
        color: #fff;
        font-size: 1.25rem;
        left: 50%;
        line-height: 17px;
        padding: 20px;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 350px;
        z-index: 99999
    }`);
        style.sheet.insertRule(`.ShortcutsHelp__title {
      border-bottom: 1px solid #444;
      color: #999;
      font-weight: 700;
      margin-bottom: 9px;
      padding-bottom: 9px
  }`);
        style.sheet.insertRule(`.ShortcutsHelp__hint {
    color: #999;
    float: right;
}`);
        style.sheet.insertRule(`.ShortcutsHelp__section {
    margin-bottom: 17px;
    margin-top: 0
}`);
        style.sheet.insertRule(`.ShortcutsHelp__section-title {
    color: #999;
    margin-bottom: 8px;
    margin-top: 9px
}`);
        style.sheet.insertRule(`.ShortcutsHelp__shortcut {
    color: #2bb24c;
    display: inline-block;
    padding-right: 6px;
    width: 55px
}`);
        style.sheet.insertRule(`@keyframes shortcuts-help-fade-in {
    from {
        opacity: 0
    }

    to {
        opacity: 1
    }
}`);
        style.sheet.insertRule(`@keyframes shortcuts-help-fade-out {
    from {
        opacity: 1
    }

    to {
        opacity: 0
    }
}`);
        style.sheet.insertRule(`.lot {
    margin-bottom: 34px;
    min-height: 136px;
    padding: 33px;
    color: #333;
    border: 1px solid rgba(0,0,0,.05);
    border-radius: 3px;
    position: relative;
    z-index: 2
}`);
        style.sheet.insertRule(`.selected_lot {
      outline: 5px auto -webkit-focus-ring-color;
      outline-offset: -2px
}`);
      }
      const helpDiv = createHelp();
      document.body.appendChild(helpDiv);
      if (lotList) {
        makeLotItemsIntoCards(lotList);
      }
    };
    const makeLotItemsIntoCards = (lotList2) => {
      let newNode = null;
      const children = Array.from(lotList2.children);
      for (let i = 4; i < children.length; i++) {
        const row1 = children[i - 4];
        const row2 = children[i - 3];
        const row3 = children[i - 2];
        const row4 = children[i - 1];
        const row5 = children[i];
        if (row1.classList.contains("row") && row2.classList.contains("row") && row3.classList.contains("row") && row4.classList.contains("hidden-md") && row5.classList.contains("hidden-xs")) {
          newNode = document.createElement("div");
          newNode.classList.add("lot");
          children.splice(i - 4, 5, newNode);
          newNode.append(row1, row2, row3);
          i = i - 4;
        }
      }
      lotList2.replaceChildren(...children);
      lots = Array.from(document.querySelectorAll("div.lot"));
    };
    const lotList = document.querySelector("div.lot-list");
    let lots = [];
    const prevLink = document.querySelector("li.previous a");
    const nextLink = document.querySelector("li.next a");
    const helpTopics = [
      { section: "", items: [{ key: "?", description: "Keyboard shortcuts" }] },
      {
        section: "Auction items",
        items: [
          { key: "j", description: "Scroll to next auction item" },
          { key: "k", description: "Scroll to previous auction item" }
        ]
      },
      {
        section: "Selected item",
        items: [
          { key: "w", description: "Add item to watchlist" },
          { key: "v", description: "Open item in a new tab" }
        ]
      }
    ];
    let index = 0;
    window.addEventListener("keydown", (event) => {
      if (event.code === "KeyJ") {
        indexAction("plus");
      }
      if (event.code === "KeyK") {
        indexAction("minus");
      }
      if (event.code === "KeyW") {
        addToWatchList();
      }
      if (event.code === "KeyV") {
        openInNewTab();
      }
      if (event.code === "Slash" && event.shiftKey) {
        showHelp();
      }
      if (event.code === "Escape") {
        hideHelp();
      }
    });
    initScript();
  })();
})();
//# sourceMappingURL=equip-bid-keyboard-navigation.user.js.map
