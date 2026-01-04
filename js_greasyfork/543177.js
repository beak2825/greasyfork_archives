// ==UserScript==
// @name        [루시퍼홍] 지인 전국 수요/입주 플러스 다운로드
// @namespace   Violentmonkey Scripts
// @match       https://aptgin.com/home/gin05/gin0502
// @grant       none
// @version     1.1
// @author      -
// @description 2025. 1. 15. 오전 9:57:03
// @downloadURL https://update.greasyfork.org/scripts/543177/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%A7%80%EC%9D%B8%20%EC%A0%84%EA%B5%AD%20%EC%88%98%EC%9A%94%EC%9E%85%EC%A3%BC%20%ED%94%8C%EB%9F%AC%EC%8A%A4%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/543177/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%A7%80%EC%9D%B8%20%EC%A0%84%EA%B5%AD%20%EC%88%98%EC%9A%94%EC%9E%85%EC%A3%BC%20%ED%94%8C%EB%9F%AC%EC%8A%A4%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.meta.js
// ==/UserScript==


// SheetJS 라이브러리 로드
const script = document.createElement("script");
script.src = "https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js";
document.head.appendChild(script);

// 요청을 순차적으로 실행하는 함수
async function fetchAllDataAndDownloadExcel() {
    const urls = [
        { name: "서울 부산 대구", body: "loc=1100000000%2C2600000000%2C2700000000&locList=1100000000&locList=2600000000&locList=2700000000&aptType=1&baseDt=2025&frDate=201502&toDate=204012" },
        { name: "인천 광주 대전", body: "loc=2800000000%2C2900000000%2C3000000000&locList=2800000000&locList=2900000000&locList=3000000000&aptType=1&baseDt=2025&frDate=201502&toDate=204012" },
        { name: "울산 세종 경기", body: "loc=3100000000%2C3600000000%2C4100000000&locList=3100000000&locList=3600000000&locList=4100000000&aptType=1&baseDt=2025&frDate=201502&toDate=204012" },
        { name: "충북 충남 전남", body: "loc=4300000000%2C4400000000%2C4600000000&locList=4300000000&locList=4400000000&locList=4600000000&aptType=1&baseDt=2025&frDate=201502&toDate=204012" },
        { name: "경북 경남 제주", body: "loc=4700000000%2C4800000000%2C5000000000&locList=4700000000&locList=4800000000&locList=5000000000&aptType=1&baseDt=2025&frDate=201502&toDate=204012" },
        { name: "강원 전북", body: "loc=5100000000%2C5200000000&locList=5100000000&locList=5200000000&aptType=1&baseDt=2025&frDate=202502&toDate=204012" }
    ];

    let allData = [];

    for (let { name, body } of urls) {
        try {
            console.log(`${name} 데이터 요청 중...`);
            const response = await fetch("https://aptgin.com/pre/pr05/getPr0502Chart", {
                headers: {
                    "accept": "*/*",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "x-requested-with": "XMLHttpRequest"
                },
                referrer: "https://aptgin.com/",
                body: body,
                method: "POST",
                mode: "cors",
                credentials: "include"
            });

            const data = await response.json();
            const dataArray = data[3] || [];
            if (!Array.isArray(dataArray)) continue;

            allData = allData.concat(dataArray);
            console.log(`${name} 데이터 수집 완료! (${dataArray.length}개)`);
        } catch (error) {
            console.error(`${name} 데이터 요청 중 오류 발생:`, error);
        }
    }

    if (allData.length > 0) {
        console.log(`총 ${allData.length}개의 데이터를 엑셀 및 TXT로 저장합니다.`);
        downloadExcel(allData);
        downloadTxt(allData);
    } else {
        console.warn("수집된 데이터가 없습니다.");
    }
}

// 시도명 변환을 위한 매핑 객체
const sidoMap = {
    "서울특별시": "서울",
    "인천광역시": "인천",
    "경기도": "경기",
    "충청북도": "충북",
    "충청남도": "충남",
    "경상남도": "경남",
    "경상북도": "경북",
    "강원도": "강원"
};


function addDownloadButton() {
  const searchForm = document.querySelector("#searchForm .right");

  if (searchForm) {
    const downloadButton = document.createElement("button");
    downloadButton.id = "btn_download";
    downloadButton.textContent = "전국 다운로드";

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
    downloadButton.addEventListener("click", fetchAllDataAndDownloadExcel);

    // "검색" 버튼 옆에 "다운로드" 버튼 추가
    searchForm.appendChild(downloadButton);
    //console.log("다운로드 버튼 추가 완료");
  } else {
    console.error("#searchForm .right 요소를 찾을 수 없습니다.");
  }
}

// 텍스트 정리 함수 (탭, 공백 제거 및 시도 변환 적용)
function cleanText(text) {
    text = (text || "").replace(/\t/g, '').replace(/\s+/g, ' ').trim();
    return sidoMap[text] || text; // 시도명이 sidoMap에 있으면 변환
}

// 데이터를 엑셀 및 TXT 파일에서 동일한 구조로 저장하기 위한 컬럼 매핑 함수
function formatData(item) {
    return {
        "시도": cleanText(item.location_site?.split(' ')[0] || ""),
        "시군구": cleanText(item.location_site?.split(' ')[1] || ""),
        "읍면동": cleanText(item.location_site?.split(' ')[2] || ""),
        "주택유형": cleanText(item.house_cl),
        "단지명": cleanText(item.bldg_nm),
        "소재지": cleanText(item.location_site),
        "입주시기": cleanText(item.search_dt),
        "총세대수": item.total_house_cnt || 0,
        "매매시세(3.3㎡)": item.EXTENT_TOT_PY_AMT_SUPL_M || 0,
        "분양가(3.3㎡)": item.EXTENT_TOT_PY_AMT_SUPL || 0,
        "시공사": cleanText(item.developer || "없음"),
        "lon": item.lon || "",
        "lat": item.lat || ""
    };
}

// 데이터를 엑셀로 저장하는 함수
function downloadExcel(dataArray) {
    const filteredData = dataArray.filter(item => item.house_cl !== "아파트(임대)");

    const excelData = filteredData.map(formatData);

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "지인 수요_입주_다운로드.xlsx");

    console.log("Excel 파일 다운로드 완료!");
}

// 데이터를 TXT 파일로 저장하는 함수 (탭 구분자 사용, 엑셀과 동일한 컬럼)
function downloadTxt(dataArray) {
    const filteredData = dataArray.filter(item => item.house_cl !== "아파트(임대)");

    // TXT 파일 헤더 (엑셀과 동일한 컬럼)
    const header = "시도\t시군구\t읍면동\t주택유형\t단지명\t소재지\t입주시기\t총세대수\t매매시세(3.3㎡)\t분양가(3.3㎡)\t시공사\tlon\tlat";

    const txtData = filteredData.map(item => {
        const formattedItem = formatData(item);
        return Object.values(formattedItem).join('\t'); // **탭(`\t`) 구분자 사용**
    });

    // 최종 데이터 (헤더 포함)
    const finalTxtData = [header, ...txtData].join('\n');

    const blob = new Blob([finalTxtData], { type: "text/plain;charset=utf-8" });

    const now = new Date();
    const formattedDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const fileName = `marker_${formattedDate}.txt`;

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    console.log(`TXT 파일 다운로드 완료! (${fileName})`);
}

// 실행
addDownloadButton();
