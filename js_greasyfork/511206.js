// ==UserScript==
// @name         【twitcasting】QuickComment
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  ctrl + Enterで送信
// @author       You
// @match        https://ja.twitcasting.tv/*
// @match        https://twitcasting.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitcasting.tv
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511206/%E3%80%90twitcasting%E3%80%91QuickComment.user.js
// @updateURL https://update.greasyfork.org/scripts/511206/%E3%80%90twitcasting%E3%80%91QuickComment.meta.js
// ==/UserScript==




function main(){
    const buttonTW = document.querySelector('button.tw-button-primary');
    const textareaTW = document.querySelector('textarea.tw-textarea');
    if(buttonTW === null || textareaTW === null){
        setTimeout(()=>{
            main();
            return;
        },300)
    }else{
        console.log('ロード完了');
        textareaTW.addEventListener("keydown",(e)=>{
            if(e.code === 'Enter' && e.ctrlKey) buttonTW.click();
        })
    }
}

main();