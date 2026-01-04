// ==UserScript==
// @name         Ignore 10
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Allows to ignore 10-point ratings in average score (Shiki)
// @author       chabab
// @match        https://shikimori.one/*
// @icon         https://shikimori.one/assets/layouts/l-top_menu-v2/glyph.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541214/Ignore%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/541214/Ignore%2010.meta.js
// ==/UserScript==

'use strict';

function insertBlock(source, scoresNum) {
    const malScore = document.querySelector('.scores');
    malScore.style.alignItems = 'center';

    const malScoreInfo = document.createElement('p');
    malScoreInfo.innerHTML = `На основе оценок MAL`;
    malScoreInfo.setAttribute('style', 'margin-bottom: 15px;');

    const labelDuplicate = document.querySelector('.scores .score-source');
    if (labelDuplicate) {
        labelDuplicate.after(malScoreInfo);
        labelDuplicate.remove();
    } else {
        malScore.appendChild(malScoreInfo);
    }

    const bRate = document.querySelector('.scores .b-rate');
    bRate.setAttribute('id', 'MAL-rate');

    const sourceScore = bRate.cloneNode(true);
    sourceScore.setAttribute('id', `${source}-rate`);

    const scoreInfo = document.createElement('p');
    scoreInfo.innerHTML = `На основе <span style="font-weight: 1000;">${scoresNum}</span> оценок ${source}`;
    scoreInfo.setAttribute('style', 'margin-bottom: 12px');
    scoreInfo.setAttribute('id', `${source}-scores`);

    malScore.appendChild(sourceScore);
    malScore.appendChild(scoreInfo);

    const blockParent = malScore.parentElement;
    const scoresHeader = document.createElement('div');
    const textHeader = document.querySelector('.block .m5');
    const button = document.createElement('div');
    const buttonText = document.createElement('span');

    textHeader.style.width = '-moz-available';
    button.appendChild(buttonText);
    button.style.position = 'unset';
    button.style.height = 'fit-content'
    button.style.alignContent = 'center';
    scoresHeader.setAttribute('id', 'ignore-10');
    scoresHeader.style.display = 'flex';
    scoresHeader.style.alignItems = 'center';
    scoresHeader.style.marginBottom = '12px';
    button.classList.add('b-link_button');
    scoresHeader.append(button);

    blockParent.insertBefore(scoresHeader, malScore);
    scoresHeader.insertBefore(textHeader, button);

    const scoreNotices = [
        {"10": "Эпик вин!", "9": "Великолепно", "8": "Отлично", "7": "Хорошо", "6": "Нормально", "5": "Более-менее", "4": "Плохо", "3": "Очень плохо", "2": "Ужасно", "1": "Хуже некуда"}
    ]

    return [button, buttonText, scoreNotices];
};

function appendShikiRating() {

    const shikiRating = () => {
        if (isIgnore == false) {
            isIgnore = true;
            shikiBlock[1].innerText = 'w/ 10';

            const oldStarClass = Array.from(starScore.classList).find(c => c.startsWith('score-'));
            if (oldStarClass) {
                starScore.classList.remove(oldStarClass);
            }

            const oldTextClass = Array.from(textScore.classList).find(c => c.startsWith('score-'));
            if (oldTextClass) {
                textScore.classList.remove(oldTextClass);
            }

            elemSum = elemSum - elemSumDiff
            elemCount = elemCount - elemCountDiff
            shikiAvgScore = elemSum / elemCount
            let textScoreDec = Math.round(shikiAvgScore);
            let textScoreDecFloor = Math.floor(shikiAvgScore);
            textScore.innerHTML = shikiAvgScore.toFixed(2);
            scoresCount.innerHTML = `На основе <span style="font-weight: 1000;">${elemCount}</span> оценок Shiki`;

            for (const elem of shikiBlock[2]) {
                for (const key of Object.keys(elem)) {
                    if (key == textScoreDecFloor) {
                        scoreNotice.innerHTML = elem[key]
                    }
                }
            }

            textScore.classList.add(`score-${textScoreDec}`);
            starScore.classList.add(`score-${textScoreDec}`);

        } else {
            isIgnore = false;
            shikiBlock[1].innerText = 'w/o 10';

            const oldStarClass = Array.from(starScore.classList).find(c => c.startsWith('score-'));
            if (oldStarClass) {
                starScore.classList.remove(oldStarClass);
            }

            const oldTextClass = Array.from(textScore.classList).find(c => c.startsWith('score-'));
            if (oldTextClass) {
                textScore.classList.remove(oldTextClass);
            }

            elemSum = elemSum + elemSumDiff
            elemCount = elemCount + elemCountDiff
            shikiAvgScore = elemSum / elemCount
            let textScoreDec = Math.round(shikiAvgScore);
            let textScoreDecFloor = Math.floor(shikiAvgScore);
            textScore.innerHTML = shikiAvgScore.toFixed(2);
            scoresCount.innerHTML = `На основе <span style="font-weight: 1000;">${elemCount}</span> оценок Shiki`;

            for (const elem of shikiBlock[2]) {
                for (const key of Object.keys(elem)) {
                    if (key == textScoreDecFloor) {
                        scoreNotice.innerHTML = elem[key]
                    }
                }
            }

            textScore.classList.add(`score-${textScoreDec}`);
            starScore.classList.add(`score-${textScoreDec}`);
        }
    }

    if (document.querySelector('#Shiki-rate')) {
        console.log('Shiki rating block already exists. Skipping.');
        return;
    }

    let isIgnore = false;

    const dataBlock = document.querySelector('#rates_scores_stats');
    if (!dataBlock) {
        return ;
    }
    const dataJSON = dataBlock.getAttribute('data-stats')
    const data = JSON.parse(dataJSON);

    let elemSum = 0;
    let elemCount = 0;
    let elemSumDiff = 0;
    let elemCountDiff = 0;

    for (const elem of data) {
        if (elem[0] == '10') {
            elemSumDiff = elem[0] * elem[1];
            elemCountDiff = elem[1];
        }
        elemSum += (elem[0] * elem[1]);
        elemCount += elem[1];
    }

    let shikiAvgScore = elemSum / elemCount;
    const shikiBlock = insertBlock("Shiki", elemCount);

    let scoresCount = document.querySelector('#Shiki-scores');
    let scoreNotice = document.querySelector('#Shiki-rate .text-score .score-notice');
    let textScore = document.querySelector('#Shiki-rate .text-score .score-value');
    let starScore = document.querySelector('#Shiki-rate .stars-container .stars');
    starScore.setAttribute('style', 'color: rgb(68, 85, 102)');

    shikiRating();

    shikiBlock[0].addEventListener('click', shikiRating)

    const shikiBRate = document.querySelector('#Shiki-rate')
    shikiBRate.addEventListener('mouseenter', shikiRating)
    shikiBRate.addEventListener('mouseleave', shikiRating)
    //console.log(isIgnore)
};

function ready(fn) {
    document.addEventListener('page:load', fn);
    document.addEventListener('turbolinks:load', fn);

    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(appendShikiRating);
