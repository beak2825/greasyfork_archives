// ==UserScript==
// @name         Chaturbate Advanced Filters
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  Adds more features to the chaturbate website filters such as age and keyword searching filtering. Look for these features under the normal options gear.
// @author       jepspile@yahoo.com
// @match        *chaturbate.com/*
// @icon         https://static-assets.highwebmedia.com/favicons/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473402/Chaturbate%20Advanced%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/473402/Chaturbate%20Advanced%20Filters.meta.js
// ==/UserScript==

const defaultHomepage = "https://chaturbate.com/tag/milf/female/"; //homepage redirect
const minAgeDefault = '30'; //default min age
const maxAgeDefault = ''; //default max age
const keywordDefaults = '-squirt'; //list of keywords (or negative keywords) separated by commas

// Keep track of changes to the DOM and update as needed
let timer;
let targetNode = document.getElementsByClassName("roomlist_container")[0];
let config = { attributes: true, childList: true, subtree: true };
let callback = (mutationList, observer) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { initialize(); }, 1000);
};
let observer = new MutationObserver(callback);
observer.observe(targetNode, config);

homepageRedirect();
addFilters();

function initialize(){
    showHideRoomCards();
}

function addFilters(){
    const searchMenu = document.getElementsByClassName("advance-search-element")[0];

    // Age filter
    // **************************************************

    const ageFilter = document.createElement("div");
    const ageLabel = document.createElement("label");
    const ageMin = document.createElement("input");
    const ageMax = document.createElement("input");
    const ageSeparator = document.createElement("span");

    ageFilter.id = "age-filter";
    ageLabel.innerHTML = "Age: &nbsp;&nbsp;";

    ageMin.type = "text";
    ageMin.id = "age-min";
    ageMin.value = minAgeDefault;

    ageSeparator.innerHTML = "&nbsp; - &nbsp;";

    ageMax.type = "text";
    ageMax.id = "age-max";
    ageMax.value = maxAgeDefault;

    ageFilter.appendChild(ageLabel);
    ageFilter.appendChild(ageMin);
    ageFilter.appendChild(ageSeparator);
    ageFilter.appendChild(ageMax);

    searchMenu.appendChild(ageFilter);
    searchMenu.insertBefore(addStyleBlock(), ageFilter);

    ageMin.addEventListener("change", (event) => {
        showHideRoomCards();
    });

    ageMax.addEventListener("change", (event) => {
        showHideRoomCards();
    });


    // Keyword filter
    // **************************************************

    const keywordFilter = document.createElement("div");
    const keywordLabel = document.createElement("label");
    const keywordList = document.createElement("input");

    keywordFilter.id = "keyword-filter";
    keywordLabel.innerHTML = "keywords: &nbsp;&nbsp;";

    keywordList.type = "text";
    keywordList.id = "keyword-list";
    keywordList.value = keywordDefaults;

    keywordFilter.appendChild(keywordLabel);
    keywordFilter.appendChild(keywordList);

    searchMenu.appendChild(keywordFilter);
    searchMenu.insertBefore(addStyleBlock(), keywordFilter);

    keywordList.addEventListener("change", (event) => {
        showHideRoomCards();
    });

    keywordList.addEventListener("change", (event) => {
        showHideRoomCards();
    });
}

function showHideRoomCards(){
    var minAge = document.getElementById("age-min").value;
    var maxAge = document.getElementById("age-max").value;
    var keywordList = document.getElementById("keyword-list").value;

    var rooms = document.getElementsByClassName("roomCard");
    for (let i = 0; i < rooms.length; ++i) {
        // Age check
        var ages = rooms[i].getElementsByClassName("age");
        var age = (ages[0] !== undefined) ? ages[0].innerHTML : '';
        var showAge = false;
        if ((age >= minAge || minAge == "") && (age <= maxAge || maxAge == "")){ showAge = true; }

        // Keyword check
        var subjects = rooms[i].getElementsByClassName("subject");
        var subject = (subjects[0] !== undefined) ? subjects[0].innerHTML : "";

        var keywords = keywordList.split(",");
        var showKeyword = true;

        if(subject != "" && keywords != ""){
            for (let k = 0; k < keywords.length; ++k) {
                if(keywords[k].startsWith("-") == true && subject.includes(keywords[k].substring(1).toLowerCase())){
                    showKeyword = false;
                }
                if(keywords[k].startsWith("-") == false && !subject.includes(keywords[k].toLowerCase() in subject)){
                    showKeyword = false;
                }
            }}

        if(showAge == true && showKeyword == true){
            rooms[i].dataset.hide = false;
            rooms[i].style.display = "list-item";
        } else {
            rooms[i].dataset.hide = true;
            rooms[i].style.display = "none !important";
        }
    }
}

function homepageRedirect(){
    if(window.location.href == "https://chaturbate.com/"){
        window.location.replace(defaultHomepage);
        return false;
    } else { return true; }
}

function addStyleBlock(){
    var cssBlock = document.createElement("style");
    cssBlock.innerHTML = "" +
        "#improvedSearch { height: 50px; }" +
        "" +
        "#age-min,#age-max { width:20px; }" +
        "body li[data-hide='true'] {display:none !important; }" +
        "";
    return cssBlock;
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

