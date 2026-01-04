// ==UserScript==
// @name         Douyu_Monkey
// @name:cn      斗鱼猴
// @namespace    http://tampermonkey.net/
// @version      0.0.17
// @description  douyu beautify css injection script
// @author       Sherlock-V
// @match        https://douyu.com
// @match        https://*.douyu.com/*
// @icon         https://www.douyu.com/favicon.ico
// @grant        GM_addStyle
// @supportURL   https://github.com/Ziyueqi-V/douyu_Monkey/issues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469287/Douyu_Monkey.user.js
// @updateURL https://update.greasyfork.org/scripts/469287/Douyu_Monkey.meta.js
// ==/UserScript==
(function () {
  'use strict';

  // Your code here...
  const cssText = `
  .layout-Player-barrage.layout-Player-barrage {
  top: 0;
}

div[class^=index-listTitle] a {
  border-bottom: 2px solid rgba(86, 86, 87, 0.8);
  border-left: 2px solid rgba(86, 86, 87, 0.8);
  border-right: 2px solid rgba(86, 86, 87, 0.8);
  border-radius: 3px;
}

.layout-Main.layout-Main {
  position: fixed;
  top: 60px;
}
  `;
  GM_addStyle(cssText);

  const style = document.createElement('style')
  const hides = [
    // 导航栏 - 分类 - 视频 - 游戏
    '.public-DropMenu.Category',
    '.public-DropMenu.Video',
    '.public-DropMenu.Game',
    // 鱼乐盛典
    '.HeaderNav',
    // 付费礼物区
    // 'div.PlayerToolbar:first-child',
    // 房间活动
    '#js-room-activity',
    // 粉丝榜
    '.layout-Player-rank',
    // 友邻动态
    '.AnchorLike-ItemBox',
    // 底部
    '.layout-Bottom',
    // 房间信息, 活动
    '#js-player-title > div.Title > div.Title-roomInfo > div:nth-child(3)',
    // 房间信息, 热度
    '.Title-anchorHot',
    // 房间信息, 友邻
    '.Title-anchorFriendWrapper',
    // 房间信息, 商品橱窗
    '.Title-anchorLocation',
    // 房间信息, 成就点
    '.Title-sharkWeight',
    // 房间信息, 工会
    '.SociatyLabel',
    // 礼物栏
    '#js-player-toolbar .ToolbarActivityArea',
    '#js-player-toolbar .PlayerToolbar-GiftWrap',
    // '#js-player-toolbar .',
    // '#js-player-toolbar .',
    '#js-player-toolbar div:nth-child(2) div.PlayerToolbar-ContentCell.is-full div.PlayerToolbar-couponInfo',
    '#js-player-toolbar div:nth-child(2) div.PlayerToolbar-ContentCell.is-full div.PlayerToolbar-ywInfo',
    '#js-player-toolbar div:nth-child(2) div.PlayerToolbar-ContentCell.is-full div.PlayerToolbar-ycInfo',
    '#js-player-toolbar div:nth-child(2) div.PlayerToolbar-ContentCell.is-full div.PlayerToolbar-getYCArea',


  ].filter(Boolean)

  style.innerHTML = [
    `${hides.join(',')}{ display: none !important; }`,
  ].join('')

  document.body.appendChild(style)
})();