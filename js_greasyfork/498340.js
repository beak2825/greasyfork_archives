// ==UserScript==
// @name         云简平台多行粘贴
// @namespace    http://desire.net/
// @version      2025-9-12(h)
// @description  云简平台多行粘贴v1.2h
// @author       Desire
// @match        https://oasis.h3c.com/oasis6/static/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=h3c.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498340/%E4%BA%91%E7%AE%80%E5%B9%B3%E5%8F%B0%E5%A4%9A%E8%A1%8C%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/498340/%E4%BA%91%E7%AE%80%E5%B9%B3%E5%8F%B0%E5%A4%9A%E8%A1%8C%E7%B2%98%E8%B4%B4.meta.js
// ==/UserScript==


function $x(DOCUMENT, STR_XPATH) {
	var xresult = DOCUMENT.evaluate(STR_XPATH, DOCUMENT, null, XPathResult.ANY_TYPE, null);
	var xnodes = [];
	var xres;
	while (xres = xresult.iterateNext()) {
		xnodes.push(xres);
	}
	return xnodes;
}

function waitForElementByObserver(selector, callback) {
    // 先检查一下页面上是否已经存在
    if (document.querySelector(selector)) {
        callback(document.querySelector(selector));
        return;
    }

    // 如果不存在，就创建一个 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            obs.disconnect(); // 找到后就停止监听，避免性能浪费
        }
    });

    // 监听整个 document.body 的子节点变化
    observer.observe(document.body, {
        childList: true,   // 监听直接子节点变化
        subtree: true      // 监听所有后代节点
    });
}

function changeStyle(button, targetButton){
    if (targetButton) {
        // 获取目标按钮的所有样式
        var targetStyles = window.getComputedStyle(targetButton);

        // 将目标按钮的样式应用到新的按钮上
        for (var i = 0; i < targetStyles.length; i++) {
            var key = targetStyles[i];
            button.style[key] = targetStyles.getPropertyValue(key);
        }
    }
}

// 创建一个弹窗的函数
function createPopup(iframe) {
    // 创建背景遮罩
    var overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
    overlay.style.zIndex = "1000";
    document.body.appendChild(overlay);

    // 创建弹窗容器
    var popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.backgroundColor = "#fff";
    popup.style.padding = "20px";
    popup.style.borderRadius = "8px";
    popup.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    popup.style.zIndex = "1001";
    popup.style.width = "400px";
    overlay.appendChild(popup);

    // 创建关闭按钮
    var closeButton = document.createElement("button");
    closeButton.textContent = "×";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.padding = "5px 10px";
    closeButton.style.fontSize = "20px";
    closeButton.style.border = "none";
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.color = "#888";
    closeButton.style.cursor = "pointer";
    popup.appendChild(closeButton);

    // 点击关闭按钮时关闭弹窗
    closeButton.addEventListener("click", function() {
        closePopup();
    });

    // 创建多行输入框
    var textarea = document.createElement("textarea");
    textarea.style.width = "95%";
    textarea.style.height = "100px";
    textarea.style.marginTop = "20px";
    textarea.style.padding = "10px";
    textarea.style.fontSize = "16px";
    textarea.style.border = "1px solid #ccc";
    textarea.style.borderRadius = "4px";
    textarea.placeholder = "请输入多行内容";
    popup.appendChild(textarea);

    // 创建确认按钮
    var confirmButton = document.createElement("button");
    confirmButton.textContent = "确认";
    confirmButton.style.marginTop = "10px";
    confirmButton.style.padding = "8px 20px";
    confirmButton.style.fontSize = "16px";
    confirmButton.style.backgroundColor = "#007bff";
    confirmButton.style.color = "#fff";
    confirmButton.style.border = "none";
    confirmButton.style.borderRadius = "4px";
    confirmButton.style.cursor = "pointer";
    popup.appendChild(confirmButton);

    // 确认按钮点击事件
    confirmButton.addEventListener("click", function() {
        var shellinb = iframe.contentWindow.shellinabox;
        var userInput = textarea.value;
        var lines = userInput.split('\n');
        var time = 150;

        for (var i = 0; i < lines.length; i++) {
            let line = lines[i].trim(); // 去除行首行尾空白字符
            setTimeout(() => shellinb.keysPressed(line + '\r\n'), time);
            time += 150;
        }

        closePopup();
    });

    // 关闭弹窗的函数
    function closePopup() {
        document.body.removeChild(overlay);
    }
}

(function() {
    'use strict';
    // 等待 class 为 ".item" 的元素出现后执行代码
    waitForElementByObserver(".item", function(targetElement) {
        // shellinb 是 telnet 窗口
        var iframe = $x(document, '//*[@id="app"]/div[1]/div[3]/div[2]/div[3]/div/div[3]/div/div[1]/div[2]/div/iframe')[0];
        var comment = $x(document, '//*[@id="app"]/div[1]/div[3]/div[2]/div[3]/div/div[3]/div/div[1]/div[1]/div[3]')[0];
        var button = document.createElement("button"); //创建一个按钮
        var span = document.createElement("span");
        span.textContent = "多行粘贴";

        // 抄袭第一个 item 的 sytle
        changeStyle(button, comment.getElementsByTagName("button")[1]);

        // 添加监听按钮 click 事件，弹出悬浮框
        button.appendChild(span);
        button.addEventListener("click", function() {
            createPopup(iframe);
        });
        comment.appendChild(button); //把按钮加入到 item 的子节点中
    });

})()