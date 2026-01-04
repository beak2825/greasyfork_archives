// ==UserScript==
// @name         Java提取页面数据
// @icon         https://media.springernature.com/favicon.ico
// @namespace    http://www.train.cn
// @license      1.0
// @version      1.1
// @description  提取解析数据，响应给后端处理
// @author       liuhongjun
// @match        *://journals.aps.org/*/abstract/*
// @match        *://www.cambridge.org/core/journals/communications-in-computational-physics/article/*
// @match        *://www.cambridge.org/core/journals/journal-of-plasma-physics/article/*
// @match        *://www.sciencedirect.com/science/article/*
// @match        *://iopscience.iop.org/article/*
// @match        *://epubs.siam.org/doi/10.1137/*
// @match        *://pubs.aip.org/aip/pop/article/*
// @exclude      *://iopscience.iop.org/article/*/pdf
// @exclude      *://www.sciencedirect.com/science/article/*/*/pdfft*
// @match        http://*/*/*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/3.0.0/jsencrypt.min.js
// @downloadURL https://update.greasyfork.org/scripts/501562/Java%E6%8F%90%E5%8F%96%E9%A1%B5%E9%9D%A2%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/501562/Java%E6%8F%90%E5%8F%96%E9%A1%B5%E9%9D%A2%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const wsUrl = 'ws://localhost:8079';
    const baseUrl = 'http://localhost:8087';
    //const baseUrl = 'https://29ce7cea.cpolar.io';
    //获取当前路径
    let currentUrl = window.location.href;

    /* 提示用户输入验证码并进行验证 */
    function confirmAndVerfy() {
        const isConfirmed = confirm("授权认证")
        if (isConfirmed) {
            authority();
        } else {
            alert('未进行授权');
        }
    }

    //检查本地是否存储Token
    let token = localStorage.getItem('jnl-token');
    if (!token) {
        confirmAndVerfy();
    }
    //else {
    //    //Token有效，直接发送请求
    //    sendRequest(token);
    //}

    /**
     * 封装fetch请求
     * @param {string} url - 请求的URL
     * @param {object} options - 请求选项
     * @returns {Promise<object>} - 返回解析后的JSON数据
     * @throws {Error} - 抛出错误信息
     */
    async function fetchRequest(url, options = {}) {
        //获取本地存储中的token
        const token = localStorage.getItem('jnl-token');
        //设置默认headers，并合并传入的headers
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...options.headers
        };
        //合并默认配置和传入配置
        const fetchOptions = {
            ...options,
            headers
        };
        //发送fetch请求
        return fetch(url, fetchOptions)
            .then(response => {
                if (response.status === 400 || response.status === 401) {
                    console.log("清理token数据：", token);
                    //清理token数据
                    localStorage.removeItem('jnl-token');
                    //重新输入验证码
                    setTimeout(function () {
                        confirmAndVerfy();
                    }, 3100);
                    return Promise.reject(new Error('未授权或Token过期'));
                } else if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject(new Error('服务器异常，请稍后再试.'));
                }
            })
            .catch(error => {
                //捕获并处理所有错误
                console.error('请求发生错误：', error);
                showAlert("Error!", `${error.message}`);
                return Promise.reject(error); //继续抛出错误，以便调用者处理
            });
    }

    /* 基于ws密钥认证 */
    function verify_ws() {
        return new Promise((resolve, reject) => {
            const socket = new WebSocket(wsUrl + '/ws/verify');
            socket.onopen = () => {
                socket.send(JSON.stringify({'host': currentUrl}));
            };
            socket.onmessage = (event) => {
                const response = JSON.parse(event.data);
                if (response.code === 200) {
                    resolve(response.data);
                } else if (response.code === 500) {
                    this.showAlert(response.msg, 'error');
                    throw new Error(response.msg);
                } else {
                    throw new Error("其他未知异常.");
                }
                socket.close();
            };
            socket.onerror = (error) => {
                console.error("密钥认证异常: ", error);
                this.disAlert('无法连接到密钥认证器.', 'error');
                reject(error);
            };
        });
    }

    /* 授权认证 */
    function authority() {
        verify_ws().then(resp => {
            fetch(`${baseUrl}/api/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: resp.username, hostname: resp.hostname})
                //timeout: 10000, //设置超时时间为10秒
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Network response was not ok.');
                    }
                })
                .then(data => {
                    if (data.code === 200) {
                        data = data.data;
                        showAlert('Success！', '认证成功');
                        token = data.token;
                        localStorage.setItem('jnl-token', token);
                        sendRequest(token);
                    } else {
                        alert('密钥认证失败.');
                        confirmAndVerfy();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('服务器异常，请稍后再试');
                });
        })
    }

    /* 发送请求到后端 */
    function sendRequest(token) {
        //等待500毫秒-1秒让页面内容加载完成
        setTimeout(function () {
            //获取页面内容
            let htmlContent = document.documentElement.innerHTML;
            fetchRequest(`${baseUrl}/api/parse`, {
                    method: "POST",
                    body: JSON.stringify({html: htmlContent, url: currentUrl}),
                    // timeout: 10000, //设置超时时间为10秒
                },
            )
                .then(data => {
                    console.log("服务器响应：", data);
                    if (data.code === 200) {
                        showAlert("Success!", "数据同步成功");
                    } else if (data.code === 409 || data.code === 404) {
                        showAlert("Warning!", data.msg);
                    } else {
                        showAlert("Error!", data.msg);
                    }
                })
                .catch(error => {
                    console.error('请求发生错误：', error);
                    showAlert("Error!", `${error.message}`);
                });
        }, 500); //等待500毫秒到1秒后执行
    }

    /* 显示提示框 */
    function showAlert(title, message) {
        let overlay = document.createElement("div");
        overlay.className = "custom-alert-overlay";
        document.body.appendChild(overlay);
        let alertBox = document.createElement("div");
        alertBox.className = "custom-alert-box";
        let alertTitle = document.createElement("h6");
        alertTitle.innerText = title;
        alertTitle.className = "custom-alert-title";
        alertBox.appendChild(alertTitle);
        let alertMessage = document.createElement("p");
        alertMessage.innerText = message;
        alertMessage.className = "custom-alert-message";
        alertBox.appendChild(alertMessage);
        let closeButton = document.createElement("button");
        closeButton.innerText = "关闭";
        closeButton.className = "custom-alert-button";
        closeButton.onclick = function () {
            closeAlert();
        };
        alertBox.appendChild(closeButton);
        document.body.appendChild(alertBox);
        //淡入效果
        setTimeout(function () {
            overlay.style.opacity = 1;
            alertBox.style.opacity = 1;
        }, 10);
        //自动关闭提示框
        setTimeout(function () {
            closeAlert();
        }, 3000); //3秒后关闭提示框
    }

    /* 关闭提示框 */
    function closeAlert() {
        let alertBox = document.querySelector(".custom-alert-box");
        let overlay = document.querySelector(".custom-alert-overlay");
        if (alertBox && document.body.contains(alertBox)) {
            //淡出效果
            alertBox.style.opacity = 0; //设置透明度为0，实现淡出效果
            overlay.style.opacity = 0; //同样设置遮罩层透明度为0
            setTimeout(function () {
                document.body.removeChild(alertBox);
                document.body.removeChild(overlay);
            }, 300); //等待300毫秒后移除节点，此时完成淡出动画
        }
    }

    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
            .custom-alert-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .custom-alert-box {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: white;
                padding: 0 50px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                z-index: 10000;
                text-align: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .custom-alert-title {
                font-size: 16px;
                font-style: italic;
                margin-top: 15px;
                margin-bottom: 10px;
            }
            .custom-alert-message {
                margin-bottom: 10px;
            }
            .custom-alert-button {
                margin: 4px 0 17px 0;
                padding: 5px 10px;
                border: none;
                font-size: 18px;
                background-color: #909399;
                color: white;
                border-radius: 5px;
                cursor: pointer;
            }
            .custom-alert-button:hover {
                background-color: #606266;
                color: #0C76BB;
            }
        `;
    document.head.appendChild(style);

    /** 创建控制面板 */
    function createControlPanel() {
        //如果控制面板已存在，则返回
        if (document.getElementById('controlPanel')) return;
        //创建控制面板的 DOM 元素
        const controlPanel = document.createElement('div');
        controlPanel.style.position = 'fixed';
        controlPanel.style.bottom = '20px';
        controlPanel.style.right = '20px';
        controlPanel.style.width = '200px';
        // controlPanel.style.height = '40%';
        controlPanel.style.minHeight = '120px';
        controlPanel.style.maxHeight = '180px';
        controlPanel.style.padding = '20px';
        controlPanel.style.backgroundColor = '#fff';
        controlPanel.style.border = '1px solid #dcdfe6';
        controlPanel.style.borderRadius = '6px';
        controlPanel.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        controlPanel.style.zIndex = '1000';
        controlPanel.style.fontFamily = 'Arial, sans-serif';
        controlPanel.id = 'controlPanel';
        controlPanel.innerHTML = `
            <div id="controlPanelHeader" style="user-select: none; display: flex; justify-content: space-between; align-items: center; cursor: move;">
                <h3 style="margin: 0; font-size: 16px;">Control Panel</h3>
                <button id="closeControlPanel" style="padding: 0; background-color: #f56c6c; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; text-align: center; line-height: 20px; font-size: 16px;">×</button>
            </div>
            <div style="margin-top: 10px;">
                <button id="syncButton" style="width: 100%; padding: 8px; background-color: #409eff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 10px; font-size: 14px;">立即同步</button>
                <button id="feedbackButton" style="margin: 0; width: 100%; padding: 8px; background-color: #67c23a; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">意见反馈</button>
            </div>
        `;
        //将控制面板添加到页面
        document.body.appendChild(controlPanel);
        //使控制面板可拖动
        makeDraggable(controlPanel, document.getElementById('controlPanelHeader'));
        //同步按钮添加点击事件监听器
        document.getElementById('syncButton').addEventListener('click', function () {
            //发送请求，同步数据
            sendRequest(token);
        });
        //反馈按钮添加点击事件监听器
        document.getElementById('feedbackButton').addEventListener('click', function () {
            createFeedbackForm();
        });
        //关闭按钮添加点击事件监听器
        document.getElementById('closeControlPanel').addEventListener('click', function () {
            controlPanel.remove();
        });
    }

    /** 创建反馈表单 */
    function createFeedbackForm() {
        //如果反馈表单已存在，则返回
        if (document.getElementById('feedbackFormContainer')) return;

        //创建反馈表单的 DOM 元素
        const formContainer = document.createElement('div');
        formContainer.id = 'feedbackFormContainer';
        formContainer.style.position = 'fixed';
        formContainer.style.bottom = '20px';
        formContainer.style.right = '20px';
        formContainer.style.width = '300px';
        // formContainer.style.height = '400px';
        formContainer.style.minHeight = '400px';
        formContainer.style.maxHeight = '440px';
        formContainer.style.padding = '20px';
        formContainer.style.backgroundColor = '#fff';
        formContainer.style.border = '1px solid #dcdfe6';
        formContainer.style.borderRadius = '6px';
        formContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        formContainer.style.zIndex = '1001'; //设置更高的z-index覆盖控制面板
        formContainer.style.fontFamily = 'Arial, sans-serif';
        formContainer.innerHTML = `
            <div id="feedbackFormHeader" style="user-select: none; display: flex; justify-content: space-between; align-items: center; cursor: move;">
                <h3 style="margin: 0; font-size: 16px;">Feedback Form</h3>
                <button id="closeFeedbackForm" style="padding: 0; background-color: #f56c6c; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; text-align: center; line-height: 20px; font-size: 16px;">×</button>
            </div>
            <div style="margin-top: 10px;">
                <label for="email" style="display: block; margin-bottom: 5px; font-size: 14px;">Email:</label>
                <input type="email" id="email" style="width: 100%; padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; margin-bottom: 10px; box-sizing: border-box;">
                <label for="content" style="display: block; margin-bottom: 5px; font-size: 14px;">Content:</label>
                <textarea id="content" rows="6" style="min-width: 100%; max-width: 100%; max-height: 160px; padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; box-sizing: border-box;"></textarea>
                <button id="submitFeedback" style="width: 100%; padding: 10px; background-color: #67c23a; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px; font-size: 14px;">Submit</button>
                <span style="display: block; margin-top: 10px; font-size: 14px; color: #8a818a">提示：停留在您访问的文章页面，即可自动获取文献URL，无需手动输入，但需要您提供正确的邮箱地址，以及反馈信息内容。</span>
            </div>
        `;

        //将反馈表单添加到页面
        document.body.appendChild(formContainer);
        //使反馈表单可拖动
        makeDraggable(formContainer, document.getElementById('feedbackFormHeader'));
        //提交按钮添加点击事件监听器
        document.getElementById('submitFeedback').addEventListener('click', function () {
            const email = document.getElementById('email').value;
            const content = document.getElementById('content').value;
            const url = window.location.href;
            const emailPat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPat.test(email)) {
                alert('请输入合法的邮箱地址.');
                return;
            }
            if (email && content) {
                alert(`Feedback submitted!\n\nEmail: ${email}\nContent: ${content}\nURL: ${url}`);
                fetchRequest(`${baseUrl}/api/parse/feedback`, {
                    method: "POST",
                    body: JSON.stringify({email: email, content: content, url: currentUrl}),
                    //timeout: 10000, //设置超时时间为10秒
                }).then(data => {
                    if (data.code === 200) {
                        showAlert('Success！', '反馈成功');
                    } else {
                        showAlert('Error！', '反馈失败');
                    }
                })
            } else {
                alert('请填写所有信息.');
            }
        });
        //关闭按钮添加点击事件监听器
        document.getElementById('closeFeedbackForm').addEventListener('click', function () {
            document.getElementById('feedbackFormContainer').remove();
        });
    }

    //使元素可拖动并带有边界检查
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            //获取鼠标光标位置
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            //当鼠标移动时调用函数
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            //计算新光标位置
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            //设置元素的新位置并检查边界
            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;
            if (newTop < 0) newTop = 0;
            if (newLeft < 0) newLeft = 0;
            if (newTop > window.innerHeight - element.offsetHeight) newTop = window.innerHeight - element.offsetHeight;
            if (newLeft > window.innerWidth - element.offsetWidth) newLeft = window.innerWidth - element.offsetWidth;
            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
        }

        function closeDragElement() {
            //停止移动时清除事件
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    //在页面加载完成后添加控制面板
    window.onload = createControlPanel;
})();
