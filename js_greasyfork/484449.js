// ==UserScript==
// @name         TyperacerPlus
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  自動スクロールを追加等
// @author       You
// @match        https://play.typeracer.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typeracer.com
// @license MIT
// @resource   Font https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400&display=swap
// @grant      GM_addStyle
// @grant      GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/484449/TyperacerPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/484449/TyperacerPlus.meta.js
// ==/UserScript==

GM_addStyle(GM_getResourceText("Font"));
//フォントを使えるようにする呪文

function main(){
    let form;
    let keydownEvent;
    let T;
    let InputtingText;
    let addScrollFlg = false;
    function EventFuc(){
        keydownEvent = function(e){
            if(e.code == 'Space'){
                InputtingText = document.querySelectorAll('span[unselectable="on"]')[1];
                InputtingText.scrollIntoView({
                    behavior : "smooth", //instant , smooth
                    block : "center"
                });
            };
        };
    form.addEventListener('keydown',keydownEvent);
    };

    setInterval(()=>{
        form = document.querySelector('.txtInput');
        T = document.querySelectorAll('span[unselectable="on"]')[1];
        if(form && T){
            if(!addScrollFlg){
            addScrollFlg = true;
            EventFuc();
            console.log("イベント追加")
            };
        }else if(addScrollFlg){
            if(!T || !form){
                form.removeEventListener('keydown',keydownEvent);
                console.log("イベント削除")
                addScrollFlg = false;
            };
        };
    },3000);
};

setTimeout(main,2000);

/*ここからスタイル*/

const coutdownPopupStyleCSS = `<style>
    body > div.countdownPopup.horizontalCountdownPopup{
        transform: scale(0.5) !important;
        position: fixed !important;
        left: 70vw !important;
        top: 0vh !important;
        visibility: visible !important;
        clip: rect(auto, auto, auto, auto) !important;
        overflow: visible !important;
    }
    </style>`;

const inputAreaStyleCSS = `<style>
    .txtInput{
        position : fixed !important;
        bottom : 30vh !important;
        z-index : 10 !important;
        width : 90vw !important;
        font-size : 24px !important;
    }
    </style>`;

const mainStyle = `<style>
    *{
        font-family : 'Noto Sans', sans-serif !important;
    }
    .mainViewport table.inputPanel table div span{
        font-size : 24px !important;
    }
    </style>`;


document.body.parentElement.insertAdjacentHTML('beforeend',mainStyle);
//フォント関係変更
document.body.parentElement.insertAdjacentHTML("beforeend",coutdownPopupStyleCSS);
//カウントダウンのスタイル変更
document.body.insertAdjacentHTML("beforeend",inputAreaStyleCSS);
//入力エリアのスタイル