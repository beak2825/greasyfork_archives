// ==UserScript==
// @name         Sort Paiza Results
// @name:ja      Sort Paiza Results
// @namespace    https://satoh.dev/
// @version      0.2
// @description  This will sort the Paiza results by rank.　Also sort the results for each question of each rank by score.
// @description:ja  Paizaの結果一覧ページをランク順、点数順にソートするユーザースクリプト
// @author       Soh Satoh
// @match        https://paiza.jp/career/mypage/results
// @icon         https://www.google.com/s2/favicons?domain=paiza.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433619/Sort%20Paiza%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/433619/Sort%20Paiza%20Results.meta.js
// ==/UserScript==

window.onload = async () => {
    'use strict';

    const getRetestResults = async () => {
        const url = 'https://paiza.jp/career/mypage/retry-results';
        const json = {};
        const html = await fetch(url, {
            method: 'GET'
        }).then(function(response) {
            return response.text();
        }).then(function(data) {
            const parser = new DOMParser();
            return new DOMParser().parseFromString(data, 'text/html');
        });
        return getBoxJsonFromSelectors(html.querySelectorAll('.basicBox'));
    }

    const getBoxJsonFromSelectors = (sels) => {
        const boxJson = {};
        for (const box of sels) {
            const prob_name = box.querySelector('.boxT').querySelector('span').textContent.replaceAll('\n', '').replaceAll(/[^0-9a-z]/gi, '');
            const prob_rank = box.querySelector('.boxT').querySelector('img').alt.slice(-1);
            const scoreSel = (() => {
                let sel = null;
                for (const span of box.querySelector('.boxM').querySelectorAll('span')) {
                    if (span.innerHTML.includes('点')) sel = span;
                }
                return sel;
            })();
            if (!boxJson[prob_rank]) boxJson[prob_rank] = [];
            boxJson[prob_rank].push({
                'name': prob_name,
                'sel': box,
                'scoreSel': scoreSel,
                'score': parseFloat(scoreSel.innerHTML),
            })
        }
        const orderedJson = Object.keys(boxJson).sort().reduce((obj, key) => {
            obj[key] = boxJson[key];
            return obj;
        }, {});
        for (const key in orderedJson) {
            orderedJson[key].sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
        }
        return orderedJson;
    };

    const mergeResultsWithRetestResults = (baseJson, retestJson) => {
        for (const key in retestJson) {
            for (const item of retestJson[key]) {
                const name = item.name;
                const score = item.score;
                for (const bItem of baseJson[key]) {
                    if (bItem.name == name && bItem.score != score) {
                        bItem.scoreSel.innerText += ' (再テスト結果: ' + score + '点)';
                    }
                }
            }
        }
    }

    const appendElementToParent = (json, parent) => {
        for (const key in json) {
            const newDiv = document.createElement('div');
            newDiv.classList.add(key);

            const titleDiv = document.createElement('div');
            titleDiv.classList.add('m-heading-area', 'm-heading-area--narrow', 'm-heading-area--border', 'u-mb--2rem');

            const title = document.createElement('h2');
            title.classList.add('a-heading-primary-xlarge', 'rank-title');
            const titleContent = document.createTextNode(key + 'ランク');
            title.appendChild(titleContent);

            titleDiv.appendChild(title);
            newDiv.appendChild(titleDiv);

            const ul = document.createElement('ul');
            for (const item of boxJson[key]) {
                const li = document.createElement('li');
                li.appendChild(item.sel);
                ul.appendChild(li);
            }
            newDiv.appendChild(ul);

            title.addEventListener('click', () => {
                ul.style.display = ul.style.display == 'none' ? 'block' : 'none';
            });

            parent.appendChild(newDiv);
        }
    };

    const boxes = document.querySelectorAll('.basicBox');
    const parent = boxes[0].parentElement;
    const boxJson = getBoxJsonFromSelectors(boxes);
    const retestJson = await getRetestResults();
    mergeResultsWithRetestResults(boxJson, retestJson);
    appendElementToParent(boxJson, parent);
};