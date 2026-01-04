// ==UserScript==
// @name         GC Safety Deposit Box Saved Searches
// @namespace    http://tampermonkey.net/
// @version      2024-04-03
// @description  Allows you to save searches for quick access in the SDB at grundos.cafe.
// @author       DeviPotato (Devi on GC, devi on Discord)
// @license      MIT
// @match        https://www.grundos.cafe/safetydeposit/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/488252/GC%20Safety%20Deposit%20Box%20Saved%20Searches.user.js
// @updateURL https://update.greasyfork.org/scripts/488252/GC%20Safety%20Deposit%20Box%20Saved%20Searches.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const emptySearch = "https://www.grundos.cafe/safetydeposit/?query=&page=1&category=&type=&min_rarity=0&max_rarity=999&sort=rarity";

    const head = document.getElementsByTagName('head')[0];
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    head.appendChild(style);

    function addStyle( css ) {
        style.sheet.insertRule( css, style.sheet.cssRules.length );
    }

    addStyle(`.sdbss_container {
        margin-top: 1em;
        margin-bottom: 1em;
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        justify-content: space-between;
    }`);
    addStyle(`.sdbss_savedsearch {
        padding-top: 0.3em;
        padding-bottom: 0.3em;
        display: flex;
        flex-basis: 50%;
        text-align: center;
        position: relative;
    }`);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
        addStyle(`.sdbss_savedsearch:hover .sdbss_delete {
        display:block;
    }`);
    }
    addStyle(`.sdbss_delete {
        position: absolute;
        right: 1em;
        ${!isMobile?"display:none;":""}
    }`);
    addStyle(`.sdbss_details {
        width: 100%;
    }`);

    function startsWithEmoji(string) {
        const first = Array.from(string)[0];
        return /\p{Emoji}/u.test(first);
    }

    async function updateSearchList() {
        let searchList = document.querySelector(".sdbss_container");
        searchList.replaceWith(await savedSearchList());
    }

    function urlParam(name, url=window.location.href){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
        if (results==null) {
            return "";
        }
        return decodeURI(results[1]) || "";
    }

    async function isSearchSaved() {
        let savedSearches = await GM.getValue("savedSearches", []);
        let matches = savedSearches.filter(item => {
            console.log(`comparing ${item.url} and ${window.location.href}`)
            return isEquivalentSearch(item.url,window.location.href);
        })
        return matches.length != 0;
    }

    function getSearchState() {
        return {
            query: document.querySelector('form[action="/safetydeposit/"] input[name="query"]').value,
            page: document.querySelector('form[action="/safetydeposit/"] select#page').value,
            category: document.querySelector('form[action="/safetydeposit/"] select#category').value,
            type: document.querySelector('form[action="/safetydeposit/"] select#type').value,
            minRarity: document.querySelector('form[action="/safetydeposit/"] input[name="min_rarity"]').value,
            maxRarity: document.querySelector('form[action="/safetydeposit/"] input[name="max_rarity"]').value,
            sort: document.querySelector('form[action="/safetydeposit/"] select[name="sort"]').value,
            descending: document.querySelector('form[action="/safetydeposit/"] input#descending').checked
        }
    }

    function getURLState(url=window.location.href) {
        return {
            query: urlParam("query", url),
            page: urlParam("page", url),
            category: urlParam("category", url),
            type: urlParam("type", url),
            minRarity: urlParam("min_rarity", url),
            maxRarity: urlParam("max_rarity", url),
            sort: urlParam("sort", url),
            descending: urlParam("descending", url)
        }
    }

    function isEquivalentSearch(url1, url2) {
        const state1 = getURLState(url1);
        const state2 = getURLState(url2);
        let equivalent = true;
        Object.keys(state1).forEach(key => {
            console.log(`saved ${key}: ${state1[key]}, new ${key}: ${state2[key]}`);
            if(key=="page") return;
            if(state1[key] != state2[key]) {
                equivalent = false;
            }
        })
        return equivalent;
    }

    function suggestedName() {
        let searchQuery = document.querySelector('form[action="/safetydeposit/"] input[name="query"]');
        let category = document.querySelector('form[action="/safetydeposit/"] select#category');
        let categoryText = category.options[category.selectedIndex].text;
        let type = document.querySelector('form[action="/safetydeposit/"] select#type');
        let typeText = type.options[type.selectedIndex].text;
        console.log(categoryText);
        if(searchQuery.value && searchQuery.value != "") return searchQuery.value;
        if(categoryText != "Select Category") return categoryText;
        if(typeText != "Select Type") return typeText;
        else return "";
    }

    async function savedSearchList() {
        let savedSearches = await GM.getValue("savedSearches", []);
        let container = document.createElement("div");
        container.classList.add("sdbss_container");
        for(let search of savedSearches) {
            let linkcontainer = document.createElement("div");
            linkcontainer.classList.add("sdbss_savedsearch");
            let link = document.createElement("a");
            link.classList.add("sdbss_searchlink");
            link.innerText=`${!startsWithEmoji(search.name)?"🔍 ":""}${search.name}`;
            link.href=search.url;
            linkcontainer.append(link);
            let deleteButton = document.createElement("a");
            deleteButton.classList.add("sdbss_delete");
            deleteButton.innerText="❌";
            deleteButton.addEventListener("click", async () => {
                let confirmation = confirm(`Are you sure you want to delete ${search.name}?`)
                if(confirmation) {
                    let savedSearches = await GM.getValue("savedSearches", []);
                    savedSearches = savedSearches.filter(item => {
                        return (item.name != search.name && item.url != search.url);
                    })
                    GM.setValue("savedSearches", savedSearches);
                    await updateSearchList();
                    if(!(await isSearchSaved())) {
                        document.querySelector('#sdbss_save_button').style.display="block";
                    }
                }
            })
            linkcontainer.append(deleteButton);
            container.append(linkcontainer);
        }
        return container;
    }

    async function savedSearchMenu(open=false) {
        let savedSearchDetails = document.createElement("details");
        savedSearchDetails.classList.add("sdbss_details");
        savedSearchDetails.open=open;
        let list = await savedSearchList();
        savedSearchDetails.append(list);
        let savedSearchSummary = document.createElement("summary");
        savedSearchSummary.innerText="Saved Searches";
        let saveButton = document.createElement("a");
        saveButton.innerText="Save Current Search";
        saveButton.id="sdbss_save_button";
        if(await isSearchSaved()) {
            saveButton.style.display="none";
        }
        saveButton.addEventListener("click", async () => {
            let name = prompt("Please enter a name for the saved search:", suggestedName());
            if(name && name != "") {
                let savedSearches = await GM.getValue("savedSearches", []);
                savedSearches.push({name: name, url: window.location.href.replace(/page=\d+/,"page=1")}); // reset page to 1 for saved searches
                GM.setValue("savedSearches", savedSearches);
                await updateSearchList();
                saveButton.style.display="none";
            }

        })
        savedSearchDetails.addEventListener("toggle", async () => {
            await GM.setValue("searchesOpen",savedSearchDetails.open);
        })
        savedSearchDetails.append(saveButton);
        savedSearchDetails.append(savedSearchSummary);
        return savedSearchDetails;
    }

    const initialState = getSearchState();

    let advSearchDetails = document.querySelector('form[action="/safetydeposit/"] details');

    const searchesOpen = await GM.getValue("searchesOpen", false);
    advSearchDetails.after(await savedSearchMenu(searchesOpen));
})();