// ==UserScript==
// @name         微博 - 自动批量删除微博
// @namespace    http://tuite.fun
// @version      1.9
// @description  批量删除微博
// @author       tuite
// @match        https://weibo.com/*/profile*
// @match        https://weibo.com/p/*/home*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389664/%E5%BE%AE%E5%8D%9A%20-%20%E8%87%AA%E5%8A%A8%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E5%BE%AE%E5%8D%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/389664/%E5%BE%AE%E5%8D%9A%20-%20%E8%87%AA%E5%8A%A8%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E5%BE%AE%E5%8D%9A.meta.js
// ==/UserScript==
(function() {
    'use strict';

    /**
     * 【微博】自动批量删除微博
     * 1.搜索想要删除的微博(可不搜索)
     * 2.将页面滑到最底部加载完本页全部微博
     * 3.点击浏览器页面最右端的开始删除按钮
     * 4.弹出提示框，点击确认按钮(不可逆，可停止，需谨慎)
     * 
     * * 本脚本默认从本页面第一条微博开始删除，直到本页微博全部删除；
     * * 中途停止删除请按浏览器最右端的停止删除按钮；
     * * 已删除的微博不可恢复，请谨慎操作；
     * * 点击确认后一秒执行，请耐心等待
     *
     * coder Email: hao_jiu@outlook.com
     */
    
    // 定时器id
    var intervalIndex = document.createElement('input');
    intervalIndex.style.cssText = 'display:none';
    intervalIndex.id = 'hao_jiu.intervalIndex';
    document.body.appendChild(intervalIndex);
    
    // 开始按钮
    var startBtn = document.createElement('button');
    startBtn.style.cssText = 'position: fixed; right:0; top: 40%;';
    startBtn.innerHTML = '开始删除';
    startBtn.onclick = function () {
        if(confirm("【微博】自动批量删除微博\n说明：\n1.搜索想要删除的微博(可不搜索)\n2.将页面滑到最底部加载完本页全部微博\n3.点击浏览器页面最右端的开始删除按钮\n4.弹出提示框，点击确认按钮(不可逆，可停止，需谨慎)\n\n* 本脚本默认从本页面第一条微博开始删除，直到本页微博全部删除；\n* 中途停止删除请按浏览器最右端的停止删除按钮；\n* 已删除的微博不可恢复，请谨慎操作；\n* 点击确认后一秒执行，请耐心等待")) {
            initDel()
        }
    };
    document.body.appendChild(startBtn);
    
    // 停止按钮
    var endBtn = document.createElement('button');
    endBtn.style.cssText = 'position: fixed; right:0; top: 45%;';
    endBtn.innerHTML = '停止删除';
    endBtn.onclick = function () {window.clearInterval(document.getElementById('hao_jiu.intervalIndex').value);};
    document.body.appendChild(endBtn);
})();

// 初始化定时器
function initDel() {
    //1.35秒执行一次删除
    var intervalInt = self.setInterval(function(){
            if (document.querySelector('a[action-type="feed_list_delete"]')) {
                document.querySelector('a[action-type="feed_list_delete"]').click();
                document.querySelector('a[node-type="ok"]').click();
            } else {
                window.clearInterval(document.getElementById('hao_jiu.intervalIndex').value)
            }
         }, 1350);
    var intervalIntInput = document.getElementById('hao_jiu.intervalIndex');
    intervalIntInput.value = intervalInt;
}