// ==UserScript==
// @name         🔐 密码填充
// @namespace    https://ez118.github.io/
// @version      0.3.0
// @description  为Via设计的第三方密码保存/填充工具，支持管理、导入与导出密码
// @author       ZZY_WISU
// @match        *://*/*
// @license      GPLv3
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/511297/%F0%9F%94%90%20%E5%AF%86%E7%A0%81%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/511297/%F0%9F%94%90%20%E5%AF%86%E7%A0%81%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==


/* =====[ 变量存储 ]===== */

const ICONS = {
    'del': '<svg viewBox="0 0 24 24" width="20px" height="20px"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>'
};

var savedAccount = []; // 缓存本地保存的账号列表
var cssInspectedFlag = false; // 记录css样式是否被注入（防止重复注入）
var bodyObserver = null; // 监听器，监听body是否改变

/* ====================== */
function Toast(text) {
    // Toast提示消息，适配VIA和MBrowser的原生Toast
    try{
        if (typeof(window.via) == "object") window.via.toast(text);
        else if (typeof(window.mbrowser) == "object") window.mbrowser.showToast(text);
        else alert(text);
    }catch{
        alert(text);
    }
}

function hash(str) {
    // 计算字符串哈希
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
}

function downloadFile(fileName, text) {
    // 下载指定内容的文件
    const url = window.URL || window.webkitURL || window;
    const blob = new Blob([text]);
    const saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    saveLink.href = url.createObjectURL(blob);
    saveLink.download = fileName;
    saveLink.click();
}

function getHost() {
    // 获取当网站域名
    return window.location.host;
}

function findByKeyValue(array, key, value) {
    // 在JSON中，以键值匹配项
    return array.findIndex(item => item[key] === value);
}

function triggerFileSelect(callback) {
    // 打开文件选择框
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.multiple = false;

    // 监听文件选择事件
    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            callback(files[0]);
        } else {
            // return null;
        }
    });
    fileInput.click();
}

function exportAccountData(){
    // 导出保存的账号
    let csvText = "name,url,username,password,note\n";
    let fileName = "密码填充_" + hash(csvText) % 1e8 + ".csv";
    savedAccount.forEach((item, index) => {
        csvText += `${item.host},https://${item.host}/,${item.username},${item.password},\n`;
    });
    downloadFile(fileName, csvText);
}

function importAccountData(){
    // 导入来自电脑浏览器的账号
    alert("【导入账号】 即将弹出文件选择，请选择 与Chrome/Firefox/Edge浏览器兼容 的CSV格式文件。");

    triggerFileSelect((file) => {
        try{
            const reader = new FileReader();

            reader.onload = function(e) {
                Toast("文件读取成功，正在导入...");

                const text = e.target.result;
                const lines = text.split('\n');

                var newDataList = [];

                // 遍历每一行
                lines.forEach((line, index) => {
                    // 第一行是 表头，直接跳过
                    if(index == 0 || line.length <= 6 || line.length > 512) { return; }

                    // 取得每一项的值
                    const item = line.split(",");
                    let username = item[2];
                    let password = item[3];
                    let host = item[1];

                    // 只留网址中的域名部分
                    if (host.includes("://")) { host = host.split("/")[2]; }

                    // 值缺失，则跳过
                    if(!username || !password || !host) { return; }

                    // 向新列表插入项
                    newDataList.push({
                        "id": hash(host + username + password).toString(),
                        "host": host,
                        "username": username,
                        "password": password
                    });
                });

                savedAccount = savedAccount.concat(newDataList);

                // 账号去重
                const uniqueDataList = savedAccount.reduce((accumulator, current) => {
                    const exists = accumulator.some(item => item.id === current.id);
                    if (!exists) { accumulator.push(current); }
                    return accumulator;
                }, []);

                savedAccount = uniqueDataList;
                GM_setValue('savedAccount', savedAccount);

                Toast("账号已导入合并，请刷新以查看更改");
            };

            reader.readAsText(file);
        } catch(e) {
            Toast("账号导入失败");
            console.error("【错误】账号导入失败，如果是脚本程序错误，请尽快向作者反馈并提供报错内容。 \n", e);
        }
    })
}

function isVisible(element) {
    if (!element || element.style.display === 'none') return false;
    if (element.style.visibility === 'hidden') return false;
    if (element.style.opacity === '0' || element.style.opacity === '0.0') return false;
    if (element.hidden) return false;

    // 使用 getComputedStyle 更准确
    /*
    const style = window.getComputedStyle(element);
    if (style.display === 'none') return false;
    if (style.visibility === 'hidden') return false;
    if (style.opacity === '0') return false;
    */

    return true;
}

function isLoginPage() {
    // 检查当前网页是否是满足要求的登录页面

    // 预检查，减少不必要的性能损耗
    if (!document.querySelector('form') && !document.querySelector("input[type='password']")) {
        console.log("【密码填充】在预检查时排除页面")
        return { isLogin: false, x: null, y: null, obj: null };
    }

    // 进一步检查（检查Form标签）
    let forms = document.getElementsByTagName("form");
    let isLogin = false;
    let formPosition = {x: 0, y: 0};
    let formobj = null;

    Array.prototype.forEach.call(forms, (form) => {
        let hasTextInput = false;
        let hasPasswordInput = false;

        // 获取所有 input 元素
        let inputs = form.getElementsByTagName("input");

        // 检查每个 input 的类型
        Array.prototype.forEach.call(inputs, (input) => {
            if (input.type === "text" || input.type === "email") {
                hasTextInput = true;
            } else if (input.type === "password") {
                hasPasswordInput = true;
            }
        });

        // 如果同时存在 text 和 password 类型的输入框，认为是登录页面
        if (hasTextInput && hasPasswordInput) {
            isLogin = true;

            formobj = form;

            let rectData = formobj.getClientRects()[0];
            formPosition.x = rectData.left + rectData.width / 2 - 90;
            formPosition.y = rectData.top + rectData.height - 15;
        }
    });

    // 进一步检查（填充不标准的登录框）
    if (!isLogin) {
        let current = document.querySelector("input[type='password']");

        while (current && current !== document.body) {
            current = current.parentNode;

            // 跳过文档节点（如 documentFragment）
            if (!current || current.nodeType !== 1) continue;

            // 查找当前节点下是否有未被隐藏的 input[type="text"] / "tel" / "email"
            const inputs = current.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"]');

            for (let input of inputs) {
                // 判断是否可见
                if (isVisible(input)) {
                    // 满足要求且成立
                    isLogin = true;

                    formobj = current;

                    let rectData = formobj.getClientRects()[0];
                    formPosition.x = rectData.left + rectData.width / 2 - 90;
                    formPosition.y = rectData.top + rectData.height - 15;

                    console.log("【密码填充】通过备用方案获取到表单");
                    break;
                }
            }
        }
    }

    return { isLogin, x: formPosition.x, y: formPosition.y, obj: formobj };
}

function getFormData(ele){
    // 获取当前页面内登录框的内容（ele传入登录框所在form元素的对象）
    let inputs = ele.getElementsByTagName("input");
    let usr = null;
    let psw = null;

    // 检查每个 input 的类型
    Array.prototype.forEach.call(inputs, (input) => {
        if (!isVisible(input)) { return; }
        if ((input.type == "text" || input.type == "email" || input.type == "tel") && !usr) {
            usr = input;
        } else if (input.type == "password" && !psw) {
            psw = input;
        }
    });

    return {password: psw.value, username: usr.value, psw: psw, usr: usr};
}




function initStyle() {
    if(cssInspectedFlag) { return; }

    // 初始化样式
    var websiteThemeColor = "#FFFFFFEE";
    var websiteFontColor = "#000000";

    GM_addStyle(`
        body{ -webkit-appearance:none!important; }

        .userscript-quickFill{ user-select:none; background-color:${websiteThemeColor}; color:${websiteFontColor}; border:1px solid #99999999; padding:5px; font-size:12px; line-height:20px; width:180px; height:fit-content; position:absolute; display:flex; flex-direction:column; overflow:hidden auto; box-sizing:border-box; z-index:100000; font-family:"Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif; border-radius:12px; box-shadow:0px 0px 8px #BBB; }
        .userscript-quickFill *{ box-sizing:border-box }
        .userscript-quickFill>.item{ margin:1px 0px; border-radius:8px; padding:5px 9px; width:100%; flex-basis:fit-content; flex-shrink:0; cursor:pointer; background:transparent; }
        .userscript-quickFill>.item:hover{ background:rgba(128, 128, 128, 0.2); }
        .userscript-quickFill>.recordBtn,.userscript-quickFill>.hideBtn{ margin:1px 0px; border-radius:8px; padding:3px 9px; width:100%; flex-basis:fit-content; flex-shrink:0; color:${websiteFontColor}; opacity:0.7; font-size:11px; cursor:pointer; text-align:right; }
        .userscript-quickFill>.recordBtn:active,.userscript-quickFill>.hideBtn:active{ background:rgba(128, 128, 128, 0.2); opacity:1; }
        .userscript-quickFill>hr{ margin:0 4px; border:none; border-top:1px solid ${websiteFontColor}; background:none; opacity:0.2; width:calc(100% - 8px); }

        .userscript-pswmgrDlg{ user-select:none; background:${websiteThemeColor}; color:${websiteFontColor}; border:1px solid #99999999; position:fixed; top:50%; height:fit-content; left:50%; transform:translateX(-50%) translateY(-50%); width:92vw; max-width:300px; max-height:92vh; padding:15px; border-radius:15px; box-sizing:border-box; z-index:100000; box-shadow:0 1px 10px #BBB; font-family:"Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif; }
        .userscript-pswmgrDlg .ctrlbtn{ border:none; background:transparent; padding:8px; margin:0; color:#6d7fb4; cursor:pointer; overflow:hidden; }
        .userscript-pswmgrDlg h3{ margin:5px; margin-bottom:15px; font-size:24px; }
        .userscript-pswmgrDlg .subtitle{ margin:5px 1px; font-size:16px; font-weight:400; }

        .userscript-pswmgrDlg .list-item{ width:calc(100% - 10px); padding:10px 5px; margin:0; display:flex; flex-direction:row; vertical-align:middle; box-sizing:initial; }
        .userscript-pswmgrDlg .list-item:hover{ background:#55555555; }
        .userscript-pswmgrDlg .list-item>p{ padding:0; margin:0; font-size:16px; }
        .userscript-pswmgrDlg .list-item>.item-title{ flex-grow:1; margin-left:5px; }

        .userscript-pswmgrDlg .list-item>.item-delbtn{ cursor:pointer; width:25px; }
        .userscript-pswmgrDlg .list-item>.item-delbtn svg{ fill:${websiteFontColor}; height:100%; min-height:16px; }
    `);

    console.log("【密码填充】已注入脚本css样式");
    cssInspectedFlag = true;
}



function showPswMgr() {
    // 显示账户管理界面
    initStyle();

    if (document.getElementById("userscript-pswmgrDlg")) { return; }

    let newAccountList = savedAccount.slice(); // 不直接引用
    let origAccountList = savedAccount.slice();

    // 创建元素、设置属性
    const optDlg = document.createElement('div');
    optDlg.className = 'userscript-pswmgrDlg';
    optDlg.id = 'userscript-pswmgrDlg';
    optDlg.style.display = 'none';
    document.body.appendChild(optDlg);

    // 循环输出账户列表的html
    let listHtml = newAccountList.map(item => `
        <div class="list-item" acid="${item.id}">
            <p class="item-title">${item.username} (${item.host})</p>
            <p class="item-delbtn" acid="${item.id}" title="移除">${ICONS.del}</p>
        </div>
    `).join('');

    // 显示管理对话框html框架
    optDlg.innerHTML = `
        <div style="height:fit-content; max-height:calc(80vh - 60px); overflow-x:hidden; overflow-y:auto;">
            <h3>管理</h3>
            <div style="height:fit-content; margin:5px;">
                <p class="subtitle">已保存的账户：</p>
                ${listHtml}
            </div>
        </div>
        <div align="right">
            <input type="button" value="导入" class="ctrlbtn" id="userscript-importBtn">
            <input type="button" value="导出" class="ctrlbtn" id="userscript-exportBtn">
            <input type="button" value="取消" class="ctrlbtn" id="userscript-cancelBtn">
            <input type="button" value="保存" class="ctrlbtn" id="userscript-saveBtn">
        </div>
    `;

    optDlg.style.display = 'block';

    // 绑定全局点击事件
    document.addEventListener('click', onClick);

    // 对全局点击事件进行判断，判断点击事件作用对象（ChatGPT的主意，实现方式奇怪，但兼容性变强了）
    function onClick(e) {
        if (e.target.parentElement.className == "item-delbtn" || e.target.parentElement.parentElement.className == "item-delbtn") {
            let btnEle = (e.target.parentElement.className == "item-delbtn") ? e.target.parentElement : e.target.parentElement.parentElement;
            console.log(btnEle)
            const acid = btnEle.getAttribute("acid");
            const index = findByKeyValue(newAccountList, 'id', acid);
            if (index !== -1) {
                newAccountList.splice(index, 1);
                btnEle.parentElement.remove();
            }
        }

        if (e.target.id === 'userscript-cancelBtn') {
            newAccountList = origAccountList; // 恢复原始账户列表
            closeDialog();
        }

        if (e.target.id === 'userscript-saveBtn') {
            savedAccount = newAccountList; // 更新全局账户列表
            GM_setValue('savedAccount', savedAccount);
            Toast("【密码填充】已保存，刷新页面以应用更改");
            closeDialog();
        }

        if (e.target.id === 'userscript-exportBtn') {
            exportAccountData();
            Toast("【密码填充】即将导出为csv文件，请注意下载");
        }

        if (e.target.id === 'userscript-importBtn') {
            importAccountData();
        }
    }

    // 关闭窗口
    function closeDialog() {
        const optDlg = document.getElementById("userscript-pswmgrDlg");
        optDlg.style.display = 'none';
        setTimeout(() => {
            optDlg.remove();
            document.removeEventListener('click', onClick);
        }, 110);
    }
}

function askSaveAccount(newdata, isManual) {
    // 询问用户是否保存账号

    // 判断账号内容是否为空
    if(!newdata.username && !newdata.password && isManual) {
        Toast("【密码填充】请填写有效的用户名与密码");
        return;
    }

    // 检查是否数据重复
    const oldidx = findByKeyValue(savedAccount, "host", newdata.host);
    if (oldidx !== -1 && savedAccount[oldidx] && savedAccount[oldidx].id === newdata.id) {
        if(isManual) {
            Toast("【密码填充】账号存在！");
        }
        return;
    }

    // 如果不是重复账号，则询问是否保存
    let res = null;
    if(isManual) {
        res = window.confirm(`【密码填充】是否保存账号？ \n- 用户: ${newdata.username} \n- 密码: ${newdata.password}`);
    } else {
        res = window.confirm("【密码填充】是否保存账号？");
    }

    // 保存账户
    if (res) {
        savedAccount.push(newdata);
        GM_setValue('savedAccount', savedAccount);

        Toast("【密码填充】账号已保存！");
    }
}

function initEle(form, cx, cy) {
    // 创建搜索栏元素并添加到页面
    const quickFill = document.createElement('div');
    quickFill.className = 'userscript-quickFill';
    quickFill.id = 'userscript-quickFill';
    document.body.appendChild(quickFill);

    let html = '';
    const host = getHost();
    savedAccount.forEach(item => {
        if (item.host === host) {
            html += `<div class="item" acid="${item.id}">${item.username}</div>`;
        }
    });

    // 设定快速填充栏HTML内容
    quickFill.innerHTML = `
        <font color="#333333" size="small">&nbsp;保存的账户:</font>
        ${html}
        <hr>
        <div class="recordBtn">手动保存账号</div>
        <div class="hideBtn">隐藏该窗口</div>
    `;

    // 设置快速填充栏位置（溢出则固定在屏幕最下方）
    if(cy + quickFill.offsetHeight / 2 > window.innerHeight) { cy = window.innerHeight - quickFill.offsetHeight - 10; quickFill.style.position = "fixed"; }
    quickFill.style.left = `${cx}px`;
    quickFill.style.top = `${cy}px`;

    // 选择保存过的第一个账号，自动填充到网页
    const formdata = getFormData(form);
    let dataindex = findByKeyValue(savedAccount, 'host', host);
    if (dataindex !== -1) {
        formdata.psw.value = savedAccount[dataindex].password;
        formdata.usr.value = savedAccount[dataindex].username;

        try {
            // 模拟输入
            const event = new Event('input', { bubbles: true });
            formdata.psw.dispatchEvent(event);
            formdata.usr.dispatchEvent(event);
        } catch {}
    }

    // 添加点击事件监听器
    quickFill.addEventListener('click', function (e) {
        if (e.target.matches('.item')) {
            const acid = e.target.getAttribute("acid");
            let dataindex = findByKeyValue(savedAccount, 'id', acid);
            formdata.psw.value = savedAccount[dataindex].password;
            formdata.usr.value = savedAccount[dataindex].username;
        }

        if (e.target.matches('.hideBtn')) {
            // 隐藏窗口
            quickFill.style.display = 'none';
        }

        if (e.target.matches('.recordBtn')) {
            // 手动保存
            let judgeRes = isLoginPage();

            const formdata = getFormData(judgeRes.obj);
            const newdata = {
                "id": hash(getHost() + formdata.username + formdata.password).toString(),
                "host": getHost(),
                "username": formdata.username,
                "password": formdata.password
            };
            askSaveAccount(newdata, true);
        }
    });
}



function init() {
    let judgeRes = isLoginPage();

    if (judgeRes.isLogin) {
        /* 初始化 */
        console.log("【密码填充】检测到登录页面");
        initStyle();
        initEle(judgeRes.obj, judgeRes.x, judgeRes.y);

        judgeRes.obj.addEventListener('submit', function (e) {
            // 获取表单输入内容
            const formdata = getFormData(judgeRes.obj);
            const newdata = {
                "id": hash(getHost() + formdata.username + formdata.password).toString(),
                "host": getHost(),
                "username": formdata.username,
                "password": formdata.password
            };

            askSaveAccount(newdata, false);
        });
    }
}


/* =====[ DOM刷新监听 ]===== */

function createBodyObserver() {
    // 创建一个防抖函数来优化性能
    const debouncedInit = debounce(() => {
        if (document.querySelectorAll(".userscript-quickFill").length === 0) {
            init();
            console.log("【密码填充】DOM刷新时判断");
        }
    }, 300);

    // 配置 MutationObserver
    const observer = new MutationObserver((mutations) => {
        let shouldTrigger = false;

        // 遍历所有变化
        for (let mutation of mutations) {
            // 检查是否有新增或删除的节点
            if (mutation.type === 'childList') {
                // 可以添加更具体的选择器判断
                shouldTrigger = true;
                break;
            }
        }

        // 如果需要处理，使用防抖函数
        if (shouldTrigger) {
            debouncedInit();
        }
    });

    // 观察 body 的所有子节点变化
    observer.observe(document.body, {
        childList: true, // 监听子节点的增删
        subtree: true, // 监听所有后代节点
        attributes: false // 不监听属性变化（可根据需要调整）
    });

    return observer;
}

function debounce(func, delay) {
    // 防抖函数实现
    let timeoutId;
    return function() {
        const context = this;
        const args = arguments;

        // 清除之前的定时器
        clearTimeout(timeoutId);

        // 设置新的定时器
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}



/* =====[ 菜单注册 ]===== */

var menu_mgr = GM_registerMenuCommand('⚙️ 管理密码', function () { showPswMgr(); }, 'o');


(function () {
    'use strict';

    if(GM_getValue('savedAccount') == null || GM_getValue('savedAccount') == "" || GM_getValue('savedAccount') == undefined){ GM_setValue('savedAccount', savedAccount); }
    else { savedAccount = GM_getValue('savedAccount'); console.log("【密码填充】首次使用，已初始化") }

    init();

    bodyObserver = createBodyObserver();

})();