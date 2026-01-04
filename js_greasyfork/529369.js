// ==UserScript==
// @name         fuck csdn and geek-docs
// @namespace    null
// @version      0.1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @description  在搜索结果中屏蔽指定域名。支持 Google / Baidu / Bing / 360 搜索
// @license      GNU-GPLv3
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529369/fuck%20csdn%20and%20geek-docs.user.js
// @updateURL https://update.greasyfork.org/scripts/529369/fuck%20csdn%20and%20geek-docs.meta.js
// ==/UserScript==

// 要屏蔽的域名列表
const blockedDomains = ['csdn.net', 'blog.csdn.net', 'time.geekbang.org', 'geekbang.org','geek-docs.com'];

// 搜索引擎域名列表
const searchEngines = [
    'www.baidu.com/s',
    'www.google.com/search',
    'www.bing.com/search',
    'www.so.com/s'
];

// 创建提示框样式
const style = document.createElement('style');
style.textContent = `
.toast-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #333;
    color: white;
    padding: 12px 24px;
    border-radius: 4px;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
	user-select:none;
}
.toast-notification.show {
    opacity: 1;
	user-select:none;
}
.blocked-overlay {
    position: fixed;
	user-select:none;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;
    font-size: 24px;
    font-family: Arial, sans-serif;
    opacity: 1;
}
`;
document.head.appendChild(style);

// 显示提示框函数
function showToast(message, duration = 2000) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 显示提示框
    setTimeout(() => toast.classList.add('show'), 10);
    
    // 定时移除提示框
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function isBlockedDomain() {
    return blockedDomains.some(domain => 
        window.location.hostname.includes(domain)
    );
}

function isSearchEngine() {
    const currentPath = window.location.hostname + window.location.pathname;
    return searchEngines.some(engine => currentPath.includes(engine));
}

function showBlockedPage() {
    document.body.innerHTML = '';
    const overlay = document.createElement('div');
    overlay.className = 'blocked-overlay';
    overlay.textContent = '当前域名已被屏蔽';
    document.body.appendChild(overlay);
}

function hideBlockedSites() {
    const filters = ".source_1Vdff, .iUh30, .b_attribution, .g-linkinfo-a, .c-abstract, .c-title".split(", ")
    const Elements = document.querySelectorAll(".result.c-container, .g, .b_algo, .res-list, .c-container, [class*='result']");
    let blockedCount = 0;
    let blockedUrls = [];
    
    Elements.forEach(function(Item) {
        let shouldBlock = false;
        // 检查元素本身的文本内容
        if (Item.textContent && blockedDomains.some(domain => Item.textContent.toLowerCase().includes(domain))) {
            shouldBlock = true;
        }
        
        // 检查特定选择器
        if (!shouldBlock) {
            for (const filter of filters) {
                const selectedContent = Item.querySelector(filter);
                if (selectedContent !== null) {
                    const contentText = selectedContent.innerText.toLowerCase();
                    if (blockedDomains.some(domain => contentText.includes(domain))) {
                        shouldBlock = true;
                        break;
                    }
                }
            }
        }
        
        if (shouldBlock) {
            // 尝试获取链接URL
            const link = Item.querySelector('a');
            if (link && link.href) {
                blockedUrls.push(link.href);
            }
            Item.parentNode.removeChild(Item);
            blockedCount++;
        }
    });
    
    if (blockedCount > 0) {
        console.log(`[Domain Blocker] 已去除 ${blockedCount} 条屏蔽域名的内容`);
        console.log(`已屏蔽的链接：\n${blockedUrls.map(url => `- ${url}`).join('\n')}`);
        showToast(`已屏蔽 ${blockedCount} 条内容`);
    }
}

// 主函数
function main() {
    if (isBlockedDomain()) {
        showBlockedPage();
    } else if (isSearchEngine()) {
        hideBlockedSites();
        // 监听页面变化（针对动态加载的搜索结果）
        const observer = new MutationObserver(() => {
            hideBlockedSites();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

// 运行主函数
main();
