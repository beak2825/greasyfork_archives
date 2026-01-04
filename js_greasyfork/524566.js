// ==UserScript==
// @name         绿化ugg论坛
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  ugg绿化
// @match        *://www.uu-gg.one./*
// @match        *://www.uu-gg.one/*
// @match        *://uu-gg.myfw.us/*
// @match        *://uu-gg.myfw.us./*
// @match        *://uu-gg.rr.nu./*
// @match        *://uu-gg.rr.nu/*
// @match        *://uu-gg.us.kg./*
// @match        *://uu-gg.us.kg/*
// @match        *://uu-gg.ggff.net./*
// @match        *://uu-gg.ggff.net/*
// @grant        GM_addStyle
// @license     GPL License
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/524566/%E7%BB%BF%E5%8C%96ugg%E8%AE%BA%E5%9D%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/524566/%E7%BB%BF%E5%8C%96ugg%E8%AE%BA%E5%9D%9B.meta.js
// ==/UserScript==

function main_page() {
    GM_addStyle('#top-content{display:none !important}'); // 封号提示
    GM_addStyle('.a_ugg_mu{display:none !important}'); // 广告
    GM_addStyle('#laba{ display: none !important; }');// 小喇叭广播站
    GM_addStyle('div.bm_c.cl.pbn{display:none !important}'); // 版规
    GM_addStyle('#wolfcodepostwarn_div{display:none !important}'); // 回帖上方广告
    GM_addStyle('#toptb div.wp div.z { display: none !important; }');//顶部广告
    GM_addStyle('#scrolling-table{display:none !important}');//回帖上方封号名单
    GM_addStyle('div.sign{display: none !important}');//封号提醒
    GM_addStyle('div.bm.bmw div.bm_c.cl{ display: none !important; }');//推荐主题
    GM_addStyle('#scbar_hot{ display: none !important; }');//热搜
    GM_addStyle('#modal{ display: none !important; }');//30秒弹窗
};

//
function no_textarea() {
    var textarea = document.querySelector('textarea#fastpostmessage.pt');
    if (textarea) {
        textarea.placeholder = '';
    }
};

//30秒弹窗
function no_modalElement() {
    var modalElement = document.querySelector('#modal');
    if (modalElement) {
        modalElement.style.display = "none";
    }
};
//小喇叭广播站残余
function no_flBmElement() {
    var flBmElement = document.querySelector('#hd #wp #ct .fl.bm');
    if (flBmElement) {
        flBmElement.style.display = "none";
    }
};

//推荐主题
function no_bm_hElement() {
    var bm_hElements = document.querySelectorAll('#hd #wp .boardnav #ct .mn .bm.bmw');
    if (bm_hElements.length > 1) {
        bm_hElements[1].style.display = "none"; // 隐藏第二个.bm.bmw元素
    }
};

//版规残余
function no_pbnElement() {
    var pbnElement = document.querySelector('#hd #wp .boardnav #ct .mn .bm.bml.pbn');
    if (pbnElement) {
        pbnElement.style.display = "none";
    }
};


function Observer_NextPage() {
    'use strict';

    let observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 新内容加载时，重新执行隐藏元素的功能
                main_page();
            }
        }
    });

    // 观察整个文档的变化
    observer.observe(document.body, { childList: true, subtree: true });
};

(function() {
    'use strict';
    document.documentElement.style.visibility = 'hidden';
    function replaceOrBlockElements() {
        main_page();
        no_textarea();
        no_modalElement();
        no_flBmElement();
        no_bm_hElement();
        no_pbnElement();
        Observer_NextPage();
        document.documentElement.style.visibility = 'visible';
    }
    document.addEventListener('DOMContentLoaded', replaceOrBlockElements);
})();
