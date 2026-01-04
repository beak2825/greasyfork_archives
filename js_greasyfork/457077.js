// ==UserScript==
// @name         N+响应式布局
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  NNN!
// @author       小世界
// @license      MIT
// @include      /^https:\/\/(www.)?[A-Za-z]*-plus.net/
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/457077/N%2B%E5%93%8D%E5%BA%94%E5%BC%8F%E5%B8%83%E5%B1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/457077/N%2B%E5%93%8D%E5%BA%94%E5%BC%8F%E5%B8%83%E5%B1%80.meta.js
// ==/UserScript==

// https://stackoverflow.com/a/46516659/7659948
GM_addStyle ( `
  #header,#main,#footer {
    width: calc(100% - 32px);
    padding: 0px 16px;
  }
  body {
    font-size: 14px;
    background: #fff;
  }
  h3, h2 {
    font-size: 14px;
  }
  .t table tr.tr2 td.e {
    width: 100px !important;
  }
  .pages {
    height: 36px !important;
    line-height: 36px !important;
  }
  .pages ul li a, .pages ul li b {
    padding: 0 16px 0 16px !important;
  }
  .pages ul .pagesone {
    height: 36px !important;
  }
  .pages input {
     height: 35px;
     border: none;
     margin-right: 0;
     border-left: 1px solid #eeeeee;
  }
  #guide > li:nth-child(5) {
      width: 76px !important;
  }
  #fav-fid {
    display: flex;
    justify-content: flex-end;
  }
  #fav-fid ul {
    margin-left: 16px;
  }
  #spp-back-to-top {
    left: auto !important;
    right: 30px;
  }
  .dcsns-content {
    overflow: hidden;
  }
  .dcsns-content .stream {
    width: 100%;
  }
  .dcsns-content .stream li {
    width: calc(16.6666vw - 21px) !important;
    height: 460px !important;
  }
  .stream li.dcsns-rss .section-text img {
    max-height: 370px !important;
  }
  .dcsns-content .stream .dcsns-li .inner {
    padding: 0 8px !important;
  }
  .dcsns-content .stream .dcsns-li .inner .section-text {
    display: flex;
    flex-flow: row wrap;
  }
  .dcsns-content .stream .dcsns-li .inner .section-text span:nth-child(-n+2) {
    float: left;
    flex: 0 0 50%;
  }
  .dcsns-content .stream .dcsns-li .inner .section-text span:nth-child(2) {
    text-align: right;
  }
  .dcsns-content .stream .dcsns-li .inner .section-text div {
    display: flex;
    flex: 2;
    justify-content: center;
    padding-top: 8px;
  }
  .dcsns-content .stream .dcsns-li .inner .section-intro table tbody tr td:nth-child(2) {
    text-align: right;
    padding-right: 8px;
  }
  #spp-mark {
    bottom: 130px;
    top: auto !important;
    right: 30px;
    left: auto !important;
  }
  .spp-infinite-scroll-divider {
    margin-bottom: 10px;
  }
  @media screen and (max-width:1600px) and (min-width:1200px) {
    .dcsns-content .stream li {
      width: calc(20vw - 23px) !important;
    }
  }
  @media screen and (max-width:1600px) and (min-width:1400px) {
    .dcsns-content .stream li {
      height: 460px !important;
    }
  }
  @media screen and (max-width:1400px) and (min-width:1200px) {
    .dcsns-content .stream li {
      height: 440px !important;
    }
  }
  @media screen and (max-width:1200px) and (min-width:800px) {
    .dcsns-content .stream li {
      width: calc(25vw - 25px) !important;
    }
  }
  @media screen and (max-width:800px) and (min-width:600px) {
    .dcsns-content .stream li {
      width: calc(33.3333vw - 29px) !important;
    }
  }
  @media screen and (max-width:600px) and (min-width:300px) {
    .dcsns-content .stream li {
      width: calc(50vw - 39px) !important;
    }
  }
`);