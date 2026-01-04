// ==UserScript==
// @name         记录账号和密码
// @version      0.5.5
// @description  记录网站密码信息并自动填充
// @author       niweizhuan
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @namespace https://bbs.tampermonkey.net.cn/
// @downloadURL https://update.greasyfork.org/scripts/499718/%E8%AE%B0%E5%BD%95%E8%B4%A6%E5%8F%B7%E5%92%8C%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/499718/%E8%AE%B0%E5%BD%95%E8%B4%A6%E5%8F%B7%E5%92%8C%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 是否自动填充密码
    var autoFillEnabled = true;
    // 当前显示的页面索引
    var currentPageIndex = 0;
    // 显示区域的 DOM 元素
    var displayAreaDiv;
    // 当前网站域名
    var currentDomain = getCurrentDomain();
    //上下页按钮
    var prevPageButton;
    var nextPageButton;
    //----------------------------------------------
    // 获取当前网站的域名
    function getCurrentDomain() {
        return window.location.hostname;
    }
    // 获取存储
    function getStoredData(domain) {
        var data = GM_getValue(domain);
        if (!data) return { accounts: [], priority: 0 }; // 如果没有数据，返回默认值
        try {
            data = JSON.parse(data);
        } catch (error) {
            alert("记录账号和密码：数据解析错误: “", error , "”已删除该条数据");
            GM_deleteValue(domain); // 删除无效的存储数据
            return { accounts: [], priority: 0 }; // 如果解析失败，返回默认值
        }

        // 处理旧版本数据（如果 data 是一个数组，则将其包装成包含 priority 的对象）
        if (Array.isArray(data)) {
            data = { accounts: data, priority: 0 };
        }

        // 确保优先级字段存在
        if (typeof data.priority === 'undefined') {
            data.priority = 0;
        }

        // 检查 accounts 的格式是否正确
        if (!Array.isArray(data.accounts)) {
            alert("记录账号和密码：accounts 格式不正确，已删除无效数据");
            GM_deleteValue(domain); // 删除无效的存储数据
            return { accounts: [], priority: data.priority }; // 格式不正确，返回默认 accounts
        }

        // 验证每个账户的格式，确保有 username 和 password
        data.accounts = data.accounts.filter(account => {
            if (typeof account.username === 'string' && typeof account.password === 'string') {
                return true; // 格式正确，保留此账户
            } else {
                alert("记录账号和密码：账户数据格式错误，已删除: ", account);
                GM_deleteValue(domain); // 删除无效的存储数据
                return false; // 格式不正确，删除此账户
            }
        });

        return data;
    }

    // 设置存储
    function setStoredData(domain, data) {
        GM_setValue(domain, JSON.stringify(data)); // 将数据存储为 JSON 字符串
    }
    //----------------------------------------------
    // 创建按钮
    function createButton(text, clickHandler) {
        var button = document.createElement("button");
        button.textContent = text;
        button.style.cursor = "pointer";
        button.style.backgroundColor = "transparent";
        button.style.border = "none";
        button.style.fontSize = "inherit";
        button.style.color = "#333";
        button.style.margin = "0 5px";
        button.style.padding = "3px 5px";
        button.onclick = clickHandler; // 绑定点击事件
        button.ontouchend = clickHandler; // 兼容触摸事件
        return button;
    }
    // 创建标签
    function createLabel(text) {
        var label = document.createElement("p");
        label.textContent = text;
        label.style.margin = "0"; // 无外边距
        return label;
    }
    // 创建文字
    function createValue(text) {
        var value = document.createElement("p");
        value.textContent = text;
        value.style.margin = "0 5px"; // 设置左右间距
        return value;
    }
    // 创建复制按钮
    function createCopyButton(text, copyText) {
        var button = document.createElement("button");
        button.textContent = text;
        button.style.cursor = "pointer";
        button.style.backgroundColor = "transparent";
        button.style.border = "none";
        button.style.fontSize = "inherit";
        button.style.color = "#333";
        button.style.marginLeft = "5px"; // 左侧间距
        button.style.padding = "3px 5px";
        button.onclick = function() {
            copyTextToClipboard(copyText, button); // 点击时复制文本
        };
        button.ontouchend = button.onclick; // 兼容触摸事件
        return button;
    }
    // 复制文本
    function copyTextToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(function() {
            var originalText = button.textContent;
            button.textContent = "已复制"; // 显示已复制状态
            setTimeout(function() {
                button.textContent = originalText; // 恢复按钮文本
            }, 2000);
        }).catch(function(err) {
            console.error('复制失败：', err); // 复制失败时输出错误
        });
    }
    //----------------------------------------------
    // 显示界面初始化
    function createDisplayArea() {
        if (displayAreaDiv) {
            document.body.removeChild(displayAreaDiv); // 移除现有显示区域
        }

        // 创建新的显示区域
        displayAreaDiv = document.createElement("div");
        displayAreaDiv.setAttribute("class", "passwordDisplayArea");
        displayAreaDiv.style.display = "none"; // 初始隐藏
        displayAreaDiv.style.position = "fixed";
        displayAreaDiv.style.bottom = "70px";
        displayAreaDiv.style.right = "20px";
        displayAreaDiv.style.background = "skyblue";
        displayAreaDiv.style.padding = "5px";
        displayAreaDiv.style.border = "1px solid #ccc";
        displayAreaDiv.style.zIndex = "2147483647"; // 确保显示在最上层
        displayAreaDiv.style.maxWidth = "250px";
        displayAreaDiv.style.fontSize = "14px";

        var topButtons = document.createElement("div");
        topButtons.style.display = "flex";
        topButtons.style.justifyContent = "space-between";
        topButtons.style.marginBottom = "5px";

        // 添加关闭按钮
        topButtons.appendChild(createButton("关闭", function() {
            displayAreaDiv.style.display = "none"; // 隐藏显示区域
        }));

        // 添加编辑按钮
        topButtons.appendChild(createButton("编辑", function() {
            displayAreaDiv.style.display = "none"; // 隐藏显示区域
            var storedData = getStoredData(currentDomain);
            var accountInfo = storedData.accounts[currentPageIndex];
            showEditPage(accountInfo); // 显示编辑页面
        }));

        // 添加新建按钮
        topButtons.appendChild(createButton("新建", function() {
            displayAreaDiv.style.display = "none"; // 隐藏显示区域
            showNewPage(); // 显示新建页面
        }));

        displayAreaDiv.appendChild(topButtons);

        // 显示当前网站域名
        var domainContainer = document.createElement("div");
        domainContainer.style.display = "flex";
        domainContainer.style.alignItems = "center";
        domainContainer.appendChild(createLabel("当前网站:"));
        domainContainer.appendChild(createValue(currentDomain));
        displayAreaDiv.appendChild(domainContainer);

        // 创建账号信息容器
        var accountContainer = document.createElement("div");
        accountContainer.setAttribute("class", "accountContainer");
        displayAreaDiv.appendChild(accountContainer);

        // 创建页面控制按钮
        var pageControls = document.createElement("div");
        pageControls.style.display = "flex";
        pageControls.style.justifyContent = "center";
        pageControls.style.marginTop = "5px";

        // 上一页按钮
        prevPageButton = createButton("<", function() {
            if (currentPageIndex > 0) {
                currentPageIndex--; // 转到上一页
                updateAccountDisplay();
            }
        });
        pageControls.appendChild(prevPageButton);

        // 显示当前页数的标签
        var pageLabel = document.createElement("span");
        pageLabel.setAttribute("class", "pageLabel");
        pageLabel.style.margin = "0 10px";
        pageControls.appendChild(pageLabel);
        nextPageButton = createButton(">", function() {
            var storedData = getStoredData(currentDomain);
            if ((currentPageIndex + 1) < storedData.accounts.length) { // 确保不要超过帐户数量
                currentPageIndex++; // 转到下一页
                updateAccountDisplay();
            }
        });
        pageControls.appendChild(nextPageButton);

        displayAreaDiv.appendChild(pageControls); // 将页面控制按钮添加到显示区域

        document.body.appendChild(displayAreaDiv); // 将显示区域添加到页面

        updateAccountDisplay(); // 更新账号信息显示
    }
    // 显示页面
    function showNewPage() {
        var newDiv = document.createElement("div");
        newDiv.setAttribute("class", "passwordEditArea");
        newDiv.style.position = "fixed";
        newDiv.style.bottom = "70px";
        newDiv.style.right = "20px";
        newDiv.style.background = "white";
        newDiv.style.padding = "10px";
        newDiv.style.border = "1px solid #ccc";
        newDiv.style.zIndex = "2147483647"; // 确保显示在最上层
        newDiv.style.maxWidth = "250px";
        newDiv.style.fontSize = "14px";
        newDiv.innerHTML = `
            <p><label>账号：<input type="text" id="newUsername" style="width: 100%;"></label></p>
            <p><label>密码：<input type="password" id="newPassword" style="width: 100%;"></label></p>
            <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                <button id="cancelNew">取消</button>
                <button id="saveNew">创建</button>
            </div>
        `;

        document.body.appendChild(newDiv);

        // 取消按钮事件处理程序
        document.getElementById("cancelNew").onclick = function() {
            document.body.removeChild(newDiv); // 关闭新建页面
        };

        // 保存按钮事件处理程序
        document.getElementById("saveNew").onclick = function() {
            var username = document.getElementById("newUsername").value.trim(); // 获取用户名
            var password = document.getElementById("newPassword").value; // 获取密码

            if (!validateInput(username, password)) { // 验证输入
                return;
            }

            var storedData = getStoredData(currentDomain); // 获取存储数据
            storedData.accounts.push({ username, password }); // 添加新账号信息
            setStoredData(currentDomain, storedData); // 保存数据

            document.body.removeChild(newDiv); // 关闭新建页面
            currentPageIndex = 0; // 重置页面索引
            updateAccountDisplay(); // 更新显示
        };
    }
    // 无账号密码单独界面
    function createNoInfoText(text) {
        var noInfoText = document.createElement("p");
        noInfoText.textContent = text;
        noInfoText.style.margin = "0"; // 无外边距
        return noInfoText;
    }
    //--------------------------------------------------------
    // 编辑页面默认填充
    function populateEditFieldsWithCurrentAccount() {
        var storedData = getStoredData(currentDomain);
        var currentAccount = storedData.accounts[currentPageIndex];

        var usernameField = document.getElementById("editUsername");
        var passwordField = document.getElementById("editPassword");

        usernameField.value = currentAccount.username || ""; // 填充用户名
        passwordField.value = currentAccount.password || ""; // 填充密码
    }
    // 更新显示界面账号
    function updateAccountDisplay() {
        var storedData = getStoredData(currentDomain);
        var accountContainer = displayAreaDiv.querySelector(".accountContainer");
        accountContainer.innerHTML = ""; // 清空当前显示内容

        if (storedData.accounts.length > 0) {
            var accountInfo = storedData.accounts[currentPageIndex];
            var accountRow = document.createElement("div");
            accountRow.style.display = "flex";
            accountRow.style.justifyContent = "space-between";

            accountRow.appendChild(createLabel("账号:")); // 账号标签
            accountRow.appendChild(createCopyButton("复制", accountInfo.username || "[无账号信息]")); // 复制按钮
            accountContainer.appendChild(accountRow);
            accountContainer.appendChild(createValue(accountInfo.username || "[无账号信息]")); // 显示账号

            var passwordRow = document.createElement("div");
            passwordRow.style.display = "flex";
            passwordRow.style.justifyContent = "space-between";
            passwordRow.appendChild(createLabel("密码:")); // 密码标签
            passwordRow.appendChild(createCopyButton("复制", accountInfo.password)); // 复制按钮
            accountContainer.appendChild(passwordRow);
            accountContainer.appendChild(createValue(accountInfo.password)); // 显示密码

            // 新增：优先级复选框
            var priorityRow = document.createElement("div");
            priorityRow.style.display = "flex"; // 确保子元素按行排列
            priorityRow.style.alignItems = "center"; // 垂直居中对齐

            var priorityCheckbox = document.createElement("input");
            priorityCheckbox.type = "checkbox";
            // 设置复选框的初始状态
            priorityCheckbox.checked = storedData.priority === currentPageIndex + 1;
            priorityCheckbox.onchange = function() {
                // 修改优先级
                if (priorityCheckbox.checked) {
                    storedData.priority = currentPageIndex + 1;
                } else {
                    storedData.priority = 0; // 取消勾选时，设置优先级为0
                }
                setStoredData(currentDomain, storedData); // 保存修改后的数据
                updateAccountDisplay(); // 更新显示
            };
            priorityRow.appendChild(priorityCheckbox);
            priorityRow.appendChild(createLabel("自动填入此页面")); // 优先级标签
            accountContainer.appendChild(priorityRow);

            fillCredentials(accountInfo.username, accountInfo.password); // 填充账号和密码
        } else {
            // 无账户信息情况
            accountContainer.appendChild(createLabel("账号:"));
            accountContainer.appendChild(createNoInfoText("[无账号信息]")); // 显示无账号信息
            accountContainer.appendChild(createLabel("密码:"));
            accountContainer.appendChild(createNoInfoText("[无密码信息]")); // 显示无密码信息
        }

        // 更新页码显示
        displayAreaDiv.querySelector(".pageLabel").textContent = (currentPageIndex + 1) + "/" + Math.ceil(storedData.accounts.length);
        prevPageButton.style.display = currentPageIndex > 0 ? "inline" : "none"; // 显示或隐藏上一页按钮
        nextPageButton.style.display = (currentPageIndex + 1) < storedData.accounts.length ? "inline" : "none"; // 显示或隐藏下一页按钮
    }
    // 编辑页面
    function showEditPage(accountInfo) {
        var editDiv = document.createElement("div");
        editDiv.setAttribute("class", "passwordEditArea");
        editDiv.style.position = "fixed";
        editDiv.style.bottom = "70px";
        editDiv.style.right = "20px";
        editDiv.style.background = "white";
        editDiv.style.padding = "10px";
        editDiv.style.border = "1px solid #ccc";
        editDiv.style.zIndex = "2147483647"; // 确保显示在最上层
        editDiv.style.maxWidth = "250px";
        editDiv.style.fontSize = "14px";
        editDiv.innerHTML = `
            <p><label>账号：<input type="text" id="editUsername" style="width: 100%;" value="${accountInfo.username}"></label></p>
            <p><label>密码：<input type="password" id="editPassword" style="width: 100%;" value="${accountInfo.password}"></label></p>
            <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                <button id="cancelEdit">取消</button>
                <button id="saveEdit">保存</button>
                <button id="deleteEntry">删除</button>
            </div>
        `;

        document.body.appendChild(editDiv); // 添加编辑页面

        // 取消按钮事件处理程序
        document.getElementById("cancelEdit").onclick = function() {
            document.body.removeChild(editDiv); // 关闭编辑页面
        };

        // 保存按钮事件处理程序
        document.getElementById("saveEdit").onclick = function() {
            var username = document.getElementById("editUsername").value.trim(); // 获取用户名
            var password = document.getElementById("editPassword").value; // 获取密码

            if (!validateInput(username, password)) { // 验证输入
                return;
            }

            var storedData = getStoredData(currentDomain); // 获取存储数据
            storedData.accounts[currentPageIndex] = { username, password }; // 更新账号信息
            setStoredData(currentDomain, storedData); // 保存数据

            document.body.removeChild(editDiv); // 关闭编辑页面
            currentPageIndex = 0; // 重置页面索引
            updateAccountDisplay(); // 更新显示
        };

        // 删除按钮事件处理程序
        document.getElementById("deleteEntry").onclick = function() {
            var storedData = getStoredData(currentDomain); // 获取存储数据
            // 检查当前条目是否为优先级条目
            if (storedData.priority === currentPageIndex + 1) {
                if (storedData.accounts.length > 1) {
                    storedData.priority = Math.max(1, currentPageIndex); // 设置优先级为当前条目的索引
                } else {
                    storedData.priority = 0; // 删除唯一条目时，优先级重置为0
                }
            }
            storedData.accounts.splice(currentPageIndex, 1); // 删除当前条目
            setStoredData(currentDomain, storedData); // 保存修改后的数据

            document.body.removeChild(editDiv); // 关闭编辑页面
            currentPageIndex = 0; // 重置页面索引
            updateAccountDisplay(); // 更新显示
        };
    }
    // 验证输入
    function validateInput(username, password) {
        return true; // 暂时不使用详细的验证逻辑
    }
    //---------------------------------------------------
    // 加载时匹配填充
    function autoFillOnLoad() {
        var storedData = getStoredData(currentDomain); // 获取存储数据
        if (storedData.priority > 0) { // 如果优先级大于0，则填充优先级账号
            var priorityAccount = storedData.accounts[storedData.priority - 1];
            fillCredentials(priorityAccount.username, priorityAccount.password); // 自动填充账号和密码
        }
    }
    // 自动填充账号密码
    function fillCredentials(username, password) {
        if (autoFillEnabled) { // 检查是否启用自动填充
            var editAreaExists = document.querySelector(".passwordEditArea");
            if (editAreaExists) {
                return; // 如果编辑区域已存在，则不执行填充
            }

            var storedData = getStoredData(currentDomain); // 获取存储数据
            if (storedData.priority > 0) { // 如果优先级大于0，则填充优先级账号
                var priorityAccount = storedData.accounts[storedData.priority - 1];
                username = priorityAccount.username;
                password = priorityAccount.password;
            }

            // 填充输入框
            var usernameField = document.querySelector("input[type='text'], input[type='email']");
            var passwordField = document.querySelector("input[type='password']");
            if (usernameField && passwordField) {
                usernameField.value = username;
                passwordField.value = password;
            }
        }
    }
    //----------------------------------------------
    // 创建主按钮
    function createControlButton() {
        var controlButton = document.createElement("button");
        controlButton.textContent = "显示账号和密码";
        controlButton.style.position = "fixed";
        controlButton.style.bottom = "10px";
        controlButton.style.right = "10px";
        controlButton.style.fontSize = "10px"; // 设置字体大小
        controlButton.style.cursor = "pointer"; // 设置鼠标指针为手形
        controlButton.style.zIndex = "2147483647"; // 确保显示在最上层
        controlButton.onclick = function() {
            // 检测模块是否存在
            if (typeof GM_getValue === 'undefined' ||
                typeof GM_setValue === 'undefined' ||
                typeof GM_deleteValue === 'undefined' ||
                typeof GM_listValues === 'undefined' ||
                typeof GM_addStyle === 'undefined') {
                // 提示用户，提前退出
                confirm("记录账号和密码\n脚本出现错误：\n某些必要的模块不存在，无法继续执行操作。请确保浏览器包含本脚本需要的脚本支持库。");
                return;
            }
            controlButton.onclick = function() {
                if (!displayAreaDiv) {
                    createDisplayArea(); // 仅在首次点击时创建显示区域
                }
                displayAreaDiv.style.display = displayAreaDiv.style.display === "none" ? "block" : "none"; // 切换显示状态
                if (displayAreaDiv.style.display === "block") {
                    updateAccountDisplay(); // 更新显示
                }
            };

            document.body.appendChild(controlButton); // 添加控制按钮
        };

        document.body.appendChild(controlButton); // 添加控制按钮
    }

    //-----------------------------------------
    createControlButton(); // 创建控制按钮
    autoFillOnLoad(); // 页面加载时自动填充

})();
