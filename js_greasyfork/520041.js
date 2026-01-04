// ==UserScript==
// @name         PTA题目导出助手
// @namespace    https://github.com/Free-LZJ/free-scripts
// @version      1.3.1
// @description  导出PTA中的题目到doc文档中,注意是你已经答题过的,会把答题过的选项高亮,可以导入到微信刷题小程序(比如佛脚刷题)
// @author       贱贱
// @match        https://pintia.cn/problem-sets/*/exam/problems/*
// @grant        none
// @license		 MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdn.jsdelivr.net/npm/html-docx-js@0.3.1/dist/html-docx.min.js
// @downloadURL https://update.greasyfork.org/scripts/520041/PTA%E9%A2%98%E7%9B%AE%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/520041/PTA%E9%A2%98%E7%9B%AE%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 导出按钮
        const exportButton = document.createElement('button');
        exportButton.innerText = '导出'
        Object.assign(exportButton.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            background: '#0c9',
            color: '#fff',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
        });
        document.body.appendChild(exportButton);
        // 导出逻辑
        exportButton.addEventListener('click', function() {
            // 获取节点内容
            //document.querySelector("#exam-app > div.grid.grid-cols-\\[4rem\\,minmax\\(0\\,1fr\\)\\].grid-rows-\\[auto\\,minmax\\(0\\,1fr\\)\\].h-screen > div.row-start-2.row-end-3.col-start-2.col-end-3.scroll > div > div.mn_Fd8vu.transition-all > div > div.flex.flex-col.m-4.mb-0.flex-1")
            let box = document.querySelector('#exam-app .flex.flex-col.m-4.mb-0.flex-1');
            // 最后一个子节点没用,删掉
            box.removeChild(box.lastChild);

            for (let item of box.children) {

                if (item.children.length === 0) continue

                // 删除题尾 和横线
                item.lastChild.remove()
                if (item.children.length === 3)
                    item.lastChild.remove()

                // 删除题头
                let header = item.firstChild
                let index = header.querySelector('.pc-text-raw.text-xs.ellipsis')?.innerText
                header?.remove()

                // 提干
                let title = item.querySelector("p");
                title.innerText ? title.innerText = index + ' ' + title?.innerText: ''

                // 获取所有包含选项的 label 元素
                const labels = item.querySelectorAll('label');

                // 遍历每个选项，替换为 <p> 元素
                labels.forEach(label => {
                    // 获取选项的字母 (A, B, C, D)
                    const optionLetter = label.querySelector('span').textContent;
                    // 获取每个选项的文本内容
                    const optionText = label.querySelector('div .rendered-markdown')?.textContent;

                    // 创建新的 <p> 元素
                    const newParagraph = document.createElement('p');
                    newParagraph.textContent = optionLetter + optionText;

                    // 检查该选项是否被选中
                    const radioInput = label.querySelector('input[type="radio"], input[type="checkbox"]');
                    if (radioInput && radioInput.checked) {
                        // 设置选中的选项文字为红色
                        newParagraph.style.color = 'red';
                        // 将答案拼接到题目末尾
                        title.innerText += (' ' + optionLetter.replace('.', ''))
                    }

                    // 将新创建的 <p> 元素插入到 label 的父元素中
                    label.parentElement.appendChild(newParagraph);

                    // 删除原来的 label 元素
                    label.remove();
                });


            }

            // 使用html-docx-js将HTML内容转换为DOCX Blob
            let converted = htmlDocx.asBlob(box.innerHTML);

            // 使用FileSaver.js保存文件
            saveAs(converted, document.title + '.doc');
        });
        
        // 解锁按钮
        const unlockButton = document.createElement('button');
        unlockButton.innerText = '解锁\n选项'
        Object.assign(unlockButton.style, {
            position: 'fixed',
            bottom: '100px',
            right: '20px',
            zIndex: 1000,
            background: '#ffacd6',
            color: '#fff',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
        });
        document.body.appendChild(unlockButton);
        unlockButton.addEventListener('click', function() {
            // 获取页面中所有的 <input> 元素
            const inputs = document.querySelectorAll('input');
            // 遍历解锁
            inputs.forEach(input => {
                input.disabled = false;
            });
        })
    });
})();
