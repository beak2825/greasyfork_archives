// ==UserScript==
// @name        [루시퍼홍] 아실 공급 지도
// @namespace   Violentmonkey Scripts
// @match       https://asil.kr/app/household.jsp*
// @grant       none
// @version     1.0
// @author      -
// @description 2025. 2. 23. 오후 9:28:44
// @downloadURL https://update.greasyfork.org/scripts/527881/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%EA%B3%B5%EA%B8%89%20%EC%A7%80%EB%8F%84.user.js
// @updateURL https://update.greasyfork.org/scripts/527881/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%EA%B3%B5%EA%B8%89%20%EC%A7%80%EB%8F%84.meta.js
// ==/UserScript==


(function () {
  'use strict';

  const currentVersion = GM_info.script.version;
  const scriptName = GM_info.script.name;
  console.log(scriptName + ' ' + "currentVersion: " + currentVersion);
  const updateUrl = GM_info.script.updateURL;
  const cafeUrl = 'https://cafe.naver.com/wecando7/11435724';
  const popupDismissKey = 'scriptUpdatePopupDismissed';
  const dismissDuration = 24 * 60 * 60 * 1000; // 24시간

  // 한국 시간을 가져오는 함수
  function getKoreanTime() {
    const now = new Date();
    const utcNow = now.getTime() + (now.getTimezoneOffset() * 60000); // UTC 시간
    const koreanTime = new Date(utcNow + (9 * 60 * 60 * 1000)); // 한국 시간 (UTC+9)
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
          if (!shouldDismissPopup()) {
            showUpdatePopup(latestVersion);
          }
        }
      }
    })
    .catch(error => {
      console.error('Failed to fetch the latest version information:', error);
    });

  function shouldDismissPopup() {
    const lastDismissTime = localStorage.getItem(popupDismissKey);
    if (!lastDismissTime) return false;

    const timeSinceDismiss = getKoreanTime().getTime() - new Date(lastDismissTime).getTime();
    return timeSinceDismiss < dismissDuration;
  }

  function dismissPopup() {
    const koreanTime = getKoreanTime();
    const formattedTime = formatDateTo24Hour(koreanTime);
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
  }
})();


 var mapArea = document.querySelector(".map_area");

    function setSquareSize() {
        var width = mapArea.offsetWidth * 2 /3 ;
        mapArea.style.height = width + "px"; // 가로 길이에 맞춰 세로 길이 설정
    }

    setSquareSize(); // 초기 설정
    window.addEventListener("resize", setSquareSize); // 창 크기 변경 시 조정


var iframe = document.getElementById("ifrm_map");



iframe.addEventListener("load", function () {
    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // 현재 시스템 날짜에서 연도 추출
    var currentYear = new Date().getFullYear();
    var nextYear = currentYear + 1;
    var next2Year = currentYear + 2;
    var next3Year = currentYear + 3;

    // MutationObserver 설정
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            var toolSmallWindows = iframeDoc.querySelectorAll(".tool_small_window");

            toolSmallWindows.forEach(function (tool) {
                if (tool.classList.contains("HIDDEN")) {
                    tool.style.display = "block";
                    tool.classList.remove("HIDDEN");
                }

                // 백그라운드 이미지 제거 및 스타일 설정
                tool.style.backgroundImage = "none";
                tool.style.color = "white"; // 글자색 흰색
                tool.style.border = "1px solid black"; // 테두리 유지
                tool.style.padding = "5px"; // 가독성 향상

                // 툴팁의 텍스트를 가져와서 입주 년도를 추출
                var text = tool.innerText || tool.textContent;
                var match = text.match(/(\d{4})\.\d+/); // "2025.11" 같은 형식에서 연도 추출

                if (match) {
                    var year = parseInt(match[1]); // 추출된 연도를 숫자로 변환

                    // 년도 조건에 따라 배경색 변경
                    if (year === currentYear) {
                        tool.style.backgroundColor = "#FC2C2C"; // 현재 연도 #EEA362
                    } else if (year === nextYear) {
                        tool.style.backgroundColor = "#F25E04"; // +1년 F79905
                    } else if (year === next2Year) {
                        tool.style.backgroundColor = "#F79905"; // +2년 0DC758
                    } else if (year === next3Year) {
                        tool.style.backgroundColor = "#EEA362"; // +3년 F66284
                    } else if (year > next3Year) {
                        tool.style.backgroundColor = "#DDC40D"; // 3년 이후 A3A3A3
                    } else {
                        tool.style.backgroundColor = "#E95DCE"; // 그 외 E95DCE
                    }
                } else {
                    tool.style.backgroundColor = "black"; // 기본값
                }
            });
        });
    });

    // iframe 내부 문서에서 변화 감지
    observer.observe(iframeDoc, { childList: true, subtree: true, attributes: true });

    // iframe 내부 문서에 스타일 추가
    let style = iframeDoc.createElement("style");
    style.innerHTML = `
        .tool_small_window {
            border: 1px solid black !important;
            background-image: none !important;
            color: white !important;
            opacity: 1 !important;
            background-blend-mode: normal !important;
            padding: 5px !important;
        }
        .tool_small_window p{

            color: white !important;

        }
    `;
    iframeDoc.head.appendChild(style);


        // 모든 h3 태그 찾기
    const headings = document.querySelectorAll('h3.h3');
    //console.log(headings)
    // "APT 공급위치" 텍스트가 있는 h3 찾기
    headings.forEach((heading) => {
        if (heading.textContent.trim() === 'APT 공급위치') {
            // 버튼 생성
            const openButton = iframeDoc.createElement('button');
            openButton.textContent = '크게보기';
            openButton.style.marginLeft = '10px';
            openButton.style.padding = '5px 10px';
            openButton.style.fontSize = '14px';
            openButton.style.backgroundColor = '#1c32f7';
            openButton.style.color = 'white';
            openButton.style.border = 'none';
            openButton.style.borderRadius = '4px';
            openButton.style.cursor = 'pointer';

            // 버튼 클릭 시 새 탭에서 URL 열기
            openButton.onclick = function() {
                window.open('https://asil.kr/app/household.jsp?os=pc&area=11', '_blank');
            };

            // 버튼을 해당 h3 요소에 추가
            heading.appendChild(openButton);
        }
    });
});
