// ==UserScript==
// @name         Shiki Rating
// @namespace    http://shikimori.org/
// @version      2.5
// @description  Rating from shiki users
// @author       ImoutoChan
// @match        http://shikimori.org/*
// @match        https://shikimori.org/*
// @match        http://shikimori.one/*
// @match        https://shikimori.one/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441825/Shiki%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/441825/Shiki%20Rating.meta.js
// ==/UserScript==

var debug = false;

function log(message) {
    if (!debug) {
        return;
    }

    console.log('ShikiRating: ' + message);
}

function getLocale() {
    return document.querySelector('body').getAttribute('data-locale');
}

function needAddRating(urlpart) {
    return urlpart === "/animes" ||
           urlpart === "/mangas" ||
           urlpart === "/ranobe";
}

function removeLastClass(domElement) {
    var classes = domElement.classList;
    classes.remove(classes.item(classes.length - 1));
}

function setNoData(domElement) {
    var noData = document.createElement('p');
    noData.classList.add('b-nothing_here');
    noData.innerText = getLocale() === 'ru'
        ? `Недостаточно данных`
        : `Insufficient data`;

    domElement.innerHTML = '';
    domElement.appendChild(noData);

    domElement.style.textAlign = 'center';
    domElement.style.color = '#7b8084';
    domElement.style.marginTop = '15px';
}

function appendShikiRating() {
    'use strict';

    var urlpart = window.location.pathname.substring(0,7);
    log(urlpart);

    if (!needAddRating(urlpart)) {
        log('wrong page');
        return;
    }

    if (document.querySelector("#shiki-score") !== null) {
        log('already created');
        return;
    }

    if (document.querySelector(".scores > .b-rate") === null) {
        log("can't find default rating");
        return;
    }

    // get current rating element
    var malRate = document.querySelector(".scores > .b-rate");
    malRate.setAttribute('id', 'mal-score');

    // clone it to new element
    var newShikiRate = malRate.cloneNode(true);
    newShikiRate.setAttribute('id', 'shiki-score');

    // append cloned rating to parent container
    var rateContainer = document.querySelector(".scores");
    rateContainer.appendChild(newShikiRate);

    // load scores stats
    var scoreDataJson = document.querySelector("#rates_scores_stats").getAttribute("data-stats");
    var scoreData = JSON.parse(scoreDataJson);
    log(scoreDataJson);

    // set no data lable
    if (scoreData.length === 0) {
        setNoData(newShikiRate);
        return;
    }

    // calculate shiki rating
    var sumScore = 0;
    var totalCount = 0;
    for (var i = 0; i < scoreData.length; i++) {
        sumScore += scoreData[i].value * scoreData[i].key;
        totalCount += scoreData[i].value*1;
    }
    var shikiScore = sumScore / totalCount;
    var shikiScoreDigit = Math.round(shikiScore);
    log(shikiScore);

    // set number value
    var scoreElement = newShikiRate.querySelector("div.text-score > div.score-value");
    scoreElement.innerHTML = shikiScore.toFixed(2);
    removeLastClass(scoreElement);
    scoreElement.classList.add("score-" + shikiScoreDigit);

    // set stars calue
    var starElement = newShikiRate.querySelector("div.stars-container > div.stars.score");
    removeLastClass(starElement);
    starElement.style.color = '#456';
    starElement.classList.add("score-" + shikiScoreDigit);

    // load labels
    var labelData = getLocale() === 'ru' ?
            {"0":"","1":"Хуже некуда","2":"Ужасно","3":"Очень плохо","4":"Плохо","5":"Более-менее","6":"Нормально","7":"Хорошо","8":"Отлично","9":"Великолепно","10":"Эпик вин!"} :
            {"0":"","1":"Worst Ever","2":"Terrible","3":"Very Bad","4":"Bad","5":"So-so","6":"Fine","7":"Good","8":"Excellent","9":"Great","10":"Masterpiece!"};

    // set label under score
    newShikiRate.querySelector("div.text-score > div.score-notice").textContent = labelData[shikiScoreDigit];

    // set mal description label
    var malLabel = getLocale() === 'ru' ? 'На основе оценок mal' : 'From MAL users';
    malRate.insertAdjacentHTML('afterend', '<p class="score-source">' + malLabel + '</p>');

    // set shiki description label
    var shikiCountLabel = '<strong>' + totalCount + '</strong>';
    shikiCountLabel = (getLocale() === 'ru')
        ? 'На основе ' + shikiCountLabel + ' оценок shiki'
        : 'From ' + shikiCountLabel + ' shiki users';
    newShikiRate.insertAdjacentHTML('afterend', '<p class="score-counter">' + shikiCountLabel + '</p>');

    // set style for mal description label
    var malScoreLabelElement = document.querySelector('.score-source');
    malScoreLabelElement.style.marginBottom = '15px';
    malScoreLabelElement.style.textAlign = 'center';
    malScoreLabelElement.style.color = '#7b8084';

    // set style for shiki description label
    var shikiScoreLabelElement = document.querySelector('.score-counter');
    shikiScoreLabelElement.style.textAlign = 'center';
    shikiScoreLabelElement.style.color = '#7b8084';
}

function ready(fn) {
    document.addEventListener('page:load', fn);
    document.addEventListener('turbolinks:load', fn);

    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(appendShikiRating);
