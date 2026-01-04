// ==UserScript==
// @name         Shikimori Rating
// @namespace    http://shikimori.org/
// @version      3.0.0
// @description  Ratings from Shikimori users
// @author       ImoutoChan
// @match        *://shikimori.org/*
// @match        *://shikimori.one/*
// @match        *://shikimori.me/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510941/Shikimori%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/510941/Shikimori%20Rating.meta.js
// ==/UserScript==

const DEBUG_MODE = false;

const log = (message) => {
    if (DEBUG_MODE) {
        console.log(`ShikiRating: ${message}`);
    }
};

const getLocale = () => document.body.getAttribute('data-locale');

const shouldAddRating = (urlPart) => ["/animes", "/mangas", "/ranobe"].includes(urlPart);

const removeLastClass = (element) => {
    const classes = element.classList;
    if (classes.length > 0) {
        classes.remove(classes[classes.length - 1]);
    }
};

const displayNoDataMessage = (element) => {
    element.innerHTML = '';
    const noDataMessage = document.createElement('p');
    noDataMessage.className = 'b-nothing_here';
    noDataMessage.innerText = getLocale() === 'ru' ? 'Недостаточно данных' : 'Insufficient data';
    Object.assign(noDataMessage.style, {
        textAlign: 'center',
        color: '#7b8084',
        marginTop: '15px',
    });
    element.appendChild(noDataMessage);
};

const addShikiRating = () => {
    'use strict';

    const urlPart = window.location.pathname.substring(0, 7);
    log(urlPart);

    if (!shouldAddRating(urlPart)) {
        log('Not a valid page for rating');
        return;
    }

    if (document.querySelector("#shiki-score")) {
        log('Rating already exists');
        return;
    }

    const malRatingElement = document.querySelector(".scores > .b-rate");
    if (!malRatingElement) {
        log("Default rating not found");
        return;
    }

    malRatingElement.id = 'mal-score';

    const shikiRatingElement = malRatingElement.cloneNode(true);
    shikiRatingElement.id = 'shiki-score';

    const scoresContainer = document.querySelector(".scores");
    scoresContainer.appendChild(shikiRatingElement);

    const scoreDataJson = document.querySelector("#rates_scores_stats")?.getAttribute("data-stats");
    if (!scoreDataJson) {
        log('No score data found');
        displayNoDataMessage(shikiRatingElement);
        return;
    }

    let scoreData;
    try {
        scoreData = JSON.parse(scoreDataJson);
    } catch (error) {
        log('Error parsing score data');
        displayNoDataMessage(shikiRatingElement);
        return;
    }

    if (!scoreData || scoreData.length === 0) {
        displayNoDataMessage(shikiRatingElement);
        return;
    }

    const { totalScore, totalVotes } = scoreData.reduce((acc, [score, count]) => {
        acc.totalScore += score * count;
        acc.totalVotes += count;
        return acc;
    }, { totalScore: 0, totalVotes: 0 });

    const shikiScore = totalScore / totalVotes;
    const roundedScore = Math.floor(shikiScore);
    log(shikiScore);

    const scoreValueElement = shikiRatingElement.querySelector("div.text-score > div.score-value");
    scoreValueElement.innerHTML = shikiScore.toFixed(2);
    removeLastClass(scoreValueElement);
    scoreValueElement.classList.add(`score-${roundedScore}`);

    const starContainerElement = shikiRatingElement.querySelector("div.stars-container > div.stars.score");
    removeLastClass(starContainerElement);
    starContainerElement.style.color = '#456';
    starContainerElement.classList.add(`score-${Math.round(shikiScore)}`);

    const scoreLabels = getLocale() === 'ru' ?
        { "0": "", "1": "Хуже некуда", "2": "Ужасно", "3": "Очень плохо", "4": "Плохо", "5": "Более-менее", "6": "Нормально", "7": "Хорошо", "8": "Отлично", "9": "Великолепно", "10": "Эпик вин!" } :
        { "0": "", "1": "Worst Ever", "2": "Terrible", "3": "Very Bad", "4": "Bad", "5": "So-so", "6": "Fine", "7": "Good", "8": "Excellent", "9": "Great", "10": "Masterpiece!" };

    shikiRatingElement.querySelector("div.text-score > div.score-notice").textContent = scoreLabels[roundedScore];

    const malSourceLabel = getLocale() === 'ru' ? 'На основе оценок MAL' : 'From MAL users';
    malRatingElement.insertAdjacentHTML('afterend', `<p class="score-source">${malSourceLabel}</p>`);

    const votesWord = (totalVotes % 10 === 1 && totalVotes % 100 !== 11) ? 'оценки' : 'оценок';
    const voteCountLabel = `<strong>${totalVotes}</strong>`;
    const shikiSourceLabel = getLocale() === 'ru' ?
        `На основе ${voteCountLabel} ${votesWord} Shikimori` :
        `From ${voteCountLabel} Shikimori users`;
    shikiRatingElement.insertAdjacentHTML('afterend', `<p class="score-counter">${shikiSourceLabel}</p>`);

    const malScoreLabelElement = document.querySelector('.score-source');
    Object.assign(malScoreLabelElement.style, {
        marginBottom: '15px',
        textAlign: 'center',
        color: '#7b8084',
    });

    const shikiScoreLabelElement = document.querySelector('.score-counter');
    Object.assign(shikiScoreLabelElement.style, {
        textAlign: 'center',
        color: '#7b8084',
    });
};

const onDocumentReady = (callback) => {
    document.addEventListener('page:load', callback);
    document.addEventListener('turbolinks:load', callback);

    if (document.readyState !== "loading") {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
};

onDocumentReady(addShikiRating);