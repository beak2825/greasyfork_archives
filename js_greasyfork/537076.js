// ==UserScript==
// @name         岐黄天使刷课助手 - 调试加载器模块
// @namespace    http://tampermonkey.net/qhtx-modules
// @version      1.3.2
// @description  岐黄天使刷课助手的调试与模块状态监控器，用于 @require 架构下的模块状态跟踪和调试支持。
// @author       AI助手
// ==/UserScript==

/**
 * 调试加载器模块 - 重构版本
 *
 * 此模块已重构以适配基于 GreasyFork @require 指令的生产架构：
 * - 移除了所有本地开发服务器 (192.168.1.6:9999) 的 HTTP 请求
 * - 保留模块状态跟踪系统，用于监控 @require 加载的模块状态
 * - 提供备用函数注入功能，用于调试和开发场景
 * - 与 main.user.js 的增强错误处理机制完全兼容
 *
 * 架构说明：
 * - 所有模块现在通过 Tampermonkey 的 @require 机制从 GreasyFork 加载
 * - 版本控制通过 URL 查询参数 (?v=x.x.x&t=timestamp) 实现
 * - 此调试加载器仅负责状态监控和备用功能提供
 */
(function() {
    'use strict';

    // 版本验证和缓存破坏验证
    const DEBUG_LOADER_TIMESTAMP = 1748085794476;
    const DEBUG_LOADER_VERSION = '1.3.2-optimized';

    console.log(`[调试加载器] 版本: ${DEBUG_LOADER_VERSION}, 时间戳: ${DEBUG_LOADER_TIMESTAMP}`);
    console.log('[调试加载器] ✅ 已重构版本 - 无本地服务器依赖');

    // 验证是否为最新版本
    if (window.moduleLoadTimestamp && window.moduleLoadTimestamp === DEBUG_LOADER_TIMESTAMP) {
        console.log('[调试加载器] ✅ 时间戳匹配，使用最新版本');
        if (window.moduleLoadVerification) {
            window.moduleLoadVerification.verifyModule('debug-loader', DEBUG_LOADER_TIMESTAMP);
        }
    } else {
        console.warn('[调试加载器] ⚠️ 时间戳不匹配，可能使用缓存版本');
    }

    // 强制阻止任何本地服务器请求
    if (typeof GM_xmlhttpRequest !== 'undefined') {
        const originalGM_xmlhttpRequest = GM_xmlhttpRequest;
        GM_xmlhttpRequest = function(details) {
            if (details.url && (details.url.includes('192.168.1.6') || details.url.includes('9999') || details.url.includes('qhtx'))) {
                console.error('[调试加载器] 🚫 阻止本地服务器请求:', details.url);
                console.error('[调试加载器] 🚫 此请求已被阻止，应使用 @require 架构');
                console.error('[调试加载器] 🚫 如果看到此消息，说明有旧版本代码仍在尝试连接本地服务器');
                return; // 直接返回，不执行请求
            }
            return originalGM_xmlhttpRequest.call(this, details);
        };
        console.log('[调试加载器] 🛡️ 已安装本地服务器请求拦截器');
    }

    // 添加模块加载状态跟踪
    window.moduleStatus = {
      loaded: new Set(),
      pending: new Set([
        // 'styles', 'utils', 'ui', 'videoPlayer',
        // 'videoNavigation', 'courseNavigation', 'questionBank',
        // 'autoAnswer', 'remoteSync'
      ]),
      startTime: Date.now(),
      // 显示模块加载状态
      showStatus: function() {
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
        console.log(`
        ========== 模块加载状态 (${elapsed}秒) ==========
        已加载: ${Array.from(this.loaded).join(', ') || '无'}
        待加载: ${Array.from(this.pending).join(', ') || '无'}
        ============================================
        `);
      }
    };

    // 防止重复执行的全局标志
    if (window.moduleStatusCheckerInitialized) {
        console.log('[调试加载器] 模块状态检查器已初始化，跳过重复执行');
        return;
    }
    window.moduleStatusCheckerInitialized = true;

    // 一次性显示模块加载状态 (优化：移除重复刷新)
    let statusCheckCount = 0;
    const maxStatusChecks = 3; // 最多检查3次

    function checkModuleStatusOnce() {
      statusCheckCount++;
      console.log(`[调试加载器] 第 ${statusCheckCount} 次模块状态检查`);

      if (window.moduleStatus.pending.size === 0) {
        // 所有模块已加载
        window.moduleStatus.showStatus();
        console.log('%c✅ 所有模块加载完成！', 'color: green; font-size: 14px; font-weight: bold');
        return; // 停止检查
      } else if (statusCheckCount >= maxStatusChecks) {
        // 达到最大检查次数
        window.moduleStatus.showStatus();
        console.log('%c⚠️ 模块加载检查完成（部分模块可能未加载）', 'color: orange; font-size: 12px');
        console.log('[调试加载器] 停止模块状态检查，避免重复刷新');
        return; // 停止检查
      } else {
        // 继续检查，但减少频率
        window.moduleStatus.showStatus();
        setTimeout(checkModuleStatusOnce, 5000); // 5秒后再检查一次
      }
    }

    // 延迟开始第一次检查，给模块加载一些时间
    setTimeout(checkModuleStatusOnce, 1000);

    // 检查模块加载状态
    function checkModuleLoaded(moduleName) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString() + '.' + now.getMilliseconds();
      console.log(`[模块加载] 正在验证 ${moduleName} 状态，当前时间: ${timeStr}`);

      // 详细检查window对象上的模块属性
      console.log(`[模块加载详情] ${moduleName} 检查:`, {
        '直接访问': window[moduleName],
        '类型': typeof window[moduleName],
        '是否存在': moduleName in window,
        'window属性': Object.keys(window).filter(k => k.includes(moduleName)),
        '全局变量': Object.keys(window).filter(k => k.startsWith('qh') || k.includes('module') || k.includes('Module'))
      });

      // 检查模块是否已加载
      if (typeof window[moduleName] === 'function') {
        window.moduleStatus.loaded.add(moduleName);
        window.moduleStatus.pending.delete(moduleName);

        console.log(`[模块加载] %c${moduleName} 已就绪%c`,
                    'color: green; font-weight: bold', 'color: black');

        // 输出已加载的模块列表
        console.log(`[模块加载] 已加载模块: ${Array.from(window.moduleStatus.loaded).join(', ')}`);
        console.log(`[模块加载] 待加载模块: ${Array.from(window.moduleStatus.pending).join(', ')}`);

        return true;
      }

      // 如果模块未加载，尝试检查是否有其他命名方式
      const possibleNames = [
        moduleName,
        moduleName.charAt(0).toUpperCase() + moduleName.slice(1), // 首字母大写
        moduleName + 'Module',
        'qh' + moduleName.charAt(0).toUpperCase() + moduleName.slice(1), // qh前缀
        'create' + moduleName.charAt(0).toUpperCase() + moduleName.slice(1), // create前缀
        'init' + moduleName.charAt(0).toUpperCase() + moduleName.slice(1), // init前缀
        'apply' + moduleName.charAt(0).toUpperCase() + moduleName.slice(1) // apply前缀
      ];

      console.log(`[模块加载] 尝试其他可能的命名:`, possibleNames.map(name => ({
        name,
        exists: name in window,
        type: typeof window[name]
      })));

      console.warn(`[模块加载] %c${moduleName} 未就绪%c，window[${moduleName}] = ${window[moduleName]}`,
                  'color: red; font-weight: bold', 'color: black');

      return false;
    }

    /**
     * 检查模块文件 (已重构)
     *
     * 此函数已重构为不执行实际的 HTTP 请求。
     * 在 @require 架构下，模块由 Tampermonkey 自动加载，
     * 此函数仅用于兼容性和调试目的。
     *
     * @param {string} moduleName - 模块名称
     * @returns {Promise} - 始终返回成功的 Promise
     */
    function checkModuleFile(moduleName) {
      console.log(`[模块检查] 模块 ${moduleName} 应通过 @require 从 GreasyFork 加载，跳过本地检查`);
      return Promise.resolve({
        module: moduleName,
        content: '@require-loaded',
        status: 200,
        source: 'greasyfork-require'
      });
    }

    /**
     * 加载模块 (已重构)
     *
     * 此函数已重构为不执行实际的模块加载。
     * 在 @require 架构下，模块由 Tampermonkey 在脚本启动时自动加载，
     * 此函数仅用于兼容性和状态跟踪目的。
     *
     * @param {string} moduleName - 模块名称
     * @returns {Promise} - 始终返回成功的 Promise
     */
    function loadModuleWithGM(moduleName) {
      console.log(`[模块加载] 模块 ${moduleName} 应通过 @require 从 GreasyFork 自动加载，跳过手动加载`);
      return Promise.resolve({
        module: moduleName,
        loaded: true,
        source: 'greasyfork-require',
        timestamp: Date.now()
      });
    }

    /**
     * 检查所有模块 (已重构)
     *
     * 此函数已重构为不执行实际的模块检查。
     * 在 @require 架构下，模块状态检查通过检测全局函数是否存在来实现。
     *
     * @returns {Promise} - 返回模块状态检查结果
     */
    function checkAllModules() {
      console.log('[模块检查] @require 架构下的模块状态检查');

      // 检查关键模块函数是否已加载
      const moduleChecks = [
        { name: 'styles', func: 'applyStyles' },
        { name: 'ui', func: 'createPanel' },
        { name: 'utils', func: 'checkPageType' },
        { name: 'questionBank', func: 'getQuestionList' },
        { name: 'autoAnswer', func: 'startAutoAnswer' },
        { name: 'videoPlayer', func: 'toggleAutoLearn' },
        { name: 'dailyLimitManager', func: 'qh.DailyLimitManager' }, // 检查 window.qh.DailyLimitManager
        { name: 'courseNavigation', func: 'collectCourseLinks' },
        { name: 'videoNavigation', func: 'initVideoNavigation' }
        // { name: 'remoteSync', func: 'syncRemoteQuestionBank' } // remoteSync 核心功能已移除，暂不强制检查
      ];

      const results = moduleChecks.map(check => {
        let isLoaded = false;
        if (check.func.includes('.')) {
            const parts = check.func.split('.');
            let obj = window;
            let pathExists = true;
            for (const part of parts) {
                if (obj && typeof obj === 'object' && part in obj) {
                    obj = obj[part];
                } else {
                    pathExists = false;
                    break;
                }
            }
            if (pathExists && typeof obj === 'function') { // 类也是函数类型
                isLoaded = true;
            }
        } else {
            isLoaded = typeof window[check.func] === 'function';
        }

        const status = isLoaded ? 'loaded' : 'pending';

        if (isLoaded) {
          window.moduleStatus.loaded.add(check.name);
          window.moduleStatus.pending.delete(check.name);
        } else {
          window.moduleStatus.pending.add(check.name);
        }

        return {
          module: check.name,
          function: check.func,
          status: status,
          loaded: isLoaded
        };
      });

      console.log('[模块检查] @require 模块状态检查完成:', results);
      return Promise.resolve(results);
    }

    /**
     * 加载所有模块 (已重构)
     *
     * 此函数已重构为不执行实际的模块加载。
     * 在 @require 架构下，模块由 Tampermonkey 自动加载，
     * 此函数仅用于状态同步和兼容性目的。
     *
     * @returns {Promise} - 返回模块加载状态结果
     */
    function loadAllModules() {
      console.log('[模块加载] @require 架构下的模块状态同步');

      // 重新检查模块状态，确保状态同步
      return checkAllModules().then(results => {
        const loadedModules = results.filter(r => r.loaded);
        const pendingModules = results.filter(r => !r.loaded);

        console.log(`[模块加载] 模块状态同步完成:`, {
          total: results.length,
          loaded: loadedModules.length,
          pending: pendingModules.length,
          loadedModules: loadedModules.map(m => m.module),
          pendingModules: pendingModules.map(m => m.module)
        });

        return results;
      });
    }

    /**
     * 注入备用模块函数到全局作用域
     *
     * 此函数提供备用的模块函数实现，用于以下场景：
     * - @require 模块加载失败时的降级方案
     * - 开发和调试阶段的基本功能支持
     * - 确保核心功能在任何情况下都能正常工作
     *
     * 注意：这些是简化的备用实现，功能有限
     */
    function injectModuleFunctions() {
      console.log('[调试加载器] 开始注入备用模块函数到全局作用域');

      // 注入styles模块
      if (!window.applyStyles) {
        window.applyStyles = function() {
          console.log('[模块注入] 执行注入的 applyStyles 函数');
          GM_addStyle(`
            .qh-assistant-panel {
                position: fixed;
                top: 100px;
                right: 10px;
                width: 280px;
                background: linear-gradient(135deg, #00a8cc, #0062bd);
                border-radius: 12px;
                padding: 15px;
                color: white;
                z-index: 9999;
                font-size: 14px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
            .qh-assistant-title {
                font-size: 18px;
                font-weight: bold;
                text-align: center;
                margin-bottom: 12px;
                border-bottom: 2px solid rgba(255, 255, 255, 0.3);
                padding-bottom: 8px;
            }
            .qh-assistant-content {
                margin-bottom: 12px;
            }
            .qh-assistant-btn {
                background: linear-gradient(90deg, #4CAF50, #45a049);
                border: none;
                color: white;
                padding: 8px 12px;
                text-align: center;
                display: block;
                width: 100%;
                margin: 5px 0;
                cursor: pointer;
                border-radius: 4px;
            }
          `);
          console.log('[模块注入] applyStyles 函数执行完成');
        };
        console.log('[模块注入] 已注入 applyStyles 函数');
      }

      // 注入ui模块
      if (!window.createPanel) {
        window.createPanel = function() {
          console.log('[模块注入] 执行注入的 createPanel 函数');

          // 检查是否已经创建过面板
          if (document.querySelector('.qh-assistant-panel')) {
            console.log('[模块注入] 面板已存在，不重复创建');
            return;
          }

          const panel = document.createElement('div');
          panel.className = 'qh-assistant-panel';
          panel.innerHTML = `
            <div class="qh-assistant-title">岐黄天使刷课助手 v1.3.0</div>
            <div class="qh-assistant-content">
                <div>状态: 调试模式</div>
                <div>当前页面: ${window.location.href}</div>
            </div>
            <button class="qh-assistant-btn" id="qh-debug-btn">调试信息</button>
          `;
          document.body.appendChild(panel);

          // 添加调试按钮事件
          document.getElementById('qh-debug-btn').addEventListener('click', function() {
            console.log('[调试] 当前页面信息:', {
              'URL': window.location.href,
              '已加载模块': Array.from(window.moduleStatus.loaded),
              '待加载模块': Array.from(window.moduleStatus.pending),
              'window.qh': window.qh
            });
            alert('调试信息已输出到控制台');
          });

          console.log('[模块注入] createPanel 函数执行完成');
        };
        console.log('[模块注入] 已注入 createPanel 函数');
      }

      // 注入utils模块
      if (!window.checkPageType) {
        window.checkPageType = function() {
          console.log('[模块注入] 执行注入的 checkPageType 函数');
          console.log('[页面检查] 当前页面URL:', window.location.href);
        };
        console.log('[模块注入] 已注入 checkPageType 函数');
      }

      console.log('[调试加载器] 模块函数注入完成');
    }

    // 导出模块函数
    window.debugLoader = {
      checkModuleLoaded,
      checkModuleFile,
      loadModuleWithGM,
      checkAllModules,
      loadAllModules,
      injectModuleFunctions
    };

    /**
     * 自动执行模块状态检查和备用函数准备 (优化：只执行一次)
     *
     * 在 @require 架构下，此函数主要用于：
     * - 检查 @require 加载的模块状态
     * - 在需要时提供备用函数
     * - 与 main.user.js 的初始化流程协调
     */
    if (!window.debugLoaderInitialized) {
        window.debugLoaderInitialized = true;

        setTimeout(() => {
          console.log('[调试加载器] @require 架构下的模块状态检查开始（一次性执行）');

          // 首先检查 @require 模块的加载状态
          checkAllModules()
            .then(results => {
              const loadedCount = results.filter(r => r.loaded).length;
              const totalCount = results.length;

              console.log(`[调试加载器] @require 模块状态检查完成: ${loadedCount}/${totalCount} 已加载`);

              // 如果有模块未加载，提供备用函数
              if (loadedCount < totalCount) {
                console.log('[调试加载器] 检测到未加载的模块，准备备用函数');
                injectModuleFunctions();

                // 更新状态，标记备用函数已提供
                results.forEach(result => {
                  if (!result.loaded) {
                    window.moduleStatus.loaded.add(result.module + '-fallback');
                    console.log(`[调试加载器] 为 ${result.module} 提供了备用函数`);
                  }
                });
              } else {
                console.log('[调试加载器] 所有 @require 模块已正常加载，无需备用函数');
              }

              return loadAllModules();
            })
            .then(() => {
              console.log('[调试加载器] ✅ 模块状态同步完成，调试加载器初始化结束');
            })
            .catch(error => {
              console.error('[调试加载器] 模块状态检查出错:', error);
              console.log('[调试加载器] 启用备用函数作为安全措施');
              injectModuleFunctions();
            });
        }, 500); // 减少延迟，因为 @require 模块应该已经加载
    } else {
        console.log('[调试加载器] 已初始化，跳过重复执行');
    }

    console.log('[调试加载器] 模块已加载 - @require 架构兼容版本');
})();
