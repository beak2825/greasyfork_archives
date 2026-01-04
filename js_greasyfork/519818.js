// ==UserScript==
// @name        [루시퍼홍] 네이버 부동산 매물 다운로드
// @namespace   Violentmonkey Scripts
// @match       https://new.land.naver.com/complexes*
// @version     1.07
// @description Please use with Violentmonkey
// @require     https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/519818/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B6%80%EB%8F%99%EC%82%B0%20%EB%A7%A4%EB%AC%BC%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/519818/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B6%80%EB%8F%99%EC%82%B0%20%EB%A7%A4%EB%AC%BC%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.meta.js
// ==/UserScript==



(function () {
  'use strict';

  const currentVersion = GM_info.script.version;
  const scriptName = GM_info.script.name;
  console.log(scriptName + ' ' + "currentVersion: " + currentVersion);
  const updateUrl = GM_info.script.updateURL;
  const cafeUrl = 'https://cafe.naver.com/wecando7/11332464';
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


// Function to dynamically load SheetJS library
function loadSheetJSLibrary() {
    return new Promise((resolve, reject) => {
        if (window.XLSX) {
            // SheetJS already loaded
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}


// 자동 스크롤해서 전체 매물 로드하는 함수
function scrollToBottomUntilLoaded(containerSelector = "#complexOverviewList > div > div.item_area > div") {
    return new Promise((resolve, reject) => {
        const container = document.querySelector(containerSelector);
        if (!container) {
            reject("스크롤 컨테이너를 찾을 수 없습니다.");
            return;
        }

        let lastHeight = 0;
        const interval = setInterval(() => {
            const currentHeight = container.scrollHeight;
            if (currentHeight !== lastHeight) {
                container.scrollTop = currentHeight;
                lastHeight = currentHeight;
            } else {
                clearInterval(interval);
                resolve(); // 더 이상 늘어나지 않으면 완료
            }
        }, 300);

        // 10초 이상 걸리면 실패
        setTimeout(() => {
            clearInterval(interval);
            resolve(); // 실패하더라도 강제 진행
        }, 10000);
    });
}


async function downloadExcel() {



await scrollToBottomUntilLoaded();
updateProgressPopup(0, 0, '📂 하위 항목 나타나는 중...');
await waitForChildMenusToAppear();
updateProgressPopup(0, 0, '✅ 하위 항목 확인 완료!');
// ✅ 스크롤 맨 위로 올리기
document.querySelector("#complexOverviewList > div > div.item_area > div").scrollTop = 0;
// ✅ 하위 항목이 모두 DOM에 추가된 후 새로 조회해야 함
const itemsWithChild = Array.from(document.querySelectorAll('.item'))
  .filter(item => item.querySelector('.item--child'));
const totalItems = itemsWithChild.length;





    function createProgressPopup() {
        let popup = document.createElement('div');
        popup.id = 'progressPopup';
        popup.style.position = 'fixed';
        popup.style.top = '10px';
        popup.style.right = '10px';
        popup.style.padding = '10px';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        popup.style.color = '#fff';
        popup.style.fontSize = '14px';
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        document.body.appendChild(popup);
        updateProgressPopup(0, totalItems, '초기화 중...');
    }

    function updateProgressPopup(current, total, message) {
        let popup = document.getElementById('progressPopup');
        if (popup) {
            const progressPercentage = ((current / total) * 100).toFixed(1);
            popup.innerHTML = `📌 총 ${total}개 메뉴 중 ${current}개 진행 중... (${progressPercentage}%)<br>🔄 상태: ${message}`;
        }
    }

    function closeProgressPopup(success = true) {
        let popup = document.getElementById('progressPopup');
        if (popup) {
            popup.innerHTML = success ? `✅ 모든 메뉴 로드 완료! 다운로드 진행 중...` : `❌ 진행 실패: 메뉴가 완전히 로드되지 않았습니다.`;
            setTimeout(() => popup.remove(), 3000);
        }
    }

    createProgressPopup();


    function waitForChildMenusToAppear(timeout = 5000) {
      return new Promise((resolve) => {
          const startTime = Date.now();
          const interval = setInterval(() => {
              const itemsWithChild = Array.from(document.querySelectorAll('.item'))
                  .filter(item => item.querySelector('.item--child'));

              if (itemsWithChild.length > 0 || Date.now() - startTime > timeout) {
                  clearInterval(interval);
                  resolve(); // 하위 항목 있으면 resolve, 아니면 타임아웃 후 resolve
              }
          }, 200);
      });
  }


    async function processMenus(items, delay = 300) {
        let processedCount = 0;

        for (const item of items) {
            const clickableElement = item.querySelector('.item_link');
            if (clickableElement) {
                clickableElement.click();
                updateProgressPopup(processedCount + 1, totalItems, '하위 메뉴 표시 중...');
                await new Promise(resolve => setTimeout(resolve, delay));
                processedCount++;
            }
        }

        updateProgressPopup(totalItems, totalItems, "✅ 모든 메뉴 로드 완료!");
    }

    try {
        await processMenus(itemsWithChild, 200);
        closeProgressPopup(true);
    } catch (error) {
        console.error("🚨 오류 발생:", error);
        closeProgressPopup(false);
        return;
    }

    /**
     * ✅ 엑셀 다운로드 실행
     */
    setTimeout(() => {
        const rows = [];
        rows.push(['동', '매/전', '가격', '면적', '층', '향', '정보', '중개소', '에이전트', '등록일자']);

        const items = Array.from(document.querySelectorAll('#articleListArea .item'));

        let currentParentTitle = '';
        let currentType = '';
        let currentPrice = '';
        let currentArea = '';
        let currentFloor = '';
        let currentOrientation = '';


items.forEach(item => {
    const isChild = item.classList.contains('item--child'); // 하위 항목인지 확인
    let hasChildMenu = false;

    // 현재 요소의 하위에 item--child 클래스가 있는지 확인
    if (item.querySelector('.item--child')) {
        hasChildMenu = true;
    }

    if (!isChild) {
        // 상위 항목 처리
        currentParentTitle = item.querySelector('.item_title .text')?.innerText || '';
        currentType = item.querySelector('.price_line .type')?.innerText || '';
        let price = item.querySelector('.price_line .price')?.innerText || '';
        const priceHighest = item.querySelector('.price_line .price--highest')?.innerText || '';

        if (priceHighest) {
            currentPrice = `${price} ${priceHighest}`;
        } else {
            currentPrice = price;
        }

        const spec = item.querySelector('.info_area .spec')?.innerText || '';
        [currentArea, currentFloor, currentOrientation] = spec.split(',').map(s => s.trim());

        const additionalInfo = item.querySelector('.info_area .line:last-child .spec')?.innerText || '';

        let agent1 = '';
        let agent2 = '';
        let realEstateOffice = '';

        if (hasChildMenu) {
            // 하위 메뉴가 있는 경우 중개소 및 에이전트 값을 빈 값으로 설정
            realEstateOffice = '';
            agent1 = '';
            agent2 = '';
        } else {
            // 하위 메뉴가 없는 경우에만 중개소 및 에이전트 정보를 추가
            realEstateOffice = item.querySelector('.cp_area_inner .agent_name')?.innerText.trim() || '';
            const agentInfoArray = Array.from(item.querySelectorAll('.cp_area_inner .agent_name'))
                .reverse()
                .map(agent => agent.innerText.trim());
            agent1 = agentInfoArray[agentInfoArray.length - 2] || ''; // 뒤에서 두 번째
            agent2 = agentInfoArray[agentInfoArray.length - 1] || ''; // 마지막 값
        }
        const rawText = item.querySelector('.icon-badge.type-confirmed')?.innerText || '';
                //const registrationDate = item.querySelector('.label_area .data')?.innerText || '';
        const registrationDate = rawText
            .replace("확인매물", "")
            .trim()
            .replace(/\.$/, "");  // 끝에 있는 마침표만 제거
                rows.push([
                    currentParentTitle, currentType, currentPrice, currentArea, currentFloor, currentOrientation,
                    additionalInfo,  agent1, agent2, registrationDate
                ]);
    } else {
        // 하위 항목 처리
        //const childItems = Array.from(item.querySelectorAll('.item_inner'));
      const childItems = Array.from(item.querySelectorAll('.item--child .item_inner'))
    .filter(el => !el.classList.contains('is-loading'));

        childItems.forEach(childItem => {
            const childType = "     ↳ "+currentType;
            const finalChildPrice = childItem.querySelector('.price')?.innerText || '';

            const additionalChildInfo = childItem.querySelector('.info_area .line:last-child .spec')?.innerText || '';
            const childAgentInfoArray = Array.from(childItem.querySelectorAll('.cp_area_inner .agent_name'))
                .reverse()
                .map(agent => agent.innerText.trim());

            const childAgent1 = childAgentInfoArray[childAgentInfoArray.length - 2] || '';
            const childAgent2 = childAgentInfoArray[childAgentInfoArray.length - 1] || '';

           const rawText = childItem.querySelector('.icon-badge.type-confirmed')?.innerText || '';
            const childRegistrationDate = rawText
                .replace("확인매물", "")
                .trim()
                .replace(/\.$/, "");  // 끝에 있는 마침표만 제거



            if (childType) {
                rows.push([
                    `     ↳ ${currentParentTitle}`, childType, finalChildPrice, currentArea, currentFloor, currentOrientation,
                    additionalChildInfo,  childAgent1, childAgent2, childRegistrationDate
                ]);
            }
        });
    }
});




        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(rows);

        // ✅ 필터 적용
        ws['!autofilter'] = { ref: `A1:K${rows.length}` };

        // ✅ 열 너비 자동 조정
        ws['!cols'] = rows[0].map((_, colIdx) => {
            const maxWidth = rows.reduce((max, row) => {
                const cell = row[colIdx] || '';
                return Math.max(max, cell.toString().length);
            }, 10);
            return { width: maxWidth + 2 }; // 기본 여유 공간 추가
        });

        XLSX.utils.book_append_sheet(wb, ws, "Listings");

        const complexTitle = document.getElementById("complexTitle")?.innerText.trim();
        XLSX.writeFile(wb, complexTitle + "_매물다운로드.xlsx");
    }, 2000);
}



// Add "Download Listings" button with an image
async function addDownloadButton() {
    try {
        await loadSheetJSLibrary();
    } catch (error) {
        console.error("Failed to load SheetJS library:", error);
        return;
    }

    // Locate the target element between "면적순" and "동일매물 묶기"
    const sortingContainer = document.querySelector('.sorting');
    const referenceElement = document.querySelector('.address_filter');

    if (!sortingContainer || !referenceElement) {
        console.error("Target elements not found!");
        return;
    }


   // Check if the button already exists
    const existingButton = sortingContainer.querySelector('button img[alt="Download Listings"]');
    if (existingButton) {
        //console.log("Download button already exists.");
        return;
    }


    // Create button container
    const button = document.createElement("button");

    // Create image element
    const img = document.createElement("img");
    img.alt = "Download Listings"; // Add alternative text for accessibility
    img.style.width = "23px"; // Set a fixed width for the image
    img.style.height = "23px"; // Set a fixed height for the image
    img.style.verticalAlign = "middle";

    // You need to set the img.src here with your Base64 or other URL
    img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB4AAAAeABAMAAADdjFf1AAAAElBMVEVHcEx7q/R9r/qAs/////9rltVDUWcvAAAAA3RSTlMAXLLJFwQmAAAgAElEQVR42uzcUXLaMBQF0AQ2AGYDxt6AG+1/b2XCtGmTZoqMbenJ53x1pn/Bb650n+HlBQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI6nQ+n7tu+CWNv/95vd7+6+QvBPW5Te0wjOkxt2E2ylDH5N5idp63YTif/QWhiNdb6KYFGGOIObt/prEzNWwyvA/fdbOz+CqKYcULb7fW7H5E8VUSwyrJmzYyGGJYNHqHMW3qdif2V4dlpjcVYYYh6vSaYYg9vWYY5nutYHrNMMya3m5MFXm7nnwmEOjo/HWGfS4Q6ej85SgthuE/4Tumir25DUOUm+8/uQ1DsLOzkzSEPjs7SUMj46uThr90wcbXCEPo8b33WT47dt9cdSkwI8zO0zcFZ4RxeDbCEM65hfFVZ2F8w4+wvTA7664aGt/3ET75TNnP+HapOUaY3XRXqUmuwrj8arPA5dc5Glx+naPhw2FM7TPCOD07R0NdurQbQhjxK4RB/AphEL9CGPErhEH8CmEQv0IYxK8QRvwKYRC/QhgWm1/De2eCcXx2jAbHZ8docHzO1nsmcHx2jAbHZ8do+NbBsGqjcXx2jIbNXczp9354PnD9dRGGdebXiLoI4/rrIgyuvy7C4PrrIoz5xUWYenl7w6vRqK9UWWB+VVnwONffOVWW5wb1lTIanptfo6iMxvwqo0F9ZYLB/FonYX4xwVTMtxcshInL+shCGPNrgj1LbM7rG17pwPxigjG/JhjMrwnG/GKCMb8mGFaZX8O2DhOM+TXBYH5NMOYXE4z5NcGgfzbBmF9skzC/mGDMrwmGR5lfE4z5xQRjftueYM8b5tcEw93FTG3Lb1Vifk0wvPj99iL84jsLOZgmE4z5JU/v2eN5voBkgjG/zHDy/GF+TTC7nV8vcHipkrjMr1eyiMsLHF7oIC4vcJhg4rIAtkzC/GKCsUCyTAILJMskLJCwTMICCVU0Fkh74LuFKKBV0SigUUWjwEKRhQLLBIP5VUWjwEKRhQILRRaz51eBVfM12ASjgFZkocBCkYUCC0UWCixFFrgAuwbjAoxrMC7AuAbjAuwajAsw3ufABRhFFuvwGzqh+IUdXIAVWbQyvy7ArsG4AGMbzPZsgB2icQHGNpgCXIDtknABxjUYF2Bcg3EBdg3GBRjXYFyAcQ3GARrXYBygHaJxgMYhGhskHKJxAbZLwgEah2gcoHGIxgEah2hskOySaJNfsWuI37hzgMYhGgdoHKKxQcIuCQdoh2gcoHGIRgONJhoHaByiHaBxiCaqo2e9Tb1n2wEah2gcoHGIZhW+ROgQjQM0DtEUcPGQt8wblQ7QOERT6wFag9U6D7kDNA7RaLBwiMYKGMtg3vkS0i5MnnQHaCyD0WDhEI0VMHosB2gNlmUwDtBYBqPBQo+FFTB6LA0Weizq5onWY6HBQo+FBgs9FgIYPZYGCz0WVkjosXCARo+FBgs9lgBGBKPBQo+FBgurJAHMzkwmQIOFVRIaLPRYCGCskgQwIhgNFlZJWCFhlYQARgS3xbOLVZIGCz0WVkhYJSGAEcECGBGMAEYEI4CxSsI7HHzP2xze4UAEI4ARwQhgRHDDPK98ZiriOHpc+WwyF1ZIBOZtDgFMYN7mEMCIYNZ28agiggUwIhgBjAhGACOCBTAiGAGMCEYAI4IRwIhgAYwIRgAjghHArMY3+yvme/yIYAGMCEYAU6fepAhgRDAqaNyCEcBksQsWwIhgBDAiGAGMCBbAiGAEMCIYAYwIFsAgggUwIhgBjAhGACOCBTAi2NxU4+hxRATH5Wkkn7kRwAQ2mZxKjB5G8vlifyX8kg6z9GZHACOCEcCIYAEMIlgAsxte5ijv4jFkLi9zFOctSkSwAEYEI4ARweQ4egR5xmSGivIE8hwzJIARwXiJgxK8zOElDiLrzZEARgRjh4RNkpc4IIuXOQQwIhg7JGySvMQBmcySHRI2SdghYZMkgEEE2yFhk4QdEgHYJAlgRDB2SBRholRYqLGwQ6IEmyQBjAhGhYUayw4JMtkkbefocWNpk7myQyIwc6XCQo2FHRIl2CSpsFBjYYdEETZJKizUWNghUYRNkgoLNRYqLNRYKixQY6mwUGOhwkKNhQoLNZYKC9RYKizUWKiwUGOpsGAJvSlTYaHGQoWFGkuFBWosFRZqLJ7kt7BQY6mwQI2lwkKNhSUw1ZnMmhM0aixUWKixLIEhi1WwJTDO0KiwUGOpsCCPVbAlMJFZBauwUGPhBI0ayxIY8lgFO0HjDI0KCzWWEzQ4Q6uw2A2r4J/s3YuNIkcUBVDJJIBEAkgkAGNnMOMI3M4/Fduy1t4fzWfoqvc5NwFazRzdqlfFrhW0WEOLa5QyJa5TWkGLNbRYQYs1tENgkcfiKPhV8bckM0KeQ2BJHEfBVtBiDW0FLWINbQUtYg3tEFjaxFGwQ2DJHEfBrlFK4rhOaQUt1tBW0CLW0FbQItbQVtBiDS1W0GINbQUtf+e3jyfy7r1ZQ1tBA2wNLVbQAFtDW0EDDLA1tBU0wGINbQUNsDV09xz8+QA8O37WbwUNsDV0x/gpP8ABciTRCjoi4D+8OGtoK+i8gP8k2BraChpga2hxi2MGYILvi7scVtAAW0O7xSEvBkzwfXGXwwoaYGtoK2h5MWCCraGtoAG2hhYr6CmACbaGtoIG2BparKCnACbYGtoKGmBraLGCngKYYGtoK2iAraHFCnoKYIKtoa2gAbaGFivoKYAJtoZ+dfwUGOBgOVL5QA7+YAYCJviO+Id1Hom/F4CjhUor6KiACbaGtoIG2BparKCnACbYGtohEsC14yDJNaywgAm+HZexXMMCOHFcxrKCjguYYGtoK2iAraHFCnoKYIKtoa2gAbaGdg3LH8oUwATfjMtYrmEBnDguY7mGFRgwwTdDpxU0wNbQVtCyBWCCraEdIgFcOA6SHCJFBkzwrThIcg0L4MRxGcsKOjJggm2CHSIBXDiEOkSKDJjgG3GQ5BAJYGtoW2DZBjDB63GQ5BAJ4MxxkOQQKTRggtfjIMkKGmBraCto2QgwwevB1CESwInjIMkhUmzABK/GQZJrWADbBNsCy1aACV6NgySHSAAnjoMkh0jBARNsE2wLDHDVkOoQKThggtfiIMkhEsA2wbbAshlgglfiIMkhEsCZ4yDJFjg6YIJtgm2BAa4ZB0kOkcIDJngltNoCA2wT7B6lbAeY4OtxkOQQCeDEcZBkCxwfMME2wQ6RAC4ZB0m2wPEBE2wTbAsMsE2wQySZApjgq3GQZAsMsE2we5SyJWCCr8VtSltggG2CbYFlU8AE2wTbAgNsE2wLLFMAE2wTbAsMsE2wLbBMAUywTbB7lADbBNsCyxTABNsE+ykhwPXCrS1wCsAE2wTbAgNcLn5SaAucAzDBNsG2wADbBNsCyxTABNsE2wIDbBNsCyxTABNsE2wLDHCxuA5tC5wFMME2wdfit8AAJ43r0LbAWQATbBN8JSd/CADbBNsCA7wpYIJtgm2BAbYJtgWWKYAJtgm2BQbYJtgWWKYAJtgm2BYYYJtgW2CZAphgm2BbYIBtgv2SQaYAJviH2AILwDbBabPzJ5AJMMHf52wLLACbYtkCAzwCMME2wa5xAFwoe1tgSQSYYJtg1zgAtgk2w5IpgAn+Nm+2wAKwTbBrHACPAUzwtznaAgvApli2wACPAUywTbBrHACXiS2w5AJMsE2waxwA2wSbYckUwAR/nYstsABsE+waB8CjABP8dbpe5TDDAtgUywxLJgAm2BTLNQ6Aa6TrVQ7ffGLABLefYplhAWyKZQsscwAT3H0TfPDFA1wjPa9ymGHlBkxw8ymW7x1gUyzXOGQWYIL/S8erHGZYAJtimWHJPMAEd55i+dYBtgl2jUMmAib4S/pd5TDDAtgUywxLpgImuO0U6+RLB7hO+l3l8J2XAExw0ymWGRbAplhmWDIbMME9p1hmWACbYplhyXTABLecYvnGATbFMsOS+YAJbjjFMsMC2BTLDEsiACa43xTLDAtgUywzLAkBmOBuUywzLIBNscywJAhggptNscywADbFMsOSKIAJ7jXF8m0DbIplhiVhABPcaYplhgWwKZYZlgQCTHCjKdYBOYDrpc+/7m4IXRAwwX3G0MQBbAxthiWhABPcZYplhgWwKZYZlgQD3F5wlymWGRbAplhmWBINcHvBLlIKwInT4zKlIXRZwN0F9xhDG0IDbAxtCC0BATcX3GMMzRvAplhmWBIRcHPBHaZYZlgAm2KZYUlMwL0Fd5himWEBbIrlIqUEBdxacIfLlLgBbAxtCC1RAbcWXH8MbQgNsDG0IbTEBdxZcP0xtCE0wMbQhtASGHBjwfXH0LQBbAxtCC2RATcWXH0MbQgNsDG0IbTEBtxXcPUxtCE0wMbQhtASHHBbwdXH0LABbAxtCC3RAbcVXHsMbQgNsDG0IbTEB9xVcO0xtCE0wMbQhtCSAHBTwbXH0KwBbAxtCC0ZADcVXHkMbQgNsDG0IbTkANxTcOUxtCE0wMbQhtCSBHBLwZXH0KgBbAxtCC1ZALcUXHcMbQgNsDG0IbTkAdxRcN0xtCE0wAADLIkANxRcdwxNGsAAAyyZADcU7BRJAE6cqudITpFaAu4nuOo50o40gI2hDaElF+B2gqv+nOFEGsDG0IbQkgxwO8GG0AIwwAADHANwN8E1z5GcIgHsHMkpkiQE3ExwzXMkp0gAO0dyiiQZAfcSXPMciTOAjaENoSUl4F6C9wALwAA7RQI4CuBWgiueIzlFAtg5klMkyQq4k+CK50hOkQB2juQUSdIC7iTYEFoABhhggAMBbiS43jmSUySAGwGud47kFAngRoLrnSM5RQK4EeALwFIQcBvB9QCfMAO4D+B6B8GUAdxJsFMkAdg5klMkgGMB7iL4CLAADLBjYIBjAW4iuNpBsFMkgFsBrnaO5BQJ4FaCq50jQQZwrwoGWIoC7iHYMbAAnDi1DoKdIgHcTHCtcySnSAA3A3wGWKoC7iC4FuADZAD3AlzrIPgEGcC9BNc6CGYMYIABliqAGwh2DCwAJ06lg2DHwAC3E3wEWAAG2DEwwBEBlxdc6SD4wBjA3QBXOgg+MQZwN8EAC8CJU+kgGDGA+wl2DCwAJ84eYCkNuLjgOoAdAwPcEHCdg+AdYgD3E3wGWAAG2D0OgKMCLi24zkHwCTGA+wF+A1iqA64suA5gwgDuWMGOgaU84MqC9wALwAC7xwFwXMCFBVe5ybEjDGCAAZaSgOsKrnKT40AYwB0BXwCWBoDLCq4C+EQYwB0BV7nJARjAPQUDLAAD7B4HwLEBVxVc4yaHexwANwV8BFhaAC4quAbgHWAA9wR8Blh6AK4puAbgA2AA9wRc4ybHCTCAewoGWABOnBpXsfgCuKtggAVggF3EAjg+4IqC9wALwAC7iAVwfMAFBR8BFoABdhEL4ASA6wmucBXrwBfAXQFfAJZGgMsJrgD4xBfAXQG/ASydAFcTXAEwXgD3rWCApRXgaoJdxBKAE2cPsLQCXExwfsAuYgHcGPARYOkFuJbg/IB3eAHcF/AZ4FyS3gFez/J7K8H5AR9aAf74AHg9Hx+tAF8ATraUfQd4tYA/PlpVcH7Ap14FPKeC8wD+54M7AX4DONss6R3g1QLuVcH5AXcr4CkVnAbwv5/cqYIBTneY8w7wagH3qmA3KbMV8IwKzgL4y0c3ArwHOFkBz6jgJICXLx/dqIKzA250k/J/GgCvF3CnCj4CnK2AJ1RwDsDL/5/dp4KzA941LODxFZwD8Ncf3gbwGeB0BTy+glMAXr7+8DYVnB3woWMBD6/gFIC//fQugC8A5yvg4RWcAfDy7ad3qeDsgE8tC3h0BWcA/P3HAwxw2AIeXcEJAC/ff3yTCn4DOGMBD67gBIB//HyAXYUOW8CDKzg+4OXHz29SwQCnLOCxFRwf8M8eAGBXocMW8NgKDg94+dkD9KjgPcApC3hoBYcH/PMnABjgsAU8tIKjA15+/gQtKjg34Ba/ZbgmBOD1Au5RwUeAcxbwyAoODni59ggdKjg34F3jAh5YwcEBX3+GBoDPACct4IEVHBvwcv0ZGlQwwGkLeFwFxwa89hAA+zFS2AIeV8GhAS9rD1G/gi8Apy3gYRUcGvD6UwDstwxhC3hYBUcGvKw/RfkKfgM4bwGPquDIgG89BsB+yxC2gEdVcGDAy63HqF7BAGcu4EEVHBjw7eeoXsEAJy7gQRUcF/By+zmqV7DfMmQu4DEVHBfwPQ9SHPAe4MQFPKaCwwJe7nmQ4hUMcOoCHlLBYQHf9yQA+zFS2AIeUsFRAS/3PUntCj4CnLqAR1RwVMD3PgrAAIct4BEVHBTwcu+jlK7gzIB3CnhIBQcFfP+zVAZ8Bjh3AQ+o4JiAl/ufpXIFA5y9gLev4JiAH3kYgP2aMGwBb1/BIQEvjzxM4Qq+AJy9gDev4JCAH3sagAEOW8CbV3BEwMtjT1O3gjMDPingIRUcEfCjj1MW8BvA6Qt46woOCHh59HHKVjDABQp44woOCPjx5wHYz4HDFvDGFRwP8PL485StYIALFPC2FRwP8DMPBDDAYQt42woOB3h55oGqVrCfA1co4E0rOBzg595QUcB7gAsU8KYVHA3w8twbKlrBAJco4C0rOBrgZ98QwACHLeAtKzgY4OXZN1SzgvMC/kUBj6ngYICff0MlAR8BLlHAG1ZwLMDL82+oZAUDXKSAt6vgWIA/84YABjhsAW9XwaEAL595QxUrOC/gnQIeU8GhAH/uDRUEfAa4SAFvVsGRAC+fe0MFKxjgMgW8VQVHAvzZNwQwwGELeKsKDgR4+ewbqlfBeQEfFPCYCg4E+PNvqBzgC8BlCnijCo4DePn8GypXwQAXKuBtKjgO4Fe8IYABDlvA21RwGMDLK95QtQrOC/ikgMdUcBjAr3lDxQC/AVyogDep4CiAl9e8oWIVDHAtwB91Ab/oBb0DDHBgwO9VAb+ogO9o4FSC8wI2hB5UwUEAv+r9/FkL8K8Aq+AMgAcWcC7BAKvgDIAHFjDAAFeq4BCAhxZwKsEAq+AEgIcWMMD+UcpCFRwB8OACziR4D7AKDg94cAEDDHCdCg4AeHgBJxIMsAoOD3h4AQMMcJkKng94QgHnEQywCo4OeEIBA7x1av7PKhEreDrgKQWcRvARYBUcG/CUAgYY4CIVPBvwpALOIhhgFRwb8KQCBhjgGhU8GfC0Ak4iOCvg3a8qeEwFTwY8rYCTAD4DrIIDA55YwDkEA6yCIwOeWMAAA1yhgqcCnlrAKQQDrIIDA55awAADXKCCZwKeXMAZBAOsguMCnlzAAAOcv4InAv6LnTu6baQ5wihKexMgoAQIbAIkZUfg3+/2Asw/FWcgwpye7vqqT+VwcFU1TS0PcIDgVMBf3xI8J8ELAS8PcADgB8ASXBRwgQDXFwywBFcFXCDAAAOcnuBlgEsEuLxggCW4KOASAQYY4PAErwJcJMDVBQMswTUBFwkwwABnJ3gR4DIBLi4YYAkuCbhMgAE+ZX5/S/CcBK8BXCjAtQU/FViCCwIuFODagBVYggsCLhXg0oKfAEtwPcClAgwwwMEJXgG4WIArCwZYgusBLhZggAHOTfACwOUCXFgwwBJcDnC5AAMMcGyC5wMuGOC6ggGW4GqACwYYYIBTEzwdcMkAlxUMsAQXA1wywAADHJrg2YCLBriqYIAluBbgogEGGODMBE8GXDbARQUDLMGlAJcNMMAARyZ4LuDCAa4pGGAJrgS4cIABBjgxwVMBlw5wScGpgL+/JXhOgqcCLh3gmglWYAkuA7h4gCsKVmAJrgO4eIBLJliBJbgK4PIBLihYgSW4DODyAa6YYAWW4CKAAwJcT7ACS3AVwAEBLphgBZbgGoAjAlxOsIccElwEcESAAQY4LMGzAIcEuJpggCW4BuCQAAMMcFaCJwGOCXAxwQBLcAnAMQEGGOCoBM8BHBTgWoIBluAKgIMCDDDASQmeAjgqwKUEAyzBBQBHBRhggIMSPANwWIArCQZYgtcDDgswwADnJHgC4LgAFxIMsAQvBxwXYIABjknw+YADA1xHMMASvBpwYIABBjglwacDjgxwGcEAS/BiwJEBBvjgfH1L8JwEnw04NMBVBD8UWIKXAg4NcBXACizBSwHHBriI4AfAErwScGyAAQY4IsHnAg4OcA3BAEvwSsDBAQYY4IQEnwo4OsAlBAMswQsBRwcYYIADEnwm4PAAVxAMsASvAxwe4AqA76GAf31L8JwEnwg4PsAFBD8AluBVgOMDXACwAkvwKsANArxeMMASvApwgwADDHD1BJ8GuEWAlwsGWIIXAW4RYIABLp7gswA3CfBqwQBL8BrATQIM8Gfz928JnpPgkwC3CfBiwTeAJXgF4DYBBhjg0gk+B3CjAK8VDLAErwDcKMAAA1w5wacAbhXgpYIBluAFgFsFeCngayjgvwE8KcFnAG4W4JWCAZbg+YCbBRhggOsm+ATA7QK8UDDAEvzXbMDtAgwwwGUTPB5wwwCvE5wK+ILvpASPB9wwwOsAXwCW4B8TPBxwywAvEwywBP+c4OGAWwYYYICLJng04KYBXiUYYAn+OcGjATcNMMD/5/yGd06CBwNuG+A1gp8AS/DPCR4MuG2AAQa4ZILHAm4c4CWCAZbgNwkeC7hxgAEGuGKChwJuHeAVgnMBf6E7J8FDAbcO8ArAD4Al+OcEjwTcPMALBAMswW8SPBJw8wADDHC9BA8E3D7A8wXnAv4F7pwEDwTcPsDzAd8BluCfEzwO8AYBni4YYAl+k+BxgDcIMMAAV0vwMMBbBHi24FzA/jH0pAQPA7xFgGcDvgEswT8neBTgTQI8WTDAEvwmwaMAbxJggP1byloJHgR4mwDPFXwFWIJ/TvAgwNsEGGCASyV4DOCNAjxVMMAS/CbBYwBvFGCA/Ve7SgkeAnirAM8UfAFYgn9O8BDAWwUYYIALJXgE4M0CPFEwwBL8JsEjAG8WYID9U6w6CR4AeLsATxP8BFiC3yR4AODtAgwwwGUSfBzwhgGeJfgRDPgL2CkJPg54wwADDHCVBB8GvGWAJwkGWILfJfgw4C0DDLB/yVEkwUcBbxrgOYLvAEvwmwQfBbxpgAEGuEaCDwLeNsBTBCcD9i855iT4IOBtAzwF8A1gCX6T4GOANw7wDMEAS/C7BB8DvHGAZwAO/jmwX/RPSvAhwFsHeIJggCX4XYIPAd46wAADXCDBRwBvHuDzBScD9oPgOQk+AnjzAJ8P+AKwBL9J8AHA2wf4dMEAS/C7BB8AvH2Azwb8jAb8m9QZCf4csACfLRhgCX6b4M8BCzDAfk+4PMEfAxbg0wU/AJbgdwn+GLAAA+znSOsT/ClgAT5f8B1gCX6X4E8BCzDAABdI8IeABXiC4GzAfo40JcEfAhbgCYBvAEvwO4qfARbgGYKzAfs1w5QEf8ZegGcAvgIswaWnRYDPEwywBNeeF8B9Afs1Q/sENwnwaYIvAEuwAAPs1wwSLMDzBT8BlmABBhhgCRbgBYIf4YC/EG2d4BfAAEuwALcVnA74F6GdE/wC+M3cAZZgAc4VnA7Yrxk6J/gF8Lu5ASzBApwrOB2wx9CNE/wC+O1cAZZgAc4VnA7YY+i+CX4B/H4uAEuwAOcKjgfsLWXXBL8Afj9PgCVYgHMF5wP2lrJpgl8Ab/CSEuCuCW4b4LGC8wF7S9kzwS+Ad3hJCXDTBDcO8FDB+YC9pWyZ4BfAW7ykBLhnglsHeKTgfMDeUnZM8AvgTV5SAtwxwc0DPFBwPmBvKRsm+AXwLi8pAW6Y4PYBHie4AWBvKdsl+AXwNi8pAe6X4A0CPEpwB8DeUnZL8AvgfV5SAtwuwVsEeJDgDoC9pWyW4BfAG72k9BSrW4I3CfAYwTeAJViAAfYUS4IFeIHgK8ASLMAAe4olwQK8QPAFYAkWYIA9xZJgAZ4v+NkCsJccfRL8Ani3dxwAN0rwZgE+LLgHYE+x2iT4BfB2D7EA7pPg7QJ8VHAPwJ5idUnwC+D9HmIB3CbBGwb4oOAegD3FapLgF8A7PsTykqNJgrcM8DHBF4AlWIAB9hRLggV4vuBnE8BecnRI8AvgPd9xANwiwdsG+IDgLoC95GiQ4BfAm77jALhDgjcO8OeCb00Ae8mRn+AXwPsC9pIjPsFbB/hjwVeAJViAAfaSQ4IFeIHgLn695EhP8Avgjd9xAJye4O0D/JngPoC95MhOML8fAX60AexDcHSCBfgzwXeAJViAAfaSQ4IFeIHgWxvAPgQnJ5jdDwFfAZZgAc4V3AewlxzBCSb3U8B9/PoQnJtgAf5U8BNgsz7B3ALsJUduggX4Y8GPRoB9CE5NMLUfA743AuxDcGiCBfhzwTeAzeoEMwuwD8G5CRbgA4IbfQb2ITg0wcQeAHwB2KxNsAAfEdwKsA/BiQnm9QDgZyvAPgQHJliAjwh+tALsQ3Bggmk9AvgOsFmaYAE+JLgXYB+C8xLM6iHAt1aAfQiOS7AAHxN8BdisTDCpxwBfeg2CYQkW4IOCmwH2ITgswZweA/xsBtiH4KwEC/BBwY9mgH1HykowpQcB3wE26xIswEcF35oB9iE4KsGMAuw7Um6CBfiw4GszwL4jJSWY0MOAu/n1HSkowQJ8WPATYLMswXwC7ENwboIF+LjgRzvAviPFJJjO44Dv7QD7jpSSYAEeIPjWDrDvSCkJZnMA4CvAZk2CBXiE4H6AfQgOSTCZIwD38+s7UkaCBXiE4GdDwL4jRSSYyxGAHw0B+73/mOMAABDOSURBVI6UkGABHiL43hCw70gJCaZyCOAbwGZFggV4jOCGR2jfkRISzCTAviPlJliABwnu6Nd3pPoJJnIM4GdLwL4jVU+wAA8S/GgJ2Hek6gnmcRDge0vAztDFEyzAowTfWgJ2hi6eYBpHAb4CbKYnWICHCe4J2Hek2glmcRjgnn59RyqdYAEeJvjZFLDvSJUTTOIwwI+mgH1HKpxgAR4n+N4UsO9IhRPM4TjAt6aAnaHrJliABwq+AmwmJ5jCgYAvXccZumqCBXig4CfAZnKCGQTYGTo3wQI8UvAdYDM3wQQC7DtSboIFeKjgW1vAztA1E8zfUMDXtoD9nKFkggV4rOC+fp2hSyaYvqGAn40BfzFXL8ECPFbwozFgZ+iCCWZvLOB7Y8DO0PUSLMCDBd8aA3aGrpdg8gYDbnyEdoaul2ABHi24s19n6HIJ5m4w4GdrwM7QxRIswKMFP1oDdoYulmDqRgO+twbsDF0rwQI8XPCtNWBn6FoJZm444NZHaGfoWgkW4PGCe/t1hi6VYOKGA342B+wMXSjBAjxe8KM5YGfoQgnmbTzge3PAztB1EizAJ8ytOWBn6DoJpu2EaX6Edoauk2ABPmO6+3WGLpNg2E6YP+0BO0MXSbAAnzH/bQ/YGbpIgmE7Y/7THrAzdI0EC7AjtDN0cIJZc4R2hs5NsAA7QjtDBycYNUdoZ+jcBAuwI7QzdHCCUXOEdobOTbAAO0I7QwcnmDRHaFes3AQLsCO0K1ZwgkFzw3LFyk2wALthuWIFJxg0NyxXrNwEC7AblseUwQnmzA3LGTo3wQLsIaUzdHCCOXOEdobOTbAAO0K7YgUnGDM3LFes3AQLsBuWK1Zwgilzw3LFyk2wALthuWIFJ5gyNyyPKXMTLMAeUjpDBycYMkdoZ+jcBAuwI7QrVnCCGXPDcsXKTbAAu2G5YgUnmDE3LFes3AQLsBuWK1ZwghFzw3LFyk2wALthuWIFJxgxNyxXrNwEC7AblitWcIIJc8NyxcpNsAC7YbliBScYMDcsV6zcBAuwG5YrVnCCAXPDcsXKTbAAu2G5YgUnmC83LFes3AQLsBuWK1Zwgvlyw3LFyk2wALthuWIFJxgvNyxXrNwEC7AblitWcILpcsNyxcpNsAC7YbliBSeYLjcsS3Bugv/1T7yswKfMb7ymDF6nz58tAbtizRkJdsNyxQLYuGF5ykGwZxyuWMYW7IbliiXBxg3LEizBVuBNAXvKIcGecbhiGQl2w3LFkmDjhuUphwR7xuGKZSTYDcsVy0iwFdgSLMHGCuwphwR7xmEJNhJsBbYES7DxjMNTDgk2O9+wLMES7IblKYeRYM84XLEk2LhhWYIl2ArsKYeRYCuwJdhIsBXYEizBxgrsKYcEe8ZhCTYSbAX2lEOCzYj5sz1gVywJdsOyBBsJtgJ7yiHBxjMOS7AEW4EtwUaCrcCWYCPBnnFYgiXYWIEtwRLsGYcl2EiwFdgSLMHGCmwJlmArsCXYSLAV2BJsJNgKPHt+ASXBVmBLsJFgK/CK4UmCrcCWYCPBVmBLsAQbK7AlWIKtwJZgI8FWYEuwkWArsOfQEmyswJZgCbYCew5tJNgKbAmWYGMFtgRL8HZzo9YSLMFWYEuwkeD54z9CW4Il2ApsCTYSbAW2BBt/B1iBN1uC//GXGTL/tgL7SSHAAHtHaQkGGGAr8CY/KQR4X8C8NliCAd4WsI9IHZZggLcFbAXu8CEJ4G0B+4jUYQkGeFvAtHZ4Tfk/9u7utrEzCQIoRCYgkQlQvBlYuHloBDj/VCwDhgHDmpGo4V9Vn/O0wL55Waj+uq+8Ajw1wJ7AFYckAZ4aYE/gikewAE8NsCdwxSFJgIcG2HeUHYckAR4aYBN0xyNYgIcG2HeUHYckAR4aYEnteAQL8MwAOyKVPIIFeGaAPYFLDkkCPDPAjkglM7QAzwywnJZ8TSnAIwPsCdxySBLgkQF2RGp5BAvwyACLacsjWIAnBth3lDWHJAGeGGBHpJoZWoAnBtgRqWaGFuCJAZbRmkOSAA8MsCNSzyFJgAcG2BGp5y+SBHhggCW05xEswPMCbIIuOiQJ8LwAOyIVHZIEeF6AHZGKZmgBHhdgn2E1HZIEeFyAPYGbDkkCPC7AjkhNhyQBHhdg6WyaoQV4WoBN0FUztABPC7AjUtUhSYCnBdgRqeqQJMDDAmyC7voYS4CHBdgE3TVDC/CwAJugu2ZoAZ4VYJ9hlc3QAjwrwCboshlagGcF2ARd9jGWAM8KsFyWfYwlwKMC7IjU9jGWAI8KsD9kaJuhBXhUgKWybYYW4EkBNkHXzdACPCnAjkh1hyQBnhRgR6S6j7EEeFCAfYbV9zGWAA8KsAm6b4YW4EEBNkH3zdACPCfAJujCGVqA5wTYBF04QwvwnACboAtnaAEeE2ATdOMMLcBjAmyCbpyhBXhMgE3QjTO0AE8JsAm6coYW4CkBNkFXztACPCXAJujKGVqApwRYFr9lL8ACbII2QwuwAJugb0GABdgEbYYWYAH2L9MxQwvw0ACboEv30AI8I8ByWDpDC/CIANtBt87QAjwiwCbo1hlagEcEWApbv4cW4AkBNkHXztACPCHAJujaGVqABwTYXxL2ztACPCDAJuju76FfVn6bCdoMfTN/0swEXb2H/ruB/cibmaDrZ2g/8mYm6PoZWgWboAmeoVWwCZroPbTfuQman9urYG7Dn/Kfw0YFY4IO9qKCuQnZmzFDq2ATNMEztArudJC9ITO0CjZBEzxDq2ATNMGnYBXsCEzw55QquJDPKAd9TqmCHYFJnqFVsAma5BlaBZugCT4Fq2ATNMkztAp2BCb4FKyCHYFJnqFVcBOfUU77nFIFm6BJPgWrYCssktdYKtgRmOBTsAp2BCZ5jaWCTdAkr7FUsBUWwadgFewITPIMrYIdgQleY6lgEzTBp2AVbIVF8ilYBTsCkzxDq2ArLILXWCrYBE3wKVgFW2GRfApWwSZoktdYKtgKi+A1lgqO5u8Yxq+xVLAVFsFrLBVshUXyGksFW2ERvMZSwVZYJK+xVLAVFsFrLBVshUXyGksFW2ERvMZSwVZYJK+xVLAVFsFrLBVshUXyGksFW2ERvMZSwVZYJK+xVLAVFsFrLBVshUXyGksFW2ERvMZSwWEOkqWCVbAVFp/aqmDckKyxVDBWWC5JKtgNicY1lgpWwASvsVSwGxIqGCusOi8qGDckaywVjBWWS5IKtsJCBaOArbFUMCc6yJNLkgp2Q0IF44bkkqSCcUO6d1sVjAJ2SVLBbki4JKlgNyRUMArYJUkFo4BdklSwjzhQwSrYRxyoYNyQfMyhgvERh485VLAVFoMuSSrYDYnkjzlUsAJGBaOAVbAKRgG7JKlgBcycjzlUsI84UMGcz0F6VLAKVsCoYK7vVXZUsArOJTl3YquCUcDBXlQwClgFq2AFzA08qGB8xBFsr4I5ja8oVbAKVsCoYBSwClbBKGAVrIIVMCpYBStgVDAKWAWrYBSwClbBChgVrIIVMCoYBayCVbAC5o4sKpjP+Tfp3KuNCkYBewWrYAWMV7AKVsCoYBSwClbBKGAVrILdgFHBKlgBo4JRwCpYBStgVLAKVsCoYBSwClbBKGAVrIIVMCpYBStgVDAKeIqtCkYBB1PB/J9cqGAVnOtVLnIsKhgFnGujgvmvg1SoYBUcy9/xq2AVrIBRwSpYAdPzNYdw+YaDD+xVML7hUMEqWAGjglWwAkYFo4DH2KpgfETplKSCfUSJrzlUsG84UMH4hsMeSwUrYJySVLATEipYBTshoYJRwH1UsBMSTkkq2DccOCWpYCckVDBOSPZYKtgGC6ckFeyExEVtVbACxh5LBTshYY+lgm2wqNxjyZwTEsF7LBVsg4UKxgbLHksF22Bhj6WCbbBQwdhg2WOpYBss7LFUsA0WN6CCbbCwx1LBNlgYolWwAZrGPZYKtsHiY1sVPMGrX7pjsAp2AsYQrYIN0EzbY6lgGyySh2gpdAIm+Bisgp2ASR6i5dAATfAeSwXbYJE8REuiEzDBeywV7ARM8hAtjAZogodoFWyAJnmIFkcDNMFDtAo2QPMzWxVsgMYQrYIN0BiiVbABmtPsVLBvKDFEq2ADNIZoFWyA5jQbFWwDjSFaBRugMUSrYAM0bUO0Cv6Sg9/yTHsV7IJEMBVsgMYQrYIN0BiiVbABmrZbkoR+wm/YLUkFewBjiFbBBmgM0SrYJ1gUDdFiaoAm+Jakgl2QSH4GC6oHMMHPYBXsAUzyM1hWPYAJfgar4I+8+t0S8gyWVg9gfjlELyrYAI1nsAqWX25hp4IN0HgGq2D5xTNYBRugaXoGC6388msbFewCjGewCvYA5iYWFewTaDyDVbAHMJ7BKvgDB79SMp/BwusBTPAzWAV7AJOcYPn1b4EmeJGlgi2wSF5kWWBB8CJreAVbYBGeYPmF4EXW6Ar2uyR+kWWBBcGLrLkVbIFFQ4I9gCF4kbXKLwQvsnxBCcEJnljBbxZY1KyiLaAhOMGr/ELwKtoBCb5kp4ItoHFMUsHyi1X0xAp2QKIvwQ5I8MVV9KKCLaBxTFLB8osEj6pg+eUMNirYARgJVsGnefbL4zx2KtgBmGB7FSy/SLAKll9uYlHBPsBCglWw/CLB3RUsvwxIsA+g4QT39ln0Kr8QnGAfUEJwglf5heAEyy+clmAVLL9IsAqWXyR4lV8ITrD8QvAma5VfCE6w/EJwglf5heAEyy8EJ3iVXwhOsPxCcIILKtjfH3EDiwr29/sE26vgc/Dvr2N2guUXvmWnguUXCZ5bwf7/U7ipjQqWX4I9qODvO/j9IMGxFfzo18MdJHhRwT7fINiign2+gWX0pAp2PkKCcyvY+pm7slHB8otV1owKtr5CgmMr2PqZu7RXwdbPWGV1V7DnL/c7RqtgX0/iIVxbwZ6/eAjnVrDnLx7CuRXs+YuHcG4FG5/xEI6tYM9fjNG5FeyPFzBG51aw+iXLooKNzxijGyrY+IxdVm4Fq18kOLaCf8gvxujYCvbxBko4toJtr1DCuRWsflHCsRWsflHCuRXseIQSjq1g9YsSzq1g9YsSjq1g9YsSzq1gy2caS3g/o4LVL6WelgEV/OR/Z8zRqRVsesYyK7aCTc+IcG4Fm54xR8dWsOmZKSW866vgH6ZnzNGpFezxiwjHVvCbxy/zXPgqvNpdwWW3WUtBBdtdMTjC6RUsvohwbAWLL1xskL50BT8/+h8PLhdh7QtXcZmN9GrzDMERdveFa3k4ZlSwr67gSo9hmysInqRXT18InqSVL1y9ho/3V8EWV/D1Gj7ba1j5QvAovSpfCB6lpReCM7xKLwRn+LvpPUovnCfDv7PT+lYFP0sv3EcRnz44P/rHDWf3sDteuoLfnoUXLhjip+NyoQp+ezI3w1XexMczV/DR2AxXDfHT8XiOCj4+yy7cMMbLNyv47Whmhrt4GL8P1cevVvDxPbiSC3fo8T2bu/cw/+OPl3//4+79v3l68E8IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgL/agwMSAAAAAEH/X7cjUAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALgKsusxQboOff8AAAAASUVORK5CYII=';

    // Add the img element to the button
    button.appendChild(img);

    // Insert the button before the "동일매물 묶기" element
    sortingContainer.insertBefore(button, referenceElement);

    // Attach click event to trigger the download function
    button.addEventListener("click", downloadExcel);
}

// Observe for changes in the DOM and add the button when necessary
var target = document.getElementsByClassName('map_wrap')[0];
if (target) {
    var observer = new MutationObserver(() => {
        const existingButton = document.querySelector('.sorting button img');
        if (!existingButton) {
            addDownloadButton();
        }
    });

    var config = {
        childList: true,
        subtree: true,
    };

    observer.observe(target, config);
}
