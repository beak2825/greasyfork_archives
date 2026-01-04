// ==UserScript==
// @name         CLTT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动移除一键诊断、PON维护测试页面中所有的 readonly 属性
// @author       Gao
// @match        *://10.53.160.88:28796/nms/soc/sqm/pretreament/main*
// @match        *://10.53.160.88:28796/portal/outSystem/sse*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/519768/CLTT.user.js
// @updateURL https://update.greasyfork.org/scripts/519768/CLTT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 移除 readonly 属性的逻辑
    function removeReadonlyFromDocument(doc) {
        const elements = doc.querySelectorAll(
            'input[readonly], textarea[readonly], select[readonly], ' +  // 匹配所有 readonly 属性的元素
            'input[readonly="true"], input[readonly="false"], ' +  // 匹配 true 或 false 值
            'textarea[readonly="true"], textarea[readonly="false"], ' +
            'select[readonly="true"], select[readonly="false"], ' +
            'input[readonly=""], textarea[readonly=""], select[readonly=""]'  // 匹配空值的 readonly 属性
        );
        console.log(`找到 ${elements.length} 个元素需要移除 readonly 属性`);
        elements.forEach((element) => {
            console.log(`正在移除 readonly 属性:`, element);
            element.removeAttribute('readonly');
        });
    }

    // 处理特定容器内的元素，例如 div#tt 容器
    function removeReadonlyInContainer(container) {
        const elements = container.querySelectorAll(
            'input[readonly], textarea[readonly], select[readonly]'
        );
        elements.forEach((element) => {
            console.log(`正在移除 readonly 属性 (容器内元素):`, element);
            element.removeAttribute('readonly');
        });
    }

    // 查找并移除 iframe 内部的 readonly 属性
    function removeReadonlyInIframe() {
        const iframes = document.querySelectorAll('iframe');  // 查找所有 iframe 元素
        iframes.forEach((iframe) => {
            try {
                const iframeDoc = iframe.contentWindow.document;  // 获取 iframe 内部文档
                removeReadonlyFromDocument(iframeDoc);  // 移除 iframe 内部的 readonly 属性
            } catch (e) {
                console.error('无法访问 iframe 内容', e);
            }
        });
    }

    // 页面加载后立即执行
    setTimeout(() => {
        // 移除主文档中的 readonly 属性
        removeReadonlyFromDocument(document);

        // 处理特定容器内的 readonly 属性（例如 div#tt）
        const container = document.querySelector('#tt');  // 查找 id 为 'tt' 的容器
        if (container) {
            console.log('处理容器内的 readonly 属性');
            removeReadonlyInContainer(container);
        }

        // 移除 iframe 内部的 readonly 属性
        removeReadonlyInIframe();
    }, 1000);  // 延迟 1 秒，确保内容加载完成

    // 监听 DOM 变化，处理动态加载的 iframe 和元素
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // 确保是元素节点
                    if (node.tagName.toLowerCase() === 'iframe') {  // 如果是 iframe
                        console.log('检测到 iframe 元素');
                        setTimeout(() => {
                            removeReadonlyInIframe();  // 移除 iframe 内部的 readonly 属性
                        }, 1000);  // 延迟 1 秒，确保 iframe 加载完成
                    }

                    // 如果是特定容器，移除其内部的 readonly 属性
                    if (node.id === 'tt' || node.classList.contains('easyui-tabs')) {
                        console.log('检测到特定容器，移除其内部 readonly 属性');
                        setTimeout(() => {
                            removeReadonlyInContainer(node);  // 处理该容器内的 readonly 属性
                        }, 1000);
                    }
                }
            });
        });
    });

    // 配置 MutationObserver，监视整个文档
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['readonly'], // 仅监听 readonly 属性变化
    });

    // 定期扫描，避免遗漏
    setInterval(() => {
        // 定期扫描主文档
        removeReadonlyFromDocument(document);

        // 定期扫描 iframe 内部
        removeReadonlyInIframe();

        // 定期扫描特定容器
        const container = document.querySelector('#tt');
        if (container) {
            removeReadonlyInContainer(container);
        }
    }, 2000); // 每 2 秒检查一次
})();
