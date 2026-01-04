// ==UserScript==
// @name        스팀앱(steamapp.net) 게임 검색 방향키로 이동
// @namespace   스팀앱(steamapp.net) 게임 검색 방향키로 이동
// @match       *://steamapp.net/applist*
// @icon        https://steamapp.net/files/attach/xeicon/favicon.ico
// @version     0.4
// @description 스팀앱의 게임 검색에서 방향키로 이동 할 수 있게 해줍니다
// @downloadURL https://update.greasyfork.org/scripts/470973/%EC%8A%A4%ED%8C%80%EC%95%B1%28steamappnet%29%20%EA%B2%8C%EC%9E%84%20%EA%B2%80%EC%83%89%20%EB%B0%A9%ED%96%A5%ED%82%A4%EB%A1%9C%20%EC%9D%B4%EB%8F%99.user.js
// @updateURL https://update.greasyfork.org/scripts/470973/%EC%8A%A4%ED%8C%80%EC%95%B1%28steamappnet%29%20%EA%B2%8C%EC%9E%84%20%EA%B2%80%EC%83%89%20%EB%B0%A9%ED%96%A5%ED%82%A4%EB%A1%9C%20%EC%9D%B4%EB%8F%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var messageStyle = `
        position: absolute;
        top: 10px;
        left: 10px;
        padding: 10px;
        background-color: rgba(0, 0, 0, 0.8);
        color: #fff;
        font-size: 16px;
        border-radius: 5px;
        transition: opacity 500ms ease;
        opacity: 0;
    `;

    var firstPageAlert = document.createElement('div');
    firstPageAlert.style = messageStyle;
    firstPageAlert.innerText = '첫 페이지입니다.';

    var lastPageAlert = document.createElement('div');
    lastPageAlert.style = messageStyle;
    lastPageAlert.innerText = '마지막 페이지입니다.';

    document.body.appendChild(firstPageAlert);
    document.body.appendChild(lastPageAlert);

    var isAlertVisible = false;
    var alertTimeout;

    function showAndHideAlert(alertElement) {
        alertElement.style.opacity = 1;
        isAlertVisible = true;
        clearTimeout(alertTimeout);
        alertTimeout = setTimeout(function() {
            alertElement.style.opacity = 0;
            isAlertVisible = false;
        }, 1000); // 1000ms (1 second) delay before hiding
    }

    document.addEventListener('keydown', function(e) {
        if (!isAlertVisible) {
            if (e.keyCode === 37 || e.keyCode === 39) {
                let activePage = document.querySelector('.pagination .active');
                if (activePage) {
                    let prevButton = activePage.previousElementSibling;
                    let nextButton = activePage.nextElementSibling;
                    let firstButton = document.querySelector('.pagination .prev:not(.first_page)');
                    let lastButton = document.querySelector('.pagination .next');

                    let pageSpan = document.querySelector('.page em');
                    let pageRegex = /페이지: (\d+) \/ (\d+)/;
                    let match = pageRegex.exec(pageSpan.textContent);
                    let currentPage = parseInt(match[1]);
                    let maxPage = parseInt(match[2]);

                    if (e.keyCode === 37 && prevButton) {
                        prevButton.click();
                    } else if (e.keyCode === 37 && firstButton) {
                        firstButton.click();
                    } else if (e.keyCode === 39 && nextButton) {
                        nextButton.click();
                    } else if (e.keyCode === 39 && lastButton) {
                        lastButton.click();
                    }

                    if (e.keyCode === 37 && currentPage === 1) {
                        showAndHideAlert(firstPageAlert);
                    } else if (e.keyCode === 39 && currentPage === maxPage) {
                        showAndHideAlert(lastPageAlert);
                    }
                }
            }
        }
    });
})();
