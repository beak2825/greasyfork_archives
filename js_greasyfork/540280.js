// ==UserScript==
// @name        jm-remove-ad
// @namespace   Violentmonkey Scripts
// @match       https://18comic.vip/
// @match       https://18comic.vip/*
// @run-at      document-start
// @grant       GM_addStyle
// @version     3.0.1
// @author      mesimpler
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @description JM漫画去广告
// @downloadURL https://update.greasyfork.org/scripts/540280/jm-remove-ad.user.js
// @updateURL https://update.greasyfork.org/scripts/540280/jm-remove-ad.meta.js
// ==/UserScript==
function removeElements(selectors) {
  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector)
    if (elements) {
      elements.forEach(el => el.remove())
    }
  });
}

GM_addStyle(`
  /* 修复去除顶部外链后的空白间隔 */
  #Comic_Top_Nav {
    top: 0 !important; 
  }

  /* 修复标题栏没对齐的问题(JM前端代码写得和狗屎一样) */
  #Comic_Top_Nav>.container>.navbar-header {
    display: flex;
    align-items: center !important;
    justify-content: space-between;
  }
  .navbar-toggle {
    margin-right: 0 !important;
  }
  a[href="#shunt-modal"] {
    margin-top: 0 !important;
  }
  .head-right.visible-xs.visible-sm {
    padding: 0 !important;
  }

  /* 修复去除首页滚动广告后grid菜单与顶部的空白间隔问题 */
  body {
    padding-top: 70px !important;
  }

  /* 返回顶部悬浮按钮 */
  .float_right {
    top: 80% !important;
  }

  /* 底部Tab补齐 */
  .ph-bottom li {
    width: 100% !important;
  }
`)

const ADS_SELECTORS = [
  `.modal-dialog.billboard-modal`, //>18警告模态框
  `#billboard-modal.modal.fade.in`, `.modal-backdrop.fade.in`, // >18警告模态框背景遮罩
  `.top-nav:has(.top-bar)`, // 顶部广告外链
  `.div-bf-pv`, // 首页滚动广告
  `.float_right > div:has(p a[rel="nofollow noopener"])`, // 与悬浮返回顶部按钮一起的广告下载按钮
  `.float_right > div:has(a[href="#app_modal"])`, // 与悬浮返回顶部按钮一起的app下载按钮
  `div[data-group*="sticky"]`, // 首页的右下角弹窗广告
  `[data-group*="all_bottom"]`, // 插入在信息流中的广告画廊
  `.ph-active:has(.meun-video)`, // 小电影Tab
  `.ph-active:has(.meun-game)`, // 游戏Tab
  `.ph-active:has(a[href="/veteran"])`, // 好站推荐Tab

  `.m-header-info-profile`, // 个人资料页 繁杂信息
  `.user-daily-mission`, // 个人资料页 个人任务

  `div[style="display: flex;margin-bottom:10px;justify-content: center;"]`, // 书库页 顶部广告贴片
  `.row:has(div[data-group*="list"])`, // 类别页 插入的贴片广告
  `div[data-group*="board"]`, // 评论页 头部广告
  `.row:has(div[data-group*="all_albums"])`, // 搜索页 底部广告

  `.row:has(div[class*="mobile-ad"])`, // 本子详情页 顶部广告
  `div[data-group="album_detail"]`, // 本子详情页 分集处插入广告
  `.row:has(div[data-group*="album_related"])`, // 本子详情页 底部广告

  `[data-group*="photo_center"]`, // 本子阅读页 顶部广告
  `.row:has(div[data-group*="photo_bottom"])`, // 本子阅读页 底部广告
  `div:has(iframe[scrolling="no"])` // 本子阅读页 底部弹窗广告
];

removeElements(ADS_SELECTORS)

if (document.body) {
  VM.observe(document.body, () => removeElements(ADS_SELECTORS));
} else {
  document.addEventListener("DOMContentLoaded", () => {
    VM.observe(document.body, () => removeElements(ADS_SELECTORS));
  });
}

window.addEventListener("load", removeElements(ADS_SELECTORS));
