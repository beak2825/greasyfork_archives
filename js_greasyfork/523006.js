// ==UserScript==
// @name         GeoGuessr Maps Additional Info
// @author       SkiDY
// @namespace    https://www.geoguessr.com/
// @version      0.3
// @description  Displays the creation date, last update date and whether the map is polygonal or handpicked.
// @match        http*://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523006/GeoGuessr%20Maps%20Additional%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/523006/GeoGuessr%20Maps%20Additional%20Info.meta.js
// ==/UserScript==

const API = "https://www.geoguessr.com/api/maps/";
const APIv4 = "https://www.geoguessr.com/api/v4/search/map?q=";
const delayMs = 1000;

let newDivWrapper = document.createElement('div');
let fetchingDiv = document.createElement('div');
let createDiv = document.createElement('div');
let updateDiv = document.createElement('div');
let modeDiv = document.createElement('div');
newDivWrapper.classList.add('map-new-info');
fetchingDiv.innerText = "Fetching data...";

// based on Wmtmky's Real Loc Count script
let i_URL = undefined;
setInterval(function () {
    let f_URL = window.location.href;
    if (f_URL != i_URL) {
        i_URL = f_URL;
        let a_URL = f_URL.split("/")
        if (a_URL[a_URL.length - 2] == "maps")
        {
            createMapInfoWrapper();
            let mapId = a_URL[a_URL.length - 1];
            if(mapId == "random")
            {
                searchForRandomizedMap();
            }
            else
            {
                displayMapInfo(mapId);
            }
        }
    }
}, delayMs);

async function checkForMulitplePages(request)
{
    let response = await fetch(request + "&page=1");
    let responseArray = await response.json();

    if(responseArray.length < 1)
    {
        return false;
    }
    else
    {
        return true;
    }
}

function searchForMapId(responseArray, title, author)
{
    let id = undefined;
    title = title.trim().toLowerCase().replace('...','');
    author = author.trim().toLowerCase();
    for (let map of responseArray)
    {
        let mapName = map.name.trim().toLowerCase();
        let mapAuthor = map.creator.nick.trim().toLowerCase();

        if(mapName.includes(title) && mapAuthor == author)
        {
            id = map.id;
        }
    }
    return id;
}


async function searchMapWithQuery(query, author, title)
{
    let id = undefined;
    let multiplePages = true;
    let response = undefined;
    let responseArray = undefined;
    multiplePages = await checkForMulitplePages(query);

    if(multiplePages == true)
    {
        let page = 0;
        let arrLen = 1;
        response = await fetch(query);
        responseArray = await response.json();
        while(arrLen > 0)
        {
            id = searchForMapId(responseArray, title, author);
            if(id !== undefined && id !== '')
            {
                break; //found matching map
            }
            page = page + 1;
            response = await fetch(query + "&page=" + page);
            responseArray = await response.json();
            arrLen = responseArray.length;
        }
    }
    else
    {
        response = await fetch(query);
        responseArray = await response.json();
        id = searchForMapId(responseArray, title, author);
    }

    return id;
}

async function searchForRandomizedMap()
{
    let metaBottom = document.querySelector("[class^='map-teaser_metaBottomContainer__']");
    let authorElem = metaBottom.querySelector("[class^='shared_whiteGradientVariant__']");
    let titleContainer = document.querySelector("[class^='map-teaser_titleContainer__']");
    let titleElem = titleContainer.querySelector("[class^='headline_heading__']");

    let title = titleElem.innerText;
    let author = undefined;
    let idByAuthor = undefined;
    let idByTitle = undefined;

    author = authorElem.innerText;

    let reqAuthor = APIv4 + author;
    let reqTitle = APIv4 + title;

    if(author.trim() != "Anonymous" && author.length > 4)
    {
        idByAuthor = await searchMapWithQuery(reqAuthor, author, title); //search with author name first
    }

    if(idByAuthor !== undefined && idByAuthor != "")
    {
        await displayMapInfo(idByAuthor);
    }
    else
    {
        idByTitle = await searchMapWithQuery(reqTitle, author, title);
        if(idByTitle !== undefined && idByTitle != "")
        {
            await displayMapInfo(idByTitle);
        }
        else
        {
            newDivWrapper.innerText = "Couldn't find info about the map.";
        }
    }
}


async function displayMapInfo(mapID)
{
    const response = await fetch(API + mapID);
    const responseJson = await response.json();
    let dateCreated = responseJson.createdAt;
    let dateUpdated = responseJson.updatedAt;
    let locationSelectionMode = responseJson.locationSelectionMode;
    updateDisplay(dateCreated, dateUpdated, locationSelectionMode);
}


function createMapInfoWrapper()
{
    const lastUpdatedDiv = document.querySelector("[class^='community-map-block_lastUpdated__']");
    lastUpdatedDiv.innerHTML = "";
    lastUpdatedDiv.appendChild(newDivWrapper);
    newDivWrapper.appendChild(fetchingDiv);
    newDivWrapper.appendChild(createDiv);
    newDivWrapper.appendChild(updateDiv);
    newDivWrapper.appendChild(modeDiv);
    fetchingDiv.innerText = "Fetching data...";
    createDiv.innerText = "";
    updateDiv.innerText = "";
    modeDiv.innerText = "";
}

function updateDisplay(dateCreatedStr, dateUpdatedStr, selectionMode)
{
    const divs = document.getElementsByClassName("map-new-info");
    if(divs.length < 1)
    {
        createMapInfoWrapper();
    }
    fetchingDiv.innerText = "";

    //update values
    let dateCreated = dateCreatedStr.split("T")[0];
    let dateUpdated = dateUpdatedStr.split("T")[0];
    if(selectionMode == 1)
    {
        selectionMode = "Handpicked ✔️";
    }
    else
    {
        selectionMode = "Polygonal ❌";
    }
    createDiv.innerText = "Created at: " + dateCreated;
    updateDiv.innerText = "Last updated at: " + dateUpdated;
    modeDiv.innerText = "Selection mode: " + selectionMode;
}