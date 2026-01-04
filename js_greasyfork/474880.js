// ==UserScript==
// @name         释放被网站拦截的浏览器快捷键
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  取消网站的按键捕获，防止用于切换浏览器标签的快捷「cmd+num」被拦截
// @author       User
// @match        *://*/*
// @grant        GM_log
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474880/%E9%87%8A%E6%94%BE%E8%A2%AB%E7%BD%91%E7%AB%99%E6%8B%A6%E6%88%AA%E7%9A%84%E6%B5%8F%E8%A7%88%E5%99%A8%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/474880/%E9%87%8A%E6%94%BE%E8%A2%AB%E7%BD%91%E7%AB%99%E6%8B%A6%E6%88%AA%E7%9A%84%E6%B5%8F%E8%A7%88%E5%99%A8%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // 添加 document.getEventListeners()
  Document.prototype._addEventListener = Document.prototype.addEventListener;
  Document.prototype._removeEventListener = Document.prototype.removeEventListener;
  Document.prototype.addEventListener = function (type, listener, useCapture = false) {
    this._addEventListener(type, listener, useCapture);
    if (!this.eventListenerList) this.eventListenerList = {};
    if (!this.eventListenerList[type]) this.eventListenerList[type] = [];
    this.eventListenerList[type].push({ type, listener, useCapture });
  };
  Document.prototype.removeEventListener = function (type, listener, useCapture = false) {
    this._removeEventListener(type, listener, useCapture);
    if (!this.eventListenerList) this.eventListenerList = {};
    if (!this.eventListenerList[type]) this.eventListenerList[type] = [];
    for (let i = 0; i < this.eventListenerList[type].length; i++) {
      if (
        this.eventListenerList[type][i].listener === listener &&
        this.eventListenerList[type][i].useCapture === useCapture
      ) {
        this.eventListenerList[type].splice(i, 1);
        break;
      }
    }
    if (this.eventListenerList[type].length == 0) {
      delete this.eventListenerList[type];
    }
  };
  Document.prototype.getEventListeners = function (type) {
    if (!this.eventListenerList) this.eventListenerList = {};
    if (type === undefined) return this.eventListenerList;
    return this.eventListenerList[type];
  };

  // 移除document上的keydown按键事件
  try {
    var delay = 200;
    var cleanTimes = 0;
    var maxCleanTimes = 1000;
    var clean = function () {
      cleanTimes++;
      var events = document.getEventListeners('keydown') || [];
      if (events.length) {
        delay = delay >= 200 ? delay / 2 : 200;
      } else {
        delay *= 2;
      }
      if (events.length) {
        GM_log('[' + cleanTimes + '/' + delay + ']释放被网站拦截的浏览器快捷键：', events);
        for (var i = events.length - 1; i >= 0; i--) {
          document.removeEventListener('keydown', events[i].listener);
          GM_log('已释放被网站拦截的浏览器快捷键：', i);
        }
        // clearInterval(getEventsHandle);
      }
      if (cleanTimes < maxCleanTimes) {
        setTimeout(function () {
          clean();
        }, delay);
      } else {
        GM_log('已放弃释放被网站拦截的浏览器快捷键：', events);
      }
    };
    clean();
  } catch (e) {
    GM_log('释放被网站拦截的浏览器快捷键出错：', e);
  }
})();
