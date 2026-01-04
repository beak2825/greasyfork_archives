// ==UserScript==
// @name         SEU研究生讲座预约助手
// @icon         https://i.seu.edu.cn/oss/iconLab/2023-02-17/研究生素质讲座-学生-1076102412478222336.png?sign=rl70_oAzOdwUO0mO4Qq3_eYf5rD-ymKu0Ypgh9DiRnFlT3ds7c8wOok37-UxVig5
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  能够在PC端SEU网上办事服务大厅的研究生素质讲座实现自动定时抢讲座，可以做到自动或者手动输入验证码，解放双手！
// @author       SEU-xfg
// @match        http://ehall.seu.edu.cn/gsapp/sys/jzxxtjapp/*
// @homepageURL https://github.com/Cliencer/SEU-lecture-helper
// @supportURL  https://github.com/Cliencer/SEU-lecture-helper/issues
// @downloadURL https://update.greasyfork.org/scripts/480116/SEU%E7%A0%94%E7%A9%B6%E7%94%9F%E8%AE%B2%E5%BA%A7%E9%A2%84%E7%BA%A6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/480116/SEU%E7%A0%94%E7%A9%B6%E7%94%9F%E8%AE%B2%E5%BA%A7%E9%A2%84%E7%BA%A6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var settingsPanel = document.createElement('div');
    settingsPanel.innerHTML = `
    <div id="mySettingsPanel" style="position: fixed; top: 40px; right: 10px; z-index: 1000; background-color: white; border: 1px solid black; padding: 10px; display: none;">
    <h3>设置</h3>
    <div>
        <label><input type="checkbox" id="autoVerifyCheck"> 自动输入验证码</label>
    </div>
    <div id="credentials" style="display: none;">
        <div>
            <label>用户名：<input type="text" id="username"></label>
        </div>
        <div>
            <label>密码：<input type="password" id="password"></label>
        </div>
        <div>
            <label>SoftID：<input type="text" id="softid"></label>
        </div>
    </div>
    <div>
        <label>延迟时间（秒）：<input type="number" id="delayTime" min="0" value="1"></label>
    </div>
    <button id="saveSettings">保存</button>
    <button id="closeSettings">关闭</button>
    <button id="helpButton">帮助</button>
</div>

`
    var autoVerify = localStorage.getItem('autoVerify') === 'true';
    var delayTime = localStorage.getItem('delayTime') || 1;

    var floatButton = document.createElement('button');
    floatButton.textContent = '插件设置';
    floatButton.style.position = 'fixed';
    floatButton.style.right = '5px';
    floatButton.style.bottom = '200px';
    floatButton.style.padding = '10px 20px';
    floatButton.style.backgroundColor = '#0078D7';
    floatButton.style.color = 'white';
    floatButton.style.border = 'none';
    floatButton.style.borderRadius = '5px';
    floatButton.style.cursor = 'pointer';
    floatButton.style.zIndex = '1000';

    // 添加按钮到文档中
    document.body.appendChild(floatButton);
    document.body.appendChild(settingsPanel);

    // 打开设置面板
    floatButton.addEventListener('click', function () {
        document.getElementById('mySettingsPanel').style.display = 'block';
    });

    // 关闭设置面板
    document.getElementById('closeSettings').addEventListener('click', function () {
        document.getElementById('mySettingsPanel').style.display = 'none';
    });

    // 控制显示/隐藏凭证输入框
    document.getElementById('autoVerifyCheck').addEventListener('change', function () {
        document.getElementById('credentials').style.display = this.checked ? 'block' : 'none';
    });

    // 保存设置
    document.getElementById('saveSettings').addEventListener('click', function () {
        autoVerify = document.getElementById('autoVerifyCheck').checked;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const softid = document.getElementById('softid').value;
        delayTime = document.getElementById('delayTime').value;

        localStorage.setItem('autoVerify', autoVerify);
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        localStorage.setItem('softid', softid);
        localStorage.setItem('delayTime', delayTime);
        document.getElementById('mySettingsPanel').style.display = 'none';
        alert('设置已保存');
    });

    // 加载保存的设置
    window.onload = function () {
        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');
        const softid = localStorage.getItem('softid');

        document.getElementById('autoVerifyCheck').checked = autoVerify;
        document.getElementById('username').value = username;
        document.getElementById('password').value = password;
        document.getElementById('softid').value = softid;
        document.getElementById('delayTime').value = delayTime;

        if (autoVerify) {
            document.getElementById('credentials').style.display = 'block';
        }
    };

    // 显示帮助信息
    document.getElementById('helpButton').addEventListener('click', function () {
        alert(`由于脚本需要自动获取验证码图片，并识别验证码，因此选用超级鹰接口服务。其账户配置过程如下：
1. 访问 http://www.chaojiying.com/ ，注册账号，充值1元作为接口费用。
2. 进入个人中心 > 软件ID，申请一个软件ID。
3. 将用户名，密码，软件ID分别复制到设置的三个框内`);
    });






    //讲座系统请求头
    const lecture_headers = {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en-US;q=0.7,en;q=0.6',
        'Connection': 'keep-alive',
        'Content-Length': '0',
        'Host': 'ehall.seu.edu.cn',
        'Origin': 'http://ehall.seu.edu.cn',
        'Referer': 'http://ehall.seu.edu.cn/gsapp/sys/yddjzxxtjappseu/*default/index.do',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        'X-Requested-With': 'XMLHttpRequest',
        'Cookie': document.cookie
    }


    var lectureList

    getTargetLecture()

    // 等待特定元素加载完成
    waitForElement('tbody', function (tbody) {
        // 对tbody进行操作
        observeTbody(tbody);
    });

    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                obs.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function observeTbody(tbody) {
        const trObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeName === 'TR') {
                            // 在这里对每个新添加的tr元素执行操作
                            console.log('新的 tr 元素被添加:', node);

                            insertButtonsInTr(node)
                        }
                    });
                }
            });
        });

        // 监控tbody下的子元素变化
        trObserver.observe(tbody, { childList: true });
    }

    function insertButtonsInTr(tr) {
        // 获取第一个td元素
        const firstTd = tr.querySelector('td');
        // 获取第四个td中的span的文本
        const fourthTdSpanText = tr.querySelector('td:nth-child(4) span')?.textContent.trim();

        if (firstTd && fourthTdSpanText) {
            // 创建一个新的按钮元素
            const button = document.createElement('button');
            button.innerText = `预约自动抢课`;
            button.style.marginLeft = '10px'; // 添加一些样式，例如左边距

            // 将按钮添加到td元素中
            firstTd.appendChild(button);

            // 按钮点击事件
            button.addEventListener('click', function () {
                const lecture = findMatchingObject(fourthTdSpanText)
                button.disabled = true;
                console.log(lecture)
                let wid = lecture.WID
                let time = lecture.YYKSSJ
                let timeout = calculateTimeDifference(time) + delayTime * 1000
                if (timeout < 500) {
                    timeout = 500
                } else if (timeout > 3000) {
                    if (autoVerify) {
                        var dialogText = "正在准备抢课，不要关闭，请耐心等待。"
                    } else {
                        dialogText = "你还未设置自动输入验证码，请在倒计时结束前在电脑前准备手动输入！"
                    }
                    var dialogBox = createWindows10StyleDialog(dialogText)
                }

                startCountdown(timeout, button)


                let keepAliveIntervalId = setInterval(() => {
                    keepAlive(wid);
                }, 60 * 1000);
                setTimeout(() => {
                    try { dialogBox.style.display = 'none'; } catch (e) { }
                    rob(wid)
                    // 抢讲座操作完成后，清除保活定时器
                    clearInterval(keepAliveIntervalId);
                }, timeout);

            });
        }
    }


    // 获取目标讲座信息
    function getTargetLecture() {
        fetch('http://ehall.seu.edu.cn/gsapp/sys/yddjzxxtjappseu/modules/hdyy/queryActivityList.do', {
            method: 'POST',
            headers: lecture_headers
        })
            .then(response => {
                if (response.status === 403) {
                    // 处理403错误
                    return fetch("http://ehall.seu.edu.cn/gsapp/sys/yddjzxxtjappseu/*default/index.do#/hdyy")
                        .then(response => {
                            console.log("Loaded web");
                            getTargetLecture();
                        })
                        .catch(error => {
                            console.error("Error loading webpage: ", error);
                        });
                } else {
                    return response.json();
                }
            })
            .then(res => {
                if (res && res.datas && res.datas.hdlbList) {
                    const lectures = res.datas.hdlbList;
                    console.log("讲座列表: ", lectures);
                    lectureList = lectures;
                } else {
                    console.log("获取讲座信息失败");
                }
            })
            .catch(error => {
                console.log("请求出错: ", error);
            });
    }
    function findMatchingObject(searchString) {
        // 遍历列表中的每个对象
        for (const item of lectureList) {
            // 检查对象是否有JZMC属性并比较该属性与搜索字符串
            if (item.JZMC && item.JZMC == searchString) {
                return item; // 找到匹配，返回对象
            }
        }
        return null; // 未找到匹配，返回null
    }
    function parseVerifyCode(imgBase64) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://upload.chaojiying.net/Upload/Processing.php', false); // false for synchronous request

        //验证码请求参数
        var verifyCodeParams = {
            user: localStorage.getItem('username') || '',
            pass: localStorage.getItem('password') || '',
            softid: localStorage.getItem('softid') || '',
            codetype: 1902,
            file_base64: imgBase64
        };

        var formData = new FormData();
        for (var key in verifyCodeParams) {
            formData.append(key, verifyCodeParams[key]);
        }

        xhr.setRequestHeader('Connection', 'Keep-Alive');
        xhr.setRequestHeader('User-Agent', 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0)');

        xhr.send(formData);

        if (xhr.status === 200) {
            var res = JSON.parse(xhr.responseText);
            if (res.err_no === 0) {
                return res.pic_str;
            } else {
                console.error("解析验证码出错: " + res.err_str);
                return null;
            }
        } else {
            console.error("网络请求失败");
            return null;
        }
    }
    function keepAlive(wid) {
        const url = "http://ehall.seu.edu.cn/gsapp/sys/yddjzxxtjappseu/modules/hdyy/getActivityDetail.do";
        const body = new URLSearchParams({ 'wid': wid });
    
        fetch(url, {
            method: "POST",
            headers: lecture_headers,
            body: body
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('网络请求失败');
            }
        })
        .then(res => {
            if (res.code !== 0) {
                console.error('保活失效，请检查cookie！');
            } else {
                console.log('用户身份有效，登录状态保活');
            }
        })
        .catch(error => {
            console.error('请求出错: ', error);
        });
    }
    
    function reserveLecture(wid, verifyCode) {
        const url = 'http://ehall.seu.edu.cn/gsapp/sys/yddjzxxtjappseu/modules/hdyy/addReservation.do';
        const params = new URLSearchParams({
            'wid': wid,
            'vcode': verifyCode
        });
        console.log(params)
        return fetch(url, {
            method: 'POST',
            headers: lecture_headers,
            body: params
        })
        .then(response => response.json())
        .then(res => {
            console.log('预约接口响应数据: ', res);
            if(res.code === 0 && res.datas === 1){
                alert("预约成功！");
            }else{
                alert("预约失败，原因："+res.msg);
            }
            
        })
        .catch(error => {
            console.error('请求出错: ', error);
        });
    }
    function getLectureVerifyCode(wid) {
        return new Promise((resolve, reject) => {
            const url = "http://ehall.seu.edu.cn/gsapp/sys/yddjzxxtjappseu/modules/hdyy/vcode.do";
    
            fetch(url, {
                method: "GET",
                headers: lecture_headers
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('网络请求失败');
                }
            })
            .then(res => {
                try {
                    var base64Str = res.datas;
                    // 从响应中提取 base64 部分
                    base64Str = base64Str.substring(base64Str.indexOf("base64,") + 7);
                    resolve(base64Str);
                } catch (error) {
                    reject(error);
                }
            })
            .catch(error => {
                reject(new Error('请求出错: ' + error.message));
            });
        });
    }
    
    function showVerifyCodeDialog(base64Image, callback) {
        // 创建对话框的 HTML
        var dialogHTML = `
        <div id="verifyCodeModal" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10000; background-color: white; border: 1px solid black; padding: 20px; display: none;">
            <h2>请输入验证码</h2>
            <img id="verifyCodeImage" src="" style="width: 100%; max-width: 300px; height: auto; margin-bottom: 10px;">
            <input type="text" id="verifyCodeInput" style="width: 100%; margin-bottom: 10px;">
            <button id="verifyCodeSubmit">确定</button>
        </div>
    `;

        // 将对话框添加到文档中
        var dialogDiv = document.createElement('div');
        dialogDiv.innerHTML = dialogHTML;
        document.body.appendChild(dialogDiv);

        // 设置图片内容
        var image = document.getElementById('verifyCodeImage');
        image.src = 'data:image/png;base64,' + base64Image;

        // 显示对话框
        var modal = document.getElementById('verifyCodeModal');
        modal.style.display = 'block';

        // 焦点放在输入框
        var input = document.getElementById('verifyCodeInput');
        input.focus();

        // 处理提交
        function submitHandler() {
            var userInput = input.value;
            modal.style.display = 'none'; // 关闭对话框
            input.value = ''; // 清空输入框
            if (typeof callback === "function") {
                callback(userInput); // 调用回调函数，并传入用户输入
            }
        }

        // 绑定按钮点击事件
        document.getElementById('verifyCodeSubmit').onclick = submitHandler;

        // 绑定回车键事件
        input.onkeypress = function (event) {
            if (event.keyCode === 13) { // 13 是回车键的键码
                submitHandler();
            }
        };
    }
    async function rob(wid) {
        console.log("定时预约任务开始, wid: ", wid);
        try {
            // 获取验证码图片
            let verifyCodeImgBase64 = await getLectureVerifyCode(wid);
            // 解析验证码
            let verifyCode = ''
            if (autoVerify) {
                verifyCode = await parseVerifyCode(verifyCodeImgBase64);
                console.log("解析验证码成功: ", verifyCode);
                // 尝试预约讲座
                let res = await reserveLecture(wid, verifyCode);
            } else {
                showVerifyCodeDialog(verifyCodeImgBase64, function (userInput) {
                    verifyCode = userInput;
                    console.log("手动输入验证码: ", verifyCode);
                    // 尝试预约讲座
                    let res = reserveLecture(wid, verifyCode);

                })
            }


        } catch (error) {
            console.error("出错了:", error);
        }
    }
    function calculateTimeDifference(targetTime) {
        // 将目标时间字符串转换为 Date 对象
        var targetDate = new Date(targetTime);
        // 获取当前时间的 Date 对象
        var now = new Date();
        // 计算差值（毫秒为单位）
        var difference = targetDate.getTime() - now.getTime();
        // 返回差值
        return difference;
    }
    function startCountdown(duration, element) {
        let remainingTime = duration;

        // 添加前导零的函数
        function pad(number) {
            return number < 10 ? '0' + number : number;
        }

        // 更新按钮文本的函数
        function updateText() {
            // 计算时、分、秒
            let hours = Math.floor(remainingTime / (1000 * 60 * 60));
            let minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

            // 更新按钮文本
            element.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

            // 减少剩余时间
            remainingTime -= 1000;

            // 如果时间耗尽，清除计时器
            if (remainingTime < 0) {
                clearInterval(intervalButton);
                element.textContent = "正在抢课...";
            }
        }

        // 设置定时器每秒调用 updateText 函数
        let intervalButton = setInterval(updateText, 1000);

        // 立即更新一次文本
        updateText();
    }
    function createWindows10StyleDialog(t) {
        var dialogHTML = `
        <div id="dialogBox" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: none; justify-content: center; align-items: center; z-index: 9999;">
            <div id="dialogContent" style="background-color: white; padding: 20px; border-radius: 5px; text-align: center; box-shadow: 0px 0px 10px rgba(0,0,0,0.5);">
                <p style="font-size: 16px; color: #333; margin-bottom: 20px;">${t}</p>
                <div id="loadingSpinner" style="border: 5px solid #f3f3f3; border-top: 5px solid #0078D7; border-radius: 50%; width: 50px; height: 50px; margin: 10px auto; animation: spin 2s linear infinite;"></div>
                <button id="closeDialog" style="padding: 10px 20px; background-color: #0078D7; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">关闭</button>
            </div>
        </div>
        <style>
            #dialogBox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #dialogContent {
                background-color: white;
            padding: 20px;
            border-radius: 5px;
            text-align: center;
        }
        #loadingSpinner {
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 2s linear infinite;
        }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;

        document.body.insertAdjacentHTML('beforeend', dialogHTML);

        var dialogBox = document.getElementById('dialogBox');
        var closeDialog = document.getElementById('closeDialog');

        closeDialog.addEventListener('click', function () {
            dialogBox.style.display = 'none';
        });

        // 显示对话框
        dialogBox.style.display = 'flex';
        return dialogBox
    }
})();
