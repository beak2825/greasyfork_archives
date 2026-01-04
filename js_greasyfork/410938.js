// ==UserScript==
// @name         体育课抢课
// @namespace    https://greasyfork.org/zh-CN/users/542631-stakcery
// @version      4.2
// @description  SCU-201B专属抢课脚本
// @author       Y4tacker
// @include      http://211.83.159.5:81/selectCourse
// @downloadURL https://update.greasyfork.org/scripts/410938/%E4%BD%93%E8%82%B2%E8%AF%BE%E6%8A%A2%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/410938/%E4%BD%93%E8%82%B2%E8%AF%BE%E6%8A%A2%E8%AF%BE.meta.js
// ==/UserScript==
window.status = null;
function getIt(){
    xkqk = document.querySelector('#main-container > div.main-content > div > div.page-content > p > button');
    xkqk.click();
    window.setTimeout(function (){},10);
    cg = document.querySelector('#main-container > div.main-content > div > div.page-content > div.table-responsive > table > tbody > tr:nth-child(9) > td:nth-child(2) > div:nth-child(1) > div:nth-child(3) > button');
    if(cg.textContent=='已达到人数上限'){
        cname = getTcName();
        console.log(cname+'还未开启选课');
        cg.textContent = cname;
        window.status = false;
    }else{
        name = getTcName();
        if(name === '蔡舸'){
            console.log(name);
            cg.click();
        }
        window.status = true;
    }
    //console.log(window.status)
}
function ds(){
    t1 = window.setInterval(function (){getIt();},200);
    t2 = window.setInterval(function(){
        if(window.status == 'true'){
        window.clearInterval(t1);
        window.clearInterval(t2);
        }
    },1000);
}
function getTcName(){
    element = document.querySelector('#main-container > div.main-content > div > div.page-content > div.table-responsive > table > tbody > tr:nth-child(9) > td:nth-child(2) > div:nth-child(1) > div:nth-child(3) > button');
    elementt = element.parentElement.parentElement;
    teacher = elementt.querySelector('#main-container > div.main-content > div > div.page-content > div.table-responsive > table > tbody > tr:nth-child(9) > td:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a');
    tcName = teacher.textContent
    return tcName;
}
ds();