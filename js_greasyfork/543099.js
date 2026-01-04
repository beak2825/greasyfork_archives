// ==UserScript==
// @name            Hexo.io 插件页面增强：star数、更新时间
// @name:en         Hexo.io plugin page enhancements: star count, update time
// @namespace       http://tampermonkey.net/
// @version         0.1
// @description     增强 Hexo 插件页面，获取并显示 GitHub 仓库的 star 数和最后更新时间，支持排序和缓存
// @description:en  Enhance the Hexo plugin page to obtain and display the number of stars and last update time of the GitHub repository, and support sorting and caching
// @author          二次蓝
// @match           https://hexo.io/plugins/
// @grant           GM_xmlhttpRequest
// @grant           GM_setValue
// @grant           GM_getValue
// @connect         api.github.com
// @downloadURL https://update.greasyfork.org/scripts/543099/Hexoio%20%E6%8F%92%E4%BB%B6%E9%A1%B5%E9%9D%A2%E5%A2%9E%E5%BC%BA%EF%BC%9Astar%E6%95%B0%E3%80%81%E6%9B%B4%E6%96%B0%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/543099/Hexoio%20%E6%8F%92%E4%BB%B6%E9%A1%B5%E9%9D%A2%E5%A2%9E%E5%BC%BA%EF%BC%9Astar%E6%95%B0%E3%80%81%E6%9B%B4%E6%96%B0%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PLUGIN_SELECTOR = '.plugin';
  const GITHUB_API = 'https://api.github.com/repos/';
  const plugins = [];
  const CACHE_KEY = 'hexo_plugin_info_cache';
  const TOKEN_KEY = 'github_token';
  const CACHE_DURATION = 1000 * 60 * 60 * 24;
  const THEME_COLOR = '#5AC8FA';

  const SVG_ICONS = {
    settings: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/></svg>`,
    close: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/></svg>`,
    rocket: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
    trash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9M7 6H17V19H7V6M9 8V17H11V8H9M13 8V17H15V8H13Z"/></svg>`,
    key: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14C5.9 14 5 13.1 5 12S5.9 10 7 10 9 10.9 9 12 8.1 14 7 14M12.65 10C11.83 7.67 9.61 6 7 6C3.69 6 1 8.69 1 12S3.69 18 7 18C9.61 18 11.83 16.33 12.65 14H17V18H21V14H23V10H12.65Z"/></svg>`,
    sort: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 21L14 17H17V7H14L18 3L22 7H19V17H22M2 19V17H12V19M2 13V11H9V13M2 7V5H6V7H2Z"/></svg>`,
    star: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/></svg>`,
    calendar: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M19 19H5V8H19V19M7 10H12V15H7"/></svg>`,
    warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="#ff6b6b"><path d="M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z"/></svg>`
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const extractRepo = (url) => {
    const match = url.match(/github\.com\/([\w-]+\/[\w.-]+)/);
    return match ? match[1] : null;
  };

  function checkCacheExpiry() {
    try {
      const raw = GM_getValue(CACHE_KEY, null);
      if (!raw) return { hasExpired: false, total: 0, expired: 0 };
      
      const parsed = JSON.parse(raw);
      const now = Date.now();
      let total = 0;
      let expired = 0;
      
      Object.entries(parsed).forEach(([, v]) => {
        total++;
        if (now - v.timestamp >= CACHE_DURATION) {
          expired++;
        }
      });
      
      return { hasExpired: expired > 0, total, expired };
    } catch {
      return { hasExpired: false, total: 0, expired: 0 };
    }
  }

  function displayCachedData() {
    const pluginElements = Array.from(document.querySelectorAll(PLUGIN_SELECTOR));
    const cache = loadCache();
    let displayed = 0;
    
    pluginElements.forEach(el => {
      const a = el.querySelector('a[href*="github.com"]');
      const repo = a ? extractRepo(a.href) : null;
      if (!repo || !cache[repo]) return;
      
      const data = cache[repo].data;
      const isExpired = Date.now() - cache[repo].timestamp >= CACHE_DURATION;
      
      let extra = el.querySelector('.github-info');
      if (!extra) {
        extra = document.createElement('div');
        extra.className = 'github-info';
        extra.style.cssText = `
          font-size: 12px;
          color: #666;
          margin-top: 5px;
          padding: 4px 8px;
          background: ${isExpired ? '#fff3cd' : '#f8f9fa'};
          border-radius: 4px;
          border-left: 3px solid ${isExpired ? '#ffc107' : THEME_COLOR};
        `;
        el.appendChild(extra);
      }
      
      const updatedDate = data.updated ? new Date(data.updated).toLocaleDateString('zh-CN') : '未知';
      extra.innerHTML = `
        <span style="color: #ffc107; vertical-align: middle;">${SVG_ICONS.star}</span> ${data.stars} | 
        <span style="color: #28a745; vertical-align: middle;">${SVG_ICONS.calendar}</span> ${updatedDate}
        ${isExpired ? `<span style="color: #ff6b6b; margin-left: 8px; vertical-align: middle;">${SVG_ICONS.warning} 数据已过期</span>` : ''}
      `;
      
      plugins.push({
        element: el,
        repo: repo,
        stars: data.stars,
        updated: data.updated
      });
      
      displayed++;
    });
    
    return displayed;
  }

  function loadCache() {
    try {
      const raw = GM_getValue(CACHE_KEY, null);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      const now = Date.now();
      return Object.fromEntries(
        Object.entries(parsed).filter(([, v]) => now - v.timestamp < CACHE_DURATION)
      );
    } catch (e) {
      console.warn('缓存加载失败:', e);
      return {};
    }
  }

  function saveCache(cache) {
    try {
      GM_setValue(CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
      console.warn('缓存保存失败:', e);
    }
  }

  const fetchGitHubInfo = (repo, cache) => {
    return new Promise((resolve) => {
      if (cache[repo]) {
        return resolve(cache[repo].data);
      }

      const token = GM_getValue(TOKEN_KEY, '');
      const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Hexo-Plugin-Enhancer/0.1'
      };
      
      if (token) {
        headers['Authorization'] = `token ${token}`;
      }

      GM_xmlhttpRequest({
        method: 'GET',
        url: GITHUB_API + repo,
        headers: headers,
        timeout: 15000,
        onload: function (response) {
          if (response.status === 200) {
            try {
              const data = JSON.parse(response.responseText);
              const result = {
                stars: data.stargazers_count || 0,
                updated: data.pushed_at || data.updated_at || ''
              };

              cache[repo] = { timestamp: Date.now(), data: result };
              resolve(result);
            } catch (e) {
              console.warn(`解析 ${repo} 数据失败:`, e);
              resolve(null);
            }
          } else if (response.status === 403) {
            console.warn(`API限制达到上限 ${repo}: ${response.status}`);
            resolve(null);
          } else {
            console.warn(`获取 ${repo} 信息失败: ${response.status}`);
            resolve(null);
          }
        },
        onerror: (error) => {
          console.warn(`请求 ${repo} 失败:`, error);
          resolve(null);
        },
        ontimeout: () => {
          console.warn(`请求 ${repo} 超时`);
          resolve(null);
        }
      });
    });
  };

  let loadingBox = null;

  function showLoadingMessage(total = 0, current = 0) {
    if (!loadingBox) {
      loadingBox = document.createElement('div');
      loadingBox.id = 'hexo-plugin-loading-info';
      loadingBox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: linear-gradient(90deg, #667eea, #764ba2);
        color: #fff;
        padding: 12px;
        font-size: 14px;
        z-index: 9999;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;
      document.body.appendChild(loadingBox);
    }
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    const token = GM_getValue(TOKEN_KEY, '');
    const mode = token ? '高速模式（并发50个）' : '标准模式（并发20个）';
    loadingBox.innerHTML = `
      <div>${SVG_ICONS.rocket} 正在抓取 GitHub 信息...（${current} / ${total}）- ${percentage}% | ${mode}</div>
      <div style="background: rgba(255,255,255,0.3); height: 4px; margin-top: 8px; border-radius: 2px;">
        <div style="background: #fff; height: 100%; width: ${percentage}%; border-radius: 2px; transition: width 0.3s ease;"></div>
      </div>
    `;
  }

  function showFinishedMessage(total, cached = 0) {
    if (loadingBox) {
      loadingBox.style.background = 'linear-gradient(90deg, #56ab2f, #a8e6cf)';
      loadingBox.innerHTML = `${SVG_ICONS.rocket} 抓取完成（共 ${total} 项，缓存命中 ${cached} 项）`;
      setTimeout(() => {
        if (loadingBox && loadingBox.parentNode) {
          loadingBox.remove();
          loadingBox = null;
        }
      }, 3000);
    }
  }

  async function enhance() {
    const pluginElements = Array.from(document.querySelectorAll(PLUGIN_SELECTOR));
    if (!pluginElements.length) {
      console.warn('未找到插件元素');
      return;
    }

    const total = pluginElements.length;
    let current = 0;
    let cached = 0;

    const cache = loadCache();
    showLoadingMessage(total, current);

    const token = GM_getValue(TOKEN_KEY, '');
    const concurrency = token ? 50 : 20;

    const pluginInfos = [];
    for (const el of pluginElements) {
      const a = el.querySelector('a[href*="github.com"]');
      const repo = a ? extractRepo(a.href) : null;
      if (repo) {
        pluginInfos.push({
          element: el,
          repo: repo,
          stars: 0,
          updated: ''
        });
      }
    }

    const processBatch = async (batch) => {
      const promises = batch.map(async (info) => {
        const wasCached = !!cache[info.repo];
        const data = await fetchGitHubInfo(info.repo, cache);
        
        if (wasCached) cached++;
        
        if (data) {
          info.stars = data.stars;
          info.updated = data.updated;

          let extra = info.element.querySelector('.github-info');
          if (!extra) {
            extra = document.createElement('div');
            extra.className = 'github-info';
            extra.style.cssText = `
              font-size: 12px;
              color: #666;
              margin-top: 5px;
              padding: 4px 8px;
              background: #f8f9fa;
              border-radius: 4px;
              border-left: 3px solid #007bff;
            `;
            info.element.appendChild(extra);
          }
          
          const updatedDate = data.updated ? new Date(data.updated).toLocaleDateString('zh-CN') : '未知';
          extra.innerHTML = `
            <span style="color: #ffc107; vertical-align: middle;">${SVG_ICONS.star}</span> ${data.stars} | 
            <span style="color: #28a745; vertical-align: middle;">${SVG_ICONS.calendar}</span> ${updatedDate}
          `;
        }

        plugins.push(info);
        current++;
        showLoadingMessage(total, current);
        return info;
      });

      return Promise.all(promises);
    };

    for (let i = 0; i < pluginInfos.length; i += concurrency) {
      const batch = pluginInfos.slice(i, i + concurrency);
      await processBatch(batch);
      
      // 每批之间稍微延迟，避免请求过于密集
      if (i + concurrency < pluginInfos.length) {
        await sleep(token ? 100 : 500);
      }
      
      saveCache(cache);
    }

    showFinishedMessage(total, cached);
    injectSortControls();
  }

  function injectControls() {
    const cacheStatus = checkCacheExpiry();
    
    const floatingBall = document.createElement('div');
    floatingBall.id = 'hexo-plugin-floating-ball';
    
    const ballContent = document.createElement('div');
    ballContent.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      position: relative;
    `;
    
    const mainIcon = document.createElement('div');
    mainIcon.innerHTML = SVG_ICONS.settings;
    mainIcon.style.cssText = `
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    ballContent.appendChild(mainIcon);
    
    if (cacheStatus.hasExpired) {
      const badge = document.createElement('div');
      badge.innerHTML = cacheStatus.expired;
      badge.style.cssText = `
        position: absolute;
        top: -5px;
        right: -5px;
        background: #ff6b6b;
        color: white;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        font-size: 10px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
      `;
      ballContent.appendChild(badge);
    }
    
    floatingBall.appendChild(ballContent);
    floatingBall.title = cacheStatus.hasExpired ? 
      `Hexo 插件增强设置 (${cacheStatus.expired}项缓存已过期)` : 
      'Hexo 插件增强设置';
    
    floatingBall.style.cssText = `
      position: fixed;
      top: 50%;
      right: 20px;
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, ${THEME_COLOR}, #4A9EFF);
      border-radius: 50%;
      cursor: pointer;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(90, 200, 250, 0.3);
      transition: all 0.3s ease;
      user-select: none;
    `;
    
    // 拖拽功能
    let isDragging = false;
    let hasDragged = false;
    let startX, startY, startLeft, startTop;
    let mouseDownTime = 0;
    const DRAG_THRESHOLD = 5;
    const CLICK_TIME_THRESHOLD = 200;
    
    floatingBall.addEventListener('mousedown', (e) => {
      mouseDownTime = Date.now();
      isDragging = false;
      hasDragged = false;
      startX = e.clientX;
      startY = e.clientY;
      const rect = floatingBall.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (mouseDownTime === 0) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // 只有移动距离超过阈值才开始拖拽
      if (distance > DRAG_THRESHOLD && !isDragging) {
        isDragging = true;
        hasDragged = true;
        floatingBall.style.cursor = 'grabbing';
      }
      
      if (isDragging) {
        let newLeft = startLeft + deltaX;
        let newTop = startTop + deltaY;
        
        // 边界限制
        const maxLeft = window.innerWidth - 50;
        const maxTop = window.innerHeight - 50;
        
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));
        
        floatingBall.style.left = newLeft + 'px';
        floatingBall.style.top = newTop + 'px';
        floatingBall.style.right = 'auto';
        floatingBall.style.transform = 'none';
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (mouseDownTime > 0) {
        const clickDuration = Date.now() - mouseDownTime;
        
        // 重置状态
        mouseDownTime = 0;
        if (isDragging) {
          isDragging = false;
          floatingBall.style.cursor = 'pointer';
        }
        
        if (!hasDragged && clickDuration < CLICK_TIME_THRESHOLD) {
          // 延迟触发点击，确保拖拽状态已重置
          setTimeout(() => {
            floatingBall.dispatchEvent(new Event('ballclick'));
          }, 10);
        }
      }
    });
    
    floatingBall.addEventListener('mouseenter', () => {
      if (!isDragging) {
        const currentTransform = floatingBall.style.transform;
        if (currentTransform.includes('translateY(-50%)')) {
          floatingBall.style.transform = 'translateY(-50%) scale(1.1)';
        } else {
          floatingBall.style.transform = 'scale(1.1)';
        }
        floatingBall.style.boxShadow = '0 6px 20px rgba(90, 200, 250, 0.5)';
      }
    });
    
    floatingBall.addEventListener('mouseleave', () => {
      if (!isDragging) {
        const currentTransform = floatingBall.style.transform;
        if (currentTransform.includes('translateY(-50%)')) {
          floatingBall.style.transform = 'translateY(-50%)';
        } else {
          floatingBall.style.transform = 'none';
        }
        floatingBall.style.boxShadow = '0 4px 12px rgba(90, 200, 250, 0.3)';
      }
    });
    
    document.body.appendChild(floatingBall);
    
    // 立即显示缓存数据
    const displayedCount = displayCachedData();
    if (displayedCount > 0) {
      console.log(`已显示 ${displayedCount} 项缓存数据`);
      // 延迟启用排序控制，确保DOM已完全渲染
      setTimeout(() => {
        injectSortControls();
      }, 100);
    }

    const container = document.createElement('div');
    container.id = 'hexo-plugin-controls';
    container.style.cssText = `
      position: fixed;
      top: 50%;
      right: 80px;
      width: 400px;
      max-height: 80vh;
      overflow-y: auto;
      padding: 20px;
      background: white;
      border-radius: 12px;
      border: 1px solid #dee2e6;
      box-shadow: 0 8px 32px rgba(90, 200, 250, 0.15);
      z-index: 9999;
      transform: translateY(-50%) scale(0);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      transform-origin: right center;
    `;
    
    const title = document.createElement('div');
    title.innerHTML = 'Hexo 插件增强设置';
    title.style.cssText = `
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 20px;
      text-align: center;
      border-bottom: 2px solid ${THEME_COLOR};
      padding-bottom: 10px;
    `;
    container.appendChild(title);
    
    document.body.appendChild(container);
    
    let isOpen = false;
    floatingBall.addEventListener('ballclick', () => {
      isOpen = !isOpen;
      if (isOpen) {
        container.style.transform = 'translateY(-50%) scale(1)';
        container.style.opacity = '1';
        mainIcon.innerHTML = SVG_ICONS.close;
        floatingBall.title = '点击关闭设置面板';
      } else {
        container.style.transform = 'translateY(-50%) scale(0)';
        container.style.opacity = '0';
        mainIcon.innerHTML = SVG_ICONS.settings;
        floatingBall.title = cacheStatus.hasExpired ? 
          `Hexo 插件增强设置 (${cacheStatus.expired}项缓存已过期)` : 
          'Hexo 插件增强设置';
      }
    });
    
    document.addEventListener('click', (e) => {
      if (isOpen && !container.contains(e.target) && !floatingBall.contains(e.target)) {
        isOpen = false;
        container.style.transform = 'translateY(-50%) scale(0)';
        container.style.opacity = '0';
        mainIcon.innerHTML = SVG_ICONS.settings;
        floatingBall.title = cacheStatus.hasExpired ? 
          `Hexo 插件增强设置 (${cacheStatus.expired}项缓存已过期)` : 
          'Hexo 插件增强设置';
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        isOpen = false;
        container.style.transform = 'translateY(-50%) scale(0)';
        container.style.opacity = '0';
        mainIcon.innerHTML = SVG_ICONS.settings;
        floatingBall.title = cacheStatus.hasExpired ? 
          `Hexo 插件增强设置 (${cacheStatus.expired}项缓存已过期)` : 
          'Hexo 插件增强设置';
      }
    });

    const tokenSection = document.createElement('div');
    tokenSection.style.cssText = `
      margin-bottom: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid ${THEME_COLOR};
    `;
    
    const tokenLabel = document.createElement('label');
    tokenLabel.innerHTML = `${SVG_ICONS.key} GitHub Token`;
    tokenLabel.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #495057;
      font-size: 14px;
    `;
    
    const tokenDesc = document.createElement('div');
    tokenDesc.textContent = '不设置每小时每IP只能请求60次api，设置后可以提高到5,000次';
    tokenDesc.style.cssText = `
      font-size: 12px;
      color: #6c757d;
      margin-bottom: 10px;
    `;
    tokenSection.appendChild(tokenLabel);
    tokenSection.appendChild(tokenDesc);
    
    const tokenInput = document.createElement('input');
    tokenInput.type = 'password';
    tokenInput.placeholder = '输入GitHub Personal Access Token';
    tokenInput.value = GM_getValue(TOKEN_KEY, '');
    tokenInput.style.cssText = `
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ced4da;
      border-radius: 6px;
      margin-bottom: 10px;
      font-size: 14px;
      box-sizing: border-box;
      transition: border-color 0.3s;
    `;
    tokenInput.addEventListener('focus', () => {
      tokenInput.style.borderColor = THEME_COLOR;
    });
    tokenInput.addEventListener('blur', () => {
      tokenInput.style.borderColor = '#ced4da';
    });
    tokenSection.appendChild(tokenInput);
    
    const saveTokenBtn = document.createElement('button');
    saveTokenBtn.textContent = '保存Token';
    saveTokenBtn.style.cssText = `
      padding: 8px 16px;
      background: linear-gradient(135deg, ${THEME_COLOR}, #4A9FE7);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      margin-right: 10px;
      transition: all 0.3s;
    `;
    
    saveTokenBtn.addEventListener('mouseenter', () => {
      saveTokenBtn.style.transform = 'translateY(-1px)';
      saveTokenBtn.style.boxShadow = `0 4px 12px rgba(90, 200, 250, 0.3)`;
    });
    
    saveTokenBtn.addEventListener('mouseleave', () => {
      saveTokenBtn.style.transform = 'none';
      saveTokenBtn.style.boxShadow = 'none';
    });
    saveTokenBtn.addEventListener('click', () => {
      GM_setValue(TOKEN_KEY, tokenInput.value.trim());
      alert('Token已保存！');
    });
    tokenSection.appendChild(saveTokenBtn);
    
    const tokenHelp = document.createElement('div');
    tokenHelp.innerHTML = `
      <small style="color: #6c757d; line-height: 1.4;">
        💡 在 <a href="https://github.com/settings/tokens" target="_blank" style="color: #007bff;">GitHub Settings</a> 创建Token，无需任何权限，填写好名称描述，即可提高API限制
      </small>
    `;
    tokenSection.appendChild(tokenHelp);
    
    container.appendChild(tokenSection);

    const controlSection = document.createElement('div');
    controlSection.style.cssText = `
      margin-bottom: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid ${THEME_COLOR};
    `;
    
    const startBtn = document.createElement('button');
    startBtn.innerHTML = `${SVG_ICONS.rocket} 开始获取插件信息`;
    startBtn.style.cssText = `
      width: 100%;
      padding: 12px 16px;
      background: linear-gradient(135deg, ${THEME_COLOR}, #4A9FE7);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      margin-bottom: 10px;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    `;
    
    startBtn.addEventListener('mouseenter', () => {
      startBtn.style.transform = 'translateY(-2px)';
      startBtn.style.boxShadow = '0 4px 16px rgba(90, 200, 250, 0.4)';
    });
    
    startBtn.addEventListener('mouseleave', () => {
      startBtn.style.transform = 'none';
      startBtn.style.boxShadow = 'none';
    });
    startBtn.addEventListener('click', enhance);
    controlSection.appendChild(startBtn);
    
    const clearCacheBtn = document.createElement('button');
    clearCacheBtn.innerHTML = `${SVG_ICONS.trash} 清除缓存`;
    clearCacheBtn.style.cssText = `
      width: 100%;
      padding: 12px 16px;
      background: linear-gradient(135deg, #FF6B6B, #FF5252);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    `;
    
    clearCacheBtn.addEventListener('mouseenter', () => {
      clearCacheBtn.style.transform = 'translateY(-2px)';
      clearCacheBtn.style.boxShadow = '0 4px 16px rgba(255, 107, 107, 0.4)';
    });
    
    clearCacheBtn.addEventListener('mouseleave', () => {
      clearCacheBtn.style.transform = 'none';
      clearCacheBtn.style.boxShadow = 'none';
    });
    clearCacheBtn.addEventListener('click', () => {
      GM_setValue(CACHE_KEY, '{}');
      alert('缓存已清除！');
    });
    controlSection.appendChild(clearCacheBtn);
    
    container.appendChild(controlSection);

    const sortSection = document.createElement('div');
    sortSection.className = 'sort-section';
    sortSection.style.cssText = `
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid ${THEME_COLOR};
    `;
    
    const label = document.createElement('label');
    label.innerHTML = `${SVG_ICONS.sort} 排序方式`;
    label.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      margin-bottom: 10px;
      color: #495057;
      font-size: 14px;
    `;
    sortSection.appendChild(label);

    const select = document.createElement('select');
    select.style.cssText = `
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ced4da;
      border-radius: 6px;
      background: white;
      font-size: 14px;
      cursor: pointer;
      box-sizing: border-box;
      transition: border-color 0.3s;
    `;
    select.addEventListener('focus', () => {
      select.style.borderColor = THEME_COLOR;
    });
    select.addEventListener('blur', () => {
      select.style.borderColor = '#ced4da';
    });
    select.innerHTML = `
      <option value="default">默认顺序</option>
      <option value="stars">⭐ Star 数（高到低）</option>
      <option value="updated">📅 更新时间（新到旧）</option>
    `;
    select.disabled = true;
    select.style.opacity = '0.5';
    
    select.addEventListener('change', () => {
      const val = select.value;
      
      const pluginElements = Array.from(document.querySelectorAll(PLUGIN_SELECTOR));
      if (pluginElements.length === 0) {
        console.warn('未找到插件元素，无法排序');
        return;
      }
      
      const pluginsWithData = pluginElements.map(el => {
        const a = el.querySelector('a[href*="github.com"]');
        const repo = a ? extractRepo(a.href) : null;
        const githubInfo = el.querySelector('.github-info');
        
        let stars = 0;
        let updated = '';
        
        if (githubInfo && repo) {
          // 从缓存或全局plugins数组中获取数据
          const cachedPlugin = plugins.find(p => p.repo === repo);
          if (cachedPlugin) {
            stars = cachedPlugin.stars || 0;
            updated = cachedPlugin.updated || '';
          } else {
            // 从缓存中获取数据
            const cache = loadCache();
            if (cache[repo]) {
              stars = cache[repo].data.stars || 0;
              updated = cache[repo].data.updated || '';
            }
          }
        }
        
        return {
          element: el,
          repo: repo,
          stars: stars,
          updated: updated
        };
      });
      
      // 根据选择的排序方式进行排序
      let sorted = [...pluginsWithData];
      if (val === 'stars') {
        sorted.sort((a, b) => b.stars - a.stars);
      } else if (val === 'updated') {
        sorted.sort((a, b) => {
          const dateA = new Date(a.updated || 0);
          const dateB = new Date(b.updated || 0);
          return dateB - dateA;
        });
      }
      
      const firstPlugin = pluginElements[0];
      const parent = firstPlugin.parentNode;
      
      if (parent) {
        sorted.forEach(info => {
          parent.appendChild(info.element);
        });
        console.log(`已按${val === 'stars' ? 'Star数' : val === 'updated' ? '更新时间' : '默认顺序'}排序`);
      } else {
        console.warn('未找到插件父容器，无法排序');
      }
    });

    sortSection.appendChild(select);
    container.appendChild(sortSection);

    const authorSection = document.createElement('div');
    authorSection.style.cssText = `
      padding: 12px 15px 0;
      text-align: center;
      margin-top: 10px;
    `;
    
    const authorInfo = document.createElement('div');
    authorInfo.innerHTML = 'Made with ❤️ by 二次蓝 <a href="https://blog.ercilan.cn" target="_blank" style="color: #007bff; text-decoration: none; font-weight: 500;">https://blog.ercilan.cn</a>';
    authorInfo.style.cssText = `
      font-size: 12px;
      color: #6c757d;
      line-height: 1.4;
    `;
    
    authorSection.appendChild(authorInfo);
    container.appendChild(authorSection);
  }

  function injectSortControls() {
    const container = document.querySelector('#hexo-plugin-controls');
    if (!container) return;
    
    const sortSection = container.querySelector('.sort-section');
    if (!sortSection) return;
    
    const select = sortSection.querySelector('select');
    if (!select) return;
    
    if (plugins.length > 0) {
      select.disabled = false;
      select.style.opacity = '1';
      console.log('排序控制已启用，可排序插件数量:', plugins.length);
    } else {
      const cache = loadCache();
      const cacheCount = Object.keys(cache).length;
      if (cacheCount > 0) {
        select.disabled = false;
        select.style.opacity = '1';
        console.log('基于缓存数据启用排序控制，缓存项数量:', cacheCount);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(injectControls, 500);
    });
  } else {
    setTimeout(injectControls, 500);
  }

})();