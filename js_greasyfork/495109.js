// ==UserScript==
// @name         ニコ生ゲーム非表示
// @namespace    http://tampermonkey.net/
// @version      2024-08-05
// @description  ニコ生ゲームの非表示とシークバーをクリックした時にpop-upするバナーを削除
// @author       ぐらんぴ
// @match        https://live.nicovideo.jp/watch/lv*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495109/%E3%83%8B%E3%82%B3%E7%94%9F%E3%82%B2%E3%83%BC%E3%83%A0%E9%9D%9E%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/495109/%E3%83%8B%E3%82%B3%E7%94%9F%E3%82%B2%E3%83%BC%E3%83%A0%E9%9D%9E%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

let parent = document.querySelector(".addon-controller"),
    btn = document.createElement("button")
btn.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256" width="20px" height="20px"><g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(10.66667,10.66667)"><path d="M12,2c-5.511,0 -10,4.489 -10,10c0,5.511 4.489,10 10,10c5.511,0 10,-4.489 10,-10c0,-5.511 -4.489,-10 -10,-10zM12,4c4.43012,0 8,3.56988 8,8c0,1.85307 -0.63074,3.55056 -1.68164,4.9043l-11.22266,-11.22266c1.35374,-1.0509 3.05123,-1.68164 4.9043,-1.68164zM5.68164,7.0957l11.22266,11.22266c-1.35374,1.0509 -3.05123,1.68164 -4.9043,1.68164c-4.43012,0 -8,-3.56988 -8,-8c0,-1.85307 0.63074,-3.55056 1.68164,-4.9043z"/></g></g></svg>`
parent.appendChild(btn)
btn.addEventListener('click', ()=>{
    gameDisplay2 = document.querySelector("#akashic-gameview > div > div:nth-child(2)")
    gameDisplay3 = document.querySelector("#akashic-gameview > div > div:nth-child(3)")
    if(!!gameDisplay3){
        if(gameDisplay3.style.display !== 'none'){
            gameDisplay3.style.display = 'none'
        }else(gameDisplay3.style.display = '')
    }else{
        if(gameDisplay2.style.display !== 'none'){
            gameDisplay2.style.display = 'none'
        }else(gameDisplay2.style.display = '')
    }
})

// プレミアムバナーを削除
let bannerCss =
    `.___premium-member-registration-appeal-panel___sUYPa {
    display: none;
    }
    .addon-controller > button:nth-child(7) {
    background: black;
    border: none;`,
    style = document.createElement('style')
style.innerHTML = bannerCss;
document.head.append(style)