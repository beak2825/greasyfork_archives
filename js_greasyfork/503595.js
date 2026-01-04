// ==UserScript==
// @name         获取夸克网盘文件列表
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  获取并显示文件列表
// @author       21zys
// @match        *://pan.quark.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503595/%E8%8E%B7%E5%8F%96%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E6%96%87%E4%BB%B6%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/503595/%E8%8E%B7%E5%8F%96%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E6%96%87%E4%BB%B6%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面完全加载后执行
    window.addEventListener('load', function() {
        // 查找目标位置
        const targetDiv = document.querySelector('div.SectionHeaderController--section-header-right--QIJ-wNk');

        if (targetDiv) {
            // 创建按钮
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'ant-btn btn-file btn-create-folder';
            button.style = 'margin-right: 12px;'
            button.innerText = '获取文件列表';

            // 按钮点击事件
            button.addEventListener('click', function() {
                // 获取文件列表
                let page = 1;
                let pdir_fid = '';
                const url = window.location.href;

                // 用 '/' 分割并取最后一个字符串
                const lastSegment = url.split('/').pop();

                // 用 '-' 分割并取第一个字符串
                pdir_fid = lastSegment.split('-')[0];

                // 获取当前域名的cookie
                const cookie = document.cookie;


                let results = [];


                function fetchPage(page) {
                    const xhr = new XMLHttpRequest();
                    const url = `https://drive-pc.quark.cn/1/clouddrive/file/sort?pr=ucpro&fr=pc&uc_param_str=&pdir_fid=${pdir_fid}&_page=${page}&_size=500&_fetch_total=1&_fetch_sub_dirs=0&_sort=file_type:asc,file_name:asc`;

                    xhr.open('GET', url, false);

                    // 设置withCredentials为true，允许跨域请求发送cookie
                    xhr.withCredentials = true;

                    // 设置cookie请求头
                    xhr.setRequestHeader('Cookie', cookie);

                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            const response = JSON.parse(xhr.responseText);
                            const data = response.data;

                            // 如果data或list为空，则停止请求
                            if (!data || !data.list || data.list.length === 0) {
                                return;
                            }

                            // 将每个对象的 file_name 追加到 results 数组中
                            data.list.forEach(item => {
                                results.push(item.file_name);
                            });

                            // 请求下一页
                            fetchPage(page + 1);
                        } else if (xhr.readyState === 4) {
                            console.error('请求出错:', xhr.status);
                        }
                    };

                    xhr.send();
                }

                fetchPage(page);

                // 创建一个文本域用于显示结果
                const textarea = document.createElement('textarea');
                textarea.value = results.join('\n');
                textarea.style.width = '100%';
                textarea.style.height = '300px';

                // 弹出一个对话框，包含文本域
                const dialog = document.createElement('div');
                dialog.style.position = 'fixed';
                dialog.style.top = '50%';
                dialog.style.left = '50%';
                dialog.style.transform = 'translate(-50%, -50%)';
                dialog.style.zIndex = '9999';
                dialog.style.backgroundColor = 'white';
                dialog.style.border = '1px solid #ccc';
                dialog.style.padding = '20px';
                dialog.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';

                // 关闭按钮
                const closeButton = document.createElement('button');
                closeButton.innerText = '关闭';
                closeButton.style.marginTop = '10px';

                closeButton.addEventListener('click', function() {
                    document.body.removeChild(dialog);
                });

                dialog.appendChild(textarea);
                dialog.appendChild(closeButton);

                document.body.appendChild(dialog);
            });

            // 将按钮添加到目标位置
            targetDiv.insertBefore(button, targetDiv.firstChild);
        }
    });
})();
