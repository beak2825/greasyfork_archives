// ==UserScript==
// @name         查账号信息
// @namespace    https://vbd.baicizhan.com
// @version      2.9
// @description  在页面嵌入面板，快速查询账号信息
// @author       hr
// @match        https://vbd.baicizhan.com/*
// @grant        none
// @license      hr
// @downloadURL https://update.greasyfork.org/scripts/481363/%E6%9F%A5%E8%B4%A6%E5%8F%B7%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/481363/%E6%9F%A5%E8%B4%A6%E5%8F%B7%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var style = document.createElement('style');

    // 添加样式内容
    style.textContent = `
.panel {
    height: auto;
    width: auto;
    position: fixed;
    top: 40px;
    left: 20px;
    background-color: #fff;
    border-radius: 10px;
    opacity: 0;
    transition: box-shadow  0.3s ease-in-out, opacity 0.3s ease-in-out;
    z-index: -1;
}

#loadingOverlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(171, 178, 185, 0.5);
    z-index: -1;
    border-radius: 10px;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
}

#loadingImg {
    width: 60px;
    height: 60px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -30px;
    margin-left: -30px;
    transform: translate(-50%, -50%);
    color: #fff;
}

.form {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 10px; /* 元素之间的间距 */
    margin: 15px;
}

.form-row {
    display: contents; /* 使子元素脱离文档流，直接参与 grid 布局 */
}

.form-row > * {
    flex: 1; /* 让每个元素占据剩余的空间 */
}

.form-row>label {
    text-align: center;
}

.form-row>input {
    text-align: left;
}

.form-row>button {
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: #fff;
    display: inline-block;
    zoom: 1; /* zoom and *display = ie7 hack for display:inline-block */
    *display: inline;
    vertical-align: baseline;
    margin: 0 2px;
    outline: none;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    font: 12px/100% Arial, Helvetica, sans-serif;
    padding: .5em 2em .55em;
    text-shadow: 0 1px 1px rgba(0, 0, 0, .3);
    -webkit-border-radius: .5em;
    -moz-border-radius: .5em;
    border-radius: .5em;
    -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
    -moz-box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
    box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
}

#reset {
    padding-left: 5px;
    padding-right: 5px;
    background-color: #FCF3CF;
    text-align: center;
    transition: background-color 0.3s ease-in-out;
}

#reset:hover {
    background-color: #F4D03F;
}

#reset:active {
    background-color: #FCF3CF;
}

#confirm {
    background-color: #A9DFBF;
    transition: background-color 0.3s ease-in-out;
}

#confirm:hover {
    background-color: #229954;
}

#confirm:active {
    background-color: #A9DFBF;
}
`;
    // 将样式标签添加到文档的 head 中
    document.head.appendChild(style);

    // 创建悬浮面板
    function createFloatingPanel() {
        const panelIcon = document.createElement('div');
        panelIcon.innerHTML = '<span style="cursor: pointer; font-size: 20px; position: fixed; top: 10px; left: 10px;">🔦</span>'; // 工具图标

        const panel = document.createElement('div');
        panel.innerHTML = `
<div id="panel" class="panel">
    <div id="loadingOverlay">
        <svg id="loadingImg" t="1709634233583" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13488" width="200" height="200"><path d="M975.666 404.241c59.043 59.044 59.043 154.786 0 213.83s-154.786 59.043-213.83 0-59.043-154.786 0-213.83 154.787-59.043 213.83 0zM619.213 47.79c59.044 59.043 59.044 154.785 0 213.829s-154.785 59.043-213.829 0-59.043-154.786 0-213.83 154.786-59.043 213.83 0z m0 712.905c59.044 59.043 59.044 154.785 0 213.829s-154.785 59.043-213.829 0-59.043-154.786 0-213.83 154.786-59.043 213.83 0zM262.761 404.24c59.043 59.044 59.043 154.786 0 213.83s-154.786 59.043-213.83 0-59.043-154.786 0-213.83 154.786-59.043 213.83 0z" fill="#7dcd82" p-id="13489"></path></svg>    </div>
    <div class="form">
        <div class="form-row">
            <label for="BczID">BczID</label>
            <input type="text" id="BczID" data-flag="skip">
        </div>
        <div class="form-row">
            <label for="UserID">UserID</label>
            <input type="text" id="UserID" data-flag="skip">
        </div>
        <div class="form-row">
            <label for="Token">Token</label>
            <input type="text" id="Token" data-flag="skip">
        </div>
        <div class="form-row">
            <label for="Email">Email</label>
            <input type="text" id="Email" data-flag="skip">
        </div>
        <div class="form-row">
            <label for="Phone">Phone</label>
            <input type="text" id="Phone" data-flag="skip">
        </div>
        <div class="form-row">
            <label>Pwd</label>
            <input type="text" id="Pwd" readonly data-flag="skip" style="border: 1px solid #D3D3D3;">
        </div>
        <div class="form-row">
            <button id="reset">🧹</button>
            <button id="confirm">🔍</button>
        </div>
    </div>
</div>
        `;


        document.body.appendChild(panelIcon);
        document.body.appendChild(panel);

        panelIcon.addEventListener('click', function () {
            const panelDiv = panel.querySelector('#panel');
            const computedStyle = window.getComputedStyle(panelDiv);

            panelDiv.style.zIndex = '99'
            panelDiv.style.opacity = computedStyle.opacity === '0' ? '1' : '0';
            setTimeout(function() {
                panelDiv.style.zIndex = computedStyle.opacity === '0' ? '-1' : '99';
            }, 1000);
        });


        // 添加按钮点击事件
        const confirmBtn = panel.querySelector('#confirm');
        confirmBtn.addEventListener('click', confirm);
        const resetBtn = panel.querySelector('#reset');
        resetBtn.addEventListener('click', reset);
    }

    function reset() {
        document.getElementById('BczID').value = '';
        document.getElementById('UserID').value = '';
        document.getElementById('Token').value = '';
        document.getElementById('Email').value = '';
        document.getElementById('Phone').value = '';
        document.getElementById('Pwd').value = '';
    }

    // 填充用户信息
    function confirm() {
        const BczID = document.getElementById('BczID').value;
        const UserID = document.getElementById('UserID').value;
        const Token = document.getElementById('Token').value;
        const Email = document.getElementById('Email').value;
        const Phone = document.getElementById('Phone').value;
        if(BczID+UserID+Token+Email+Phone == ''){
            return;
        }

        const loadingOverlay = document.getElementById('loadingOverlay')
        const loadingImg = document.getElementById('loadingImg')
        const computedStyle = window.getComputedStyle(loadingOverlay);
        loadingOverlay.style.opacity = '1';
        loadingOverlay.style.zIndex = '999999'
        let rotation = 0;
        let animationId;

        function rotateImage(timestamp) {
            rotation = (rotation + 5) % 360;
            loadingImg.style.transform = `rotate(${rotation}deg)`;
            animationId = requestAnimationFrame(rotateImage);
        }

        animationId = requestAnimationFrame(rotateImage); // 开始旋转

        const url = `https://vbd.baicizhan.com/user_account_info/result?page=result&unique_id=${BczID}&user_id=${UserID}&token=${Token}&email=${Email}&phone=${Phone}`;

        fetch(url)
            .then(response => {
            const computedStyle = window.getComputedStyle(loadingOverlay);
            loadingOverlay.style.opacity = '0';
            // 延迟 0.3 秒后取消动画帧
            setTimeout(function() {
                cancelAnimationFrame(animationId);
                loadingOverlay.style.zIndex = '-1'
            }, 300);

            if (response.ok) {
                return response.text(); // 获取 HTML 文本
            } else {
                throw new Error('无法获取 HTML 内容');
            }
        })
            .then(html => {
            // 使用正则表达式提取 user_info 的值
            const regex = /var user_info = '([^']+)';/;
            const match = html.match(regex);

            if (match && match.length > 1) {
                const userInfoString = match[1];

                // 替换转义字符 &quot; 为双引号 "
                const unescapedUserInfo = userInfoString.replace(/&quot;/g, '"');

                // 将 user_info 转换为 JSON 对象
                let userInfo;
                try {
                    userInfo = JSON.parse(unescapedUserInfo);
                    document.getElementById('BczID').value = userInfo[0].unique_id;
                    document.getElementById('UserID').value = userInfo[0].user_id;
                    document.getElementById('Token').value = userInfo[0].temporary_token;
                    document.getElementById('Email').value = userInfo[0].email;
                    document.getElementById('Phone').value = userInfo[0].phone;
                    // 在这里可以使用 userInfo 对象进行操作
                } catch (error) {
                    console.error('无法解析 user_info:', error);
                }
                document.getElementById('Pwd').value = "后台查询中..."
                fetch(url.replace('user_account_info/result','get_tmp_login_code'))
                    .then(response => {

                    return response.json()
                })
                    .then(data => {
                    document.getElementById('Pwd').value = data.data;
                })
                    .catch(error => {
                    document.getElementById('Pwd').value = "查询失败😤"
                    console.error('发生错误:', error);
                    // 在这里可以添加其他错误处理的操作
                });
            } else {
                console.error('未找到 user_info');
            }

            // 在这里可以进行进一步操作，处理获取到的数据
        })
            .catch(error => {
            console.error('发生错误:', error);
            // 在这里可以添加其他错误处理的操作
        });


    }


    // 创建悬浮面板
    createFloatingPanel();

    function lerpColor(startColor, endColor, t) {
        var r = Math.round(startColor[0] + t * (endColor[0] - startColor[0]));
        var g = Math.round(startColor[1] + t * (endColor[1] - startColor[1]));
        var b = Math.round(startColor[2] + t * (endColor[2] - startColor[2]));
        return `rgba(${r}, ${g}, ${b}, 0.5)`;
    }

    function smoothColorTransition(colors, duration) {
        var container = document.getElementById('panel');
        var currentIndex = 0;

        setInterval(function() {
            var startTime = new Date().getTime();
            var endTime = startTime + duration;
            var startColor = colors[currentIndex];
            var endColor = colors[(currentIndex + 1) % colors.length];

            var interval = setInterval(function() {
                var now = new Date().getTime();
                var timeLeft = Math.max(endTime - now, 0);
                var progress = 1 - (timeLeft / duration);

                container.style.boxShadow = `0 0 30px ${lerpColor(startColor, endColor, progress)}`;

                if (progress >= 1) {
                    clearInterval(interval);
                }
            }, 50); // 每50毫秒更新一次颜色

            currentIndex = (currentIndex + 1) % colors.length;
        }, duration);
    }

    var colors = [
        [255, 0, 0],
        [255, 165, 0],
        [255, 255, 0],
        [0, 255, 0],
        [0, 127, 255],
        [0, 0, 255],
        [139, 0, 255]
    ]; // 预定义的颜色数组（以 RGB 值表示）
    smoothColorTransition(colors, 500); // 使用函数开始平滑颜色循环变换，2000毫秒为例，你可以根据需要修改间隔时间

    const Inputs = document.querySelectorAll('input[data-flag="skip"]');

    if (Inputs) {
        Inputs.forEach(function(Input) {
            Input.addEventListener('dblclick', function() {
                const inputValue = Input.value.trim();

                // 如果文本不为空，则复制到系统剪贴板
                if (inputValue !== '') {
                    navigator.clipboard.writeText(inputValue)
                        .then(() => {
                        Input.value = '已复制到剪贴板~';
                        setTimeout(() => {
                            Input.value = inputValue; // 恢复原始文本
                        }, 1000);
                    })
                        .catch(err => {
                        console.error('复制到剪贴板失败:', err);
                        Input.value = '复制不了哟~';
                        setTimeout(() => {
                            Input.value = inputValue; // 恢复原始文本
                        }, 1000);
                    });
                }
                else{
                    navigator.clipboard.readText()
                        .then(clipText => {
                        Input.value = clipText;
                    })
                        .catch(err => {
                        console.error('读取剪贴板失败:', err);
                    });
                }
            });
        });
    }
})();
