// ==UserScript==
// @name         芝浦シラバス修正
// @namespace    twitter.com/to_ku_me
// @version      0.1
// @description  シラバスが見にくいのを直します
// @author       とくめいっ！
// @match        http://syllabus.sic.shibaura-it.ac.jp/*
// @icon         https://scombz.shibaura-it.ac.jp/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442520/%E8%8A%9D%E6%B5%A6%E3%82%B7%E3%83%A9%E3%83%90%E3%82%B9%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/442520/%E8%8A%9D%E6%B5%A6%E3%82%B7%E3%83%A9%E3%83%90%E3%82%B9%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==


document.querySelector(".table_sticky thead tr td").style.position = "static";
let li = document.querySelectorAll(".table_sticky thead:nth-child(2) tr:nth-child(1) th");
for (let i =0;i<li.length;i++){
li[i].style.position = "static";
}

let li2 = document.querySelectorAll(".table_sticky thead:nth-child(2) tr:nth-child(2) th");
for (let i =0;i<li.length;i++){
li2[i].style.position = "static";
}
