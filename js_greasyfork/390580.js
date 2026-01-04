// ==UserScript==
// @name         Shikimori: last currently released episode
// @name:ru      Шикимори: дата последнего вышедшего эпизода
// @namespace    https://shikimori.one
// @version      0.3
// @description  Shows the date of the last currently released episode
// @description:ru Показывает дату последней на данный момент вышедшей серии
// @author       BoberMod
// @match        https://shikimori.org/animes/*
// @match        https://shikimori.one/animes/*
// @match        https://shikimori.me/animes/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390580/Shikimori%3A%20last%20currently%20released%20episode.user.js
// @updateURL https://update.greasyfork.org/scripts/390580/Shikimori%3A%20last%20currently%20released%20episode.meta.js
// ==/UserScript==

function showDate() {
    "use strict";

    if (!document.querySelector('.b-anime_status_tag')?.classList.contains("ongoing")) return;

    const lastEpisodeDateSelector = document.querySelector(".b-menu-links.menu-topics-block.history .b-menu-line .time time");
    const nextEpisode = document.querySelectorAll(".b-entry-info .line-container")[2];

    //const lastEpisodeDate = lastEpisodeDateSelector.innerText;
    const newInfoLine = createNewInfoLine("Последний эпизод: ", lastEpisodeDateSelector.cloneNode(true));

    nextEpisode.insertAdjacentElement('beforebegin', newInfoLine);
}

function createNewInfoLine(key, value) {
    let lineContainer = document.createElement('div');
    lineContainer.setAttribute("class", "line-container");

    let lineElement = document.createElement('div');
    lineElement.setAttribute("class", "line");
    lineContainer.append(lineElement);

    let keyElement = document.createElement('div');
    keyElement.setAttribute("class", "key");
    keyElement.innerText = key;
    lineElement.append(keyElement);

    let valueElement = value;
    valueElement.setAttribute("class", "value");
    lineElement.append(valueElement);

    return lineContainer;
}

function onload(fn) {
    document.addEventListener('page:load', fn);
    document.addEventListener('turbolinks:load', fn);

    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

onload(showDate);