// user.js 的标准开头
// ==UserScript==
// @name         谷歌自动翻译特定次数
// @namespace    moe001
// @version      1.01
// @description  将输入的文本翻译成随机语言，可以指定随机次数
// @author       moe001
// @match        *://translate.google.com/
// @match        *://translate.google.com.hk/
// @match        *://translate.google.*/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464681/%E8%B0%B7%E6%AD%8C%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%E7%89%B9%E5%AE%9A%E6%AC%A1%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/464681/%E8%B0%B7%E6%AD%8C%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%E7%89%B9%E5%AE%9A%E6%AC%A1%E6%95%B0.meta.js
// ==/UserScript==
var sleep = (time) => { return new Promise((resolve) => setTimeout(resolve, time)) }


// 在网页右下角创建一个控制面板
var panel = document.createElement('div');
panel.style.position = 'fixed';
panel.style.bottom = '0';
panel.style.right = '0';
panel.style.width = '300px';
panel.style.height = '300px';
panel.style.backgroundColor = 'rgba(0,0,0,0.2)';
panel.style.color = 'white';
panel.style.zIndex = '9999';
panel.style.padding = '10px';
panel.style.boxSizing = 'border-box';
panel.style.borderRadius = '10px';
document.body.appendChild(panel);
// 面板里第一行是输入框，用来输入次数，默认值为20，不可为负数
var input = document.createElement('input');
input.style.width = '100%';
input.style.boxSizing = 'border-box';
input.style.marginBottom = '10px';
input.value = '20';
panel.appendChild(input);
// 面板里第二行是按钮，点击后开始翻译
var button = document.createElement('button');
button.style.width = '100%';
button.style.boxSizing = 'border-box';
button.style.marginBottom = '10px';
button.innerText = '开始翻译';
panel.appendChild(button);
// 面板里第三行是一个多行文本框，不能输入，作为日志栏展示操作进度，大小不可变
var log = document.createElement('textarea');
log.style.width = '100%';
log.style.height = '75%';
log.style.boxSizing = 'border-box';
log.style.marginBottom = '10px';
log.readOnly = true;
log.style.resize = 'none';
// 上边缘外侧有一个折叠按钮，点击后折叠面板
var foldButton = document.createElement('button');
foldButton.style.position = 'absolute';
foldButton.style.top = '-30px';
foldButton.style.right = '0';
foldButton.style.width = '30px';
foldButton.style.height = '30px';
foldButton.style.backgroundColor = 'rgba(0,0,0,0.2)';
foldButton.style.color = '#333';
foldButton.style.zIndex = '9999';
foldButton.style.borderRadius = '10px';
foldButton.innerText = '↓';
foldButton.addEventListener('click', () => {
    if (panel.style.height == '300px') {
        panel.style.height = '0px';
        foldButton.innerText = '↑';
    } else {
        panel.style.height = '300px';
        foldButton.innerText = '↓';
    }
});
panel.appendChild(foldButton);
panel.appendChild(log);
// 添加日志的方法
var addLog = (text,br = true) => {
    log.value += text;
    if(br) log.value += '\n';
    log.scrollTop = log.scrollHeight;
}
// 清空日志的方法
var clearLog = () => {
    log.value = '';
}


// 语言互换的按钮路径为.aCQag > c-wiz:nth-child(1) > div:nth-child(1) > c-wiz:nth-child(1) > div:nth-child(3) > div:nth-child(1) > span:nth-child(1) > button:nth-child(1)
var swapButton = document.querySelector('.aCQag > c-wiz:nth-child(1) > div:nth-child(1) > c-wiz:nth-child(1) > div:nth-child(3) > div:nth-child(1) > span:nth-child(1) > button:nth-child(1)');

// 目标语言按钮 按属性查找jsname="zumM6d"
var targetLanguageButton = document.querySelector('[jsname="zumM6d"]');
// 查找所有语言的按钮，语言按钮是一个div，一定有data-language-code属性，并且都在一个div里，这个div有属性jsname="gnoFo"，然后中间还有一层div是jsname="Kxj0sc"
var languageButtons = document.querySelector('[jsname="gnoFo"]').querySelector('[jsname="Kxj0sc"]').querySelectorAll('[data-language-code]');

var waitForSwapButtonDisabled = () => {
    return new Promise((resolve) => {
        var observer = new MutationObserver((mutationsList) => {
            for (var mutation of mutationsList) {
                if (mutation.type == 'attributes') {
                    if (mutation.attributeName == 'disabled') {
                        resolve();
                        observer.disconnect();
                    }
                }
            }
        });
        observer.observe(swapButton, { attributes: true });
    });
}

var waitForSwapButtonEnabled = () => {
    return new Promise((resolve) => {
        var observer = new MutationObserver((mutationsList) => {
            for (var mutation of mutationsList) {
                if (mutation.type == 'attributes') {
                    if (mutation.attributeName == 'disabled') {
                        resolve();
                        observer.disconnect();
                    }
                }
            }
        });
        observer.observe(swapButton, { attributes: true });
    });
}
var waitForSwapButton = () => {
    waitForSwapButtonDisabled();
    waitForSwapButtonEnabled();
}

// 当开始翻译按钮被点击时 调用一个异步函数
button.addEventListener('click', async () => {
    // 获取输入框的值
    var count = input.value;
    // 如果输入的值不是数字或者小于等于0，提示错误并退出
    if (isNaN(count) || count <= 0) {
        alert('请输入大于0的数字');
        return;
    }
    // 将输入框设为不可用
    input.disabled = true;
    // 将开始翻译按钮设为不可用
    button.disabled = true;
    // 将日志栏清空
    clearLog();
    // 设置来源语言为自动
    addLog('设置来源语言为自动');
    // 自动来源语言按钮 按属性查找
    var autoSourceLanguageButton = document.querySelector('[jsname="gnoFo"]').querySelector('[data-language-code="auto"]');
    autoSourceLanguageButton.click();
    // 等待切换按钮的属性变化
    waitForSwapButton();
    await sleep(1000);
    // 将日志栏添加一条信息
    addLog('开始翻译' + count + '次');
    while (count > 0) {
        // 随机选择一个目标语言
        var lastLanguage = "";
        var targetLanguage = languageButtons[Math.floor(Math.random() * languageButtons.length)];
        // 如果随机到的目标语言和当前语言一样，重新随机
        // 语言名为里面第二个div
        var targetLanguageName = targetLanguage.children[1].innerText;
        while (targetLanguageName == lastLanguage) {
            targetLanguage = languageButtons[Math.floor(Math.random() * languageButtons.length)];
            targetLanguageName = targetLanguage.children[1].innerText;
        }
        lastLanguage = targetLanguageName;
        // 将日志栏添加一条信息
        addLog('目标语言：' + targetLanguageName);
        // 点击目标语言按钮
        targetLanguage.click();
        addLog('处理中');
        
        // 等待切换按钮的属性变化
        waitForSwapButton();
        // 等待1秒
        await sleep(1000);
        // 点击语言互换按钮
        swapButton.click();
        addLog('更新原文');
        // 等待切换按钮的属性变化
        waitForSwapButton();

        await sleep(500);
        // 翻译次数减一
        count--;
        addLog('剩余' + count + '次');
        addLog('----------------');
    }
    // 译回中文
    addLog('译回中文');
    // 找到中文按钮
    var chineseButton = document.querySelector('[jsname="gnoFo"]').querySelector('[jsname="Kxj0sc"]').querySelector('[data-language-code="zh-CN"]');
    // 点击中文按钮
    chineseButton.click();
    // 等待切换按钮的属性变化
    waitForSwapButton();
    // 等待1秒
    await sleep(1000);
    // 恢复输入框的可用状态
    input.disabled = false;
    // 恢复开始翻译按钮的可用状态
    button.disabled = false;
    // 将日志栏添加一条信息
    addLog('翻译完成');

});