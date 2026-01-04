// ==UserScript==
// @name         b站原神纯享版（自用）
// @namespace    http://tampermonkey.net/
// @version      0.233
// @description  安装脚本后将只显示原神内容，不是原神我不看😋
// @license      MIT
// @author       genshin_honey
// @match        https://*.bilibili.com/*
// @grant        none
// @run at       document-end
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/458331/b%E7%AB%99%E5%8E%9F%E7%A5%9E%E7%BA%AF%E4%BA%AB%E7%89%88%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/458331/b%E7%AB%99%E5%8E%9F%E7%A5%9E%E7%BA%AF%E4%BA%AB%E7%89%88%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==
let head = document.querySelector('[class="bili-header__bar"]');
if(head) {
    let t1 = document.querySelector('.bili-header__channel');
    if(t1) t1.remove();
    let t2 = document.querySelector('.left-entry');
    if(t2) t2.remove();
    let t3 = document.querySelector('.center-search-container');
    if(t3) t3.remove();
    let gb = document.querySelector('[class="recommended-swipe grid-anchor"]');
    if(gb) {gb.remove();}
    head.addEventListener("DOMNodeInserted", function(event) {
        let ob = document.createElement("div");
        let ba = document.querySelector('.right-entry');
        ba.parentElement.insertBefore(ob,ba);
    });
}
let test = setInterval(() => {
    let t4 = document.querySelector('.next-play');
    if(t4) t4.remove();
    let t5 = document.querySelector('#right-bottom-banner');
    if(t5) t5.remove();
    let t6 = document.querySelector('#live_recommand_report');
    if(t6) t6.remove();
    let t7 = document.querySelector('#activity_vote');
    if(t7) t7.remove();
    let dd = document.querySelector('[title="点赞（Q）"]');
    if(dd && dd.getAttribute("class") && dd.getAttribute("class") === "like") {
        dd.click();
    }
},2000);
let timer = setInterval(() =>{
    let header = document.querySelector('#biliMainHeader');
    if(header) {header.remove();}
    let hc = document.querySelector('.header-channel');
    if(hc) {hc.remove();}
    let ad = document.querySelector('[class="vcd"]');
    if(ad) {
        ad.remove();
    }

    let adi = document.querySelector('#bannerAd');
    if(adi) {adi.remove();}

    var temp = document.querySelectorAll('[class="video-page-card-small"]');
    for(i = 0; i < temp.length; i++) {
        if(temp[i].innerText.includes("原神") == false) {
            temp[i].remove();
        }
    }
    let data = document.querySelectorAll('[class="bili-video-card is-rcmd"]');
    for(i = 0; i < data.length; i++) {
        let text = $(data[i]).find('[class="bili-video-card__info--tit"]');
        if(text[0].innerText.includes("原神") == false) {
            data[i].remove();
        }
    }
    let live = document.querySelectorAll('[class="bili-live-card is-rcmd"]');
    for(i = 0; i < live.length; i++) {
        live[i].remove();
    }
    let kk =document.querySelectorAll('.floor-single-card');
    for(i = 0; i < kk.length; i++) {
        kk[i].remove();
    }
    let kt = document.querySelectorAll('.feed-card');
    for(i = 0; i < kt.length; i++) {
        if(kt[i].children.length == 0) {
            kt[i].remove();
        }
    }
},2000);