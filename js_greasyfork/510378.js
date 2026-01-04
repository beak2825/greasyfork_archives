// ==UserScript==
// @name        [루시퍼홍] 아실 업무지구 길찾기
// @namespace   Violentmonkey Scripts
// @match       https://asil.kr/asil/*
// @grant       none
// @version     1.07
// @author      루시퍼홍
// @require     https://code.jquery.com/jquery-1.12.4.min.js
// @description 2024. 9. 27. 오후 13:00:00
// @license
// @downloadURL https://update.greasyfork.org/scripts/510378/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%EC%97%85%EB%AC%B4%EC%A7%80%EA%B5%AC%20%EA%B8%B8%EC%B0%BE%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/510378/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%EC%97%85%EB%AC%B4%EC%A7%80%EA%B5%AC%20%EA%B8%B8%EC%B0%BE%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentVersion = GM_info.script.version;
    const scriptName = GM_info.script.name;
    console.log(scriptName + ' ' + "currentVersion: " + currentVersion);
    const updateUrl =  GM_info.script.updateURL;
    const cafeUrl = 'https://cafe.naver.com/wecando7/11222461';
    const popupDismissKey = 'scriptUpdatePopupDismissed';
    const dismissDuration = 24 * 60 * 60 * 1000; // 24시간

    // 한국 시간을 가져오는 함수
    function getKoreanTime() {
        const now = new Date();
        const utcNow = now.getTime() + (now.getTimezoneOffset() * 60000); // UTC 시간
        const koreanTime = new Date(utcNow + (9 * 60 * 60 * 1000)); // 한국 시간 (UTC+9)
        //console.log("UTC Now:", new Date(utcNow).toISOString());
        //console.log("Korean Time:", koreanTime.toISOString());
        return koreanTime;
    }

    // 날짜를 24시간 형식으로 포맷하는 함수
    function formatDateTo24Hour(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    // 최신 버전을 가져오기 위해 메타 파일을 가져옴
    fetch(`${updateUrl}?_=${Date.now()}`)
        .then(response => response.text())
        .then(meta => {
            const latestVersionMatch = meta.match(/@version\s+([^\s]+)/);

            if (latestVersionMatch) {
                const latestVersion = latestVersionMatch[1];
                console.log(scriptName + ' ' + "latestVersion: " + latestVersion);

                if (currentVersion !== latestVersion) {
                    //console.log("Different version detected.");
                    if (!shouldDismissPopup()) {
                        //console.log("Showing update popup.");
                        showUpdatePopup(latestVersion);
                    } else {
                        //console.log("Popup dismissed recently.");
                    }
                } else {
                    //console.log("No new version available.");
                }
            }
        })
        .catch(error => {
            console.error('Failed to fetch the latest version information:', error);
        });

    function shouldDismissPopup() {
        const lastDismissTime = localStorage.getItem(popupDismissKey);
        //console.log("lastDismissTime: " + lastDismissTime);
        if (!lastDismissTime) return false;

        const timeSinceDismiss = getKoreanTime().getTime() - new Date(lastDismissTime).getTime();
        //console.log("timeSinceDismiss: " + timeSinceDismiss);
        //console.log("dismissDuration: " + dismissDuration);
        return timeSinceDismiss < dismissDuration;
    }

    function dismissPopup() {
        const koreanTime = getKoreanTime();
        const formattedTime = formatDateTo24Hour(koreanTime);
        //console.log("Dismiss time set to:", formattedTime);
        localStorage.setItem(popupDismissKey, formattedTime);
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
        message.innerHTML = `${scriptName} (${latestVersion}) 버젼 업데이트가 있습니다. 확인하시겠습니까?<br><br>(닫기 버튼을 누르실 경우 24시간 동안 다시 알림이 뜨지 않습니다)<br><br>`;
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
        //console.log("Popup shown");
    }
})();


window.addEventListener('load', function() {
    // 오버레이 생성
    var overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = `calc(40% + 80px)`;
    overlay.style.left = '390px';
    overlay.style.width = `calc(100% - 390px)`;
    overlay.style.height = `calc(100% - 250px)`;
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.display = 'none';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';

    // 닫기 버튼 생성
    var closeButton = document.createElement('button');
    closeButton.innerText = '닫기';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '0px';
    closeButton.style.right = '20px';
    closeButton.style.backgroundColor = 'red';
    closeButton.style.color = 'white';
    closeButton.style.padding = '10px';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';

    // iframe 생성
    var iframe = document.createElement('iframe');
    iframe.id = 'iframeOverlay';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';

    // 오버레이에 닫기 버튼과 iframe 추가
    overlay.appendChild(closeButton);
    overlay.appendChild(iframe);

    // 오버레이를 body에 추가
    document.body.appendChild(overlay);

    // 닫기 버튼 클릭 시 오버레이 닫기
    closeButton.addEventListener('click', function() {
        overlay.style.display = 'none';
        iframe.src = '';  // iframe 비우기
        //document.querySelector('.ctn_wrap.open').style.width = '390px';
        //document.querySelector('.map_wrap').style.width = `calc(100% - 390px)`;
        document.querySelector('.map_wrap').style.height = '100%';
    });

    // "길찾기" 버튼 생성
    var routeButton = document.createElement('button');
    routeButton.innerText = '길찾기';
    routeButton.style.position = 'absolute';
    routeButton.style.display = 'none';
    routeButton.style.zIndex = '10000';
    routeButton.style.padding = '10px';
    routeButton.style.backgroundColor = '#007bff';
    routeButton.style.color = 'white';
    routeButton.style.border = 'none';
    routeButton.style.cursor = 'pointer';
    routeButton.style.borderRadius = '5px';

    // "길찾기" 버튼을 body에 추가
    document.body.appendChild(routeButton);

    // 체크박스 컨테이너 생성
    var checkboxContainer = document.createElement('div');
    checkboxContainer.style.position = 'absolute';
    checkboxContainer.style.display = 'none';
    checkboxContainer.style.backgroundColor = 'white';
    checkboxContainer.style.padding = '10px';
    checkboxContainer.style.zIndex = '9999';
    checkboxContainer.style.border = '1px solid #ccc';
    checkboxContainer.style.borderRadius = '5px';

    // 목적지 체크박스 리스트 생성
    const destinations = [
        { id: 'chk1', lat: 37.497951, lng: 127.027636, name: '강남역2호선', code: 222 },
        { id: 'chk2', lat: 37.564719, lng: 126.977022, name: '서울시청역2호선', code: 273 },
        { id: 'chk3', lat: 37.521624, lng: 126.924374, name: '여의도역5호선', code: 526 },
        { id: 'chk4', lat: 37.481339, lng: 126.882734, name: '가산디지털단지역1호선', code: 172 },
        { id: 'chk8', lat: 37.485266, lng: 126.900198, name: '구로지디털단지역2호선', code: 232 },
        { id: 'chk5', lat: 37.394768, lng: 127.111699, name: '판교역신분당선', code: 1914 },
        { id: 'chk6', lat: 37.560143, lng: 126.825231, name: '마곡역5호선', code: 514 },
        { id: 'chk7', lat: 37.576528, lng: 126.898109, name: 'DMC역6호선', code: 618 }
    ];

  var style = document.createElement('style');
style.innerHTML = `
    input[type="checkbox"] {
        width: 20px;   /* 기본 크기 설정 */
        height: 20px;  /* 기본 크기 설정 */
        visibility: visible; /* 체크박스가 보이도록 설정 */
        appearance: auto;  /* 기본 체크박스 스타일로 설정 */
        -webkit-appearance: checkbox; /* 브라우저 호환성 */
    }
`;
document.head.appendChild(style);


    destinations.forEach((dest, index) => {
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = dest.id;
    checkbox.style.display = 'inline-block'; // 체크박스가 보이도록 설정
    checkbox.style.visibility = 'visible';   // 체크박스가 숨겨지지 않도록 설정

    // 처음 3개의 체크박스를 기본값으로 체크
    if (index < 3) {
        checkbox.checked = true;
    }

    var label = document.createElement('label');
    label.htmlFor = dest.id;  // label의 for 속성을 체크박스 id와 연결
    label.innerText = dest.name;
    label.style.fontSize = '16px'; // 텍스트 크기 조정

    var container = document.createElement('div');
    container.style.display = 'flex';  // 체크박스와 레이블을 나란히 배치
    container.style.alignItems = 'center'; // 세로로 정렬을 맞춤
    container.style.marginBottom = '5px'; // 항목 사이에 간격 추가

    container.appendChild(checkbox);
    container.appendChild(label);

    checkboxContainer.appendChild(container);
});



    // 체크박스 컨테이너를 body에 추가
    document.body.appendChild(checkboxContainer);

    // 우클릭 시 이벤트를 등록하여 "길찾기" 버튼을 표시
    naver.maps.Event.addListener(map, 'rightclick', function(e) {
        var latlng = e.coord;  // 우클릭한 위치의 좌표 (지도 상의 위도, 경도)
        var startX = latlng.lng();  // 우클릭한 위치의 경도
        var startY = latlng.lat();  // 우클릭한 위치의 위도

        // 우클릭한 화면상의 마우스 좌표 가져오기 (clientX, clientY)
        var mouseEvent = e.pointerEvent;
        var mouseX = mouseEvent.clientX;
        var mouseY = mouseEvent.clientY;

        // 마우스 우클릭 위치에 "길찾기" 버튼과 체크박스 표시
        routeButton.style.left = mouseX + 'px';
        routeButton.style.top = mouseY + 'px';
        routeButton.style.display = 'block';  // 버튼을 화면에 표시

        checkboxContainer.style.left = (mouseX + 65) + 'px';
        checkboxContainer.style.top = mouseY + 'px';
        checkboxContainer.style.display = 'block';

        // "길찾기" 버튼 클릭 시 오버레이를 표시하고, iframe에 경로 표시
        routeButton.onclick = function() {
            var selectedDestinations = destinations.filter(dest => document.getElementById(dest.id).checked);


            if (selectedDestinations.length > 0) {
                var destinationIds = selectedDestinations.map(dest => dest.id).join(',');

                // URL에 선택된 목적지 id 추가
                var url = `https://luciferhong.github.io/luciferhong/public2.html?startX=${startX}&startY=${startY}&selected=${destinationIds}`;
                 //var url = `https://luciferhong.github.io/luciferhong/public2.html?startX=${startX}&startY=${startY}&mode=transit`;
                //var url = `http://localhost:8000/test2.html?startX=${startX}&startY=${startY}&selected=${destinationIds}`;

                iframe.src = url;
                overlay.style.display = 'flex';
                routeButton.style.display = 'none';
                checkboxContainer.style.display = 'none';
               //document.querySelector('.ctn_wrap.open').style.width = '0px';
              //document.querySelector('.map_wrap').style.width = `calc(100% - 390px)`;
        document.querySelector('.map_wrap').style.height = '40%';
            } else {
                alert('적어도 하나의 목적지를 선택하세요.');
            }


            // 버튼과 체크박스를 다시 숨김
            routeButton.style.display = 'none';
            checkboxContainer.style.display = 'none';
        };
    });

    // 지도 클릭 시 "길찾기" 버튼 숨기기
    map.getElement().addEventListener('click', function() {
        routeButton.style.display = 'none';
        checkboxContainer.style.display = 'none';
    });
});
