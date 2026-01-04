// ==UserScript==
// @name         网页备忘录
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Show customizable prompt suggestions on specific webpages, with resizable and draggable functionality
// @author       而今迈步从头越
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502418/%E7%BD%91%E9%A1%B5%E5%A4%87%E5%BF%98%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/502418/%E7%BD%91%E9%A1%B5%E5%A4%87%E5%BF%98%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultPrompts = [
        '按不同的域名存储内容',
        '可以在不同的网站上显示不同的内容',
    ];

    const domain = window.location.hostname;
    const whitelist = ['google.com', 'chatgpt.com'];

    // Function to check if the current domain is in the whitelist
    function isWhitelisted() {
        return whitelist.some(allowedDomain => domain.includes(allowedDomain));
    }

    // Function to get prompts from local storage or use default prompts
    function getPrompts() {
        const savedPrompts = localStorage.getItem(`prompts_${domain}`);
        return savedPrompts ? JSON.parse(savedPrompts) : defaultPrompts;
    }

    // Function to save prompts to local storage
    function savePrompts(prompts) {
        localStorage.setItem(`prompts_${domain}`, JSON.stringify(prompts));
    }

    // Function to create and display the prompt suggestions
    function createPromptSuggestions() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.left = '10px';
        container.style.background = 'rgba(255, 255, 255, 0.9)';
        container.style.border = '1px solid #ccc';
        container.style.padding = '10px';
        container.style.zIndex = '9999';
        container.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
        container.style.borderRadius = '5px';
        container.style.resize = 'both';
        container.style.overflow = 'auto';
        container.style.transition = 'width 0.3s, height 0.3s';
        container.style.minWidth = '50px';
        container.style.minHeight = '50px';

        const title = document.createElement('strong');
        title.textContent = '常用提示词:';
        container.appendChild(title);
        container.appendChild(document.createElement('br'));

        const prompts = getPrompts();
        prompts.forEach(prompt => {
            const item = document.createElement('div');
            item.textContent = prompt;
            item.style.marginBottom = '5px';
            container.appendChild(item);
        });

        document.body.appendChild(container);

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

        const toggleButton = document.createElement('button');
        toggleButton.textContent = '收起';
        toggleButton.style.position = 'absolute';
        toggleButton.style.top = '10px';
        toggleButton.style.right = '10px';
        toggleButton.style.zIndex = '10000';
        toggleButton.style.background = '#007BFF';
        toggleButton.style.color = 'white';
        toggleButton.style.border = 'none';
        toggleButton.style.padding = '5px';
        toggleButton.style.borderRadius = '3px';
        toggleButton.style.cursor = 'pointer';
        container.appendChild(toggleButton);

        let isExpanded = true;

        toggleButton.addEventListener('click', function() {
            isExpanded = !isExpanded;
            if (isExpanded) {
                container.style.width = 'auto';
                container.style.height = 'auto';
                const rect = container.getBoundingClientRect();
                container.style.width = `${rect.width}px`;
                container.style.height = `${rect.height}px`;
                toggleButton.textContent = '收起';
                title.style.display = 'block';
                container.querySelectorAll('div').forEach(item => item.style.display = 'block');
                editButton.style.display = 'block';
            } else {
                container.style.width = '50px';
                container.style.height = '50px';
                toggleButton.textContent = '展开';
                title.style.display = 'none';
                container.querySelectorAll('div').forEach(item => item.style.display = 'none');
                editButton.style.display = 'none';
            }
        });

        const editButton = document.createElement('button');
        editButton.textContent = '编辑';
        editButton.style.marginTop = '10px';
        container.appendChild(editButton);

        editButton.addEventListener('click', function() {
            const newPrompts = prompt('编辑提示词，用逗号分隔:', prompts.join(','));
            if (newPrompts !== null) {
                const updatedPrompts = newPrompts.split(',').map(p => p.trim());
                savePrompts(updatedPrompts);
                container.innerHTML = '';
                container.appendChild(title);
                container.appendChild(document.createElement('br'));
                updatedPrompts.forEach(prompt => {
                    const item = document.createElement('div');
                    item.textContent = prompt;
                    item.style.marginBottom = '5px';
                    container.appendChild(item);
                });
                container.appendChild(editButton);
                container.appendChild(toggleButton);
                adjustContainerSize();
            }
        });

        function adjustContainerSize() {
            container.style.width = 'auto';
            container.style.height = 'auto';
            const rect = container.getBoundingClientRect();
            container.style.width = `${rect.width}px`;
            container.style.height = `${rect.height}px`;
        }

        // Add resize observer to adjust container size based on content
        const resizeObserver = new ResizeObserver(adjustContainerSize);
        resizeObserver.observe(container);

        adjustContainerSize();
    }

    if (isWhitelisted()) {
        setTimeout(createPromptSuggestions, 3000); // 3 seconds delay
    }
})();
