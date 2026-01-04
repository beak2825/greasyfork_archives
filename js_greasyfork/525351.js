// ==UserScript==
// @name         Sophia获取全部题目
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在https://app.sophia.org/页面正中间添加获取全部答案按钮，点击后删除所有<div class="assessment-two-cols__right">元素和全部图片，获取当前页面及后续页面所有题目信息，弹出窗口显示所有页面的题目信息，提取所有<div class="question-body">元素文本并过滤换行符。通过点击<a class="right-arrow">元素跳转到下一页，直到达到用户输入的页数为止，弹窗顶部有居中红底的关闭、复制全部题目和去第一页按钮。
// @author       3588
// @match        https://app.sophia.org/spcc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525351/Sophia%E8%8E%B7%E5%8F%96%E5%85%A8%E9%83%A8%E9%A2%98%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/525351/Sophia%E8%8E%B7%E5%8F%96%E5%85%A8%E9%83%A8%E9%A2%98%E7%9B%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 检查是否存在指定元素
    const timerDiv = document.querySelector('div.flexible-assessment-header__submit-timer-minutes');
    if (!timerDiv) {
        return; // 如果不存在指定元素，脚本直接返回，不显示按钮
    }

    // 查找所有 class 为 flexible-assessment-header__number-milestone 的元素
    const milestoneElements = document.querySelectorAll('.flexible-assessment-header__number-milestone');
    const totalQuestions = milestoneElements.length;

    // 创建输入框
    const pageCountInput = document.createElement('input');
    pageCountInput.type = 'number';
    pageCountInput.placeholder = '请输入总页数';
    pageCountInput.style.position = 'fixed';
    pageCountInput.style.top = '50%';
    pageCountInput.style.left = '50%';
    pageCountInput.style.transform = 'translate(-50%, -100%)';
    pageCountInput.style.padding = '5px';
    pageCountInput.style.border = '2px solid #333';
    pageCountInput.style.borderRadius = '5px';
    pageCountInput.style.zIndex = '9999';
    // 设置输入框宽度为 50px
    pageCountInput.style.width = '50px';
    // 将题目数量作为默认值填入输入框
    pageCountInput.value = totalQuestions;
    document.body.appendChild(pageCountInput);

    // 创建获取全部答案按钮
    const getAnswersButton = document.createElement('button');
    getAnswersButton.textContent = '获取全部题目';
    getAnswersButton.style.position = 'fixed';
    getAnswersButton.style.top = '50%';
    getAnswersButton.style.left = '50%';
    getAnswersButton.style.transform = 'translate(-50%, 0)';
    getAnswersButton.style.backgroundColor = 'yellow';
    getAnswersButton.style.border = '2px solid #333';
    getAnswersButton.style.borderRadius = '5px';
    getAnswersButton.style.padding = '10px 20px';
    getAnswersButton.style.zIndex = '9999';
    document.body.appendChild(getAnswersButton);

    getAnswersButton.addEventListener('click', function () {
        // 获取用户输入的总页数
        const totalPages = parseInt(pageCountInput.value, 10);
        if (isNaN(totalPages) || totalPages <= 0) {
            alert('请输入有效的正整数页数。');
            return;
        }

        // 删除所有<div class="assessment-two-cols__right">元素
        const elementsToRemove = document.querySelectorAll('div.assessment-two-cols__right');
        elementsToRemove.forEach((element) => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });

        // 删除全部图片
        const images = document.querySelectorAll('img');
        images.forEach((img) => {
            if (img.parentNode) {
                img.parentNode.removeChild(img);
            }
        });

        // 查找所有<div class="question-body">元素
        const questionBodies = document.querySelectorAll('div.question-body');
        let allQuestions = '';
        let currentPageQuestions = '';
        questionBodies.forEach((body) => {
            currentPageQuestions += body.textContent;
        });
        currentPageQuestions = currentPageQuestions.replace(/[\r\n]/g, '');
        allQuestions += `第1题: ${currentPageQuestions}\n`;

        // 创建弹窗显示保存的题目信息
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'white';
        popup.style.padding = '20px';
        popup.style.border = '1px solid #ccc';
        popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
        popup.style.zIndex = '9999';
        popup.style.maxWidth = '80%';
        popup.style.maxHeight = '80%';
        popup.style.overflow = 'auto';

        const title = document.createElement('h2');
        title.textContent = `一共 ${totalPages} 题，获取全部题目信息`;
        popup.appendChild(title);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.marginBottom = '10px';

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.backgroundColor = 'red';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.padding = '5px 10px';
        closeButton.style.marginRight = '10px';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(popup);
        });
        buttonContainer.appendChild(closeButton);

        const copyButton = document.createElement('button');
        copyButton.textContent = '复制全部题目';
        copyButton.style.backgroundColor = 'red';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.padding = '5px 10px';
        copyButton.addEventListener('click', () => {
            const textarea = document.createElement('textarea');
            textarea.value = allQuestions;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('全部题目已复制到剪贴板！');
        });
        buttonContainer.appendChild(copyButton);

        const goToFirstPageButton = document.createElement('button');
        goToFirstPageButton.textContent = '去第一页';
        goToFirstPageButton.style.backgroundColor = 'red';
        goToFirstPageButton.style.color = 'white';
        goToFirstPageButton.style.border = 'none';
        goToFirstPageButton.style.padding = '5px 10px';
        goToFirstPageButton.style.marginLeft = '10px';
        goToFirstPageButton.addEventListener('click', () => {
            // 使用 querySelector 选择符合条件的元素并点击
            const firstPageLink = document.querySelector('a[aria-label="Milestone Question Number 1"]');
            if (firstPageLink) {
                firstPageLink.click();
            }
        });
        buttonContainer.appendChild(goToFirstPageButton);

        popup.appendChild(buttonContainer);

        const firstPageQuestionText = document.createElement('p');
        firstPageQuestionText.textContent = `第1题: ${currentPageQuestions}`;
        popup.appendChild(firstPageQuestionText);

        document.body.appendChild(popup);

        let currentPage = 2;

        // 点击下一页按钮直到达到用户输入的页数
        const clickNextPage = () => {
            if (currentPage > totalPages) {
                return;
            }

            const nextPageButton = document.querySelector('a.right-arrow');
            if (nextPageButton) {
                nextPageButton.click();
                // 等待 2 秒让页面加载完成
                setTimeout(() => {
                    // 删除下一页的全部图片
                    const nextPageImages = document.querySelectorAll('img');
                    nextPageImages.forEach((img) => {
                        if (img.parentNode) {
                            img.parentNode.removeChild(img);
                        }
                    });

                    const nextPageQuestionBodies = document.querySelectorAll('div.question-body');
                    let nextPageQuestions = '';
                    nextPageQuestionBodies.forEach((body) => {
                        nextPageQuestions += body.textContent;
                    });
                    nextPageQuestions = nextPageQuestions.replace(/[\r\n]/g, '');

                    allQuestions += `第${currentPage}题: ${nextPageQuestions}\n`;

                    // 更新弹窗显示下一页题目
                    const nextPageInfo = document.createElement('p');
                    nextPageInfo.textContent = `第${currentPage}题: ${nextPageQuestions}`;
                    popup.appendChild(nextPageInfo);

                    currentPage++;
                    // 继续点击下一页
                    clickNextPage();
                }, 2000);
            }
        };

        // 开始点击下一页
        clickNextPage();
    });
})();