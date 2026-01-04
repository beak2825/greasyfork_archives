// ==UserScript==
// @name         下载未做种的种子
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  在用户认领种子详情处添加下载未做种种子按钮
// @author       You
// @match        http*://*/claim.php?uid=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531478/%E4%B8%8B%E8%BD%BD%E6%9C%AA%E5%81%9A%E7%A7%8D%E7%9A%84%E7%A7%8D%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/531478/%E4%B8%8B%E8%BD%BD%E6%9C%AA%E5%81%9A%E7%A7%8D%E7%9A%84%E7%A7%8D%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 获取所有tr元素
        const trElements = document.querySelectorAll('tr');
        
        trElements.forEach(tr => {
            // 获取tr中的第一个td元素
            const firstTd = tr.querySelector('td:first-child');
            if (!firstTd) return;
            
            // 获取td中的第一个子元素
            const firstChild = firstTd.firstElementChild;
            if (!firstChild) return;
            
            // 检查文本内容是否包含"用户认领种子详情"
            if (firstChild.textContent.includes('用户认领种子详情')) {
                // 创建按钮
                const button = document.createElement('button');
                button.textContent = '下载未做种的种子';
                button.style.marginLeft = '10px';
                button.style.padding = '5px 10px';
                button.style.backgroundColor = '#4CAF50';
                button.style.color = 'white';
                button.style.border = 'none';
                button.style.borderRadius = '4px';
                button.style.cursor = 'pointer';
                
                // 添加点击事件
                button.addEventListener('click', function() {
                    const idArray = [];
                    
                    // 遍历所有tr元素
                    document.querySelectorAll('tr').forEach(tr => {
                        // 获取第8个td元素
                        const td8 = tr.querySelector('td:nth-child(8)');
                        if (!td8 || td8.textContent.trim() !== '0:00') return;
                        
                        // 获取第3个td中的a标签
                        const td3 = tr.querySelector('td:nth-child(3)');
                        if (!td3) return;
                        
                        const aTag = td3.querySelector('a[href*="details.php?id="]');
                        if (!aTag) return;
                        
                        // 从href中提取ID
                        const match = aTag.href.match(/id=(\d+)/);
                        if (match && match[1]) {
                            idArray.push(match[1]);
                        }
                    });
                    
                    console.log('找到的ID数组:', idArray);
                    if (idArray.length === 0) {
                        alert('没有找到未做种的种子');
                        return;
                    }
                    
                    alert(`开始下载 ${idArray.length} 个种子文件...`);
                    
                    // 获取当前页面host
                    const host = window.location.host;
                    
                    // 下载每个种子文件
                    idArray.forEach((id, index) => {
                        const url = `https://${host}/download.php?id=${id}`;
                        const filename = `torrent_${id}.torrent`;
                        
                        console.log(`尝试下载URL: ${url}`);
                        const xhr = new XMLHttpRequest();
                        xhr.open('GET', url, true);
                        xhr.responseType = 'blob';
                        xhr.setRequestHeader('Cache-Control', 'no-cache');
                        
                        xhr.onload = function() {
                            if (this.status === 200) {
                                const blob = this.response;
                                const a = document.createElement('a');
                                const objectUrl = URL.createObjectURL(blob);
                                
                                a.href = objectUrl;
                                a.download = filename;
                                document.body.appendChild(a);
                                a.click();
                                
                                setTimeout(() => {
                                    document.body.removeChild(a);
                                    URL.revokeObjectURL(objectUrl);
                                    console.log(`成功下载: ${filename}`);
                                    
                                    if (index === idArray.length - 1) {
                                        alert('所有种子文件下载完成！');
                                    }
                                }, 100);
                            } else {
                                console.error(`下载失败: ${filename}`, {
                                    status: this.status,
                                    statusText: this.statusText,
                                    url: url
                                });
                                alert(`下载失败: ${filename}\n状态码: ${this.status}`);
                            }
                        };
                        
                        xhr.onerror = function() {
                            console.error(`下载失败: ${filename}`, {
                                status: this.status,
                                statusText: this.statusText,
                                url: url
                            });
                            alert(`下载失败: ${filename}\n请检查控制台查看详情`);
                        };
                        
                        xhr.send();
                        
                        // 添加延迟避免请求过于频繁
                        if (index < idArray.length - 1) {
                            setTimeout(() => {}, index * 1000);
                        }
                    });
                });
                
                // 将按钮添加到子元素末尾
                firstChild.appendChild(button);
            }
        });
    });
})();