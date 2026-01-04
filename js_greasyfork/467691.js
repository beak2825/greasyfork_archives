// ==UserScript==
// @name         Hasha Reader Improve
// @namespace    https://github.com/raculus
// @version      1.1
// @description  Hasha Reader set title, remove title div
// @author       raculus
// @match        http*://*.hasha.in/reader/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467691/Hasha%20Reader%20Improve.user.js
// @updateURL https://update.greasyfork.org/scripts/467691/Hasha%20Reader%20Improve.meta.js
// ==/UserScript==

let isTitleHover = false;
document.addEventListener('mousemove', (event) => {
    // 커서의 y 좌표를 가져옴
    const cursorY = event.clientY;

    // 커서가 상단 50픽셀 이내에 있는지 확인
    if (cursorY <= 10) {
        showTitle();
        isTitleHover = true;
    } else if(isTitleHover) {
        hideTitle();
        isTitleHover = false;
    }
});


function getPageNum(){
    const imgElement = document.querySelector("div.fullscreen > div > div > img.mx-auto")

    // src 속성 가져오기
    const src = imgElement.src;

    // 파일 이름과 확장자 추출
    const fileNameWithExtension = src.split('/').pop(); // 마지막 부분을 가져옴
    const fileNameWithoutExtension = fileNameWithExtension.split('.')[0]; // 확장자를 제거
    const pageNum = parseInt(fileNameWithoutExtension, 10); // 문자열을 정수로 변환
    return pageNum;
}

function showTitle(){
    const scroll = window.scrollY || window.pageYOffset;
    if (scroll == 1){
        window.scrollTo(0, 0);
    }
}

function hideTitle(){
    // 현재 수직 스크롤 위치 얻기
    const scroll = window.scrollY || window.pageYOffset;
    if (scroll > 0){
        return;
    }
    // 수직 및 수평 스크롤 위치를 절대값으로 설정
    window.scrollTo(0, 1);
}

document.addEventListener('click', function(event) {
    const clickedElement = event.target; // 클릭한 요소

    console.log(clickedElement);
    if (clickedElement === document.querySelector("div.fullscreen > div > div")){
    }
    else if (event.target.tagName.toLowerCase() === 'img') {
    }
    else{
        return;
    }

    // img 요소의 위치와 크기 정보를 가져옴
    const rect = clickedElement.getBoundingClientRect();

    // 클릭한 위치의 X 좌표
    const clickX = event.clientX;

    // img 요소의 중간 지점 계산
    const MiddleX = rect.left + (rect.width / 2);

    // 좌우 판단
    if (clickX < MiddleX) {
        if(getPageNum > 2) {
            return;
        }
        showTitle();
    } else {
        hideTitle();
    }
});
document.addEventListener('keydown', function(event) {
    // 좌, 우 화살표 키 감지
    if (event.key === 'ArrowLeft') {
        if(getPageNum > 2) {
            return;
        }
        showTitle();
        // 추가 동작 (왼쪽 화살표)
    } else if (event.key === 'ArrowRight') {
        hideTitle();
    }
});


function getTitle(text) {
    var title = text;
    if(text.indexOf('|') !== -1){
        title = text.split('|')[1];
        title = title.split('(')[0];
    }
    else{
        title = text.split('(')[0];
    }
    var page = text.split('[')[1];
    page = page.replace(']', '');
    page = page.replace('p', '');
    page = Number(page);


    return `${title} [${page}p]`;
}

const targetNode = document.body;

const config = { childList: true, subtree: true };

const callback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const el = document.querySelector('#root > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(1)');

            if (el !== null) {
                const title = el.textContent;
                document.title = getTitle(el.textContent);
                // Stop observing when target element is found
                observer.disconnect();
                break;
            }
        }
    }
};

const observer = new MutationObserver(callback);

observer.observe(targetNode, config);