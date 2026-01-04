// ==UserScript==
// @name         斗鱼屏蔽ID消息（blockspeech）
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  根据ID屏蔽直播间的发言（持久化存储、傻瓜式使用/管理）
// @author       Ginyang
// @match        *://www.douyu.com/*
// @icon         https://www.douyu.com/favicon.ico
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472846/%E6%96%97%E9%B1%BC%E5%B1%8F%E8%94%BDID%E6%B6%88%E6%81%AF%EF%BC%88blockspeech%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/472846/%E6%96%97%E9%B1%BC%E5%B1%8F%E8%94%BDID%E6%B6%88%E6%81%AF%EF%BC%88blockspeech%EF%BC%89.meta.js
// ==/UserScript==

/************************* v1.0.1 更新内容*************************
 *
1、【新增/优化】新增消息提示，现在不用进入控制台查看信息了，直接会在页面上方给出提示消息
2、【修复】进入直播间可能会因为页面未加载完全导致插件加载失败（现在添加了window.onload判断）
3、【修复】Firefox中input输入框的宽度超出设置页面
4、【优化】Firefox中的滚动条样式不起作用（这是火狐的内核导致的，提供的样式美化太少了，我又懒得自己覆盖）
5、【优化】代码结构优化

*************************************************************** */

(function () {
    'use strict';
    window.onload = function () {
        console.log("bs load success");
        // 全局变量
        var bs_observer = null;
        // 定义消息为全局对象
        var message = null;

        function bsStyleInit() {
            let bs_style_css = `
        /***************************遮罩层overlay、对话框dialog***************************/
        #bs_overlay {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9999;
        }
        @keyframes show {
            0% {
                transform: rotateX(30deg);
            }
            58% {
                opacity: 1;
                transform: rotateX(-12deg);
            }
            100% {
                opacity: 1;
            }
        }
        #bs_dialog {
            display: block;
            position: fixed;
            top: 50%;
            left: 50%;
            margin-top: -160px;
            margin-left: -160px;
            width: 320px;
            height: 330px;
            background-color: #fff;
            color: #333;
            font-size: 16px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            padding: 20px;
            transition: all 0.3s ease-in-out;
            /* transform-style: preserve-3d; */
            transform-origin: center center;
            animation: show 0.3s ease-in-out;
        }
        #bs_dialog h2{
            font-size: 24px;
            display: block;
            margin-bottom: 12px;
            font-weight: bold;
        }
        /***************************关闭close***************************/
        #bs_btn_close {
            position: absolute;
            top: 20px;
            right: 20px;
            margin: 3px;
            width: 24px;
            height: 24px;
            background: white;
            cursor: pointer;
            box-sizing: border-box;
            transition: all 0.3s ease-in-out;
        }
        #bs_btn_close:hover::before,
        #bs_btn_close:hover::after {
            background: red;
        }
        #bs_btn_close:before {
            position: absolute;
            content: '';
            width: 1px;
            height: 25px;
            background: #999;
            transform: rotate(45deg);
            top: -3px;
            left: 11px;
        }
        #bs_btn_close:after {
            content: '';
            position: absolute;
            width: 1px;
            height: 25px;
            background: #999;
            transform: rotate(-45deg);
            top: -3px;
            left: 11px;
        }
        /*************** 表格样式 *************/
        #bs_table {
            display: block;
            width: 300px;
            height: 220px;
            margin: auto;
            border-collapse: collapse;
            overflow-y: scroll;
            scrollbar-width: thin;
        }
        #bs_table td {
            border-bottom: 1px solid #ddd;
            font-size: 16px;
            padding: 5px 10px;
        }
        #bs_table td:first-child {
            width: 250px;
            text-align: left;
            max-width: 250px;
            word-break: break-all;
        }
        #bs_table td:last-child {
            width: 50px;
            text-align: right;
        }
        #bs_table tr:last-child td {
            border-bottom: none;
        }
        /* ****************插入行table ******************/
        #row_insert {
            margin: auto;
            margin-bottom: 10px;
        }
        /*****************滚动条******************/
        #bs_dialog ::-webkit-scrollbar {
            width: 5px;
            height: 10px;
        }
        #bs_dialog ::-webkit-scrollbar-track {
            width: 6px;
            background: rgba(#101F1C, 0.1);
            -webkit-border-radius: 2em;
            -moz-border-radius: 2em;
            border-radius: 2em;
        }
        #bs_dialog ::-webkit-scrollbar-thumb {
            background-color: rgba(144, 147, 153, .3);
            background-clip: padding-box;
            min-height: 28px;
            -webkit-border-radius: 2em;
            -moz-border-radius: 2em;
            border-radius: 2em;
            transition: background-color .3s;
            cursor: pointer;
        }
        #bs_dialog ::-webkit-scrollbar-thumb:hover {
            background-color: rgba(144, 147, 153, .5);
        }
        /**************底部按钮*****************/
        #bs_tool_row {
            width: 300px;
            display:flex;
            justify-content: center;
            align-items: center;
            margin: auto;
            margin-top: 10px;
        }
        #bs_tool_row button {
            width: 50px;
            padding: auto;
            margin: 0 5px;
        }
        #bs_overlay button:focus {
            outline: none;
        }
        #bs_overlay button {
            border: none;
            background-color: rgba(23, 171, 227, .8);
            color: #eee;
            border-radius: 5px;
            cursor: pointer;
            line-height: 28px;
            height: 28px;
            padding: 0 5px;
        }
        #bs_overlay button:hover {
            background-color: rgba(23, 171, 227, 1);
        }
        /******************输入框input*******************/
        #bs_input {
            width: 200px;
            border-radius: 5px;
            border: 1px solid;
            padding-left: 5px;
        }
        #bs_input:focus {
            box-shadow: 0 0 6px #2993e9;
        }
        /**********************************message_css********************************/
        #message-container {
            position: fixed;
            left: 0;
            top: 0;
            right: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index: 10000;
            pointer-events: none; /* 允许鼠标事件穿透 */
        }
        #message-container .message {
            background: #fff;
            margin: 10px 0;
            padding: 0 10px;
            height: 40px;
            box-shadow: 0 0 10px 0 #eee;
            font-size: 14px;
            border-radius: 3px;
            display: flex;
            align-items: center;
            transition: height 0.2s ease-in-out, margin 0.2s ease-in-out
        }
        #message-container .message .text {
            color: #333;
            padding: 0 20px 0 5px
        }
        #message-container .message .close {
            cursor: pointer;
            color: #999
        }
        #message-container .message .icon-info {
            color: #0482f8
        }
        #message-container .message .icon-error {
            color: #f83504
        }
        #message-container .message .icon-success {
            color: #06a35a
        }
        #message-container .message .icon-warning {
            color: #ceca07
        }
        #message-container .message .icon-loading {
            color: #0482f8
        }
        @keyframes message-move-in {
            0% {
                opacity: 0;
                transform: translateY(-100%)
            }
        
            100% {
                opacity: 1;
                transform: translateY(0)
            }
        }
        #message-container .message.move-in {
            animation: message-move-in 0.3s ease-in-out
        }
        @keyframes message-move-out {
            0% {
                opacity: 1;
                transform: translateY(0)
            }
        
            100% {
                opacity: 0;
                transform: translateY(-100%)
            }
        }
        #message-container .message.move-out {
            animation: message-move-out 0.3s ease-in-out;
            animation-fill-mode: forwards
        }
        /************************外部样式***************************/
        @font-face {font-family: "icon";
            src: url('//at.alicdn.com/t/font_1117508_wxidm5ry7od.eot?t=1554098097778'); /* IE9 */
            src: url('//at.alicdn.com/t/font_1117508_wxidm5ry7od.eot?t=1554098097778#iefix') format('embedded-opentype'), /* IE6-IE8 */
            url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAASwAAsAAAAACXAAAARhAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDXgqFdIUpATYCJAMcCxAABCAFhD0HXBtNCFGUL0qC7GuMwfUModQ5d89yCS2IguQlYTzox9H5PfHlpWFpEC0ubQKL/QJcYxBBtFZWz/RCiEgotIBChV2EASSXCBX5xofBiPtz7s0nnCJ450fACtP2peU0NJSTZudnZywngIyp2Q4m293vbjhIKItjihNIZS3s4mx2bTEk1jI8gciSLJCwesNvAaBfaMOve98XmEY5wnfz3a39QU5QZFVbdF5i+gcD/3G/4l/jK/C2ASA6KCowynZ8xxew8qJK+MQORO8xnOLqb1h0n09guNkGZLZsHVyQsoTLAnHcdykpB7QygxR6RZuwN8VNUNCXS/jGDev347+CKZoKj7Pj4KZDVn79eUjAP1zXN0C85syQD6JiJSKJ84nWk3JOYKWc4Z+/mbcHMVqvaH/98v5qf3X63Pk8/P8Eq3EwjKZ4qhS9/c/TEi0uHQnEAUm7kDyNSeXXO5Pkt51J8NuJSeH/DpOG/4cyi4p1i0djFD4DsZ8RG81VIUlYY9YzIfBOsZLGd25VXu8jbXf6O5mXeVhHN3GEsYVtgIyXm9AHradeL9uATxQOXxaLRydnjMJbK6L0zDFsY6Jt8bFHRO6RB/FTztgwMNYuFWkR8SNHnjiJz5JGGDLNn6gcgzdXhWUVo8vr46LysuGJDUxSWT6CbcHi0jX9JpvoOrSRi+KG10H6vQ0GY25JMkc36XmPmdEouyf9E33O07RhdBOWZPYHx3yQMC19ZCzZWkLAR35/5xmxDLYu9AqejrN5PTy2lgc0d06bS6k1uX9wWvJPVHBJZp7qnXWdMCJ3gR5WVL//cZmeBgxOanWDbCXDjsu4WzpKRUciLwh3CYkhh/Y3byXAmC7LvYr4Hs70do3p3dBqyD5xPqoJ9l+te2FzLY0T/svpCG1o9hqPZHJ33jEGNEMzFch0HfRQKdIox2/yaAiNEun5XePlysEZfBnivwZ9vTqLA8PGZXIbZLU687F4Dc46J/785DmxDLYu9IYAhKBE8yY+gOzpaGSIjSCNxyPLQad7CAZzBLGO9++/I0k9Awh1e/aHQUxK4TEZBN9kz/LCloUvZiR4c3V9wKqrB3uFwrz7bFSSASAVAeq6fPO1voHgXIHOGjnOkNpw6uHuco731Zx8UuFUQprkQdGZBlWaiySxEBojLIVW2gDDrTB98AgTWHIih2E5wyD0XkAx2iuoeq+RJIagMdkntHrvYbh9/o85wuJo9C6RanTAegbf5glTNbpqx5+hayIqFY7mvUKpfPDA6NCIP7yNCcoqG9SDO6Y1AyZ5DFulL4ZRxCGVPEBbD3lap3PDwyzpjYZsHpOqzSREacgBLM+Az8YlmOHUqpHVZ5DLiFAyQWCZryCIlcKBTDBqyEgGsi1NMut2Fas8cI0JJI0tYiQuBrY6N6OIAhxIk2cFkE0b4lXwpeYM80asqHSoW3m8P4dgODxBFyVqZDTRRhe9PDL/tykpY9uoVCni1PETt2BHXGHpkcokEI9SckkIAAAA') format('woff2'),
            url('//at.alicdn.com/t/font_1117508_wxidm5ry7od.woff?t=1554098097778') format('woff'),
            url('//at.alicdn.com/t/font_1117508_wxidm5ry7od.ttf?t=1554098097778') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
            url('//at.alicdn.com/t/font_1117508_wxidm5ry7od.svg?t=1554098097778#icon') format('svg'); /* iOS 4.1- */
        }
        .icon {
          font-family: "icon" !important;
          font-size: 16px;
          font-style: normal;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .icon-info:before {
          content: "\\e72a";
        }
        .icon-success:before {
          content: "\\e730";
        }
        .icon-loading:before {
          content: "\\e6a6";
        }
        .icon-close:before {
          content: "\\e6e9";
        }
        .icon-warning:before {
          content: "\\ebad";
        }
        .icon-error:before {
          content: "\\ebb2";
        }
        `;
            let bs_style_sheet = document.createElement('style');
            bs_style_sheet.innerHTML = bs_style_css;
            document.body.appendChild(bs_style_sheet);
        };



        /*****************************配置对话框函数*************************/

        var isButtonClicked = false;
        function openConfigDialog() {
            if (isButtonClicked) {
                return; // 如果按钮已被点击，则忽略后续点击事件
            }
            isButtonClicked = true;

            // 创建一个遮罩层及其内部的对话框
            const bs_overlay_html = `
        <div id="bs_dialog">
            <h2 style="margin-top: -4px;">BlockSpeech
                <a title="前往插件详情页面查看更多插件信息"style="font-size: 8px; color: #17abe3; text-decoration: underline;"target="_blank"href="https://greasyfork.org/zh-CN/scripts/472846">插件信息</a>
            </h2>
            <table id="row_insert">
                <tr>
                    <td>ID：</td>
                    <td><input id="bs_input" type="text" placeholder="请输入需要屏蔽的ID"></td>
                    <td><button id="bs_btn_insert">添加</button></td>
                </tr>
            </table>
            <table id="bs_table"></table>
            <div id="bs_tool_row"><button id="bs_btn_save">保存</button><button id="bs_btn_clear">清空</button></div>
            <div id="bs_btn_close"></div>
        </div>
        `;
            let bs_overlay = document.createElement('div');
            bs_overlay.id = 'bs_overlay';
            bs_overlay.innerHTML = bs_overlay_html;
            document.body.appendChild(bs_overlay);

            /****************************************各个function*****************************************/

            // 获取全局变量bs_table
            let bs_table = document.getElementById('bs_table');

            // 清空表格
            function bs_tableClear() {
                bs_table.innerHTML = '';
            }

            // 保存表格到GM_value
            function bs_tableSave() {
                let bs_list = [];
                document.querySelectorAll('.bs_user_id').forEach(function (item) {
                    bs_list.unshift(item.textContent);
                })
                GM_setValue("bs_list", bs_list);
                console.log("【blockspeech】list:" + bs_list);
                console.log("【blockspeech】save ok");
                stopObserver();
                startObserver(bs_list);
            }

            // 删除行
            function bs_deleteRow(btn_del) {
                // 获取按钮的父元素<tr>
                let row_del = btn_del.parentNode.parentNode;
                // 从表格中删除该行
                row_del.parentNode.removeChild(row_del);
            }


            // 插入行
            function bs_insertRow(userid) {
                let new_row = bs_table.insertRow(0);
                let cell1 = new_row.insertCell(0);
                cell1.className = 'bs_user_id';
                cell1.innerHTML = userid;
                let cell2 = new_row.insertCell(1);
                let bs_btn_del = document.createElement("button");
                bs_btn_del.innerText = "删除";
                // 添加点击事件
                bs_btn_del.addEventListener("click", function () {
                    bs_deleteRow(this);
                });
                cell2.appendChild(bs_btn_del);
            }

            // 判断input内容
            function judgeIfok(new_id) {
                if (new_id == '') {
                    console.log("【blockspeech】user id can not be null");
                    message.show({
                        type: 'warning',
                        text: 'ID内容不能为空',
                    });
                    return false;
                }
                let user_id_objlist = document.querySelectorAll('.bs_user_id');
                let user_id_list = [];
                user_id_objlist.forEach(function (obj) {
                    user_id_list.push(obj.innerHTML);
                })
                if (user_id_list.includes(new_id)) {
                    console.log("【blockspeech】user id had been added");
                    message.show({
                        type: 'info',
                        text: '此ID已被添加，请勿重复添加',
                    });
                    return false;
                }
                return true;
            }

            bs_Init();

            // 初始化表格
            function bs_Init() {
                bs_tableClear();
                let bs_list = GM_getValue("bs_list");
                if (bs_list) {
                    bs_list.forEach(function (item) {
                        bs_insertRow(item);
                    });
                }
            }


            /****************************************添加点击事件*****************************************/

            // 给插入按钮添加点击事件
            document.getElementById('bs_btn_insert').addEventListener("click", function () {
                let bs_input = document.getElementById('bs_input');
                if (judgeIfok(bs_input.value.trim())) {
                    bs_insertRow(bs_input.value.trim());
                    message.show({
                        type: 'success',
                        text: '添加"' + bs_input.value.trim() + '"成功',
                    });
                }
                bs_input.value = '';
            });

            // 给保存按钮添加点击事件
            document.getElementById('bs_btn_save').addEventListener("click", () => {
                bs_tableSave();
                message.show({
                    type: 'success',
                    text: '保存成功',
                });
            });

            // 给清空按钮添加点击事件
            document.getElementById('bs_btn_clear').addEventListener("click", () => {
                bs_tableClear();
                message.show({
                    type: 'success',
                    text: '清空列表成功',
                });
            });

            // 给关闭按钮添加点击事件
            let bs_btn_close = document.getElementById('bs_btn_close');
            bs_btn_close.addEventListener('click', function () {
                bs_overlay.remove();
                isButtonClicked = false;
            });
        }

        function bs_startMonitor() {
            // 直播间内执行
            if (document.querySelector('.layout-Player-aside')) {// 如果页面有侧边栏则该页面为直播间
                console.log("【blockspeech】Is live room.");

                let bs_list = GM_getValue('bs_list');
                if (bs_list) {
                    setTimeout(() => startObserver(bs_list), 8000);
                }
            }
        }

        function startObserver(bs_list = GM_getValue('bs_list')) {
            let chat_list = document.querySelector("#js-barrage-list");
            if (chat_list) {
                // 创建 MutationObserver 对象
                bs_observer = new MutationObserver(function (mutations) {
                    // 遍历每个变化
                    mutations.forEach(function (mutation) {
                        // 遍历每个被添加的元素
                        mutation.addedNodes.forEach(function (node) {
                            // 判断节点元素
                            if (node.nodeType === 1 && node.nodeName === 'LI' && node.classList.contains('Barrage-listItem')) {
                                // 获取用户昵称对象
                                let userchat = node.querySelector(".Barrage-nickName");
                                // 获取第用户昵称 文本内容
                                let userid = userchat.title;
                                if (bs_list.includes(userid)) {
                                    node.remove();
                                    console.log("【blockspeech】remove chat from " + userid + " ok");
                                }
                            }
                        });
                    });
                });
                // 配置 MutationObserver 对象
                let config = { childList: true, subtree: true };
                // 在聊天信息列表上开始监视变化
                bs_observer.observe(chat_list, config);
                console.log("【blockspeech】strat observer success...");
                message.show({
                    type: 'success',
                    text: '屏蔽ID消息开启成功',
                });
            } else {
                console.log("【blockspeech】因网络原因屏蔽失败，请刷新页面或者点击设置页面的保存按钮重新加载屏蔽");
            }
        } // startObserver -- funciton

        function stopObserver() {
            if (bs_observer) {
                bs_observer.disconnect();
                bs_observer = null;
                console.log('【blockspeech】Stop observer ok');
            } else {
                console.log('【blockspeech】there is no observer task');
            }
        }

        /********************************** message_js****************************/
        class Message {
            constructor() {
                const containerId = 'message-container';
                this.containerEl = document.getElementById(containerId);
                if (!this.containerEl) {
                    this.containerEl = document.createElement('div');
                    this.containerEl.id = containerId;
                    document.body.appendChild(this.containerEl)
                }
            }
            show({
                type = 'info',
                text = '',
                duration = 2000,
                closeable = false
            }) {
                let messageEl = document.createElement('div');
                messageEl.className = 'message move-in';
                messageEl.innerHTML = `<span class="icon icon-${type}"></span><div class="text">${text}</div>`;
                if (closeable) {
                    let closeEl = document.createElement('div');
                    closeEl.className = 'close icon icon-close';
                    messageEl.appendChild(closeEl);
                    closeEl.addEventListener('click', () => {
                        this.close(messageEl)
                    })
                }
                this.containerEl.appendChild(messageEl);
                if (duration > 0) {
                    setTimeout(() => {
                        this.close(messageEl)
                    }, duration)
                }
            }
            close(messageEl) {
                messageEl.className = messageEl.className.replace('move-in', '');
                messageEl.className += 'move-out';
                messageEl.addEventListener('animationend', () => {
                    messageEl.setAttribute('style', 'height: 0; margin: 0')
                });
                messageEl.addEventListener('transitionend', () => {
                    messageEl.remove()
                })
            }
        }

        // 主函数main
        function main() {
            // 初始化css
            bsStyleInit();

            // 消息对象实例化
            message = new Message();

            // 添加配置选项
            GM_registerMenuCommand('配置屏蔽ID', openConfigDialog);

            // 启动监听
            window.onload = function () {
                console.log("【blockspeech】window.onload...");
                bs_startMonitor();
            }
        }

        // 进入main
        main();
    } // window.onload
})(); // 主function -- function