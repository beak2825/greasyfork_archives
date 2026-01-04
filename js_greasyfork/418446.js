// ==UserScript==
// @name 淘宝简化
// @namespace https://greasyfork.org/users/149095
// @version 1.1.0
// @description 淘宝简化插件
// @author SettingDust
// @grant GM_addStyle
// @run-at document-start
// @match *://*.taobao.com/*
// @downloadURL https://update.greasyfork.org/scripts/418446/%E6%B7%98%E5%AE%9D%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/418446/%E6%B7%98%E5%AE%9D%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
let css = `
  .tbh-superbanner,
  .tbh-decorations,
  .tbh-logo,
  .tbh-qr-wrapper,
  .search-ft,
  .tbh-nav,
  .tbh-tipoff,
  .tbh-conve,
  .tbh-notice,
  .tbh-app,
  .tbh-venues,
  .screen-outer,
  .seat-gg,
  .tbh-discover-goods,
  .tbh-shop,
  .tbh-live,
  .tbh-sale,
  .tbh-fashion,
  .tb-tanx-wrapper,
  .tbh-fixedtool,
  .site-nav-seller,
  .site-nav-free,
  .site-nav-mobile,
  .site-nav-sitemap,
  .hotsale-hd,
  .tbh-helper,
  .hotsale-ft,
  #J_SiteFooter,
  #J_Banner,
  [data-ad="1"] {
    display: none !important
  }

  body,
  html,
  .search-decorations {
    background: none;
    background-color: #efefef !important;
  }
  .tbh-member {
    background: none !important
  }
  .layer-inner {
    margin: 0
  }
  .search-panel-fields {
    background: white;
  }
  .J_Top {
    background: transparent;
    padding-top: 96px
  }
  .tbh-hotsale {
    padding: 48px 0;
    background: transparent;
  }
  .tbh-hotsale .list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .tbh-hotsale .list .item {
    margin: 16px;
    padding: 0;
    border-radius: 8px;
    background-color: #efefef;
    border: none;
    transition: 225ms;
    height: unset;
    box-shadow: 4px 4px 8px #cbcbcb,
    -4px -4px 8px #ffffff;
  }

  .tbh-hotsale .list .item:hover {
    transition: 225ms;
    box-shadow: 2px 2px 4px #cbcbcb,
    -2px -2px 4px #ffffff;
    border: none;
  }

  .tbh-hotsale .list .item:active {
    box-shadow: 2px 2px #ffffff,
    -2px -2px #e8e8e8;
  }


  .tbh-hotsale .list .item h4 img {
    display: none;
  }

  .tbh-hotsale .list .item h4,
  .tbh-hotsale .list .item .info {
    padding: 0 12px;
  }
  .tbh-hotsale .list .item .item-more {
    width: 100%;
    padding: 8px 12px;
    box-sizing: border-box;
    height: unset;
    background-image: linear-gradient(180deg, #efefef00 0%, #efefef8a 12%, #efefeff0 28%, #efefef 47%);
  }
  .tbh-hotsale .list .item .item-more .similar {
    width: unset;
    background: none;
    color: #ff5000;
    line-height: 24px;
    height: 24px;
    margin: 8px 0;
  }
  .tbh-hotsale .list .item .img-wrapper {
    background: transparent;
    mix-blend-mode: multiply;
  }
  .img-wrapper img {
    opacity: 1
  }
  .img-wrapper:hover img {
    opacity: 1
  }
  .hotsale-item .img-wrapper {
    border-radius: 8px;
  }
  .hotsale-item:hover img {
    opacity: 1
  }
  .hotsale-item .img-wrapper img {
    border-radius: 8px;
  }
  .layer {
    width: unset;
  }
  @media(min-width: 1588px) {
    .layer {
      padding: 0 130px
    }
  }
  @media(min-width: 1831px) {
    .layer {
      padding: 0 196px
    }
  }
  .tbh-hotsale .list .item .info {
    margin-top: 16px;
    margin-bottom: 16px;
  }
  .cart-logo a {
    font-size: 0;
  }
  .cart-logo a span {
    mix-blend-mode: multiply;
  }
  .tbh-search {
    margin-left: 284px;
    margin-right: 284px;
  }
  .search-fixed .search-bd {
    transition: 225ms;
    background-color: #efefef;
    box-shadow: 4px 4px 8px #cbcbcb, -4px -4px 8px #ffffff;
    display: flex;
    align-items: center;
  }
  .search-fixed .search-bd:hover {
    box-shadow: 2px 2px 4px #cbcbcb, -2px -2px 4px #ffffff;
  }
  .search-fixed .search-bd .search-panel {
    width: 100%;
  }
  .search-fixed .search-bd .search-panel .search-common-panel {
    background-color: transparent;
    border: none;
  }
  .search-fixed .search-bd .search-triggers {
    cursor: pointer;
    background-color: transparent;
    transition: 225ms;
  }
  .search-fixed .search-bd .search-triggers:hover {
    background-color: #f8f8f8;
  }
  .search-fixed .search-bd .search-triggers:hover {
    background-color: #fff;
  }
  .search-fixed .search-bd .search-panel .search-common-panel .search-combobox-input-wrap {
    border: none;
    overflow: visible;
    display: flex;
    align-items: center;
  }
  .search-bd .search-panel .search-common-panel #q {
    background-color: transparent;
    transition: 225ms;
    box-shadow: inset 1px 1px #cbcbcb, 1px 1px #ffffff;
    padding: 4px 32px 4px 8px;
    text-indent: 0;
  }
  .search-bd .search-panel .search-common-panel #q:focus {
    box-shadow: inset 2px 2px #cbcbcb, 2px 2px #ffffff;
  }
  .search-bd .search-panel .search-common-panel i {
    top: 7px;
  }
  .search-fixed .search-bd .search-panel .search-common-panel label {
    top: 9px;
  }
  .search-fixed .search-bd .search-triggers li {
    height: 36px;
    line-height: 36px;
  }
  .search-fixed .search-bd .search-panel .search-button {
    top: 3px;
    right: 3px;
    height: 30px;
    margin-top: 0;
    width: 64px;
  }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
