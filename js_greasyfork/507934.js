// ==UserScript==
// @name DARK CMS.S3
// @namespace ?
// @version 20240911.09.03
// @description none
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:.*\/my\/s3\/.*)$/
// @downloadURL https://update.greasyfork.org/scripts/507934/DARK%20CMSS3.user.js
// @updateURL https://update.greasyfork.org/scripts/507934/DARK%20CMSS3.meta.js
// ==/UserScript==

(function() {
let css = "";
if (new RegExp("^(?:.*\\/my\\/s3\\/.*)\$").test(location.href)) {
  css += `
  /* VARs and index */

  :root{
      --bg: #222;
      --bgh: #2a2a2a;
      --bg2: #333;
      --bg2h: #3a3a3a;
      --bg3: #555;
      --bg3h: #666;
      --text: #fff;
      --text2: #ccc;
      --text3: #aaa;
      --text4: #999;
      --link: #25b02b;
      --linkh: #0c8011;
      --linkd: #002b02;
      --link2: #b17725;
      --link2h: #7e4e0c;
      --link2d: #392201;
      --link3: #0f83c6;
      --link3h: #04669f;
      --link3d: #012a42;
      --link4: #c80f0f;
      --link4h: #9b0505;
      --link4d: #4f0101;
      --select: #00ff0b20;
      --select2: #ff950020;
      --select3: #00a2ff20;
      --select4: #ff000020;
  }




  *{
      font-family: "Inter" !important;
      font-weight: 500;
  }

  html::-webkit-scrollbar{
      width: 10px;
      background: var(--select);
  }

  html::-webkit-scrollbar-thumb{
      border-radius: 10px;
      background: var(--link);
  }

  body{
      background: var(--bg);
      color: var(--text);
  }

  .s3-content{
      background: var(--bg);
  }

  header.s3-header-new{
      background: var(--bg2);
      color: var(--text);
  }

  header.s3-header-new .s3-site-info .site-domain, .s3-content .module-title{
      color: var(--text);
  }

  header.s3-header-new .site-num{
      color: var(--text2);
  }

  header.s3-header-new .navbar > ul > li > a{
      color: var(--text2);
  }

  .with-arrow-thin span.arrow{
      filter: invert(1);
  }


  header.s3-header-new .navbar > ul > li > a:hover, header.s3-header-new .navbar > ul > li > a.context-button-active{
      color: var(--link);
  }

  *:hover:not(.staff) >  span.arrow, header.s3-header-new .navbar > ul > li > a:hover:not(.staff) span.arrow, header.s3-header-new .navbar > ul > li > a.context-button-active:not(.staff) span.arrow{
      filter: brightness(1.5) hue-rotate(-90deg) !important;
  }

  span.icon{
      filter: invert(1);
  }

  textarea{
      background: var(--bg);
      border-color: var(--bgh);
      color: var(--text);
      transition: .2s;
  }

  textarea:hover{
      background: var(--bgh);
      transition: .2s;
  }

  textarea:focus{
      background: var(--select);
      border-color: transparent;
      box-shadow: none;
      transition: .2s;
  }

  .icon.news .notice_number{
      filter: invert(1);
  }

  header.s3-header-new .s3-site-info .site-vers .site-ver-control{
      background: var(--bg3);
  }

  header.s3-header-new .s3-site-info .site-vers .site-ver-control:hover, header.s3-header-new .s3-site-info .site-vers .site-ver-control.context-button-active{
  	background: var(--select);
  }

  ._dashboard__row--title{
      font-family: "Open Sans", sanf-serif;
      font-weight: 600;
      opacity: 1;
      color: var(--text3);
  }

  ._card--white{
      background: var(--bg2);
      color: var(--text);
      border: #333;
      padding: 15px 20px 20px 20px;
      transition: .2s;
  }

  ._dashboard__card:hover{
      background: #1f4e21;
      box-shadow: 0 8px 20px 1px #002c02;
      transition: .2s;
  }

  ._dashboard__card:after{
      transition: .2s;
  }


  ._card__header{
      color: var(--text);    
  }

  ._dashboard__card ._card__text{
      color: var(--text3);
  }

  ._counter{
      color: var(--text2);
  }

  ._card__link{
      color: var(--link);
  }

  ._dashboard__card ._card__text--overflow:after{
      background: linear-gradient(0deg,var(--bg2),#3330);
      opacity: 1;
      transition: .2s;
  }


  ._dashboard__card:hover ._card__text--overflow:after{
      background: linear-gradient(0deg,var(--bg2),#3330);
      opacity: 0;
      transition: .2s;
  }

  ._histogram__item:not(:last-child){
      background: #fff4
  }

  ._btn--green{
      background: #0c8011;
      transition: .2s;
  }

  ._btn--green:hover{
      background: #10aa17;
      transition: .2s;
  }

  ._btn--blue{
      background: #1a5dc8;
      transition: .2s;
  }

  ._btn--blue:hover{
      background: #276ddd;
      transition: .2s;
  }

  header.s3-header-new .navbar .site-data-types, .context-menu-v2.top-panel-nav{
      background: var(--bg2h) !important;
      box-shadow: 0 2px 10px #0004 !important;
      padding: 15px !important;
      border-radius: 10px !important;
      margin-top: 20px !important;
  }

  .context-menu ul li a{
      color: var(--text2);
  }

  .context-menu-v2 ul li:hover, .context-menu-v2 ul li.selected{
      background: var(--select);
      border-radius: 5px;
  }

  .context-menu-v2.top-panel-nav ul li.bold a, .context-menu-v2.top-panel-nav ul li.bold span.txt{
      color: var(--text);
  }

  .context-menu-v2 .row .col ul li.separator{
      border-color: #fff2;
  }

  .context-menu * .s3-ico{
      filter: invert(1);
  }

  .s3-ico.i-shield-allowed-svg{
      filter: invert(0);
  }

  .s3-cb:not(.switcher) .ico, .s3-label-static-cb .ico{
      background: var(--bg) !important;
      border-color: var(--bgh) !important;
      transition: .2s;    
  }

  .s3-cb:not(.switcher):hover .ico, .s3-label-static-cb:hover .ico{
      background: var(--select) !important;
      border-color: var(--linkh) !important;
      transition: .2s;    
  }

  .s3-cb:not(.switcher).active .ico, .s3-label-static-cb.active .ico, .s3-label-static-cb input:checked ~ span.ico{
      background: var(--link) !important;    
      border-color: var(--link) !important;
  }

  #shop2-field-container li.box .handle:hover, ul.boxes.data-list.json_sortable li.box .handle:hover, ul.boxes.data-list.ui-sortable li.box .handle:hover{
      background-color: var(--select);
  }

  .s3-ico.i-home-svg, .s3-ico.i-home-solid-svg, .s3-ico.i-homepage-svg, .s3-ico.i-delete-svg, .s3-ico.i-zoom-svg, .s3-ico.i-zoom2-svg, .s3-ico.i-tpl-svg, .s3-ico.i-gear-svg, .s3-ico.i-bell-svg, .s3-ico.i-gear-staff-svg, .s3-ico.i-brush-svg, .s3-ico.i-pencil-svg, .s3-ico.i-pencil-white-svg, .s3-ico.i-add-grey-svg, .s3-ico.i-add-white-thin-svg, .s3-ico.i-add-green-svg, .s3-ico.i-add-magenta-svg, .s3-ico.i-add-white-svg, .s3-ico.i-add-grey-small-svg, .s3-ico.i-coub-svg, .s3-ico.i-html, .s3-ico.i-book-svg, .s3-ico.i-menu-svg, .s3-ico.i-checked-svg, .s3-ico.i-checked-green-svg, .s3-ico.i-list-svg, .s3-ico.i-list-white-svg, .s3-ico.i-list-short-svg, .s3-ico.i-list-short-white-svg, .s3-ico.i-page-svg, .s3-ico.i-lock-svg, .s3-ico.i-lock-orange-svg, .s3-ico.i-link-svg, .s3-ico.i-verify-svg, .s3-ico.i-noicon-svg, .s3-ico.i-copy-svg, .s3-ico.i-redirect, .s3-ico.i-dataquery, .s3-ico.i-dataquery-white, .s3-ico.i-database, .s3-ico.i-database-play, .s3-ico.i-save, .s3-ico.i-save-svg, .s3-ico.i-save-green-svg, .s3-ico.i-save-orange-svg, .s3-ico.i-save-white-svg, .s3-ico.i-save-and-close-svg, .s3-ico.i-cancel-svg, .s3-ico.i-back, .s3-ico.i-alert, .s3-ico.i-alert-solid, .s3-ico.i-alert-red, .s3-ico.i-alert-red-solid, .s3-ico.i-alert-grey, .s3-ico.i-help-svg, .s3-ico.i-user-small-svg, .s3-ico.i-history, .s3-ico.i-history-staff, .s3-ico.i-delete-staff, .s3-ico.i-favorite, .s3-ico.i-megafon, .s3-ico.i-select, .s3-ico.i-choose, .s3-ico.i-replace, .s3-ico.i-security, .s3-ico.i-section-image, .s3-ico.i-section-meta, .s3-ico.i-section-media, .s3-ico.i-section-text, .s3-ico.i-section-shop, .s3-ico.i-section-shop-white, .s3-ico.i-section-news, .s3-ico.i-section-news-white, .s3-ico.i-section-forms, .s3-ico.i-section-forms-white, .s3-ico.i-section-gallery, .s3-ico.i-section-gallery-white, .s3-ico.i-section-users, .s3-ico.i-section-users-white, .s3-ico.i-page-link, .s3-ico.i-info, .s3-ico.i-info-solid, .s3-ico.i-info-solid-green, .s3-ico.i-seosettings, .s3-ico.i-globe, .s3-ico.i-export-svg, .s3-ico.i-watermark-svg, .s3-ico.i-idea-svg, .s3-ico.i-idea-svg.yellow, .s3-ico.i-fast-edit-large, .s3-ico.i-fast-edit, .s3-ico.i-folder-svg, .s3-ico.i-folder-grey-svg, .s3-ico.i-folder-add-svg, .s3-ico.i-folder-hidden-svg, .s3-ico.i-folder-linked-svg, .s3-ico.i-folder-linked-grey-svg, .s3-ico.i-folder-lock-svg, .s3-ico.i-folder-unlock-svg, .s3-ico.i-invert-svg, .s3-ico.i-targetmap, .s3-ico.i-rotate-left, .s3-ico.i-rotate-right, .s3-ico.i-crop, .s3-ico.winclose-thin, .s3-ico.winexpand-thin, .s3-ico.winhelp-thin, .s3-ico.winhelp-filled, .s3-ico.winreload-thin, .s3-ico.i-editor-crop, .s3-ico.i-editor-imgdecrease, .s3-ico.i-editor-imgincrease, .s3-ico.i-editor-imginfo, .s3-ico.i-editor-linked, .s3-ico.i-editor-move, .s3-ico.i-editor-rotate-l, .s3-ico.i-editor-rotate-r, .s3-ico.i-editor-zoomin, .s3-ico.i-editor-zoomout, .s3-ico.i-pagelist, .s3-ico.i-pagepreviews, .s3-ico.i-pagepreviews-small, .s3-ico.i-pagelist-white, .s3-ico.i-pagepreviews-white, .s3-ico.i-reload-small, .s3-ico.i-reload-small-white, .s3-ico.i-editor-revert, .s3-ico.i-download-svg, .s3-ico.i-reset-svg, .s3-ico.i-tasks, .s3-ico.i-filter, .s3-ico.i-shop2-badge-new, .s3-ico.i-shop2-badge-sale, .s3-ico.i-shop2-badge-yml, .s3-ico.i-shop2-comments, .s3-ico.i-dp, .s3-ico.i-shop2-link, .s3-ico.i-shop2-not-amount, .s3-ico.i-advanced-search, .s3-ico.i-advanced-reset, .s3-ico.i-search-ed, .s3-ico.i-ol-download, .s3-ico.i-ol-favorite, .s3-ico.i-ol-favorite-yellow, .s3-ico.i-ol-check, .s3-ico.i-ol-check-white, .s3-ico.i-listcards, .s3-ico.i-photo, .s3-ico.i-tag, .s3-ico.i-show, .s3-ico.i-anchor, .s3-ico.i-arrow-up, .s3-ico.i-arrow-down, .s3-ico.i-animated-preloader, .s3-ico.i-folder-multi, .s3-ico.i-editor-revert, .s3-ico.i-draggable, .s3-ico.i-gourl, .s3-ico.i-circle, .s3-ico.i-ol-results, .s3-ico.i-autoexport, .s3-ico.i-goal, .s3-ico.i-folder-multi, .s3-ico.i-upload-svg, .s3-ico.i-global-fields, .s3-ico.i-column-setup, .s3-ico.i-folder-multi, .s3-ico.i-force, .s3-ico.i-handsrot-svg, .s3-ico.i-handsrot-svg, .s3-ico.i-force, .s3-ico.i-goals, .s3-ico.i-add-image, .s3-ico.i-add-image-multi, .s3-ico.i-eyehide-svg, .s3-ico.i-eyeshow-svg, .s3-ico.i-cover-svg, .s3-ico.i-nocover-svg, .s3-ico.i-ban, .s3-ico.i-info-details, .s3-ico.i-activate-user, .s3-ico.i-info-details-svg, .s3-ico.i-archive-svg, .s3-ico.i-flag-svg, .s3-ico.i-flag-svg, .s3-ico.i-advanced-view, .s3-ico.i-align-left, .s3-ico.i-align-center, .s3-ico.i-align-right, .s3-ico.i-circle-svg, .s3-ico.i-video-svg, .s3-ico.i-mail, .s3-ico.i-mail-read, .s3-ico.i-clockface, .s3-ico.i-bill, .s3-ico.i-clock-svg, .s3-ico.i-page-link-context, .s3-ico.i-page-link-view, .s3-ico.i-more-svg, .s3-ico.i-search-svg, .s3-ico.i-spam-svg, .s3-ico.i-star-svg, .s3-ico.i-sortup-svg, .s3-ico.i-sortdown-svg, .s3-ico.i-info-svg, .s3-ico.i-menu-open-svg, .s3-ico.i-close.gray, .s3-btn-v2.w-ico-first .s3-ico, .s3-btn-v2.w-ico-first .s3-oah-ico, .s3-oah-ico.oah-folder-add, .s3-oah-ico, .s3-ico.i-union, .s3_news_wrapper .s3-actions-panel-wrap .s3-actions-panel .s3-btn.w-ico-param .s3-ico.i-comment-svg, .s3_news_wrapper .s3-actions-panel-wrap .s3-actions-panel .s3-btn.w-ico-param .s3-ico.i-param-svg, .s3-actions-panel-wrap.article_block .s3-panel-blog-menu .menu-button .btn-ico.settings, .s3-actions-panel-wrap.article_block .s3-panel-blog-menu .menu-button .btn-ico.comment, .s3-actions-panel-wrap.article_block .s3-panel-blog-menu .menu-button .btn-ico.moder, .s3-actions-panel-wrap.article_block .s3-panel-blog-menu .menu-button .btn-ico.recommend{
      filter: brightness(0.5) invert(1) ;
      opacity: 1;
  }

  /* EXCLUDE ICONS */

  span.s3-ico.i-add-green-svg, ._green, .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in.popup .actions-panel-wrapper .s3-btn-link .s3-ico.i-folder-add-svg, .s3-ico.i-alert-solid, .s3-ico.i-advanced-search, .s3-ico.i-add-white-svg, .s3-ico.i-add-white-circle-svg, #fsUploadCountFiles ul.boxes.data-list li.box.done-upload-file .percent .s3-oah-ico, #uriUploadCountFiles ul.boxes.data-list li.box.done-upload-file .percent .s3-oah-ico, .s3-ico.i-alert-red-solid{
      filter: none !important;
  }

  .s3-btn-v2{
      background: var(--bg3);
      color: var(--text2);
      box-shadow: none;
      transition: .2s;
  }

  .s3-btn-v2:hover{
      background: var(--bg3h);
      color: var(--text);
      box-shadow: none;
      border-color: var(--bg3h);
      transition: .2s;
  }

  .s3-btn.green, .s3-btn-v2.green{
      background: var(--link) !important;
      box-shadow: none !important;
      color: var(--text) !important;
      border-color: var(--link) !important;
      transition: .2s;
  }

  .s3-btn.green:hover, .s3-btn-v2.green:hover{
      background: var(--linkh) !important;
      border-color: var(--linkh) !important;
      transition: .2s;
  }

  .s3-btn.red{
      background: var(--link4) !important;
      box-shadow: none !important;
      color: var(--text) !important;
      border-color: var(--link4) !important;
      transition: .2s;
  }

  .s3-btn.red:hover{
      background: var(--link4h) !important;
      box-shadow: none !important;
      color: var(--text) !important;
      border-color: var(--link4h) !important;
      transition: .2s;
  }

  .s3-btn.white-gray, .s3-btn-v2.grey, .s3-btn-v2.white, .s3-btn-v2.white-green, .s3-btn-v2.white-gray{
      background: var(--bg3)!important;
      color: var(--text2) !important;
      transition: .2s;
      border-color: var(--bg3) !important;
      box-shadow: none !important;
  }

  .s3-btn.white-gray:hover, .s3-btn-v2.grey:hover, .s3-btn-v2.white:hover, .s3-btn-v2.white-green:hover{
      box-shadow: none;
      background: var(--bg3h) !important;
      transition: .2s;
      border-color: var(--bg3h) !important;
  }

  .s3-btn.white-gray.active, .s3-btn.white-gray.active, .s3-btn-v2.white.active, .s3-btn-v2.white-green.active{
      box-shadow: none;
      background: var(--linkh) !important;
      transition: .2s;
      border-color: var(--select) !important;
      
  }

  .s3-btn.white, .s3-btn, .menu-actions-wrap.redesign .adaptive-controls .s3-radio-tabs.medium label.s3-rb{
      background: var(--bg3);
      color: var(--text2);
      box-shadow: none;
      transition: .2s;
  	font-family: var(--font) !important;
      border-color: var(--bg3) !important;
  }

  .s3-btn.white:hover, .s3-btn:hover, .menu-actions-wrap.redesign .adaptive-controls .s3-radio-tabs.medium label.s3-rb:hover{
      box-shadow: none;
      background: var(--bg3h) !important;
      transition: .2s;
      border-color: var(--bg3h) !important;
  }


  .menu-actions-wrap.redesign .menu-displaying .s3-radio-tabs.medium label.s3-rb.active{
      background: var(--linkh) !important;
      border-color: var(--linkh) !important;
  }

  .context-menu-news__title, .fast-block-title{
      color: var(--text);
  }

  .context-menu-news ul::-webkit-scrollbar{
      width: 10px;
  }
  .context-menu-news ul::-webkit-scrollbar-thumb{
      border-radius: 10px;
      background: var(--linkh);
  }


  .context-menu-news__all span, .context-menu-news__all a{
      color: var(--link);
      font-weight: 700;
      border-color: var(--bg3);
  }

  .s3-btn-v2.white-green:hover, .s3-btn-v2.green:hover, .s3-btn-v2.white-green:active, .s3-btn-v2.white-green.active{
      background: var(--linkh);
      transition: .2s;
  }

  .objectAction{
      color: var(--link);
  }

  .message, .delivery-wrapper .bluepopup-wrapper .message{
      background: var(--link2d);
      border-color: var(--link2h);
      border-radius: 8px;
  	color: var(--link2);
      padding: 15px 20px;
  }

  .bluepopup-wrapper>table td.controls, .bluepopup-wrapper>table td.draggable_title{
      padding: 20px 25px;
  }

  .bluepopup-wrapper > table td.draggable_title span.title{
      font-weight: 700;
      color: var(--link);
  }

  .pf-contsols-col-2 {
      width: auto;
  }

  .pf-contsols-col-1 > div{
      height: 46px !important;
  }

  #ajaxPopupWindow_0 > div{
      top: 40px;
  }

  .ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default{
      background: var(--bg);
      border: none !important;
      color: var(--text);
      outline: none !important;
  }

  .ui-widget-content{
      background: var(--bg);
      color: var(--text2);
      border-color: var(--bg3);
  	border: 1px solid var(--bg3);
  }

  .ui-widget-content a{
      color: var(--text2);
  }

  .ui-state-hover, .ui-widget-content .ui-state-hover, .ui-widget-header .ui-state-hover, .ui-state-focus, .ui-widget-content .ui-state-focus, .ui-widget-header .ui-state-focus{
      background: var(--select);
      color: var(--text);
      border-color: transparent !important;
      cursor: pointer;
  }

  .s3-select + .chzn-container-multi .chzn-choices{
  	display: flex !important;
  	gap: 5px;
      background: var(--bg);
      border-color: var(--bg) !important;
  	padding: 5px !important;
      max-width: 250px !important;
      flex-wrap: wrap;
  }

  .menu-actions-wrap.redesign form.search_page .s_inputs_wrap{
      background: transparent;
  }

  input.s3-input-text, div.menu-actions form.search_page input.s_text{
      background: var(--bg) !important;
      color: var(--text) !important;
      border: none !important;
      transition: .2s;
  }

  div.menu-actions form.search_page input.s_text:hover{
      background: var(--bgh) !important;
      color: var(--text) !important;
      border: none !important;
      transition: .2s;
  }

  div.menu-actions form.search_page input.s_text:focus{
      background: var(--select) !important;
      color: var(--text) !important;
      border: none !important;
      transition: .2s;
  }

  input.s3-input-text[readonly]{
      background: var(--bg);
      color: var(--text3);
  }

  form label{
      color: var(--text2);
  }

  .menu-actions-wrap.redesign span.s3-btn-v2.menu-add-page span.s3-ico{
      filter: none;
  }

  .context-menu-v2 ul li.separator{
      border-color: var(--bg3);
  }

  div.context-menu.site-lang * span.s3-ico{
      filter: none;
  }

  #alert, #confirm, #confirm_green, #lp_confirm, .confirm-popup{
      background: var(--bg2);
      border-radius: 15px;
  }

  #alert *, #confirm *, #confirm_green *, #lp_confirm *, .confirm-popup *{
      color: var(--text2) !important;
  }

  a{
      color: var(--link3);
  }
  `;
}
if (new RegExp("^(?:.*\\/my\\/s3\\/.*)\$").test(location.href)) {
  css += `
  /* All */

  .table-min td, .table-min-v td, .table-min tr:hover td, .table-min-v tr:hover td{
      color: var(--text2);
  }

  .inner_notice-wrapper_in{
      background: var(--bg2);
      border: none;
  }

  .inner_notice-list > tbody > tr{
      background: var(--bg2);
      border-color: #fff2 !important;
      transition: .2s;
  }

  .inner_notice-list > tbody > tr:nth-child(2n-1){
      background: var(--bg2h);
  }

  .inner_notice-list > tbody > tr.inner_notice_unreaded{
      background: var(--select);
  }

  .inner_notice-list > tbody > tr td.post-name span.inner_notice-post-name{
      color: var(--text);
      transition: .2s;
      text-decoration: none !important;
  }

  .inner_notice-list > tbody > tr td.post-name span.inner_notice-post-name:hover{
      color: var(--link);
      transition: .2s;
  }

  .inner_notice-list td{
      vertical-align: middle;
  }

  td.checkbox .s3-cb{
      padding: 0;
  }

  .s3-note{
      background: var(--select2);
      color: var(--text2);
  }

  .cd-field._small .cd-field__text{
      color: var(--text);
  }

  .cd-input._small .cd-input__field, .cd-selectbox._small .cd-selectbox__selected{
      background: var(--bg);
      border-color: var(--bg);
      color: var(--text);
      transition: .2s;
  }

  .cd-input._small input.cd-input__field:focus, .cd-selectbox._opened .cd-selectbox__selected{
      background: var(--select);
      border-color: var(--linkh);
      box-shadow: none;
      transition: .2s;
  }

  .cd-selectbox._small .cd-selectbox__amount{
      background: var(--bg3);
      color: var(--text3);
  }

  .cd-selectbox._opened .cd-selectbox__selected .cd-selectbox__amount{
      background: var(--link);
  }

  .cd-selectbox._small .cd-selectbox__list{
      background: var(--bg);
      color: var(--text);
      box-shadow: none;
  }

  .cd-selectbox._small .cd-selectbox__item{
      color: var(--text2);
  }

  .cd-selectbox .cd-selectbox__item:hover{
      background: var(--select);
  }

  .table-min-v2 > tbody > tr td:first-child, .table-min-v2 > tbody > tr td{
      background: none;
      border-color: var(--bgh);
      color: var(--text);
  }

  .table-min-v2 > tbody > tr td:first-child label{
      color: var(--text);
  }

  .s3-textarea{
  	background: var(--bg);
  	border: none;
  	color: var(--text);
  }

  .s3-textarea:hover, .s3-textarea:focus{
  	background: var(--linkd);
  	box-shadow: none;
  }

  .s3-link{
  	color: var(--link);
  }

  .bluepopup-wrapper>table td.content .tabs .tabs-header li a.tab-handle{
  	color: #fff;
  }

  header.s3-header-new .s3-logo .line{
      background: var(--bg3);
  }

  `;
}
if (new RegExp("^(?:.*\\/my\\/s3\\/.*)\$").test(location.href)) {
  css += `
  /* SHOP */


  .shop2-wrapper .shop2-products-wrapper, .shop2-wrapper .shop2-orders-wrapper, .shop2-wrapper .s3-actions-panel-wrap{
      background: var(--bg2);
  	border-radius: 10px;
  }

  .products-list{
      border-color: #0000;
  }

  .products-list > tbody > tr{
      background: var(--bg2);
      border-color: #0000;
      transition: background .2s;
      
  }

  .products-list > tbody > tr:nth-child(2n-1){
      background: var(--bg2h);    
      transition: background .2s;
  }

  .products-list > tbody > tr.active{
      background: var(--select);
      border-color: transparent;
      transition: background .2s;
  }

  .products-list > tbody > tr.active:nth-child(2n-1){
      background: #00ff0b30;
      border-color: transparent;
      transition: background .2s;
  }

  .products-list > tbody > tr.active + tr.box{
      border-color: transparent;
      transition: background .2s;
  }

  .products-list td.product-name span.shop2-product-name, .products-list td{
      color: var(--text);
      transition: background .2s;
  }

  .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in .s3-tree ul li > div .dynatree-title{
      color: var(--text);
      transition: .2s;
  }

  .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in .s3-tree ul li > div.dynatree-node.linked .wrapper .active-wrapper .dynatree-title{
      color: var(--text3);
      transition: .2s;
  }

  .tree-wrapper .s3-tree-wr .s3-tree-context.context-menu{
      background: var(--bg2h);
      color: var(--text);
      transition: .2s;
  }

  .tree-wrapper .s3-tree-wr .s3-tree-context.context-menu ul li{
      transition: .2s;
  }

  .tree-wrapper .s3-tree-wr .s3-tree-context.context-menu ul li:hover{
      background: var(--select);
      transition: .2s;
  }

  .tree-wrapper .s3-tree-wr .s3-tree-context.context-menu ul li span.name, .tree-wrapper .s3-tree-wr .s3-tree-context.context-menu ul li.node-link a, .tree-wrapper .s3-tree-wr .s3-tree-context.context-menu ul li.toggle-hide .title, .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in h3{
      color: var(--text);
      transition: .2s;
  }

  .tree-wrapper .s3-tree-wr .s3-tree-context.context-menu ul li.toggle-hide .s3-radio-tabs .s3-radio-tabs.medium{
      border-color: var(--bg3);
      transition: .2s;
  }

  .tree-wrapper .s3-tree-wr .s3-tree-context.context-menu ul li.toggle-hide .s3-radio-tabs .s3-radio-tabs.medium .s3-rb{
      background: var(--bg3);
      border-color: #0000 !important;
      transition: .2s;
  }

  .tree-wrapper .s3-tree-wr .s3-tree-context.context-menu ul li.toggle-hide .s3-radio-tabs .s3-radio-tabs.medium .s3-rb.active{
      background: var(--linkh);
      transition: .2s;
  }

  .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in .s3-tree ul li > div.dynatree-node .wrapper .active-wrapper .s3-badge, .s3-content .module-title .product-count-wrap span.s3-badge, .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in h3 span.page-count-wrap, .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in.popup .s3-tree ul li > div.dynatree-node .wrapper .active-wrapper .s3-badge, .s3-content .page-count-wrap{
      background: var(--bg3);
      border: none !important;
      color: var(--text2);
      transition: .2s;
      padding: 1px 6px;
  }

  .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in .s3-tree ul li > div .s3-badge, .product-flag, .product-flag span{
      background: var(--bg3);
      color: var(--text3);
      transition: .2s;
  }

  .s3-tree ul.dynatree-container .dynatree-node.root+ul>li:first-child>.dynatree-node.dynatree-node.dynatree-exp-e>.dynatree-expander, .s3-tree ul.dynatree-container .dynatree-node.root+ul>li:first-child>.dynatree-node.dynatree-node.dynatree-exp-el>.dynatree-expander, .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in .s3-tree ul li > div.dynatree-node.dynatree-exp-c .dynatree-expander, .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in .s3-tree ul li > div.dynatree-node.dynatree-exp-cl .dynatree-expander, .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in .s3-tree ul li > div.dynatree-node.dynatree-exp-cd .dynatree-expander, .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in .s3-tree ul li > div.dynatree-node.dynatree-exp-cdl .dynatree-expander{
      filter: brightness(0.7);
  }

  div.s3-actions-panel-wrap, .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in .content-tree-wrapper-controls, .menu-actions-wrap.redesign{
      background: var(--bg2h);
      box-shadow: none;
  }

  .mg-btn{
      color: #fff;
      background: var(--bg3);
      box-shadow: none;
      transition: .2s;
  }

  .mg-btn:hover{
      background: var(--select);
      transition: .2s;
  }

  .s3-actions-panel-wrap, .menu-actions-wrap.redesign{
      padding: 14px !important;
  }

  .products-list td.product-name.with-image div.product-image span.image, .products-list td.product-name.with-image div.product-image img{
      filter: brightness(0.7);
  }

  body .custom-tooltip-styling{
      background: #eee !important
  }

  table.products-list > tbody > tr > td.price span.price input, table.products-list > tbody > tr > td.price2 span.price input, table.products-list > tbody > tr > td.price3 span.price input, table.products-list > tbody > tr > td.price span.price_old input, table.products-list > tbody > tr > td.price2 span.price_old input, table.products-list > tbody > tr > td.price3 span.price_old input{
      color: var(--text);
  }

  .s3-selector .selector-title{
      color: var(--text);
  }

  .selectors{
      border-radius: 5px;
  }

  .s3-selector .selector-title, .s3-selector .selector-checkbox{
      border: none;
      background: var(--bg3);
      height: 28px;
      transition: .2s;
  }

  .s3-selector .selector-checkbox:hover, .s3-selector .selector-title:hover{
      background: var(--bg2h);
      transition: .2s;
  }

  .s3-selector .selector-checkbox.show{
      background: var(--bg3h);
      transition: .2s;
  }

  .s3-selector .selector-checkbox{
      padding: 0 1px 0 5px;
  }

  .s3-selector .selector-checkbox .s3-cb{
      padding-top: 6px;
  }

  .shop2-wrapper .shop2-products-wrapper .shop2-pagination-wrap .group-operation-wrapper .s3-select.white + .chzn-container a.chzn-single, .shop2-wrapper .shop2-orders-wrapper .shop2-pagination-wrap .group-operation-wrapper .s3-select.white + .chzn-container a.chzn-single, .inner_notice-pagination-wrap .group-operation-wrapper .s3-select.white + .chzn-container a.chzn-single{
      border: none !important;
      background: var(--bg3) !important;
      color: var(--text2) !important;
      height: 28px !important;
      transition: .2s;
  }

  .shop2-wrapper .shop2-products-wrapper .shop2-pagination-wrap .group-operation-wrapper .s3-select.white + .chzn-container a.chzn-single:hover, .shop2-wrapper .shop2-orders-wrapper .shop2-pagination-wrap .group-operation-wrapper .s3-select.white + .chzn-container a.chzn-single:hover, .shop2-wrapper .shop2-products-wrapper .shop2-pagination-wrap .group-operation-wrapper .s3-image .group-operation-wrapper .s3-select.white + .chzn-container a.chzn-single:hover, .shop2-wrapper .shop2-orders-wrapper .shop2-pagination-wrap .group-operation-wrapper .s3-image .group-operation-wrapper .s3-select.white + .chzn-container a.chzn-single:hover{
      border: none !important;
      background: var(--bg2h) !important;
      color: var(--text2) !important;
      transition: .2s;
  }

  .s3-select.white + .chzn-container.chzn-with-drop .chzn-drop{
      background: var(--bg2) !important;
  }

  .shop2-wrapper .s3-action-select .s3-select.white + .chzn-container .chzn-drop .chzn-results, .shop2-wrapper .s3-action-select .s3-select.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-results, .shop2-wrapper .s3-action-select .s3-select.white + .chzn-container.chzn-container-active .chzn-drop .chzn-results{
      padding: 8px 0 !important;
      margin: 0 !important;
  }

  .s3-select.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-results li, .context-menu ul li span.name{
      color: var(--text2) !important;
      transition: .2s;
  }

  .shop2-wrapper .s3-action-select .s3-select.white + .chzn-container .chzn-drop .chzn-results .result-selected, .shop2-wrapper .s3-action-select .s3-select.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-results .result-selected, .shop2-wrapper .s3-action-select .s3-select.white + .chzn-container.chzn-container-active .chzn-drop .chzn-results .result-selected, .s3-select.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-results li.highlighted, .s3-select.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-results li.result-selected, .shop2-wrapper .s3-action-select .s3-select.white + .chzn-container .chzn-drop .chzn-results .group-option:hover, .shop2-wrapper .s3-action-select .s3-select.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-results .group-option:hover, .shop2-wrapper .s3-action-select .s3-select.white + .chzn-container.chzn-container-active .chzn-drop .chzn-results .group-option:hover, .context-menu ul li:hover, .context-menu ul li.active, .s3-sort-v2 > span.sort-btn-select.context-button-active, .s3-action-select .s3-select.white + .chzn-container .chzn-drop .chzn-results .group-option:hover, .s3-action-select .s3-select.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-results .group-option:hover, .s3-action-select .s3-select.white + .chzn-container.chzn-container-active .chzn-drop .chzn-results .group-option:hover{
      background: var(--select) !important;
      transition: .2s;
  }

  .shop2-wrapper .s3-action-select .s3-select.white + .chzn-container .chzn-drop .chzn-results .group-result > span, .shop2-wrapper .s3-action-select .s3-select.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-results .group-result > span, .shop2-wrapper .s3-action-select .s3-select.white + .chzn-container.chzn-container-active .chzn-drop .chzn-results .group-result > span{
      background: var(--bg2);
      color: var(--text);
  }

  .context-menu{
      background: var(--bg2h);
      transition: .2s;
  }

  .s3-sort-v2 > span.sort-btn-select{
      background: var(--bg3);
      border: none;
      height: 28px;
      position: relative;
      padding: 0 25px 0 30px;
  }

  .s3-sort-v2 .context-menu ul li{
      transition: .2s;
  }

  .s3-sort-v2 .context-menu ul li:hover .s3-sort-ico{
      border-color: var(--linkh);
      transition: .2s;
  }

  .s3-sort-v2 .context-menu ul li:hover .s3-sort-ico .s3-ico{
      filter: hue-rotate(250deg) saturate(2);
  }

  .s3-sort-v2 > span.sort-btn-select:after{
      position: absolute;
      content: url(/my/s3/images/svg_icons/ic_ar-updown.svg);
      right: 9px;
      top: 2px;
  }


  .s3-per-page-controller{
      border: none;
      height: 28px;
  }

  .s3-per-page-controller .s3-input-text, .s3-per-page-controller .s3-btn{
      height: 28px;   
      border-radius: 0;
      background: var(--bg3);
      color: var(--text);
      transition: .2s;
  }

  input.s3-input-text:focus{
      background: var(--bg2h); 
      transition: .2s;   
  }

  .shop2-wrapper .shop2-products-wrapper .shop2-pagination-wrap .shop2-product-list-view-params .context-menu, .shop2-wrapper .shop2-orders-wrapper .shop2-pagination-wrap .shop2-product-list-view-params .context-menu{
      margin: 0;
      padding: 0 0 15px;
      border-radius: 10px;
  }

  .shop2-wrapper .shop2-products-wrapper .shop2-pagination-wrap .shop2-product-list-view-params .context-menu form label, .shop2-wrapper .shop2-orders-wrapper .shop2-pagination-wrap .shop2-product-list-view-params .context-menu form label{
      color: var(--text);    
  }

  .shop2-wrapper .shop2-products-wrapper .shop2-pagination-wrap .shop2-product-list-view-params .context-menu form > div:last-child{
      margin-top: 15px !important;
  }

  .shop2-wrapper .shop2-products-wrapper .shop2-pagination-wrap .shop2-product-list-view-params .grey-flat, .shop2-wrapper .shop2-orders-wrapper .shop2-pagination-wrap .shop2-product-list-view-params .grey-flat{
      background: var(--bg3);
      border: none;
      height: 28px;
  }

  .shop2-wrapper .shop2-products-wrapper .shop2-pagination-wrap .shop2-product-list-view-params .grey-flat:hover, .shop2-wrapper .shop2-orders-wrapper .shop2-pagination-wrap .shop2-product-list-view-params .grey-flat:hover{
      background: var(--bg2h);  
      transition: .2s; 
  }

  .mg-btn.white--green:hover{
      background: var(--linkh);
      transition: .2s;
  }

  .mg-radio__tabs{
      box-shadow: none;
  }

  .mg-radio__tabs label{
      background: var(--bg3);
  }

  .s3-rb:not(.switcher):not(.s3-rb--radio).active, .s3-label-static-rb.active{
      background: var(--linkh);
      color: var(--text);
  }

  .s3-rb:not(.switcher).active:not(.s3-rb--radio) .s3-ico, .s3-rb .s3-ico{
      filter: invert(1) saturate(1.5);
  }


  .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in.popup .actions-panel-wrapper .s3-radio-tabs.medium{
      filter: none;
      background: transparent;
  }

  .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in.popup .actions-panel-wrapper .s3-radio-tabs.medium .s3-rb, .s3-rb:not(.switcher):not(.s3-rb--radio), .s3-label-static-rb{
      background: var(--bg3);
  }

  .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in.popup .actions-panel-wrapper .s3-radio-tabs.medium .s3-rb:hover, .s3-rb:not(.switcher):not(.s3-rb--radio):hover, .s3-label-static-rb:hover{
      background: var(--select);
      transition: .2s;
  }

  .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in.popup .actions-panel-wrapper .s3-radio-tabs.medium .s3-rb.active, .s3-rb:not(.switcher):not(.s3-rb--radio).active, .s3-label-static-rb.active{
      background: var(--link);
      transition: .2s;
  }

  .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in.popup .actions-panel-wrapper .s3-radio-tabs.medium .s3-rb + .s3-rb,.s3-rb:not(.switcher):not(.s3-rb--radio) + .s3-rb,.s3-rb:not(.switcher):not(.s3-rb--radio){
      border-color: var(--linkh);
      transition: .2s;
  }

  .s3-pagelist-wrapper.mg-pagelist.top span.page-nums, .mg-pagelist.top span.page-nums{
      color: var(--text);
  }

  .s3-pagelist-wrapper.mg-pagelist .mg-pagelist__group, .mg-pagelist .mg-pagelist__group, .s3-pagelist-wrapper.mg-pagelist .mg-pagelist__item, .mg-pagelist .mg-pagelist__item, .s3-pagelist-wrapper.mg-pagelist.top, .mg-pagelist.top{
      height: 28px !important;
      transition: .2s;
  }

  .s3-pagelist-wrapper.mg-pagelist .mg-pagelist__item, .mg-pagelist .mg-pagelist__item{
      width: 28px;
      border: none;
      background: var(--bg3);
      transition: .2s;
  }

  .s3-pagelist-wrapper.mg-pagelist .mg-pagelist__item.disabled, .mg-pagelist .mg-pagelist__item.disabled{
      background: var(--bg2h) !important;
      transition: .2s;
  }

  .s3-pagelist-wrapper.mg-pagelist .mg-pagelist__item.disabled > span, .mg-pagelist .mg-pagelist__item.disabled > span{
      opacity: 0.2 !important;
  }

  .s3-pagelist-wrapper.mg-pagelist .mg-pagelist__item:hover, .mg-pagelist .mg-pagelist__item:hover, .s3-pagelist-wrapper.mg-pagelist .mg-pagelist__item.active, .mg-pagelist .mg-pagelist__item.active{
      background: var(--select);
      transition: .2s;
  }

  .s3-pagelist-wrapper.mg-pagelist .mg-pagelist__item span, .mg-pagelist .mg-pagelist__item span{
      filter: invert(1);
  }

  div.s3-actions-panel form.search-form input.search-text{
      background: var(--bg);
      color: var(--text3);
      border: none;
      border-radius: 4px 0 0 4px;
      transition: .2s;
  }

  div.s3-actions-panel form.search-form input.search-text:hover{
      background: var(--bgh);
      transition: .2s;
  }

  div.s3-actions-panel form.search-form input.search-text:focus{
      background: var(--link3d);
      transition: .2s;
  }

  .shop2-wrapper .s3-actions-panel-wrap .search-form span.s3-btn.filter{
      padding: 0 4px;
      margin-top: -1px;
  }

  .shop2-wrapper .s3-actions-panel-wrap .search-form span.s3-btn.filter .s3-ico{
      filter: invert(1);
      margin-top: -1px;
      margin-bottom: 2px;
  }

  div.s3-actions-panel form.search-form .search-butt{
      background: var(--link3);
      transition: .2s;    
  	height: auto;
  }

  div.s3-actions-panel form.search-form .search-butt:hover{
      background: var(--link3h);
      transition: .2s;    
  }

  /* shop menu */

  .shop2-menu{
      display: flex;
      border: none;
  }

  .shop2-menu .shop2-menu-button.tab-item[data-access="shop2.view"]{
      border-radius: 4px 0 0 4px;
  }

  .shop2-menu .shop2-menu-button.tab-item[data-access="shop2_order"]{
      border-radius: 0 4px 4px 0;
      border-left: 1px var(--link) solid;
  }


  .shop2-menu .shop2-menu-button.tab-item{
      background: var(--bg2);
      border-radius: 4px;
      border: none;
      color: var(--text3);
      transition: .2s;
  }

  .shop2-menu .shop2-menu-button.tab-item:hover{
      background: var(--select);
      transition: .2s;
  }

  .shop2-menu .shop2-menu-button.tab-item.current-tab{
      background: var(--linkh);
      border: none;
      transition: .2s;
  }

  .shop2-menu .shop2-menu-button.tab-item span.name{
      color: var(--text);
  }

  .shop2-menu .shop2-menu-button span.btn-ico{
      filter: invert(1);
  }

  .shop2-menu .shop2-menu-button.without-border:not(.double), .shop2-menu .shop2-menu-button.tasks, .shop2-menu .shop2-menu-button[data-access="shop2.settings"]{
      height: auto;
      transition: .2s;
      padding: 12px 16px;
      border: none;
      margin: 0;
  }

  .shop2-menu .shop2-menu-button.without-border:not(.double):hover, .shop2-menu .shop2-menu-button.tasks:hover, .shop2-menu .shop2-menu-button[data-access="shop2.settings"]:hover{
      background: var(--select);
      border-radius: 4px;
      padding: 7px 8px;
      margin: 5px 8px;
      border: none;
      transition: .2s;
  }

  .shop2-menu .shop2-menu-button span.name{
      color: var(--link3);
      transition: .2s;
  }

  .shop2-menu .shop2-menu-button.without-border:not(.double):hover span, .shop2-menu .shop2-menu-button.tasks:hover span, .shop2-menu .shop2-menu-button[data-access="shop2.settings"]:hover span{
      color: var(--link);
      transition: .2s;
  }

  .shop2-menu .shop2-menu-button.double.without-border{
      display: flex;
      flex-direction: column;
      width: auto;
  }

  .shop2-menu .shop2-menu-button.double.without-border span.item{
      padding: 7px 13px;
      margin: 0 0;
      transition: .2s;
  }


  .shop2-menu .shop2-menu-button.double.without-border span.item:hover{
      padding: 5px 8px;
      margin: 2px 5px;
      background: var(--select);
      border-radius: 4px;
      transition: .2s;
  }

  .shop2-menu .shop2-menu-button.double span.item:hover span.name{
      color: var(--link);
      
  }

  .wrap-tasks{
      border-left: 1px var(--bg3) solid;
      border-right: 1px var(--bg3) solid;
  }

  .products-list td.product-name span.shop2-product-name{
      transition: .2s;
  }

  .products-list td.product-name span.shop2-product-name:hover{
      color: var(--link) !important;
      transition: .2s;
  }

  /* shop card */

  .bluepopup-wrapper, div.s3-popup{
      border-radius: 20px;
  }

  .bluepopup-wrapper>table td.controls{
      border-radius: 0 20px 0 0 !important;
  }

  .bluepopup-wrapper>table td.draggable_title{
      border-radius: 20px 0 0 0 !important;
  }


  .bluepopup-wrapper, div.s3-popup.s3-event_popup .popup-body.content, div.s3-popup{
      background: var(--bg2);
  }

  .controls, .draggable_title, div.s3-popup.s3-event_popup .popup-header, .bluepopup-wrapper.with-tabs > table > tbody td.content ul.tabs-header, .delivery-wrapper .bluepopup-wrapper > table > tbody td.content ul.tabs-header{
      background: var(--bg2h) !important;
  	gap: 5px !important;
  }


  .bluepopup-wrapper.with-tabs > table > tbody td.content ul.tabs-header{
      position: sticky;
      top: 0px;
  	padding: 15px 30px !important;
      z-index: 100;
  }

  .form-item-title, .folder-select-title, div.s3-popup.s3-event_popup .popup-header .popup-title, div.s3-popup.s3-event_popup .email-list-wrap .email_add_list_title, .bluepopup-wrapper.with-tabs > table > tbody td.draggable_title span.title, .delivery-wrapper .bluepopup-wrapper > table > tbody td.draggable_title span.title, .comment_tabs li span{
      color: var(--text) !important;
  }

  .bluepopup-wrapper>table td.content{
      color: var(--text2);
  }

  .s3-cb:not(.switcher), .s3-label-static-cb{
      color: var(--text3);
  }

  .bluepopup-wrapper input.s3-input-text{
      background: var(--bg);
      color: var(--text);
      border: none;
      box-shadow: none !important;
      transition: .2s;
  }

  .bluepopup-wrapper input.s3-input-text:hover{
      background: var(--bgh);
      transition: .2s;
  }

  .bluepopup-wrapper input.s3-input-text:focus{
      background: var(--select);
      transition: .2s;
  }

  input.s3-input-text:disabled{
      background: var(--bg3) !important;
      color: var(--bg2) !important;
      cursor: not-allowed;
      opacity: 0.3;
  }

  .s3-select.white + .chzn-container a.chzn-single{
      background: var(--bg) !important;
      color: var(--text) !important;
      border: none !important;
      box-shadow: none !important;
      transition: .2s;
  }


  .s3-select.white + .chzn-container a.chzn-single:hover{
      background: var(--bgh) !important;
      transition: .2s;
  }

  body .s3-select + .chzn-container.chzn-container-single.chzn-container-active a.chzn-single {
      background: var(--select) !important;
      box-shadow: none !important;
      border: none !important;
      border-color: #fbb017 !important;
  }

  .s3-complex-container, .folder-content-control .folder-content-bg, .email-list-control-bg, .telegram-list-control-bg, .phone-list-control-bg{
      background: var(--bg);
  }

  .folder-content-control .folder-content-bg, .email-list-control-bg, .telegram-list-control-bg, .phone-list-control-bg{
      padding: 6px;
  }

  ul.email-list-control li, ul.telegram-list-control li, ul.phone-list-control li{
      background: var(--select);
      color: var(--text3);
      padding: 3px 10px;
  }

  div.s3-popup.s3-event_popup .email-list-wrap .email-list_wrapper, div.s3-popup.s3-event_popup .phone-list-wrap .phone-list_wrapper, .s3-popup .popup-body.content .telegram-list-wrap .telegram-list_wrapper{
      background: var(--bg);
      padding: 12px;
  }

  div.s3-popup.s3-event_popup .email-list-wrap .email-list_wrapper .email-list tr td.checkbox .in_td, div.s3-popup.s3-event_popup .email-list-wrap .email-list_wrapper .email-list tr td.email-address .in_td, div.s3-popup.s3-event_popup .email-list-wrap .email-list_wrapper .email-list tr td.name label .text_name, div.s3-popup.s3-event_popup .phone-list-wrap .phone-list_wrapper .phone-list tr td.checkbox .in_td, div.s3-popup.s3-event_popup .phone-list-wrap .phone-list_wrapper .phone-list tr td.phone-number .in_td, .email-list .email-address label, .telegram-list .telegram-number label, .phone-list .phone-number label, .s3-popup .popup-body.content .telegram-list-wrap .telegram-list_wrapper .telegram-list tr td.checkbox .in_td, .s3-popup .popup-body.content .telegram-list-wrap .telegram-list_wrapper .telegram-list tr td.telegram-number .in_td, .s3-popup .popup-body.content .telegram-list-wrap .telegram-list_wrapper .telegram-list tr td.telegram-number .in_td span label, .s3-popup .popup-body.content .telegram-list-wrap .telegram-list_wrapper .telegram-list tr td.name label .text_name, div.s3-popup.s3-event_popup .email-list-wrap .email-list_wrapper .email-list tr td.radio .in_td{
      background: var(--bg2);
      color: var(--text);
  }

  div.s3-popup.s3-event_popup .email-add-form input.s3-input-text{
      background: var(--bg2);
  }

  div.s3-popup.s3-event_popup .email-list-wrap .email-list_wrapper .email-list tr td.delete .objectRemove.s3-ico, div.s3-popup.s3-event_popup .phone-list-wrap .phone-list_wrapper .phone-list tr td.delete .objectRemove.s3-ico, .s3-popup .popup-body.content .telegram-list-wrap .telegram-list_wrapper .telegram-list tr td.delete .objectRemove.s3-ico{
      position: relative;
      background-color: var(--bg2);
      color: var(--text);
      transition: .2s;
  }

  div.s3-popup.s3-event_popup .email-list-wrap .email-list_wrapper .email-list tr td.delete .objectRemove.s3-ico:hover, div.s3-popup.s3-event_popup .phone-list-wrap .phone-list_wrapper .phone-list tr td.delete .objectRemove.s3-ico:hover, .s3-popup .popup-body.content .telegram-list-wrap .telegram-list_wrapper .telegram-list tr td.delete .objectRemove.s3-ico:hover{
      background-color: var(--link4h);
      transition: .2s;
  }

  div.s3-popup.s3-event_popup .email-list-wrap .email-list_wrapper .email-list tr td.email-address .in_td span label, div.s3-popup.s3-event_popup .phone-list-wrap .phone_add_list_title{
      color: var(--text);
  }

  div.s3-popup.s3-event_popup .email-list-wrap .email-list_wrapper .email-list tr td.checkbox .in_td, div.s3-popup.s3-event_popup .phone-list-wrap .phone-list_wrapper .phone-list tr td.checkbox .in_td, .s3-popup .popup-body.content .telegram-list-wrap .telegram-list_wrapper .telegram-list tr td.checkbox .in_td, div.s3-popup.s3-event_popup .email-list-wrap .email-list_wrapper .email-list tr td.radio .in_td{
      border-radius: 4px 0 0 4px;    
  }

  div.s3-popup.s3-event_popup .email-list-wrap .email-list_wrapper .email-list tr td.delete .objectRemove.s3-ico:after, div.s3-popup.s3-event_popup .phone-list-wrap .phone-list_wrapper .phone-list tr td.delete .objectRemove.s3-ico:after, .s3-popup .popup-body.content .telegram-list-wrap .telegram-list_wrapper .telegram-list tr td.delete .objectRemove.s3-ico:after{
      content: url("/my/s3/images/svg_icons/oah-trash_de.svg");
      position: absolute;
      width: auto;
      height: auto;
      left: 8px;
      top: 8px;
      filter: invert(1);
  }

  div.s3-popup.s3-event_popup .email-list-wrap .email-list_wrapper .email-list tr td.name label input.s3-input-text, div.s3-popup.s3-event_popup .email-add-form input.s3-input-text:focus{
      background: var(--select);
      color: var(--text);
      border-color: var(--linkd);
  }


  .shop2-event-edit .s3-complex-container-item .details .email-list-control-bg .email-list-control li, .shop2-event-edit .s3-complex-container-item .details .phone-list-control-bg .email-list-control li, .shop2-event-edit .s3-complex-container-item .details .email-list-control-bg .phone-list-control li, .shop2-event-edit .s3-complex-container-item .details .phone-list-control-bg .phone-list-control li{
  	background: var(--link3h);
  	color: var(--text);
  	border: none;
  	height: 100%;
  }

  .telegram-add-note, div.s3-popup.s3-event_popup .email-add-note, div.s3-popup.s3-event_popup .phone-add-note{
  	background: var(--link2d);
  	color: var(--text2);
  }

  .s3-popup .popup-body.content .telegram-add-note-id, .telegram_add_list_title{
  	color: var(--text);
  }

  tr.s3_sortable_placeholder{
      background: var(--bg3) !important;
      border-color: var(--bg3h) !important;
  }

  div.s3-popup.s3-event_popup .email-add-form{
      background: var(--bg);
      padding: 0 12px 12px;
  }

  .folder-content-control .folder-content-bg .folders-list-wrapper{
      margin-bottom: 3px;
  }

  .folder-content-control .folder-content-bg .folders-list-wrapper ul.folders-list li{
      overflow: hidden;
  }

  .folder-content-control .folder-content-bg .folders-list-wrapper ul.folders-list li, .folder-content-control .folder-content-bg .folders-list-wrapper .folders-list li span.mark, .folder-content-control .folder-content-bg .folders-list-wrapper ul.folders-list li span.remove, .folder-content-control .folder-content-bg .folders-list-wrapper ul.folders-list li span.mark{
      background: var(--bg2);
      transition: .2s;
  }

  .folder-content-control .folder-content-bg .folders-list-wrapper .folders-list li span.mark:hover .s3-ico.i-ol-check{
      transition: .2s;
  }

  .folder-content-control .folder-content-bg .folders-list-wrapper ul.folders-list li .title .name{
      color: var(--text2);    
  }

  .folder-content-control .folder-content-bg .folders-list-wrapper ul.folders-list li span.remove .s3-ico.i-delete-svg, .folder-content-control .folder-content-bg .folders-list-wrapper ul.folders-list li span.remove .s3-ico:hover, .folder-content-control .folder-content-bg .folders-list-wrapper ul.folders-list li span.mark .s3-ico:hover, .folder-content-control .folder-content-bg .folders-list-wrapper .folders-list li span.mark .s3-ico.i-ol-check{
      background-color: transparent !important;
      transition: .2s;
  }


  .folder-content-control .folder-content-bg .folders-list-wrapper .folders-list li span.mark:hover{
      background-color: var(--select);
      transition: .2s;
  }

  .folder-content-control .folder-content-bg .folders-list-wrapper ul.folders-list li span.remove:hover{
      background-color: var(--select4);
      transition: .2s;
      
  }

  .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in.popup .actions-panel-wrapper, .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in.popup .actions-panel-wrapper:after, .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in.popup .actions-panel-wrapper:before{
      background: var(--bg2h);
  }

  .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in.popup .actions-panel-wrapper .folders-search .search-results{
      background: var(--bg3);
  }

  .folders-search .search-results .folders-search-found span.reset, #tree_search_result_div .folders-search-found span.reset{
      color: var(--link);
  }

  .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in.popup .s3-note, .s3-new-note {
      background: var(--link2d);
      border: 1px solid var(--link2h);
      color: var(--text);
  }

  .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in.popup .actions-panel-wrapper .folders-search .search-inputs-wrap .search-form label, .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in.popup .actions-panel-wrapper .folders-search .search-inputs-wrap .search-form label input.search-text{
      background: var(--bg3);
      color: var(--text);
  }

  .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in.popup .actions-panel-wrapper .folders-search{
      border-radius: 4px;
      background: var(--bg3);
      overflow: hidden;
  }

  .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in.popup .actions-panel-wrapper .folders-search .search-inputs-wrap .search-form label .search-butt{
      background-color: var(--text4);
      filter: invert(1);
      border-radius: 0;
  }


  .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in.popup .actions-panel-wrapper .folders-search .search-results:empty{
      background: transparent;
      height: 0;
      padding: 0;
      margin: 0;
      transition: .2s;
  }

  .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in.popup .actions-panel-wrapper .folders-search .search-results{
      width: 276px;
      position: relative;
      transition: .2s;
  }

  .s3-image-control-wrap{
      background: var(--bg);
      border-color: var(--bg);
  }

  .s3-image-control-wrap:before{
      background: var(--bg2h);
  }

  .s3-image-control-wrap > span{
  	border-color: var(--bg3h) !important;
  }

  .image-edit-wrap .upload-title span{
      background: var(--bg2);
      color: var(--link);
  }

  .image-edit-wrap .image-info td.image-preview-td{
      background: var(--bg);
      border-radius: 8px;
  }

  .image-edit-wrap .upload-title:after{
      background: var(--text4);
  }

  .image-edit-wrap .image-info td.image-info-td .image-name td span{
      display: contents;
  }

  .image-edit-wrap .image-info td.image-info-td .image-name input{
      margin-left: 10px;
  }

  .image-edit-wrap .image-info td.image-info-td .params td{
      border-color: var(--text4);
  }

  .image-edit-wrap .image-info td.image-info-td .params td span{
      color: var(--text3);
  }

  .image-edit-wrap .image-info td.image-info-td .params td a{
      color: var(--link);
  }

  .s3-file .file-text{
      color: var(--text2);
  }

  .table-min th{
      color: var(--text2);
  }

  ul.tabs-header{
      border-color: var(--linkh);
      width: auto !important;
  	gap: 5px;
      display: flex !important;
      flex-direction: row;
      align-content: flex-end;
      align-items: flex-end;
      position: relative;
  	padding: 15px 0px !important;
  }

  .bluepopup-wrapper.with-tabs > table > tbody td.draggable_title, .delivery-wrapper .bluepopup-wrapper > table > tbody td.draggable_title, .bluepopup-wrapper.with-tabs > table > tbody td.controls, .delivery-wrapper .bluepopup-wrapper > table > tbody td.controls{
  	padding-bottom: 18px;
  }

  .bluepopup-wrapper.with-tabs > table > tbody td.content ul.tabs-header li,.bluepopup-wrapper.with-tabs > table > tbody td.content ul.tabs-header li:hover, .bluepopup-wrapper.with-tabs > table > tbody td.content .tabs__submenu > li.tabs-submenu-item a.tab-handle, .delivery-wrapper .bluepopup-wrapper > table > tbody td.content .tabs__submenu > li.tabs-submenu-item a.tab-handle{
      background: var(--bg3);
      color: var(--text2);
      border: none !important;
  	border-radius: 5px !important;
  	padding: 0;
      transition: .2s;
  	overflow: hidden;
  }


  .bluepopup-wrapper.with-tabs > table > tbody td.content ul.tabs-header li:hover{
  	   background: var(--select);
  }

  .bluepopup-wrapper.with-tabs > table > tbody td.content ul.tabs-header li.tabs__more-button{
  	padding: 0 4px 0 10px;
  }

  .bluepopup-wrapper.with-tabs > table > tbody td.content ul.tabs-header li a, .delivery-wrapper .bluepopup-wrapper > table > tbody td.content ul.tabs-header li a{
      background: var(--bg3);
      color: var(--text2);
      border: none !important;
      transition: .2s !important;
  	padding-left: 12px !important;
  	padding-right: 12px !important;
  }

  .bluepopup-wrapper.with-tabs > table > tbody td.content ul.tabs-header li:hover a, .delivery-wrapper .bluepopup-wrapper > table > tbody td.content ul.tabs-header li:hover a{
      color: var(--text2);
      border: none !important;
      transition: .2s !important;
  }

  .bluepopup-wrapper.with-tabs > table > tbody td.content ul.tabs-header li:hover, .delivery-wrapper .bluepopup-wrapper > table > tbody td.content ul.tabs-header li:hover{
      transition: .2s !important;
  }

  .bluepopup-wrapper.with-tabs > table > tbody td.content ul.tabs-header li a.tab-handle, .delivery-wrapper .bluepopup-wrapper > table > tbody td.content ul.tabs-header li a.tab-handle{
  	border: none !important;
  	margin: 0;
  	overflow: hidden !important;
  }

  .bluepopup-wrapper.with-tabs > table > tbody td.content ul.tabs-header li a.tab-handle.active, .delivery-wrapper .bluepopup-wrapper > table > tbody td.content ul.tabs-header li a.tab-handle.active{
  	color: var(--text);
  }

  .tabs-header li:has(a.active), .s3-new-tabs ul.tabs-header li span.tab-handle.active{
      background: var(--linkh) !important;
      color: var(--text) !important;
      font-weight: 700;
  	border-radius: 5px;
      transition: .2s;
  }

  .bluepopup-wrapper>table td.content .tabs .tabs-header li a.tab-handle[style="border-color: rgb(233, 108, 95); color: rgb(233, 108, 95);"]{
      background: var(--link4d);
      color: var(--link4) !important;
  }

  .bluepopup-wrapper>table td.content .tabs .tabs-header li a.tab-handle.active[style="border-color: rgb(233, 108, 95); color: rgb(233, 108, 95);"], .bluepopup-wrapper>table td.content .tabs .tabs-header li a.tab-handle[style="border-color: rgb(233, 108, 95); color: rgb(233, 108, 95);"]:hover, .bluepopup-wrapper>table td.content .tabs .tabs-header li a.tab-handle.active{
      background: var(--link4h);
      color: var(--text) !important;
  }


  .product-flag-label > b{
      display: inline !important;
  }

  /* SEO */

  .seo-url-input, .s3-input-textarea-v2{
      background: var(--bg);
      border: none;
      transition: .2s;
  }

  input.s3-input-text-v2, .s3-input-textarea-v2{
      color: var(--text) !important;
      transition: .2s;
  }

  .seo-url-input:focus-within, .s3-input-textarea-v2:focus{
      background: var(--select);
      box-shadow: none;
      transition: .2s;
  }

  .shop2-wrapper .shop2-products-wrapper .shop2-pagination-wrap .shop2-product-list-view-params .context-menu{
      left: -212px !important;
  }

  .shop2-wrapper .shop2-products-wrapper .shop2-pagination-wrap .group-operation-wrapper > span.action, .shop2-wrapper .shop2-orders-wrapper .shop2-pagination-wrap .group-operation-wrapper > span.action{
      height: auto !important;
  }

  .fixed-table td{
      height: 18px !important;
  }

  .shop2-menu .shop2-menu-button span.count span{
      color: var(--text) !important;
      font-weight: 600;
  }

  body .s3-select.v2.white + .chzn-container a.chzn-single, .s3-action-select .s3-select.v2.white + .chzn-container a.chzn-single, .page-edit__form-row .page-edit__form-label .page-view-btn{
      background: var(--bg) !important;
      color: var(--text) !important;
      border-color: var(--bg) !important;
  }

  body .s3-select.v2.white + .chzn-container a.chzn-single > div b, .s3-action-select .s3-select.v2.white + .chzn-container a.chzn-single > div b, .page-edit__form-row .page-edit__form-label .page-view-btn:after{
      filter: invert(1);
  }

  body .s3-select.v2.white + .chzn-container.chzn-with-drop a.chzn-single, .s3-action-select .s3-select.v2.white + .chzn-container.chzn-with-drop a.chzn-single, body .s3-select.v2.white + .chzn-container.chzn-container-active a.chzn-single, .s3-action-select .s3-select.v2.white + .chzn-container.chzn-container-active a.chzn-single{
      background: var(--select) !important;
      box-shadow: none !important;
  }

  body .s3-select.v2.white + .chzn-container.chzn-with-drop .chzn-drop, .s3-action-select .s3-select.v2.white + .chzn-container.chzn-with-drop .chzn-drop{
      background: var(--bg2h) !important;
      color: var(--text2) !important;
  }

  body .s3-select.v2.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-results li, .s3-action-select .s3-select.v2.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-results li{
      color: var(--text2) !important;
  }

  body .s3-select.v2.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-results li.result-selected, .s3-action-select .s3-select.v2.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-results li.result-selected, body .s3-select.v2.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-results li:hover, .s3-action-select .s3-select.v2.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-results li:hover{
      background: var(--select) !important;
  }

  .import-src-choose .fields-group .check-all-in-group{
      background: var(--bg);
      color: var(--text);
  }

  .import-src-choose .fields-group .check-all-in-group.active{
      background: var(--select);
      color: var(--text);
  }

  .s3-cb.half-active .ico{
      background-image: url(/my/s3/images/redesign/s3-icons.png) !important;
      background-color: var(--bg2) !important;
      border-color: var(--bg2) !important;
  }

  .import-src-choose .fields-group .check-all-in-group span.ico{
      border-color: var(--bg2);
      background: var(--bg2);
  }

  .import-src-choose .fields-group .check-all-in-group span.text, .import-src-choose .fields-group .check-all-in-group.active span.text{
      color: var(--link);
      border: none;
  }

  .import-src-choose .fields-group .fields-group-title{
      color: var(--text2);
  }

  .s3-cb-required-v2, .s3-cb-required{
      color: var(--text);
  }

  .s3-cb-required .ico:before{
      border: none !important;
  }

  .s3-cb-required-v2 span.ico, .s3-cb-required span.ico{
      background: var(--bg3);
      border-color: var(--bg3);
  }

  .wrap-tasks .cron-tasks-list{
      background: var(--bgh);
      border: none;
      border-radius: 10px;
      box-shadow: 0 2px 15px 2px #020b0073;
  }

  .cron-list-wrap .cron-list table tr td div.cron-item, .cron-list-wrap .cron-list table tr td div.cron-item .controls{
      background: var(--bg2h) !important;
      border: none;
  }

  .s3-underline, .cron-list-wrap .cron-list table tr td div.cron-item div.info .cron-link a{
      color: var(--link);
  }

  .shop2-search-full-wrapper .shop2-search-full table td.content .shop2-product-search-form-group .shop2-product-search-form-cell, .shop2-category-filter-fields .shop2-search-full table td.content .shop2-product-search-form-group .shop2-product-search-form-cell, .shop2-search-full-wrapper .shop2-search-full table td.content .filter-field .shop2-product-search-form-cell, .shop2-category-filter-fields .shop2-search-full table td.content .filter-field .shop2-product-search-form-cell, .shop2-search-full-wrapper .shop2-search-full table td.content .shop2-product-search-form-group.global-fields .shop2-product-search-form-col .shop2-product-search-form-cell.label > span, .shop2-category-filter-fields .shop2-search-full table td.content .shop2-product-search-form-group.global-fields .shop2-product-search-form-col .shop2-product-search-form-cell.label > span, .shop2-search-full-wrapper .shop2-search-full table td.content .filter-field.global-fields .shop2-product-search-form-col .shop2-product-search-form-cell.label > span, .shop2-category-filter-fields .shop2-search-full table td.content .filter-field.global-fields .shop2-product-search-form-col .shop2-product-search-form-cell.label > span{
      color: var(--text2);
  }
  .shop2-search-full-wrapper .shop2-search-full table td.popup-title, .shop2-category-filter-fields .shop2-search-full table td.popup-title, .shop2-search-full-wrapper .shop2-search-full table td.draggable_title, .shop2-category-filter-fields .shop2-search-full table td.draggable_title{
      color: var(--text);
      font-weight: 700;
  }

  .shop2-search-full-wrapper .shop2-search-full table td.content .shop2-product-search-form-group .shop2-product-search-form-cell .s3-select.white + .chzn-container a.chzn-single, .shop2-category-filter-fields .shop2-search-full table td.content .shop2-product-search-form-group .shop2-product-search-form-cell .s3-select.white + .chzn-container a.chzn-single, .shop2-search-full-wrapper .shop2-search-full table td.content .filter-field .shop2-product-search-form-cell .s3-select.white + .chzn-container a.chzn-single, .shop2-category-filter-fields .shop2-search-full table td.content .filter-field .shop2-product-search-form-cell .s3-select.white + .chzn-container a.chzn-single{
      background: var(--bg) !important;
      color: var(--text) !important;
      border-color: var(--bg) !important;
  }

  .shop2-search-full-wrapper .shop2-search-full table td.content .shop2-product-search-form-group .shop2-product-search-form-cell .s3-select + .chzn-container.chzn-container-single.chzn-container-active a.chzn-single, .shop2-category-filter-fields .shop2-search-full table td.content .shop2-product-search-form-group .shop2-product-search-form-cell .s3-select + .chzn-container.chzn-container-single.chzn-container-active a.chzn-single, .shop2-search-full-wrapper .shop2-search-full table td.content .filter-field .shop2-product-search-form-cell .s3-select + .chzn-container.chzn-container-single.chzn-container-active a.chzn-single, .shop2-category-filter-fields .shop2-search-full table td.content .filter-field .shop2-product-search-form-cell .s3-select + .chzn-container.chzn-container-single.chzn-container-active a.chzn-single, .shop2-search-full-wrapper .shop2-search-full table td.content .shop2-product-search-form-group.global-fields .list-item-row.opened, .shop2-category-filter-fields .shop2-search-full table td.content .shop2-product-search-form-group.global-fields .list-item-row.opened, .shop2-search-full-wrapper .shop2-search-full table td.content .filter-field.global-fields .list-item-row.opened, .shop2-category-filter-fields .shop2-search-full table td.content .filter-field.global-fields .list-item-row.opened{
      background: var(--select) !important;
      border-color: var(--select) !important;
      box-shadow: none !important;
      transition: .2s;
  }

  .chzn-container{
      width: auto !important;
  }

  .shop2-search-full-wrapper .shop2-search-full table td.content .shop2-product-search-form-group .shop2-product-search-form-cell.group, .shop2-category-filter-fields .shop2-search-full table td.content .shop2-product-search-form-group .shop2-product-search-form-cell.group, .shop2-search-full-wrapper .shop2-search-full table td.content .filter-field .shop2-product-search-form-cell.group, .shop2-category-filter-fields .shop2-search-full table td.content .filter-field .shop2-product-search-form-cell.group{
      background: var(--select2);
  }

  .shop2-search-full-wrapper .shop2-search-full table td.content .shop2-product-search-form-group.global-fields .shop2-product-search-form-col .empty-block, .shop2-category-filter-fields .shop2-search-full table td.content .shop2-product-search-form-group.global-fields .shop2-product-search-form-col .empty-block, .shop2-search-full-wrapper .shop2-search-full table td.content .filter-field.global-fields .shop2-product-search-form-col .empty-block, .shop2-category-filter-fields .shop2-search-full table td.content .filter-field.global-fields .shop2-product-search-form-col .empty-block{
      background: var(--bg);
      color: var(--text2);
  }

  .shop2-search-full-wrapper .shop2-search-full table td.content .shop2-product-search-form-group.global-fields .list-item-row, .shop2-category-filter-fields .shop2-search-full table td.content .shop2-product-search-form-group.global-fields .list-item-row, .shop2-search-full-wrapper .shop2-search-full table td.content .filter-field.global-fields .list-item-row, .shop2-category-filter-fields .shop2-search-full table td.content .filter-field.global-fields .list-item-row{
      background: var(--bg);
      color: var(--text2);  
      transition: .2s;  
  }

  .shop2-search-full-wrapper .shop2-search-full table td.content .shop2-product-search-form-group.global-fields .list-item-row .list-item-cell.label label, .shop2-category-filter-fields .shop2-search-full table td.content .shop2-product-search-form-group.global-fields .list-item-row .list-item-cell.label label, .shop2-search-full-wrapper .shop2-search-full table td.content .filter-field.global-fields .list-item-row .list-item-cell.label label, .shop2-category-filter-fields .shop2-search-full table td.content .filter-field.global-fields .list-item-row .list-item-cell.label label{
      color: var(--text2);
  }

  .shop2-search-full-wrapper .shop2-search-full table td.controls, .shop2-category-filter-fields .shop2-search-full table td.controls{
      padding: 15px 15px 0 0;
  }

  .table-min td, .table-min-v td{
      border-color: var(--bg3);
  }

  .s3-pagelist-wrapper.mg-pagelist, .mg-pagelist{
      padding: 20px 0 0px;
  }

  .bluepopup-wrapper .shop2-suppliers-wrapper, .bluepopup-wrapper .shop2-vendors-wrapper, .bluepopup-wrapper .shop2-tags-wrapper{
      padding-bottom: 0px;
  }

  .boxes.s3-sortable.ui-sortable{
      padding-top: 20px;
  	width: 890px !important;
  }

  .shop2-tags-wrapper{
      display: flex;
      justify-content: space-between;
      align-content: center;
      align-items: center;
  }

  li.box{
      background: var(--bg2h);
      border-color: var(--bg3);
      padding: 5px 10px;
      display: block;
      align-items: center;
      align-content: center;
      justify-content: flex-start;
      flex-direction: row-reverse;
      gap: 10px;
  }


  .objectName, .objectContainer{
      width: 100%;
  }

  .s3-badge-inside-tabs{
      background: var(--bg3h);
      color: var(--text3);
      border-color: var(--bg3h);
      transition: .2s;
  }

  .tab-handle:hover .s3-badge-inside-tabs{
      background: var(--select);
      color: var(--link);
      border-color: var(--select);
      transition: .2s;
  }

  .tab-handle.active .s3-badge-inside-tabs{
      background: var(--linkh);
      color: var(--text2);
      transition: .2s;
  }

  #shop2-collect-search-form-block, #shop2-order-search-form-block{
      background: var(--bg);
      box-shadow: none;
  }

  #shop2-collect-search-form-block .shop2-product-search-form-wrapper .search-inputs-wrap input.search-text, #shop2-order-search-form-block .shop2-product-search-form-wrapper .search-inputs-wrap input.search-text{
      border-color: var(--bg2);
  }

  .search-inputs-wrap .s3-ico.i-filter-svg{
      filter: invert(1);
      height: 30px;
  }

  .collection-block{
      background: var(--bg2h);
      border-color: var(--bg2h);
      border-radius: 10px;
      box-shadow: 0 5px 20px 0 var(--bg);
  }

  .shop2-collect-title-bar .objectRemove{
      background: var(--link4d);
      margin: 5px;
      transition: .2s;
  }

  .shop2-collect-title-bar .objectRemove:hover{
      background: var(--link4h);
      margin: 5px;
      transition: .2s;
  }

  .shop2-collect-tab-block{
      overflow: unset !important;
  }

  .lp-ico.i-delete-svg, .s3-ico.i-delete-svg{
      filter: sepia(100%) saturate(50) hue-rotate(-8deg) invert(0);
  }

  ul.boxes.data-list li.box .remove .s3-ico.i-delete-svg, ul.s3-data-list-new li .col-btn .s3-ico.i-delete-svg{
      filter: none;
  }

  ul.s3-data-list-new li .col-btn .s3-ico.i-delete-svg{
  	background-color: transparent;
  }

  ul.s3-data-list-new li .col-btn .s3-ico.i-delete-svg, ul.s3-data-list-new li .col-btn .s3-ico.i-gourl-svg, ul.s3-data-list-new li .col-btn .s3-ico{
  	filter: invert(1);
  }

  li.disactivated, li.disactivated .item-col.name .title{
  	background: var(--link4d) !important;
  	border-color: var(--link4d) !important;
  	color: var(--link4h) !important;
  }

  ul.s3-data-list-new li:hover {
      background-color: var(--select3);
  }

  .collection-title{
      color: var(--link);
      font-weight: 600;
  }

  .collection-block strong{
      color: var(--text2);
  }

  .collect-items-block{
      background: var(--bg);
  }

  .shop2-collect-remove-item{
      background: var(--select3);
      border-color: var(--select3);
      color: var(--text2);
      transition: .2s;
  }

  .shop2-collect-remove-item:hover{
      background: var(--link3h);
      border-color: var(--link3);
      color: var(--text);
      transition: .2s;
  }

  .shop2-collect-remove-item.delete{
      background: var(--link4h) !important;
      border-color: var(--link4) !important;
      color: var(--text);
      transition: .2s;
      
  }

  .tree-wrapper .s3-tree-wr .context-menu.s3-tree-folders-context ul li .search-wrapper, .tree-wrapper .s3-tree-wr .context-menu.s3-tree-folders-context{
      background: var(--bg2);
  }

  .tree-wrapper .s3-tree-wr .context-menu.s3-tree-folders-context ul li .search-wrapper .folders-search .search-inputs-wrap form.search-form .search-text, .tree-wrapper .s3-tree-wr .context-menu.s3-tree-folders-context ul li .search-wrapper .folders-search .search-inputs-wrap form.search-form{
      background: var(--bg);
      color: var(--text);
  }

  .tree-wrapper .s3-tree-wr .context-menu.s3-tree-folders-context ul li .search-wrapper .folders-search .search-inputs-wrap form.search-form button.s3-btn{
      background: var(--bg3);
  }

  .tree-wrapper .s3-tree-wr .context-menu.s3-tree-folders-context ul li .search-wrapper .folders-search .search-inputs-wrap form.search-form button.s3-btn .s3-ico{
      width: 30px;
      height: 30px;
  }

  .dynatree-menu ul.dynatree-container li .dynatree-node .pageName.context-button-active{
      color: var(--link2);
  }

  .global-params-wrapper .field-set, #shop2-metadata-container .field-set{
      border-radius: 10px;
      border-color: var(--bg);
  }

  .global-params-wrapper .field-set .fieldset-legend > span, #shop2-metadata-container .field-set .fieldset-legend > span{
      background: var(--bg2);
      color: var(--link);
  }

  #shop2-field-container li.box .handle, ul.boxes.data-list.json_sortable li.box .handle, ul.boxes.data-list.shop2-ref-elements li.box .handle, ul.boxes.data-list.shop2-color-ref-elements li.box .handle, ul.boxes.data-list.lp_layout_sortable li.box .handle, ul.boxes.data-list.ui-sortable li.box .handle{
      background-color: transparent;
  }

  ul.boxes.data-list li.box .title .name{
      color: var(--link) !important;
  }

  ul.boxes.data-list li.box .remove .s3-ico.i-delete-svg{
      background-color: var(--text2);
      filter: invert(1);
  }

  .global-params-wrapper #default-value-container label, #shop2-metadata-container #default-value-container label, .global-params-wrapper label, #shop2-metadata-container label{
      color: var(--text);
  }

  .global-params-wrapper .field-set.inner, #shop2-metadata-container .field-set.inner{
      background: var(--bg2h);
      border: none;
  }

  .global-params-wrapper .field-set.inner .fieldset-legend > span:after, #shop2-metadata-container .field-set.inner .fieldset-legend > span:after{
      background: transparent;
  }

  .fieldset-legend{
      position: relative;
      top: 14px;
      border-radius: 10px;
      display: block;
      padding-bottom: 10px;
  }

  .global-params-wrapper .field-set label, #shop2-metadata-container .field-set label{
      color: var(--text3);
  }

  .s3-label-static-rb input ~ span.ico, .s3-label-static-cb input ~ span.ico{
      background: var(--bg);
      border-color: var(--bg3) !important;
  }

  .s3-table.shop2-events-list tbody tr{
      border-color: var(--bg3);
  }

  .s3-table.shop2-events-list tbody tr:nth-child(odd){
      background: var(--bgh);
  }

  .s3-table.shop2-events-list tbody tr:nth-child(even){
      background: var(--bg);
  }

  .s3-table.shop2-events-list tbody tr td{
      color: var(--text3);
  }

  .s3-table.shop2-events-list thead tr, .s3-table.shop2-events-list thead tr th{
      border-color: var(--bg3);
      color: var(--text);
  }

  .s3-table.shop2-events-list tbody tr td.event-actions .test-event .objectAction, .s3-table.shop2-events-list tbody tr td.event-actions .delete-event .objectAction{
      color: var(--text3);
  }

  table.s3-table thead tr th{
      color: var(--text2);
  }

  table.s3-table thead tr{
      background: var(--bg2h);
  }

  .warning{
      border-radius: 10px;
      background: var(--link4d);
      color: var(--link4);
      border-color: var(--link4d);
  }

  .bluepopup-wrapper>table td.content .tabs{
      margin: 0 !important;
  }

  ul.s3-data-list-new li .col-btn{
  	background: none !important;
  }

  .delivery-wrapper .bluepopup-wrapper #payment-systems-list li .item-col.alias .title-note{
  	background: var(--select);
  	color: var(--link);
  }


  .wrap-tasks .cron-tasks-list .show-additional-cron-list .s3-badge{
  	background: var(--select3);
  	border-color: var(--link3h);
  }

  .boxes-v2{
  	background: var(--bg);
  }

  .boxes-v2 .box-v2{
  	background: var(--bg2);
  	color: var(--text2);
  	transition: .2s;
  }

  .boxes-v2 .box-v2:hover{
  	background: var(--select);
  	border-color: var(--select);
  	transition: .2s;
  }

  .bluepopup-wrapper .box td{
  	border:none;
  	border-spacing: 0;
  	padding: 10px 15px;
  }

  .bluepopup-wrapper tr.box{
  	background: var(--bgh);
  	border-radius: 10px;
  	transition: .2s;
  	border:none;
  	border-spacing: 0;
  }

  .bluepopup-wrapper tr.box:nth-child(2n){
  	background: var(--bg);
  }

  .bluepopup-wrapper tr.box:hover{
  	border-radius: 10px;
  	background: var(--select);
  	transition: .2s;
  }

  table#discounts_list{
  	border-spacing: 0;
  }

  .boxes th{
  	border: none !important;
  	color: var(--text3);
  }


  div[style="border:1px dashed #ccc;padding:3px;"]{
  	border-radius: 10px;
  	padding: 10px !important;
  	border-color: var(--bg3) !important;
  }

  div[style="border:1px dashed #ccc;padding:3px;"] input{
  	border-radius: 5px;
  	padding: 7px 12px;
  	border: none;
  	outline: none;
  	background: var(--bg);
  	color: var(--text2);
  	transition: .2s;
  }

  div[style="border:1px dashed #ccc;padding:3px;"] select{
  	border-radius: 5px;
  	padding: 4px 4px;
  	border: none;
  	outline: none;
  	background: var(--bg);
  	color: var(--text2);
  	transition: .2s;
  }


  div[style="border:1px dashed #ccc;padding:3px;"] input:hover, 
  div[style="border:1px dashed #ccc;padding:3px;"] input:focus{
  	background: var(--select);
  	color: var(--text);
  	transition: .2s;
  }

  .ui-widget-header{
  	background: var(--link);
  }

  .choose_elems_wr .choose_elems_all, .choose_elems_wr .reset_elems_all{
  	background: var(--bg3);
  	box-shadow: none;
  }

  .s3-select + .chzn-container.chzn-with-drop .chzn-drop .chzn-results li{
  	border-color: var(--bg3) !important;
  	color: var(--text2) !important;
  }

  .s3-select + .chzn-container.chzn-with-drop .chzn-drop{
  	background: var(--bg) !important;
  	border-color: var(--bg3) !important;
  	color: var(--text2) !important;
  	border-radius: 10px !important;
  	overflow: hidden;
  }

  .s3-select + .chzn-container.chzn-with-drop .chzn-drop .chzn-results{
  	margin: 0 !important;
  	padding: 5px 0 !important;
  }

  .s3-select + .chzn-container.chzn-with-drop .chzn-drop .chzn-results li.highlighted, .s3-select + .chzn-container.chzn-with-drop .chzn-drop .chzn-results li.result-selected{
  	background: var(--select) !important;
  }

  .chzn-container-multi.chzn-container-active .chzn-choices{
  	border-color: transparent !important;
  }


  .s3-select + .chzn-container-multi.chzn-container-active .chzn-choices{
  	border-color: transparent !important;
  	background: var(--select) !important;
  	box-shadow: none !important;
  	padding: 5px !important;
  }

  .chzn-container-multi .chzn-choices .search-choice{
  	display: flex !important;
      align-items: flex-end;
  	gap: 6px;
  	background: var(--bg3);
  	color: var(--text2);
  	border: 2px solid var(--bg3);
  	box-shadow: none !important;
  	padding: 5px 5px 5px 10px !important;
  	margin: 0;
  }

  .chzn-container-multi .chzn-choices .search-choice .search-choice-close{
  	position: static;
  }

  .multi-checkbox-wrap{
  	border-color: var(--bg);
  	border-radius: 10px; 
  }

  .shop2-search-custom-color-ref, .reference-color-wrapper.opened .color-ref-items, .multi-checkbox-wrap{
  	width: min-content;
  	background: var(--bg);
  }

  .ref-item .s3-label-static-rb{
  	background: none;
  	color: var(--text2) !important;
  }

  #shop2_search_custom_color_ref_cond_color_order{
  	display: flex;
  	flex-direction: column;
  	gap: 8px;
  }

  .multi-checkbox-wrap .color-ref-items .ref-item + .ref-item{
  	margin: 0;
  }

  .multi-checkbox-wrap .color-ref-items .ref-item label{
  	display: block;
  	padding: 5px 5px 5px 7px !important;
  	border-radius: 10px !important;
  	background: var(--bg2) !important;
  	color: var(--text2) !important;
  }


  .multi-checkbox-wrap .color-ref-items{
  	padding: 10px 5px 5px 5px;
  }

  .multi-checkbox-wrap .color-ref-items .ref-item .mc-value{
  	background: none;
  }

  .multi-checkbox-wrap .color-ref-items .ref-item .mc-value .title{
  	color: var(--text2);
  }

  .reference-color-wrapper .color-ref-items{
  	border-radius: 10px; 
  	background: var(--bg);
  	
  }

  .multi-checkbox-wrap .header{
  	border-radius: 7px;
  	padding: 5px 5px 8px 5px;
  	background: var(--bg2h);
  }

  .multi-checkbox-wrap .header label, .multi-checkbox-wrap .header .title{
  	color: var(--text);
  	
  }

  form.json-edit-table table tr > td:first-child label{
  	color: var(--text);
  }

  ul.boxes.data-list li.box.json-field__system:before{
  	background-color: #0007;
  }

  input.s3-input-text-v2:disabled{
  	background: var(--bgh);
  	color: var(--text4) !important;
  	border-color: var(--bg2h);
  }

  /* 08 FIX */

  .s3-group-operations__selector{
  	background: var(--bg3);
  }


  .s3-group-operations__selector-title{
  	color: var(--text2);
      font-family: "Montserrat" !important;
      font-size: 15px;
  }

  .s3-group-operations__actions select.s3-group-operations-actions-list + .chzn-container .chzn-single{
  	background: var(--bg3);
  	color: var(--text2);
  	border-color: transparent;
  }

  .s3-group-operations__actions select.s3-group-operations-actions-list + .chzn-container .chzn-single div b, .s3-group-operations__selector-title .arrow{
  	filter: invert(1);
  }

  *:hover:not(.staff) > span.arrow, header.s3-header-new .navbar > ul > li > a:hover:not(.staff) span.arrow, header.s3-header-new .navbar > ul > li > a.context-button-active:not(.staff) span.arrow{
  	filter: invert(0.8) !important;
  }

  .s3-group-operations__selector-title .badge{
  	background: var(--linkd);
  	color: var(--linkh);
  }

  .s3-group-operations__context-menu, .s3-group-operations__actions select.s3-group-operations-actions-list + .chzn-container .chzn-drop{
  	background: var(--bg2);
  	box-shadow: 0 4px 16px var(--bgh);
  }

  .s3-group-operations__context-menu-item{
  	transition: .2s;
  }

  .s3-group-operations__context-menu-item:hover{
  	background: var(--select);
  	transition: .2s;
  }

  .s3-group-operations__context-menu-item.active{
  	background: var(--link);
  	transition: .2s;
  }

  .s3-group-operations__actions select.s3-group-operations-actions-list + .chzn-container .chzn-drop .active-result{
  	color: var(--text);
  }

  li.s3-group-operations__icon-action:before{
  	filter: invert(0.7);
  }

  .s3-group-operations__icon-action--noticedenied:before, .s3-group-operations__icon-action--noticegood:before, .s3-group-operations__icon-action--cancel-red:before, .s3-group-operations__icon-action--apply-green:before{
  	filter: invert(0) !important;
  }

  .s3-group-operations__actions select.s3-group-operations-actions-list + .chzn-container .chzn-drop .active-result.highlighted{
  	background: var(--select);
  }

  .s3-group-operations__actions select.s3-group-operations-actions-list + .chzn-container .chzn-drop .active-result.result-selected{
  	background: var(--linkh);
  }

  .s3-group-operations__apply-btn{
  	background-color: var(--link);
  	box-shadow: none !important;
  	transition: .2s;
  }

  .s3-group-operations__apply-btn:hover{
  	background-color: var(--linkh);
  	transition: .2s;	
  }

  .s3-sort-v2 .s3-sort-ico.active{
  	background: var(--linkh) !important;
  	border-color: var(--link) !important;
  }

  .tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in .s3-tree ul li > div.dynatree-node.active .dynatree-folder-id{
  	color: var(--text2);
  }

  .ui-combobox input{
  	padding: 10px 15px;
  	border-radius: 5px 0px 0px 5px !important;
  	font-weight: 600;
  	color: var(--text);
  }

  .ui-state-default{
  	border-radius: 0px 5px 5px 0px !important;
  	
  }

  .multi-checkbox-wrap .color-ref-items .ref-item .mc-value .image{
  	margin: 0;
  	border-radius: 5px;
  }

  .shop2-folders-move-block{
  	border-color: var(--bg3);
  }

  .s3-rb.s3-rb--radio{
  	display: inline-flex;
      align-items: center;
  	gap: 3px;
  	margin-top: 5px;
  	font-size: 14px;
  	margin-right: 2px;
  	padding: 6px 18px;
  	color: var(--text2);
  	background: var(--bg3);
  	border-radius: 10px;
  }

  .s3-rb.s3-rb--radio .ico{
  	display: none;
  }

  .s3-rb.s3-rb--radio.active{
  	color: var(--text);
  	background: var(--link);
  	border-radius: 10px;
  }

  /* MODS */

  .products-list > tbody > tr.product-kind{
  	background: var(--link3d);
  	border-color: var(--link3h);
  }

  .products-list > tbody > tr.product-kind td.product-name span.shop2-product-name{
  	color: #fff !important;
  	font-weight: 600 !important;
  }

  tbody#kinds_items tr.box{
  	background: var(--bgh);
  }

  .products-list > tbody > tr.shop2-product-meta{
  	background: var(--bg2) !important;
  }


  #kinds_items td:nth-child(3) input{
  	width: 500px;
  }
  /* 
  table.table-min th:nth-child(4), #kinds_items td:nth-child(4){
  	width: 0px !important;
  	display: none;
  	
  } */

  .s3-new-tabs ul.tabs-header li{
  	padding: 0;
  }



  .tabs__more-button, .tabs__submenu{
      display: contents !important;
  }

  .tabs__more-button span{
      display: none !important;
  }

  .tabs-submenu-item{
      display: block;
  }

  `;
}
if (new RegExp("^(?:.*\\/my\\/s3\\/.*)\$").test(location.href)) {
  css += `

  /* SHOP ORDERS */

  .shop2-wrapper .shop2-orders-wrapper .shop2-order-list-wrapper{
      background: var(--bg2);
  }

  .shop2-wrapper .shop2-orders-wrapper .shop2-order-list-wrapper table{
      border-color: var(--bg3h);
  }

  .shop2-wrapper .shop2-orders-wrapper .shop2-order-list-wrapper table tbody tr{
      background: var(--bg2);
      border-color: var(--bg3);
  }

  .shop2-wrapper .shop2-orders-wrapper .shop2-order-list-wrapper table tbody tr:nth-child(odd){
      background: var(--bg2h);  
  }

  .shop2-wrapper .shop2-orders-wrapper .shop2-order-list-wrapper table tbody tr td{
      color: var(--text2);
  }

  .objectRemove{
      color: var(--link4) !important;
  }

  #order_status_style + .chzn-container a.chzn-single > span{
      color: var(--text4);
  }

  table#shop2_orders_container tr.khaki{
      background: var(--select);
      border-color: var(--bg3);
  }

  .shop2-wrapper .shop2-orders-wrapper .shop2-order-list-wrapper table th{
      color: var(--text4);
  }

  .shop2-wrapper .shop2-orders-wrapper .shop2-order-list-wrapper thead .s3-select.white + .chzn-container a.chzn-single{
      color: var(--link) !important;
  }

  .shop2-wrapper .shop2-orders-wrapper .shop2-order-list-wrapper thead .s3-select.white + .chzn-container a.chzn-single div > b{
      filter: invert(1);
  }

  .s3-radio-tabs .s3-rb{
      box-shadow: none !important;
  }

  .shop2-order .s3-radio-tabs label{
      color: var(--text2);
  }

  .shop2-order .s3-actions-panel-wrap .search-form label.order-date input{
      background: var(--bg);
      border-radius: 2px;
      color: var(--text3);
  }

  .daterangepicker{
      background: var(--bg2);
      padding: 15px;
  }

  .daterangepicker .ranges{
      margin: 0 0 10px 0;
      width: 100%;
  }


  .daterangepicker .ranges ul{
      display: flex;   
      justify-content: space-between;
  }

  .ranges li{
      width: 100%;
      background: var(--bg3);
      border-color: transparent !important;
      color: var(--text);
      text-align: center;
      transition: .2s;
  }


  .ranges li:hover{
      background: var(--select);
      transition: .2s;
  }

  .ranges li.active{
      background: var(--link);
      transition: .2s;
  }

  .daterangepicker .calendar-table{
      background: var(--bg);
      border: none;
  }

  .daterangepicker .calendar th.month{
      color: var(--text);
  }

  .daterangepicker .calendar td{
      color: var(--text3);
  }

  .daterangepicker .calendar td.off{
      background: none;
      color: var(--bg3);
  }

  .daterangepicker td.available:hover, .daterangepicker th.available:hover{
      background: var(--select);
      color: var(--text) !important;
  }

  .daterangepicker .calendar td{
      width: 25px;
  }

  .daterangepicker td.start-date{
      background: var(--select);
      border-radius: 6px 0 0 6px !important;
  }

  .daterangepicker td.end-date{
      background: var(--select);
      border-radius: 0 6px 6px 0 !important;
  }

  .daterangepicker td.in-range{
      background: var(--select);
  }

  .range_inputs > *{
      margin-top: 15px !important;
  }

  .shop2-wrapper .shop2-orders-wrapper .shop2-pagination-wrap{
      padding: 15px;
  }

  .shop2-wrapper .shop2-products-wrapper .shop2-folder-title .params-note, .shop2-wrapper .shop2-orders-wrapper .shop2-folder-title .params-note{
      margin-right: 25px;
      top: 18px;
  }

  .shop2-wrapper .shop2-products-wrapper .s3-pagelist-wrapper, .shop2-wrapper .shop2-orders-wrapper .s3-pagelist-wrapper{
      padding: 0 0 20px;
  }


  .shop2-order-view table.shop2-order-table tbody > tr td:first-child{
  	background: transparent;
  	color: var(--text2);
  	border-color: var(--bg2);
  }

  .shop2-order-view table.shop2-order-table tbody > tr td{
  	background: transparent;
  	border-color: var(--bg2);
  	color: var(--text);
  }

  .shop2-order-view .row-hr span{
  	background: var(--bg2);
  }

  .shop2-order-view .row-hr:after{
  	background: var(--link3h);
  }
  .shop2-order-view .row-hr{
  	color: var(--link3);
  }

  .shop2-order-view table.shop2-order-table thead th{
  	color: var(--text);
  }

  .s3-data-list .s3-data-list-table tbody tr:nth-child(odd){
  	background: var(--bgh);
  }

  .s3-data-list .s3-data-list-table tbody tr{
  	background: var(--bg);
  	border-color: transparent;
  	color: var(--text);
  }

  .shop2-order-view .s3-data-list .s3-data-list-table tbody > tr td{
  	color: var(--text2);
  }

  .objectEdit{
  	color: var(--link3);
  }

  .shop2-order-view div.s3-actions-panel-wrap .s3-select.white + .chzn-container a.chzn-single{
  	background: var(--bg3) !important;
  }

  .shop2-order-view div.s3-actions-panel-wrap .s3-select.white + .chzn-container a.chzn-single:hover{
  	background: var(--bg3h) !important;
  	border-color: var(--bg3h) !important;
  	border: none !important;
  	box-shadow: 0 1px 3px var(--select) !important;
  }

  #order_status_style + .chzn-container a.chzn-single > span{
  	color: var(--text2);
  	
  }

  .s3-data-list .s3-data-list-table thead th{
  	color: var(--text);
  	border-color: var(--bg3);
  }

  .s3-messengers .s3-phone-link, .s3-table.shop2-events-list tbody tr td span.objectName{
  	color: var(--link3)
  }

  div._s3-gray-container[style="display: inline-flex;                                    padding: .4rem;                                                                background-color: #BDECB6;                                                                margin: 0;"]{
  	background: var(--link) !important;
  }




  `;
}
if (new RegExp("^(?:.*\\/my\\/s3\\/.*)\$").test(location.href)) {
		css += `
		/* SHOP POPUPS */

		.s3-complex-container-item{
			background: var(--bg2);
			color: var(--text2);
		}

		.shop2-event-edit .s3-complex-container-item .details .s3-table td.detail-title{
			color: var(--text2);
		}

		.shop2-event-edit .s3-complex-container-item .details .s3-table td .s3-template-editor:before{
			background: var(--bg);
			border: none;
		}

		.shop2-event-edit .s3-complex-container-item .notification-name .s3-cb{
			color: var(--text);
		}

		.shop2-event-edit .tabs .tabs-header li a{
			background: none !important;
			border: none !important;
			color: var(--text);
			margin: 0;
		}

		div.s3-popup .popup-header .popup-title{
			color: var(--link);
			font-weight: 700;
		}

		.shop2-event-edit .tabs .tabs-header li a.active, .shop2-event-test-wrap .event-test-form table tr td.title, .event-edit-head .event-recipient .recipient-title{
			color: var(--text);
		}

		.shop2-event-test-wrap .event-test-note, div.s3-popup .popup-body, span.form_note{
			color: var(--text2) !important;
		}

		.shop2-event-types-list .item:nth-child(odd){
			background: var(--bg2);
			border-color: var(--bg3);
		}

		.shop2-event-types-list .item:nth-child(even){
			background: var(--bg2h);
			border-color: var(--bg3);
		}

		.shop2-event-types-list .item{
			color: var(--link3);
		}

		div.s3-popup.s3-event_popup .email-list-wrap .email-list_wrapper .email-list tr td.radio .in_td .s3-rb{
			background: none;
		}

		.cheatsheet-example-item span{
			color: var(--link3);
		}

		.cheatsheet-example{
			background: var(--link3d);
			color: var(--link2h)
		}

		.cheatsheet-example-item strong{
			color: var(--link3);
			font-weight: 700;
		}

		.cheatsheet-example-item{
			color: var(--text2);
		}

		.cheatsheet-item span{
			background: var(--link3d);
			color: var(--link3);
		}

		.bluepopup-wrapper>table td.content .tabs .tabs-header li{
			background: var(--bg3);
			border-radius: 5px;
		}

		.bluepopup-wrapper>table td.content .tabs .tabs-header li a.tab-handle{
			background: none !important;
			border: none !important;
		}

		.shop2-full-search-section__title{
		    color: var(--text);
		}

		.shop2-full-search-control__title{
		    color: var(--text2); 
		}

		`;
}
if (new RegExp("^(?:.*\\/my\\/s3\\/.*)\$").test(location.href)) {
		css += `
		/* SHOP API */

		div.s3-actions-panel-wrap.mp_actions_panel{
			background: var(--bg2);
		}

		.mp_list_table, .article2-pagination-wrap.mp_pagination_panel .s3-per-page-controller{
			background: var(--bg2);
			box-shadow: none;
		}

		.mp_list_table .mp_container tr td, .mp_list_table .mp-product-list thead tr th{
			border-color: var(--bg3);
			color: var(--text2);
		}

		.mp_list_table .mp_container tr td span, .mp_list_table .mp_container tr td .price, .mp_list_table .mp_container tr td .price strong{
			color: var(--text2);
		}

		.mp_list_table .mp_container tr td.col_product .name_link{
			color: var(--text);
		}

		.mp_list_table .mp_container tr td .product-flag-badge{
			color: var(--text);
			padding-top: 1px;
		}

		.product-flag-badge.green{
			background: var(--select) !important;
			color: var(--link) !important;
		}

		.product-flag-badge.grey{
			background: var(--bg3) !important;
			color: var(--text3) !important;
		}

		.bluepopup-wrapper.cart_view .content-wrapper.mp_product_content .block .link{
			color: var(--link);
		}

		.bluepopup-wrapper.cart_view .content-wrapper.mp_product_content .block .title, .title_mp_popup{
			color: var(--text);
		}

		.bluepopup-wrapper.cart_view .content-wrapper.mp_product_content .block .images img{
			display: block;
		}

		.bluepopup-wrapper.cart_view .content-wrapper.mp_product_content .block .images{
			background: var(--bg3);
			border-radius: 10px;
		}

		.s3-actions-panel-wrap.mp_actions_panel .mp-filter .mp-filters-field .chzn-container .chzn-single{
			background: var(--bg3) !important;
			color: var(--text) !important;
			border-color: var(--bg3) !important;
		}

		.s3-actions-panel-wrap.mp_actions_panel .mp-filter .mp-filters-field .chzn-container .chzn-single > div{
			filter: invert(1);
		}

		.bluepopup-wrapper.cart_view .content-wrapper.mp_product_content .block table tr td{
			color: var(--text2);
			border-color: var(--bg3);
		}
		`;
}
if (new RegExp("^(?:.*\\/my\\/s3\\/.*)\$").test(location.href)) {
		css += `
		/* ckEditor */

		.cke_top{
			background: var(--bg);
			padding: 10px;
			width: 100%;
			border-bottom: 1px solid var(--bg2);
		}

		.cke_chrome{
			border: none;
		}

		.cke_inner{
			border-radius: 5px;
			overflow: hidden;
			background: none;
		}

		.cke_toolgroup{
			background: var(--bg2);
			border-radius: 4px;
			overflow: hidden;
		}

		a.cke_combo_button{
			margin-right: 4px;
		}

		a.cke_button{
			background: var(--bg2);
			transition: .2s;
			color: var(--text2);
		}

		a.cke_button_disabled:active, a.cke_button_disabled:focus, a.cke_button_disabled:hover, a.cke_button_off:active, a.cke_button_off:focus, a.cke_button_off:hover{
			background: var(--linkh);
			transition: .2s;
			cursor: pointer;
		}

		.cke_combo_off a.cke_combo_button, .cke_combo_off a.cke_combo_button{
			transition: .2s;
		}
			
		.cke_combo_off a.cke_combo_button:focus, .cke_combo_off a.cke_combo_button:hover{
			background: var(--linkh);
			border-color: var(--linkh);
			transition: .2s;
			cursor: pointer;	
		}

		.cke_combo_off a.cke_combo_button:active, .cke_combo_on a.cke_combo_button{
			background: var(--select);
			border-color: var(--select);
			transition: .2s;
		}

		.cke_combo_button span {
			cursor: pointer;
		}

		a.cke_combo_button{
			background: var(--bg2);
			color: var(--text);
			border-color: var(--bg2);
		}

		.cke_combo_text{
			color: var(--text2);	
		}

		.cke_panel{
			width: 300px;
			background: var(--bg);
			border: 1px solid var(--bg2);
			border-radius: 5px;
		}

		h1.cke_panel_grouptitle{
			background: var(--bg3);
			color: var(--text2);
			text-shadow: none;
			padding: 6px 10px;
			border-color: var(--bg2);
		}

		.cke_panel_listItem a{
			background: var(--bg2);
			border: none;
			padding: 6px 8px;
			transition: .2s;
		}

		li.cke_panel_listItem a:hover{
			background: var(--select);
			border: none;
			padding: 6px 8px;
			transition: .2s;
		}

		.cke_panel_listItem a:active, .cke_panel_listItem a:focus, .cke_panel_listItem a:hover{
			background: var(--select);
		}

		.cke_panel_listItem{
			padding: 0;
			margin-bottom: 4px;
		}

		.cke_bottom{
			background: var(--bg);
			border-color: var(--bg2);
		}

		.cke_resizer{
			box-shadow: none;
			border-color: transparent var(--bg3) transparent  transparent ;
		}

		a.cke_path_item, span.cke_path_empty{
			color: var(--text2);
			text-shadow: none;
			padding: 6px 10px;
			border-color: var(--bg2);
		}


		/* INVERT ICONS */

		.cke_ltr .cke_button__source_icon, .cke_button__sourcedialog_icon, a.cke_button span{
			filter: invert(0.8);
		}

		/* EXCLUDE */

		a.cke_button span[style="background-image:url('https://centrclimat.ru/my/s3/js/ckeditor/plugins/icons.png?t=JB9C');background-position:0 -1920px;background-size:auto;"],
		a.cke_button span[style="background-image:url('https://centrclimat.ru/my/s3/js/ckeditor/plugins/icons.png?t=JB9C');background-position:0 -912px;background-size:auto;"], a.cke_button span.cke_button__s3image_icon, a.cke_button span.cke_button__s3button_icon, a.cke_button span.cke_button__noindex_icon, a.cke_button span.cke_button__s3cart_icon, a.cke_button span.cke_button__s3folder_icon, a.cke_button span.cke_button__s3media_icon, a.cke_button span.cke_button__s3style_icon, a.cke_button span.cke_button__removeformat_icon{
			filter: invert(0);
		}



		`;
}
if (new RegExp("^(?:.*\\/my\\/s3\\/.*)\$").test(location.href)) {
  css += `
  /* PAGEs */

  ul.dynatree-container li{
      position: relative;
  }

  .dynatree-menu ul.dynatree-container li .dynatree-node span.dynatree-connector{
      filter: brightness(0.6);
  }

  .dynatree-menu ul.dynatree-container li .dynatree-node .pageName{
      color: var(--link);
  }

  .dynatree-menu ul.dynatree-container li .dynatree-node.pageHidden .pageName{
      color: var(--text4);
  }

  .s3-ico-24.i-settings{
      filter: invert(1);
  }

  .s3__menu-list > ul > li > span.menu-item, .data-list-title{
      color: var(--text);
  }

  .menu-actions-wrap.redesign form.search_page input.s_butt{
      position: relative;
      background-color: #ddd;
      color: var(--text2);
      border-radius: 5px;
      box-shadow: none;
      transition: .2s;
      border-color: var(--bg3) !important;
      filter: invert(1);
  }


  .menu-actions-wrap.redesign form.search_page input.s_butt:hover{
      position: relative;
      background-color: #ef00ff40;
      color: var(--text2);
      box-shadow: none;
      transition: .2s;
      border-color: var(--bg3) !important;
      filter: invert(1);
  }

  #search-results .search-title{
      color: var(--text);
      font-weight: 700;
  }

  .context-menu-v2 ul{
      padding: 5px;
  }

  .context-menu{
      border-radius: 10px;
  }

  #divContent * .context-menu-v2 ul * .ico{
      filter: invert(1);
  }

  .s3-ico-24.i-trash.red, .s3-oah-ico.oah-delete._red{
      filter: invert(1) !important;
  }

  .menu-actions-wrap.redesign .adaptive-controls .s3-radio-tabs.medium label.s3-rb.disabled{
      background: var(--bgh) !important;
      border-color: var(--bgh) !important;
      color: var(--bg3h) !important;
  }

  .menu-actions-wrap.redesign .adaptive-controls .s3-radio-tabs.medium label.s3-rb.disabled .s3-ico{
      opacity: 0.4;
  }

  .context-menu.context-menu-v2.pages-group-operations * span.ico > *{
      filter: invert(1) brightness(0.3);
  }

  .s3-group-operations-control .checked-operation{
      background: var(--bg2);
      border-color: var(--bg2);
      color: var(--text2);
      user-select: none !important;
      transition: .2s;
  }

  .s3-group-operations-control .checked-operation.context-button-active{
      background: var(--select);
      border-color: transparent !important;
      transition: .2s;
  }

  .context-menu-v2 ul li a.context-button-active, .context-menu-v2 ul li span.txt.context-button-active{
      background: var(--linkh);
      border-radius: 5px;
  }

  .menu-group-operation .select__control{
      background: var(--bg2);
  }

  .s3-group-operations-control .checked-operation:after{
      filter: invert(1);
      transition: .2s;
  }

  .s3-group-operations-control .checked-operation.context-button-active:after{
      filter: invert(0);
      transition: .2s;
  }

  .pages-group-indexing span.ico > *{
      filter: invert(1) !important;
  }

  .bluepopup-wrapper.with-tabs > table > tbody td.content ul.tabs-header li a.tab-handle, .delivery-wrapper .bluepopup-wrapper > table > tbody td.content ul.tabs-header li a.tab-handle, .bluepopup-wrapper.with-tabs > table > tbody td.content .tabs__submenu > li.tabs-submenu-item a.tab-handle, .delivery-wrapper .bluepopup-wrapper > table > tbody td.content .tabs__submenu > li.tabs-submenu-item a.tab-handle{
      color: var(--text3);
  }

  .page-edit__form-row .page-edit__form-title{
      color: var(--text);
  }

  input.s3-input-text-v2, .select2-container--default .select2-selection--multiple{
      background: var(--bg) !important;
      border-color: var(--bg) !important;
  }

  input.s3-input-text-v2:focus{
      background: var(--select);
      border-color: transparent;
      box-shadow: none;   
  }

  .access-setting label.s3-rb:not(.switcher){
      background: none;
      color: var(--text2);
  }

  .s3-rb:not(.switcher) .ico, .s3-label-static-rb .ico{
      background: var(--bg);
      border-color: var(--bgh);
      transition: .2s;
  }

  .s3-rb:not(.switcher):hover .ico, .s3-label-static-rb:hover .ico{
      background: var(--select);
      border-color: var(--select);
      box-shadow: none;
      transition: .2s;
  }

  .s3-rb:not(.switcher).active .ico, .s3-label-static-rb.active .ico{
      background: var(--link);
      border-color: var(--link);
      box-shadow: none;
      transition: .2s;
  }

  .page-edit__form-row #visibleByAccessWrap{
      background: var(--bg2h);
  }

  .s3-cb.switcher{
      color: var(--text3);
  }

  ul.boxes.data-list{
      background: var(--bg);
  }

  .page-edit__form-row .page-edit__form-label .s3-word-counter{
      color: var(--text4);
  }

  .s3-word-counter>span span{
      color: var(--text2);
  }

  .s3-page-edit-wrapper .tabs-header li:hover a.tab-handle, .s3-page-edit-wrapper .tabs-header li a.tab-handle:hover{
      background: none !important;
  }

  ul.s3-data-list-new{
      background: var(--bg);
  }

  .s3-page-edit-wrapper ul.s3-data-list-new li.data-list-item:hover:not(.system), ul.s3-data-list-new li .handle:hover{
      background: var(--select);
  }

  ul.s3-data-list-new li .handle{
      background: transparent;
  }

  ul.s3-data-list-new li{
      background: var(--bg2);
  }

  ul.s3-data-list-new li.system{
      background: var(--bgh);
  }

  ul.s3-data-list-new li .item-col.name .title.muted{
      color: var(--bg3);
  }

  ul.s3-data-list-new li .item-col.name .title{
      color: var(--link3);
      font-weight: 600 !important;
  }

  ul.s3-data-list-new li .item-col.name .title.new{
      color: var(--link);
  }

  ul.s3-data-list-new li .handle:after{
      filter: invert(1);
  }

  ul.s3-data-list-new li .item-col{
      color: var(--text4);
  }

  ul.s3-data-list-new li .item-col .edit:hover{
      color: var(--link);
  }

  span.page-link-view a{
      color: var(--text);
  }

  span.page-link-view a:hover{
      color: var(--link);
  }

  span.page-link-view .s3-ico, .s3-ico.i-page-link-view{
      filter: hue-rotate(-90deg);
  }

  #tabs .tabs-header .page-service-links a._tabs__links-item{
      color: var(--link) !important;
  }


  .shop2-collect-tabs span.s3-btn.green{
      margin-bottom: 15px;
  }



  .dynatree-menu ul.dynatree-container .dynatree-node.added .node-wrap{
      background: var(--select);
      border-color: var(--select);
  }

  div[id^=pageController] ul.popup-left{
      background: var(--bg2h);
      box-shadow: none;
  }

  div[id^=pageController] ul.popup-left li span.contextMenuItem:hover{
      background: var(--select);
  }

  div[id^=pageController] ul.popup-left li span.contextMenuName{
      color: var(--text2);
  }

  div[id^=pageController] ul.popup-left li span.contextMenuItem.disabled>.contextMenuName{
      background: var(--bg2h);
  }

  div[id^=pageController] ul.popup-left li span.contextMenuItem.disabled{
      background: transparent !important;
  }

  div[id^=pageController] ul.popup-left li.moveToMenu ul li span.contextMenuName:hover{
      color: var(--link);
  }

  ul.s3-data-list-new li .item-col.name .wrapper__title .count_ids, ul.s3-data-list-new li .item-col.name .wrapper__title .count_ids:hover{
  	background: var(--link3d);
  	color: var(--link3);
  }

  .s3-page-edit-wrapper ul.s3-data-list-new li.data-list-item:hover:not(.system) .count_ids{
  	background: var(--linkd);
  	color: var(--link);	
  }


  `;
}
if (new RegExp("^(?:.*\\/my\\/s3\\/.*)\$").test(location.href)) {
		css += `
		/* SHOP ADDS */

		.s3-table-list__tr:nth-child(odd){
			background: #292929;
			border-color: #444;
		}

		.s3-table-list__tr:nth-child(even){
			background: #353535;
			border-color: #444;
		}

		.s3-table-list__td{
			color: #fff;
		}

		.discounts__badge{
			color: #000;
		}

		.s3-table-list__th{
			background: #333;
		}

		.bluepopup-wrapper.cart_view table td.draggable_title span.title{
			color: #fff;
		}

		.s3-table-list__tr .s3-ico-24.i-oah-edit, .s3-table-list__tr  .s3-ico-24.i-oah-trash, .select2-container--default .select2-selection--single .select2-selection__arrow{
			filter: invert(1);
		}

		.s3-control__title, .discount-control-coupon-count__title, .s3-selected-items__title, .discount-control-days__title, .s3-date-interval__title, .discount-control-prices__title, .discount-control-hours__title, .discount-section__title, .discount-coupons__title, .select2-container--default .select2-selection--single .select2-selection__rendered, .discount-control__registered .s3-cb.switcher, .discount-control__is-aggregated .s3-cb.switcher, .discount-control__gift-calc .s3-cb.switcher, .discount-control__is-expensive .s3-cb.switcher{
			color: #fff;
		}

		.s3-control__input, .s3-selected-items__body, .discount-coupons--wrapper, .select2-container--default .select2-selection--single{
			background: #222 !important;
			border: none;
			color: #eee;
			transition: .2s;
		}

		.s3-control__input:hover, .s3-control__input:focus, .s3-selected-items__body:hover, .s3-selected-items__body:focus, .discount-coupons--wrapper:hover, .discount-coupons--wrapper:focus, .select2-container--default .select2-selection--single:hover, .select2-container--default .select2-selection--single:focus{
			background: var(--select);
			box-shadow: none !important;
			color: #fff;
			transition: .2s;
		}

		.s3-selected-items__add-button, .folderContentControl__add-button, .discount-coupons__edit-button{
			background: #444;
			box-shadow: none;
			color: #ccc;
			transition: .2s;
		}

		.s3-selected-items__add-button:hover, .folderContentControl__add-button:hover, .discount-coupons__edit-button:hover{
			background: var(--linkh);
			box-shadow: none !important;
			color: #fff;
			transition: .2s;
		}

		.discount-control-days__body, .discount-control-prices__body, .s3-date-interval__date{
			background-color: #222;
			color: #fff;
			border: none;
		}

		.cron-list-wrap .cron-list table tr td div.cron-item div.info .cron-num{
			color: #888;
			font-size: 9px
		}

		.cron-list-wrap .cron-list table tr td div.cron-item div.info .cron-link{
			padding-left: 2px;
		}

		.cron-list-wrap .cron-list table tr td div.cron-item, .cron-list-wrap .cron-list table tr td div.cron-item .controls{
			padding: 3px;
			height: auto;
		}

		.cron-list-wrap .cron-list table tr td div.cron-item div.info{
			border: none !important;
		}

		.cron-list-wrap .cron-list table tr td div.cron-item div.info .cron-status.error{
			color: #ff4141;
		}

		.cron-list-wrap .cron-list table tr td div.cron-item div.controls .update, .cron-list-wrap .cron-list table tr td div.cron-item div.controls .more, .cron-list-wrap .cron-list table tr td div.cron-item div.controls .delete{
			background: var(--bg2);
			border-radius: 5px;
			padding: 0 7px;
			margin: 0;
			transition: .2s;
			user-select: none;
		}

		.cron-list-wrap .cron-list table tr td div.cron-item div.controls .update:hover, .cron-list-wrap .cron-list table tr td div.cron-item div.controls .more:hover, .cron-list-wrap .cron-list table tr td div.cron-item div.controls .delete:hover{
			background: var(--linkd);
			transition: .2s;
		}

		.cron-list-wrap .cron-list table tr td div.cron-item div.controls .update .s3-underline, .cron-list-wrap .cron-list table tr td div.cron-item div.controls .more .s3-underline, .cron-list-wrap .cron-list table tr td div.cron-item div.controls .delete .s3-underline{
			text-decoration: none;
		}

		.s3-tree-wr span.s3-tree-close-btn, .s3-tree-wr span.s3-tree-open-btn{
			filter: invert(0.8);
			transition: .2s;
		}
		.s3-tree-wr span.s3-tree-close-btn:hover, .s3-tree-wr span.s3-tree-open-btn:hover{
			background-color: #fbbff9;
			transition: .2s;
		}

		.shop2-wrapper .s3-actions-panel-wrap .search-form span.s3-btn .s3-ico.i-reset-svg{
			margin-top: -4px;
		}

		.chzn-container .chzn-results li em{
			background: var(--linkh);
			border-radius: 2px;
			padding-left: 2px;
			padding-right: 2px;
		}

		.chzn-container .chzn-results .no-results{
			background: var(--bg2);
		}

		body .s3-select.v2.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-search input, .s3-action-select .s3-select.v2.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-search input{
			filter: invert(1);
			background-color: #ddd !important;
			font-family: Montserrat !important;
		}

		body .s3-select.v2.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-results li, .s3-action-select .s3-select.v2.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-results li{
			font: 500 14px "Montserrat" !important;
		}

		.control-bg--gray{
			background: var(--bg);
		}

		.control-title, .multi-checkbox-control__item-name{
			color: var(--text);
		}

		.multi-checkbox-control__item{
			background: var(--bg2);
		}

		.multi-checkbox-control__header{
			color: var(--text2);
		}

		.table-min-v2 .row-hr span{
			background: var(--bg2);
			color: var(--link)
		}

		.table-min-v2 .row-hr:after{
			background: var(--linkh);
		}

		a.shop2-collect-product, a.shop2-collect-folder{
			margin: 0;
		}

		/* SELECT2 10.08 */

		.select2-dropdown{
		    background: var(--bg2h);
		    border-radius: 10px !important;
		    box-shadow: 0 0 10px 0 #0002;
		    overflow: hidden;
		}

		.select2-container--default .select2-results__option--highlighted.select2-results__option--selectable{
		    background: var(--linkh);
		    color: var(--text) !important;
		}

		.select2-container--default .select2-results__option--selected{
		    background: var(--linkd);
		    color: var(--text) !important;
		}

		.select2-results__option{
		    color: var(--text2) !important;
		}


		.select2-container--default .select2-search--dropdown .select2-search__field{
		    background-color: var(--bg2);
		    color: var(--text);
		    border: 1px solid var(--bg3);
		}

		.select2-container--default .select2-search--dropdown:before{
		    display: block;
		    content: url(/my/s3/images/svg_icons/oah_icons/oah-search.svg);
		    position: absolute;
		    filter: invert(1);
		    width: 32px;
		    height: 32px;
		    left: 16px;
		    top: 16px;
		}
		`;
}
if (new RegExp("^(?:.*\\/my\\/s3\\/.*)\$").test(location.href)) {
  css += `
  /* Page Selector */

  .s3-plate{
      background: var(--bg2);
  }

  .s3-tabs-nav{
      background: var(--bg2h);
  }

  .s3-tabs-nav__li{
      color: var(--text2);
  }

  .s3-ico-24.i-arrow-down.blue{
      filter: hue-rotate(-80deg) saturate(3);
  }

  .s3-radio-tabs .s3-rb{
      border: none;
  }

  .s3-radio-tabs .s3-rb--green.active:hover{
      background: var(--linkh);
  }

  .s3-search-panel{
      background: var(--bg);
  }

  .s3-search-panel__text{
      color: var(--text);
      
  }

  .s3-search-panel__button{
      background-color: transparent;
      filter: invert(1);
  }

  .s3-search-panel__button:hover{
      background-color: var(--text3);
  }

  .template-library__row-title > span{
      background: var(--bg2);
      color: var(--text);
  }

  .template-library__row-title:before{
      border-color: var(--bg3);
  }

  .template-library__card{
      background: var(--bg);
      color: var(--text);
      border: none;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: none !important;
      transition: .2s;
  }

  .template-library__card:hover{
      background: var(--linkh);
      color: var(--text);
      transition: .2s;
  }

  .template-library__preview > img{
      filter: brightness(0.4);
      border-radius: 10px 10px 0 0;
      transition: .2s;
  }


  .template-library__card:hover .template-library__preview > img{
      filter: brightness(0.9);
      transition: .2s;
  }
  .template-library__list--medium .template-library__desc{
      background: var(--bg) !important;
      border: none;
  }

  .template-library__name{
      color: var(--text2);
  }


  .template-library__card:hover .template-library__name{
      color: var(--text);
  }



  .template-library__list--medium .template-library__card{
  	margin: 0;
  	width: auto;
  	height: auto;
  }

  .template-library__row{
  	display: grid;
  	grid-template-columns: 1fr 1fr 1fr;
  	gap: 15px;
  	padding: 20px;
  }

  .template-library__card:hover .template-library__desc, .template-library__card:hover .template-library__preview, .template-library__card:hover{
  	background: var(--linkd) !important;
  	color: var(--text);
  }

  .template-library__list--simple .template-library__card{
  	background: var(--bg) !important;
  	color: var(--text);
  }

  .template-library__list--simple .template-library__card{
  	margin: 0;
  }

  .template-library__list--simple .template-library__row{
  	display: grid;
  	grid-template-columns: 1fr 1fr;
  	flex-direction: column;
  	gap: 5px;
  }


  `;
}
if (new RegExp("^(?:.*\\/my\\/s3\\/.*)\$").test(location.href)) {
  css += `
  /* TEMPLATE EDITOR */

  .s3-content #editorWrapper .tpl-title, .s3-content #editorWrapper #editorContent .tab-body .tpl-body-wrapper .tpl-body-right-side .top-line, .s3-content #editorWrapper #editorContent .tab-body .tpl-body-wrapper .tpl-body-right-side{
      background: var(--bg2);
      color: var(--text);
      border: none !important;
  }

  .s3-content #editorWrapper #editorContent .tab-body .template-themes-wrapper .template-theme.active{
      background: var(--bg3);
      padding: 0 10px;
      color: var(--text);
      border-radius: 5px 5px 0 0;
      border: none;
  }

  .s3-content #editorWrapper #editorContent .tab-body .template-themes-wrapper .template-theme.active:after{
      background: var(--link);
  }

  .s3-content #editorWrapper #editorContent .tab-body .tpl-body-wrapper, .s3-content #editorWrapper #editorContent .tab-body .tpl-body-wrapper .tpl-body-left-side{
      background: var(--bg2);
      border: none !important;
  }

  .ace_content{
      background: var(--bg);
  }

  .ace-chrome .ace_marker-layer .ace_active-line{
      background: var(--select);
  }

  .ace-chrome .ace_cursor{
      color: var(--text);
  }

  .s3-content #editorWrapper #editorContent #ace_editor_wrapper *, .s3-code-editor *, .ace_content, .ace_scroller, .ace_layer, .ace_layer *, .ace_text-layer *, .s3-template-editor, .s3-template-editor *{   
      font-family: Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace !important;
      font-weight: 400 !important;
  }

  .ace_folding-enabled > .ace_gutter-cell{
      background: var(--bg2);
      color: var(--text3);
  }

  .ace_text-layer{
      color: #fffb;
  }

  .ace-chrome .ace_storage, .ace-chrome .ace_keyword, .ace-chrome .ace_meta.ace_tag{
      color: #fd55e5;
  }

  .ace-chrome .ace_support.ace_function{
      color: #5988f7;
  }

  .ace-chrome .ace_string{
      color: #54e2ff;    
  }

  .ace_editor.ace_autocomplete .ace_completion-highlight{
  	color: #54e2ff;
  }

  .ace-chrome .ace_entity.ace_other.ace_attribute-name{
      color: #ff7500;
  }

  .ace-chrome .ace_comment{
      color: #15ae17;
  }
  .ace-chrome .ace_variable{
      color: #1dffb4;        
  }

  .ace-chrome .ace_constant.ace_numeric{
      color: #427aff;
  }

  .ace-chrome .ace_indent-guide{
      filter: brightness(0.4);
  }

  .ace-chrome .ace_marker-layer .ace_selected-word, .ace-chrome .ace_marker-layer .ace_selection{
      background: var(--select);
      border-color: var(--linkh);
  }

  .s3-content #editorWrapper .main-tabs-wrapper .te-tabs#tplTabs li span.name{
      background: var(--bg2);
      color: var(--text2);
      border-color: var(--bg2h);
      transition: .2s;
  }

  .s3-content #editorWrapper .main-tabs-wrapper .te-tabs#tplTabs li span.name:hover{
      background: var(--select);
      border-color: var(--select);
      color: var(--text);
      transition: .2s;
  }

  .s3-content #editorWrapper .main-tabs-wrapper .te-tabs#tplTabs li.active span.name{
      background: var(--link);
      border-color: var(--link);
      color: var(--text);
      font-weight: 700;
      transition: .2s;
  }

  .s3-content #editorWrapper .main-tabs-wrapper .te-tabs#tplTabs li span.name span.s3-ico.i-close-small{
      filter: invert(1);
      background-color: #002c2f;
      border-color: var(--text2);
      transition: .2s;
  }

  .s3-content #editorWrapper .main-tabs-wrapper .te-tabs#tplTabs li span.name span.s3-ico.i-close-small:hover{
      background-color: #006f77;
      border-color: var(--text2);
      background-position: left top;
      transition: .2s;
      
  }


  .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-search-result .tpl-group-title, .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-list-box .tpl-group-title{
      background: var(--bg2);
      border-radius: 5px;
      color: var(--text);
      padding: 10px 20px;
      font-weight: 700;
  }

  .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-search-result table.tpl-list, .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-list-box table.tpl-list{
      margin-top: 20px;
  }

  .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-search-result table.tpl-list tr, .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-list-box table.tpl-list tr{
      border: none;
      background: var(--bgh);
  }

  .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-search-result table.tpl-list tr:nth-child(2n), .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-list-box table.tpl-list tr:nth-child(2n){
      background: var(--bg2);   
  }

  .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-search-result table.tpl-list tr:hover, .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-list-box table.tpl-list tr:hover{
      background: var(--select);
  }

  .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-search-result table.tpl-list tr td span.name, .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-list-box table.tpl-list tr td span.name{
      color: var(--text);
  }

  .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-search-result table.tpl-list tr td span.name:hover, .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-list-box table.tpl-list tr td span.name:hover{
      color: var(--link);
  }

  .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-search-result table.tpl-list tr td.tpl-name span.template_id, .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-list-box table.tpl-list tr td.tpl-name span.template_id, .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-search-result table.tpl-list tr td span.desc, .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-list-box table.tpl-list tr td span.desc{
      color: var(--text4);
  }

  .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-search-result table.tpl-list tr td.checkbox, .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-list-box table.tpl-list tr td.checkbox, .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-search-result table.tpl-list tr td.tpl-name, .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-list-box table.tpl-list tr td.tpl-name, .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-search-result table.tpl-list tr td.tpl-context, .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-list-box table.tpl-list tr td.tpl-context, .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-search-result table.tpl-list tr td.tpl-filename, .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-list-box table.tpl-list tr td.tpl-filename, .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-search-result table.tpl-list tr td.tpl-controls, .s3-content #editorWrapper #templatesList .tpl-list-table td.tpl-list-wrap .tpl-list-box table.tpl-list tr td.tpl-controls{
      padding: 10px 5px;
  }

  .s3-content #editorWrapper .tpl-list-controls .tpl-search .tpl-search-radiogroup label{
      padding: 5px 10px;
      border-radius: 10px;
      margin-top: 10px;
      display: inline-block;
      color: var(--text);
  }

  .s3-content #editorWrapper .tpl-list-controls .tpl-search .tpl-search-radiogroup label span.ico{
      display: none;
  }

  .s3-content #editorWrapper .tpl-list-controls .tpl-search .tpl-search-text{
      background: var(--bg2);
      border-color: var(--bg2);
      color: var(--text);
      outline: none !important;
      transition: .2s;
  }

  .s3-content #editorWrapper .tpl-list-controls .tpl-search .tpl-search-text:hover{
      background: var(--bg2h);
      border-color: var(--bg2h);
      transition: .2s;
  }

  .s3-content #editorWrapper .tpl-list-controls .tpl-search .tpl-search-text:focus{
      background: var(--select);
      border-color: var(--select);
      transition: .2s;
  }

  .s3-content #editorWrapper .tpl-list-controls .tpl-search .tpl-search-butt{
      background-color: var(--text2);
      border-color: var(--text2);
      filter: invert(1);
      transition: .2s;
  }

  .s3-content #editorWrapper .tpl-list-controls .tpl-search .tpl-search-butt:hover{
      background-color: var(--text3);
      border-color: var(--text3);
      filter: invert(1);
      transition: .2s;
  }


  .ace-chrome .ace_gutter{
      background: var(--bg2);
  }

  .s3-data-list .data-list-item .item-col.alias, .s3-data-list .data-list-item .item-col{
  	color: var(--text3)
  }
  .s3-data-list .data-list-item .item-col .item-data-query{
  	color: var(--link3)
  }

  .ace-chrome .ace_entity.ace_name.ace_function{
  	color: #8888f2;
  }
  `;
}
if (new RegExp("^(?:.*\\/my\\/s3\\/.*)\$").test(location.href)) {
  css += `
  /* Template Files */

  .s3-content .design-files .design-files-title{
      background: var(--bg2);
      color: var(--text);
      font-weight: 600;
      border-radius: 5px;
      padding: 15px 10px 20px 20px;
  }

  .s3-content .design-files .design-files-panel{
      background: var(--bgh);
      color: var(--text);
      font-weight: 600;
      border-radius: 5px;
  }

  .archive-download form{
      margin: 0 !important;
  }

  .s3-content #uploadFile .fileform{
      width: auto;
  }

  .s3-content #uploadFile .fileform, .s3-content #uploadFile .fileform #userfile, .s3-content #uploadFile .fileform #new_file, .s3-content #uploadFile .fileform #fileformlabel{
      background: var(--bg3);
      border-color: var(--bg3);
  }

  .s3-content #uploadFile .fileform .selectbutton{
      text-transform: lowercase;
      padding: 0 5px 5px;
  }

  .s3-content .design-files table tr{
      border-color: var(--bg3);
      transition: .2s;
  }

  .s3-content .design-files table tr *{
      transition: .2s;
  }

  .s3-content .design-files table tr:hover{
      background: var(--select);
      transition: .2s;
  }

  .s3-content .design-files table tr td span.name{
      color: var(--text2);
      transition: .2s;
  }

  .s3-content .design-files table tr td span.name:hover{
      color: var(--link);
      transition: .2s;
  }

  .s3-content .design-files table.files .controls{
      background: transparent !important;
  }


  s3-files .file-right-side{
      display: flex;
      gap: 10px;
      width: auto;
  }

  .file-right-side > *{
      margin: 0 !important;
  }

  .s3-files ul.boxes li div.objectname, li.box_draggable div.objectname{
  }

  body > li.box .file-right-side, .s3-files .file-right-side, li.box_draggable .file-right-side{
      width: auto;
  }

  .s3-files .file-wrap-table-titles .file-right-side{
      width: auto;
  }

  .s3-files .file-wrap-table-titles div.fileActions{
      width: 140px;
  }


  .s3-files .file-wrap-table-titles div.fileSize{
      width: 80px;
  }

  .s3-files ul.boxes li .fileModified, .s3-files .file-wrap-table-titles div.fileModified{
      display: none;
  }

  .s3-files .file-wrap-table-titles div.fileSize:nth-child(1){
      text-align: right;
      padding-right: 10px;
  }

  .s3-files ul.boxes li div.objectname span.wrap-name{
  }

  .s3-files .file-wrap-table-titles div.fileName{
      padding-left: 20px;
  }

  .s3-content-grid > tbody > tr > td.content-wrapper{
      background: var(--bg);
  /*     padding: 30px 50px; */
      border-radius: 20px;
  }

  .s3-tree-wr .folders-controls{
      right: -18px;
  }

  li.box:nth-child(2){
      border-radius: 5px 5px 0 0;
  }


  li.box:last-child{
      border-radius: 0 0 5px 5px;
  }

  .s3-files .s3-pagelist-wrapper{
      margin-top: 10px;
  }

  #fsUploadCountFiles .upload-elements, #uriUploadCountFiles .upload-elements{
      background: var(--bg);
  }

  ul.boxes.data-list li.box{
      background: var(--bg2);
  }

  #fsUploadCountFiles ul.boxes.data-list li.box.done-upload-file span.progress, #uriUploadCountFiles ul.boxes.data-list li.box.done-upload-file span.progress{
      background: var(--select) !important;
      border-radius: 5px;
  }
  `;
}
if (new RegExp("^(?:.*\\/my\\/s3\\/.*)\$").test(location.href)) {
  css += `
  /* PICTURES */
  .s3-image .image-wrapper > ul{
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
  }

  #selected_container > li.image, .s3-image .image-wrapper > ul li{
      display: contents;
  }

  span.image-element{
      position: relative;
      display: flex;
      width: fit-content;
  }


  .s3-new-tabs ul.tabs-header li span.tab-handle{
      color: var(--text);
  	padding: 0 10px;
  	border: none !important;
  }

  div.s3-new-actions-panel-wrap .s3-actions-panel .s3-radio-tabs.medium label.s3-rb{
      background: var(--bg3);
      color: var(--text);
      border-color: transparent;
      transition: .2s;
  }

  div.s3-new-actions-panel-wrap .s3-actions-panel .s3-radio-tabs.medium label.s3-rb:hover{
      background: var(--select);
      transition: .2s;
  }

  div.s3-new-actions-panel-wrap .s3-actions-panel form.search-form .search-inputs-wrap input.search-text{
      color: var(--text);
  }

  div.s3-new-actions-panel-wrap .s3-actions-panel form.search-form .search-inputs-wrap{
      background: var(--bg);
  }

  div.s3-new-actions-panel-wrap .s3-actions-panel form.search-form .search-inputs-wrap .search-butt{
      background-color: var(--text3);
      position: relative;
      filter: invert(1);
      transition: .2s;
  }

  div.s3-new-actions-panel-wrap .s3-actions-panel form.search-form .search-inputs-wrap .search-butt:hover{
      background-color: #d711d769;
      transition: .2s;
  }

  .s3-image .image-wrapper > ul li span.image-element span.image-wrapper{
      background: var(--bg3);
      border-color: transparent;
      border-radius: 10px;
      border: none !important;
      transition: .2s;
  }

  .s3-image .image-wrapper > ul li span.image-element span.image-wrapper:hover{
      background: var(--select);
      transition: .2s;
  }

  .s3-image .image-wrapper > ul li.active span.image-element span.image-wrapper{
      background: var(--select);
      transition: .2s;
  }

  .s3-image .image-wrapper > ul li.active span.image-element span.image-info{
  	background: var(--select);
  	transition: .2s;
  }

  .s3-image .image-wrapper > ul li.active span.image-wrapper span.name{
  	color: var(--text);
  }

  span.image-element span.image-wrapper span.image-thumb.svg, span.image-element span.image-wrapper span.image-thumb.gif, span.image-element span.image-wrapper span.image-thumb.png, span.image-element span.image-wrapper span.image-info, span.image-element span.image-wrapper span.image-thumb{
      background-color: transparent;
  }

  span.image-element span.image-wrapper span.name{
      color: var(--text);
  }


  .s3-image .image-wrapper > ul li span.image-element .controls > span{
      background: var(--bg3h);
      transition: .2s;
  }

  .s3-image .image-wrapper > ul li span.image-element .controls > span:hover{
      background: var(--select);
      transition: .2s;
  }

  .s3-image .image-wrapper > ul li span.image-element .controls > span.delete:hover, .s3-image .image-wrapper > ul li span.image-element .controls > span.favorite:hover{
      background: var(--select4);
      transition: .2s;
  }

  span.image-element .controls{
      right: -2px;
      bottom: 0px;
      border-radius: 10px 0px 10px 0px;
  }

  .s3-image .image-wrapper > ul li span.image-element .controls > span .s3-oah-ico, .s3-image .image-wrapper > ul li span.image-element .controls > span .s3-ico-24{
      filter: invert(1);
  }

  .image-edit-wrap .image-info td.image-preview-td .s3-edit-image{
      padding: 0 7px;
  }

  .image-drag-and-drop-message.s3image{
  	background: var(--select);
  }

  .image-drag-and-drop-message.s3image .image-drag-and-drop-icon .text span{
  	color: var(--text2);
  }

  .s3-image .image-wrapper > ul li span.image-element span.image-wrapper span.name{
      display: block;
      overflow: visible !important;
  }
  `;
}
if (new RegExp("^(?:.*\\/my\\/s3\\/.*)\$").test(location.href)) {
  css += `
  /* FILES */

  .s3-files .file-wrapper .file-wrapper-table{
      background: var(--bg2);
      padding: 0;
  }

  body > li.box, .s3-files ul.boxes li, li.box_draggable{
      background: var(--bg2h);
      padding: 10px 20px;
      border: none;
  }

  .s3-files ul.boxes li:nth-child(2n-1){
      background: var(--bg2);   
  }

  .s3-files ul.boxes li span.checkbox{
      left: 20px;
  }

  .s3-files ul.boxes li div.objectname span.name{
      color: var(--link3);
  }

  .s3-files ul.boxes li.active{
      background: #00ff0b20 !important;
  }

  .s3-files ul.boxes li.active:nth-child(2n-1){
      background: #00ff0b15 !important;
  }

  .pagination-wrapper .s3-selector .selector-title{
      background: var(--bg2);
      color: var(--text2);
  }

  .pagination-wrapper .s3-selector .selector-checkbox{
      background: var(--bg2);
  }

  .pagination-wrapper .group-operation-wrapper .s3-select.white + .chzn-container a.chzn-single{
      background: var(--bg2) !important;
      color: var(--text2) !important;
      border: none !important;
  }

  .s3-files .group-operation-wrapper .s3-select.white + .chzn-container a.chzn-single:hover, .s3-image .group-operation-wrapper .s3-select.white + .chzn-container a.chzn-single:hover{
      background: var(--bg3) !important;
  }

  .pagination-wrapper .s3-select.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-results{
      background: var(--bg) !important;
  }

  .pagination-wrapper .s3-action-select .s3-select.white + .chzn-container .chzn-drop .chzn-results li{
      color: var(--text2) !important;
  }

  .s3-action-select .s3-select.white + .chzn-container.chzn-container-active .chzn-drop .chzn-results .group-option:before, .pagination-wrapper .s3-action-select .s3-select.white + .chzn-container .chzn-drop .chzn-results .group-option.move-to-category:before, .pagination-wrapper .s3-action-select .s3-select.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-results .group-option.move-to-category:before, .pagination-wrapper .s3-action-select .s3-select.white + .chzn-container.chzn-container-active .chzn-drop .chzn-results .group-option.move-to-category:before, .pagination-wrapper .s3-action-select .s3-select.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-results .group-option.delete-from-category:before, .pagination-wrapper .s3-action-select .s3-select.white + .chzn-container.chzn-container-active .chzn-drop .chzn-results .group-option.delete-from-category:before, ul.s3-data-list-new .controls .s3-ico{
      filter: invert(1);
  }

  .pagination-wrapper .s3-action-select .s3-select.white + .chzn-container .chzn-drop .chzn-results li.action.delete:before, .pagination-wrapper .s3-action-select .s3-select.white + .chzn-container.chzn-with-drop .chzn-drop .chzn-results li.action.delete:before, .pagination-wrapper .s3-action-select .s3-select.white + .chzn-container.chzn-container-active .chzn-drop .chzn-results li.action.delete:before{
      filter: invert(0);
  }

  .pagination-wrapper .chzn-container-single .chzn-single span{
      color: var(--text2) !important;
  }

  .pagination-wrapper .s3-action-select .s3-select.white + .chzn-container a.chzn-single > div b, .pagination-wrapper .s3-action-select .s3-select.white + .chzn-container.chzn-with-drop a.chzn-single > div b{
      filter: invert(1);
  }

  .pagination-wrapper .group-operation-wrapper > span.action.visible:after{
      content: url(/my/s3/images/svg_icons/oah_icons/oah-apply2.svg);
      position: relative;
      left: 6px;
      top: 6px;
  }

  .file-form .upload-title span{
      background: var(--bg2);
      color: var(--link);
  }

  div.s3-actions-panel-wrap .tasks .cron-tasks-list, #editorWrapper .tasks .cron-tasks-list{
      background: var(--bg2h);
      border: none;
      box-shadow: 0 5px 20px 0 var(--bg);
  }

  #fsUploadCountFiles ul.boxes.data-list li.box .title .name, #uriUploadCountFiles ul.boxes.data-list li.box .title .name{
      color: var(--text);
  }

  #fsUploadCountFiles ul.boxes.data-list li.box .title .size, #uriUploadCountFiles ul.boxes.data-list li.box .title .size{
      color: var(--text2);
  }

  #fsUploadCountFiles .block-title, #uriUploadCountFiles .block-title{
      color: var(--text);
  }

  /* 
  body > li.box .file-right-side, .s3-files .file-right-side, li.box_draggable .file-right-side, .s3-files .file-wrap-table-titles .file-right-side{
      width: auto;
      display: flex;
  } */

  #fsUploadCountFiles ul.boxes.data-list li.box span.progress, #uriUploadCountFiles ul.boxes.data-list li.box span.progress{
      background: var(--select);
  }

  .s3-content #editorWrapper #editorContent .tab-body .s3-sb-img-edit-wrap .img-title{
  	background: var(--bg2);
  }

  .s3-content #editorWrapper #editorContent .tab-body .s3-sb-img-edit-wrap .img-edit{
  	background: none;
  }

  .s3-content #editorWrapper #editorContent .tab-body .s3-sb-img-edit-wrap .img-edit .img-info tr td.info{
  	color: var(--text);
  }

  #editor-loader img{
  	filter: invert(0.8);
  }
  `;
}
if (new RegExp("^(?:.*\\/my\\/s3\\/.*)\$").test(location.href)) {
		css += `
		/* ARTICLES AND NEWS*/

		.s3_news_list .boxes_wrapper, .s3_news_list .action-panel, .s3_news_wrapper .news_list_table, .posts-list > tbody > tr, .s3-module-list.s3-blog-redesign .boxes_wrapper, .s3-module-list table.boxes > tbody > tr:nth-child(2n-1), .s3-module-list.s3-blog-redesign .action-panel, .article_list_table, .article_list_table table.posts-list #article_container > tr:nth-child(2n-1){
			background: var(--bg2);
		}

		.s3_news_list .boxes_wrapper table.boxes tbody tr.box:nth-child(odd), .s3_news_wrapper .news_list_table .boxes tbody tr:nth-child(odd), .s3-module-list table.boxes > tbody > tr{
			background: var(--bg2h);
		}

		.s3_news_list .boxes_wrapper table.boxes tbody tr.box, .s3_news_wrapper .news_list_table .boxes tbody tr, .s3_news_wrapper .news_list_table .boxes tbody tr:last-child, .s3-module-list table.boxes > tbody > tr:first-child, .article_list_table table.posts-list #article_container > tr:nth-child(2n-1), .posts-list > tbody > tr, .s3-module-list table.boxes > tbody > tr{
			border-color: var(--bg3);
		}

		.s3_news_list .boxes_wrapper table.boxes tbody tr.box td.module-element-name, .s3_news_list .boxes_wrapper table.boxes tbody tr.box td.module-element-controls .params, .s3-module-list.s3-blog-redesign .boxes_wrapper table.boxes tbody tr.box td.module-element-controls .params, .s3-module-list.s3-blog-redesign .boxes_wrapper table.boxes tbody tr.box td.module-element-name, .article_list_table table.posts-list #article_container > tr > td.post-name span.article2-post-name, .s3-module-list table.boxes > tbody > tr td span.objectName{
			color: var(--link);
		}

		.s3-actions-panel-wrap.article_block .s3-panel-blog-menu{
			border-radius: 5px;
			overflow: hidden;
			position: relative;
			background: none;
		}

		.s3-actions-panel-wrap.article_block .s3-panel-blog-menu .menu-button{
			transition: .2s;
		}

		.s3-actions-panel-wrap.article_block .s3-panel-blog-menu .menu-button:hover, .s3-actions-panel-wrap.article_block .s3-panel-blog-menu .menu-button:last-child:hover{
			background: var(--linkh);
			border-color: var(--linkh);
			transition: .2s;
		}

		.s3_news_list .boxes_wrapper table.boxes tbody tr.box td, .s3-module-list.s3-blog-redesign .boxes_wrapper table.boxes tbody tr.box td{
			color: var(--text2);
		}

		.news-pagination-wrap .s3-per-page-controller, .news-pagination-wrap .s3-sort, .s3-module-list.s3-blog-redesign .action-panel-new .s3-sort, .s3-content-grid > tbody > tr > td.content-wrapper .article2-items-wrapper .article2-pagination-wrap .s3-per-page-controller, .s3-content-grid > tbody > tr > td.content-wrapper .article2-items-wrapper .article2-pagination-wrap .s3-sort{
			background: var(--bg3);
			color: var(--text);
			box-shadow: none;
			border: none;
		}

		.news-pagination-wrap .s3-sort .sort-selector, .s3-module-list.s3-blog-redesign .action-panel-new .s3-sort .sort-selector, .s3-actions-panel-wrap.article_block .s3-panel-blog-menu .menu-button .name, .s3-content-grid > tbody > tr > td.content-wrapper .article2-items-wrapper .article2-pagination-wrap .s3-sort .sort-selector{
			color: var(--text);
		}

		.s3-actions-panel-wrap.article_block .s3-panel-blog-menu .menu-button{
			border-left-color: var(--bg3h);
			border-right-color: var(--bg3h);
		}

		.news-pagination-wrap .s3-sort .sort-selector .s3-ico.i-bot-arrow-s-grey, .s3-module-list.s3-blog-redesign .action-panel-new .s3-sort .sort-selector .s3-ico.i-bot-arrow-s-grey, .s3-content-grid > tbody > tr > td.content-wrapper .article2-items-wrapper .article2-pagination-wrap .s3-sort .sort-selector .s3-ico.i-bot-arrow-s-grey{
			filter: invert(1);
		}

		.news-pagination-wrap .s3-sort .sort-icon .s3-ico.i-desc{
			filter: brightness(2);
		}

		.news-pagination-wrap .article-list-view-params .s3-btn.grey-flat, .s3-actions-panel-wrap.article_block .s3-panel-blog-menu .menu-button{
			background: var(--bg3);
			box-shadow: none;
		}

		.s3_news_wrapper .s3-actions-panel-wrap .s3-actions-panel .s3-btn.w-ico-param, .s3-sort .sort-selector .context-menu, .s3_news_wrapper .s3-actions-panel-wrap .s3-actions-panel .s3-btn.white-gray.w-ico-first{
			background: var(--bg3);
			color: var(--text) !important;
		}

		.s3-sort .sort-selector .context-menu ul li .s3-ico{
			background: var(--text2);
			border: none;
		}

		.article2-items-wrapper .article2-pagination-wrap .article-list-view-params .context-menu.article2-view, .news-pagination-wrap .article-list-view-params .context-menu{
			background: var(--bg2);
		}

		.article2-items-wrapper .article2-pagination-wrap .article-list-view-params .context-menu.article2-view .no-close form div label, .news-pagination-wrap .article-list-view-params .context-menu .no-close form div label{
			color: var(--text2);
		}

		.s3-btn.white, .s3-btn, .menu-actions-wrap.redesign .adaptive-controls .s3-radio-tabs.medium label.s3-rb{
			background: var(--bg3) !important;
			color: var(--text) !important;
			box-shadow: none !important;
		}

		.s3_news_wrapper span.objectEdit{
			color: var(--link) !important;
		}

		.s3-actions-panel-wrap.article_block .s3-actions-panel form.search-form .search-inputs-wrap{
			background: var(--bg);
		}

		.s3-actions-panel-wrap.article_block .s3-actions-panel form.search-form .search-inputs-wrap input{
			color: var(--text2);
		}

		.s3-actions-panel-wrap.article_block .s3-actions-panel form.search-form .search-butt{
			background-color: var(--text3);
			filter: invert(1);
		}
		`;
}
if (new RegExp("^(?:.*\\/my\\/s3\\/.*)\$").test(location.href)) {
  css += `
  /* SETTINGS */

  .s3-main-settings .settings-row, .s3-main-seo .settings-row, .s3-backups .settings-row{
      background: var(--bg2);
      border: none;
  }

  .s3-main-settings .settings-row h4, .s3-main-settings .settings-row.staffUser h4{
      color: var(--text) !important;
      font-weight: 700;
      font-size: 18px;
  }

  .color-scheme-wrapper{
      display: flex;
  }

  .s3-main-settings .settings-row .color-scheme-wrapper .color-scheme-selected{
      border: none;
      background: var(--bg);
  }

  .s3-version-settings .s3-version-json-wrapper .s3-version-json, .s3-version-settings .s3-version-json-wrapper + .s3-version-data-blocks{
  	background: var(--bg2);
  	border: none;
  }

  .s3-data-list .data-list-item:nth-child(odd){
  	background: var(--bg2h);
  }

  .s3-data-list .data-list-item .item-col.name{
  	color: var(--link);
  }

  .s3-data-list-title{
  	font-weight: 700;
  	color: var(--link);
  }

  .color-scheme-item, .s3-main-settings .settings-row, .s3-main-seo .settings-row, .s3-backups .settings-row, .s3-main-settings .settings-row .s3-cb strong, .s3-main-settings .settings-row .sms-setting-item, .s3-main-settings .settings-row .setting-item{
  	color: #fff !important;
  }

  .s3-main-settings .settings-row .s3_settings_notice, ._s3-alert-container, .s3-main-seo .settings-row .warning{
  	background: var(--link4d);
  	border-radius: 5px;
  	color: #fff !important;
  }

  ._s3-block-container .data-list+._container-title{
  	color: var(--text);
  }

  ul.boxes.data-list li.box .toggler, ul.boxes.data-list li.box .switcher{
  	background: transparent;
  }

  .s3-select + .chzn-container{
  	width: auto !important;
  }

  .s3-main-settings .settings-row .s3-select.white + .chzn-container a.chzn-single{
  	border: none !important;
  }

  .s3-integration-new .s3-integration-item{
  	border-radius: 10px;
  	background: var(--bg2);
  	border: none;
  }

  .s3-integration-item .s3-integration-item-name, .s3-integration-title{
  	color: var(--text);
  }

  .s3-integration-new .s3-integration-item .s3-integration-item-image img{
  	border-radius: 5px;
  	color: var(--text);
  }

  ._s3-block-container{
  	background: var(--bg2);
  }

  ._s3-gray-container{
  	background: var(--bg);
  	border: none;
  	color: var(--text);
  }

  ._ctypto-cert-desc__row ._ctypto-cert-desc__title{
  	color: var(--text);
  }

  ._ctypto-cert-desc__row ._ctypto-cert-desc__text{
  	color: var(--text2);
  }

  ul.boxes.data-list li.box .settings .s3-ico.i-gear-svg, ul.boxes.data-list li.box .settings .s3-ico.i-info, ul.boxes.data-list li.box .force .s3-ico.i-force, ul.boxes.data-list li.box .settings .s3-ico.i-ol-results, ul.boxes.data-list li.box .copy .s3-ico.i-copy-svg{
  	background-color: transparent;
  }

  ul.boxes.data-list li.box .settings{
  	border-color: var(--bg3);
  }

  .empty_events_wrapper{
  	background-color: var(--select) !important;
  }

  `;
}
if (new RegExp("^(?:.*\\/my\\/s3\\/.*)\$").test(location.href)) {
		css += `
		/* 1400px- fixes */

		.shop2-menu .shop2-menu-button.double span.name, .shop2-menu .shop2-menu-button span.name{
			font-size: 12px;
		}

		.shop2-menu .shop2-menu-button.without-border:not(.double), .shop2-menu .shop2-menu-button.tasks, .shop2-menu .shop2-menu-button[data-access="shop2.settings"]{
			padding: 12px 8px !important;
			margin: 0 3px !important;
		}
		`;
}
if (new RegExp("^(?:.*\\/my\\/s3\\/.*)\$").test(location.href)) {
  css += `
  /* CLEAN SPAM */

  .btn__open-context__help__wrap, .form-question, #help_container, a[href='#tab-page_advertise'], a[title='Рекламировать'], .new-info-block-wrapper, div#divContent > div[style="float: right;"], div.params-note, .i-help-svg, [data-metrika="topMenuClickUpgrades"]{
      display: none !important;
  }

  ._dashboard__row:first-child{
      display: none !important;
  }


  `;
}
if (new RegExp("^(?:.*\\/my\\/s3\\/.*)\$").test(location.href)) {
		css += `
		/* FIXES */


		.tree-wrapper .s3-tree-wr .s3-tree-wrapper .s3-tree-wrapper-in .s3-tree ul li > div.dynatree-node.linked .dynatree-icon[title='Категория-фильтр']{
			background: url("/my/s3/images/svg_icons/oah_icons/oah-filter-category.svg") !important;
		}

		[style="display: inline-flex;padding: .4rem;background-color:#BDECB6;margin: 0;"]{
		    
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
