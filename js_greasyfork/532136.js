// ==UserScript==
// @name           豆瓣资源名称复制助手
// @description    一个简单的豆瓣资源名称复制工具，支持自定义前缀。
// @author         Mobius
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @include        https://movie.douban.com/*
// @include        https://music.douban.com/*
// @include        https://book.douban.com/*
// @version        1.0.0
// @icon           https://47bt.com/favicon.ico
// @run-at         document-end
// @namespace      doveboy_js
// @downloadURL https://update.greasyfork.org/scripts/532136/%E8%B1%86%E7%93%A3%E8%B5%84%E6%BA%90%E5%90%8D%E7%A7%B0%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/532136/%E8%B1%86%E7%93%A3%E8%B5%84%E6%BA%90%E5%90%8D%E7%A7%B0%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 获取保存的前缀和后缀设置
let prefix = GM_getValue("prefix", "47BT.");
let suffix = GM_getValue("suffix", "");

// 注册菜单命令以修改前缀和后缀
if (typeof GM_registerMenuCommand !== "undefined") {
    function changePrefixSetting() {
        let newPrefix = prompt("请输入要设置的前缀：", prefix);
        if (newPrefix !== null) {
            GM_setValue("prefix", newPrefix);
            prefix = newPrefix;
        }
    }
    function changeSuffixSetting() {
        let newSuffix = prompt("请输入要设置的后缀：", suffix);
        if (newSuffix !== null) {
            GM_setValue("suffix", newSuffix);
            suffix = newSuffix;
        }
    }
    GM_registerMenuCommand("设置复制前缀", changePrefixSetting);
    GM_registerMenuCommand("设置复制后缀", changeSuffixSetting);
}

// 主函数
// 添加标题处理函数
function formatTitle(text) {
    // 替换特殊字符、空格和中文标点符号为半角句号
    return text.replace(/[\s!@#$%^&*()\[\]{}\-_+=~`|\\:;"'<>,.?/、，。：；？！（）【】《》"]+/g, ".");
}

function init() {
    // 获取资源标题
    const titleElement = document.querySelector("h1");
    if (!titleElement) return;

    // 获取所有文本内容，包括中文名、英文名和年份
    const titleText = titleElement.textContent.trim();
    // 移除"复制标题"文本（如果存在）
    const rawTitle = titleText.replace(/复制标题$/, "").trim();
    
    // 解析标题中的中文名、英文名和年份
    const yearMatch = rawTitle.match(/(\d{4})/); // 匹配年份
    const year = yearMatch ? yearMatch[1] : "";
    
    // 移除年份，然后分割中英文名称
    let titleWithoutYear = rawTitle.replace(/\s*\d{4}\s*/, "").trim();
    // 移除可能存在的空括号
    titleWithoutYear = titleWithoutYear.replace(/\s*\(\s*\)\s*/g, "");
    let [chineseName, englishName] = titleWithoutYear.split(/\s+/).reduce((acc, part) => {
        if (/[\u4e00-\u9fa5]/.test(part)) { // 包含中文字符
            acc[0] = (acc[0] ? acc[0] + " " : "") + part;
        } else if (part.trim()) { // 英文部分，确保不是空字符串
            acc[1] = (acc[1] ? acc[1] + " " : "") + part;
        }
        return acc;
    }, ["", ""]);
    
    // 处理中文名和英文名中的特殊字符
    chineseName = formatTitle(chineseName);
    englishName = formatTitle(englishName);
    
    // 组合最终标题格式，确保每个部分都有值才添加
    const title = [chineseName, englishName, year].filter(Boolean).join(".");

    // 创建复制按钮
    const copyButton = document.createElement("button");
    copyButton.textContent = "复制标题";
    copyButton.style.marginLeft = "10px";
    copyButton.style.padding = "4px 12px";
    copyButton.style.backgroundColor = "#007bff";
    copyButton.style.color = "white";
    copyButton.style.border = "none";
    copyButton.style.borderRadius = "4px";
    copyButton.style.cursor = "pointer";
    copyButton.style.fontSize = "14px";
    copyButton.style.transition = "background-color 0.2s";

    copyButton.onmouseover = function() {
        copyButton.style.backgroundColor = "#0056b3";
    };

    copyButton.onmouseout = function() {
        copyButton.style.backgroundColor = "#007bff";
    };

    copyButton.onclick = function() {
        let textArea = document.createElement("textarea");
        textArea.value = prefix + title + suffix;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        
        // 创建临时提示元素
        let tipSpan = document.createElement("span");
        tipSpan.textContent = "已复制";
        tipSpan.style.marginLeft = "10px";
        tipSpan.style.color = "#28a745";
        tipSpan.style.fontSize = "14px";
        copyButton.parentNode.appendChild(tipSpan);
        
        // 2秒后移除提示
        setTimeout(function() {
            copyButton.parentNode.removeChild(tipSpan);
        }, 2000);
    };

    // 将按钮添加到页面
    titleElement.appendChild(copyButton);
}

// 页面加载完成后执行初始化
init();