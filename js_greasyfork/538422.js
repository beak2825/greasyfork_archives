// ==UserScript==
// @name         东南大学快速评教工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  创建悬浮面板用于快速评教
// @author       You
// @match        http*://pjxt.seu.edu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538422/%E4%B8%9C%E5%8D%97%E5%A4%A7%E5%AD%A6%E5%BF%AB%E9%80%9F%E8%AF%84%E6%95%99%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/538422/%E4%B8%9C%E5%8D%97%E5%A4%A7%E5%AD%A6%E5%BF%AB%E9%80%9F%E8%AF%84%E6%95%99%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 你的ping函数
    function ping(point=10, comment='好') {
        // 确保只点击页面上原有的元素，不包括我们创建的悬浮面板中的元素
        document.querySelectorAll(`[data-x-fz="${point}"]:not(#quickEvalPanel *)`).forEach(a => a.click());
        document.querySelector('textarea:not(#quickEvalPanel textarea)').value = comment;
        document.querySelector('.bh-btn-success:not(#quickEvalPanel .bh-btn-success)').click();
        document.querySelector('.bh-dialog-btn:not(#quickEvalPanel .bh-dialog-btn)').click();
    }

    // 创建悬浮面板
    function createQuickEvalPanel() {
        // 创建面板容器
        const panel = document.createElement('div');
        panel.id = 'quickEvalPanel';
        panel.style.position = 'fixed';
        panel.style.bottom = '20px';
        panel.style.right = '20px';
        panel.style.zIndex = '9999';
        panel.style.backgroundColor = '#fff';
        panel.style.border = '1px solid #ddd';
        panel.style.borderRadius = '5px';
        panel.style.padding = '15px';
        panel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        panel.style.width = '250px';
        panel.style.height = 'fit-content';

        // 创建标题
        const title = document.createElement('h3');
        title.textContent = '快速评教';
        title.style.marginTop = '0';
        title.style.marginBottom = '15px';
        title.style.fontSize = '16px';
        title.style.color = '#333';
        panel.appendChild(title);

        // 创建分数选择
        const scoreLabel = document.createElement('label');
        scoreLabel.textContent = '评分: ';
        scoreLabel.style.marginRight = '10px';
        panel.appendChild(scoreLabel);

        const scoreSelect = document.createElement('select');
        scoreSelect.id = 'evalScore';
        scoreSelect.style.marginBottom = '10px';
        scoreSelect.style.padding = '5px';
        scoreSelect.style.borderRadius = '3px';
        scoreSelect.style.border = '1px solid #ccc';

        // 添加分数选项（1-10分）
        for (let i = 1; i <= 10; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i + '分';
            if (i === 10) option.selected = true; // 默认10分
            scoreSelect.appendChild(option);
        }
        panel.appendChild(scoreSelect);

        // 创建评语输入
        const commentLabel = document.createElement('label');
        commentLabel.textContent = '评语: ';
        commentLabel.style.display = 'block';
        commentLabel.style.marginBottom = '5px';
        panel.appendChild(commentLabel);

        const commentInput = document.createElement('textarea');
        commentInput.id = 'evalComment';
        commentInput.value = '好';
        commentInput.style.width = '100%';
        commentInput.style.height = '60px';
        commentInput.style.marginBottom = '10px';
        commentInput.style.padding = '5px';
        commentInput.style.borderRadius = '3px';
        commentInput.style.border = '1px solid #ccc';
        commentInput.style.resize = 'vertical';
        panel.appendChild(commentInput);

        // 创建提交按钮
        const submitBtn = document.createElement('button');
        submitBtn.textContent = '提交评教';
        submitBtn.style.backgroundColor = '#4CAF50';
        submitBtn.style.color = 'white';
        submitBtn.style.border = 'none';
        submitBtn.style.padding = '8px 15px';
        submitBtn.style.borderRadius = '3px';
        submitBtn.style.cursor = 'pointer';
        submitBtn.style.width = '100%';

        submitBtn.addEventListener('click', function() {
            const score = document.getElementById('evalScore').value;
            const comment = document.getElementById('evalComment').value;
            ping(parseInt(score), comment);
        });

        panel.appendChild(submitBtn);

        // 添加到页面
        document.body.appendChild(panel);

        // 使面板可拖动
        makeDraggable(panel, title);
    }

    // 使元素可拖动
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    createQuickEvalPanel();
})();