// ==UserScript==
// @name        i Ad Away
// @namespace   https://greasyfork.org/users/756764
// @version     2023.9.9
// @author      ivysrono
// @license     MIT
// @description 隐藏广告去除推广
// @match       *://*/*
// @require     https://greasyfork.org/scripts/410150-addstyle/code/addStyle.js
// @run-at      document-start
// @grant       none
// @inject-into auto
// @downloadURL https://update.greasyfork.org/scripts/456728/i%20Ad%20Away.user.js
// @updateURL https://update.greasyfork.org/scripts/456728/i%20Ad%20Away.meta.js
// ==/UserScript==

// 通用
addStyle(`
  .ad,
  #ad-slot,
  .adsbygoogle,
  .adv {
    display: none !important;
  }`);

/**
 * 网易新闻
 * https://3g.163.com/dy/article/FM2IJ0NK055080L4.html
 * https://3g.163.com/dy/article/GI0E626005179RJN.html
 * https://3g.163.com/news/article/DR6RGEKC0001875P.html
 */
if (location.host === '3g.163.com') {
  addStyle(`
    /* 顶部广告 */
    .area-topBanner.js-area-topBanner,
    /* 底部广告 */
    .area-recommend,
    /* 文中广告 */
    div.area-content.js-area-content,
    section[id^="codeAD-"],
    ins[id^="revive-"] {
      display: none !important;
    }
    `);
}

// CCTV 移动版
if (location.host === 'tv.cctv.com' && location.pathname.startsWith('/v/v1/VIDE')) {
  addStyle(`
  /* 播放器下 APP 推广和页面分享工具 */
  #text_box, #zanshare,
  /* 底部浮层及其留白 */
  .ind_footersearch2_xq18058_cemg,
  .bottomvspace {
    display: none !important;
  }
  `);
}

/** ETtoday 新闻云
 * 隐藏桌面版下拉中弹出的分享条，订阅提示，文中广告文字提示
 * https://www.ettoday.net/news/20190313/1397863.htm
 * https://www.ettoday.net/news/20191024/1564140.htm
 */
if (location.host === 'www.ettoday.net' || location.host === 'm.ettoday.net') {
  addStyle(`
    #et_sticky_pc,
    .et_push_notification,
    .ad_readmore {
      display: none! important;
    }
    `);
}

// 掘金底部APP推广条 https://juejin.cn/
if (location.host === 'juejin.cn') {
  addStyle(`.recommend-box {display: none !important;}`);
}

// 美团移动版网页 首页和商品页面 顶部 APP 推广
if (location.host.endsWith('.meituan.com')) {
  addStyle('.banner-download, .c-guide-app {display: none !important;}');
}

// 秒拍去除底部 APP 推广 https://n.miaopai.com/media/h~6wSn6OYngTWrCN~Gfk0-SkPCya82mI.htm
if (location.host === 'n.miaopai.com') {
  addStyle('.footer {display: none !important;}');
}

/**
 * 北大法宝桌面版顶部移动版底部广告条
 * https://www.pkulaw.com/
 */
if (location.host.endsWith('pkulaw.com')) {
  addStyle(`#topSlider, .buy-body {display: none !important;}`);
}

// TheOldReader 去除广告过滤留白
if (location.host === 'theoldreader.com') {
  addStyle('#banner_container {display: none !important;}');
}

// 澎湃新闻移动版关闭底部滚动条 https://m.thepaper.cn/newsDetail_forward_2154729
if (location.host === 'm.thepaper.cn') {
  window.addEventListener('load', () => {
    if (document.querySelectorAll('div[class^="index_footer_banner_close__"]').length === 1) {
      document.querySelector('div[class^="index_footer_banner_close__"]').click();
    }
  });
}

// 今日头条移动版 https://m.toutiao.com/i6385720374801203714/
if (location.host === 'm.toutiao.com') {
  addStyle(`
  /* 顶部 APP 推广 */
  .top-banner-container,
  /* 题图下 APP 推广 */
  .img-download-banner,
  /* 底部热门推荐 */
  .recommendation-container,
  /* 底部 APP 推广 */
  .unfold-field.unfold-field-download {
    display: none !important;
  }
  `);
}

/**
 * 去除微博移动版横幅广告
 * https://m.weibo.cn/status/KsOocpfOC
 */
if (location.host === 'm.weibo.cn') {
  addStyle(`.wrap, .ad-wrap {display: none !important;}`);
}
