// ==UserScript==
// @name         技术中台_tool
// @namespace    技术中台_tool
// @version      2024-09-12
// @description  web-tool for tec.hisense.com
// @author       WU
// @match        https://tec.hisense.com/tecFlowCenter/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hisense.com
// @grant        none
// @license      selfuse
// @downloadURL https://update.greasyfork.org/scripts/531402/%E6%8A%80%E6%9C%AF%E4%B8%AD%E5%8F%B0_tool.user.js
// @updateURL https://update.greasyfork.org/scripts/531402/%E6%8A%80%E6%9C%AF%E4%B8%AD%E5%8F%B0_tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取元素的可复制文本内容
    function getCopyText(element) {
        return element.innerText || element.textContent;
    }

    // 检查元素是否位于表头行中
    function isHeaderElement(element) {
        while (element) {
            if (element.tagName === 'THEAD' || element.classList.contains('ant-table-thead')) {
                return true;
            }
            element = element.parentElement;
        }
        return false;
    }

    // 检查元素是否位于数据行中
    function isInDataRows(element) {
        while (element) {
            if (element.tagName === 'TBODY' || element.classList.contains('ant-table-tbody')) {
                return true;
            }
            element = element.parentElement;
        }
        return false;
    }

    // 创建一个提示元素
    function createCopyAlert(text) {
        var copyAlert = document.createElement('div');
        copyAlert.style.cssText = 'position:fixed;top:0;left:50%;transform:translateX(-50%);background-color:rgb(0, 207, 226);color:white;padding:10px;z-index:1000;';
        copyAlert.textContent = '内容已复制: ' + text;
        document.body.appendChild(copyAlert);

        // 设置3秒后淡出提示
        setTimeout(function() {
            copyAlert.style.opacity = '0';
            setTimeout(function() { document.body.removeChild(copyAlert); }, 1000);
        }, 3000);
    }

    // 监听页面上的点击事件
	function handleClick(event) {
		// 检查用户是否已经选择了一些文本
		var selection = window.getSelection().toString();
		if (selection === '') {
			// 用户没有选择任何文本，所以我们可以自动复制元素的内容
			let target = event.target.closest('.ant-form-item-control, .ant-form-item-children');
			if (target && isInDataRows(target) && !isHeaderElement(target)) {
				var text = getCopyText(target); // 获取元素的文本内容
				if (text !== '') {
					// 创建一个textarea元素用于复制内容
					var textArea = document.createElement('textarea');
					textArea.value = text; // 将元素的内容赋值给textarea
					document.body.appendChild(textArea);
					textArea.select(); // 选择textarea中的内容
					document.execCommand('copy'); // 执行复制操作
					document.body.removeChild(textArea); // 移除用于复制的textarea元素
					createCopyAlert(text); // 显示复制成功的提示
				}
			}
		}
	}

    // 监听DOM的变化
    const observer = new MutationObserver(mutationsList => {
        mutationsList.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    node.addEventListener('click', handleClick);
                }
            });
        });
    });

    // 配置观察选项
    const config = { childList: true, subtree: true };

    // 开始观察指定的DOM元素
    observer.observe(document.body, config);

    // 直接绑定点击事件处理程序到现有的元素
    document.querySelectorAll('.ant-form-item-control, .ant-form-item-children').forEach(element => {
        element.addEventListener('click', handleClick);
    });

    // 清理函数，当脚本不再需要时调用
    const cleanup = () => {
        observer.disconnect();
        document.querySelectorAll('.ant-form-item-control, .ant-form-item-children').forEach(element => {
            element.removeEventListener('click', handleClick);
        });
    };

    // 在脚本退出时清理监听器
    window.addEventListener('beforeunload', cleanup);

})();