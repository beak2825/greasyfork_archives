// ==UserScript==
// @name         洛谷主页显示
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  显示洛谷个人主页信息
// @author       4927618350
// @match        https://www.luogu.com.cn/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/486636/%E6%B4%9B%E8%B0%B7%E4%B8%BB%E9%A1%B5%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/486636/%E6%B4%9B%E8%B0%B7%E4%B8%BB%E9%A1%B5%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

window.addEventListener('load',function(){
    var main = document.getElementsByClassName("card padding-default");
    main = main[main.length-1];
    var maintenance = main.getElementsByTagName('div')[0];
    var introduction = main.getElementsByTagName('div')[1];
    if(maintenance.innerText!='系统维护，该内容暂不可见。') return;
    maintenance.style.display="none";
    introduction.style.display="block";
})
