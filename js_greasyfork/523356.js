// ==UserScript==
// @name         POE2 영문거래소 자동 로그인
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  POE2 영문거래소에 자동으로 로그인하는 스크립트
// @author       You
// @match        *://www.pathofexile.com/trade2/search/poe2/Standard
// @match        *://poe.game.daum.net/my-account
// @match        *://www.pathofexile.com/my-account
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523356/POE2%20%EC%98%81%EB%AC%B8%EA%B1%B0%EB%9E%98%EC%86%8C%20%EC%9E%90%EB%8F%99%20%EB%A1%9C%EA%B7%B8%EC%9D%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/523356/POE2%20%EC%98%81%EB%AC%B8%EA%B1%B0%EB%9E%98%EC%86%8C%20%EC%9E%90%EB%8F%99%20%EB%A1%9C%EA%B7%B8%EC%9D%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 인터벌 ID를 저장할 변수
    let intervalId;

    function intervalCheck(){
        if (window.location.href === 'https://www.pathofexile.com/trade2/search/poe2/Standard') {
            const isNotLoggedIn = document.querySelector('.login-dialog') !== null;
            const isTradeLoaded = document.querySelector('#trade') !== null;
            if(isNotLoggedIn) {
                clearInterval(intervalId);
                window.location.href = 'https://poe.game.daum.net/login';
            };
            if(isTradeLoaded) {
                clearInterval(intervalId);
            }
        }

        if (window.location.href === 'https://poe.game.daum.net/my-account') {
            const isLoggedIn = document.querySelector('.loggedInStatus') !== null;
            if(isLoggedIn) {
                clearInterval(intervalId);
                window.location.href = 'https://poe.game.daum.net/login/transfer?redir=%2Fmy-account';
            }
        }

        if (window.location.href === 'https://www.pathofexile.com/my-account') {
            const isLoggedIn = document.querySelector('.loggedInStatus') !== null;
            if(isLoggedIn) {
                clearInterval(intervalId);
                window.location.href = 'https://www.pathofexile.com/trade2/search/poe2/Standard';
            }
        }
    }

    // 1초마다 조건 확인
    intervalId = setInterval(intervalCheck, 1000);

})();