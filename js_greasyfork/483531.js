// ==UserScript==
// @name         duifene-download
// @version      0.1.1
// @description  duifene 对分易课程资源下载
// @author       WiSHao
// @match        https://www.duifene.com/_FileManage/PC/StFileManage.aspx
// @icon         https://www.duifene.com/favicon.ico
// @run-at       document-body
// @license      ISC
// @grant        none
// @namespace    https://greasyfork.org/users/1103837
// @downloadURL https://update.greasyfork.org/scripts/483531/duifene-download.user.js
// @updateURL https://update.greasyfork.org/scripts/483531/duifene-download.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 每100毫秒检查一次，确保要操作的元素真加载出来了，之后再执行某回调操作
    function waitForElement(selector, callback) {
        const interval = setInterval(function () {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            }
        }, 100);
    }

    // 下载函数
    function download(url, name) {
        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                const blobUrl = window.URL.createObjectURL(blob);

                console.log(url.split('/'));
                // 提取 URL 中的文件名
                let filename = name || url.split('/').pop();

                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(blobUrl); // 清理资源
            })
            .catch((e) => console.error('下载失败:', e));
    }

    // 改所有禁止下载为下载的函数
    function todo(ele) {
        if (ele) console.log('所检查元素存在，如下:', ele);

        const fileListNode = document.querySelectorAll('#FilesList > div');
        const fileListArray = Array.from(fileListNode);
        let noDownloading = false;
        fileListArray.forEach((item) => {
            // 获取带下载功能那块的div
            const actionDOM = item.querySelector('.action');
            if (!actionDOM || !item.dataset.path) {
                noDownloading = false;
                return;
            }
            noDownloading = setDownLoadButton(actionDOM, item.dataset.path);
        });

        if (!noDownloading) {
            alert('没有禁止下载，不用改啦');
            return;
        }
        alert('确实有禁止下载，已解开');
    }

    function setDownLoadButton(actionDOM, downloadPath) {
        // 遍历其中的所有元素
        const elements = actionDOM.querySelectorAll('*');
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            // 检查所有属性
            for (let j = 0; j < element.attributes.length; j++) {
                let attr = element.attributes[j];
                if (attr.value.includes('禁止')) {
                    console.log(`找到属性包含'禁止'的元素`, element);
                    element.innerHTML = '草泥马我就要下载';
                    element.style.color = 'red';
                    element.style.cursor = 'pointer';
                    element.addEventListener('mouseenter', function () {
                        element.style.textDecoration = 'underline';
                    });
                    element.addEventListener('mouseleave', function () {
                        element.style.textDecoration = 'none';
                    });
                    element.addEventListener('click', () => download(downloadPath));
                    return true;
                }
            }
            // 检查文本内容
            if (element.textContent.includes('禁止')) {
                console.log(`找到属性包含'禁止'的元素`, element);
                element.innerHTML = '草泥马我就要下载';
                element.style.color = 'red';
                element.style.cursor = 'pointer';
                element.addEventListener('mouseenter', function () {
                    element.style.textDecoration = 'underline';
                });
                element.addEventListener('mouseleave', function () {
                    element.style.textDecoration = 'none';
                });
                element.addEventListener('click', () => download(downloadPath));
                return true;
            }
        }

        return false;
    }

    // 批量下载函数
    function autoDownload() {
        try {
            const fileListNode = document.querySelectorAll('#FilesList > div');
            const fileListArray = Array.from(fileListNode);
            if (fileListArray.length === 0) {
                alert('没有可下载的文件');
                return;
            }
            alert('开始批量下载文件');
            fileListArray.forEach((item, index) => {
                // 获取带下载功能那块的div
                const actionDOM = item.querySelector('.action');
                if (!actionDOM || !item.dataset.path) {
                    return;
                }
                setTimeout(() => {
                    console.log(`${index}号文件已开始下载`);
                    download(item.dataset.path);
                }, index * 1000);
            });
        } catch (error) {
            alert('批量下载出错', error);
        }
    }

    // 点击重设所有下载的按钮
    function setDownLoad(ele) {
        ele.style.position = 'relative';

        const btn = document.createElement('div');
        btn.textContent = '设置下载按钮';
        btn.style.width = '120px';
        btn.style.height = '30px';
        btn.style.borderRadius = '5px';
        btn.style.lineHeight = '30px';
        btn.style.textAlign = 'center';
        btn.style.fontSize = '14px';
        btn.style.fontWeight = 'bold';
        btn.style.backgroundColor = '#8CF9FB';
        btn.style.color = 'white';
        btn.style.cursor = 'pointer';
        btn.style.position = 'absolute';
        btn.style.left = '200px';
        btn.addEventListener('mouseenter', function () {
            btn.style.backgroundColor = '#4BC4D0';
        });
        btn.addEventListener('mouseleave', function () {
            btn.style.backgroundColor = '#8CF9FB';
        });
        ele.appendChild(btn);
        btn.addEventListener('click', () => todo(ele));
    }

    // 批量下载按钮
    function allDownLoad(ele) {
        const btn = document.createElement('div');
        btn.textContent = '批量下载文件';
        btn.style.width = '120px';
        btn.style.height = '30px';
        btn.style.borderRadius = '5px';
        btn.style.lineHeight = '30px';
        btn.style.textAlign = 'center';
        btn.style.fontSize = '14px';
        btn.style.fontWeight = 'bold';
        btn.style.backgroundColor = '#8CF9FB';
        btn.style.color = 'white';
        btn.style.cursor = 'pointer';
        btn.style.position = 'absolute';
        btn.style.left = '340px';
        btn.addEventListener('mouseenter', function () {
            btn.style.backgroundColor = '#4BC4D0';
        });
        btn.addEventListener('mouseleave', function () {
            btn.style.backgroundColor = '#8CF9FB';
        });
        ele.appendChild(btn);
        btn.addEventListener('click', autoDownload);
    }

    // 页面加载完毕后执行入口
    window.addEventListener('load', () => {
        waitForElement('.btnGroup', setDownLoad);
        waitForElement('.btnGroup', allDownLoad);
        waitForElement('#FilesList > div:nth-child(1) > div.fileName > a', todo);
    });
})();
