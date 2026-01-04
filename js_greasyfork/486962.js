// ==UserScript==
// @name         A better search
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  Completely strips the original search engine and replaces it with a more fleshed out version where you can use filters and see more info.
// @author       Lemson
// @match        https://www.geoguessr.com/search
// @match        https://www.geoguessr.com/
// @icon         https://www.clipartmax.com/png/full/15-150759_search-icon-search-icon-png-blue.png
// @grant        GM_addStyle
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1151668
// @license MIT
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/486962/A%20better%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/486962/A%20better%20search.meta.js
// ==/UserScript==
// Removes the old search, and keeps it gone, hopefully this doesnt fuck anything else up :D
const observer = new MutationObserver(() => {
  setTimeout(() => {
    document.querySelectorAll('[class*="search_center__"]').forEach((element) => {
      if (element.parentNode) element.parentNode.remove();
    });
  }, 200);
});
observer.observe(document.documentElement, { childList: true, subtree: true });

if (window.location.href === "https://www.geoguessr.com/") {
  function newStartPageCSS() {
    const inputCSS = `
.quicksearch-input{
    background-color: rgba(0,0,0,0);
    border: none;
    padding-left: 1.3rem;
    color: white;
}
    `;
    GM_addStyle(inputCSS);

    const searchButtonCSS = `
  .slanted-button-container{
      display: inline-block;
      scale: .95;
      transition: .2s;
  }
  .slanted-button-container:hover{
      transition: .2s;
  }
  .slanted-wrapper-root{
      position: relative;
      z-index: 0;
  }
  .slanted-wrapper_variantGrayTransparent{
  }
  .slanted-wrapper-start{
      left: 0;
  }
  .slanted-wrapper-right{
      bottom: 0;
      overflow: hidden;
      position: absolute;
      top: 0;
      width: 50%;
      z-index: -1;
  }
  .slanted-wrapper-right:before{
      transform-origin: bottom;
      border-radius: 0.25rem 0 0 0.25rem;
      transform: skewX(-12deg);
      left: 0;
      padding-right: .0625rem;
      width: 100%;
      background: var(--ds-color-black-40);
      bottom: 0;
      content: "";
      position: absolute;
      top: 0;
      z-index: -1;
  }
  .slanted-button_root{
      --skew-angle: -10deg;
      --content-skew-angle: 0;
      --variant-background-color: var(--ds-color-black-20);
      --border-radius: 0.25rem;
      --content-color: var(--ds-color-white);
      --content-padding: 0.6rem 1rem;
  }
  .slanted-button_button{
      background: none;
      border: initial;
      cursor: pointer;
      margin: 0;
      min-height: 3rem;
      padding: 0;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
  }
  .slanted-button_content{
      color: var(--content-color);
      padding: var(--content-padding);
  }
  .slanted-button_contentSizeLarge{
      --content-padding: 0.6rem 1rem;
  }
  .search-button-root{
      background-color: transparent;
      border: unset;
      cursor: pointer;
      display: flex;
      flex: 0 0 3rem;
      justify-content: center;
      position: relative;
      z-index: 1;
  }
  .slanted-wrapper-end{
      left: 50%;
  }
  .slanted-wrapper_right{
      bottom: 0;
      overflow: hidden;
      position: absolute;
      top: 0;
      width: 50%;
      z-index: -1;
  }
  .slanted-wrapper_right:before{
      transform-origin: top;
      border-radius: 0 0.25rem 0.25rem 0;
      transform: skewX(-12deg);
      padding-left: .0625rem;
      right: 0;
      width: 100%;
      background: var(--ds-color-black-40);
      bottom: 0;
      content: "";
      position: absolute;
      top: 0;
      z-index: -1;
  }
  `;
    GM_addStyle(searchButtonCSS);
  }

  const createNewSearchButton = () => {
    const baseHTML = `
        <div class="slanted-button-container">
          <div class="slanted-wrapper-root slanted-wrapper_variantGrayTransparent">
            <div class="slanted-wrapper-start slanted-wrapper-right"></div>
            <button class="slanted-button_root slanted-button_button">
              <div class="slanted-button_content slanted-button_contentSizeLarge">
                <img src="https://svgur.com/i/142d.svg" alt="Search Icon">
              </div>
            </button>
            <div class="slanted-wrapper-end slanted-wrapper_right"></div>
          </div>
        </div>
    `;

    const header = document.querySelector('div[class^="header_context__"]');
    const diver = document.createElement("div");
    diver.innerHTML = baseHTML;
    header.insertBefore(diver, document.querySelector(".slanted-button_container__6JmyZ"));
    return diver;
  };

  const openSearch = () => {
    if (!searchOpen) {
      const input = document.createElement("div");
      input.innerHTML = `
        <input placeholder="Search for maps..." type="text" class="quicksearch-input">
        `;
      document.querySelector(".slanted-button_root").append(input);
      searchOpen = true;
    }
  };

  const createEventListeners = () => {
    searchButton.addEventListener("click", openSearch);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && document.activeElement == document.querySelector(".quicksearch-input")) {
        const input = document.querySelector(".quicksearch-input");
        localStorage.setItem("searchTerm", input.value);
        window.location.href = "https://www.geoguessr.com/search";
      }
    });
  };

  let searchOpen = false;

  const searchButton = createNewSearchButton();
  newStartPageCSS();
  createEventListeners();
}

//Search page \/
if (window.location.href === "https://www.geoguessr.com/search") {
  function newSearchPageCSS() {
    const CSS = `
    .main-search-div{
      height: 100%;
    }
    .search-page-main{
        width: 100vw;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    .input-main-container{
        width: 100vw;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .search-container{
        width: 40%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .search-input{
        width: 100%;
        background-color: rgb(255 255 255 / 5%);
        border: 1px solid black;
        border-radius: 10rem;
        color: white;
        font-size: 1.2rem;
        padding-left: 1.5rem;
    }
    .search-results{
    }
    .search-item{
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 1rem;
      margin-top: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(0,0,0,0.5);
      transition: .2s;
    }
    .search-item:hover{
      transition: .2s;
      scale: 1.01;
    }
    .author-map-name{
      width: 20rem;
    }
    .map-name{
      font-size:1.5rem;
    }
    .map-avatar{
      width: 4rem;
      border-radius: .5rem;
    }
    .stat-view{
      width: 5rem;
      margin-right: 4rem;
      display:flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: .2rem;
    }

    .dropdown{
      width: 40%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .filter-btn {
      color: white;
      font-size: 1rem;
      border: none;
      cursor: pointer;
    }
    .filter-window{
      width:  100%;
      display: flex;
      justify-content: space-around;
    }

    .filter-category-container{
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 1rem;
      margin-bottom: .5rem;
    }
    .min-input{
      background-color: rgba(0,0,0,0.1);
      border: 1px solid #6b6b6b;
      border-radius: .7rem;
      color: white;
      width: 8rem;
      margin-top: .1rem;
    }
    .hide{
      display: none;
    }

    .official-toggle-buttons>*{
      color: white;
      border: 1px solid white;
      padding: 1rem;
      padding-top: .4rem;
      padding-bottom: .4rem;
    }
    .selectionmode-toggle-buttons>*{
      color: white;
      border: 1px solid white;
      padding: 1rem;
      padding-top: .4rem;
      padding-bottom: .4rem;
    }
    .active-button{
      background-color: #563b9a;
    }
    .apply-button{
      width: 5rem;
      height: 2.5rem;
      background-color: transparent;
      margin-top: 10%;
      color: white;
      border: 1px solid white;
      border-radius: 2rem;
      margin-left: 35%;
    }
    .apply-button:active{
      transition: .05s;
      background-color: rgba(255,255,255,0.2);
    }
    `;
    GM_addStyle(CSS);
  }
  const createNewSearchbar = () => {
    const searchHTML = `
    <div class="search-page-main">
      <div class="search-container">
          <input class="search-input" type="text" placeholder="Search for maps or players...">
      </div>

      <div class="dropdown">
        <button class="filter-btn">Filters</button>

        <div class="filter-window">
          <div>
            <div class="filter-category-container">
              <p>Minimum likes</p>
              <input id="min-likes" class="min-input" type="number" value=${localStorage.getItem("minLikes")}>
            </div>
            <div class="filter-category-container">
              <p>Minimum locations</p>
              <input id="min-locs" class="min-input" type="number" value=${localStorage.getItem("minLocs")}>
            </div>
            <div class="filter-category-container">
              <p>Minimum games played</p>
              <input id="min-games-played" class="min-input" type="number" value=${localStorage.getItem(
                "minGamesPlayed"
              )}>
            </div>
            <div class="filter-category-container">
              <p>Minimum average score</p>
              <input id="min-avg-score" class="min-input" type="number" value=${localStorage.getItem("minAvgScore")}>
            </div>

          </div>
          <div>
            <div class="filter-category-container">
              <p>Official</p>
              <div class="official-toggle-buttons">
                <button id="official">Yes</button>
                <button id="both" class="active-button">All</button>
                <button id="unofficial">No</button>
              </div>
            </div>
            <div class="filter-category-container">
              <p>Selection mode</p>
              <div class="selectionmode-toggle-buttons">
                <button id="handpicked">Handpicked</button>
                <button id="both" class="active-button">All</button>
                <button id="polygonal">Polygonal</button>
              </div>
            </div>

          <button class="apply-button">Apply</button>


          </div>
        </div>
      </div>
    </div>
    `;
    const mainDiv = document.querySelector("main");
    const dave = document.createElement("div");
    dave.classList.add("main-search-div");
    dave.innerHTML = searchHTML;
    mainDiv.append(dave);
  };

  const createResultsFromSearch = async () => {
    const results = await getResults(localStorage.getItem("searchTerm"));
    const existingResultsContainer = document.querySelector(".search-results");
    if (existingResultsContainer) {
      existingResultsContainer.remove();
    }
    const div = document.createElement("div");
    div.innerHTML = "";
    div.classList.add("search-results");
    document.querySelector(".search-page-main").append(div);
    console.log(results);
    results.forEach((a) => {
      const html = `
        <img class="map-avatar" src="https://avatar.map-making.app/${a.id}">
        <div class="author-map-name">
          <a href="/maps/${a.id}" target="_" class="map-name">${a.name}</a>
          <p class="creator-name">Created by: <a href="/user/${a.creatorId}">${a.creator}</a></p>
        </div>
        <div class="stat-view likes">
          <img style="width: 1.5rem;" src="_next/static/media/like-32.1321332a.svg" title="Likes">
          ${a.likes}
        </div>
        <div class="stat-view locs">
          <img style="width: 1.5rem;" src="_next/static/media/location-32.73fdcf3f.svg" title="Number of locations">
          ${a.coordinateCount}
        </div>
        <div class="stat-view games">
          <img style="width: 1.5rem;" src="_next/static/media/people-32.6e1cc43b.svg" title="Games played">
          ${a.numberOfGamesPlayed}
        </div>
        <div class="stat-view avgScore">
        <img style="width: 2rem;" src="https://i.imgur.com/uRdcYBM.png" title="Average score">
        ${a.averageScore}
        </div>
        <div class="stat-view howitwascreated">
        ${a.locationSelectionMode === 1 ? "Handpicked" : a.locationSelectionMode === 2 ? "Polygonal" : "Official"}
        </div>
      `;
      const resultContainer = document.createElement("div");
      resultContainer.classList.add("search-item");
      resultContainer.innerHTML = html;
      div.append(resultContainer);
    });
  };

  async function getResults(word) {
    let mapSearch = await fetch(`https://www.geoguessr.com/api/v3/search/map?page=0&count=50&q=${word}`);
    if (!mapSearch) {
      console.log("bad response");
    }
    let data = await mapSearch.json();

    let moreData = await getAdditionalData(data);
    const combinedData = [];
    const minLength = Math.min(data.length, moreData.length);
    for (let i = 0; i < minLength; i++) {
      combinedData.push({ ...moreData[i], ...data[i] });
    }

    let filteredData = await applyFilters(combinedData);

    return filteredData;
  }

  const getAdditionalData = async (data) => {
    const promises = data.map((map) => fetch(`https://www.geoguessr.com/api/maps/${map.id}`));
    const responses = await Promise.all(promises);
    const extraMapData = await Promise.all(
      responses.map(async (resp) => {
        try {
          return await resp.json();
        } catch (error) {
          console.error(
            "Something went wrong when looking at the map data:",
            error,
            "(You can most likely ignore this message)"
          );
          return null;
        }
      })
    );

    return extraMapData.filter((data) => data !== null);
  };

  const openFilters = () => {
    console.log("open filters");
  };

  function applyFilters(data) {
    let filteredData = data;
    const minLikes = document.getElementById("min-likes").value;
    const minLocs = document.getElementById("min-locs").value;
    const minGamesPlayed = document.getElementById("min-games-played").value;
    const minAvgScore = document.getElementById("min-avg-score").value;

    //Filter min likes
    filteredData = filteredData.filter((item) => {
      return item.likes >= minLikes;
    });
    //Filter min locs
    filteredData = filteredData.filter((item) => {
      return item.coordinateCount >= minLocs;
    });
    //Filter min games played
    filteredData = filteredData.filter((item) => {
      return item.numberOfGamesPlayed >= minGamesPlayed;
    });
    //Filter min likes
    filteredData = filteredData.filter((item) => {
      return item.averageScore >= minAvgScore;
    });

    //Filter official or not
    switch (localStorage.getItem("officialSetting")) {
      case "unofficial":
        filteredData = filteredData.filter((item) => item.isUserMap);
        break;
      case "official":
        filteredData = filteredData.filter((item) => !item.isUserMap);
        break;
    }

    //Filter selectionMode
    switch (localStorage.getItem("selectionSetting")) {
      case "handpicked":
        filteredData = filteredData.filter((item) => item.locationSelectionMode == 1);
        break;
      case "polygonal":
        filteredData = filteredData.filter((item) => !item.isUserMap == 0);
        break;
    }

    //Save the selected filters
    localStorage.setItem("minLikes", minLikes);
    localStorage.setItem("minLocs", minLocs);
    localStorage.setItem("minGamesPlayed", minGamesPlayed);
    localStorage.setItem("minAvgScore", minAvgScore);

    return filteredData;
  }

  createResultsFromSearch();
  newSearchPageCSS();
  createNewSearchbar();

  document.querySelector(".search-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      localStorage.setItem("searchTerm", document.querySelector(".search-input").value);
      createResultsFromSearch(localStorage.getItem("searchTerm"));
    }
  });

  const officalSelectionBtns = document.querySelectorAll(".official-toggle-buttons > button");
  officalSelectionBtns.forEach((button) => {
    button.addEventListener("click", () => {
      officalSelectionBtns.forEach((a) => {
        a.classList.remove("active-button");
      });
      button.classList.add("active-button");
      let officialSetting = button.id.toString();
      localStorage.setItem("officialSetting", officialSetting);
    });
  });
  const selectionModeSelectionBtns = document.querySelectorAll(".selectionmode-toggle-buttons > button");
  selectionModeSelectionBtns.forEach((button) => {
    button.addEventListener("click", () => {
      selectionModeSelectionBtns.forEach((a) => {
        a.classList.remove("active-button");
      });
      button.classList.add("active-button");
      let selectionSetting = button.id.toString();
      localStorage.setItem("selectionSetting", selectionSetting);
    });
  });

  const applyFiltersBtn = document.querySelector(".apply-button");
  applyFiltersBtn.addEventListener("click", () => createResultsFromSearch(localStorage.getItem("searchTerm")));
}
