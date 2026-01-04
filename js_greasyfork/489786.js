// ==UserScript==
// @name         Jenkins多分支流水线优化展示
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  检查并打印多分支流水线的URL
// @author       lmj
// @match        http://*/view/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489786/Jenkins%E5%A4%9A%E5%88%86%E6%94%AF%E6%B5%81%E6%B0%B4%E7%BA%BF%E4%BC%98%E5%8C%96%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/489786/Jenkins%E5%A4%9A%E5%88%86%E6%94%AF%E6%B5%81%E6%B0%B4%E7%BA%BF%E4%BC%98%E5%8C%96%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

     function bulidProject(img) {
         new Ajax.Request(img.parentNode.href);
         return false;
     }
    // 定义样式
    const style = document.createElement('style');
    style.textContent = `
        .light-green-background {
            background-color: lightgreen !important;
        }
    `;
   // 保存原有window.onload事件
    var existingOnload = window.onload;

    document.head.appendChild(style);
    window.onload = function() {
        if (existingOnload) {
            existingOnload(); // 先执行原有的onload事件
        }

        // 获取所有tr元素
        const trElements = document.querySelectorAll('#projectstatus > tbody > tr');

        trElements.forEach(tr => {
            // 获取第一个td元素
            const firstTd = tr.querySelector('td:first-child');
            // 检查第一个td的innerHTML是否包含“多分支流水线”文本
            if (firstTd && firstTd.innerHTML.includes('多分支流水线')) {
                // console.log(tr);
                // 获取第三个td元素#job_samps-fmc-planflight-bak > td:nth-child(3)
                const aTag = tr.querySelector('td:nth-child(3) > a');
                // 如果a标签存在且有href属性，则打印其值
                if (aTag && aTag.href) {
                    // console.log(aTag.href);
                    fetch(aTag.href, { mode: 'cors' })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(html => {
                        const targetContent = htmlStringToElement(html);
                        const clonedRows = []; // 保存克隆的tr元素

                        for (var i = 1; i < targetContent.childNodes.length; i++) {
                            if (targetContent.childNodes[i].nodeName === 'TR') {
                                const clonedRow = targetContent.childNodes[i].cloneNode(true);
                                // 获取父元素内容
                                const parentText = tr.children.item(2).querySelector('a').text;
                                const childId = clonedRow.id;

                                const thirdTd = clonedRow.children.item(2);
                                const anchorInThirdTd = thirdTd.querySelector('a');
                                // 修改text内容
                                if (anchorInThirdTd) {
                                    // 更新a标签的文本内容，可以包含父元素的相关信息
                                    anchorInThirdTd.textContent = parentText + '【' + anchorInThirdTd.text + '】';
                                }
                                // 修改所有href链接
                                for(const ch of clonedRow.children){
                                    const ahtml = ch.querySelectorAll('a');
                                    // 遍历这些a标签并修改href属性
                                    ahtml.forEach(anchor => {
                                        // 给每个a标签赋予一个新的href值
                                        const oldHref = anchor.href;
                                        // const newHref = oldHref.replace(/(job)/g, `job/${parentText}/$1`);
                                        // 创建一个正则表达式，并设置全局标志
                                        const regex = /(job)/g;
                                        // 查找并替换第一个"job"
                                        let newHref = oldHref.replace(regex, '$1');
                                        // 查找并替换第二个"job"之前插入自定义内容
                                        regex.lastIndex = 0; // 重置正则表达式的索引
                                        let match = regex.exec(oldHref);
                                        if (match && match.index !== -1) {
                                            regex.lastIndex = match.index + match[0].length;
                                            match = regex.exec(oldHref);
                                            if (match && match.index !== -1) {
                                                const customContent = 'job/' + parentText + '/';
                                                newHref = customContent + match[0] + newHref.slice(match.index + match[0].length);
                                            }
                                        }
                                        // // 修改href属性
                                        anchor.href = newHref;
                                        const imghtml = anchor.querySelector('img');
                                        if(imghtml){
                                           // 从HTML属性中提取onclick函数的字符串内容
                                            const inlineOnClickStr = imghtml.getAttribute('onclick');
                                            imghtml.removeAttribute('onclick');
                                            imghtml.addEventListener('click', function(event) {
                                                event.preventDefault();
                                                bulidProject(imghtml);
                                                location.reload();
                                            });
                                        }
                                    });
                                }
                                clonedRow.classList.add('light-green-background');
                                clonedRows.push(clonedRow);
                            }
                        }

                        // 获取当前tr的下一个兄弟节点
                        let nextSibling = tr.nextElementSibling;

                        // 将新的tr元素依次插入到当前tr后面
                        clonedRows.forEach(clonedRow => {
                            tr.parentNode.insertBefore(clonedRow, nextSibling);
                        });

                    })
                    .catch(error => {
                        console.error('Error during fetch:', error);
                    });
                }
            }
        });
    };

})();
function htmlStringToElement(htmlString) { // 获取tbody内容
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const paneFrames = doc.querySelectorAll('div.pane-frame');
    const tbody = paneFrames[2].querySelectorAll('tbody');
    return tbody[0];
}