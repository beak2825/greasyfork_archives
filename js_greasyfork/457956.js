// ==UserScript==
// @name         Combined seasonal list - MAL
// @namespace    https://greasyfork.org/en/users/954974-crill0
// @version      0.3
// @description  Combines the different type of anime releases on the seasonal page into one list. Each type can be individually toggled.
// @run-at document-end
// @author       Crill0
// @match        *://myanimelist.net/anime/season*
// @icon         https://cdn.myanimelist.net/images/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457956/Combined%20seasonal%20list%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/457956/Combined%20seasonal%20list%20-%20MAL.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    
    if (document.querySelector("div.navi-seasonal > div.horiznav_nav .navtab.horiznav_active")) return; // Schedule or Archive page is selected

    const defaultSelected = await GM.getValue("seasonalSelectedTypes", ["TV (New)", "ONA", "OVA", "Movie"]); // Buttons selected on page load
    const getCurrentSelected = () => [...document.querySelectorAll("ul.btn-seasonal li.btn-type.on")].map(b => b.innerText); 
    
    // replace buttons
    document.querySelector("ul.btn-seasonal").innerHTML = [...document.querySelectorAll(".seasonal-anime-list > .anime-header")].reduce((hPrev, h) => hPrev + `<li class="btn-type ${defaultSelected.find(d => d === h.innerText) ? "on" : ""}" data-key="${h.innerText}">${h.innerText}</li>`, "");
    document.querySelectorAll("ul.btn-seasonal li.btn-type").forEach(button => button.addEventListener("click", e => { // on click
        if (button.classList.contains("on")) button.classList.remove("on");
        else button.classList.add("on");

        updateAnimeTypes();
        GM.setValue("seasonalSelectedTypes", getCurrentSelected()); // store current selected
    }))
    GM_addStyle(".navi-seasonal .horiznav-nav-seasonal .btn-seasonal .btn-type:hover {background-color: #677493} .navi-seasonal .horiznav-nav-seasonal .btn-seasonal .btn-type.on:hover {background-color: #2c4fa4}");

    const getSortFunction = () => {
        const sortOrder = document.querySelector("span.btn-sort-order.selected").id;
        switch(sortOrder) {
            case 'members': {
                const getMembers = (el) => {
                    const m = el.querySelector('.scormem-item.member').innerText.trim();
                    return m.endsWith('K') ? m.slice(0, -1) * 1000 : m.endsWith('M') ? m.slice(0, -1) * 1000000 : m;
                }
                return (elA, elB) => getMembers(elB) - getMembers(elA);
            }
            case 'score': {
                const getScore = el => {
                    const score = el.querySelector('.scormem-item.score').innerText;
                    return score === "N/A" ? 0 : score;
                }
                return (elA, elB) => getScore(elB) - getScore(elA);
            }
            case 'title' : {
                const getTitle = el => el.querySelector('.link-title').innerText;
                return (elA, elB) => getTitle(elA).localeCompare(getTitle(elB));
            }
            case 'studio' : {
                const getStudio = el => el.querySelectorAll('.property')[0].querySelector('.item').innerText;
                return (elA, elB) => getStudio(elA).localeCompare(getStudio(elB));
            }
            case 'start_date': {
                const getStartDate = el => Date.parse(el.querySelector('.info').firstChild.innerText);
                return (elA, elB) => getStartDate(elA) - getStartDate(elB);
            }
            default:
                return () => 0;
        }
    }

    const sortFunction = getSortFunction();
    const listsByType = [...document.querySelectorAll(".seasonal-anime-list")];
    
    // add type tag to each title
    listsByType.forEach(l => {
        const type = l.querySelector(".anime-header").innerText;

        l.querySelectorAll(".seasonal-anime").forEach(a => {
            a.setAttribute("data-anime-type", type);
            a.querySelector(".info").insertAdjacentHTML("beforeend", `<span class="item">${type}</span>`);
        });
    });

    // generate combined list
    const combinedList = document.createElement("div");
    combinedList.className = "seasonal-anime-list js-seasonal-anime-list combined-list";
    combinedList.innerHTML = `<div class="anime-header"></div>`;
    listsByType.flatMap(l => [...l.querySelectorAll(".seasonal-anime")]).sort((elA, elB) => sortFunction(elA, elB)).forEach(a => combinedList.appendChild(a.cloneNode(true)));

    document.querySelector(".js-categories-seasonal").insertAdjacentHTML("beforebegin", `<div class="js-categories-seasonal" style="padding-top: 0px;">${combinedList.outerHTML}</div>`);

    // hides types that are not selected
    const typeHideAnime = () => {
        const selectedLists = getCurrentSelected();
        document.querySelectorAll(".combined-list .seasonal-anime").forEach(a => {
            if (!selectedLists.find(s => s === a.dataset.animeType)) a.setAttribute("data-anime-type-selected", false);
            else a.setAttribute("data-anime-type-selected", true);
        })
        document.querySelector(".combined-list .anime-header").innerText = selectedLists.join(" - ");
    }
    GM_addStyle(`div[data-anime-type-selected="false"]{display: none !important;}`); // don't display unselected types

    const updateAnimeCounter = () => {
        const totalAnime = document.querySelectorAll(".seasonal-anime").length;
        const shownAnime = totalAnime - document.querySelectorAll(`.seasonal-anime[style="display: none;"], .seasonal-anime[data-anime-type-selected="false"]`).length;
        document.querySelector(".js-visible-anime-count").innerText = `${shownAnime}/${totalAnime}`;
    }

    const updateAnimeTypes = () => {
        typeHideAnime();
        updateAnimeCounter();
    }

    listsByType.forEach(l => l.remove()); // remove standard lists
    updateAnimeTypes(); // hide types not selected
})();