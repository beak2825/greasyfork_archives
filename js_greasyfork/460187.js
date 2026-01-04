// ==UserScript==
// @name 清爽贴吧
// @namespace userstyles.world/user/happiness
// @version 20230217.13.34
// @description 去多余元素 + 主贴页面加宽 + 吧头像调整
// @author happiness
// @license No License
// @grant GM_addStyle
// @run-at document-start
// @match *://*.tieba.baidu.com/*
// @match *://*.v.tieba.com/*
// @match *://*.www.tieba.com/*
// @downloadURL https://update.greasyfork.org/scripts/460187/%E6%B8%85%E7%88%BD%E8%B4%B4%E5%90%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/460187/%E6%B8%85%E7%88%BD%E8%B4%B4%E5%90%A7.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "tieba.baidu.com" || location.hostname.endsWith(".tieba.baidu.com")) || (location.hostname === "v.tieba.com" || location.hostname.endsWith(".v.tieba.com")) || (location.hostname === "www.tieba.com" || location.hostname.endsWith(".www.tieba.com"))) {
  css += `
      #plat_recom_carousel {
  		display: none;
      }
      .post_bubble_middle {
          background: unset !important;
      }
      /* for phone */
      .father-cut-daoliu-normal-box,
      .father-cut-recommend-normal-box,
      .j_pb_footer {
          display: none;
      }
      .class_hide_flag {
          display: unset;
      }
      .father-cut-pager-class-no-page > #list_pager {
          visibility: visible !important;
          height: unset;
      }
      .p_author_face.j_frame_guide {
          background: none !important;
      }
      .p_forbidden_tip + div {
          display: inline !important;
      }
      .p_forbidden_tip {
          display: none;
      }
      .threadlist_bright .threadlist_author .sign_highlight,
      .threadlist_bright .threadlist_author .sign_highlight:hover {
          color: unset;
      }
      .save_face_bg,
      .creativeplatform-wrap-word-repost-btn,
      #celebrity,
      .d_icons,
      .sign_tip_container,
      #userinfo_wrap .userinfo_right,
      .share_btn_wrapper,
      .post_bubble_top,
      .post_bubble_bottom,
      .d_nameplate,
      .showlist_wap,
      .post-foot-send-gift-container,
      .u_wallet,
      .split,
      .u_app,
      .u_tbmall,
      .u_tshow,
      .achievement_medal,
      .tbui_aside_float_bar {
          display: none;
      }
      /* 悦图 */
      .see-image-btn,
      .see-image-btn:hover {
          background-image: none;
          padding-left: 14px;
      }
      /*吧头像*/
      .card_head {
          padding: 0 !important;
          margin: 0 !important;
          margin-bottom: 4px !important;
          height: 89px !important;
          width: 89px !important;
      }
      .card_head img {
          width: 100% !important;
          height: 100% !important;
      }
      .icon-member-top,
      [id="pagelet_encourage-celebrity/pagelet/celebrity"],
      [id="pagelet_frs-aside/pagelet/search_back"],
      [id="pagelet_frs-aside/pagelet/hottopic"],
      [class*="app_download"],
      .u_member,
      .icon_wrap,
      .user_score,
      .right_section.right_bright {
          display: none !important;
      }
      .core_title_wrap_bright,
      .left_section {
          width: 980px;
      }
      .l_post {
          width: 980px;
      }
      .d_post_content_main {
          width: 829px;
          border-right: solid 0.633333px rgb(229, 229, 229);
      }

      .j_lzl_container {
          width: 99.9% !important;
      }
      .edui-container,
      #j_editor_for_container {
          width: 100% !important;
      }
      .lzl_panel_wrapper {
          float: right;
      }
  `;
}
if (location.href.startsWith("http://tieba.baidu.com/f") || location.href.startsWith("https://tieba.baidu.com/f")) {
  css += `
  .icon_tbworld,
      .icon-vip3-16 {
          background-image: url("https://tb2.bdstatic.com/tb/img/thread_list_z_eca48fe.png");
          background-position: -30px -60px;
      }
      .member_thread_title_frs a {
          color: rgb(45, 100, 179) !important;
      }

      /* 以下一小部分是为了吧头像旁的空白作修正 */
      .card_head {
          height: 89px !important;
          width: 89px !important;
      }
      .card_top > *:not([class="card_head"]):not([class="card_info"]) {
          margin-left: -100px;
      }
  `;
}
if (location.href.startsWith("http://tieba.baidu.com/p") || location.href.startsWith("https://tieba.baidu.com/p")) {
  css += `
  .icon-vip3-16,
      .icon_tbworld {
          display: none;
      }
      a.at {
          color: #2d64b3 !important;
      }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
