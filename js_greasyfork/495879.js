// ==UserScript==
// @name       我的世界去除跳转网易提示
// @namespace  https://github.com/marioplus/minecraft-net-easy-tips-remover
// @version    1.1.0
// @author     marioplus
// @license    GPL-3.0
// @icon       https://www.google.com/s2/favicons?sz=64&domain=minecraft.net
// @match      https://www.minecraft.net/*
// @run-at     document-start
// @description 去掉网易跳转提示提示
// @downloadURL https://update.greasyfork.org/scripts/495879/%E6%88%91%E7%9A%84%E4%B8%96%E7%95%8C%E5%8E%BB%E9%99%A4%E8%B7%B3%E8%BD%AC%E7%BD%91%E6%98%93%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/495879/%E6%88%91%E7%9A%84%E4%B8%96%E7%95%8C%E5%8E%BB%E9%99%A4%E8%B7%B3%E8%BD%AC%E7%BD%91%E6%98%93%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  class ElementCreateListener {
    /**
     * 初始化元素监听器
     * @param mode 监听模式：
     *   - 'auto' : 添加首个处理器时自动激活监听
     *   - 'manual' : 需手动调用 activate() 启动
     */
    constructor(mode = "auto") {
      // 观测器实例，用于监听 DOM 树变化
      __publicField(this, "_observer");
      // 存储选择器与回调的映射关系（Key: CSS 选择器，Value: 处理函数）
      __publicField(this, "_handlerMap", /* @__PURE__ */ new Map());
      // 当前监听器状态，用于防止重复激活
      __publicField(this, "_operationStatus", "idle");
      // 运行模式标志（构造时确定，不可变）
      __publicField(this, "_listeningMode");
      this._listeningMode = mode;
      this._observer = new MutationObserver(
        (mutationRecords) => this._handleMutations(mutationRecords)
      );
    }
    /**
     * 处理 DOM 变动记录的核心逻辑
     * @param mutationRecords - MutationObserver 返回的变动记录数组
     */
    _handleMutations(mutationRecords) {
      for (const record of mutationRecords) {
        if (record.type !== "childList" || record.target.nodeType !== Node.ELEMENT_NODE || record.addedNodes.length === 0)
          continue;
        record.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE || !(node instanceof HTMLElement))
            return;
          const newElement = node;
          this._handlerMap.forEach((handler, selector) => {
            if (newElement.matches(selector)) {
              this._invokeHandler(handler, newElement, selector);
            }
            newElement.querySelectorAll(selector).forEach((nestedElement) => {
              this._invokeHandler(handler, nestedElement, selector);
            });
          });
        });
      }
    }
    /**
     * 安全执行处理器函数
     * @param handler - 注册的回调函数
     * @param targetElement - 待处理的 HTML 元素（已做类型断言）
     * @param selector - 对应的选择器标识
     */
    _invokeHandler(handler, targetElement, selector) {
      try {
        handler(targetElement, selector);
      } catch (error) {
        console.error(`[ElementCreateListener]  Handler error for "${selector}":`, error);
      }
    }
    //======== 公开接口 ========//
    /**
     * 注册元素处理器
     * @param selector - CSS 选择器
     * @param callback - 匹配到元素时执行的回调
     * @returns 当前实例（支持链式调用）
     */
    addHandler(selector, callback) {
      this._handlerMap.set(selector, callback);
      if (this._listeningMode === "auto")
        this.activate();
      return this;
    }
    /**
     * 移除指定选择器的处理器
     * @param selectors - 要移除的 CSS 选择器列表
     * @returns 当前实例（支持链式调用）
     */
    removeHandler(...selectors) {
      selectors.forEach((selector) => this._handlerMap.delete(selector));
      if (this._handlerMap.size === 0)
        this.deactivate();
      return this;
    }
    /**
     * 清空所有处理器并停止监听
     * @returns 当前实例（支持链式调用）
     */
    clearHandlers() {
      this._handlerMap.clear();
      this.deactivate();
      return this;
    }
    /**
     * 启动 DOM 监听（幂等操作）
     * @remarks 重复调用不会产生副作用
     * @returns 当前实例（支持链式调用）
     */
    activate() {
      if (this._operationStatus === "idle") {
        this._operationStatus = "active";
        this._observer.observe(document.documentElement, {
          childList: true,
          // 监控子节点变化
          subtree: true
          // 监控所有后代节点
        });
      }
      return this;
    }
    /**
     * 停止 DOM 监听（幂等操作）
     * @returns 当前实例（支持链式调用）
     */
    deactivate() {
      this._operationStatus = "idle";
      this._observer.disconnect();
      return this;
    }
    /**
     * 延时自动停止监听
     * @param timeout - 延迟时间（毫秒）
     * @returns 当前实例（支持链式调用）
     */
    delayedDeactivate(timeout) {
      setTimeout(() => this.deactivate(), timeout);
      return this;
    }
  }
  new ElementCreateListener("auto").addHandler(".MC_AEM_Wrapper", (el) => el.style.display = "none").delayedDeactivate(10 * 1e3);

})();