// ==UserScript==
// @name        CSDN 简易清理
// @namespace   uk.jixun
// @match       https://blog.csdn.net/*
// @match       https://*.blog.csdn.net/*
// @run-at      document-start
// @grant       none
// @version     1.0
// @author      Jixun
// @description 一个简单的 CSDN 清理脚本（清理广告、登陆弹窗、内容复制、免费文章阅读全文）
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539343/CSDN%20%E7%AE%80%E6%98%93%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/539343/CSDN%20%E7%AE%80%E6%98%93%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==

(() => {
  function appendStyle() {
    const s = document.createElement('style');
    s.className = 'vipmaskclassname';
    s.textContent = `/*csdn clearnup v1*/

    #articleSearchTip,
    .csdn-side-toolbar,
    .passport-login-tip-container,
    #csdn-toolbar img[src*="gif"],
    .swiper-remuneration-container,
    .hide-article-box,
    .toolbar-msg-count,
    .toolbar-advert,
    #aside-content-column + * [data-fbox],
    .tool-active-list,
    [data-pid]
    {
      display: none !important;
      pointer-events: none !important;
    }


    #content_views pre code {
      padding: 0.5em 1rem !important;
    }
    #content_views,
    #content_views pre,
    #content_views pre code {
      user-select: unset !important;
    }

    .main_father {
      height: unset !important;
    }

    #content_views,
    #article_content,
    #kind_person_column .aside-content {
      height: unset !important;
      max-height: unset !important;
      overflow: unset !important;
    }

    #kind_person_column .aside-content {
      margin-bottom: 1em;
    }

    .blog_container_aside, #rightAside {
      position: sticky;
      top: 0;
    }

    .markdown_views code, .markdown_views kbd, .markdown_views pre, .markdown_views samp, .token.pre.gfm *,
    code, kbd, pre, samp {
      font-family: ui-monospace, 'Source Code Pro', 'Ubuntu Mono', 'Sarasa Mono SC', 'Ubuntu Mono', 'Microsoft YaHei UI', monospace, emoji !important
    }

    `;
    document.head.appendChild(s);
  }

  function preload() {
    document.cookie = 'popPageViewTimes=-999';
    Object.defineProperty(window, 'isOpenSourceBlog', { get: () => true, set: () => {}, configurable: false, enumerable: true });
    Object.defineProperty(document, 'html', { get: () => () => { throw null; }, set: () => {}, configurable: false, enumerable: true });

    Object.defineProperty(window, 'mdcp', { get: () => { throw null; }, set: () => {}, configurable: false, enumerable: true });
    let hljs = window.hljs;
    const hookHljs = () => {
      if (hljs) {
        Object.defineProperty(hljs, 'initCopyButtonOnLoad', { get: () => {}, set: () => { throw null; }, configurable: false, enumerable: false });
      }
    };
    hookHljs();
    Object.defineProperty(window, 'hljs', {
      get: () => hljs,
      set: (v) => {
        hljs = v;
        hookHljs();
      }
    });
  }

  let loaded = false;
  function main() {
    if (loaded || !document.body) return;

    loaded = true;
    document.removeEventListener('DOMContentLoaded', main);
    appendStyle();

    let comments;
    let Comments;
    const getDummyCsdnObject = () => {
      const obj = {
        userTooltip: () => {},
        baiduSearchInstall: () => {},
        sideToolbar: {
          options: { url: '#' },
        },
        trackad: {
          checkImgs: () => {},
          throttle: () => {},
        },
        toolbarData: {},
        csdnFooter: {},
        report: {
          viewCheck: () => {},
          reportView: () => {},
          reportClick: () => {},
        },
        collectionBox: {
          show: () => {},
          collect: () => {},
          getCollectInfo: () => {},
          close: () => {},
        },
        loginBox: {
          show: () => {},
          showTip: () => {},
          showAutoTip: () => {},
        },
        extensionBox: {
          show: () => {},
        },
        copyright: {
          init: () => {},
        },
        loadRightColumn: () => {},
      };
      Object.defineProperty(obj, 'comments', { get: () => comments, set: (v) => { comments = v; } });
      Object.defineProperty(obj, 'Comments', { get: () => Comments, set: (v) => { Comments = v; } });
      return obj;
    };
    Object.defineProperty(window, 'csdn', { get: getDummyCsdnObject, set: () => {}, configurable: false, enumerable: false });
  }

  document.addEventListener('DOMContentLoaded', main);
  requestAnimationFrame(main);
  preload();
})();
