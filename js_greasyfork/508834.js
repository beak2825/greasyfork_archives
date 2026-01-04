// ==UserScript==
// @name         [Bilibili首页去广告]去除B站首页广告，更改样式
// @version      1.4.0
// @description  去除B站首页的轮播广告，小广告，直播与番剧推荐，并修改若干样式
// @author       You
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?*
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @run-at       document-start
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/508834/%5BBilibili%E9%A6%96%E9%A1%B5%E5%8E%BB%E5%B9%BF%E5%91%8A%5D%E5%8E%BB%E9%99%A4B%E7%AB%99%E9%A6%96%E9%A1%B5%E5%B9%BF%E5%91%8A%EF%BC%8C%E6%9B%B4%E6%94%B9%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/508834/%5BBilibili%E9%A6%96%E9%A1%B5%E5%8E%BB%E5%B9%BF%E5%91%8A%5D%E5%8E%BB%E9%99%A4B%E7%AB%99%E9%A6%96%E9%A1%B5%E5%B9%BF%E5%91%8A%EF%BC%8C%E6%9B%B4%E6%94%B9%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

const OPEN_DEBUG = true;

// 新增一个用于格式化DOM信息的辅助函数
function logDOMInfo(node, source, selector = '') {
  if (!OPEN_DEBUG) return;
  const classes = node.className && typeof node.className === 'string' ? node.className : '';
  const id = node.id ? node.id : '';
  const tag = node.tagName ? node.tagName.toLowerCase() : 'unknown';
  const text = node.textContent ? node.textContent.substring(0, 50).replace(/\s+/g, ' ').trim() : '';

  console.log(
    `%c[广告拦截器]%c 拦截元素: %c${tag}%c${id ? '#'+id : ''}%c${classes ? '.'+classes.replace(/\s+/g, '.') : ''}`,
    'color: #ff6464; font-weight: bold;',
    'color: #333;',
    'color: #0066cc; font-weight: bold;',
    'color: #cc6600;',
    'color: #339933;',
    `\n来源: ${source}${selector ? '\n选择器: '+selector : ''}\n内容: ${text}${text.length >= 50 ? '...' : ''}`
  );

  // 如果浏览器支持，添加DOM节点的引用便于调试
  if (typeof console.dir === 'function') {
    console.dir(node);
  }
}

// 需要移除的广告元素选择器
const selectors = [
  '.recommended-swipe',
  '.bili-header__channel',
  '.feed-card > :not(.enable-no-interest)',
  '.bili-video-card.is-rcmd:not(.enable-no-interest)',
  '.floor-single-card',
  '.bili-live-card',
  '.header-channel',
  '.fixed-card',
  '.palette-button-adcard',
  '#slide_ad'
];

// CSS规则，包括广告隐藏和样式修改
const cssRule = `
/* 隐藏广告元素 - 立即生效防止闪现 */
.recommended-swipe,
.bili-header__channel,
.feed-card > :not(.enable-no-interest),
.bili-video-card.is-rcmd:not(.enable-no-interest),
.floor-single-card,
.bili-live-card,
.header-channel,
.fixed-card,
.palette-button-adcard,
#slide_ad {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  height: 0 !important;
  width: 0 !important;
  max-height: 0 !important;
  max-width: 0 !important;
  overflow: hidden !important;
  position: absolute !important;
  z-index: -9999 !important;
}

/* 其他样式调整 */
.bili-header__banner {
  margin-bottom: 40px !important;
}

.bili-header__banner::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
  z-index: 1;
}

@media (max-width: 1139.9px) {
  .recommended-container_floor-aside .container>*:nth-of-type(5) {
    margin-top: 24px !important;
  }
}

@media (min-width: 1140px) and (max-width: 1299.9px) {
  .recommended-container_floor-aside .container>*:nth-of-type(5) {
    margin-top: 24px !important;
  }
}

@media (min-width: 1140px) and (max-width: 1299.9px) {
  .recommended-container_floor-aside .container>*:nth-of-type(n + 6) {
    margin-top: 24px !important;
  }
}

@media (min-width: 1300px) and (max-width: 1399.9px) {
  .recommended-container_floor-aside .container>*:nth-of-type(5) {
    margin-top: 24px !important;
  }
}

@media (min-width: 1300px) and (max-width: 1399.9px) {
  .recommended-container_floor-aside .container>*:nth-of-type(n + 6) {
    margin-top: 24px !important;
  }
}

@media (min-width: 1400px) and (max-width: 1559.9px) {
  .recommended-container_floor-aside .container>*:nth-of-type(6) {
    margin-top: 24px !important;
  }
}

@media (min-width: 1400px) and (max-width: 1559.9px) {
  .recommended-container_floor-aside .container>*:nth-of-type(7) {
    margin-top: 24px !important;
  }
}

@media (min-width: 1560px) and (max-width: 2059.9px) {
  .recommended-container_floor-aside .container>*:nth-of-type(6) {
    margin-top: 24px !important;
  }
}

@media (min-width: 1560px) and (max-width: 2059.9px) {
  .recommended-container_floor-aside .container>*:nth-of-type(7) {
    margin-top: 24px !important;
  }
}

@media (min-width: 2060px) {
  .recommended-container_floor-aside .container>*:nth-of-type(6) {
    margin-top: 24px !important;
  }
}

@media (min-width: 2060px) {
  .recommended-container_floor-aside .container>*:nth-of-type(7) {
    margin-top: 24px !important;
  }
}

.recommended-container_floor-aside .container>*:nth-of-type(6) {
  margin-top: 24px;
}

.recommended-container_floor-aside .container>*:nth-of-type(7) {
  margin-top: 24px;
}

.recommended-container_floor-aside .container>*:nth-of-type(n + 8) {
  margin-top: 24px !important;
}

.recommended-container_floor-aside .container.is-version8>*:nth-of-type(n + 13) {
  margin-top: 24px !important;
}

.recommended-container_floor-aside .container .floor-single-card:first-of-type {
  margin-top: 24px !important;
}

.recommended-container_floor-aside .container .load-more-anchor .floor-single-card {
  margin-top: 24px !important;
}
`;

// 修改初始化清理函数，增加来源信息
function initialCleanup() {
  console.log('%c[广告拦截器]%c 执行初始化清理', 'color: #ff6464; font-weight: bold;', 'color: #333;');
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(function (element) {
      // 记录初始清理时移除的DOM元素
      logDOMInfo(element, '初始化清理', selector);
      element.remove();
    });
    if (elements.length > 0) {
      console.log(`[广告拦截器] 初始化清理: 通过选择器 "${selector}" 共移除 ${elements.length} 个元素`);
    }
  }
}

// 尝试拦截DOM插入
function setupDOMInterceptor() {
  // 保存原始的appendChild和insertBefore方法
  const originalAppendChild = Element.prototype.appendChild;
  const originalInsertBefore = Element.prototype.insertBefore;

  // 重写appendChild方法
  Element.prototype.appendChild = function(node) {
    // 检查新添加的节点是否匹配广告选择器
    const result = originalAppendChild.call(this, node);

    // 如果是元素节点，检查是否需要移除
    if (node.nodeType === 1) {
      checkAndRemoveAd(node);
    }

    return result;
  };

  // 重写insertBefore方法
  Element.prototype.insertBefore = function(node, referenceNode) {
    // 执行原始方法
    const result = originalInsertBefore.call(this, node, referenceNode);

    // 如果是元素节点，检查是否需要移除
    if (node.nodeType === 1) {
      checkAndRemoveAd(node);
    }

    return result;
  };
}

// 修改checkAndRemoveAd函数添加日志
function checkAndRemoveAd(node) {
  // 避免处理非元素节点
  if (!node || node.nodeType !== 1) {
    return;
  }

  // 可选：白名单检查，防止误删重要元素
  const whitelistClasses = ['video-content', 'bili-video-card__wrap', 'bili-img'];
  for (const cls of whitelistClasses) {
    if (node.classList && node.classList.contains(cls)) {
      return; // 白名单元素不处理
    }
  }

  // 检查节点本身是否匹配选择器
  for (const selector of selectors) {
    try {
      if (node.matches && node.matches(selector)) {
        // 记录被拦截的DOM元素
        logDOMInfo(node, 'DOM拦截器', selector);
        node.remove();
        return;
      }
    } catch (e) {
      console.error('[Ad Blocker] 选择器匹配错误:', e, selector);
    }
  }

  // 检查子节点是否匹配选择器，添加安全检查
  if (node.querySelectorAll) {
    try {
      for (const selector of selectors) {
        const adElements = node.querySelectorAll(selector);
        adElements.forEach(element => {
          // 避免移除包含有价值内容的元素
          const hasImages = element.querySelectorAll('img:not(.ad-img)').length > 0;
          const hasVideos = element.querySelectorAll('video').length > 0;

          if ((hasImages || hasVideos) && !element.classList.contains('ad-confirmed')) {
            // 记录被隐藏的DOM元素
            logDOMInfo(element, 'DOM拦截器(仅隐藏)', selector);
            element.style.cssText = 'visibility: hidden !important; height: 0 !important; overflow: hidden !important;';
          } else {
            // 记录被移除的DOM元素
            logDOMInfo(element, 'DOM拦截器(子元素)', selector);
            element.remove();
          }
        });
      }
    } catch (e) {
      console.error('[Ad Blocker] 移除子元素时出错:', e);
    }
  }
}

// 使用MutationObserver作为后备防线
function setupMutationObserver() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        for (const selector of selectors) {
          removeDOMs(selector);
        }
        break;
      }
    }
  });

  // 配置观察器选项
  const config = {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  };

  // 开始观察整个document
  observer.observe(document.documentElement, config);

  return observer;
}

// 修改removeDOMs函数添加日志
function removeDOMs(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(function (element) {
    // 记录通过选择器查询移除的DOM元素
    logDOMInfo(element, 'MutationObserver监测', selector);
    element.remove();
  });
  if (elements.length > 0) {
    console.log(`[广告拦截器] 通过选择器 "${selector}" 共移除 ${elements.length} 个元素`);
  }
}

// 添加CSS规则
function runCSS(cssRule) {
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(cssRule));

  // 确保样式表尽早应用
  if (document.head) {
    document.head.appendChild(style);
  } else {
    // 如果head还不存在，等待DOM准备好
    const observer = new MutationObserver(() => {
      if (document.head) {
        document.head.appendChild(style);
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
}

// 主函数
(function() {
  // 立即应用CSS规则 - 这是第一道防线
  runCSS(cssRule);

  // 设置DOM原型方法拦截 - 这是第二道防线
  setupDOMInterceptor();

  // DOM加载完成后执行初始清理
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialCleanup);
  } else {
    initialCleanup();
  }

  // 设置MutationObserver作为后备防线
  const observer = setupMutationObserver();

  // 页面卸载时清理
  window.addEventListener('unload', () => {
    if (observer) {
      observer.disconnect();
    }
  });
})();