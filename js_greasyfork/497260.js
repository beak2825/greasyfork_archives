// ==UserScript==
// @name         淘呀号解析
// @namespace    http://gv1069.vip/
// @version      2.2
// @description  该版本是主版本，适用于安卓端和电脑端，苹果设备请勿安装该版本。
// @author       淘呀号团队
// @match        *://*/*
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
// @exclude      http://gv1069.vip/*
// @exclude      https://www.yuque.com/*
// @exclude      https://yuque.com/*
// @exclude      http://www.gv1069.vip/*
// @exclude      https://m3u8play.com/*
// @exclude      https://www.m3u8play.com/*
// @exclude      https://greasyfork.org/*
// @exclude      https://www.greasyfork.org/*
// @require      https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @require      https://cdn.staticfile.org/toastr.js/2.1.4/toastr.min.js
// @require      https://cdn.staticfile.org/jquery.qrcode/1.0/jquery.qrcode.min.js
// @require      https://cdn.staticfile.org/sweetalert/2.1.2/sweetalert.min.js
// @require      https://greasyfork.org/scripts/469053-jsqr/code/jsQR.js?version=1207999
 
// @require      https://lib.baomitu.com/m3u8-parser/4.7.1/m3u8-parser.min.js
// @require      https://greasyfork.org/scripts/468518-addqrcode/code/addqrcode.js?version=1204970
 
// @require      https://update.greasyfork.org/scripts/468541/1282371/ADDimgdown.js
 
 
// @require      https://cdn.staticfile.org/vue/2.6.1/vue.js
// @require      https://greasyfork.org/scripts/468820-m3u8-hls/code/m3u8-hls.js?version=1206200
// @require      https://greasyfork.org/scripts/468821-mux-mp4/code/mux-mp4.js?version=1206201
// @require      https://greasyfork.org/scripts/469054-streamsaver/code/StreamSaver.js?version=1208001
// @require      https://cdn.staticfile.org/hls.js/1.4.6/hls.min.js
// @require      https://update.greasyfork.org/scripts/469703/1296888/kxtool.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497260/%E6%B7%98%E5%91%80%E5%8F%B7%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/497260/%E6%B7%98%E5%91%80%E5%8F%B7%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    // 定义登录 API 地址
    var yitongkanBase = "http://api.gv1069.vip";
 
    var value = "450";
 
    var valueGao = "900";
    var valueChao = "1800";
    var valueJiu = "400";
    var m3u8Url = "";
 
 
    // 在页面加载时创建登录弹框
    window.addEventListener('load', function () {
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
`);
        // 创建加载中的遮罩层
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'gm-loading-overlay';
        loadingOverlay.innerHTML = '<div>正在解析一同看资源，请稍后...</div>';
        document.body.appendChild(loadingOverlay);
 
        const logoutButton = document.createElement('button');
        logoutButton.innerText = '日租号专用退出登录按钮（切换账户时请点我）';
        logoutButton.style.margin = '30px 50px'; // 调整按钮与div的间距
        logoutButton.style.height = '70px';
        logoutButton.style.width = '300px';
        logoutButton.style.cursor = 'pointer';
        logoutButton.addEventListener('click', logout);
 
        // 寻找具有id为homeso的div
        const homesoDiv = document.getElementById('homeso');
 
        // 将按钮插入到div下方
        if (homesoDiv) {
            homesoDiv.appendChild(logoutButton);
        } else {
            console.warn('找不到具有id为homeso的div。');
        }
 
        // 处理退出登录的逻辑，根据实际情况修改
        function logout() {
            GM_setValue("YTToken", "");
            GM_setValue('username', "");
            GM_setValue('password', "");
 
            // 刷新页面或跳转到登录页
            location.reload();
        }
 
 
        // 显示加载中
        function showLoading() {
            loadingOverlay.style.display = 'flex';
            loadingOverlay.style.zIndex = 9999;
        }
 
        // 隐藏加载中
        function hideLoading() {
            loadingOverlay.style.display = 'none';
            loadingOverlay.style.zIndex = -1;
        }
 
 
        // Create a modal container
        const modalContainer = document.createElement('div');
        modalContainer.id = 'customLoginModal';
        modalContainer.style.display = 'none';
        document.body.appendChild(modalContainer);
 
        // Create the login box
        const loginBox = document.createElement('div');
        loginBox.id = 'loginBox';
        loginBox.innerHTML = `
        <h2>日租号专用登录通道</h2>
        <h3 style="margin-top:5px;color:red;">(请勿在一同看的登录框登录！！！不要手输账户名密码！！！)</h3>
        <h4 style="margin-top:5px;color:red;">(请通过租号网址提供的蓝色复制按钮复制账户名密码并且确保只装了一个解析脚本，否则会一直提示登录)</h4>
        <h4 style="margin-top:5px;color:red;">(如果忘记，请前往gv1069.vip的综合服务窗口找回)</h4>
        <form style="margin-top:20px;">
            <label for="username">用户名:</label>
            <input type="text" id="username" name="username" required><br>
 
            <label for="password" style="margin-top:10px;">密码:</label>
            <input type="password" id="password" name="password" required><br>
 
            <button id="submitBtn" style="margin-top:10px;">登录</button>
        </form>
    `;
        // Create close button
        const closeButton = document.createElement('span');
        closeButton.id = 'closeButton';
        closeButton.innerHTML = '&times;';
        closeButton.style.position = 'relative';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '50px';
        closeButton.style.color = '#000';
 
        // Append close button to login box
        loginBox.appendChild(closeButton);
 
        modalContainer.appendChild(loginBox);
 
        // Add click event to close button
        closeButton.addEventListener('click', function () {
            modalContainer.style.display = 'none';
        });
 
        // Show the login box
        function openLoginBox() {
            modalContainer.style.display = 'flex';
        }
 
        // Close the login box
        function closeLoginBox() {
            modalContainer.style.display = 'none';
        }
 
        var token = GM_getValue("YTToken");
        var username = GM_getValue("username");
        var password = GM_getValue("password");
 
        // 查找具有指定 class 的所有 UL 标签
        var ulElements = document.querySelectorAll('ul.list.g-clear');
 
        if (ulElements) {
            // 创建加载中的遮罩层
            const loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'gm-loading-overlay';
            loadingOverlay.innerHTML = '<div>正在解析一同看资源，请稍后...</div>';
            document.body.appendChild(loadingOverlay);
            if (token == null || token == "") {
                showLoginPrompt();
            }
 
        }
 
        // 遍历每个 UL 元素
        ulElements.forEach(function (ulElement) {
            // 遍历 UL 元素中的每个 LI 元素
            ulElement.querySelectorAll('li').forEach(function (liElement, index) {
                // 查找 LI 元素中的 A 标签
                var aElement = liElement.querySelector('a');
 
                // 在 LI 元素上增加高度
                liElement.style.height = 600 + 'px';
 
                // 创建播放按钮
                var playButton1 = document.createElement('button');
                playButton1.innerText = '点我播放（请勿点击上方图片文字）';
                playButton1.style.height = '70px'; // 50px 是你想要设置的高度
 
                // 创建播放按钮
                var playButton5 = document.createElement('button');
                playButton5.innerText = '标清视频下载';
                playButton5.style.height = '35px'; // 50px 是你想要设置的高度
                playButton5.style.marginTop = '10px';
 
                // 创建播放按钮
                var playButton6 = document.createElement('button');
                playButton6.innerText = '标清视频下载（仅针对早期视频）';
                playButton6.style.height = '35px'; // 50px 是你想要设置的高度
                playButton6.style.marginTop = '10px';
 
                // 创建播放按钮
                var playButton7 = document.createElement('button');
                playButton7.innerText = '高清视频下载';
                playButton7.style.height = '35px'; // 50px 是你想要设置的高度
                playButton7.style.marginTop = '10px';
 
                // 创建播放按钮
                var playButton8 = document.createElement('button');
                playButton8.innerText = '超清视频下载';
                playButton8.style.height = '35px'; // 50px 是你想要设置的高度
                playButton8.style.marginTop = '10px';
 
 
                // 添加点击事件监听器（默认标清播放）
                playButton1.addEventListener('click', function (event) {
                    console.log(aElement.href.split('/')[3] )
                    showLoading(); // 显示加载中
                    if (token == null || token == "") {
                        var result = confirm("您未登录，请在日租号专用登录通道进行登录！请勿在一同看官方界面登录！点击“确定”按钮前往专用登录通道！");
                        if (result) {
                            window.location.reload();
                        }
                        hideLoading(); // 隐藏加载中
 
                    } else {
                        hideLoading(); // 隐藏加载中
 
                        const tempPage = window.open('loading page');
                        
                        tempPage.addEventListener('load', function() {
                                // 重定向到目标页面
                                GM.xmlHttpRequest({
                                    method: 'GET',
                                    url: yitongkanBase+"/yitong/get-video-page?video_link=" + aElement.href +"&token=" + token,
                                    onload: function(response) {
                                        const data=JSON.parse(response.responseText)
                                        if (data.success && data.content != null && data.content != "") {
                                            
                                            let strings = data.content.match(/(url: ')[^\\s]+/g)
                                            let m3u8Url = strings[0].split("'")[1]
                                            
                                            GM.xmlHttpRequest({
                                                method: 'GET',
                                                url: yitongkanBase+"/yitong/update-fresh-code?expire_time=" + m3u8Url.split("/")[1] + "&fresh_flag=" + m3u8Url.split("/")[2],
                                                onload: function(response) {
                                                    }
                                                });
                                                
                                            let updatedString = data.content
                                                            .replace('document.body.appendChild(dom);', '')
                                            // 替换当前页面的内容
                                            tempPage.document.open();
                                            tempPage.document.write(updatedString);
                                            tempPage.document.close();
                                        }else if (data.message == "2") {
                                            GM_setValue("YTToken", "");
                                            GM_setValue('username', "");
                                            GM_setValue('password', "");                
                                            var result = confirm("该账户已过期，请您重新购买或者取号！点击“确定”按钮自动跳转至购买界面！");
                                            if (result) {
                                                window.location.href = "http://gv1069.vip/#/shop-account";
                                            }

                                        } else if (data.message == "3") {
                                            GM_setValue("YTToken", "");
                                            GM_setValue('username', "");
                                            GM_setValue('password', "");
                                            var result = confirm("请您重新登录！");
                                            if (result) {
                                                window.location.reload();
                                            }
                                        } else if (data.message == "4" || data.message == "5") {
                                            GM_setValue("YTToken", "");
                                            GM_setValue('username', "");
                                            GM_setValue('password', "");
                                            var result = confirm("请您重新登录！");
                                            if (result) {
                                                window.location.reload();
                                            }

                                        } else if (data.message == "6") {
                                            GM_setValue("YTToken", "");
                                            GM_setValue('username', "");
                                            GM_setValue('password', "");
                                            var result = confirm("您的账号在另一台设备上登录，请重新登录");
                                            if (result) {
                                                window.location.reload();
                                            }
                                        } else {
                                            alert('解析失败，请点击播放按钮重试！');
                                        }
                                    }
                                });
                            });  
                    }
 
                });
 
                // 添加点击事件监听器（超清下载）
                playButton8.addEventListener('click', function (event) {
                    showLoading(); // 显示加载中
                    if (token == null || token == "" || username == "" || password == "") {
                        var result = confirm("您未登录，请在日租号专用登录通道进行登录！请勿在一同看官方界面登录！点击“确定”按钮前往专用登录通道！");
                        if (result) {
                            window.location.reload();
                        }
                        hideLoading(); // 隐藏加载中
 
                    } else {
                        GM.xmlHttpRequest({
                            method: 'GET',
                            url: yitongkanBase + "/pay/is-taocan?account=" + GM_getValue("username"),
                            onload: function (responseAccount) {
                                const responseDataAccount = JSON.parse(responseAccount.responseText);
                                if (responseDataAccount.content) {
 
                                    // 在这里发送 GET 请求
                                    GM.xmlHttpRequest({
                                        method: 'GET',
                                        url: yitongkanBase + "/yitong/get-m3u8-url?link=" + aElement.href.split('/')[3] + "&token=" + token,  // 替换为你的 API 地址
                                        onload: function (response) {
                                            const responseData = JSON.parse(response.responseText);
                                            if (responseData.success && responseData.content != null && responseData.content != "") {
                                                //后端通过message来区别是返回的是已经处理好的freshCode，还是从新请求的freshCode,0表示缓存fresh，1表示新的
                                                if (responseData.message == "1") {
                                                    let strings = responseData.content.match(/(url: ')[^\\s]+/g)
                                                    m3u8Url = strings[0].split("'")[1].replace("450", valueChao)
                                                    // /1693210723/d33e53edfbf7428b7da27417ead06231/data/d9927e3e380ea1c497f78fb5420bbfae/450/index.m3u8
                                                    GM.xmlHttpRequest({
                                                        method: 'GET',
                                                        url: yitongkanBase + "/yitong/update-fresh-code?expire_time=" + m3u8Url.split("/")[1] + "&fresh_flag=" + m3u8Url.split("/")[2],  // 替换为你的 API 地址
                                                        onload: function (response1) {
 
                                                            // 处理响应
                                                            const responseData1 = JSON.parse(response1.responseText);
                                                            console.log(responseData1.content)
                                                        },
                                                        onerror: function (error1) {
                                                            // 处理错误
                                                            console.error(error1);
                                                        }
 
                                                    });
                                                } else if (responseData.message == "0") {
                                                    //下次修改后端代码再改成默认流畅
                                                    m3u8Url = responseData.content.replace("1800", valueChao)
                                                }
 
                                                sectionm3u8menu("https://" + window.location.href.split('/')[2] + m3u8Url);
                                                hideLoading(); // 隐藏加载中
                                                // window.location.href = "https://tools.liumingye.cn/m3u8/#" + window.location.href + m3u8Url;
                                                // w!.location.href = "https://tools.liumingye.cn/m3u8/#" + baseUrl.value + m3u8Url;
 
                                            } else if (responseData.message == "2") {
                                                hideLoading(); // 隐藏加载中
                                                // message.error("账户过期，请重新购买")
                                                GM_setValue("YTToken", "");
                                                GM_setValue('username', "");
                                                GM_setValue('password', "");
                                                var result = confirm("该账户已过期，请您重新购买或者取号！点击“确定”按钮自动跳转至购买界面！");
                                                if (result) {
                                                    window.location.href = "http://gv1069.vip/#/shop-account";
                                                }
 
                                            } else if (responseData.message == "3") {
                                                hideLoading(); // 隐藏加载中
                                                GM_setValue("YTToken", "");
                                                GM_setValue('username', "");
                                                GM_setValue('password', "");
                                                var result = confirm("请您重新登录！点击“确定”按钮自动弹出登录输入框！");
                                                if (result) {
                                                    window.location.reload();
                                                }
                                            } else if (responseData.message == "4" || responseData.message == "5") {
                                                hideLoading(); // 隐藏加载中
                                                GM_setValue("YTToken", "");
                                                GM_setValue('username', "");
                                                GM_setValue('password', "");
                                                var result = confirm("请您重新登录！点击“确定”按钮自动弹出登录输入框！");
                                                if (result) {
                                                    window.location.reload();
                                                }
 
                                            } else if (responseData.message == "6") {
                                                hideLoading(); // 隐藏加载中
                                                GM_setValue("YTToken", "");
                                                GM_setValue('username', "");
                                                GM_setValue('password', "");
                                                var result = confirm("您的账号在另一台设备上登录，请重新登录");
                                                if (result) {
                                                    window.location.reload();
                                                }
                                            } else {
                                                hideLoading(); // 隐藏加载中
                                                alert('解析失败，请点击播放按钮重试！');
                                            }
                                        },
                                        onerror: function (error) {
                                            hideLoading(); // 隐藏加载中
                                            // 处理错误
                                            console.error(error);
                                            alert('解析失败，请点击播放按钮重试！');
                                        }
                                    });
                                } else {
                                    hideLoading(); // 隐藏加载中
                                    var result = confirm("抱歉，默认只支持标清播放，高清、超清和视频下载功能仅支持套餐内的日租号体验，如需体验请前往租号网址gv1069.vip购买非1.9元套餐！套餐中的日租号随用随取，不限制取号间隔时间，不用的话永不失效，日租号套餐比单个买日租号更划算，按天使用更合理！如需了解详细信息，请仔细阅读购前须知！");
                                    if (result) {
                                        window.location.href = "http://gv1069.vip/#/shop-account";
                                    }
                                }
                            }
 
                        })
 
                    }
 
                });
 
                // 添加点击事件监听器（早期标清视频下载）
                playButton6.addEventListener('click', function (event) {
                    showLoading(); // 显示加载中
                    if (token == null || token == "" || username == "" || password == "") {
                        var result = confirm("您未登录，请在日租号专用登录通道进行登录！请勿在一同看官方界面登录！点击“确定”按钮前往专用登录通道！");
                        if (result) {
                            window.location.reload();
                        }
                        hideLoading(); // 隐藏加载中
 
                    } else {
                        GM.xmlHttpRequest({
                            method: 'GET',
                            url: yitongkanBase + "/pay/is-taocan?account=" + GM_getValue("username"),
                            onload: function (responseAccount) {
                                const responseDataAccount = JSON.parse(responseAccount.responseText);
                                if (responseDataAccount.content) {
                                    // 在这里发送 GET 请求
                                    GM.xmlHttpRequest({
                                        method: 'GET',
                                        url: yitongkanBase + "/yitong/get-m3u8-url?link=" + aElement.href.split('/')[3] + "&token=" + token,  // 替换为你的 API 地址
                                        onload: function (response) {
                                            const responseData = JSON.parse(response.responseText);
                                            if (responseData.success && responseData.content != null && responseData.content != "") {
                                                //后端通过message来区别是返回的是已经处理好的freshCode，还是从新请求的freshCode,0表示缓存fresh，1表示新的
                                                if (responseData.message == "1") {
                                                    let strings = responseData.content.match(/(url: ')[^\\s]+/g)
                                                    m3u8Url = strings[0].split("'")[1].replace("450", valueJiu)
                                                    // /1693210723/d33e53edfbf7428b7da27417ead06231/data/d9927e3e380ea1c497f78fb5420bbfae/450/index.m3u8
                                                    GM.xmlHttpRequest({
                                                        method: 'GET',
                                                        url: yitongkanBase + "/yitong/update-fresh-code?expire_time=" + m3u8Url.split("/")[1] + "&fresh_flag=" + m3u8Url.split("/")[2],  // 替换为你的 API 地址
                                                        onload: function (response1) {
 
                                                            // 处理响应
                                                            const responseData1 = JSON.parse(response1.responseText);
                                                            console.log(responseData1.content)
                                                        },
                                                        onerror: function (error1) {
                                                            // 处理错误
                                                            console.error(error1);
                                                        }
 
                                                    });
                                                } else if (responseData.message == "0") {
                                                    //下次修改后端代码再改成默认流畅
                                                    m3u8Url = responseData.content.replace("1800", valueJiu)
                                                }
 
                                                sectionm3u8menu("https://" + window.location.href.split('/')[2] + m3u8Url);
                                                hideLoading(); // 隐藏加载中
                                                // window.location.href = "https://tools.liumingye.cn/m3u8/#" + window.location.href + m3u8Url;
                                                // w!.location.href = "https://tools.liumingye.cn/m3u8/#" + baseUrl.value + m3u8Url;
 
                                            } else if (responseData.message == "2") {
                                                hideLoading(); // 隐藏加载中
                                                // message.error("账户过期，请重新购买")
                                                GM_setValue("YTToken", "");
                                                GM_setValue('username', "");
                                                GM_setValue('password', "");
                                                var result = confirm("该账户已过期，请您重新购买或者取号！点击“确定”按钮自动跳转至购买界面！");
                                                if (result) {
                                                    window.location.href = "http://gv1069.vip/#/shop-account";
                                                }
 
                                            } else if (responseData.message == "3") {
                                                hideLoading(); // 隐藏加载中
                                                GM_setValue("YTToken", "");
                                                GM_setValue('username', "");
                                                GM_setValue('password', "");
                                                var result = confirm("请您重新登录！点击“确定”按钮自动弹出登录输入框！");
                                                if (result) {
                                                    window.location.reload();
                                                }
                                            } else if (responseData.message == "4" || responseData.message == "5") {
                                                hideLoading(); // 隐藏加载中
                                                GM_setValue("YTToken", "");
                                                GM_setValue('username', "");
                                                GM_setValue('password', "");
                                                var result = confirm("请您重新登录！点击“确定”按钮自动弹出登录输入框！");
                                                if (result) {
                                                    window.location.reload();
                                                }
 
                                            } else if (responseData.message == "6") {
                                                hideLoading(); // 隐藏加载中
                                                GM_setValue("YTToken", "");
                                                GM_setValue('username', "");
                                                GM_setValue('password', "");
                                                var result = confirm("您的账号在另一台设备上登录，请重新登录");
                                                if (result) {
                                                    window.location.reload();
                                                }
                                            } else {
                                                hideLoading(); // 隐藏加载中
                                                alert('解析失败，请点击播放按钮重试！');
                                            }
                                        },
                                        onerror: function (error) {
                                            hideLoading(); // 隐藏加载中
                                            // 处理错误
                                            console.error(error);
                                            alert('解析失败，请点击播放按钮重试！');
                                        }
                                    });
                                } else {
                                    hideLoading(); // 隐藏加载中
                                    var result = confirm("抱歉，默认只支持标清播放，高清、超清和视频下载功能仅支持套餐内的日租号体验，如需体验请前往租号网址gv1069.vip购买非1.9元套餐！套餐中的日租号随用随取，不限制取号间隔时间，不用的话永不失效，日租号套餐比单个买日租号更划算，按天使用更合理！如需了解详细信息，请仔细阅读购前须知！");
                                    if (result) {
                                        window.location.href = "http://gv1069.vip/#/shop-account";
                                    }
                                }
                            }
 
                        })
                    }
 
                });
 
                // 添加点击事件监听器（高清视频下载）
                playButton7.addEventListener('click', function (event) {
                    showLoading(); // 显示加载中
                    if (token == null || token == "" || username == "" || password == "") {
                        var result = confirm("您未登录，请在日租号专用登录通道进行登录！请勿在一同看官方界面登录！点击“确定”按钮前往专用登录通道！");
                        if (result) {
                            window.location.reload();
                        }
                        hideLoading(); // 隐藏加载中
 
                    } else {
                        GM.xmlHttpRequest({
                            method: 'GET',
                            url: yitongkanBase + "/pay/is-taocan?account=" + GM_getValue("username"),
                            onload: function (responseAccount) {
                                const responseDataAccount = JSON.parse(responseAccount.responseText);
                                if (responseDataAccount.content) {
                                    // 在这里发送 GET 请求
                                    GM.xmlHttpRequest({
                                        method: 'GET',
                                        url: yitongkanBase + "/yitong/get-m3u8-url?link=" + aElement.href.split('/')[3] + "&token=" + token,  // 替换为你的 API 地址
                                        onload: function (response) {
                                            const responseData = JSON.parse(response.responseText);
                                            if (responseData.success && responseData.content != null && responseData.content != "") {
                                                //后端通过message来区别是返回的是已经处理好的freshCode，还是从新请求的freshCode,0表示缓存fresh，1表示新的
                                                if (responseData.message == "1") {
                                                    let strings = responseData.content.match(/(url: ')[^\\s]+/g)
                                                    m3u8Url = strings[0].split("'")[1].replace("450", valueGao)
                                                    // /1693210723/d33e53edfbf7428b7da27417ead06231/data/d9927e3e380ea1c497f78fb5420bbfae/450/index.m3u8
                                                    GM.xmlHttpRequest({
                                                        method: 'GET',
                                                        url: yitongkanBase + "/yitong/update-fresh-code?expire_time=" + m3u8Url.split("/")[1] + "&fresh_flag=" + m3u8Url.split("/")[2],  // 替换为你的 API 地址
                                                        onload: function (response1) {
 
                                                            // 处理响应
                                                            const responseData1 = JSON.parse(response1.responseText);
                                                            console.log(responseData1.content)
                                                        },
                                                        onerror: function (error1) {
                                                            // 处理错误
                                                            console.error(error1);
                                                        }
 
                                                    });
                                                } else if (responseData.message == "0") {
                                                    //下次修改后端代码再改成默认流畅
                                                    m3u8Url = responseData.content.replace("1800", valueGao)
                                                }
 
                                                sectionm3u8menu("https://" + window.location.href.split('/')[2] + m3u8Url);
                                                hideLoading(); // 隐藏加载中
                                                // window.location.href = "https://tools.liumingye.cn/m3u8/#" + window.location.href + m3u8Url;
                                                // w!.location.href = "https://tools.liumingye.cn/m3u8/#" + baseUrl.value + m3u8Url;
 
                                            } else if (responseData.message == "2") {
                                                hideLoading(); // 隐藏加载中
                                                // message.error("账户过期，请重新购买")
                                                GM_setValue("YTToken", "");
                                                GM_setValue('username', "");
                                                GM_setValue('password', "");
                                                var result = confirm("该账户已过期，请您重新购买或者取号！点击“确定”按钮自动跳转至购买界面！");
                                                if (result) {
                                                    window.location.href = "http://gv1069.vip/#/shop-account";
                                                }
 
                                            } else if (responseData.message == "3") {
                                                hideLoading(); // 隐藏加载中
                                                GM_setValue("YTToken", "");
                                                GM_setValue('username', "");
                                                GM_setValue('password', "");
                                                var result = confirm("请您重新登录！点击“确定”按钮自动弹出登录输入框！");
                                                if (result) {
                                                    window.location.reload();
                                                }
                                            } else if (responseData.message == "4" || responseData.message == "5") {
                                                hideLoading(); // 隐藏加载中
                                                GM_setValue("YTToken", "");
                                                GM_setValue('username', "");
                                                GM_setValue('password', "");
                                                var result = confirm("请您重新登录！点击“确定”按钮自动弹出登录输入框！");
                                                if (result) {
                                                    window.location.reload();
                                                }
 
                                            } else if (responseData.message == "6") {
                                                hideLoading(); // 隐藏加载中
                                                GM_setValue("YTToken", "");
                                                GM_setValue('username', "");
                                                GM_setValue('password', "");
                                                var result = confirm("您的账号在另一台设备上登录，请重新登录");
                                                if (result) {
                                                    window.location.reload();
                                                }
                                            } else {
                                                hideLoading(); // 隐藏加载中
                                                alert('解析失败，请点击播放按钮重试！');
                                            }
                                        },
                                        onerror: function (error) {
                                            hideLoading(); // 隐藏加载中
                                            // 处理错误
                                            console.error(error);
                                            alert('解析失败，请点击播放按钮重试！');
                                        }
                                    });
                                } else {
                                    hideLoading(); // 隐藏加载中
                                    var result = confirm("抱歉，默认只支持标清播放，高清、超清和视频下载功能仅支持套餐内的日租号体验，如需体验请前往租号网址gv1069.vip购买非1.9元套餐！套餐中的日租号随用随取，不限制取号间隔时间，不用的话永不失效，日租号套餐比单个买日租号更划算，按天使用更合理！如需了解详细信息，请仔细阅读购前须知！");
                                    if (result) {
                                        window.location.href = "http://gv1069.vip/#/shop-account";
                                    }
                                }
                            }
 
                        })
                    }
 
                });
 
                // 添加点击事件监听器（默认标清视频下载）
                playButton5.addEventListener('click', function (event) {
                    showLoading(); // 显示加载中
                    if (token == null || token == "") {
                        var result = confirm("您未登录，请在日租号专用登录通道进行登录！请勿在一同看官方界面登录！点击“确定”按钮前往专用登录通道！");
                        if (result) {
                            window.location.reload();
                        }
                        hideLoading(); // 隐藏加载中
 
                    } else {
                        GM.xmlHttpRequest({
                            method: 'GET',
                            url: yitongkanBase + "/pay/is-taocan?account=" + GM_getValue("username"),
                            onload: function (responseAccount) {
                                const responseDataAccount = JSON.parse(responseAccount.responseText);
                                if (responseDataAccount.content) {
                                    // 在这里发送 GET 请求
                                    GM.xmlHttpRequest({
                                        method: 'GET',
                                        url: yitongkanBase + "/yitong/get-m3u8-url?link=" + aElement.href.split('/')[3] + "&token=" + token,  // 替换为你的 API 地址
                                        onload: function (response) {
                                            const responseData = JSON.parse(response.responseText);
                                            if (responseData.success && responseData.content != null && responseData.content != "") {
                                                //后端通过message来区别是返回的是已经处理好的freshCode，还是从新请求的freshCode,0表示缓存fresh，1表示新的
                                                if (responseData.message == "1") {
                                                    let strings = responseData.content.match(/(url: ')[^\\s]+/g)
                                                    m3u8Url = strings[0].split("'")[1].replace("450", value)
                                                    // /1693210723/d33e53edfbf7428b7da27417ead06231/data/d9927e3e380ea1c497f78fb5420bbfae/450/index.m3u8
                                                    GM.xmlHttpRequest({
                                                        method: 'GET',
                                                        url: yitongkanBase + "/yitong/update-fresh-code?expire_time=" + m3u8Url.split("/")[1] + "&fresh_flag=" + m3u8Url.split("/")[2],  // 替换为你的 API 地址
                                                        onload: function (response1) {
 
                                                            // 处理响应
                                                            const responseData1 = JSON.parse(response1.responseText);
                                                            console.log(responseData1.content)
                                                        },
                                                        onerror: function (error1) {
                                                            // 处理错误
                                                            console.error(error1);
                                                        }
 
                                                    });
                                                } else if (responseData.message == "0") {
                                                    //下次修改后端代码再改成默认流畅
                                                    m3u8Url = responseData.content.replace("1800", value)
                                                }
 
                                                sectionm3u8menu("https://" + window.location.href.split('/')[2] + m3u8Url);
                                                hideLoading(); // 隐藏加载中
                                                // window.location.href = "https://tools.liumingye.cn/m3u8/#" + window.location.href + m3u8Url;
                                                // w!.location.href = "https://tools.liumingye.cn/m3u8/#" + baseUrl.value + m3u8Url;
 
                                            } else if (responseData.message == "2") {
                                                hideLoading(); // 隐藏加载中
                                                // message.error("账户过期，请重新购买")
                                                GM_setValue("YTToken", "");
                                                GM_setValue('username', "");
                                                GM_setValue('password', "");
                                                var result = confirm("该账户已过期，请您重新购买或者取号！点击“确定”按钮自动跳转至购买界面！");
                                                if (result) {
                                                    window.location.href = "http://gv1069.vip/#/shop-account";
                                                }
 
                                            } else if (responseData.message == "3") {
                                                hideLoading(); // 隐藏加载中
                                                GM_setValue("YTToken", "");
                                                GM_setValue('username', "");
                                                GM_setValue('password', "");
                                                var result = confirm("请您重新登录！点击“确定”按钮自动弹出登录输入框！");
                                                if (result) {
                                                    window.location.reload();
                                                }
                                            } else if (responseData.message == "4" || responseData.message == "5") {
                                                hideLoading(); // 隐藏加载中
                                                GM_setValue("YTToken", "");
                                                GM_setValue('username', "");
                                                GM_setValue('password', "");
                                                var result = confirm("请您重新登录！点击“确定”按钮自动弹出登录输入框！");
                                                if (result) {
                                                    window.location.reload();
                                                }
 
                                            } else if (responseData.message == "6") {
                                                hideLoading(); // 隐藏加载中
                                                GM_setValue("YTToken", "");
                                                GM_setValue('username', "");
                                                GM_setValue('password', "");
                                                var result = confirm("您的账号在另一台设备上登录，请重新登录");
                                                if (result) {
                                                    window.location.reload();
                                                }
                                            } else {
                                                hideLoading(); // 隐藏加载中
                                                alert('解析失败，请点击播放按钮重试！');
                                            }
                                        },
                                        onerror: function (error) {
                                            hideLoading(); // 隐藏加载中
                                            // 处理错误
                                            console.error(error);
                                            alert('解析失败，请点击播放按钮重试！');
                                        }
                                    });
                                } else {
                                    hideLoading(); // 隐藏加载中
                                    var result = confirm("抱歉，默认只支持标清播放，高清、超清和视频下载功能仅支持套餐内的日租号体验，如需体验请前往租号网址gv1069.vip购买非1.9元套餐！套餐中的日租号随用随取，不限制取号间隔时间，不用的话永不失效，日租号套餐比单个买日租号更划算，按天使用更合理！如需了解详细信息，请仔细阅读购前须知！");
                                    if (result) {
                                        window.location.href = "http://gv1069.vip/#/shop-account";
                                    }
                                }
                            }
 
                        })
 
 
                    }
 
                });
 
 
                // 设置播放按钮宽度
                playButton1.style.width = liElement.clientWidth + 'px';
 
                // 设置播放按钮宽度
                playButton5.style.width = liElement.clientWidth + 'px';
 
                // 设置播放按钮宽度
                playButton6.style.width = liElement.clientWidth + 'px';
 
                // 设置播放按钮宽度
                playButton7.style.width = liElement.clientWidth + 'px';
 
                // 设置播放按钮宽度
                playButton8.style.width = liElement.clientWidth + 'px';
 
                // 添加播放按钮到 LI 元素
                liElement.appendChild(playButton1);
 
                // 添加播放按钮到 LI 元素
                liElement.appendChild(playButton5);
 
                // 添加播放按钮到 LI 元素
                liElement.appendChild(playButton6);
 
                // 添加播放按钮到 LI 元素
                liElement.appendChild(playButton7);
 
 
                // 添加播放按钮到 LI 元素
                liElement.appendChild(playButton8);
 
 
            });
        });
 
        // 弹框显示函数
        function showLoginPrompt() {
            // 使用prompt函数创建弹框
 
            // Trigger the login box
            openLoginBox();
 
            // 获取用户名和密码输入框的值
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const submitButton = document.getElementById('submitBtn');
 
            // 添加点击事件监听器
            submitButton.addEventListener('click', function () {
                const username = usernameInput.value;
                const password = passwordInput.value;
                if (username != "" && password != "") {
                    // 模拟后端通信，实际情况应该使用fetch或其他方式与后端通信
                    simulateBackendCommunication(username, password);
                } else {
                    alert('登录失败，用户名和密码不可为空！');
                }
            });
        }
 
        // 模拟后端通信
        function simulateBackendCommunication(username, password) {
            // 定义登录 API 地址
            const loginApiUrl = "http://api.gv1069.vip/user/login";
 
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
                        closeLoginBox();
 
                        GM_setValue('YTToken', responseData.content.token);
                        GM_setValue('username', username);
                        GM_setValue('password', password);
 
                        alert('登录成功，请尽情享受您的观影时间！');
                    } else {
                        if (responseData.message == "账户已过期，请重新购买") {
                            closeLoginBox();
                            GM_setValue("YTToken", "");
                            GM_setValue('username', "");
                            GM_setValue('password', "");
                            var result = confirm("该账户已过期，请您重新购买或者取号！点击“确定”按钮自动跳转至购买界面！");
                            if (result) {
                                window.location.href = "http://gv1069.vip/#/shop-account";
                            } else {
                                window.location.href = "http://gv1069.vip/#/shop-account";
                            }
 
                        } else {
                            alert('登录失败，请检查用户名和密码。');
                        }
                    }
                },
                onerror: function (error) {
                    console.error("Error:", error);
                }
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