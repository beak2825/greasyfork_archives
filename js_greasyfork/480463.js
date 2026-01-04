
// ==UserScript==
// @name         福利吧自动签到
// @namespace    https://greasyfork.org/zh-CN/users/1031656-zyxlcr-xuan
// @version      1.0
// @description  每天自动进行签到操作并设置自定义Cookie
// @author       arick
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_notification
// @license AGPL License
// @downloadURL https://update.greasyfork.org/scripts/480463/%E7%A6%8F%E5%88%A9%E5%90%A7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/480463/%E7%A6%8F%E5%88%A9%E5%90%A7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var url = "https://www.wnflb2023.com/plugin.php?id=fx_checkin%3Aajax&date=202311&inajax=1&_r=0.5998540754441422"

    // 获取当前日期
    var currentDate = new Date();
    // 使用 toDateString() 方法将日期转换为字符串，只保留日期部分
    var formattedDate = currentDate.toDateString();
    var storeDate = GM_getValue('storedDate', '123');

    // 发送签到请求
    function signIn() {
        GM_xmlhttpRequest({
            method: 'GET', // 修改为你的请求方式
            url: url, // 修改为你的签到地址
            onload: async function (response) {
                console.log('签到成功！');
                console.log(response.responseText); // 如果需要可以输出返回的数据
                if (response.responseText != 'Access Denied') {

                    // 将格式化后的日期存储到油猴子脚本变量中
                    GM_setValue('storedDate', formattedDate);
                    console.log('store！');
                } else {
                    console.log('no store！');
                    await showNotification('签到失败');
                }
            },
            onerror: async function (error) {
                console.error('签到失败：', error);
                // 调用函数显示通知
                await showNotification('签到失败');
            }
        });
    }

    // 显示通知
    async function showNotification(msg) {
        GM_notification({
            text: '通知：' + msg, // 要显示的消息内容
            title: msg, // 通知标题
            timeout: 5000, // 通知显示时间，单位为毫秒（这里设置为5秒）
            onclick: function () {
                // 点击通知时的操作
                console.log('用户点击了通知！');
            }
        });
    }



    // 在页面加载完成后执行签到操作
    window.addEventListener('load', async function () {


        if (formattedDate != storeDate) {
            signIn(); // 执行签到操作
        } else {
            console.log('已经签到');
            // 调用函数显示通知
            //await showNotification('已经签到');
        }




    });
})();
