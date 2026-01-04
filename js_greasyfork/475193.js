// ==UserScript==
// @name         知乎链接提取-密
// @namespace    http://haoren.com/
// @description  一些美好的事，在井然有序地发生！
// @license      BSD
// @version      1.2.1
// @match        https://www.baidu.com/*
// @match        https://www.zhihu.com/question/*
// @match        https://zhuanlan.zhihu.com/p/*
// @match        https://www.zhihu.com/tardis/*
// @match        https://www.zhihu.com/search*
// @author       好人
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        window.close
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/475193/%E7%9F%A5%E4%B9%8E%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96-%E5%AF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/475193/%E7%9F%A5%E4%B9%8E%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96-%E5%AF%86.meta.js
// ==/UserScript==

// 自定义数据
const myData = {
    // 等待时间 = fixedValue ± floatingValue
    "fixedValue": 2000, // 固定时间，单位毫秒
    "floatingValue": 1000, // 浮动时间，单位毫秒，需小于fixedValue
    // 重试次数
    "retryCount": 3,
    // 红色比例
    "redRate": 0.8,
};

// 油猴脚本区
(function () {
    addStyle();
    
    function getEncryptedCode() {
        return `
        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
        `.trim();
    }

    GM_registerMenuCommand("设置密钥", function(){
        var key =  GM_getValue("getZhihuLink_key") || ""
        var person = prompt("知乎链接提取：请输入密钥", key) || "";
        person = person.trim();
        if(person){
            GM_setValue("getZhihuLink_key", person)
            addPrompt("密钥设置成功", + person)
        }
    });

    let key = GM_getValue("getZhihuLink_key") || ""
    let code = ""
    try{
        console.log("获取到密钥[" + key + "]")
        code = CryptoJS.AES.decrypt(getEncryptedCode(), key).toString(CryptoJS.enc.Utf8)
    } catch(t) {
        console.log("密钥不正确", t)
        addPrompt("审核-密钥不正确")
    }
    eval(code)

    help();
})();

// 自定义提示
function addPrompt(text) {
    // 移除已有提示框
    $(".custom-prompt").remove();

    // 显示成功提示
    const prompt = document.createElement('div');
    prompt.classList.add("custom-prompt");
    prompt.innerText = text;
    prompt.style.position = 'fixed';
    prompt.style.top = '100px';
    prompt.style.right = '50%';
    prompt.style.transform = 'translateX(50%)';
    prompt.style.padding = '10px 20px';
    prompt.style.background = 'grey';
    prompt.style.borderRadius = '4px';
    prompt.style.zIndex = 10000;
    prompt.style.color = 'lightpink';
    document.body.appendChild(prompt);

    // n秒后自动移除提示
    setTimeout(() => {
        if (document.body.contains(prompt)) {
            document.body.removeChild(prompt);
        }
    }, 10000);
}

function addStyle() {
    // 添加自定义样式
    GM_addStyle(`
        .my_container {
            max-width: 310px;
            margin-bottom: 10px;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }
        .my_centered {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;
        }
        .my_textarea {
            width: 290px;
            height: auto;
            min-height: 150px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        .my_button-container {
            display: flex;
            justify-content: center;
        }
        .my_button {
            margin: 5px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .my_button:hover {
            background-color: #0056b3;
        }
    `);
}