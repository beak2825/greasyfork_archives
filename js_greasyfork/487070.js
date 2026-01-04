// ==UserScript==
// @name 126邮箱深色模式
// @namespace https://greasyfork.org/zh-CN/scripts/487070-126邮箱深色模式
// @version 1.0-beta
// @description 针对网易126邮箱(mail.126.com)的深色模式的样式表，使用 prefers-color-scheme ，跟随浏览器主题进行深色/浅色模式自动切换。
// @author Steven-Zhl
// @homepageURL https://github.com/Steven-Zhl/4BetterBrowser/CSS#126邮箱深色模式
// @license GPL-3.0
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:https?://(hw\.)?mail\.126\.com/.*)$/
// @downloadURL https://update.greasyfork.org/scripts/487070/126%E9%82%AE%E7%AE%B1%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/487070/126%E9%82%AE%E7%AE%B1%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
let css = `
  @media (prefers-color-scheme: dark) {
    /* PC端界面 */
    div.frame-main-cont-body {
      background-color: #000;
      color: #8f8f8f;
    }
    div.frame-main-cont-body div.gWel-recommend.gWel-promt-radius.nui-closeable {
      background-color: #1e1e1e;
      border-color: #252525;
      color: #8f8f8f;
    }
    div.frame-main-cont-body div.gWel-recommend.gWel-promt-radius.nui-closeable ul {
      background-color: #272727;
      border-color: #252525;
    }
    div.frame-main-cont-body div.gWel-recommend.gWel-promt-radius.nui-closeable ul li {
      background-color: #272727;
    }
    div.frame-nav {
      background-color: #000;
      border-color: #252525;
      color: #8f8f8f;
    }
    div.frame-nav div#dvNavTop {
      background-color: #272727;
    }
    div.frame-nav div#dvNavTop ul li {
      color: #272727;
      background-color: #272727;
      background-image: none;
    }
    div.frame-nav div#dvNavTop ul li span {
      text-shadow: none;
    }
    div.frame-nav div#dvNavTree {
      background-color: #1e1e1e;
    }
    div.frame-nav div#dvNavTree ul {
      background-color: #1e1e1e;
      border-color: #252525;
      color: #8f8f8f;
    }
    div.frame-nav div#dvNavTree ul li {
      border-color: #252525;
      color: #8f8f8f;
    }
    div.frame-nav div#dvNavTree ul li div.js-component-component.nui-tree-item-label-hover,
    div.frame-nav div#dvNavTree ul li div.js-component-component.nui-tree-item-label-active {
      background-color: #272727;
      background-image: none;
    }
    div.frame-nav div#dvNavTree ul li div.js-component-component.nui-tree-item-label-selected {
      background-color: #272727;
      background-image: none;
    }
    div.frame-nav div#dvNavTree ul li div.js-component-component.nui-tree-item-label-selected span {
      color: #cdcdcd;
      text-shadow: none;
    }
    div.frame-nav div#dvNavTree ul li#dvNavFoot:before {
      background-color: #8f8f8f;
    }
    div.frame-nav div#dvNavTree ul li#dvNavFoot div.GV0 div:hover {
      background-image: none;
      background-color: #272727;
    }
    div#dvContainer header {
      background-color: #1e1e1e;
    }
    div#dvContainer header div.nui-toolbar-item div {
      background-color: #272727;
      color: #8f8f8f;
    }
    div#dvContainer header div.nui-toolbar-item div span {
      background-color: #272727;
      border-color: #252525;
      color: #8f8f8f;
    }
    div#dvContainer header div.nui-toolbar-ext div.nui-toolbar-item div.js-component-calendar.nui-calendar,
    div#dvContainer header div.nui-toolbar-ext div.nui-toolbar-item div.js-component-select.nui-simpleSelect.nui-select {
      background-color: #272727 !important;
      color: #8f8f8f;
    }
    div#dvContainer header div.nui-toolbar-ext div.nui-toolbar-item div.js-component-calendar.nui-calendar span,
    div#dvContainer header div.nui-toolbar-ext div.nui-toolbar-item div.js-component-select.nui-simpleSelect.nui-select span {
      background-color: #272727;
      border-color: #252525;
      color: #8f8f8f;
    }
    div#dvContainer header div.nui-toolbar-ext div.nui-toolbar-item div.js-component-button.nui-roundBtn.nui-btn.nui-btn-hasIcon.nui-roundBtn-hasIcon.nui-btn-disabled.nui-roundBtn-disabled span {
      background-color: #1e1e1e !important;
      border-color: #252525 !important;
    }
    div#dvContainer header div.nui-toolbar-ext div.nui-toolbar-item div.js-component-button.nui-roundBtn.nui-btn.nui-btn-hasIcon.nui-roundBtn-hasIcon span {
      background-color: #272727 !important;
      border-color: #252525 !important;
    }
    div#dvContainer div.js-component-menu.nui-menu {
      background-color: #1e1e1e;
      border-color: #252525;
    }
    div#dvContainer div.js-component-menu.nui-menu div.nui-menu-split.nui-split {
      border-color: #252525;
    }
    div#dvContainer div.js-component-menu.nui-menu div {
      background-color: #1e1e1e;
      border-color: #252525;
      color: #8f8f8f;
    }
    div#dvContainer div.js-component-menu.nui-menu div:hover {
      background-color: #272727;
    }
    div#dvContainer div.gWel-avatar img {
      filter: invert(0.75);
    }
    div#dvContainer div.frame-main-cont-body.nui-scroll {
      background-color: #000;
    }
    div#dvContainer div.frame-main-cont-body.nui-scroll div.Bp0 div {
      filter: invert(1);
    }
    div#dvContainer div.frame-main-cont-body.nui-scroll div.js-component-layer.nui-dateLayer.nui-layer {
      background-color: #1e1e1e;
      border-color: #252525;
    }
    div#dvContainer div.frame-main-cont-body.nui-scroll div.js-component-layer.nui-dateLayer.nui-layer div.nui-dateLayer-title {
      background-color: #272727;
    }
    div#dvContainer div.frame-main-cont-body.nui-scroll div.js-component-layer.nui-dateLayer.nui-layer div.nui-dateLayer-title strong {
      color: #cdcdcd;
    }
    div#dvContainer div.frame-main-cont-body.nui-scroll div.js-component-layer.nui-dateLayer.nui-layer div.nui-dateLayer-title span.nui-txt-link {
      color: #7d90a9;
    }
    div#dvContainer div.frame-main-cont-body.nui-scroll div.js-component-layer.nui-dateLayer.nui-layer div.nui-dateLayer-calendar table tbody tr th {
      color: #cdcdcd;
    }
    div#dvContainer div.frame-main-cont-body.nui-scroll div.js-component-layer.nui-dateLayer.nui-layer div.nui-dateLayer-calendar table tbody tr td.nui-dateLayer-calendar-todayCell b {
      color: white !important;
    }
    div#dvContainer div.frame-main-cont-body.nui-scroll div.js-component-layer.nui-dateLayer.nui-layer div.nui-dateLayer-calendar table tbody tr td b {
      color: #7d90a9 !important;
    }
    div#dvContainer div.tv0 div.nui-txt-flag0 {
      color: #8f8f8f;
    }
    div#dvContainer div.tv0 div.nui-txt-flag0 div {
      background-color: #000;
    }
    div#dvContainer div.tv0 div.nui-txt-flag0 div div.gB0 label.nui-chk.cS0 span {
      background-color: #272727;
      border-color: #252525;
    }
    div#dvContainer div.nui-btnGroup div.js-component-button.nui-roundBtn.nui-btn.nui-btn-hasIcon.nui-roundBtn-hasIcon.nui-btn-disabled.nui-roundBtn-disabled span {
      background-color: #1e1e1e !important;
      border-color: #252525 !important;
      color: #8f8f8f !important;
    }
    div#dvContainer div.nui-btnGroup div.js-component-button.nui-roundBtn.nui-btn.nui-btn-hasIcon.nui-roundBtn-hasIcon span {
      background-color: #272727 !important;
      border-color: #252525 !important;
      color: #cdcdcd !important;
    }
    div#dvContainer div.frame-main.frame-main-noNav header.frame-main-cont-head div.nui-toolbar-ext div a {
      color: #7d90a9 !important;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll header {
      background-color: #000;
      color: #8f8f8f;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll header div.kZ0 {
      color: #8f8f8f;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll header div.kZ0 label.fn0 a {
      color: #7d90a9 !important;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll header div.kZ0 div.dG0 {
      background-color: #000;
      color: #cdcdcd;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll header div.kZ0 div.dG0 div input {
      color: #cdcdcd;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll header div.dc2 div.kZ0 div.bz0 div.js-component-input.nui-ipt {
      background-color: #1e1e1e !important;
      border-color: #252525;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll header div.dc2 div.kZ0 div.bz0 div.js-component-select.nui-select.nui-select-disabled {
      background-color: #000 !important;
      border-color: #252525 !important;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll header div.dc2 div.kZ0 div.bz0 div.js-component-select.nui-select.nui-select-disabled div.js-component-input.nui-ipt.nui-ipt-disabled {
      background-color: #000 !important;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll header div.dc2 div.kZ0 div.bz0 div.js-component-select.nui-select.nui-select-disabled div.js-component-input.nui-ipt.nui-ipt-disabled input {
      color: #8f8f8f !important;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll header div.dc2 div.kZ0 div.bz0 div.js-component-select.nui-select {
      background-color: #1e1e1e !important;
      border-color: #252525 !important;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll header div.dc2 div.kZ0 div.bz0 div.js-component-select.nui-select div.js-component-input.nui-ipt {
      background-color: #1e1e1e !important;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll header div.dc2 div.kZ0 div.bz0 input {
      color: #cdcdcd;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll section div.APP-editor.APP-editor-basic {
      background-color: #252525;
      border-color: #252525;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll section div.APP-editor.APP-editor-basic div.APP-editor-tbar {
      background-color: #1e1e1e;
      border-color: #252525;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll section div.APP-editor.APP-editor-basic div.APP-editor-tbar a.APP-editor-btn.APP-editor-btn-spln {
      background-color: #252525;
      width: 2px;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll section div.APP-editor.APP-editor-basic div.APP-editor-tbar a.APP-editor-btn.APP-editor-btn-dis:after {
      background-color: #1e1e1e;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll section div.APP-editor.APP-editor-basic div.APP-editor-tbar a.APP-editor-btn.APP-editor-btn-dis span b {
      background-image: none;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll section div.APP-editor.APP-editor-basic div.APP-editor-tbar a.APP-editor-btn.APP-editor-commond-btn b, div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll section div.APP-editor.APP-editor-basic div.APP-editor-tbar a.APP-editor-commond-btn b {
      background-color: #1e1e1e;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll section div.APP-editor.APP-editor-basic div.APP-editor-tbar a.APP-editor-btn.APP-editor-commond-btn b:hover, div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll section div.APP-editor.APP-editor-basic div.APP-editor-tbar a.APP-editor-commond-btn b:hover {
      background-color: #272727;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll section div.APP-editor.APP-editor-basic div.APP-editor-tbar a.APP-editor-btn.APP-editor-commond-btn span, div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll section div.APP-editor.APP-editor-basic div.APP-editor-tbar a.APP-editor-commond-btn span {
      background-color: #1e1e1e;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll section div.APP-editor.APP-editor-basic div.APP-editor-tbar a.APP-editor-btn.APP-editor-commond-btn span:hover, div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll section div.APP-editor.APP-editor-basic div.APP-editor-tbar a.APP-editor-commond-btn span:hover {
      background-color: #272727;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll section div.APP-editor.APP-editor-basic div.APP-editor-tbar a.APP-editor-btn.APP-editor-commond-btn span b, div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll section div.APP-editor.APP-editor-basic div.APP-editor-tbar a.APP-editor-commond-btn span b {
      background-color: #1e1e1e;
      border-color: #252525;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll section div.APP-editor.APP-editor-basic div.APP-editor-tbar a.APP-editor-btn.APP-editor-commond-btn span b:hover, div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll section div.APP-editor.APP-editor-basic div.APP-editor-tbar a.APP-editor-commond-btn span b:hover {
      background-color: #272727;
    }
    div#dvContainer div.frame-main.frame-main-noNav div.frame-main-cont-body.nui-scroll section div.APP-editor.APP-editor-basic div.APP-editor-edtr iframe.APP-editor-iframe {
      filter: invert(1);
    }
    div#dvSubContainer div.frame-main.columns-lr-view {
      background-color: #1e1e1e;
    }
    div#dvSubContainer div.frame-main.columns-lr-view header {
      background-color: #1e1e1e;
      border-color: #252525;
    }
    div#dvSubContainer div.frame-main.columns-lr-view header div {
      color: #8f8f8f;
      background-color: #272727;
      border-color: #252525;
    }
    div#dvSubContainer div.frame-main-cont-body.nui-scroll {
      background-color: #1e1e1e;
      border-color: #252525;
    }
    div#dvSubContainer div.frame-main-cont-body.nui-scroll section div.nui-simpleTree.nui-tree div div span:hover {
      background-color: #272727;
    }
    /* 移动端界面 */
    div.js-component-menu.menu {
      background-color: #272727;
    }
    div.js-component-menu.menu div.js-component-menuitem.menu-item {
      background-color: #272727;
      border-color: #252525;
      color: #cdcdcd;
    }
    div.js-component-button.btn-normal2 {
      background-color: #1e1e1e;
      box-shadow: none;
      border-color: #252525;
      border-width: 1px;
      color: #1e1e1e;
    }
    div.js-component-button.btn-normal2 span.btn-inner {
      color: #8f8f8f;
      border-color: #252525;
      background-image: linear-gradient(#272727, #272727);
    }
    div.js-component-button.btn-main {
      background-color: #0e5500;
      background-image: none;
      border-color: #252525;
      color: #1e1e1e;
    }
    div.js-component-button.btn-main span.btn-inner {
      color: #cdcdcd;
      border-color: #252525;
      background-color: #0e5500;
      background-image: none;
    }
    div.js-component-input.ipt-multiLine.ipt {
      background-image: linear-gradient(#272727, #272727);
      box-shadow: none;
      border-color: #1e1e1e;
      border-width: 1.5px;
      color: #1e1e1e;
    }
    div.js-component-input.ipt-multiLine.ipt label {
      color: #8f8f8f;
    }
    div.frame div.frame-top {
      background-color: #000;
      color: #8f8f8f;
    }
    div.frame div.frame-nav, div.frame div.frame-main {
      background-color: #272727;
      color: #8f8f8f;
    }
    div.frame div.frame-nav h2.subject, div.frame div.frame-main h2.subject {
      color: #cdcdcd;
    }
    div.frame div.frame-nav div.inputBar.mInbox-searchBar, div.frame div.frame-main div.inputBar.mInbox-searchBar {
      background-color: #1e1e1e;
      color: #8f8f8f;
    }
    div.frame div.frame-nav div.inputBar.mInbox-searchBar div.mInbox-searchBar-inner div.ipt.bdr-cFocus, div.frame div.frame-main div.inputBar.mInbox-searchBar div.mInbox-searchBar-inner div.ipt.bdr-cFocus {
      background-color: #272727;
      color: #8f8f8f;
    }
    div.frame div.frame-nav div.frame-toolbar, div.frame div.frame-main div.frame-toolbar {
      background-color: #1e1e1e !important;
      border-color: #1e1e1e !important;
      color: #1e1e1e !important;
    }
    div.frame div.frame-nav div.js-component-toolbar, div.frame div.frame-main div.js-component-toolbar {
      background-color: #1e1e1e !important;
      background-image: none !important;
      border-color: #1e1e1e !important;
      color: #cdcdcd;
    }
    div.frame div.frame-nav div.js-component-toolbar div.toolbar-optItem, div.frame div.frame-main div.js-component-toolbar div.toolbar-optItem {
      background-color: transparent;
      color: #cdcdcd;
    }
    div.frame div.frame-nav div.scroll, div.frame div.frame-main div.scroll {
      background-color: #272727;
      color: #8f8f8f;
    }
    div.frame div.frame-nav div.scroll div.js-component-component, div.frame div.frame-main div.scroll div.js-component-component {
      background-color: #1e1e1e;
      color: #8f8f8f;
    }
    div.frame div.frame-nav div.scroll div.g-null::after, div.frame div.frame-main div.scroll div.g-null::after {
      background-color: #272727;
      color: #8f8f8f;
    }
    div.js-component-msgbox div.toolbar-colCenter {
      background-color: #1e1e1e;
      color: #cdcdcd;
    }
    div.mask.mCompose-wrapper {
      background-color: #272727;
    }
    div.mask.mCompose-wrapper div.msgbox.mCompose {
      background-color: #272727;
      color: #8f8f8f;
    }
    div.mask.mCompose-wrapper div.msgbox.mCompose div#composeContentArea {
      color: #8f8f8f;
    }
    div.mask.mCompose-wrapper div.msgbox.mCompose div.js-component-toolbar {
      background-color: #1e1e1e !important;
      background-image: none !important;
      border-color: #1e1e1e !important;
      color: #cdcdcd;
    }
    div.mask.mCompose-wrapper div.msgbox.mCompose div.js-component-toolbar div.toolbar-optItem {
      background-color: transparent;
      color: #cdcdcd;
    }
    div.mask.mCompose-wrapper span.mCompose-item-frome-name {
      color: #cdcdcd;
    }
    div.mask.mCompose-wrapper input.ipt-input {
      color: #cdcdcd;
    }
    div.list-item, div.list-item-unread.list-item {
      background-color: #272727 !important;
      border-color: #252525 !important;
    }
    div.list-item span.mail-list-subject, div.list-item-unread.list-item span.mail-list-subject {
      color: #cdcdcd;
    }
    div.list-item span.mail-list-frome, div.list-item span.mail-list-time, div.list-item-unread.list-item span.mail-list-frome, div.list-item-unread.list-item span.mail-list-time {
      color: #8f8f8f;
    }
    div.js-component-msgbox.msgbox-simple.msgbox {
      background-color: #1e1e1e;
    }
    div.js-component-msgbox.msgbox-simple.msgbox div.msgbox-hd {
      background-color: #1e1e1e;
      color: #cdcdcd;
    }
    div.js-component-msgbox.msgbox-simple.msgbox div.msgbox-bd {
      background-color: #1e1e1e;
      color: #8f8f8f;
    }
    /* 移除多余的元素 */
    div.list-item.list-item-sptln {
      display: none;
    }
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
