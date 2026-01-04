// ==UserScript==
// @name         Search Engine Switcher
// @namespace    binjie09Scripts
// @version      1
// @description  Add a select to switch between search engines
// @include      /^https?:\/\/(www\.)?(cn\.)?(baidu|google|bing)\.com/
// @connect      *
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/465135/Search%20Engine%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/465135/Search%20Engine%20Switcher.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Create an array with search engine information
  const engines = [
    { name: "Baidu", value: "https://www.baidu.com/s?wd=", icon: "https://www.baidu.com/favicon.ico" },
    { name: "Google", value: "https://www.google.com/search?q=", icon: "https://www.google.com/favicon.ico" },
    { name: "Bing", value: "https://www.bing.com/search?q=", icon: "https://www.bing.com/favicon.ico" }
  ];

  // Get the current search query
  const searchInput = document.querySelector("#kw, textarea[name='q'], input[name='q']");

  const originalQuery = searchInput.value;


  // Create the dropdown select element and options
  const select = document.createElement("select");
  engines.forEach(engine => {
    const option = document.createElement("option");
    option.value = engine.value + encodeURIComponent(originalQuery);
    option.innerHTML = engine.name;
    if (document.location.href.startsWith(engine.value.split("?")[0])) {
      option.selected = true;
    }
    select.appendChild(option);
  });


  // Save the current search engine name to local storage and update the button text when the select is changed
  select.addEventListener("change", function() {
    let selectedEngineName = "";
    engines.forEach(engine => {
      if (engine.value + encodeURIComponent(originalQuery) === select.value) {
        selectedEngineName = engine.name;
      }
    });
    localStorage.setItem("previousEngine", selectedEngineName);
    document.location.href = select.value;
  });

  // Style the select and button elements
  select.style.marginRight = "10px";


  // Append the select and button to the search bar element
  let searchBar = document.querySelector("#form, #sb_form");

  //searchBar.appendChild(select);
  if (searchBar != null) {
      searchBar.appendChild(select);
  } else {
      searchBar = document.querySelector("button[aria-label='Search']");

      searchBar.insertAdjacentElement("afterend", select);

  }



})();
