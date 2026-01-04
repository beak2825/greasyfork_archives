// ==UserScript==
// @name         云药房脚本
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  获取cookie传给服务端
// @author       lizi.zhy
// @match        http://hzh.drugcloud.cn
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      hop.come-future.com
// @downloadURL https://update.greasyfork.org/scripts/443936/%E4%BA%91%E8%8D%AF%E6%88%BF%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/443936/%E4%BA%91%E8%8D%AF%E6%88%BF%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

const API_HOST = 'https://hop.come-future.com/hop-app-drugstore';
// const API_HOST = 'http://kapi-hbos-dev.cfuture.shop';

(() => {
  'use strict';

  let isFetch = false;

  let interval = null;

  (function(open) {
    XMLHttpRequest.prototype.open = function(e, url) {
      this.addEventListener("readystatechange", function(e) {
        if (this.readyState === 4){
          if (!isFetch) {
            fetch();
            isFetch = true;
          }
        }
      }, false);
      open.apply(this, arguments);
    };
  })(XMLHttpRequest.prototype.open);


  const fetch = () => {
    GM_xmlhttpRequest({
      url: `${API_HOST}/hop-app-drugstore/manage/open/sync-cookies/v2`,
      method: 'POST',
      cookie: document.cookie,
      data: '',
      headers: {
        'Content-type': 'application/json;charset=utf-8',
      },
      onload: (xhr) => {
        isFetch = true
        window.localStorage.setItem('fe-cookie', document.cookie);
      },
      onerror: (error) => {
        isFetch = false
      },
    });
  }

  const fetchClear = () => {
    GM_xmlhttpRequest({
      url: `${API_HOST}/hop-app-drugstore/manage/open/clear-cookies`,
      method: 'POST',
      cookie: document.cookie,
      data: '',
      headers: {
        'Content-type': 'application/json;charset=utf-8',
      },
      onload: (xhr) => {
        window.localStorage.removeItem('fe-cookie')
      },
      onerror: (error) => {
        isFetch = false
      },
    });
  }

  const getLoginFrame = () => {
    const iframe = document.getElementById('iframeLogin');
    if (iframe) {
      const _contentWindow = iframe.contentWindow;
      if (_contentWindow) {
        const cookie = window.localStorage.getItem('fe-cookie')
        if (cookie) {
          fetchClear();
        }
        interval && clearInterval(interval)
      }
    }
  }

  const getLoginFrameInterval = () => {
    interval = setInterval(() => {
      getLoginFrame();
    }, 1000)
  }

  getLoginFrameInterval()

})();
