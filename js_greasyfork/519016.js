// ==UserScript==
// @name        [루시퍼홍] 아실 실거래 다운로드
// @namespace   Violentmonkey Scripts
// @match       https://asil.kr/app/price_detail_ver_3_9.jsp?*
// @grant       none
// @version     1.04
// @author      -
// @description 2024. 3. 10. 오전 9:57:03
// @downloadURL https://update.greasyfork.org/scripts/519016/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%EC%8B%A4%EA%B1%B0%EB%9E%98%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/519016/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%EC%8B%A4%EA%B1%B0%EB%9E%98%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.meta.js
// ==/UserScript==

let isRowRemoved = false; // main_agent2 행이 삭제되었는지 상태를 추적

(function () {
  'use strict';

  const currentVersion = GM_info.script.version;
  const scriptName = GM_info.script.name;
  console.log(scriptName + ' ' + "currentVersion: " + currentVersion);
  const updateUrl = GM_info.script.updateURL;
  const cafeUrl = 'https://cafe.naver.com/wecando7/11320527';
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

// 1. "다운로드" 버튼을 btnDong 뒤에 추가
(function addDownloadButtonAfterBtnDong() {
    const btnDong = document.getElementById("btnDong"); // btnDong ID로 요소 찾기

    if (!btnDong) {
        console.error("ID가 'btnDong'인 요소를 찾을 수 없습니다.");
        return;
    }

    // 다운로드 버튼 생성
    const downloadButton = document.createElement("button");
    downloadButton.id = "downloadBtn";
    downloadButton.textContent = "다운로드"; // 버튼 텍스트
    downloadButton.style.marginLeft = "10px"; // 버튼 간격
    downloadButton.style.marginTop = "10px"; // 상단 간격 추가
    downloadButton.style.marginBottom = "20px"; // 하단 간격 추가
    downloadButton.style.cursor = "pointer"; // 클릭 가능 스타일
    downloadButton.style.padding = "4px 12px"; // 버튼 스타일 (높이 줄이기 위해 padding 수정)
    downloadButton.style.fontSize = "12px"; // 텍스트 크기 축소
    downloadButton.style.backgroundColor = "#E97132"; // 버튼 색상
    downloadButton.style.color = "white"; // 텍스트 색상
    downloadButton.style.border = "none"; // 테두리 없음
    downloadButton.style.borderRadius = "4px"; // 둥근 모서리
    downloadButton.style.fontWeight = "bold"; // 텍스트 bold 효과 추가

    // 클릭 이벤트 리스너 추가
    downloadButton.addEventListener("click", function () {
        console.log("다운로드 버튼이 클릭되었습니다.");
        downloadTableAsExcelWithPriceConversionAndContractFill(); // 다운로드 함수 실행
    });

    // btnDong 뒤에 다운로드 버튼 추가
    btnDong.parentNode.insertBefore(downloadButton, btnDong.nextSibling);
})();


(function () {
    'use strict';

    // CSS 스타일 동적으로 추가
    const style = document.createElement("style");
    style.type = "text/css";
    style.textContent = `
        .tooltip_history {
            display: none !important; /* CSS 우선순위를 강제 */
            visibility: hidden !important;
        }
    `;
    document.head.appendChild(style);

    //console.log(".tooltip_history 스타일이 동적으로 추가되었습니다.");
})();

(function overrideMainAgent2Style() {
    // CSS 스타일 동적으로 추가
    const style = document.createElement("style");
    style.type = "text/css";
    style.textContent = `
        .main_agent2 {
            display: none !important; /* 요소를 화면에서 숨김 */
            visibility: hidden !important; /* 보이지 않도록 설정 */
            height: 0 !important; /* 높이 제거 */
            width: 0 !important; /* 너비 제거 */
            overflow: hidden !important; /* 자식 요소 숨김 */
        }
    `;
    document.head.appendChild(style);

    //console.log("main_agent2 클래스에 대한 스타일이 오버라이드되었습니다.");
})();



(function observeTableList1() {
    const targetNode = document.querySelector("#tableList1");

    if (!targetNode) {
        console.log("#tableList1 요소를 찾을 수 없습니다.");
        return;
    }



    // MutationObserver의 콜백 함수
    const callback = (mutationsList) => {
        //if (isRowRemoved) return; // 이미 삭제되었으면 실행하지 않음

        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                // #tableList1의 thead > tr:nth-child(2)를 정확히 찾음
                const specificRow = document.querySelector("#tableList1 > thead > tr:nth-child(2)");

                if (specificRow) {
                    const thElement = specificRow.querySelector("th.main_agent2");
                    if (thElement) {
                        specificRow.remove();
                        isRowRemoved = true; // 삭제 상태 업데이트


                        const tableDiv = document.querySelector("#tableDiv");

                        if (tableDiv) {
                            // padding-top 스타일을 90px로 설정
                            tableDiv.style.setProperty("padding-top", "90px", "important");
                            //console.log("tableDiv의 padding-top을 90px로 변경했습니다.");



                              $(".tooltip_history").hide(); // jQuery의 hide() 메서드로 숨김
                              $(".tooltip_history").css({
                                  display: "none", // CSS를 적용하여 보이지 않게 처리
                                  visibility: "hidden", // 선택적으로 visibility를 hidden으로 추가
                              });
                              $('.tooltip_history').off('show'); // show 이벤트를 비활성화

                              //console.log(".tooltip_history 요소가 숨겨졌습니다.");
                        } else {
                            //console.log("tableDiv 요소를 찾을 수 없습니다.");
                        }

                        //console.log("#tableList1 > thead > tr:nth-child(2) - main_agent2 포함된 행이 삭제되었습니다.");
                        observer.disconnect(); // 감지 중지
                    } else {
                        //console.log("#tableList1 > thead > tr:nth-child(2)에는 main_agent2 클래스가 없습니다.");
                    }
                } else {
                    //console.log("#tableList1 > thead > tr:nth-child(2)를 찾을 수 없습니다.");
                    return;
                }
            }
        }
    };

    // MutationObserver 초기화
    const observer = new MutationObserver(callback);

    // 변경 감지 대상 및 옵션 설정
    observer.observe(targetNode, { childList: true, subtree: true });

    //console.log("#tableList1 변경 감지를 시작했습니다.");


})();



// 2. 다운로드 함수 정의 (테이블 다운로드 함수 추가)
async function downloadTableAsExcelWithPriceConversionAndContractFill() {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    document.head.appendChild(script);

    await new Promise((resolve) => {
        script.onload = resolve;
    });
    console.log("SheetJS Loaded");

    const tableId = "tableList1"; // 테이블 ID
    const fileName = "table_data.xlsx"; // 다운로드 파일 이름

    const table = document.getElementById(tableId);
    if (!table) {
        console.error("테이블을 찾을 수 없습니다.");
        return;
    }

    // 테이블 데이터 복사 및 다운로드 로직
    const rows = Array.from(table.rows).map((row, rowIndex) => {
        return Array.from(row.cells).map((cell, colIndex) => {
            if (rowIndex > 0 && colIndex === 3) {
                // 가격 컬럼 처리
                const originalPrice = cell.innerText.trim();
                const type = originalPrice.match(/매매|전세|월세/)?.[0] || "";
                const isDirect = originalPrice.includes("직거래"); // 직거래 여부 확인
                const isCanceled = cell.className.includes("coX") ? "취소" : ""; // 취소 여부 확인

                let processedPrice = originalPrice;
                if (type !== "월세") {
                    processedPrice = convertPriceToNumber(originalPrice); // 월세가 아닌 경우 숫자 변환
                }

                return [type, processedPrice, isDirect ? "직거래" : isCanceled]; // 구분, 변환된 가격, 직거래/취소 여부 반환
            }
            return cell.innerText.trim();
        });
    });

    // 계약 값 비어 있는 경우 위쪽 값으로 채우기
    rows.forEach((row, rowIndex) => {
        if (rowIndex > 0 && !row[0]) {
            row[0] = rows[rowIndex - 1][0];
        }
    });

    // 매매/전세/월세, 직거래 여부를 별도 컬럼으로 추가
    const processedRows = rows.map((row, rowIndex) => {
        if (rowIndex === 0) {
            // 헤더에 새로운 컬럼 추가
            row.splice(4, 0, "구분"); // 가격 옆에 "구분" 컬럼 추가
            row.push("직거래 여부"); // 마지막에 "직거래 여부" 컬럼 추가
        } else if (row[3] instanceof Array) {
            const [type, price, isDirect] = row[3];
            row[3] = price; // 가격 값 갱신
            row.splice(4, 0, type); // 구분 값 삽입
            row.push(isDirect); // 직거래 여부 추가
        }
        return row;
    });

    const worksheet = XLSX.utils.aoa_to_sheet(processedRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileName);

    console.log("엑셀 파일이 다운로드되었습니다:", fileName);
}

// 가격 변환 함수 (월세는 변환하지 않음)
function convertPriceToNumber(priceString) {
    if (!priceString) return 0;

    // "매매"와 "전세"에만 적용
    const isMonthlyRent = priceString.includes("월세");
    if (isMonthlyRent) {
        return priceString; // 월세는 원본 데이터 그대로 반환
    }

    priceString = priceString.replace("매매", "").trim();
    const matches = priceString.match(/(\d+)억(?:\s*(\d{1,3}(?:,\d{3})*))?/);
    if (matches) {
        const [_, billions, millions] = matches;
        const billionValue = parseInt(billions, 10) * 10000;
        const millionValue = millions
            ? parseInt(millions.replace(/,/g, ''), 10)
            : 0;
        return billionValue + millionValue;
    } else if (/^\d+$/.test(priceString)) {
        return parseInt(priceString, 10);
    }
    return 0;
}
