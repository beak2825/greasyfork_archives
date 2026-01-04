// ==UserScript==
// @name         纯净苍穹
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  对常用网站去掉app下载提示
// @author       谷花泰
// @include      *://music.163.com/*
// @inculde      *://zhihu.com/*
// @inculde      *://bilibili.com/*
// @inculde      *://y.qq.com/*
// @include      *://www.baidu.com/*
// @include      *://m.baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/396315/%E7%BA%AF%E5%87%80%E8%8B%8D%E7%A9%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/396315/%E7%BA%AF%E5%87%80%E8%8B%8D%E7%A9%B9.meta.js
// ==/UserScript==

(function () {
  /* 执行判断 */
  const key = encodeURIComponent('谷花泰:纯净苍穹:执行判断');
  if (window[key]) {
    return;
  };
  window[key] = true;

  class FuckAD {
    constructor(configs) {
      this._configs = configs;

      /*
       * config里的配置解释
       * {
       *   正则匹配的域名数组
       *   sites: ['zhihu.com'],
       *
       *   移除的节点数组
       *   remove: ['#id'],
       *
       *   display隐藏的节点数组
       *   displayNone: ['#id'],
       *
       *   visibility隐藏的节点数组
       *   visibilityHidden: ['#id'],
       *
       *   额外的css
       *   style: `
       *   body {
       *     background-color: #000;
       *   }
       *   `,
       *
       *   额外的函数执行
       *   others() {
       *     console.log('others: 哈哈');
       *   }
       * }
       *
       */

      /* 初始化 */
      this.init();
    };
    /*
     * 初始化
     */
    init() {
      const that = this;
      /* 所有要移除的节点 */
      let remove = [];
      /* 总体style */
      let style = '';
      /* 要执行的其它函数集 */
      let others = [];

      /* 统计 */
      this._configs.forEach(config => {
        const canLoad = that.siteInList(config.sites);
        if (canLoad) {
          remove = remove.concat(config.remove);
          style += (config.style || '');
          style += (that.letSelectorsDisplayNone(config.displayNone));
          style += (that.letSelectorsVisibilityHidden(config.visibilityHidden));
          config.others && (others = others.concat(config.others));
        };
      });

      /* 添加style */
      this.addStyle(style);
      that.removeNodesBySelectors(remove);

      /* 执行others内所有函数 */
      try {
        others.forEach(func => {
          func();
        });
      } catch (err) {
        console.error('via: others function run error', err);
      };

      /* 监听dom，确保节点移除 */
      if (remove && remove.length > 0) {
        this.observe({
          targetNode: document.documentElement,
          config: {
            attributes: false
          },
          callback(mutations, observer) {
            that.removeNodesBySelectors(remove);
          }
        })
      }
    };
    /*
     * 监听dom节点加载函数
     */
    observe({ targetNode, config = {}, callback = () => { } }) {
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
    /*
     * 添加style
     */
    addStyle(style = '') {
      const styleElm = document.createElement('style');
      styleElm.innerHTML = style;
      document.head.appendChild(styleElm);
    };
    /*
     * 选择节点，返回节点数组
     */
    selectNodes(selector) {
      if (!selector) {
        return [];
      };
      const nodes = document.querySelectorAll(selector);
      return nodes;
    };
    /*
     * 判断网站是否在名单内
     */
    siteInList(sites) {
      const hostname = window.location.hostname;
      const result = sites.some(site => {
        if (hostname.match(site)) {
          return true;
        }
        return false;
      });
      return result;
    };
    /*
     * 移除多个节点
     */
    removeNodes(nodes = []) {
      Array.from(nodes, node => {
        node.parentNode.removeChild(node);
      });
    };
    /*
     * 根据selector数组移除多个节点
     */
    removeNodesBySelectors(selectors = []) {
      let nodeArr = [];
      selectors.forEach(selector => {
        const nodes = this.selectNodes(selector);
        if (nodes && nodes.length > 0) {
          nodeArr = nodeArr.concat(Array.from(nodes));
        };
      });
      this.removeNodes(nodeArr);
    };
    /*
     * 根据css选择器生成style
     */
    generateStyleBySelectors(selectors = [], customStyle = `{}`) {
      if (!selectors || selectors.length === 0) {
        return '';
      };
      let style = '';
      selectors.forEach(selector => {
        if (selector) {
          style += `

          ${selectors} ${customStyle}

          `;
        };
      });
      return style;
    };
    /*
     * 让数组里的选择器全部 display: none
     */
    letSelectorsDisplayNone(selectors = []) {
      return this.generateStyleBySelectors(selectors, `{
        display: none!important;
      }`);
    };
    /*
     * 让数组里的选择器全部 visibility: hidden
     */
    letSelectorsVisibilityHidden(selectors = []) {
      return this.generateStyleBySelectors(selectors, `{
        visibility: hidden!important;
      }`);
    };
  };

  new FuckAD([
    {
      sites: ['bilibili.com'],
      displayNone: [
        '.index__openAppBtn__src-commonComponent-topArea-',
        '.index__container__src-commonComponent-bottomOpenApp-',
        '.index__openApp__src-videoPage-related2Col-videoItem-',
        '.index__floatOpenBtn__src-videoPage-floatOpenBtn-',
        '.index__downLoadBtn__src-videoPage-commentArea-',
        '.bili-app-link-container',
        '.open-app-bar',
        '.btn-ctnr',
        '.bili-app',
        '#openAppBtn'
      ]
    },
    {
      sites: ['zhihu.com'],
      displayNone: [
        '.MobileAppHeader-downloadLink',
        '.ContentItem-more',
        '.TopstoryItem--advertCard',
        '.DownloadGuide',
        '.Profile-followButton',
        '.OpenInAppButton',
        '.OpenInApp',
        '.ViewAllInappButton',
        '.HotQuestions-bottomButton',
        '.MHotFeedAd',
        '.MBannerAd',
        '.HotQuestions'
      ],
      style: `
        .MobileAppHeader-actions {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
      `
    },
    {
      sites: ['www.baidu.com', 'm.baidu.com'],
      remove: [
        '#header > div:last-child',
        '.ec_wise_ad'
      ],
      displayNone: [
        '.blank-frame',
        '#bottom',
        '.suggest-hot',
        '.callicon-wrap',
        '#navs',
        '#page-copyright',
        '[data-module="xcxMulti"]',
      ],
      visibilityHidden: [
        '#userinfo-wrap'
      ],
      style: `
        body {
          background-color: #fff !important;
          height: 100vh !important;
        }
      `
    },
    {
      sites: ['music.163.com'],
      displayNone: [
        '.topfr',
        '.m-homeft',
        '.u-ft',
        '.cmt_more_applink'
      ],
      visibilityHidden: [
        '.m-moreLists'
      ],
      style: `
        .m-scroll_wrapper {
          bottom: 0 !important;
        }
      `
    },
    {
      sites: ['y.qq.com'],
      displayNone: [
        '#js_mod_dialog',
        '.top_box',
        '.bottom_bar',
        '.top_bar',
        '.top_operation_box',
        '.lyric_action',
        '.sing',
        '.btn_download',
        '.open_qqmusic__btn',
        '.similar_song',
        '.related_album',
        '.related_info',
        '.recommend_mv',
        '.mod_lead_flow'
      ]
    }
  ]);
})();