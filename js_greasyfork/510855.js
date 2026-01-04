// ==UserScript==
// @name         B站动态页面根据关键词屏蔽
// @namespace    http://tampermonkey.net/
// @version      beta
// @description  自动在动态页面，删去不想看到的动态，包括屏蔽特定UP主和反选屏蔽规则
// @author       ChatGPT 和 伊吹dv子
// @match        https://t.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510855/B%E7%AB%99%E5%8A%A8%E6%80%81%E9%A1%B5%E9%9D%A2%E6%A0%B9%E6%8D%AE%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/510855/B%E7%AB%99%E5%8A%A8%E6%80%81%E9%A1%B5%E9%9D%A2%E6%A0%B9%E6%8D%AE%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

//我的B站：https://space.bilibili.com/500400048

//代码全是一个一个功能通过ChatGPT写的，我一点都不会懂JavaScript，感谢GPT~
//如果有会做油猴脚本的大佬，能继续完善这个脚本的功能的话，那真是太好了


(function() {
    'use strict';

    let keywords = JSON.parse(localStorage.getItem('biliKeywords')) || [];
    let upBlockList = JSON.parse(localStorage.getItem('biliUpBlockList')) || [];
    let upInverseBlockList = JSON.parse(localStorage.getItem('biliUpInverseBlockList')) || [];

    function saveKeywords() {
        localStorage.setItem('biliKeywords', JSON.stringify(keywords));
    }

    function saveUpBlockList() {
        localStorage.setItem('biliUpBlockList', JSON.stringify(upBlockList));
    }

    function saveUpInverseBlockList() {
        localStorage.setItem('biliUpInverseBlockList', JSON.stringify(upInverseBlockList));
    }

    function createKeywordManager() {
        const managerDiv = document.createElement('div');
        managerDiv.style.position = 'fixed';
        managerDiv.style.bottom = '10px';
        managerDiv.style.right = '10px';
        managerDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        managerDiv.style.padding = '10px';
        managerDiv.style.border = '1px solid #ccc';
        managerDiv.style.zIndex = '9999';
        managerDiv.style.width = '300px';
        managerDiv.style.display = 'none';
        managerDiv.id = 'keywordManager';
         managerDiv.style.borderRadius = '20px'; // 设置圆角

        const closeButton = document.createElement('button');
        closeButton.innerText = '关闭管理';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '-40px';
        closeButton.style.right = '0px';
        closeButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.padding = '10px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.backgroundColor = '#f77399'; // 设置按钮背景色f77399
        closeButton.style.borderRadius = '20px'; // 设置圆角
        managerDiv.appendChild(closeButton);

        const title = document.createElement('h4');
        title.innerText = '屏蔽关键词管理';
        title.style.margin = '0 0 10px 0';
        managerDiv.appendChild(title);

        const keywordSection = document.createElement('div');
        managerDiv.appendChild(keywordSection);

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '输入关键词';
        input.style.width = '100%';
        input.style.marginBottom = '10px';
        keywordSection.appendChild(input);

        const addButton = document.createElement('button');
        addButton.innerText = '添加关键词';
        addButton.style.backgroundColor = '#f77399'; // 设置按钮背景色f77399
        addButton.style.color = 'white'; // 设置按钮文字颜色
        addButton.style.border = 'none'; // 去掉边框
        addButton.style.width = '100%';
        addButton.style.marginBottom = '10px';
        addButton.style.cursor = 'pointer';
        keywordSection.appendChild(addButton);

        const keywordList = document.createElement('ul');
        keywordSection.appendChild(keywordList);

        const upBlockSection = document.createElement('div');
        upBlockSection.style.marginTop = '20px';
        const upTitle = document.createElement('h4');
        upTitle.innerText = '特定UP主屏蔽';
        upBlockSection.appendChild(upTitle);

        const upNameInput = document.createElement('input');
        upNameInput.type = 'text';
        upNameInput.placeholder = '输入UP主名字';
        upNameInput.style.width = '100%';
        upNameInput.style.marginBottom = '10px';
        upBlockSection.appendChild(upNameInput);

        const upKeywordInput = document.createElement('input');
        upKeywordInput.type = 'text';
        upKeywordInput.placeholder = '输入关键词';
        upKeywordInput.style.width = '100%';
        upKeywordInput.style.marginBottom = '10px';
        upBlockSection.appendChild(upKeywordInput);

        const addUpBlockButton = document.createElement('button');
        addUpBlockButton.innerText = '添加屏蔽规则';
        addUpBlockButton.style.backgroundColor = '#f77399'; // 设置按钮背景色f77399
        addUpBlockButton.style.color = 'white'; // 设置按钮文字颜色
        addUpBlockButton.style.border = 'none'; // 去掉边框
        addUpBlockButton.style.width = '100%';
        addUpBlockButton.style.cursor = 'pointer';
        upBlockSection.appendChild(addUpBlockButton);

        const upBlockListDisplay = document.createElement('ul');
        upBlockSection.appendChild(upBlockListDisplay);

        const upInverseBlockSection = document.createElement('div');
        upInverseBlockSection.style.marginTop = '20px';
        const upInverseTitle = document.createElement('h4');
        upInverseTitle.innerText = '特定UP主反选屏蔽';
        upInverseBlockSection.appendChild(upInverseTitle);

        const upInverseNameInput = document.createElement('input');
        upInverseNameInput.type = 'text';
        upInverseNameInput.placeholder = '输入UP主名字';
        upInverseNameInput.style.width = '100%';
        upInverseNameInput.style.marginBottom = '10px';
        upInverseBlockSection.appendChild(upInverseNameInput);

        const upInverseKeywordInput = document.createElement('input');
        upInverseKeywordInput.type = 'text';
        upInverseKeywordInput.placeholder = '输入反选关键词';
        upInverseKeywordInput.style.width = '100%';
        upInverseKeywordInput.style.marginBottom = '10px';
        upInverseBlockSection.appendChild(upInverseKeywordInput);

        const addUpInverseBlockButton = document.createElement('button');
        addUpInverseBlockButton.innerText = '添加反选屏蔽规则';
        addUpInverseBlockButton.style.width = '100%';
        addUpInverseBlockButton.style.cursor = 'pointer';
        addUpInverseBlockButton.style.backgroundColor = '#f77399'; // 设置按钮背景色f77399
        addUpInverseBlockButton.style.color = 'white'; // 设置按钮文字颜色
        addUpInverseBlockButton.style.border = 'none'; // 去掉边框
        upInverseBlockSection.appendChild(addUpInverseBlockButton);



        const upInverseBlockListDisplay = document.createElement('ul');
        upInverseBlockSection.appendChild(upInverseBlockListDisplay);

        managerDiv.appendChild(upBlockSection);
        managerDiv.appendChild(upInverseBlockSection);
        document.body.appendChild(managerDiv);

        closeButton.addEventListener('click', () => {
            managerDiv.style.display = 'none';
            openButton.style.display = 'block';
        });

        addButton.addEventListener('click', addKeyword);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addKeyword();
            }
        });

        function addKeyword() {
            const keyword = input.value.trim();
            if (keyword && !keywords.includes(keyword)) {
                keywords.push(keyword);
                saveKeywords();
                renderKeywordList();
                input.value = '';
                hidePostsWithKeyword();
            }
        }

        function renderKeywordList() {
            keywordList.innerHTML = '';
            keywords.forEach((keyword, index) => {
                const listItem = document.createElement('li');
                listItem.innerText = keyword;

                const deleteButton = document.createElement('button');
                deleteButton.innerText = '删除';
                deleteButton.style.marginLeft = '10px';
                deleteButton.style.cursor = 'pointer';

                deleteButton.addEventListener('click', () => {
                    keywords.splice(index, 1);
                    saveKeywords();
                    renderKeywordList();
                    hidePostsWithKeyword();
                });

                listItem.appendChild(deleteButton);
                keywordList.appendChild(listItem);
            });
        }

        addUpBlockButton.addEventListener('click', addUpBlock);
        function addUpBlock() {
            const upName = upNameInput.value.trim();
            const upKeyword = upKeywordInput.value.trim();
            if (upName && upKeyword && !upBlockList.some(block => block.upName === upName && block.keyword === upKeyword)) {
                upBlockList.push({ upName, keyword: upKeyword });
                saveUpBlockList();
                renderUpBlockList();
                upNameInput.value = '';
                upKeywordInput.value = '';
                hidePostsWithSpecificBlock();
            }
        }

        function renderUpBlockList() {
            upBlockListDisplay.innerHTML = '';
            upBlockList.forEach((block, index) => {
                const listItem = document.createElement('li');
                listItem.innerText = `UP主: ${block.upName}，关键词: ${block.keyword}`;

                const deleteButton = document.createElement('button');
                deleteButton.innerText = '删除';
                deleteButton.style.marginLeft = '10px';
                deleteButton.style.cursor = 'pointer';

                deleteButton.addEventListener('click', () => {
                    upBlockList.splice(index, 1);
                    saveUpBlockList();
                    renderUpBlockList();
                    hidePostsWithSpecificBlock();
                });

                listItem.appendChild(deleteButton);
                upBlockListDisplay.appendChild(listItem);
            });
        }

        addUpInverseBlockButton.addEventListener('click', addUpInverseBlock);
        function addUpInverseBlock() {
            const upName = upInverseNameInput.value.trim();
            const upInverseKeyword = upInverseKeywordInput.value.trim();
            if (upName && upInverseKeyword && !upInverseBlockList.some(block => block.upName === upName && block.keyword === upInverseKeyword)) {
                upInverseBlockList.push({ upName, keyword: upInverseKeyword });
                saveUpInverseBlockList();
                renderUpInverseBlockList();
                upInverseNameInput.value = '';
                upInverseKeywordInput.value = '';
                hidePostsWithInverseBlock();
            }
        }

        function renderUpInverseBlockList() {
            upInverseBlockListDisplay.innerHTML = '';
            upInverseBlockList.forEach((block, index) => {
                const listItem = document.createElement('li');
                listItem.innerText = `UP主: ${block.upName}，反选关键词: ${block.keyword}`;

                const deleteButton = document.createElement('button');
                deleteButton.innerText = '删除';
                deleteButton.style.marginLeft = '10px';
                deleteButton.style.cursor = 'pointer';

                deleteButton.addEventListener('click', () => {
                    upInverseBlockList.splice(index, 1);
                    saveUpInverseBlockList();
                    renderUpInverseBlockList();
                    hidePostsWithInverseBlock();
                });

                listItem.appendChild(deleteButton);
                upInverseBlockListDisplay.appendChild(listItem);
            });
        }

        renderKeywordList();
        renderUpBlockList();
        renderUpInverseBlockList();
    }

    function hidePostsWithKeyword() {
        const posts = document.querySelectorAll('.bili-dyn-item');
        posts.forEach(post => {
            const textContent = post.innerText || post.textContent;
            if (keywords.some(keyword => textContent.includes(keyword))) {
                hidePostWithButton(post);
            }
        });
    }

    function hidePostsWithSpecificBlock() {
        const posts = document.querySelectorAll('.bili-dyn-item');
        posts.forEach(post => {
            const upNameElement = post.querySelector('.bili-dyn-title__text');
            const textContent = post.innerText || post.textContent;
            if (upNameElement) {
                const upName = upNameElement.innerText.trim();
                upBlockList.forEach(block => {
                    if (upName === block.upName && textContent.includes(block.keyword)) {
                        hidePostWithButton(post);
                    }
                });
            }
        });
    }

    function hidePostsWithInverseBlock() {
        const posts = document.querySelectorAll('.bili-dyn-item');
        posts.forEach(post => {
            const upNameElement = post.querySelector('.bili-dyn-title__text');
            const textContent = post.innerText || post.textContent;
            if (upNameElement) {
                const upName = upNameElement.innerText.trim();
                upInverseBlockList.forEach(block => {
                    if (upName === block.upName && !textContent.includes(block.keyword)) {
                        hidePostWithButton(post);
                    }
                });
            }
        });
    }

    function hidePostWithButton(post) {
        if (post.style.display !== 'none') {
            post.style.display = 'none';

            const revealButton = document.createElement('button');
            revealButton.innerText = '显示被隐藏的内容';
            revealButton.classList.add('reveal-btn');
            revealButton.style.margin = '10px auto';
            revealButton.style.cursor = 'pointer';
            revealButton.style.display = 'block';
            revealButton.style.fontSize = '14px';
            revealButton.style.borderRadius = '15px'; // 增加圆角值，设置为20px以实现更圆滑的效果
             revealButton.style.backgroundColor = '#f77399';
            revealButton.style.border = 'none'; // 去掉边框
            revealButton.style.color = 'white'; // 设置按钮文字颜色


            revealButton.addEventListener('click', () => {
                post.style.display = '';
                revealButton.remove();
            });

            post.parentElement.insertBefore(revealButton, post);
        }
    }

    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                hidePostsWithKeyword();
                hidePostsWithSpecificBlock();
                hidePostsWithInverseBlock();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const openButton = document.createElement('button');
    openButton.innerText = '屏蔽词管理面板';
    openButton.style.position = 'fixed';
    openButton.style.bottom = '10px';
    openButton.style.right = '10px';
    openButton.style.backgroundColor = '#f77399';
    openButton.style.color = '#fff';
    openButton.style.border = 'none';
    openButton.style.padding = '10px';
    openButton.style.cursor = 'pointer';
    openButton.style.zIndex = '9999';
    openButton.style.borderRadius = '20px'; // 增加圆角值，设置为20px以实现更圆滑的效果

    openButton.addEventListener('click', () => {
        document.getElementById('keywordManager').style.display = 'block';
        openButton.style.display = 'none';
    });

    document.body.appendChild(openButton);
    createKeywordManager();
    hidePostsWithKeyword();
    hidePostsWithSpecificBlock();
    hidePostsWithInverseBlock();
})();
