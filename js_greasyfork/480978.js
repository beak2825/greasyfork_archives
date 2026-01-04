// ==UserScript==
// @name         연쇄적 버튼 클릭 스크립트
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  페이지 변경 시 연쇄적으로 버튼 클릭
// @author       Your Name
// @match        https://zigzag.kr/*
// @match        https://api.zigzag.kr/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480978/%EC%97%B0%EC%87%84%EC%A0%81%20%EB%B2%84%ED%8A%BC%20%ED%81%B4%EB%A6%AD%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/480978/%EC%97%B0%EC%87%84%EC%A0%81%20%EB%B2%84%ED%8A%BC%20%ED%81%B4%EB%A6%AD%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.meta.js
// ==/UserScript==

// 창을 두개 띄어야함. event창 그리고 order창. 이때 order까지는 수동으로 진행한다.


// 변수 - 전역
const buttonClickInterval = 100;
const per = 50 // 20 , 0

let maxAttempts = 10000; // 최대 시도 횟수 설정
// 변수 - event 페이지
let event_interval = 100 // event 페이지에서 버튼 클릭 간격
const cupon_check_wait_time = 1000

let buttonText = "아직" // 아직 or 쿠폰
let per_selector = '#wWRbd-nr > div.css-1wpxqh0.e1k8uihx0 > div:nth-child(1)'
let price = "5,000원";
let clickMaxCount = 5;

// 변수 - 쿠폰 페이지
if (per === 50) {
    buttonText = "쿠폰"; // 아직 or 쿠폰
    per_selector = '#wWRbd-nr > div.css-1wpxqh0.e1k8uihx0 > div:nth-child(1)';
    price = "40,000원";
    event_interval = 100;
    clickMaxCount = 6;
    maxAttempts = 1000000;
} else if (per === 20) {
    buttonText = "쿠폰"; // 아직 or 쿠폰
    per_selector = '#wWRbd-nr > div.css-1wpxqh0.e1k8uihx0 > div:nth-child(3)';
    price = "16,000원";
    event_interval = 100;
    clickMaxCount = 6;
    maxAttempts = 1000000;
}

const event_selector = 'div.css-1kf3opv.e11b5buj0 > button' //'#XUN5tYk8 > div.css-1kf3opv.e11b5buj0 > button';
// home 페이지
const bucket_selector = '#__next > main > nav > div > div > a.css-b3503w.e17px01h2';

// cart 페이지
const all_select_selector = '#__next > div.zds-themes.light-theme > div > div > div.css-1hmgitk.e9sz06i1 > section > label' // 전체선택 라벨 포함
const buy_selector = '#__next > div.zds-themes.light-theme > div > div > div.css-18ns8av.e9sz06i0 > div > div > div > div.css-cdral9 > div > button';
const cupon_choice_selector = '#ok';
const price_selector_on_cart = '#__next > div.zds-themes.light-theme > div > div > div.css-18ns8av.e9sz06i0 > div > div > div > div.css-cdral9 > div > div > div.discount.BODY_13.MEDIUM > span.css-n5rfx2.eicsu3x1'

// 쿠폰 페이지
const fold_selector = '#__next > div.css-yr9kz4.e1vz0tqh3 > div > div.css-uyge3z.e1vz0tqh0 > div > div > div.top_wrapper > div:nth-child(1) > div.coupon_select__tab_info'
const cupon_apply_selector = '#__next > div.css-yr9kz4.e1vz0tqh3 > div > div.css-uyge3z.e1vz0tqh0 > div > div > div.css-6wtj4i > button';
const price_selector = "#__next > div.css-yr9kz4.e1vz0tqh3 > div > div.css-uyge3z.e1vz0tqh0 > div > div > div.top_wrapper > div.is_opened.css-3on1c0 > div > div:nth-child(1) > div > div:nth-child(1)"

// 결제 페이지
const pay_select_selector = '#__next > div.zds-themes.light-theme > div > div > div.css-18ns8av.e9sz06i0 > div > div > section:nth-child(5) > div > div.css-1d8k4za > div:nth-child(2) > div.tab_head';
const agree_selector = '#__next > div.zds-themes.light-theme > div > div > div.css-18ns8av.e9sz06i0 > div > div > section.css-b2576h > div.terms_row.e16qgsn10.css-fpsya8 > label';
const pay_selector = '#__next > div.zds-themes.light-theme > div > div > div.css-18ns8av.e9sz06i0 > div > div > section.css-1gv0lpq > button';
const no_cash_selector = '#__next > div.zds-themes.light-theme > div > div > div.css-18ns8av.e9sz06i0 > div > div > section:nth-child(5) > div > div.css-1d8k4za > div:nth-child(2) > div.content > section > div.css-1fe7eha > section > div.css-1mz29im.e1n5we185 > label:nth-child(3)';
const cupon_choice_selector_order = '#__next > div.zds-themes.light-theme > div > div > div.css-18ns8av.e9sz06i0 > div > div > section.css-ddtb6p > div > div.css-iawl4o > div.row_content';

function getTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

// condition과 selector에 맞는 element를 반환. element에 수행할 action 지정.
// condition 예시 : (element) => {element.textContent.includes("쿠폰")}
// action 예시 : (element) => {element.click()}
// includeText ""는 텍스트가 존재한다는 의미.
function getElementBy(selector, includeText, action, fail_action=(element)=>{}, clickInterval=buttonClickInterval) {
    return new Promise(resolve => {
        let counter = 0; // 카운터 초기화

        const checkAndClick = setInterval(function() {
            counter++; // 카운터 증가
            if (counter >= maxAttempts) {
                clearInterval(checkAndClick); // 최대 시도 횟수에 도달하면 인터벌 중지
                console.log('최대 시도 횟수 도달');
            }
            const element = document.querySelector(selector);
            if (element && element.textContent.includes(includeText)) {
                clearInterval(checkAndClick); // 버튼이 발견되면 인터벌 중지
                console.log("버튼클릭", element.textContent)
                action(element)
                resolve(element); // 버튼 요소를 resolve하여 다음 작업에서 사용할 수 있도록 함
            } else {
                console.log('fail', element.textContent, price, element.textContent.includes(includeText))
                fail_action(element)
            }

        }, clickInterval);
    });
}

function clickButton(selector, clickInterval=buttonClickInterval) {
    console.log(getTime(), selector)
    return new Promise(resolve => {
        const checkAndClick = setInterval(function() {
            const button = document.querySelector(selector);
            if (button) {
                button.click();
                clearInterval(checkAndClick); // 버튼이 발견되면 인터벌 중지
                resolve(); // Promise를 resolve하여 다음 작업을 진행할 수 있도록 함
            }
        }, clickInterval);
    });
}

function getContent(selector) {
    const element = document.querySelector(selector)
    if (element) {
        return element.textContent
    } else {
        return "없음"
    }
}

function eventButtonClick(selector) {
    const button = document.querySelector(selector)
    if (button) {
        button.click();
        console.log(button.textContent)
        if (button.textContent.includes(buttonText)) {
            setTimeout(() => {window.location.href = "https://zigzag.kr/cart"}, cupon_check_wait_time)
        }
    } else {
        console.log("no button")
    }
}

(function() {
    'use strict';

    console.log("script load", getTime())

    if (window.location.pathname.includes('events')) {
        clickButton(per_selector, event_interval)
        .then(() => {
            setInterval(() => {
                eventButtonClick(event_selector)
            }, event_interval);
        });

    } else if (window.location.pathname.includes('order')) {
        console.log("location.pathname", window.location.pathname)

        getElementBy(cupon_choice_selector_order, price, (element)=>{
                            console.log(element.textContent)
                    })
        .then(() => {
            getElementBy(pay_selector, "결제하기", (element)=>{element.click()})
        });
    } else if (window.location.pathname === "/coupon/select") {
        console.log("location.pathname", window.location.pathname);

        getElementBy(fold_selector, "적용하기", (element)=>{element.click()})
        .then(() => getElementBy(price_selector, price, (element)=>{
                element.querySelector("input").click()}, (element)=>{
                    if (element.textContent.includes("원")) {
                        console.log("진입");
                        window.location.reload();
                    }
                })
        )
        .then(() => {
            getElementBy(cupon_apply_selector, "할인 적용", (element)=>{element.click()})
        });
    } else if (window.location.pathname.includes('keypad')) {
        console.log("keypad")
        let clickCount = 0;

        const keypadSelector = '#ownKeypad > div.kpdWrap.kpd-img.kpdNum.typeA > div.nfilter_keypad_div.kpdGrp.number'
        getElementBy(keypadSelector, "", (element)=>{
            const keyButtons = element.querySelectorAll('button');
            const zero_button = Array.from(keyButtons).find(element => element.getAttribute('aria-label') === '0');

            const interval = setInterval(() => {
                zero_button.click();
                clickCount++;

                if (clickCount >= clickMaxCount) {
                    clearInterval(interval);
                }
            }, buttonClickInterval); // 예: 1초 간격
        })
    }
})();