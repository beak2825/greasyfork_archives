// ==UserScript==
// @name         WaniKani Review Answer History
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Displays the history of answers for each item in review sessions
// @author       Wantitled
// @match        https://www.wanikani.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449663/WaniKani%20Review%20Answer%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/449663/WaniKani%20Review%20Answer%20History.meta.js
// ==/UserScript==

// Checks for Wanikani Open Framework
if (!window.wkof){
    if(
        confirm(` WaniKani Review Answer History requires Wanikani Open Framework.
            Click "OK" to be forwarded to installation instructions.`)){
        window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549'}
    return;
}

// Inits
let WKAnswerHistory
var observer;
var input;
var itemElem;
const url = window.location.href;
let item, items_by_id;
let bySlug;
let pageItem, itemType;

// Item data only needed for review sessions
wkof.include('ItemData');
wkof.ready('ItemData').then(get_history).then(get_items).then(check_history_data).then(initiate);

async function check_history_data() {
    if (WKAnswerHistory["radicals"]){
        console.log("Old item type name found, renaming to 'radical'.");
        WKAnswerHistory["radical"] = WKAnswerHistory["radicals"];
        delete WKAnswerHistory["radicals"];
        wkof.file_cache.save("WKAnswerHistory", WKAnswerHistory);
    }
    if ((/\D/.test(Object.keys(WKAnswerHistory["radical"])[0]) && Object.keys(WKAnswerHistory["radical"]).length > 0 )
        || (/\D/.test(Object.keys(WKAnswerHistory["kanji"])[0]) && Object.keys(WKAnswerHistory["kanji"]).length > 0 )
        || (/\D/.test(Object.keys(WKAnswerHistory["vocabulary"])[0]) && Object.keys(WKAnswerHistory["vocabulary"]).length > 0)){
        alert("Old item name(s) found, please wait a moment...");
        wkof.file_cache.save("WKAnswerHistory_backup", WKAnswerHistory);
        bySlug = wkof.ItemData.get_index(item, "slug");
        for (let item_type in WKAnswerHistory){
            for (let item_slug in WKAnswerHistory[item_type]){
                if (/\D/.test(item_slug)){
                    let item_id = get_id(item_slug, item_type);
                    WKAnswerHistory[item_type][item_id] = WKAnswerHistory[item_type][item_slug];
                    delete WKAnswerHistory[item_type][item_slug];
                }
            }
        }
        wkof.file_cache.save("WKAnswerHistory", WKAnswerHistory);
        alert("Items converted!");
    }
}

const get_id = (slug, type) => {
    const matches = bySlug[slug];
    if (Array.isArray(matches)) {
        return matches.find(m => m.object === type)?.id;
    } else {
        return matches?.id;
    }
}

// Gets the answer history
async function get_history () {
    if (!wkof.file_cache.dir["WKAnswerHistory"]){
        WKAnswerHistory = {
            "radical": {}, "kanji": {}, "vocabulary": {}
        };
        if (confirm("Wanikani Review Answer History has not detected any review answer data. If this is your first time using the script, click OK. If this is a mistake, please cancel.")){
            wkof.file_cache.save("WKAnswerHistory", WKAnswerHistory);
        }
    } else {
        WKAnswerHistory = await wkof.file_cache.load("WKAnswerHistory");
    }
}

// Gets item data
async function get_items() {
    item = await wkof.ItemData.get_items('assignments');
    items_by_id = wkof.ItemData.get_index(item, 'subject_id');
}

// Adds the input to the item history object
const save_data = (answer, itemType, item, status, language, override) => {
    if (!WKAnswerHistory[itemType][item]){
        WKAnswerHistory[itemType][item] = {
            "answers": [],
            "timestamps": [],
            "itemStatus": [],
            "SRSLevel": [],
            "language": []
        }
    }
    if (!override) {
        let lang;
        if (language === null){
            lang = "en";
        } else {
            lang = "ja";
        }
        WKAnswerHistory[itemType][item].answers.push(answer);
        WKAnswerHistory[itemType][item].timestamps.push(getTimestamp());
        WKAnswerHistory[itemType][item].itemStatus.push(status);
        WKAnswerHistory[itemType][item].SRSLevel.push(returnItemInfo());
        WKAnswerHistory[itemType][item].language.push(lang);
    } else {
        WKAnswerHistory[itemType][item].itemStatus[WKAnswerHistory[itemType][item].itemStatus.length - 1] = status;
    }
    wkof.file_cache.save("WKAnswerHistory", WKAnswerHistory);
}

// Gets time and date of review (seconds are included as the same item can be reviewed a few seconds apart)
const getTimestamp = () => {
    let time = new Date();
    let addZero = (num) => {
        if (String(num).length === 1){
            num = "0" + String(num);
        }
        return num;
    }
    let year = time.getFullYear(); let month = addZero(parseInt(time.getMonth()) + 1); let day = addZero(time.getDate());
    let hours = time.getHours(); let minutes = addZero(time.getMinutes()); let seconds = addZero(time.getSeconds())
    return year + "/" + month + "/" + day + ", " + hours + ":" + minutes + ":" + seconds ;
}

// Gets current item data
const returnItemInfo = () => {
    let review_item = $.jStorage.get('currentItem');
    let item = items_by_id[review_item.id];
    return getSRSLevel(item)
}

const additional_info = (item, info) => {
    let item_obj = items_by_id[item];
    switch (info){
        case "unlock": return item_obj?.assignments?.unlocked_at;break;
        case "lesson": return item_obj?.assignments?.started_at;break;
        case "guru": return item_obj?.assignments?.passed_at;break;
        case "burn": return item_obj?.assignments?.burned_at;break;
        case "resurrect": return item_obj?.assignments?.resurrected_at;break;
    }
}

// Gets the current item's SRS level (the level the item is being reviewed at)
const getSRSLevel = (wkof_item) => {return wkof_item?.assignments?.srs_stage ?? -1}

// Status checker checks for a class change on the input field which signifies an answer or an override
const statusChecker = (fieldsetElem, lastClass) => {
    observer = new MutationObserver((mutationsList) => {

        let itemType = itemElem.classList[0];
        let item = $.jStorage.get('currentItem').id;
        let answer = input.value;
        let lang = input.getAttribute("lang");

        for(let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                let currentClass = mutation.target.classList[0];
                if (currentClass){
                    if (lastClass === undefined) {
                        lastClass = currentClass
                        switch (currentClass){
                            case "correct": save_data(answer, itemType, item, currentClass, lang, false);break;
                            case "incorrect": save_data(answer, itemType, item, currentClass, lang, false);break;
                        }
                    } else {
                        switch (currentClass){
                            case "correct": save_data(answer, itemType, item, currentClass, lang, true);break;
                            case "incorrect": save_data(answer, itemType, item, currentClass, lang, true);break;
                            case "WKO_ignored": save_data(answer, itemType, item, currentClass, lang, true);break;
                            default: break;
                        }
                    }
                } else {lastClass = currentClass}
            }}
    });
    observer.observe(fieldsetElem, {attributes: true});
}

// Creates the table headers for the table on the item page
const createHeaders = () => {
    let headers = document.createElement("tr");

    const reviewTypeHeader = document.createElement("th");
    reviewTypeHeader.innerText = "Review Type";

    const answerHeader = document.createElement("th");
    answerHeader.innerText = "Answer";

    const srsHeader = document.createElement("th");
    srsHeader.innerText = "SRS Level";

    const timestampHeader = document.createElement("th");
    timestampHeader.innerText = "Date Answered";

    headers.appendChild(reviewTypeHeader);
    headers.appendChild(answerHeader);
    headers.appendChild(srsHeader);
    headers.appendChild(timestampHeader);
    return headers;
}

// Creates the table rows and inserts the data for the item page table
const buildTable = (itemObj, tbody) => {;
    let milestones = get_milestones(pageItem);
    console.log(milestones);
    for (let i = itemObj.answers.length - 1; i >= 0; i--){
        for (let j = milestones.milestone_time.length - 1; j >= 0; j--){
            let time_obj = new Date(milestones.milestone_time[j]);
            if (convertTime(itemObj.timestamps[i]).getTime() < time_obj.getTime()){
                let milestone_tr = construct_milestone(milestones.milestone_name[j], milestones.milestone_time[j]);
                tbody.appendChild(milestone_tr);
                milestones.milestone_name.pop();
                milestones.milestone_time.pop();
            }
        }

        let tr = document.createElement("tr");
        tr.style.backgroundColor = getColor(itemObj.itemStatus[i]);
        tr.style.color = "#FFF";

        let ans_td = document.createElement("td");
        ans_td.innerText = itemObj.answers[i];
        if (itemObj.language[i] === "ja"){ans_td.setAttribute("lang", "ja");}
        ans_td.style.textAlign = "center";

        let srs_td = document.createElement("td");
        srs_td.innerText = srs(itemObj.SRSLevel[i]) + " Level";
        srs_td.style.textAlign = "center";

        let date_td = document.createElement("td");
        date_td.innerText = fix_date(convertTime(itemObj.timestamps[i]));
        date_td.style.textAlign = "center";

        let lang_td = document.createElement("td");
        if (itemType === "radical"){
            lang_td.innerText = "Name";
        } else {
            lang_td.innerText = reviewType(itemObj.language[i]);
        }
        lang_td.style.textAlign = "center";

        tr.appendChild(lang_td);
        tr.appendChild(ans_td);
        tr.appendChild(srs_td);
        tr.appendChild(date_td);
        tbody.appendChild(tr);

        if (i === 0){
            for (let j = milestones.milestone_time.length - 1; j >= 0; j--){
                let time_obj = new Date(milestones.milestone_time[j]);
                let milestone_tr = construct_milestone(milestones.milestone_name[j], milestones.milestone_time[j]);
                tbody.appendChild(milestone_tr);
            }
        }
    }
}

// Converts the answer status to the corresponding color
const getColor = (status) => {
    switch (status) {
        case "correct": return "#88CC00";break;
        case "incorrect": return "#FF0033"; break;
        case "WKO_ignored": return "#FFCC00"; break;
    }
}

// Converts the language of the item to get the review type
const reviewType = (lang) => {
    if (lang === "ja"){return "Reading"}
    else {return "Meaning"}
}

const convertTime = (time) => {
    let first_half = time.substr(0,time.indexOf(","));
    let second_half = time.substr(time.indexOf(" ") + 1, time.length);
    first_half = first_half.replaceAll("/", "-");
    let converted_time = new Date(first_half + "T" + second_half);
    return converted_time;
}

// Gets the srs level from the srs value
const srs = (srsKey) => {
    switch (srsKey){
        case -1: return "Missing";break;
        case 1: return "Apprentice 1";break;
        case 2: return "Apprentice 2";break;
        case 3: return "Apprentice 3";break;
        case 4: return "Apprentice 4";break;
        case 5: return "Guru 1";break;
        case 6: return "Guru 2";break;
        case 7: return "Master";break;
        case 8: return "Enlightened";break;
        default: return "";break;
    }
}

const get_milestones = (item_id) => {
    let milestonesArr = ["unlock", "lesson", "guru", "burn", "resurrect"];
    let milestones = {"milestone_name": [], "milestone_time": [],}
    for (let i = 0; i < milestonesArr.length; i++){
        let milestone_time = additional_info(item_id, milestonesArr[i]);
        if (milestone_time !== null){
            milestones.milestone_name.push(milestonesArr[i]);
            milestones.milestone_time.push(milestone_time);
        }
    }
    return milestones;
}

const construct_milestone = (milestone, time) => {
    let milestone_tr = document.createElement("tr");
    milestone_tr.style.backgroundColor = milestone_color(milestone)
    milestone_tr.style.lineHeight = "1.2rem";
    milestone_tr.style.color = "#FFF";
    milestone_tr.style.fontWeight = "500";

    let type_td = document.createElement("td");
    type_td.innerText = "Milestone";
    type_td.style.textAlign = "center";

    let milestone_td = document.createElement("td");
    milestone_td.innerText = milestone_text(milestone);
    milestone_td.style.textAlign = "center";

    let time_td = document.createElement("td");
    let time_obj = new Date(time);
    time_td.innerText = fix_date(time_obj);
    time_td.style.textAlign = "center";


    milestone_tr.appendChild(type_td);
    milestone_tr.appendChild(document.createElement("td"));
    milestone_tr.appendChild(milestone_td);
    milestone_tr.appendChild(time_td);
    return milestone_tr;
}

const fix_date = (time) => {
    let first_half = time.toDateString();
    let second_half = time.toLocaleTimeString()
    return first_half + ", " + second_half;
}

const milestone_color = (milestone) => {
    switch (milestone){
        case "unlock": return "#A4A4A4";break;
        case "lesson": return "#F400A2";break;
        case "guru": return "#9D34B7";break;
        case "burn": return "#4F4F4F";break;
        case "resurrect": return "#FAAF0E";break;
    }
}

const milestone_text = (milestone) => {
    switch (milestone){
        case "unlock": return "Unlocked";break;
        case "lesson": return "Completed Lesson";break;
        case "guru": return "First Guru";break;
        case "burn": return "Burned";break;
        case "resurrect": return "Resurrected";break;
    }
}


function initiate() {
    'use strict';

    // Checks for the review page to collect answer data
    if (/\/review\/session+/.test(url)){
        input = document.getElementById("user-response");
        itemElem = document.getElementById("character");

        let fieldsetElem = input.parentElement;
        let lastClass = fieldsetElem.classList[0];

        statusChecker(fieldsetElem, lastClass);
    }
    // Checks for an item info page to display the data
    if (/\/radicals\/+/.test(url) || /\/kanji\/+/.test(url) || /\/vocabulary\/+/.test(url)){

        // Gets the page's item
        pageItem = parseInt(document.querySelector('meta[name=subject_id]').content);
        itemType = url.substring(url.indexOf("wanikani.com/") + 13, url.lastIndexOf("/"));
        if (itemType === "radicals"){itemType = "radical"};

        // Adds navigation button to top bar
        const history_li = document.createElement("li");
        const history_a = document.createElement("a");
        history_a.innerText = "Review History";
        history_a.setAttribute("href", "#history");
        history_li.appendChild(history_a);
        if (document.querySelector("[href='#progress']")){
            let progress_li = document.querySelector("[href='#progress']").parentNode;
            document.querySelector(".page-list-header").parentNode.insertBefore(history_li, progress_li);
        } else {
            document.querySelector(".page-list-header").parentNode.appendChild(history_li);
        }

        // Section element for the review history
        const reviewHistorySection = document.createElement("section");
        reviewHistorySection.setAttribute("id", "history");
        reviewHistorySection.style.fontFamily = '"Ubuntu", Helvetica, Arial, sans-serif';
        reviewHistorySection.style.fontSize = "16px";

        // Title for the section
        const sectionHead = document.createElement("h2");
        sectionHead.innerText = "Review History";

        // Table element
        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.lineHeight = "1.5rem";

        // Body section of the table
        const tbody = document.createElement("tbody");

        // Headers for the table
        let headers = createHeaders();
        headers.style.position = "sticky";
        headers.style.top = "0";
        headers.style.backgroundColor = "#eee";
        headers.style.boxShadow = "0 2px 2px -1px rgba(0, 0, 0, 0.2)";
        table.appendChild(headers);

        // Table wrapped in a div to allow scrolling when the table is taller than 500px
        const tableDiv = document.createElement("div");

        // Displays the table if item data is found, otherwise displays a messsage
        if (WKAnswerHistory[itemType][pageItem]){
            buildTable(WKAnswerHistory[itemType][pageItem], tbody);
            table.appendChild(tbody);

            tableDiv.style.maxHeight = "500px";
            tableDiv.style.display = "block";
            tableDiv.style.overflowY = "auto";

            tableDiv.appendChild(table);
        } else {
            tableDiv.innerText = ("No answers have been recorded for this item yet.");
            tableDiv.style.color = "#666";
        }
        reviewHistorySection.appendChild(sectionHead);
        reviewHistorySection.appendChild(tableDiv);

        if (itemType === "radical"){
            document.getElementById("information").parentNode.appendChild(reviewHistorySection);
        } else {
            document.getElementById("meaning").parentNode.appendChild(reviewHistorySection);
        }
    }
};