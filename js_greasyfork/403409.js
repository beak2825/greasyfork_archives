// ==UserScript==
// @name         超星尔雅刷学习访问量
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @match        *://*/mycourse/studentcourse?*
// @author       You
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/403409/%E8%B6%85%E6%98%9F%E5%B0%94%E9%9B%85%E5%88%B7%E5%AD%A6%E4%B9%A0%E8%AE%BF%E9%97%AE%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/403409/%E8%B6%85%E6%98%9F%E5%B0%94%E9%9B%85%E5%88%B7%E5%AD%A6%E4%B9%A0%E8%AE%BF%E9%97%AE%E9%87%8F.meta.js
// ==/UserScript==



(function() {
    'use strict';
    var lud=50  //刷访问总次数
    var className = document.querySelector("body > div.c-header > div > h1 > span:nth-child(1)").title;
    document.querySelector("#hssform > div").style.marginLeft="300px";
    var lua = GM_getValue(className,false);

    if(lua){
        if(lua<=lud){
            document.querySelector("body > div.mb10 > div.ztop > div > div.zt_logo > a").innerText="首页\t需要访问次数"+lud+",已刷"+lua+"次，剩余"+(lud-lua)+"次";
            setTimeout(() => {
                GM_setValue(className,lua+1);
                location.reload()
            }, 60000 );
        }
    }else{
        setTimeout(() => {
                GM_setValue(className,1);
                location.reload()
            }, 60000 );
    }
})();