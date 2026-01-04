// ==UserScript==
// @name         豆瓣电影网盘资源
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  在豆瓣电影页面显示网盘资源按钮，点击可搜索该影片的网盘资源。支持百度网盘、夸克网盘、迅雷网盘等多个网盘平台。
// @author       aipan.me
// @match        https://movie.douban.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      www.aipan.me
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523769/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E7%BD%91%E7%9B%98%E8%B5%84%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/523769/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E7%BD%91%E7%9B%98%E8%B5%84%E6%BA%90.meta.js
// ==/UserScript==

// 注入样式
GM_addStyle(`
  .netdisk-btn {
    margin-left: 10px;
    padding: 0;
    border: 1px solid #6648ff;
    border-radius: 20px;
    color: white;
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
  }

  .netdisk-btn:hover {
    background-color: #6648ff;
  } 

  .netdisk-btn img {
    width: 24px;
    height: 24px;
    display: block;
  }

  .netdisk-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 25px;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    z-index: 10000;
    min-width: 400px;
    max-width: 90vw;
    max-height: 85vh;
    min-height: 300px;
    overflow-y: auto;
    font-family: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  }

  .netdisk-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }

  .netdisk-modal h3 {
    margin: 0;
    font-size: 16px;
    color: #494949;
    font-weight: normal;
  }

  .netdisk-modal .close {
    padding: 0;
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 20px;
    line-height: 1;
    transition: color 0.2s;
  }

  .netdisk-modal .close:hover {
    color: #666;
  }

  .content{
    width: 100%;
  }

  .netdisk-links {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .netdisk-links li {
    margin: 8px 0;
    padding: 12px;
    border: 1px solid #eee;
    border-radius: 3px;
    transition: background-color 0.2s;
    border-radius: 8px;
  }

  .netdisk-links li:hover {
    background: #f9f9f9;
  }

  .netdisk-links .link-name {
    font-size: 12px;
    color: #494949;
  }

  .netdisk-links .service-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #3377aa;
    font-size: 13px;
  }

  .netdisk-links .service-icon {
    width: 24px;
    height: 24px;
    border-radius: 2px;
  }

  .netdisk-links .pwd-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .netdisk-links .pwd {
    color: #666;
    font-size: 13px;
    background: #f5f5f5;
    padding: 3px 6px;
    border-radius: 2px;
    user-select: all;
    font-family: Menlo, Monaco, Consolas, monospace;
  }

  .netdisk-links .copy-btn {
    padding: 3px 8px;
    font-size: 12px;
    color: #3377aa;
    background: none;
    border: 1px solid #3377aa;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .netdisk-links .copy-btn:hover {
    background: #3377aa;
    color: white;
  }

  .netdisk-links .copy-btn.copied {
    background: #5c9a4f;
    border-color: #5c9a4f;
    color: white;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px 20px;
    min-height: 150px;
    width: 100%;
  }

  .loading-text {
    color: #666;
    font-size: 13px;
  }

  .loading-dots::after {
    content: '';
    animation: dots 1.4s steps(4, end) infinite;
  }

  @keyframes dots {
    0%, 20% { content: ''; }
    40% { content: '.'; }
    60% { content: '..'; }
    80%, 100% { content: '...'; }
  }

  .error {
    color: #ca4a4a;
    font-size: 13px;
    text-align: center;
  }

  .close-error-btn {
    margin-top: 15px;
    padding: 6px 15px;
    border: 1px solid #ddd;
    border-radius: 3px;
    background: #f5f5f5;
    color: #666;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s;
  }

  .close-error-btn:hover {
    background: #eee;
    color: #333;
  }

  .netdisk-links .link-info-container{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin-top: 10px;
  }

  .netdisk-links .link-info-container .link-info{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }
`);

// 添加禁用滚动的函数
function disableScroll() {
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = '6px';
}

// 添加恢复滚动的函数
function enableScroll() {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}

// API 请求函数
async function searchNetDisk(movieName, onResultsUpdate) {
  const apiEndpoints = [
    "https://www.aipan.me/api/sources/aipan-search",
    "https://www.aipan.me/api/sources/x",
    "https://www.aipan.me/api/sources/xx",
    "https://www.aipan.me/api/sources/indexI",
    "https://www.aipan.me/api/sources/search-c",
    "https://www.aipan.me/api/sources/xxx",
    "https://www.aipan.me/api/sources/xxxx",
  ];

  // 创建一个数组来存储所有的请求Promise
  const requests = apiEndpoints.map(endpoint => {
    return new Promise(async (resolve) => {
      try {
        const response = await new Promise((innerResolve, innerReject) => {
          GM_xmlhttpRequest({
            method: 'POST',
            url: endpoint,
            headers: {
              'Content-Type': 'application/json'
            },
            data: JSON.stringify({ name: movieName }),
            onload: (response) => innerResolve(JSON.parse(response.responseText)),
            onerror: innerReject
          });
        });
       
        if (response.list && response.list.length > 0) {
          onResultsUpdate(response.list); // 每当有新结果就调用回调
        }
      } catch (error) {
        console.error(`API ${endpoint} 请求失败:`, error);
      }
      resolve(); // 无论成功失败都resolve，这样不会阻塞其他请求
    });
  });
  
  // 等待所有请求完成
  await Promise.all(requests);
}

// 创建弹框函数
function createModal(movieName) {
  const modal = document.createElement('div');
  modal.className = 'netdisk-modal';
  modal.innerHTML = `
    <div class="netdisk-modal-header">
      <h3>${movieName} - 网盘资源</h3>
      <button class="close">×</button>
    </div>
    <div class="content loading">
      <div class="loading-container">
        <div class="loading-text">
          搜索资源中<span class="loading-dots"></span>
        </div>
      </div>
    </div>
  `;
  
  // 禁用背景滚动
  disableScroll();
  
  // 关闭按钮
  modal.querySelector('.close').addEventListener('click', () => {
    enableScroll();
    modal.remove();
  });
  
  // ESC 键关闭
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      enableScroll();
      modal.remove();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
  
  // 点击外部关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      enableScroll();
      modal.remove();
    }
  });
  
  document.body.appendChild(modal);
  return modal;
}

// 渲染结果函数
function renderResults(modal, results) {
  const content = modal.querySelector('.content');
  
  // 如果是第一次渲染，清除loading状态
  if (content.classList.contains('loading')) {
    content.classList.remove('loading');
    content.innerHTML = ''; // 清空loading内容
  }
  
  const validResults = results.filter(result => result.links && result.links.length > 0);
  
  if (validResults.length === 0) {
    return; // 如果没有有效结果，直接返回，保持现有内容
  }
  
  const linksHtml = validResults.map(result => {
    const linksHtml = result.links.map(link => {
      // 根据链接判断网盘类型
      let service = link.service;
      
      try {
        if (link.link && typeof link.link === 'string') {
          const urlString = link.link.startsWith('http') ? link.link : `https://${link.link}`;
          const url = new URL(urlString);
          
          const hostname = url.hostname.toLowerCase();
          if (hostname.includes('baidu')) {
            service = 'BAIDU';
          } else if (hostname.includes('quark')) {
            service = 'QUARK';
          } else if (hostname.includes('xunlei')) {
            service = 'XUNLEI';
          } else if (hostname.includes('aliyun')) {
            service = 'ALIYUN';
          } else if (hostname.includes('uc')) {
            service = 'UC';
          } else if (hostname.includes('alipan')) {
            service = "ALIYUN";
          } else if (hostname.includes('cloud.189.cn')) {
            service = "189";
          }
        }
      } catch (error) {
        console.warn('Invalid URL:', link.link, error);
      }

      // 网盘图标
      const iconUrl =
        {
          BAIDU:
            "https://nd-static.bdstatic.com/m-static/v20-main/favicon-main.ico",
          QUARK:
            "https://gw.alicdn.com/imgextra/i3/O1CN018r2tKf28YP7ev0fPF_!!6000000007944-2-tps-48-48.png",
          XUNLEI: "https://www.xunlei.com/favicon.ico",
          UC: "https://image.uc.cn/s/uae/g/61/uc-logo-v2.png",
          ALIYUN:
            "https://img.alicdn.com/imgextra/i2/O1CN01DOYcs71v3B6bOemVM_!!6000000006116-2-tps-512-512.png",
          189: "https://cloud.189.cn/web/logo.ico",
        }[service] || "";
      
      // 修改提取码显示
      const pwdHtml = link.pwd ? `
        <div class="pwd-container">
          <span class="pwd">提取码：${link.pwd}</span>
          <button class="copy-btn" data-pwd="${link.pwd}">复制</button>
        </div>
      ` : '';
      
      return ` 
        <div class="link-info">
          <a href="${link.link}" target="_blank" class="service-link">
            <img src="${iconUrl}" class="service-icon" onerror="this.style.display='none'">
          </a>
          ${pwdHtml}
        </div>`;
    }).join('');
    
    return `<ul class="netdisk-links"><li><div class="link-name">${result.name}</div><div class="link-info-container">${linksHtml}</div></li></ul>`;
  }).join('');
  
  // 将新结果添加到现有内容中
  content.insertAdjacentHTML('beforeend', linksHtml);
  
  // 添加复制按钮功能
  content.querySelectorAll('.copy-btn').forEach(btn => {
    // 检查按钮是否已经添加了事件监听器
    if (!btn.hasAttribute('data-has-click-listener')) {
      btn.setAttribute('data-has-click-listener', 'true');
      btn.addEventListener('click', () => {
        const pwd = btn.dataset.pwd;
        navigator.clipboard.writeText(pwd).then(() => {
          const originalText = btn.textContent;
          btn.textContent = '已复制';
          btn.classList.add('copied');
          
          // 移除其他按钮的 copied 类
          content.querySelectorAll('.copy-btn').forEach(otherBtn => {
            if (otherBtn !== btn) {
              otherBtn.classList.remove('copied');
              otherBtn.textContent = '复制';
            }
          });
          
          setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copied');
          }, 2000);
        });
      });
    }
  });
}

// 错误处理函数
function showError(modal, message) {
  const content = modal.querySelector('.content');
  content.classList.remove('loading');
  content.innerHTML = `
    <div class="loading-container">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ca4a4a" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
      <div class="error">${message}</div>
    </div>
  `;
  
  // 添加一个关闭按钮
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-error-btn';
  closeBtn.textContent = '关闭';
  closeBtn.onclick = () => {
    enableScroll();
    modal.remove();
  };
  content.querySelector('.loading-container').appendChild(closeBtn);
}

// 添加网盘资源按钮函数
function addNetDiskLinks() {
  console.log('开始查找电影标题');
  
  const movieSelectors = [
    '.screening-bd .title a',
    '.gaia-movie .item .title a',
    '.gaia-tv .item .title a',
    'h1 span[property="v:itemreviewed"]',
  ];
  
  let movieElements = [];
  movieSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    console.log(`使用选择器 ${selector} 找到 ${elements.length} 个元素`);
    movieElements = [...movieElements, ...elements];
  });
  
  console.log('总共找到电影元素:', movieElements.length);
  
  movieElements.forEach(titleElement => {
    const parentElement = titleElement.closest('h1') || titleElement.parentNode;
    if (parentElement.querySelector('.netdisk-btn')) {
      return;
    }
    
    const movieName = titleElement.textContent.trim();
    console.log('处理电影:', movieName);
    
    const resourceButton = document.createElement('button');
    resourceButton.className = 'netdisk-btn';
    
    // 创建图标
    const icon = document.createElement('img');
    icon.src = 'https://www.aipan.me/favicon.ico'; // 这里放你的图标base64
    icon.alt = '网盘资源';
    resourceButton.appendChild(icon);
    
    if (titleElement.matches('h1 span[property="v:itemreviewed"]')) {
      resourceButton.style.marginLeft = '10px';
      resourceButton.style.width = '24px';
      resourceButton.style.height = '24px';
    }
    
    resourceButton.addEventListener('click', async () => {
      const modal = createModal(movieName);
      try {
        // 修改为使用回调函数来更新结果
        let hasResults = false;
        await searchNetDisk(movieName, (newResults) => {
          hasResults = true;
          renderResults(modal, newResults);
        });
        
        // 如果所有API都完成了但没有任何结果，显示无结果消息
        if (!hasResults) {
          showError(modal, '暂无可用资源，请稍后再试');
        }
      } catch (error) {
        console.error('搜索失败:', error);
        showError(modal, '搜索失败，请稍后重试');
      }
    });
    
    parentElement.appendChild(resourceButton);
  });
}

// 初始化脚本
(function() {
  'use strict';
  
  // 创建观察器
  const observer = new MutationObserver(() => {
    addNetDiskLinks();
  });
  
  // 初始化
  try {
    addNetDiskLinks();
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    window.addEventListener('load', addNetDiskLinks);
  } catch (error) {
    console.error('插件运行出错:', error);
  }
})();