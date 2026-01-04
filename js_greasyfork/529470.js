// ==UserScript==
// @name        [루시퍼홍] 배너 진짜 잠깐만 숨길게요(호갱)
// @namespace   Violentmonkey Scripts
// @match       *://hogangnono.com/*
// @grant       none
// @version     1.0
// @author      루시퍼홍
// @description 2025. 3. 11. 오후 14:05:18
// @downloadURL https://update.greasyfork.org/scripts/529470/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EB%B0%B0%EB%84%88%20%EC%A7%84%EC%A7%9C%20%EC%9E%A0%EA%B9%90%EB%A7%8C%20%EC%88%A8%EA%B8%B8%EA%B2%8C%EC%9A%94%28%ED%98%B8%EA%B0%B1%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529470/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EB%B0%B0%EB%84%88%20%EC%A7%84%EC%A7%9C%20%EC%9E%A0%EA%B9%90%EB%A7%8C%20%EC%88%A8%EA%B8%B8%EA%B2%8C%EC%9A%94%28%ED%98%B8%EA%B0%B1%29.meta.js
// ==/UserScript==




(function () {
  'use strict';

  const currentVersion = GM_info.script.version;
  const scriptName = GM_info.script.name;
  console.log(scriptName + ' ' + "currentVersion: " + currentVersion);
  const updateUrl = GM_info.script.updateURL;
  const cafeUrl = 'https://cafe.naver.com/wecando7/11452896';
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



window.onload = () => {
    //console.log("스크립트 동작 중...");

    // MutationObserver 설정
    const observer = new MutationObserver(() => {
        const toolGroup = document.querySelector('.tool-group');

        if (toolGroup) {
            console.log(".tool-group 요소를 찾았습니다.");

            // 버튼 요소 생성 및 설정
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '잠시만';
            deleteButton.className = 'css-191hamz e10ldppk1';
            deleteButton.style.marginTop = '10px';

            // 버튼 클릭 시 .pin 요소들을 삭제하는 이벤트 리스너 추가
            deleteButton.addEventListener('click', () => {
                document.querySelectorAll('.offer-info-window-wrapper').forEach(el => {
                   el.style.display = 'none';
                });
                 document.querySelectorAll('.offer-ad-marker').forEach(el => {
                    if (el.querySelector('.window')) {  // 하위 요소 중 class="window"가 있는 경우
                        el.style.display = 'none';
                        //console.log('배너 숨김:', el);
                    }
                });


            });

            // .tool-group의 자식 요소로 버튼 추가
            toolGroup.appendChild(deleteButton);

            // observer를 중지하여 더 이상 실행하지 않도록 합니다.
            observer.disconnect();
        }
    });

    // observer 시작 - document의 변경 사항을 감지
    observer.observe(document, { childList: true, subtree: true });
};

