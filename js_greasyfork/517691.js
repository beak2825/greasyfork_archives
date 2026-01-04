// ==UserScript==
// @name         키움 카드 자동맞추기
// @namespace    https://meda.tistory.com/
// @description  키움증권 카드를 자동으로 맞춰줍니다
// @author       You
// @match        https://www.kiwoom.com/e/m/home/event/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kiwoom.com
// @grant        none
// @version 0.0.1.20241116195843
// @downloadURL https://update.greasyfork.org/scripts/517691/%ED%82%A4%EC%9B%80%20%EC%B9%B4%EB%93%9C%20%EC%9E%90%EB%8F%99%EB%A7%9E%EC%B6%94%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/517691/%ED%82%A4%EC%9B%80%20%EC%B9%B4%EB%93%9C%20%EC%9E%90%EB%8F%99%EB%A7%9E%EC%B6%94%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let savedSymbolMap = null;
    let isAutoMatching = false;
    let clickQueue = [];
    let isProcessing = false;

    // 버튼 생성 함수
    function createButton(text, onClick, offset) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = `${20 + offset}px`;
        button.style.zIndex = '9999';
        button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        button.style.color = 'white';
        button.style.padding = '10px 20px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', onClick);
        return button;
    }

    // 심볼맵 생성 함수
    function createSymbolMap() {
        const newMap = new Map();
        const gameList = document.querySelector('.game_ing');

        if (!gameList) return;

        const items = gameList.querySelectorAll('li');
        items.forEach((item, index) => {
            const imgElement = item.querySelector('.card.front img');
            if (imgElement) {
                const srcUrl = imgElement.getAttribute('data-savepage-src') || imgElement.src;
                const symbolNumber = srcUrl.match(/symbol(\d+)\.png/);
                if (symbolNumber) {
                    newMap.set(index, parseInt(symbolNumber[1]));
                }
            }
        });
        return newMap;
    }

    // 카드 클릭 함수
    async function clickCard(index) {
        const items = document.querySelectorAll('.game_ing li');
        if (items[index]) {
            items[index].click();
        }
    }

    // 매칭 쌍 찾기 함수
    function findMatchingPairs(map) {
        const pairs = [];
        const numberCounts = new Map();

        map.forEach((value, key) => {
            if (!numberCounts.has(value)) {
                numberCounts.set(value, []);
            }
            numberCounts.get(value).push(key);
        });

        numberCounts.forEach((indices, number) => {
            if (indices.length === 2) {
                pairs.push(indices);
            }
        });

        return pairs;
    }

    // 자동 매칭 처리 함수
    async function processClickQueue() {
        if (isProcessing || clickQueue.length === 0) return;

        isProcessing = true;

        while (clickQueue.length > 0) {
            const pair = clickQueue.shift();
            await clickCard(pair[0]);
            await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 400) + 200)); // 200~400ms
            await clickCard(pair[1]);
            await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 400) + 200)); // 200~400ms
        }

        isProcessing = false;
        if (clickQueue.length === 0) {
            isAutoMatching = false;
            matchClick.textContent = '자동매칭';
            matchClick.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        }
    }

    // 암기 기능
    function ankiFunction() {
        savedSymbolMap = createSymbolMap();
        if (savedSymbolMap) {
            // prize.long 클래스를 가진 모든 요소 찾기
            const prizeElements = document.querySelectorAll('.prize.long');
            // 각 요소의 내용을 카드 배치 저장 메시지로 변경
            prizeElements.forEach(element => {
                element.textContent = '현재 카드 배치가 저장되었습니다!';
            });
            console.log('현재 카드 배치 저장됨:', Object.fromEntries(savedSymbolMap));
        }
    }

    // 자동 매칭 기능
    function matchClickFunction() {
        if (!savedSymbolMap) {
            const prizeElements = document.querySelectorAll('.prize.long');
            prizeElements.forEach(element => {
                element.textContent = '먼저 암기 버튼을 눌러 카드 배치를 저장해주세요!';
            });
            return;
        }

        isAutoMatching = !isAutoMatching;
        matchClick.textContent = isAutoMatching ? '중지' : '자동매칭';
        matchClick.style.backgroundColor = isAutoMatching ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.5)';

        if (isAutoMatching) {
            clickQueue = findMatchingPairs(savedSymbolMap);
            processClickQueue();
        }
    }

    // 버튼 생성 및 추가
    const anki = createButton('암기', ankiFunction, 0);
    const matchClick = createButton('자동매칭', matchClickFunction, 90);
    document.body.appendChild(anki);
    document.body.appendChild(matchClick);
})();