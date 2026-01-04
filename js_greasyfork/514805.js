// ==UserScript==
// @name         ED2K 链接展示与复制按钮
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在ed2k链接后添加<pre>节点，显示链接内容并附带一键复制与推送到115下载按钮，实时监测页面变化
// @author       Kai
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514805/ED2K%20%E9%93%BE%E6%8E%A5%E5%B1%95%E7%A4%BA%E4%B8%8E%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/514805/ED2K%20%E9%93%BE%E6%8E%A5%E5%B1%95%E7%A4%BA%E4%B8%8E%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        webDownloadFolderId: GM_getValue("webDownloadFolderId", ""),
        signUrl: "https://115.com/?ct=offline&ac=space&_=", // 获取115 token签名接口
        addTaskUrl: "https://115.com/web/lixian/?ct=lixian&ac=add_task_url", // 添加115离线任务接口
    };

    // Function to send ed2k links to 115 offline download
    function addEd2kTo115(urls) {
        return new Promise((resolve, reject) => {
            const timeout = new Date().getTime();
            GM_xmlhttpRequest({
                method: "GET",
                url: config.signUrl + timeout,
                onload: (responseDetails) => {
                    if (responseDetails.responseText.indexOf("html") >= 0) {
                        reject("还没有登录115");
                        return;
                    }
                    let signData;
                    try {
                        signData = JSON.parse(responseDetails.response);
                    } catch (error) {
                        reject("获取签名失败: 无效的JSON数据");
                        return;
                    }

                    const { sign } = signData;
                    const encodedUrls = `url=${encodeURIComponent(urls[0])}`;
                    const url = config.addTaskUrl;
                    const addConfig = {
                        method: "POST",
                        url: url,
                        data: `${encodedUrls}&savepath=&wp_path_id=${config.webDownloadFolderId}&sign=${sign}&time=${timeout}`,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        },
                        onload: (res) => {
                            let resData;
                            try {
                                resData = JSON.parse(res.response);
                            } catch (error) {
                                reject("添加任务失败: 无效的JSON数据");
                                return;
                            }
                            if (resData.state === false) {
                                reject(resData.error_msg || "添加任务失败");
                            } else {
                                resolve("添加成功！");
                            }
                        },
                        onerror: () => reject("请求添加离线任务失败"),
                    };
                    GM_xmlhttpRequest(addConfig);
                },
                onerror: () => reject("获取签名失败"),
            });
        });
    }

    // 创建并插入复制和推送功能节点
    function addCopyAndPushNodes(link) {
        if (link.nextElementSibling && link.nextElementSibling.tagName === 'PRE') {
            return; // 如果节点已经存在，避免重复插入
        }

        // 创建<pre>节点，并将链接内容设置为<pre>节点的文本
        const preNode = document.createElement('pre');
        preNode.textContent = link.href;

        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.textContent = "复制链接";
        copyButton.style.marginLeft = "10px";

        // 点击按钮复制链接内容
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(link.href).then(() => {
                showSuccessMessage(copyButton);
            }).catch(err => {
                console.error("复制失败:", err);
            });
        });

        // 创建推送到115下载按钮
        const pushButton = document.createElement('button');
        pushButton.textContent = '推送到115下载';
        pushButton.style.marginLeft = '10px';
        pushButton.style.cursor = 'pointer';

        // 点击按钮推送链接到115
        pushButton.addEventListener('click', () => {
            addEd2kTo115([link.href])
                .then(response => {
                    pushButton.textContent = response;
                    setTimeout(() => pushButton.textContent = '推送到115下载', 2000);
                })
                .catch(error => {
                    pushButton.textContent = error;
                    setTimeout(() => pushButton.textContent = '再次尝试推送到115下载', 2000);
                });
        });

        // 在<pre>节点前后添加换行
        const beforeBreak = document.createElement('br');
        const afterBreak = document.createElement('br');

        // 在链接后插入换行、<pre>节点、复制按钮、推送按钮、换行
        link.parentNode.insertBefore(beforeBreak, link.nextSibling);
        link.parentNode.insertBefore(preNode, link.nextSibling);
        link.parentNode.insertBefore(copyButton, preNode.nextSibling);
        link.parentNode.insertBefore(pushButton, copyButton.nextSibling);
        link.parentNode.insertBefore(afterBreak, pushButton.nextSibling);
    }

    // 显示复制成功的提示
    function showSuccessMessage(button) {
        const successMessage = document.createElement('span');
        successMessage.textContent = "复制成功!";
        successMessage.style.setProperty("color", "green", "important");
        successMessage.style.setProperty("margin-left", "10px", "important");
        button.after(successMessage);

        setTimeout(() => {
            successMessage.remove();
        }, 2000);  // 设置为2秒
    }

    // 监测页面变化的MutationObserver
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                // 查找新添加的ed2k链接
                const links = document.querySelectorAll('a[href^="ed2k://"]');
                links.forEach(link => addCopyAndPushNodes(link));
            }
        });
    });

    // 配置Observer选项并启动监测
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始页面上的ed2k链接处理
    const initialLinks = document.querySelectorAll('a[href^="ed2k://"]');
    initialLinks.forEach(link => addCopyAndPushNodes(link));
})();
