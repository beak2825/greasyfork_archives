// ==UserScript==
// @name         RealShikiRate
// @version      0.2
// @description  Отображает реальный рейтинг Аниме, Манги и Ранобэ на сайте Shikimori
// @author       vuchaev2015
// @run-at       document-start
// @match        https://shikimori.me/animes/*
// @match        https://shikimori.me/ranobe/*
// @match        https://shikimori.me/mangas/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shikimori.me
// @grant        none
// @namespace https://greasyfork.org/users/997663
// @downloadURL https://update.greasyfork.org/scripts/470671/RealShikiRate.user.js
// @updateURL https://update.greasyfork.org/scripts/470671/RealShikiRate.meta.js
// ==/UserScript==
document.addEventListener('DOMContentLoaded', () => {
    const ratesScoresStats = document.querySelector('#rates_scores_stats');
    console.log(ratesScoresStats);
    let total = 0;
    let count = 0;

    const stats = JSON.parse(ratesScoresStats.dataset.stats);
    stats.forEach(stat => {
        const x_label = stat[0];
        const value = stat[1];
        console.log(`x_label: ${x_label}, value: ${value}`);
        total += parseInt(x_label) * parseInt(value);
        count += parseInt(value);
    });
    const rating = total / count;
    console.log(`Overall rating (out of 10): ${rating.toFixed(2)}`);

    const ratingBlock = document.querySelector('.block[itemprop="aggregateRating"]');
    const subheadline = ratingBlock.querySelector('.subheadline');
    subheadline.textContent = 'рейтинг myanimelist';

    const newBlock = ratingBlock.cloneNode(true);
    newBlock.querySelector('.subheadline').textContent = 'рейтинг shikimori';
    newBlock.querySelector('.score-value').textContent = rating.toFixed(2);
    newBlock.querySelector('.stars.score').classList.remove(`score-${Math.round(rating)}`);
    newBlock.querySelector('.stars.score').classList.add(`score-${Math.round(rating)}`);

    const scoreNoticeTexts = {
        '0': '',
        '1': 'Хуже некуда',
        '2': 'Ужасно',
        '3': 'Очень плохо',
        '4': 'Плохо',
        '5': 'Более-менее',
        '6': 'Нормально',
        '7': 'Хорошо',
        '8': 'Отлично',
        '9': 'Великолепно',
        '10': 'Эпик вин!'
    };

    newBlock.querySelector('.score-notice').textContent = scoreNoticeTexts[Math.floor(rating)];

    ratingBlock.insertAdjacentElement('afterend', newBlock);

});