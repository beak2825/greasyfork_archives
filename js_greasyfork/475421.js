// ==UserScript==
// @name         深圳烟草弹窗通知【23.9.25取消提示】
// @namespace    none
// @version      23.9.25
// @description  none
// @author       You
// @match        *://*/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475421/%E6%B7%B1%E5%9C%B3%E7%83%9F%E8%8D%89%E5%BC%B9%E7%AA%97%E9%80%9A%E7%9F%A5%E3%80%9023925%E5%8F%96%E6%B6%88%E6%8F%90%E7%A4%BA%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/475421/%E6%B7%B1%E5%9C%B3%E7%83%9F%E8%8D%89%E5%BC%B9%E7%AA%97%E9%80%9A%E7%9F%A5%E3%80%9023925%E5%8F%96%E6%B6%88%E6%8F%90%E7%A4%BA%E3%80%91.meta.js
// ==/UserScript==

//深圳烟草订购页面弹窗通知
if (window.location.href === 'https://dh.sztobacco.cn/wdk?action=ecw.page&method=display&site_id=longgang&inclient=&page_id=page_buy') {
    
    var lastRunDate = localStorage.getItem('lastRunDate');// 获取上次运行的日期记录    
    var currentDate = new Date().toLocaleDateString();// 获取当前日期
    
    if (lastRunDate !== currentDate) {// 如果是新的一天，显示提示信息★★★★★
        
        var message = "温馨提示:<br> 提示! ";        
        if (message.trim().length > 20) {// 检查提示信息是内容长度是否大于20   
            alert(message);// 信息内容大于20则显示提示框
        }
        
        localStorage.setItem('lastRunDate', currentDate);// 更新上次运行的日期记录为当前日期，以便标记已运行过★★★★★
    }//★★★★★
}