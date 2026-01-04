// ==UserScript==
// @name        [루시퍼홍] 네이버 부동산 중개소 다운로드
// @namespace   Violentmonkey Scripts
// @match       https://new.land.naver.com/complexes*
// @version     1.02
// @description Please use with Violentmonkey
// @require     https://code.jquery.com/jquery-1.12.4.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.4/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/521419/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B6%80%EB%8F%99%EC%82%B0%20%EC%A4%91%EA%B0%9C%EC%86%8C%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/521419/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B6%80%EB%8F%99%EC%82%B0%20%EC%A4%91%EA%B0%9C%EC%86%8C%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.meta.js
// ==/UserScript==




(function () {
  'use strict';

  const currentVersion = GM_info.script.version;
  const scriptName = GM_info.script.name;
  console.log(scriptName + ' ' + "currentVersion: " + currentVersion);
  const updateUrl = GM_info.script.updateURL;
  const cafeUrl = 'https://cafe.naver.com/wecando7/11356083';
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

    // 토큰을 비동기적으로 가져오는 함수
    async function fetchToken() {
        const tokenUrl = "https://new.land.naver.com/complexes";
        const response = await fetch(tokenUrl, { method: 'GET' });
        const text = await response.text();
        const tokenStartIndex = text.indexOf('token') + 17;
        const tokenEndIndex = text.indexOf('"', tokenStartIndex);
        const token = text.substring(tokenStartIndex, tokenEndIndex);
        return `Bearer ${token}`;
    }

    // 1초 지연 함수
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 요청 감지 활성화 상태 변수
    let isMonitoringEnabled = false;
    let isIntercepted = false;

    // 기존 XMLHttpRequest 메서드 백업
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    // 버튼 추가
    const newDiv2 = document.createElement("div");
    newDiv2.className = "filter_group filter_group--size";
    newDiv2.style.margin = "6px 10px 0px 0px";
    newDiv2.style.display = "inline-block";

    const realtorBtn = document.createElement("button");
    realtorBtn.innerText = "중개소 내려받기";
    realtorBtn.id = "realtorBtn";
    realtorBtn.style.width = "100px";
    realtorBtn.style.height = "20px";
    realtorBtn.style.color = "white";
    realtorBtn.style.backgroundColor = "#FF0000";

    const parentDiv = document.querySelector("#filter > div");
    newDiv2.appendChild(realtorBtn);
    parentDiv.appendChild(newDiv2);
    console.log("버튼 추가 완료");

    // 엑셀 다운로드 함수
    function downloadExcel(data) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.sheet_add_aoa(worksheet, [["중개소", "유선", "무선", "주소"]], { origin: "A1" });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Realtors");
        XLSX.writeFile(workbook, "네이버부동산 중개소.xlsx");
    }

    // 버튼 클릭 이벤트 리스너
    realtorBtn.addEventListener('click', async function () {
        // 요청 모니터링 활성화 여부 전환
        isMonitoringEnabled = !isMonitoringEnabled;
        console.log(`요청 모니터링: ${isMonitoringEnabled ? '활성화' : '비활성화'}`);

        if (isMonitoringEnabled && !isIntercepted) {
            interceptRequests(); // 요청 가로채기 설정
            isIntercepted = true;
            // 지도 중개사 마커 상태 토글
            const agentButton = document.querySelector('a.map_control--agent');
            if (agentButton) {
                const ariaPressed = agentButton.getAttribute('aria-pressed');
                if (ariaPressed === 'true') {
                    agentButton.click(); // 마커 끄기
                    console.log("중개사 마커 끄기");
                    await sleep(1000);
                    agentButton.click(); // 마커 켜기
                } else {
                    agentButton.click(); // 마커 켜기
                    console.log("중개사 마커 켜기");
                }
            }
        } else if (!isMonitoringEnabled) {
            // XMLHttpRequest 원본 복구 (모니터링 중단)
            XMLHttpRequest.prototype.open = originalOpen;
            XMLHttpRequest.prototype.send = originalSend;
            console.log('요청 모니터링 중단');
            isIntercepted = false;
        }


    });

    // XMLHttpRequest 가로채기 함수
    function interceptRequests() {
        // 요청 정보를 저장할 Map
        const requestMap = new WeakMap();

        // XMLHttpRequest open 메서드 재정의
        XMLHttpRequest.prototype.open = function (method, url, ...rest) {
            if (isMonitoringEnabled && url.startsWith('/api/realtors/detailed-clusters?')) { // 활성화 상태에서만 동작
                requestMap.set(this, { method, url });
            }
            return originalOpen.apply(this, [method, url, ...rest]);
        };

        // XMLHttpRequest send 메서드 재정의
        XMLHttpRequest.prototype.send = function (body) {
            if (isMonitoringEnabled) { // 활성화 상태에서만 동작
                this.addEventListener('load', async function () {
                    const requestInfo = requestMap.get(this);
                    const requestUrl = requestInfo?.url || '';

                    if (isMonitoringEnabled && requestUrl.startsWith('/api/realtors/detailed-clusters?')) {
                        console.log(`[Intercepted XHR Request] URL: ${requestUrl}`);
                        showPopupMessage("처리 중입니다.\n\n중개소가 많을 경우 시간이 소요될 수 있습니다.");

                        try {
                            // 응답 데이터 파싱
                            const data = JSON.parse(this.responseText);

                            // realtorId로 상세 정보 요청
                            let extracted = [];
                            let token = await fetchToken();
                            for (const item of data) {
                                for (const realtor of item.realtors) {
                                    const response = await fetch(`https://new.land.naver.com/api/realtors/${realtor.realtorId}`, {
                                        headers: {
                                            "accept": "*/*",
                                            "authorization": token
                                        },
                                        method: "GET"
                                    });
                                    const detail = await response.json();
                                    const realtorDetail = detail.realtor;

                                    extracted.push({
                                        중개소: realtorDetail.realtorName,
                                        유선: realtorDetail.representativeTelNo,
                                        무선: realtorDetail.cellPhoneNo,
                                        주소: realtorDetail.address,
                                        매매 :realtorDetail.dealCount,
                                        전세 :realtorDetail.leaseCount,
                                        월세 :realtorDetail.rentCount
                                    });
                                    sleep(500);
                                }
                            }

                            downloadExcel(extracted);
                            hidePopupMessage();
                            document.querySelector('#realtorBtn').click();
                        } catch (error) {
                            console.error('XHR 처리 중 오류 발생:', error);
                        }
                    }
                });
            }
            return originalSend.apply(this, [body]);
        };
    }



     // 팝업 메시지 표시 함수
    function showPopupMessage(message) {
        let popup = document.querySelector('#download-popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'download-popup';
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.width = '500px';
            popup.style.height = '150px';
            popup.style.display = 'flex';
            popup.style.alignItems = 'center';
            popup.style.justifyContent = 'center';
            popup.style.textAlign = 'center';
            popup.style.padding = '20px';
            popup.style.backgroundColor = '#000';
            popup.style.color = '#fff';
            popup.style.fontSize = '16px';
            popup.style.borderRadius = '8px';
            popup.style.zIndex = '9999';
            popup.style.lineHeight = '1.5';
            document.body.appendChild(popup);
        }
        popup.textContent = message;
        popup.innerHTML = message.replace(/\n/g, '<br>'); // 줄바꿈 지원
        popup.style.display = 'block';
    }

    function hidePopupMessage() {
        const popup = document.querySelector('#download-popup');
        if (popup) popup.style.display = 'none';
    }


})();


/* 복사 버튼 추가 */
(function () {
  const observer = new MutationObserver(() => {
    const target = document.querySelector('.info_agent_title');
    if (!target || document.querySelector('#btnCopyAgencyInfo')) return;

    const btn = document.createElement('button');
    btn.textContent = '📋 복사';
    btn.id = 'btnCopyAgencyInfo';
    btn.style.marginLeft = '10px';
    btn.style.padding = '4px 8px';
    btn.style.border = '1px solid #ccc';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '12px';
    target.appendChild(btn);

    btn.addEventListener('click', () => {
      try {
        const name = document.querySelector('.info_agent_title .title')?.innerText.trim() || '';
        const rep = document.querySelector('.info_agent dd.text')?.childNodes[0]?.textContent.trim() || '';
        const addrFull = document.querySelector('.tooltip_site')?.textContent.trim() || '';

        const addrParts = addrFull.split(' ');
        const sido = addrParts[0] || '';
        const sigungu = addrParts[1] || '';
        const eupmyeondong = addrParts[2] || '';
        const restAddr = addrParts.slice(3).join(' ') || '';

        const phoneRaw = Array.from(document.querySelectorAll('.info_agent--call dd.text--number'))
          .map(dd => dd.textContent.trim().replace(/\s+/g, ''))
          .filter((v, i, arr) => arr.indexOf(v) === i)
          .join('/')
          .split('/');

        const phone1 = phoneRaw[0] || '';
        const phone2 = phoneRaw[1] || '';

        const 매매 = document.querySelector('.article_quantity .article_link:nth-child(1) .count')?.textContent.trim() || '0';
        const 전세 = document.querySelector('.article_quantity .article_link:nth-child(2) .count')?.textContent.trim() || '0';
        const 월세 = document.querySelector('.article_quantity .article_link:nth-child(3) .count')?.textContent.trim() || '0';

        const result = [
          name,
          phone1,
          phone2,
          addrFull,
          sido,
          sigungu,
          eupmyeondong,
          restAddr,
          매매,
          전세,
          월세
        ].join('\t');

        navigator.clipboard.writeText(result).then(() => {
         // alert('📋 클립보드에 복사됨:\n\n' + result);
        });
      } catch (e) {
        alert('❌ 복사 중 오류: ' + e.message);
      }
    });

    console.log('✅ 복사 버튼 생성됨');
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();


