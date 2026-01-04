// ==UserScript==
// @name         快手创作者服务平台批量编辑修改作品
// @namespace    https://zhangzifan.com
// @version      1.0
// @description  提取页面中的链接中的ID，然后在进入编辑页面修改。
// @author       Fanly
// @match        https://cp.kuaishou.com/article/manage/video
// @match        https://cp.kuaishou.com/article/edit/video*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507115/%E5%BF%AB%E6%89%8B%E5%88%9B%E4%BD%9C%E8%80%85%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%E6%89%B9%E9%87%8F%E7%BC%96%E8%BE%91%E4%BF%AE%E6%94%B9%E4%BD%9C%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/507115/%E5%BF%AB%E6%89%8B%E5%88%9B%E4%BD%9C%E8%80%85%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%E6%89%B9%E9%87%8F%E7%BC%96%E8%BE%91%E4%BF%AE%E6%94%B9%E4%BD%9C%E5%93%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面加载完成后执行
    window.addEventListener('load', () => {
        console.log('页面打开成功！');

        if (window.location.href.includes('https://cp.kuaishou.com/article/manage/video')) {
            const intervalIds = setInterval(() => {
                if (document.querySelector(".auto-load-list .video-item")) {
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
                const elements = document.querySelectorAll('.auto-load-list .video-item .video-item__cover');
                // 遍历元素，提取ID
                elements.forEach(element => {
                    const dataImpression = element.querySelector("img.video-item__cover__img").getAttribute('src');
                    if (dataImpression) {
                        // 使用正则表达式提取ID
                        const match = dataImpression.match(/clientCacheKey=(\w+).jpg/);
                        if (match && match[1]) {
                            IDs.push(match[1]);
                        }
                    }
                });
                // 输出提取的ID数组
                console.log('IDs:', IDs);
            }

            var INDEX = 30;

            // 递归处理所有ID
            function processIDs() {
                if (INDEX < IDs.length) {
                    const ID = IDs[INDEX];
                    setTimeout(() => {
                        console.log('编辑ID：' + ID);
                        window.open(`https://cp.kuaishou.com/article/edit/video?workId=${ID}`, '_blank');
                        INDEX++;
                    }, 1000);
                } else if (INDEX == IDs.length) {
                    const contentArea = document.querySelector('#main-container');
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

        // 开始编辑
        const intervalId = setInterval(() => {
            if (document.querySelector("haploid-html haploid-body")) {
                console.log('加载完成');
                setTimeout(() => {
                    if (window.location.href.includes('https://cp.kuaishou.com/article/edit/video')) {
                        console.log('开始替换');
                        let editorModified = false;
                        // 修改描述
                        let editor = document.querySelector('haploid-html haploid-body div[class*="_description_"]');
                        if (editor) {
                            const newEditor = editor.innerHTML
                                .replace(/\s*(?:-?)\s*泪雪网.*/g, '')
                                .replace(/www\.leixue\.com/g, 'leixue.com')
                                .replace(/^(&nbsp;|\s)+|(&nbsp;|\s)+$/g, '')
                                .trim();
                            if (editor.innerHTML !== newEditor) {
                                editor.innerHTML = newEditor;
                                editorModified = true;
                            }
                        }
                        // 根据修改情况点击保存或关闭页面
                        console.log(`修改简介：${editorModified}`);
                        setTimeout(() => {
                            const saveButton = document.querySelector('haploid-html haploid-body div[class*="_footer_"] button.ant-btn-primary');
                            if (editorModified) {
                                setInterval(() => {
                                    if (saveButton) {
                                        saveButton.click(); // 保存
                                        setTimeout(() => {
                                            const tips = document.querySelector('.ant-modal-content .ant-modal-body div[class*="_tip-content"]');
                                            if (tips && tips.textContent.trim() == '修改频次过快，请稍后修改') {
                                                const ok = document.querySelector('.ant-modal-content .ant-modal-body .ant-modal-confirm-btns button.ant-btn-primary');
                                                if (ok) {
                                                    ok.click(); // 确定
                                                }
                                            }else{
                                                window.close();
                                            }
                                        }, 500);
                                    }
                                }, 2000);
                            } else {
                                window.close();
                            }
                        }, 500); // 等待一点时间以确保更改已处理
                    }
                }, 1000);
                clearInterval(intervalId);
            }
        }, 1000);

    });
})();
