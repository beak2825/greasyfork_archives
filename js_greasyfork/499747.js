// ==UserScript==
// @name         淘呀号解析自营(苹果版)
// @namespace    http://gv1069.vip/
// @version      1.3
// @description  （注:一同看官网能打开了就不需要用这个了，可能体验没一同看原生好,并且有时候会无法使用)该版本为“淘呀号”自营解析插件的苹果版，适用于苹果设备，该插件将不再依赖于一同看网站（一同看官网打不开的用户可以使用该插件），直接访问http://gv.gv1069.vip即可观看。
// @author       淘呀号团队
// @match        *://*/*
// @grant        GM.xmlHttpRequest
// @grant        GM.addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.gv1069.vip
// @exclude      http://gv1069.vip/*
// @exclude      https://www.yuque.com/*
// @exclude      https://yuque.com/*
// @exclude      http://www.gv1069.vip/*
// @exclude      https://m3u8play.com/*
// @exclude      https://www.m3u8play.com/*
// @exclude      https://greasyfork.org/*
// @exclude      https://www.greasyfork.org/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499747/%E6%B7%98%E5%91%80%E5%8F%B7%E8%A7%A3%E6%9E%90%E8%87%AA%E8%90%A5%28%E8%8B%B9%E6%9E%9C%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/499747/%E6%B7%98%E5%91%80%E5%8F%B7%E8%A7%A3%E6%9E%90%E8%87%AA%E8%90%A5%28%E8%8B%B9%E6%9E%9C%E7%89%88%29.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    // 定义登录 API 地址
    var yitongkanBase = "http://api.gv1069.vip";

    var page = 1;

    var searchPage = 1;

    // 在页面加载时创建登录弹框
    window.addEventListener('load', function () {

        // 创建登录框的HTML
        const loginBoxHTML = `
            <div id="loginBox" style="text-align: center; margin: 20px;">
                <h3 style="margin-top:5px;color:blue;">(为防止迷路，请关注微信公众号“淘呀号”)</h3>
                <h4 style="margin-top:5px;color:red;">(请通过租号网站提供的按钮复制账户密码，其他任何方式都将无法登录)</h4>
                <h4 style="margin-top:5px;color:red;">(如果忘记，请前往gv1069.vip首页综合服务窗口找回)</h4>
                <h4 style="margin-top:5px;color:red;">(请确保只安装一个解析脚本，多个解析脚本将会导致冲突)</h4>
                <form id="loginForm">
                    <label for="username">用户名:</label>
                    <input type="text" id="username" name="username" required>
                    <br><br>
                    <label for="password">密码:</label>
                    <input type="password" id="password" name="password" required>
                    <br><br>
                    <button type="submit">登录</button>
                </form>
                <p id="loginError" style="color: red; display: none;">用户名或密码错误</p>
            </div>
        `;

        // 创建退出登录按钮的HTML
        const logoutButtonHTML = `
            <button id="logoutButton" style="background: #D8D8D8; background-image: linear-gradient(135deg, #2F88FF 0%, #43CCF8 100%); border-radius: 20px; font-size: 16px; padding: 10px 20px; color: #FFFFFF; font-weight: 600;">退出登录</button>
        `;

         // 将登录框插入到homeso元素下面
        const homeSoElement = document.getElementById('homeso');
        if (homeSoElement) {
            homeSoElement.insertAdjacentHTML('afterend', loginBoxHTML);

            const loginBox = document.getElementById('loginBox');

            // 获取 header 中的 authControls 元素
            const authControls = document.getElementById('authControls');

            // 如果存储的token为空，则显示登录框，否则隐藏登录框
            if (GM_getValue("YTToken")==null||GM_getValue("YTToken")=="") {
                loginBox.style.display = 'block';
            } else {
                loginBox.style.display = 'none';
                // 添加退出登录按钮到 header
                authControls.innerHTML = logoutButtonHTML;
            }

            // 添加登录表单提交事件监听
            const loginForm = document.getElementById('loginForm');
            loginForm.addEventListener('submit', function(event) {
                event.preventDefault(); // 阻止默认表单提交

                // 获取输入的用户名和密码
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                if(username==""||password==""){
                    showToast("账户密码不能为空");
                }else{
                  simulateBackendCommunication(username,password)  
                }

                

            });

            // 添加退出登录按钮的点击事件监听
            authControls.addEventListener('click', function(event) {
                if (event.target && event.target.id === 'logoutButton') {
                    // 清除本地存储中的 token
                    GM_setValue("YTToken", "");

                    // 移除退出登录按钮
                    authControls.innerHTML = '';

                    // 显示登录框
                    loginBox.style.display = 'block';
                    showToast("登出成功")
                }
            });
        }

        // 模拟后端通信
        function simulateBackendCommunication(username, password) {
            // 定义登录 API 地址
            const loginApiUrl =yitongkanBase+ "/user/login";
 
            // 定义登录参数
            const loginData = {
                loginName: username,
                password: password
            };
            // 发送登录请求
            GM.xmlHttpRequest({
                method: "POST",
                url: loginApiUrl,
                data: JSON.stringify(loginData),
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (response) {
 
                    // 解析返回的 JSON 数据
                    const responseData = JSON.parse(response.responseText);
                    console.log(responseData)
 
                    if (responseData.success) {
                        // 将token存储在localStorage中
                        // localStorage.setItem('YTToken', YTToken);
                        GM_setValue("YTToken", responseData.content.token);
                        GM_setValue('username', username);
                        GM_setValue('password', password);
                        // 登录成功，隐藏登录框
                        loginBox.style.display = 'none';

                         // 在 header 中显示退出登录按钮
                        authControls.innerHTML = logoutButtonHTML;
                        showToast("登录成功")
                    } else {
                        // 登录失败，显示错误消息
                        document.getElementById('loginError').style.display = 'block';
                        showToast("登录失败")
                    }
                }
            });
        }

         

        // 获取输入框和按钮元素
        var inputElement = document.querySelector('#sos');
        var buttonElement = document.querySelector('#button');

        if (inputElement && buttonElement) {
            // 监听输入框的输入事件
            inputElement.addEventListener('input', function() {
                console.log('输入内容:', inputElement.value);
            });

            // 监听按钮的点击事件
            buttonElement.addEventListener('click', function(event) {
                 
                event.preventDefault(); // 阻止默认提交行为
                console.log('按钮被点击，输入内容:', inputElement.value);
                searchPage=1
                if(inputElement.value==""||inputElement.value==null){
                    showToast("搜索框不能为空"); 
                }else{
                    showToast("视频检索中");
                    GM.xmlHttpRequest({
                        method: 'GET',
                        url: yitongkanBase + "/app/search-list?limit=20&page="+searchPage+"&type=gv&keyword="+inputElement.value,
                        onload: function (responseSearchVideo) {
                            const responseDataSearchVideo = JSON.parse(responseSearchVideo.responseText);
                            const videos=responseDataSearchVideo.content.data.list
                            const count=responseDataSearchVideo.content.data.count
                            insertItemsIntoSearchList(videos,"https://pic.yitongboy.com")
                            insertIntoSearchPaging(searchPage,count)
                        }
                    })
                }
                

            });
        } else {
            console.error('未找到输入框或按钮元素');
        }

        // 添加样式
        GM.addStyle(`
            #gm-loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.8);
                display: none;
                z-index: -1;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            #gm-loading-overlay div {
                font-size: 20px;
            }
            #customLoginModal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            
            #loginBox {
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                text-align: center;
            }
            
            #loginBox h2 {
                color: #333;
            }

            .toast {
                visibility: hidden;
                min-width: 250px;
                margin-left: -125px;
                background-color: #333;
                color: #fff;
                text-align: center;
                border-radius: 5px;
                padding: 16px;
                position: fixed;
                z-index: 1;
                left: 50%;
                bottom: 30px;
                font-size: 17px;
            }
            .toast.show {
                visibility: visible;
                -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
                animation: fadein 0.5s, fadeout 0.5s 2.5s;
            }
            @-webkit-keyframes fadein {
                from {bottom: 0; opacity: 0;} 
                to {bottom: 30px; opacity: 1;}
            }
            @keyframes fadein {
                from {bottom: 0; opacity: 0;}
                to {bottom: 30px; opacity: 1;}
            }
            @-webkit-keyframes fadeout {
                from {bottom: 30px; opacity: 1;} 
                to {bottom: 0; opacity: 0;}
            }
            @keyframes fadeout {
                from {bottom: 30px; opacity: 1;}
                to {bottom: 0; opacity: 0;}
            }
        `);

        function showToast(message) {
            const toast = document.getElementById("toast");
            toast.textContent = message;
            toast.className = "toast show";
            setTimeout(function() {
                toast.className = toast.className.replace("show", "");
            }, 3000);
        }

        function createPaging() {
            return `<span class="lspan" style="background:#ff6651;font-size:40px;"><font color="#fff">&laquo;</font></span> <input class="yema" type="text" placeholder="页码" style="width: 50px; text-align: center;"> <button class="confirmButton" type="button" style="margin-left: 5px;">确认</button> <span class="rspan" style="background:#ff6651;font-size:40px;"><font color="#fff">&raquo;</font></span> <div id="toast"> </div>`
        }

        function insertIntoPaging(index,count) {
            let pagingHtml=createPaging();
            var pagingElement = document.querySelector('.paging');
            if (pagingElement) {
                pagingElement.innerHTML = pagingHtml
                addClickEventToPaging(index,count);
            } else {
                console.error('无法找到列表元素')
            }
        }

        function insertIntoSearchPaging(index,count) {
            let pagingHtml=createPaging();
            var pagingElement = document.querySelector('.paging');
            if (pagingElement) {
                pagingElement.innerHTML = pagingHtml
                addClickEventToSearchPaging(index,count);
            } else {
                console.error('无法找到列表元素')
            }
        }

        function gotoSearchPage(index){
            if(inputElement.value==""&&inputElement.value==null){
                showToast("搜索框为空"); 
            }else{
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: yitongkanBase + "/app/search-list?limit=20&page="+index+"&type=gv&keyword="+inputElement.value,
                    onload: function (responseSearchVideo) {
                        scrollToTop()
                        const responseDataSearchVideo = JSON.parse(responseSearchVideo.responseText);
                        const videos=responseDataSearchVideo.content.data.list
                        const count=responseDataSearchVideo.content.data.count
                        insertItemsIntoSearchList(videos,"https://pic.yitongboy.com")
                        insertIntoSearchPaging(index,count)
                    }
                })
            }
            
        }

        function gotoPage(page){
            if(inputElement.value==""&&inputElement.value==null){
                showToast("搜索框为空"); 
            }else{
               GM.xmlHttpRequest({
                    method: 'GET',
                    url: yitongkanBase + "/app/get-gv-list?page="+page,
                    onload: function (responseVideo) {
                        scrollToTop()
                        const responseDataVideo = JSON.parse(responseVideo.responseText);
                        const videos=responseDataVideo.content.data.list
                        const count=responseDataVideo.content.data.count
                        insertItemsIntoList(videos,"https://pic.yitongboy.com")
                        insertIntoPaging(page,count)
                    }
                }) 
            }
            
        }

        gotoPage(page);

        function isNonNegativeInteger(value) {
            const number = Number(value);
            return Number.isInteger(number) && number >= 0;
        }

        // Function to scroll to the top of the page
        function scrollToTop() {
            window.scrollTo(0, 0);
        }


        function addClickEventToPaging(index,count) {
            var lspan = document.querySelector('.lspan');
            var rspan = document.querySelector('.rspan');
            var yema = document.querySelector('.yema');
            var confirmButton = document.querySelector('.confirmButton');

            lspan.addEventListener('click', function() {
                if(index>1){
                    page=page-1;
                    gotoPage(page);
                    showToast("第"+page+"页加载中"); 
                }else{
                    showToast("到头了！");  
                }
            })
            
            rspan.addEventListener('click', function() {
                if(index<(count/20)){
                    page=page+1;
                    gotoPage(page);
                    showToast("第"+page+"页加载中"); 
                }else{
                    showToast("真的没有了！");  
                }
            })
            
            confirmButton.addEventListener('click', function() {
                var yemaValue=yema.value;
                if(isNonNegativeInteger(yemaValue)&&yemaValue !== ""){
                    if(1<index<(count/20)){
                        page=+yemaValue;
                        gotoPage(page);
                        showToast("第"+page+"页加载中"); 
                    }else{
                        showToast("非法页码！");
                    }
                }else{
                    showToast("非法页码！");  
                }
            })  
        }

        function addClickEventToSearchPaging(index,count) {
            var lspan = document.querySelector('.lspan');
            var rspan = document.querySelector('.rspan');
            var yema = document.querySelector('.yema');
            var confirmButton = document.querySelector('.confirmButton');

            lspan.addEventListener('click', function() {
                if(index>1){
                    searchPage=searchPage-1;
                    gotoSearchPage(searchPage);
                    showToast("第"+searchPage+"页加载中");  
                }else{
                    showToast("到头了！");  
                }
            })
            
            rspan.addEventListener('click', function() {
                if(index<(count/20)){
                    searchPage=searchPage+1;
                    gotoSearchPage(searchPage);
                    showToast("第"+searchPage+"页加载中"); 
                }else{
                    showToast("真的没有了！");  
                }
            })
            
            confirmButton.addEventListener('click', function() {
                var yemaValue=yema.value;
                if(isNonNegativeInteger(yemaValue)&&yemaValue !== ""){
                    if(1<index<(count/20)){
                        searchPage=+yemaValue;
                        gotoSearchPage(searchPage);
                        showToast("第"+searchPage+"页加载中"); 
                    }else{
                        showToast("非法页码！");
                    }
                }else{
                    showToast("非法页码！");  
                }
            })  
        }

        function createListItem(item, domain) {
            return `<li style='margin-bottom:100px;'  class='item' >
            <div class='cover g-playicon' data-video-id='${item.video_id}' data-video-type='${item.video_type}' data-v-id='${item.v_id}' data-episodes='${item.episodes}' data-mv-name='${item.mv_name}'>
            <img src='${domain}${item.mv_pic}'alt='${item.video_id}'/>
            <span class='pay'>推荐</span>
            <span class='hint'>${new Date(item.addtime).getFullYear()}</span>
            </div>
            <div class='detail'>
            <p class='title g-clear'>
            <span class='s1'>${base64Decode(item.mv_name)}</span>
            </p>
            <p class='star'></p>
            </div>
            <div class="download-buttons"  >
                                        <button class="downloadLC" data-video-id='${item.video_id}' data-video-type='${item.video_type}' data-v-id='${item.v_id}' data-episodes='${item.episodes}'>流畅下载</button>
                                        <button class="downloadBQ" data-video-id='${item.video_id}' data-video-type='${item.video_type}' data-v-id='${item.v_id}' data-episodes='${item.episodes}'>标清下载</button>
                                        <button class="downloadGQ" data-video-id='${item.video_id}' data-video-type='${item.video_type}' data-v-id='${item.v_id}' data-episodes='${item.episodes}'>高清下载</button>
                                    </div>
            </li>
            `
        }

        

        function createSearchListItem(item, domain) {
            return `<li style='margin-bottom:100px;'  class='item' >
            <div class='cover g-playicon' data-id='${item.id}' >
            <img src='${domain}${item.thumb}'alt='${item.id}'/>
            <span class='pay'>推荐</span>
            <span class='hint'>${new Date(item.addtime).getFullYear()}</span>
            </div>
            <div class='detail'>
            <p class='title g-clear'>
            <span class='s1'>${base64Decode(item.mv_name)}</span>
            </p>
            <p class='star'></p>
            </div>
            <div class="download-buttons"  >
                                        <button class="downloadLC" data-id='${item.id}'>流畅下载</button>
                                        <button class="downloadBQ" data-id='${item.id}'>标清下载</button>
                                        <button class="downloadGQ" data-id='${item.id}'>高清下载</button>
                                    </div>
            </li>
            `
        }
        
        function generateListItems(dataArray, domain) {
            return dataArray.map(item => createListItem(item, domain))
                .join('')
        }

        
        function generateSearchListItems(dataArray, domain) {
            return dataArray.map(item => createSearchListItem(item, domain))
                .join('')
        }
        
        function insertItemsIntoList(dataArray, domain) {
            var listItemsHtml = generateListItems(dataArray, domain);
            var listElement = document.querySelector('.s-tab-main .list.g-clear');
            if (listElement) {
                listElement.innerHTML = listItemsHtml
                addClickEventToItems()
                addClickEventToDownloadLC()
                addClickEventToDownloadBQ()
                addClickEventToDownloadGQ()
            } else {
                console.error('无法找到列表元素')
            }
        }
        
        function insertItemsIntoSearchList(dataArray, domain) {
            var listItemsHtml = generateSearchListItems(dataArray, domain);
            var listElement = document.querySelector('.s-tab-main .list.g-clear');
            if (listElement) {
                listElement.innerHTML = listItemsHtml
                addClickEventToSearchItems()
                addClickEventToSearchDownloadLC()
                addClickEventToSearchDownloadBQ()
                addClickEventToSearchDownloadGQ()
            } else {
                console.error('无法找到列表元素')
            }
        }
    
    
        // 使用 JavaScript 进行 Base64 解码
        function base64Decode(encodedString) {
            return decodeURIComponent(escape(atob(encodedString)));
        }
        

        function addClickEventToSearchDownloadLC() {
            var items = document.querySelectorAll('.downloadLC');
            items.forEach(item => {
                item.addEventListener('click', function() {
                    showToast("苹果设备不支持下载，请使用安卓设备或者电脑")
                })
            })
        }
        function addClickEventToSearchDownloadBQ() {
            var items = document.querySelectorAll('.downloadBQ');
            items.forEach(item => {
                item.addEventListener('click', function() {
                    showToast("苹果设备不支持下载，请使用安卓设备或者电脑")
                })
            })
        }
        function addClickEventToSearchDownloadGQ() {
            var items = document.querySelectorAll('.downloadGQ');
            items.forEach(item => {
                item.addEventListener('click', function() {
                    showToast("苹果设备不支持下载，请使用安卓设备或者电脑")
                })
            })
        }

        function addClickEventToDownloadLC() {
            var items = document.querySelectorAll('.downloadLC');
            items.forEach(item => {
                item.addEventListener('click', function() {
                    showToast("苹果设备不支持下载，请使用安卓设备或者电脑")
                })
            })
        }
        function addClickEventToDownloadBQ() {
            var items = document.querySelectorAll('.downloadBQ');
            items.forEach(item => {
                item.addEventListener('click', function() {
                    showToast("苹果设备不支持下载，请使用安卓设备或者电脑")
                })
            })
        }
        function addClickEventToDownloadGQ() {
            var items = document.querySelectorAll('.downloadGQ');
            items.forEach(item => {
                item.addEventListener('click', function() {
                    showToast("苹果设备不支持下载，请使用安卓设备或者电脑")
                })
            })
        }

        function addClickEventToItems() {
            var items = document.querySelectorAll('.cover.g-playicon');
            items.forEach(item => {
                item.addEventListener('click', function() {
                    var videoId = item.getAttribute('data-video-id');
                    var videoType = item.getAttribute('data-video-type');
                    var vId = item.getAttribute('data-v-id');
                    var episodes = item.getAttribute('data-episodes');
                    var mvName=item.getAttribute('data-mv-name');

                    const tempPage = window.open('loading page');
                    let qualityList=""
                    tempPage.addEventListener('load', function() {
                            GM.xmlHttpRequest({
                                method: 'GET',
                                url: yitongkanBase + "/app/get-video-url?video_id="+videoId+"&video_type="+videoType+"&v_id="+vId+"&episodes="+episodes+"&prefix=&line=&token="+GM_getValue("YTToken"),
                                onload: function (responseUrl) {
                                    const responseDataVideo = JSON.parse(responseUrl.responseText);
                                    if (responseDataVideo.success && responseDataVideo.content != null && responseDataVideo.content != "") {
                                        
                                        const urls=responseDataVideo.content.data.video_url
                                        const keys = Object.keys(urls);
                                        const numberOfKeys = keys.length;
                                        console.log(numberOfKeys)
                                    
                                        if(numberOfKeys==1){
                                            qualityList=`{
                                                name: '流畅',
                                                url: '${base64Decode(urls['480'])}', 
                                                type: 'hls',
                                                
                                            },`
                                        }else if(numberOfKeys==2){
                                            qualityList=`{
                                                name: '流畅',
                                                url: '${base64Decode(urls['480'])}', 
                                                type: 'hls',
                                                
                                            },
                                            {
                                                name: '标清', 
                                                url: '${base64Decode(urls['720'])}',
                                                type: 'hls',
                                                
                                            },`
                                            
                                        }else if(numberOfKeys==3){
                                            qualityList=`{
                                                name: '流畅',
                                                url: '${base64Decode(urls['480'])}', 
                                                type: 'hls',
                                                
                                            },
                                            {
                                                name: '标清', 
                                                url: '${base64Decode(urls['720'])}',
                                                type: 'hls',
                                                
                                            },
                                            {
                                                name: '高清', 
                                                url: '${base64Decode(urls['1080'])}',
                                                type: 'hls',
                                                
                                            },`
                                            
                                        }
                                        let playhtml=`<!DOCTYPE HTML>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <meta http-equiv="cache-control" content="no-siteapp">
        <link rel="stylesheet" type="text/css" href="../static/css/style.css" />
        <link rel="stylesheet" type="text/css" href="../static/css/play.css" />
        <link href="/static/layui/css/layui.css" rel="stylesheet">
        <script src="/static/layui/layui.js"></script>
        <script src="/dist/DPlayer.min.js"></script>
        <script src="/dist/hls.min.js"></script>
        <link rel="stylesheet" href="/dist/DPlayer.min.css">
        <title>淘呀号</title>
    </head>
    <style>
        .w-newfigure{list-style:none; float:left;}
        .list{ margin-left:-40px;}
    </style>
    <body class="page-template page-template-pages page-template-posts-play page-template-pagesposts-play-php page page-id-16">
    
    <style>
        .tips {
            box-sizing: border-box;
            padding: 10px 20px;
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            height: 64px;
            background-color: rgba(0,0,0,0.50);
            z-index: 100000;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }
        .t-left {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
        }
        .t-logo {
            width: 48px;
            height: 48px;
            margin-right: 10px;
        }
        .c-t {
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
        .c-title {
            font-family: PingFangSC-Semibold;
            font-size: 16px;
            color: #FFFFFF;
            line-height: 22px;
            font-weight: 600;
        }
        .c-desc {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #FFFFFF;
            font-weight: 400;
        }
        .t-btn {
            box-sizing: border-box;
            width: 78px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background: #D8D8D8;
            background-image: linear-gradient(135deg, #2F88FF 0%, #43CCF8 100%);
            border-radius: 20px;
            font-size: 14px;
            color: #FFFFFF;
            font-weight: 600;
        }
    
        .close-icons {
            width: 10px;
            height: 10px;
            position: absolute;
            top: 10px;
            right: 10px;
        }
    </style>
    <script type="text/javascript" src="../static/js/crypto-js.min.js"></script>
    <script type="text/javascript" src="../static/js/jquery.min.js"></script>
    <meta name="referrer" content="never">
    <meta name="referrer" content="no-referrer">
    
    <div class="single-post">
        <section class="container">
            <div class="content-wrap">
                <div class="content">
                    <div class="sptitle"><h1> </h1></div>
                    <div id="bof" class = "cf-157586882">
                    </div>
                    <!-- 添加视频标题 -->
                    <div class="video-title">${base64Decode(mvName)}</div>
                    <div class="am-cf"></div>
                    <div class="am-panel am-panel-default">
                        <div class="am-panel-bd" style="padding-top: 10px;">
    
                            <div class="bofangdiv" id="dplayer"></div>
    
                            <script type="text/javascript">
                                const dp = new DPlayer({ 
                                    container: document.getElementById('dplayer'), 
                                    screenshot: true,
                                    video: {
                                        quality: [
                                            ${qualityList}
                                        ],
                                            defaultQuality: 0,
                                    }
                                });
                                function xldata(urls){
                                    var videourls = document.getElementById('video');
                                    var xlqieh = document.getElementById('videourlgo');
                                    videourls.src = urls+xlqieh.href;
                                }
                            </script>
                            
                            <div class="article-tags">
                                <i class="fa fa-tags"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    </body>
    </html>
    `
                                        // 替换当前页面的内容
                                        tempPage.document.open();
                                        tempPage.document.write(playhtml);
                                        tempPage.document.close();

                                    } else if (responseDataVideo.message == "2") {
                                        GM_setValue("YTToken", "");
                                        var result = confirm("该账户已过期，请您重新购买或者取号！点击“确定”按钮自动跳转至购买界面！");
                                        if (result) {
                                            window.location.href = "http://gv1069.vip/#/shop-account";
                                        }

                                    } else if (responseDataVideo.message == "3") {
                                        GM_setValue("YTToken", "");
                                        var result = confirm("请您重新登录！点击“确定”按钮自动弹出登录输入框！");
                                        if (result) {
                                            window.location.reload();
                                        }
                                    } else if (responseDataVideo.message == "4" || responseDataVideo.message == "5") {
                                        GM_setValue("YTToken", "");
                                        var result = confirm("请您重新登录！点击“确定”按钮自动弹出登录输入框！");
                                        if (result) {
                                            window.location.reload();
                                        }

                                    } else if (responseDataVideo.message == "6") {
                                        GM_setValue("YTToken", "");
                                        var result = confirm("您的账号在另一台设备上登录，请重新登录");
                                        if (result) {
                                            window.location.reload();
                                        }
                                    } else {
                                        showToast('解析失败，请点击播放按钮重试！')
                                    }
                                    
                                }
                            })
                        }); 
                });
            });
        }

        function addClickEventToSearchItems() {
            var items = document.querySelectorAll('.cover.g-playicon');
            items.forEach(item => {
                item.addEventListener('click', function() {
                    var id = item.getAttribute('data-id');
                    const tempPage = window.open('loading page');
                    let qualityList=""
                    tempPage.addEventListener('load', function() {
                        GM.xmlHttpRequest({
                            method: 'GET',
                            url: yitongkanBase + "/app/get-video-view?id="+id,
                            onload: function (responseView) {
                                const responseDataView = JSON.parse(responseView.responseText);
                                const view=responseDataView.content.data
                                console.log(view)
                                var videoId = view.video_id;
                                var videoType = view.video_type;
                                var vId = view.v_id;
                                var episodes = view.episodes;
                                var mvName=view.mv_name;

                                GM.xmlHttpRequest({
                                    method: 'GET',
                                    url: yitongkanBase + "/app/get-video-url?video_id="+videoId+"&video_type="+videoType+"&v_id="+vId+"&episodes="+episodes+"&prefix=&line=&token="+GM_getValue("YTToken"),
                                    onload: function (responseUrl) {
                                        const responseDataVideo = JSON.parse(responseUrl.responseText);
                                        if (responseDataVideo.success && responseDataVideo.content != null && responseDataVideo.content != "") {
                                            
                                            const urls=responseDataVideo.content.data.video_url
                                            console.log(urls)
                                            const keys = Object.keys(urls);
                                            const numberOfKeys = keys.length;
                                            console.log(numberOfKeys)
                                        
                                            if(numberOfKeys==1){
                                                qualityList=`{
                                                    name: '流畅',
                                                    url: '${base64Decode(urls['480'])}', 
                                                    type: 'hls',
                                                    
                                                },`
                                            }else if(numberOfKeys==2){
                                                qualityList=`{
                                                    name: '流畅',
                                                    url: '${base64Decode(urls['480'])}', 
                                                    type: 'hls',
                                                    
                                                },
                                                {
                                                    name: '标清', 
                                                    url: '${base64Decode(urls['720'])}',
                                                    type: 'hls',
                                                    
                                                },`
                                                
                                            }else if(numberOfKeys==3){
                                                qualityList=`{
                                                    name: '流畅',
                                                    url: '${base64Decode(urls['480'])}', 
                                                    type: 'hls',
                                                    
                                                },
                                                {
                                                    name: '标清', 
                                                    url: '${base64Decode(urls['720'])}',
                                                    type: 'hls',
                                                    
                                                },
                                                {
                                                    name: '高清', 
                                                    url: '${base64Decode(urls['1080'])}',
                                                    type: 'hls',
                                                    
                                                },`
                                                
                                            }
                                            let playhtml=`<!DOCTYPE HTML>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
            <meta name="apple-mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-status-bar-style" content="black">
            <meta http-equiv="cache-control" content="no-siteapp">
            <link rel="stylesheet" type="text/css" href="../static/css/style.css" />
            <link rel="stylesheet" type="text/css" href="../static/css/play.css" />
            <link href="/static/layui/css/layui.css" rel="stylesheet">
            <script src="/static/layui/layui.js"></script>
            <script src="/dist/DPlayer.min.js"></script>
            <script src="/dist/hls.min.js"></script>
            <link rel="stylesheet" href="/dist/DPlayer.min.css">
            <title>淘呀号</title>
        </head>
        <style>
            .w-newfigure{list-style:none; float:left;}
            .list{ margin-left:-40px;}
        </style>
        <body class="page-template page-template-pages page-template-posts-play page-template-pagesposts-play-php page page-id-16">

        <style>
            .tips {
                box-sizing: border-box;
                padding: 10px 20px;
                position: fixed;
                left: 0;
                right: 0;
                bottom: 0;
                height: 64px;
                background-color: rgba(0,0,0,0.50);
                z-index: 100000;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
            }
            .t-left {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
            }
            .t-logo {
                width: 48px;
                height: 48px;
                margin-right: 10px;
            }
            .c-t {
                color: #fff;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            }
            .c-title {
                font-family: PingFangSC-Semibold;
                font-size: 16px;
                color: #FFFFFF;
                line-height: 22px;
                font-weight: 600;
            }
            .c-desc {
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: #FFFFFF;
                font-weight: 400;
            }
            .t-btn {
                box-sizing: border-box;
                width: 78px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                background: #D8D8D8;
                background-image: linear-gradient(135deg, #2F88FF 0%, #43CCF8 100%);
                border-radius: 20px;
                font-size: 14px;
                color: #FFFFFF;
                font-weight: 600;
            }

            .close-icons {
                width: 10px;
                height: 10px;
                position: absolute;
                top: 10px;
                right: 10px;
            }
        </style>
        <script type="text/javascript" src="../static/js/crypto-js.min.js"></script>
        <script type="text/javascript" src="../static/js/jquery.min.js"></script>
        <meta name="referrer" content="never">
        <meta name="referrer" content="no-referrer">

        <div class="single-post">
            <section class="container">
                <div class="content-wrap">
                    <div class="content">
                        <div class="sptitle"><h1> </h1></div>
                        <div id="bof" class = "cf-157586882">
                        </div>
                        <!-- 添加视频标题 -->
                        <div class="video-title">${base64Decode(mvName)}</div>
                        <div class="am-cf"></div>
                        <div class="am-panel am-panel-default">
                            <div class="am-panel-bd" style="padding-top: 10px;">

                                <div class="bofangdiv" id="dplayer"></div>

                                <script type="text/javascript">
                                    const dp = new DPlayer({ 
                                        container: document.getElementById('dplayer'), 
                                        screenshot: true,
                                        video: {
                                            quality: [
                                                ${qualityList}
                                            ],
                                                defaultQuality: 0,
                                        }
                                    });
                                    function xldata(urls){
                                        var videourls = document.getElementById('video');
                                        var xlqieh = document.getElementById('videourlgo');
                                        videourls.src = urls+xlqieh.href;
                                    }
                                </script>
                                
                                <div class="article-tags">
                                    <i class="fa fa-tags"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        </body>
        </html>
        `
                                            // 替换当前页面的内容
                                            tempPage.document.open();
                                            tempPage.document.write(playhtml);
                                            tempPage.document.close();

                                        } else if (responseDataVideo.message == "2") {
                                            GM_setValue("YTToken", "");
                                            GM_setValue('username', "");
                                            GM_setValue('password', "");
                                            var result = confirm("该账户已过期，请您重新购买或者取号！点击“确定”按钮自动跳转至购买界面！");
                                            if (result) {
                                                window.location.href = "http://gv1069.vip/#/shop-account";
                                            }

                                        } else if (responseDataVideo.message == "3") {
                                            GM_setValue("YTToken", "");
                                            GM_setValue('username', "");
                                            GM_setValue('password', "");
                                            var result = confirm("请您重新登录！点击“确定”按钮自动弹出登录输入框！");
                                            if (result) {
                                                window.location.reload();
                                            }
                                        } else if (responseDataVideo.message == "4" || responseDataVideo.message == "5") {
                                            GM_setValue("YTToken", "");
                                            GM_setValue('username', "");
                                            GM_setValue('password', "");
                                            var result = confirm("请您重新登录！点击“确定”按钮自动弹出登录输入框！");
                                            if (result) {
                                                window.location.reload();
                                            }

                                        } else if (responseDataVideo.message == "6") {
                                            GM_setValue("YTToken", "");
                                            GM_setValue('username', "");
                                            GM_setValue('password', "");
                                            var result = confirm("您的账号在另一台设备上登录，请重新登录");
                                            if (result) {
                                                window.location.reload();
                                            }
                                        } else {
                                            showToast('解析失败，请点击播放按钮重试！')
                                        }
                                    }
                                })
                            }
                        })
                            
                        }); 

                    
                });
            });
        }
        $("body").on('click', '.close-gobutton', function () {
            $("#down-my-section").remove();
        })
    });
})();