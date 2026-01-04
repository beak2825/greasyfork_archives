// ==UserScript==
// @name         ES自定义解析
// @version      20250417001
// @description  使用自定义的结构解析ES查询结果 使查询结果易于解读
// @author       HP
// @match        *://*/app/discover*
// @namespace    http://tampermonkey.net/
// @license      WTFPL
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/490163/ES%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/490163/ES%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

let targetNode = document.body;
let observerOptions = {
    childList: true, // 观察目标子节点的变化，添加或删除
    subtree: true, //默认是false，设置为true后可观察后代节点
}

function waitPageLoad(mutationsList, observer) {
    let shutdown = false;
    mutationsList.forEach(mutation => {
        if (shutdown) {
            return;
        }
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.matches('.euiDataGridRow')) {
                // 找到目标元素后，停止观察器
                observer.disconnect();
                shutdown = true;
                // 在此处插入你需要在找到该元素后执行的脚本
                console.log('目标已加载 添加按钮');
                addButton();
            }
        });
    });
}

function addButton() {
    // 获取包含动态生成div的父容器（确保这个容器不是动态生成的）
    const parentContainer = document.querySelector('.euiDataGrid__focusWrap'); // 假设整个数据网格是一个固定的父容器
    let logId = 0;

    // 创建一个 MutationObserver 实例
    const observer = new MutationObserver(mutationsList => {
        mutationsList.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE && node.matches('.euiDataGridRowCell__expandActions')) {
                    const newButton = document.createElement('button');
                    newButton.className = 'my_analyze euiButtonIcon euiButtonIcon--primary euiButtonIcon--empty euiButtonIcon--xSmall euiDataGridRowCell__actionButtonIcon';
                    newButton.style.backgroundColor = 'lightgreen';
                    newButton.addEventListener('click', function () {
                        const parentNode = this.parentNode.parentNode;
                        const firstDiv = parentNode.querySelector('div');
                        const firstDl = firstDiv.querySelector('dl');

                        for (let dtElement of firstDl.querySelectorAll('dt')) {
                            if (dtElement.textContent.trim() === 'message') {
                                const ddElement = dtElement.nextElementSibling;
                                const messageJson = JSON.parse(ddElement.innerHTML);
                                console.log(messageJson.data); // 打印dd元素的内容
                                navigator.clipboard.writeText(messageJson.data) // 写入剪切板

                                // 创建新的子div并设置内容
                                const thisLogDivId = `successTipDiv_${++logId}`;
                                const thisLogHeaderId = `successTipHeader_${++logId}`;
                                const thisLogSpanId = `successTipSpan_${++logId}`;
                                const logDiv = document.querySelector('.euiGlobalToastList.css-q9rn2p-euiGlobalToastList-right');
                                const successTipHtml = `<div  id=${thisLogDivId}><div aria-label="通知" data-test-subj="euiToastHeader"  id=${thisLogHeaderId}><span data-test-subj="euiToastHeader__title" id=${thisLogSpanId}>已解析并复制</span></div></div>`
                                logDiv.insertAdjacentHTML('beforeend', successTipHtml);
                                const successTipDiv = document.getElementById(thisLogDivId);
                                const successTipHeader = document.getElementById(thisLogHeaderId);
                                const successTipSpan = document.getElementById(thisLogSpanId);

                                // 5秒后关闭提示框
                                setTimeout(function () {
                                    logDiv.removeChild(successTipDiv)
                                }, 5000);

                                successTipDiv.style.borderRadius = '6px';
                                successTipDiv.style.boxShadow = 'rgba(0, 0, 0, 0.1) 0px 1px 5px, rgba(0, 0, 0, 0.07) 0px 3.6px 13px, rgba(0, 0, 0, 0.06) 0px 8.4px 23px, rgba(0, 0, 0, 0.05) 0px 23px 35px';
                                successTipDiv.style.position = 'relative';
                                successTipDiv.style.paddingInline = '16px';
                                successTipDiv.style.backgroundColor = 'rgb(255, 255, 255)';
                                successTipDiv.style.inlineSize = '100%';
                                successTipDiv.style.borderTop = '2px solid rgb(0, 119, 204)';
                                successTipDiv.style.marginBlockEnd = '16px';
                                successTipDiv.style.animation = '250ms cubic-bezier(0.694, 0.0482, 0.335, 1) 0s 1 normal none running animation-1idg3ww';
                                successTipDiv.style.opacity = '1';

                                successTipHeader.style.paddingInlineEnd = '24px';
                                successTipHeader.style.paddingTop = '16px';
                                successTipHeader.style.paddingBottom = '16px';
                                successTipHeader.style.paddingLeft = '25px';
                                successTipHeader.style.display = 'flex';
                                successTipHeader.style.alignItems = 'baseline';

                                successTipSpan.style.fontSize = '1.1429rem';
                                successTipSpan.style.lineHeight = '1.7143rem';
                                successTipSpan.style.color = 'rgb(26, 28, 33)';
                                successTipSpan.style.fontWeight = '700';
                            }
                        }
                    });

                    node.appendChild(newButton);
                }
            });
        });
    });

    // 开始观察指定的DOM节点及其子树的变化
    observer.observe(parentContainer, observerOptions);
}

// 开始观察指定的DOM节点及其子树的变化
let observer = new MutationObserver(waitPageLoad);
observer.observe(targetNode, observerOptions);