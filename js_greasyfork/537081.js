// ==UserScript==
// @name         岐黄天使刷课助手 - 工具函数模块
// @namespace    http://tampermonkey.net/qhtx-modules
// @version      1.3.0
// @description  岐黄天使刷课助手的工具函数模块，提供通用的辅助功能，如模拟点击、延迟等。
// @author       AI助手
// ==/UserScript==

// 工具函数模块
(function() {
    'use strict';

    // 记录最近点击的元素，防止重复点击
    let lastClickedElement = null;
    let lastClickTime = 0;
    const MIN_CLICK_INTERVAL = 500; // 最小点击间隔(毫秒)

    // 模拟点击元素
    // 新增模块加载日志功能
    function logModuleLoad(moduleName) {
      const timestamp = new Date().toISOString().slice(11, 23);
      console.log(`[${timestamp}] 模块加载追踪: ${moduleName} 已初始化完成`);
      GM_setValue('last_module_load', {
        module: moduleName,
        time: Date.now()
      });
    }

    // 增强模拟点击函数日志
    function simulateClick(element, question) {
      // 安全地访问moduleStatus
      if (window.moduleStatus && window.moduleStatus.loaded) {
        console.log('[模块状态] 当前已加载模块:', Array.from(window.moduleStatus.loaded));
      } else {
        console.log('[模块状态] moduleStatus未定义或未初始化');
      }
      try {
          // 防止重复点击同一元素
          const now = Date.now();
          if (element === lastClickedElement && now - lastClickTime < MIN_CLICK_INTERVAL) {
              console.log('防止重复点击:', element.textContent || element.id || element.className);
              return;
          }

          // 更新最近点击记录
          lastClickedElement = element;
          lastClickTime = now;

          // 检查元素是否在iframe中
          const isInIframe = question && question.isInIframe;
          const iframe = question && question.iframe;
          const targetWindow = isInIframe ? iframe.contentWindow : window;

          // 模拟鼠标移动到元素上
          const mouseoverEvent = new MouseEvent('mouseover', {
              view: targetWindow,
              bubbles: true,
              cancelable: true
          });
          element.dispatchEvent(mouseoverEvent);

          // 直接模拟点击，不添加延迟
          // 模拟鼠标按下
          const mousedownEvent = new MouseEvent('mousedown', {
              view: targetWindow,
              bubbles: true,
              cancelable: true
          });
          element.dispatchEvent(mousedownEvent);

          // 模拟鼠标释放
          const mouseupEvent = new MouseEvent('mouseup', {
              view: targetWindow,
              bubbles: true,
              cancelable: true
          });
          element.dispatchEvent(mouseupEvent);

          // 模拟点击
          const clickEvent = new MouseEvent('click', {
              view: targetWindow,
              bubbles: true,
              cancelable: true
          });
          element.dispatchEvent(clickEvent);

          // 如果元素有onclick属性，直接调用
          if (element.onclick) {
              element.onclick();
          }

          // 如果元素有choose函数，尝试调用
          if (isInIframe) {
              // 在iframe中尝试调用choose函数
              if (typeof iframe.contentWindow.choose === 'function' && element.classList.contains('option')) {
                  iframe.contentWindow.choose(element);
              }
          } else {
              // 在主窗口中尝试调用choose函数
              if (typeof choose === 'function' && element.classList.contains('option')) {
                  choose(element);
              }
          }

          // 如果元素有setti函数，尝试调用（用于题目导航）
          if (element.getAttribute('onclick') && element.getAttribute('onclick').includes('setti(')) {
              try {
                  const onclickAttr = element.getAttribute('onclick');
                  const match = onclickAttr.match(/setti\((\d+)/);
                  if (match && match[1]) {
                      const questionNumber = parseInt(match[1]);
                      if (isInIframe) {
                          if (typeof iframe.contentWindow.setti === 'function') {
                              iframe.contentWindow.setti(questionNumber, element);
                          }
                      } else {
                          if (typeof setti === 'function') {
                              setti(questionNumber, element);
                          }
                      }
                  }
              } catch (e) {
                  console.error('调用setti函数失败:', e);
              }
          }

          console.log('模拟点击元素:', element.textContent || element.id || element.className);

          // 添加网络请求监控
          const originalFetch = window.fetch;
          const originalXHROpen = XMLHttpRequest.prototype.open;

          // 请求跟踪器
          const requestTracker = {
            startMonitoring() {
              window.fetch = this.wrapFetch;
              XMLHttpRequest.prototype.open = this.wrapXHROpen;
              this.cleanupTimer = setTimeout(() => this.stopMonitoring(), 5000);
            },
            stopMonitoring() {
              window.fetch = originalFetch;
              XMLHttpRequest.prototype.open = originalXHROpen;
              clearTimeout(this.cleanupTimer);
            },
            wrapFetch: async function(input, init) {
              const startTime = Date.now();
              try {
                const response = await originalFetch(input, init);
                console.log('[网络请求] FETCH成功:', {
                  url: input.url || input,
                  status: response.status,
                  duration: Date.now() - startTime + 'ms'
                });
                return response;
              } catch (error) {
                console.log('[网络请求] FETCH失败:', {
                  url: input.url || input,
                  error: error.message
                });
                throw error;
              }
            },
            wrapXHROpen: function(method, url) {
              this._requestStartTime = Date.now();
              this.addEventListener('loadend', () => {
                console.log('[网络请求] XHR完成:', {
                  method: method,
                  url: url,
                  status: this.status,
                  duration: Date.now() - this._requestStartTime + 'ms'
                });
              });
              return originalXHROpen.apply(this, arguments);
            }
          };

          // 启动请求监控
          requestTracker.startMonitoring();
      } catch (e) {
          console.error('模拟点击出错:', e);

          // 尝试直接点击
          try {
              if (element.click) {
                  element.click();
              }
          } catch (e2) {
              console.error('直接点击也失败:', e2);
          }
      }
  };

    // 获取随机延迟时间
    function getRandomDelay(range) {
        return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    }

    // 关闭弹窗
    function closePopups(doc) {
        // 尝试关闭各种可能的弹窗
        const closeButtons = doc.querySelectorAll('.close-btn, .close, .popup-close, .messager-button a');
        closeButtons.forEach(btn => {
            try {
                btn.click();
            } catch (e) {
                console.error('关闭弹窗失败:', e);
            }
        });

        // 特别处理messager-window弹窗
        const messagerWindows = doc.querySelectorAll('.messager-window');
        if (messagerWindows.length > 0) {
            messagerWindows.forEach(window => {
                try {
                    const closeBtn = window.querySelector('.messager-button a');
                    if (closeBtn) {
                        closeBtn.click();
                    }
                } catch (e) {
                    console.error('关闭messager-window失败:', e);
                }
            });
        }
    };

    // 检查页面类型
    function checkPageType() {
        // 确定当前页面类型
        let pageType = 'unknown';

        if (window.location.href.includes('courseLearn.html')) {
            pageType = 'courseLearn';
        } else if (window.location.href.includes('courseSimulate.html')) {
            pageType = 'courseSimulate';
        } else if (window.location.href.includes('courseExam.html')) {
            pageType = 'courseExam';
        } else if (window.location.href.includes('courseList.html')) {
            pageType = 'courseList';
        } else if (window.location.href.includes('视频播放.html')) {
            pageType = 'videoPlay';
        }

        console.log('当前页面类型:', pageType);

        // 根据页面类型执行不同操作
        switch (pageType) {
            case 'courseLearn':
                // 在课程学习页面，检查是否应该自动开始
                let isRunning;
                if (typeof GM_getValue !== 'undefined') {
                    isRunning = GM_getValue('qh-is-running', false);
                } else {
                    isRunning = localStorage.getItem('qh-is-running') === 'true';
                }

                if (isRunning) {
                    console.log('自动学习已启用，尝试播放视频');
                    // 延迟执行，确保页面加载完成
                    setTimeout(() => {
                        if (typeof playAllVideos === 'function') {
                            playAllVideos();
                        }
                    }, 2000);
                }
                break;

            case 'courseSimulate':
            case 'courseExam':
                // 在模拟练习或考试页面，添加自动答题按钮
                if (window.qh.autoFlowConfig.enabled && typeof startAutoAnswer === 'function') {
                    setTimeout(() => {
                        startAutoAnswer();
                    }, 2000);
                }
                break;

            case 'courseList':
                // 在课程列表页面，可以添加一些特定操作
                console.log('在课程列表页面，可以选择课程开始学习');
                break;

            case 'videoPlay':
                // 在视频播放页面，初始化视频导航
                console.log('在视频播放页面，初始化视频导航');
                if (typeof initVideoNavigation === 'function') {
                    setTimeout(() => {
                        initVideoNavigation();
                    }, 2000);
                }
                break;

            default:
                // 即使在其他页面，也尝试检测和播放视频
                setTimeout(() => {
                    const videos = document.querySelectorAll('video');
                    if (videos.length > 0) {
                        console.log('在其他页面检测到视频，尝试播放');
                        if (typeof playAllVideos === 'function') {
                            playAllVideos();
                        }
                    }
                }, 3000);
                break;
        }
    }

    // 导出模块函数
    window.utils = checkPageType;
    window.simulateClick = simulateClick;
    window.getRandomDelay = getRandomDelay;
    window.closePopups = closePopups;
    window.logModuleLoad = logModuleLoad;
    window.checkPageType = checkPageType;

    // 通知主脚本模块已加载
    console.log('[模块加载] utils 模块已加载');
})();
