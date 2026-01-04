// ==UserScript==
// @name        [루시퍼홍] 아실 중개소 연락처 다운로드
// @namespace   Violentmonkey Scripts
// @match       https://asil.kr/asil/*
// @grant       none
// @version     1.01
// @author      루시퍼홍
// @require     https://code.jquery.com/jquery-1.12.4.min.js
// @description 2024. 7. 1. 오후 14:40:18
// @license
// @downloadURL https://update.greasyfork.org/scripts/521202/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%EC%A4%91%EA%B0%9C%EC%86%8C%20%EC%97%B0%EB%9D%BD%EC%B2%98%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/521202/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%EC%A4%91%EA%B0%9C%EC%86%8C%20%EC%97%B0%EB%9D%BD%EC%B2%98%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.meta.js
// ==/UserScript==
//


(function () {
  'use strict';

  const currentVersion = GM_info.script.version;
  const scriptName = GM_info.script.name;
  console.log(scriptName + ' ' + "currentVersion: " + currentVersion);
  const updateUrl = GM_info.script.updateURL;
  const cafeUrl = 'https://cafe.naver.com/wecando7/11352809';
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


let agencyDownloadBtn = `<div class="filter_item" id="agencyDownload"><a href="#" class="filter_btn" id="agencyDownload"><i></i>중개소 다운로드</a></div>`;



jQuery('#filter > div.filter_scroll > div').append(agencyDownloadBtn);



document.getElementById('agencyDownload').addEventListener('click', function(event) {
    downloadStart();
});


async function downloadStart(){
// Step 1: SheetJS 라이브러리 로드
const script = document.createElement('script');
script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
document.head.appendChild(script);

// Step 2: 모든 관련 요소 찾기 (클래스 mmbrPin 사용)
const elements = Array.from(document.querySelectorAll('.mmbrPin'));

// Step 3: 부동산 ID 추출
const memberIds = elements.map(element => {
    const onclickAttr = element.getAttribute('onclick');
    if (!onclickAttr) return null;

    const match = onclickAttr.match(/clickMember\('(-?\d+)'/);
    return match ? match[1] : null;
}).filter(id => id !== null); // null 값을 필터링

console.log("Extracted Member IDs:", memberIds);
console.log(memberIds.length)
if(memberIds.length == 0){
  alert("화면에 표시된 중개소가 없습니다")
  return;
}
// Step 4: fetch 요청 보내기 및 데이터 수집
async function fetchRealEstateData(memberId) {
    try {
        const response = await fetch(`https://asil.kr/app/sale_of_member.jsp?os=pc&user=0&member=${memberId}`, {
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "ko-KR,ko;q=0.9,zh-MO;q=0.8,zh;q=0.7,en-US;q=0.6,en;q=0.5",
                "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "iframe",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1"
            },
            referrer: "https://asil.kr/asil/index.jsp?1500059354",
            referrerPolicy: "strict-origin-when-cross-origin",
            method: "GET",
            mode: "cors",
            credentials: "include"
        });

        if (!response.ok) {
            console.error(`Failed to fetch data for member ID: ${memberId}`);
            return { 중개소: "Unknown", 유선: "Unknown", 무선: "Unknown" };
        }

        // 서버 응답을 ArrayBuffer로 가져옴
        const arrayBuffer = await response.arrayBuffer();

        // TextDecoder로 디코딩 (EUC-KR로 시도)
        const decoder = new TextDecoder("euc-kr");
        const decodedText = decoder.decode(arrayBuffer);

        // HTML 응답 파싱
        const parser = new DOMParser();
        const doc = parser.parseFromString(decodedText, "text/html");

        const name = doc.querySelector(".sale_of_mmbr_info .tit")?.textContent.trim() || "Unknown";
        const tel = doc.querySelector(".sale_of_mmbr_info .tel span")?.textContent.trim() || "Unknown";

        // 연락처를 / 기준으로 나눔
        const [유선, 무선] = (tel || "").split(" / ").map(t => t.trim());

        return { 중개소: name, 유선, 무선 };
    } catch (error) {
        console.error(`Error fetching data for member ID: ${memberId}`, error);
        return { 중개소: "Unknown", 유선: "Unknown", 무선: "Unknown" };
    }
}

// Step 5: 모든 부동산 ID에 대해 데이터 수집 및 출력
(async () => {
    if (memberIds.length === 0) {
        console.log("No member IDs found.");
        return;
    }

    const results = [];
    for (const memberId of memberIds) {
        const data = await fetchRealEstateData(memberId);
        if (data) {
            results.push(data);
        }
    }

    console.log("Collected Data:", results);

    // Step 6: 엑셀 데이터 생성 및 다운로드
    const worksheet = XLSX.utils.json_to_sheet(results); // JSON 데이터를 엑셀 시트로 변환

    // Step 6.1: 헤더 이름 변경
    worksheet['A1'].v = "중개소"; // A1 셀의 헤더를 "중개소"로 변경
    worksheet['B1'].v = "유선";   // B1 셀의 헤더를 "유선"으로 변경
    worksheet['C1'].v = "무선";   // C1 셀의 헤더를 "무선"으로 변경

    const workbook = XLSX.utils.book_new(); // 새로운 엑셀 워크북 생성
    XLSX.utils.book_append_sheet(workbook, worksheet, "Real Estate Data"); // 워크북에 시트 추가

    // 엑셀 파일 생성 및 다운로드
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "중개소 다운로드.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
})();

}

