// ==UserScript==
// @name         로사 설맞이 자동뽑기(모든채널링)
// @author       Cactus
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  자동뽑기 네임스페이스랑 매치 링크 수정해서 쓰셈
// @match        https://lostsaga-ko.valofe.com/losaevent/2025/250122_newyear/250122_newyear.asp
// @match        http://lostsaga.mgame.com/losaevent/2025/250122_newyear/250122_newyear.asp
// @match        https://lostsaga.game.daum.net/losaevent/2025/250122_newyear/250122_newyear.asp
// @match        https://lostsaga.game.naver.com/losaevent/2025/250122_newyear/250122_newyear.asp
// @match        http://lostsaga.hangame.com/losaevent/2025/250122_newyear/250122_newyear.asp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525629/%EB%A1%9C%EC%82%AC%20%EC%84%A4%EB%A7%9E%EC%9D%B4%20%EC%9E%90%EB%8F%99%EB%BD%91%EA%B8%B0%28%EB%AA%A8%EB%93%A0%EC%B1%84%EB%84%90%EB%A7%81%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525629/%EB%A1%9C%EC%82%AC%20%EC%84%A4%EB%A7%9E%EC%9D%B4%20%EC%9E%90%EB%8F%99%EB%BD%91%EA%B8%B0%28%EB%AA%A8%EB%93%A0%EC%B1%84%EB%84%90%EB%A7%81%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        setTimeout(() => {
            clickAllItems();
        }, 2000);
    });

    function clickAllItems() {
        let currentIndex = 1;
        const maxIndex = 45;

        function clickNext() {
            if (currentIndex > maxIndex) {
                console.log("모든 뽑기를 완료했습니다. 뽑기판을 초기화합니다.");
                resetBoard(); 
                return;
            }

            const topEl = document.querySelector(`#quizy-mg-item-top${currentIndex}`);
            if (topEl && topEl.offsetParent !== null) {
                // 클릭하여 뽑기 진행
                topEl.click();

                setTimeout(() => {
                    const confirmBtn = document.querySelector('#btnConfirm');
                    if (confirmBtn && confirmBtn.offsetParent !== null) {
                        confirmBtn.click();
                    }

                    setTimeout(() => {
                        const okBtn = document.querySelector('#btnOk');
                        if (okBtn && okBtn.offsetParent !== null) {
                            okBtn.click();
                        }
                        currentIndex++;
                        setTimeout(clickNext, 200);
                    }, 200);
                }, 200);
            } else {
                currentIndex++;
                setTimeout(clickNext, 200);
            }
        }

        clickNext();
    }

    function resetBoard() {
        fnBbobgiReset();

        setTimeout(() => {
            const confirmBtn = document.querySelector('#btnConfirm');
            if (confirmBtn && confirmBtn.offsetParent !== null) {
                confirmBtn.click();
            }

            setTimeout(() => {
                const okBtn = document.querySelector('#btnOk');
                if (okBtn && okBtn.offsetParent !== null) {
                    okBtn.click();
                }

                setTimeout(() => {
                    clickAllItems();
                }, 700);
            }, 700);
        }, 700);
    }
})();