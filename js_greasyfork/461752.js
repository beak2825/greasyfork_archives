// ==UserScript==
// @name         sortClanIvent
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Сортировка Клана по очкам ивента
// @author       Яшка
// @match      https://www.heroeswm.ru/clan_info.php?id=*
// @match      https://www.lordswm.com/clan_info.php?id=*
// @include        https://www.heroeswm.ru/clan_info.php?id=*
// @grant        none
// @license Яшка
// @downloadURL https://update.greasyfork.org/scripts/461752/sortClanIvent.user.js
// @updateURL https://update.greasyfork.org/scripts/461752/sortClanIvent.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    let allTableArr = document.querySelectorAll(".wb");
    const tableUserInClan = allTableArr[allTableArr.length - 1]
    let allTrArr = allTableArr[allTableArr.length - 1].querySelectorAll("tr");
    let clanUserArr = []
    let clanUserStartArr = []
    const regexScore = /,/i;
    const ids = {
        sortDiv: 'sortMinUserClanScoreHwmHelper',
        sortMax: 'sortMaxUserClanScoreHwmHelper',
        sortMin: 'sortMinUserClanScoreHwmHelper',
        sortStart: 'sortStartUserClanScoreHwmHelper',
    }

    function createDiv(html, place, id, display) {
        const divHwmHelper = document.createElement("div");
        divHwmHelper.id = id;
        divHwmHelper.style.display = display;
        switch (place) {
            case 'before': {
                html.before(divHwmHelper)
                break;
            }
            default: {
                break;
            }
        }
        return divHwmHelper;
    }

    function createBtn(html, place, text, id, func) {
        const btnHwmHelper = document.createElement("a");
        btnHwmHelper.innerHTML = text;
        btnHwmHelper.id = id;
        btnHwmHelper.style.cursor = 'pointer';
        btnHwmHelper.style.border = '1px solid black';
        btnHwmHelper.style.margin = '5px';
        btnHwmHelper.style.padding = '5px';
        btnHwmHelper.style.display = 'flex';
        btnHwmHelper.style.width = 'fit-content';
        switch (place) {
            case 'before': {
                html.before(btnHwmHelper)
                break;
            }
            case 'in': {
                html.appendChild(btnHwmHelper)
            }
            default: {
                break;
            }
        }
        btnHwmHelper.addEventListener("click", () => {
            console.log(1)
            func()
        })
        return;
    }

    function SortMaxScore(a, b) {
        return b.score - a.score;
    }

    function SortMinScore(a, b) {
        return a.score - b.score;
    }

    function SortMaxClanUserScore() {
        allTrArr.forEach(td => {
            let html = td
            td.childNodes.forEach((el, index) => {
                if (index === 5) {
                    let score = el.textContent.trim();
                    clanUserArr.push({
                        html,
                        score: score !== '' ? JSON.parse(score.replace(regexScore, '')) : 0,
                    })
                }
            })
        })
        clanUserArr.sort(SortMaxScore)
        allTrArr.forEach(td => {
            td.remove()
        })
        clanUserArr.forEach(el => {
            tableUserInClan.appendChild(el.html)
        })
    }

    function SortMinClanUserScore() {
        allTrArr.forEach(td => {
            let html = td
            td.childNodes.forEach((el, index) => {
                if (index === 5) {
                    let score = el.textContent.trim();
                    clanUserArr.push({
                        html,
                        score: score !== '' ? JSON.parse(score.replace(regexScore, '')) : 0,
                    })
                }
            })
        })
        clanUserArr.sort(SortMinScore)
        allTrArr.forEach(td => {
            td.remove()
        })
        clanUserArr.forEach(el => {
            tableUserInClan.appendChild(el.html)
        })
    }

    function SortStartClanUserScore() {
        if (clanUserStartArr.length) {
            console.log('вошел')
            console.log(allTrArr)
            allTrArr.forEach(td => {
                td.remove()
            })
            clanUserStartArr.forEach(el => {
                tableUserInClan.appendChild(el.html)
            })
        }
    }

    function GetStartClanUser() {
        allTrArr.forEach(td => {
            let html = td
            td.childNodes.forEach((el, index) => {
                if (index === 5) {
                    let score = el.textContent.trim();
                    clanUserStartArr.push({
                        html,
                        score: score !== '' ? JSON.parse(score.replace(regexScore, '')) : 0,
                    })
                }
            })
        })
    }

    GetStartClanUser();
    let divSort = createDiv(tableUserInClan, 'before', ids.sortDiv, 'flex')
    createBtn(divSort, 'in', 'Сортировка ↑', ids.sortMax, () => {
        SortMaxClanUserScore()
    })
    createBtn(divSort, 'in', 'Сортировка ↓', ids.sortMin, () => {
        SortMinClanUserScore()
    })
    createBtn(divSort, 'in', 'Сборс', ids.sortStart, () => {
        SortStartClanUserScore()
    })


})();

