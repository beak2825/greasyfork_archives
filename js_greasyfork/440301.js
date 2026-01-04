// ==UserScript==
// @name         晋江文学城BBS清爽版本
// @namespace    bbs.jjwxc.net
// @version      0.3
// @description  白色主题,去广告,标记楼主;
// @author       chikango   
// @license      chikango
// @match        https://bbs.jjwxc.net/*
// @icon         https://www.google.com/s2/favicons?domain=jjwxc.net
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/440301/%E6%99%8B%E6%B1%9F%E6%96%87%E5%AD%A6%E5%9F%8EBBS%E6%B8%85%E7%88%BD%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/440301/%E6%99%8B%E6%B1%9F%E6%96%87%E5%AD%A6%E5%9F%8EBBS%E6%B8%85%E7%88%BD%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==
(document.head || document.documentElement).insertAdjacentHTML('beforeend',
    `<style>
    body{background-color:#ffffff!important;}
    .ad360_box,#imgurl,.width_800,.closeJJAd,.textbook {display:none}
    table{
     border-collapse:collapse;
    }
    #showmore_button {
    border:0!important;
    background-color:#f1f2f3!important;

    }
    [class^=image]{
    opacity:0.5;
    }
    #selecthead td,.boardlist,tr{
    background-color:#ffffff;
    }
    </style>`);

(function() {
    'use strict';
    document.querySelector("[border='2']")?document.querySelector("[border='2']").border = 0:'';
    let set = new Set();
    document.querySelectorAll('.authorname font:nth-child(3)').forEach((element)=>{
        set.add(element.innerText)
    })
    let opId = Array.from(set)[0];
    document.querySelectorAll('.authorname font:nth-child(3)').forEach((element)=>{
        if(element.innerText===opId){
            element.style.color = 'red';
            element.innerText = element.innerText + ' (楼主)';
        }
    })





})();