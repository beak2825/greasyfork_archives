// ==UserScript==
// @name         uView Plus Ad Bypass (VIP Simulation + Google Ads Blocker)
// @namespace    https://uiadmin.net/
// @version      1.0.3
// @description  Bypass uView Plus documentation ad verification, block QR prompts, and remove Google ads (AdSense, DoubleClick, FundingChoices).
// @description:zh-CN  拦截 uView Plus 文档广告验证请求，模拟 VIP 响应，移除二维码弹窗及 Google 广告组件（AdSense、双击广告等）。
// @author       WanliZhong
// @license      MIT
// @homepage     https://uview-plus.lingyun.net/
// @supportURL   https://uview-plus.lingyun.net/cooperation/about.html
// @match        https://uiadmin.net/*
// @match        https://*.uiadmin.net/*
// @match        https://uview-plus.jiangruyi.com/*
// @match        https://uview-plus.lingyun.net/*
// @icon         https://uview-plus.lingyun.net/favicon.ico
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535688/uView%20Plus%20Ad%20Bypass%20%28VIP%20Simulation%20%2B%20Google%20Ads%20Blocker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535688/uView%20Plus%20Ad%20Bypass%20%28VIP%20Simulation%20%2B%20Google%20Ads%20Blocker%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const realXHR = window.XMLHttpRequest;

  class MockXHR {
    constructor() {
      this._xhr = null;
      this._url = '';
      this._listeners = {};
    }

    open(method, url) {
      this._url = url;
      this._intercept = url.includes('/api/v1/wxapp/ad/add');
      this._method = method;
    }

    send(body) {
      if (this._intercept) {
        const id = (() => {
          try {
            return JSON.parse(body).id || 'fake-id';
          } catch {
            return 'fake-id';
          }
        })();

        const fakeRes = JSON.stringify({ code: 200, data: { isVip: true, id }, msg: '成功', env: 'prod' });
        Object.assign(this, {
          readyState: 4,
          status: 200,
          responseText: fakeRes,
          response: fakeRes,
          responseURL: this._url
        });

        setTimeout(() => {
          this.onload?.({ target: this });
          this.onreadystatechange?.({ target: this });
          (this._listeners.load || []).forEach(cb => cb({ target: this }));
          (this._listeners.readystatechange || []).forEach(cb => cb({ target: this }));
        }, 10);
      } else {
        const xhr = this._xhr = new realXHR();
        xhr.onreadystatechange = (...args) => {
          this._syncFrom(xhr);
          this.onreadystatechange?.(...args);
        };
        xhr.onload = (...args) => {
          this._syncFrom(xhr);
          this.onload?.(...args);
        };
        xhr.open(this._method, this._url, true);
        xhr.send(body);
      }
    }

    _syncFrom(xhr) {
      ['readyState', 'status', 'responseText', 'response', 'responseURL'].forEach(k => this[k] = xhr[k]);
    }

    setRequestHeader() { }
    getAllResponseHeaders() { return ''; }
    getResponseHeader() { return null; }
    abort() { }
    addEventListener(type, cb) {
      (this._listeners[type] ||= []).push(cb);
    }
  }

  Object.defineProperty(window, 'XMLHttpRequest', {
    configurable: true,
    writable: true,
    value: MockXHR
  });


  // 广告清理函数
  function cleanAllAds() {
    try {
      // 移除广告脚本
      document.querySelectorAll('script[src*="googlesyndication"], script[src*="fundingchoicesmessages"]').forEach(e => e.remove());
      // 移除广告 iframe
      document.querySelectorAll('iframe[src*="googlesyndication"], iframe[src*="doubleclick"]').forEach(e => e.remove());
      // 移除常见广告 DOM
      document.querySelectorAll('[class*="adsbygoogle"], [id*="adsbygoogle"], .fc-ab-root, .google-auto-placed, .ad-container')
        .forEach(e => e.remove());
    } catch (err) {
      console.warn('[AdBypass] ❌ Error cleaning ads:', err);
    }
  }

  // 页面加载后立即清除广告，并延迟几轮再次清除
  document.addEventListener('DOMContentLoaded', () => {
    cleanAllAds();
    setTimeout(cleanAllAds, 1000);
    setTimeout(cleanAllAds, 3000);
    setTimeout(cleanAllAds, 5000);
  });

  // 观察 DOM 动态插入内容
  function observeWhenBodyReady() {
    const interval = setInterval(() => {
      if (document.body) {
        const observer = new MutationObserver(() => cleanAllAds());
        observer.observe(document.body, { childList: true, subtree: true });
        clearInterval(interval);
      }
    }, 100);
  }

  observeWhenBodyReady();

  // 可选：屏蔽 alert 弹窗
  window.alert = function (message) {
    console.log("Blocked alert:", message);
    throw new Error("alert() was blocked to prevent interruption.");
  };
})();