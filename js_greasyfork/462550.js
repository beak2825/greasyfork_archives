// ==UserScript==
// @name 虎扑 - 瑶瑶主题
// @namespace https://greasyfork.org/en/scripts/462550
// @version 1.0.3
// @description 我在，不用担心。 —— 瑶瑶·加入队伍·其三
// @author 云浮鱼
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.bbs.hupu.com/*
// @match *://*.my.hupu.com/*
// @downloadURL https://update.greasyfork.org/scripts/462550/%E8%99%8E%E6%89%91%20-%20%E7%91%B6%E7%91%B6%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/462550/%E8%99%8E%E6%89%91%20-%20%E7%91%B6%E7%91%B6%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "bbs.hupu.com" || location.hostname.endsWith(".bbs.hupu.com")) || (location.hostname === "my.hupu.com" || location.hostname.endsWith(".my.hupu.com"))) {
  css += `

      /*==================================================================
                       帖子内部 - display:none 部分
  ====================================================================*/
      .post_topic th,
      .test-img-list-model .list-font-item .font-item-Topic,
      .hp-pc-rc-SuperMenu-sub-menu,
      .post-user_post-user-comp-info-bottom__CqR2O,
      .post-user_post-user-comp-avatar-wrapper__Dg3nG .post-user_avatar-main__Qa5cS {
          display: none;
      }
      .bbs-sl-web-intro-detail-desc-text {
          flex-basis: auto;
      }

      .hp-pc-footer,
      .hp-footer p:nth-child(2),
      .hp-footer p:nth-child(3),
      .hp-header.hp-header-B,
      #hp-topbarNav {
          display: none;
      }




      .hp-pc-menu-sub-menu,
      img.avatar {
          display: none;
      }
      .hp-pc-rc-TopMenu-top-container {
          background-color: #E9E9E9;
      }


      .hp-pc-rc-TopMenu-top {
          background: transparent;
      }
      .bbs-sl-web-topic-wrap {
          margin-top: 2px;
          margin-right: 16px;
          margin-bottom: 5px;
      }
      /*置顶，最热帖和右侧广告和标题*/
      .index_backToTop__rx3__,
      .post-operate_post-operate-comp-wrapper___odBI .post-operate-comp .todo-list.post-operate-comp-main-share,
      .hp-pc-rc-SuperMenu-sub-menu .rc-menu,
      .index_bbs-post-web-body-right-wrapper__WvQ4Q {
          display: none;
      }

      /*隐藏回帖点亮和浏览*/
      .index_bbs-post-web-main-title__MJTN5 .index_reply__GP3PX,
      .index_bbs-post-web-main-title__MJTN5 .index_light__M2WPs,
      .index_bbs-post-web-main-title__MJTN5 .index_read__7h1Dm {
          display: none;
      }

      /*隐藏这些回帖亮了*/
      .post-wrapper_bbs-post-wrapper__UdhwQ.post-wrapper_light__fi4Jz {
          display: none;
      }

      .index_bbs-post-web__2_mmZ .index_br__hJajv,
      .post-wrapper_bbs-post-wrapper__UdhwQ.post-wrapper_gray__HNv4A .post-wrapper_bbs-post-wrapper-title__TLQdd {
          border: none;
      }



      .thread-content-detail > p {
          margin-top: 0
      }

      .post-reply_post-reply__D1M4P .post-reply-list-content .m-c {
          width: unset;
      }

      .hp-pc-rc-TopMenu-banner,
      .bbs-sl-web-post-layout div:nth-child(3),
      .bbs-sl-web-post-layout div:nth-child(2) {
          display: none;
      }


      .hp-pc-rc-TopMenu-top {
          justify-content: start;
          padding-top: 2vh;
      }
      /*==================================================================
                       帖子内部 - css调整 部分
  ====================================================================*/
      .index_bbs-post-web-main__D_K6v .index_post-wrapper__IXkg_ {
          padding: 0 20px 20px 20px;
      }


      p[class*="image-wrapper"] {
          max-width: 8% !important;
      }

      .post-reply-list_post-reply-list-wrapper__o4_81 .post-reply-list .post-reply-list-container {
          display: unset;
      }

      .post-operate_post-operate-comp-wrapper___odBI .post-operate-comp-main {
          justify-content: space-between;
      }

      .post-user_post-user-comp__3azJ2 {
          min-height: 0;
          display: block;
      }
      .post-content_bbs-post-content__cy7vN .post-content_main-post-info__qCbZu {
          margin: 0;
      }
      /*==================================================================
                       帖子外部 - display:none 部分
  ====================================================================*/
      /*顶部导航栏*/
      /*
      .hp-pc-rc-TopMenu {
          display: none;
      }
      */
      .hp-pc-rc-TopMenu {
          height: 20px;
          position: relative;
      }


      /*    .hp-pc-rc-TopMenu-top .hp-topLogin-info .hasLogin .hp-topNotificat {
          display: none;
      }*/
      .hp-pc-rc-TopMenu-top .mobileclientDown:nth-child(5),
      .hp-quickNav > .mobileclientDown:nth-child(3) > a,
      .hp-pc-rc-TopMenu-top .mobileWeb,
      .hp-pc-rc-TopMenu-top > .hp-quickNav > .line:nth-child(4),
      .hp-pc-rc-TopMenu-top > .hp-quickNav > .line:nth-child(2) {
          display: none;
      }

      /*私信*/
      /*
      html > :nth-child(2) > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(2) > :nth-child(1) > :nth-child(9) {
          display: none;
      }
      */
      /*前往发帖、传送至顶部和投诉的div隐藏*/
      .backToTop_2mZa6 {
          display: none;
      }

      .hu-pc-navigation-type,
      .hu-pc-navigation-my-focus-item {
          border-bottom: none;
      }

      .index_bbs-post-web-main-title__MJTN5 {
          background: transparent;
      }

      .tagselect-wrapper .tagselect-box > div {
          border-top: none;
      }
      /*==================================================================
             美观设置 - 添加media query - 屏幕宽度小于940px时
  ====================================================================*/
      @media only screen and (max-width: 940px) {


          .hp-pc-rc-SuperMenu-sub-menu,
          .index_bbs-post-web-container___cRHg {
              padding: 2vw 2vw 2vw 2vw;
          }

          .bbs-index-web-middle,
          .cardInfoContainer {
              margin-left: 2vw;
          }

          .cardInfoContainer .leftInfo {
              display: -webkit-box;
          }

          .cardInfoContainer .rightInfo {
              flex-direction: column-reverse;
          }


          .cardInfoContainer .rightInfo .red {
              margin-right: 0 !important;
          }


          .text-list-model .list-item {
              width: unset;
          }
          .text-list-model {

              padding-left: 20px;
              padding-right: 20px;
          }


          /*帖子宽度缩小*/
          #container, .hp-wrap,
          .cardInfoContainer,
          .bbs-index-web-middle,
          .personalWarp .prersonbody .prersonbodymiddle,
          .bbs-message-web-container .my-message,
          .bbs-sendPost-wrapper .tagselect-box,
          .bbs-sendPost-wrapper .editor-container,
          .bbs-sl-web-topic-wrap,
          .index_bbs-post-web-body-left-wrapper__O14II {
              width: 94vw !important;
              flex: none;
          }

          .hu-pc-navigation-wrap {
              display: none;
          }

          .post-content_main-post-info__qCbZu .thread-content-detail > p {
              margin-right: 0;
              text-align: justify;
          }

          /*标题部分*/
          .post-fix-title_post-fix-title-wrapper__7VZgk .post-fix-title-content-wrapper .main-c {
              width: 2px;
          }
          .post-fix-title_post-fix-title-wrapper__7VZgk .post-fix-title-title {
              flex: 0 0 64vw;
          }

          .bbs-sl-web-post-layout div:last-child {
              text-align: end;
          }


          .bbs-sendPost-wrapper .editor-container {
              margin: 0;
              margin-left: 3vw;
              margin-top: 3vh;
          }

          .postFooter .footerBox .footerLeft .autosaveTip {
              margin-left: 5vw;
          }

          .tagselect-wrapper .tagselect-box > div {
              margin-left: 2vw;
          }

          .bbs-sendPost-wrapper #hupu-editor-plus-toolbar {
              padding-left: 0;
          }

          .hupu-editor-plus-toolbar {
              justify-content: flex-start;
          }

          .hupu-editor-plus-toolbar > .group > div {
              margin: 0;
          }

          .bbs-post-web .newpost-rc-tab .rc-tabs-nav-wrap .rc-tabs-nav-list {
              margin-left: 5vw;
          }

          .postFooter .footerBox {
              width: unset;
          }

          .postFooter .footerBox .footerRight .submitVideo {
              margin-right: 5vw;
          }
          .bbs-sendPost-wrapper .tagselect-box {
              margin-left: 3vw;
          }

          .hupu-editor-plus-wrapper .editor-container {
              padding: 30px 100px 12px;
          }
      }
  `;
}
if (location.href.startsWith("https://bbs.hupu.com/newpost")) {
  css += `
      .hp-pc-rc-TopMenu-top {
          display: none;
      }
  `;
}
if ((location.hostname === "bbs.hupu.com" || location.hostname.endsWith(".bbs.hupu.com")) || (location.hostname === "my.hupu.com" || location.hostname.endsWith(".my.hupu.com"))) {
  css += `

      /*================================================================
                           总体设置，粗暴地覆盖格式
      ==================================================================*/
      /*!important从来不是一个好选择，但是只有魔法才能面对魔法*/
      
      html {
          --theme-color: #A8A85D;
          --link-color: #F5DD77;
          --text-color: #633E2D;
          --bg-color: #f5f2dd;
          --sec-bg-color: #fffcee;
          /*--hover-color: hwb(58 79% 5%);*/
          --hover-color: hwb(49 60% 3% / .3);
          

          --visited-color: #e3e3e4;

          --undecided: white;
      }

      body {
          background-color: var(--bg-color);
      }
      /*文字颜色*/
      span,
      div {
          color: var(--text-color) !important;
      }

      /*圆圆框框*/
      div {
          border-radius: 20px;
      }

      /*条杠杠颜色*/
      *:before {
          border-color: var(--theme-color) !important;
      }

      /*勾选框颜色*/
      input[type*="checkbox"] {
          accent-color: var(--theme-color);
      }

      /*svg的颜色*/
      span:before,
      i:before {
          color: var(--theme-color) !important;
      }

      /*按钮颜色*/
      button {
          background-color: var(--theme-color) !important;
          border-radius: 20px !important;
      }

      /*active时的颜色*/
      .active {
          border-color: var(--theme-color) !important;
          border-radius: 0;
      }

      /*链接颜色*/
      a {
          color: var(--theme-color) !important;
      }

      a:hover {
          background: var(--hover-color) !important;
      }



      /*================================================================
                                   隐藏元素
      ==================================================================*/
      .hp-pc-rc-TopMenu-top .hp-topLogin-info .hasLogin .line,
      
      i[class*="tip-topBubble"],

      .hu-pc-navigation-topic-type-wrap,

      .hu-pc-navigation-type:before,
      .bbs-sl-web-body .hu-pc-navigation-type:nth-child(3),

      .hu-pc-navigation-my-focus-item > a > .hot,

      .bbs-index-web-body .hu-pc-navigation-type:nth-child(3),
      .bbs-index-web-right .download-app,

      .bbs-sl-web-intro-detail > .bbs-sl-web-intro-detail-desc:nth-child(3),
      .bbs-sl-web-post-header {
          display: none;
      }

          /*================================================================
                                   个人主页设置
      ==================================================================*/
      .teamCardCarouseListWarp-small,
      .hotSearch,
      .cardInfoContainer,
      .test-img-list-model {
          background: var(--sec-bg-color);
          border-radius: 20px;
          box-shadow: 2px 2px 2px var(--theme-color);
      }
      
      .ant-btn:hover {
          border-color: var(--theme-color);
      }
      
      .hp-pc-rc-TopMenu-top-container,
      .bbs-index-web-middle,
      .hp-pc-rc-TopMenu,
      .hp-pc-rc-TopMenu-top {
          background: var(--bg-color);
      }
      
      .cardInfoContainer .leftInfo .leftInfo-content .tagTitleList .tagItem {
          background: var(--hover-color);
      }
      
      .test-img-list-model,
      .cardInfoContainer {
          border-radius: 20px !important;
      }
      
      
      .test-img-list-model * {
          border-radius: 0;
      }
      
      .test-img-list-model .list-font-item:hover {
          background: var(--hover-color);
      }
      .teamCardCarouseListWarp-small .headTitleWarp,
      .activeBorder {
          border-color: var(--theme-color) !important;
          border-radius: 0;   
      }
      
      .hotSearch:hover .hotItem, .hotSearch:hover .hotTitle, .hotSearch:hover .hotValue {
          background: transparent !important;
      }
      
      a.list-item-title {
          color: var(--text-color) !important;
      }
      

      /*================================================================
                                   社区主页设置
      ==================================================================*/
      .bbs-index-web {
          background: var(--bg-color);
      }
      .text-list-model,
      .list-item-wrap,
      .bbs-index-web-middle .middle-module {
          background: var(--sec-bg-color);
      }
      .bbs-index-web-middle .middle-label,
      .list-wrap,
      .text-list-model .list-item:hover,
      .text-list-model .list-item {
          border-radius: 0;
      }

      .list-wrap:hover {
          background: var(--hover-color) !important;
      }

      .list-wrap a:hover {
          background: transparent !important;
      }

      .entranceLayout {
          border-radius: 20px !important;
          background: var(--sec-bg-color) !important;
      }

      .right-post,
      .hot-search {
          background: var(--sec-bg-color);
      }

      .right-post div {
          border-radius: 0;
      }
      
      
      .right-post,
      .hot-search,
      .bbs-index-web-right .entranceLayout,
      .bbs-index-web-middle .middle-module{
          box-shadow: 2px 2px 2px var(--theme-color);
      }
      

      /*================================================================
                                   主板设置
      ==================================================================*/
      .hp-pc-rc-TopMenu-top a {
          vertical-align: bottom !important;
      }


      /*背景颜色*/
      .hp-pc-footer,
      .hp-pc-menu,
      .hp-pc-rc-TopMenu-top-container,
      .hp-pc-rc-TopMenu,
      .bbs-sl-web,
      .bbs-sl-web-holder {
          background: var(--bg-color) !important;
      }

      /*板块的颜色*/
      .bbs-sl-web-intro,
      .bbs-sl-web-topic-wrap {
          background: var(--sec-bg-color) !important;
      }


      /*版头去除边框*/
      .bbs-sl-web-intro {
          border: none;
      }

      /*帖子背景和链接颜色设置*/
      a.p-title {
          color: var(--text-color) !important;
      }

      a.p-title:visited {
          color: var(--visited-color) !important;
      }

      .bbs-sl-web-post-body:hover {
          background: var(--hover-color);
      }

      /*关注发帖按钮 字体颜色*/
      .bbs-sl-web-intro-detail-button.active:after,
      span.bbs-sl-web-intro-icon:before {
          color: var(--undecided) !important;
      }


      /*左侧导航栏修改*/
      .hu-pc-navigation-wrap {
          background: var(--sec-bg-color);
      }

      .hu-pc-navigation-my-focus-item > a > .title {
          border-radius: 0;
      }

      /*一些框加阴影*/
      .hu-pc-navigation-wrap,
      .bbs-sl-web-topic-wrap {
          box-shadow: 2px 2px 2px var(--theme-color);
      }

      /*主板 页面跳转栏（这玩意咋称呼草）*/
      .hupu-rc-pagination .hupu-rc-pagination-prev,
      .iconContainerDisabled_mtFkC,
      .hupu-rc-pagination *[tabindex] {
          background: var(--theme-color) !important;
          border-radius: 20px;
          border-color: transparent !important;
      }

      .iconContainer_2ZI3F i:before,
      .hupu-rc-pagination a,
      .iconContainer_2ZI3F .text_MtRno,
      .hupu-rc-pagination-next i:before {
          color: var(--undecided) !important;
      }
      

      ul[class*="pagination"] * {
          vertical-align: bottom !important;
      }

      .hupu-rc-pagination .hupu-rc-pagination-item:hover a,
      .hupu-rc-pagination .hupu-rc-pagination-next:hover a,
      .hupu-rc-pagination .hupu-rc-pagination-prev:hover a {
          border-radius: 20px;
          background: var(--hover-color) !important;
          color: var(--theme-color) !important;
      }


      /*================================================================
                                   帖内设置
      ==================================================================*/
      /*楼主两个字的颜色*/
      .post-user_post-user-comp-info-top-tip__3Av0L {
          background: var(--theme-color);
          color: var(--undecided) !important;
      }

      /*背景设置*/
      body[hupu-ui-theme="light"],
      .index_bbs-post-web__2_mmZ,
      .index_bbs-post-web-container___cRHg {
          background: var(--bg-color);
      }

      /*页码栏设置*/
      .index_pagination__wvE_f {
          display: flex;
          vertical-align: bottom !important;
      }
      .index_jumpToPage__GC8jx .index_input__9ge6K {
          top: -2px;
          border-radius: 20px;
      }
      .index_pagination__wvE_f .hupu-rc-pagination .hupu-rc-pagination-item,
      .index_pagination__wvE_f .hupu-rc-pagination .hupu-rc-pagination-next,
      .index_pagination__wvE_f .hupu-rc-pagination .hupu-rc-pagination-prev {
          border-radius: 20px;
      }

      .index_pagination__wvE_f .hupu-rc-pagination .hupu-rc-pagination-item a:hover {
          color: var(--undecided) !important;
      }

      .index_iconContainer__odKRy .index_text__89JcF,
      .iconxialax:before {
          color: var(--undecided) !important;
      }

      .index_jumpToPage__GC8jx .index_button__KWQvz:hover {
          background: var(--theme-color);
          border-color: var(--theme-color);
      }
      .index_jumpToPage__GC8jx .index_button__KWQvz,
      .index_jumpToPage__GC8jx .index_button__KWQvz:hover {
          border-radius: 20px;
          cursor: pointer;
      }

      .index_iconContainerDisabled__9ZTW8:hover,
      .index_iconContainerDisabled__9ZTW8 {
          background: var(--theme-color);
          border-color: transparent !important;
      }



      /*框框（鬼知道为什么这时又变成div了，很神奇8*/
      div:before {
          background: var(--theme-color) !important;
      }

      /*帖子的颜色*/
      .index_bbs-post-web-main__D_K6v .index_post-wrapper__IXkg_,
      .index_bbs-post-web-main__D_K6v,
      .index_bbs-post-web-body-left-wrapper__O14II {
          background: var(--sec-bg-color);
      }

      /*被删除的评论的颜色*/
      .post-reply_post-reply__D1M4P div:has(>p[class*="illegal"]) {
          background: var(--visited-color) !important;
      }

      .post-reply_post-reply__D1M4P div[class*="base-info"],
      .index_bbs-thread-comp-container__QkBRG * {
          border-radius: 0;
      }

      /*引用评论颜色*/
      .index_bbs-thread-comp-container__QkBRG {
          background: radial-gradient(farthest-side, transparent) no-repeat fixed var(--hover-color);
      }

      h1,
      h2 {
          color: var(--text-color) !important;
      }

            /*快速回复*/
        #hupu-compact-editor {
            background: radial-gradient(farthest-side, transparent) no-repeat fixed var(--hover-color) !important;
        }
        .index_compact__osaGi {
            background: radial-gradient(farthest-side, transparent) no-repeat fixed var(--hover-color) !important;
        }

        .index_operatorButtonContainer__6G3JA .index_operatorButton__ijSnG:hover,
        .index_operatorButtonContainer__6G3JA .index_operatorButton__ijSnG {
            background: var(--theme-color) !important;
            border-radius: 20px !important;
            color: var(--undecided) !important;
        }

        #hupu-compact-editor p {
            color: var(--text-color) !important;
        }

      /*置顶标题*/
      .post-fix-title {
          background: var(--hover-color) !important;
          border-radius: 0;
      }

      .post-fix-title_post-fix-title-wrapper__7VZgk .post-fix-title-config .fixed-btn {
          border-color: transparent;
      }

      .post-fix-title_post-fix-title-wrapper__7VZgk .post-fix-title-config .fixed-btn.main:hover,
      .post-fix-title_post-fix-title-wrapper__7VZgk .post-fix-title-config .fixed-btn.main {
          background: var(--theme-color);
          color: var(--undecided) !important;
      }

      .main-c div[class*="read-author"]:hover {
          background: var(--theme-color) !important;
          color: var(--undecided) !important;
      }
      /*评论区背景色*/
      .post-wrapper_bbs-post-wrapper__UdhwQ.post-wrapper_gray__HNv4A {
          background: var(--bg-color);
      }

      /*标题色*/
      .index_bbs-post-web-main-title-provider__uHAn9 .index_name__M5qqs {
          color: var(--text-color) !important;
      }
      
      .postFooter .footerBox,
      .bbs-sendPost-wrapper #hupu-editor-plus-toolbar,
      .bbs-post-web .newpost-rc-tab,
      .bbs-post-web .newpost-rc-tab .rc-tabs-nav-wrap,
      .tagselect-wrapper,
      .rc-tabs-tabpane {
          background: var(--bg-color) !important;
      }

      .postFooter .footerBox {
          border-radius: 0;
      }


      svg {
          color: var(--theme-color) !important;
          background: var(--bg-color);
      }

      .hupu-editor-plus-svg-button {
          background: transparent !important;
      }

      div[class*="tooltip"]:after {
          background: white !important;
      }


      .bbs-post-web .newpost-rc-tab .rc-tabs-nav-wrap,
      .bbs-sendPost-wrapper #hupu-editor-plus-toolbar {
          background: var(--bg-color);
          border-radius: 0;
      }

      button[class*=button] {
          background: transparent;
      }

      .hupu-editor-plus-wrapper,
      button[class*=button]:hover {
          background: var(--bg-color);
      }

      .hupu-editor-plus-toolbar > .group > div > button > svg:hover {
          background: var(--bg-color);
          color: var(--theme-color);
      }

      .postFooter .footerBox .footerRight .submitVideo,
      .bbs-post-web .newpost-rc-tab .rc-tabs-ink-bar {
          background: var(--theme-color);
      }

      .postFooter {
          border-radius: 0;
          background: var(--bg-color);
      }

      .submitVideo {
          color: white !important;
      }
      .hupu-editor-plus-title > input,
      .hupu-editor-plus-wrapper .editor-container {
          background: var(--sec-bg-color);
      }

      .hupu-editor-plus-title {
          border-radius: 0;
      }

      .tagselect-wrapper,
      .bbs-post-web-holder {
          background: var(--bg-color);
      }


      .tagselect-wrapper .tagselect-box {
          background: var(--sec-bg-color);
      }

      .selectTagStyle .topicZone {
          background: none;
      }

      span[class*=ant-tag] {
          background: url(https://w1.hoopchina.com.cn/editor/icon/pc/squareLight.png) 6px 7px / 20px 20px no-repeat !important;
          color: var(--text-color) !important;
      }

      .bbs-post-web .newpost-rc-tab .rc-tabs-nav .rc-tabs-tab .rc-tabs-tab-btn,
      .hupu-editor-plus-toolbar-color .font-color-icon svg,
      .hupu-editor-plus-toolbar > .group > div > button > svg,
      .hupu-editor-plus-title > input,
      .postFooter .footerBox .footerLeft .autosaveTip,
      p {
          color: var(--text-color);
      }

      .papers-activity {
          display: none;
      }

      div[id*="tippy"] div {
          color: var(--theme-color) !important;
          background: var(--undecided) !important;
      }
      
      
  `;
}
if (location.href.startsWith("https://bbs.hupu.com/newpo")) {
  css += `
      .hp-pc-rc-TopMenu-top {
          display: none;
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
