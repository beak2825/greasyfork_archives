// ==UserScript==
// @name        [루시퍼홍] 지인 수요/공급 표 필터링
// @namespace   Violentmonkey Scripts
// @match       https://aptgin.com/home/gin05/gin0501*
// @grant       none
// @version     1.1
// @author      -
// @description 2025. 7. 21. 오전 9:57:03
// @downloadURL https://update.greasyfork.org/scripts/543194/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%A7%80%EC%9D%B8%20%EC%88%98%EC%9A%94%EA%B3%B5%EA%B8%89%20%ED%91%9C%20%ED%95%84%ED%84%B0%EB%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/543194/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%A7%80%EC%9D%B8%20%EC%88%98%EC%9A%94%EA%B3%B5%EA%B8%89%20%ED%91%9C%20%ED%95%84%ED%84%B0%EB%A7%81.meta.js
// ==/UserScript==



(function () {
  'use strict';

  const currentVersion = GM_info.script.version;
  const scriptName = GM_info.script.name;
  console.log(scriptName + ' ' + "currentVersion: " + currentVersion);
  const updateUrl = GM_info.script.updateURL;
  const cafeUrl = 'https://cafe.naver.com/wecando7/11574995';
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
  const container = document.getElementById('AllForAptList');
  if (!container) return alert('#AllForAptList 요소를 찾을 수 없습니다');

  // ✅ 필터 UI 생성 함수
  function createRegionFilter() {
    // 기존 필터 제거
    document.getElementById('aptRegionFilterBox')?.remove();

    const lockedRows = container.querySelectorAll('.k-grid-content-locked tbody tr');
    const dataRows = container.querySelectorAll('.k-grid-content tbody tr');
    const regions = Array.from(lockedRows).map(row => row.cells[0]?.textContent.trim());
    const uniqueRegions = [...new Set(regions)];

    if (uniqueRegions.length === 0) return; // 데이터 없으면 생성하지 않음

    // 필터 UI DOM 생성
    const filterBox = document.createElement('div');
    filterBox.id = 'aptRegionFilterBox';
    filterBox.style.border = '1px solid #ccc';
    filterBox.style.padding = '8px 12px';
    filterBox.style.marginBottom = '10px';
    filterBox.style.background = '#f9f9f9';
    filterBox.style.fontSize = '14px';

    filterBox.innerHTML = `
      <strong>📌 지역 필터 : </strong>
      <label style="margin-right: 12px;">
        <input type="checkbox" id="aptRegionAll" checked> 전체선택
      </label>
      ${uniqueRegions.map(r => `
        <label style="margin-right: 10px;">
          <input type="checkbox" class="aptRegionCheck" data-region="${r}" checked> ${r}
        </label>
      `).join('')}
    `;

    container.parentNode.insertBefore(filterBox, container);
      const box = document.getElementById('aptRegionFilterBox');
  if (!box) return alert('필터 박스가 없습니다.');

  // 모든 라벨에 줄간격 스타일 적용
  box.querySelectorAll('label').forEach(label => {
    label.style.display = 'inline-block';
    label.style.marginBottom = '10px'; // 기존보다 줄 간격 2배
  });

  // 전체 박스의 line-height 증가도 적용
  box.style.lineHeight = '2.2';

    // 필터 동작
    function applyFilter() {
      const checked = Array.from(document.querySelectorAll('.aptRegionCheck:checked'))
        .map(cb => cb.dataset.region);
      for (let i = 0; i < lockedRows.length; i++) {
        const region = lockedRows[i].cells[0]?.textContent.trim();
        const show = checked.includes(region);
        lockedRows[i].style.display = show ? '' : 'none';
        dataRows[i].style.display = show ? '' : 'none';
      }
    }

    document.getElementById('aptRegionAll').addEventListener('change', e => {
      const check = e.target.checked;
      document.querySelectorAll('.aptRegionCheck').forEach(cb => cb.checked = check);
      applyFilter();
    });

    document.querySelectorAll('.aptRegionCheck').forEach(cb => {
      cb.addEventListener('change', () => {
        const all = document.getElementById('aptRegionAll');
        const allChecks = document.querySelectorAll('.aptRegionCheck');
        const checked = document.querySelectorAll('.aptRegionCheck:checked');
        all.checked = allChecks.length === checked.length;
        applyFilter();
      });
    });

    applyFilter();
  }

  // ✅ 최초 생성
  createRegionFilter();

  // ✅ MutationObserver로 테이블 감시
  const observer = new MutationObserver(mutations => {
    // 테이블 내용 바뀌면 필터 재생성
    createRegionFilter();
  });

  observer.observe(container, {
    childList: true,
    subtree: true
  });

  console.log('✅ 지역 필터 감시 시작됨');
})();
