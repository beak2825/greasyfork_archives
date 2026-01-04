// ==UserScript==
// @name         auto-auth-update
// @name:zh      e车联 - 抓取汽车厂商系统登录信息
// @name:zh-CN   e车联 - 抓取汽车厂商系统登录信息
// @namespace    ygxpt.com
// @version      1.1.2
// @description  用于抓取厂商登录信息
// @author       echelian
// @icon         http://autoserve.ygxpt.com/favicon.ico
// @match        *://dms.svw-volkswagen.com/*
// @match        *://dms.saicskoda.com.cn/*
// @match        *://ams.saic-audi.cn/*
// @match        *://ndmsd.saicmotor.com/*
// @match        *://dms.exeedcars.com/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_getResourceText
// @require      https://unpkg.com/axios@1.7.7/dist/axios.min.js
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://www.layuicdn.com/layui-v2.8.0/layui.js
// @resource     layuiCss https://www.layuicdn.com/layui-v2.8.0/css/layui.css
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/516151/auto-auth-update.user.js
// @updateURL https://update.greasyfork.org/scripts/516151/auto-auth-update.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var layer = layui.layer;
    //通过别名获取layui.css
    let layuiCss = GM_getResourceText('layuiCss')
    //添加到页面
    GM_addStyle(layuiCss)

    // 用于显示桌面通知
    // GM_notification({
    //     text: 'This is a notification',
    //     title: 'Notification Title',
    //     timeout: 4000
    // });

    // 用于在油猴菜单中添加自定义命令
    // GM_registerMenuCommand('Show Alert', function() {
    //     alert('Hello, world!');
    // });

    /*
    // 获取 localStorage 数据
    const localStorageData = JSON.stringify(window.localStorage);

    // 获取 sessionStorage 数据
    const sessionStorageData = JSON.stringify(window.sessionStorage);

    // 获取 cookie 数据
    const cookieData = document.cookie;

    // 将数据打包成 JSON 格式
    const data = {
        localStorage: localStorageData,
        sessionStorage: sessionStorageData,
        cookies: cookieData
    };
    */

    /*
    function uploadData() {
        // 上传数据到服务器
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://192.168.2.193:8181/pub/v1/shopInfo/getCompanyByCommunityId',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({a: 1}),
            onload: function(response) {
                console.log(response)
                console.log('数据上传成功:', response.responseText);
            },
            onerror: function(error) {
                console.error('数据上传失败:', error);
            }
        });
    }
    uploadData()
    */


    // 主动更新维保订单

    // 定义按钮样式
    const styles = `
        .uploadOrderButton{
            position: fixed;
            top: 20px;
            left: calc(100vw - 140px);
            z-index: 1000;
            padding: 10px 0;
            width: 120px;
            background-color: #fff;
            color: #000;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
        }
        .uploadOrderButton:active{
            cursor: move;
            opacity: 0.8;
        }
    `;
    GM_addStyle(styles)

    // 创建按钮元素
    const button = document.createElement('button');
    button.id = 'uploadOrderButton';
    button.className = 'uploadOrderButton';
    button.innerText = '更新登录信息';

    // 添加拖拽功能
    let isDragging = false;
    let offsetX, offsetY;
    const buttonRect = button.getBoundingClientRect();
    const buttonWidth = buttonRect.width;
    const buttonHeight = buttonRect.height;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 变量来存储按下和松开的时间戳
    let mouseDownTime = 0;
    let mouseUpTime = 0;
    button.addEventListener('mousedown', function(e) {
        mouseDownTime = e.timeStamp;
        isDragging = true;
        offsetX = e.clientX - button.offsetLeft;
        offsetY = e.clientY - button.offsetTop;
    });
    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;

            // 边界检查
            if (newLeft < 0) newLeft = 0;
            if (newLeft > viewportWidth - buttonWidth) newLeft = viewportWidth - buttonWidth;
            if (newTop < 0) newTop = 0;
            if (newTop > viewportHeight - buttonHeight) newTop = viewportHeight - buttonHeight;

            button.style.left = newLeft + 'px';
            button.style.top = newTop + 'px';
        }
    });
    document.addEventListener('mouseup', function(e) {
        mouseUpTime = e.timeStamp;
        isDragging = false;
    });

    // 为按钮绑定点击事件
    button.addEventListener('click', () => {
        let duration = mouseUpTime - mouseDownTime;
        if (duration < 150) {
            getAuth('click')
        }
    });

    // 将按钮插入到页面中
    document.body.appendChild(button);


    // 轮询更新登录信息
    // console.log(window)
    // console.log(window.location.host)
    let param = {}
    let host = window.location.host
    function getAuth(type='timer') {
        let isAvailable = false
        param = {}
        switch (host) {
            case 'dms.svw-volkswagen.com':
                // 大众
                param.type = 'aas_conf_sqdz'
                param.token = sessionStorage.getItem('token')
                param.userId = sessionStorage.getItem('userId')
                param.cookie = document.cookie
                if (param.token && param.userId && param.cookie) isAvailable = true
                break;
            case 'dms.saicskoda.com.cn':
                // 斯柯达
                param.type = 'aas_conf_sqskd'
                param.token = sessionStorage.getItem('token')
                param.userId = sessionStorage.getItem('userId')
                param.cookie = document.cookie
                if (param.token && param.userId && param.cookie) isAvailable = true
                break;
            case 'ams.saic-audi.cn':
                // 奥迪
                param.type = 'aas_conf_sqad'
                param.token = sessionStorage.getItem('token')
                param.userId = sessionStorage.getItem('userId')
                param.cookie = document.cookie
                if (param.token && param.userId && param.cookie) isAvailable = true
                break;
            case 'ndmsd.saicmotor.com':
                // 上汽乘用车
                param.type = 'aas_conf_sqrw'
                param.token = localStorage.getItem('auth')
                if (param.token) isAvailable = true
                break;
            case 'dms.exeedcars.com':
                // 星途
                param.type = 'aas_conf_xt'
                param.cookie = document.cookie
                if (param.cookie) isAvailable = true
                break;
            default:
                break;
        }

        if (!isAvailable) {
            return false;
        }

        // 使用 axios 上传数据到服务器
        axios.post('https://echelianapi.ygxpt.com/pub/v1/ass/settlementConfig/updateConfig', param)
            .then(response => {
                console.log('数据上传成功:', response.data);
                // alert('数据上传成功');
                if (type == 'click') {
                    layer.msg('更新成功', {time: 1000});
                }
            })
            .catch(error => {
                console.error('数据上传失败:', error);
                // alert('数据上传失败');
            });
    }

    let num = 1000*60*1
    let timer = setInterval(()=>{
        getAuth()
    },num)

})();