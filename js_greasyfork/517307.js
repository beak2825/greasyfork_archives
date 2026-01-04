// ==UserScript==
// @name         EASE CS
// @namespace    https://greasyfork.org/zh-CN/scripts/517307-ease-cs
// @version      1.17
// @description  zhangfeng123 test
// @author       张峰
// @match        https://25825.sh.absoloop.com/*
// @icon         http://maxiang.io/favicon.ico
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1124435
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/517307/EASE%20CS.user.js
// @updateURL https://update.greasyfork.org/scripts/517307/EASE%20CS.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('脚本触发');
    // 初始化登录状态
    function setStyles(element, styles) {
        for (let property in styles) {
            if (styles.hasOwnProperty(property)) {
                element.style[property] = styles[property];
            }
        }
    }
    // 创建一个按钮元素
    const floatButton = document.createElement('img');
    floatButton.innerHTML = '客服'; // 设置按钮文本
    floatButton.src = 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/fd6d646b65efe59aa26ebf44ceb5f27d.png';
    // 设置按钮样式，使其悬浮在右下角
    const floatButtonStyles = {
        position: 'fixed',
        bottom: '60px',
        right: '50px',
        width: '50px',
        height: '50px',
        cursor: 'pointer',
        // 可以添加更多样式属性
    };
    setStyles(floatButton, floatButtonStyles);

    // 为按钮添加点击事件监听器
    floatButton.addEventListener('click', showDialog);


    function showDialog() {
        const container = document.getElementById('container');
        if (container) {
            container.remove();
            return;
        }
        const loginDiv = document.getElementById('loginDiv');
        if (loginDiv) {
            loginDiv.remove();
            // 如果 loginDiv 存在，则不执行与 loginDiv 相关的操作
            console.log('loginDiv 已移除，不执行 showLoginPrompt');
            return;
        }
        let token = localStorage.getItem('token')
        if (token) {
            showPasswordChangePrompt();
        } else {
            showLoginPrompt(); // 如果未登录，则显示登录的界面
        }
    }

    // 创建并显示登录界面
    function showPasswordChangePrompt() {
        console.log('显示修改密码或退出登录窗口');

        // 定义样式对象
        const containerStyles = {
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: '316px', // 稍微调整宽度以适应内容
            height: '480px', // 高度自动以适应内容
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#EEF6FF',
            padding: '20px',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
            borderRadius: '18px',
            zIndex: 1000
        };
        const imageStyles = {
            width: '20px',
            height: '20px',
            marginRight: '10px', // 图片与标题之间的间距
        };
        const titleStyles = {
            // ...（可以根据需要调整，但不需要 position: 'absolute'）
            display: 'flex',
            alignItems: 'center',
        };
        // 创建并设置图片
        const image = document.createElement('img');
        image.src = 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/fd6d646b65efe59aa26ebf44ceb5f27d.png';
        image.alt = '登录图标'; // 提供替代文本以增强可访问性
        setStyles(image, imageStyles);

        const actionRowStyles = {
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: '10px', // 给下方的按钮一些空间
            marginTop: '30px'
        };
        const buttonStyles = {
            padding: '10px 20px',
            boxSizing: 'border-box',
            margin: '38px 0px',
            backgroundColor: '#FFFFFF',
            color: '#333333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            width: '316px',
            textAlign: 'left',
            fontSize: '14px'
        };

        const logoutbuttonStyles = {
            width: '70px',
            height: '26px',
            color: '#999999',
            border: '1px solid #999999',
            borderRadius: '18px',
            cursor: 'pointer',
            fontSize: '12px',
        };

        // 创建容器div
        const container = document.createElement('div');
        container.id = 'container'
        setStyles(container, containerStyles);

        // 创建标题
        const titleContainerStyles = {
            display: 'flex',
            width: '100%'
        };
        const titleContainer = document.createElement('div');
        setStyles(titleContainer, titleContainerStyles);
        const title = document.createElement('h2'); // 使用h2标签可能更合适
        title.textContent = '亿点连接智能客服助手';
        setStyles(title, titleStyles);
        container.appendChild(titleContainer);
        titleContainer.appendChild(image);
        titleContainer.appendChild(title);
        //主页
        const mainAccout = document.createElement('div');
        const mainAccoutStyles = {
            width: '100%',
            height: '100%',
        };
        setStyles(mainAccout, mainAccoutStyles);
        container.appendChild(mainAccout);
        // 创建包含XXXX和退出登录按钮的行
        const actionRow = document.createElement('div');
        setStyles(actionRow, actionRowStyles);

        const actionText = document.createElement('span');
        const userName = JSON.parse(localStorage.getItem('userData')).userName;
        if (userName && userName.length >= 2) {
            // 构建新的字符串，只显示首字、*** 和最后一个字
            const maskedUserName = userName.charAt(0) + '***' + userName.charAt(userName.length - 1);

            // 设置 span 元素的文本内容为新的字符串
            actionText.textContent = maskedUserName;
        } else {
            // 如果用户名不存在或长度小于2，则直接显示用户名（或空字符串）
            actionText.textContent = userName;
        }
        actionRow.appendChild(actionText);

        const logoutButton = document.createElement('button');
        logoutButton.textContent = '退出登录';
        setStyles(logoutButton, logoutbuttonStyles);
        logoutButton.addEventListener('click', function () {
            // 显示确认对话框
            const userConfirmed = window.confirm('确定要退出登录吗？');

            if (userConfirmed) {
                // 用户点击了确定
                console.log('退出登录');
                localStorage.removeItem('userData');
                localStorage.removeItem('token');
                window.location.reload();
                startAjaxHooking()

                const container = document.getElementById('container');
                if (container) {
                    container.remove();
                }
            }
        });
        actionRow.appendChild(logoutButton);

        mainAccout.appendChild(actionRow);

        // 创建修改密码按钮
        const changePasswordButton = document.createElement('button');
        changePasswordButton.textContent = '修改密码';
        setStyles(changePasswordButton, buttonStyles);

        // 创建密码修改表单的容器
        const passwordFormContainer = document.createElement('div');
        setStyles(passwordFormContainer, {
            display: 'none', // 初始隐藏
            marginTop: '20px', // 样式示例
        });

        // 创建旧密码输入框
        const inputStyle = {
            width: '280px',
            height: '46px',
            borderRadius: '10px',
            fontSize: '14px',
            backgroundColor: '#FFFFFF',
            marginBottom: '14px',
            padding: '0 15px'
        };
        const oldPasswordInput = document.createElement('input');
        oldPasswordInput.type = 'text';
        oldPasswordInput.placeholder = '旧密码';
        setStyles(oldPasswordInput, inputStyle);
        // 创建新密码输入框
        const newPasswordInput = document.createElement('input');
        newPasswordInput.type = 'password';
        newPasswordInput.placeholder = '新密码';
        setStyles(newPasswordInput, inputStyle);
        // 创建重复新密码输入框
        const confirmNewPasswordInput = document.createElement('input');
        confirmNewPasswordInput.type = 'password';
        confirmNewPasswordInput.placeholder = '重复新密码';
        setStyles(confirmNewPasswordInput, inputStyle);
        const passwordValiStyle = {
            color: '#999999',
            fontSize: '12px',
        };
        const passwordVali = document.createElement('label');
        passwordVali.textContent = '密码长度6位以上，需包含数字、字母'
        setStyles(passwordVali, passwordValiStyle);
        // 创建确认修改按钮
        const confirmButtonStyles = {
            margin: '38px 5px',
            backgroundColor: '#5D55F4',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            width: '280px',
            height: '50px',
            textAlign: 'center'
        };
        const confirmButton = document.createElement('button');
        confirmButton.textContent = '确认修改';
        setStyles(confirmButton, confirmButtonStyles);
        // 将输入框和确认按钮添加到表单容器中
        passwordFormContainer.appendChild(oldPasswordInput);
        passwordFormContainer.appendChild(document.createElement('br')); // 添加换行符作为分隔
        passwordFormContainer.appendChild(newPasswordInput);
        passwordFormContainer.appendChild(document.createElement('br')); // 添加换行符作为分隔
        passwordFormContainer.appendChild(confirmNewPasswordInput);
        passwordFormContainer.appendChild(document.createElement('br')); // 添加换行符作为分隔
        passwordFormContainer.appendChild(passwordVali);
        passwordFormContainer.appendChild(document.createElement('br')); // 添加换行符作为分隔
        passwordFormContainer.appendChild(confirmButton);

        // 将表单容器添加到主容器中
        container.appendChild(passwordFormContainer);

        // 为修改密码按钮添加点击事件监听器
        changePasswordButton.addEventListener('click', function () {
            passwordFormContainer.style.display = 'block'; // 显示表单
            mainAccout.style.display = 'none';
        });

        // 为确认按钮添加点击事件监听器
        confirmButton.addEventListener('click', function () {
            // 获取输入框的值
            const oldPassword = oldPasswordInput.value;
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmNewPasswordInput.value;

            // 检查所有项是否填写
            if (!oldPassword || !newPassword || !confirmPassword) {
                alert('请填写全部的项');
                return;
            }

            // 检查新密码和旧密码是否相同
            if (oldPassword === newPassword) {
                alert('新密码不能与旧密码相同');
                return;
            }

            // 检查新密码是否包含至少6位，且包含数字和字母
            const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
            if (!passwordPattern.test(newPassword)) {
                alert('密码长度6位以上，需包含数字、字母');
                return;
            }

            // 检查新密码和重复新密码是否匹配
            if (newPassword !== confirmPassword) {
                alert('新密码和重复新密码不一致');
                return;
            }
            let params = JSON.parse(localStorage.getItem('userData'))
            let token = localStorage.getItem('token')
            params.password = newPassword
            delete params.createTime
            fetch('https://cs-admin-ts.billionconnect.net/api/manager/user/update', {
                method: 'POST',
                headers: {
                    'token': token
                },
                body: object2formdata(params)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.key == '0000') { // 假设API返回的数据中有一个success字段表示是否成功
                        alert('修改密码成功');
                        // 隐藏表单
                        passwordFormContainer.style.display = 'none';
                        // 显示主账号页面
                        mainAccout.style.display = 'block';
                    } else {
                        alert('修改密码失败: ' + data.message); // 假设API返回的数据中有一个message字段表示错误信息
                    }
                })
                .catch(error => {
                    console.error('请求失败:', error);
                    alert('修改密码请求失败，请稍后再试');
                });
        });

        // 这里可以添加点击修改密码按钮后的逻辑，比如打开一个模态框或跳转到修改密码页面
        // changePasswordButton.addEventListener('click', someFunction);
        mainAccout.appendChild(changePasswordButton);

        // 将容器添加到文档的body中
        document.body.appendChild(container);
    }
    // 将按钮添加到文档的body中
    document.body.appendChild(floatButton);
    // 创建并显示登录界面
    function showLoginPrompt() {
        console.log('执行登陆');

        // 定义样式对象
        const loginDivStyles = {
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: '316px', // 稍微调整宽度以适应内容
            height: '480px', // 高度自动以适应内容
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#EEF6FF',
            padding: '20px',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
            borderRadius: '18px',
            zIndex: 1000
        };
        const loginFormStyles = {

            width: '300px',
            height: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        };
        const loginDiv = document.createElement('div');
        loginDiv.id = 'loginDiv'
        setStyles(loginDiv, loginDivStyles);

        const titleStyles = {
            // ...（可以根据需要调整，但不需要 position: 'absolute'）
            display: 'flex',
            alignItems: 'center',
        };
        // 创建标题
        const titleContainerStyles = {
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
        };
        const titleContainer = document.createElement('div');
        setStyles(titleContainer, titleContainerStyles);
        const title = document.createElement('h2'); // 使用h2标签可能更合适
        title.textContent = '亿点连接智能客服助手';
        setStyles(title, titleStyles);
        loginDiv.appendChild(titleContainer);
        // 创建并设置图片
        const imageStyles = {
            width: '20px',
            height: '20px',
            marginRight: '10px', // 图片与标题之间的间距
        };
        const imageStylesClose = {
            width: '10px',
            height: '10px',
            cursor: 'pointer',
        };
        const image = document.createElement('img');
        const imageClose = document.createElement('img');
        image.src = 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/fd6d646b65efe59aa26ebf44ceb5f27d.png';
        imageClose.src = 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/01897dee246aa40213a8b3e7026db2d4.png';
        image.alt = '登录图标'; // 提供替代文本以增强可访问性
        imageClose.alt = '关闭图标'; // 提供替代文本以增强可访问性
        setStyles(image, imageStyles);
        setStyles(imageClose, imageStylesClose);
        const titleContainerLeft = document.createElement('div');
        const titleContainerRight = document.createElement('div');
        titleContainerLeft.style.display = 'flex';
        titleContainerLeft.appendChild(image);
        titleContainerLeft.appendChild(title);
        titleContainerRight.appendChild(imageClose);
        titleContainer.appendChild(titleContainerLeft);
        titleContainer.appendChild(titleContainerRight);
        imageClose.addEventListener('click', closeLoginPrompt);
        function closeLoginPrompt() {
            const container = document.getElementById('container');
            if (container) {
                container.remove();
                return;
            }
            const loginDiv = document.getElementById('loginDiv');
            if (loginDiv) {
                loginDiv.remove();
                // 如果 loginDiv 存在，则不执行与 loginDiv 相关的操作
                console.log('loginDiv 已移除，不执行 showLoginPrompt');
                return;
            }
        }
        const LogininputStyle = {
            width: '280px',
            height: '46px',
            borderRadius: '10px',
            fontSize: '14px',
            backgroundColor: '#FFFFFF',
            marginBottom: '14px',
            padding: '0 15px'
        };
        const form = document.createElement('form');
        setStyles(form, loginFormStyles);
        form.onsubmit = handleLogin;
        const usernameDiv = document.createElement('div');
        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
        usernameInput.name = 'username';
        usernameInput.placeholder = '账号';
        usernameInput.required = true;
        setStyles(usernameInput, LogininputStyle);

        const passwordDiv = document.createElement('div');
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.name = 'password';
        passwordInput.placeholder = '密码';
        passwordInput.required = true;
        setStyles(passwordInput, LogininputStyle);

        const confirmButtonStyles = {
            margin: '38px 5px',
            backgroundColor: '#5D55F4',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            width: '280px',
            height: '50px',
            textAlign: 'center'
        };
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = '登录';
        setStyles(submitButton, confirmButtonStyles);
        form.appendChild(usernameDiv);
        usernameDiv.appendChild(usernameInput);
        usernameDiv.appendChild(document.createElement('br'));
        form.appendChild(passwordDiv);
        passwordDiv.appendChild(passwordInput);
        passwordDiv.appendChild(document.createElement('br'));
        form.appendChild(submitButton);

        loginDiv.appendChild(form);
        document.body.appendChild(loginDiv);
    }
    setTimeout(function () {
        let token = localStorage.getItem('token')
        if (token) {
            startAjaxHooking(); // 启动 AJAX 拦截
        } else {
            showLoginPrompt()
        }
    }, 100);
    function object2formdata(params) {
        let formdata = new FormData();
        for (let key in params) {
            formdata.append(key, params[key]);
        }
        return formdata;
    };
    // 处理登录逻辑
    function handleLogin(event) {
        event.preventDefault();
        const form = event.target;
        const userName = form.username.value;
        const password = form.password.value;

        // 使用 fetch API 发送 POST 请求
        fetch('https://cs-admin-ts.billionconnect.net/api/manager/login', {
            method: 'POST', // 指定请求方法为 POST
            body: object2formdata({ userName: userName, password: password })// 将用户名和密码作为 JSON 数据发送
        })
            .then(response => {
                // 检查响应状态
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                // 解析响应为 JSON
                return response.json();
            })
            .then(data => {
                console.log('data', data);

                // 假设服务器在登录成功时返回一个包含成功状态的对象
                if (data.key == '0000') { // 根据实际响应结构调整条件
                    // 登录成功，执行相应逻辑
                    localStorage.setItem('userData', JSON.stringify(data.data.managerUser));
                    localStorage.setItem('token', data.data.TOKEN); // 如果服务器返回了token，则存储它
                    // 移除登录界面（注意：这里应该有一个更好的方式来管理UI的显示和隐藏）
                    document.body.removeChild(form.parentElement);
                    startAjaxHooking(); // 启动 AJAX 拦截（确保这个函数在当前作用域内可访问）
                } else {
                    // 登录失败，显示错误消息
                    alert('Invalid username or password, or other login error.');
                }
            })
            .catch(error => {
                // 处理网络错误或解析错误
                console.error('There has been a problem with your fetch operation:', error);
                alert('Failed to log in due to a network error.');
            });
    }

    /* global ajaxHooker*/
    function startAjaxHooking() {
        let token = localStorage.getItem('token')

        if (token) {
            console.log('有token了');
            let serviceData = JSON.parse(localStorage.getItem('serviceData')) || [];
            let currentServiceData = {
                serviceId: '',
                memories: [],
            }
            let lastProcessedMsgId = null;
            let currentWebSocket = null;
            ajaxHooker.hook(request => {

                if (request.url.includes('/Visitors') && !request.url.includes('/Messages')) {
                    console.log('访客');
                    if (currentWebSocket && currentWebSocket.readyState === WebSocket.OPEN) {
                        console.log('关闭旧的 WebSocket 连接以处理新请求');
                        currentWebSocket.close();
                    }
                    request.response = res => {
                        const json = JSON.parse(res.responseText);
                        console.log('lastChatMessage', json.lastChatMessage, 'res.sessionServiceId', res.sessionServiceId);

                        const memories = [];
                        let matchedServiceData = null;

                        // 遍历 serviceData 查找匹配的 serviceId
                        for (let i = 0; i < serviceData.length; i++) {
                            if (serviceData[i].serviceId === json[0].serviceSessionId) {
                                matchedServiceData = serviceData[i];
                                break;
                            }
                        }

                        // 如果没有找到匹配的，则创建一个新的 currentServiceData
                        if (!matchedServiceData) {
                            matchedServiceData = {
                                serviceId: json[0].serviceSessionId,
                                memories: [],
                            };
                            serviceData.push(matchedServiceData);
                        }
                        if (json && json[0].lastChatMessage && json[0].lastChatMessage.body.bodies[0].type == "txt") {
                            console.log('lastChatMessage', json[0], json[0].lastChatMessage);
                            matchedServiceData.memories.push({

                                role: 'user',
                                content: json[0].lastChatMessage.body.bodies[0].msg
                            });
                            currentServiceData.serviceId = json[0].serviceSessionId
                            currentServiceData.memories.push({ role: 'user', content: json[0].lastChatMessage.body.bodies[0].msg })
                            if (!serviceData.some(sd => sd.serviceId === currentServiceData.serviceId)) {
                                serviceData.push(currentServiceData);
                            }

                            localStorage.setItem('serviceData', JSON.stringify(serviceData))
                            let currentMsgId = json[0].lastChatMessage.msgId;
                            if (currentMsgId !== lastProcessedMsgId) {
                                lastProcessedMsgId = currentMsgId;
                                localStorage.setItem('currentMsgId', currentMsgId);
                                // 关闭旧的 WebSocket 连接
                                if (currentWebSocket) {
                                    console.log('关闭旧的 WebSocket 连接');

                                    currentWebSocket.close();
                                }

                                let currentDataArray = {}
                                JSON.parse(localStorage.getItem('serviceData')).forEach(element => {
                                    if (element.serviceId === currentServiceData.serviceId) {
                                        currentDataArray = element
                                    }
                                });
                                console.log('currentDataArray', currentDataArray);
                                const lastTwentyMemories = currentDataArray.memories.slice(-20);
                                // 使用解析出的数据建立 WebSocket 连接
                                const wsUrl = 'wss://bot-api-ts.billionconnect.net/chat_completion';
                                currentWebSocket = new WebSocket(wsUrl);
                                currentWebSocket.onopen = function (event) {
                                    console.log('WebSocket is open now.', json[0]);
                                    const messageBody = json[0].lastChatMessage.body.bodies[0].msg;
                                    const messageData = {
                                        q: messageBody,
                                        user_id: "test",
                                        bot: "mall_h5",
                                        stream: true,
                                        source: "default",
                                        new_thread: false,
                                        memories: lastTwentyMemories
                                    };
                                    console.log('messageData', messageData);
                                    currentWebSocket.send(JSON.stringify(messageData));
                                    let serviceData = JSON.parse(localStorage.getItem('serviceData'))
                                    serviceData.forEach(element => {
                                        element.msgIds = []
                                        if (element.serviceId === json[0].serviceSessionId) {
                                            element.msgIds.push(json[0].lastChatMessage.msgId)
                                        }
                                    })
                                    localStorage.setItem('serviceData', JSON.stringify(serviceData))
                                };

                                currentWebSocket.onmessage = function (event) {
                                    let parseData = JSON.parse(event.data);
                                    if (parseData.finish && currentMsgId) {
                                        let serviceData = JSON.parse(localStorage.getItem('serviceData'))
                                        function storeMessage(msg, id, serviceId) {
                                            let conversationData = JSON.parse(localStorage.getItem('conversationData')) || [];
                                            let serviceIndex = conversationData.findIndex(s => s.serviceId == serviceId);
                                
                                            if (serviceIndex === -1) {
                                                // 如果没有找到对应的 serviceId，则创建一个新的
                                                conversationData.push({
                                                    serviceId: serviceId,
                                                    conversation: [{ msgId: id, msg: msg }]
                                                });
                                            } else {
                                                // 如果找到了对应的 serviceId，则向 conversation 数组中添加新的消息
                                                conversationData[serviceIndex].conversation.push({ msgId: id, msg: msg });
                                            }
                                
                                            // 将更新后的 conversationData 存储回 localStorage
                                            console.log('conversationData', conversationData);
                                
                                            localStorage.setItem('conversationData', JSON.stringify(conversationData));
                                        }
                                        storeMessage(parseData.msg.content, currentMsgId, currentServiceData.serviceId);
                                        serviceData.forEach(element => {
                                            if (element.msgIds.includes(currentMsgId)) {
                                                element.memories.push({ role: 'assistant', content: parseData.msg.content })
                                            }
                                        })
                                        localStorage.setItem('serviceData', JSON.stringify(serviceData))
                                        injectDivBelowTarget(parseData.msg.content, currentMsgId, currentServiceData.serviceId);
                                        console.log('WebSocket message received:消息为', parseData, document);

                                    }
                                };

                                currentWebSocket.onclose = function (event) {
                                    console.log('WebSocket is closed now.');
                                };

                                currentWebSocket.onerror = function (error) {
                                    console.error('WebSocket error observed:', error);
                                };
                            } else {
                                console.error('报错了已处理过此消息 ID');
                            }
                        }
                    };
                } else if (request.url.includes('/Messages')) {
                    console.log('客服发的消息');
                    request.response = res => {
                        const json = JSON.parse(res.responseText);

                        let matchedServiceData = null;
                        if (json && json.sessionServiceId) {
                            // 遍历 serviceData 查找匹配的 serviceId
                            for (let i = 0; i < serviceData.length; i++) {
                                if ((serviceData[i].serviceId === json.sessionServiceId)) {
                                    matchedServiceData = serviceData[i];
                                    break;
                                }
                            }

                            // 如果没有找到匹配的，则创建一个新的 currentServiceData
                            if (!matchedServiceData) {
                                matchedServiceData = {
                                    serviceId: json.sessionServiceId,
                                    memories: [],
                                };
                                serviceData.push(matchedServiceData);
                            }
                            if (json && json.sessionServiceId && json.body.bodies[0].type == "txt") {
                                console.log('lastChatMessage', json, json.body.bodies[0].msg);
                                matchedServiceData.memories.push({

                                    role: 'assistant',
                                    content: json.body.bodies[0].msg
                                });
                                currentServiceData.serviceId = json.sessionServiceId
                                console.log('currentServiceData', currentServiceData);

                                currentServiceData.memories.push({ role: 'assistant', content: json.body.bodies[0].msg })
                                if (!serviceData.some(sd => sd.serviceId === currentServiceData.serviceId)) {
                                    serviceData.push(currentServiceData);
                                }

                                localStorage.setItem('serviceData', JSON.stringify(serviceData))

                            }
                        } else if (json && json.messages && json.messages.length > 0) {
                            console.log('信回话');
                            let conversationData = JSON.parse(localStorage.getItem('conversationData')) || [];
                            // 处理不包含 sessionServiceId 但包含 messages 的情况
                            json.messages.forEach(message => {
                                let conversationItem = conversationData.find(item => item.serviceId === message.sessionServiceId);
                                if (conversationItem) {
                                    console.log('conversationItem', conversationItem);

                                    // 假设每个 conversationItem 都有一个 messages 数组来存储消息
                                    conversationItem.conversation.forEach(item => {
                                        let messageItem = json.messages.find(msg => msg.msgId === message.msgId);
                                        if (messageItem) {
                                            console.log('messageItem', messageItem);
                                            if (item.msgId == messageItem.msgId) {

                                                setTimeout(() => {
                                                    injectMessageBelowTarget(item.msg, messageItem.msgId)
                                                }, 100);
                                            }
                                            // 更新 DOM 节点，假设你有一个函数 updateMessageNode 来处理这个
                                            // updateMessageNode(messageItem.domId, message.content);
                                        }
                                    })
                                }
                            });

                            // 更新本地存储中的 conversationData
                            localStorage.setItem('conversationData', JSON.stringify(conversationData));
                        } else {
                            // 处理其他情况
                        }


                    };

                }
            });
        }
    }

    //用来循环注入消息记录的方法
    function injectMessageBelowTarget(msg, id) {
        console.log('injectMessageBelowTarget', msg, id);

        const allTargetPs = document.querySelectorAll('li.ui-itm-txtmsg.left>div>p');

        let targetElement = null;
        for (let p of allTargetPs) {
            console.log('p', p.textContent.trim(), id);
            if (p.textContent.trim() == id) {
                targetElement = p;
                break;
            }
        }
        if (!targetElement) {
            console.warn('未找到内容为 id 的 p 元素');
            return;
        }

        const targetElementParent = targetElement.parentElement;
        const scrollContainer = targetElementParent.parentElement.parentElement;
        if (!scrollContainer || !targetElementParent) {
            console.warn('滚动容器或目标 p 元素的父元素不存在');
            return;
        }

        const newDiv = document.createElement('div');
        const showMoreButton = document.createElement('img'); // 修改为图片
        showMoreButton.src = 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/0e36eef2990308d9e1474b54a880b4a7.png'; // 替换为您的图片路径
        showMoreButton.alt = '显示/收起';
        showMoreButton.style.cursor = 'pointer'; // 添加鼠标指针样式
        showMoreButton.style.display = 'inline-block'; // 设置为内联块元素以控制尺寸
        showMoreButton.style.width = '10px'; // 设置图片宽度
        showMoreButton.style.height = '10px'; // 设置图片高度

        newDiv.style.display = 'block';
        newDiv.style.whiteSpace = 'nowrap';
        newDiv.style.overflow = 'hidden';
        newDiv.style.textOverflow = 'ellipsis';
        newDiv.textContent = msg;

        const wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add('message-wrapper');
        wrapperDiv.style.marginTop = '10px';
        wrapperDiv.style.border = '2px solid #C1BDFF';
        wrapperDiv.style.minWidth = '92%';
        wrapperDiv.style.padding = '10px';
        wrapperDiv.style.overflowWrap = 'break-word';
        wrapperDiv.style.position = 'relative'; // 添加相对定位以包含图片
        wrapperDiv.appendChild(newDiv);

        // 将图片添加到 wrapperDiv 的最右侧
        const imageContainer = document.createElement('div');
        imageContainer.style.position = 'absolute';
        imageContainer.style.top = '10px'; // 调整以匹配 padding
        imageContainer.style.right = '10px'; // 调整以匹配 padding
        imageContainer.style.width = '10px'; // 调整以匹配 padding
        imageContainer.style.height = '10px'; // 调整以匹配 padding
        imageContainer.appendChild(showMoreButton);
        wrapperDiv.appendChild(imageContainer);

        let isExpanded = false;

        showMoreButton.addEventListener('click', function () {
            if (isExpanded) {
                newDiv.style.whiteSpace = 'nowrap';
                newDiv.style.overflow = 'hidden';
                showMoreButton.src = 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/0e36eef2990308d9e1474b54a880b4a7.png'; // 替换为折叠状态的图片路径
                isExpanded = false;
                // 显示分隔线和按钮
                const divider = newDiv.querySelector('.divider');
                const buttonContainer = newDiv.querySelector('.button-container');
                if (divider && buttonContainer) {
                    divider.style.display = 'none';
                    buttonContainer.style.display = 'none';
                }
            } else {
                newDiv.style.whiteSpace = 'normal';
                newDiv.style.overflow = 'visible';
                showMoreButton.src = 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/0e36eef2990308d9e1474b54a880b4a7.png'; // 替换为展开状态的图片路径
                isExpanded = true;
                // 隐藏分隔线和按钮
                const divider = newDiv.querySelector('.divider');
                const buttonContainer = newDiv.querySelector('.button-container');
                if (divider && buttonContainer) {
                    divider.style.display = 'block';
                    buttonContainer.style.display = 'flex';
                }
            }
            // updateScrollContainer()
            updateUlTransform(isExpanded)
        });

        const divider = document.createElement('div');
        divider.classList.add('divider');
        divider.style.borderBottom = '1px solid #ccc';
        divider.style.margin = '8px 0';
        divider.style.display = 'none'; // 初始设置为隐藏，如果内容未展开则显示

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.marginTop = '8px';
        buttonContainer.style.display = 'none'; // 初始设置为隐藏，如果内容未展开则显示
        // 假设的函数，用于根据按钮标签返回图片 URL
        function getImageButtonSrc(label, isSelected = false) {
            const imageMap = {
                '赞': {
                    selected: 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/947377f9136b2c940d166adeaaedd89f.png',
                    unselected: 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/ec3e90ee2281341de801042d689452d7.png'
                },
                '踩': {
                    selected: 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/40449052b747590860def90ffba6266c.png',
                    unselected: 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/c01367999ce71e05ba103a5c7c181a5e.png'
                },
                '复制': {
                    selected: 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/0145f6561c80202e022c5b07145b0077.png',
                    unselected: 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/0145f6561c80202e022c5b07145b0077.png',
                },

                '填充': {
                    selected: 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/090fcd83546c4f2675b0b9b506815881.png',
                    unselected: 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/090fcd83546c4f2675b0b9b506815881.png',
                },
            };
            return imageMap[label] ? (isSelected ? imageMap[label].selected : imageMap[label].unselected) : 'default-icon.png'; // 如果没有找到对应的标签，返回默认图片（确保这个URL也是有效的）
        }

        const buttons = ['赞', '踩', '复制', '填充'].map(label => {
            const button = document.createElement('button');
            button.classList.add('action-button');
            button.style.marginRight = '8px';
            button.style.backgroundImage = 'none'; // 确保没有背景图干扰
            button.style.border = 'none'; // 可选：移除边框，根据样式需求来决定
            button.style.padding = '0'; // 可选：移除内边距，确保图片正确显示
            button.style.width = '14px'; // 设置按钮宽度，或者让图片自然大小显示
            button.style.height = '14px'; // 设置按钮高度，或者让图片自然比例显示（如果不设置高度，图片会保持比例）

            // 创建一个 img 元素并设置其 src 属性
            const img = document.createElement('img');
            img.src = getImageButtonSrc(label, false);
            img.alt = label; // 设置替代文本，这对于无障碍访问很重要
            // 可选：设置图片的宽度和高度，或者让 CSS 管理这些样式
            img.style.width = '14px'; // 如果希望图片填充按钮宽度，可以这样设置
            img.style.height = '14px'; // 保持图片比例

            // 将 img 元素添加到 button 元素中
            button.appendChild(img);

            // 假设 newDiv 和 targetElementParent 在此上下文中是可访问的
            // 注意：这里的 newDiv 应该是在外部作用域中定义的，确保它在这里可以访问
            const pElements = targetElementParent.querySelectorAll('p');
            const userMsgContent = pElements[0] ? pElements[0].textContent : '';
            const msgId = pElements[1] ? pElements[1].textContent : '';

            // 为不同的按钮添加事件监听器
            const handleClick = (eventLabel) => {
                return (event) => {
                    if (label === '赞' || label === '踩') {
                        let currentSrc = event.target.src;
                        let newSelectedState = !currentSrc.includes('selected');
                        let newSrc = getImageButtonSrc(label, newSelectedState);

                        event.target.src = newSrc; // 更新图像
                    }
                    if (eventLabel === '赞') {
                        sendReview(1, newDiv.textContent, msgId, userMsgContent);
                    } else if (eventLabel === '踩') {
                        sendReview(2, newDiv.textContent, msgId, userMsgContent);
                    } else if (eventLabel === '复制') {
                        copyToClipboard(newDiv.textContent);
                    } else if (eventLabel === '填充') {
                        fillTextArea(newDiv.textContent);
                    }
                };
            };

            button.addEventListener('click', handleClick(label, newDiv));
            return button;
        });

        buttons[buttons.length - 1].style.marginRight = '0';
        buttonContainer.append(...buttons);

        // 在内容未展开时添加分隔线和按钮
        newDiv.appendChild(divider);
        newDiv.appendChild(buttonContainer);
        // 发送评论的函数
        function formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
        function sendReview(reviewType, aiMsg, msgId, userMsg) {
            const url = 'https://w-ts.billionconnect.com/api/aloy-h5/pub/user/review/message/report';
            let data = JSON.parse(localStorage.getItem('userData'));
            console.log('aiMsg,userMsg', aiMsg, msgId, userMsg);
            let obj = {
                userName: data.id,
                msgId: msgId,
                userMsgContent: userMsg,
                aiMsgContent: aiMsg,
                reviewType: reviewType,
                reviewCreatedDate: formatDate(new Date())
            }

            let params = {
                jsonString: JSON.stringify([obj]),
                robotName: 'mall_h5'
            }

            fetch(url, {
                method: 'POST',
                headers: {
                    // 如果需要认证，可以在这里添加 Authorization 头部
                    // 'Authorization': 'Bearer YOUR_TOKEN'
                },
                body: object2formdata(params),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Review sent successfully:', data);
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        }

        // 复制文本到剪贴板的函数（与之前相同）
        function copyToClipboard(text) {
            if (!navigator.clipboard) {
                // Fallback for browsers that don't support direct clipboard access
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";  // Avoid scrolling to bottom
                textArea.style.top = "-9999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const success = document.execCommand('copy');
                document.body.removeChild(textArea);
                if (success) {
                    console.log('Text copied to clipboard');
                } else {
                    console.error('Failed to copy text to clipboard');
                }
            } else {
                navigator.clipboard.writeText(text).then(function () {
                    console.log('Text copied to clipboard');
                }, function (err) {
                    console.error('Failed to copy text to clipboard:', err);
                });
            }
        }

        // 填充文本到 textarea 的函数
        function fillTextArea(text) {
            // 找到类名为 ui-cmp-msgeditor 的 div 元素
            const msgEditorDiv = document.querySelector('.ui-cmp-msgeditor');
            if (msgEditorDiv) {
                // 在该 div 元素中找到 textarea 元素
                const textarea = msgEditorDiv.querySelector('textarea');
                if (textarea) {
                    // 将文本设置为 textarea 的值
                    textarea.value = text;
                    console.log('Text filled into textarea');
                } else {
                    console.error('Textarea not found within .ui-cmp-msgeditor');
                }
            } else {
                console.error('.ui-cmp-msgeditor div not found');
            }
        }
        // Temporary add to document to calculate height
        document.body.appendChild(wrapperDiv);
        const newDivHeight = wrapperDiv.offsetHeight;
        document.body.removeChild(wrapperDiv);

        targetElementParent.insertAdjacentElement('afterend', wrapperDiv);
        requestAnimationFrame(() => {
            // 更新滚动容器的滚动位置
            // updateScrollContainer();
            updateUlTransform();
        });
        function updateUlTransform() {
            // 获取父容器，它有一个类名为 'em-msg-max-height'
            const parentContainer = document.querySelector('.em-msg-max-height');
            const ulElement = parentContainer.querySelector('ul');
            let yOffset = 0;
            yOffset = parentContainer.clientHeight - ulElement.clientHeight;
            console.log('yOffset', yOffset);

            ulElement.style.transform = `translateY(${yOffset}px)`;
            ulElement.style.transition = 'transform 0.3s ease';

        }
        // function storeMessage(msg, id, serviceId) {
        //     let conversationData = JSON.parse(localStorage.getItem('conversationData')) || [];
        //     let serviceIndex = conversationData.findIndex(s => s.serviceId == serviceId);

        //     if (serviceIndex === -1) {
        //         // 如果没有找到对应的 serviceId，则创建一个新的
        //         conversationData.push({
        //             serviceId: serviceId,
        //             conversation: [{ msgId: id, msg: msg }]
        //         });
        //     } else {
        //         // 如果找到了对应的 serviceId，则向 conversation 数组中添加新的消息
        //         conversationData[serviceIndex].conversation.push({ msgId: id, msg: msg });
        //     }

        //     // 将更新后的 conversationData 存储回 localStorage
        //     console.log('conversationData', conversationData);

        //     localStorage.setItem('conversationData', JSON.stringify(conversationData));
        // }
        // storeMessage(msg, id, serviceId);
    }



    // 注入消息到页面中的函数（保持不变）
    function injectDivBelowTarget(msg, id, serviceId) {
        const allPs = document.querySelectorAll('p');
        let targetElement = null;
        for (let p of allPs) {
            if (p.textContent.trim() === id) {
                targetElement = p;
                break;
            }
        }

        if (!targetElement) {
            console.warn('未找到内容为 id 的 p 元素');
            return;
        }

        const targetElementParent = targetElement.parentElement;
        const scrollContainer = targetElementParent.parentElement.parentElement;
        if (!scrollContainer || !targetElementParent) {
            console.warn('滚动容器或目标 p 元素的父元素不存在');
            return;
        }

        const newDiv = document.createElement('div');
        const showMoreButton = document.createElement('img'); // 修改为图片
        showMoreButton.src = 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/0e36eef2990308d9e1474b54a880b4a7.png'; // 替换为您的图片路径
        showMoreButton.alt = '显示/收起';
        showMoreButton.style.cursor = 'pointer'; // 添加鼠标指针样式
        showMoreButton.style.display = 'inline-block'; // 设置为内联块元素以控制尺寸
        showMoreButton.style.width = '10px'; // 设置图片宽度
        showMoreButton.style.height = '10px'; // 设置图片高度

        newDiv.style.display = 'block';
        newDiv.style.whiteSpace = 'nowrap';
        newDiv.style.overflow = 'hidden';
        newDiv.style.textOverflow = 'ellipsis';
        newDiv.textContent = msg;

        const wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add('message-wrapper');
        wrapperDiv.style.marginTop = '10px';
        wrapperDiv.style.border = '2px solid #C1BDFF';
        wrapperDiv.style.minWidth = '92%';
        wrapperDiv.style.padding = '10px';
        wrapperDiv.style.overflowWrap = 'break-word';
        wrapperDiv.style.position = 'relative'; // 添加相对定位以包含图片
        wrapperDiv.appendChild(newDiv);

        // 将图片添加到 wrapperDiv 的最右侧
        const imageContainer = document.createElement('div');
        imageContainer.style.position = 'absolute';
        imageContainer.style.top = '10px'; // 调整以匹配 padding
        imageContainer.style.right = '10px'; // 调整以匹配 padding
        imageContainer.style.width = '10px'; // 调整以匹配 padding
        imageContainer.style.height = '10px'; // 调整以匹配 padding
        imageContainer.appendChild(showMoreButton);
        wrapperDiv.appendChild(imageContainer);

        let isExpanded = false;

        showMoreButton.addEventListener('click', function () {
            if (isExpanded) {
                newDiv.style.whiteSpace = 'nowrap';
                newDiv.style.overflow = 'hidden';
                showMoreButton.src = 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/0e36eef2990308d9e1474b54a880b4a7.png'; // 替换为折叠状态的图片路径
                isExpanded = false;
                // 显示分隔线和按钮
                const divider = newDiv.querySelector('.divider');
                const buttonContainer = newDiv.querySelector('.button-container');
                if (divider && buttonContainer) {
                    divider.style.display = 'none';
                    buttonContainer.style.display = 'none';
                }
            } else {
                newDiv.style.whiteSpace = 'normal';
                newDiv.style.overflow = 'visible';
                showMoreButton.src = 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/0e36eef2990308d9e1474b54a880b4a7.png'; // 替换为展开状态的图片路径
                isExpanded = true;
                // 隐藏分隔线和按钮
                const divider = newDiv.querySelector('.divider');
                const buttonContainer = newDiv.querySelector('.button-container');
                if (divider && buttonContainer) {
                    divider.style.display = 'block';
                    buttonContainer.style.display = 'flex';
                }
            }
            // updateScrollContainer()
            updateUlTransform(isExpanded)
        });

        const divider = document.createElement('div');
        divider.classList.add('divider');
        divider.style.borderBottom = '1px solid #ccc';
        divider.style.margin = '8px 0';
        divider.style.display = 'none'; // 初始设置为隐藏，如果内容未展开则显示

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.marginTop = '8px';
        buttonContainer.style.display = 'none'; // 初始设置为隐藏，如果内容未展开则显示
        // 假设的函数，用于根据按钮标签返回图片 URL
        function getImageButtonSrc(label, isSelected = false) {
            const imageMap = {
                '赞': {
                    selected: 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/947377f9136b2c940d166adeaaedd89f.png',
                    unselected: 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/ec3e90ee2281341de801042d689452d7.png'
                },
                '踩': {
                    selected: 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/40449052b747590860def90ffba6266c.png',
                    unselected: 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/c01367999ce71e05ba103a5c7c181a5e.png'
                },
                '复制': {
                    selected: 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/0145f6561c80202e022c5b07145b0077.png',
                    unselected: 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/0145f6561c80202e022c5b07145b0077.png',
                },

                '填充': {
                    selected: 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/090fcd83546c4f2675b0b9b506815881.png',
                    unselected: 'https://emov-hongkong.oss-cn-hongkong.aliyuncs.com/h5store/090fcd83546c4f2675b0b9b506815881.png',
                },
            };
            return imageMap[label] ? (isSelected ? imageMap[label].selected : imageMap[label].unselected) : 'default-icon.png'; // 如果没有找到对应的标签，返回默认图片（确保这个URL也是有效的）
        }

        const buttons = ['赞', '踩', '复制', '填充'].map(label => {
            const button = document.createElement('button');
            button.classList.add('action-button');
            button.style.marginRight = '8px';
            button.style.backgroundImage = 'none'; // 确保没有背景图干扰
            button.style.border = 'none'; // 可选：移除边框，根据样式需求来决定
            button.style.padding = '0'; // 可选：移除内边距，确保图片正确显示
            button.style.width = '14px'; // 设置按钮宽度，或者让图片自然大小显示
            button.style.height = '14px'; // 设置按钮高度，或者让图片自然比例显示（如果不设置高度，图片会保持比例）

            // 创建一个 img 元素并设置其 src 属性
            const img = document.createElement('img');
            img.src = getImageButtonSrc(label, false);
            img.alt = label; // 设置替代文本，这对于无障碍访问很重要
            // 可选：设置图片的宽度和高度，或者让 CSS 管理这些样式
            img.style.width = '14px'; // 如果希望图片填充按钮宽度，可以这样设置
            img.style.height = '14px'; // 保持图片比例

            // 将 img 元素添加到 button 元素中
            button.appendChild(img);

            // 假设 newDiv 和 targetElementParent 在此上下文中是可访问的
            // 注意：这里的 newDiv 应该是在外部作用域中定义的，确保它在这里可以访问
            const pElements = targetElementParent.querySelectorAll('p');
            const userMsgContent = pElements[0] ? pElements[0].textContent : '';
            const msgId = pElements[1] ? pElements[1].textContent : '';

            // 为不同的按钮添加事件监听器
            const handleClick = (eventLabel) => {
                return (event) => {
                    if (label === '赞' || label === '踩') {
                        let currentSrc = event.target.src;
                        let newSelectedState = !currentSrc.includes('selected');
                        let newSrc = getImageButtonSrc(label, newSelectedState);

                        event.target.src = newSrc; // 更新图像
                    }
                    if (eventLabel === '赞') {
                        sendReview(1, newDiv.textContent, msgId, userMsgContent);
                    } else if (eventLabel === '踩') {
                        sendReview(2, newDiv.textContent, msgId, userMsgContent);
                    } else if (eventLabel === '复制') {
                        copyToClipboard(newDiv.textContent);
                    } else if (eventLabel === '填充') {
                        fillTextArea(newDiv.textContent);
                    }
                };
            };

            button.addEventListener('click', handleClick(label, newDiv));
            return button;
        });

        buttons[buttons.length - 1].style.marginRight = '0';
        buttonContainer.append(...buttons);

        // 在内容未展开时添加分隔线和按钮
        newDiv.appendChild(divider);
        newDiv.appendChild(buttonContainer);
        // 发送评论的函数
        function formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
        function sendReview(reviewType, aiMsg, msgId, userMsg) {
            const url = 'https://w-ts.billionconnect.com/api/aloy-h5/pub/user/review/message/report';
            let data = JSON.parse(localStorage.getItem('userData'));
            console.log('aiMsg,userMsg', aiMsg, msgId, userMsg);
            let obj = {
                userName: data.id,
                msgId: msgId,
                userMsgContent: userMsg,
                aiMsgContent: aiMsg,
                reviewType: reviewType,
                reviewCreatedDate: formatDate(new Date())
            }

            let params = {
                jsonString: JSON.stringify([obj]),
                robotName: 'mall_h5'
            }

            fetch(url, {
                method: 'POST',
                headers: {
                    // 如果需要认证，可以在这里添加 Authorization 头部
                    // 'Authorization': 'Bearer YOUR_TOKEN'
                },
                body: object2formdata(params),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Review sent successfully:', data);
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        }

        // 复制文本到剪贴板的函数（与之前相同）
        function copyToClipboard(text) {
            if (!navigator.clipboard) {
                // Fallback for browsers that don't support direct clipboard access
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";  // Avoid scrolling to bottom
                textArea.style.top = "-9999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const success = document.execCommand('copy');
                document.body.removeChild(textArea);
                if (success) {
                    console.log('Text copied to clipboard');
                } else {
                    console.error('Failed to copy text to clipboard');
                }
            } else {
                navigator.clipboard.writeText(text).then(function () {
                    console.log('Text copied to clipboard');
                }, function (err) {
                    console.error('Failed to copy text to clipboard:', err);
                });
            }
        }

        // 填充文本到 textarea 的函数
        function fillTextArea(text) {
            // 找到类名为 ui-cmp-msgeditor 的 div 元素
            const msgEditorDiv = document.querySelector('.ui-cmp-msgeditor');
            if (msgEditorDiv) {
                // 在该 div 元素中找到 textarea 元素
                const textarea = msgEditorDiv.querySelector('textarea');
                if (textarea) {
                    // 将文本设置为 textarea 的值
                    textarea.value = text;
                    console.log('Text filled into textarea');
                } else {
                    console.error('Textarea not found within .ui-cmp-msgeditor');
                }
            } else {
                console.error('.ui-cmp-msgeditor div not found');
            }
        }
        // Temporary add to document to calculate height
        document.body.appendChild(wrapperDiv);
        const newDivHeight = wrapperDiv.offsetHeight;
        document.body.removeChild(wrapperDiv);

        targetElementParent.insertAdjacentElement('afterend', wrapperDiv);
        requestAnimationFrame(() => {
            // 更新滚动容器的滚动位置
            // updateScrollContainer();
            updateUlTransform();
        });
        function updateScrollContainer() {
            console.log('updateScrollContainer');
            const rect = targetElement.getBoundingClientRect();
            const containerRect = scrollContainer.getBoundingClientRect();
            let scrollTop = scrollContainer.scrollTop;
            let offset = rect.top - containerRect.top + scrollTop;

            if (isExpanded) {
                scrollTop += newDivHeight - rect.height;
            } else {
                scrollTop = offset - rect.height;
            }

            scrollContainer.scrollTop = scrollTop;
            console.log('scrollTop', scrollTop);

        }
        function updateUlTransform() {
            // 获取父容器，它有一个类名为 'em-msg-max-height'
            const parentContainer = document.querySelector('.em-msg-max-height');
            const ulElement = parentContainer.querySelector('ul');
            let yOffset = 0;
            yOffset = parentContainer.clientHeight - ulElement.clientHeight;
            console.log('yOffset', yOffset);

            ulElement.style.transform = `translateY(${yOffset}px)`;
            ulElement.style.transition = 'transform 0.3s ease';

        }
        function storeMessage(msg, id, serviceId) {
            let conversationData = JSON.parse(localStorage.getItem('conversationData')) || [];
            let serviceIndex = conversationData.findIndex(s => s.serviceId == serviceId);

            if (serviceIndex === -1) {
                // 如果没有找到对应的 serviceId，则创建一个新的
                conversationData.push({
                    serviceId: serviceId,
                    conversation: [{ msgId: id, msg: msg }]
                });
            } else {
                // 如果找到了对应的 serviceId，则向 conversation 数组中添加新的消息
                conversationData[serviceIndex].conversation.push({ msgId: id, msg: msg });
            }

            // 将更新后的 conversationData 存储回 localStorage
            console.log('conversationData', conversationData);

            localStorage.setItem('conversationData', JSON.stringify(conversationData));
        }
        storeMessage(msg, id, serviceId);
    }
})();