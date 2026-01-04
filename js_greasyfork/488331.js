// ==UserScript==
// @name         AtCoder 提交记录跳转
// @namespace    http://tampermonkey.net/
// @version      2024.2.26
// @description  AtCoder 跳转至提交记录
// @author       AbsMatt
// @match        https://www.luogu.com.cn/problem/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488331/AtCoder%20%E6%8F%90%E4%BA%A4%E8%AE%B0%E5%BD%95%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/488331/AtCoder%20%E6%8F%90%E4%BA%A4%E8%AE%B0%E5%BD%95%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

function solve(){
    let winnam = window.location.href;
    let atnam = "";
    let flag = false;
    let at=false;
    let pos = document.querySelector("#app > div.main-container > div.wrapper.wrapped.lfe-body.header-layout.normal > div.header > div.functional > div.operation");
    let butt = document.createElement('button');
    butt.innerText = 'AtCoder 提交记录';
    butt.id = 'free';
    butt.className = 'btn btn-primary';
    butt.style.backgroundColor = '#3498DB';
    butt.style.borderColor = '#3498DB';
    butt.style.color = 'white';
    butt.style.width = '10em';
    butt.style.height = '2.3em';
    for (let i = 0; i < winnam.length; i++) {
        if (flag && winnam[i] !== '_') atnam += winnam[i];
        if (winnam[i] === '_'){
            at=true;
            if (flag === false) {
                flag = true;
            } else {
                flag = false;
            }
        }
    }
    if(at){
        pos.appendChild(butt);
        butt.addEventListener('click', function() {
            window.open("https://atcoder.jp/contests/" + atnam + "/submissions/me");
        });
    }
}

(function() {
    'use strict';
    solve();
})();