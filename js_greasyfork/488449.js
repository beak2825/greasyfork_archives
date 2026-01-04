// ==UserScript==
// @license MIT
// @name        baraag_Auto_click_filter
// @namespace    http://tampermonkey.net/
// @version      20240727
// @description  自动点开敏感内容, 带黑名单的强大功能
// @author       You
// @match        https://*.baraag.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baraag.net
// @grant    GM_setValue
// @grant    GM_getValue
// @grant    GM_registerMenuCommand
// @grant    GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/488449/baraag_Auto_click_filter.user.js
// @updateURL https://update.greasyfork.org/scripts/488449/baraag_Auto_click_filter.meta.js
// ==/UserScript==
function $Q(selector) {
  let ele = document.querySelector(selector);
  if (ele == null) {
    return { style: {}, remove() {} };
  } else {
    return ele;
  }
}

function $QALL(query) {
  return document.querySelectorAll(query);
}


const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

 // 定义一个函数来执行点击事件
function simulateClick() {
    // 选择所有类名为spoiler-button__overlay的元素
    let spoilerButtons = Array.from($QALL('.spoiler-button__overlay'));

    // 循环遍历每个元素并触发点击事件
    spoilerButtons.forEach(async function(button) {
        if (!button.classList.contains("over"))
        {
             button.click(); // 触发点击事件
            button.classList.add("over");
            await sleep(500);
        }
    });
    // 获取初始元素
    let elements = Array.from($QALL(".display-name__account"));

    let filters = GM_getValue(filters_name) ?? [];
    console.log(filters);
    elements.forEach( function(element){
        // 判断是否在黑名单中
        if (filters.indexOf(element.innerText) > -1 )
        {
            // 向上遍历直到找到 <article> 元素
            while (element !== null && element.tagName !== "ARTICLE") {
                element = element.parentNode;
            }

            // 如果找到了 <article> 元素，则删除它
            if (element !== null && element.tagName === "ARTICLE") {
                //element.remove();
                element.style.visibility = "hidden";
            }
        } // if (ele......)
    }); // foreach
}
let add_name = "添加黑名单";
let remove_name = "移除黑名单";
let check_name = "检查";
let filters_name = "filters";

let id_add=GM_registerMenuCommand (add_name ,AddFilter);
let id_remove=GM_registerMenuCommand (remove_name,RemoveFilter);
let id_check=GM_registerMenuCommand (check_name,CheckFilter);

function AddFilter(){
   let filter = prompt("请输入黑名单, 如@TheDispenser69");
   let arr = GM_getValue(filters_name);
    if (Array.isArray(arr)) {
        // 如果是数组，在末尾插入元素filter
        arr.push(filter);
    } else {
        // 如果不是数组，将其变为空数组，再插入元素1
        arr = [];
        arr.push(filter);
    }
   GM_setValue(filters_name,arr)
}

function RemoveFilter(){
   let filter = prompt("请输出要移除的黑名单, 如@TheDispenser69");
   let arr = GM_getValue(filters_name);
    if (Array.isArray(arr)) {
        // 如果是数组，删除元素
       arr = arr.filter(item => item !== filter);
    } else {
        // 如果不是数组，将其变为空数组
       arr = [];
    }
   GM_setValue(filters_name,arr)
}

function CheckFilter(){
   let arr = GM_getValue(filters_name);
    if (!Array.isArray(arr)) {
        // 如果不是数组，将其变为空数组
       arr = [];
    }
    alert(arr);
   GM_setValue(filters_name,arr)
}

(function() {
    'use strict';
    // Your code here...
    setInterval(function () {
        simulateClick()
    }, 700);
})();