// ==UserScript==
// @name         SOOP - 채팅창 좌우정렬
// @namespace    https://www.afreecatv.com/
// @version      1.0.2
// @description  채팅창 정렬 변경을 클릭하면 변경됩니다.
// @author       hakkutakku
// @match        https://play.sooplive.co.kr/*
// @match        https://vod.sooplive.co.kr/player/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=play.sooplive.co.kr
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512717/SOOP%20-%20%EC%B1%84%ED%8C%85%EC%B0%BD%20%EC%A2%8C%EC%9A%B0%EC%A0%95%EB%A0%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/512717/SOOP%20-%20%EC%B1%84%ED%8C%85%EC%B0%BD%20%EC%A2%8C%EC%9A%B0%EC%A0%95%EB%A0%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 아이콘 변경
    GM_addStyle(`
.area_header ul li.chatLeftRight a {
    background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'><path fill='%23757b8a' d='M8.49388 9.56443C8.80561 9.29167 8.83719 8.81785 8.56443 8.50612C8.29167 8.19439 7.81785 8.16281 7.50612 8.43557L8.49388 9.56443ZM3.50612 11.9356C3.19439 12.2083 3.16281 12.6822 3.43557 12.9939C3.70833 13.3056 4.18215 13.3372 4.49388 13.0644L3.50612 11.9356ZM4 11.75C3.58579 11.75 3.25 12.0858 3.25 12.5C3.25 12.9142 3.58579 13.25 4 13.25V11.75ZM20 13.25C20.4142 13.25 20.75 12.9142 20.75 12.5C20.75 12.0858 20.4142 11.75 20 11.75V13.25ZM4.49388 11.9356C4.18215 11.6628 3.70833 11.6944 3.43557 12.0061C3.16281 12.3178 3.19439 12.7917 3.50612 13.0644L4.49388 11.9356ZM7.50612 16.5644C7.81785 16.8372 8.29167 16.8056 8.56443 16.4939C8.83719 16.1822 8.80561 15.7083 8.49388 15.4356L7.50612 16.5644ZM20.4939 13.0644C20.8056 12.7917 20.8372 12.3178 20.5644 12.0061C20.2917 11.6944 19.8178 11.6628 19.5061 11.9356L20.4939 13.0644ZM15.5061 15.4356C15.1944 15.7083 15.1628 16.1822 15.4356 16.4939C15.7083 16.8056 16.1822 16.8372 16.4939 16.5644L15.5061 15.4356ZM19.5061 13.0644C19.8178 13.3372 20.2917 13.3056 20.5644 12.9939C20.8372 12.6822 20.8056 12.2083 20.4939 11.9356L19.5061 13.0644ZM16.4939 8.43557C16.1822 8.16281 15.7083 8.19439 15.4356 8.50612C15.1628 8.81785 15.1944 9.29167 15.5061 9.56443L16.4939 8.43557ZM7.50612 8.43557L3.50612 11.9356L4.49388 13.0644L8.49388 9.56443L7.50612 8.43557ZM4 13.25H20V11.75H4V13.25ZM3.50612 13.0644L7.50612 16.5644L8.49388 15.4356L4.49388 11.9356L3.50612 13.0644ZM19.5061 11.9356L15.5061 15.4356L16.4939 16.5644L20.4939 13.0644L19.5061 11.9356ZM20.4939 11.9356L16.4939 8.43557L15.5061 9.56443L19.5061 13.0644L20.4939 11.9356Z'/></svg>");
    background-size: 25px 25px
}

[dark=true] .area_header ul li.chatLeftRight a {
    background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'><path fill='%23acb0b9' d='M8.49388 9.56443C8.80561 9.29167 8.83719 8.81785 8.56443 8.50612C8.29167 8.19439 7.81785 8.16281 7.50612 8.43557L8.49388 9.56443ZM3.50612 11.9356C3.19439 12.2083 3.16281 12.6822 3.43557 12.9939C3.70833 13.3056 4.18215 13.3372 4.49388 13.0644L3.50612 11.9356ZM4 11.75C3.58579 11.75 3.25 12.0858 3.25 12.5C3.25 12.9142 3.58579 13.25 4 13.25V11.75ZM20 13.25C20.4142 13.25 20.75 12.9142 20.75 12.5C20.75 12.0858 20.4142 11.75 20 11.75V13.25ZM4.49388 11.9356C4.18215 11.6628 3.70833 11.6944 3.43557 12.0061C3.16281 12.3178 3.19439 12.7917 3.50612 13.0644L4.49388 11.9356ZM7.50612 16.5644C7.81785 16.8372 8.29167 16.8056 8.56443 16.4939C8.83719 16.1822 8.80561 15.7083 8.49388 15.4356L7.50612 16.5644ZM20.4939 13.0644C20.8056 12.7917 20.8372 12.3178 20.5644 12.0061C20.2917 11.6944 19.8178 11.6628 19.5061 11.9356L20.4939 13.0644ZM15.5061 15.4356C15.1944 15.7083 15.1628 16.1822 15.4356 16.4939C15.7083 16.8056 16.1822 16.8372 16.4939 16.5644L15.5061 15.4356ZM19.5061 13.0644C19.8178 13.3372 20.2917 13.3056 20.5644 12.9939C20.8372 12.6822 20.8056 12.2083 20.4939 11.9356L19.5061 13.0644ZM16.4939 8.43557C16.1822 8.16281 15.7083 8.19439 15.4356 8.50612C15.1628 8.81785 15.1944 9.29167 15.5061 9.56443L16.4939 8.43557ZM7.50612 8.43557L3.50612 11.9356L4.49388 13.0644L8.49388 9.56443L7.50612 8.43557ZM4 13.25H20V11.75H4V13.25ZM3.50612 13.0644L7.50612 16.5644L8.49388 15.4356L4.49388 11.9356L3.50612 13.0644ZM19.5061 11.9356L15.5061 15.4356L16.4939 16.5644L20.4939 13.0644L19.5061 11.9356ZM20.4939 11.9356L16.4939 8.43557L15.5061 9.56443L19.5061 13.0644L20.4939 11.9356Z'/></svg>");
    background-size: 25px 25px
}
    `);

    function insertButton() {
        const chatLeftRight = `<li class="chatLeftRight" id="chatLeftRight"><a href="javascript:;" tip="채팅창 위치 변경">채팅창 위치 변경</a></li>`;
        const settingButton = document.querySelector(".set"); // 다시보기 페이지는 시청자 목록 아이콘이 없으므로 찾는 아이콘 변경

        if(settingButton === null) { // 다시보기에서 채팅창 로드가 느리므로 반복찾기
            setTimeout(insertButton, 100);
        } else {
            if(GM_getValue('isChatLeft', false) === true) { // 채팅창 좌우 설정 불러오기
                toggleChatLocation();
            }
            settingButton.insertAdjacentHTML('afterend', chatLeftRight);
            document.querySelector('.chatLeftRight').addEventListener("click", toggleChatLocation);
        }
    }

    function toggleChatLocation() {
        const webplayer_contents = document.querySelector('#webplayer_contents');
        console.log(webplayer_contents.style.flexDirection);
        if(webplayer_contents.style.flexDirection === "") {
            webplayer_contents.style.flexDirection = 'row-reverse';
            GM_setValue('isChatLeft', true); // 설정 저장
        } else {
            webplayer_contents.style.removeProperty('flex-direction');
            GM_setValue('isChatLeft', false); // 설정 저장
        }
    }
    insertButton();
})();