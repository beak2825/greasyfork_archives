// ==UserScript==
// @name        [루시퍼홍] 튜터링데이 인증샷 Helper
// @namespace   Violentmonkey Scripts
// @match       https://cafe.naver.com/*
// @version     1.00
// @author      루시퍼홍
// @description 앨범형 게시판 drag 기능만
// @require     https://code.jquery.com/jquery-1.12.4.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.10/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/546515/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%ED%8A%9C%ED%84%B0%EB%A7%81%EB%8D%B0%EC%9D%B4%20%EC%9D%B8%EC%A6%9D%EC%83%B7%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/546515/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%ED%8A%9C%ED%84%B0%EB%A7%81%EB%8D%B0%EC%9D%B4%20%EC%9D%B8%EC%A6%9D%EC%83%B7%20Helper.meta.js
// ==/UserScript==


(function () {
  'use strict';

  const currentVersion = GM_info.script.version;
  const scriptName = GM_info.script.name;
  console.log(scriptName + ' ' + "currentVersion: " + currentVersion);
  const updateUrl = GM_info.script.updateURL;
  const cafeUrl = 'https://cafe.naver.com/wecando7/11596953';
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

(function () {
  'use strict';

  let draggedEl = null;

  /** 각 item 을 draggable 로 만들기 */
  function enableDrag() {
    document.querySelectorAll('.article-album-view .item').forEach(item => {
      if (item.getAttribute('draggable') === 'true') return;

      item.setAttribute('draggable', 'true');

      item.addEventListener('dragstart', function () {
        draggedEl = this;
      });

      item.addEventListener('dragover', function (e) {
        e.preventDefault();
      });

      item.addEventListener('drop', function (e) {
        e.preventDefault();
        if (!draggedEl || draggedEl === this) return;
        this.parentNode.insertBefore(draggedEl, this);
      });
    });
  }

  /** article-board 가 등장할 때까지 반복 체크 후 drag 만 적용 */
  function initWhenReady() {
    const board = document.querySelector('.article-board');
    if (!board) {
      setTimeout(initWhenReady, 200);
      return;
    }


    enableDrag();

    // ajax 로 item 이 새로 로딩될 때도 drag 재부여
    const observer = new MutationObserver(() => {
      enableDrag();
    });
    observer.observe(board, { childList: true, subtree: true });
  }

  initWhenReady();
})();
