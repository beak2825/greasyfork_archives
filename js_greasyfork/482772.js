// ==UserScript==
// @name         TORN: Easier Bookie Options
// @namespace    dekleinekobini.easierbookieoptions
// @version      1.0.0
// @author       DeKleineKobini [2114440]
// @description  Make it easier to navigate bookie options.
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/page.php?sid=bookie*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/482772/TORN%3A%20Easier%20Bookie%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/482772/TORN%3A%20Easier%20Bookie%20Options.meta.js
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const t=document.createElement("style");t.textContent=o,document.head.append(t)})(" .ebo-bets .bets-wrap:not(.ebo-selected){display:none}.ebo-bets [class*=extraOddsActivator___]{float:none}.ebo-bets [class*=extraOddsActivator___][class*=active___]{display:none}.autocomplete{position:relative;display:inline-flex;width:100%}.autocomplete input{border:1px solid transparent;background-color:#f1f1f1;padding:10px;font-size:16px}.autocomplete input[type=text]{background-color:#f1f1f1;width:100%!important}.autocomplete input[type=submit]{background-color:#1e90ff;color:#fff}.autocomplete .autocomplete-items{position:absolute;border:1px solid #d4d4d4;border-bottom:none;border-top:none;z-index:99;top:100%;left:0;right:0}.autocomplete .autocomplete-items div{padding:10px;cursor:pointer;background-color:#fff;border-bottom:1px solid #d4d4d4}.autocomplete .autocomplete-items div:hover{background-color:#e9e9e9}.autocomplete .autocomplete-items .autocomplete-active{background-color:#1e90ff!important;color:#fff} ");

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  class Autocomplete {
    constructor(placeholder, possibilities) {
      __publicField(this, "autocomplete", document.createElement("div"));
      __publicField(this, "id", Math.round(Math.random() * 1e3).toString());
      __publicField(this, "input", document.createElement("input"));
      __publicField(this, "currentFocus", -1);
      __publicField(this, "possibilities");
      __publicField(this, "callback");
      this.initializeElements(placeholder);
      this.possibilities = possibilities;
    }
    initializeElements(placeholder) {
      this.input.id = this.id;
      this.input.type = "text";
      this.input.placeholder = placeholder;
      this.autocomplete.classList.add("autocomplete");
      this.autocomplete.appendChild(this.input);
      this.input.addEventListener("input", () => this.onlyShowFilteredValues());
      this.input.addEventListener("click", () => this.onlyShowFilteredValues());
      this.input.addEventListener("keydown", (event) => {
        const list = document.getElementById(`${this.id}-autocomplete-list`);
        if (!list)
          return;
        const items = Array.from(list.getElementsByTagName("div"));
        if (event.code === "ArrowDown") {
          this.currentFocus += 1;
          this.selectActive(items);
        } else if (event.code === "ArrowUp") {
          this.currentFocus -= 1;
          this.selectActive(items);
        } else if (event.code === "Enter" || event.code === "NumpadEnter") {
          event.preventDefault();
          if (this.currentFocus > -1) {
            items[this.currentFocus].click();
          }
        }
      });
    }
    onlyShowFilteredValues() {
      this.closeAllLists();
      this.currentFocus = -1;
      const wrapper = document.createElement("DIV");
      wrapper.setAttribute("id", `${this.id}-autocomplete-list`);
      wrapper.setAttribute("class", "autocomplete-items");
      wrapper.dataset.eboFor = this.id;
      this.autocomplete.appendChild(wrapper);
      const inputValue = this.input.value;
      if (inputValue) {
        this.possibilities.filter((value) => value.substring(0, inputValue.length).toUpperCase() === inputValue.toUpperCase()).forEach((value) => {
          const option = document.createElement("DIV");
          option.innerHTML = `<strong>${value.substring(0, inputValue.length)}</strong>`;
          option.innerHTML += value.substring(inputValue.length);
          option.innerHTML += `<input type='hidden' value='${value}'>`;
          option.addEventListener("click", () => {
            this.input.value = option.getElementsByTagName("input")[0].value;
            this.emitValue();
            this.closeAllLists();
          });
          wrapper.appendChild(option);
        });
      } else {
        this.possibilities.forEach((value) => {
          const option = document.createElement("DIV");
          option.innerHTML = value;
          option.innerHTML += `<input type='hidden' value='${value}'>`;
          option.addEventListener("click", () => {
            this.input.value = option.getElementsByTagName("input")[0].value;
            this.emitValue();
            this.closeAllLists();
          });
          wrapper.appendChild(option);
        });
      }
    }
    emitValue() {
      if (!this.callback)
        return;
      this.callback(this.input.value);
    }
    selectActive(items) {
      this.removeActive(items);
      if (this.currentFocus >= items.length)
        this.currentFocus = 0;
      if (this.currentFocus < 0)
        this.currentFocus = items.length - 1;
      items[this.currentFocus].classList.add("autocomplete-active");
    }
    // eslint-disable-next-line class-methods-use-this
    removeActive(items) {
      items.forEach((item) => item.classList.remove("autocomplete-active"));
    }
    closeAllLists(clickedElement = void 0) {
      if (clickedElement === this.input) {
        return;
      }
      Array.from(document.querySelectorAll(".autocomplete-items")).filter((item) => item !== clickedElement).forEach((item) => {
        var _a;
        return (_a = item.parentNode) == null ? void 0 : _a.removeChild(item);
      });
    }
    updatePossibilities(possibilities) {
      this.possibilities = possibilities;
      this.callback = void 0;
      this.closeAllLists();
      this.clearInput();
    }
    clearInput() {
      this.currentFocus = -1;
      this.input.value = "";
    }
  }
  document.addEventListener("click", (event) => {
    var _a;
    const target = event.target;
    const targetList = (_a = target == null ? void 0 : target.parentElement) == null ? void 0 : _a.querySelector(":scope > .autocomplete-items");
    Array.from(document.querySelectorAll(".autocomplete-items")).filter((item) => item !== targetList).forEach((item) => item.remove());
  });
  const MARKET_TIME_CLASS = "marketTime___";
  function findByPartialClass(className, parentNode = document, subselector = "") {
    return parentNode.querySelector(`[class*='${className}']${subselector}`);
  }
  function optionComparator(a, b) {
    if (a.bets.length === 2 && b.bets.length === 2) {
      const aDelta = Math.abs(a.bets[0].odds - a.bets[1].odds);
      const bDelta = Math.abs(b.bets[0].odds - b.bets[1].odds);
      if (aDelta > bDelta)
        return 1;
      if (aDelta < bDelta)
        return -1;
      return indexComparator(a.index, b.index);
    }
    if (a.bets.length === 2)
      return -1;
    if (b.bets.length === 2)
      return 1;
    return indexComparator(a.index, b.index);
  }
  function indexComparator(a, b) {
    if (a > b)
      return 1;
    if (a < b)
      return -1;
    return 0;
  }
  function onBetOptions(callback) {
    onGamesWrapper((wrap) => {
      new MutationObserver((mutations) => {
        const isOpenBet = mutations.filter((mut) => mut.target instanceof HTMLElement && mut.target.classList.contains("info-wrap")).some((mut) => Array.from(mut.addedNodes).find((added) => added instanceof HTMLElement && added.classList.contains("bets-wrap")));
        const isExtendedBet = mutations.filter((mut) => mut.target instanceof HTMLElement && mut.target.classList.contains("bets-wrap")).some((mut) => Array.from(mut.addedNodes).find((added) => added instanceof HTMLElement && added.classList.contains("bets-wrap")));
        if (!isOpenBet && !isExtendedBet)
          return;
        callback();
      }).observe(wrap, { childList: true, subtree: true });
    });
  }
  function onGamesWrapper(callback) {
    const gamesWrapper = document.querySelector(".games-tabs-wrap");
    if (gamesWrapper) {
      callback(gamesWrapper);
      return;
    }
    const reactRoot = document.getElementById("react-root");
    simpleMODetection(reactRoot, ".games-tabs-wrap", callback);
  }
  function simpleMODetection(parent, selector, callback) {
    new MutationObserver((_, observer) => {
      const element = parent.querySelector(selector);
      if (!element)
        return;
      callback(element);
      observer.disconnect();
    }).observe(parent, { subtree: true, childList: true });
  }
  window.autocompletes = {};
  onBetOptions(() => onListOpen());
  function onListOpen() {
    var _a;
    const infoWrap = document.querySelector(".info-wrap[style='display: block;']");
    if (!infoWrap)
      return;
    infoWrap.classList.add("ebo-modified");
    const betsWrap = infoWrap.querySelector(":scope > .bets-wrap");
    if (!betsWrap)
      return;
    betsWrap.classList.add("ebo-bets");
    if (!betsWrap.querySelector(".ebo-selected")) {
      (_a = betsWrap.querySelector(".bets-wrap")) == null ? void 0 : _a.classList.add("ebo-selected");
    }
    const title = infoWrap.parentElement.querySelector(".matchName [title]").textContent;
    new MutationObserver(() => updateDropdown(betsWrap, title)).observe(betsWrap, { childList: true });
    updateDropdown(betsWrap, title);
  }
  function updateDropdown(betsWrap, title) {
    let autocomplete;
    if (title in window.autocompletes) {
      autocomplete = window.autocompletes[title];
      if (!autocomplete.autocomplete.checkVisibility()) {
        betsWrap.insertAdjacentElement("afterbegin", autocomplete.autocomplete);
      }
    } else {
      autocomplete = new Autocomplete("Betting Option", []);
      window.autocompletes[title] = autocomplete;
      betsWrap.insertAdjacentElement("afterbegin", autocomplete.autocomplete);
    }
    const allOptions = Array.from(betsWrap.querySelectorAll(".bets-wrap"));
    const allOptionsInformation = allOptions.map(extractInformation).sort((a, b) => optionComparator(a, b));
    const allOptionsNames = allOptionsInformation.map((data) => data.name);
    autocomplete.updatePossibilities(allOptionsNames);
    autocomplete.callback = (name) => {
      Array.from(betsWrap.querySelectorAll(".ebo-selected")).forEach((option) => option.classList.remove("ebo-selected"));
      const selectedInformation = allOptionsInformation.find((data) => data.name === name);
      if (selectedInformation === void 0)
        return;
      const selectOption = allOptions[selectedInformation.index];
      selectOption.classList.add("ebo-selected");
      autocomplete.clearInput();
    };
  }
  function extractInformation(option, index) {
    const bets = Array.from(option.querySelectorAll(".bets .bet:not(.market-name-cell)")).map((bet) => {
      const oddsNodes = Array.from(bet.querySelector(".odds:not(.fractional)").childNodes);
      const textOdds = oddsNodes[oddsNodes.length - 1].textContent;
      return {
        odds: parseFloat(textOdds)
      };
    });
    return {
      name: findByPartialClass(MARKET_TIME_CLASS, option, " .bold").textContent,
      bets,
      index
    };
  }

})();