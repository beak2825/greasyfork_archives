// ==UserScript==
// @name         日租号解析一同看(仅针对苹果设备)
// @namespace    http://gv1069.vip/
// @version      2.1
// @description  该脚本仅支持苹果设备，安卓和电脑设备请安装主版本。
// @author       日租号站长
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
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487346/%E6%97%A5%E7%A7%9F%E5%8F%B7%E8%A7%A3%E6%9E%90%E4%B8%80%E5%90%8C%E7%9C%8B%28%E4%BB%85%E9%92%88%E5%AF%B9%E8%8B%B9%E6%9E%9C%E8%AE%BE%E5%A4%87%29.user.js
// @updateURL https://update.greasyfork.org/scripts/487346/%E6%97%A5%E7%A7%9F%E5%8F%B7%E8%A7%A3%E6%9E%90%E4%B8%80%E5%90%8C%E7%9C%8B%28%E4%BB%85%E9%92%88%E5%AF%B9%E8%8B%B9%E6%9E%9C%E8%AE%BE%E5%A4%87%29.meta.js
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
                    showLoading(); // 显示加载中
                    if (token == null || token == "") {
                        var result = confirm("您未登录，请在日租号专用登录通道进行登录！请勿在一同看官方界面登录！点击“确定”按钮前往专用登录通道！");
                        if (result) {
                            window.location.reload();
                        }
                        hideLoading(); // 隐藏加载中
 
                    } else {
                        hideLoading(); // 隐藏加载中

                        window.location.href = "http://video.gv1069.vip?video_link="+aElement.href+"&token="+token;
                    }
 
                });
 
                // 添加点击事件监听器（默认标清视频下载）
                playButton5.addEventListener('click', function (event) {
                    alert("由于系统限制，苹果设备不支持下载，请前往安卓端和电脑端进行下载！");
 
                });
                
 
                // 添加点击事件监听器（早期标清视频下载）
                playButton6.addEventListener('click', function (event) {
                    alert("由于系统限制，苹果设备不支持下载，请前往安卓端和电脑端进行下载！");
 
                });
                
 
                // 添加点击事件监听器（高清视频下载）
                playButton7.addEventListener('click', function (event) {
                    alert("由于系统限制，苹果设备不支持下载，请前往安卓端和电脑端进行下载！");
 
                });
                
 
                // 添加点击事件监听器（超清视频下载）
                playButton8.addEventListener('click', function (event) {
                    alert("由于系统限制，苹果设备不支持下载，请前往安卓端和电脑端进行下载！");
 
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
    });
})();