// ==UserScript==
// @name         ChatGPT Prompt Suggestions
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Show common prompts on the ChatGPT page with resizable and draggable functionality
// @author       而今迈步从头越
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502152/ChatGPT%20Prompt%20Suggestions.user.js
// @updateURL https://update.greasyfork.org/scripts/502152/ChatGPT%20Prompt%20Suggestions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Common prompt suggestions
    const prompts = [
        '解释一下',
        '举个例子',
        '有什么区别',
        '总结一下',
        '详细介绍',
        '如何实现',
        '这个代码的作用是什么',
        '解决这个问题',
        '优化建议',
        '对比这两种方法',
        '最新的研究',
        '趋势和发展',
        '数据来源',
        '推荐资源',
        '如何做',
        '什么是最佳实践',
        '考虑哪些因素',
        '有用的工具和资源',
        '如何处理',
        '建议',
        '如何改善',
        '适合初学者的',
        '学习路线图',
        '常见问题'
    ];

    // Function to create and display the prompt suggestions
    function createPromptSuggestions() {
        // Create a container for the prompts
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.left = '300px'; // Adjust this value to move the box left or right
        container.style.background = 'rgba(255, 255, 255, 0.5)'; // More transparent background
        container.style.border = '1px solid #ccc';
        container.style.padding = '10px';
        container.style.zIndex = '9999';
        container.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
        container.style.width = '300px';
        container.style.maxHeight = '400px';
        container.style.overflowY = 'auto';
        container.style.borderRadius = '5px'; // Optional: rounded corners
        container.style.resize = 'both'; // Allow resizing
        container.style.overflow = 'auto'; // Allow overflow for resizing

        // Add a title
        const title = document.createElement('strong');
        title.textContent = '常用提示词:';
        container.appendChild(title);
        container.appendChild(document.createElement('br'));

        // Add the prompt suggestions
        prompts.forEach(prompt => {
            const item = document.createElement('div');
            item.textContent = prompt;
            item.style.marginBottom = '5px';
            container.appendChild(item);
        });

        // Append the container to the body
        document.body.appendChild(container);

        // Make the container draggable
        container.addEventListener('mousedown', function(e) {
            if (e.target === container || e.target === title) {
                let offsetX = e.clientX - container.getBoundingClientRect().left;
                let offsetY = e.clientY - container.getBoundingClientRect().top;

                function mouseMoveHandler(e) {
                    container.style.left = `${e.clientX - offsetX}px`;
                    container.style.top = `${e.clientY - offsetY}px`;
                }

                function mouseUpHandler() {
                    document.removeEventListener('mousemove', mouseMoveHandler);
                    document.removeEventListener('mouseup', mouseUpHandler);
                }

                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', mouseUpHandler);
            }
        });
    }

    // Run the function after a short delay to ensure the page has loaded
    setTimeout(createPromptSuggestions, 3000); // 3 seconds delay
})();
