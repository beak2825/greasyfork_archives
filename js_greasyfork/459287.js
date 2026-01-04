// ==UserScript==
// @name         浏览器搜索扩展工具(前端用)
// @version      1.2.0
// @namespace    http://tampermonkey.net/
// @description  划词搜索,一键跳转哔哩哔哩，谷歌，百度等。注：第一个图标为打开网址的按钮，仅当选中文本为链接时可用。
// @author       iamsee
// @match        http://*/*
// @include      https://*/*
// @include      file:///*
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL3.0
// @downloadURL https://update.greasyfork.org/scripts/459287/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%90%9C%E7%B4%A2%E6%89%A9%E5%B1%95%E5%B7%A5%E5%85%B7%28%E5%89%8D%E7%AB%AF%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/459287/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%90%9C%E7%B4%A2%E6%89%A9%E5%B1%95%E5%B7%A5%E5%85%B7%28%E5%89%8D%E7%AB%AF%E7%94%A8%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 样式定义
  const STYLES = {
    toolbar: `
      display: none !important;
      position: absolute !important;
      padding: 5px !important;
      margin: 0 !important;
      background: rgba(255,255,255,0.95) !important;
      border: 1px solid #ddd !important;
      border-radius: 4px !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
      z-index: 2147483647 !important;
    `,
    button: `
      cursor: pointer !important;
      display: inline-block !important;
      width: 20px !important;
      height: 20px !important;
      border: 0 !important;
      background: transparent !important;
      padding: 2px !important;
      margin: 0 2px !important;
      border-radius: 2px !important;
      transition: all 0.2s ease;
    `,
    buttonHover: `
      background: rgba(0,0,0,0.1) !important;
      transform: translateY(-2px);
    `
  };

  // 搜索引擎配置
  const SEARCH_ENGINES = [
    {
      name: '打开',
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26px' height='26px' viewBox='0 0 24 24'%3E%3C!-- Icon from Material Symbols Light by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --%3E%3Cpath fill='currentColor' d='M5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h5.615v1H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192h12.77q.23 0 .423-.192t.192-.423v-5.616h1v5.616q0 .69-.462 1.152T18.384 20zm4.123-5.03l-.708-.709L18.292 5H14V4h6v6h-1V5.708z'/%3E%3C/svg%3E",
      host: [''],
      action: text => {
        const url = /^https?:\/\//.test(text) ? text : `http://${text}`;
        openUrl(url);
      }
    },
    {
      name: '哔哩哔哩',
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26px' height='26px' viewBox='0 0 24 24'%3E%3C!-- Icon from Simple Icons by Simple Icons Collaborators - https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md --%3E%3Cpath fill='%2300A1D6' d='M17.813 4.653h.854q2.266.08 3.773 1.574Q23.946 7.72 24 9.987v7.36q-.054 2.266-1.56 3.773c-1.506 1.507-2.262 1.524-3.773 1.56H5.333q-2.266-.054-3.773-1.56C.053 19.614.036 18.858 0 17.347v-7.36q.054-2.267 1.56-3.76t3.773-1.574h.774l-1.174-1.12a1.23 1.23 0 0 1-.373-.906q0-.534.373-.907l.027-.027q.4-.373.92-.373t.92.373L9.653 4.44q.107.106.187.213h4.267a.8.8 0 0 1 .16-.213l2.853-2.747q.4-.373.92-.373c.347 0 .662.151.929.4s.391.551.391.907q0 .532-.373.906zM5.333 7.24q-1.12.027-1.88.773q-.76.748-.786 1.894v7.52q.026 1.146.786 1.893t1.88.773h13.334q1.12-.026 1.88-.773t.786-1.893v-7.52q-.026-1.147-.786-1.894t-1.88-.773zM8 11.107q.56 0 .933.373q.375.374.4.96v1.173q-.025.586-.4.96q-.373.375-.933.374c-.56-.001-.684-.125-.933-.374q-.375-.373-.4-.96V12.44q0-.56.386-.947q.387-.386.947-.386m8 0q.56 0 .933.373q.375.374.4.96v1.173q-.025.586-.4.96q-.373.375-.933.374c-.56-.001-.684-.125-.933-.374q-.375-.373-.4-.96V12.44q.025-.586.4-.96q.373-.373.933-.373'/%3E%3C/svg%3E",
      host: ['www.bilibili.com'],
      action: text => openUrl(`https://search.bilibili.com/video?keyword=${encodeURIComponent(text)}`)
    },
    {
      name: '谷歌',
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='0.98em' height='26px' viewBox='0 0 256 262'%3E%3C!-- Icon from SVG Logos by Gil Barbara - https://raw.githubusercontent.com/gilbarbara/logos/master/LICENSE.txt --%3E%3Cpath fill='%234285F4' d='M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027'/%3E%3Cpath fill='%2334A853' d='M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1'/%3E%3Cpath fill='%23FBBC05' d='M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z'/%3E%3Cpath fill='%23EB4335' d='M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251'/%3E%3C/svg%3E",
      host: ['www.google.com'],
      action: text => openUrl(`https://www.google.com/search?q=${encodeURIComponent(text)}`)
    },
    {
      name: 'Bing搜索',
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='0.66em' height='26px' viewBox='0 0 256 388'%3E%3C!-- Icon from SVG Logos by Gil Barbara - https://raw.githubusercontent.com/gilbarbara/logos/master/LICENSE.txt --%3E%3Cdefs%3E%3CradialGradient id='logosBing0' cx='93.717%25' cy='77.818%25' r='143.121%25' fx='93.717%25' fy='77.818%25' gradientTransform='scale(-1 -.71954)rotate(49.091 2.036 -2.204)'%3E%3Cstop offset='0%25' stop-color='%2300CACC'/%3E%3Cstop offset='100%25' stop-color='%23048FCE'/%3E%3C/radialGradient%3E%3CradialGradient id='logosBing1' cx='13.893%25' cy='71.448%25' r='150.086%25' fx='13.893%25' fy='71.448%25' gradientTransform='matrix(.55155 -.39387 .23634 .91917 -.107 .112)'%3E%3Cstop offset='0%25' stop-color='%2300BBEC'/%3E%3Cstop offset='100%25' stop-color='%232756A9'/%3E%3C/radialGradient%3E%3ClinearGradient id='logosBing2' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2300BBEC'/%3E%3Cstop offset='100%25' stop-color='%232756A9'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23logosBing0)' d='M129.424 122.047c-7.133.829-12.573 6.622-13.079 13.928c-.218 3.147-.15 3.36 6.986 21.722c16.233 41.774 20.166 51.828 20.827 53.243c1.603 3.427 3.856 6.65 6.672 9.544c2.16 2.22 3.585 3.414 5.994 5.024c4.236 2.829 6.337 3.61 22.818 8.49c16.053 4.754 24.824 7.913 32.381 11.664c9.791 4.86 16.623 10.387 20.944 16.946c3.1 4.706 5.846 13.145 7.04 21.64c.468 3.321.47 10.661.006 13.663c-1.008 6.516-3.021 11.976-6.101 16.545c-1.638 2.43-1.068 2.023 1.313-.939c6.74-8.379 13.605-22.7 17.108-35.687c4.24-15.718 4.817-32.596 1.66-48.57c-6.147-31.108-25.786-57.955-53.444-73.06c-1.738-.95-8.357-4.42-17.331-9.085a1633 1633 0 0 1-4.127-2.154c-.907-.477-2.764-1.447-4.126-2.154c-1.362-.708-5.282-2.75-8.711-4.539l-8.528-4.446a6021 6021 0 0 1-8.344-4.357c-8.893-4.655-12.657-6.537-13.73-6.863c-1.125-.343-3.984-.782-4.701-.723c-.152.012-.838.088-1.527.168'/%3E%3Cpath fill='url(%23logosBing1)' d='M148.81 277.994c-.493.292-1.184.714-1.537.938c-.354.225-1.137.712-1.743 1.083a8315 8315 0 0 0-13.204 8.137a2848 2848 0 0 0-8.07 4.997a388 388 0 0 1-3.576 2.198c-.454.271-2.393 1.465-4.31 2.654a2652 2652 0 0 1-7.427 4.586a3958 3958 0 0 0-8.62 5.316a3011 3011 0 0 1-7.518 4.637c-1.564.959-3.008 1.885-3.21 2.058c-.3.257-14.205 8.87-21.182 13.121c-5.3 3.228-11.43 5.387-17.705 6.235c-2.921.395-8.45.396-11.363.003c-7.9-1.067-15.176-4.013-21.409-8.666c-2.444-1.826-7.047-6.425-8.806-8.8c-4.147-5.598-6.829-11.602-8.218-18.396c-.32-1.564-.622-2.884-.672-2.935c-.13-.13.105 2.231.528 5.319c.44 3.211 1.377 7.856 2.387 11.829c7.814 30.743 30.05 55.749 60.15 67.646c8.668 3.424 17.415 5.582 26.932 6.64c3.576.4 13.699.56 17.43.276c17.117-1.296 32.02-6.334 47.308-15.996c1.362-.86 3.92-2.474 5.685-3.585a877 877 0 0 0 4.952-3.14c.958-.615 2.114-1.341 2.567-1.614a91 91 0 0 0 2.018-1.268c.656-.424 3.461-2.2 6.235-3.944l11.092-7.006l3.809-2.406l.137-.086l.42-.265l.199-.126l2.804-1.771l9.69-6.121c12.348-7.759 16.03-10.483 21.766-16.102c2.392-2.342 5.997-6.34 6.176-6.848c.037-.104.678-1.092 1.424-2.197c3.036-4.492 5.06-9.995 6.064-16.484c.465-3.002.462-10.342-.005-13.663c-.903-6.42-2.955-13.702-5.167-18.339c-3.627-7.603-11.353-14.512-22.453-20.076c-3.065-1.537-6.23-2.943-6.583-2.924c-.168.009-10.497 6.322-22.954 14.03c-12.457 7.71-23.268 14.4-24.025 14.87s-2.056 1.263-2.888 1.764z'/%3E%3Cpath fill='url(%23logosBing2)' d='m.053 241.013l.054 53.689l.695 3.118c2.172 9.747 5.937 16.775 12.482 23.302c3.078 3.07 5.432 4.922 8.768 6.896c7.06 4.177 14.657 6.238 22.978 6.235c8.716-.005 16.256-2.179 24.025-6.928c1.311-.801 6.449-3.964 11.416-7.029l9.032-5.572v-127.4l-.002-58.273c-.002-37.177-.07-59.256-.188-60.988c-.74-10.885-5.293-20.892-12.948-28.461c-2.349-2.323-4.356-3.875-10.336-7.99a25160 25160 0 0 1-12.104-8.336L28.617 5.835C22.838 1.85 22.386 1.574 20.639.949C18.367.136 15.959-.163 13.67.084C6.998.804 1.657 5.622.269 12.171C.053 13.191.013 26.751.01 100.35l-.003 86.975H0z'/%3E%3C/svg%3E",
      host: ['www.baidu.com'],
      action: text => openUrl(`https://www.bing.com/search?q=${encodeURIComponent(text)}`)
    },
    {
      name: '火山翻译',
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAk1BMVEVHcEwrYvk0RP8H3t8A7tcsUv8xS/4sUP84Ov8A4uY2P/8vUP4H4d4A69wnZ/s1P/81QP8E5t0A6ts0Ov8A4eYC5t81QP8tUf8tTf8xS/8xRv8G5+AA8tNkdf/n6v/8/v8kRv8nO//R2f/a/Pq5xP87Uf+v+PTH9/gQq+6GlP8r7uEIzOpr8OpP6+iXn/8qXP0QaPlpkrr6AAAAFnRSTlMAEuka/vwneP7+zGk3rQmRs1nVR8Z6X2X3QQAAARFJREFUKJHNkdlugzAQRVmshDUJRDFeMAazljRp///rMmOSlqriuT0vSByuPXdwnP+A626qXRQE0W4j5gWAd/jx8pAkPj6PlKI9rp2flyXJ4FCKgF0fnJaI75ysA3v6dhkhKNOzEJT2PX5w/pI5IVZ7Qoi+Mg3Y6OUuoOaBlBPlorlrrdDGz/GlHNtWt2PPueBVZzAaeMsuUilv7TAP95rz+k33aonaOkkopXxvZ8MZUBmldIeSYp0UpRy1qhmDYAVoJaigUMcNAUh2dVFAsIOz4d4GSsESfZTDePtkIJVZ8oZDKQEj5ZiUEy8seC/MDHMLrJph9Fq8YFajtU0v4XX6YMUa1PtlC0m8/0W88cP/lgcwwSAtznhWSwAAAABJRU5ErkJggg==",
      host: ['translate.volcengine.com'],
      action: text => openUrl(`https://translate.volcengine.com/translate?text=${encodeURIComponent(text)}`)
    },
    {
      name: '掘金',
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26px' height='26px' viewBox='0 0 24 24'%3E%3C!-- Icon from Simple Icons by Simple Icons Collaborators - https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md --%3E%3Cpath fill='%23007FFF' d='m12 14.316l7.454-5.88l-2.022-1.625L12 11.1l-.004.003l-5.432-4.288l-2.02 1.624l7.452 5.88Zm0-7.247l2.89-2.298L12 2.453l-.004-.005l-2.884 2.318l2.884 2.3Zm0 11.266l-.005.002l-9.975-7.87L0 12.088l.194.156l11.803 9.308l7.463-5.885L24 12.085l-2.023-1.624Z'/%3E%3C/svg%3E",
      host: ['juejin.im'],
      action: text => openUrl(`https://juejin.im/search?query=${encodeURIComponent(text)}&type=all`)
    },
    {
      name: 'GitHub',
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1.03em' height='26px' viewBox='0 0 256 250'%3E%3C!-- Icon from SVG Logos by Gil Barbara - https://raw.githubusercontent.com/gilbarbara/logos/master/LICENSE.txt --%3E%3Cpath fill='%23161614' d='M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46c6.397 1.185 8.746-2.777 8.746-6.158c0-3.052-.12-13.135-.174-23.83c-35.61 7.742-43.124-15.103-43.124-15.103c-5.823-14.795-14.213-18.73-14.213-18.73c-11.613-7.944.876-7.78.876-7.78c12.853.902 19.621 13.19 19.621 13.19c11.417 19.568 29.945 13.911 37.249 10.64c1.149-8.272 4.466-13.92 8.127-17.116c-28.431-3.236-58.318-14.212-58.318-63.258c0-13.975 5-25.394 13.188-34.358c-1.329-3.224-5.71-16.242 1.24-33.874c0 0 10.749-3.44 35.21 13.121c10.21-2.836 21.16-4.258 32.038-4.307c10.878.049 21.837 1.47 32.066 4.307c24.431-16.56 35.165-13.12 35.165-13.12c6.967 17.63 2.584 30.65 1.255 33.873c8.207 8.964 13.173 20.383 13.173 34.358c0 49.163-29.944 59.988-58.447 63.157c4.591 3.972 8.682 11.762 8.682 23.704c0 17.126-.148 30.91-.148 35.126c0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002C256 57.307 198.691 0 128.001 0m-80.06 182.34c-.282.636-1.283.827-2.194.39c-.929-.417-1.45-1.284-1.15-1.922c.276-.655 1.279-.838 2.205-.399c.93.418 1.46 1.293 1.139 1.931m6.296 5.618c-.61.566-1.804.303-2.614-.591c-.837-.892-.994-2.086-.375-2.66c.63-.566 1.787-.301 2.626.591c.838.903 1 2.088.363 2.66m4.32 7.188c-.785.545-2.067.034-2.86-1.104c-.784-1.138-.784-2.503.017-3.05c.795-.547 2.058-.055 2.861 1.075c.782 1.157.782 2.522-.019 3.08m7.304 8.325c-.701.774-2.196.566-3.29-.49c-1.119-1.032-1.43-2.496-.726-3.27c.71-.776 2.213-.558 3.315.49c1.11 1.03 1.45 2.505.701 3.27m9.442 2.81c-.31 1.003-1.75 1.459-3.199 1.033c-1.448-.439-2.395-1.613-2.103-2.626c.301-1.01 1.747-1.484 3.207-1.028c1.446.436 2.396 1.602 2.095 2.622m10.744 1.193c.036 1.055-1.193 1.93-2.715 1.95c-1.53.034-2.769-.82-2.786-1.86c0-1.065 1.202-1.932 2.733-1.958c1.522-.03 2.768.818 2.768 1.868m10.555-.405c.182 1.03-.875 2.088-2.387 2.37c-1.485.271-2.861-.365-3.05-1.386c-.184-1.056.893-2.114 2.376-2.387c1.514-.263 2.868.356 3.061 1.403'/%3E%3C/svg%3E",
      host: ['github.com'],
      action: text => openUrl(`https://github.com/search?q=${encodeURIComponent(text)}`)
    },
    {
      name: 'MDN',
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26px' height='26px' viewBox='0 0 24 24'%3E%3C!-- Icon from Simple Icons by Simple Icons Collaborators - https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md --%3E%3Cpath fill='currentColor' d='m21.538 1.1l-6.745 21.8h-2.77L18.77 1.1ZM24 1.1v21.8h-2.462V1.1Zm-12 0v21.8H9.538V1.1Zm-2.462 0L2.77 22.9H0L6.746 1.1Z'/%3E%3C/svg%3E",
      host: ['developer.mozilla.org/zh-CN/'],
      action: text => openUrl(`https://developer.mozilla.org/zh-CN/search?q=${encodeURIComponent(text)}`)
    }
  ];

  // 工具函数
  const utils = {
    getSelectedText: () => window.getSelection().toString().trim(),

    isTargetInToolbar: (target, toolbar) =>
      target === toolbar || (target.parentNode && target.parentNode === toolbar),

    calculatePosition: (e) => ({
      top: e.pageY + 30,
      left: Math.max(10, e.pageX - 60)
    }),

    createElement: (tag, attributes = {}, styles = '') => {
      const element = document.createElement(tag);
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
      if (styles) element.setAttribute('style', styles);
      return element;
    }
  };

  // 搜索管理器
  const searchManager = {
    saveSearch(text) {
      GM_setValue('search', text);
    },

    getSearch() {
      return GM_getValue('search');
    },

    clearSearch() {
      GM_setValue('search', '');
    },

    executeSearch(engine, text) {
      this.saveSearch(text);
      engine.action(text);
    },

    handleCustomSearch(customAction) {
      const text = this.getSearch();
      this.clearSearch();
      if (customAction) customAction(text);
    }
  };

  // 工具栏管理器
  const toolbarManager = {
    toolbar: null,

    init() {
      this.createToolbar();
      this.bindEvents();
      this.handleCustomSearch();
    },

    createToolbar() {
      this.toolbar = utils.createElement('div', {}, STYLES.toolbar);

      SEARCH_ENGINES.forEach(engine => {
        const button = this.createButton(engine);
        this.toolbar.appendChild(button);
      });

      document.documentElement.appendChild(this.toolbar);
    },

    createButton(engine) {
      const button = utils.createElement('img', {
        src: engine.image,
        alt: engine.name,
        title: engine.name
      }, STYLES.button);

      // 添加悬停效果
      button.addEventListener('mouseenter', () => {
        button.style.cssText += STYLES.buttonHover;
      });

      button.addEventListener('mouseleave', () => {
        button.style.cssText = STYLES.button;
      });

      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        button.style.cssText = STYLES.button;
        const text = utils.getSelectedText();
        console.log('Button clicked:', engine.name, 'Text:', text); // 调试信息
        if (text) {
          searchManager.executeSearch(engine, text);
        }
      });

      // 保持 mouseup 事件用于样式重置
      button.addEventListener('mouseup', () => {
        button.style.cssText = STYLES.button;
      });

      return button;
    },

    show(position) {
      this.toolbar.style.top = `${position.top}px`;
      this.toolbar.style.left = `${position.left}px`;
      this.toolbar.style.display = 'flex';
    },

    hide() {
      this.toolbar.style.display = 'none';
    },

    bindEvents() {
      // 防止选中文本消失
      document.addEventListener('mousedown', (e) => {
        if (utils.isTargetInToolbar(e.target, this.toolbar)) {
          e.preventDefault();
        }
      });

      // 监听选中变化
      document.addEventListener('selectionchange', () => {
        if (!utils.getSelectedText()) {
          this.hide();
        }
      });

      // 处理鼠标抬起事件
      document.addEventListener('mouseup', (e) => {
        // 如果点击的是工具栏按钮，不要阻止事件，让按钮的事件处理器执行
        if (utils.isTargetInToolbar(e.target, this.toolbar)) {
          // 只阻止默认行为，不阻止事件传播
          e.preventDefault();
          // 不要 return，让按钮事件继续执行
        }

        const text = utils.getSelectedText();
        if (text && this.toolbar.style.display === 'none') {
          this.show(utils.calculatePosition(e));
        } else if (!text && !utils.isTargetInToolbar(e.target, this.toolbar)) {
          // 只有在不是点击工具栏时才隐藏
          this.hide();
        }
      });
    },

    handleCustomSearch() {
      const hostCustomMap = {};
      SEARCH_ENGINES.forEach(engine => {
        engine.host.forEach(host => {
          hostCustomMap[host] = engine.custom;
        });
      });

      const savedText = searchManager.getSearch();
      if (savedText && window.location.host in hostCustomMap) {
        searchManager.handleCustomSearch(hostCustomMap[window.location.host]);
      }
    }
  };

  // 在新标签页中打开URL
  function openUrl(url) {
    console.log('Opening URL:', url); // 调试信息
    try {
      const win = window.open(url, '_blank');
      if (win) {
        if (window.focus) {
          win.focus();
        }
        console.log('URL opened successfully'); // 调试信息
      } else {
        console.error('Failed to open URL - popup blocked?'); // 调试信息
      }
      return win;
    } catch (error) {
      console.error('Error opening URL:', error); // 调试信息
      return null;
    }
  }

  // 初始化
  toolbarManager.init();

})();