// ==UserScript==
// @name        Clean nimo.tv
// @namespace   Violentmonkey Scripts
// @match       https://www.nimo.tv/*
// @grant       none
// @version     1.0
// @author      -
// @description 4/19/2024, 2:31:24 AM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/517684/Clean%20nimotv.user.js
// @updateURL https://update.greasyfork.org/scripts/517684/Clean%20nimotv.meta.js
// ==/UserScript==

function addStyle(styleString) {
  const style = document.createElement('style');
  style.textContent = styleString;
  document.head.append(style);
}

document.body.classList.remove('page-room')

addStyle(`
  /*
  .nimo-room__main__sider {
    top: 12px;
    height: calc(100vh - 24px);
  }

  .nimo-room__head-img.HeadImg {
    height: 2rem !important;
  }

  #side-bar,
  #header {
    display: none !important;
  }
  */

  .has-head-img .nimo-room__main {
    margin-top: -300px !important;
  }

  .nimo-room-ads,
  .nimo-iframe__wrap,
  .nimo-room__rank,
  .nimo-gift-banner,
  .nimo-room__gift-shop,
  .nimo-rm,
  .nimo-room__chatroom__box-gift,
  .nimo-room__chatroom__enter_banner,
  .chat-room__enter_banner,
  .n-as-mrgv-xs.n-as-mrgh.n-fx-sc.c2,
  .n-as-mrg-xs.c2,
  .nimo-room__pay-chat-message-item.n-as-mrgv-xs.n-as-mrgh-xxs.n-as-rnd-lg.n-as-fs12,
  .UserEnterRoomMessageItem,
  .nimo-room__pay-chat-top-message-list,
  .nimo-cr_decoration {
    display: none !important;
  }
`)
