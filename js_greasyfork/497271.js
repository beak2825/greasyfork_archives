// ==UserScript==
// @name        [루시퍼홍] 카카오맵 면적재기 색상변경
// @namespace   Violentmonkey Scripts
// @match       *://map.kakao.com/*
// @grant       none
// @version     1.04
// @description 2024. 6. 7. 오후 17:00:00
// @downloadURL https://update.greasyfork.org/scripts/497271/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%B9%B4%EC%B9%B4%EC%98%A4%EB%A7%B5%20%EB%A9%B4%EC%A0%81%EC%9E%AC%EA%B8%B0%20%EC%83%89%EC%83%81%EB%B3%80%EA%B2%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/497271/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%B9%B4%EC%B9%B4%EC%98%A4%EB%A7%B5%20%EB%A9%B4%EC%A0%81%EC%9E%AC%EA%B8%B0%20%EC%83%89%EC%83%81%EB%B3%80%EA%B2%BD.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const currentVersion = GM_info.script.version;
    console.log("currentVersion: " + currentVersion);
    const updateUrl = 'https://update.greasyfork.org/scripts/497271/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%B9%B4%EC%B9%B4%EC%98%A4%EB%A7%B5%20%EB%A9%B4%EC%A0%81%EC%9E%AC%EA%B8%B0%20%EC%83%89%EC%83%81%EB%B3%80%EA%B2%BD.meta.js';
    const cafeUrl = 'https://cafe.naver.com/wecando7/10987240';
    const popupDismissKey = 'scriptUpdatePopupDismissed';
    const dismissDuration = 24 * 60 * 60 * 1000; // 24시간

    // 최신 버전을 가져오기 위해 메타 파일을 가져옴
    fetch(`${updateUrl}?_=${Date.now()}`)
        .then(response => response.text())
        .then(meta => {
            const latestVersionMatch = meta.match(/@version\s+([^\s]+)/);

            if (latestVersionMatch) {
                const latestVersion = latestVersionMatch[1];
                console.log("latestVersion: " + latestVersion);

                if (currentVersion !== latestVersion && !shouldDismissPopup()) {
                    showUpdatePopup(latestVersion);
                }
            }
        })
        .catch(error => {
            console.error('Failed to fetch the latest version information:', error);
        });

    function shouldDismissPopup() {
        const lastDismissTime = localStorage.getItem(popupDismissKey);
        if (!lastDismissTime) return false;

        const timeSinceDismiss = Date.now() - new Date(lastDismissTime).getTime();
        return timeSinceDismiss < dismissDuration;
    }

    function dismissPopup() {
        localStorage.setItem(popupDismissKey, new Date().toISOString());
    }

    function showUpdatePopup(latestVersion) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.padding = '20px';
        popup.style.backgroundColor = 'white';
        popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        popup.style.zIndex = '10000';

        const message = document.createElement('p');
        message.innerHTML = `[루시퍼홍] 카카오맵 면적재기 색상변경의 (${latestVersion}) 버젼 업데이트가 있습니다. 확인하시겠습니까?<br><br>(닫기 버튼을 누르실 경우 24시간 동안 다시 알림이 뜨지 않습니다)<br><br>`;
        popup.appendChild(message);

        const confirmButton = document.createElement('button');
        confirmButton.textContent = '확인';
        confirmButton.style.marginRight = '10px';
        confirmButton.onclick = () => {
            window.open(cafeUrl, '_blank');
            document.body.removeChild(popup);
        };
        popup.appendChild(confirmButton);

        const closeButton = document.createElement('button');
        closeButton.textContent = '닫기';
        closeButton.onclick = () => {
            dismissPopup();
            document.body.removeChild(popup);
        };
        popup.appendChild(closeButton);

        document.body.appendChild(popup);
    }
})();

let colorInput;
let colorDiv;
let pathElements = [];

window.addEventListener('load', function() {
    initColorPanel();
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            updatePathElements();
        }
    });
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault(); // 기본 컨텍스트 메뉴 비활성화
        updatePathElements();
    });
});

function colorChange(pathElement, event) {
    showPanel(pathElement, event);
}

function rgbToHex(rgb) {
    const rgbArray = rgb.match(/\d+/g);
    const hex = "#" + ((1 << 24) + (parseInt(rgbArray[0]) << 16) + (parseInt(rgbArray[1]) << 8) + parseInt(rgbArray[2])).toString(16).slice(1);
    return hex;
}

function closeDiv() {
    document.querySelectorAll('.color-input').forEach(function(colorInput) {
        colorInput.style.display = 'none';
    });

    document.querySelectorAll('.color-div').forEach(function(colorDiv) {
        colorDiv.style.display = 'none';
    });
}

function showPanel(pathElement, event) {
    colorInput.style.left = `${event.clientX}px`;
    colorInput.style.top = `${event.clientY}px`;
    colorInput.style.display = 'block';
    colorDiv.style.left = `${event.clientX}px`;
    colorDiv.style.top = `${event.clientY + 30}px`;
    colorDiv.style.display = 'block';
    colorInput.value = "";

    document.querySelectorAll('.small-square').forEach(function(square) {
        square.removeEventListener('click', square._clickHandler);
        square._clickHandler = function(event) {
            smallSquareClickHandler(event, pathElement);
        };
        square.addEventListener('click', square._clickHandler);
    });

    colorInput.removeEventListener('input', colorInput._inputHandler);
    colorInput._inputHandler = function(event) {
        colorInputHandler(event, pathElement);
    };
    colorInput.addEventListener('input', colorInput._inputHandler);
}

function smallSquareClickHandler(event, pathElement) {
    const backgroundColor = rgbToHex(event.target.style.backgroundColor);
    pathElement.style.fill = backgroundColor;
    //pathElement.style.stroke = backgroundColor;
    pathElement.style.fillOpacity = "0.3";
    closeDiv();
}

function colorInputHandler(event, pathElement) {
    const enteredColor = event.target.value;
    pathElement.style.fill = enteredColor;
    pathElement.style.fillOpacity = "0.3";
}

function updatePathElements() {
    pathElements.forEach(function(pathElement) {
        if (pathElement._colorChangeListener) {
            pathElement.removeEventListener('click', pathElement._colorChangeListener);
        }
    });

    pathElements = Array.from(document.querySelectorAll('svg path')).filter(pathElement => {
        return pathElement.id.includes('daum-maps-shape');
    });

    pathElements.forEach(function(pathElement) {
        pathElement._colorChangeListener = function(event) {
            event.stopPropagation(); // Path 클릭 시 이벤트 전파 중지
            colorChange(pathElement, event);
        };
        pathElement.addEventListener('click', pathElement._colorChangeListener);
    });
}

function initColorPanel() {
    colorInput = document.createElement('input');
    colorInput.type = 'text';
    colorInput.className = 'color-input';
    colorInput.style.position = 'absolute';
    colorInput.style.display = 'none';
    colorInput.style.border = '1px solid black';
    colorInput.placeholder = '색상값 입력 #000000';
    document.body.appendChild(colorInput);

    colorDiv = document.createElement('div');
    colorDiv.className = 'color-div';
    colorDiv.style.position = 'absolute';
    colorDiv.style.display = 'none';
    document.body.appendChild(colorDiv);

    const colors = ['#000000', '#454648', '#474C4F', '#FF0000', '#FF6600', '#FFFF00', '#92D050', '#00B050', '#00B0F0', '#0070C0', '#000099', '#7030A0', '#CC3399', '#FF66CC'];

    for (let j = 0; j < 2; j++) {
        for (let k = 0; k < 7; k++) {
            const smallSquare = document.createElement('div');
            smallSquare.className = 'small-square';
            smallSquare.style.width = '70px';
            smallSquare.style.height = '70px';
            smallSquare.style.backgroundColor = colors[j * 7 + k];
            smallSquare.style.float = 'left';
            smallSquare.style.border = '2px solid black';
            colorDiv.appendChild(smallSquare);
        }
        const breakLine = document.createElement('br');
        colorDiv.appendChild(breakLine);
    }
}

// 클릭 이벤트를 문서 전체에 추가하여 Path 외부 클릭 시 색상표 숨김
document.addEventListener('click', function(event) {
    const colorInput = document.querySelector('.color-input');
    const colorDiv = document.querySelector('.color-div');
    const inputRect = colorInput.getBoundingClientRect();
    const divRect = colorDiv.getBoundingClientRect();

    // 색상 입력창과 색상 팔레트 영역을 벗어난 클릭인지 확인
    if (!event.target.closest('path') &&
        !(event.clientX >= inputRect.left && event.clientX <= inputRect.right && event.clientY >= inputRect.top && event.clientY <= inputRect.bottom) &&
        !(event.clientX >= divRect.left && event.clientX <= divRect.right && event.clientY >= divRect.top)) {
        closeDiv();
    }
}, true);
