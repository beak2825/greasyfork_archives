// ==UserScript==
// @name         csdn纯净版
// @description  csdn纯净版-只保留文字与评论
// @version      0.3
// @author       tomiaa
// @match      *://blog.csdn.net/*
// @namespace    http://tampermonkey.net/


// @downloadURL https://update.greasyfork.org/scripts/431402/csdn%E7%BA%AF%E5%87%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/431402/csdn%E7%BA%AF%E5%87%80%E7%89%88.meta.js
// ==/UserScript==
; (() => {
  const $ = id => document.querySelector(id);
  console.clear();
  const config = {
    'default': {
      remove: [
        /* 左侧 */
        '#asideSearchArticle',
        '#asideHotArticle',
        '#asideCategory',
        '#asideNewNps',
        '#asideArchive',
        '.aside-box-footer',
        '#asideNewComments',

        '.blog-tags-box',
        '.article-type-img',
        '.c-gray',
        '#blogColumnPayAdvert',
        '#health-companies',
        '.tool-QRcode',
        '.toolbar-advert',



        /* 右侧 */
        '#asideArchive',
        '.csdn-side-toolbar',


        '#copyright-box', // 底部
        '.recommend-box', // 推荐文章
        '.recommend-tit-mod',
        '.template-box',

        '.comment-sofa-flag',
        

        '#footerRightAds',


      ],
      css: `
      .more-toolbox-active .left-toolbox{
        transform: translateX(-34.4%) !important;
        left: 50% !important;
      }
      body{
        background: #f6f0da !important;
      }
      `,
    }
  }
  class Clear {

    constructor(config) {
      this.config = config;
      this.domain = '';
      this.query = null;
      this.init();
    }

    init() {
      // const currentHref = location.href.split('?');
      // this.domain = currentHref[0];
      this.domain = 'default'
      // this.query = currentHref[1];
      console.log(this.domain);

      this.removeToHidden(this.config?.[this.domain]?.remove);
      this.addCss(this.config?.[this.domain]?.css);
      this.remove(this.config?.[this.domain]?.remove);
      this.config?.[this.domain]?.fn?.();

    }

    remove(arr = []) {
      arr.map(item => $(item)).forEach(item => {
        item?.remove();
      })
    }

    removeToHidden(arr = []) {
      if (!arr.length) return;
      this.addCss(arr.join(',') + `{    
        display: none !important;
      }`)
    }

    addCss(css = '') {
      if (!css) return;
      let style = document.createElement('style')
      style.innerHTML = css;
      document.documentElement.appendChild(style);
    }

  }
  new Clear(config);
})();