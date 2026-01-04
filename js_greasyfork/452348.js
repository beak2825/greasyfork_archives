// ==UserScript==
// @name         SubsPlease qBittorrent RSS Easy Import
// @namespace    https://greasyfork.org/en/users/738914-ibreakeverything
// @version      1.1
// @description  Click on the air time and you will get a json file with the RSS for qBittorrent containing a rule for that show
// @author       iBreakEverything
// @match        https://subsplease.org/*
// @icon         https://subsplease.org/favicon.ico
// @license      CC BY-SA 3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452348/SubsPlease%20qBittorrent%20RSS%20Easy%20Import.user.js
// @updateURL https://update.greasyfork.org/scripts/452348/SubsPlease%20qBittorrent%20RSS%20Easy%20Import.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

const DOWNLOAD_PATH = ""; // absolute or relative (to the path in the program settings) path
const CATEGORY = ""; // if you use categories (e.g. SubsPlease, Anime, etc.)


(function() {
    'use strict';
    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});
})();


function check(changes, observer) {
    if (document.querySelector("#full-schedule-table") || document.querySelector(".schedule-widget-item")) {
        observer.disconnect();

        if (document.querySelector("#full-schedule-table")) {
            addFullScheduleButtons();
        }

        if (document.querySelector(".schedule-widget-item")) {
            addTodayScheduleButtons();
        }
    }
}

/**
 * One click download buttons for "today schedule" table.
 */
function addTodayScheduleButtons() {
    // US 0-6 Sunday to Saturday => ISO 1-7 Monday t Sunday
    const day = new Date().getDay() || 7;
    const scheduleToday = document.querySelectorAll('.schedule-widget-item');
    for (let item of scheduleToday) {
        let title = item.querySelector('.schedule-widget-show').innerText.trim();
        // char "✔" may appear: split and get last item
        let time = item.querySelector('.schedule-widget-time').innerText.split('✔').at(-1).trim();
        item.querySelector('.schedule-widget-time').addEventListener("click", function () { makeRssImport(title, time, day); }, false);
    }
}

/**
 * One click download buttons for "full schedule" table.
 */
function addFullScheduleButtons() {
    // day counter, incremented at every day separator
    let day = 0;
    const tableElements = document.querySelector('#full-schedule-table').children;
    for (let element of tableElements) {
        // element is a separator
        if (element.classList.contains('day-of-week')) {
            day++;
        }
        // element is a show entry
        else if (element.classList.contains('all-schedule-item')) {
            let title = element.querySelector('.all-schedule-show').innerText.trim();
            let time = element.querySelector('.all-schedule-time').innerText.trim();
            let safeDay = day;
            element.querySelector('.all-schedule-time').addEventListener("click", function () { makeRssImport(title, time, safeDay); }, false);
        }
    }
}

/**
 * Create RSS payload with qBittorrent format.
 */
function makeRssImport(title, time, day) {
    // Day dictionary for easy sort
    const dayString = { 1:'M', 2:'T', 3:'W', 4:'T', 5:'F', 6:'Sa', 7:'Su' };
	let name = `${day}[${dayString[day]}][${time}] ${title}`;
    let feedProperties = {
        "addPaused": null,
        "affectedFeeds": [
            "https://subsplease.org/rss/?t&r=sd",
            "https://subsplease.org/rss/?t&r=720",
            "https://subsplease.org/rss/?t&r=1080",
            "https://subsplease.org/rss/?t"
        ],
        "assignedCategory": CATEGORY,
        "enabled": true,
        "episodeFilter": "",
        "ignoreDays": 0,
        "lastMatch": "",
        "mustContain": title,
        "mustNotContain": "",
        "previouslyMatchedEpisodes": [],
        "savePath": DOWNLOAD_PATH,
        "smartFilter": false,
        "torrentContentLayout": null,
        "useRegex": false
    };
    // dynamic object key, as it's used as RSS entry name
    let payload = JSON.stringify({[name]: feedProperties});

    downloadRssFile(title, payload);
}

/**
 * Download the json RSS file.
 * https://stackoverflow.com/a/18197341/5853386
 */
function downloadRssFile(filename, payload) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(payload));
  element.setAttribute('download', `${filename}_RSS.json`);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
