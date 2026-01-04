// ==UserScript==
// @name         한국부동산원 시세 다운로드
// @namespace    https://blog.naver.com/yoonch9009
// @version      0.1
// @description  유나바머 매전기본차트용 한국부동산원 시세 다운로드
// @author       Bogle(보글)
// @match        https://rtech.or.kr/MarketPrice/getMarketPriceDetail.do*
// @icon         https://rtech.or.kr/img/logo_normal.png
// @grant        GM_download
// @grant        GM_info
// @grant        GM.download
// @grant        GM.info

// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/457998/%ED%95%9C%EA%B5%AD%EB%B6%80%EB%8F%99%EC%82%B0%EC%9B%90%20%EC%8B%9C%EC%84%B8%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/457998/%ED%95%9C%EA%B5%AD%EB%B6%80%EB%8F%99%EC%82%B0%EC%9B%90%20%EC%8B%9C%EC%84%B8%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    //OnTabPeriodChanged(50); //차트 50년 그리기

    //getMarketPriceAreaChangeList(currentPyongSeq, 50);


ajaxMng.run("../MarketPrice/getMarketPriceAptAreaChangeList.do",{pyongSeq:currentPyongSeq, periodYear:50, fnDateToOpenDt:fnDateToOpenDt}, function jsonToCSV(json_data) {

    // 1-1. json 데이터 취득
    const json_array = json_data;
    // 1-2. json데이터를 문자열(string)로 넣은 경우, JSON 배열 객체로 만들기 위해 아래 코드 사용
    // const json_array = JSON.parse(json_data);


    // 2. CSV 문자열 변수 선언: json을 csv로 변환한 문자열이 담길 변수
    let csv_string = '';


    // 3. 제목 추출: json_array의 첫번째 요소(객체)에서 제목(머릿글)으로 사용할 키값을 추출
    const titles = Object.keys(json_array[0]);


    // 4. CSV문자열에 제목 삽입: 각 제목은 컴마로 구분, 마지막 제목은 줄바꿈 추가
    titles.forEach((title, index)=>{
        csv_string += (index !== titles.length-1 ? `${title},` : `${title}\r\n`);
    });


    // 5. 내용 추출: json_array의 모든 요소를 순회하며 '내용' 추출
    json_array.forEach((content, index)=>{

        let row = ''; // 각 인덱스에 해당하는 '내용'을 담을 행

        for(let title in content){ // for in 문은 객체의 키값만 추출하여 순회함.
            // 행에 '내용' 할당: 각 내용 앞에 컴마를 삽입하여 구분, 첫번째 내용은 앞에 컴마X
            row += (row === '' ? `${content[title]}` : `,${content[title]}`);
        }

        // CSV 문자열에 '내용' 행 삽입: 뒤에 줄바꿈(\r\n) 추가, 마지막 행은 줄바꿈X
        csv_string += (index !== json_array.length-1 ? `${row}\r\n`: `${row}`);
    })




/* Download an embedded file/text*/
function download(filename, data) {
  //const encoded = encodeURIComponent(data);
  //const downloadable = `data:text/calendar;charset=utf-8, ${encoded}`;
    const csvData = 'data:application/csv;charset=utf-8,\ufeff'+encodeURIComponent(data)

  GM_download({url: csvData, name: filename, onerror: function(err){console.log(err.error)}});
}

var aptName = document.querySelector('#aptName').textContent
var currentPrivArea = document.querySelector('#currentPrivArea').textContent
var lbAptpDt = document.querySelector('#lbAptpDt').textContent
download(aptName+"_"+currentPrivArea.substring(currentPrivArea.indexOf(' ')+1, currentPrivArea.indexOf(' ', currentPrivArea.indexOf(' ')+1))+"_"+lbAptpDt.substring(lbAptpDt.lastIndexOf(' ')+1)+".csv", csv_string);


    //console.log(csv_string);

    // 6. CSV 문자열 반환: 최종 결과물(string)
    //return csv_string;

}   , {show:true, sessionChk:false, showTarget:""});

})();

