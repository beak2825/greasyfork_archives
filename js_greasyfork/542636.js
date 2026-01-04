// ==UserScript==
// @name         Linux.do 浏览助手
// @namespace    https://github.com/
// @homepage     https://github.com/
// @version      5.2.1
// @description  Linux.do 弹窗式浏览，支持帖子详情加载、楼中楼评论、阅读追踪、已访问标记
// @match        https://linux.do/*
// @grant        GM_addStyle
// @license      MIT
// @connect      linux.do
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/542636/Linuxdo%20%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/542636/Linuxdo%20%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function(){
    'use strict';
  
    // ==================== 常量配置 ====================
    const CONFIG = {
      PAGE_SIZE: 20,
      THROTTLE_DELAY: 100,
      TOAST_DURATION: 3000,
      LOADING_DELAY: 150,
      SCROLL_TRIGGER_DISTANCE: 300,
      SELECTORS: {
        POST_LINKS: 'a.title,a.topic-link,a.search-link',
        POST_POPUP: '#post-popup',
        IMAGE_LIGHTBOX: '#image-lightbox-overlay',
        CONTENT_WRAPPER: '.post-popup-content-wrapper',
        CONTENT_CONTAINER: '.post-content-container',
        STICKY_EDITOR: '.sticky-comment-editor'
      },
      CSS_CLASSES: {
        MODAL_OPEN: 'modal-open',
        POST_BOX: 'post-box',
        COMMENT_BOX: 'comment-box',
        LOADING_INDICATOR: 'loading-indicator',
        TOAST_MESSAGE: 'toast-message',
        TOAST_ERROR: 'error',
        TOAST_SHOW: 'show'
      },
      API_ENDPOINTS: {
        TOPIC: '/t/{slug}/{id}.json',
        POSTS: '/t/{topicId}/posts.json',
        SUBMIT_POST: '/posts'
      }
    };
  
    // ==================== 全局状态管理 ====================
    const state = {
      currentTopicId: null,
      currentSlug: null,
      nextPostIds: [],
      postDataCache: [],
      isLoadingMore: false
    };
  
    // ==================== DOM 元素缓存 ====================
    const elements = {
      postPopup: null,
      openFullBtn: null,
      imageLightbox: null,
      backToTopBtn: null
    };
  
    // ==================== 已访问帖子跟踪模块 ====================
    const VisitedTracker = {
      storageKey: 'linuxdo_visited_posts',
      visitedPosts: new Map(), // 改用Map来存储时间戳
  
      init() {
        this.loadVisitedPosts();
        this.markExistingVisitedLinks();
        this.setupLinkObserver();
      },
  
      loadVisitedPosts() {
        try {
          const stored = localStorage.getItem(this.storageKey);
          if (stored) {
            const visitedData = JSON.parse(stored);
            this.visitedPosts = new Map(visitedData);
          }
        } catch (error) {
          console.warn('加载已访问帖子记录失败:', error);
          this.visitedPosts = new Map();
        }
      },
  
      saveVisitedPosts() {
        try {
          // 只保留最近200条记录，按时间顺序删除旧记录
          if (this.visitedPosts.size > 200) {
            // 按时间戳排序，删除最旧的记录
            const sortedEntries = Array.from(this.visitedPosts.entries())
              .sort((a, b) => a[1] - b[1]); // 按时间戳升序排序
  
            // 保留最新的200条
            const recentEntries = sortedEntries.slice(-200);
            this.visitedPosts = new Map(recentEntries);
          }
  
          const visitedArray = Array.from(this.visitedPosts.entries());
          localStorage.setItem(this.storageKey, JSON.stringify(visitedArray));
        } catch (error) {
          console.warn('保存已访问帖子记录失败:', error);
        }
      },
  
      markPostAsVisited(topicId) {
        if (!topicId) return;
  
        const timestamp = Date.now();
        this.visitedPosts.set(topicId.toString(), timestamp);
        this.saveVisitedPosts();
  
        // 立即更新页面上对应的链接
        this.updateLinkVisualState(topicId);
      },
  
      isPostVisited(topicId) {
        return this.visitedPosts.has(topicId.toString());
      },
  
      updateLinkVisualState(topicId) {
        // 查找所有指向该帖子的链接
        const links = document.querySelectorAll('a[href*="/t/"]');
        links.forEach(link => {
          const match = link.href.match(/\/t\/[^/]+\/(\d+)/);
          if (match && match[1] === topicId.toString()) {
            this.applyVisitedStyle(link);
          }
        });
      },
  
      applyVisitedStyle(link) {
        if (!link.classList.contains('post-link-visited')) {
          link.classList.add('post-link-visited');
        }
      },
  
      markExistingVisitedLinks() {
        const links = document.querySelectorAll('a[href*="/t/"]');
        let markedCount = 0;
  
        links.forEach(link => {
          const match = link.href.match(/\/t\/[^/]+\/(\d+)/);
          if (match) {
            const topicId = match[1];
            if (this.isPostVisited(topicId)) {
              this.applyVisitedStyle(link);
              markedCount++;
            }
          }
        });
  
  
      },
  
      setupLinkObserver() {
        // 使用 MutationObserver 监听新添加的链接
        const observer = new MutationObserver((mutations) => {
          mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                // 检查新添加的元素是否是链接或包含链接
                const links = node.matches && node.matches('a[href*="/t/"]') ?
                             [node] :
                             node.querySelectorAll ? node.querySelectorAll('a[href*="/t/"]') : [];
  
                links.forEach(link => {
                  const match = link.href.match(/\/t\/[^/]+\/(\d+)/);
                  if (match) {
                    const topicId = match[1];
                    if (this.isPostVisited(topicId)) {
                      this.applyVisitedStyle(link);
                    }
                  }
                });
              }
            });
          });
        });
  
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
    };
  
    // ==================== 阅读状态追踪模块 ====================
    const ReadingTracker = {
      // 状态标识
      isActive: false,
      topicId: null,
      observer: null,
      readingData: new Map(),
      pendingSubmissions: [],
      autoSubmitTimer: null,
  
      // 配置参数
      config: {
        batchSize: 5,
        submitDelay: 3000,
        minReadTime: 300,
        visibilityThreshold: 0.3,
        autoMarkDelay: 2000, // 弹窗停留2秒后自动标记初始内容
        initialMarkDelay: 1000 // 初始内容标记延迟
      },
  
      init(topicId) {
        // 如果已经在运行，先清理
        if (this.isActive) {
          this.cleanup();
        }
  
        this.isActive = true;
        this.topicId = topicId;
        this.readingData.clear();
        this.pendingSubmissions = [];
        this.startTime = Date.now();
  
        this.setupIntersectionObserver();
        this.setupAutoSubmit();
        this.setupAutoMarkTimer();
  
  
      },
  
      setupIntersectionObserver() {
        if (this.observer) {
          this.observer.disconnect();
        }
  
        this.observer = new IntersectionObserver((entries) => {
          // 检查追踪器是否仍然活跃
          if (!this.isActive) return;
  
          entries.forEach(entry => {
            const postNumber = parseInt(entry.target.dataset.postNumber);
  
            // 验证数据有效性
            if (!this.isValidPost(postNumber, entry.target)) {
              return;
            }
  
            if (entry.isIntersecting) {
              this.startReading(postNumber);
            } else {
              this.stopReading(postNumber);
            }
          });
        }, {
          threshold: [0.1, 0.3, 0.5, 0.8], // 多个阈值提高检测精度
          root: document.querySelector('.post-popup-content-wrapper'),
          rootMargin: '50px 0px' // 提前50px开始检测
        });
  
        // 设置滚动行为追踪
        this.setupScrollTracking();
      },
  
      // 新增：滚动行为追踪
      setupScrollTracking() {
        const contentWrapper = document.querySelector('.post-popup-content-wrapper');
        if (!contentWrapper) return;
  
        let scrollTimeout;
        let lastScrollTime = Date.now();
        let totalScrollDistance = 0;
        let lastScrollTop = contentWrapper.scrollTop;
  
        this.scrollHandler = Utils.throttle((e) => {
          if (!this.isActive) return;
  
          const currentTime = Date.now();
          const currentScrollTop = contentWrapper.scrollTop;
          const scrollDistance = Math.abs(currentScrollTop - lastScrollTop);
  
          // 记录滚动行为
          totalScrollDistance += scrollDistance;
          lastScrollTop = currentScrollTop;
          lastScrollTime = currentTime;
  
          // 清除之前的定时器
          if (scrollTimeout) {
            clearTimeout(scrollTimeout);
          }
  
          // 滚动停止后500ms，记录滚动会话
          scrollTimeout = setTimeout(() => {
            if (totalScrollDistance > 100) { // 只记录有意义的滚动
              this.recordScrollSession(totalScrollDistance, currentTime - lastScrollTime + 500);
  
            }
            totalScrollDistance = 0;
          }, 500);
  
        }, 100);
  
        contentWrapper.addEventListener('scroll', this.scrollHandler, { passive: true });
      },
  
      // 记录滚动会话数据
      recordScrollSession(distance, duration) {
        if (!this.isActive) return;
  
        // 为当前话题添加滚动时间
        this.scrollSessions = this.scrollSessions || [];
        this.scrollSessions.push({
          distance: distance,
          duration: duration,
          timestamp: Date.now()
        });
  
        // 每次滚动都增加话题总时间
        this.topicScrollTime = (this.topicScrollTime || 0) + duration;
      },
  
      // 验证帖子数据有效性
      isValidPost(postNumber, element) {
        // 检查追踪器状态
        if (!this.isActive) return false;
  
        // 检查 post_number 是否有效
        if (!postNumber || isNaN(postNumber)) return false;
  
        // 检查元素是否仍在 DOM 中
        if (!document.contains(element)) return false;
  
        // 检查是否在已加载的数据缓存中
        const isInCache = state.postDataCache.some(post =>
          post.post_number === postNumber
        );
  
        if (!isInCache) {
  
          return false;
        }
  
        return true;
      },
  
      observe(commentElement) {
        if (!this.isActive || !this.observer) return;
  
        const postNumber = commentElement.dataset.postNumber;
        if (postNumber && this.isValidPost(parseInt(postNumber), commentElement)) {
          this.observer.observe(commentElement);
  
          // 检查元素是否在初始视口中，如果是则延迟标记为已读
          this.checkInitialVisibility(commentElement, parseInt(postNumber));
        }
      },
  
      // 检查初始可见性
      checkInitialVisibility(element, postNumber) {
        if (!this.isActive) return;
  
        setTimeout(() => {
          if (!this.isActive || !element || !document.contains(element)) return;
  
          const rect = element.getBoundingClientRect();
          const containerRect = document.querySelector('.post-popup-content-wrapper')?.getBoundingClientRect();
  
          if (containerRect && rect.top < containerRect.bottom && rect.bottom > containerRect.top) {
            // 元素在视口中，标记为开始阅读
            if (!this.readingData.has(postNumber)) {
  
              this.startReading(postNumber);
  
              // 短暂延迟后标记为已读完成
              setTimeout(() => {
                if (this.isActive && this.readingData.has(postNumber)) {
                  this.stopReading(postNumber);
                }
              }, this.config.minReadTime);
            }
          }
        }, this.config.initialMarkDelay);
      },
  
      // 设置自动标记定时器
      setupAutoMarkTimer() {
        if (this.autoMarkTimer) {
          clearTimeout(this.autoMarkTimer);
        }
  
        this.autoMarkTimer = setTimeout(() => {
          if (!this.isActive) return;
  
  
          this.autoMarkInitialContent();
        }, this.config.autoMarkDelay);
      },
  
      // 自动标记初始内容
      autoMarkInitialContent() {
        if (!this.isActive) return;
  
        const containerRect = document.querySelector('.post-popup-content-wrapper')?.getBoundingClientRect();
        if (!containerRect) return;
  
        // 查找所有已加载的评论元素
        document.querySelectorAll('[data-post-number]').forEach(element => {
          const postNumber = parseInt(element.dataset.postNumber);
          if (!this.isValidPost(postNumber, element)) return;
  
          const rect = element.getBoundingClientRect();
  
          // 检查是否在容器视口范围内（包括上方已滚过的内容）
          if (rect.top < containerRect.bottom) {
            if (!this.readingData.has(postNumber)) {
  
              this.readingData.set(postNumber, {
                startTime: null,
                duration: this.config.minReadTime * 2 // 给一个合理的阅读时间
              });
              this.addToPendingSubmissions(postNumber, this.config.minReadTime * 2);
            }
          }
        });
      },
  
      startReading(postNumber) {
        if (!this.isActive) return;
  
        if (!this.readingData.has(postNumber)) {
          this.readingData.set(postNumber, {
            startTime: Date.now(),
            duration: 0
          });
  
        }
      },
  
      stopReading(postNumber) {
        if (!this.isActive) return;
  
        const data = this.readingData.get(postNumber);
        if (data && data.startTime) {
          const duration = Date.now() - data.startTime;
  
          // 只记录有效的阅读时间
          if (duration >= this.config.minReadTime) {
            data.duration = duration;
            this.addToPendingSubmissions(postNumber, duration);
  
          }
  
          // 重置开始时间
          data.startTime = null;
        }
      },
  
      addToPendingSubmissions(postNumber, duration) {
        if (!this.isActive) return;
  
        // 再次验证数据有效性
        const isValid = state.postDataCache.some(post =>
          post.post_number === postNumber
        );
  
        if (!isValid) {
          console.warn(`丢弃无效的阅读数据 #${postNumber}`);
          return;
        }
  
        this.pendingSubmissions.push({
          postNumber: postNumber,
          duration: duration,
          timestamp: Date.now()
        });
  
        // 检查是否需要批量提交
        if (this.pendingSubmissions.length >= this.config.batchSize) {
          this.submitPendingData();
        }
      },
  
      async submitPendingData() {
        if (!this.isActive || this.pendingSubmissions.length === 0) return;
  
        const dataToSubmit = [...this.pendingSubmissions];
        this.pendingSubmissions = [];
  
        try {
          // 最终数据验证 - 只提交确实已加载的评论
          const validData = dataToSubmit.filter(item => {
            return state.postDataCache.some(post =>
              post.post_number === item.postNumber
            );
          });
  
          if (validData.length === 0) {
            console.log('没有有效的阅读数据需要提交');
            return;
          }
  
          await this.sendTimingData(validData);
  
        } catch (error) {
          console.error('提交阅读数据失败:', error);
          // 只有在追踪器仍然活跃时才重新加入队列
          if (this.isActive) {
            this.pendingSubmissions.unshift(...dataToSubmit);
          }
        }
      },
  
      setupAutoSubmit() {
        // 清理现有定时器
        if (this.autoSubmitTimer) {
          clearInterval(this.autoSubmitTimer);
        }
  
        this.autoSubmitTimer = setInterval(() => {
          if (this.isActive && this.pendingSubmissions.length > 0) {
            this.submitPendingData();
          }
        }, this.config.submitDelay);
      },
  
      // 立即停止所有追踪活动
      stop() {
  
  
        this.isActive = false;
  
        // 停止观察器
        if (this.observer) {
          this.observer.disconnect();
        }
  
        // 清理滚动监听器
        if (this.scrollHandler) {
          const contentWrapper = document.querySelector('.post-popup-content-wrapper');
          if (contentWrapper) {
            contentWrapper.removeEventListener('scroll', this.scrollHandler);
          }
        }
  
        // 清理定时器
        if (this.autoSubmitTimer) {
          clearInterval(this.autoSubmitTimer);
          this.autoSubmitTimer = null;
        }
  
        if (this.autoMarkTimer) {
          clearTimeout(this.autoMarkTimer);
          this.autoMarkTimer = null;
        }
  
        // 在关闭前，最后一次自动标记所有可见内容
        this.finalMarkVisibleContent();
  
        // 立即提交剩余的有效数据
        if (this.pendingSubmissions.length > 0) {
  
          this.submitPendingData();
        }
      },
  
      // 关闭时最终标记可见内容
      finalMarkVisibleContent() {
        const containerRect = document.querySelector('.post-popup-content-wrapper')?.getBoundingClientRect();
        if (!containerRect) return;
  
        let markedCount = 0;
        document.querySelectorAll('[data-post-number]').forEach(element => {
          const postNumber = parseInt(element.dataset.postNumber);
          if (!this.isValidPost(postNumber, element)) return;
  
          const rect = element.getBoundingClientRect();
  
          // 标记在容器顶部以下的所有内容（用户已经滚动过的）
          if (rect.top < containerRect.top + containerRect.height * 0.8) {
            if (!this.readingData.has(postNumber) || this.readingData.get(postNumber).duration === 0) {
              const readTime = Math.max(this.config.minReadTime,
                Math.min(this.config.minReadTime * 3, (Date.now() - this.startTime) / 10));
  
              this.readingData.set(postNumber, {
                startTime: null,
                duration: readTime
              });
              this.addToPendingSubmissions(postNumber, readTime);
              markedCount++;
            }
          }
        });
  
  
      },
  
      cleanup() {
        this.stop();
  
        // 清理数据
        this.readingData.clear();
        this.pendingSubmissions = [];
        this.scrollSessions = [];
        this.topicScrollTime = 0;
        this.observer = null;
        this.scrollHandler = null;
        this.autoMarkTimer = null;
        this.topicId = null;
        this.startTime = null;
  
  
      },
  
      async sendTimingData(readingDataArray) {
        const csrfToken = Utils.getCSRFToken();
        if (!csrfToken) {
          throw new Error('无法获取 CSRF Token');
        }
  
        const params = new URLSearchParams();
        let totalTopicTime = 0;
  
        readingDataArray.forEach(data => {
          params.append(`timings[${data.postNumber}]`, data.duration.toString());
          totalTopicTime += data.duration;
        });
  
        // 包含滚动时间，使总时间更真实
        const scrollTime = this.topicScrollTime || 0;
        const finalTopicTime = Math.max(totalTopicTime, scrollTime, totalTopicTime + scrollTime * 0.3);
  
        params.append('topic_time', Math.round(finalTopicTime).toString());
        params.append('topic_id', this.topicId);
  
  
  
        const response = await fetch('https://linux.do/topics/timings', {
          method: 'POST',
          headers: {
            'accept': '*/*',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'discourse-background': 'true',
            'discourse-logged-in': 'true',
            'discourse-present': 'true',
            'priority': 'u=1, i',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-csrf-token': csrfToken,
            'x-requested-with': 'XMLHttpRequest',
            'x-silence-logger': 'true'
          },
          referrer: 'https://linux.do/',
          body: params.toString(),
          mode: 'cors',
          credentials: 'include'
        });
  
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
  
        return response;
      },
  
  
    };
  
    // ==================== CSS 样式注入 ====================
    GM_addStyle(`
      body { overflow-x: hidden !important; }
      body.${CONFIG.CSS_CLASSES.MODAL_OPEN} { overflow: hidden !important; }
  
      /* Post Popup Base Styles */
      ${CONFIG.SELECTORS.POST_POPUP} {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(46,47,48,.8); z-index: 1002; display: none;
        justify-content: center; align-items: center; color: #e0e0e0;
      }
  
      /* Image Lightbox Styles */
      ${CONFIG.SELECTORS.IMAGE_LIGHTBOX} {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.9); z-index: 2000; display: none;
        justify-content: center; align-items: center; cursor: pointer;
        overflow: hidden;
      }
  
      #image-lightbox-content {
        position: relative; max-width: 95vw; max-height: 95vh;
        display: flex; justify-content: center; align-items: flex-start;
        transition: opacity 0.3s ease; overflow: auto;
        border-radius: 8px; background: rgba(0, 0, 0, 0.3);
      }
  
      .lightbox-image {
        max-width: 100%; height: auto; object-fit: contain;
        border-radius: 8px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
        cursor: pointer; transition: opacity 0.3s ease;
        display: block; margin: 0 auto;
      }
  
      .lightbox-image:hover {
        filter: brightness(0.9);
      }
  
      .lightbox-loading {
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        color: white; font-size: 16px; text-align: center;
        background: rgba(0, 0, 0, 0.7); padding: 20px; border-radius: 8px;
        min-width: 200px; z-index: 2001;
      }
  
      .lightbox-loading-spinner {
        display: inline-block; width: 20px; height: 20px; margin-right: 10px;
        border: 2px solid #ffffff40; border-top: 2px solid #ffffff;
        border-radius: 50%; animation: lightbox-spin 1s linear infinite;
      }
  
      @keyframes lightbox-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
  
      /* 滚动条样式 */
      #image-lightbox-content::-webkit-scrollbar { width: 8px; height: 8px; }
      #image-lightbox-content::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); }
      #image-lightbox-content::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.3); border-radius: 4px;
      }
      #image-lightbox-content::-webkit-scrollbar-thumb:hover {
        background: rgba(255,255,255,0.5);
      }
  
      .lightbox-close-btn {
        position: absolute; top: 10px; right: 10px; width: 35px; height: 35px;
        background: rgba(0, 0, 0, 0.6); color: white; border: none;
        border-radius: 50%; font-size: 20px; cursor: pointer;
        display: flex; justify-content: center; align-items: center;
        transition: background-color 0.3s; z-index: 2002;
        backdrop-filter: blur(2px);
      }
      .lightbox-close-btn:hover { background: rgba(255, 255, 255, 0.4); }
  
      /* Make images clickable */
      .post-content img, .comment-content img {
        cursor: pointer; transition: transform 0.2s ease;
      }
      .post-content img:hover, .comment-content img:hover { transform: scale(1.02); }
  
      /* Content Wrapper */
      ${CONFIG.SELECTORS.CONTENT_WRAPPER} {
        height: 100%; overflow-y: auto; background: #1e1e1e;
        max-width: 950px; width: 90vw; padding: 3rem 8rem 100px;
        border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.7);
        position: relative; display: flex; flex-direction: column;
        align-items: center; box-sizing: border-box; flex-grow: 1;
      }
  
      /* Buttons Container */
      .post-popup-buttons {
        position: fixed; top: calc(50vh - 50vh + 3rem);
        right: calc((100vw - 950px) / 2 + 6rem);
        display: flex; flex-direction: column; gap: 10px; z-index: 1004;
      }
      @media (max-width: 1050px) {
        .post-popup-buttons { right: 5vw; top: 15vh; }
      }
  
      /* Buttons */
      ${CONFIG.SELECTORS.CONTENT_WRAPPER} .close-btn,
      ${CONFIG.SELECTORS.CONTENT_WRAPPER} .open-full-btn {
        position: static; width: 30px; height: 30px; border: none;
        border-radius: 50%; font-size: 18px; cursor: pointer;
        display: flex; justify-content: center; align-items: center;
        z-index: 1004; transition: background-color 0.3s;
      }
      ${CONFIG.SELECTORS.CONTENT_WRAPPER} .close-btn {
        background: #444; color: white;
      }
      ${CONFIG.SELECTORS.CONTENT_WRAPPER} .close-btn:hover { background: #666; }
      ${CONFIG.SELECTORS.CONTENT_WRAPPER} .open-full-btn {
        background: #43a047; color: white;
      }
      ${CONFIG.SELECTORS.CONTENT_WRAPPER} .open-full-btn:hover { background: #5cb85c; }
  
      /* Content Container */
      ${CONFIG.SELECTORS.CONTENT_CONTAINER} { width: 100%; }
  
      /* Post/Comment Styles */
      ${CONFIG.SELECTORS.POST_POPUP} .${CONFIG.CSS_CLASSES.POST_BOX},
      ${CONFIG.SELECTORS.POST_POPUP} .${CONFIG.CSS_CLASSES.COMMENT_BOX} {
        margin: 8px 0; background: #2a2a2a; border-radius: 4px;
        padding: 8px; border: 1px solid #444; color: #ddd;
      }
      ${CONFIG.SELECTORS.POST_POPUP} .${CONFIG.CSS_CLASSES.POST_BOX}:hover,
      ${CONFIG.SELECTORS.POST_POPUP} .${CONFIG.CSS_CLASSES.COMMENT_BOX}:hover { background: #333; }
  
      /* Headers */
      ${CONFIG.SELECTORS.POST_POPUP} .post-header,
      ${CONFIG.SELECTORS.POST_POPUP} .comment-header {
        display: flex; align-items: center; gap: 8px; margin-bottom: 4px;
      }
      ${CONFIG.SELECTORS.POST_POPUP} .post-avatar { width: 40px; height: 40px; border-radius: 50%; }
      ${CONFIG.SELECTORS.POST_POPUP} .comment-avatar { width: 30px; height: 30px; border-radius: 50%; }
      ${CONFIG.SELECTORS.POST_POPUP} .post-author,
      ${CONFIG.SELECTORS.POST_POPUP} .comment-author { font-weight: bold; color: #66aaff; }
      ${CONFIG.SELECTORS.POST_POPUP} .post-meta,
      ${CONFIG.SELECTORS.POST_POPUP} .comment-meta { font-size: 12px; color: #999; }
      ${CONFIG.SELECTORS.POST_POPUP} .post-floor,
      ${CONFIG.SELECTORS.POST_POPUP} .comment-floor { font-size: 12px; color: #999; margin-left: auto; }
      ${CONFIG.SELECTORS.POST_POPUP} .comment-author { font-size: 14px; }
      ${CONFIG.SELECTORS.POST_POPUP} .comment-meta,
      ${CONFIG.SELECTORS.POST_POPUP} .comment-floor { font-size: 10px; }
  
      /* Content */
      ${CONFIG.SELECTORS.POST_POPUP} .post-content,
      ${CONFIG.SELECTORS.POST_POPUP} .comment-content {
        line-height: 1.6; color: black; margin-top: 5px; word-break: break-word;
      }
      ${CONFIG.SELECTORS.POST_POPUP} .comment-content { font-size: 13px; line-height: 1.5; }
      ${CONFIG.SELECTORS.POST_POPUP} .post-content img,
      ${CONFIG.SELECTORS.POST_POPUP} .comment-content img {
        max-width: 100%; height: auto; display: block; margin: 8px auto; border-radius: 4px;
      }
      ${CONFIG.SELECTORS.POST_POPUP} .comment-content img { margin: 4px 0; }
  
      /* Content Elements */
      ${CONFIG.SELECTORS.POST_POPUP} .post-content a,
      ${CONFIG.SELECTORS.POST_POPUP} .comment-content a { color: #66aaff; text-decoration: none; }
      ${CONFIG.SELECTORS.POST_POPUP} .post-content a:hover,
      ${CONFIG.SELECTORS.POST_POPUP} .comment-content a:hover { text-decoration: underline; }
      ${CONFIG.SELECTORS.POST_POPUP} .post-content pre,
      ${CONFIG.SELECTORS.POST_POPUP} .post-content code {
        background-color: #222; color: #eee; padding: 8px; border-radius: 4px;
        overflow-x: auto; font-family: monospace; font-size: 0.9em; margin: 8px 0;
      }
      ${CONFIG.SELECTORS.POST_POPUP} .post-content pre code { padding: 0; }
      ${CONFIG.SELECTORS.POST_POPUP} .post-content blockquote {
        border-left: 4px solid #555; padding-left: 10px; margin: 8px 0; color: black;
      }
      ${CONFIG.SELECTORS.POST_POPUP} .post-content ul,
      ${CONFIG.SELECTORS.POST_POPUP} .post-content ol { margin: 8px 0 8px 20px; padding: 0; }
      ${CONFIG.SELECTORS.POST_POPUP} .post-content li { margin-bottom: 4px; }
  
      /* Floating Buttons */
      ${CONFIG.SELECTORS.POST_POPUP} .floating-btn {
        position: fixed; width: 40px; height: 40px; border: none; border-radius: 50%;
        color: white; cursor: pointer; z-index: 1003; display: flex;
        align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.8);
        font-size: 18px; opacity: 0.85; background-color: #444; transition: background-color 0.3s;
      }
      ${CONFIG.SELECTORS.POST_POPUP} .floating-btn:hover { opacity: 1; background-color: #666; }
      ${CONFIG.SELECTORS.POST_POPUP} #back-to-top-btn {
        background: #3399ff;
        position: fixed;
        bottom: 20px;
        right: calc((100vw - 950px) / 2 + 5rem);
        z-index: 1004;
      }
      @media (max-width: 1050px) {
        ${CONFIG.SELECTORS.POST_POPUP} #back-to-top-btn { right: 5vw; }
      }
  
      /* Comment Actions */
      .comment-actions {
        display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px;
      }
      .comment-actions button {
        background: #333; color: #eee; border: none; border-radius: 4px;
        padding: 5px 10px; cursor: pointer; font-size: 12px; transition: background-color 0.3s;
      }
      .comment-actions button:hover { background: #555; }
  
      /* Editor Styles */
      .post-editor-wrapper {
        width: 100%; box-sizing: border-box; overflow: hidden; color: #e0e0e0; padding: 10px;
      }
      ${CONFIG.SELECTORS.STICKY_EDITOR} {
        position: static; background: #2a2a2a; border-top: 1px solid #444; padding: 10px 0;
      }
      ${CONFIG.SELECTORS.STICKY_EDITOR}.active {
        position: sticky; bottom: 0; z-index: 1005; background: #333;
        border-top: 1px solid #555; padding-bottom: 10px;
        box-shadow: 0 -4px 12px rgba(0,0,0,0.5); border-radius: 8px;
      }
      .post-editor-wrapper textarea {
        border-radius: 4px; transition: border 0.3s; width: 100%; max-width: 100%;
        padding: 10px 14px; box-sizing: border-box; outline: none; font-family: sans-serif;
        font-size: 14px; min-height: 80px; resize: vertical; background: #1e1e1e;
        color: #eee; border: 1px solid #444;
      }
      .post-editor-wrapper textarea:focus { border-color: #66aaff; }
      .post-editor-wrapper .toolbar {
        box-sizing: border-box; padding: 5px 0; width: 100%; display: flex;
        justify-content: flex-end; align-items: center; background: none;
        border-top: none; border-radius: 0; gap: 10px;
      }
      .post-editor-wrapper .toolbar .submit-comment-btn {
        background: #3399ff; color: white; border: none; border-radius: 4px;
        padding: 6px 12px; cursor: pointer; font-size: 14px; transition: background-color 0.3s;
      }
      .post-editor-wrapper .toolbar .submit-comment-btn:hover { background: #1a73e8; }
      .post-editor-wrapper .toolbar .submit-comment-btn:disabled {
        background: #555; cursor: not-allowed;
      }
      .post-editor-wrapper .toolbar .close-editor-btn {
        background: none; color: #999; border: 1px solid #555; border-radius: 4px;
        padding: 6px 12px; cursor: pointer; font-size: 14px;
        transition: color 0.3s, border-color 0.3s;
      }
      .post-editor-wrapper .toolbar .close-editor-btn:hover { color: #eee; border-color: #999; }
  
      /* Toast Styles */
      .${CONFIG.CSS_CLASSES.TOAST_MESSAGE} {
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        background-color: rgba(40, 167, 69, 0.9); color: white; padding: 10px 20px;
        border-radius: 5px; z-index: 9999; opacity: 0;
        transition: opacity 0.5s ease-in-out, background-color 0.3s; pointer-events: none;
        border: 1px solid rgba(255, 255, 255, 0.3); box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      }
      .${CONFIG.CSS_CLASSES.TOAST_MESSAGE}.${CONFIG.CSS_CLASSES.TOAST_ERROR} {
        background-color: rgba(220, 53, 69, 0.9);
      }
      .${CONFIG.CSS_CLASSES.TOAST_MESSAGE}.${CONFIG.CSS_CLASSES.TOAST_SHOW} { opacity: 1; }
  
      /* Scrollbar Styles */
      ${CONFIG.SELECTORS.POST_POPUP} ::-webkit-scrollbar { width: 8px; }
      ${CONFIG.SELECTORS.POST_POPUP} ::-webkit-scrollbar-track { background: transparent; }
      ${CONFIG.SELECTORS.POST_POPUP} ::-webkit-scrollbar-thumb {
        background-color: rgba(255,255,255,0.2); border-radius: 4px;
      }
      ${CONFIG.SELECTORS.POST_POPUP} ::-webkit-scrollbar-thumb:hover {
        background-color: rgba(255,255,255,0.4);
      }
  
      /* 已访问帖子链接样式 - 简化版本 */
      .post-link-visited {
        opacity: 0.5 !important;
        transition: opacity 0.2s ease !important;
      }
  
      .post-link-visited:hover {
        opacity: 0.7 !important;
      }
  
      /* 亮色模式样式 */
      body.light-mode {
        background: #f5f6fa !important;
        color: #222 !important;
      }
      body.light-mode .post-popup-content-wrapper {
        background: #fff !important;
        color: #222 !important;
      }
      body.light-mode .post-box,
      body.light-mode .comment-box {
        background: #f7f7f7 !important;
        color: #222 !important;
        border-color: #e0e0e0 !important;
      }
      body.light-mode .post-author,
      body.light-mode .comment-author {
        color: #1976d2 !important;
      }
      body.light-mode .post-content a,
      body.light-mode .comment-content a {
        color: #1976d2 !important;
      }
      body.light-mode .post-content pre,
      body.light-mode .post-content code {
        background: #f0f0f0 !important;
        color: #333 !important;
      }
      /* 你可以继续补充其它亮色风格 */
      /* 深色模式下内容区字体为浅色，防止夜间变黑 */
      body:not(.light-mode) .post-popup-content-wrapper,
      body:not(.light-mode) .post-content,
      body:not(.light-mode) .comment-content,
      body:not(.light-mode) .post-popup-content-wrapper h2,
      body:not(.light-mode) .post-content blockquote {
        color: #ccc !important;
      }
      body:not(.light-mode) .post-popup-content-wrapper h2 {
        color: #eee !important;
      }
      body:not(.light-mode) .post-content blockquote {
        color: #aaa !important;
      }
      /* 亮色模式下主帖标题为黑色 */
      body.light-mode .post-popup-content-wrapper h2 {
        color: #111 !important;
        text-shadow: none !important;
      }
      /* 默认深色模式下主帖标题为浅色 */
      .post-popup-content-wrapper h2 {
        color: #eee !important;
        text-shadow: 0 0 0 #eee !important;
      }
    `);
  
    // ==================== 工具函数模块 ====================
    const Utils = {
      throttle(func, limit) {
        let inThrottle = false;
        let lastFunc;
        let lastRan;
        return function() {
          const context = this;
          const args = arguments;
          if (!inThrottle) {
            func.apply(context, args);
            lastRan = Date.now();
            inThrottle = true;
          } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
              if ((Date.now() - lastRan) >= limit) {
                func.apply(context, args);
                lastRan = Date.now();
              }
            }, limit - (Date.now() - lastRan));
          }
        }
      },
  
      showToast(message, isSuccess = true) {
        let toast = document.querySelector(`.${CONFIG.CSS_CLASSES.TOAST_MESSAGE}`);
        if (!toast) {
          toast = document.createElement("div");
          toast.className = CONFIG.CSS_CLASSES.TOAST_MESSAGE;
          document.body.appendChild(toast);
        }
  
        toast.textContent = message;
        toast.classList.remove(CONFIG.CSS_CLASSES.TOAST_ERROR);
        if (!isSuccess) {
          toast.classList.add(CONFIG.CSS_CLASSES.TOAST_ERROR);
        }
        toast.classList.add(CONFIG.CSS_CLASSES.TOAST_SHOW);
  
        setTimeout(() => {
          toast.classList.remove(CONFIG.CSS_CLASSES.TOAST_SHOW);
        }, CONFIG.TOAST_DURATION);
      },
  
      createPostOrCommentElement(data, isMainPost = false) {
        const element = document.createElement("div");
        element.className = isMainPost ? CONFIG.CSS_CLASSES.POST_BOX : CONFIG.CSS_CLASSES.COMMENT_BOX;
  
        const header = document.createElement("div");
        header.className = isMainPost ? "post-header" : "comment-header";
  
        const avatarTemplate = data.avatar_template;
        const avatar = avatarTemplate ? document.createElement("img") : null;
        if (avatar) {
          avatar.src = `https://${location.host}${avatarTemplate.replace("{size}", "45")}`;
          avatar.className = isMainPost ? "post-avatar" : "comment-avatar";
        }
  
        const author = document.createElement("div");
        author.className = isMainPost ? "post-author" : "comment-author";
        author.textContent = data.username || '系统';
  
        const meta = document.createElement("div");
        meta.className = isMainPost ? "post-meta" : "comment-meta";
        meta.textContent = new Date(data.created_at).toLocaleString();
  
        const floor = document.createElement("div");
        floor.className = isMainPost ? "post-floor" : "comment-floor";
        floor.textContent = `#${data.post_number}`;
  
        if (avatar) header.appendChild(avatar);
        header.appendChild(author);
        header.appendChild(meta);
        header.appendChild(floor);
  
        const content = document.createElement("div");
        content.className = isMainPost ? "post-content" : "comment-content";
        content.innerHTML = data.cooked;
  
        this.processLinks(content);
        this.processImages(content);
  
        element.appendChild(header);
        element.appendChild(content);
  
        return element;
      },
  
      processLinks(container) {
        const links = container.querySelectorAll('a');
        links.forEach(link => {
          if (!link.href.startsWith('#') && !link.href.includes('#reply_')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
          }
        });
      },
  
      processImages(container) {
        const images = container.querySelectorAll('img');
        images.forEach(img => {
          img.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
  
            // 获取原始尺寸的图片URL
            let originalSrc = img.src;
  
            // 如果是Linux.do的图片，尝试获取原始尺寸
            if (img.src.includes(location.host)) {
              // 移除尺寸参数，获取原始图片
              originalSrc = img.src.replace(/(_\d+x\d+)/g, '').replace(/(\?.*)/g, '');
  
              // 如果有data-src属性，优先使用
              if (img.dataset.src) {
                originalSrc = img.dataset.src;
              }
  
              // 如果有data-original属性，优先使用
              if (img.dataset.original) {
                originalSrc = img.dataset.original;
              }
  
              // 检查父元素是否有链接，如果有则使用链接地址
              const parentLink = img.closest('a');
              if (parentLink && parentLink.href &&
                  (parentLink.href.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) ||
                   parentLink.href.includes('/uploads/'))) {
                originalSrc = parentLink.href;
              }
            }
  
            ImageLightbox.show(originalSrc);
          });
        });
      },
  
      createNestedList(allList = []) {
        const map = new Map();
        allList.forEach(item => {
          map.set(item.id, { ...item, children: [] });
        });
  
        const nestedList = [];
        allList.forEach(item => {
          const parentIdMatch = item.cooked.match(/<a href="#reply_(\d+)"/);
          const parentId = parentIdMatch ? parseInt(parentIdMatch[1]) : null;
  
          if (parentId && map.has(parentId)) {
            map.get(parentId).children.push(map.get(item.id));
          } else {
            nestedList.push(map.get(item.id));
          }
        });
        return nestedList;
      },
  
      getCSRFToken() {
        let token = document.querySelector('meta[name="csrf-token"]')?.content;
        if (token) return token;
  
        const authenticityTokenInput = document.querySelector('input[name="authenticity_token"]');
        if (authenticityTokenInput) {
          return authenticityTokenInput.value;
        }
  
        return null;
      }
    };
  
    // ==================== 图片Lightbox模块 ====================
    const ImageLightbox = {
      element: null,
  
      init() {
        if (this.element) return;
  
        this.element = document.createElement('div');
        this.element.id = 'image-lightbox-overlay';
  
        const lightboxContent = document.createElement('div');
        lightboxContent.id = 'image-lightbox-content';
  
        const lightboxImage = document.createElement('img');
        lightboxImage.className = 'lightbox-image';
  
        const closeBtn = document.createElement('button');
        closeBtn.className = 'lightbox-close-btn';
        closeBtn.innerHTML = '✕';
        closeBtn.title = '关闭 (ESC)';
        closeBtn.onclick = () => this.close();
  
        lightboxContent.appendChild(lightboxImage);
        lightboxContent.appendChild(closeBtn);
        this.element.appendChild(lightboxContent);
  
        this.element.addEventListener('click', (e) => {
          if (e.target === this.element) {
            this.close();
          }
        });
  
        lightboxContent.addEventListener('click', (e) => {
          // 只有点击图片本身时才关闭，其他区域（如关闭按钮）不关闭
          if (e.target.classList.contains('lightbox-image')) {
            this.close();
          } else {
            e.stopPropagation();
          }
        });
  
        document.body.appendChild(this.element);
        elements.imageLightbox = this.element;
      },
  
      show(imageSrc) {
        if (!this.element) {
          this.init();
        }
  
        const lightboxImage = this.element.querySelector('.lightbox-image');
        const lightboxContent = this.element.querySelector('#image-lightbox-content');
  
        // 显示lightbox
        this.element.style.display = 'flex';
  
        // 清除之前的内容
        lightboxImage.style.opacity = '0';
        lightboxImage.src = '';
        lightboxContent.scrollTop = 0; // 重置滚动位置到顶部
  
        // 显示加载指示器
        this.showLoadingIndicator();
  
        // 创建新图片对象来预加载
        const newImg = new Image();
        const startTime = Date.now();
  
        newImg.onload = () => {
          const loadTime = Date.now() - startTime;
  
  
          // 设置图片
          lightboxImage.src = imageSrc;
  
          // 根据图片尺寸调整显示
          this.adjustImageDisplay(newImg, lightboxImage, lightboxContent);
  
          // 隐藏加载指示器，显示图片
          this.hideLoadingIndicator();
          lightboxImage.style.opacity = '1';
        };
  
        newImg.onerror = () => {
          console.warn('原始图片加载失败，使用备用图片:', imageSrc);
          lightboxImage.src = imageSrc;
          this.hideLoadingIndicator();
          lightboxImage.style.opacity = '1';
        };
  
        newImg.src = imageSrc;
  
        if (!elements.postPopup || elements.postPopup.style.display !== 'flex') {
          document.addEventListener("keydown", PopupManager.handleEscapeKey);
        }
      },
  
      adjustImageDisplay(newImg, lightboxImage, lightboxContent) {
        const imgWidth = newImg.naturalWidth;
        const imgHeight = newImg.naturalHeight;
        const viewportWidth = window.innerWidth * 0.95;
        const viewportHeight = window.innerHeight * 0.95;
        const aspectRatio = imgWidth / imgHeight;
  
        // 重置样式
        lightboxImage.style.width = 'auto';
        lightboxImage.style.height = 'auto';
        lightboxImage.style.maxWidth = '100%';
        lightboxImage.style.maxHeight = 'none';
  
        // 如果图片很宽，需要限制宽度并居中
        if (imgWidth > viewportWidth) {
          lightboxImage.style.maxWidth = '100%';
          lightboxImage.style.width = '100%';
          lightboxImage.style.height = 'auto';
        }
  
        // 如果图片很高，允许滚动
        if (imgHeight > viewportHeight) {
          lightboxContent.style.alignItems = 'flex-start';
          lightboxContent.style.paddingTop = '20px';
          lightboxContent.style.paddingBottom = '20px';
        } else {
          lightboxContent.style.alignItems = 'center';
          lightboxContent.style.paddingTop = '0';
          lightboxContent.style.paddingBottom = '0';
        }
  
  
      },
  
      showLoadingIndicator() {
        let loadingDiv = this.element.querySelector('.lightbox-loading');
        if (!loadingDiv) {
          loadingDiv = document.createElement('div');
          loadingDiv.className = 'lightbox-loading';
          loadingDiv.innerHTML = `
            <div class="lightbox-loading-spinner"></div>
            <div>正在加载高清图片...</div>
            <div style="font-size: 12px; margin-top: 8px; opacity: 0.7;">请稍候</div>
          `;
          this.element.appendChild(loadingDiv);
        }
        loadingDiv.style.display = 'block';
      },
  
      hideLoadingIndicator() {
        const loadingDiv = this.element.querySelector('.lightbox-loading');
        if (loadingDiv) {
          loadingDiv.style.display = 'none';
        }
      },
  
      close() {
        if (this.element) {
          this.element.style.display = 'none';
  
          // 清理状态
          const lightboxImage = this.element.querySelector('.lightbox-image');
          const lightboxContent = this.element.querySelector('#image-lightbox-content');
  
          if (lightboxImage) {
            lightboxImage.src = '';
            lightboxImage.style.opacity = '0';
          }
  
          if (lightboxContent) {
            lightboxContent.scrollTop = 0;
          }
  
          this.hideLoadingIndicator();
        }
      }
    };
  
    // ==================== 评论编辑器模块 ====================
    const CommentEditor = {
      container: null,
      textarea: null,
      submitBtn: null,
      closeBtn: null,
      topicId: null,
  
      init(topicId, parentContainer) {
        this.topicId = topicId;
  
        this.container = document.createElement("div");
        this.container.className = 'sticky-comment-editor';
  
        const editorWrapper = document.createElement("div");
        editorWrapper.className = "post-editor-wrapper";
        editorWrapper.innerHTML = `
          <textarea placeholder="发表你的评论..."></textarea>
          <div class="toolbar">
            <button class="close-editor-btn">关闭</button>
            <button class="submit-comment-btn">回复</button>
          </div>
        `;
  
        this.container.appendChild(editorWrapper);
        parentContainer.appendChild(this.container);
  
        this.textarea = editorWrapper.querySelector("textarea");
        this.submitBtn = editorWrapper.querySelector(".submit-comment-btn");
        this.closeBtn = editorWrapper.querySelector(".close-editor-btn");
  
        this.attachEvents();
      },
  
      attachEvents() {
        this.submitBtn.onclick = () => {
          const content = this.textarea.value.trim();
          if (content.length < 4) {
            Utils.showToast("评论内容至少需要4个字符！", false);
            return;
          }
  
          if (content) {
            const replyMatch = content.match(/^@\w+\s*#(\d+)\s*/);
            let replyToPostId = null;
            let actualContent = content;
  
            if (replyMatch) {
              replyToPostId = parseInt(replyMatch[1]);
              actualContent = content.substring(replyMatch[0].length).trim();
            }
  
            this.submitComment(this.topicId, actualContent, replyToPostId);
          } else {
            Utils.showToast("评论内容不能为空！", false);
          }
        };
  
        this.closeBtn.onclick = () => {
          this.hide();
          this.clear();
        };
      },
  
      setValue(content) {
        if (this.textarea) {
          this.textarea.value = content;
        }
      },
  
      clear() {
        if (this.textarea) {
          this.textarea.value = "";
        }
      },
  
      show() {
        if (this.container) {
          this.container.classList.add("active");
          this.textarea.focus();
          this.container.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      },
  
      hide() {
        if (this.container) {
          this.container.classList.remove("active");
        }
      },
  
      async submitComment(topicId, content, replyToPostId = null) {
        const csrfToken = Utils.getCSRFToken();
        if (!csrfToken) {
          Utils.showToast("无法获取安全令牌，请刷新页面重试。", false);
          return;
        }
  
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = "提交中...";
  
        const formData = new FormData();
        formData.append("raw", content);
        formData.append("topic_id", topicId);
        if (replyToPostId) {
          formData.append("reply_to_post_number", replyToPostId);
        }
        formData.append("archetype", "reply");
        formData.append("authenticity_token", csrfToken);
  
        try {
          const response = await fetch(CONFIG.API_ENDPOINTS.SUBMIT_POST, {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "X-CSRF-Token": csrfToken,
              "X-Requested-With": "XMLHttpRequest"
            },
            body: formData
          });
  
          const result = await response.json();
  
          if (response.ok) {
            Utils.showToast("评论提交成功！", true);
            this.hide();
            this.clear();
  
            const contentContainer = elements.postPopup.querySelector(CONFIG.SELECTORS.CONTENT_CONTAINER);
            if (contentContainer && this.container && result) {
              const newCommentElement = PostRenderer.renderComment(result);
              contentContainer.insertBefore(newCommentElement, this.container);
              newCommentElement.scrollIntoView({ behavior: "smooth", block: "end" });
            }
          } else {
            Utils.showToast(`评论提交失败: ${result.errors ? result.errors.join(", ") : response.statusText}`, false);
          }
        } catch (error) {
          console.error('提交评论错误:', error);
          Utils.showToast("提交评论时发生网络错误。", false);
        } finally {
          this.submitBtn.disabled = false;
          this.submitBtn.textContent = "回复";
        }
      }
    };
  
    // ==================== 帖子渲染模块 ====================
    const PostRenderer = {
      handleReplyButtonClick(data) {
        const editor = PopupManager.getCommentEditor();
        if (editor) {
          editor.setValue(`@${data.username} #${data.post_number} `);
          editor.show();
        }
      },
  
      renderComment(comment, depth = 0) {
        const commentElement = Utils.createPostOrCommentElement(comment, false);
        commentElement.style.marginLeft = `${depth * 20}px`;
  
        // 添加阅读追踪支持
        if (comment.post_number && comment.id) {
          commentElement.setAttribute('data-post-number', comment.post_number);
          commentElement.setAttribute('data-post-id', comment.id);
  
          // 验证是否在缓存中，然后才注册追踪
          const isInCache = state.postDataCache.some(post =>
            post.post_number === comment.post_number
          );
  
          if (isInCache && ReadingTracker.isActive) {
            ReadingTracker.observe(commentElement);
          }
        }
  
        const actions = document.createElement("div");
        actions.className = "comment-actions";
        const replyButton = document.createElement("button");
        replyButton.textContent = "回复";
        replyButton.onclick = () => this.handleReplyButtonClick(comment);
        actions.appendChild(replyButton);
        commentElement.appendChild(actions);
  
        if (comment.children && comment.children.length > 0) {
          comment.children.forEach(child => {
            commentElement.appendChild(this.renderComment(child, depth + 1));
          });
        }
        return commentElement;
      },
  
      renderInitialPosts(posts, title, contentContainer) {
        if (posts.length > 0) {
          const titleElement = document.createElement("h2");
          titleElement.textContent = title;
          titleElement.style.cssText = "font-weight: bold; font-size: 24px; margin-bottom: 20px; color: #eee;";
          contentContainer.appendChild(titleElement);
  
          const mainPost = posts[0];
          const postElement = Utils.createPostOrCommentElement(mainPost, true);
  
          // 为主帖添加阅读追踪支持
          if (mainPost.post_number && mainPost.id) {
            postElement.setAttribute('data-post-number', mainPost.post_number);
            postElement.setAttribute('data-post-id', mainPost.id);
  
            if (ReadingTracker.isActive) {
              ReadingTracker.observe(postElement);
            }
          }
  
          const actions = document.createElement("div");
          actions.className = "comment-actions";
          const replyButton = document.createElement("button");
          replyButton.textContent = "回复";
          replyButton.onclick = () => this.handleReplyButtonClick(mainPost);
          actions.appendChild(replyButton);
          postElement.appendChild(actions);
  
          contentContainer.appendChild(postElement);
        }
  
        if (posts.length > 1) {
          const comments = posts.slice(1);
          const nestedComments = Utils.createNestedList(comments);
  
          nestedComments.forEach(comment => {
            contentContainer.appendChild(this.renderComment(comment));
          });
        }
      }
    };
  
    // ==================== 弹窗管理器模块 ====================
    const PopupManager = {
      commentEditor: null,
  
      init() {
        this.createPopupContainer();
        this.createButtons();
        this.bindEvents();
      },
  
      createPopupContainer() {
        elements.postPopup = document.createElement("div");
        elements.postPopup.id = 'post-popup';
        document.body.appendChild(elements.postPopup);
      },
  
      createButtons() {
        elements.backToTopBtn = document.createElement("button");
        elements.backToTopBtn.id = "back-to-top-btn";
        elements.backToTopBtn.className = "floating-btn";
        elements.backToTopBtn.innerHTML = "↑";
        elements.backToTopBtn.title = "回到顶部";
        elements.backToTopBtn.onclick = () => {
          const contentWrapper = elements.postPopup.querySelector('.post-popup-content-wrapper');
          if (contentWrapper) {
            contentWrapper.scrollTo({ top: 0, behavior: "smooth" });
          }
        };
        elements.postPopup.appendChild(elements.backToTopBtn);
  
        elements.openFullBtn = document.createElement("button");
        elements.openFullBtn.id = "open-full-btn";
        elements.openFullBtn.className = "open-full-btn";
        elements.openFullBtn.innerHTML = "↗";
        elements.openFullBtn.title = "在新标签页打开";
        elements.openFullBtn.onclick = () => {
          if (state.currentSlug && state.currentTopicId) {
            window.open(`/t/${state.currentSlug}/${state.currentTopicId}`, "_blank");
          }
        };
      },
  
      bindEvents() {
        document.addEventListener("click", (e) => {
          const link = e.target.closest(CONFIG.SELECTORS.POST_LINKS);
          if (link && link.href.includes('/t/')) {
            if (e.button === 1 || e.metaKey || e.ctrlKey) return;
            e.preventDefault();
            const match = link.href.match(/\/t\/([^/]+)\/(\d+)/);
            if (match) {
              state.currentSlug = match[1];
              state.currentTopicId = match[2];
              this.open(state.currentTopicId, state.currentSlug);
            }
          }
        }, true);
  
        elements.postPopup.addEventListener("click", (e) => {
          if (e.target === elements.postPopup) {
            this.close();
          }
        });
      },
  
      handleEscapeKey(e) {
        if (e.key === "Escape") {
          if (elements.imageLightbox && elements.imageLightbox.style.display === "flex") {
            ImageLightbox.close();
          } else if (elements.postPopup && elements.postPopup.style.display === "flex") {
            PopupManager.close();
          }
        }
      },
  
      async open(topicId, slug) {
        if (!elements.postPopup) return;
  
        // 重置加载状态
        state.isLoadingMore = false;
        state.nextPostIds = [];
        state.postDataCache = [];
  
        // 初始化阅读追踪器
        ReadingTracker.init(topicId);
  
        // 标记帖子为已访问
        VisitedTracker.markPostAsVisited(topicId);
  
        elements.postPopup.innerHTML = `<div class="post-popup-content-wrapper" style="padding:16px;">⏳ 正在加载...</div>`;
        elements.postPopup.style.display = "flex";
        document.body.classList.add(CONFIG.CSS_CLASSES.MODAL_OPEN);
        document.addEventListener("keydown", this.handleEscapeKey);

        // 防止弹窗外滚动穿透
        if (!elements.postPopup._wheelLock) {
          elements.postPopup._wheelLock = function(e) {
            if (!e.target.closest('.post-popup-content-wrapper')) {
              e.preventDefault();
            }
          };
          elements.postPopup.addEventListener('wheel', elements.postPopup._wheelLock, { passive: false });
        }
  
        try {
          const response = await fetch(CONFIG.API_ENDPOINTS.TOPIC.replace('{slug}', slug).replace('{id}', topicId));
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
  
          const data = await response.json();
          state.nextPostIds = data.post_stream.stream.slice(data.post_stream.posts.length);
          state.postDataCache = data.post_stream.posts.slice();
  
          this.renderPopupContent(data);
        } catch (error) {
          console.error('加载帖子失败:', error);
          elements.postPopup.innerHTML = `<div class="post-popup-content-wrapper" style="padding:16px;">⚠️ 加载失败: ${error.message}</div>`;
        }
      },
  
      renderPopupContent(data) {
        elements.postPopup.innerHTML = '';
  
        const contentWrapper = document.createElement("div");
        contentWrapper.className = 'post-popup-content-wrapper';
  
        const closeBtn = document.createElement("button");
        closeBtn.className = "close-btn";
        closeBtn.innerHTML = "✕";
        closeBtn.title = "关闭 (ESC)";
        closeBtn.onclick = () => this.close();
  
        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "post-popup-buttons";
        buttonsContainer.appendChild(closeBtn);
        buttonsContainer.appendChild(elements.openFullBtn);
  
        const contentContainer = document.createElement("div");
        contentContainer.className = 'post-content-container';
  
        contentWrapper.appendChild(buttonsContainer);
        contentWrapper.appendChild(contentContainer);
        contentWrapper.appendChild(elements.backToTopBtn);
        elements.postPopup.appendChild(contentWrapper);
  
        PostRenderer.renderInitialPosts(state.postDataCache, data.title, contentContainer);
  
        this.commentEditor = Object.create(CommentEditor);
        this.commentEditor.init(state.currentTopicId, contentContainer);
  
        contentWrapper.addEventListener("scroll", Utils.throttle(() => {
          const scrollTop = contentWrapper.scrollTop;
          const clientHeight = contentWrapper.clientHeight;
          const scrollHeight = contentWrapper.scrollHeight;
          const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
  
          if (distanceFromBottom <= CONFIG.SCROLL_TRIGGER_DISTANCE &&
              state.nextPostIds.length > 0 &&
              !state.isLoadingMore) {
            this.loadMorePosts(state.currentTopicId, state.nextPostIds, contentContainer, this.commentEditor.container);
          }
        }, CONFIG.THROTTLE_DELAY));
      },
  
      async loadMorePosts(topicId, nextIds, contentContainer, editorContainer) {
        if (nextIds.length === 0 || state.isLoadingMore) return;
  
        state.isLoadingMore = true;
  
        // 清理已存在的加载指示器
        let existingLoadingIndicator = contentContainer.querySelector(`.${CONFIG.CSS_CLASSES.LOADING_INDICATOR}`);
        if (existingLoadingIndicator) {
          contentContainer.removeChild(existingLoadingIndicator);
        }
  
        const idsToLoad = nextIds.splice(0, CONFIG.PAGE_SIZE);
        const query = idsToLoad.map(i => `post_ids[]=${i}`).join("&");
  
        let loadingIndicator = document.createElement("div");
        loadingIndicator.className = CONFIG.CSS_CLASSES.LOADING_INDICATOR;
        loadingIndicator.textContent = "正在加载更多内容...";
        loadingIndicator.style.cssText = "text-align: center; padding: 15px; color: #66aaff; font-size: 14px;";
        contentContainer.appendChild(loadingIndicator);
  
        try {
          const startTime = Date.now();
          const response = await fetch(CONFIG.API_ENDPOINTS.POSTS.replace('{topicId}', topicId) + `?${query}`);
  
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
  
          const result = await response.json();
          const loadTime = Date.now() - startTime;
  
          // 确保最小加载时间，避免闪烁
          const minDelay = Math.max(0, CONFIG.LOADING_DELAY - loadTime);
  
          setTimeout(() => {
            if (contentContainer.contains(loadingIndicator)) {
              contentContainer.removeChild(loadingIndicator);
            }
  
            // 批量添加新内容
            const fragment = document.createDocumentFragment();
            result.post_stream.posts.forEach(post => {
              state.postDataCache.push(post);
              const commentElement = PostRenderer.renderComment(post);
              fragment.appendChild(commentElement);
  
              // 为新加载的评论注册阅读追踪
              if (ReadingTracker.isActive && post.post_number) {
                // 由于评论还在 fragment 中，需要在插入 DOM 后再注册观察
                setTimeout(() => {
                  if (document.contains(commentElement)) {
                    ReadingTracker.observe(commentElement);
  
                  }
                }, 10);
              }
            });
  
            contentContainer.insertBefore(fragment, editorContainer);
  
            state.isLoadingMore = false;
  
            // 如果还有更多内容且接近底部，继续加载
            const contentWrapper = contentContainer.closest('.post-popup-content-wrapper');
            if (contentWrapper && nextIds.length > 0) {
              const distanceFromBottom = contentWrapper.scrollHeight - (contentWrapper.scrollTop + contentWrapper.clientHeight);
              if (distanceFromBottom <= CONFIG.SCROLL_TRIGGER_DISTANCE * 2) {
                setTimeout(() => {
                  this.loadMorePosts(topicId, nextIds, contentContainer, editorContainer);
                }, 100);
              }
            }
          }, minDelay);
  
        } catch (error) {
          console.error('加载更多帖子失败:', error);
          state.isLoadingMore = false;
  
          loadingIndicator.textContent = "加载失败，点击重试";
          loadingIndicator.style.cssText += " cursor: pointer; background: #3a3a3a; border-radius: 4px; margin: 10px 0;";
          loadingIndicator.onclick = () => {
            nextIds.unshift(...idsToLoad);
            state.isLoadingMore = false;
            this.loadMorePosts(topicId, nextIds, contentContainer, editorContainer);
          };
        }
      },
  
      close() {
        if (elements.postPopup) {
          // 立即停止阅读追踪
          ReadingTracker.stop();
  
          elements.postPopup.style.display = "none";
          document.body.classList.remove(CONFIG.CSS_CLASSES.MODAL_OPEN);
          document.removeEventListener("keydown", this.handleEscapeKey);

          // 移除滚动穿透监听
          if (elements.postPopup._wheelLock) {
            elements.postPopup.removeEventListener('wheel', elements.postPopup._wheelLock, { passive: false });
            elements.postPopup._wheelLock = null;
          }
  
          // 延迟清理，确保数据提交完成
          setTimeout(() => {
            ReadingTracker.cleanup();
          }, 100);
  
          // 重置状态
          state.isLoadingMore = false;
          this.commentEditor = null;
        }
      },
  
      getCommentEditor() {
        return this.commentEditor;
      }
    };
  
    // ==================== 主题切换模块 ====================
    const ThemeManager = {
      init() {
        this.applyTheme(this.getPreferredTheme());
        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
          this.applyTheme(e.matches ? 'dark' : 'light');
        });
      },
      getPreferredTheme() {
        // 优先用系统主题
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        // 也可以用时间判断
        const hour = new Date().getHours();
        if (hour >= 7 && hour < 19) return 'light';
        return 'dark';
      },
      applyTheme(theme) {
        document.body.classList.remove('dark-mode', 'light-mode');
        document.body.classList.add(theme === 'dark' ? 'dark-mode' : 'light-mode');
      }
    };
  
    // ==================== 主初始化函数 ====================
    function initApp() {
      ThemeManager.init(); // 自动日夜切换
      if (window.self !== window.top || location.pathname.match(/^\/t\//)) {
        return;
      }
  
      PopupManager.init();
      ImageLightbox.init();
      VisitedTracker.init();
  
      // 页面卸载时清理追踪器
      window.addEventListener('beforeunload', () => {
        ReadingTracker.cleanup();
      });
  
  
    }
  
    // ==================== 向后兼容函数 ====================
    window.showToast = Utils.showToast;
    window.showImageLightbox = ImageLightbox.show;
    window.closeImageLightbox = ImageLightbox.close;
  
  
  
    // ==================== 应用启动 ====================
    window.addEventListener("DOMContentLoaded", initApp);
  
  })();