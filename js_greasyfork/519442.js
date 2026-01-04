// ==UserScript==
// @name        PHS优化3.3
// @version          3.3
// @icon         http://yy.boloni.cn/cm/images/favicon.ico
// @namespace    http://tampermonkey.net/
// @description  按钮
// @author       HEBI VISION
// @match        *://phs.boloni.cn/phs/*
// @match        *://www.kujiale.com/pub/site/design-zone/boloni/*
// @exclude      *://phs.boloni.cn/phs/agentSpecialOrderPage.action
// @exclude      *://phs.boloni.cn/phs/productMaterialInfoGroupQueryPage.action
// @exclude      *://phs.boloni.cn/phs/saveAgentSpecialOrderPage.action
// @exclude     *://phs.boloni.cn/phs/productMaterialInfoGroupQueryPage.action?_id*
// @exclude      *://phs.boloni.cn/phs/designlandPointsShopPage.action
// @exclude      *://phs.boloni.cn/phs/editAgentSpecialOrderPage.action?pid*
// @exclude      *://phs.boloni.cn/phs/viewAgentSpecialOrderPage.action?pid*
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/519442/PHS%E4%BC%98%E5%8C%9633.user.js
// @updateURL https://update.greasyfork.org/scripts/519442/PHS%E4%BC%98%E5%8C%9633.meta.js
// ==/UserScript==



  //=========以下代码为平台自动登录开始
var user="";
var pwd="";

if(document.querySelector("#uname")){
document.querySelector("#uname").value="LAC002";
document.querySelector("#psd").value="AA123123";
}
//未登录,执行登录代码
window.setTimeout(function () {//延迟点击代码
document.querySelector(".login-btn").click();
},1000);//延迟代码3秒
//=========以下代码为平台自动填充单号



window.setTimeout(function () {
(function() {
    'use strict';
    const allSpans = document.querySelectorAll('span');
    allSpans.forEach((span) => {
        if (span.textContent === '状态') {
            span.remove();
        }
    });
})();
},500);//延迟代码3秒






window.setInterval(function () {
document.querySelector("div.index-content-half-wrap.pr5 > div > div.index-section-scroll-box.site-map-items-list > dl:nth-child(6) > dd > span:nth-child(4) > a").click();
},200);
//=========以上一个是自动进入我的订单页面


(function() {
    'use strict';

    // 使用document.querySelectorAll选择要删除的元素
    const elementsToRemove1 = document.querySelectorAll('body > div.query_div > div.query_condition_div > div:nth-child(1) > div:nth-child(1)');
    const elementsToRemove2 = document.querySelectorAll('body > div.query_div > div.query_condition_div > div:nth-child(1) > div:nth-child(2),body > div.query_div > div.query_condition_div > div:nth-child(2) > div:nth-child(4),div.query_div:nth-child(32) > div.query_condition_div:nth-child(2) > div.query_condition_line_div:nth-child(2) > div.con_right:last-child > input.inputText.searchText:first-child');
    const elementsToRemove3 = document.querySelectorAll('body > div.query_div > div.query_condition_div > div:nth-child(4)');
    const elementsToRemove4 = document.querySelectorAll('body > div.query_div > div.query_condition_div > div:nth-child(3)');
    const elementsToRemove5 = document.querySelectorAll('#AgentOrderQueryForm > tbody > tr:nth-child(n+2):nth-child(-n+26)');
    const elementsToRemove6 = document.querySelectorAll('#tabs');


    // 遍历并删除第一个选择的元素集合中的元素
    elementsToRemove1.forEach(function(element) {
        element.parentNode.removeChild(element);
    });

    // 遍历并删除第二个选择的元素集合中的元素
    elementsToRemove2.forEach(function(element) {
        element.parentNode.removeChild(element);
    });

    // 遍历并删除第二个选择的元素集合中的元素
    elementsToRemove3.forEach(function(element) {
        element.parentNode.removeChild(element);
    });

    // 遍历并删除第二个选择的元素集合中的元素
    elementsToRemove4.forEach(function(element) {
        element.parentNode.removeChild(element);
    });
    // 遍历并删除第二个选择的元素集合中的元素
    elementsToRemove5.forEach(function(element) {
        element.parentNode.removeChild(element);
    });
    // 遍历并删除第二个选择的元素集合中的元素
    elementsToRemove6.forEach(function(element) {
        element.parentNode.removeChild(element);
    });



})();



(function() {
    'use strict';

    // 获取所有class包含inputText和searchText的input元素
    const targetInputs = document.querySelectorAll('body > div.query_div > div.query_condition_div > div:nth-child(1) > div.con_right > input,body > div.query_div > div.query_condition_div > div:nth-child(2) > div:nth-child(2) > input');
    if (targetInputs.length > 0) {
        targetInputs.forEach(function(inputElement) {
            // 移除元素上已有的width样式属性（如果存在）
            inputElement.style.removeProperty('width');
            // 设置元素宽度样式为500px
            inputElement.style.width = '300px';
        });
    }
})();

(function() {
    'use strict';

    // 获取所有class包含inputText和searchText的input元素
    const targetInputs = document.querySelectorAll('body > div.query_div > div.query_condition_div > div:nth-child(2) > div:nth-child(3) > input.inputText.searchText');
    if (targetInputs.length > 0) {
        targetInputs.forEach(function(inputElement) {
            // 移除元素上已有的width样式属性（如果存在）
            inputElement.style.removeProperty('width');
            // 设置元素宽度样式为500px
            inputElement.style.width = '0px';
        });
    }
})();



window.setInterval(function () {
(function() {
    'use strict';
    const elements = document.querySelectorAll('#manualEntryTable, #productSalesOrderList_tableLayout, #productSalesOrderList_tableData, #productSalesOrderList_tableColumn,.orderItem_edit_div,.orderItem_right_list,.orderItem_right');
    elements.forEach((element) => {
        // 移除已有的高度相关样式属性
        element.style.removeProperty('height');
        element.style.cssText += 'height:1200px!important;';
        element.style.cssText += 'top: -1290px!important;';
    });
})();

},800);//延迟代码3秒

