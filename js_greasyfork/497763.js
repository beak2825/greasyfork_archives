// ==UserScript==
// @name         Douyin Text Extractor
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Activate mode to click and get text from elements with a popup copy option, preserving <br> tags
// @author       korruz
// @match        https://www.douyin.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497763/Douyin%20Text%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/497763/Douyin%20Text%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isActive = false; // To track whether selection mode is active

    // Create activation button
    var activationButton = document.createElement('button');
    activationButton.textContent = 'Activate Text Selection';
    activationButton.style.position = 'fixed';
    activationButton.style.bottom = '20px';
    activationButton.style.right = '20px';
    activationButton.style.padding = '10px';
    activationButton.style.fontSize = '16px';
    activationButton.style.zIndex = '10000';

    activationButton.onclick = function() {
        isActive = !isActive; // Toggle activation state
        activationButton.textContent = isActive ? 'Text Selection Active (Click to Deactivate)' : 'Activate Text Selection';
    };

    document.body.appendChild(activationButton);

    // Function to create and show the popup
    function createPopup(text) {
        // Remove existing popup if it exists
        var existingPopup = document.getElementById('custom-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        // Create the popup window
        var popup = document.createElement('div');
        popup.id = 'custom-popup';
        popup.style.position = 'fixed';
        popup.style.top = '50px';
        popup.style.right = '50px';
        popup.style.padding = '20px';
        popup.style.backgroundColor = 'white';
        popup.style.border = '1px solid black';
        popup.style.zIndex = '10010';

        // Text element
        var textElement = document.createElement('textarea');
        textElement.value = text;
        textElement.style.width = '300px';
        textElement.style.height = '150px';

        // Copy button
        var copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.style.display = 'block';
        copyButton.style.marginTop = '10px';
        copyButton.onclick = function() {
            navigator.clipboard.writeText(textElement.value).then(() => {
                alert('Text copied successfully!');
            }).catch(err => {
                alert('Failed to copy text: ' + err);
            });
        };

        // Append elements to the popup
        popup.appendChild(textElement);
        popup.appendChild(copyButton);

        // Append the popup to the body
        document.body.appendChild(popup);
    }
    function getTextWithNewLines(element) {
        // 创建一个容器来存储最终的文本
        let text = "";

        // 遍历所有子节点
        for (const node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                // 如果是文本节点，直接添加文本
                text += node.nodeValue;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // 如果是元素节点，检查是否为<br>，如果是，添加换行符
                if (node.tagName === "BR") {
                    text += "\n";
                } else {
                    // 对于其他类型的元素，递归调用此函数
                    text += getTextWithNewLines(node);
                }
            }
        }

        return text;
    }

    function extractText(html) {
        // 创建一个新的div元素
        var tempDiv = document.createElement("div");
        // 设置HTML内容
        tempDiv.innerHTML = html;
        // 返回元素的纯文本内容
        return getTextWithNewLines(tempDiv);
    }
    document.addEventListener('click', function(e) {
        if (isActive && !e.target.matches('button')) { // Check if the activation mode is active and the target is not a button
            e.preventDefault();
            e.stopPropagation();

            // Extract text and handle <br> tags
            //var text = e.target.innerHTML.replace(/<br\s*\/?>/gi, '\n');
            var text = extractText(e.target.innerHTML);
            createPopup(text);
            return false;
        }
    }, true); // Use capture phase to handle the event first
})();
