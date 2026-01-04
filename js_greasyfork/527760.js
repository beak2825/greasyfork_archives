// ==UserScript==
// @name        去nm的CSDN
// @description CSDN纯享版
// @license     MIT
// @namespace   zam157.csdnfucker
// @match       https://blog.csdn.net/*
// @grant       GM_addStyle
// @run-at      document-start
// @version     0.0.3
// @author      Zam157
// @homepageURL  https://github.com/zam157/tamper/tree/master/scripts/fck-csdn
// @supportURL   https://github.com/zam157/tamper/tree/master/scripts/fck-csdn
// @downloadURL https://update.greasyfork.org/scripts/527760/%E5%8E%BBnm%E7%9A%84CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/527760/%E5%8E%BBnm%E7%9A%84CSDN.meta.js
// ==/UserScript==

(function () {
  'use strict'
  const styles = `
    * {
      user-select: auto!important;
    }
    .passport-login-tip-container,
    .article-search-tip,
    .hljs-button,
    .blog_container_aside,
    .more-toolbar,
    .recommend-box,
    .passport-login-container,
    .article-info-box,
    .blog-footer-bottom,
    .hide-article-box,
    .sidecolumn-deepseek,
    .rightside-fixed-hide,
    a[data-type="app"],
    a[data-type="cs"],
    #blogColumnPayAdvert,
    #toolbarBox {
      display: none!important;
    }
    .nodata .container main {
      width: 100%;
    }
    .article_content {
      height: auto!important;
    }
    .d-flex.kind_person {
      display: none!important;
    }
  `
  GM_addStyle(styles)

  // 改写addEventListener，禁止注册copy事件
  const originalAEL = EventTarget.prototype.addEventListener
  EventTarget.prototype.addEventListener = function (...aelArgs) {
    // #region 禁止禁止复制
    if (aelArgs[0] === 'copy') {
      return
    }
    // #endregion

    // #region 禁止点击中转
    if (aelArgs[0] === 'click' && this.id === 'content_views') {
      function injectFn(...listenerArgs) {
        const e = listenerArgs[0]
        if (e.target.tagName === 'A')
          return
        aelArgs[1].apply(this, listenerArgs)
      }
      originalAEL.apply(this, [aelArgs[0], injectFn, aelArgs[2]])
      return
    }
    // #endregion

    originalAEL.apply(this, aelArgs)
  }
})()
