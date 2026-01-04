// ==UserScript==
// @name         디버그용 스크립트
// @namespace    https://kulms.korea.ac.kr/
// @version      0.1
// @description  블랙보드 트윅 디버그용
// @author       Meda
// @match        https://kulms.korea.ac.kr/webapps/blackboard/*
// @match        https://kucom.korea.ac.kr/em/*
// @match        https://kulms.korea.ac.kr/ultra/stream/telemetry/student/high-performance/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ac.kr
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482925/%EB%94%94%EB%B2%84%EA%B7%B8%EC%9A%A9%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/482925/%EB%94%94%EB%B2%84%EA%B7%B8%EC%9A%A9%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.meta.js
// ==/UserScript==


function gradeCheckFunc() {
    var currentUrl = window.location.href;
    if(currentUrl.includes('course_id=')){
        var urlPoint = currentUrl.indexOf('course_id=');
        var courseId = currentUrl.substring(urlPoint+10, urlPoint+19);

        document.querySelector("#courseMenuPalette_contents").insertAdjacentHTML('afterbegin', `<li id="paletteItem:" class="clearfix ">
                                     <a href="/ultra/stream/telemetry/student/high-performance/`+courseId+`">
                                     <span title="디버그용 메뉴">디버그용 메뉴</span></a></li>`);
    }
}

if (window.location.href.startsWith('https://kulms.korea.ac.kr/webapps/blackboard/')) {
    gradeCheckFunc();
}



function viewMygradeFunc(courseId) {
    // .full.activity-grade 요소를 찾을 때까지 0.1초마다 검색
    var grade = -1; // 찾은 "grade" 값을 저장할 변수

    var gradesArray = []; // grade 값을 저장할 배열 생성
    var i, item;
    var interval = setInterval(function() {
        var element = document.querySelector('.full.activity-grade');

        if (element) {
            clearInterval(interval); // 검색 간격 멈추기
            fetch('https://kulms.korea.ac.kr/learn/api/v1/courses/'+courseId+'/telemetry/reports/activityVsGrade')
                .then(response => response.json())
                .then(parsedData => {
                // Convert JSON data to a string with formatting (indentation and spacing)
                var jsonString = JSON.stringify(parsedData, null, 2);

                // Create a new window/tab and display the beautified JSON content
                var newWindow = window.open();
                newWindow.document.write('<pre>' + jsonString + '</pre>');
            })
                .catch(error => {
                // 오류 처리
                console.error('오류 발생:', error);
            });
        }
    }, 100);

    // 10초 후에 검색 종료
    setTimeout(function() {
        clearInterval(interval); // 검색 간격 멈추기
    }, 10000);
}

if (window.location.href.startsWith('https://kulms.korea.ac.kr/ultra/stream/telemetry/student/high-performance/')) {
    var fullURL = window.location.href;
    var lastNineCharacters = fullURL.slice(-9);
    viewMygradeFunc(lastNineCharacters);
}


if (window.location.href.startsWith('https://kucom.korea.ac.kr/em/')) {
    mediaDownloadFunc();
}