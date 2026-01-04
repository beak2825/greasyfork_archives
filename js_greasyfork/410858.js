// ==UserScript==
// @name         今天又帮助了几个人？
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  统计greasyfork脚本作者页里脚本的安装总量
// @author       kakasearch
// @match        https://greasyfork.org/zh-CN/users*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410858/%E4%BB%8A%E5%A4%A9%E5%8F%88%E5%B8%AE%E5%8A%A9%E4%BA%86%E5%87%A0%E4%B8%AA%E4%BA%BA%EF%BC%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/410858/%E4%BB%8A%E5%A4%A9%E5%8F%88%E5%B8%AE%E5%8A%A9%E4%BA%86%E5%87%A0%E4%B8%AA%E4%BA%BA%EF%BC%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let days = document.getElementsByClassName('script-list-daily-installs')//今日安装数
    let totals = document.getElementsByClassName('script-list-total-installs')//总安装数

    let today =0
    let total = 0
    let sum = 0
    for(let x=0;x<=days.length;x++){if(x%2!=0){today+=parseInt(days[x].innerText.replace(/,/gi,''));sum+=1}}
    for(let x=0;x<=totals.length;x++){if(x%2!=0){total+=parseInt(totals[x].innerText.replace(/,/gi,''))}}
    if(today || total){
        let a = document.createElement('p')
    a.innerHTML= '脚本总数：'+sum+'</br>今日安装数：'+today+'</br>总安装数：'+total
    document.querySelector("#user-script-list-section > header").appendChild(a)
    }
})();