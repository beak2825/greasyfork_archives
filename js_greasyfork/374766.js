// ==UserScript==
// @name         NamuLiveTools
// @namespace    http://tampermonkey.net/
// @version      18.6.17.1
// @description  나무라이브 각종 재밌는 툴들
// @include      https://namu.live/*
// @author       StarBiologist
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/374766/NamuLiveTools.user.js
// @updateURL https://update.greasyfork.org/scripts/374766/NamuLiveTools.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.querySelector('form.write-area') !== null) {
        // 버튼 영역 만들기
        let anotherBtns = document.createElement("div");
        anotherBtns.classList.add("otherBtns");
        let jusawiDice = document.createElement("button");
        // 주사위 버튼
        jusawiDice.classList.add("btn");
        jusawiDice.textContent = "주사위";
        anotherBtns.appendChild( jusawiDice );
        let writeArea = document.querySelector('.write-area');
        writeArea.appendChild( anotherBtns );
        jusawiDice.addEventListener('click', function() {
            let randomNum = Math.floor(Math.random() * 100) + 1;
            document.querySelector('form.write-area > div.input > textarea.form-control').value = "생성된 숫자는 " + randomNum + "입니다."
        });
    }
    if (document.querySelector('aside.right-sidebar') !== null) {
        // 끝말잇기 영역 만들기
        let wordChainDiv = document.createElement("div");
        wordChainDiv.classList.add("sidebar-item");
        let rightAside = document.querySelector('.right-sidebar');
        rightAside.appendChild( wordChainDiv );
        let wordChainTitle = document.createElement("div");
        wordChainTitle.classList.add("item-title");
        wordChainTitle.textContent = "끝말잇기!";
        wordChainDiv.appendChild( wordChainTitle );
        // 끝말잇기 기록창 만들기
        let wordChainHistory = document.createElement("div");
        wordChainDiv.appendChild( wordChainHistory );
        // 끝말잇기 기록창 내부
        let wordChain = document.createElement("p");
        wordChain.classList.add("word-p");
        wordChainHistory.appendChild( wordChain );
        if (GM_getValue("wordchain") !== undefined) {
            if (Array.isArray(GM_getValue("wordchain")) !== false) {
                let wordChainPrepare = GM_getValue("wordchain");
                let wordChainSpan = document.createElement("span");
                wordChainSpan.classList.add("words-chn");
                wordChainSpan.textContent = wordChainPrepare.join(" → ");
                wordChain.appendChild( wordChainSpan );
            }
        } else {
            let thereIsNoChain = document.createElement("p");
            thereIsNoChain.classList.add("nochain-text");
            thereIsNoChain.textContent = "아직 끝말잇기가 진행되지 않았습니다!";
            wordChain.appendChild( thereIsNoChain );
        }
        // 끝말잇기 폼 만들기
        let wordChainForm = document.createElement("form");
        wordChainDiv.appendChild( wordChainForm );
        // 끝말잇기 입력창 만들기
        let wordChainInput = document.createElement("textarea");
        wordChainInput.classList.add("form-control");
        wordChainInput.classList.add("word-chain");
        wordChainForm.appendChild( wordChainInput );
        // 끝말잇기 전송 만들기
        let wordChainBtn = document.createElement("button");
        wordChainBtn.textContent = "잇기";
        wordChainForm.appendChild( wordChainBtn );
        // 끝말잇기 폼 상세
        wordChainForm.onsubmit = function wordSubmit() {
            let userName = document.querySelector('span.username');
            if (GM_getValue("myeotbeon") !== undefined) {
                let howManyTimes = GM_getValue("myeotbeon") + 1;
                GM_setValue("myeotbeon", howManyTimes);
            } else {
                let howManyTimes = 0;
                GM_setValue("myeotbeon", howManyTimes);
            }
            let stringHowMany = GM_getValue("myeotbeon");
            let dataName = userName + "-" + stringHowMany;
            let wordChainText = document.querySelector("textarea.word-chain").value;
            let wordChainGet = GM_getValue("wordchain");
            if(wordChainText.charAt(0) == wordChainGet[wordChainGet.length - 1].slice(-1)) {
                GM_setValue(dataName, wordChainText);
                if (GM_getValue("wordchain") !== undefined) {
                    let wordArr = GM_getValue("wordchain");
                    wordArr.push(wordChainText);
                    GM_setValue("wordchain", wordArr);
                } else {
                    let wordArr = []
                    wordArr.push(wordChainText);
                    GM_setValue("wordchain", JSON.stringify(wordArr));
                }
                let wordChainArray = JSON.parse(GM_getValue("wordchain"));
                if (document.querySelector('span.words-chn') !== null) {
                    let wordChainLast = document.createElement("span");
                    document.body.insertBefore(wordChainLast, wordChain.firstChild);
                    wordChainLast.textContent = wordChainText;
                    wordChainLast.classList.add("words-chn");
                } else {
                    let wordP = document.getElementsByClassName("word-p");
                    wordP.removeChild(document.getElementsByClassName("nochain-text"));
                    let wordChainFirst = document.createElement("span");
                    wordChain.appendChild( wordChainFirst );
                    wordChainFirst.textContent = wordChainText;
                    wordChainFirst.classList.add("words-chn");
                }
            } else {
                alert("이전 단어의 끝 글자로 시작해야 합니다.");
            }
        };
        wordChainForm.setAttribute("method", "post");
        wordChainForm.action = "javascript:wordSubmit();";
    }
})();