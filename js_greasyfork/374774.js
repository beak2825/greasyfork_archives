// ==UserScript==
// @name         SuneungNamla
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  수능남라 - 수능시험의 나무라이브 툴 (포인트 게임용)
// @include      https://namu.live/b/namugame*
// @author       Suneungsiheom
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/374774/SuneungNamla.user.js
// @updateURL https://update.greasyfork.org/scripts/374774/SuneungNamla.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.querySelector('aside.right-sidebar') !== null) {
        var gamenum = 1;
        var point = 100000;
        var betting = 0;
        let gamebtn = document.createElement("button");
        let game1 = document.createElement("button");
        let game2 = document.createElement("button");
        let game3 = document.createElement("button");
        let game4 = document.createElement("button");
        let game5 = document.createElement("button");
        let game6 = document.createElement("button");
        let gamenumtext = document.createElement("p");
        let msg = document.createElement("p");
        let resulttext = document.createElement("p");
        // 포인트 게임 타이틀
        let gamearea = document.createElement("div");
        gamearea.classList.add("sidebar-item");
        let right = document.querySelector('.right-sidebar');
        right.appendChild( gamearea );
        let gameTitle = document.createElement("div");
        gameTitle.classList.add("item-title");
        gameTitle.textContent = gamenum + "회차 모의 포인트게임";
        gamearea.appendChild( gameTitle );
        // 포인트 입력란
        let nowpoint = document.createElement("p");
        nowpoint.textContent = "현재 보유 포인트: " + point;
        gamearea.appendChild (nowpoint);
        let input = document.createElement("p");
        input.textContent = "아래 입력란에 베팅할 포인트 입력(10~100만)";
        gamearea.appendChild (input);
        let bettingtext = document.createElement("textarea");
        gamearea.appendChild (bettingtext);
        // 포인트 게임 버튼
        msg.textContent = "번호 버튼을 누른 후 '걸기'를 눌러 주세요.";
        gamearea.appendChild( msg );
        gamearea.appendChild( game1 );
        gamearea.appendChild( game2 );
        gamearea.appendChild( game3 );
        gamearea.appendChild( game4 );
        gamearea.appendChild( game5 );
        gamearea.appendChild( game6 );
        gamebtn.classList.add("btn");
        gamebtn.textContent = "걸기";
        game1.textContent = "1번";
        game2.textContent = "2번";
        game3.textContent = "3번";
        game4.textContent = "4번";
        game5.textContent = "5번";
        game6.textContent = "6번";
        gamearea.appendChild( gamebtn );
        resulttext.textContent = "결과:";
        gamearea.appendChild( resulttext );
        var number = 0;
        let commentarea = document.querySelector('.right-sidebar');
        commentarea.appendChild( gamearea );
        gamebtn.addEventListener('click', function() {
            var x = Number(bettingtext.value);
            if (isNaN(x)) {
                msg.textContent = "10 이상 100만 이하의 정수를 입력하세요.";
            } else if (x < 10 || x > 1000000) {
                msg.textContent = "최소 10포인트, 최대 100만 포인트까지 베팅 가능합니다.";
            } else if (point < x) {
                msg.textContent = (x - point) + " 포인트가 부족합니다.";
            } else if (number == 0) {
                msg.textContent = "번호를 선택해 주세요.";
            } else {
                let randN = Math.floor(Math.random() * 32);
                var result = 0;
                if (randN == 0) result = 1;
                else if (randN < 6) result = 2;
                else if (randN < 16) result = 3;
                else if (randN < 26) result = 4;
                else if (randN < 31) result = 5;
                else if (randN == 31) result = 6;
                // 포인트 계산
                point -= x;
                var ox = "";
                var pointget = "";
                if (number == result) { // 성공한 경우
                    ox = "성공";
                    var getpoint = 0;
                    if (result == 1) getpoint = Math.floor(x * 30.45);
                    else if (result == 2) getpoint = Math.floor(x * 6.13);
                    else if (result == 3) getpoint = Math.floor(x * 3.09);
                    else if (result == 4) getpoint = Math.floor(x * 3.09);
                    else if (result == 5) getpoint = Math.floor(x * 6.13);
                    else if (result == 6) getpoint = Math.floor(x * 30.45);
                    pointget = "(" + getpoint + "포인트 획득)"
                    point += getpoint
                } else { // 실패한 경우
                    ox = "실패";
                    pointget = "(포인트 획득 실패)"
                }
                resulttext.textContent = gamenum + "회차 모의 포인트 게임의 결과는 " + result + "입니다. (" + ox + ") " + pointget
                nowpoint.textContent = "현재 보유 포인트: " + point;
                // 다음 회차 포겜으로 가기
                gamenum += 1;
                gameTitle.textContent = gamenum + "회차 모의 포인트게임";
            }
        });
        game1.addEventListener('click', function() {
            number = 1;
            msg.textContent = "1번 선택.";
        });
        game2.addEventListener('click', function() {
            number = 2;
            msg.textContent = "2번 선택.";
        });
        game3.addEventListener('click', function() {
            number = 3;
            msg.textContent = "3번 선택.";
        });
        game4.addEventListener('click', function() {
            number = 4;
            msg.textContent = "4번 선택.";
        });
        game5.addEventListener('click', function() {
            number = 5;
            msg.textContent = "5번 선택.";
        });
        game6.addEventListener('click', function() {
            number = 6;
            msg.textContent = "6번 선택.";
        });
    }
})();