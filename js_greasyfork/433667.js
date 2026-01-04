// ==UserScript==
// @name         AO3屏蔽关键字-简陋版
// @version      0.1.0
// @description  进行一个裁缝魔改，添加屏蔽某关键词的功能，镜像网站也能用，目前只有标题检测，后续考虑添加summary检测
// @author       dp
// @match        https://archiveofourown.org/*
// @match        https://nightalk.top/*
// @namespace https://greasyfork.org/users/823731
// @downloadURL https://update.greasyfork.org/scripts/433667/AO3%E5%B1%8F%E8%94%BD%E5%85%B3%E9%94%AE%E5%AD%97-%E7%AE%80%E9%99%8B%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/433667/AO3%E5%B1%8F%E8%94%BD%E5%85%B3%E9%94%AE%E5%AD%97-%E7%AE%80%E9%99%8B%E7%89%88.meta.js
// ==/UserScript==
// ========================

var blacklist=['鸣佐','鼬佐'];//关键词名单   自己添加
var links=document.links;

function test(keywords) {
    for (let k = 0; k < blacklist.length; k++) {
        if (keywords.indexOf(blacklist[k]) != -1) return true;
        //else return true;
    }
    return false;
}

let keywords = document.querySelectorAll('h4.heading');
console.log(keywords);


if (blacklist.length && keywords.length) {
    for (let k = 0; k < blacklist.length; k++) {
        let tars = [];
        for (let x = 0; x < keywords.length; x++) {
            if (keywords[x].children.length > 0 && test(keywords[x].children[0].innerHTML)) {
                tars.push(keywords[x]);
            }
        }
        console.log(tars);
        tars.forEach((item) => {
            // a --- h4 --- div -- li
            let li = item.parentElement.parentElement;
            // li.style.display = 'none';
            li.parentElement.removeChild(li);})
    }
}