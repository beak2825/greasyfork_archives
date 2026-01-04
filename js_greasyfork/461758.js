
// ==UserScript==
// @name         检查重复回帖
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  点击检查重复回帖
// @author       You
// @match        https://www.gamemale.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamemale.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461758/%E6%A3%80%E6%9F%A5%E9%87%8D%E5%A4%8D%E5%9B%9E%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/461758/%E6%A3%80%E6%9F%A5%E9%87%8D%E5%A4%8D%E5%9B%9E%E5%B8%96.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

(function () {
    'use strict';
    //GM_setValue()
    btn();
})();


function btn() {
    //创建按钮，点击输入指定时间
    let body = document.querySelector('body');
    let div = document.createElement('div');
    let stylebutton = 'z-index:999;fontsize:14px;position: fixed;cursor: pointer;left:10px;margin:10px;bottom:10px'
    let btn = document.createElement('button');
        btn.style.cssText = stylebutton;
        btn.textContent = '检查是否已回帖';
                btn.addEventListener('click', () => {
                    btncheckclick()
                });
        div.appendChild(btn);
    body.appendChild(div);
}


function btncheckclick(){
    //获取url中的帖子id  https://www.gamemale.com/thread-108110-1-1.html
    let url=window.location.href
            let re = /\d+/g//g：查询多次，而不是查询第一个符合
        let numbers = url.match(re);
    let    postId = numbers[0]
    numbers=$(".u-pic").children().first().attr("href").match(re);
    //console.log(document.getElementsByClassName("u-pic"))
    let uid = numbers[0]

    let checkUrl=`https://www.gamemale.com/forum.php?mod=viewthread&tid=${postId}&page=1&authorid=${uid}`
    window.location.href=checkUrl;
}
