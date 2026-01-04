
// ==UserScript==
// @name         定时点击
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  定时点击按钮
// @author       You
// @match        https://www.gamemale.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamemale.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461627/%E5%AE%9A%E6%97%B6%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/461627/%E5%AE%9A%E6%97%B6%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

(function () {
    'use strict';
    //GM_setValue()
    btn();
    window.confirm = function() {return true}
})();


function btn() {
    //创建按钮，点击输入指定时间
    let body = document.querySelector('body');
    let div = document.createElement('div');
    let stylebutton = 'z-index:999;fontsize:14px;position: fixed;cursor: pointer;right:10px;margin:10px;bottom:'
    let right = 10;
    div.style.cssText = stylebutton + right + 'px';
    for (i = 8; i <= 9; i++) {
        let btn = document.createElement('button');
        btn.style.cssText = stylebutton + (right + (i - 1) * 40) + 'px';
        switch (i) {
            case 8:
                btn.textContent = '定时点击按钮';
                btn.addEventListener('click', () => {
                    btnTimeclick()
                });
                break;
            case 9:
                btn.textContent = '检查是否已回帖';
                btn.addEventListener('click', () => {
                    btncheckclick()
                });
                break;
            default:
                console.log("error");
                break;
        }
        div.appendChild(btn);
    }
    body.appendChild(div);
    // console.log(getHtmlText());
}

function btnTimeclick() {
    let input = prompt("请输入执行时间",
        "0点0分0秒");
    if (input == "") {
        console.log("error")
    } else {
        let re = /\d+/g//g：查询多次，而不是查询第一个符合
        let numbers = input.match(re);
        let hour = numbers[0]
        let minutes = numbers[1]
        let second = numbers[2]
        let selector = prompt("请输入按钮的selector");
        setRegular(hour, minutes, second, selector);
    }

}


function setRegular(hour, minutes, second, selector) {

    var timeTask = setInterval(function () {
        var date = new Date();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        console.log(`【now】${h}:${m}:${s},【targetTime】${hour}:${minutes}:${second}`);
        if (h == hour && m == minutes && s == second) {
            document.querySelector(selector).click();
            console.log("完成执行");
            clearInterval(timeTask);

        }
    }, 1000);
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
