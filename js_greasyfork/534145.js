// ==UserScript==
// @name         福利吧论坛回复导出工具
// @namespace    bbs_crewler.ai
// @version      0.2
// @description  导出当前页面的所有论坛回复内容
// @author       Chris_C
// @match        *://www.wnflb2023.com/*
// @grant        GM_setClipboard
// @grant        GM_download
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534145/%E7%A6%8F%E5%88%A9%E5%90%A7%E8%AE%BA%E5%9D%9B%E5%9B%9E%E5%A4%8D%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/534145/%E7%A6%8F%E5%88%A9%E5%90%A7%E8%AE%BA%E5%9D%9B%E5%9B%9E%E5%A4%8D%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // localStorage包装函数，简化存取操作
    const Storage = {
        set: function(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        get: function(key, defaultValue) {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        },
        remove: function(key) {
            localStorage.removeItem(key);
        }
    };

    // 创建导出按钮
    const btn = document.createElement('button');
    btn.style.position = 'fixed';
    btn.style.right = '20px';
    btn.style.bottom = '20px';
    btn.style.zIndex = 9999;
    btn.style.padding = '8px 12px';
    btn.style.backgroundColor = '#3498db';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    btn.textContent = '导出回复';
    btn.onclick = startExport;
    document.body.appendChild(btn);

    // 创建进度指示器
    const progressIndicator = document.createElement('div');
    progressIndicator.style.position = 'fixed';
    progressIndicator.style.left = '50%';
    progressIndicator.style.top = '50%';
    progressIndicator.style.transform = 'translate(-50%, -50%)';
    progressIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    progressIndicator.style.color = 'white';
    progressIndicator.style.padding = '20px';
    progressIndicator.style.borderRadius = '5px';
    progressIndicator.style.zIndex = 10000;
    progressIndicator.style.display = 'none';
    document.body.appendChild(progressIndicator);

    // 检查是否正在爬取过程中
    const isExporting = Storage.get('isExporting', false);
    const allContent = Storage.get('allContent', []);
    const currentPage = Storage.get('currentPage', 1);
    const totalPages = Storage.get('totalPages', 0);
    const startPageUrl = Storage.get('startPageUrl', '');

    // 如果正在爬取过程中，自动继续
    if (isExporting) {
        setTimeout(() => {
            continueExport();
        }, 1000);
    }

    // 开始导出过程
    function startExport() {
        // 重置存储的数据
        Storage.set('allContent', []);
        Storage.set('currentPage', 1);
        Storage.set('totalPages', getTotalPages());
        Storage.set('startPageUrl', window.location.href);
        Storage.set('isExporting', true);
        
        // 开始爬取当前页面
        continueExport();
    }

    // 生成1-3秒的随机延迟
    function getRandomDelay() {
        return Math.floor(Math.random() * 2000) + 1000; // 1000-3000ms之间的随机数
    }

    // 继续导出过程
    async function continueExport() {
        try {
            // 获取存储的数据
            let allContent = Storage.get('allContent', []);
            let currentPage = Storage.get('currentPage', 1);
            let totalPages = Storage.get('totalPages', 0);
            let startPageUrl = Storage.get('startPageUrl', '');
            
            // 禁用按钮
            btn.disabled = true;
            btn.style.backgroundColor = '#95a5a6';
            
            // 显示进度
            showProgress(`正在收集回复 (页面 ${currentPage}/${totalPages})...`);
            
            // 收集当前页面的回复
            const replies = extractReplies();
            allContent = allContent.concat(replies);
            
            // 更新进度和存储
            showProgress(`已收集 ${allContent.length} 条回复 (页面 ${currentPage}/${totalPages})...`);
            Storage.set('allContent', allContent);
            
            // 检查是否有下一页和是否已完成所有页面
            if (currentPage >= totalPages) {
                // 所有页面处理完毕，导出结果
                finishExport(allContent, startPageUrl);
                return;
            }
            
            // 获取下一页链接
            const nextPageLink = document.querySelector('.nxt');
            if (!nextPageLink) {
                // 没有找到下一页链接，提前结束
                finishExport(allContent, startPageUrl);
                return;
            }
            
            // 准备跳转到下一页
            currentPage++;
            Storage.set('currentPage', currentPage);
            
            // 随机等待1-3秒后再跳转到下一页
            const delay = getRandomDelay();
            showProgress(`已收集 ${allContent.length} 条回复 (页面 ${currentPage-1}/${totalPages})... ${Math.round(delay/1000)}秒后跳转至下一页`);
            
            setTimeout(() => {
                // 导航到下一页
                window.location.href = nextPageLink.href;
            }, delay);
            
        } catch (error) {
            // 错误处理
            hideProgress();
            alert(`导出失败: ${error.message}`);
            resetExportState();
        }
    }

    // 完成导出过程
    function finishExport(allContent, startPageUrl) {
        try {
            // 导出结果
            const output = formatContent(allContent);
            
            // 尝试复制到剪贴板
            try {
                GM_setClipboard(output, 'text/plain');
            } catch (e) {
                console.error('复制到剪贴板失败', e);
            }
            
            // 创建下载
            try {
                // 使用原生下载方法作为备选
                const blob = new Blob([output], {type: 'text/plain'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `论坛回复_${Date.now()}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                // 尝试使用GM_download作为首选
                try {
                    GM_download({
                        url: url,
                        name: `论坛回复_${Date.now()}.txt`,
                        saveAs: true
                    });
                } catch (e) {
                    console.log('GM_download不可用，已使用原生下载方法', e);
                }
            } catch (e) {
                console.error('下载失败', e);
                alert('下载失败，请尝试手动复制内容并保存');
            }
            
            // 重置状态
            resetExportState();
            
            // 隐藏进度
            hideProgress();
            
            // 如果不在起始页面，返回起始页面
            if (window.location.href !== startPageUrl) {
                alert(`成功导出 ${allContent.length} 条回复！即将返回起始页面。`);
                window.location.href = startPageUrl;
            } else {
                alert(`成功导出 ${allContent.length} 条回复！`);
            }
        } catch (error) {
            hideProgress();
            alert(`导出失败: ${error.message}`);
            resetExportState();
        } finally {
            // 恢复按钮状态
            btn.disabled = false;
            btn.style.backgroundColor = '#3498db';
        }
    }

    // 重置导出状态
    function resetExportState() {
        Storage.remove('isExporting');
        Storage.remove('allContent');
        Storage.remove('currentPage');
        Storage.remove('totalPages');
        Storage.remove('startPageUrl');
    }

    function getTotalPages() {
        // 查找页码信息
        const pageInfo = document.querySelector('.pg');
        if(!pageInfo) return 1;
        
        // 查找最后一页链接
        const lastPageLink = pageInfo.querySelector('.last');
        if(lastPageLink) {
            // 从文本中提取数字，例如 "... 32" 提取 32
            const match = lastPageLink.textContent.match(/\d+/);
            return match ? parseInt(match[0]) : 1;
        }
        
        // 如果没有明确的最后页链接，查找所有页码链接
        const pageLinks = pageInfo.querySelectorAll('a');
        let maxPage = 1;
        pageLinks.forEach(link => {
            const pageNum = parseInt(link.textContent);
            if(!isNaN(pageNum) && pageNum > maxPage) {
                maxPage = pageNum;
            }
        });
        
        return maxPage;
    }

    function extractReplies() {
        // 修改选择器以适配实际页面结构
        return Array.from(document.querySelectorAll('#postlist .plhin')).map(item => {
            // 排除广告和其他非回复元素
            if (!item.querySelector('.authi a') || !item.querySelector('.t_f')) {
                return null;
            }
            
            return {
                author: item.querySelector('.authi a').innerText,
                time: item.querySelector('[id^="authorposton"]')?.innerText.replace('发表于 ', '') || '未知时间',
                content: item.querySelector('.t_f')?.innerText.replace(/\s+/g, ' ') || '内容为空',
                floor: item.querySelector('[id^="postnum"]')?.innerText.trim() || '未知楼层'
            };
        }).filter(item => item !== null); // 过滤掉空值
    }

    function formatContent(replies) {
        return replies.map((r, index) => 
            `【${r.floor}】 ${r.author} 发表于 ${r.time}\n${r.content}\n${'-'.repeat(60)}`
        ).join('\n\n');
    }
    
    function showProgress(message) {
        progressIndicator.textContent = message;
        progressIndicator.style.display = 'block';
    }
    
    function hideProgress() {
        progressIndicator.style.display = 'none';
    }
})();