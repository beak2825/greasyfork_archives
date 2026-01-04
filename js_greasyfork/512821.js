// ==UserScript==
// @name         下载当前页面指定数据 （img, video, audio, ...）
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  调用 downloadDataInOrder(obtainDataNodes(document.querySelectorAll('数据节点'), 'file')) 方法，并传入数据节点，根据传入的数据节点，下载网页上的数据并保存到本地
// @author       slowFever
// @match        *://*/*
// @match        *
// @connect      *
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/512821/%E4%B8%8B%E8%BD%BD%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E6%8C%87%E5%AE%9A%E6%95%B0%E6%8D%AE%20%EF%BC%88img%2C%20video%2C%20audio%2C%20%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/512821/%E4%B8%8B%E8%BD%BD%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E6%8C%87%E5%AE%9A%E6%95%B0%E6%8D%AE%20%EF%BC%88img%2C%20video%2C%20audio%2C%20%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * @name 获取数据节点的函数
     * @param nodes 传入单个节点，或多个节点（img, video, audio, ...）
     * @returns Array[]
     */
    function obtainDataNodes(nodes) {
        let nodeDataList = [];
        nodes.forEach(node => {
            const src = node.getAttribute('src');
            if (src && !nodeDataList.includes(src)) {
                nodeDataList.push(src);
            }
        });
        console.log(`获取到${nodeDataList.length}条数据`)
        return nodeDataList;
    }

    /**
     * @name 下载数据的函数
     * @param url 下载地址
     * @param filename 文件名
     * @returns {Promise<void>}
     */
    function downloadFile(url, filename) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "blob", // 指定响应类型为 blob
                onload: function(response) {
                    if (response.status === 200) {
                        const blob = new Blob([response.response]); // 创建 Blob 对象
                        const link = document.createElement('a'); // 创建 <a> 标签
                        const objectURL = URL.createObjectURL(blob); // 创建 Blob URL
                        link.href = objectURL;
                        link.download = filename; // 设置下载的文件名
                        document.body.appendChild(link); // 添加到文档中
                        link.click(); // 模拟点击下载
                        document.body.removeChild(link); // 下载完成后移除 <a> 标签
                        URL.revokeObjectURL(objectURL); // 释放 Blob URL
                        console.log(`成功下载数据：${filename}`);
                        resolve(); // 下载完成，调用 resolve
                    } else {
                        console.error('下载失败，状态码:', response.status);
                        reject(`下载失败，状态码: ${response.status}`);
                    }
                },
                onerror: function(error) {
                    console.error('下载出错:', error);
                    reject(error); // 出错时调用 reject
                }
            });
        });
    }

    /**
     * @name 分批按顺序下载数据的函数
     * @param nodesData 数据节点
     * @param prefix 文件名前缀
     * @param batchSize 每次下载的最大文件数量
     */
    async function downloadDataInOrder(nodesData, prefix = 'file', batchSize = 10) {
        for (let i = 0; i < nodesData.length; i += batchSize) {
            const batch = nodesData.slice(i, i + batchSize); // 获取当前批次的数据
            await Promise.all(batch.map((url, index) => {
                const fileName = `${prefix}-${i + index + 1}.${url.split('.').pop().split('?')[0]}`;
                return downloadFile(url, fileName);
            }));
            console.log(`完成批次 ${Math.floor(i / batchSize) + 1} 的下载`);
        }
    }

    // 将函数暴露到全局，以便在控制台调用
    unsafeWindow.downloadDataInOrder = downloadDataInOrder;
    unsafeWindow.obtainDataNodes = obtainDataNodes;

    // 提示用户可以通过控制台调用函数
    (async () => {
        console.log("下载指定数据脚本加载完成，当前版本：", GM_info.script.version);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 延时1秒
        console.log("%c使用脚本方法：↓ ↓ ↓", "color:#ec2c64");
        await new Promise(resolve => setTimeout(resolve, 1000)); // 再延时1秒
        console.log("%cdownloadDataInOrder(obtainDataNodes(document.querySelectorAll('数据节点'), 'file'))",  "color:#0f59a4; background:#eef7f2; font-size:1.5rem; padding:0.15rem 0.35rem; margin: 1rem auto; font-family: Rockwell; border: 2px solid #0f59a4; border-radius: 4px;font-weight: bold; text-shadow: 1px 1px 1px #0f59a4;");
    })();
})();
