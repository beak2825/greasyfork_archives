// ==UserScript==
// @name         Kioskloud 국룰자동입력기
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  kiosk에 자동으로 국룰을 입력하고, 클릭해줍니다.
// @author       You
// @match        https://kiosk.ac/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kioskloud.xyz
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493596/Kioskloud%20%EA%B5%AD%EB%A3%B0%EC%9E%90%EB%8F%99%EC%9E%85%EB%A0%A5%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/493596/Kioskloud%20%EA%B5%AD%EB%A3%B0%EC%9E%90%EB%8F%99%EC%9E%85%EB%A0%A5%EA%B8%B0.meta.js
// ==/UserScript==
'use strict';

function password() {
    document.querySelector('.swal2-input').value='smpeople';
    document.querySelector('.swal2-actions .swal2-confirm.swal2-styled').click();
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

async function auto(){
    await password();
    await setTimeout(toCartEtc,900);
}

window.addEventListener('load',()=>setTimeout(auto,500));