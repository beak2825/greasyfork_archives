// ==UserScript==
// @name         DLsite 성우 커스텀 사전
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  DLsite 성우명 전처리 번역.
// @author       Ravenclaw5874
// @match        https://www.dlsite.com/*
// @match        https://hvdb.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dlsite.com
// @require      http://code.jquery.com/jquery-3.6.1.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/454950/DLsite%20%EC%84%B1%EC%9A%B0%20%EC%BB%A4%EC%8A%A4%ED%85%80%20%EC%82%AC%EC%A0%84.user.js
// @updateURL https://update.greasyfork.org/scripts/454950/DLsite%20%EC%84%B1%EC%9A%B0%20%EC%BB%A4%EC%8A%A4%ED%85%80%20%EC%82%AC%EC%A0%84.meta.js
// ==/UserScript==

/*업데이트 로그----------------------------------
1.2.1 리리무->리림
1.2 HVDB 지원

1.1 완성
-----------------------------------------------*/


//성우명 사전. 형식에 맞게 추가해주세요.
let dict = {
    '陽向葵ゅか':'히나타 유카',
    '藍沢夏癒':'아이자와 나츄',
    'かの仔':'카노코',
    '天知遥':'아마치 하루',
    '思ちぽ':'오모이 치포',
    '一之瀬りと':'이치노세 리토',
    '縁側こより':'엔가와 코요리',
    '柚木つばめ':'유즈키 츠바메',
    '大山チロル':'오오야마 치로루',
    '乙倉ゅい':'오토쿠라 유이',
    '来夢ふらん':'쿠루무 프랑',
    '逢坂成美':'아이사카 나루미',
    '分倍河原シホ':'부바이가와라 시호',
    '涼花みなせ':'스즈카 미나세',
    'みもりあいの':'미모리 아이노',
    '山田じぇみ子':'야마다 제미코',
    '秋野かえで':'아키노 카에데',
    'みやぢ':'미야지',
    '御崎ひより':'미사키 히요리',
    '涼貴涼':'스즈키 료우',
    '伊ヶ崎綾香':'이가사키 아야카',
    '沢野ぽぷら':'사와노 포푸라',
    '琴音有波':'코토네 아루하',
    '兎月りりむ。':'우즈키 리림',
    'そらまめ。':'소라마메',
    '浅木式':'아사기 시키'
};



//HTMLCollection.prototype.forEach = Array.prototype.forEach;

let isBold = false;
let isProductPage = location.pathname.includes('/work/') || location.pathname.includes('/announce/') || location.pathname.includes('/WorkDetails/');

async function main() {
    'use strict';
    isBold = await GM.getValue('isBold', false); //볼드 설정 불러오기
    if (location.host === 'www.dlsite.com') {$('#container *').contents().each((i,e) => {TranslateCV(e)});};
    if (location.host === 'hvdb.me') {$('.body-content *').contents().each((i,e) => {TranslateCV(e)});};
}

function TranslateCV(node) {
        //텍스트 노드, 부모 존재
        if(node.nodeType !== 3 || node.parentElement === null) return;

        //사전에 있으면 계속, 없으면 종료.
        let isInDict = false;
        for (let key in dict) {
            if (node.textContent.includes(key)) { isInDict = true; break; }
        }
        if (!isInDict) return;

        //모든 성우명이 바뀐 HTML로 한번에 교체
        let replaceHTML = node.parentElement.innerHTML;
        for (let key in dict) {
            let repl = `<span class="notranslate">${dict[key]}</span>`;
            if (isBold && !isProductPage) {repl = `<b>${repl}</b>`;} //볼드 설정이 On && 상품페이지 아님 => 볼드화
            replaceHTML = replaceHTML.replaceAll(key,repl);
        }
        node.parentElement.innerHTML = replaceHTML;
}

function SetBold(newState) {
    isBold = newState;
    GM_setValue('isBold', isBold)
}
function ActivateBold() {SetBold(true);}
function DeactivateBold() {SetBold(false);}

function registerMenuCommand() {
    GM_registerMenuCommand(`전처리 성우명 볼드 표시 활성화`, ActivateBold);
    GM_registerMenuCommand(`전처리 성우명 볼드 표시 비활성화`, DeactivateBold);
};

main();
registerMenuCommand();
