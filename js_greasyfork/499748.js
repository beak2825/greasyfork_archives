// ==UserScript==
// @name         淘呀号解析自营
// @namespace    http://gv1069.vip/
// @version      1.1
// @description  （注:一同看官网能打开了就不需要用这个了，可能体验没一同看原生好,并且有时候会无法使用)该版本为“淘呀号”自营解析插件的主版本，适用于安卓和电脑设备，该插件将不再依赖于一同看网站（一同看官网打不开的用户可以使用该插件），直接访问http://gv.gv1069.vip即可观看。
// @author       淘呀号团队
// @grant        GM.xmlHttpRequest
// @grant        GM.addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_info
// @grant        GM_notification
// @grant        GM_getResourceText
// @grant        GM_openInTab
// @grant        GM_addStyle
// @grant        GM_download
// @connect      api.gv1069.vip
// @match        *://*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/sweetalert/2.1.2/sweetalert.min.js
// @require      https://greasyfork.org/scripts/469053-jsqr/code/jsQR.js?version=1207999
 
// @require      https://lib.baomitu.com/m3u8-parser/4.7.1/m3u8-parser.min.js
// @require      https://greasyfork.org/scripts/468518-addqrcode/code/addqrcode.js?version=1204970
 
// @require      https://update.greasyfork.org/scripts/468541/1282371/ADDimgdown.js
 
 
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.1/vue.js
// @require      https://greasyfork.org/scripts/468820-m3u8-hls/code/m3u8-hls.js?version=1206200
// @require      https://greasyfork.org/scripts/468821-mux-mp4/code/mux-mp4.js?version=1206201
// @require      https://greasyfork.org/scripts/469054-streamsaver/code/StreamSaver.js?version=1208001
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.4.6/hls.min.js
// @require      https://update.greasyfork.org/scripts/469703/1296888/kxtool.js

// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499748/%E6%B7%98%E5%91%80%E5%8F%B7%E8%A7%A3%E6%9E%90%E8%87%AA%E8%90%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/499748/%E6%B7%98%E5%91%80%E5%8F%B7%E8%A7%A3%E6%9E%90%E8%87%AA%E8%90%A5.meta.js
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
                    GM.xmlHttpRequest({
                        method: 'GET',
                        url: yitongkanBase + "/pay/is-taocan?account=" + GM_getValue("username"),
                        onload: function (responseAccount) {
                            const responseDataAccount = JSON.parse(responseAccount.responseText);
                            if (responseDataAccount.content) {
                                var id = item.getAttribute('data-id');
                                GM.xmlHttpRequest({
                                    method: 'GET',
                                    url: yitongkanBase + "/app/get-video-view?id="+id,
                                    onload: function (responseView) {
                                        const responseDataView = JSON.parse(responseView.responseText);
                                        const view=responseDataView.content.data
                                        var videoId = view.video_id;
                                        var videoType = view.video_type;
                                        var vId = view.v_id;
                                        var episodes = view.episodes;

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
                                                    if(numberOfKeys>=1){
                                                        sectionm3u8menu(base64Decode(urls['480']))
                                                    }else{
                                                        showToast('该视频无流畅源')
                                                    }

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
                                    }
                                })
                            }else{
                                showToast("请购买非1.9元套餐后下载")
                            }
                        }
                    })
                })
            })
        }
        function addClickEventToSearchDownloadBQ() {
            var items = document.querySelectorAll('.downloadBQ');
            items.forEach(item => {
                item.addEventListener('click', function() {

                    GM.xmlHttpRequest({
                        method: 'GET',
                        url: yitongkanBase + "/pay/is-taocan?account=" + GM_getValue("username"),
                        onload: function (responseAccount) {
                            const responseDataAccount = JSON.parse(responseAccount.responseText);
                            if (responseDataAccount.content) {
                                var id = item.getAttribute('data-id');
                                GM.xmlHttpRequest({
                                    method: 'GET',
                                    url: yitongkanBase + "/app/get-video-view?id="+id,
                                    onload: function (responseView) {
                                        const responseDataView = JSON.parse(responseView.responseText);
                                        const view=responseDataView.content.data
                                        var videoId = view.video_id;
                                        var videoType = view.video_type;
                                        var vId = view.v_id;
                                        var episodes = view.episodes;

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
                                                    if(numberOfKeys>=2){
                                                        sectionm3u8menu(base64Decode(urls['720']))
                                                    }else{
                                                        showToast('该视频无标清源')
                                                    }

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
                                    }
                                }) 
                            }else{
                                showToast("请购买非1.9元套餐后下载")
                            }
                        }
                    })
                    
                    
                })
            })
        }
        function addClickEventToSearchDownloadGQ() {
            var items = document.querySelectorAll('.downloadGQ');
            items.forEach(item => {
                item.addEventListener('click', function() {
                    GM.xmlHttpRequest({
                        method: 'GET',
                        url: yitongkanBase + "/pay/is-taocan?account=" + GM_getValue("username"),
                        onload: function (responseAccount) {
                            const responseDataAccount = JSON.parse(responseAccount.responseText);
                            if (responseDataAccount.content) {
                                var id = item.getAttribute('data-id');

                                GM.xmlHttpRequest({
                                    method: 'GET',
                                    url: yitongkanBase + "/app/get-video-view?id="+id,
                                    onload: function (responseView) {
                                        const responseDataView = JSON.parse(responseView.responseText);
                                        const view=responseDataView.content.data
                                        var videoId = view.video_id;
                                        var videoType = view.video_type;
                                        var vId = view.v_id;
                                        var episodes = view.episodes;

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
                                                    if(numberOfKeys>=3){
                                                        sectionm3u8menu(base64Decode(urls['1080']))
                                                    }else{
                                                        showToast('该视频无高清源')
                                                    }

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
                                    }
                                })
                            }else{
                                showToast("请购买非1.9元套餐后下载")
                            }
                        }
                    })
                    
                })
            })
        }

        function addClickEventToDownloadLC() {
            var items = document.querySelectorAll('.downloadLC');
            items.forEach(item => {
                item.addEventListener('click', function() {
                    GM.xmlHttpRequest({
                        method: 'GET',
                        url: yitongkanBase + "/pay/is-taocan?account=" + GM_getValue("username"),
                        onload: function (responseAccount) {
                            const responseDataAccount = JSON.parse(responseAccount.responseText);
                            if (responseDataAccount.content) {
                                var videoId = item.getAttribute('data-video-id');
                                var videoType = item.getAttribute('data-video-type');
                                var vId = item.getAttribute('data-v-id');
                                var episodes = item.getAttribute('data-episodes');
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
                                            if(numberOfKeys>=1){
                                                sectionm3u8menu(base64Decode(urls['480']))
                                            }else{
                                                showToast('该视频无流畅源')
                                            }  
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
                            }else{
                                showToast("请购买非1.9元套餐后下载")
                            }
                        }
                    })
                    
                })
            })
        }
        function addClickEventToDownloadBQ() {
            var items = document.querySelectorAll('.downloadBQ');
            items.forEach(item => {
                item.addEventListener('click', function() {
                    GM.xmlHttpRequest({
                        method: 'GET',
                        url: yitongkanBase + "/pay/is-taocan?account=" + GM_getValue("username"),
                        onload: function (responseAccount) {
                            const responseDataAccount = JSON.parse(responseAccount.responseText);
                            if (responseDataAccount.content) {
                                var videoId = item.getAttribute('data-video-id');
                                var videoType = item.getAttribute('data-video-type');
                                var vId = item.getAttribute('data-v-id');
                                var episodes = item.getAttribute('data-episodes');
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
                                            if(numberOfKeys>=2){
                                                sectionm3u8menu(base64Decode(urls['720']))
                                            }else{
                                                showToast('该视频无标清源')
                                            }        

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
                            }else{
                                showToast("请购买非1.9元套餐后下载")
                            }
                        }
                    })
                    
                })
            })
        }
        function addClickEventToDownloadGQ() {
            var items = document.querySelectorAll('.downloadGQ');
            items.forEach(item => {
                item.addEventListener('click', function() {
                    GM.xmlHttpRequest({
                        method: 'GET',
                        url: yitongkanBase + "/pay/is-taocan?account=" + GM_getValue("username"),
                        onload: function (responseAccount) {
                            const responseDataAccount = JSON.parse(responseAccount.responseText);
                            if (responseDataAccount.content) {
                                var videoId = item.getAttribute('data-video-id');
                                var videoType = item.getAttribute('data-video-type');
                                var vId = item.getAttribute('data-v-id');
                                var episodes = item.getAttribute('data-episodes');
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
                                            if(numberOfKeys>=3){
                                                sectionm3u8menu(base64Decode(urls['1080']))
                                            }else{
                                                showToast('该视频无高清源')
                                            }           

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
                            }else{
                                showToast("请购买非1.9元套餐后下载")
                            }
                        }
                    })
                    
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
        function sectionm3u8menu(m3u8url) {
            let $section = document.createElement('section');
            $section.setAttribute('id', 'down-my-section');
            $section.innerHTML = `
   
    <style>
    /*全局设置*/
    html, body {
      margin: 0;
      padding: 0;
    }
    body::-webkit-scrollbar { display: none}
    p {
      margin: 0;
    }
    [v-cloak] {
      display: none;
    }
    #m-app {
      height: 100%;
      display: inherit;
      width: 100%;
      text-align: center;
      padding: 10px 50px 80px;
      box-sizing: border-box;
    }
    .m-p-action {
      margin: 20px auto;
      max-width: 1100px;
      width: 100%;
      font-size: 35px;
      text-align: center;
      font-weight: bold;
      display: block;
    }
    .m-p-other, .m-p-tamper, .m-p-github, .m-p-language, .m-p-mse{
      position: fixed;
      right: 50px;
      background-color: #eff3f6;
      background-image: linear-gradient(-180deg, #fafbfc, #eff3f6 90%);
      color: #24292e;
      border: 1px solid rgba(27, 31, 35, .2);
      border-radius: 3px;
      cursor: pointer;
      display: inline-block;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      padding: 6px 12px;
      z-index: 99;
    }
    
    .m-p-help {
      position: fixed;
      right: 50px;
      top: 50px;
      width: 30px;
      height: 30px;
      color: #666666;
      z-index: 2;
      line-height: 30px;
      font-weight: bolder;
      border-radius: 50%;
      border: 1px solid rgba(27, 31, 35, .2);
      cursor: pointer;
      background-color: #eff3f6;
      background-image: linear-gradient(-180deg, #fafbfc, #eff3f6 90%);
    }
    .m-p-github:hover, .m-p-other:hover, .m-p-tamper:hover, .m-p-help:hover, .m-p-language:hover, .m-p-mse:hover{
      opacity: 0.9;
    }
    .m-p-language {
      bottom: 70px;
    }
    .m-p-other {
      bottom: 150px;
    }
    .m-p-tamper {
      bottom: 30px;
    }
    .m-p-github {
      bottom: 190px;
    }
    .m-p-mse {
      bottom: 110px;
    }
    /*广告*/
    .m-p-refer {
      position: absolute;
      left: 50px;
      bottom: 50px;
    }
    .m-p-refer .text {
      position: absolute;
      top: -80px;
      left: -40px;
      animation-name: upAnimation;
      transform-origin: center bottom;
      animation-duration: 2s;
      animation-fill-mode: both;
      animation-iteration-count: infinite;
      animation-delay: .5s;
    }
    .m-p-refer .close {
      display: block;
      position: absolute;
      top: -110px;
      right: -50px;
      padding: 0;
      margin: 0;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      z-index: 3;
      transition: 0.3s all;
      background-size: 30px 30px;
      background-repeat: no-repeat;
      background-position: center center;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAk1BMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ROyVeAAAAMHRSTlMA1Sq7gPribxkJx6Ey8onMsq+GTe10QF8kqJl5WEcvIBDc0sHAkkk1FgO2ZZ+dj1FHfPqwAAACNElEQVRIx6VW6ZqqMAwtFlEW2Rm3EXEfdZa+/9PdBEvbIVXu9835oW1yjiQlTWQE/iYPuTObOTzMNz4bQFRlY2FgnFXRC/o01mytiafP+BPvQZk56bcLSOXem1jpCy4QgXvRtlEVCARfUP65RM/hp29/+0R7eSbhoHlnffZ8h76e6x1tyw9mxXaJ3nfTVLd89hQr9NfGceJxfLIXmONh6eNNYftNSESRmgkHlEOjmhgBbYcEW08FFQN/ro6dvAczjhgXEdQP76xHEYxM+igQq259gLrCSlwbD3iDtTMy+A4Yuk0B6zV8c+BcO2OgFIp/UvJdG4o/Rp1JQYXeZFflPEFMfvugiFGFXN587YtgX7C8lRGFXPCGGYCCzlkoxJ4xqmi/jrIcdYYh5pwxiwI/gt7lDDFrcLiMKhBJ//W78ENsJgVUsV8wKpjZBXshM6cCW0jbRAilICFxIpgGMmmiWGHSIR6ViY+DPFaqSJCbQ5mbxoZLIlU0Al/cBj6N1uXfFI0okLppi69StmumSFQRP6oIKDedFi3vRDn3j6KozCZlu0DdJb3AupJXNLmqkk9+X9FEHLt1Jq8oi1H5n01AtRlvwQZQl9hmtPY4JEjMDs5ftWJN4Xr4lLrV2OHiUDHCPgvA/Tn/hP4zGUBfjZ3eLJ+NIOfHxi8CMoAQtYfmw93v01O0e7VlqqcCsXML3Vsu94cxnb4c7ML5chG8JIP9b38dENGaj3+x+TpiA/AL/fen8In7H8l3ZjdJQt2TAAAAAElFTkSuQmCC);
      background-color: rgba(0, 0, 0, 0.5);
    }
    .m-p-refer .close:hover {
      background-color: rgba(0, 0, 0, 0.8);
    }
    .m-p-refer .link {
      border-radius: 4px;
      text-decoration: none;
      background-color: #4E84E6;
      transition: 0.3s all;
    }
    .m-p-refer .link:hover {
      top: -10px;
      color: #333333;
      border: 1px solid transparent;
      background: rgba(0, 0, 0, 0.6);
      box-shadow: 2px 11px 20px 0 rgba(0, 0, 0, 0.6);
    }
    @keyframes upAnimation {
      0% {
        transform: rotate(0deg);
        transition-timing-function: cubic-bezier(0.215, .61, .355, 1)
      }
   
      10% {
        transform: rotate(-12deg);
        transition-timing-function: cubic-bezier(0.215, .61, .355, 1)
      }
   
      20% {
        transform: rotate(12deg);
        transition-timing-function: cubic-bezier(0.215, .61, .355, 1)
      }
   
      28% {
        transform: rotate(-10deg);
        transition-timing-function: cubic-bezier(0.215, .61, .355, 1)
      }
   
      36% {
        transform: rotate(10deg);
        transition-timing-function: cubic-bezier(0.755, .5, .855, .06)
      }
   
      42% {
        transform: rotate(-8deg);
        transition-timing-function: cubic-bezier(0.755, .5, .855, .06)
      }
   
      48% {
        transform: rotate(8deg);
        transition-timing-function: cubic-bezier(0.755, .5, .855, .06)
      }
   
      52% {
        transform: rotate(-4deg);
        transition-timing-function: cubic-bezier(0.755, .5, .855, .06)
      }
   
      56% {
        transform: rotate(4deg);
        transition-timing-function: cubic-bezier(0.755, .5, .855, .06)
      }
   
      60% {
        transform: rotate(0deg);
        transition-timing-function: cubic-bezier(0.755, .5, .855, .06)
      }
   
      100% {
        transform: rotate(0deg);
        transition-timing-function: cubic-bezier(0.215, .61, .355, 1)
      }
    }
    /*顶部信息录入*/
    .m-p-temp-url {
      padding-top: 10px;
      padding-bottom: 10px;
      width: 100%;
      color: #999999;
      text-align: left;
      font-style: italic;
      word-break: break-all;
  font-size: 12px;
    }
   
    }
    .m-p-input-container input {
      flex: 1;
      margin-bottom: 20px;
      display: block;
      width: 380px;
      padding: 14px;
      font-size: 24px;
      border-radius: 4px;
      box-shadow: none;
      color: #444444;
      border: 1px solid #cccccc;
      min-width: 400px;
    }
    .m-p-input-container .range-input {
      margin-left: 10px;
  margin-bottom: 0;
      width: 100px;
      box-sizing: border-box;
    }
    .m-p-input-container div {
      position: relative;
      display: inline-block;
      margin-left: 10px;
      height: 40px;
      font-size:14px;
      color: white;
      cursor: pointer;
      border-radius: 4px;
      border: 1px solid #eeeeee;
      background-color: #3D8AC7;
      opacity: 1;
      transition: 0.3s all;
    }
    .m-p-input-container div:hover {
      opacity: 0.9;
    }
    .m-p-input-container div {
      width: 200px;
    }
    .m-p-input-container .disable {
      cursor: not-allowed;
      background-color: #dddddd;
    }
    /*下载状态*/
    .m-p-line {
      margin: 20px 0 50px;
      vertical-align: top;
      width: 100%;
      height: 5px;
      border-bottom: dotted;
    }
    .m-p-tips {
      width: 100%;
      color: #999999;
      text-align: left;
      font-style: italic;
      word-break: break-all;
    }
    .m-p-tips p {
      width: 100px;
      display: inline-block;
    }
    .m-p-tips.error-tips{
      color: #DC5350;
    }
    .m-p-segment {
      text-align: left;
    }
    .m-p-segment .item {
      display: inline-block;
      margin: 10px 6px;
      width: 50px;
      height: 40px;
      color: white;
      line-height: 40px;
      text-align: center;
      border-radius: 4px;
      cursor: help;
      border: solid 1px #eeeeee;
      background-color: #dddddd;
      transition: 0.3s all;
    }
    .m-p-segment .finish {
      background-color: #0ACD76;
    }
    .m-p-segment .error {
      cursor: pointer;
      background-color: #DC5350;
    }
    .m-p-segment .error:hover {
      opacity: 0.9;
    }
    .m-p-stream, .m-p-report, .m-p-cross, .m-p-final {
      margin-top: 10px;
      display: inline-block;
      width: 100%;
      height: 30px;
      line-height: 30px;
      font-size: 15px;
      color: white;
      cursor: pointer;
      border-radius: 4px;
      border: 1px solid #eeeeee;
      background-color: #3D8AC7;
      opacity: 1;
      transition: 0.3s all;
    }
    .m-p-stream {
      background-color: #0ACD76 !important;
    }
    .m-p-report {
      background-color: #e74c3c !important;
      text-decoration: none;
    }
    .m-p-final {
      text-decoration: none;
    }
    .m-p-force, .m-p-retry {
      position: absolute;
      right: 50px;
      display: inline-block;
      padding: 6px 12px;
      font-size: 18px;
      color: white;
      cursor: pointer;
      border-radius: 4px;
      border: 1px solid #eeeeee;
      background-color: #3D8AC7;
      opacity: 1;
      transition: 0.3s all;
    }
    .m-p-retry {
      right: 250px;
    }
    .m-p-force:hover, .m-p-retry:hover {
      opacity: 0.9;
    }
            .m-p-input-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;
  }
   
  .m-p-input-container input {
    width: 100%;
    margin-bottom: 10px;
    padding: 12px 10px;
    font-size: 14px;
    border: none;
    border-radius: 4px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
  }
   
  .m-p-input-container div {
    width: 100%;
    margin-bottom: 10px;
    padding: 10px;
    font-size: 14px;
    color: white;
    background-color: #136fbe;
    text-align: center;
    border-radius: 5px;
    cursor: pointer;
    box-sizing: border-box;
  }
   
  @media screen and (min-width: 768px) {
    .m-p-input-container {
      flex-direction: row;
      justify-content: space-around;
      padding: 20px;
    }
   
    .m-p-input-container input[type="text"] {
      width: calc(65% - 10px);
      margin-bottom: 0;
      margin-right: 10px;
    }
   
    .m-p-input-container div {
      width: calc(20% - 5px);
      margin-bottom: 0;
    }
  }
   
  .close-gobutton {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: #858585;
      color: #fff;
      border-radius: 50%;
      border: none;
      width: 30px;
      height: 30px;
      cursor: pointer;
      font-size: 20px;
  }
    </style>
   
   
  <div id="m-loading"> 
   
  </div>
  <section id="m-app" v-cloak>
    <!--顶部操作提示-->
    <section class="m-p-action g-box">{{tips}}</section>
   
   
  <button class="close-gobutton">X</button>
   
   
    <!--文件载入-->
    <section class="m-p-input-container">
      <input id="mym3u8val" type="text" v-model="url" :disabled="downloading" placeholder="请输入 m3u8或MP4 链接">
   
      <!--范围查询-->
      <template v-if="!downloading || rangeDownload.isShowRange">
        <div v-if="!rangeDownload.isShowRange" @click="getM3U8(true)">解析下载</div>
        <template v-else>
          <input class="range-input" type="number" v-model="rangeDownload.startSegment" :disabled="downloading" placeholder="起始片段">
          <input class="range-input" type="number" v-model="rangeDownload.endSegment" :disabled="downloading" placeholder="截止片段">
        </template>
      </template>
   
      <!--还未开始下载-->
      <template v-if="!downloading">
        <div @click="getM3U8(false)">原格式下载</div>
        <div @click="getMP4">MP4下载</div>
         <div @click="getPlay">在线播放</div>
      </template>
      <div v-else-if="finishNum === rangeDownload.targetSegment && rangeDownload.targetSegment > 0" class="disable">下载完成</div>
      <div v-else @click="togglePause">{{ isPause ? '恢复下载' : '暂停下载' }}</div>
    </section>
    
   
   
    <template v-if="finishList.length > 0">
      <div class="m-p-line"></div>
      <!-- <div class="m-p-retry" v-if="errorNum && downloadIndex >= rangeDownload.targetSegment" @click="retryAll">重新下载错误片段</div> -->
      <div class="m-p-force" v-if="mediaFileList.length && !streamWriter" @click="forceDownload">强制下载现有片段</div>
      <div class="m-p-tips">待下载碎片总量：{{ rangeDownload.targetSegment }}，已下载：{{ finishNum }}，错误：{{ errorNum }}，进度：{{ (finishNum / rangeDownload.targetSegment * 100).toFixed(2) }}%</div>
      <div class="m-p-tips" :class="[errorNum ? 'error-tips' : '']">若某视频碎片下载发生错误，将标记为红色，可点击相应图标进行重试</div>
      <section class="m-p-segment">
        <div class="item" v-for="(item, index) in finishList" :class="[item.status]" :title="item.title" @click="retry(index)">{{ index + 1 }}</div>
      </section>
    </template>
  </section>
   
   
  `
            $section.style.width = '80%';
            $section.style.height = '80%';
            $section.style.display = 'block';
            $section.style.maxWidth = '900px';
            $section.style.top = '50%';
            $section.style.left = '50%';
            $section.style.position = 'fixed';
            $section.style.zIndex = '999999999991';
            $section.style.backgroundColor = 'white';
            $section.style.transform = 'translate(-50%, -50%)';
            $section.style.borderRadius = '10px';
            $section.style.boxShadow = '0px 0px 20px rgba(0, 0, 0, 0.5)';
            $section.style.overflow = 'auto';
 
            document.body.appendChild($section);
 
 
            //toastr.error('该网站限制了资源加载，已复制该视频链接。请在其他网站页面打开m3u8视频下载菜单进行下载', '', { positionClass: 'toast-top-center', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
 
 
            var app = new Vue({
                el: '#m-app',
 
                data() {
                    return {
                        url: m3u8url, // 在线链接
                        tips: '日租号套餐用户下载视频VIP通道', // 顶部提示 
                        title: '', // 视频标题
                        isPause: false, // 是否暂停下载
                        isGetMP4: false, // 是否转码为 MP4 下载
                        durationSecond: 0, // 视频持续时长
                        isShowRefer: false, // 是否显示推送
                        downloading: false, // 是否下载中
                        beginTime: '', // 开始下载的时间
                        errorNum: 0, // 错误数
                        finishNum: 0, // 已下载数
                        downloadIndex: 0, // 当前下载片段
                        finishList: [], // 下载完成项目
                        tsUrlList: [], // ts URL数组
                        mediaFileList: [], // 下载的媒体数组
                        isSupperStreamWrite: window.streamSaver && !window.streamSaver.useBlobFallback, // 当前浏览器是否支持流式下载
                        streamWriter: null, // 文件流写入器
                        streamDownloadIndex: 0, // 文件流写入器，正准备写入第几个视频片段
                        rangeDownload: { // 特定范围下载
                            isShowRange: false, // 是否显示范围下载
                            startSegment: '', // 起始片段
                            endSegment: '', // 截止片段
                            targetSegment: 1, // 待下载片段
                        },
                        aesConf: { // AES 视频解密配置
                            method: '', // 加密算法
                            uri: '', // key 所在文件路径
                            iv: '', // 偏移值
                            key: '', // 秘钥
                            decryptor: null, // 解码器对象
 
                            stringToBuffer: function (str) {
                                return new TextEncoder().encode(str)
                            },
                        },
                    }
                },
 
                created() {
                    this.getSource();
                    window.addEventListener('keyup', this.onKeyup)
                    setInterval(this.retryAll.bind(this), 2000) // 每两秒重新下载一遍错误片段，实现错误自动重试
                },
 
                beforeDestroy() {
                    window.removeEventListener('keyup', this.onKeyup)
                },
 
                methods: {
                    // 获取链接中携带的资源链接
                    getSource() {
                        let { href } = location
                        if (href.indexOf('?source=') > -1) {
                            this.url = href.split('?source=')[1]
                        }
                    },
 
                    // 获取顶部 window title，因可能存在跨域问题，故使用 try catch 进行保护
                    getDocumentTitle() {
                        let title = document.title;
                        try {
                            title = window.top.document.title
                        } catch (error) {
                            console.log(error)
                        }
                        return title
                    },
 
                    // 退出弹窗
                    onKeyup(event) {
                        var inputBox = document.querySelector('#mym3u8val');
                        if (inputBox && inputBox.style.display !== 'none' && event.keyCode === 13) {
                            this.getM3U8();
                        }
                    },
 
                    // ajax 请求
                    ajax(options) {
                        options = options || {};
                        let xhr = new XMLHttpRequest();
                        if (options.type === 'file') {
                            xhr.responseType = 'arraybuffer';
                        }
 
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4) {
                                let status = xhr.status;
                                if (status >= 200 && status < 300) {
                                    options.success && options.success(xhr.response);
                                } else {
                                    options.fail && options.fail(status);
                                }
                            }
                        };
 
                        xhr.open("GET", options.url, true);
                        xhr.send(null);
                    },
 
                    // 合成URL
                    applyURL(targetURL, baseURL) {
                        baseURL = baseURL || location.href
                        if (targetURL.indexOf('http') === 0) {
                            // 当前页面使用 https 协议时，强制使 ts 资源也使用 https 协议获取
                            if (location.href.indexOf('https') === 0) {
                                return targetURL.replace('http://', 'https://')
                            }
                            return targetURL
                        } else if (targetURL[0] === '/') {
                            let domain = baseURL.split('/')
                            return domain[0] + '//' + domain[2] + targetURL
                        } else {
                            let domain = baseURL.split('/')
                            domain.pop()
                            return domain.join('/') + '/' + targetURL
                        }
                    },
 
                    // 使用流式下载，边下载边保存，解决大视频文件内存不足的难题 
                    streamDownload(isMp4) {
                        var url = this.url;
                        if (url == "") {
                            toastr.error("请先输入 m3u8 链接才能解析下载", '', { positionClass: 'toast-top-center', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
                            return
                        }
                        if (url.toLowerCase().indexOf('m3u8') === -1) {
                            alert('链接有误，请重新输入，必须是以.m3u8结尾的链接')
                            return
                        }
                        this.isGetMP4 = isMp4
                        this.title = new URL(this.url).searchParams.get('title') || this.title // 获取视频标题
                        let fileName = this.title || this.formatTime(new Date(), 'YYYY_MM_DD hh_mm_ss')
                        if (document.title !== 'm3u8 downloader') {
                            fileName = this.getDocumentTitle()
                        }
                        this.streamWriter = window.streamSaver.createWriteStream(`${fileName}.${isMp4 ? 'mp4' : 'ts'}`).getWriter()
                        this.getM3U8()
                    },
 
                    // 解析为 mp4 下载
                    getMP4() {
                        this.isGetMP4 = true;
 
                        this.getM3U8();
 
                    },
                    getPlay() {
                        if (this.url == "") {
                            toastr.error("请先输入 m3u8 链接才能解析播放", '', { positionClass: 'toast-top-center', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
                            return
                        }
 
                        Playm3u8(this.url);
                    },
                    // 获取在线文件
                    getM3U8(onlyGetRange) {
                        if (!this.url) {
                            alert('请输入链接')
                            return
                        }
                        if (this.url.toLowerCase().indexOf('.mp4') > 0) {
                            var mp4url = this.url;
                            toastr.success('正在后台下载，请稍后。', '', { positionClass: 'toast-bottom-right', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
                            GM_download({
                                url: mp4url,
                                name: getFileNameFromUrl(mp4url),
                                saveAs: false,
                                onload: function () {
                                    toastr.success('下载完成', '', { positionClass: 'toast-bottom-right', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
 
                                },
                                onerror: function (err) {
                                    console.error('下载失败' + err, err);
                                }
                            });
                            return
                        }
                        if (this.url.toLowerCase().indexOf('m3u8') === -1) {
                            alert('链接有误，请重新输入')
                            return
                        }
                        if (this.downloading) {
                            alert('资源下载中，请稍后')
                            return
                        }
 
                        // 在下载页面才触发，代码注入的页面不需要校验
                        // 当前协议不一致，切换协议
                        if (location.href.indexOf('blog.luckly-mjw.cn') > -1 && this.url.indexOf(location.protocol) === -1) {
                            //alert('当前协议不一致，跳转至正确页面重新下载')
                            location.href = `${this.url.split(':')[0]}://blog.luckly-mjw.cn/tool-show/m3u8-downloader/index.html?source=${this.url}`
                            return
                        }
 
                        // 在下载页面才触发，修改页面 URL，携带下载路径，避免刷新后丢失
                        if (location.href.indexOf('blog.luckly-mjw.cn') > -1) {
                            window.history.replaceState(null, '', `${location.href.split('?')[0]}?source=${this.url}`)
                        }
 
                        this.title = new URL(this.url).searchParams.get('title') || this.title // 获取视频标题
                        this.tips = 'm3u8 文件下载中，请稍后'
                        this.beginTime = new Date()
                        this.ajax({
                            url: this.url,
                            success: (m3u8Str) => {
                                this.tsUrlList = []
                                this.finishList = []
 
                                // 提取 ts 视频片段地址
                                m3u8Str.split('\n').forEach((item) => {
                                    // if (/.(png|image|ts|jpg|mp4|jpeg)/.test(item)) {
                                    // 放开片段后缀限制，下载非 # 开头的链接片段
                                    if (/^[^#]/.test(item)) {
                                        console.log(item)
                                        this.tsUrlList.push(this.applyURL(item, this.url))
                                        this.finishList.push({
                                            title: item,
                                            status: ''
                                        })
                                    }
                                })
 
                                // 仅获取视频片段数
                                if (onlyGetRange) {
                                    this.rangeDownload.isShowRange = true
                                    this.rangeDownload.endSegment = this.tsUrlList.length
                                    this.rangeDownload.targetSegment = this.tsUrlList.length
                                    return
                                } else {
                                    let startSegment = Math.max(this.rangeDownload.startSegment || 1, 1) // 最小为 1
                                    let endSegment = Math.max(this.rangeDownload.endSegment || this.tsUrlList.length, 1)
                                    startSegment = Math.min(startSegment, this.tsUrlList.length) // 最大为 this.tsUrlList.length
                                    endSegment = Math.min(endSegment, this.tsUrlList.length)
                                    this.rangeDownload.startSegment = Math.min(startSegment, endSegment)
                                    this.rangeDownload.endSegment = Math.max(startSegment, endSegment)
                                    this.rangeDownload.targetSegment = this.rangeDownload.endSegment - this.rangeDownload.startSegment + 1
                                    this.downloadIndex = this.rangeDownload.startSegment - 1
                                    this.downloading = true
                                }
 
                                // 获取需要下载的 MP4 视频长度
                                if (this.isGetMP4) {
                                    let infoIndex = 0
                                    m3u8Str.split('\n').forEach(item => {
                                        if (item.toUpperCase().indexOf('#EXTINF:') > -1) { // 计算视频总时长，设置 mp4 信息时使用
                                            infoIndex++
                                            if (this.rangeDownload.startSegment <= infoIndex && infoIndex <= this.rangeDownload.endSegment) {
                                                this.durationSecond += parseFloat(item.split('#EXTINF:')[1])
                                            }
                                        }
                                    })
                                }
 
                                // 检测视频 AES 加密
                                if (m3u8Str.indexOf('#EXT-X-KEY') > -1) {
                                    this.aesConf.method = (m3u8Str.match(/(.*METHOD=([^,\s]+))/) || ['', '', ''])[2]
                                    this.aesConf.uri = (m3u8Str.match(/(.*URI="([^"]+))"/) || ['', '', ''])[2]
                                    this.aesConf.iv = (m3u8Str.match(/(.*IV=([^,\s]+))/) || ['', '', ''])[2]
                                    this.aesConf.iv = this.aesConf.iv ? this.aesConf.stringToBuffer(this.aesConf.iv) : ''
                                    this.aesConf.uri = this.applyURL(this.aesConf.uri, this.url)
 
                                    // let params = m3u8Str.match(/#EXT-X-KEY:([^,]*,?METHOD=([^,]+))?([^,]*,?URI="([^,]+)")?([^,]*,?IV=([^,^\n]+))?/)
                                    // this.aesConf.method = params[2]
                                    // this.aesConf.uri = this.applyURL(params[4], this.url)
                                    // this.aesConf.iv = params[6] ? this.aesConf.stringToBuffer(params[6]) : ''
                                    this.getAES();
                                } else if (this.tsUrlList.length > 0) { // 如果视频没加密，则直接下载片段，否则先下载秘钥
                                    this.downloadTS()
                                } else {
                                    this.alertError('资源为空，请查看链接是否有效')
                                }
                            },
                            fail: () => {
                                this.alertError('链接不正确，请查看链接是否有效')
                            }
                        })
                    },
 
                    // 获取AES配置
                    getAES() {
                        // alert('视频被 AES 加密，点击确认，进行视频解码')
                        this.ajax({
                            type: 'file',
                            url: this.aesConf.uri,
                            success: (key) => {
                                // console.log('getAES', key)
                                // this.aesConf.key = this.aesConf.stringToBuffer(key)
                                this.aesConf.key = key
                                this.aesConf.decryptor = new AESDecryptor()
                                this.aesConf.decryptor.constructor()
                                this.aesConf.decryptor.expandKey(this.aesConf.key);
                                this.downloadTS()
                            },
                            fail: () => {
                                this.alertError('视频已加密，可试用右下角入口的「无差别提取工具」')
                            }
                        })
                    },
 
                    // ts 片段的 AES 解码
                    aesDecrypt(data, index) {
                        let iv = this.aesConf.iv || new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, index])
                        return this.aesConf.decryptor.decrypt(data, 0, iv.buffer || iv, true)
                    },
 
                    // 下载分片
                    downloadTS() {
                        this.tips = 'ts 视频碎片下载中，请稍后'
                        let download = () => {
                            let isPause = this.isPause // 使用另一个变量来保持下载前的暂停状态，避免回调后没修改
                            let index = this.downloadIndex
                            if (index >= this.rangeDownload.endSegment) {
                                return
                            }
                            this.downloadIndex++
                            if (this.finishList[index] && this.finishList[index].status === '') {
                                this.finishList[index].status = 'downloading'
                                this.ajax({
                                    url: this.tsUrlList[index],
                                    type: 'file',
                                    success: (file) => {
                                        this.dealTS(file, index, () => this.downloadIndex < this.rangeDownload.endSegment && !isPause && download())
                                    },
                                    fail: () => {
                                        this.errorNum++
                                        this.finishList[index].status = 'error'
                                        if (this.downloadIndex < this.rangeDownload.endSegment) {
                                            !isPause && download()
                                        }
                                    }
                                })
                            } else if (this.downloadIndex < this.rangeDownload.endSegment) { // 跳过已经成功的片段
                                !isPause && download()
                            }
                        }
 
                        // 建立多少个 ajax 线程
                        for (let i = 0; i < Math.min(6, this.rangeDownload.targetSegment - this.finishNum); i++) {
                            download()
                        }
                    },
 
                    // 处理 ts 片段，AES 解密、mp4 转码
                    dealTS(file, index, callback) {
                        const data = this.aesConf.uri ? this.aesDecrypt(file, index) : file
                        this.conversionMp4(data, index, (afterData) => { // mp4 转码
                            this.mediaFileList[index - this.rangeDownload.startSegment + 1] = afterData // 判断文件是否需要解密
                            this.finishList[index].status = 'finish'
                            this.finishNum++
                            if (this.streamWriter) {
                                for (let index = this.streamDownloadIndex; index < this.mediaFileList.length; index++) {
                                    if (this.mediaFileList[index]) {
                                        this.streamWriter.write(new Uint8Array(this.mediaFileList[index]))
                                        this.mediaFileList[index] = null
                                        this.streamDownloadIndex = index + 1
                                    } else {
                                        break
                                    }
                                }
                                if (this.streamDownloadIndex >= this.rangeDownload.targetSegment) {
                                    this.streamWriter.close()
                                }
                            } else if (this.finishNum === this.rangeDownload.targetSegment) {
                                let fileName = this.title || this.formatTime(this.beginTime, 'YYYY_MM_DD hh_mm_ss')
                                if (document.title !== 'm3u8 downloader') {
                                    fileName = this.getDocumentTitle()
                                }
                                this.downloadFile(this.mediaFileList, fileName)
                            }
                            callback && callback()
                        })
                    },
 
                    // 转码为 mp4
                    conversionMp4(data, index, callback) {
                        if (this.isGetMP4) {
                            let transmuxer = new muxjs.Transmuxer({
                                keepOriginalTimestamps: true,
                                duration: parseInt(this.durationSecond),
                            });
                            transmuxer.on('data', segment => {
                                if (index === this.rangeDownload.startSegment - 1) {
                                    let data = new Uint8Array(segment.initSegment.byteLength + segment.data.byteLength);
                                    data.set(segment.initSegment, 0);
                                    data.set(segment.data, segment.initSegment.byteLength);
                                    callback(data.buffer)
                                } else {
                                    callback(segment.data)
                                }
                            })
                            transmuxer.push(new Uint8Array(data));
                            transmuxer.flush();
                        } else {
                            callback(data)
                        }
                    },
 
                    // 暂停与恢复
                    togglePause() {
                        this.isPause = !this.isPause
                        !this.isPause && this.retryAll(true)
                    },
 
                    // 重新下载某个片段
                    retry(index) {
                        if (this.finishList[index].status === 'error') {
                            this.finishList[index].status = ''
                            this.ajax({
                                url: this.tsUrlList[index],
                                type: 'file',
                                success: (file) => {
                                    this.errorNum--
                                    this.dealTS(file, index)
                                },
                                fail: () => {
                                    this.finishList[index].status = 'error'
                                }
                            })
                        }
                    },
 
                    // 重新下载所有错误片段
                    retryAll(forceRestart) {
 
                        if (!this.finishList.length || this.isPause) {
                            return
                        }
 
                        let firstErrorIndex = this.downloadIndex // 没有错误项目，则每次都递增
                        this.finishList.forEach((item, index) => { // 重置所有错误片段状态
                            if (item.status === 'error') {
                                item.status = ''
                                firstErrorIndex = Math.min(firstErrorIndex, index)
                            }
                        })
                        this.errorNum = 0
                        // 已经全部下载进程都跑完了，则重新启动下载进程
                        if (this.downloadIndex >= this.rangeDownload.endSegment || forceRestart) {
                            this.downloadIndex = firstErrorIndex
                            this.downloadTS()
                        } else { // 否则只是将下载索引，改为最近一个错误的项目，从那里开始遍历
                            this.downloadIndex = firstErrorIndex
                        }
                    },
 
                    // 下载整合后的TS文件
                    downloadFile(fileDataList, fileName) {
                        this.tips = 'ts 碎片整合中，请留意浏览器下载'
                        let fileBlob = null
                        let a = document.createElement('a')
                        if (this.isGetMP4) {
                            fileBlob = new Blob(fileDataList, { type: 'video/mp4' }) // 创建一个Blob对象，并设置文件的 MIME 类型
                            a.download = fileName + '.mp4'
                        } else {
                            fileBlob = new Blob(fileDataList, { type: 'video/MP2T' }) // 创建一个Blob对象，并设置文件的 MIME 类型
                            a.download = fileName + '.ts'
                        }
                        a.href = URL.createObjectURL(fileBlob)
                        a.style.display = 'none'
                        document.body.appendChild(a)
                        a.click()
                        a.remove()
                    },
 
                    // 格式化时间
                    formatTime(date, formatStr) {
                        const formatType = {
                            Y: date.getFullYear(),
                            M: date.getMonth() + 1,
                            D: date.getDate(),
                            h: date.getHours(),
                            m: date.getMinutes(),
                            s: date.getSeconds(),
                        }
                        return formatStr.replace(
                            /Y+|M+|D+|h+|m+|s+/g,
                            target => (new Array(target.length).join('0') + formatType[target[0]]).substr(-target.length)
                        )
                    },
 
                    // 强制下载现有片段
                    forceDownload() {
                        if (this.mediaFileList.length) {
                            let fileName = this.title || this.formatTime(this.beginTime, 'YYYY_MM_DD hh_mm_ss')
                            if (document.title !== 'm3u8 downloader') {
                                fileName = this.getDocumentTitle()
                            }
                            this.downloadFile(this.mediaFileList, fileName)
                        } else {
                            alert('当前无已下载片段')
                        }
                    },
 
                    // 发生错误，进行提示
                    alertError(tips) {
                        alert(tips)
                        this.downloading = false
                        this.tips = '日租号套餐用户下载视频VIP通道';
                    },
 
 
                }
            })
 
 
 
        }
        $("body").on('click', '.close-gobutton', function () {
            $("#down-my-section").remove();
        })
 
        function Playm3u8(url) {
            let videoFormat = url.split('.').pop().toLowerCase();
 
            // 判断视频格式是否是网络常见的在线视频格式
            let supportedFormats = ['mp4', 'm3u8', 'webm', 'ogg'];
            if (!supportedFormats.includes(videoFormat)) {
                toastr.error("不支持的视频格式", '', { positionClass: 'toast-top-center', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
                return;
            }
 
            $('<div id="floating-video-player"></div>').css({
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                height: '80%',
                zIndex: 999999999992,
                maxWidth: '800px',
                maxHeight: '600px',
                padding: 0
            }).append(
                $('<video></video>').attr({
                    width: '80%',
                    autoplay: 'autoplay',
                    controls: 'controls',
                    muted: 'muted'
                }).css({
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'calc(100% - 2px)',
                    borderRadius: '5px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
                }).append(
                    $('<source></source>').attr({
                        src: url,
                        type: 'application/x-mpegURL'
                    })
                ),
                $('<button>X</button>').css({ // 关闭按钮
                    position: 'absolute',
                    top: '10px',
                    right: '60px',
                    border: 'none',
                    backgroundColor: '#757575',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                    zIndex: 10000,
                    width: '40px',
                    height: '40px',
                }).click(function () {
                    $('#floating-video-player').hide();
                    $('body').css('overflow', 'auto');
                    $('#floating-video-player').remove();
                }),
                $('<div></div>').css({ // 倍速和画中画按钮容器
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    display: 'flex',
                    alignItems: 'center',
                }).append(
                    $('<button>&lt;</button>').css({ // 倍速减少按钮
                        border: 'none',
                        backgroundColor: '#757575',
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                        width: '40px',
                        height: '40px',
                        marginRight: '10px',
                    }).click(function () {
                        video.playbackRate -= 0.25;
                        toastr.info("当前倍速：" + video.playbackRate.toFixed(2), '', { positionClass: 'toast-top-center', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
                    }),
                    $('<button>&gt;</button>').css({ // 倍速增加按钮
                        border: 'none',
                        backgroundColor: '#757575',
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                        width: '40px',
                        height: '40px',
                        marginRight: '10px',
                    }).click(function () {
                        video.playbackRate += 0.25;
                        toastr.info("当前倍速：" + video.playbackRate.toFixed(2), '', { positionClass: 'toast-top-center', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
                    }),
                    $('<button>&#9874; 画中画</button>').css({ // 画中画按钮
                        border: 'none',
                        backgroundColor: '#757575',
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                        width: '120px',
                        height: '40px',
                    }).click(function () {
                        if (video !== document.pictureInPictureElement) {
                            video.requestPictureInPicture();
                        } else {
                            document.exitPictureInPicture();
                        }
                    })
                )
            ).appendTo('body');
 
            // 播放器相关样式
            GM_addStyle('#floating-video-player video { display: block; }');
 
            // 监听页面中的链接，自动播放视频
            $(document).one('mousedown touchstart keydown', function () {
                // 取消静音并播放视频
                video.prop('muted', false)[0].play();
            });
 
            var videoContainer = $('#floating-video-player');
            var video = videoContainer.find('video')[0];
 
            // 根据视频格式选择播放器
            if (videoFormat === 'm3u8') {
                // 使用 HLS.js 播放 m3u8 格式的视频
                if (Hls.isSupported()) {
                    var hls = new Hls();
                    hls.loadSource(url);
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED, function () {
                        video.play();
                        videoContainer.show();
                        $('body').css('overflow', 'hidden');
                    });
                } else {
                    toastr.error("浏览器不受支持", '', { positionClass: 'toast-top-center', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
                }
            } else if (videoFormat === 'mp4' && video.canPlayType && video.canPlayType('video/mp4')) {
                // 使用原生视频播放器播放 mp4 格式的视频
                video.setAttribute('src', url);
                video.play();
                videoContainer.show();
                $('body').css('overflow', 'hidden');
            }
        }
 
    });
 
 
})();