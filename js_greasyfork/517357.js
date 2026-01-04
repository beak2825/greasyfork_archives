// ==UserScript==
// @name         汉化修改器/手动替换网页文本/搜索替换/xpath/文本替换/上帝模式
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  修改网页上的文本并保存更改，支持更多功能
// @author       by mango QQ413316602
// @match        *://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517357/%E6%B1%89%E5%8C%96%E4%BF%AE%E6%94%B9%E5%99%A8%E6%89%8B%E5%8A%A8%E6%9B%BF%E6%8D%A2%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E6%90%9C%E7%B4%A2%E6%9B%BF%E6%8D%A2xpath%E6%96%87%E6%9C%AC%E6%9B%BF%E6%8D%A2%E4%B8%8A%E5%B8%9D%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/517357/%E6%B1%89%E5%8C%96%E4%BF%AE%E6%94%B9%E5%99%A8%E6%89%8B%E5%8A%A8%E6%9B%BF%E6%8D%A2%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E6%90%9C%E7%B4%A2%E6%9B%BF%E6%8D%A2xpath%E6%96%87%E6%9C%AC%E6%9B%BF%E6%8D%A2%E4%B8%8A%E5%B8%9D%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isInspecting = false;
    let selectedElement = null;
    let originalOutline = '';


    const toggleInspectionMode = () => {
        isInspecting = !isInspecting;
        if (isInspecting) {
            document.addEventListener('mouseover', highlightElement, true);
            document.addEventListener('mouseout', unhighlightElement, true);
            document.addEventListener('click', inspectElement, true);
        } else {
            document.removeEventListener('mouseover', highlightElement, true);
            document.removeEventListener('mouseout', unhighlightElement, true);
            document.removeEventListener('click', inspectElement, true);
            if (selectedElement) {
                unhighlightElement({ target: selectedElement });
                selectedElement = null;
            }
        }
    };

    const highlightElement = (event) => {
        originalOutline = event.target.style.outline;
        event.target.style.outline = '2px solid red';
    };

    const unhighlightElement = (event) => {
        event.target.style.outline = originalOutline;
    };

    const inspectElement = (event) => {
        event.preventDefault();
        event.stopPropagation();
        selectedElement = event.target;
        const text = selectedElement.textContent;
        const xpath = getXPath(selectedElement);
        const elementId = selectedElement.id;
        toggleInspectionMode();
        showInlinePrompt(text, xpath, elementId);
    };

    const getXPath = (element) => {
        if (element.id !== '') {
            console.log(`//*[@id="${element.id}"]`)
            return `//*[@id="${element.id}"]`;
        }
        if (element === document.body) {
            return '/html/body';
        }
        let ix = 0;
        const siblings = element.parentNode.childNodes;
        for (let i = 0; i < siblings.length; i++) {
            const sibling = siblings[i];
            if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
                if (sibling === element) {
                    return `${getXPath(element.parentNode)}/${element.tagName.toLowerCase()}[${ix + 1}]`;
                }
                ix++;
            }
        }
    };


    const showInlinePrompt = (originalText, xpath, elementId) => {

        // 计算每种匹配方式的当前数量
        const elements = findElementsWithText(originalText);
        const textMatchCount = elements.length;
        const xpathMatchCount = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
        const idMatchCount = document.getElementById(elementId) ? 1 : 0;

        const dialog = document.createElement('dialog');
        dialog.style.padding = '20px';
        dialog.style.border = '2px solid #333';
        dialog.style.borderRadius = '8px';
        dialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        dialog.style.color = '#000';

        dialog.innerHTML = `
    <h3 style="margin-top: 0;">编辑文本</h3>
    <p><strong>原始文本:</strong> <input type="text" id="originalText" value="${originalText}" style="width: 100%;" /></p>
    <p><strong>XPath:</strong> <input type="text" id="xpath" style="width: 100%;" ></input></p>
    <p><strong>元素ID:</strong> ${elementId}</p>
    <p>
        <strong>匹配方式:</strong>
        <select id="matchType" style="width: 100%;">
            <option value="text">文本 (匹配数量: ${textMatchCount})</option>
            <option value="xpath">XPath (匹配数量: ${xpathMatchCount})</option>
            <option value="id">ID (匹配数量: ${idMatchCount})</option>
        </select>
    </p>
    <p>
        <strong>新文本:</strong> <input type="text" id="newText" value="${originalText}" style="width: 100%;" />
    </p>
    <div style="text-align: right;">
        <button id="saveButton" style="margin-right: 8px; padding: 5px 10px; border: none; background-color: #4CAF50; color: white; border-radius: 4px; cursor: pointer;">保存</button>
        <button id="cancelButton" style="padding: 5px 10px; border: none; background-color: #f44336; color: white; border-radius: 4px; cursor: pointer;">取消</button>
    </div>
`;

        document.body.appendChild(dialog);
        dialog.showModal(); // 显示对话框

        document.getElementById('xpath').value = xpath;

        document.getElementById('saveButton').addEventListener('click', () => {
            const newText = document.getElementById('newText').value;
            const newXPath = document.getElementById('xpath').value;
            const newOriginalText = document.getElementById('originalText').value;
            const matchType = document.getElementById('matchType').value;
            saveRule(matchType, newXPath, elementId, newOriginalText, newText);
            applyRules();
            dialog.close(); // 关闭对话框
            document.body.removeChild(dialog);
        });

        document.getElementById('cancelButton').addEventListener('click', () => {
            dialog.close(); // 关闭对话框
            document.body.removeChild(dialog);
        });
    };



    const saveRule = (matchType, xpath, elementId, originalText, newText) => {
        let rules = JSON.parse(localStorage.getItem('rules') || '[]');
        let rule = {};

        if (matchType === 'text') {
            rule = { type: 'text', originalText, newText };
        } else if (matchType === 'xpath') {
            rule = { type: 'xpath', xpath, newText };
        } else if (matchType === 'id') {
            rule = { type: 'id', elementId, newText };
        }

        rules.push(rule);
        localStorage.setItem('rules', JSON.stringify(rules));
    };

    const findElementsWithText = (originalText) => {
        const elements = [];
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    return node.textContent.trim() === originalText.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );

        while (walker.nextNode()) {
            elements.push(walker.currentNode.parentNode);
        }
        return elements;
    };

    const replaceTextContent = (elements, originalText, newText) => {
        elements.forEach(el => {
            el.childNodes.forEach(child => {
                if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() === originalText.trim()) {
                    child.textContent = newText;
                }
            });
        });
    };

    const applyRules = () => {
        let rules = JSON.parse(localStorage.getItem('rules') || '[]');
        rules.forEach(rule => {
            try {
                if (rule.type === 'text') {
                    // 只选择包含原始文本的元素，减少遍历次数
                    const elements = findElementsWithText(rule.originalText);
                    console.log(`Found ${elements.length} elements with text: ${rule.originalText}`);
                    replaceTextContent(elements, rule.originalText, rule.newText);
                } else if (rule.type === 'xpath') {
                    const elements = document.evaluate(rule.xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                    for (let i = 0; i < elements.snapshotLength; i++) {
                        const element = elements.snapshotItem(i);
                        console.log(element.textContent)
                        element.textContent = rule.newText;
                    }
                } else if (rule.type === 'id') {
                    const element = document.getElementById(rule.elementId);
                    if (element) {
                        element.textContent = rule.newText;
                    }
                }
            } catch (error) {
                console.error(`Error processing rule: ${JSON.stringify(rule)}`, error);
            }
        });
    };

    let rulesDiv = null; // 将 rulesDiv 提升为全局变量
    const showRules = () => {
        if (rulesDiv) {
            document.body.removeChild(rulesDiv);
            rulesDiv = null;
            return;
        }
        let rules = JSON.parse(localStorage.getItem('rules') || '[]');
        rulesDiv = document.createElement('div');
        rulesDiv.style.position = 'fixed';
        rulesDiv.style.top = '10%';
        rulesDiv.style.right = '10%';
        rulesDiv.style.padding = '20px';
        rulesDiv.style.backgroundColor = 'white';
        rulesDiv.style.border = '1px solid black';
        rulesDiv.style.zIndex = 10000;
        rulesDiv.style.maxHeight = '80%';
        rulesDiv.style.overflowY = 'auto';
        rulesDiv.style.backgroundColor = 'white'; // 设置背景颜色为白色
        rulesDiv.style.color = 'black'; // 设置字体颜色为黑色

        let rulesHTML = '<h3>已保存的规则</h3><ul>';
        rules.forEach((rule, index) => {
            rulesHTML += `<li>${rule.type}: ${rule.originalText || rule.xpath || rule.elementId} -> ${rule.newText} <button data-index="${index}">删除</button></li>`;
        });
        rulesHTML += '</ul><button id="closeRules">关闭</button>';
        rulesHTML += '<button id="exportRules">导出规则</button>';
        rulesHTML += '<button id="importRules">导入规则</button>';
        rulesHTML += '<input type="file" id="importFile" style="display: none;" accept=".json"/>';

        rulesDiv.innerHTML = rulesHTML;
        document.body.appendChild(rulesDiv);

        rulesDiv.querySelectorAll('button[data-index]').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                rules.splice(index, 1);
                localStorage.setItem('rules', JSON.stringify(rules));
                document.body.removeChild(rulesDiv);
                showRules();
            });
        });

        document.getElementById('closeRules').addEventListener('click', () => {
            document.body.removeChild(rulesDiv);
        });

        document.getElementById('exportRules').addEventListener('click', () => {
            const blob = new Blob([JSON.stringify(rules)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'rules.json';
            a.click();
            URL.revokeObjectURL(url);
        });

        document.getElementById('importRules').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        document.getElementById('importFile').addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedRules = JSON.parse(e.target.result);
                        if (Array.isArray(importedRules)) {
                            rules = importedRules;
                            localStorage.setItem('rules', JSON.stringify(rules));
                            document.body.removeChild(rulesDiv);
                            showRules();
                            applyRules();
                        } else {
                            alert('导入的文件格式不正确');
                        }
                    } catch (error) {
                        alert('导入失败，请检查文件格式');
                    }
                };
                reader.readAsText(file);
            }
        });
    };


    window.addEventListener('load', ()=>{
        applyRules();
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'F10') {
            toggleInspectionMode();
        }
        if (event.key === 'F9') {
            showRules();
        }
    });

    let debounceTimeout;

    const observer = new MutationObserver((mutations) => {
        let shouldApplyRules = false;

        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                shouldApplyRules = true;
            }
        });

        if (shouldApplyRules) {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                applyRules();
            }, 100); // 100毫秒防抖
        }
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
})();
