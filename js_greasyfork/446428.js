// ==UserScript==
// @name         Kiosk.ac 국룰자동입력기
// @namespace    http://tampermonkey.net/
// @version      0.27
// @description  kiosk 에 자동으로 국룰을 입력하고, 클릭해줍니다.
// @author       You
// @match        https://kiosk.ac/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kioskloud.xyz
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446428/Kioskac%20%EA%B5%AD%EB%A3%B0%EC%9E%90%EB%8F%99%EC%9E%85%EB%A0%A5%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/446428/Kioskac%20%EA%B5%AD%EB%A3%B0%EC%9E%90%EB%8F%99%EC%9E%85%EB%A0%A5%EA%B8%B0.meta.js
// ==/UserScript==
'use strict';

const 국룰_PASSWORD = 'smpeople';
const LOAD_DELAY = 500; // 비밀번호 입력전에 브라우저 로딩 대기시간. 느린환경에서는 숫자를 좀 더 크게하면됨 (ms 단위)


const PASSWORD_INPUT_SELECTOR = '#password-dialog input'
const PASSWORD_SUBMIT_SELECTOR = '#password-dialog button.btn'

async function main(){
    await pressPassword();
    await setTimeout(()=>document.querySelector(PASSWORD_INPUT_SELECTOR).value = 국룰_PASSWORD, 1100);
}

window.addEventListener('load',()=>setTimeout(main, LOAD_DELAY));


function pressPassword() {
    document.querySelector(PASSWORD_INPUT_SELECTOR).value = 국룰_PASSWORD;
    document.querySelector(PASSWORD_SUBMIT_SELECTOR).click();
}


async function toCartEtc() {
    await toCart();
    await clickDown();

    function toCart() {
        let items = document.querySelectorAll('.item-container-outer');

        clickEachItem();
        openContextMenu(items);
        clickToCart();

        function clickEachItem(){
            items.forEach(item=>click(item));

            function click(item){
                item.children[0].click();
            }
        }

        function openContextMenu(){
            let firstItem = items[0];
            let firstItemInner = firstItem.children[0];
            let ev = document.createEvent('HTMLEvents');
            ev.initEvent('contextmenu', true, false);
            firstItemInner.dispatchEvent(ev);
        }

        function clickToCart(){
            setTimeout(()=>document.querySelector('.mdc-menu .mdc-deprecated-list-item__text').click(),400);
        }
    }

    async function clickDown(){

        await cartButtonClick();
        setTimeout(downButtonClick,800);

        function cartButtonClick(){
            let cartButton = document.querySelector('.mdc-fab.mdc-ripple-upgraded:nth-child(2)');
            cartButton.click();
        }

        function downButtonClick(){
            let downButton = document.querySelector('.mdc-button.mdc-button--outlined.mdc-ripple-upgraded');
            console.log(`downbutton : ${downButton}`)
            downButton.click();
        }
    }
}

