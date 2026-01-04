// ==UserScript==
// @name         知乎直接看
// @namespace 	 Dong
// @version      0.1
// @description  知乎去弹窗
// @author       Dong
// @include      *
// @grant        undefined
// @downloadURL https://update.greasyfork.org/scripts/397801/%E7%9F%A5%E4%B9%8E%E7%9B%B4%E6%8E%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/397801/%E7%9F%A5%E4%B9%8E%E7%9B%B4%E6%8E%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function () {
  /* 判断是否该执行 */
  const whiteList = ['zhihu.com'];
  const hostname = window.location.hostname;
  const key = encodeURIComponent('谷花泰:知乎直接看:执行判断');

  const result = whiteList.some(site => {
    if (hostname.match(site)) {
      return true;
    }
    return false;
  });

  if (!result || window[key]) {
    return;
  };

  window[key] = true;

  /* 代码正文 */
  Object.defineProperties(window.navigator, {
    'userAgent': {
      enumerable: true,
      value: 'Mozilla/5.0 (Windows Phone 10)'
    },
    'appVersion': {
      enumerable: true,
      value: '5.0 (Windows Phone 10)'
    },
    'platform': {
      enumerable: true,
      value: 'Win32'
    }
  });
  class FixView {
    constructor() {
      this.init();
    };
    init() {
      this.removeDownApp();
      const search = document.querySelector('.MobileAppHeader-searchBox');
      !search && this.addSearch();
    };
    addSearch() {
      const menu = document.querySelector('.MobileAppHeader-actions');
      const searchBox = document.createElement('div');
      const search = document.createElement('div');
      searchBox.setAttribute('style', `
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      `);
      searchBox.className = 'via-zhihu-search';
      search.setAttribute('style', `
        width: 80%;
        height: 32px;
        border-radius: 20px;
        border: 1px solid #ebebeb;
        background-color: rgba(235, 235, 235, 0.7);
        display: flex;
        align-items: center;
        padding-left: 10px;
      `);
      search.addEventListener('click', () => {
        location.href = 'https://www.zhihu.com/search?type=content&q=';
      }, true);
      search.innerHTML = this.getSearchSvg();
      searchBox.appendChild(search);
      menu.parentNode.insertBefore(searchBox, menu);
    };
    getSearchSvg() {
      return `<svg class="Zi Zi--Search" fill="#999" viewBox="0 0 24 24" width="18" height="18"><path d="M17.068 15.58a8.377 8.377 0 0 0 1.774-5.159 8.421 8.421 0 1 0-8.42 8.421 8.38 8.38 0 0 0 5.158-1.774l3.879 3.88c.957.573 2.131-.464 1.488-1.49l-3.879-3.878zm-6.647 1.157a6.323 6.323 0 0 1-6.316-6.316 6.323 6.323 0 0 1 6.316-6.316 6.323 6.323 0 0 1 6.316 6.316 6.323 6.323 0 0 1-6.316 6.316z" fill-rule="evenodd"></path></svg>`;
    };
    removeDownApp() {
      const style = document.querySelector('style');
      style.innerHTML += `
        .MobileAppHeader-downloadLink {
          display: none !important;
        }
      `;
    };
  };
  function observe({ targetNode, config = {}, callback = () => { } }) {
    if (!targetNode) {
      return;
    };

    config = Object.assign({
      attributes: true,
      childList: true,
      subtree: true
    }, config);

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  };
  try {
    console.log('嘿嘿嘿');
    observe({
      targetNode: document.documentElement,
      config: {
        attributes: false
      },
      callback(mutations, observer) {
        const mysearch = document.querySelector('.via-zhihu-search');
        const menu = document.querySelector('.MobileAppHeader-actions');
        const zhihuSearch = document.querySelector('.MobileAppHeader-searchBox');
        if (!mysearch && menu && !zhihuSearch) {
          new FixView();
        };
      }
    });
  } catch (err) {
    console.log('知乎直接看：', err)
  };
})();