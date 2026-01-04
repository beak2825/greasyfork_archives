// ==UserScript==
// @name         [via]知乎直接看 修改
// @version      3.0
// @license      Anti 996 License
// @namespace    https://viayoo.com/
// @homepageURL  https://app.viayoo.com/addons/16
// @author       谷花泰
// @modifier     qidian55
// @description  不用打开知乎app，直接看文章
// @run-at       document-start
// @match        *://zhihu.com/question/*
// @match        *://www.zhihu.com/question/*



// @grant        none
// @webRequest   {"selector":"https://static.zhihu.com/heifetz/mobile.app.55f00d73470cd90b80cf.js","action":"cancel"}
// @downloadURL https://update.greasyfork.org/scripts/529826/%5Bvia%5D%E7%9F%A5%E4%B9%8E%E7%9B%B4%E6%8E%A5%E7%9C%8B%20%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/529826/%5Bvia%5D%E7%9F%A5%E4%B9%8E%E7%9B%B4%E6%8E%A5%E7%9C%8B%20%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==
(function () {
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
  };
  function hideDownApp() {
    const style = document.createElement('style');
    style.innerHTML = `
      .MobileAppHeader-downloadLink, .css-189wwwq, DIV.Popover, .MBannerAd, .RelatedReadings, .HotQuestions, .KfeCollection-VipRecommendCard, .css-1ildg7g, DIV.oia-action-bar, DIV.css-pcc2vs, .css-4r6j01
 {
        display: none !important;
      }
      .css-1aq8hf9 {
        width: 80% !important;
      }
    `;
    document.querySelector('head').appendChild(style);
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
    hideDownApp();
  } catch (err) {
    console.log('知乎直接看：', err)
  };
})();