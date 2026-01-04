// ==UserScript==
// @name         XYD Better v5.0
// @namespace    https://tampermonkey.net/
// @version      5.0
// @license      MIT
// @description  新增透明度调整！去除页面干扰！完全自然的自定义背景，极其便捷的扩展页面！
// @author       xk2013
// @match        https://discourse.xinyoudui.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/492469/XYD%20Better%20v50.user.js
// @updateURL https://update.greasyfork.org/scripts/492469/XYD%20Better%20v50.meta.js
// ==/UserScript==
var FontName,FontSize,BackGroundName,IsSelf,CodeFontName,K;
function Init() {
    FontName = localStorage.getItem("userFont");
    FontSize = localStorage.getItem("userFontSize");
    IsSelf = localStorage.getItem("userSelf");
    BackGroundName = localStorage.getItem("userBackground");
    CodeFontName = localStorage.getItem("userCodeFont");
    K = localStorage.getItem("userK");
    if (FontName === null) { FontName = "Consolas,'微软雅黑'"; localStorage.setItem("userFont",FontName); }
    if (FontSize === null) { FontSize = "14"; localStorage.setItem("userFontSize",FontSize); }
    if (IsSelf === null) { IsSelf = "false"; localStorage.setItem("userSelf",IsSelf); }
    if (BackGroundName === null) { BackGroundName = "http://pic.soutu123.com/back_pic/04/20/21/10582d77456bc74.jpg%21/fw/700/quality/90/unsharp/true/compress/true"; localStorage.setItem("userBackground",BackGroundName); }
    if (CodeFontName === null) { CodeFontName = "Consolas,'微软雅黑'"; localStorage.setItem("userCodeFont",CodeFontName); }
    if (K === null) { K = "0.8"; localStorage.setItem("userK",K); }
    // console.log(IsSelf); console.log(BackGroundName);
}
function addStyle() {
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
        console.log(element)
        element.style.opacity = 0.999;
    });
    const Special = document.querySelectorAll('#main'); // 挖坑
    Special.forEach(element => {
        console.log(element)
        element.style.opacity = Number(K);
    });
}
function addButton() {
    const button = document.createElement("button");
    button.textContent = "扩展设置";
    button.style.position = "fixed";
    button.style.top = "4px";
    button.style.fontSize = '16px';
    button.style.zIndex = "9999";
    button.style.background = 'linear-gradient(to bottom, #ffffff00, #ffffff00)';
    button.style.border = 'none';
    button.style.color = 'rgba(0,0,1,1)';
    button.style.padding = '10px 20px';
    button.style.cursor = 'pointer';
    button.style.position = 'fixed';
    button.style.right = `130px`;
    document.body.appendChild(button); button.id = 'BUTTON';
    /*
    // 创建一个函数来处理窗口大小变化的事件
    function handleResize() {
        const follow = document.querySelector("a.icon");
        button.style.right = follow.style.right;
        button.style.left = follow.style.left;
        console.log("change");
    }

    // 监听窗口大小变化的事件
    window.addEventListener("resize", handleResize);
*/
}
function RemoveText() {
    const TopText = document.getElementById('main-container');
    TopText.remove();
}
function createCustomEvent(eventName) {
    const customEvent = new Event(eventName);
    return customEvent;
}
function findElementsWithText(text,notext) {
    if (notext === '114514') {
        const elementsWithText = [];
        const allElements = document.getElementsByTagName('*');

        for (const element of allElements) {
            if (element.textContent.includes(text)) {
                elementsWithText.push(element);
            }
        }
        return elementsWithText;
    }
    const elementsWithText = [];
    const allElements = document.getElementsByTagName('*');

    for (const element of allElements) {
        if (element.textContent.includes(text) && !element.textContent.includes(notext)) {
            elementsWithText.push(element);
        }
    }
    return elementsWithText;
}
function setTitleColor() {
    const Clicker = findElementsWithText("话题","114514");
    console.log(Clicker);
    const customEventName = "TITLE";
    Clicker.forEach(element => {
        if (element.id.length >= 5 && element.id.substring(0,5) === "ember") {
            element.addEventListener('click', function() {
                const customEvent = createCustomEvent(customEventName);
                element.dispatchEvent(customEvent);
            });

            element.addEventListener(customEventName, function() {
                setTimeout(function(){
                    const TITLE1 = document.querySelector('.custom-search-banner-wrap > h1:nth-child(1)');
                    TITLE1.style.color = "rgba(0,0,0,0.999)";
                    const TITLE2 = document.querySelector('.custom-search-banner-wrap > p:nth-child(2)');
                    TITLE2.style.color = "rgba(0,0,0,0.999)";
                },2000);
                // 在这里你可以根据需求执行自定义的操作
            });
        }
    });
    setTimeout(function(){
        const TITLE1 = document.querySelector('.custom-search-banner-wrap > h1:nth-child(1)');
        TITLE1.style.color = "rgba(0,0,0,0.999)";
        const TITLE2 = document.querySelector('.custom-search-banner-wrap > p:nth-child(2)');
        TITLE2.style.color = "rgba(0,0,0,0.999)";
    },2000);
}
function SettingButton() {
    const overlay = document.createElement('div'); let content2;
    if (localStorage.getItem("userSelf") === "true") content2 = "自定义";
    else content2 = "随机漫画";
    overlay.id = 'popup-overlay';
    overlay.innerHTML = `
        <div id="popup-container">
            <div id="popup-content">
                <h1 style = "color: black;font-size:18px;">XYD Better扩展设置面板，更改在刷新后生效</h1>
                <p style = "color: green;font-size:16px;">\n字体 [字体需要提前安装到本地] \n</p>
                <button id="font-change-button">更改文本字体</button>
                <button id="font-size-change-button">更改文本字体大小</button>
                <button id="code-font-change-button">更改代码字体</button>
                <p style = "color: green;font-size:16px;">\n壁纸 [自定义壁纸如果不显示则说明自定义壁纸不兼容qwq] \n</p>
                <button id="self-change-button">当前为${content2}壁纸，点击更改</button>
                <button id="background-change-button">更改自定义壁纸</button>
                <p style = "color: green;font-size:16px;">\n界面美化 \n</p>
                <button id="K-change-button">更改界面透明度</button>
                <button id="close-button">X</button>
            </div>
        </div>
    `;

    // 添加样式
    GM_addStyle(`
        #popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }

        #popup-container {
            width: 66%;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #ccc;
            padding: 20px;
            border-radius: 10px;
            position: relative;
        }

        #popup-content {
            text-align: center;
        }

        #font-change-button {
            background-color: #007bff;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 10px;
        }

        #font-size-change-button {
            background-color: #007bff;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 10px;
        }

        #code-font-change-button {
            background-color: #007bff;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 10px;
        }

        #close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
        }

        #self-change-button {
            background-color: #007bff;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 10px;
        }

        #background-change-button {
            background-color: #007bff;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 10px;
        }

        #K-change-button {
            background-color: #007bff;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 10px;
        }
    `);

    // 添加弹出矩形到页面
    document.body.appendChild(overlay);
    // 获取关闭按钮、自定义按钮和弹出矩形
    const closeButton = document.getElementById('close-button');
    const fontButton = document.getElementById('font-change-button');
    const fontSizeButton = document.getElementById('font-size-change-button');
    const codeFontButton = document.getElementById('code-font-change-button');
    const selfButton = document.getElementById('self-change-button');
    const backgroundButton = document.getElementById('background-change-button');
    const KButton = document.getElementById('K-change-button');
    if (content2 === "随机漫画") {
        backgroundButton.style.color = "rgb(100,0,0)";
        backgroundButton.style.backgroundColor = "rgb(100,0,0)";
        backgroundButton.style.opacity = "0.3";
    }
    const popupOverlay = document.getElementById('popup-overlay');
    // 监听指定元素的点击事件
    const targetElement = document.getElementById('BUTTON');
    if (targetElement) {
        targetElement.addEventListener('click', () => {
            // 显示弹出矩形
            popupOverlay.style.display = 'flex';
        });
    }

    // 监听关闭按钮的点击事件
    closeButton.addEventListener('click', () => {
        // 隐藏弹出矩形
        popupOverlay.style.display = 'none';
    });
    // 监听自定义按钮的点击事件
    fontButton.addEventListener('click', () => {
        // 在这里添加自定义按钮的点击逻辑
        const newFont = prompt("请输入文本字体，保证字体已经保存在本地：", localStorage.getItem("userFont"));
        if (newFont !== null) {
            localStorage.setItem("userFont", newFont);
            alert(`您的信息已保存：\n${newFont}`);
        }
    });
    codeFontButton.addEventListener('click', () => {
        // 在这里添加自定义按钮的点击逻辑
        const newCodeFont = prompt("请输入代码字体，保证字体已经保存在本地，最好是等宽字体：", localStorage.getItem("userCodeFont"));
        if (newCodeFont !== null) {
            localStorage.setItem("userCodeFont", newCodeFont);
            alert(`您的信息已保存：\n${newCodeFont}`);
        }
    });
    fontSizeButton.addEventListener('click', () => {
        // 在这里添加自定义按钮的点击逻辑
        const newSizeFont = prompt("请输入字体大小，单位px（只用输入数字）：", localStorage.getItem("userFontSize"));
        if (newSizeFont !== null) {
            localStorage.setItem("userFontSize", newSizeFont);
            alert(`您的信息已保存：\n${newSizeFont}`);
        }
    });
    selfButton.addEventListener('click', () => {
        // 在这里添加自定义按钮的点击逻辑
        let nowSelf = localStorage.getItem("userSelf");
        if (nowSelf === "true") nowSelf = "false";
        else nowSelf = "true";
        localStorage.setItem("userSelf",nowSelf);
        if (localStorage.getItem("userSelf") === "true") content2 = '自定义';
        else content2 = '随机漫画';
        selfButton.textContent = `当前为${content2}壁纸，点击更改`;
        alert(`您的信息已保存：\n${content2}`);
        if (content2 === "随机漫画") {
            backgroundButton.style.color = "rgb(100,0,0)";
            backgroundButton.style.backgroundColor = "rgb(100,0,0)";
            backgroundButton.style.opacity = "0.3";
        } else {
            backgroundButton.style.color = "#fff";
            backgroundButton.style.backgroundColor = "#007bff";
            backgroundButton.style.opacity = "0.85";
        }
    });
    backgroundButton.addEventListener('click', () => {
        if (content2 === "随机漫画") return ;
        // 在这里添加自定义按钮的点击逻辑
        const newBackground = prompt("请输入自定义背景图url：", localStorage.getItem("userBackground"));
        if (newBackground !== null) {
            localStorage.setItem("userBackground", newBackground);
            alert(`您的信息已保存：\n${newBackground}`);
        }
    });
    KButton.addEventListener('click', () => {
        // 在这里添加自定义按钮的点击逻辑
        const newK = prompt("请输入透明度，在 0 和 1 之间：", localStorage.getItem("userK"));
        if (newK !== null) {
            localStorage.setItem("userK", newK);
            alert(`您的信息已保存：\n${newK}`);
        }
    });
    fontButton.style.opacity = 0.85;
    fontButton.addEventListener('mouseover', () => { fontButton.style.opacity = 1; });
    fontButton.addEventListener('mouseout', () => { fontButton.style.opacity = 0.85; });
    codeFontButton.style.opacity = 0.85;
    codeFontButton.addEventListener('mouseover', () => { codeFontButton.style.opacity = 1; });
    codeFontButton.addEventListener('mouseout', () => { codeFontButton.style.opacity = 0.85; });
    closeButton.style.opacity = 0.85;
    closeButton.addEventListener('mouseover', () => { closeButton.style.opacity = 1; });
    closeButton.addEventListener('mouseout', () => { closeButton.style.opacity = 0.85; });
    fontSizeButton.style.opacity = 0.85;
    fontSizeButton.addEventListener('mouseover', () => { fontSizeButton.style.opacity = 1; });
    fontSizeButton.addEventListener('mouseout', () => { fontSizeButton.style.opacity = 0.85; });
    selfButton.style.opacity = 0.85;
    selfButton.addEventListener('mouseover', () => { selfButton.style.opacity = 1; });
    selfButton.addEventListener('mouseout', () => { selfButton.style.opacity = 0.85; });
    KButton.style.opacity = 0.85;
    KButton.addEventListener('mouseover', () => { KButton.style.opacity = 1; });
    KButton.addEventListener('mouseout', () => { KButton.style.opacity = 0.85; });
    if (content2 === "自定义") backgroundButton.style.opacity = 0.85;
    backgroundButton.addEventListener('mouseover', () => { if (content2 === "自定义") backgroundButton.style.opacity = 1; });
    backgroundButton.addEventListener('mouseout', () => { if (content2 === "自定义") backgroundButton.style.opacity = 0.85; });
}
(function() {
    Init();
    window.addEventListener('load', function(){
        'use strict';
        addButton(); addStyle(); SettingButton();
        if (IsSelf === "false") {
            let zindex = -10;
            let body = document.querySelector('body');
            let bg = "https://t.mwm.moe/pc/";
            console.log(bg);
            let opacity = "0.3";
            let bgBox = document.createElement('div');
            // window.location.reload(); console.log('asdf');
            bgBox.style = "z-index: " + zindex + ";width: 100vw; height: 100vh;position: fixed;top: 0;left: 0;pointer-events: none;opacity: " + opacity + ";background-image: url(" + bg + ") ;background-attachment: fixed;background-size: cover;";
            console.log('reload'); body.insertBefore(bgBox,body.children[0]);
        } else {
            let zindex = -10;
            let body = document.querySelector('body');
            let bg = BackGroundName;
            console.log(bg);
            let opacity = "0.3";
            let bgBox = document.createElement('div');
            // window.location.reload(); console.log('asdf');
            bgBox.style = "z-index: " + zindex + ";width: 100vw; height: 100vh;position: fixed;top: 0;left: 0;pointer-events: none;opacity: " + opacity + ";background-image: url(" + bg + ") ;background-attachment: fixed;background-size: cover;";
            body.insertBefore(bgBox,body.children[0]);
        }
        document.body.style.fontFamily = FontName;
        document.body.style.fontSize = FontSize + 'px';
        GM_addStyle(`
        code {
            font-family: '${CodeFontName}', '微软雅黑' !important;
        }
    `);
        GM_addStyle(`
        body {
            background-color: rgba(255,255,255,0.6);
        }
        .d-header,
        .d-editor-wrapper,
        .d-editor-preview,
        .d-sidekiq-stats,
        .d-footer {
            background-color: rgba(255,255,255,0.6) !important;
        }
    `);
        // 使用CSS选择器选择所有匹配的元素
        const element = document.querySelector(".background-container");
        // 循环遍历这些元素并设置它们的透明度
        element.style.opacity = 0; // 0 表示完全透明，1 表示完全不透明
        setTitleColor();
        RemoveText();
    });

})();