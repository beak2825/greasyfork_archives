// ==UserScript==
// @name        [루시퍼홍] 호갱노노 학교/주변상권 스크롤
// @namespace   Violentmonkey Scripts
// @match       *://hogangnono.com/apt/*
// @grant       none
// @version     1.1
// @description 2025. 1. 23. 오전 11:05:18
// @downloadURL https://update.greasyfork.org/scripts/524582/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%ED%98%B8%EA%B0%B1%EB%85%B8%EB%85%B8%20%ED%95%99%EA%B5%90%EC%A3%BC%EB%B3%80%EC%83%81%EA%B6%8C%20%EC%8A%A4%ED%81%AC%EB%A1%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/524582/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%ED%98%B8%EA%B0%B1%EB%85%B8%EB%85%B8%20%ED%95%99%EA%B5%90%EC%A3%BC%EB%B3%80%EC%83%81%EA%B6%8C%20%EC%8A%A4%ED%81%AC%EB%A1%A4.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const currentVersion = GM_info.script.version;
  const scriptName = GM_info.script.name;
  console.log(scriptName + ' ' + "currentVersion: " + currentVersion);
  const updateUrl = GM_info.script.updateURL;
  const cafeUrl = 'https://cafe.naver.com/wecando7/11398303';
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



// MutationObserver로 DOM 변화를 감지하여 버튼 추가
const observer = new MutationObserver((mutationsList, observer) => {
    mutationsList.forEach(mutation => {
        if (mutation.type === "childList") {
            //const addressInfo = document.querySelector(".address-info");
          const addressInfo = document.querySelector(".keyword-group");

            if (addressInfo &&
                !document.querySelector(".top-scroll-button") &&
                !document.querySelector(".top-scroll-button2")) {
                // 버튼이 없을 경우 추가
                addressInfo.style.padding = '0 8px 0 12px';
                addTopButton(addressInfo);
            }
        }
    });
});

// DOM 변화를 감지할 대상 요소
observer.observe(document.body, { childList: true, subtree: true });

// 버튼을 추가하는 함수
function addTopButton(addressInfo) {


    // 버튼 컨테이너 생성
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex"; // 버튼을 나란히 배치
    buttonContainer.style.gap = "8px"; // 버튼 간 간격
    buttonContainer.style.marginTop = "10px";

    // "학교 스크롤" 버튼 추가
    const schoolScroll = document.createElement("button");
    schoolScroll.textContent = "학교";
    schoolScroll.className = "top-scroll-button";
    schoolScroll.style.width = '110px';
    schoolScroll.style.backgroundColor = '#4D55B2';
    schoolScroll.style.color = 'white';
    schoolScroll.style.height = "25px";
    //schoolScroll.style.border = '1px solid white'; // 굵기, 스타일, 색상 추가
    schoolScroll.style.border = '1px solid rgba(255, 255, 255, 0.3)'
    schoolScroll.style.borderRadius = '5px';
    schoolScroll.style.cursor = 'pointer';
    schoolScroll.style.fontSize = "14px"; // 텍스트 크기를 절반으로 줄임


    // 클릭 이벤트 추가
    schoolScroll.addEventListener("click", () => {
        const targetElement = Array.from(document.querySelectorAll('.css-m7d4bq.e1a69gbo0')).find(el => el.textContent.trim() === '중학교' || el.textContent.trim() === '초등학교' || el.textContent.trim() === '고등학교');
        const scrollContainer = document.querySelector("#scrollElement");

        if (targetElement && scrollContainer) {
            const targetRect = targetElement.getBoundingClientRect();
            const containerRect = scrollContainer.getBoundingClientRect();
            const offset = targetRect.top - containerRect.top + scrollContainer.scrollTop;

            scrollContainer.scrollTo({
                top: offset,
                behavior: 'smooth',
            });
        } else {
            console.error("타겟 요소 또는 스크롤 컨테이너를 찾을 수 없습니다.");
        }
    });

    // "상권 스크롤" 버튼 추가
    const storeScroll = document.createElement("button");
    storeScroll.textContent = "주변 상권";
    storeScroll.className = "top-scroll-button2";
    storeScroll.style.width = '110px';
    storeScroll.style.backgroundColor = '#4D55B2';
    storeScroll.style.color = 'white';
    storeScroll.style.height = "25px";
    storeScroll.style.border = '1px solid rgba(255, 255, 255, 0.3)'
    storeScroll.style.borderRadius = '5px';
    storeScroll.style.cursor = 'pointer';
    storeScroll.style.fontSize = "14px"; // 텍스트 크기를 절반으로 줄임

    // 클릭 이벤트 추가
    storeScroll.addEventListener("click", () => {
        const targetElement = Array.from(document.querySelectorAll('.css-cufxs7.ei9pga10')).find(el => el.textContent.trim() === '주변 상권 정보');
        const scrollContainer = document.querySelector("#scrollElement");

        if (targetElement && scrollContainer) {
            const targetRect = targetElement.getBoundingClientRect();
            const containerRect = scrollContainer.getBoundingClientRect();
            const offset = targetRect.top - containerRect.top + scrollContainer.scrollTop;

            scrollContainer.scrollTo({
                top: offset,
                behavior: 'smooth',
            });
        } else {
            console.error("타겟 요소 또는 스크롤 컨테이너를 찾을 수 없습니다.");
        }
    });


  // "상권 스크롤" 버튼 추가
    const topScroll = document.createElement("button");
    topScroll.textContent = "상단";
    topScroll.className = "top-scroll-button2";
    topScroll.style.width = '110px';
    topScroll.style.backgroundColor = '#4D55B2';
    topScroll.style.color = 'white';
    topScroll.style.height = "25px";
    topScroll.style.border = '1px solid rgba(255, 255, 255, 0.3)'
    topScroll.style.borderRadius = '5px';
    topScroll.style.cursor = 'pointer';
    topScroll.style.fontSize = "14px"; // 텍스트 크기를 절반으로 줄임

    // 클릭 이벤트 추가
    topScroll.addEventListener("click", () => {
        //const targetElement = Array.from(document.querySelectorAll('.css-cufxs7.ei9pga10')).find(el => el.textContent.trim() === '주변 상권 정보');
        const scrollContainer = document.querySelector("#scrollElement");

        if (scrollContainer) {

            scrollContainer.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        } else {
            console.error("타겟 요소 또는 스크롤 컨테이너를 찾을 수 없습니다.");
        }
    });

    try{
    document.querySelector("#scrollElement").style.marginTop = "230px";
    }catch{

    }
    // 버튼 컨테이너에 버튼 추가
    buttonContainer.appendChild(schoolScroll);
    buttonContainer.appendChild(storeScroll);
    buttonContainer.appendChild(topScroll);

    // address-info 아래에 버튼 컨테이너 추가
    addressInfo.appendChild(buttonContainer);

}
