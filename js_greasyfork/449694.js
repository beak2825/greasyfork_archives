// ==UserScript==
// @name               BaiDu Bookmark
// @name:zh-CN         百度书签
// @description        Beautify the bookmark at the home page of Baidu.
// @description:zh-CN  美化百度首页的书签页面。
// @namespace          https://github.com/HaleShaw
// @version            1.0.3
// @author             HaleShaw
// @copyright          2020+, HaleShaw (https://github.com/HaleShaw)
// @license            AGPL-3.0-or-later
// @homepage           https://github.com/HaleShaw/TM-BaiDu
// @supportURL         https://github.com/HaleShaw/TM-BaiDu/issues
// @contributionURL    https://www.jianwudao.com/
// @icon               https://www.baidu.com/favicon.ico
// @match              https://www.baidu.com/
// @compatible	       Chrome
// @grant              GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/449694/BaiDu%20Bookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/449694/BaiDu%20Bookmark.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author             HaleShaw
// @collaborator       HaleShaw
// ==/OpenUserJS==

(function () {
  'use strict';

  const mStyle = `
  .s-menu-container,
#s_content_2,
#s_content_1,
.s-top-nav,
.tips-manager-area,
#bottom_layer,
#bottom_space,
.s-more-bar.c-color-gray2,
#s_qrcode_feed,
.video-meet-entry,
#result_logo,
#s_lg_img,
#s_lg_img_new,
#s_mp,
#s_side_wrapper>div.guide-info-new.s_side_wrapper-left,
#s_side_wrapper>div.side-entry.aging-entry,
#head>div.s-isindex-wrap.sui-wraper>div.sui-prevent-wheel.s-isindex-wrap.sui-dialog.sui-dialog-nav-pannel.sui-dialog-mine-pannel.sui-dialog-hasmask.sui-dialog-hastitle>div.sui-dialog-body>div>div.recom-content,
#s-usersetting-top>div.guide-info-new.s-usersetting-top-bottom,
#desktopModalMask > div > div > div:nth-child(2) > div:nth-child(2) {
  display: none !important;
}

body[baidu],
#wrapper #head,
#wrapper #s_tab,
form.fm .s_ipt_wr.bg {
  background: none !important;
}

#s_content_100 {
  display: block !important;
}

#s_main {
  padding: 0 0;
}

.s-content {
  padding-bottom: 0;
}

.s-mine-wrapper {
  margin-top: 0;
}

.s-skin-hasbg #s_main {
  background: rgba(255, 255, 255, 0.55);
}

#head_wrapper {
  min-height: 100px;
  max-height: 180px;
}

#head_wrapper .s-p-top {
  min-height: 50px;
  max-height: 100px;
}

.s-block-nav .dir-item {
  margin-left: 10px !important;
}

.s-block-nav .dir-item .dir-name {
  width: 48px !important;
  padding: 5px 0 5px 0 !important;
}

.s-block-nav .dir-item .d-nav-item {
  margin-right: 5px !important;
  margin-top: 5px !important;
  margin-bottom: 5px !important;
}

.c-span3 {
  width: 150px !important;
}

.c-gap-left-large {
  margin-left: 5px !important;
}

.c-gap-left-small.nav-text {
  width: 110px !important;
}

div.normal-site-img_3ID7V {
  width: 36px !important;
  height: 36px !important;
  line-height: 36px !important;
  font-size: 18px !important;
}

a.site-item-img_3NN3N,
a.site-item-img_3NN3N>img {
  width: 36px !important;
  height: 36px !important;
}

.site-container_3QJpT .cate-site-item_1rqow {
  margin: 6px 4px !important;
  height: 54px !important;
  line-height: 54px !important;
}

.site-item-label_3WxsF {
  margin-top: 2px !important;
}

.c-wrapper-l {
  width: 1380px !important;
}

#s_xmancard_desktop>div.san-card>div,
#s_xmancard_desktop>div.san-card>div>div>div>div,
#s_xmancard_desktop>div.san-card>div>div>div>div>div>div.content_2q4gZ {
  width: 1412px !important;
}

#s_xmancard_desktop>div.san-card>div>div>div>div>div>div>div>div>div {
  width: 1310px !important;
}

/* 添加按钮 */
#s_xmancard_desktop>div.san-card>div>div>div>div>div>div.content_2q4gZ>div>span.add-cate-site-btn_1U_oz {
  position: absolute;
  width: 36px;
  height: 36px;
  line-height: 36px;
  top: -105px;
  right: 100px;
  border: 1px dashed white;
}

#s_xmancard_desktop>div.san-card>div>div>div>div>div>div.content_2q4gZ>div>span.add-cate-site-btn_1U_oz>i {
  color: white;
}

#s_xmancard_desktop>div.san-card>div>div>div>div>div>div.content_2q4gZ>div>span.add-cate-site-btn_1U_oz:hover {
  border: 1px dashed #315efb;
}

#s_xmancard_desktop>div.san-card>div>div>div>div>div>div.content_2q4gZ>div>span.add-cate-site-btn_1U_oz>i:hover {
  color: #315efb;
}

/* 添加网址的弹窗 */
#desktopModalMask>div{
  height: 100px !important;
}

/* 添加网址的弹窗中的“添加网址”按钮 */
#desktopModalMask > div > div > div:nth-child(2) > div:nth-child(1) > button{
  margin-top: 10px !important;
}

/* 添加网址的弹窗中，分类下拉列表 */
.select-wrapper_3Yt8t,
.select-board_xSgU5 {
  max-height: 300px !important;
}
  `;

  window.onload = function () {
    updateMenu();
    document.getElementById("s_menu_mine").click();
    GM_addStyle(mStyle);
  }

  // 更新菜单
  function updateMenu() {
    let menuParent = document.getElementById('s-top-left');

    if (menuParent) {
      menuParent.innerHTML = '';
      menuParent.append(createMenu('地图', 'http://map.baidu.com'));
      menuParent.append(createMenu('网盘', 'https://pan.baidu.com/'));
      menuParent.append(createMenu('图片', 'http://image.baidu.com/'));
      menuParent.append(createMenu('百科', 'https://baike.baidu.com/'));
    }
  }

  // 创建菜单项
  function createMenu(name, url) {
    const menu = document.createElement('a');
    menu.setAttribute('href', url);
    menu.setAttribute('target', '_blank');
    menu.setAttribute('class', 'mnav c-font-normal c-color-t');
    menu.text = name;
    return menu;
  }
})();
