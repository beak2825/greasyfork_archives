// ==UserScript==
// @name         知乎脚本-密
// @namespace    https://github.com/nameldk/user-script
// @version      1.2.0
// @license      BSD
// @icon         https://pic1.zhimg.com/2e33f063f1bd9221df967219167b5de0_m.jpg
// @description  一些美好的事，在井然有序地发生！
// @match        https://www.zhihu.com/question/*
// @match        https://zhuanlan.zhihu.com/p/*
// @match        https://www.zhihu.com/tardis/*
// @match        https://www.zhihu.com/pin/*
// @author       好人
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/474296/%E7%9F%A5%E4%B9%8E%E8%84%9A%E6%9C%AC-%E5%AF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/474296/%E7%9F%A5%E4%B9%8E%E8%84%9A%E6%9C%AC-%E5%AF%86.meta.js
// ==/UserScript==

(function () {
    // 'use strict';

    function getEncryptedCode() {
        return `
        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
        `.trim();
    }

    GM_registerMenuCommand("设置密钥", function(){
        var key =  GM_getValue("zhidao_check_decryption_key") || ""
        var person = prompt("请输入密钥", key) || "";
        person = person.trim();
        if(person){
            GM_setValue("zhidao_check_decryption_key", person)
            addPrompt("密钥设置成功", + person)
        }
    });

    let key = GM_getValue("zhidao_check_decryption_key") || ""
    let code = ""
    try{
        code = CryptoJS.AES.decrypt(getEncryptedCode(), key).toString(CryptoJS.enc.Utf8)
    } catch(t) {
        console.log(t)
        addPrompt("审核-密钥不正确")
    }

    addStyle() // 添加样式
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

    // 2秒后自动移除提示
    setTimeout(() => {
        if (document.body.contains(prompt)) {
            document.body.removeChild(prompt);
        }
    }, 3000);
}

// 添加自定义样式
function addStyle() {
    GM_addStyle(`
        /* 引用按钮 */
        .quoteButton {
            position: fixed; 
            top: 180px; 
            left: 10px; 
            z-index: 9999; 
            background-color: #1a59b7; /* 按钮背景颜色 */
            color: #FFFFFF; /* 文字颜色 */
            border: none; /* 去掉边框 */
            border-radius: 5px; /* 圆角边框 */
            padding: 10px 20px; /* 内边距 */
            cursor: pointer; /* 鼠标指针样式 */
            font-size: 16px; /* 字体大小 */
            font-weight: bold; /* 字体加粗 */
        }
    `);
}