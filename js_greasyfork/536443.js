/**
 * 请求拦截器
 * 用于拦截和监听网络请求
 * @author Code Copilot
 * @version 1.0.0
 */

class RequestInterceptor {
  constructor() {
    this.handlers = new Map();
    this.init();
  }

  /**
   * 初始化拦截器
   */
  init() {
    // 保存this引用
    const self = this;

    // 拦截 fetch 请求
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      const url = args[0];
      const response = originalFetch.apply(window, args);
      const cloned = response.clone();

      // 检查是否有匹配的处理器
      for (const [pattern, handler] of self.handlers) {
        if (self.matchUrl(url, pattern)) {
          try {
            const data = cloned.json();
            handler(data, url);
          } catch (error) {
            console.error(`处理请求失败: ${url}`, error);
          }
        }
      }

      return response;
    };

    // 拦截 XMLHttpRequest 请求
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
      const originalOnload = this.onload;
      this.onload = function () {
        // 检查是否有匹配的处理器
        for (const [pattern, handler] of self.handlers) {
          if (self.matchUrl(url, pattern)) {
            try {
              const data = JSON.parse(this.responseText);
              handler(data, url);
            } catch (error) {
              console.error(`处理请求失败: ${url}`, error);
            }
          }
        }
        if (originalOnload) originalOnload.apply(this);
      };
      return originalOpen.apply(this, arguments);
    };
  }

  /**
   * 匹配URL是否满足模式
   * @param {string} url - 请求URL
   * @param {string|RegExp} pattern - 匹配模式
   * @returns {boolean}
   */
  matchUrl(url, pattern) {
    if (pattern instanceof RegExp) {
      return pattern.test(url);
    }
    if (typeof pattern === 'string') {
      return url.includes(pattern);
    }
    return false;
  }

  /**
   * 添加请求处理器
   * @param {string|RegExp} pattern - URL匹配模式
   * @param {Function} handler - 处理函数
   */
  addHandler(pattern, handler) {
    this.handlers.set(pattern, handler);
  }

  /**
   * 移除请求处理器
   * @param {string|RegExp} pattern - URL匹配模式
   */
  removeHandler(pattern) {
    this.handlers.delete(pattern);
  }

  /**
   * 清除所有处理器
   */
  clearHandlers() {
    this.handlers.clear();
  }
}

// 导出拦截器实例
const requestInterceptor = new RequestInterceptor();