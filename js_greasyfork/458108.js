// ==UserScript==
// @name         KB 시세 다운로드
// @namespace    https://blog.naver.com/yoonch9009
// @version      0.2
// @description  유나바머 매전기본차트용 KB 시세 다운로드
// @author       Bogle(보글)
// @match        https://kbland.kr/*
// @match        https://www.kbland.kr/*
// @icon         https://kbland.kr/favicon_kb.ico
// @grant        GM_download
// @grant        GM_info
// @grant        GM.download
// @grant        GM.info

// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/458108/KB%20%EC%8B%9C%EC%84%B8%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/458108/KB%20%EC%8B%9C%EC%84%B8%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    //단지기본일련번호 , 면적일련번호
    //localStorage.typeInfoId
    //문자열
    //'{"단지기본일련번호":2178,"면적일련번호":94921}'

    //단지, 평형 정보 가져오기
    var typeInfo = localStorage.typeInfoId
    var dangi = typeInfo.substring(typeInfo.indexOf(':')+1, typeInfo.indexOf(','))
    var pyung = typeInfo.substring(typeInfo.indexOf(':', typeInfo.indexOf(':')+1)+1, typeInfo.indexOf('}'))
    

    //다운로드 링크 만들기
    var price_url = 'https://api.kbland.kr/land-price/price/perMnPastPriceExcelDownload?단지기본일련번호=' + dangi + '&면적일련번호=' + pyung + '&연결구분명=일반'

    //console.log(price_url);


    //파일 이름 설정
    var dangiName = document.querySelector("#leftScroll > div > div.scrollbar-inner.scroll-content.scroll-scrolly_visible > div.danjiDetail.renewWrap.ComplexDetailPage2 > div > div.saleDetailsummary > h2").textContent
    //var pyungType = document.querySelector("#leftScroll > div > div.scrollbar-inner.scroll-content.scroll-scrolly_visible > div.danjiDetail.renewWrap.ComplexDetailPage2 > div > div.selectTypeFixmenu.down > div.widthTypeSelect > span").textContent
    //var filename = dangiName + '_' + pyungType + '.xlsx'
    var filename = dangiName + '.xlsx'


    //파일 다운로드
    GM_download({url: price_url, name: filename, onerror: function(err){console.log(err.error)}});


})();
