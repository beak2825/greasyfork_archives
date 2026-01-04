// ==UserScript==
// @name         哔哩哔哩批量修改视频标题和简介
// @namespace    https://zhangzifan.com
// @version      1.0
// @description  提取页面中的Bilibili视频链接中的BV号，然后在进入编辑页面修改。
// @author       Fanly
// @match        https://member.bilibili.com/platform/upload*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506688/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E8%A7%86%E9%A2%91%E6%A0%87%E9%A2%98%E5%92%8C%E7%AE%80%E4%BB%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/506688/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E8%A7%86%E9%A2%91%E6%A0%87%E9%A2%98%E5%92%8C%E7%AE%80%E4%BB%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面加载完成后执行
    window.addEventListener('load', () => {
        console.log('页面打开成功！');

        if (window.location.href.includes('https://member.bilibili.com/platform/upload-manager/article')) {
            // 存储提取的BV号的数组
            var BVS = [];
            function bvs(){
                // 获取所有匹配选择器的元素
                const elements = document.querySelectorAll('div.article-list_wrap > div');
                // 遍历元素，提取BV号
                elements.forEach(element => {
                    const href = element.querySelector('a.cover-wrp').getAttribute('href');
                    if (href) {
                        // 使用正则表达式提取BV号
                        const match = href.match(/\/video\/(BV\w+)\//);
                        if (match && match[1]) {
                            BVS.push(match[1]);
                        }
                    }
                });
                // 输出提取的BV号数组
                console.log('BVS:', BVS);
            }


            var INDEX = 0;

            // 递归处理所有视频行
            function processVideoRows() {
                if (INDEX < BVS.length) {
                    const BV = BVS[INDEX];
                    setTimeout(() => {
                        console.log('编辑BV：' + BV);
                        window.open(`https://member.bilibili.com/platform/upload/video/frame?type=edit&version=new&bvid=${BV}`, '_blank');
                        INDEX ++;
                    }, 1000);
                }else if(INDEX == BVS.length){
                    const nextpage = document.querySelector('.bcc-pagination-container .bcc-pagination-next');
                    if (nextpage) {
                        console.log('下一页' );
                        nextpage.click();
                        setTimeout(() => {
                            bvs();//获取BVS
                            processVideoRows();
                        }, 10000);
                    }
                }else{
                    console.log('处理完成');
                }
            }

            //初始化
            bvs();
            processVideoRows();

            //监测页面可见状态
            document.addEventListener('visibilitychange', function() {
                if (document.visibilityState === 'visible') {
                    console.log('处理进度：' + INDEX);
                    // 页面可见时的处理逻辑
                    processVideoRows();
                }
            });
        }

        //开始编辑
        const intervalId = setInterval(() => {
            if (document.querySelector(".video-basic")) {
                console.log('加载完成');
                setTimeout(() => {
                    if (window.location.href.includes('https://member.bilibili.com/platform/upload/video/frame')) {
                        console.log('开始替换');
                        let titleModified = false;
                        let tagsModified = false;
                        let editorModified = false;
                        // 修改标题
                        let titleInput = document.querySelector('.video-basic .video-title .input-instance input.input-val');
                        if (titleInput) {
                            const newTitle = titleInput.value.replace(/\s+[\-]\s+泪雪网/, '');
                            if(titleInput.value !== newTitle){
                                titleInput.focus();
                                setTimeout(() => {
                                    titleInput.value = newTitle;
                                    document.execCommand('insertText', false, ' ');
                                    titleInput.blur();
                                }, 500);
                                titleModified = true;
                            }
                        }
                        // 移除标签
                        let tags = document.querySelectorAll('.tag-pre-wrp .label-item-v2-container');
                        tags.forEach(tag => {
                            // 是否包含
                            if (tag.innerText.includes('泪雪网')) {
                                tag.click();
                                tagsModified = true;
                            }
                        });

                        // 修改简介
                        let editor = document.querySelector('.video-basic .desc-text-wrp .ql-editor');
                        if (editor) {
                            const newEditor = editor.innerHTML
                                .replace(/<p>.*-.*泪雪网<\/p>/g, '')
                                .replace('泪雪网原文地址', '禁止转载复用，简介内容版权归属泪雪网')
                                .replace(/www\.leixue\.com/g, 'leixue.com');
                            if(editor.innerHTML !== newEditor){
                                // 移除前后的 <p><br></p>
                                editor.innerHTML = newEditor
                                    .replace(/^<p><br><\/p>\s*/g, '')  // 移除开头的 <p><br></p>
                                    .replace(/<p><br><\/p>\s*$/, ''); // 移除结尾的 <p><br></p>
                                editorModified = true;
                            }
                        }
                        // 根据修改情况点击保存或关闭页面
                        console.log(`修改标题：${titleModified}\n修改简介：${editorModified}\n修改标签：${tagsModified}`);
                        setTimeout(() => {
                            const saveButton = document.querySelector('.submit-add');
                            if (titleModified || tagsModified || editorModified) {
                                if (saveButton) {
                                    saveButton.click();//保存
                                    setInterval(() => {
                                        if (document.body.innerText.includes('稿件投递成功')) {
                                            window.close();
                                            if (!window.closed) window.location.href = 'https://leixue.com';
                                        }
                                    }, 1000);
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
