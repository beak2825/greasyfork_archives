// ==UserScript==
// @name        [루시퍼홍] 네이버부동산에서 시세트래킹 파일 보기
// @namespace   Violentmonkey Scripts
// @match       https://new.land.naver.com/complexes*
// @version     1.1
// @description 동일 단지ID가 여러 열에 있을 때 나란히 정렬하여 단지정보 + 시세 정보를 출력
// @require     https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/543950/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EB%84%A4%EC%9D%B4%EB%B2%84%EB%B6%80%EB%8F%99%EC%82%B0%EC%97%90%EC%84%9C%20%EC%8B%9C%EC%84%B8%ED%8A%B8%EB%9E%98%ED%82%B9%20%ED%8C%8C%EC%9D%BC%20%EB%B3%B4%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/543950/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EB%84%A4%EC%9D%B4%EB%B2%84%EB%B6%80%EB%8F%99%EC%82%B0%EC%97%90%EC%84%9C%20%EC%8B%9C%EC%84%B8%ED%8A%B8%EB%9E%98%ED%82%B9%20%ED%8C%8C%EC%9D%BC%20%EB%B3%B4%EA%B8%B0.meta.js
// ==/UserScript==


(function () {
  'use strict';

  const currentVersion = GM_info.script.version;
  const scriptName = GM_info.script.name;
  console.log(scriptName + ' ' + "currentVersion: " + currentVersion);
  const updateUrl = GM_info.script.updateURL;
  const cafeUrl = 'https://cafe.naver.com/wecando7/11580981';
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

window.addEventListener("load", () => {

insertTrackingSettingsButton();
  insertCsvUrlInputUI();
});

var newDiv = document.createElement("div");
    newDiv.className = "filter_group filter_group--size";
    newDiv.style.margin = "6px 10px 0px 0px";
    newDiv.style.display = "line-block";
 var googleSheetSettingBtn = document.createElement("button");
    googleSheetSettingBtn.innerText = "구글시트설정";
    googleSheetSettingBtn.id = "otherHide";
    googleSheetSettingBtn.style.width = "100px";
    googleSheetSettingBtn.style.height = "20px";
    googleSheetSettingBtn.style.color = "white";
    googleSheetSettingBtn.style.backgroundColor = "#747474";
 var buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "10px";
  newDiv.appendChild(buttonContainer);

    buttonContainer.appendChild(googleSheetSettingBtn);
var parentDiv = document.querySelector("#filter > div");
    parentDiv.appendChild(newDiv);

async function insertTrackingSettingsButton() {
  const ourHomeTab = [...document.querySelectorAll('.lnb_item')].find(el => el.textContent.includes("우리집"));
  if (!ourHomeTab || document.getElementById("csvSettingsBtn")) return;


  googleSheetSettingBtn.onclick = async () => {
    let box = document.getElementById("csvUrlInputBox");
    if (!box) {
      await insertCsvUrlInputUI(); // 최초 생성
      box = document.getElementById("csvUrlInputBox");
    } else {
      box.style.display = box.style.display === "none" ? "inline-flex" : "none";
    }
  };

  //ourHomeTab.insertAdjacentElement('afterend', googleSheetSettingBtn);
}



    // ✅ IndexedDB 설정
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("SiseTrackingDB", 1);

    request.onupgradeneeded = function (e) {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "key" });
      }
    };

    request.onsuccess = function (e) {
      resolve(e.target.result);
    };

    request.onerror = function (e) {
      reject(e.target.error);
    };
  });
}

function convertToCsvUrl(userUrl) {
  try {
    const url = new URL(userUrl);
    const spreadsheetId = url.pathname.split("/")[3]; // d/{ID}/edit
    const gidMatch = url.searchParams.get("gid") || url.hash.match(/gid=(\d+)/)?.[1];

    if (!spreadsheetId || !gidMatch) return null;

    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gidMatch}`;
  } catch (e) {
    return null;
  }
}


function saveCsvUrlToDB(url) {
  return openDB().then(db => {
    const tx = db.transaction("settings", "readwrite");
    const store = tx.objectStore("settings");
    store.put({ key: "csvUrl", value: url });
    return tx.complete;
  });
}

function loadCsvUrlFromDB() {
  return openDB().then(db => {
    return new Promise((resolve) => {
      const tx = db.transaction("settings", "readonly");
      const store = tx.objectStore("settings");
      const request = store.get("csvUrl");
      request.onsuccess = () => resolve(request.result?.value || "");
      request.onerror = () => resolve("");
    });
  });
}

async function insertCsvUrlInputUI() {
  const parent = document.querySelector("#wrap > div.lnb_wrap");
  if (!parent || document.getElementById("csvUrlInputBox")) return;

  const wrapper = document.createElement("div");
  wrapper.id = "csvUrlInputBox";
  wrapper.style.margin = "10px";
  wrapper.style.padding = "10px";
    wrapper.style.width = "80%";
    wrapper.style.display = "none";

  wrapper.style.border = "1px solid #ccc";
  wrapper.style.background = "#f8f8f8";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "CSV URL 입력";
  input.style.width = "75%";
  input.style.marginRight = "10px";
  input.style.padding = "4px";

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "저장";
  saveBtn.style.padding = "5px 10px";

  const defaultUrl = await loadCsvUrlFromDB();
  input.value = defaultUrl;

  saveBtn.onclick = async () => {
    const newUrl = input.value.trim();
    if (!newUrl.startsWith("http")) return alert("URL을 입력해주세요.");
    await saveCsvUrlToDB(newUrl);
    alert("✅ 저장되었습니다.");
  };

  wrapper.appendChild(input);
  wrapper.appendChild(saveBtn);
  parent.appendChild(wrapper);
    saveBtn.style.display = "inline-flex";
input.style.display = "inline-flex";

}



// ✅ panel_group--upper 패널이 나타나면 실행
const observer = new MutationObserver(() => {
  const panel = document.querySelector('.panel_group--upper');
  const code = getAptCodeFromUrl();

  if (panel && code && code !== lastAptCode) {
    lastAptCode = code;
    console.log("📌 panel_group--upper 등장 → loadTracking 실행");
    loadTracking(code);
  }

  if (!panel) {
    console.log("🧼 panel_group--upper 사라짐 → 시세 패널 제거");
    document.getElementById("siseCompareContainer")?.remove();
     lastAptCode = null;
  }
});

observer.observe(document.body, { childList: true, subtree: true });


let lastAptCode = null;
let lastPriceRow = null;
let firstPriceRow = null;

    function getAptCodeFromUrl() {
  const match = location.href.match(/complexes\/(\d+)/);
  return match ? match[1] : null;
}


async function loadTracking(){
    const old = document.getElementById("siseCompareContainer");
  if (old) old.remove();
 // 스크롤 기준 행 초기화
  firstPriceRow = null;
  lastPriceRow = null;

    const csvUrl = await loadCsvUrlFromDB();
if (!csvUrl) return alert("CSV URL이 설정되지 않았습니다.");



   console.log(csvUrl);
  const res = await fetch(convertToCsvUrl(csvUrl));
  const csvText = await res.text();

  function parseCsv(text) {
    const rows = [];
    let val = '', row = [], inside = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i], next = text[i + 1];
      if (c === '"') {
        if (inside && next === '"') { val += '"'; i++; }
        else inside = !inside;
      } else if (c === ',' && !inside) { row.push(val); val = ''; }
      else if ((c === '\n' || c === '\r') && !inside) {
        if (val !== '' || row.length) row.push(val);
        if (row.length) rows.push(row);
        val = ''; row = [];
        if (c === '\r' && next === '\n') i++;
      } else val += c;
    }
    if (val) row.push(val);
    if (row.length) rows.push(row);
    return rows;
  }

  const rows = parseCsv(csvText);
  const complexId = location.href.match(/complexes\/(\d+)/)?.[1];
  if (!complexId) return;

  // 동일 ID 열 추출
  const headerRow = rows[6];
  const targetCols = [];
  headerRow.forEach((val, idx) => {
    if (val === complexId) targetCols.push(idx);
  });

    // ✅ 단지ID가 없으면 이전 내용 제거 후 종료
if (targetCols.length === 0) {
  console.warn("시트에서 단지 ID를 찾을 수 없습니다.");
  document.getElementById("siseCompareContainer")?.remove(); // 이전 패널 제거
  return;
}
  //if (targetCols.length === 0) return alert("시트에서 단지 ID를 찾을 수 없습니다.");


     // 시세 날짜 추출 (매매가 없는 달 제외)
  const dataBlocks = [];
  for (let i = 33; i < rows.length - 8; i++) {
    // i+1 행의 2번째 칸(label)이 "매매가"인지 확인
    if (rows[i + 1]?.[1] === "매매가") {
      const block = rows.slice(i + 1, i + 9); // 매매가~전세가 등 8행
      // 대상 단지 열들 중 '매매가' 값이 하나라도 존재하는지 확인
      const hasSale = targetCols.some((ci) => {
        const v = (block[1]?.[ci] ?? "").toString().replace(/[, \t\r\n]/g, "");
        // 빈칸/하이픈은 값 없음으로 처리
        return v.length > 0 && !/^[-–]$/.test(v);
      });
      if (!hasSale) continue; // 매매가가 전혀 없으면 해당 월은 스킵

      const rawDate = rows[i + 1][0];
      const dateOnly = rawDate.match(/\d{4}-\d{2}-\d{2}/)?.[0] || rawDate;
      dataBlocks.push({ date: dateOnly, rows: block });
    }
  }

  // 컨테이너 생성
  const container = document.createElement("div");
container.id = "siseCompareContainer"; // ✅ 고유 ID 추가

  container.style.position = "fixed";
  container.style.top = "165px";
  container.style.left = "1300px";
  //  container.style.width = "500px";

  container.style.transform = "translateX(-50%)";
  container.style.background = "#fff";
  container.style.border = "1px solid #ccc";
  container.style.zIndex = 9999;
  container.style.fontSize = "13px";
  container.style.fontFamily = "sans-serif";
  container.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
  container.style.maxHeight = "80vh";
  container.style.overflow = "hidden";

  // 단지 정보 테이블
  const infoTable = document.createElement("table");
  infoTable.style.borderCollapse = "collapse";
  infoTable.style.width = "100%";
  infoTable.appendChild(createColGroup(targetCols.length + 1));

  const headerTr = document.createElement("tr");
  const th0 = document.createElement("th");
 // ✅ 닫기 버튼 생성
const closeBtn = document.createElement("button");
closeBtn.textContent = "닫기 ❌";
closeBtn.style.fontSize = "12px";
closeBtn.style.padding = "4px 8px";
closeBtn.style.border = "1px solid #ccc";
closeBtn.style.borderRadius = "4px";
closeBtn.style.cursor = "pointer";
closeBtn.onclick = () => {
  document.getElementById("siseCompareContainer")?.remove();
};

th0.appendChild(closeBtn);
  headerTr.appendChild(th0);
  infoTable.appendChild(headerTr);

  const fieldLabels = [
    "단지명", "입주시기", "세대수",
    "공급면적", "전용면적", "공급형", "전용형",
    "계단/복도식", "방", "화장실"
  ];

  for (let i = 0; i < fieldLabels.length; i++) {
  const tr = document.createElement("tr");

  const labelTd = document.createElement("td");
  labelTd.textContent = fieldLabels[i] || "";
  labelTd.style.background = "#fff4cc";
  labelTd.style.border = "1px solid #ccc";
  labelTd.style.padding = "4px";
  labelTd.style.fontWeight = "bold";
  labelTd.style.textAlign = "center";
  tr.appendChild(labelTd);

  targetCols.forEach(ci => {
    const td = document.createElement("td");
    td.textContent = rows[i + 7][ci] || ""; // ✅ 정확히 단지명부터 시작
    td.style.border = "1px solid #ccc";
    td.style.padding = "4px";
    td.style.textAlign = "center";
    tr.appendChild(td);
  });

  infoTable.appendChild(tr);
}


  // 시세 테이블 (스크롤 영역)
  const scrollArea = document.createElement("div");
  scrollArea.style.maxHeight = "400px";
  scrollArea.style.overflowY = "auto";
  scrollArea.style.borderTop = "1px solid #ccc";
  scrollArea.style.marginTop = "10px";
scrollArea.style.overflowY = "overlay";

  const priceTable = document.createElement("table");
  priceTable.style.borderCollapse = "collapse";
  priceTable.style.width = "100%";
    priceTable.appendChild(createColGroup(targetCols.length + 1));

     console.log(dataBlocks);
  dataBlocks.forEach(({ date, rows: block }) => {
    const dateRow = document.createElement("tr");
    const dateCell = document.createElement("td");
    dateCell.colSpan = targetCols.length + 1;
    dateCell.textContent = "📅 " + date;
    //  console.log(date);
    dateCell.style.background = "#e6f2ff";
    dateCell.style.border = "1px solid #ccc";
    dateCell.style.padding = "6px";
    dateCell.style.textAlign = "left";
    dateRow.appendChild(dateCell);
    priceTable.appendChild(dateRow);

    for (let r = 0; r < 8; r++) {
        const tr = document.createElement("tr");
        const label = document.createElement("td");
        label.textContent = block[r][1] || "";
        label.style.border = "1px solid #ccc";
        label.style.padding = "4px";
        label.style.background = "#f9f9f9";
        label.style.textAlign = "center";
        tr.appendChild(label);

        targetCols.forEach(ci => {
    const td = document.createElement("td");
    td.textContent = block[r][ci] || "";
    td.style.border = "1px solid #ccc";
    td.style.padding = "4px";
    td.style.textAlign = "right";
    tr.appendChild(td);

    // ✅ 매매가가 있는 첫 번째 행과 마지막 행 추적
    if (r === 1 && !!block[r][ci]) {
      if (!firstPriceRow) firstPriceRow = tr;
      lastPriceRow = tr;
    }
  });

        priceTable.appendChild(tr);
    }


  });
    console.log("firstPriceRow : ");
console.log(firstPriceRow);
    console.log("lastPriceRow : ");
      console.log(lastPriceRow)

   function createColGroup(colCount) {
  const colgroup = document.createElement("colgroup");
  for (let i = 0; i < colCount; i++) {
    const col = document.createElement("col");

    if (i === 0) {
      col.style.width = "100px"; // 항목명 열
    } else {
      col.style.width = "150px"; // 모든 단지 열 고정 너비
    }

    colgroup.appendChild(col);
  }
  return colgroup;
}



  scrollArea.appendChild(priceTable);
    if (lastPriceRow) {
  setTimeout(() => {
    lastPriceRow.scrollIntoView({ behavior: "auto", block: "center" });
  }, 100); // 렌더링 이후 스크롤
}

  container.appendChild(infoTable);     // 상단 고정
  container.appendChild(scrollArea);    // 하단 스크롤
  document.body.appendChild(container);
}
