// ==UserScript==
// @name         Busan MiliPass Refreshing
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Toggleable auto-click script for a specific button with countdown and additional logic for data comparison
// @author       조해준
// @match        *://admin.milipass.kr/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530400/Busan%20MiliPass%20Refreshing.user.js
// @updateURL https://update.greasyfork.org/scripts/530400/Busan%20MiliPass%20Refreshing.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 상태 변수
    let isRunning = localStorage.getItem('autoClickRunning') === 'true';
    let lastRefreshTime = localStorage.getItem('refreshTime');
    let countdownIntervalId;
 
    function sleep(ms) {
        return new Promise((r) => setTimeout(r, ms));
    }
 
    // 자동 클릭 함수
    function startClicking() {
        if (isRunning) {
            let countdownTime = localStorage.getItem('countdownTime');
            if (countdownTime === null || countdownTime === undefined || countdownTime === 'undefined') {
                localStorage.setItem('countdownTime', 300);
                console.log('New countdownTime : 300s');
            } else {
                console.log('countdownTime remain : ', countdownTime);
            }
            console.log('자동 클릭 실행 중...');
            console.log(`${countdownTime<60?countdownTime:countdownTime/60}${countdownTime<60?'초':'분'} 후 새로고침`);
            countdown(countdownTime);
            sleep(countdownTime*1000).then(() => {
                const refreshTime = new Date().toLocaleString();
                localStorage.setItem('refreshTime', refreshTime);
                if(!isRunning) {
                    console.log('자동 클릭 중지됨.');
                } else {
                    localStorage.setItem('countdownTime', 300);
                    window.Tmo.tmoSearch();
                    sleep(10000);
                    checkPresentData(); // 클릭 후 presentData 체크
                }
            });
        } else {
            console.log('자동 클릭 중지됨.');
        }
    }
 
    // 카운트다운 함수
    function countdown(seconds) {
        let remaining = seconds;
        let time = seconds < 60 ? 1 : 60;
        countdownIntervalId = setInterval(() => {
            remaining-=time;
            localStorage.setItem('countdownTime', remaining);
            console.log(`다음 클릭까지 남은 시간: ${remaining/time}${time<60?'초':'분'}`);
            if (remaining < 0) {
                clearInterval(countdownIntervalId);
                if (isRunning) {
                    startClicking();
                }
            }
        }, time*1000);
    }
 
    // 토글 함수
    function toggleClicking() {
        isRunning = !isRunning;
        localStorage.setItem('autoClickRunning', isRunning);
        console.log(`자동 클릭 상태: ${isRunning ? '실행 중' : '중지됨'}`);
        if (isRunning) {
            startClicking();
        } else {
            clearInterval(countdownIntervalId);
        }
    }
 
    // 페이지 로드 시 상태 확인 및 자동 클릭 시작
    console.log(`초기 자동 클릭 상태: ${isRunning ? '실행 중' : '중지됨'}`);
    if (isRunning) {
        startClicking();
    }
 
    // 토글 버튼 생성 함수
    function createToggleButton() {
        const toggleButton = document.createElement('button');
    toggleButton.textContent = isRunning ? '최근 새로고침 : '+ lastRefreshTime : '자동 새로고침 시작';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.right = '500px';
    toggleButton.style.zIndex = 10000;
    toggleButton.style.backgroundColor = isRunning ? '#000080' : '#30cd79';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.padding = '10px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.transition = 'background-color 0.2s ease-in-out'; // 부드러운 전환 효과 추가
// 마우스 오버 시 색상 변경
    toggleButton.onmouseover = function() {
        toggleButton.style.backgroundColor = isRunning ? '#50cd89' : '#2222a2';
    };
 
    // 마우스가 버튼을 벗어나면 원래 색상으로 복귀
    toggleButton.onmouseout = function() {
        toggleButton.style.backgroundColor = isRunning ? '#000080' : '#30cd79';
    };
 
        toggleButton.addEventListener('click', () => {
 
            const trElement = document.getElementById('rowIndex0');
            const result = trElement ? trElement.textContent.trim() : null;
 
            // console.log(`Result: ${result}`);
 
            localStorage.setItem('presentData', result);
            // console.log('현재 1행 신청자를 presentData로 저장.');
 
            toggleClicking();
 
            const refreshTime = new Date().toLocaleString();
            localStorage.setItem('refreshTime', refreshTime);
            toggleButton.textContent = isRunning ? '최근 새로고침 : '+ refreshTime : '자동 새로고침 시작';
            toggleButton.style.backgroundColor = isRunning ? '#000080' : '#30cd79';
            window.Tmo.tmoSearch();
        });
 
        document.body.appendChild(toggleButton);
    }
 
    createToggleButton();
 
    // presentData 체크 및 업데이트 함수
    function checkPresentData() {
        // id가 'rowIndex0'인 tr 요소의 값 가져오기
        const trElement = document.getElementById('rowIndex0');
        const result = trElement ? trElement.textContent.trim() : null;
        const presentData = localStorage.getItem('presentData');
 
        // console.log(`Result: ${result}`);
        // console.log(`PresentData: ${presentData}`);
 
        // console.log(`PresentDataType: ${typeof(presentData)}`);
 
        if (presentData === null || presentData === undefined || presentData === 'undefined') {
            // presentData가 없을 경우, presentData에 result를 덮어씌우고 계속 진행
            localStorage.setItem('presentData', result);
            console.log('PresentData가 없어서 result를 presentData로 저장했습니다.');
        } else if (result !== presentData) {
            // 결과값이 presentData와 다르면 isRunning을 False로 바꾸고 알림 표시
            // isRunning = false;
            // localStorage.setItem('autoClickRunning', 'false');
            // const past = presentData.replace(/[\n\t\r]+/g, ' ').replace(/\s\s+/g, ' ');
            // const current = result.replace(/[\n\t\r]+/g, ' ').replace(/\s\s+/g, ' ');
 
            if(result.match(/\d{2}-\d{6}/)[0] !== presentData.match(/\d{2}-\d{6}/)[0] || result.match(/\d{5}/)[0] !== presentData.match(/\d{5}/)[0]) {
                if(result[0] !== '-') {
                    localStorage.setItem('presentData', result);
                    openPopup();
                }
            }
 
            // alert('발권신청접수');
        }
    }
 
    // 새로운 팝업 창을 띄우는 함수
    function openPopup() {
        // 팝업 창의 크기와 위치를 지정
        const width = 220;
        const height = 110;
        const left = (screen.width / 2) - (width / 2);
        const top = (screen.height / 2) - (height / 2);
 
        // 팝업 창 열기
        const popup = window.open('', 'popup', `width=${width},height=${height},top=${top},left=${left}`);
 
        // 팝업 창의 내용 설정
        if (popup) {
            popup.document.write(`
            <!DOCTYPE html>
            <html lang="ko">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>알림</title>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #44444488;
                        color: white;
                        font-family: Arial, sans-serif;
                        font-size: 24px;
                    }
                    .message {
                        padding: 20px;
                        background-color: rgba(0, 0, 200, 0.7);
                        border-radius: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="message">발권신청접수</div>
            </body>
            </html>
        `);
            popup.document.close(); // 팝업 창의 문서 스트림을 닫음
        } else {
            console.error('팝업 창을 열 수 없습니다. 팝업 차단기가 활성화되어 있을 수 있습니다.');
        }
    }
 
    function createToggleMenu() {
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '발권제한 멘트';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.right = '395px';
    toggleButton.style.zIndex = 10000;
    toggleButton.style.backgroundColor = '#d9214e';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.padding = '10px';
    toggleButton.style.cursor = 'pointer';
 
    const menu = document.createElement('div');
    menu.style.display = 'none';
    menu.style.position = 'fixed';
    menu.style.top = '50px';
    menu.style.right = '410px';
    menu.style.backgroundColor = 'white';
    menu.style.border = '1px solid black';
    menu.style.padding = '10px';
    menu.style.zIndex = 10000;
 
    toggleButton.style.transition = 'background-color 0.2s ease-in-out'; // 부드러운 전환 효과 추가
// 마우스 오버 시 색상 변경
    toggleButton.onmouseover = function() {
        toggleButton.style.backgroundColor = '#50cd89';
    };
 
    // 마우스가 버튼을 벗어나면 원래 색상으로 복귀
    toggleButton.onmouseout = function() {
        toggleButton.style.backgroundColor = '#d9214e';
    };
 
    const items = [
        { label: '소속 불명', content: '작성하신 부대 명칭으로는 부대 주둔지가 특정되지 않아, 발권 제한 처리하였습니다. 적어도 부대가 속한 기초자치단체를 추정할 수 있을 만큼, 부대 명칭을  작성하여 재신청 해주시기 바랍니다.' },
        { label: '중복 신청', content: '2회 이상 중복신청으로 최초 신청건을 제외하고 발권제한 처리 하였습니다. 최초로 신청하신 건에 대해서는 담당자가 확인 후 처리 예정입니다.' },
        { label: '휴가 조회 불가', content: '국방수송정보체계 상, 해당되는 휴가 정보를 확인할 수 없어 발권제한 처리하였습니다. 2~3일 후에 다시 신청해주시거나, 탑승 희망 일 당일에 휴가증을 지참하여 TMO 창구에 방문해주시면 발권 도와드리겠습니다. (사전에 이용하실 기차표를 미리 구매해 오시면 빠르게 도와드릴 수 있습니다.)' },
        { label: 'SRT', content: 'SRT는 밀리패스 지원이 불가합니다. 열차 출발 전 TMO 현장 발매 바랍니다.' },
        { label: '함정 위치', content: '열차 탑승 당일 복무중이신 함정의 위치를 구두로 확인하여야 합니다. 이용 희망하시는 열차 예매 후 TMO 창구에 방문해주시면 후급 지원 도와드리겠습니다.' },
        { label: '행선지 전국', content: '휴가증 상의 행선지를 전국으로 설정할 경우, 지원범위를 특정할 수 없어 철도 후급을 받으실 수 없습니다. 휴가증의 행선지를 다시 설정하시고 재신청 해주시기 바랍니다.' },
        { label: '행선지 제주', content: '휴가증 행선지가 제주/국외인 경우 최기 터미널 또는 공항까지만 지원 가능합니다. 이용하시는 항공권 또는 승선권 지참 후 인근 TMO 현장 방문 부탁드립니다.' }
    ];
 
    items.forEach(item => {
    const menuItem = document.createElement('div');
    menuItem.textContent = item.label;
    menuItem.style.padding = '5px';
    menuItem.style.cursor = 'pointer';
    menuItem.style.borderBottom = '1px solid #ddd';
 
    // hover 시 표시할 요소 생성
    const hoverContent = document.createElement('div');
    hoverContent.style.position = 'absolute';
    hoverContent.style.top = '0'; // 위쪽으로 맞춤
    hoverContent.style.left = '100%'; // 오른쪽으로 이동
    hoverContent.style.background = '#f0f0f0';
    hoverContent.style.padding = '10px';
    hoverContent.style.border = '1px solid #ddd';
    hoverContent.style.borderRadius = '5px';
    hoverContent.style.zIndex = '1';
    hoverContent.style.whiteSpace = 'normal';
    hoverContent.style.width = '250px'; // 컨텐츠 너비 조정
    hoverContent.textContent = item.content;
    hoverContent.style.display = 'none'; // 기본적으로 숨김
 
    // hover 효과 적용
    menuItem.addEventListener('mouseover', () => {
        hoverContent.style.display = 'block';
        menuItem.style.background = '#f0f0f0'; // hover 시 배경색 변경
    });
 
    menuItem.addEventListener('mouseout', () => {
        hoverContent.style.display = 'none';
        menuItem.style.background = ''; // hover 해제 시 배경색 초기화
    });
 
    // hoverContent를 menuItem의 부모 요소에 추가
    menu.appendChild(hoverContent);
    menu.appendChild(menuItem);
 
    // 클릭 이벤트 유지
    menuItem.addEventListener('click', () => {
        navigator.clipboard.writeText(item.content).then(() => {
            alert(`제한사유 : ${item.label}\n안내멘트 : ${item.content}\n발권제한 > 사유:기타 > 붙여넣기`);
        }).catch(err => {
            console.error('클립보드 복사 실패:', err);
        });
    });
    });
 
    toggleButton.addEventListener('click', () => {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });
    
    document.body.appendChild(toggleButton);
    document.body.appendChild(menu);
}
 
createToggleMenu();
 
})();