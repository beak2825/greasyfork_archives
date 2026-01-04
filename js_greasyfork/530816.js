// ==UserScript==
// @name         聚合搜索（顶部居中）
// @version      1.0
// @description  快速切换搜索引擎，搜索更方便
// @author       Never7
// @license      MIT
// @match        *://www.baidu.com/s*
// @match        *://www.google.com/*
// @match        *://*.bing.com/*
// @match        *://www.zhihu.com/search*
// @match        *://search.bilibili.com/*
// @grant        none
// @run-at       document-end
// @namespace    https://github.com/jqtmviyu/UserScripts
// @downloadURL https://update.greasyfork.org/scripts/530816/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2%EF%BC%88%E9%A1%B6%E9%83%A8%E5%B1%85%E4%B8%AD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/530816/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2%EF%BC%88%E9%A1%B6%E9%83%A8%E5%B1%85%E4%B8%AD%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ----- 配置常量 -----
  const DEBOUNCE_DELAY = 500;

  // ----- 工具函数 -----
  /**
   * 创建一个防抖函数，延迟 wait 毫秒后执行 func，
   * 每次调用会清除上次的定时器，确保只在最后一次触发后执行一次。
   */
  function debounce(func, wait) {
      let timeout;
      return function(...args) {
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(this, args), wait);
      };
  }

  /**
   * 获取当前 URL 的参数
   */
  function getURLParams() {
      return new URLSearchParams(window.location.search);
  }

  // ----- 搜索引擎配置 -----
  const searchEngines = {
      baidu: {
          icon: `
<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
<path d="M418.781 572.78c20.862-.012 41.713-.024 62.575 0-.037 109.59 0 219.181-.024 328.76-36.7.134-73.4.024-110.1.06-11.797-.315-23.788 1.032-35.402-1.686-24.59-5.014-46.13-20.414-61.386-40.014-11.65-14.43-18.374-32.294-21.712-50.39-3.337-18.896-2.949-38.374.17-57.259 6.02-20.777 16.833-40.39 32.246-55.68 12.877-12.865 28.921-22.465 46.276-27.902 6.99-2.148 14.212-3.993 21.578-3.932 21.919.048 43.849.012 65.78.012.036-30.657.023-61.313 0-91.97m-69.493 148.998c-12.646 5.826-24.467 15.074-30.487 27.914-4.175 11.25-6.226 23.29-6.505 35.28-.085 14.563 4.309 29.236 12.586 41.24 9.745 14.004 26.663 23.046 43.824 22.318 16.748-.049 33.484.012 50.22-.025.036-43.545.036-87.09 0-130.635-18.739-.048-37.477.025-56.203-.048-4.782-.097-9.127 2.196-13.435 3.956zm165.83-52.162c20.777-.012 41.567-.012 62.356 0 .061 51.021-.012 102.042.037 153.063.012 6.457 1.857 13.156 6.262 18.035 4.818 5.364 12.173 7.791 19.248 7.804 21.967 0 43.946 0 65.912-.013.025-59.6.049-119.202-.012-178.791 20.802-.219 41.616-.085 62.43-.073-.013 77.332 0 154.653-.013 231.973-50.45.133-100.9.048-151.351.048-16.008-1.444-32.065-7.209-44.177-18.01-13.617-12.209-21.493-30.644-20.716-48.933.036-55.026-.012-110.064.024-165.103z" fill="#FCFBFF"/><path d="M391.22 29.669c19.15-3.29 39.151 1.796 55.244 12.44 25.11 16.505 41.688 43.326 51.203 71.349 14.576 43.896 13.726 92.951-2.937 136.157-8.41 21.214-20.96 41.239-38.545 56.045-14.2 12.027-32.197 20.17-50.997 20.571-18.617.643-36.87-6.408-51.53-17.634-23.375-18.047-38.642-44.795-47.198-72.709-12.476-41.64-11.336-87.43 3.895-128.195 9.285-24.346 24.055-47.32 45.354-62.793 10.51-7.622 22.67-13.108 35.51-15.231zm280.36 21.784c13.471-2.9 27.283.801 39.419 6.675 17.21 8.314 31.821 21.324 43.63 36.24 16.469 21.007 27.901 46.226 31.384 72.78 2.682 18.472-.303 37.21-5.473 54.99-6.202 21.445-15.62 42.052-28.387 60.402-11.19 15.984-25.134 30.39-42.113 40.244-15.704 9.151-34.103 13.836-52.295 12.61-22.234-1.456-44.735-9.09-61.143-24.576-16.542-15.34-25.91-36.919-30.22-58.74-4.563-23.18-4.429-47.076-1.686-70.463 2.997-20.717 11.748-40.16 22.367-58.036 11.214-18.508 25-35.608 41.567-49.613 12.452-10.437 26.845-19.272 42.95-22.513zM167.887 250.55c20.34-3.738 41.7.534 59.699 10.51 26.578 14.66 47.174 38.8 60.439 65.852 5.364 11.201 9.49 23.144 10.619 35.583 3.313 31.166 2.658 63.279-6.323 93.51-6.08 20.535-16.857 40.11-33.096 54.335-20.073 17.816-47.198 26.457-73.764 26.82-22.222.329-44.286-7.924-60.997-22.536-22.076-19.127-35.79-46.312-42.987-74.274-4.721-18.982-6.918-38.91-3.799-58.327 4.551-32.453 14.054-64.99 32.732-92.26 13.398-19.564 33.702-35.232 57.477-39.213zm654.22 71.701c24.236-3.022 49.807.28 71.385 12.197 19.94 10.826 35.572 28.484 46.045 48.448 8.678 16.651 14.673 34.904 16.263 53.667.874 26.797 1.31 53.934-4.333 80.294-3.932 18.423-10.8 36.64-22.707 51.446-11.226 14.211-27.246 24.37-44.698 29.018-17.537 4.842-35.984 4.963-53.994 3.483-21.408-2.015-43.169-8.059-60.245-21.615-15.012-11.7-25.146-28.727-30.632-46.786-7.451-24.236-8.167-49.892-7.73-75.05.764-26.348 4.454-53.072 15.012-77.406 7.865-18.192 20.535-34.77 37.744-44.977 11.457-7.075 24.6-10.995 37.89-12.719zM496.72 419.28c24.467-2.925 49.65 1.408 71.908 11.942 34.564 16.239 61.288 45.317 81.677 77.017 25.402 36.64 55.16 70.063 86.362 101.836 29.673 29.88 60.706 58.436 93.17 85.27 5.413 4.623 11.239 8.786 16.178 13.944 24.552 25.098 39.6 58.946 42.78 93.826 3.532 36.967-5.364 74.116-20.328 107.758-11.238 24.71-30.595 45.584-54.552 58.388-33.132 17.913-71.762 22.209-108.875 20.862-36.106-1.493-71.944-8.12-106.387-19.006-41.858-11.335-85.961-14.551-129.033-9.393-20.073 2.22-39.54 7.828-59.468 10.91-44.904 7.367-90.646 9.855-136.072 6.87-37.732-1.141-74.104-20.207-97.624-49.565-14.552-17.889-24.686-39.018-31.385-60.985-6.262-20.474-10.097-41.919-9.041-63.388 1.031-25.34 8.556-50.22 20.826-72.369 18.253-33.253 45.887-60.28 75.779-83.157 8.52-6.809 18.022-12.537 25.267-20.79 14.09-13.059 28.945-25.268 42.793-38.581 26.105-24.698 50.196-51.725 69.893-81.86 5.655-8.495 10.425-17.585 16.712-25.656 26.299-34.297 66.155-59.018 109.42-63.873m-77.939 153.5c.024 30.656.037 61.312 0 91.969-21.93 0-43.86.036-65.779-.012-7.366-.061-14.587 1.784-21.578 3.932-17.355 5.437-33.399 15.037-46.276 27.901-15.413 15.292-26.226 34.904-32.246 55.681-3.119 18.885-3.507 38.363-.17 57.26 3.338 18.095 10.061 35.96 21.712 50.39 15.255 19.6 36.797 35 61.386 40.013 11.614 2.718 23.605 1.371 35.401 1.687 36.7-.037 73.4.073 110.1-.06.025-109.58-.012-219.17.025-328.761-20.862-.024-41.713-.012-62.575 0m96.338 96.835c-.036 55.039.012 110.077-.024 165.103-.777 18.289 7.1 36.724 20.716 48.933 12.112 10.801 28.169 16.566 44.177 18.01 50.45 0 100.9.085 151.351-.048.012-77.32 0-154.64.012-231.973-20.813-.012-41.627-.146-62.429.073.061 59.589.037 119.19.012 178.791-21.966.013-43.945.013-65.912.013-7.075-.013-14.43-2.44-19.248-7.804-4.405-4.879-6.25-11.578-6.262-18.035-.049-51.02.024-102.042-.037-153.063-20.79-.012-41.579-.012-62.356 0z" fill="#306CFF"/>
<path d="M349.289 721.777c4.308-1.76 8.653-4.053 13.435-3.956 18.726.073 37.464 0 56.203.048.036 43.545.036 87.09 0 130.635-16.736.037-33.472-.024-50.22.025-17.161.728-34.079-8.314-43.824-22.319-8.277-12.003-12.67-26.676-12.586-41.24.28-11.99 2.33-24.029 6.505-35.28 6.02-12.84 17.84-22.087 30.487-27.913z" fill="#306CFF"/></svg>
          `,
          url: 'https://www.baidu.com/s?wd=',
          getQuery: () => getURLParams().get('wd') || getURLParams().get('q') || getURLParams().get('keyword')
      },
      google: {
          icon: `
<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
<path d="M214.101 512c0-32.512 5.547-63.701 15.36-92.928L57.173 290.219A491.861 491.861 0 0 0 4.693 512c0 79.701 18.859 154.88 52.395 221.61l172.203-129.066A290.56 290.56 0 0 1 214.1 512" fill="#FBBC05"/>
<path d="M516.693 216.192c72.107 0 137.259 25.003 188.459 65.963l148.95-145.622C763.348 59.18 646.996 11.392 516.692 11.392c-202.325 0-376.234 113.28-459.52 278.827l172.374 128.853c39.68-118.016 152.832-202.88 287.146-202.88" fill="#EA4335"/>
<path d="M516.693 807.808c-134.357 0-247.509-84.864-287.232-202.88L57.173 733.781c83.243 165.547 257.152 278.827 459.52 278.827 124.843 0 244.054-43.392 333.568-124.757L686.677 764.032c-46.122 28.459-104.234 43.776-170.026 43.776" fill="#34A853"/>
<path d="M1005.397 512c0-29.568-4.693-61.44-11.648-91.008H516.651V614.4h274.602c-13.696 65.963-51.072 116.65-104.533 149.632l163.541 123.819C944.256 802.432 1005.397 675.2 1005.397 512" fill="#4285F4"/>
</svg>
          `,
          url: 'https://www.google.com/search?q=',
          getQuery: () => getURLParams().get('q') || getURLParams().get('wd') || getURLParams().get('keyword')
      },
      bing: {
          icon: `
<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23.274 83.903c1.596 1.002 4.587 3.708 11.07.701 3.49-1.904 5.784-3.307 6.98-4.21l-.498.301.1-26.36-.2-36.382s-.698-5.212-4.587-7.718c-4.289-3.408-11.27-8.219-12.167-8.52-.798-.7-3.79-1.803-5.684 1.905l.1 73.066s.099.802.298 2.105c1.197 1.904 2.793 4.11 4.588 5.112z" fill="url(#paint0_linear_102_2)"/>
<path d="M70.246 62.755l-28.921 17.54c-1.297.901-3.49 2.305-7.081 4.209-6.383 3.007-9.374.3-11.07-.702-1.795-1.002-3.39-3.207-4.587-5.211.598 2.806 1.994 7.817 5.585 11.325 4.587 4.711 10.172 10.825 25.23 8.62 3.391-1.002 7.081-3.007 13.663-7.417 4.987-3.308 10.073-5.011 14.261-10.825 4.688-12.929-4.587-16.738-7.08-17.54z" fill="url(#paint1_linear_102_2)"/>
<path d="M80.817 54.035c-3.191-6.114-3.69-8.72-13.663-14.533-10.172-5.212-11.668-6.014-11.668-6.014s-2.493-2.105-4.887-1.904c-2.293 1.002-3.79 2.405-2.094 6.815a721.65 721.65 0 0 0 4.986 13.23s.998 5.112 5.087 6.816c7.08 2.305 11.668 4.21 11.668 4.21l-.1.1c2.493.801 11.768 4.51 7.18 17.64 1.496-2.005 2.793-4.61 3.99-7.818 1.495-5.613 2.194-8.42-.5-18.542z" fill="url(#paint2_linear_102_2)"/>
<defs>
  <linearGradient id="paint0_linear_102_2" x1="10.121" y1="6.266" x2="45.133" y2="79.383" gradientUnits="userSpaceOnUse">
    <stop stop-color="#3BBDF5"/>
    <stop offset="1" stop-color="#1B45D9"/>
  </linearGradient>
  <linearGradient id="paint1_linear_102_2" x1="18.727" y1="80.945" x2="78.701" y2="80.945" gradientUnits="userSpaceOnUse">
    <stop stop-color="#5AD9FE"/>
    <stop offset=".51" stop-color="#43AAE1"/>
    <stop offset="1" stop-color="#144AD5"/>
  </linearGradient>
  <linearGradient id="paint2_linear_102_2" x1="55.304" y1="46.425" x2="82.931" y2="67.615" gradientUnits="userSpaceOnUse">
    <stop stop-color="#3DC0FE"/>
    <stop offset="1" stop-color="#61DDD5"/>
  </linearGradient>
</defs>
</svg>
          `,
          url: 'https://cn.bing.com/search?q=',
          getQuery: () => getURLParams().get('q') || getURLParams().get('wd') || getURLParams().get('keyword')
      },
      zhihu: {
          icon: `
<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
<path d="M999.367 834.987c0 89.488-72.557 162.044-162.043 162.044H189.128c-89.492 0-162.05-72.558-162.05-162.044V186.795c0-89.496 72.558-162.056 162.05-162.056h648.197c89.495 0 162.056 72.558 162.056 162.055l-.012 648.193zm-597.025-287.31H545.24c0-33.597-15.841-53.276-15.841-53.276H405.385c2.946-60.863 5.586-138.98 6.53-167.993h117.96s-.638-49.915-13.756-49.915H308.768s12.482-65.28 29.12-94.095c0 0-61.914-3.342-83.035 79.215-21.12 82.557-52.797 132.471-56.156 141.592-3.36 9.117 18.24 4.317 27.357 0 9.119-4.32 50.396-19.202 62.395-76.796h64.114c.865 36.502 3.402 148.363 2.602 167.992h-131.99c-18.716 13.437-24.958 53.275-24.958 53.275h150.86c-6.292 41.66-17.339 95.36-32.787 123.83-24.477 45.119-37.438 86.396-125.753 157.432 0 0-14.401 10.559 30.237 6.72 44.637-3.837 86.877-15.358 116.153-73.914 15.22-30.442 30.962-69.06 43.242-108.226l-.045.136 124.313 143.127s16.32-38.396 4.321-80.634l-92.153-103.194-31.198 23.073-.035.112c8.664-30.378 14.896-60.41 16.834-86.54.047-.63.095-1.273.137-1.922zm172.652-281.744v495.331h52.076l21.337 59.626 90.258-59.626h113.752V265.933H574.994zm223.828 442.053h-59.128l-73.747 48.716-17.43-48.716h-18.404V321.209h168.71v386.777zm0 0" fill="#1b61de"/>
</svg>
          `,
          url: 'https://www.zhihu.com/search?type=content&q=',
          getQuery: () => getURLParams().get('q') || getURLParams().get('wd') || getURLParams().get('keyword')
      },
      bilibili: {
          icon: `
<svg viewBox="0 0 1129 1024" xmlns="http://www.w3.org/2000/svg" width="35.281" height="32">
<path d="M268.463 70.487a70.724 70.724 0 0 1 60.115 0 147.106 147.106 0 0 1 36.776 26.875l141.449 123.767h101.136L749.386 97.362a148.52 148.52 0 0 1 36.776-26.875 70.724 70.724 0 0 1 94.065 58.701 70.724 70.724 0 0 1-15.56 47.385 395.348 395.348 0 0 1-31.118 28.29 204.392 204.392 0 0 1-19.803 16.266h88.405a149.935 149.935 0 0 1 103.965 46.678 150.642 150.642 0 0 1 47.385 103.964v406.664a286.433 286.433 0 0 1-3.537 61.53 157.008 157.008 0 0 1-70.723 99.014 152.057 152.057 0 0 1-81.333 22.632H248.659a299.87 299.87 0 0 1-63.65-3.537 156.3 156.3 0 0 1-97.6-70.724 151.35 151.35 0 0 1-24.047-81.333v-402.42a316.844 316.844 0 0 1 0-58.7 155.593 155.593 0 0 1 141.449-125.89h92.649c-14.853-10.608-27.583-23.339-41.02-34.654a70.724 70.724 0 0 1-22.632-57.994 70.724 70.724 0 0 1 34.655-55.872m-16.268 274.41a70.724 70.724 0 0 0-55.872 50.92 95.477 95.477 0 0 0 0 26.876v334.524a70.724 70.724 0 0 0 48.8 70.725 93.356 93.356 0 0 0 30.41 4.95h574.988a70.724 70.724 0 0 0 67.187-41.727 99.014 99.014 0 0 0 7.073-46.678V433.302a118.817 118.817 0 0 0 0-33.948 70.724 70.724 0 0 0-45.97-48.093 113.866 113.866 0 0 0-43.849-6.365H285.436a236.218 236.218 0 0 0-33.24 0zm0 0" fill="#20B0E3"/>
<path d="M368.184 455.226a70.724 70.724 0 0 1 48.8 16.266 70.724 70.724 0 0 1 24.753 52.336v70.724a70.724 70.724 0 0 1-14.145 45.264 70.724 70.724 0 0 1-115.988-8.487 91.942 91.942 0 0 1-9.193-48.093v-70.724a70.724 70.724 0 0 1 61.53-59.408zm365.642 0a70.724 70.724 0 0 1 75.676 66.48v70.724a82.747 82.747 0 0 1-10.609 46.68 70.724 70.724 0 0 1-116.695 0 84.161 84.161 0 0 1-11.315-50.215V518.17a70.724 70.724 0 0 1 61.53-62.237zm0 0" fill="#20B0E3"/>
</svg>
          `,
          url: 'https://search.bilibili.com/all?keyword=',
          getQuery: () => getURLParams().get('keyword') || getURLParams().get('q') || getURLParams().get('wd')
      }
  };

  /**
   * 根据当前 window.location.host 判断当前搜索引擎
   */
  function getCurrentEngine() {
      const host = window.location.host.toLowerCase();
      if (host.includes('baidu.com')) return 'baidu';
      if (host.includes('google.com')) return 'google';
      if (host.includes('bing.com')) return 'bing';
      if (host.includes('zhihu.com')) return 'zhihu';
      if (host.includes('bilibili.com')) return 'bilibili';
      return null;
  }

  /**
   * 获取当前搜索关键词
   */
  function getCurrentQuery() {
      const engine = getCurrentEngine();
      if (engine && searchEngines[engine]) {
          return searchEngines[engine].getQuery() || '';
      }
      return '';
  }

  /**
   * 切换搜索引擎，构造新 URL 后进行跳转
   */
  function switchEngine(engineName) {
      const query = getCurrentQuery();
      if (query) {
          const newUrl = searchEngines[engineName].url + encodeURIComponent(query);
          window.location.href = newUrl;
      }
  }

  // ----- 创建搜索引擎切换器 -----
  function createSwitcher() {
      let container = document.getElementById('search-switcher-container');
      if (container && container.isConnected) {
          return;
      }

      if (!container) {
          container = document.createElement('div');
          container.id = 'search-switcher-container';

          const shadow = container.attachShadow({ mode: 'open' });
          shadow.innerHTML = `
              <style>
                  :host {
                      display: block;
                      height: 54px;
                      color-scheme: light dark;
                  }
                  #search-switcher {
                      position: fixed;
                      left: 0;
                      top: 0;
                      right: 0;
                      z-index: 9999;
                      padding: 8px 16px;
                      /* 使用系统主题颜色 */
                      background-color: Canvas;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      gap: 12px;
                      height: 54px;
                      box-sizing: border-box;
                  }
                  #search-switcher .icon {
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      width: 38px;
                      height: 38px;
                      cursor: pointer;
                      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                      border-radius: 10px;
                      background: rgba(255, 255, 255, 0.1);
                      border: none;
                  }
                  #search-switcher .icon:hover {
                      transform: scale(1.2);
                      background: rgba(255, 255, 255, 0.2);
                  }
                  #search-switcher .icon svg {
                      width: 20px;
                      height: 20px;
                      opacity: 0.8;
                      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                  }
                  #search-switcher .icon:hover svg {
                      opacity: 1;
                      width: 24px;
                      height: 24px;
                  }
              </style>
              <div id="search-switcher"></div>
          `;

          const switcher = shadow.getElementById('search-switcher');
          const frag = document.createDocumentFragment();
          // 遍历所有搜索引擎配置，创建按钮
          for (const [name, engine] of Object.entries(searchEngines)) {
              const button = document.createElement('button');
              button.className = 'icon';
              button.title = name;
              button.setAttribute('aria-label', `切换到 ${name}`);
              if (engine.icon) {
                  // 创建一个临时容器，将 SVG 字符串转为 DOM 元素
                  const temp = document.createElement('div');
                  temp.innerHTML = engine.icon.trim();
                  // 获取 SVG 元素（假设 SVG 为首个子节点）
                  const svgEl = temp.firstElementChild;
                  if (svgEl) {
                      button.appendChild(svgEl);
                  }
              }
              button.addEventListener('click', () => switchEngine(name));
              frag.appendChild(button);
          }
          switcher.appendChild(frag);
      }

      // 将容器挂载到文档中（这里选择挂载到 body）
      if (!container.isConnected) {
          document.body.appendChild(container);
      }
  }

  function adjustPageContent() {
      // 给所有页面添加上边距
      document.body.style.marginTop = '45px';

      // 为不同搜索引擎添加特殊样式
      const currentEngine = getCurrentEngine();
      const style = document.createElement('style');
      if (currentEngine === 'bing') {
          style.textContent = `
              #b_header {
                  top: 45px !important;
              }
          `;
      } else if (currentEngine === 'google') {
          style.textContent = `
              #searchform {
                  top: 45px !important;
              }
          `;
      } else if (currentEngine === 'zhihu') {
        style.textContent = `
            .AppHeader {
                top: 45px !important;
            }
        `;
      } else if (currentEngine === 'bilibili') {
        style.textContent = `
            .search-fixed-header {
                top: 45px !important;
                margin-top: unset !important;
            }
        `;
      }
      document.head.appendChild(style);
  }

  // ----- 初始化函数 -----
  function init() {
      createSwitcher();
      adjustPageContent();

      // 仅在百度搜索页面下使用 MutationObserver 监控 DOM 变化
      if (getCurrentEngine() === 'baidu') {
          const debouncedCheck = debounce(() => {
              const container = document.getElementById('search-switcher-container');
              if (!container || !container.isConnected) {
                  createSwitcher();
                  adjustPageContent();
              }
          }, DEBOUNCE_DELAY);

          const observer = new MutationObserver(debouncedCheck);
          observer.observe(document.documentElement, { childList: true, subtree: true });
      }
  }

  // ----- 启动脚本 -----
  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
  } else {
      init();
  }
})();
