// ==UserScript==
// @name         简书目录树
// @name:zh      简书目录树
// @name:en      jianshu-dir-tree
// @namespace    https://github.com/WumaCoder/mini-tools.git
// @homepageURL  https://github.com/WumaCoder/mini-tools.git
// @version      1.0.4
// @description  简书目录的完美解决方案
// @description:en JIANSHU directory
// @author       WumaCoder
// @match        *://www.jianshu.com/p/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/animejs/3.1.0/anime.min.js
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/399616/%E7%AE%80%E4%B9%A6%E7%9B%AE%E5%BD%95%E6%A0%91.user.js
// @updateURL https://update.greasyfork.org/scripts/399616/%E7%AE%80%E4%B9%A6%E7%9B%AE%E5%BD%95%E6%A0%91.meta.js
// ==/UserScript==

(function () {
  /**
   * 请求拦截器
   * @param {Function} callback({status,responseURL}) 回调函数
   */
  function responseHander (callback) {
    const statusText = {
      'Continue': 100,
      'Switching Protocols': 101,
      'OK': 200,
      'Created': 201,
      'Accepted': 202,
      'Non-Authoritative Information': 203,
      'No Content': 204,
      'Reset Content': 205,
      'Partial Content': 206,
      'Multiple Choices': 300,
      'Moved Permanently': 301,
      'Found': 302,
      'See Other': 303,
      'Not Modified	': 304,
      'Use Proxy': 305,
      'Temporary Redirect': 307,
      'Bad Request': 400,
      'Unauthorized': 401,
      'Payment Required': 402,
      'Forbidden': 403,
      'Not Found': 404,
      'Method Not Allowed': 405,
      'Not Acceptable	': 406,
      'Proxy Authentication Required	': 407,
      'Request Timeout': 408,
      'Conflict': 409,
      'Gone': 410,
      'Length Required': 411,
      'Precondition Failed': 412,
      'Request Entity Too Large': 413,
      'Request-URI Too Long': 414,
      'Unsupported Media Type': 415,
      'Requested Range Not Suitable': 416,
      'Expectation Failed': 417,
      'Internal Server Error': 500,
      'Not Implemented': 501,
      'Bad Gateway': 502,
      'Service Unavailable': 503,
      'Gateway Timeout': 504,
      'HTTP Version Not Supported': 505,
      'Other': 12029,
    }
    Object.defineProperty(XMLHttpRequest.prototype, "status", {
      get: function () {
        const status = statusText[this.statusText] || statusText['Other'];
        callback({ status, responseURL: this.responseURL });
        return status;
      },
    })
  }
  /**
   * 提取主要信息
   * @param {Element} el 页面元素
   */
  function parserTag (el) {
    return {
      hx: el.tagName.substr(1) * 1,
      name: el.innerText,
      top: el.offsetTop - 80
    }
  }
  /**
   * 获取简书文章中的标题
   */
  function getHxTags () {
    const hxTags = [];
    const tags = document.querySelector("section:nth-child(1) > article").children;
    for (let i = 0; i < tags.length; i++) {
      const item = tags[i];
      if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(item.tagName)) {
        hxTags.push(item);
      }
    }
    return hxTags;
  }
  /**
   * 初始化自定义样式
   */
  function initStyle () {
    const style = document.createElement("style");
    style.innerText = `
      .jianshu-a{
        display: block;
        font-size: 14px;
        line-height: 22px;
        color: #2d2d2d;
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        word-break: break-all;
      }
      .jianshu-active{
        color:#ec7259;
      }
      .jianshu-a:hover{
        color:inherit;
        text-decoration: underline;
      }
      .jianshu-scroll{
        overflow-y: auto;
        height: 85vh;
      }
      .jianshu-scroll::-webkit-scrollbar,html::-webkit-scrollbar{
        background:#fff;
        width:0px;
        transintion:all 0.36s;
      }
      html::-webkit-scrollbar{
        width:6px
      }
      .jianshu-scroll::-webkit-scrollbar-thumb,html::-webkit-scrollbar-thumb{
        background:#ec7259;
      }
      #jianshu-dir:hover > .jianshu-scroll::-webkit-scrollbar{
        width:6px;
      }

    `;
    document.body.appendChild(style);
  }
  /**
   * 初始化事件
   */
  function initEvent () {
    window.scrollTop = 0;
    const activeCall = throttle(active, 100);
    window.addEventListener('scroll', (e) => {
      window.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      activeCall();
    });
  }
  /**
   * 节流函数
   * @param {Function} func 回调
   * @param {Number} wait 时间
   */
  function throttle (func, wait) {
    let previous = 0;
    return function () {
      let now = Date.now();
      let context = this;
      let args = arguments;
      if (now - previous > wait) {
        func.apply(context, args);
        previous = now;
      }
    }
  }
  // 防抖
  function debounce (fn, wait) {
    let timeout = null;
    return function () {
      if (timeout !== null) clearTimeout(timeout);
      timeout = setTimeout(fn, wait);
    }
  }
  /**
   * 激活当前标题
   */
  function active () {
    const hxTags = window.hxTags;
    const scrollTop = window.scrollTop;
    const hxElements = document.getElementsByClassName('jianshu-a');
    const jianshuDir = document.getElementsByClassName('jianshu-scroll')[0];
    let j = 0;
    for (let i = 0; i < hxTags.length; i++) {
      const el = hxTags[i];
      if (el.top > scrollTop) {
        hxElements[i].classList.add('jianshu-active');
        j = i + 1;
        break;
      } else {
        hxElements[i].classList.remove('jianshu-active');
      }
    }
    if (j - 1 < 10)
      toScroll((x, y) => jianshuDir.scrollTop = y, jianshuDir.scrollTop, 0);
    else
      toScroll((x, y) => jianshuDir.scrollTop = y, jianshuDir.scrollTop, hxElements[j - 10 % hxTags.length].offsetTop);
    for (; j < hxTags.length; j++) {
      const el = hxElements[j];
      el.classList.remove('jianshu-active');
    }
  }
  /**
   * 设置滚动条位置
   * @param {number} top 滚动条跳转位置
   */
  function toScroll (scrollFun, start, end) {
    let scroll = {
      charged: '0%',
      cycles: start
    }
    anime({
      targets: scroll,
      charged: '100%',
      cycles: end,
      round: 1,
      easing: 'easeInOutQuint',
      update: function () {
        scrollFun(0, scroll.cycles);
      }
    });
  }
  /**
   * 创建目录面板
   * @param {Array} hxTags 标题标签
   */
  function createDirView (hxTags) {
    const listElement = document.querySelector("[role=main] > aside > div > div > section")
    const titleElement = listElement.firstChild.cloneNode();
    const itemElement = listElement.lastChild.cloneNode();
    let minHx = 10;
    listElement.innerHTML = "";
    listElement.parentNode.id = "jianshu-dir";
    listElement.classList.add('jianshu-scroll');
    titleElement.innerHTML = "目录";
    listElement.appendChild(titleElement);
    hxTags.forEach(item => {
      if (minHx > item.hx) {
        minHx = item.hx;
      }
    });
    hxTags.forEach(item => {
      const listItem = itemElement.cloneNode();
      listItem.addEventListener('click', () => toScroll(window.scrollTo, window.scrollTop, item.top));
      listItem.style.marginLeft = `${(item.hx - minHx) * 10}px`;
      const tag = `<a class="jianshu-a">${item.name}</a>`;
      listItem.innerHTML = tag;
      listElement.appendChild(listItem);
    })
    if (hxTags.length === 0) {
      const listItem = itemElement.cloneNode();
      listItem.id = "listItem";
      listItem.innerHTML = `<span style="font-size: 12px;color: #969696;">本篇文章暂无目录</span>`;
      listElement.appendChild(listItem);
    }
    console.log("============================================");
    console.log("jianshu-dir-tree load ok");
    console.log("github: https://github.com/WumaCoder/mini-tools 获取更多脚本");
    console.log("jianshu-dir-tree version 1.0.2");
    console.log("============================================");

  }
  /**
   * 入口
   */
  function main () {
    const fun = debounce(() => {
      const hxTags = getHxTags().map(item => parserTag(item));
      window.hxTags = hxTags;
      createDirView(hxTags);
    }, 100);
    responseHander(({ responseURL }) => {
      if (responseURL.indexOf('recommendations') === -1) {
        return;
      }
      fun();
    });
  }

  initEvent();
  initStyle();
  main();
  // Your code here...
})();
