// ==UserScript==
// @name         漫画工具-密
// @namespace    http://your.namespace.com
// @version      1.0.0
// @license      BSD
// @description  一些美好的事，在井然有序地发生！
// @match        https://www.kuaikanmanhua.com/*
// @author       Your Name
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/477111/%E6%BC%AB%E7%94%BB%E5%B7%A5%E5%85%B7-%E5%AF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/477111/%E6%BC%AB%E7%94%BB%E5%B7%A5%E5%85%B7-%E5%AF%86.meta.js
// ==/UserScript==

var myData = {
    "wordPath": "C:/Users/17565/Desktop/comic", // 保存生成的word的目录路径【注意：使用“/”】
    "updateImgWidth": 640 // 宽度调整的宽度值
};

(function() {
    function getEncryptedCode() {
        return `
        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
        `.trim();
    }

    GM_registerMenuCommand("设置密钥", function(){
        var key =  GM_getValue("comic_decryption_key") || ""
        var person = prompt("请输入密钥", key) || "";
        person = person.trim();
        if(person){
            GM_setValue("comic_decryption_key", person)
            addPrompt("密钥设置成功", + person)
        }
    });

    let key = GM_getValue("comic_decryption_key") || ""
    let code = ""
    try{
        code = CryptoJS.AES.decrypt(getEncryptedCode(), key).toString(CryptoJS.enc.Utf8)
    } catch(t) {
        console.log(t)
        addPrompt("审核-密钥不正确")
    }

    addStyle_comic(); // 加载css样式  
    eval(code)  
    help()
})();

// 自定义提示
function addPrompt(text, color) {
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
    prompt.style.color = color || 'lightpink';
    document.body.appendChild(prompt);

    // 5秒后自动移除提示
    setTimeout(() => {
        if (document.body.contains(prompt)) {
            document.body.removeChild(prompt);
        }
    }, 5000);
}


// 添加自定义样式
function addStyle_comic() {
    GM_addStyle(`
        /* 样式按钮的背景颜色、边框和文字颜色 */
        .myButton {
            background-color: #3498db; /* 按钮背景颜色 */
            color: #fff; /* 文字颜色 */
            border: none; /* 去除边框 */
            padding: 10px; /* 内边距，调整按钮大小 */
            margin: 2px 5px; /* 外边距 */
            width: 50px; /* 宽度 */
            border-radius: 5px; /* 圆角 */
            cursor: pointer; /* 鼠标悬停时显示手型光标 */
        }
        /* 鼠标悬停时改变按钮的颜色 */
        .myButton:hover {
            background-color: #2980b9; /* 按钮背景颜色变化 */
        }

        /* 基本卡片样式 */
        .myCard {
            position: relative; /* 使子元素的定位相对于卡片 */
            background-color: #ffffff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            padding: 10px;
            border-radius: 5px;
            margin: 5px;
        }

        /* 右上角图标样式 */
        /*.card-icons {
            position: absolute;
            top: 10px;
            right: 10px;
        }*/
        .card-icons {
            color: blue; /* 文字颜色 */
        }

        /* 文本框和按钮容器样式 */
        .input-container {
            /* position: absolute; */
            /* top: 15px; */
            display: flex;
            align-items: center;
        }

        /* 文本框样式 */
        input[type="text"] {
            flex: 1;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-right: 10px;
        }

        /* 按钮样式 */
        .button {
            background-color: #3498db;
            color: #fff;
            border: none;
            border-radius: 5px;
            padding: 10px 15px;
            cursor: pointer;
        }

        /* 图片样式 */
        .image-container {
            text-align: center;
            margin-top: 10px;
        }
        .image {
            max-width: 60%;
        }

        /* 文本编辑框的样式 */
        .myTextarea {
            width:100%; 
            min-height: 15px; 
            font-size: 14px; /* 文字大小 */
            color: black; /* 文字颜色 */
            background-color: #f0f0f0; /* 浅灰色背景 */
            padding: 5px; /* 内边距为5px */
            border-radius: 5px; /* 圆角边框 */
        }
        /* 鼠标悬停时添加一些效果 */
        .myTextarea:hover {
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.2); /* 悬停时的阴影效果 */
        }

        /* 文本按钮的样式 */
        .myTextButton {
            text-align: center;
            font-size: 16px; /* 按钮文字大小 */
            cursor: pointer; /* 鼠标样式为手型 */
        }
        /* 鼠标悬停时的样式 */
        .myTextButton:hover {
            background-color: #0056b3; /* 悬停时的背景颜色 */
            color: #fff; /* 悬停时的文字颜色 */
        }

        /* 保存按钮的样式 */
        #saveWord {
            font-size: 20px; 
            color: white; 
            width: 80px; 
            display: flex;  /* 使用 Flexbox 布局 */
            justify-content: center;  /* 水平居中对齐 */
            align-items: center; /* 垂直居中对齐 */
            cursor: pointer; /* 鼠标样式为手型 */
        }
    `);    
}