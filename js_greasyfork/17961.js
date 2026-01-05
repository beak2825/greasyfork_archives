// ==UserScript==
// @name           MyAnimeList(MAL) - Search Filter
// @match          https://myanimelist.net/*
// @description    This script hides search results that you already have on your list
// @version        2.0.3
// @author         Cpt_mathix
// @namespace      https://greasyfork.org/users/16080
// @license        GPL-2.0-or-later; http://www.gnu.org/licenses/gpl-2.0.txt
// @run-at         document-end
// @grant          none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/17961/MyAnimeList%28MAL%29%20-%20Search%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/17961/MyAnimeList%28MAL%29%20-%20Search%20Filter.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

const version = "2.0.2";

const STATUS_NOTINMYLIST = 0;
const STATUS_INMYLIST = 10;
const STATUS_WATCHING = 1;
const STATUS_READING = 1;
const STATUS_COMPLETED = 2;
const STATUS_ONHOLD = 3;
const STATUS_DROPPED = 4;
const STATUS_PLANNED = 6;

const userName = window.MAL.USER_NAME;
if (!userName) return;

let initializing = true;
let animeList, mangaList;
let allItems,
    inMyListItems,
    notInMyListItems,
    watchingOrReadingItems,
    completedItems,
    onHoldItems,
    droppedItems,
    plannedItems;
let globalLoadFiltersFromLocalStorage;

init();

async function init() {
    const hasMyListFilter = initMyListFilter();

    animeList = await getUserList("anime");
    mangaList = await getUserList("manga");

    await initEditBoxes();

    if (!hasMyListFilter) return;

    allItems = document.querySelectorAll("a.Lightbox_AddEdit");
    inMyListItems = document.querySelectorAll("a.Lightbox_AddEdit:not(.button_add, notinmylist)");
    notInMyListItems = document.querySelectorAll("a.Lightbox_AddEdit.button_add, a.Lightbox_AddEdit.notinmylist");
    watchingOrReadingItems = document.querySelectorAll("a.Lightbox_AddEdit.watching, a.Lightbox_AddEdit.reading");
    completedItems = document.querySelectorAll("a.Lightbox_AddEdit.completed");
    onHoldItems = document.querySelectorAll("a.Lightbox_AddEdit.on-hold");
    droppedItems = document.querySelectorAll("a.Lightbox_AddEdit.dropped");
    plannedItems = document.querySelectorAll("a.Lightbox_AddEdit.plantowatch, a.Lightbox_AddEdit.plantoread");

    initializing = false;
    document.getElementById("mylist-filters").textContent = "My List";
    globalLoadFiltersFromLocalStorage?.();
}

async function initEditBoxes() {
    // Detect all edit boxes
    var editBoxes = document.querySelectorAll("a.button_edit");

    for (let editBox of editBoxes) {
        const match = editBox.href.match(/\/ownlist\/(anime|manga)\/(\d+)\//);
        if (!match) continue;
        const [, type, id] = match;

        // only change editboxes with the text "edit"
        // some edit boxes already have CW or Watching, we don't want to update these
        if (editBox.children.length === 0 || editBox.children[0].textContent !== "edit") {
            continue;
        }

        if (type === "anime") {
            const anime = await getAnimeFromList(id);
            switch (anime?.status) {
                case STATUS_WATCHING:
                    editBox.classList.add("watching");
                    editBox.children[0].textContent = "CW";
                    break;
                case STATUS_COMPLETED:
                    editBox.classList.add("completed");
                    editBox.children[0].textContent = "CMPL";
                    break;
                case STATUS_ONHOLD:
                    editBox.classList.add("on-hold");
                    editBox.children[0].textContent = "HOLD";
                    break;
                case STATUS_DROPPED:
                    editBox.classList.add("dropped");
                    editBox.children[0].textContent = "DROP";
                    break;
                case STATUS_PLANNED:
                    editBox.classList.add("plantowatch");
                    editBox.children[0].textContent = "PTW";
                    break;
            }
        }

        if (type === "manga") {
            const manga = await getMangaFromList(id);
            switch (manga?.status) {
                case STATUS_WATCHING:
                    editBox.classList.add("reading");
                    editBox.children[0].textContent = "CR";
                    break;
                case STATUS_COMPLETED:
                    editBox.classList.add("completed");
                    editBox.children[0].textContent = "CMPL";
                    break;
                case STATUS_ONHOLD:
                    editBox.classList.add("on-hold");
                    editBox.children[0].textContent = "HOLD";
                    break;
                case STATUS_DROPPED:
                    editBox.classList.add("dropped");
                    editBox.children[0].textContent = "DROP";
                    break;
                case STATUS_PLANNED:
                    editBox.classList.add("plantoread");
                    editBox.children[0].textContent = "PTR";
                    break;
            }
        }
    }
}

function initMyListFilter() {
    function filterFunction(filterType, filterDisabled, elementSelectorToApplyFilter) {
        if (filterType === 'all') {
            updateDisplayNone(allItems, filterDisabled, elementSelectorToApplyFilter);
        } else if (+filterType === STATUS_NOTINMYLIST) {
            updateDisplayNone(notInMyListItems, filterDisabled, elementSelectorToApplyFilter);
        } else if (+filterType === STATUS_WATCHING || filterType === STATUS_READING) {
            updateDisplayNone(watchingOrReadingItems, filterDisabled, elementSelectorToApplyFilter);
        } else if (+filterType === STATUS_COMPLETED) {
            updateDisplayNone(completedItems, filterDisabled, elementSelectorToApplyFilter);
        } else if (+filterType === STATUS_ONHOLD) {
            updateDisplayNone(onHoldItems, filterDisabled, elementSelectorToApplyFilter);
        } else if (+filterType === STATUS_DROPPED) {
            updateDisplayNone(droppedItems, filterDisabled, elementSelectorToApplyFilter);
        } else if (+filterType === STATUS_PLANNED) {
            updateDisplayNone(plannedItems, filterDisabled, elementSelectorToApplyFilter);
        }
    }

    function updateDisplayNone(elements, isVisible, elementSelectorToUpdate) {
        elements.forEach(element => {
            const closestElement = element.closest(elementSelectorToUpdate);
            if (isVisible) {
                closestElement.style.display = '';
            } else {
                closestElement.style.display = 'none';
            }
        });
    }

    function recFilterFunction(filterType, filterDisabled, elementSelectorToApplyFilter) {
        if (filterType === 'all') {
            updateDisplayNone(allItems, filterDisabled, elementSelectorToApplyFilter);
        } else if (+filterType === STATUS_INMYLIST) {
            updateRecDisplayNone('inmylist', inMyListItems, filterDisabled, elementSelectorToApplyFilter);
        } else if (+filterType === STATUS_NOTINMYLIST) {
            updateRecDisplayNone('notinmylist', notInMyListItems, filterDisabled, elementSelectorToApplyFilter);
        } else if (+filterType === STATUS_WATCHING || filterType === STATUS_READING) {
            updateDisplayNone(watchingOrReadingItems, filterDisabled, elementSelectorToApplyFilter);
        } else if (+filterType === STATUS_COMPLETED) {
            updateDisplayNone(completedItems, filterDisabled, elementSelectorToApplyFilter);
        } else if (+filterType === STATUS_ONHOLD) {
            updateDisplayNone(onHoldItems, filterDisabled, elementSelectorToApplyFilter);
        } else if (+filterType === STATUS_DROPPED) {
            updateDisplayNone(droppedItems, filterDisabled, elementSelectorToApplyFilter);
        } else if (+filterType === STATUS_PLANNED) {
            updateDisplayNone(plannedItems, filterDisabled, elementSelectorToApplyFilter);
        }
    }

    // Only used in recommendations page (not in my list will only filter if both recommendations are not on your list)
    function updateRecDisplayNone(key, elements, isVisible, elementSelectorToUpdate) {
        elements.forEach(element => {
            const closestElement = element.closest(elementSelectorToUpdate);
            if (isVisible) {
                closestElement.classList.remove(key + '1_hidden');
                closestElement.classList.replace(key + '2_hidden', key + '1_hidden');
                closestElement.style.display = '';
            } else {
                if (closestElement.classList.contains(key + '1_hidden')) {
                    closestElement.classList.replace(key + '1_hidden', key + '2_hidden');
                    closestElement.style.display = 'none';
                } else {
                    closestElement.classList.add(key + '1_hidden');
                }
            }
        });
    }

    if (document.location.href.includes("myanimelist.net/topanime.php")) {
        const anchor = document.querySelector("h2.top-rank-header2");
        if (anchor) {
            const html = constructMyListFilterHTML("anime", "20px", "0px");
            anchor.insertAdjacentHTML("beforeend", `<div class="fl-r di-ib mt4 mr12 po-r">${html}</div>`);
            initializeMyListFilterElement(anchor, filterFunction, '.ranking-list', 'top-anime', fixTopRankingTableColors);
            return true;
        }
    }

    if (document.location.href.includes("myanimelist.net/topmanga.php")) {
        const anchor = document.querySelector("h2.top-rank-header2");
        if (anchor) {
            const html = constructMyListFilterHTML("manga", "20px", "0px");
            anchor.insertAdjacentHTML("beforeend", `<div class="fl-r di-ib mt4 mr12 po-r">${html}</div>`);
            initializeMyListFilterElement(anchor, filterFunction, '.ranking-list', 'top-manga', fixTopRankingTableColors);
            return true;
        }
    }

    if (document.location.href.includes("myanimelist.net/anime.php?") && !document.location.href.includes("_location=mal_h_m")) {
        const anchor = document.querySelector("#content > .normal_header");
        if (anchor) {
            const html = constructMyListFilterHTML("anime", "20px", "0px");
            anchor.insertAdjacentHTML("beforeend", `<div class="fl-r di-ib mb4 mr12 po-r">${html}</div>`);
            initializeMyListFilterElement(anchor, filterFunction, 'tr', 'anime-search', fixSearchTableColors);
            return true;
        }
    }

    if (document.location.href.includes("myanimelist.net/manga.php?") && !document.location.href.includes("_location=mal_h_m")) {
        const anchor = document.querySelector("#content > .normal_header");
        if (anchor) {
            const html = constructMyListFilterHTML("manga", "20px", "0px");
            anchor.insertAdjacentHTML("beforeend", `<div class="fl-r di-ib mb4 mr12 po-r">${html}</div>`);
            initializeMyListFilterElement(anchor, filterFunction, 'tr', 'manga-search', fixSearchTableColors);
            return true;
        }
    }

    if (document.location.href.includes("myanimelist.net/reviews.php?t=anime")) {
        const anchor = document.querySelector(".review-sort-and-filter");
        if (anchor) {
            const html = constructMyListFilterHTML("anime", "20px", "0px");
            anchor.insertAdjacentHTML("beforeend", html);
            initializeMyListFilterElement(anchor, filterFunction, '.review-element', 'anime-reviews');
            return true;
        }
    }

    if (document.location.href.includes("myanimelist.net/reviews.php?t=manga")) {
        const anchor = document.querySelector(".review-sort-and-filter");
        if (anchor) {
            const html = constructMyListFilterHTML("manga", "20px", "0px");
            anchor.insertAdjacentHTML("beforeend", html);
            initializeMyListFilterElement(anchor, filterFunction, '.review-element', 'manga-reviews');
            return true;
        }
    }

    if (document.location.href.includes("myanimelist.net/recommendations.php?s=recentrecs&t=anime")) {
        const anchor = document.querySelector("#horiznav_nav");
        if (anchor) {
            const html = constructMyListFilterHTML("anime", "20px", "0px", true);
            anchor.insertAdjacentHTML("beforeend", `<div class="fl-r di-ib mr12 po-r">${html}</div>`);
            initializeMyListFilterElement(anchor, recFilterFunction, 'div.borderClass', 'anime-recommendations');
            anchor.insertAdjacentHTML("beforeend", `<span class="fl-r mr4" title="The 'My List' filters work a bit different on this page, 'Both In My List' & 'Both Not In My List' will only hide the recommendation if both anime entries are (not) in your list. The other filters will hide the recommendation if either anime entry matches the filter.">ⓘ</span>`);
            return true;
        }
    }

    if (document.location.href.includes("myanimelist.net/recommendations.php?s=recentrecs&t=manga")) {
        const anchor = document.querySelector("#horiznav_nav");
        if (anchor) {
            const html = constructMyListFilterHTML("manga", "20px", "0px", true);
            anchor.insertAdjacentHTML("beforeend", `<div class="fl-r di-ib mr12 po-r">${html}</div>`);
            initializeMyListFilterElement(anchor, recFilterFunction, 'div.borderClass', 'manga-recommendations');
            anchor.insertAdjacentHTML("beforeend", `<span class="fl-r mr4" title="The 'My List' filters work a bit different on this page, 'Both In My List' & 'Both Not In My List' will only hide the recommendation if both manga entries are (not) in your list. The other filters will hide the recommendation if either manga entry matches the filter.">ⓘ</span>`);
            return true;
        }
    }

    if (/^https:\/\/myanimelist\.net\/anime\/[^\/]+\/[^\/]+\/userrecs$/.test(document.location.href)) {
        const anchor = document.querySelector("#content .rightside h2");
        if (anchor) {
            const html = constructMyListFilterHTML("anime", "20px", "0px");
            anchor.insertAdjacentHTML("beforeend", `<div class="fl-r di-ib mr12 po-r">${html}</div>`);
            initializeMyListFilterElement(anchor, filterFunction, 'div.borderClass', 'anime-userrecs');
            return true;
        }
    }

    if (/^https:\/\/myanimelist\.net\/manga\/[^\/]+\/[^\/]+\/userrecs$/.test(document.location.href)) {
        const anchor = document.querySelector("#content .rightside h2");
        if (anchor) {
            const html = constructMyListFilterHTML("manga", "20px", "0px");
            anchor.insertAdjacentHTML("beforeend", `<div class="fl-r di-ib mr12 po-r">${html}</div>`);
            initializeMyListFilterElement(anchor, filterFunction, 'div.borderClass', 'manga-userrecs');
            return true;
        }
    }

    return false;
}

function constructMyListFilterHTML(type, top, right, isRecommendations = false) {
    return `
<style>
  .btn-show-mylist-filters {
    background-image: url(/images/icon-pulldown2.png?v=1634263200);
    background-position: right -15px;
    background-repeat: no-repeat;
    background-size: 8px 26px;
    color: #787878;
    cursor: pointer;
    display: inline-block;
    padding-right: 12px !important;
  }
  .dark-mode .btn-show-mylist-filters {
    color: #a3a3a3;
  }
  .dark-mode .btn-show-mylist-filters.filtered {
    background-image: url(/images/icon-pulldown3.png?v=1634263200);
  }
  .btn-show-mylist-filters.on {
    background-position: right 6px;
  }
  .mylist-filter-block {
    background-color: #fff;
    border: #d8d8d8 1px solid;
    border-radius: 0 0 4px 4px;
    -webkit-box-shadow: 1px 1px 5px rgba(0,0,0,.2);
    box-shadow: 1px 1px 5px rgba(0,0,0,.2);
    display: none;
    font-weight: 400;
    padding: 8px;
    position: absolute;
    width: 130px;
    z-index: 10;
  }
  .dark-mode .mylist-filter-block {
    background-color: #121212;
    border: #353535 1px solid;
  }
  .mylist-filter-block .btn-close {
    color: #787878;
    cursor: pointer;
    font-size: 13px;
    -webkit-transition-duration: .3s;
    transition-duration: .3s;
    -webkit-transition-property: all;
    transition-property: all;
    -webkit-transition-timing-function: ease-in-out;
    transition-timing-function: ease-in-out;
  }
  .dark-mode .mylist-filter-block .btn-close {
    color: #a3a3a3;
  }
  .mylist-filter-block .mylist-filter-block-options {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .mylist-filter-block .mylist-filter-block-options .btn-mylist-filter {
    clear: both;
    color: #787878;
    cursor: pointer;
    display: inline-block !important;
    font-size: 11px;
    margin: 1px 0 !important;
    padding: 2px 0 4px 18px !important;
    position: relative;
    width: 120px;
    text-align: left;
  }
  .mylist-filter-block .mylist-filter-block-options .ml12.btn-mylist-filter {
    margin-left: 12px !important;
    width: 108px;
  }
  .dark-mode .mylist-filter-block .mylist-filter-block-options .btn-mylist-filter {
    color: #a3a3a3;
  }
  .mylist-filter-block .mylist-filter-block-options .btn-mylist-filter.fa-stack {
    height: 1.4em;
  }
  .mylist-filter-block .mylist-filter-block-options .btn-mylist-filter .fa-square {
    color: #888;
    font-size: 1.5em;
    width: 14px;
  }
  .dark-mode .mylist-filter-block .mylist-filter-block-options .btn-mylist-filter .fa-square {
    color: #a3a3a3;
  }
  .mylist-filter-block .mylist-filter-block-options .btn-mylist-filter .fa-check {
    color: #080;
    font-size: 1em;
    top: -1px;
    width: 14px;
    display: none;
  }
  .dark-mode .mylist-filter-block .mylist-filter-block-options .btn-mylist-filter .fa-check {
    color: #3dc53d;
  }
  .mylist-filter-block .mylist-filter-block-options .btn-mylist-filter.selected .fa-check {
    display: inline-block;
  }
  .mylist-filter-block .mylist-filter-block-options .btn-mylist-filter .fa-xmark {
    color: #f20;
    font-size: 1em;
    top: -1px;
    width: 14px;
    display: none;
  }
  .dark-mode .mylist-filter-block .mylist-filter-block-options .btn-mylist-filter .fa-xmark {
    color: #ff8462;
  }
  ${isRecommendations ? `
  .mylist-filter-block .mylist-filter-block-options .btn-mylist-filter:not(.selected) .fa-xmark {
    display: inline-block;
  }` : ''}
</style>
<span class="fl-r btn-show-mylist-filters sort fs11 fw-n" data-id="mylist" id="mylist-filters">Loading...</span>
<div class="mylist-filter-block sort" style="display: none; top: ${top}; right: ${right};">
  <span class="fl-r btn-close">
    <i class="fa-solid fa-times"></i>
  </span>
  <ul class="mylist-filter-block-options" id="mylist">
    <li class="btn-mylist-filter fa-stack selected" data-status="all">
      <i class="fa-regular fa-square fa-stack-2x"></i>
      <i class="fa-solid fa-check fa-stack-1x"></i> All
    </li>
    ${isRecommendations ? `
    <li class="ml12 btn-mylist-filter fa-stack selected" data-status="10">
      <i class="fa-regular fa-square fa-stack-2x"></i>
      <i class="fa-solid fa-check fa-stack-1x"></i> Both In My List
    </li>` : ''}
    <li class="ml12 btn-mylist-filter fa-stack selected" data-status="0">
      <i class="fa-regular fa-square fa-stack-2x"></i>
      <i class="fa-solid fa-check fa-stack-1x"></i> ${isRecommendations ? 'Both' : ''} Not In My List
    </li>
    <li class="ml12 btn-mylist-filter fa-stack selected" data-status="1">
      <i class="fa-regular fa-square fa-stack-2x"></i>
      <i class="fa-solid fa-xmark fa-stack-1x"></i>
      <i class="fa-solid fa-check fa-stack-1x"></i> ${type === "anime" ? "Watching" : "Reading"}
    </li>
    <li class="ml12 btn-mylist-filter fa-stack selected" data-status="2">
      <i class="fa-regular fa-square fa-stack-2x"></i>
      <i class="fa-solid fa-xmark fa-stack-1x"></i>
      <i class="fa-solid fa-check fa-stack-1x"></i> Completed
    </li>
    <li class="ml12 btn-mylist-filter fa-stack selected" data-status="3">
      <i class="fa-regular fa-square fa-stack-2x"></i>
      <i class="fa-solid fa-xmark fa-stack-1x"></i>
      <i class="fa-solid fa-check fa-stack-1x"></i> On-Hold
    </li>
    <li class="ml12 btn-mylist-filter fa-stack selected" data-status="4">
      <i class="fa-regular fa-square fa-stack-2x"></i>
      <i class="fa-solid fa-xmark fa-stack-1x"></i>
      <i class="fa-solid fa-check fa-stack-1x"></i> Dropped
    </li>
    <li class="ml12 btn-mylist-filter fa-stack selected" data-status="6">
      <i class="fa-regular fa-square fa-stack-2x"></i>
      <i class="fa-solid fa-xmark fa-stack-1x"></i>
      <i class="fa-solid fa-check fa-stack-1x"></i> ${type === "anime" ? "Plan to Watch" : "Plan to Read"}
    </li>
  </ul>
</div>`;
}

function initializeMyListFilterElement(anchor, filterAction, elementSelectorToApplyFilter, filterName, customAction = null) {
    const filterToggle = anchor.querySelector('.btn-show-mylist-filters'); // The span to toggle filters
    const filterBlock = anchor.querySelector('.mylist-filter-block'); // The block with filter options
    const closeButton = filterBlock.querySelector('.btn-close'); // The close button inside the filter block
    const listItems = filterBlock.querySelectorAll('.btn-mylist-filter'); // All li elements in the list

    // Function to load selected filter states from localStorage
    function loadFiltersFromLocalStorage() {
        const storedFilters = getSetting('MyListFilters#' + filterName) || {};

        // Set the selected state for each filter from localStorage
        listItems.forEach(item => {
            const status = item.dataset.status;
            if (storedFilters[status] === false) {
                item.classList.remove('selected');
                if (status !== 'all') {
                    filterAction(item.dataset.status, false, elementSelectorToApplyFilter);
                }
            } else {
                item.classList.add('selected');
            }
        });

        if (storedFilters.all === false) {
            filterToggle.classList.add('filtered');
        }

        customAction?.();
    }

    // Function to save selected filter states to localStorage
    function saveFiltersToLocalStorage() {
        const filtersState = {};

        listItems.forEach(item => {
            const status = item.dataset.status;
            filtersState[status] = item.classList.contains('selected');
        });

        // Store the filters state in localStorage
        saveSetting('MyListFilters#' + filterName, filtersState);
    }

    // Toggle the visibility of the filter block when the span is clicked
    filterToggle.addEventListener('click', function() {
        if (initializing) return;

        // Toggle the "on" class on the filterToggle (to show/hide the filter)
        filterToggle.classList.toggle('on');

        // Toggle the display of the filter block
        if (filterToggle.classList.contains('on')) {
            filterBlock.style.display = 'block';
        } else {
            filterBlock.style.display = 'none';
        }
    });

    // Close the filter block when the close button is clicked
    closeButton.addEventListener('click', function() {
        filterToggle.classList.remove('on');
        filterBlock.style.display = 'none';
    });

    // Close the filter block when clicking outside of the filter block
    document.addEventListener('click', function(event) {
        // Check if the click is outside the filter block and the toggle button
        if (!filterBlock.contains(event.target) && event.target !== filterToggle) {
            filterToggle.classList.remove('on');
            filterBlock.style.display = 'none';
        }
    });

    // Toggle the "selected" class on li elements
    listItems.forEach(function(item) {
        item.addEventListener('click', function() {
            // If the "All" filter is clicked, handle it separately
            if (item.dataset.status === 'all') {
                item.classList.toggle('selected');
                item.classList.toggle('filtered');

                // If "All" is selected, select all other filters
                if (item.classList.contains('selected')) {
                    listItems.forEach(i => {
                        if (i.dataset.status !== 'all') {
                            i.classList.add('selected');
                        }
                    });
                } else {
                    // If "All" is unselected, unselect all other filters
                    listItems.forEach(i => {
                        if (i.dataset.status !== 'all') {
                            i.classList.remove('selected');
                        }
                    });
                }
            } else {
                item.classList.toggle('selected');

                // Check if "All" filter should be updated
                const allSelected = [...listItems].every(item => item.dataset.status === 'all' || item.classList.contains('selected'));
                const allItem = filterBlock.querySelector('[data-status="all"]');

                if (allSelected) {
                    allItem.classList.add('selected');
                    filterToggle.classList.remove('filtered');
                } else {
                    allItem.classList.remove('selected');
                    filterToggle.classList.add('filtered');
                }
            }

            saveFiltersToLocalStorage();
            filterAction(item.dataset.status, item.classList.contains('selected'), elementSelectorToApplyFilter);
            customAction?.();
        });
    });

    globalLoadFiltersFromLocalStorage = loadFiltersFromLocalStorage;
}

function fixTopRankingTableColors() {
    const table = document.querySelector(".top-ranking-table");
    if (!document.getElementById('custom-top-ranking-table-style')) {
        table.insertAdjacentHTML("beforebegin", `<style id="custom-top-ranking-table-style">
  .top-ranking-table tr.ranking-list td {
    background-color: #fff !important;
  }

  .top-ranking-table tr.ranking-list.odd-row td {
    background-color: #f8f8f8 !important;
  }

  .dark-mode .top-ranking-table tr.ranking-list td {
    background-color: #121212 !important;
  }

  .dark-mode .top-ranking-table tr.ranking-list.odd-row td {
    background-color: #181818 !important;
  }
</style>`);
    }

    const tableRows = table.querySelectorAll("tr.ranking-list");
    const visibleRows = Array.from(tableRows).filter(row => row.style.display !== 'none');
    visibleRows.forEach((row, index) => {
        row.classList.remove('odd-row');
        if (index % 2 === 0) {
            row.classList.add('odd-row');
        }
    });
}

function fixSearchTableColors() {
    const table = document.querySelector("#content > .list table");
    const tableRows = table.querySelectorAll("tr");
    const visibleRows = Array.from(tableRows).filter(row => row.style.display !== 'none');
    visibleRows.forEach((row, index) => {
        var tableRowColumns = row.querySelectorAll("td");
        Array.from(tableRowColumns).forEach(column => {
            column.classList.remove('bgColor0', 'bgColor1');
            if (index % 2 === 0) {
                column.classList.add('bgColor1');
            } else {
                column.classList.add('bgColor0');
            }
        });
    });
}

async function getAnimeFromList(id) {
    var anime = animeList[id];

    if (!anime) {
        animeList = await getUserList("anime", true);
    }

    return animeList[id];
}

async function getMangaFromList(id) {
    var manga = mangaList[id];

    if (!manga) {
        mangaList = await getUserList("manga", true);
    }

    return mangaList[id];
}

async function getUserList(type, forceRefresh = false) {
    let userlistWrapper = getSetting(type + 'list', false);

    // Fetch userlist if it is older than 1 hour
    if (forceRefresh || (!(userlistWrapper?.fetchDate && ((new Date() - new Date(userlistWrapper.fetchDate)) / (60*60*1000) < 1)))) {
        const userlist = trimUserList(await fetchUserList(type));
        userlistWrapper = {
            "userlist": userlist,
            "fetchDate": new Date()
        };
        saveSetting(type + 'list', userlistWrapper, false);
    }

    return flatten(userlistWrapper.userlist);
}

async function fetchUserList(type, userlist = [], page = 1) {
    await fetch('https://myanimelist.net/' + type + 'list/' + userName + '/load.json?offset=' + ((page - 1) * 300)).then(function(response) {
        return response.json();
    }).then(async function(json) {
        userlist = userlist.concat(json);

        if (json.length !== 0) {
            await timeout(300);
            userlist = await fetchUserList(type, userlist, ++page);
        }
    });

    return userlist;
}

function trimUserList(userlist) {
    return userlist.map(entry => ({
        "id": entry.anime_id ?? entry.manga_id,
        "status": entry.status,
    }));
}

function saveSetting(key, value, hasVersion = true) {
    localStorage.setItem('MAL#' + key + (hasVersion ? '_' + version : ''), JSON.stringify(value));
}

function getSetting(key, hasVersion = true) {
    const value = localStorage.getItem('MAL#' + key + (hasVersion ? '_' + version : ''));
    if (value) {
        return JSON.parse(value);
    } else {
        return null;
    }
}

function flatten(list) {
    const map = {};
    for (let item of list) {
        map[item.id] = item;
    }
    return map;
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}