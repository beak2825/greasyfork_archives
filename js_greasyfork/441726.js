// ==UserScript==
// @name         Fuck CSDN
// @namespace    Alex3236
// @version      2.1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @description  在搜索结果中屏蔽 CSDN。支持 Google / Baidu / Bing / 360 搜索
// @license      GNU-GPLv3
// @include      *://*.baidu.com/s?*
// @include      *://*.google.*/search*
// @include      *://*.bing.com/search*
// @include      *://*.so.com/s*
// @include      *://*.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441726/Fuck%20CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/441726/Fuck%20CSDN.meta.js
// ==/UserScript==

function isSite(domain) {
    return window.location.href.match(new RegExp("^https?:\/\/[\\w.]+?" + domain))
}

function HideCSDN(){
    const filters = ".source_1Vdff, .iUh30, .b_attribution, .g-linkinfo-a".split(", ")
    const Elements=document.querySelectorAll(".result.c-container, .g, .b_algo, .res-list");
    let num;
    Elements.forEach(function(Item,i){
        for (var filter in filters) {
            let selectedContent=Item.querySelector(filters[filter])
            if (selectedContent !== null) {
                if (selectedContent.innerText.toLowerCase().includes("csdn")) {
                    Item.parentNode.removeChild(Item);
                    num = i;
                    break;
                }
            }
        }
    });
    if (num !== undefined) {
        console.log(`[Fuck CSDN] 已去除 ${num} 条 CSDN 内容`)
    }
}

function bind() {
    document.querySelectorAll(".page-item_M4MDr, #form, #page, .ac_wrap").forEach(
        function(Item) {
            Item.addEventListener('mousedown',function () {
                setTimeout(function(){
                    HideCSDN();
                    if (isSite('so.com')) {
                        bind();
                    }
                },1000);
            })
        }
)}

// 绑定回车事件
document.querySelectorAll("input.gLFyf.gsfi, input#kw, input#keyword").forEach(
function(Item) {
    Item.addEventListener('keydown', function () {
    var evt = window.event || arguments.callee.caller.arguments[0];
    if (evt.keyCode == "13") {
        setTimeout(function(){HideCSDN();},1000);
    }
})})

if (isSite('csdn.net')) {
    document.body.innerHTML = "Blocked by Fuck CSDN.";
    window.history.go(-1);
}

HideCSDN();
bind();
