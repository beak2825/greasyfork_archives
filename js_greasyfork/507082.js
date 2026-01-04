// ==UserScript==
// @name         小红书批量修改内容
// @namespace    https://zhangzifan.com
// @version      1.0
// @description  提取页面中的小红书内容链接中的ID，然后在进入编辑页面修改。
// @author       Fanly
// @match        https://creator.xiaohongshu.com/new/note-manager*
// @match        https://creator.xiaohongshu.com/publish/update*
// @match        https://creator.xiaohongshu.com/publish/editSuccess*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507082/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/507082/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面加载完成后执行
    window.addEventListener('load', () => {
        console.log('页面打开成功！');

        if (window.location.href.includes('https://creator.xiaohongshu.com/new/note-manager')) {
            const intervalIds = setInterval(() => {
                if (document.querySelector("#content-area .content .note")) {
                    console.log('加载完成');
                    // 初始化
                    extractIDs();
                    processIDs();
                    clearInterval(intervalIds);
                }
            }, 1000);
            // 存储提取的ID的数组
            var IDs = [];
            function extractIDs() {
                // 获取所有匹配选择器的元素
                const elements = document.querySelectorAll('.content .note');
                // 遍历元素，提取ID
                elements.forEach(element => {
                    const dataImpression = element.getAttribute('data-impression');
                    if (dataImpression) {
                        // 使用正则表达式提取ID
                        const match = dataImpression.match(/"noteId":"(\w+)"/);
                        if (match && match[1]) {
                            IDs.push(match[1]);
                        }
                    }
                });
                // 输出提取的ID数组
                console.log('IDs:', IDs);
            }

            var INDEX = 5;

            // 递归处理所有ID
            function processIDs() {
                if (INDEX < IDs.length) {
                    const ID = IDs[INDEX];
                    setTimeout(() => {
                        console.log('编辑ID：' + ID);
                        window.open(`https://creator.xiaohongshu.com/publish/update?id=${ID}`, '_blank');
                        INDEX++;
                    }, 1000);
                } else if (INDEX == IDs.length) {
                    const contentArea = document.querySelector('#content-area .content');
                    if (contentArea) {
                        const scrollHeight = contentArea.scrollHeight;
                        const clientHeight = contentArea.clientHeight;
                        const scrollTop = contentArea.scrollTop;
                        // 模拟滚动
                        contentArea.scrollTop = scrollHeight - clientHeight;
                        // 等待新内容加载
                        setTimeout(() => {
                            IDs = [];//重置IDs
                            extractIDs(); // 获取IDs
                            processIDs();
                        }, 5000); // 等待内容加载
                    }
                } else {
                    console.log('处理完成');
                }
            }

            // 监测页面可见状态
            document.addEventListener('visibilitychange', function() {
                if (document.visibilityState === 'visible') {
                    console.log('处理进度：' + INDEX);
                    // 页面可见时的处理逻辑
                    processIDs();
                }
            });
        }

        //关闭成功提示的页面
        if (window.location.href.includes('https://creator.xiaohongshu.com/publish/editSuccess')) {
            window.open('https://creator.xiaohongshu.com/publish/editSuccess', '_self');
            window.close();
            if (!window.closed) window.location.href = 'https://leixue.com';
        };

        // 开始编辑
        const intervalId = setInterval(() => {
            if (document.querySelector(".content .titleInput")) {
                console.log('加载完成');
                setTimeout(() => {
                    if (window.location.href.includes('https://creator.xiaohongshu.com/publish/update')) {
                        console.log('开始替换');
                        let titleModified = false;
                        let editorModified = false;
                        // 修改标题
                        let titleInput = document.querySelector('.content .titleInput input.el-input__inner');
                        if (titleInput) {
                            const newTitle = titleInput.value.replace(/\s*(?:-?)\s*泪雪网/, '');
                            if (titleInput.value !== newTitle) {
                                titleInput.value = newTitle;
                                titleModified = true;
                            }
                        }
                        // 修改简介
                        let editor = document.querySelector('#post-textarea');
                        if (editor) {
                            const newEditor = editor.innerHTML
                                .replace(/^.*(?:-?).*泪雪网(?:\s*#?\S*)\s*<br>/g, '')
                                .replace(/^(<br\s*\/?>)+|(<br\s*\/?>)+$/g, '')
                                .trim();
                            if (editor.innerHTML !== newEditor) {
                                // 移除前后的 <p><br></p>
                                editor.innerHTML = newEditor;
                                editorModified = true;
                            }
                        }
                        // 根据修改情况点击保存或关闭页面
                        console.log(`修改标题：${titleModified}\n修改简介：${editorModified}`);
                        setTimeout(() => {
                            const saveButton = document.querySelector('.post-page .submit button.publishBtn');
                            if (titleModified || editorModified) {
                                if (saveButton) {
                                    saveButton.click(); // 保存
                                    setTimeout(() => {
                                        window.close();
                                    }, 3000);
                                }
                            } else {
                                window.close();
                            }
                        }, 3000); // 等待一点时间以确保更改已处理
                    }
                }, 3000);
                clearInterval(intervalId);
            }
        }, 1000);

    });
})();
