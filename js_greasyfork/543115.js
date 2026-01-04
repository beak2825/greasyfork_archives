// ==UserScript==
// @name         관청 데이터 저장하기. 300 페이지까지
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  웹페이지의 특정 데이터를 추출하고, 누적해서 저장하며, 300 페이지까지 반복하여 하나의 CSV 파일로 내보내는 기능
// @author       You
// @match        https://rpg.kr/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543115/%EA%B4%80%EC%B2%AD%20%EB%8D%B0%EC%9D%B4%ED%84%B0%20%EC%A0%80%EC%9E%A5%ED%95%98%EA%B8%B0%20300%20%ED%8E%98%EC%9D%B4%EC%A7%80%EA%B9%8C%EC%A7%80.user.js
// @updateURL https://update.greasyfork.org/scripts/543115/%EA%B4%80%EC%B2%AD%20%EB%8D%B0%EC%9D%B4%ED%84%B0%20%EC%A0%80%EC%9E%A5%ED%95%98%EA%B8%B0%20300%20%ED%8E%98%EC%9D%B4%EC%A7%80%EA%B9%8C%EC%A7%80.meta.js
// ==/UserScript==

/*
관청텝에 들어간 후에 버튼 누르면 자동으로 저장해서 CSV 파일로 저장한다.
기본적으로 "다운로드" 폴더에 저장함.
*/

(function() {
    'use strict'; // 엄격 모드: 변수 선언 오류 등을 방지하여 코드 안정성을 높임

    // 데이터를 누적할 배열. 첫 번째 행은 열 제목(헤더)로 초기화
    let allData = [["순위", "닉네임", "생명", "근력", "기민", "지능", "총사용EP", "마지막행동"]];
    let currentPage = 1; // 현재 페이지 번호를 추적하는 변수
    let maxPages = 300; // 데이터를 수집할 최대 페이지 수 (300페이지까지 반복)

    // 데이터를 CSV 파일로 저장하는 함수
    function saveCSV(data, filename) {
        let csvContent = "\uFEFF"; // UTF-8 BOM 추가: CSV 파일에서 한글 깨짐 방지
        // 데이터 내 "#"을 "＃"로, "@"를 "＠"로 대체하여 CSV 형식 오류 방지
        data = data.map(row => row.map(cell => cell.replace(/#/g, "＃").replace(/@/g, "＠")));
        // 배열을 CSV 형식(행마다 쉼표로 구분, 줄바꿈으로 행 분리)으로 변환
        csvContent += data.map(e => e.join(",")).join("\n");
        // CSV 데이터를 URI 형식으로 인코딩 (UTF-8 문자셋 사용)
        let encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
        let link = document.createElement("a"); // 다운로드를 위한 가상 <a> 태그 생성
        link.setAttribute("href", encodedUri); // 다운로드 링크 설정
        link.setAttribute("download", filename); // 저장할 파일명 설정
        document.body.appendChild(link); // DOM에 링크 추가
        link.click(); // 클릭 이벤트 발생시켜 다운로드 시작
        document.body.removeChild(link); // 다운로드 후 DOM에서 링크 제거
    }

    // 현재 페이지에서 데이터를 추출하는 함수
    function extractData() {
        // "tbody tr.othr" 선택자를 통해 테이블의 데이터 행을 모두 가져옴
        let rows = document.querySelectorAll("tbody tr.othr");
        let data = []; // 현재 페이지의 데이터를 임시로 저장할 배열

        // 각 행을 순회하며 데이터 추출
        rows.forEach(row => {
            let cells = row.querySelectorAll("td"); // 행 내 모든 셀(<td>)을 가져옴
            let rowData = []; // 한 행의 데이터를 저장할 배열
            // 각 셀의 텍스트를 공백 제거 후 배열에 추가
            cells.forEach(cell => rowData.push(cell.textContent.trim()));
            data.push(rowData); // 완성된 행 데이터를 임시 배열에 추가
        });

        console.log("현재까지 누적된 데이터:", data); // 디버깅용: 추출된 데이터 출력
        allData = allData.concat(data); // 현재 페이지 데이터를 전체 데이터 배열에 추가
    }

    // "다음 페이지"로 이동하는 함수
    function goToNextPage() {
        // 모든 <a> 태그 중 "▷" 텍스트를 가진 버튼(다음 페이지 링크)을 찾음
        let nextButton = Array.from(document.querySelectorAll("a")).find(a => a.textContent.trim() === "▷");
        if (nextButton) { // 다음 페이지 버튼이 존재하면
            nextButton.click(); // 버튼을 클릭하여 다음 페이지로 이동
            // 콘솔에 현재 페이지 저장 및 다음 페이지 이동 메시지 출력
            console.log(`페이지 ${currentPage} 저장 후, 페이지 ${currentPage + 1}으로 이동`);
            currentPage++; // 현재 페이지 번호 증가
        } else {
            console.log("더 이상 다음 페이지가 없습니다."); // 다음 페이지가 없으면 메시지 출력
        }
    }

    // 데이터를 저장하고 다음 페이지로 넘어가는 반복 함수
    function saveDataAndNextPage() {
        if (currentPage <= maxPages) { // 현재 페이지가 최대 페이지 수 이하일 때
            extractData(); // 현재 페이지의 데이터 추출
            goToNextPage(); // 다음 페이지로 이동
            // 200ms 대기 후 다음 페이지 데이터를 처리 (페이지 로딩 대기용)
            setTimeout(saveDataAndNextPage, 200);
        } else {
            // 최대 페이지에 도달하면 전체 데이터를 CSV 파일로 저장
            saveCSV(allData, "all_extracted_data.csv");
            console.log("모든 데이터가 CSV로 저장되었습니다."); // 완료 메시지 출력
        }
    }

    // "데이터 저장 시작" 버튼 생성
    let saveButton = document.createElement("button"); // 버튼 요소 생성
    saveButton.textContent = "데이터 저장 시작"; // 버튼 텍스트 설정
    saveButton.style.position = "fixed"; // 화면에 고정된 위치로 설정
    saveButton.style.top = "10px"; // 상단에서 10px 떨어짐
    saveButton.style.right = "10px"; // 우측에서 10px 떨어짐
    saveButton.style.zIndex = "9999"; // 다른 요소 위에 표시되도록 우선순위 설정
    saveButton.style.padding = "10px"; // 버튼 내부 여백 설정
    saveButton.style.backgroundColor = "red"; // 배경색 빨간색
    saveButton.style.color = "white"; // 글자색 흰색
    saveButton.style.border = "none"; // 테두리 없음
    saveButton.style.cursor = "pointer"; // 마우스 오버 시 손 모양 커서

    // 버튼 클릭 시 데이터 저장 시작
    saveButton.addEventListener("click", function() {
        console.log("데이터 저장을 시작합니다..."); // 시작 메시지 출력
        saveDataAndNextPage(); // 데이터 저장 및 페이지 이동 시작
    });

    document.body.appendChild(saveButton); // 버튼을 페이지에 추가
})();