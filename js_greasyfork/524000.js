// ==UserScript==
// @name        [루시퍼홍] 지인 수요/입주 다운로드
// @namespace   Violentmonkey Scripts
// @match       https://aptgin.com/home/gin05/gin0501
// @grant       none
// @version     1.1
// @author      -
// @description 2025. 1. 15. 오전 9:57:03
// @downloadURL https://update.greasyfork.org/scripts/524000/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%A7%80%EC%9D%B8%20%EC%88%98%EC%9A%94%EC%9E%85%EC%A3%BC%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/524000/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%A7%80%EC%9D%B8%20%EC%88%98%EC%9A%94%EC%9E%85%EC%A3%BC%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.meta.js
// ==/UserScript==


(function () {
  'use strict';

  const currentVersion = GM_info.script.version;
  const scriptName = GM_info.script.name;
  console.log(scriptName + ' ' + "currentVersion: " + currentVersion);
  const updateUrl = GM_info.script.updateURL;
  const cafeUrl = 'https://cafe.naver.com/wecando7/11389722';
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


// SheetJS 라이브러리 로드
const script = document.createElement("script");
script.src = "https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js";
document.head.appendChild(script);

// XMLHttpRequest 요청 감지 및 body 대체를 위한 설정
const originalOpen = XMLHttpRequest.prototype.open;
const originalSend = XMLHttpRequest.prototype.send;

let interceptedBody = ""; // 가로챈 요청 데이터를 저장하는 변수
let isListening = false; // 요청 감지 활성화 여부
let onRequestIntercepted = null; // 요청 감지 후 실행할 콜백 함수

// open 메서드 재정의
XMLHttpRequest.prototype.open = function (method, url, ...rest) {
  this._url = url; // 요청 URL 저장
  return originalOpen.apply(this, [method, url, ...rest]);
};

// send 메서드 재정의
XMLHttpRequest.prototype.send = function (body) {
  if (isListening && this._url && this._url.includes("/home/gin05/getGin0501")) {
    interceptedBody = body; // 요청 body 저장
    //console.log("Intercepted body:", interceptedBody);

  }
  return originalSend.apply(this, [body]);
};

// 데이터를 가져와 엑셀로 저장하는 함수
function fetchDataAndDownloadExcel() {
  // 요청 감지 활성화
  isListening = true;
  //console.log("감지 시작: /home/gin05/getGin0501 요청을 기다립니다...");

  // "검색" 버튼 클릭
  const searchButton = document.querySelector("#btn_search");
  if (searchButton) {
    searchButton.click();
    //console.log("검색 버튼 클릭됨");
  } else {
    //console.error("#btn_search 버튼을 찾을 수 없습니다.");
    alert("검색 버튼이 없습니다.");
    return;
  }

  // 요청 감지 완료 시 실행될 콜백 함수
onRequestIntercepted = () => {
    fetch("https://aptgin.com/home/gin05/getGin0501", {
        headers: {
            "accept": "*/*",
            "accept-language": "ko-KR,ko;q=0.9,zh-MO;q=0.8,zh;q=0.7,en-US;q=0.6,en;q=0.5",
            "ajax": "true",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        referrer: "https://aptgin.com/",
        referrerPolicy: "origin",
        body: interceptedBody, // 가로챈 데이터를 사용
        method: "POST",
        mode: "cors",
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
            const dataArray = data[5];
            if (!Array.isArray(dataArray)) {
                console.error("Invalid data format: expected an array at index 5");
                return;
            }

            fetchDataAndDownloadExcelWithParsedAddresses(dataArray);

            // 감지 중단
            interceptedBody = ""; // 저장된 요청 데이터 초기화
        })
        .catch(error => console.error("Error fetching or processing data:", error));
};

    isListening = false; // 감지 중단
    if (onRequestIntercepted) {
      onRequestIntercepted(); // 요청 감지 후 콜백 실행
    }
}

// "다운로드" 버튼 추가 함수
function addDownloadButton() {
  const searchForm = document.querySelector("#searchForm .right");

  if (searchForm) {
    const downloadButton = document.createElement("button");
    downloadButton.id = "btn_download";
    downloadButton.textContent = "다운로드";

    // 스타일 적용
    downloadButton.style.height = "38px"; // 높이
    downloadButton.style.padding = "0 35px"; // 내부 여백
    downloadButton.style.borderRadius = "3px"; // 모서리 둥글게
    downloadButton.style.backgroundColor = "#FFA500"; // 주황색 배경
    downloadButton.style.color = "white"; // 흰색 글자
    downloadButton.style.fontFamily = "NotoSansR"; // 폰트
    downloadButton.style.fontSize = "14px"; // 폰트 크기
    downloadButton.style.border = "none"; // 테두리 제거
    downloadButton.style.cursor = "pointer"; // 클릭 커서
    downloadButton.style.transition = "0.3s ease-in-out"; // 애니메이션 효과

    // 클릭 이벤트 추가
    downloadButton.addEventListener("click", fetchDataAndDownloadExcel);

    // "검색" 버튼 옆에 "다운로드" 버튼 추가
    searchForm.appendChild(downloadButton);
    //console.log("다운로드 버튼 추가 완료");
  } else {
    console.error("#searchForm .right 요소를 찾을 수 없습니다.");
  }
}

// 주소 데이터를 분석하여 시도, 시군구, 읍면동으로 구분하는 함수
function parseAddress(address) {
    // 불필요한 공백 제거
    address = address.trim().replace(/\s+/g, ' ');

    // 띄어쓰기 단위로 분리
    const parts = address.split(' ');

    // 초기값 설정
    let sido = parts[0] || ""; // 첫 번째 요소는 시도
    let sigungu = parts[1] || ""; // 두 번째 요소는 시군구
    let eupmyeondong = parts[2] || ""; // 세 번째 요소는 읍면동

    // 읍면동에 '구'로 끝나는 경우 시군구로 합침
    if (/구$/.test(eupmyeondong)) {
        sigungu = sigungu + ' ' + eupmyeondong; // 시군구와 합침
        eupmyeondong = parts[3] || ""; // 다음 요소를 읍면동으로 설정
    }

    return { sido, sigungu, eupmyeondong };
}

// 데이터를 가져와 엑셀로 저장하는 함수
function fetchDataAndDownloadExcelWithParsedAddresses(dataArray) {
    // 데이터 파싱
    const excelData = dataArray.map(item => {
        const address = item.location_site || "";
        let parsedAddress = { sido: "", sigungu: "", eupmyeondong: "" };
        try {
            //console.log(address)
            parsedAddress = parseAddress(address);
        } catch (error) {
            console.warn(`주소 파싱 실패: ${address}`);
        }

        return {
            "시도": parsedAddress.sido,
            "시군구": parsedAddress.sigungu,
            "읍면동": parsedAddress.eupmyeondong,
            "주택유형": item.house_cl || "",
            "단지명": item.bldg_nm || "",
            "소재지": address,
            "입주시기": item.search_dt || "",
            "총세대수": item.total_house_cnt || 0,
            "매매시세(3.3㎡)": item.EXTENT_TOT_PY_AMT_SUPL_M || 0,
            "분양가(3.3㎡)": item.EXTENT_TOT_PY_AMT_SUPL || 0,
            "시공사": item.developer || "없음"

        };
    });

    // 엑셀 시트 생성
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");

    // 엑셀 파일 다운로드
    XLSX.writeFile(wb, "지인 수요/입주 다운로드.xlsx");
    console.log("Excel file with parsed addresses generated successfully!");
}

// 페이지 로드 시 버튼 추가 실행
addDownloadButton();
