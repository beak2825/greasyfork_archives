// ==UserScript==
// @name         知产辅助脚本
// @namespace    http://tampermonkey.net/
// @version      2025-01-07
// @description  本简化了知产日常业务的某些繁琐步骤，如删除了商标首页的5秒协议、专利办理系统首页的常用模块补充、专利电子发文电子客户端自动查询与回文可下载等功能、河南政务服务网的密码输入框可被粘贴内容等；
// @author       YZL
// @match        https://cponline.cnipa.gov.cn/*
// @match        https://wssq.sbj.cnipa.gov.cn:9443/tmsve/wssqsy_getCayzDl.xhtml
// @match        https://interactive.cponline.cnipa.gov.cn/public-app-zxsq-guojia/chaxuntjmk/chaxun/dianzifwcx
// @match        https://login.hnzwfw.gov.cn/tacs-uc/login/index?refer=cp&backUrl=http://id.hnkjt.gov.cn/puias/login?to=http://qyyf.hnkjt.gov.cn/czbt//cz/ssologin
// @match        *://cpquery.cponline.cnipa.gov.cn/*
// @match        *://ucenter.miit.gov.cn/login.jsp
// @match        *://zjtx.miit.gov.cn/zxqySy/main
// @icon         https://i.postimg.cc/bvs0tTYV/mcpfp-iu-yang1-2.png
// @license      MIT Festival Variant
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @require      https://cdn.jsdelivr.net/npm/qrcodejs2@0.0.2/qrcode.min.js
// @downloadURL https://update.greasyfork.org/scripts/502236/%E7%9F%A5%E4%BA%A7%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/502236/%E7%9F%A5%E4%BA%A7%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 获取当前页面的URL
    const url = window.location.href;

    //通知书工具栏的下载按钮及其他功能
    const targetSelector = '#download,#presentationMode,#viewFind,#print,#viewBookmark,#secondaryToolbarToggle,#openFile'; // Replace with your actual selector
    // Get all matching elements
    const elements = document.querySelectorAll(targetSelector);
    // Loop through each element and change its display property
    elements.forEach(element => {
        element.style.display = 'block';
    });


    // 请求URL
    const userLoadUrl = 'https://tysfjk.cponline.cnipa.gov.cn/portal/user/loadUser';
    const queryAuthUrl = 'https://tysfjk.cponline.cnipa.gov.cn/portal/web/cert/v3/queryAuthSign';
    const startAuthUrl = 'https://tysfjk.cponline.cnipa.gov.cn/portal/web/cert/v3/startAuthSign';


    // 专利首页的脚本代码
    if (/https:\/\/cponline\.cnipa\.gov\.cn\/.*/.test(url)) {
        // 添加新的 span 元素的函数
        function addLinks() {
            const headerMenu = document.querySelector('.bl-header-menu');
            if (headerMenu && !headerMenu.dataset.linksAdded) {
                headerMenu.dataset.linksAdded = 'true';

                const links = [
                    { href: "https://interactive.cponline.cnipa.gov.cn/public-app-zxsq-guojia/chaxuntjmk/chaxun/dianzifwcx", text: "电子发文查询" },
                    { href: "https://cpquery.cponline.cnipa.gov.cn/chinesepatent/index", text: "专利费用查询" },
                    { href: "https://interactive.cponline.cnipa.gov.cn/public-app-zlswfw/feijianbeian/feijianbaggcx", text: "费减备案" }
                ];

                links.forEach(link => {
                    const newSpan = document.createElement('span');
                    newSpan.classList.add('custom-link'); // 添加自定义类名
                    const newAnchor = document.createElement('a');
                    newAnchor.href = link.href;
                    newAnchor.textContent = link.text;
                    newSpan.appendChild(newAnchor);
                    headerMenu.appendChild(newSpan);
                });
            }
        }

        // 添加 CSS 样式以确保元素不会换行并具有适当的间距
        function addStyles() {
            const style = document.createElement('style');
            style.textContent = `
            .bl-header-menu {
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
            }
            .bl-header-menu span {
                margin-right: 15px; /* 根据需要调整间距 */
                font-size: 150%;
                font-weight: bold;
                align-items: center;
                font-family: 'LiSu', sans-serif; /* 设置字体为仿宋 */
            }
            .bl-header-menu span:last-child {
                margin-right: 0; /* 去除最后一个 span 的右边距 */
            }
        `;
            document.head.appendChild(style);
        }

        // 初始化脚本
        function init() {
            addStyles();
            setTimeout(addLinks, 0);
        }

        window.onload = init;



        //以下为自动验签脚步代码内容
        // 发送POST请求到user/loadUser
        GM_xmlhttpRequest({
            method: 'POST',
            url: userLoadUrl,
            data: JSON.stringify({}), // 你可以根据需要调整POST请求的body
            headers: {
                'Content-Type': 'application/json'
            },
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.result === 'true' && data.data && data.data.userInfo) {
                        const userIdcode = data.data.userInfo.userIdcode;

                        // 发起第二个请求：queryAuthSign
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: queryAuthUrl,
                            data: JSON.stringify({ userId: userIdcode }),
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            onload: function(queryResponse) {
                                const queryData = JSON.parse(queryResponse.responseText);
                                if (queryData.status === '10000') {
                                    // 如果status是10000, 不做任何操作
                                    return;
                                }

                                // 否则发送startAuthSign请求
                                GM_xmlhttpRequest({
                                    method: 'POST',
                                    url: startAuthUrl,
                                    data: JSON.stringify({ userId: userIdcode, timeRegion: 86400 }),
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    onload: function(startAuthResponse) {
                                        const startAuthData = JSON.parse(startAuthResponse.responseText);
                                        if (startAuthData.status === '10000') {
                                            // 使用QRCode库生成二维码并展示
                                            generateQRCode(startAuthData.data.qrCode);
                                        } else {
                                            console.error('认证失败:', startAuthData.message);
                                        }
                                    },
                                    onerror: function() {
                                        console.error('发送startAuthSign请求失败');
                                    }
                                });
                            },
                            onerror: function() {
                                console.error('发送queryAuthSign请求失败');
                            }
                        });
                    } else {
                        console.error('加载用户信息失败');
                    }
                } catch (e) {
                    console.error('请求或响应格式错误:', e);
                }
            },
            onerror: function() {
                console.error('发送loadUser请求失败');
            }
        });
        // 生成二维码并展示在页面右下角
        function generateQRCode(content) {
            const qrContainer = document.createElement('div');
            qrContainer.style.position = 'fixed';
            qrContainer.style.bottom = '10px';
            qrContainer.style.right = '10px';
            qrContainer.style.zIndex = '9999';

            // 为二维码容器添加黑色外框
            qrContainer.style.border = '5px solid black';
            qrContainer.style.padding = '10px'; // 给二维码加点内边距，使外框和二维码之间有间隙
            qrContainer.style.backgroundColor = 'white'

            // 使用QRCode库生成二维码
            new QRCode(qrContainer, {
                text: content,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            document.body.appendChild(qrContainer);
        }
    }
    //商标主页屏蔽协议的脚本代码
    else if (url.includes("https://wssq.sbj.cnipa.gov.cn:9443/tmsve/wssqsy_getCayzDl.xhtml")) {
        // 定义一个函数，用于删除指定类名的元素
        function removeElementsByClass(className) {
            const elements = document.getElementsByClassName(className);
            while(elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }
        }

        // 等待页面完全加载后执行
        window.onload = function() {
            removeElementsByClass('bgPop'); // 删除类名为"bgPop"的元素
            removeElementsByClass("pop");   // 删除类名为"pop"的元素
        };
    }
    //专利电子发文自动查询
    else if (window.location.href.includes("https://interactive.cponline.cnipa.gov.cn/public-app-zxsq-guojia/chaxuntjmk/chaxun/dianzifwcx")) {
        // 定义一个函数，用于检查目标元素是否存在并点击
        function checkForTargetElement() {
            // 查找所有包含指定文本的<span>标签
            var spans = document.querySelectorAll('span');

            for (var span of spans) {
                // 检查<span>的文本内容
                if (span.textContent.trim() === '电子申请客户端') {
                    // 获取该<span>标签的父元素<li>
                    var li = span.closest('li');

                    if (li) {
                        // 触发<li>的点击事件
                        li.click();

                        // 定义一个函数，用于检查查询按钮
                        function checkForSearchButton() {
                            // 查找所有包含指定文本的<span>标签
                            var buttonSpans = document.querySelectorAll('span');

                            for (var buttonSpan of buttonSpans) {
                                // 检查<span>的文本内容
                                if (buttonSpan.textContent.trim() === '查询') {
                                    // 获取该<span>标签的父元素<button>
                                    var button = buttonSpan.closest('button');

                                    if (button) {
                                        // 触发<button>的点击事件
                                        button.click();
                                        return true; // 目标按钮找到并点击后，返回true
                                    }
                                }
                            }

                            return false; // 目标按钮未找到，返回false
                        }

                        // 使用setInterval定期检查页面内容
                        var buttonIntervalId = setInterval(function() {
                            if (checkForSearchButton()) {
                                // 如果找到并点击了目标按钮，清除定时器
                                clearInterval(buttonIntervalId);
                            }
                        }, 500); // 每500毫秒检查一次

                        return true; // 目标<li>元素找到并点击后，返回true
                    }
                }
            }

            return false; // 目标<li>元素未找到，返回false
        }

        // 使用setInterval定期检查页面内容
        var intervalId = setInterval(function() {
            if (checkForTargetElement()) {
                // 如果找到并点击了目标元素，清除定时器
                clearInterval(intervalId);
            }
        }, 500); // 每500毫秒检查一次
    }
    //河南政务服务网--启用密码输入框的粘贴功能
    else if (window.location.href.includes("https://login.hnzwfw.gov.cn/tacs-uc/login/index?refer=cp&backUrl=http://id.hnkjt.gov.cn/puias/login?to=http://qyyf.hnkjt.gov.cn/czbt//cz/ssologin")) {
        window.addEventListener('load', function() {
            var passwordField = document.getElementById('legalLoginPwd');
            if (passwordField) {
                passwordField.onpaste = null;
                console.log('为法人密码输入框启用了粘贴.');
            } else {
                console.log('没有找到密码字段');
            }

            var userPwd = document.getElementsByName('userPwd');

            if (userPwd[0]) {
                userPwd[0].onpaste = null;
                console.log('为个人用户密码输入框启用了粘贴.');
            } else {
                console.log('没有找到密码字段');
            }
        });
    }
    //工业和信息化部统一登录系统与优质中小企业梯度培育平台
    else if (window.location.href.includes("https://zjtx.miit.gov.cn/zxqySy/main")||window.location.href.includes("https://ucenter.miit.gov.cn/login.jsp")){
        // 检查容器是否已经存在，避免重复加载
        if (document.getElementById('customContainer')) {
            return; // 如果存在，退出脚本
        }

        // 创建一个容器
        let container = document.createElement('div');
        container.id = 'customContainer';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.width = '300px';
        container.style.backgroundColor = '#fff';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '10px';
        container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.zIndex = '9999';
        container.style.overflow = 'hidden';

        // 创建收放按钮
        let toggleButton = document.createElement('button');
        toggleButton.innerText = '工信部服务平台账号可用性查询';
        toggleButton.style.backgroundColor = '#007BFF';
        toggleButton.style.color = '#fff';
        toggleButton.style.border = 'none';
        toggleButton.style.width = '100%';
        toggleButton.style.padding = '10px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.fontSize = '16px';
        toggleButton.style.borderTopLeftRadius = '10px';
        toggleButton.style.borderTopRightRadius = '10px';

        // 创建内容区域
        let content = document.createElement('div');
        content.style.padding = '10px';
        content.style.display = 'none'; // 初始隐藏
        content.style.backgroundColor = '#fff';

        // 创建提示框
        let warningMessage = document.createElement('div');
        warningMessage.innerText = '请输入正确的统一社会信用代码';
        warningMessage.style.color = 'red';
        warningMessage.style.display = 'none'; // 初始隐藏
        warningMessage.style.marginBottom = '10px';
        content.appendChild(warningMessage); // 添加到内容区域

        // 创建输入框
        let input = document.createElement('input');
        input.type = 'text';
        input.id = 'certificateSnoInput';
        input.placeholder = '请输入企业统一信用证代码';
        input.style.width = '100%';
        input.style.padding = '8px';
        input.style.marginBottom = '10px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '5px';

        // 创建按钮
        let sendButton = document.createElement('button');
        sendButton.innerText = '查询企业';
        sendButton.style.backgroundColor = '#007BFF';
        sendButton.style.color = '#fff';
        sendButton.style.border = 'none';
        sendButton.style.width = '100%';
        sendButton.style.padding = '10px';
        sendButton.style.cursor = 'pointer';
        sendButton.style.borderRadius = '5px';
        sendButton.style.marginBottom = '10px';

        // 创建输出框
        let output = document.createElement('textarea');
        output.id = 'responseOutput';
        output.rows = 5;
        output.style.width = '100%';
        output.style.padding = '8px';
        output.style.border = '1px solid #ccc';
        output.style.borderRadius = '5px';
        output.placeholder = '账号查询结果将显示在这里';
        output.readOnly = true;

        // 将元素添加到容器中
        content.appendChild(input);
        content.appendChild(sendButton);
        content.appendChild(output);
        container.appendChild(toggleButton);
        container.appendChild(content);
        document.body.appendChild(container);

        // 监听收放按钮的点击事件
        toggleButton.addEventListener('click', function() {
            if (content.style.display === 'none') {
                content.style.display = 'block';
                toggleButton.innerText = '收起';
            } else {
                content.style.display = 'none';
                toggleButton.innerText = '工信部服务平台账号可用性查询';
            }
        });

        // 监听发送请求按钮的点击事件
        sendButton.addEventListener('click', function() {
            output.value = ''; // 清空输出框
            output.placeholder = '查询中...'; // 显示查询中提示

            let certificateSno = document.getElementById('certificateSnoInput').value;
            let regex = /^([0-9A-HJ-NPQRTUWXY]{2})([0-9]{6})([0-9A-HJ-NPQRTUWXY]{10})$/; // 统一社会信用代码正则表达式

            // 验证统一社会信用代码格式
            if (!regex.test(certificateSno)) {
                warningMessage.style.display = 'block'; // 显示警告消息
                output.placeholder = '账号查询结果将显示在这里';
                return; // 如果格式不正确，阻止发送请求
            }

            // 隐藏警告消息
            warningMessage.style.display = 'none';

            // 发送POST请求
            fetch('https://ucenter.miit.gov.cn/getQiyeInfo.action', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `certificateSno=${encodeURIComponent(certificateSno)}` // 将输入框中的参数编码后作为请求体
        })
            .then(response => response.json()) // 获取响应的JSON格式
            .then(data => {
            // 解析响应中的msg内容并根据条件输出
            let msg = data.msg || '未知响应';
            if (msg === '操作成功！') {
                output.value = '该企业无账号，请正常注册';
            } else {
                output.value = '企业账号已存在';
            }
        })
            .catch(error => {
            // 在输出框中显示错误信息
            output.value = '请求失败: ' + error;
        });
    });

        // 添加一些自定义样式
        let style = document.createElement('style');
        style.innerHTML = `
        #customContainer button:hover {
            background-color: #0056b3;
        }
        #customContainer textarea {
            resize: none;
        }
    `;
        document.head.appendChild(style);
    }
})();