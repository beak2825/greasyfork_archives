// ==UserScript==
// @name         CHUNITHM Song Search
// @version      1.1
// @description  Adds search bar in main page and song records page
// @author       Alanimdeo
// @match        https://chunithm-net-eng.com/mobile/home*
// @match        https://chunithm-net-eng.com/mobile/record/*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/1384234
// @downloadURL https://update.greasyfork.org/scripts/541846/CHUNITHM%20Song%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/541846/CHUNITHM%20Song%20Search.meta.js
// ==/UserScript==



(function () {
  "use strict";
  const d = document;
  const url = location.href;
  const queryRegex = /q=([^&]*)/;
  const difficulties = [
    ["BASIC", "Basic"],
    ["ADVANCED", "Advanced"],
    ["EXPERT", "Expert"],
    ["MASTER", "Master"],
    ["ULTIMA", "Ultima"],
    ["----------", "-"],
    ["WORLD'S END", "worldsEnd"],
    ["Course", "course"]
  ];

  function search(query, items, categories) {
    if (!items) return;
    if (!query || query === "") {
      items.forEach((item) => {
        item.style.display = "";
      });
      if (categories && categories.length > 0) {
        categories.forEach((category) => {
          category.style.display = "";
        });
      }
      return;
    }
    items.forEach((item) => {
      const selector = url.includes("worldsEndList")
        ? ".musiclist_worldsend_title"
        : ".music_title";
      const title = item.querySelector(selector).textContent;
      if (title.toLowerCase().includes(query.toLowerCase())) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
    if (categories && categories.length > 0) {
      categories.forEach((category) => {
        if (
          Array.from(category.querySelectorAll(".musiclist_box")).every(
            (item) => item.style.display === "none"
          )
        ) {
          category.style.display = "none";
        } else {
          category.style.display = "";
        }
      });
    }
  }

  function createHiddenInput(name, value) {
    const input = d.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;

    return input;
  }

  const searchBar = d.createElement("input");
  searchBar.type = "text";
  searchBar.id = "searchBar";
  searchBar.placeholder = `Search for a ${
    url.includes("courseList") ? "course" : "song"
  }`;
  searchBar.className = "w400 mb_10";
  function searchHome() {
    sessionStorage.setItem("q", encodeURIComponent(searchBar.value));

    const diff = d.getElementById("diff")?.value || "Master";
    if (diff === "worldsEnd" || diff === "course") {
      location.href = `https://chunithm-net-eng.com/mobile/record/${diff}List/`;
      return;
    }

    const form = d.createElement("form");
    const token = (d.cookie.split(";").find((e) => e.trim().startsWith("_t=")) || "").split("=")[1];
    if (token === "") {
      alert("Error occured while searching.");
      return;
    }
    form.action = "https://chunithm-net-eng.com/mobile/record/musicGenre/send" + diff;
    form.method = "post";
    form.acceptCharset = "utf-8";
    form.appendChild(createHiddenInput("genre", 99));
    form.appendChild(createHiddenInput("token", token));
    searchBar.appendChild(form);
    form.submit();
  }
  if (url.includes("/home")) {
    searchBar.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        searchHome();
      }
    });
    const cf = d.querySelector(".clearfix");
    cf?.insertAdjacentElement("afterend", searchBar);
    const div = d.createElement("div");
    div.style = "display: flex; gap: 1rem; justify-content: center; margin: 0 auto";
    div.className = "w400";
    const diff = d.createElement("select");
    diff.id = "diff";
    diff.style = "flex-grow: 1";
    for (const [name, value] of difficulties) {
      const option = d.createElement("option");
      option.value = value;
      option.innerHTML = name;
      if (value === "-") {
        option.disabled = true;
      } else if (value === "Master") {
        option.selected = true;
      }
      diff.appendChild(option);
    }
    div.appendChild(diff);
    const searchButton = d.createElement("button");
    searchButton.innerHTML = "Search";
    searchButton.style = "font-size: 1rem; padding: 5px";
    searchButton.addEventListener("click", () => searchHome());
    div.appendChild(searchButton);
    searchBar.insertAdjacentElement("afterend", div);
  } else if (
    url.includes("/record") &&
    !["playlog", "musicDetail", "courseDetail", "pointReward"].some((x) => url.includes(x)) &&
    !(url.endsWith("record") || url.endsWith("record/"))
  ) {
    const songs = d.querySelectorAll(".musiclist_box");
    const categories = d.querySelectorAll(".box05");
    searchBar.addEventListener("input", () => {
      search(searchBar.value, songs, categories);
    });
    const box = d.querySelectorAll(".box01");
    if (box.length === 1) {
      box[0].insertAdjacentElement("beforebegin", searchBar);
    } else if (box.length === 2) {
      box[1].insertAdjacentElement("beforebegin", searchBar);
    }
    const query = sessionStorage.getItem("q");
    if (query !== null) {
      searchBar.value = decodeURIComponent(query);
      search(searchBar.value, songs, categories);
      searchBar.scrollIntoView();
      sessionStorage.removeItem("q");
    }
  }
})();
