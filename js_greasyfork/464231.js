// ==UserScript==
// @name         百度&语雀
// @version      1.1
// @description  在百度中加入搜索个人语雀文档的功能
// @author       ccld
// @match        https://www.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @connect      yuque.com
// @license      MIT
// @namespace    https://greasyfork.org/zh-CN/scripts/464231
// @downloadURL https://update.greasyfork.org/scripts/464231/%E7%99%BE%E5%BA%A6%E8%AF%AD%E9%9B%80.user.js
// @updateURL https://update.greasyfork.org/scripts/464231/%E7%99%BE%E5%BA%A6%E8%AF%AD%E9%9B%80.meta.js
// ==/UserScript==

(function () {
    function loadTable() {
        // 获取当前搜索关键词
        let keyword = document.querySelector('#kw').value;
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.yuque.com/api/zsearch?q=" + keyword + "&tab=related&type=content",
            onload: function (resp) {
                // 转换为json对象
                let res = JSON.parse(resp.responseText);
                // 如果存在res.data.message,且内容为scope error就是没有登录
                // 有数据时,没有res.data.message 需要判断 避免报错
                console.log(res.data.message)
                if (res.data.message && res.data.message === 'scope error') {
                    showNotLogin()
                } else {
                    buildList(res.data.hits)
                }
            }
        });
    }

    // 如果是点击了搜索按钮,则重新加载表格
    if (document.querySelector('#su') != null) {
        document.querySelector('#su').addEventListener('click', function () {
            loadTable()
        });
    }

    // 如果是回车了,则重新加载表格
    if (document.querySelector('#kw') != null) {
        document.querySelector('#kw').addEventListener('keydown', function (e) {
            if (e.keyCode === 13) {
                loadTable()
            }
        });
    }

    function showNotLogin() {
        // 加一个按钮 用于跳转到登录页面
        let login_btn_style = `
            #login-btn {
              background-color: #007bff;
              border: none;
              color: white;
              padding: 8px 16px;
              font-size: 16px;
              cursor: pointer;
              border-radius: 4px;
              margin-bottom: 50px;
            }
            
            #login-btn:hover {
              background-color: #0069d9;
            }
        `
        let style = document.createElement('style');
        style.innerHTML = login_btn_style;
        document.head.appendChild(style);

        let login_btn_html = '<div style="color:#f40;font-size:15px;margin-bottom: 5px;">未登录,无法进行搜索</div><button id="login-btn" onclick="window.open(\'https://www.yuque.com/login\')">登录语雀</button>';

        $('#login-btn').remove();
        $('#content_right').prepend(login_btn_html);
    }

    function buildList(hits) {
        // 设置样式字符串变量
        let list_style = `
            #my-list {
                list-style-type:none;
                padding:0;
                height: 500px;
                overflow-y: auto;
                margin-bottom: 80px;
            }
            /* 滚动条背景 */
            #my-list::-webkit-scrollbar{
                width: 6px;
                background-color: #f5f5f5;
            }
            /* 滚动条两端的按钮 */
            #my-list::-webkit-scrollbar-button{
                height: 0;
                width: 0;
            }
            /* 滚动条滑块 */
            #my-list::-webkit-scrollbar-thumb{
                background-color: #888;
                border-radius: 20px;
                border: none;
            }
            /* 鼠标悬浮在滚动条上时的滑块样式 */
            #my-list::-webkit-scrollbar-thumb:hover{
                background-color: #555;
            }
            /* 滚动条边缘和滑块之间的间隔 */
            #my-list::-webkit-scrollbar-track{
                background-color: #f5f5f5;
            }
            #my-list li {
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
            }
            #my-list .title {
                font-size:18px;
                color:#333;
                font-weight: 600;
            }
            #my-list p {
                color:#999;
                font-size:14px;
                margin-bottom:5px;
                max-width: 100%;
                padding-bottom: 10px;
                overflow:hidden; /* 显示超出部分 */
                text-overflow:ellipsis; /* 超出部分用...表示 */
                white-space:nowrap; /* 文本不换行 */
            }
            #my-list a {
                text-decoration:none !important;
                margin-bottom:10px;
            }
            #my-list a em {
                text-decoration:none !important;
            }
        `;

        // 创建样式元素
        let style = document.createElement('style');
        style.innerHTML = list_style;

        // 将样式元素插入到head中
        document.head.appendChild(style);

        // 创建垂直列表
        let list_html = '<ul id="my-list">';

        // 添加数据项
        for (let i = 0; i < hits.length; i++) {
            list_html += '<li><a target="_blank" href="https://www.yuque.com' + hits[i].url + '"><div class="title">' + hits[i].title + '</div><p>' + hits[i].abstract + '</p></a></li>';
        }

        // 关闭垂直列表
        list_html += '</ul>';

        // 将列表插入到指定元素的第一个位置
        // 删除掉#my-list元素
        $('#my-list').remove();

        $('#content_right').prepend(list_html);
    }

    loadTable()
})();