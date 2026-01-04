// ==UserScript==
// @name         История изменений тайтла
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Просмотр истории действий с отдельным тайтлом.
// @author       grin3671
// @license      MIT
// @match        https://shikimori.one/*
// @match        https://shikimori.org/*
// @match        https://shikimori.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shikimori.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457959/%D0%98%D1%81%D1%82%D0%BE%D1%80%D0%B8%D1%8F%20%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B9%20%D1%82%D0%B0%D0%B9%D1%82%D0%BB%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/457959/%D0%98%D1%81%D1%82%D0%BE%D1%80%D0%B8%D1%8F%20%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B9%20%D1%82%D0%B0%D0%B9%D1%82%D0%BB%D0%B0.meta.js
// ==/UserScript==

(function() {
  "use strict";

  function checkPage () {
    let currentURL = location.pathname.substring(1).split("/");
    let isInPage = (node) => (node === document.body) ? false : document.body.contains(node);

    switch (currentURL[0]) {
      case "animes":
      case "mangas":
      case "ranobe":
        // remove old
        if (document.getElementById("btn-title-history")) document.getElementById("btn-title-history").remove();
        if (document.getElementById("modal-title-history")) document.getElementById("modal-title-history").remove();

        if (isInPage(document.querySelector(".b-db_entry .b-user_rate form")) && isTitleInUserList()) insertButton();
        break;
    }
  }

  // Adds Button to Title's Page
  function insertButton () {
    let parent = document.querySelector(".b-db_entry .b-user_rate").parentElement;
    let el = createElement("div", { "id": "btn-title-history", "class": "b-link_button mt-2 mb-2", "text": "История изменений" }, (e) => { e.onclick = () => { openModal() } });
    parent.append(el);
  }

  /**
   * Gets User Data
   * @property param (string) requested Property
   * @return (string) Property from User Data
   * @return (boolean) false if Property not found
   */
  const getUserData = (param) => param ? JSON.parse(document.body.getAttribute("data-user"))[param] || false : false;

  /**
   * Gets Title's ID
   * @return (string) Title ID
   * @return (boolean) false if Title ID can't be found
   */
  function getTitleID () {
    let el = document.querySelector(".b-db_entry .b-user_rate");
    if (!el) return false; // for checkPage function
    // data-entry="{"id":3649}"
    let data = JSON.parse(el.getAttribute("data-entry"));
    return data.id || false;
  }

  /**
   * Gets Title's type
   * @return (string) Title type for API (Anime || Manga)
   * @return (boolean) false if Title type is undefined
   */
  function getTitleType () {
    let currentURL = location.pathname.substring(1).split("/");
    return (currentURL[0] === "animes") ? "Anime" : (currentURL[0] === "mangas" || currentURL[0] === "ranobe") ? "Manga" : false;
  }

  function isTitleInUserList () {
    let e = document.querySelector(".b-db_entry .b-user_rate form[action*='/api/v2/user_rates']");
    e = e ? e.getAttribute("data-method") : false;
    return e == "PATCH" ? true : false;
  }

  /**
   * Utility. Creates Element with custom properties
   * @property type (string) element type
   * @property data (object) custom properties (id, class, text, style)
   * @property callback (function) callback with element itself as func prop
   * @return element
   */
  function createElement (type, data, callback) {
    let e = document.createElement(type || "div");

    if (data && data.id) e.id = data.id;
    if (data && data.class) e.classList = data.class;
    if (data && data.text) e.textContent = data.text;
    if (data && data.style) e.setAttribute("style", data.style);

    if (typeof callback === "function") callback(e);

    return e;
  }

  /**
   * Creates Modal for Title's History
   * @return element
   */
  function createModal () {
    let modal = createElement("div", { "id": "modal-title-history", "class": "b-modal hidden" });
    let modal_inner = createElement("div", { "class": "inner", "style": "top: 0" });
    let modal_title = createElement("div", { "class": "subheadline m5", "text": "История изменений" });
    let modal_block = createElement("div", { "id": "title-history-block", "class": "use-scroll pt-2 pb-2 mb-4", "style": "min-height: 150px; max-height: 500px; overflow: hidden auto; resize: vertical;" });
    let modal_close = createElement("div", { "class": "b-button", "text": "Закрыть" }, (e) => { e.onclick = () => { closeModal() } });
    let modal_shade = createElement("div", { "class": "b-shade", "style": "display: block; z-index: 1000;" }, (e) => { e.onclick = () => { closeModal() } });
    modal_inner.append(modal_title, modal_block, modal_close);
    modal.append(modal_shade, modal_inner);

    insertHistory(modal_block);

    return modal;
  }

  function openModal () {
    let modal = document.getElementById("modal-title-history") || document.body.appendChild(createModal());
    modal.classList.remove("hidden");
  }

  function closeModal () {
    let modal = document.getElementById("modal-title-history") || document.body.appendChild(createModal());
    modal.classList.add("hidden");
  }

  /**
   * Fills block with History Data
   * @property block (element) Node where the History will be filled
   */
  function insertHistory (block) {
    // reset old data // TODO: check if old data even possible
    block.innerHTML = "";

    // get user & title data
    let user_id = getUserData("id");
    let title_id = getTitleID();
    let title_type = getTitleType();

    // if smth goes wrong insert error message
    if (!user_id || !title_id || !title_type) {
      block.append(createElement("div", { "class": "b-nothing_here d-flex justify-content-center p-4", "text": "Не удалось собрать данные. Попробуйте позже." }));
      return false;
    }

    // main part
    block.classList.add("b-ajax");
    getHistoryData(user_id, title_id, title_type) // test: getHistoryData(324961, 21, "Anime")
      .then((data) => {
        block.classList.remove("b-ajax");
        if (data.length == 0) {
          block.append(createElement("div", { "class": "b-nothing_here d-flex justify-content-center p-4", "text": "История изменений тайтла отсутствует." }));
        } else {
          let historyTbody;
          block.append(createElement("table", { "class": "b-table b-editable_grid block2" }, e => { historyTbody = e.appendChild(createElement("tbody")); }));
          fillHistoryBlocks(data).forEach(entry => historyTbody.append(entry));
        }
      })
  }

  /**
   * Gets JSON History in Promise
   * @property user_id (integer) User ID
   * @property title_id (integer) Title ID
   * @property title_type (string) Title Type ["Anime" || "Manga"]
   * @return historyData (array) JSON History data
   */
  async function getHistoryData (user_id, title_id, title_type) {
    const RPS = 5;
    let requestIndex = 0; // works as a "page" param in request
    let historyLength = 100;
    let historyData = [];

    while (historyLength >= 100) {
      if (requestIndex >= RPS) break; // too many requests
      requestIndex++;
      let response = await requestHistory(user_id, title_id, title_type, requestIndex);
      // TODO: check response status
      let data = await response.json();
      historyLength = data.length || 0;
      historyData = historyData.concat(data || []);
    }

    return historyData;
  }

  async function requestHistory (user_id, title_id, title_type, page) {
    return await fetch(location.origin + "/api/users/" + user_id + "/history?target_id=" + title_id + "&target_type=" + title_type + "&limit=100&page=" + page);
  }

  /**
   * Fills Table Row from API History
   * @property history (array) API formatted data
   * @return historyBlocks (array) Array with Nodes
   */
  function fillHistoryBlocks (history) {
    let historyBlocks = [];

    history.forEach((entry, index) => {
      let row = createElement("tr", { "class": "b_history-row" }, (e) => {
        e.append(
          createElement("td", { "text": (index + 1).toString() }, e => { e.style.width = "5%" }),
          createElement("td", null, e => { e.innerHTML = entry.description }),
          createElement("td", { "text": new Intl.DateTimeFormat([], { dateStyle: "long", timeStyle: "medium"}).format(Date.parse(entry.created_at)) }, e => { e.style.width = "35%" }),
          createElement("td", null, e => {
            e.style.width = "10%";
            e.append(
              createElement("a", null, e => {
                e.textContent = "Удалить";
                e.href = getUserData("url") + "/history/" + entry.id;
                e.dataset.confirm = "Это действие необратимо. Точно?";
                e.dataset.method = "delete";
                e.dataset.remote = true;
                window.$(e).on("ajax:success", (e) => e.currentTarget.parentNode.parentNode.remove() );
              })
            )
          })
        )
      });
      historyBlocks.push(row);
    });

    return historyBlocks;
  }

  checkPage();

  document.addEventListener("page:load", checkPage);
  document.addEventListener("turbolinks:load", checkPage);
})();
