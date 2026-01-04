// ==UserScript==
// @name         bilibili 移动端
// @namespace    https://github.com/jk278/bilibili-mobile
// @version      5.2.3.1
// @author       jk278
// @description  Safari打开电脑模式，其它浏览器关闭电脑模式修改网站UA，获取舒适的移动端体验。
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://*.bilibili.com/*
// @exclude      https://message.bilibili.com/pages/nav/*
// @exclude      https://www.bilibili.com/blackboard/comment-detail.html?*
// @require      https://unpkg.com/js-md5@latest/src/md5.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/490548/bilibili%20%E7%A7%BB%E5%8A%A8%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/490548/bilibili%20%E7%A7%BB%E5%8A%A8%E7%AB%AF.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const i=document.createElement("style");i.textContent=t,document.head.append(i)})(' html{background-color:#fff!important}body{--actionbar-height: 40px;--overlay-time: .4s;--actionbar-time: .5s}#actionbar{position:fixed;bottom:0;width:100vw;height:var(--actionbar-height);z-index:2;display:flex;justify-content:space-evenly;align-items:center;background-color:#fff9;transition:var(--actionbar-time) transform ease-in;opacity:0;animation:actionbarFadeIn .4s ease-in forwards;-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}@keyframes actionbarFadeIn{to{opacity:1}}[scroll-hidden] #actionbar{transform:translateY(100%)}#actionbar>*{padding:8px}#full-now,#sidebar-fab,#refresh-fab,#show-more-fab{display:none}#actionbar.home #refresh-fab,#actionbar.video #full-now,#actionbar.list #full-now{display:block}#actionbar.message #menu-fab{display:none}#actionbar.video #sidebar-fab,#actionbar.list #sidebar-fab,#actionbar.message #sidebar-fab{display:block}#actionbar.video #my-top,#actionbar.list #my-top,#actionbar.message #my-top{display:none}#actionbar.search #show-more-fab,#actionbar.space #show-more-fab{display:block}#menu-fab{position:relative}#search-fab,#menu-fab{z-index:0;transition:z-index var(--overlay-time) ease-in}#search-fab.active,#menu-fab.active{z-index:10}#show-more-fab{transition:transform .4s ease-in}#show-more-fab.reverse{transform:rotate(180deg)}#search-fab{display:flex;padding:4px 8px;max-width:40%;align-items:center}#search-fab svg{flex:0 0 24px}#search-fab-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#header-in-menu{position:absolute!important;top:100vh;left:calc((200vw + 20px) / 3);background-color:#fff;padding:5px 0;white-space:nowrap;box-shadow:0 0 3px #00000080;border-radius:5px;font-size:16px;transform:translate(-50%);transition:transform var(--overlay-time) ease-in}#header-in-menu li{list-style-type:none;padding:5px 30px;line-height:20px!important}body #header-in-menu li{position:relative;padding:5px 30px!important;line-height:20px!important}#header-in-menu.show{transform:translate(-50%,calc(-100% - var(--actionbar-height) - 5px))}.badge{position:absolute;top:6px;left:63px;display:inline-flex;align-items:center;justify-content:center;height:16px;padding:0 4.5px 1px;border-radius:8px;background-color:red;color:#fff;font-size:12px;visibility:hidden}#menu-overlay,#search-overlay,#sidebar-overlay,#ai-conclusion-overlay{position:fixed;bottom:0;height:100vh;left:0;right:0;pointer-events:none;background-color:#0000004d;opacity:0;transition:opacity var(--overlay-time) ease-in}#menu-overlay.show,#search-overlay.show,#sidebar-overlay.show,#ai-conclusion-overlay.show{pointer-events:auto;opacity:1}#toast{position:fixed;left:0;bottom:var(--actionbar-height);transform:translate(calc(50vw - 50%),100%);z-index:1;font-size:14px;line-height:20px;padding:5px 12px;margin-bottom:5px;background-color:#fff;border:1px solid var(--line_regular);border-radius:16px;opacity:0;transition:.3s ease-in;display:none}#toast[show]{transform:translate(calc(50vw - 50%));opacity:1}.bpx-player-container #toast{color:var(--text4);background-color:#00000080}.floor-single-card:has(.skeleton,.skeleton-item){display:none}.setting-panel{position:fixed;top:50%;left:50%;background:#fff;z-index:1002;border:1px solid var(--line_regular);flex-direction:column;padding:10px 5px;border-radius:10px;font-size:16px;max-height:calc(100vh - var(--actionbar-height) - 10px);width:260px;max-width:calc(100% - 20px);box-shadow:0 0 3px #0000004d;opacity:0;transform:translate(-50%,-50%) scale(.9);transition:.4s ease-in;display:none}.setting-panel[show]{opacity:1;transform:translate(-50%,-50%)}.setting-panel.mini{opacity:1;transform:translate(-50%,-50%);display:flex;width:150px}.mini .setting-checkboxes label{height:16px}.setting-title{margin:0 5px 5px;padding-bottom:5px;border-bottom:1px solid var(--line_regular);text-align:center;color:var(--Ga7)}.setting-checkboxes{display:flex;flex-direction:column;overflow:auto}.setting-checkboxes label{margin:5px;display:flex;align-items:center}.setting-checkboxes span,.setting-checkboxes details{flex-grow:1;text-align:center}.setting-checkboxes input[type=checkbox]{width:16px;height:26px}.setting-checkboxes input[type=number]{width:40px;-webkit-appearance:textfield;-moz-appearance:textfield;appearance:textfield;height:22px}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}.setting-conform{margin:8px 5px 3px;height:28px;border-radius:14px;border:1px solid var(--line_regular);background-color:var(--graph_bg_thin)!important}label:has([data-key=menu-dialog-move-down])+label{display:none}label:has([data-key=menu-dialog-move-down]:checked)+label{display:flex}.setting-content{font-size:14px}.setting-content a{text-decoration:underline}#follow-list-dialog{z-index:2}#follow-list-dialog .list-item{border-bottom:1px solid #eee;padding:10px 0 8px}ul.follow-list-content{height:480px;overflow-y:auto;padding:10px}#follow-list-dialog .cover-container{position:static;width:60px;height:60px;float:left}#follow-list-dialog .content{margin:10px 0 8px 75px}.list-item a.title{font-size:16px;line-height:20px;height:20px;margin-bottom:6px;display:inline-block}.list-item .auth-description{display:-webkit-box;-webkit-box-orient:vertical;line-clamp:2;-webkit-line-clamp:2;overflow:hidden;font-size:13px;line-height:15px;height:30px;line-break:anywhere}.follow-list-content .list-item .fans-action{position:absolute;right:0;top:unset;transform:translateY(-58px);z-index:1}.list-item .be-dropdown{display:inline-block}.list-item .fans-action-btn{padding:4px 9px 4px 7px;margin-right:4px;background-color:#e5e9ef;border-radius:4px;color:#6d757a;float:left;line-height:16px;font-size:0}.fans-action-btn .video-commonmenu{vertical-align:middle;margin-right:2px}div.fans-action-btn.follow{line-height:16px;height:24px;border:none;width:70px;box-sizing:border-box;text-align:center}.fans-action-text{line-height:16px;font-size:12px;vertical-align:middle}.follow-list-content ul.be-dropdown-menu{top:30px;border:1px solid #e5e9ef;border-radius:8px;box-shadow:0 2px 4px #00000024}.follow-list-content li.be-dropdown-item{height:28px;line-height:28px;padding:0}.follow-list-content .be-dropdown-trigger+.be-dropdown-menu{right:0;padding:3px 10px}#progress-info{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background-color:#000000b3;color:#fff;padding:10px;border-radius:5px;z-index:1000;display:none}#biliMainHeader,#bili-header-container,#home_nav{position:fixed;width:100%;z-index:62;top:-64px!important}#bili-header-container{background:unset!important}.large-header .bili-header__bar{top:-64px!important;position:fixed!important}.fixed-header .bili-header__bar{position:absolute!important}div.mini-header{box-shadow:unset}.center-search-container{position:absolute!important;width:100%;left:0;top:64px;padding:10px 20px 5px!important;z-index:3;margin:0!important;opacity:0;transform:scale(.9);transition:.4s ease-in;display:none}.center-search-container[show]{opacity:1;transform:none}.center-search-container #nav-searchform{border-radius:8px 8px 0 0!important;border-bottom:none!important;background:#fff!important;opacity:1!important}.center-search-container #nav-searchform .nav-search-content{background-color:var(--graph_bg_thick)!important}.nav-search-input{width:100%}.center-search-container .search-panel{display:block!important}.history-item .close{display:none}.animated-banner,#bili-header-banner-img,.biliheader__banner,.adblock-tips{display:none!important}div.bili-header .v-popover{position:fixed;margin:0!important;max-width:100%;padding:0 5px!important;left:50%;opacity:0;transition:.4s ease-in;display:none;top:50vh!important;transform:translate(-50%,-50%) scale(.9)}div.bili-header .v-popover[display]{display:block!important}div.bili-header .v-popover[show]{opacity:1;transform:translate(-50%,-50%)!important}.bili-header.false-header{min-height:0;pointer-events:none}.bili-header.false-header:has(>[show]){pointer-events:auto}#copy-category-dialog.v-popover{display:none;z-index:2;width:80%;max-width:300px}div.bili-header-channel-panel{display:flex;flex-direction:row;padding:5px}.channel-panel__column{flex:1;display:flex;flex-direction:column;align-items:center}.channel-panel__column a{padding:7.5px 5px;text-align:center}.dynamic-panel-popover,.favorite-panel-popover,.history-panel-popover{max-width:100%;padding:0 5px!important}.message-entry-popover .message-inner-list__item{padding-left:43px!important}.dynamic-video-item{margin-right:0!important}.header-dynamic-list-item{padding:0!important;margin:10px 0!important}.header-dynamic__box--center{max-width:60%}.header-dynamic__box--right{top:0!important;margin-bottom:0!important;width:unset!important;flex:1}.header-dynamic__box--right .cover{width:unset!important;height:unset!important}.wnd_bottom{max-width:calc(100% - 40px);display:none}.favorite-panel-popover__nav{max-width:25%}.header-fav-card__image{max-width:40%}.header-fav-card__image picture{max-width:100%;height:100%!important}.favorite-panel-popover__nav .tab-item{padding:0 6px!important}.header-fav-card{padding:6px!important}.favorite-panel-popover__nav{margin-top:6px!important}.header-history-video{padding:5px 10px!important}a.view-all-history-btn{display:none!important}.header-tabs-panel__content #nav-searchform{display:flex;align-items:center;padding:6px 48px 0 15px;position:relative;height:40px;background-color:#fff;transition:background-color .3s}.header-tabs-panel__content .nav-search-btn{position:absolute;top:9px;right:7px;display:flex;align-items:center;justify-content:center;width:32px;height:32px}.header-tabs-panel__content .nav-search-content{display:flex;align-items:center;justify-content:space-between;padding:0 8px;width:100%;height:32px;border-radius:6px;background-color:var(--graph_bg_thick)!important}.header-tabs-panel__content input.nav-search-input{flex:1;margin-right:8px;border:none;background-color:transparent;box-shadow:none;color:var(--text2);font-size:14px;line-height:32px}.header-tabs-panel__content .nav-search-clean{width:16px;height:16px;cursor:pointer}.header-entry-avatar{display:none!important}.header-entry-mini{animation:unset!important}.left-entry>li:not(:nth-of-type(1)),.vip-wrap,.right-entry-item:has(>.vip-wrap),.right-entry-item:nth-of-type(6),.right-entry-item--upload,.header-channel,.bili-header__channel,.recommended-swipe,.feed-roll-btn{display:none!important}.header-banner__inner{display:none!important}.login-panel-popover{max-width:100%}body{background:#fff!important}.recommended-container_floor-aside .container{grid-template-columns:repeat(2,1fr)!important;padding:8px;grid-gap:8px!important;background-color:#f1f2f3}.bili-header__banner{background-color:#f1f2f3!important;height:50vw!important}.container>.feed-card{display:block!important}body,.bili-header,.bili-header__banner{min-width:0!important}.bili-feed4-layout{width:100%!important}.container>*:has(.bili-video-card__info--ad),.container>*:has(.bili-video-card__info--creative-ad),.container>*:has([href^="//cm.bilibili.com/cm/api/"]),.floor-single-card{display:none!important}.feed-card:not(:has(.bili-video-card__wrap)),.bili-video-card.is-rcmd:not(:has(.bili-video-card__wrap)){display:none!important}.desktop-download-tip,.lt-row,.vip-entry-containter{display:none!important}.bili-video-card *:before,.bili-video-card *:after{width:100%;white-space:wrap!important;word-break:break-all}.container>*{margin-top:0!important}.bili-video-card__wrap,.bili-live-card__wrap{border-radius:5px}.bili-live-card__wrap{height:100%}.bili-video-card.is-rcmd,.bili-live-card.is-rcmd{--cover-radio: 66.67% !important}.v-img.bili-video-card__cover,.v-img.bili-live-card__cover{border-radius:5px 5px 0 0!important}.bili-video-card__stats,.bili-live-card__stats{border-radius:0!important;--icon-size: 16px;--subtitle-font-size: 11px;white-space:nowrap}.bili-video-card__info,.bili-live-card__info{--title-padding-right: 22px;--title-line-height: 20px;--title-font-size: 13px;--no-interest-entry-size: 22px;--info-margin-top: 7px;padding-bottom:5px;text-align:justify}.bili-video-card__info--right,.bili-live-card__info--text{padding:0 5px}.bili-video-card__info--bottom,.bili-live-card__info--uname{--subtitle-font-size: 12px}.bili-video-card__info--icon-text{padding:0 5px!important}.bili-video-card__info--owner{flex:1}.bili-video-card__info--date{margin-left:auto!important}.bili-video-card__info--icon-text{--follow-icon-font-size: 11px;--follow-icon-line-height: 15px}div.bili-live-card .bili-live-card__info--living{font-size:11px}div.bili-video-card .bili-video-card__info--no-interest,div.bili-live-card .bili-live-card__info--no-interest{display:flex!important;top:calc((var(--title-line-height) * 2 - var(--no-interest-entry-size)) / 2);right:2px;opacity:0;transition:opacity .2s ease-in}.bili-video-card .bili-video-card__info--no-interest:has(svg path),.bili-live-card .bili-live-card__info--no-interest:has(svg path){opacity:1}div.bili-video-card[data-has-ai=true] .bili-video-card__info--no-interest:after{content:"";position:absolute;top:0;right:3px;width:3px;height:3px;background-color:#00aeec;border-radius:50%}.bili-video-card__no-interest{--no-interest-module-gap: 5px;--no-interest-btn-horizontal-padding: var(--no-interest-btn-vertical-padding)}.bili-video-card__no-interest .revert-btn{flex-direction:column}.bili-watch-later.bili-watch-later--pip span{display:none}.bili-video-card__image--wrap:has(>.mouse-in)+.bili-video-card__mask{visibility:hidden;opacity:0}.inline-progress-bar{position:absolute;bottom:0;height:4px;left:0;width:100%;z-index:2;background-color:#ddd;display:none}.v-inline-player.mouse-in+.inline-progress-bar{display:block}.inline-progress-bar-filled{position:absolute;top:0;left:0;bottom:0;background-color:#007bff}.inline-progress-bar-thumb{position:absolute;top:-4px;left:0;width:12px;height:12px;transform:translate(-2px);background-color:#fff;border:1px solid #ccc;border-radius:50%;cursor:pointer;touch-action:none;pointer-events:auto}#ai-conclusion-overlay{z-index:2}.ai-conclusion-card{position:fixed;max-height:530px;width:400px;z-index:99;color:#000;filter:drop-shadow(rgba(0,0,0,.5) 0px 0px 15px);padding-bottom:1.25rem;overflow:auto;border-radius:.5rem;border-width:1px;background:#fff}.ai-conclusion-card .ai-conclusion-card-header{font-weight:700;padding:1.25rem;background:linear-gradient(to bottom,#c8e1ff,#fff)}.ai-conclusion-card .ai-conclusion-card-header .ai-conclusion-card-header-left{display:flex;align-items:center}.ai-conclusion-card .ai-conclusion-card-summary{margin-bottom:1.25rem;font-weight:700;padding:0px 1.25rem}.ai-conclusion-card .ai-conclusion-card-selection{margin-bottom:1.25rem;padding:0px 1.25rem}.ai-conclusion-card .ai-conclusion-card-selection .ai-conclusion-card-selection-title{display:flex;font-weight:700;cursor:pointer;margin-bottom:1rem}.palette-button-outer{display:none}.primary-btn,span.btn-text-inner,.storage-box,.login-scan-wp,.bili-mini-line{display:none!important}.bili-mini-content-wp{padding:52px 0 29px!important}.bili-mini-login-right-wp,.bili-mini-login-right-wp *{max-width:80vw}#i_cecream{min-width:0!important;min-height:calc(100vh - var(--actionbar-height))!important}button.vui_button{min-width:0}div.i_wrapper{padding:0 5px}.search-tabs.i_wrapper{padding-top:10px!important}.vui_tabs--nav-link{padding:0 1px!important;flex-direction:column}ul.vui_tabs--nav>*{flex:1}.vui_tabs--nav-item:nth-child(1) .vui_tabs--nav-text{padding-bottom:17px}.vui_tabs--nav-item:nth-child(2){order:-1}.vui_tabs--nav-item:nth-child(3){order:-2}.vui_tabs--nav-item:nth-child(4){order:-3}.vui_tabs--nav-item:nth-child(5){order:3}.vui_tabs--nav-item:nth-child(6){order:2}.vui_tabs--nav-item:nth-child(7){order:1}.activity-game-list{display:none}.search-conditions{position:fixed;bottom:0;z-index:2;background:#fff;padding:5px!important;opacity:0;transition:var(--actionbar-time) ease-in;pointer-events:none}.search-conditions.show{bottom:var(--actionbar-height);opacity:1;pointer-events:auto}[scroll-hidden] div.search-conditions{bottom:0}.search-condition-row>.vui_button{width:33.3%;margin:0!important}.search-condition-row{width:100%}.conditions-order{position:relative}.conditions-order .i_button_more{position:absolute;bottom:0;left:66.6%;padding-left:23px!important;border:0;width:33.3%}.search-input{display:none}.search-page .video-list>div{flex:0 0 50%;max-width:50%;padding:0 4px!important;margin-bottom:10px}.search-content{padding:0 5px!important}.search-page-wrapper .search-page{margin-top:8px!important;padding-bottom:0!important}div.search-page.search-page-all{--list_padding: 10px}.i_wrapper.p_relative:has(.watch-more){margin-bottom:var(--list_padding)}.search-page-all div.i_wrapper.search-all-list{padding-top:12px}.search-page .bili-video-card h3.bili-video-card__info--tit{padding-right:0}.search-page .flex_center{margin:5px 0 10px!important}.vui_pagenation{width:100%}.vui_pagenation--jump .vui_pagenation--btns{margin-right:0!important}div.vui_pagenation--btns{display:flex;flex-wrap:wrap;justify-content:space-between;width:100%;--calc-margin: calc((100% - 34px * 7) / 14);position:relative;margin-bottom:34px}.vui_pagenation--btns>*{max-width:34px;margin:0 var(--calc-margin) 10px!important}.vui_pagenation--btn-side{overflow:hidden;position:absolute;top:0}.vui_pagenation--btn-side:before{color:var(--v_text1);background-color:inherit;position:absolute;top:0;left:0;width:34px;font-size:20px}.vui_pagenation--btn-side:first-child:before{content:"<";padding:6.5px 9px 7.5px 5px}.vui_pagenation--btn-side:last-child:before{content:">";padding:5.5px 7px 8.5px}button.vui_pagenation--btn-side:first-child{margin:44px var(--calc-margin) 0!important}button.vui_pagenation--btn-num:nth-child(2){position:absolute;top:0;margin:44px 0 0 calc(var(--calc-margin) * 3 + 34px)!important}button.vui_pagenation--btn-num:nth-last-child(2){position:absolute;top:0;right:0;margin:44px calc(var(--calc-margin) * 3 + 34px) 0 0!important}button.vui_pagenation--btn-side:last-child{right:0;margin:44px var(--calc-margin) 0 0!important}.link-box{flex-direction:column;margin:0 10px!important}.bili-footer{min-width:0!important;padding:5px 0 var(--actionbar-height)!important}.b-footer-wrap{min-width:0!important;margin:0 5px!important}.link-box{flex-direction:column}.link-box>*{max-width:100%}.link-item__right,.other-link,.footer-icons{display:none!important}.media-item-col{max-width:100%!important;flex:none!important;margin-bottom:10px!important;padding:0!important}.media-list .col_6,.live-user-cards .col_6{max-width:100%!important;flex:none!important;--avatar-scale: 56px}.media-list .col_6{margin-bottom:10px!important}div.b-user-info-card{align-items:start}.col_6 .bili-avatar{height:var(--avatar-scale)!important;width:var(--avatar-scale)!important}.search-user-avatar{width:var(--avatar-scale)!important;min-width:var(--avatar-scale)!important}.avatar-wrap{height:var(--avatar-scale)!important}div.user-content,div.live-content{width:100%!important;padding-right:0!important}div.user-content{height:85px}.i_card_title{height:20px}h2.i_card_title>a{font-size:16px}.user-content span{position:absolute;left:calc(var(--avatar-scale) + 20px);top:50px;white-space:wrap!important;display:-webkit-box;-webkit-box-orient:vertical;line-clamp:2;-webkit-line-clamp:2;margin-right:10px}.user-actions,.live-actions{position:absolute;right:10px;top:20px}.user-actions button,.live-actions button{height:26px!important;width:70px!important;min-width:70px;border-radius:13px!important}.live-user-card{margin-bottom:10px!important}.live-tags{position:absolute;left:calc(var(--avatar-scale) + 15px);top:50px;max-width:calc(100% - var(--avatar-scale) - 30px)!important}div.live-content{height:65px}.search-user-avatar .live-tab{bottom:-16px!important}.show-more-text{margin:10px 0 20px!important;z-index:1!important}.media-item{padding:0!important}.media-card{--image-width: 103px !important;--image-height: 139px !important;--image-mg-r: 10px !important;margin-right:10px!important;--content-head-title-size: 14px !important;--content-title-mg-b: 0 !important;--content-text-mg-b: 0 !important}.media-card-content-footer-btns{--pgc_btn_size: 13px !important;--pgc_btn_w: 70px !important;--pgc_btn_h: 28px !important}.media-card-content-head-text{line-height:15px!important}.info-card.flex_start{width:100%}.search-logo.p_center_y{display:none}.wrapper,.space-main,.header-upinfo,.nav-bar__main,.space-dynamic__content{min-width:unset!important;max-width:100%}div.header.space-search-tip{justify-content:center}.space-search-tip+div{display:none}.space-home{flex-direction:column;margin-top:20px!important}.space-home .aside,.space-dynamic__right{--aside-width: calc(100% - 72px) !important}.nav-bar{z-index:2!important}.space-navbar .nav-search{display:none}.nav-bar__main{padding:0!important}.nav-bar__main-left{flex:1;margin-right:0!important}.nav-bar__main-left .nav-tab{flex:1;justify-content:space-evenly}.nav-tab__item{margin-left:0!important;flex-direction:column;height:46px!important}.nav-tab__item-text{margin-left:0!important}.space-header{height:260px!important}.header-upinfo-bg-shadow{background-color:#000;opacity:.1}.header-upinfo-bg-shadow div{background:none!important}.header-upinfo{align-self:center!important;padding:0 20px!important}.header-upinfo .upinfo__main{margin-right:0;align-items:flex-start!important}.header-upinfo .upinfo-avatar{margin-top:24px}.header-upinfo .header-sign{height:auto!important}.header-upinfo .header-sign .pure-text{display:block!important}.space-navbar .nav-statistics{position:absolute;top:0;right:0;transform:translateY(-100%);z-index:10;width:calc(100% - 20px);height:auto!important;display:flex;justify-content:space-evenly;padding:4px 0 5px;margin:0 10px;border-top:1px solid var(--line_regular)}.space-navbar .nav-statistics .nav-statistics__item-text,.space-navbar .nav-statistics .nav-statistics__item-num{color:var(--text_white)}.space-main{padding:10px!important}.section-wrap:not(.bangumi-section) .items{grid-template-columns:repeat(2,1fr)!important}.video-list__content{grid-template-columns:repeat(2,1fr)!important}.section-wrap__header:has(.radio-filter){height:68px!important;align-items:flex-start;margin-bottom:10px!important}.section-wrap .radio-filter{position:absolute;left:0;transform:translate(calc(50vw - 50%));margin:38px 0 0!important}.section-wrap .radio-filter .radio-filter__item{height:30px!important}.section-wrap .vui_button{height:30px;width:84px!important;padding:0 6px!important}.section-wrap .amount{text-wrap:nowrap}.top-video{flex-direction:column}.top-video__cover{width:100%!important;height:fit-content!important}.top-video__title{-webkit-line-clamp:2!important;line-clamp:2!important;margin-top:5px}.top-video__desc{-webkit-line-clamp:4!important;line-clamp:4!important}.masterpiece-block{display:grid!important;grid-template-columns:repeat(2,1fr)!important}.masterpiece-block .masterpiece-block__item{width:100%!important}.article-section .article-list{grid-template-columns:repeat(2,1fr)!important}.upinfo .operations{position:fixed;left:0;bottom:0!important;width:100%;z-index:1;display:flex;justify-content:space-evenly;align-items:center;opacity:0;transition:calc(var(--actionbar-time)*1.44) ease-in}.upinfo .operations.show{bottom:var(--actionbar-height)!important;opacity:1;z-index:10}[scroll-hidden] .header-upinfo .operations{transform:translateY(calc(100% + var(--actionbar-height)))}.operations .message-btn,.operations .more-actions__trigger,.operations .space-follow-btn.gray{color:var(--v_text1)!important;background:var(--v_bg1_float)!important;border:1px solid var(--v_line_regular)!important;box-shadow:0 0 0 1px var(--v_line_regular)!important}.vui_pagenation{padding:20px 0!important;width:100%!important;flex-direction:column}.space-dynamic{flex-direction:column;margin-top:10px!important}.space-dynamic .space-dynamic__left{height:auto;width:100%;top:unset!important}.space-dynamic .space-dynamic__left .side-nav{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:10px}.space-dynamic .space-dynamic__left .side-nav .side-nav__item{border:1px solid var(--line_regular);margin-top:0}#page-dynamic .col-1{max-width:100%}div.bili-dyn-item{min-width:0}div.bili-dyn-item__main{padding:0 15px 0 60px}div.bili-dyn-item__avatar{width:60px;height:77px}.bili-dyn-item__body{position:relative;left:-45px;width:calc(100% + 45px)}a.bili-dyn-card-video{border:1px solid var(--line_regular);border-radius:0 6px 6px 0}div.bili-dyn-card-video__header{width:40%;height:fit-content;align-self:center}div.bili-dyn-card-video__body{border:none;min-height:85px;padding:10px 12px 8px}div.bili-dyn-card-video__title{font-size:14px}.bili-album__preview__picture{width:100%!important;height:100%!important}div.bili-album__preview.grid6,div.bili-dyn-action{width:unset}div.bili-dyn-item__footer{position:relative;left:-45px;width:calc(100% + 45px);padding-right:0;justify-content:space-around}.space-upload{flex-direction:column;margin-top:10px!important}.space-upload .upload-sidenav{height:auto!important;width:100%!important;top:unset!important}.space-upload .upload-sidenav .side-nav{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:10px}.space-upload .upload-sidenav .side-nav .side-nav__item{border:1px solid var(--line_regular);margin-top:0}.space-favlist{flex-direction:column;margin-top:10px!important}.favlist-aside{margin:0!important;padding:0!important;width:100%!important;top:unset!important}.favlist-aside .vui_sidebar{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:10px}.favlist-aside .vui_sidebar .fav-sidebar-item{border:1px solid var(--line_regular);border-radius:6px}.space-upload .video-list{grid-template-columns:repeat(2,1fr)!important}.fav-list-header{margin-top:10px!important}.fav-list-header:has(.radio-filter){height:64px!important;align-items:flex-start;margin-bottom:10px!important}.fav-list-main .radio-filter{position:absolute;left:0;transform:translate(calc(50vw - 50%));margin:30px 0 0!important}.fav-list-main .radio-filter .radio-filter__item{height:30px!important}.fav-list-main .fav-list-header-filter__left{align-items:flex-start!important}.fav-list-main .items{grid-template-columns:repeat(2,1fr)!important}.space-subscribe{flex-direction:column;margin-top:10px!important}.space-subscribe .subscribe-sidebar{height:auto!important;width:100%!important;top:unset!important}.space-subscribe .subscribe-sidebar .side-nav{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:10px}.space-subscribe .subscribe-sidebar .side-nav .side-nav__item{border:1px solid var(--line_regular);margin-top:0}.bili-bangumi-card__cover{width:106px!important;height:163px!important}.bangumi-content .bangumi-items,.bangumi-section .items{grid-template-columns:repeat(1,1fr)!important}#page-index .col-1{max-width:calc(100% - 20px);padding:0 10px!important;border:none!important;margin-bottom:10px}.channel-video{white-space:wrap!important}.section-title{padding:0 5px 33px!important}.be-tab-item{margin:0 5px!important}.section .more,.section-title .play-all-channel{margin-right:5px}#page-index .video .content{max-height:unset!important}.small-item{width:calc(50% - 10px)!important;padding:5px!important}.small-item .cover{width:100%!important;height:auto!important}.small-item .title{text-align:justify;line-break:anywhere;display:-webkit-box;-webkit-box-orient:vertical;line-clamp:2;-webkit-line-clamp:2;text-overflow:ellipsis;padding:0 3px}#page-index .channel .channel-item .channel-title{padding:0 5px 34px}#page-index .channel .section-right-options{position:absolute;right:0;bottom:5px}#page-index .col-1 .section.empty:after{left:100px!important}#i-masterpiece{margin-left:0!important}#page-index .fav-item{margin:0 10px!important}#page-fav .fav-main{width:100%!important}.favInfo-details{max-width:60%;margin-left:5px!important}.fav-options>*{margin:0!important}.favList-info{padding:0!important;margin:0 10px!important}#app .to-top{display:none!important}.article-item .clearfix{display:flex}.article-content{min-width:0;padding-right:10px;overflow:hidden}.article-img{flex-shrink:0}.article-content .article-con a{height:54px;line-height:18px;white-space:normal;display:-webkit-box!important;-webkit-box-orient:vertical;line-clamp:3;-webkit-line-clamp:3}h2.article-title{max-height:unset;font-size:17px;line-height:20px}.article-title a{display:-webkit-box!important;-webkit-box-orient:vertical;line-clamp:2;-webkit-line-clamp:2}.article-content .meta-col{display:flex;justify-content:space-evenly;width:100vw}.article-content .meta-col span{margin-right:0}div.contribution-sidenav{width:100%}div.contribution-sidenav .contribution-list-container{margin-bottom:10px}.contribution-list{display:flex;justify-content:space-evenly}.contribution-sidenav li.contribution-item{padding-left:0;flex-grow:1;display:flex;justify-content:center;align-items:center}.contribution-sidenav a.text{width:auto}.contribution-sidenav .num{position:absolute;left:calc(50% + 28px);transform:translate(-50%)}.contribution-sidenav~div.main-content{max-width:100%;padding:10px}div.page-head{padding-bottom:33px}#page-video .page-head .be-tab{position:absolute;left:0;transform:translate(calc(50vw - 10px - 50%));margin:33px 0 0}#page-video .cube-list{max-width:100%}#page-video div#submit-video-list{margin-left:0}#page-video div#submit-video-type-filter a{margin-right:0;flex:25%}#submit-video .list .title{white-space:pre-wrap;height:auto;margin:5px 0}#page-video .list-item .cover div.b-img{width:100%;height:auto}#page-video .list-item div.c{margin:0}#page-video .list-item div.desc{margin-bottom:5px}#page-video .list-item div.desc:not(:has(>*)){display:none}#page-video #submit-video-type-filter a{flex-direction:column;line-height:20px;padding:2px 0}#page-video #submit-video-type-filter a span.count{margin-left:0}ul.be-pager{display:flex;flex-wrap:wrap;align-items:center;margin-bottom:var(--actionbar-height)}.be-pager li{width:34px;height:34px;line-height:34px;padding:0}.be-pager>*{margin-bottom:5px}.be-pager li.be-pager-prev,.be-pager li.be-pager-next{overflow:hidden;position:relative}.be-pager li.be-pager-prev:before,.be-pager li.be-pager-next:before{color:#18191c;background-color:inherit;position:absolute;left:0;top:0;font-size:20px;width:34px}.be-pager li.be-pager-prev:before{content:"<"}.be-pager li.be-pager-next:before{content:">"}#page-channel .series-item .video-list{flex-flow:wrap}#page-channel .series-item .video-list li{flex:50%}.video-list div.video-card{width:calc(100% - 10px);padding:5px}div.video-card.card-item .cover{width:100%;height:fit-content}#page-channel .series-item .header .btn{font-size:12px}#page-series-index .channel-list div.channel-item{width:calc(50% - 10px);margin:5px!important}.series-item .btn.play-btn{min-width:60px}.series-item .btn.more-btn{min-width:40px}.s-space .search-page{flex-direction:column;max-width:100%}.s-space .search-page .search-nav{display:flex}div.s-space .search-nav-item{padding-left:0;flex:50%;display:flex;justify-content:center;align-items:center}div.s-space .search-nav-item .text{width:unset}.s-space .search-page .feed-dynamic{max-width:100%;padding:0 12px}div.feed-dynamic .feed-card,div.feed-card .card{min-width:0}div.feed-card .card .main-content{width:calc(100% - 60px);margin-left:60px}div.feed-card .card .user-head{left:0}div.main-content .card-content{position:relative;left:-60px;width:calc(100% + 60px)}div.card-content .imagesbox{max-width:100%}div.card-content .video-container{max-width:100%;height:unset}.video-container .video-wrap{display:flex}div.card-content .video-container .image-area{flex:40%;height:fit-content;align-self:center}div.card-content .video-container .text-area{width:unset;margin:0 8px 0 12px;flex:60%}div.card-content .video-container .text-area .content{margin-top:5px;line-height:16px;height:unset}div.feed-dynamic-content .div-load-more .no-more{margin-bottom:var(--actionbar-height)}div.feed-dynamic-content .div-load-more .no-more .end-img{position:absolute;width:calc(100% + 24px);left:-12px;bottom:0}.h .h-basic{max-width:calc(100% - 82px)}.h #h-sign,.large-item{max-width:100%}div.sec-empty-hint{left:104px;top:3px}#page-follows div.follow-main{max-width:100%;border:none}#page-follows .list-item{padding:10px 0 8px}#page-follows .list-item div.content{padding-right:0;margin-left:75px}#page-follows .list-item .fans-action{top:0}#page-follows .follow-main .list-item p{display:-webkit-box;-webkit-box-orient:vertical;line-clamp:2;-webkit-line-clamp:2;white-space:unset;font-size:13px;line-height:16px;height:32px;line-break:anywhere;padding:3px 20px 0 0;width:calc(100% - 20px)}div.follow-dialog-wrap .follow-dialog-window{max-width:100%;margin-left:0;transform:translate(-50%,-50%)}div.follow-dialog-wrap .follow-dialog-window .content{padding:0 10px}div.col-full{padding:10px}.content div.pgc-space-follow-page{padding:0 0 var(--actionbar-height)}li.pgc-space-follow-item{width:100%;padding-right:0}div.bangumi-pagelistbox{white-space:pre-wrap;height:auto}.bangumi-pagelistbox>*:not(.custom-right){margin-bottom:5px}.bangumi-pagelistbox a.p{height:34px;line-height:34px;padding:0 8.5px}div.bangumi-pagelistbox strong{height:34px;line-height:34px;width:34px}.bangumi-pagelistbox a.p.prev-page,.bangumi-pagelistbox a.p.next-page{width:34px;padding:0;overflow:hidden;position:relative}.bangumi-pagelistbox a.p.prev-page:before,.bangumi-pagelistbox a.p.next-page:before{color:#18191c;background-color:inherit;position:absolute;left:0;top:0;font-size:20px;width:34px}.bangumi-pagelistbox a.p.prev-page:before{content:"<";padding:1px 14px 13px 0}.bangumi-pagelistbox a.p.next-page:before{content:">";padding:0 12px 14px 2px}div.bangumi-pagelistbox:before{content:""}.section .pugv-container a.pugv-item{width:100%}.section .pugv-container .pugv-item .item-infos p.sub-title{width:100%;white-space:pre-wrap;height:40px;margin-bottom:4px}#internationalHeader{top:-64px!important;min-width:0!important;position:fixed}#message-navbar{display:none}body>.container{margin-top:0}.space-right{padding-top:calc(32px - var(--actionbar-height)/2)}.container{width:100%!important}div.international-header .nav-search-box{position:absolute;width:100%;left:0;top:64px;padding:10px 20px 5px;z-index:3;margin:0;opacity:0;transform:scale(.9);transition:.4s ease-in;display:none}div.international-header .nav-search-box[show]{opacity:1;transform:none}.space-right-top,.send-box,.count-2 .avatar:first-child{z-index:0!important}.space-left{position:fixed;height:100%;z-index:3;left:-140px;transition:transform .4s ease-in}body>.container[sidebar] .space-left{transform:translate(100%)}.space-left .side-bar{position:absolute;top:50%;transform:translateY(-50%)}.bili-im .left{width:70px!important;transition:width .4s ease-in}.bili-im .left .title{padding-left:10px!important}.bili-im .left .list-item{padding:15px}.bili-im .left .list-item .avatar{margin-right:15px}.bili-im .left .list-container{height:calc(100% - 72px)!important}#unfold-btn{padding-left:22px;line-height:35px;height:36px;border-top:1px solid #e9eaec;-webkit-user-select:none;user-select:none}.list-item .close{width:18px!important}.msg-notify{width:100%!important}.message-list{padding:5px;width:calc(100vw - 90px)}.dynamic-link i{vertical-align:bottom}.msg-item div.message{margin:0}.notify-wrapper{min-height:32px!important}body:has(>#samantha-toast-container){overflow:unset}.bili-im .menu-list{left:unset!important;right:0}.notification-warp{width:100%!important;overflow:auto}body{--shadow-transform: none;--commentbox-display: block}body[scroll-hidden]{--shadow-transform: translateY(calc(100% + var(--actionbar-height)))}#app{--sidebar-time: .6s;min-width:auto!important}#app #mirror-vdcon{min-width:0;padding:0;margin-top:56.25vw}#app,#mirror-vdcon{height:100%}.left-container,.playlist-container--left{--video-min-height: 56.25vw ;--dm-row-height: 40px}.left-container,.playlist-container--left{box-sizing:border-box;width:100%!important;padding:calc(var(--dm-row-height) + 5px) 10px 10px;background:#fff}.left-container:after,.playlist-container--left:after{content:"";position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;background-color:#0000004d;opacity:0;transition:opacity var(--sidebar-time) ease-in}.playlist-container--left{z-index:1}#mirror-vdcon[sidebar] .left-container:after #mirror-vdcon[sidebar] .playlist-container--left:after{pointer-events:auto;opacity:1}.right-container,.playlist-container--right{position:fixed!important;width:100%!important;left:100%;padding:10px 10px calc(var(--actionbar-height) + 10px)!important;margin:0!important;z-index:1;background:#fff;transition:transform var(--sidebar-time) ease-in;height:calc(100% - 56.25vw);overflow-y:auto;overscroll-behavior:contain;box-sizing:border-box}#mirror-vdcon[sidebar] .right-container,#mirror-vdcon[sidebar] .playlist-container--right{transform:translate(-100%)}.right-container-inner{padding:0!important}.upinfo-btn-panel .default-btn{font-size:12px!important}.new-charge-btn{max-width:35%}.follow-btn{max-width:150px!important}div.multi-page-v1 .cur-list{overflow-y:auto}.cur-list ul.list-box li{width:100%!important}.cur-list ul.module-box.clearfix{margin:5px 10px}.cur-list ul.module-box li{width:23%!important;margin:2% 1%!important}#reco_list .card-box .pic-box{max-width:50%}.rec-footer{display:none}.base-video-sections-v1 a.first-line-title{white-space:wrap!important;display:-webkit-box!important;-webkit-box-orient:vertical;line-clamp:2;-webkit-line-clamp:2}#activity_vote,#bannerAd,.reply-notice,.activity-m-v1,.ad-report,.pop-live-small-mode,#slide_ad,.video-page-game-card-small{display:none!important}#playerWrap{position:fixed;z-index:61;top:0;left:0;height:56.25vw!important}#bilibili-player{width:100vw!important;height:56.25vw!important}#bilibili-player.mode-webscreen{width:100%!important;height:100%!important}.bpx-player-container,#bilibili-player-placeholder{box-shadow:none!important}#app .bpx-player-video-perch{max-height:0}.bpx-player-top-wrap,.bpx-player-state-wrap{display:none!important}.bpx-player-toast-wrap{display:block!important;bottom:65px!important}.bpx-player-ending-wrap[hidden]{display:block!important}div.bpx-player-container[data-screen=web] .bpx-player-ending-content{margin-left:-268px;width:536px}.bpx-player-ending-functions-follow{width:auto!important;padding:0 15px!important}.bpx-player-ending-functions-btn[data-action=restart]{padding-right:15px!important}.bpx-player-ending-functions-pagecallback{margin-left:5px!important}.bpx-player-ending-functions-pagecallback .bpx-player-ending-functions-btn{margin-left:10px!important}@media screen and (orientation: landscape){.bpx-player-ending-functions-btn[data-action=restart]{padding-right:42px!important}.bpx-player-ending-functions-pagecallback{margin-left:14px!important}.bpx-player-ending-functions-pagecallback .bpx-player-ending-functions-btn{margin-left:28px!important}}.bpx-player-ending-related-item-countdown{margin-top:34px!important;width:48px!important}.bpx-player-ending-functions-upinfo{height:56px!important;margin-top:0!important}.bui-swiper~.bpx-player-ending-related{height:109px!important}.bpx-player-sending-area{position:absolute!important;bottom:0;width:100%;transform:translateY(100%);transition:.5s transform ease-in;display:block!important;z-index:0}[scroll-hidden] .bpx-player-sending-area{transform:none}.bpx-player-video-area{z-index:1}.bpx-player-container[data-screen=mini]{overflow:unset!important}.bpx-player-sending-bar-left,.bpx-player-sending-bar-right,#bilibili-player-placeholder-bottom{display:none!important}div.bpx-player-sending-bar{height:var(--dm-row-height)}.bpx-player-sending-area .bpx-player-sending-bar{-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);background-color:#fff9!important}.bpx-player-dm-input{height:26px!important}.bpx-player-video-inputbar{height:26px!important;border-radius:13px!important;min-width:0!important}.bpx-player-video-inputbar-wrap{width:100%!important}.bpx-player-dm-btn-send{display:none!important}.bpx-player-video-inputbar-wrap:has(>input:focus)+.bpx-player-dm-btn-send{display:flex!important}.bpx-player-dm-btn-send{border-radius:0 13px 13px 0!important;height:26px!important;min-width:50px!important;width:50px!important}.bui-button-blue{min-width:50px!important}.bpx-player-video-info{margin-right:6px!important}.bpx-player-video-info-divide,.bpx-player-video-info-dm,.bpx-player-dm-hint{display:none!important}.video-info-container{height:auto!important;padding-top:0!important}.video-title,.video-title-href{font-size:18px!important;white-space:wrap!important;display:-webkit-box!important;-webkit-box-orient:vertical;line-clamp:2;-webkit-line-clamp:2;margin-right:0!important}.show-more{top:unset!important;transform:none!important;bottom:4px;right:4px!important}.video-desc-container{margin:10px 0!important}.video-info-detail-list .item{margin-right:4px!important}.pubdate-ip{display:inline-flex!important}.video-info-detail-list:has(.honor.item){margin-top:24px}.video-info-detail-list:has(.video-argue.item){margin-bottom:20px}div:not(.overflow-panel)>div>.honor.item{position:absolute;align-self:start!important;top:0}.video-argue.item{position:absolute;align-self:start!important;bottom:0;display:block!important}.overflow-panel .video-argue.item{max-width:calc(100% - 32px)}.video-toolbar-container{padding:10px 0 8px!important}.video-toolbar-left,.video-toolbar-left-main{min-width:0}.toolbar-left-item-wrap{flex:1;min-width:0}.video-toolbar-container *{margin:0!important}.toolbar-left-item-wrap span{padding-left:2px}.video-share-info{width:40px!important}.video-share-popover,.video-ai-assistant-badge{display:none!important}.video-toolbar-right div.video-ai-assistant.disabled:after{left:180%;transform:translate(-100%)}div.resizable-component.resizable-component{width:100%!important;left:0!important;height:fit-content!important;max-height:100vw;top:50%!important;transform:translateY(-50%);border-radius:12px!important}div.ai-summary-popup{max-height:inherit;border-radius:12px}#v_desc .toggle-btn{text-align:right;margin-right:7px}.basic-desc-info[style="height: 84px;"]{height:70px!important}.video-tag-container{margin:6px 0 0!important;padding-bottom:1px!important}.tag-panel .tag{margin-bottom:6px!important}#commentapp{padding-top:10px}.bili-user-profile,body>.usercard-wrap{display:none!important}.back-to-top{border-radius:0 25% 25% 0!important;border-left:0!important;margin-bottom:0!important;width:42px!important;border-color:var(--line_regular)!important;visibility:visible!important;transform:translate(-100%);transition:transform .5s ease-in-out,background-color .3s!important}.back-to-top[show]{transform:none}#app .fixed-sidenav-storage .fixed-sidenav-storage-item:hover{background-color:var(--bg1_float);color:var(--text1);fill:var(--text1)}div#app .fixed-sidenav-storage .fixed-sidenav-storage-item[touch-active]{background:var(--graph_bg_thick)}.fixed-sidenav-storage{left:0;right:unset!important;bottom:90px!important;z-index:1!important;opacity:1;transition:opacity var(--sidebar-time) ease-in}#mirror-vdcon[sidebar] .fixed-sidenav-storage{opacity:0}.mini-player-window{position:fixed;z-index:-10;visibility:hidden}.customer-service,.bpx-player-ctrl-pip,.bpx-player-ctrl-wide,.bpx-player-ctrl-time,.bpx-player-ctrl-eplist{display:none!important}@media screen and (orientation: landscape){.bpx-player-ctrl-time{display:block!important}}@media screen and (min-width: 750px){.bpx-player-container[data-screen=full] .bpx-player-ctrl-quality-result{font-size:16px!important;height:unset!important}}@media screen and (min-width: 750px){.bpx-player-container[data-screen=full] .bpx-player-control-wrap{height:43px!important}.bpx-player-container[data-screen=full] .bpx-player-control-top{bottom:43px!important}}div.bpx-player-control-bottom{height:29px!important;margin-top:7px!important;padding:0 7px!important}div.bpx-player-control-top{bottom:36px;transition:none}.bpx-player-pbp .bpx-player-pbp-pin-tip{display:none!important}.bpx-player-control-bottom-left,.bpx-player-control-bottom-right{flex:unset!important}.bpx-player-container .bpx-player-control-bottom-left,.bpx-player-container .bpx-player-control-bottom-right{min-width:0!important}.bpx-player-ctrl-quality{margin-right:0!important;min-width:0;flex:auto!important}.bpx-player-ctrl-quality-result,.bpx-player-ctrl-playbackrate{font-size:12px!important}.bpx-player-ctrl-quality-result{height:22px;overflow:hidden}.bpx-player-ctrl-playbackrate{text-wrap:nowrap}.bpx-player-progress-wrap{height:7px!important;padding-bottom:3px!important}.bpx-player-control-mask{background:linear-gradient(to bottom,#0000,#00000080)!important}.bpx-player-ctrl-quality-menu-wrap{bottom:22px!important}.bpx-player-ctrl-quality-menu-item{height:7.7vw!important;max-height:36px;max-width:95px;padding:0 8px 0 12px!important}.bpx-player-ctrl-quality-badge-bigvip{background-color:#f25d8e;color:#fff;width:16px;overflow:hidden;right:8px!important}.bpx-player-ctrl-quality-badge-bigvip:before{background-color:#f25d8e;color:#fff;content:"V";padding:0 4px;position:absolute;left:0}.bpx-player-ctrl-playbackrate-menu{bottom:22px!important}.bpx-player-ctrl-playbackrate-menu-item{height:7.7vw!important;max-height:36px;display:flex;justify-content:center;align-items:center}div.bpx-player-ctrl-subtitle-box{bottom:0;right:0;transform:scale(.8)}.bpx-player-ctrl-setting-box{right:0!important;bottom:0!important}.bpx-player-ctrl-setting-menu-right{padding:5px!important}.bpx-player-ctrl-setting-menu-right>div{height:10vw!important;max-height:40px;display:flex;justify-content:center;align-items:center}.bpx-player-ctrl-setting-menu-right .bui-radio{margin:0 0 8px 7px;width:77%}.bpx-player-ctrl-setting-others-content{width:77%!important;margin-left:7px}.bpx-player-ctrl-setting-highenergy .bui-checkbox-name{white-space:nowrap;width:48px;overflow:hidden}.bpx-player-dm-setting-wrap{bottom:unset!important;top:0;position:fixed!important;left:50%;transform:translate(-50%)}.bpx-player-control-bottom-center .bpx-player-sending-bar{padding-right:6px!important;height:24px!important}.bpx-player-ctrl-viewpoint{margin:0!important;min-width:0!important;width:45px!important;flex-shrink:1!important}.bpx-player-ctrl-viewpoint-text{width:24px!important;text-overflow:unset!important;font-size:12px;flex:none}.bpx-player-control-wrap:not(.new){display:none}.bpx-player-control-entity,.bpx-player-control-mask{display:block!important}.bpx-player-container[data-ctrl-hidden=true] .bpx-player-control-bottom{display:none}.bpx-player-container[ctrl-shown=false] .bpx-player-control-wrap .bpx-player-control-mask{opacity:0;transition:opacity .2s ease-in}.bpx-player-container[ctrl-shown=true] .bpx-player-control-wrap .bpx-player-control-mask{opacity:1}.bpx-player-container[ctrl-shown=true] .bpx-player-control-entity .bpx-player-control-bottom{opacity:1;display:flex}.bpx-player-container[ctrl-shown=false] .bpx-player-control-entity .bpx-player-control-bottom{display:none}.bpx-player-container[ctrl-shown=true] .bpx-player-control-entity .bpx-player-control-top,.bpx-player-container[ctrl-shown=false] .bpx-player-control-entity .bpx-player-shadow-progress-area{opacity:1;visibility:visible}.bpx-player-container[ctrl-shown=false] .bpx-player-control-entity .bpx-player-control-top,.bpx-player-container[ctrl-shown=true] .bpx-player-control-entity .bpx-player-shadow-progress-area{opacity:0;visibility:hidden}.bpx-player-container[ctrl-shown=true] .bpx-player-control-entity .bpx-player-pbp{bottom:calc(100% + 6px);left:0;opacity:1;width:100%}div.bpx-player-control-entity .bpx-player-pbp{bottom:1px;opacity:0;left:-12px;width:calc(100% + 24px)}div.bpx-player-control-entity .bpx-player-pbp.pin{opacity:1}.bpx-player-pbp-pin{opacity:1!important;display:none}.bpx-player-container[ctrl-shown=true] .bpx-player-control-entity .bpx-player-pbp-pin{display:block}.article-detail,.article-breadcrumb,.article-up-info{max-width:100%}div.article-container{padding:10px}.title-container{padding:0!important}#article-content{max-width:100%;padding:0}figure.img-box{min-width:0!important;min-height:0!important}img.normal-img{height:auto!important} ');

(function () {
  'use strict';

  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const handleTransitionEndOnce = (element, propertyName, callback) => {
    const handleTransitionEnd = (event) => {
      if (event.propertyName === propertyName) {
        callback();
        element.removeEventListener("transitionend", handleTransitionEnd);
      }
    };
    element.addEventListener("transitionend", handleTransitionEnd);
  };
  function setupSlide(container, touchXThreshold, onSlideLeft, onSlideRight, removeListener) {
    let startX = 0;
    let startY = 0;
    const handleTouchStart = (event) => {
      startX = event.changedTouches[0].clientX;
      startY = event.changedTouches[0].clientY;
    };
    const handleTouchEnd = (event) => {
      const offsetX = event.changedTouches[0].clientX - startX;
      const offsetY = event.changedTouches[0].clientY - startY;
      if (Math.abs(offsetX) > touchXThreshold && Math.abs(offsetY / offsetX) < 1 / 2) {
        if (offsetX > 0) {
          onSlideRight();
        } else {
          onSlideLeft();
        }
      }
    };
    {
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchend", handleTouchEnd);
    }
  }
  function preventBeforeUnload() {
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = (type, listener, options) => type === "beforeunload" || originalAddEventListener.call(window, type, listener, options);
  }
  function increaseVideoLoadSize() {
    const _unsafeWindow$1 = typeof _unsafeWindow !== "undefined" ? _unsafeWindow : window;
    const originalFetch = _unsafeWindow$1.fetch;
    _unsafeWindow$1.fetch = (input, init) => {
      if (typeof input === "string" && input.startsWith("https://api.bilibili.com") && input.includes("feed/rcmd")) {
        input = input.replace("&ps=12&", "&ps=30&");
      }
      return originalFetch(input, init);
    };
  }
  function countViewTime() {
    window.onload = function() {
      let storedTime = _GM_getValue("view-time", 0);
      const storedTimestamp = _GM_getValue("timestamp", Date.now());
      const diff = Math.floor((Date.now() - storedTimestamp) / 1e3 / 60);
      storedTime = diff < 3 ? storedTime + diff : 0;
      function renewTime() {
        _GM_setValue("view-time", storedTime);
        _GM_setValue("timestamp", Date.now());
      }
      renewTime();
      setInterval(function() {
        storedTime++;
        renewTime();
        if (storedTime % 120 === 0) {
          const fullscreenElem = document.fullscreenElement;
          if (fullscreenElem && !fullscreenElem.querySelector(":scope>#toast")) {
            fullscreenElem.appendChild(
              document.querySelector("#toast").cloneNode()
            );
          }
          const toasts = document.querySelectorAll(
            "#toast"
          );
          toasts.forEach((toast) => {
            toast.textContent = `您已连续浏览 ${storedTime / 60} 小时，请注意休息`;
            toast.style.display = "block";
            setTimeout(() => {
              toast.setAttribute("show", "");
            }, 10);
            setTimeout(() => {
              toast.removeAttribute("show");
              handleTransitionEndOnce(toast, "opacity", () => {
                toast.style.cssText = "";
              });
            }, 5e3);
          });
        }
      }, 6e4);
    };
  }
  function handleScroll(type) {
    scrollToHidden(type);
    switch (type) {
      case "search":
        slideSearchSort();
        break;
      case "video":
      case "list":
        slideVideoSidebar();
        break;
      case "message":
        slideMessageSidebar();
        break;
      case "space":
        handleSpaceSwipe();
        break;
    }
  }
  function scrollToHidden(type) {
    let lastScrollY = 0;
    const scrollThreshold = 75;
    const backup = document.getElementsByClassName(
      "back-to-top"
    )[0];
    const videoMap = {
      video: ".left-container",
      list: ".playlist-container--left"
    };
    let elem;
    if (["video", "list"].includes(type)) {
      const container = document.querySelector(
        videoMap[type]
      );
      if (container) elem = container;
    }
    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;
      const offsetY = currentScrollY - lastScrollY;
      if (currentScrollY < scrollThreshold) {
        document.body.removeAttribute("scroll-hidden");
      }
      if (Math.abs(offsetY) > scrollThreshold) {
        if (offsetY > 0) {
          document.body.setAttribute("scroll-hidden", "");
        } else {
          document.body.removeAttribute("scroll-hidden");
        }
        lastScrollY = currentScrollY;
      }
      if (["video", "list"].includes(type)) {
        if (currentScrollY > window.innerHeight / 2) {
          backup == null ? void 0 : backup.setAttribute("show", "");
        } else {
          backup == null ? void 0 : backup.removeAttribute("show");
        }
      }
    });
    if (["video", "list"].includes(type)) {
      backup.addEventListener("click", () => {
        elem.scrollTo({ top: 0, behavior: "smooth" });
        backup.setAttribute("touch-active", "");
        handleTransitionEndOnce(
          backup,
          "transform",
          () => backup.removeAttribute("touch-active")
        );
      });
    }
  }
  function slideVideoSidebar() {
    const videoContainer = document.querySelector("#mirror-vdcon");
    setupSlide(
      videoContainer,
      55,
      () => {
        if (!videoContainer.hasAttribute("sidebar")) {
          videoContainer.setAttribute("sidebar", "");
        }
      },
      () => {
        if (videoContainer.hasAttribute("sidebar")) {
          videoContainer.removeAttribute("sidebar");
        }
      }
    );
  }
  function slideSearchSort() {
    let clickIndex = 3;
    const navItems = [4, 3, 2, 1, 7, 6, 5];
    const container = document.querySelector("#i_cecream");
    function clickSortTab() {
      document.querySelector(
        `.vui_tabs--nav-item:nth-child(${navItems[clickIndex]})`
      ).click();
    }
    setupSlide(
      container,
      55,
      () => {
        clickIndex++;
        clickSortTab();
      },
      () => {
        clickIndex--;
        clickSortTab();
      }
    );
  }
  function slideMessageSidebar() {
    const messageContainer = document.querySelector(
      "body>.container"
    );
    const sidebarOverlay = document.querySelector(
      "#sidebar-overlay"
    );
    const sidebarFab = document.querySelector("#sidebar-fab");
    function show() {
      messageContainer.setAttribute("sidebar", "");
      sidebarOverlay.classList.add("show");
      sidebarFab.classList.add("active");
    }
    function hide() {
      messageContainer.removeAttribute("sidebar");
      sidebarOverlay.classList.remove("show");
      sidebarFab.classList.remove("active");
    }
    function slideLeft() {
      const isSidebarRight = _GM_getValue("message-sidebar-change-right", false);
      if (isSidebarRight && !messageContainer.hasAttribute("sidebar")) show();
      if (!isSidebarRight && messageContainer.hasAttribute("sidebar")) hide();
    }
    function slideRight() {
      const isSidebarRight = _GM_getValue("message-sidebar-change-right", false);
      if (isSidebarRight && messageContainer.hasAttribute("sidebar")) hide();
      if (!isSidebarRight && !messageContainer.hasAttribute("sidebar")) show();
    }
    setupSlide(messageContainer, 55, slideLeft, slideRight);
    setupSlide(sidebarOverlay, 55, slideLeft, slideRight);
  }
  function handleSpaceSwipe() {
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        mutation.addedNodes.forEach((addedNode) => {
          if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.id === "app") {
            slideSpaceNavigator();
            observer.disconnect();
          }
        });
      });
    });
    observer.observe(document.body, { childList: true });
    function slideSpaceNavigator() {
      const current = document.querySelector("#navigator .active");
      const siblings = Array.from(
        document.querySelectorAll("#navigator .n-btn")
      ).sort((a, b) => {
        return parseInt(getComputedStyle(a).order) - parseInt(getComputedStyle(b).order);
      });
      let index = siblings.findIndex((el) => el === current);
      const container = document.querySelector("#app");
      setupSlide(
        container,
        55,
        () => {
          index++;
          siblings[index].click();
        },
        () => {
          index--;
          siblings[index].click();
        }
      );
    }
  }
  const waitDOMContentLoaded = (callback) => {
    if (document.readyState === "loading")
      document.addEventListener("DOMContentLoaded", callback);
    else callback();
  };
  function appendStyle(id, textContent) {
    const style = Object.assign(document.createElement("style"), {
      id,
      textContent
    });
    document.head.appendChild(style);
  }
  function homeSingleColumn() {
    appendStyle(
      "home-single-column",
      `
div.recommended-container_floor-aside .container {
  grid-template-columns: repeat(1, 1fr) !important;
}
div.bili-video-card.is-rcmd,
div.bili-live-card.is-rcmd {
  --cover-radio: 56.25% !important;
}
.bili-live-card__skeleton--right {
  height: 70px;
}
div.recommended-container_floor-aside .container {
  padding: 15px 0;
  grid-gap: 15px !important;
  background-color: white;
}
picture.v-img.bili-video-card__cover, picture.v-img.bili-live-card__cover {
  border-radius: 0 !important;
}
div.bili-video-card__wrap, div.bili-live-card__wrap {
  border-radius: 0;
}
div.bili-video-card__info,
div.bili-live-card__info {
  --title-padding-right: 30px;
  --no-interest-entry-size: 30px;
}
`
    );
  }
  function foldDescTag$1() {
    appendStyle(
      "fold-desc-tag",
      `
.video-desc-container,
.video-tag-container{
  max-height: 0;
  overflow: hidden;
  margin: 0 !important;
  padding: 0 !important;
}
.left-container[unfold] .video-desc-container,
.left-container[unfold] .video-tag-container{
  max-height: unset;
  padding: 5px 0 !important;
}
#fold-desc-btn {
  width: 24px;
  height: 24px;
  transform: rotate(180deg);
  position: absolute;
  right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 25%;
  box-shadow: 0 0 0 1px var(--line_regular) inset;
  padding: 2px;
}
.left-container[unfold] #fold-desc-btn{
  transform: none;
}  
`
    );
  }
  function handleScriptPreSetting() {
    const defaultValue = Array(11).fill(false);
    const css = {
      css1: `
      .bpx-player-sending-area.bpx-player-sending-area {display:none !important;}
      .left-container.left-container {padding:5px 10px 10px;}
      html body {--commentbox-display: none;}
    `,
      css2: ".video-tag-container {display:none !important;}",
      css3: `
      .video-info-meta div.copyright.item {display: none;}
      .video-info-meta a.honor.item {display: none;}
      .video-info-meta .video-info-detail-list:has(.honor.item) {margin-top: 0;}
      .video-info-meta .video-argue.item {display: none !important;}
      .video-info-meta .video-info-detail-list:has(.video-argue.item) {margin-bottom: 0;}
    `,
      css4: ".trending {display:none;}",
      css5: ".bpx-player-ctrl-volume, .bpx-player-ctrl-full, .bpx-player-ctrl-web {display: none;}",
      css6: `
      .bili-footer {display: none;}
      .vui_pagenation {padding-bottom: var(--actionbar-height);}
    `,
      css7: ".fixed-sidenav-storage, div.float-nav-exp {display: none !important;}",
      css8: ".bili-live-card {display: none !important;}",
      css9: ".bangumi-pgc-list {display: none;}",
      css10: "#danmukuBox {display: none;}",
      css11: "div.bpx-player-toast-wrap {display: none !important;}"
    };
    readScriptSetting();
    if (_GM_getValue("home-single-column", false)) {
      homeSingleColumn();
    }
    if (_GM_getValue("fold-desc-tag", false)) {
      foldDescTag$1();
    }
    waitDOMContentLoaded(() => {
      createSettingPanel();
      _GM_registerMenuCommand("元素隐藏设置", () => {
        const settingPanel = document.getElementById(
          "setting-panel-style"
        );
        settingPanel.style.display = "flex";
        setTimeout(() => {
          settingPanel.setAttribute("show", "");
        }, 10);
      });
    });
    function readScriptSetting(diference = void 0) {
      var _a;
      const settingShowHidden = _GM_getValue(
        "settingShowHidden",
        defaultValue
      );
      const values = Object.values(css);
      if (diference) {
        for (const [index, value] of diference.entries()) {
          if (value) {
            if (settingShowHidden[index]) {
              appendStyle(`script-pre-style-${index}`, values[index]);
            } else {
              (_a = document.getElementById(`script-pre-style-${index}`)) == null ? void 0 : _a.remove();
            }
          }
        }
      } else {
        for (const [index, value] of values.entries()) {
          if (settingShowHidden[index]) {
            appendStyle(`script-pre-style-${index}`, value);
          }
        }
      }
    }
    function createSettingPanel() {
      const settingPanel = Object.assign(document.createElement("div"), {
        id: "setting-panel-style",
        className: "setting-panel",
        innerHTML: `
        <div class="setting-title">隐藏元素</div>
        <div class="setting-checkboxes">
          <label><input type="checkbox"><span>弹幕行与评论行</span></label>
          <label><input type="checkbox"><span>标签块</span></label>
          <label><input type="checkbox"><span>标题附加声明提示</span></label>
          <label><input type="checkbox"><span>热搜榜</span></label>
          <label><input type="checkbox"><span>播放器全屏音量键</span></label>
          <label><input type="checkbox"><span>页脚导航链接</span></label>
          <label><input type="checkbox"><span>视频页回顶部按钮</span></label>
          <label><input type="checkbox"><span>首页直播推荐</span></label>
          <label><input type="checkbox"><span>搜索综合栏影视块</span></label>
          <label><input type="checkbox"><span>视频侧栏弹幕列表</span></label>
          <label><input type="checkbox"><span>视频弹出提示条</span></label>
        </div>
        <button id="setting-conform-1" class="setting-conform">确认</button>
        `
      });
      document.body.appendChild(settingPanel);
      const checkboxElements = settingPanel.querySelectorAll(
        '.setting-checkboxes input[type="checkbox"]'
      );
      const oldValues = _GM_getValue(
        "settingShowHidden",
        defaultValue
      );
      for (const [index, element] of Array.from(checkboxElements).entries()) {
        element.checked = oldValues[index];
      }
      settingPanel.querySelector("#setting-conform-1").addEventListener("click", () => {
        const oldValues2 = _GM_getValue(
          "settingShowHidden",
          defaultValue
        );
        const selectedValues = Array.from(checkboxElements).map(
          (checkbox) => checkbox.checked
        );
        _GM_setValue("settingShowHidden", selectedValues);
        const difference = selectedValues.map(
          (value, index) => value !== oldValues2[index]
        );
        readScriptSetting(difference);
        settingPanel.removeAttribute("show");
        settingPanel.addEventListener(
          "transitionend",
          () => {
            settingPanel.style.cssText = "";
          },
          { once: true }
        );
      });
    }
  }
  function handleScriptSetting() {
    const keyValues = {
      "ban-video-click-play": "禁用点击视频播放/暂停",
      "allow-video-slid": "视频滑动调整进度",
      "fold-desc-tag": "折叠简介和标签",
      "video-click-unmute": "视频页点击空白解除静音",
      "ban-actionbar-hidden": "禁止底栏滚动时隐藏",
      "message-sidebar-change-right": "消息页侧边栏靠右",
      "cover-context-menu": "覆盖消息页长按弹窗",
      "home-single-column": "首页单列推荐",
      "menu-dialog-move-down": "菜单弹窗(收藏、历史等)靠下"
    };
    const customKeyValues = {
      "menu-dialog-move-down-value": "20",
      "video-longpress-speed": "2",
      "header-image-source": "unsplash"
      // 与 home.js 保持一致
    };
    const customKeyNames = {
      "menu-dialog-move-down-value": "自定义菜单弹窗底边距",
      "video-longpress-speed": "自定义视频长按倍速",
      "header-image-source": "主页头图换源"
    };
    const menuOptions = {
      key: "modify-menu-options",
      value: [true, true, ...Array(6).fill(false)],
      names: ["热门", "分类", "消息", "动态", "收藏", "历史", "主页", "关注"]
      // 菜单选项排序
    };
    initSettings();
    createSettingPanel();
    _GM_registerMenuCommand("操作偏好设置", () => {
      const settingPanel = document.getElementById(
        "setting-panel-preference"
      );
      settingPanel.style.display = "flex";
      setTimeout(() => {
        settingPanel.setAttribute("show", "");
      }, 10);
    });
    function initSettings() {
      if (_GM_getValue("ban-actionbar-hidden", false)) {
        banActionbarHidden();
      }
      if (_GM_getValue("message-sidebar-change-right", false)) {
        messageSidebarRight();
      }
      if (_GM_getValue("menu-dialog-move-down", false)) {
        menuDialogMoveDown();
      }
      if (!_GM_getValue(menuOptions.key, menuOptions.value).every(
        (item) => item === false
      )) {
        modifyMenuOptions();
      }
    }
    function banActionbarHidden() {
      appendStyle(
        "ban-actionbar-hidden",
        `
      [scroll-hidden] #actionbar,
      [scroll-hidden] .flexible-roll-btn-inner, /* 刷新、回顶 */
      [scroll-hidden] .top-btn {
        transform: none !important;
      }
    `
      );
    }
    function messageSidebarRight() {
      appendStyle(
        "message-sidebar-change-right",
        `
      .space-left.space-left { left: 100%; }      
      body>.container[sidebar] .space-left.space-left { transform: translateX(-100%); }
    `
      );
    }
    function menuDialogMoveDown() {
      const downValue = _GM_getValue("menu-dialog-move-down-value", "20");
      appendStyle(
        "menu-dialog-move-down-value",
        `
      div.bili-header .v-popover.v-popover {
        top: unset !important;
        bottom: var(--actionbar-height);
        transform: translate(-50%, -${downValue}px) scale(.9);
      }
      div.bili-header .v-popover.v-popover[show] {
        transform: translate(-50%, -${downValue}px) !important;
      }
    `
      );
    }
    function modifyMenuOptions() {
      const options = _GM_getValue(menuOptions.key, menuOptions.value);
      let selector = "";
      options.forEach((value, index) => {
        if (value) {
          selector += `#header-in-menu ul li:nth-of-type(${index + 1}), `;
        }
      });
      appendStyle(
        "modify-menu-options",
        `${selector.slice(0, -2)} { display: none; }`
      );
    }
    function createSettingPanel() {
      const settingPanel = Object.assign(document.createElement("div"), {
        id: "setting-panel-preference",
        className: "setting-panel",
        innerHTML: `
        <div class="setting-title">操作偏好</div>
        <div class="setting-checkboxes">
        ${Object.entries(keyValues).map(
        ([key, value]) => `
          <label><input type="checkbox" data-key="${key}"><span>${value}</span></label>
        `
      ).join("")}
        ${Object.entries(customKeyValues).filter(([key]) => key !== "header-image-source").map(
        ([key, value]) => `
          <label><input type="number" value="${value}" data-key="${key}"><span>${customKeyNames[key]}</span></label>
        `
      ).join("")}
          <label><select class="header-image-source" data-key="header-image-source">
              <option value="local">本地图片</option>
              <option value="bing">必应每日</option>
              <option value="unsplash">Unsplash</option>
              <option value="picsum">Picsum</option>
              <option value="meizi">妹子⏳</option>
              <option value="dongman">动漫⏳</option>
              <option value="fengjing">风景⏳</option>
              <option value="suiji">随机⏳</option>
          </select><details><summary>主页头图换源</summary>本地图片限制大小</details></label>
          <label class="modify-menu-options"><span>修改菜单显示选项</span></label>
        </div>
        <button id="setting-conform-2" class="setting-conform">确认</button>
      `
      });
      document.body.appendChild(settingPanel);
      const checkboxElements = settingPanel.querySelectorAll(
        '.setting-checkboxes input[type="checkbox"]'
      );
      const customElements = settingPanel.querySelectorAll(
        '.setting-checkboxes input[type="number"], .setting-checkboxes select'
      );
      checkboxElements.forEach((checkbox, index) => {
        checkbox.checked = _GM_getValue(
          Object.keys(keyValues)[index],
          false
        );
      });
      customElements.forEach((elem, index) => {
        elem.value = _GM_getValue(
          Object.keys(customKeyValues)[index],
          Object.values(customKeyValues)[index]
        );
      });
      settingPanel.querySelector("#setting-conform-2").addEventListener("click", () => {
        const selectedValues = Array.from(checkboxElements).map(
          (checkbox) => checkbox.checked
        );
        const writenValues = Array.from(customElements).map(
          (elem) => elem.value
        );
        selectedValues.forEach((value, index) => {
          var _a, _b, _c, _d;
          const key = Object.keys(keyValues)[index];
          if (value !== _GM_getValue(key, false)) {
            _GM_setValue(key, value);
            switch (key) {
              case "ban-actionbar-hidden":
                if (value) banActionbarHidden();
                else (_a = document.getElementById(key)) == null ? void 0 : _a.remove();
                break;
              case "message-sidebar-change-right":
                if (value) messageSidebarRight();
                else (_b = document.getElementById(key)) == null ? void 0 : _b.remove();
                break;
              case "menu-dialog-move-down":
                if (value) menuDialogMoveDown();
                else (_c = document.getElementById(`${key}-value`)) == null ? void 0 : _c.remove();
                break;
              case "home-single-column":
                if (value) homeSingleColumn();
                else (_d = document.getElementById(key)) == null ? void 0 : _d.remove();
                break;
            }
          }
        });
        writenValues.forEach((value, index) => {
          var _a;
          const key = Object.keys(customKeyValues)[index];
          if (value !== _GM_getValue(key, Object.values(customKeyValues)[index])) {
            _GM_setValue(key, value);
            if (key === "menu-dialog-move-down-value") {
              (_a = document.getElementById(key)) == null ? void 0 : _a.remove();
              menuDialogMoveDown();
            } else if (key === "header-image-source" && value !== "local") {
              window.dispatchEvent(
                new CustomEvent("variableChanged", {
                  detail: { key, newValue: value }
                })
              );
            }
          }
        });
        settingPanel.removeAttribute("show");
        settingPanel.addEventListener(
          "transitionend",
          () => {
            settingPanel.style.cssText = "";
          },
          { once: true }
        );
      });
      settingPanel.querySelector(".header-image-source").addEventListener("change", (event) => {
        if (event.target.value === "local") {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.addEventListener("change", () => {
            const file = input.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              const base64Data = reader.result;
              localStorage.setItem("header-image", base64Data.toString());
            };
          });
          input.click();
        }
      });
      settingPanel.querySelector(".modify-menu-options").addEventListener("click", () => {
        const settingPanel2 = Object.assign(document.createElement("div"), {
          id: "setting-panel-modify-menu-options",
          className: "setting-panel mini",
          innerHTML: `
          <div class="setting-title">隐藏选项</div>
          <div class="setting-checkboxes">
            ${menuOptions.names.map(
          (name, index) => `
              <label><input type="checkbox" data-index="${index}"><span>${name}</span></label>
            `
        ).join("")}
          </div>
          <button id="setting-conform-3" class="setting-conform">确认</button>
        `
        });
        document.body.appendChild(settingPanel2);
        const checkboxElements2 = settingPanel2.querySelectorAll(
          '.setting-checkboxes input[type="checkbox"]'
        );
        const oldValues = _GM_getValue(
          menuOptions.key,
          menuOptions.value
        );
        checkboxElements2.forEach((element, index) => {
          element.checked = oldValues[index];
        });
        settingPanel2.querySelector("#setting-conform-3").addEventListener("click", () => {
          var _a;
          const selectedValues = Array.from(checkboxElements2).map(
            (checkbox) => checkbox.checked
          );
          if (selectedValues !== oldValues) {
            _GM_setValue(menuOptions.key, selectedValues);
            (_a = document.head.querySelector("#modify-menu-options")) == null ? void 0 : _a.remove();
            modifyMenuOptions();
          }
          settingPanel2.remove();
        });
      });
    }
  }
  function setScriptHelp() {
    createSettingPanel();
    _GM_registerMenuCommand("脚本说明", () => {
      const settingPanel = document.getElementById(
        "setting-panel-help"
      );
      settingPanel.style.display = "flex";
      setTimeout(() => {
        settingPanel.setAttribute("show", "");
      }, 10);
    });
    function createSettingPanel() {
      const settingPanel = Object.assign(document.createElement("div"), {
        id: "setting-panel-help",
        className: "setting-panel",
        innerHTML: `
        <div class="setting-title">脚本说明</div>
        <div class="setting-content">
          <li>视频页：双击全屏按钮竖屏播放，左右滑动切换侧边栏</li>
          <li>搜索页：双击搜索按钮清空输入框，左右滑动切换分类</li>
          <li>个人空间：双击搜索按钮全局搜索，左右滑动切换分类</li>
          <li>作者持续改进和处理反馈，<a href="https://github.com/jk278/bilibili-mobile" target="_blank">Github 仓库</a>、<a href="https://t.me/dream_x_forest" target="_blank">电报吹水群</a></li>
          <li>Firefox 推荐扩展：<a href="https://addons.mozilla.org/zh-CN/firefox/addon/uaswitcher/" target="_blank">User Agent Switcher</a></li>
          <li>更多自定义功能，请查看脚本设置</li>
        </div>
        <button id="setting-conform-3" class="setting-conform">关闭</button>
      `
      });
      document.body.appendChild(settingPanel);
      settingPanel.querySelector("#setting-conform-3").addEventListener("click", () => {
        settingPanel.removeAttribute("show");
        settingPanel.addEventListener(
          "transitionend",
          () => {
            settingPanel.style.cssText = "";
          },
          { once: true }
        );
      });
      if (_GM_getValue("is-first-use", true)) {
        settingPanel.style.display = "flex";
        setTimeout(() => {
          settingPanel.setAttribute("show", "");
        }, 10);
        _GM_setValue("is-first-use", false);
      }
    }
  }
  function setSearchBtn(type) {
    const searchFab = document.getElementById("search-fab");
    const svg = searchFab.querySelector("svg");
    const searchOverlay = document.createElement("div");
    searchOverlay.id = "search-overlay";
    searchFab.appendChild(searchOverlay);
    const searchContainerSelector = ".center-search-container";
    let clickTimer = 0;
    function handleClick(input2) {
      const searchContainer = document.querySelector(
        `${searchContainerSelector}`
      );
      searchContainer.style.cssText = "display: block !important";
      setTimeout(() => {
        searchContainer.setAttribute("show", "");
      }, 10);
      input2.focus();
      searchOverlay.classList.add("show");
      searchFab.classList.add("active");
    }
    let input;
    if (type !== "search" && type !== "space") {
      searchFab.addEventListener("click", () => {
        const inputElem = document.querySelector(
          `${searchContainerSelector} input`
        );
        if (inputElem) {
          input = inputElem;
        } else return;
        handleClick(input);
      });
    }
    if (type === "search") {
      const typeInput = document.querySelector(
        ".search-input input"
      );
      const searchFabText = Object.assign(document.createElement("div"), {
        id: "search-fab-text",
        textContent: typeInput.value
      });
      searchFab.appendChild(searchFabText);
      searchFab.style.cssText = "background-color: var(--graph_bg_thick); border-radius: 16px;";
      svg.style.flex = "0 0 20px";
      const handleInput = () => {
        if (input) {
          searchFabText.textContent = input.value;
          if (input.value === "") {
            searchFab.style.cssText = "";
            svg.style.flex = "";
          } else {
            searchFab.style.cssText = "background-color: var(--graph_bg_thick); border-radius: 16px;";
            svg.style.flex = "0 0 20px";
          }
        }
      };
      searchFab.addEventListener("click", () => {
        const inputElem = document.querySelector(
          `${searchContainerSelector} input`
        );
        if (inputElem) {
          input = inputElem;
        } else return;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
          handleClick(input);
          input.removeEventListener("input", handleInput);
          input.value = searchFabText.textContent;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          handleInput();
          input.addEventListener("input", handleInput);
        }, 300);
      });
      searchFab.addEventListener("dblclick", () => {
        if (!input) {
          return;
        }
        clearTimeout(clickTimer);
        handleClick(input);
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        searchFabText.textContent = input.value;
        searchFab.style.cssText = "";
        svg.style.flex = "";
        handleInput();
        input.removeEventListener("input", handleInput);
        input.addEventListener("input", handleInput);
      });
    }
    if (type === "space") {
      const spaceHandleInput = (event) => {
        if (event.key === "Enter") {
          const spaceInput = document.querySelector(
            "#navigator .space_input"
          );
          const spaceSearchBtn = document.querySelector(
            "#navigator .search-btn"
          );
          event.preventDefault();
          spaceInput.value = input.value;
          spaceInput.dispatchEvent(new Event("input", { bubbles: true }));
          spaceSearchBtn.click();
          searchOverlay.click();
        }
      };
      searchFab.addEventListener("click", () => {
        const inputElem = document.querySelector(
          `${searchContainerSelector} input`
        );
        if (inputElem) {
          input = inputElem;
        } else return;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
          handleClick(input);
          input.removeEventListener("keydown", spaceHandleInput);
          input.addEventListener("keydown", spaceHandleInput);
          const searchPanel = document.querySelector(
            ".search-panel"
          );
          const firstChild = searchPanel.firstChild;
          if (firstChild.nodeType === Node.COMMENT_NODE || !firstChild.classList.contains("space-search-tip")) {
            const spaceSearchTip = Object.assign(document.createElement("div"), {
              className: "header space-search-tip",
              innerHTML: '<div class="title">搜索 up 的视频、动态</div>'
            });
            searchPanel.insertBefore(spaceSearchTip, firstChild);
          }
        }, 300);
      });
      searchFab.addEventListener("dblclick", () => {
        var _a;
        if (!input) {
          return;
        }
        clearTimeout(clickTimer);
        handleClick(input);
        input.removeEventListener("keydown", spaceHandleInput);
        (_a = document.querySelector(".space-search-tip")) == null ? void 0 : _a.remove();
      });
    }
    searchOverlay.addEventListener("click", (event) => {
      event.stopPropagation();
      const searchContainer = document.querySelector(
        `${searchContainerSelector}`
      );
      searchContainer.removeAttribute("show");
      searchContainer.addEventListener(
        "transitionend",
        () => {
          searchContainer.style.cssText = "";
        },
        { once: true }
      );
      searchOverlay.classList.remove("show");
      searchFab.classList.remove("active");
    });
    function handleTouchMove() {
      searchOverlay.click();
    }
    searchOverlay.addEventListener(
      "touchstart",
      () => searchOverlay.addEventListener("touchmove", handleTouchMove, {
        once: true
      })
    );
    searchOverlay.addEventListener(
      "touchend",
      () => searchOverlay.removeEventListener("touchmove", handleTouchMove)
    );
  }
  const BILIBILI_API = "https://api.bilibili.com";
  const aiData = {};
  const mixinKeyEncTab = [
    46,
    47,
    18,
    2,
    53,
    8,
    23,
    32,
    15,
    50,
    10,
    31,
    58,
    3,
    45,
    35,
    27,
    43,
    5,
    49,
    33,
    9,
    42,
    19,
    29,
    28,
    14,
    39,
    12,
    38,
    41,
    13,
    37,
    48,
    7,
    16,
    24,
    55,
    40,
    61,
    26,
    17,
    0,
    1,
    60,
    51,
    30,
    4,
    22,
    25,
    54,
    21,
    56,
    59,
    6,
    63,
    57,
    62,
    11,
    36,
    20,
    34,
    44,
    52
  ];
  const mixinKeyCache = /* @__PURE__ */ new Map();
  const getMixinKey = (orig) => {
    if (mixinKeyCache.has(orig)) {
      return mixinKeyCache.get(orig);
    }
    const mixinKey = mixinKeyEncTab.map((n) => orig[n]).join("").slice(0, 32);
    mixinKeyCache.set(orig, mixinKey);
    return mixinKey;
  };
  function encWbi(params, imgKey, subKey) {
    const mixinKey = getMixinKey(imgKey + subKey);
    const currTime = Math.round(Date.now() / 1e3);
    const chrFilter = /[!'()*]/g;
    Object.assign(params, { wts: currTime });
    const query = Object.keys(params).sort().map((key) => {
      const value = params[key].toString().replace(chrFilter, "");
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }).join("&");
    const wbiSign = md5(query + mixinKey);
    return `${query}&w_rid=${wbiSign}`;
  }
  async function getWbiKeys() {
    const {
      wbi_img: { img_url: imgUrl, sub_url: subUrl }
    } = await getNavUserInfo();
    return {
      imgKey: imgUrl.slice(imgUrl.lastIndexOf("/") + 1, imgUrl.lastIndexOf(".")),
      subKey: subUrl.slice(subUrl.lastIndexOf("/") + 1, subUrl.lastIndexOf("."))
    };
  }
  async function getwts(params) {
    const webKeys = await getWbiKeys();
    const imgKey = webKeys.imgKey;
    const subKey = webKeys.subKey;
    const query = encWbi(params, imgKey, subKey);
    return query;
  }
  async function fetchAPI(url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      return jsonData.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
  async function getNavUserInfo() {
    return fetchAPI(`${BILIBILI_API}/x/web-interface/nav`, {
      credentials: "include"
    });
  }
  async function getVideoInfo(bvid) {
    return fetchAPI(`${BILIBILI_API}/x/web-interface/view?bvid=${bvid}`);
  }
  async function getJudgeAI(params) {
    const query = await getwts(params);
    return fetchAPI(
      `${BILIBILI_API}/x/web-interface/view/conclusion/judge?${query}`
    );
  }
  async function getAIConclusion(params) {
    const query = await getwts(params);
    return fetchAPI(
      `${BILIBILI_API}/x/web-interface/view/conclusion/get?${query}`
    );
  }
  function getUserID() {
    const cookies = document.cookie;
    const cookieArray = cookies.split("; ");
    for (let i = 0; i < cookieArray.length; i++) {
      const cookie = cookieArray[i].split("=");
      if (cookie[0] === "DedeUserID") {
        return cookie[1];
      }
    }
    return null;
  }
  function getCSRF() {
    const cookies = document.cookie;
    const cookieArray = cookies.split("; ");
    for (let i = 0; i < cookieArray.length; i++) {
      const cookie = cookieArray[i].split("=");
      if (cookie[0] === "bili_jct") {
        return cookie[1];
      }
    }
    return null;
  }
  async function getFollowList(pageNumber, pageSize, orderType) {
    const vmid = getUserID();
    const query = await getwts({});
    return fetchAPI(
      `${BILIBILI_API}/x/relation/followings?vmid=${vmid}&pn=${pageNumber}&ps=${pageSize}&order=desc&order_type=${orderType === 1 ? "attention" : ""}&gaia_source=main_web&web_location=333.999&${query}`,
      { credentials: "include" }
    );
  }
  async function getDynamicList(offset) {
    return fetchAPI(
      `${BILIBILI_API}/x/polymer/web-dynamic/v1/feed/nav?offset=${offset}`,
      { credentials: "include" }
    );
  }
  async function getHistoryList(cursor) {
    const url = `${BILIBILI_API}/x/web-interface/history/cursor?max=${cursor.max}&view_at=${cursor.view_at}&business=archive`;
    const options = { credentials: "include" };
    return fetchAPI(url, options);
  }
  async function getHistorySearchList(key, pn) {
    return fetchAPI(
      `${BILIBILI_API}/x/web-interface/history/search?pn=${pn}&keyword=${key}&business=all`,
      { credentials: "include" }
    );
  }
  async function getUnreadNums() {
    const options = { credentials: "include" };
    const messageNumObj = await fetchAPI(
      "https://api.vc.bilibili.com/session_svr/v1/session_svr/single_unread?build=0&mobi_app=web&unread_type=0",
      options
    );
    const dynamicNumObj = await fetchAPI(
      `${BILIBILI_API}/x/web-interface/dynamic/entrance?alltype_offset=&video_offset=0&article_offset=0`,
      options
    );
    const messageNum = Object.values(messageNumObj).reduce(
      // 数组方法：所有元素累积成一个值
      (acc, value) => acc + value,
      // 回调：累加器 + 当前值
      0
      // 初始值
    );
    const dynamicNum = dynamicNumObj.update_info.item.count;
    return { messageNum, dynamicNum };
  }
  async function followUser(mid, isFollow) {
    const response = await fetch("https://api.bilibili.com/x/relation/modify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        fid: mid,
        act: isFollow ? "1" : "2",
        re_src: "11",
        csrf: getCSRF()
      }).toString(),
      credentials: "include"
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
  async function loadFollowList(orderType) {
    const content = document.querySelector(
      "#follow-list-dialog .follow-list-content"
    );
    let pageNumber = 1;
    let pageSize = 20;
    const data = await getFollowList(pageNumber, pageSize, orderType);
    const list = data.list;
    list.forEach(addElementByItem);
    const total = data.total;
    async function onScroll() {
      const { scrollTop, scrollHeight, clientHeight } = content;
      if (Math.abs(scrollTop + clientHeight - scrollHeight) > 1) {
        return;
      }
      content.removeEventListener("scroll", onScroll);
      const remainingData = total - pageNumber * pageSize;
      if (remainingData <= pageSize) {
        pageSize = remainingData;
      } else {
        setTimeout(() => {
          content.addEventListener("scroll", onScroll);
        }, 2e3);
        console.log("Scroll to bottom");
      }
      const data2 = await getFollowList(++pageNumber, pageSize, 1);
      const list2 = data2.list;
      list2.forEach(addElementByItem);
    }
    content.addEventListener("scroll", onScroll);
    const tabsPanel = document.querySelector(
      "#follow-list-dialog .header-tabs-panel"
    );
    const firstItem = tabsPanel.firstElementChild;
    const secondItem = firstItem.nextElementSibling;
    firstItem.addEventListener("click", () => {
      if (firstItem.classList.contains("header-tabs-panel__item--active")) {
        return;
      }
      firstItem.classList.add("header-tabs-panel__item--active");
      secondItem.classList.remove("header-tabs-panel__item--active");
      content.innerHTML = "";
      content.removeEventListener("scroll", onScroll);
      loadFollowList(1);
    });
    secondItem.addEventListener("click", () => {
      if (secondItem.classList.contains("header-tabs-panel__item--active")) {
        return;
      }
      secondItem.classList.add("header-tabs-panel__item--active");
      firstItem.classList.remove("header-tabs-panel__item--active");
      content.innerHTML = "";
      content.removeEventListener("scroll", onScroll);
      loadFollowList(2);
    });
    function addElementByItem(item) {
      const up = Object.assign(document.createElement("li"), {
        className: "list-item clearfix",
        /* html */
        innerHTML: `
          <div class="cover-container"><a href="//space.bilibili.com/${item.mid}" target="_blank" class="up-cover-components">
            <div class="bili-avatar" style="width: 100%;height:100%;">
              <img class="bili-avatar-img bili-avatar-face bili-avatar-img-radius" data-src="${formatUrl(item.face)}@96w_96h_1c_1s_!web-avatar-space-list.avif" alt="" src="${formatUrl(item.face)}@96w_96h_1c_1s_!web-avatar-space-list.avif">
            </div>
          </a></div>
          <div class="content">
            <a href="//space.bilibili.com/${item.mid}/" target="_blank" class="title"><span class="fans-name" style="color: rgb(251, 114, 153);">${item.uname}</span></a>
            <p title="${desc(item)}" class="auth-description">${desc(item)}</p>
            <div class="fans-action">
              <div class="be-dropdown fans-action-btn fans-action-follow">
                <i class="iconfont video-commonmenu"></i><span class="fans-action-text">已关注</span>
                <!--ul class="be-dropdown-menu" style="display: none;">
                  <li class="be-dropdown-item">设置分组</li>
                  <li class="be-dropdown-item">取消关注</li>
                </ul-->
              </div>
              <div class="be-dropdown">
                <div class="be-dropdown-trigger"><i title="更多操作" class="iconfont icon-ic_more"></i></div>
                <ul class="be-dropdown-menu" style="display: none;">
                  <li class="be-dropdown-item"><a target="_blank" href="//message.bilibili.com/#whisper/mid${item.mid}">发消息</a></li>
                </ul>
              </div>
            </div>
          </div>
          `
      });
      content.appendChild(up);
      const fansAction = up.querySelector(".fans-action");
      const follow = fansAction.firstElementChild;
      const more = follow.nextElementSibling;
      follow.addEventListener("click", async () => {
        if (!follow.classList.contains("follow")) {
          const followRes = await followUser(item.mid, false);
          if (followRes.code === 0) {
            follow.className = "fans-action-btn follow";
            follow.innerHTML = '<span class="fans-action-text">+&nbsp;&nbsp;关注</span>';
            follow.style.backgroundColor = "#00a1d6";
            follow.style.color = "white";
          }
        } else {
          const followRes = await followUser(item.mid, true);
          if (followRes.code === 0) {
            follow.className = "be-dropdown fans-action-btn fans-action-follow";
            follow.innerHTML = '<i class="iconfont video-commonmenu"></i><span class="fans-action-text">已关注</span>';
            follow.style.backgroundColor = "";
            follow.style.color = "";
          }
        }
      });
      more.addEventListener("mouseenter", () => {
        const dropdownMenu = more.querySelector(
          ".be-dropdown-menu"
        );
        dropdownMenu.style.display = "";
        fansAction.style.zIndex = `${2}`;
        more.style.color = "#00a1d6";
      });
      more.addEventListener("mouseleave", () => {
        const dropdownMenu = more.querySelector(
          ".be-dropdown-menu"
        );
        dropdownMenu.style.display = "none";
        fansAction.style.zIndex = `${2}`;
        more.style.color = "";
      });
    }
    function formatUrl(url) {
      return url.slice(url.indexOf(":") + 1);
    }
    function desc(item) {
      return item.official_verify.desc || item.sign;
    }
  }
  async function handleHistoryShowMore() {
    let cursor = {
      max: 0,
      view_at: 0
    };
    let pn = 0;
    let isHistoryItem = true;
    let isAddSearchItem = false;
    const data = await getHistoryList(cursor);
    cursor = data.cursor;
    const historyContent = document.querySelector(
      ".history-panel-popover>.header-tabs-panel__content"
    );
    const historySearch = Object.assign(document.createElement("form"), {
      id: "nav-searchform",
      innerHTML: `
    <div class="nav-search-content">
      <input class="nav-search-input" type="text" autocomplete="off" maxlength="100">
      <div class="nav-search-clean"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 14.75C11.7279 14.75 14.75 11.7279 14.75 8C14.75 4.27208 11.7279 1.25 8 1.25C4.27208 1.25 1.25 4.27208 1.25 8C1.25 11.7279 4.27208 14.75 8 14.75ZM9.64999 5.64303C9.84525 5.44777 10.1618 5.44777 10.3571 5.64303C10.5524 5.83829 10.5524 6.15487 10.3571 6.35014L8.70718 8.00005L10.3571 9.64997C10.5524 9.84523 10.5524 10.1618 10.3571 10.3571C10.1618 10.5523 9.84525 10.5523 9.64999 10.3571L8.00007 8.70716L6.35016 10.3571C6.15489 10.5523 5.83831 10.5523 5.64305 10.3571C5.44779 10.1618 5.44779 9.84523 5.64305 9.64997L7.29296 8.00005L5.64305 6.35014C5.44779 6.15487 5.44779 5.83829 5.64305 5.64303C5.83831 5.44777 6.15489 5.44777 6.35016 5.64303L8.00007 7.29294L9.64999 5.64303Z" fill="#C9CCD0" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #c8c3bc;"></path></svg></div>
    </div>
    <div class="nav-search-btn"><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.3451 15.2003C16.6377 15.4915 16.4752 15.772 16.1934 16.0632C16.15 16.1279 16.0958 16.1818 16.0525 16.2249C15.7707 16.473 15.4456 16.624 15.1854 16.3652L11.6848 12.8815C10.4709 13.8198 8.97529 14.3267 7.44714 14.3267C3.62134 14.3267 0.5 11.2314 0.5 7.41337C0.5 3.60616 3.6105 0.5 7.44714 0.5C11.2729 0.5 14.3943 3.59538 14.3943 7.41337C14.3943 8.98802 13.8524 10.5087 12.8661 11.7383L16.3451 15.2003ZM2.13647 7.4026C2.13647 10.3146 4.52083 12.6766 7.43624 12.6766C10.3517 12.6766 12.736 10.3146 12.736 7.4026C12.736 4.49058 10.3517 2.1286 7.43624 2.1286C4.50999 2.1286 2.13647 4.50136 2.13647 7.4026Z" fill="currentColor"></path></svg></div>
    `
    });
    historyContent.insertBefore(historySearch, historyContent.firstChild);
    const btn = historySearch.querySelector(".nav-search-btn");
    const input = historySearch.querySelector("input");
    const clean = historySearch.querySelector(".nav-search-clean");
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        btn.click();
      }
    });
    clean.addEventListener("click", () => {
      var _a;
      const oldElems = historyContent.querySelectorAll(".history-search-item");
      oldElems.forEach((elem) => elem.remove());
      (_a = historyContent.querySelector("#search-history")) == null ? void 0 : _a.remove();
      input.value = "";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      isAddSearchItem = false;
    });
    btn.addEventListener("click", async () => {
      if (!historyContent.querySelector("#search-history")) {
        const style = document.createElement("style");
        style.id = "search-history";
        style.textContent = `
      .header-tabs-panel__content>a:not(.history-search-item) {display: none}
      .header-tabs-panel__content>div {display: none}
    `;
        historyContent.appendChild(style);
      }
      pn = 1;
      const data2 = await getHistorySearchList(input.value, pn);
      pn++;
      const oldElems = historyContent.querySelectorAll(".history-search-item");
      oldElems.forEach((elem) => elem.remove());
      isAddSearchItem = true;
      data2.list.forEach(addElementByItem);
    });
    function removeNoFirstStyle() {
      var _a;
      isHistoryItem = true;
      (_a = historyContent.querySelector("#no-first-history-item")) == null ? void 0 : _a.remove();
    }
    function addNoFirstStyle() {
      isHistoryItem = false;
      if (!historyContent.querySelector("#no-first-history-item")) {
        const style = document.createElement("style");
        style.id = "no-first-history-item";
        style.textContent = `
      .header-tabs-panel__content>a.header-history-card {display: none}
      .header-tabs-panel__content>a.view-all-history-btn {display: block !important}
      .header-tabs-panel__content>form#nav-searchform {display: none}
      div.header-tabs-panel__content>div {display: block}
      `;
        historyContent.appendChild(style);
      }
    }
    const historyPanel = document.querySelector(
      ".header-tabs-panel"
    );
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.className === "header-tabs-panel__item" && node.textContent === "专栏") {
            historyPanel.children[0].addEventListener("click", removeNoFirstStyle);
            historyPanel.children[1].addEventListener("click", addNoFirstStyle);
            historyPanel.children[2].addEventListener("click", addNoFirstStyle);
            observer.disconnect();
          }
        });
      });
    });
    observer.observe(historyPanel, { childList: true });
    async function onScroll() {
      if (!isHistoryItem) {
        return;
      }
      const { scrollTop, scrollHeight, clientHeight } = historyContent;
      if (Math.abs(scrollTop + clientHeight - scrollHeight) > 1) {
        return;
      }
      historyContent.removeEventListener("scroll", onScroll);
      setTimeout(() => {
        historyContent.addEventListener("scroll", onScroll);
      }, 2e3);
      console.log("Scroll to bottom");
      const data2 = isAddSearchItem ? await getHistorySearchList(input.value, pn) : await getHistoryList(cursor);
      if (isAddSearchItem) {
        pn++;
      } else {
        cursor = data2.cursor;
      }
      data2.list.forEach(addElementByItem);
    }
    historyContent.addEventListener("scroll", onScroll);
    function addElementByItem(item) {
      const record = Object.assign(document.createElement("a"), {
        href: `//www.bilibili.com/video/${item.history.bvid}/?`,
        className: `header-history-card header-history-video ${isAddSearchItem ? "history-search-item" : ""}`,
        target: "_blank",
        "data-mod": "top_right_bar_window_history",
        "data-idx": "content",
        "data-ext": "click",
        // /* html */
        innerHTML: `
          <div class="header-history-video__image">
            <picture class="v-img">
              <source srcset="${formatUrl(item.cover)}@256w_144h_1c.avif" type="image/avif">
              <source srcset="${formatUrl(item.cover)}@256w_144h_1c.webp" type="image/webp">
              <img src="${formatUrl(item.cover)}@256w_144h_1c" alt="" loading="lazy" onload="" onerror="typeof window.imgOnError === 'function' &amp;&amp; window.imgOnError(this)">
            </picture>
            <div class="header-history-video__duration"><span class="header-history-video__duration--text">${`${formatProgressTime(item.progress)}/${formatProgressTime(item.duration)}`}</span></div>
            <div class="header-history-video__progress"><div class="header-history-video__progress--inner" style="width: ${item.progress / item.duration * 100}%; border-radius: 0px;"></div></div>
          </div>
          <div class="header-history-card__info">
            <div title="${item.title}" class="header-history-card__info--title">${item.title}</div>
            <div class="header-history-card__info--date">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="device-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.55 13C10.8262 13 11.05 13.2239 11.05 13.5C11.05 13.7761 10.8262 14 10.55 14H5.55005C5.27391 14 5.05005 13.7761 5.05005 13.5C5.05005 13.2239 5.27391 13 5.55005 13H10.55ZM13.05 2C14.1546 2 15.05 2.89543 15.05 4V10C15.05 11.1046 14.1546 12 13.05 12H3.05005C1.94548 12 1.05005 11.1046 1.05005 10V4C1.05005 2.89543 1.94548 2 3.05005 2H13.05ZM13.05 3H3.05005C2.53721 3 2.11454 3.38604 2.05678 3.88338L2.05005 4V10C2.05005 10.5128 2.43609 10.9355 2.93343 10.9933L3.05005 11H13.05C13.5629 11 13.9856 10.614 14.0433 10.1166L14.05 10V4C14.05 3.44772 13.6023 3 13.05 3Z" fill="#999999"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M7 11H9L10 14H6L7 11Z" fill="#999999"></path></svg>
              <span>${formatViewTime(item.view_at)}</span>
            </div>
            <div class="header-history-card__info--name" title="${item.author_name}">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="up-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.33334 5.16669C1.33334 3.78597 2.45263 2.66669 3.83334 2.66669H12.1667C13.5474 2.66669 14.6667 3.78597 14.6667 5.16669V10.8334C14.6667 12.2141 13.5474 13.3334 12.1667 13.3334H3.83334C2.45263 13.3334 1.33334 12.2141 1.33334 10.8334V5.16669ZM3.83334 3.66669C3.00492 3.66669 2.33334 4.33826 2.33334 5.16669V10.8334C2.33334 11.6618 3.00492 12.3334 3.83334 12.3334H12.1667C12.9951 12.3334 13.6667 11.6618 13.6667 10.8334V5.16669C13.6667 4.33826 12.9951 3.66669 12.1667 3.66669H3.83334ZM4.33334 5.50002C4.60949 5.50002 4.83334 5.72388 4.83334 6.00002V8.50002C4.83334 9.05231 5.28106 9.50002 5.83334 9.50002C6.38563 9.50002 6.83334 9.05231 6.83334 8.50002V6.00002C6.83334 5.72388 7.0572 5.50002 7.33334 5.50002C7.60949 5.50002 7.83334 5.72388 7.83334 6.00002V8.50002C7.83334 9.60459 6.93791 10.5 5.83334 10.5C4.72877 10.5 3.83334 9.60459 3.83334 8.50002V6.00002C3.83334 5.72388 4.0572 5.50002 4.33334 5.50002ZM9.00001 5.50002C8.72387 5.50002 8.50001 5.72388 8.50001 6.00002V10C8.50001 10.2762 8.72387 10.5 9.00001 10.5C9.27615 10.5 9.50001 10.2762 9.50001 10V9.33335H10.5833C11.6419 9.33335 12.5 8.47523 12.5 7.41669C12.5 6.35814 11.6419 5.50002 10.5833 5.50002H9.00001ZM10.5833 8.33335H9.50001V6.50002H10.5833C11.0896 6.50002 11.5 6.91043 11.5 7.41669C11.5 7.92295 11.0896 8.33335 10.5833 8.33335Z" fill="#999999"></path></svg>
              <span>${item.author_name}</span>
            </div>
          </div>
          `
      });
      historyContent.appendChild(record);
    }
    const formatUrl = (url) => url.slice(url.indexOf(":") + 1);
    function formatProgressTime(seconds) {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor(seconds % 3600 / 60);
      const secs = seconds % 60;
      return `${hrs ? `${hrs}:` : ""}${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    function formatViewTime(timestamp) {
      const days = Math.floor(timestamp / 86400);
      const hrs = Math.floor(timestamp % 86400 / 3600);
      const mins = Math.floor(timestamp % 3600 / 60);
      const now = Math.floor(Date.now() / 1e3);
      const today = Math.floor(now / 86400);
      const dayTextMap = {
        0: "今天",
        1: "昨天",
        2: "前天"
      };
      const dayText = dayTextMap[today - days] || `${today - days}天前`;
      return `${dayText} ${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
    }
  }
  function handleDynamicShowMore() {
    let offset = "";
    let i = 0;
    async function getLoadedData() {
      const data = await getDynamicList(offset);
      offset = data.offset;
      if (i < 2) {
        getLoadedData();
        i++;
      }
    }
    getLoadedData();
    const dynamicContent = document.querySelector(
      ".dynamic-panel-popover>.header-tabs-panel__content"
    );
    const dynamicAll = dynamicContent.querySelector(".dynamic-all");
    let loadedTitle = [];
    async function onScroll() {
      const { scrollTop, scrollHeight, clientHeight } = dynamicContent;
      if (Math.abs(scrollTop + clientHeight - scrollHeight) > 1) {
        return;
      }
      dynamicContent.removeEventListener("scroll", onScroll);
      setTimeout(() => {
        dynamicContent.addEventListener("scroll", onScroll);
      }, 2e3);
      console.log("Scroll to bottom");
      const data = await getDynamicList(offset);
      offset = data.offset;
      data.items.forEach(checkIsLoaded);
      const dynamics = dynamicAll.querySelectorAll(":scope>a");
      loadedTitle = Array.from(dynamics).map((a) => a.title);
    }
    dynamicContent.addEventListener("scroll", onScroll);
    function checkIsLoaded(item) {
      if (!loadedTitle.includes(item.title)) {
        addElementByItem(item);
      }
    }
    function addElementByItem(item) {
      const author = item.author;
      const cover = item.cover;
      const record = Object.assign(document.createElement("a"), {
        href: `${item.jump_url}`,
        title: `${item.title}`,
        target: "_blank",
        "data-mod": "top_right_bar_window_dynamic",
        "data-idx": "content",
        "data-ext": "click",
        // /* html */
        innerHTML: `
          <div data-v-16c69722="" data-v-0290fa94="" class="header-dynamic-list-item" title="${item.title}" target="_blank">
            <div data-v-16c69722="" class="header-dynamic-container">
              <div data-v-16c69722="" class="header-dynamic__box--left"><a data-v-16c69722="" class="header-dynamic-avatar" href="${author.jump_url}" title="${author.name}" target="_blank">
                <div class="bili-avatar" style="width: 100%;height:100%;">
                  <img class="bili-avatar-img bili-avatar-face bili-avatar-img-radius" data-src="${formatUrl(author.face)}@96w_96h_1c_1s_!web-avatar.avif" alt="" src="${formatUrl(author.face)}@96w_96h_1c_1s_!web-avatar.avif">
                </div>
              </a></div>
              <div data-v-16c69722="" class="header-dynamic__box--center">
                <div data-v-16c69722="" class="dynamic-name-line">
                  <div data-v-16c69722="" class="user-name">
                    <a data-v-16c69722="" href="${author.jump_url}" title="${author.name}" target="_blank">${author.name}</a>
                  </div>
                </div>
                <div data-v-16c69722="" class="dynamic-info-content" title="">
                  <div data-v-0290fa94="" class="all-in-one-article-title">${item.title}</div>
                </div>
                <span data-v-0290fa94="" class="publish-time">${item.pub_time}</span>
              </div>
              <a data-v-16c69722="" class="header-dynamic__box--right" href="${item.jump_url}" target="_blank">
                <div data-v-0290fa94="" class="cover">
                  <picture data-v-0290fa94="" class="v-img">
                    <source srcset="${formatUrl(cover)}@164w_92h_1c.avif" type="image/avif">
                    <source srcset="${formatUrl(cover)}@164w_92h_1c.webp" type="image/webp">
                    <img src="${formatUrl(cover)}@164w_92h_1c" alt="" loading="lazy" onload="" onerror="typeof window.imgOnError === 'function' &amp;&amp; window.imgOnError(this)">
                  </picture>
                  <div data-v-0290fa94="" class="watch-later"><svg data-v-0290fa94="" class="bili-watch-later__icon"><use xlink:href="#widget-watch-later"></use></svg></div>
                </div>
              </a>
            </div>
          </div>
          `
      });
      dynamicAll == null ? void 0 : dynamicAll.appendChild(record);
    }
    const formatUrl = (url) => url.slice(url.indexOf(":") + 1);
  }
  function setMenuBtn() {
    let isOldApp;
    const preloadeditems1 = [
      // 旧APP不用预加载消息
      '.v-popover-wrap:has(>.right-entry__outside[href="//t.bilibili.com/"])',
      ".v-popover-wrap:has(>.right-entry__outside[data-header-fav-entry])",
      '.right-entry__outside[href="//www.bilibili.com/history"]',
      ".header-avatar-wrap"
    ];
    const preloadeditems2 = [
      ".v-popover-wrap:has(>[data-idx=message])",
      ".v-popover-wrap:has(>[data-idx=dynamic])",
      ".v-popover-wrap:has(>[data-idx=fav])",
      ".v-popover-wrap:has(>[data-idx=history])",
      ".header-avatar-wrap"
    ];
    function preload() {
      const preloadeditems = isOldApp ? preloadeditems1 : preloadeditems2;
      preloadeditems.forEach((item) => {
        var _a;
        (_a = document.querySelector(item)) == null ? void 0 : _a.dispatchEvent(new MouseEvent("mouseenter"));
      });
      setTimeout(handleHistoryShowMore, 70);
      setTimeout(handleDynamicShowMore, 60);
    }
    tryPreload();
    function tryPreload() {
      if (document.querySelector(preloadeditems1[0]) && // 排除登录、主页
      document.querySelector(preloadeditems1[1]) && document.querySelector(preloadeditems1[2])) {
        let changeMenu = function() {
          if (document.querySelector("#header-in-menu")) {
            document.querySelector(
              '[data-refer="[data-idx=message]"]'
            ).dataset.refer = ".right-entry__outside[href='//message.bilibili.com']";
            document.querySelector(
              '[data-refer="[data-idx=dynamic]"]'
            ).dataset.refer = ".right-entry__outside[href='//t.bilibili.com/']";
            document.querySelector(
              '[data-refer="[data-idx=fav]"]'
            ).dataset.refer = ".right-entry__outside[data-header-fav-entry]";
            document.querySelector(
              '[data-refer="[data-idx=history]"]'
            ).dataset.refer = ".right-entry__outside[href='//www.bilibili.com/history']";
          } else {
            setTimeout(changeMenu, 50);
          }
        };
        isOldApp = true;
        preload();
        changeMenu();
      } else if (document.querySelector(preloadeditems2[0]) && // 排除登录、主页
      document.querySelector(preloadeditems2[1]) && document.querySelector(preloadeditems2[2]) && document.querySelector(preloadeditems2[3])) {
        isOldApp = false;
        preload();
      } else {
        setTimeout(tryPreload, 1e3);
      }
    }
    const menuFab = document.getElementById("menu-fab");
    const menuOverlay = Object.assign(document.createElement("div"), {
      id: "menu-overlay",
      // 顺序要与 setting.js 中的菜单选项排序对应
      innerHTML: `
    <div id="header-in-menu">
      <ul>
        <li><a target="_blank" href="https://www.bilibili.com/v/popular/all/">热门</a></li>
        <li data-refer="[data-idx=category]">分类</li>
        <li data-refer="[data-idx=message]">消息<span class="badge" id="message-badge"></span></li>
        <li data-refer="[data-idx=dynamic]">动态<span class="badge" id="dynamic-badge"></span></li>
        <li data-refer="[data-idx=fav]">收藏</li>
        <li data-refer="[data-idx=history]">历史</li>
        <li data-refer=".header-avatar-wrap--container">主页</li>
        <li data-refer="[data-idx=follow]">关注</li>
      </li>
    </div>
    `
    });
    menuFab.appendChild(menuOverlay);
    const menu = menuOverlay.querySelector("#header-in-menu");
    menuFab.addEventListener("click", () => {
      menu.classList.add("show");
      menuOverlay.classList.add("show");
      menuFab.classList.add("active");
    });
    updateBadges();
    async function updateBadges() {
      function update(id, number) {
        const badge = menuOverlay.querySelector(`#${id}`);
        if (number > 0) {
          badge.textContent = number > 99 ? "99+" : number.toString();
          badge.style.visibility = "visible";
        } else {
          badge.style.visibility = "hidden";
        }
      }
      const { messageNum, dynamicNum } = await getUnreadNums();
      update("message-badge", messageNum);
      update("dynamic-badge", dynamicNum);
    }
    let openedDialog = "";
    const items = menuOverlay.querySelectorAll("li");
    items.forEach(
      (item) => item.addEventListener("click", (event) => {
        event.stopPropagation();
        menu.classList.remove("show");
        const refer = item.dataset.refer;
        if (!refer) {
          menuOverlay.classList.remove("show");
          return;
        }
        const referElement = document.querySelector(`${refer}+.v-popover`);
        if (!referElement) {
          const toast = document.querySelector("#toast");
          toast.textContent = "网页菜单加载中，请稍后重试";
          toast.style.display = "block";
          setTimeout(() => {
            toast.setAttribute("show", "");
          }, 10);
          menuOverlay.click();
          setTimeout(() => {
            toast.removeAttribute("show");
            toast.addEventListener(
              "transitionend",
              () => {
                toast.style.cssText = "";
              },
              { once: true }
            );
          }, 3e3);
          return;
        }
        openedDialog = refer;
        referElement.setAttribute("display", "");
        setTimeout(() => {
          referElement.setAttribute("show", "");
        }, 10);
      })
    );
    menuOverlay.addEventListener("click", (event) => {
      event.stopPropagation();
      menu.classList.remove("show");
      menuOverlay.classList.remove("show");
      menuFab.classList.remove("active");
      if (openedDialog === "") {
        return;
      }
      const referElement = document.querySelector(
        `${openedDialog}+.v-popover`
      );
      referElement.removeAttribute("show");
      handleTransitionEndOnce(referElement, "opacity", () => {
        referElement.removeAttribute("display");
      });
      if (openedDialog === "'.right-entry__outside[href='//message.bilibili.com']" || openedDialog === ".right-entry__outside[href='//t.bilibili.com/']") {
        updateBadges();
      }
    });
    function handleTouchMove() {
      menuOverlay.click();
    }
    menuOverlay.addEventListener(
      "touchstart",
      () => menuOverlay.addEventListener("touchmove", handleTouchMove, { once: true })
    );
    menuOverlay.addEventListener(
      "touchend",
      () => menuOverlay.removeEventListener("touchmove", handleTouchMove)
    );
    createExtraDialog();
    function createExtraDialog() {
      const falseHeader = Object.assign(document.createElement("div"), {
        className: "bili-header false-header",
        innerHTML: `
      <div data-idx="category" class="right-entry__outside copy-category"></div>
<div class="v-popover" id="copy-category-dialog">
  <div class="v-popover-content">
    <div class="bili-header-channel-panel">
      <div class="channel-panel__column">
        <a href="//www.bilibili.com/anime/" target="_blank"><span class="name">番剧</span></a>
        <a href="//www.bilibili.com/movie/" target="_blank"><span class="name">电影</span></a>
        <a href="//www.bilibili.com/guochuang/" target="_blank"><span class="name">国创</span></a>
        <a href="//www.bilibili.com/tv/" target="_blank"><span class="name">电视</span></a>
        <a href="//www.bilibili.com/variety/" target="_blank"><span class="name">综艺</span></a>
        <a href="//www.bilibili.com/documentary/" target="_blank"><span class="name">纪录</span></a>
        <a href="//www.bilibili.com/v/douga/" target="_blank"><span class="name">动画</span></a>
        <a href="//www.bilibili.com/v/game/" target="_blank"><span class="name">游戏</span></a>
        <a href="//www.bilibili.com/v/kichiku/" target="_blank"><span class="name">鬼畜</span></a>
        <a href="//www.bilibili.com/v/music" target="_blank"><span class="name">音乐</span></a>
      </div>
      <div class="channel-panel__column">
        <a href="//www.bilibili.com/v/dance/" target="_blank"><span class="name">舞蹈</span></a>
        <a href="//www.bilibili.com/v/cinephile" target="_blank"><span class="name">影视</span></a>
        <a href="//www.bilibili.com/v/ent/" target="_blank"><span class="name">娱乐</span></a>
        <a href="//www.bilibili.com/v/knowledge/" target="_blank"><span class="name">知识</span></a>
        <a href="//www.bilibili.com/v/tech/" target="_blank"><span class="name">科技</span></a>
        <a href="//www.bilibili.com/v/information/" target="_blank"><span class="name">资讯</span></a>
        <a href="//www.bilibili.com/v/food" target="_blank"><span class="name">美食</span></a>
        <a href="//www.bilibili.com/v/life" target="_blank"><span class="name">生活</span></a>
        <a href="//www.bilibili.com/v/car" target="_blank"><span class="name">汽车</span></a>
        <a href="//www.bilibili.com/v/fashion" target="_blank"><span class="name">时尚</span></a>
      </div>
      <div class="channel-panel__column">
        <a href="//www.bilibili.com/v/sports" target="_blank"><span class="name">运动</span></a>
        <a href="//www.bilibili.com/v/animal" target="_blank"><span class="name">动物</span></a>
        <a href="//www.bilibili.com/v/life/daily/?tag=530003" target="_blank"><span class="name">VLOG</span></a>
        <a href="//www.bilibili.com/v/life/funny" target="_blank"><span class="name">搞笑</span></a>
        <a href="//www.bilibili.com/v/game/stand_alone" target="_blank"><span class="name">单机游戏</span></a>
        <a href="//www.bilibili.com/v/virtual" target="_blank"><span class="name">虚拟UP</span></a>
        <a href="//love.bilibili.com" target="_blank"><span class="name">公益</span></a>
        <a href="//www.bilibili.com/mooc" target="_blank"><span class="name">公开</span></a>
      </div>
      <div class="channel-panel__column">
        <a href="//www.bilibili.com/read/home" target="_blank"><span class="name">专栏</span></a>
        <a href="//live.bilibili.com" target="_blank"><span class="name">直播</span></a>
        <a href="//www.bilibili.com/blackboard/activity-list.html?" target="_blank"><span class="name">活动</span></a>
        <a href="//www.bilibili.com/cheese/" target="_blank"><span class="name">课堂</span></a>
        <a href="https://www.bilibili.com/blackboard/activity-5zJxM3spoS.html" target="_blank"><span class="name">社区中心</span></a>
        <a href="//music.bilibili.com/pc/music-center/" target="_blank"><span class="name">新歌热榜</span></a>
      </div>
    </div>
  </div>
</div>
      `
      });
      document.body.appendChild(falseHeader);
      const followOutside = document.createElement("div");
      followOutside.className = "right-entry__outside follow-list";
      followOutside.dataset.idx = "follow";
      falseHeader.appendChild(followOutside);
      const followDialog = Object.assign(document.createElement("div"), {
        className: "v-popover is-bottom",
        id: "follow-list-dialog",
        // /* html */
        innerHTML: `
        <div class="v-popover-content"><div class="history-panel-popover">
          <div class="header-tabs-panel">
            <div class="header-tabs-panel__item--active header-tabs-panel__item">最常访问</div>
            <div class="header-tabs-panel__item">最近添加</div>
          </div>
          <ul class="follow-list-content"></ul>
        </div></div>
        `
      });
      falseHeader.appendChild(followDialog);
      loadFollowList(1);
    }
  }
  function touchZoomWrap(zoomWrap, photoShadow) {
    if (zoomWrap) {
      let initialDistance = 0;
      let initialScale = 1;
      let transformOrigin = { x: 0, y: 0 };
      let startX = 0;
      let startY = 0;
      let initialTransformX = 0;
      let initialTransformY = 0;
      let lastTouchCount = 0;
      const calculateDistance = (touches) => {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
      };
      const calculateCenter = (touches) => {
        const dx = (touches[0].clientX + touches[1].clientX) / 2;
        const dy = (touches[0].clientY - touches[1].clientY) / 2;
        return [dx, dy];
      };
      const calcInitialTranslate = (changedTouches) => {
        startX = changedTouches[0].clientX;
        startY = changedTouches[0].clientY;
        initialTransformX = +zoomWrap.style.transform.match(
          /translate\((-?[0-9.]+)px, -?[0-9.]+px\)/
        )[1];
        initialTransformY = +zoomWrap.style.transform.match(
          /translate\(-?[0-9.]+px, (-?[0-9.]+)px\)/
        )[1];
      };
      const handleTouchStart = (event) => {
        if (zoomWrap.style.cssText.match(/scale3d\(1, 1, 1\)/)) {
          zoomWrap.style.cssText = `transform: scale(1) translate(0px, 0px) !important;
transform-origin: 50% 50%;
`;
        }
        if (event.touches.length === 2) {
          initialDistance = calculateDistance(event.touches);
          const center = calculateCenter(event.touches);
          transformOrigin = { x: center[0], y: center[1] };
          updateTransformOrigin();
        } else if (event.touches.length === 1) {
          calcInitialTranslate(event.changedTouches);
        }
        lastTouchCount = event.touches.length;
        initialScale = getCurrentScale();
        zoomWrap.addEventListener("touchmove", handleTouchMove, {
          passive: false
        });
      };
      const handleTouchMove = (event) => {
        if (event.touches.length === 2) {
          const currentDistance = calculateDistance(event.touches);
          const scale = Math.max(
            1,
            initialScale * (currentDistance / initialDistance)
          );
          const center = calculateCenter(event.touches);
          transformOrigin = { x: center[0], y: center[1] };
          updateTransform(scale);
          updateTransformOrigin();
          event.preventDefault();
        } else if (event.touches.length === 1 && lastTouchCount === 2) {
          calcInitialTranslate(event.touches);
          initialScale = getCurrentScale();
        } else if (event.touches.length === 1 && initialScale > 1.05) {
          if (initialScale > 1.05) {
            const deltaX = (event.changedTouches[0].clientX - startX) / initialScale;
            const deltaY = (event.changedTouches[0].clientY - startY) / initialScale;
            zoomWrap.style.cssText = zoomWrap.style.cssText.replace(
              /translate\(-?[0-9.]+px, -?[0-9.]+px\)/,
              `translate(${initialTransformX + deltaX}px, ${initialTransformY + deltaY}px)`
            );
          }
        }
        lastTouchCount = event.touches.length;
      };
      const handleTouchEnd = (event) => {
        var _a, _b;
        zoomWrap.removeEventListener("touchend", handleTouchMove);
        if (event.touches.length === 0) {
          if (initialScale < 1.05) {
            const offsetX = event.changedTouches[0].clientX - startX;
            const offsetY = event.changedTouches[0].clientY - startY;
            if (Math.abs(offsetX) > 55 && Math.abs(offsetY / offsetX) < 1 / 2) {
              if (offsetX > 0) {
                (_a = photoShadow.querySelector("#prev")) == null ? void 0 : _a.click();
              } else {
                (_b = photoShadow.querySelector("#next")) == null ? void 0 : _b.click();
              }
            }
          }
        }
        if (event.touches.length === 1) {
          calcInitialTranslate(event.changedTouches);
        }
      };
      const getCurrentScale = () => {
        const match = zoomWrap.style.transform.match(/scale\(([0-9.]+)\)/);
        return match ? parseFloat(match[1]) : 1;
      };
      const updateTransform = (scale) => {
        const currentTransform = zoomWrap.style.transform;
        const newTransform = currentTransform.replace(
          /scale\([0-9.]+\)/,
          `scale(${scale})`
        );
        zoomWrap.style.transform = newTransform;
      };
      const updateTransformOrigin = () => {
        zoomWrap.style.transformOrigin = `${transformOrigin.x}px ${transformOrigin.y}px`;
      };
      zoomWrap.addEventListener("touchstart", handleTouchStart);
      zoomWrap.addEventListener("touchend", handleTouchEnd);
    }
  }
  function modifyShadowDOMLate(isDynamicRefresh = false) {
    let commentsShadow = null;
    let commentsHeaderShadow = null;
    let headerBoxShadow = null;
    const comment = document.getElementById("commentapp");
    if (!comment) return;
    const observer = new MutationObserver(handleCommentMutation);
    observer.observe(comment, { childList: true, subtree: true });
    function handleCommentMutation(mutations) {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.nodeName.toLowerCase() === "bili-comments") {
            observeComments();
            observer.disconnect();
          }
        });
      });
    }
    function observeComments() {
      var _a;
      commentsShadow = (_a = document.querySelector("bili-comments")) == null ? void 0 : _a.shadowRoot;
      if (!commentsShadow) return;
      const observer2 = new MutationObserver(handleCommentsMutation);
      observer2.observe(commentsShadow, { childList: true, subtree: true });
      appendStyle2(
        commentsShadow,
        `
        div#contents {
          padding-top: 0;
        }`
      );
    }
    function handleCommentsMutation(mutations) {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.id === "contents") {
            observeHeader();
            observeContent();
          } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName.toLowerCase() === "bili-comment-thread-renderer") {
            const threadShadow = node.shadowRoot;
            let observer2;
            const callback = (mutations2) => handleContentMutation(mutations2, observer2);
            observer2 = new MutationObserver(callback);
            observer2.observe(threadShadow, { childList: true, subtree: true });
          }
        });
      });
    }
    function observeHeader() {
      var _a;
      commentsHeaderShadow = (_a = commentsShadow == null ? void 0 : commentsShadow.querySelector(
        "bili-comments-header-renderer"
      )) == null ? void 0 : _a.shadowRoot;
      if (!commentsHeaderShadow) return;
      let observer2;
      const callback = (mutations) => handleHeaderMutation(mutations, observer2);
      observer2 = new MutationObserver(callback);
      observer2.observe(commentsHeaderShadow, { childList: true, subtree: true });
      appendStyle2(
        commentsHeaderShadow,
        `
div#commentbox {
  position: fixed;
  left: 0;
  bottom: var(--actionbar-height);
  z-index: 10;
  width: calc(100% - (100% - 200px) / 3);
  padding: 7px calc((100% - 200px) / 6);
  transition: calc(var(--actionbar-time)*1.40) ease-in;
  display: var(--commentbox-display);
  transform: var(--shadow-transform);
  backdrop-filter: blur(3px);
  background-color: rgba(255, 255, 255, .6);
}
div#commentbox[style] {
  display: none;
}
div#commentbox[style]+.bili-comments-bottom-fixed-wrapper {
  width: 100% !important;
  bottom: var(--actionbar-height) !important;
}
div#commentbox[style]+.bili-comments-bottom-fixed-wrapper>div {
  padding: 8px 12px !important;
  width: calc(100% - 24px) !important;
  transition: calc(var(--actionbar-time)* 1.40) ease-in;
  display: var(--commentbox-display);
  transform: var(--shadow-transform);
  backdrop-filter: blur(3px);
  background-color: rgba(255, 255, 255, .6) !important;
  border: none !important;
}
div#navbar {
  margin-bottom: 0;
}
#notice {
  display: none;
}`
      );
    }
    function handleHeaderMutation(mutations, observer2) {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.nodeName.toLowerCase() === "div" && node.id === "commentbox") {
            observeHeader2();
            observer2.disconnect();
          }
        });
      });
    }
    function observeHeader2() {
      var _a;
      headerBoxShadow = (_a = commentsHeaderShadow == null ? void 0 : commentsHeaderShadow.querySelector("bili-comment-box")) == null ? void 0 : _a.shadowRoot;
      if (!headerBoxShadow) return;
      let observer2;
      const callback = (mutations) => handleHeader2Mutation(mutations, observer2);
      observer2 = new MutationObserver(callback);
      observer2.observe(headerBoxShadow, { childList: true, subtree: true });
      appendStyle2(
        headerBoxShadow,
        `
        :host {
          display: var(--commentbox-display) !important;
        }
        div#user-avatar {
          display: none;
        }
        div#comment-area {
          width: 100%;
        }
        div#editor {
          border-radius: 13px;
          padding: 0;
          border: none;
        }`
      );
      const headerVote = commentsHeaderShadow == null ? void 0 : commentsHeaderShadow.querySelector(
        "bili-comments-vote-card"
      );
      if (headerVote) {
        appendStyle2(
          headerVote.shadowRoot,
          `.option.left,
        .option.right {
          min-width: 0 !important;
        }
        #card {
          padding-top: 27px !important;
        }
        #info {
          transform: translateY(-23px);
        }
        #title {
          overflow: visible !important;
          white-space: nowrap;
          position: absolute;
        }
        #desc {
          padding-top: 20px;
        }`
        );
      }
    }
    function handleHeader2Mutation(mutations, observer2) {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.nodeName.toLowerCase() === "div" && node.id === "comment-area") {
            observeHeader3();
            observer2.disconnect();
          }
        });
      });
    }
    function observeHeader3() {
      const oldTextarea = headerBoxShadow == null ? void 0 : headerBoxShadow.querySelector("bili-comment-textarea");
      const textarea = oldTextarea ? oldTextarea : headerBoxShadow == null ? void 0 : headerBoxShadow.querySelector("bili-comment-rich-textarea");
      if (oldTextarea) {
        appendStyle2(
          textarea.shadowRoot,
          `textarea#input {
            line-height: 26px;
            min-height: 26px;
            height: 26px !important;
          }`
        );
      } else {
        appendStyle2(
          textarea.shadowRoot,
          `div#input, div.brt-root {
        line-height: 26px;
        min-height: 26px;
        --brt-line-height: 26px;
      }`
        );
      }
    }
    function observeContent() {
      const commentThreads = commentsShadow == null ? void 0 : commentsShadow.querySelectorAll(
        "bili-comment-thread-renderer"
      );
      commentThreads == null ? void 0 : commentThreads.forEach((thread) => {
        const threadShadow = thread.shadowRoot;
        let observer2;
        const callback = (mutations) => handleContentMutation(mutations, observer2);
        observer2 = new MutationObserver(callback);
        observer2.observe(threadShadow, { childList: true, subtree: true });
      });
    }
    function handleContentMutation(mutations, observer2) {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.nodeName.toLowerCase() === "div" && node.id === "replies") {
            observeContent2(mutation.target);
            observer2.disconnect();
          }
        });
      });
    }
    function observeContent2(threadShadow) {
      var _a, _b;
      const commentShadow = (_a = threadShadow == null ? void 0 : threadShadow.querySelector(
        "bili-comment-renderer"
      )) == null ? void 0 : _a.shadowRoot;
      const repliesShadow = (_b = threadShadow == null ? void 0 : threadShadow.querySelector(
        "bili-comment-replies-renderer"
      )) == null ? void 0 : _b.shadowRoot;
      appendStyle2(
        commentShadow,
        `
        div#body {
          padding: 4px 0 0 44px;
          --bili-comment-hover-more-display: block;
        }
        a#user-avatar {
          left: 0;
          top: 12px;
        }`
      );
      appendStyle2(
        repliesShadow,
        `
        div#expander {
          padding-left: 40px;
        }`
      );
      let observer2;
      const callback = (mutations) => handleCommentShadowMutation(mutations, observer2);
      observer2 = new MutationObserver(callback);
      observer2.observe(commentShadow, { childList: true, subtree: true });
      let observer22;
      const callback2 = (mutations) => handleRepliesShadowMutation(mutations, observer22);
      observer22 = new MutationObserver(callback2);
      observer22.observe(repliesShadow, { childList: true, subtree: true });
    }
    function handleCommentShadowMutation(mutations, observer2) {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          var _a;
          if (node.nodeType === Node.ELEMENT_NODE && node.nodeName.toLowerCase() === "div" && node.id === "body") {
            const avatarShadow = (_a = mutation.target.querySelector(
              "bili-avatar"
            )) == null ? void 0 : _a.shadowRoot;
            appendStyle2(
              avatarShadow,
              `
              .layer.center {
                width: 48px !important;
                height: 48px !important;
              }`
            );
            observer2.disconnect();
          }
        });
      });
    }
    function handleRepliesShadowMutation(mutations, observer2) {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.nodeName.toLowerCase() === "div" && node.id === "expander") {
            const replies = mutation.target.querySelectorAll(
              "bili-comment-reply-renderer"
            );
            replies.forEach((reply) => {
              const replyShadow = reply.shadowRoot;
              appendStyle2(
                replyShadow,
                `
                div#body {
                  padding: 4px 0 4px 29px;
                  --bili-comment-hover-more-display: block;
                }`
              );
              observer2.disconnect();
            });
          }
        });
      });
    }
    function appendStyle2(shadowRoot, cssText) {
      const style = document.createElement("style");
      style.textContent = cssText;
      shadowRoot.appendChild(style);
    }
    if (isDynamicRefresh) {
      return;
    }
    new MutationObserver(handleBodyMutation).observe(document.body, {
      childList: true
    });
    function handleBodyMutation(mutations) {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.nodeName.toLowerCase() === "bili-photoswipe") {
            const photoShadow = node.shadowRoot;
            const zoomWrap = photoShadow == null ? void 0 : photoShadow.querySelector(
              "#zoom-wrap"
            );
            zoomWrap.addEventListener(
              "click",
              (event) => {
                event.stopImmediatePropagation();
                (photoShadow == null ? void 0 : photoShadow.querySelector("#close")).click();
              },
              { capture: true, once: true }
            );
            touchZoomWrap(zoomWrap, photoShadow);
            appendStyle2(
              photoShadow,
              `
#container {z-index:3;}
#thumb {z-index: 4;}
#prev, #next, #close {visibility: hidden;}
#item {
  display: flex;
  justify-content: center;
  align-items: center;
}
#zoom-wrap {
  position: unset !important;
  transform: none !important;
}
`
            );
          }
        });
      });
    }
    new MutationObserver(handleBodyMutation2).observe(document.body, {
      childList: true
    });
    function handleBodyMutation2(mutations) {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.nodeName.toLowerCase() === "bili-comments-popup") {
            const iframe = node.querySelector("iframe");
            iframe.addEventListener("load", () => {
              const contentDocument = iframe.contentDocument;
              const style = contentDocument.createElement("style");
              style.textContent = `
div.bili-dyn-item-draw {
  min-width: 0;
  padding-left: 58px;
}
div.bili-dyn-item-draw__avatar {
  width: 58px;
  height: 58px;
}
.bili-album__preview__picture {
  max-width: 100%;
  height: auto !important;
}
.bili-album__preview[class*=grid] {
  max-width: 100%;
}
.bili-album__preview[class*=grid] .bili-album__preview__picture {
    margin-bottom: 4px;
}
                `;
              contentDocument.head.appendChild(style);
            });
            node.addEventListener(
              "click",
              () => {
                node.shadowRoot.querySelector(
                  "#close"
                ).click();
              },
              { once: true }
            );
          }
        });
      });
    }
  }
  function setSidebarBtn(type) {
    const videoMap = {
      video: [".right-container", ".rec-footer"],
      list: [".playlist-container--right", ".recommend-list-container"]
    };
    if (["video", "list"].includes(type)) {
      handleVideoSidebar();
      showMoreRecommend();
    } else if (type === "message") {
      handleMessageSidebar();
    }
    function handleVideoSidebar() {
      const sidebarFab = document.getElementById("sidebar-fab");
      const videoContainer = document.querySelector(
        "#mirror-vdcon"
      );
      sidebarFab.addEventListener(
        "click",
        () => videoContainer.toggleAttribute("sidebar")
      );
      function closeSidebar() {
        videoContainer.removeAttribute("sidebar");
      }
      const rightContainer = videoContainer.querySelector(
        videoMap[type][0]
      );
      const recommendLiist = rightContainer.querySelector(
        videoMap[type][1]
      );
      recommendLiist.addEventListener("click", (event) => {
        const nextPlay = document.querySelector(".rec-title");
        const recommendFooter = document.querySelector(".rec-footer");
        if (!(nextPlay == null ? void 0 : nextPlay.contains(event.target)) && !(recommendFooter == null ? void 0 : recommendFooter.contains(event.target))) {
          closeSidebar();
          handleTransitionEndOnce(rightContainer, "transform", () => {
            rightContainer.scrollTop = 0;
          });
          modifyShadowDOMLate(true);
        }
      });
    }
    function showMoreRecommend() {
      var _a;
      const recommendFooter = document.querySelector(".rec-footer");
      setTimeout(() => {
        recommendFooter == null ? void 0 : recommendFooter.click();
      }, 2e3);
      (_a = document.querySelector("video")) == null ? void 0 : _a.addEventListener("canplay", showMoreRecommend, { once: true });
    }
    function handleMessageSidebar() {
      const sidebarFab = document.getElementById("sidebar-fab");
      const messageContainer = document.querySelector(
        "body>.container"
      );
      sidebarFab.addEventListener("click", () => {
        messageContainer.toggleAttribute("sidebar");
        sidebarOverlay.classList.toggle("show");
        sidebarFab.classList.toggle("active");
      });
      const sidebarOverlay = document.createElement("div");
      sidebarOverlay.id = "sidebar-overlay";
      sidebarFab.appendChild(sidebarOverlay);
    }
  }
  function handleActionbar(type) {
    const actionbar = Object.assign(document.createElement("div"), {
      id: "actionbar",
      // <div style="display:flex; transform:scale(4)">
      // <style>svg {background-color:yellow; border:1px solid;}</style>
      innerHTML: `
      <div id="full-now">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="pointer-events: none; display: inherit; width: 100%; height: 100%;" xmlns="http://www.w3.org/2000/svg"><path transform="translate(3.6,4.2)" d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/></svg>
      </div>
      <div id="my-top">
        <svg width="24" height="24" viewBox="0 0 296 296" fill="currentColor" style="pointer-events: none; display: inherit; width: 100%; height: 100%;" xmlns="http://www.w3.org/2000/svg"><path transform="translate(17,18)" stroke="currentColor" stroke-width="1" d="M110.69055,37.98071a20.00016,20.00016,0,0,1,34.6189,0l87.97632,151.99243a19.99992,19.99992,0,0,1-17.30957,30.019H40.0238a19.99992,19.99992,0,0,1-17.30957-30.019L110.69055,37.98071M128,36a11.879,11.879,0,0,0-10.38562,5.98853L29.63806,193.981A11.99988,11.99988,0,0,0,40.0238,211.99219H215.9762A11.99988,11.99988,0,0,0,226.36194,193.981L138.38562,41.98853A11.879,11.879,0,0,0,128,36Z"/></svg>
      </div>
      <div id="my-home">
        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" fill="currentColor" focusable="false" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="m12 4.44 7 6.09V20h-4v-6H9v6H5v-9.47l7-6.09m0-1.32-8 6.96V21h6v-6h4v6h6V10.08l-8-6.96z"></path></svg>
      </div>
      <div id="search-fab">
        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" fill="currentColor" focusable="false" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="m20.87 20.17-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"></path></svg>
      </div>
      <div id="menu-fab">
        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" fill="currentColor" focusable="false" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M12 16.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM10.5 12c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5zm0-6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z"></path></svg>
      </div>
      <div id="sidebar-fab">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor" focusable="false" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z"></path></svg>
      </div>
      <div id="refresh-fab">
        <svg width="24" height="24" viewBox="0 0 29 29" fill="currentColor" style="pointer-events: none; display: inherit; width: 100%; height: 100%;" xmlns="http://www.w3.org/2000/svg"><path transform="translate(2.3,2.8)" d="M21.3687 13.5827C21.4144 13.3104 21.2306 13.0526 20.9583 13.0069C20.686 12.9612 20.4281 13.1449 20.3825 13.4173L21.3687 13.5827ZM12 20.5C7.30558 20.5 3.5 16.6944 3.5 12H2.5C2.5 17.2467 6.75329 21.5 12 21.5V20.5ZM3.5 12C3.5 7.30558 7.30558 3.5 12 3.5V2.5C6.75329 2.5 2.5 6.75329 2.5 12H3.5ZM12 3.5C15.3367 3.5 18.2252 5.4225 19.6167 8.22252L20.5122 7.77748C18.9583 4.65062 15.7308 2.5 12 2.5V3.5ZM20.3825 13.4173C19.7081 17.437 16.2112 20.5 12 20.5V21.5C16.7077 21.5 20.6148 18.0762 21.3687 13.5827L20.3825 13.4173Z"/><path transform="translate(2.3,2.9)" d="M20.4716 2.42157V8.07843H14.8147"/></svg>
      </div>
      <div id="show-more-fab">
        <svg width="24" height="24" viewBox="0 0 40 40" fill="currentColor"  style="pointer-events: none; display: inherit; width: 100%; height: 100%;" xmlns="http://www.w3.org/2000/svg"><path transform="translate(4,4)" d="M0.256 23.481c0 0.269 0.106 0.544 0.313 0.75 0.412 0.413 1.087 0.413 1.5 0l14.119-14.119 13.913 13.912c0.413 0.413 1.087 0.413 1.5 0s0.413-1.087 0-1.5l-14.663-14.669c-0.413-0.412-1.088-0.412-1.5 0l-14.869 14.869c-0.213 0.212-0.313 0.481-0.313 0.756z"></path></svg>
      </div>
      `
    });
    document.body.appendChild(actionbar);
    document.body.appendChild(
      Object.assign(document.createElement("div"), { id: "toast" })
    );
    actionbar.classList.add(type);
    setHomeBtn();
    setSearchBtn(type);
    if (type !== "message") {
      setMenuBtn();
    }
    switch (type) {
      case "home":
        setTopBtn();
        setRefreshBtn();
        break;
      case "video":
      case "list":
        setFullbtn();
        setSidebarBtn(type);
        break;
      case "search":
        setTopBtn();
        setShowMoreBtn();
        break;
      case "space":
        setTopBtn();
        setShowMoreBtn();
        break;
      case "message":
        setSidebarBtn(type);
        break;
    }
    function setTopBtn() {
      const topBtn = document.getElementById("my-top");
      topBtn.addEventListener("click", () => window.scrollTo({ top: 0 }));
    }
    function setHomeBtn() {
      const home = document.getElementById("my-home");
      home.addEventListener(
        "click",
        () => location.href = "https://www.bilibili.com/"
      );
    }
    function setRefreshBtn() {
      const refreshFab = document.getElementById("refresh-fab");
      refreshFab.addEventListener("click", () => {
        document.querySelector(".flexible-roll-btn-inner").click();
      });
    }
    function setFullbtn() {
      let clickTimer = 0;
      const fullBtn = document.getElementById("full-now");
      function playVideo() {
        const video = document.querySelector("video");
        video.play();
        video.muted = false;
        if (video.volume === 0) {
          document.querySelector(".bpx-player-ctrl-muted-icon").click();
        }
      }
      fullBtn.addEventListener("click", () => {
        clearTimeout(clickTimer);
        playVideo();
        clickTimer = setTimeout(() => {
          const videoWrap = document.querySelector(
            ".bpx-player-video-wrap"
          );
          videoWrap.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
        }, 250);
      });
      fullBtn.addEventListener("dblclick", () => {
        clearTimeout(clickTimer);
      });
    }
    function setShowMoreBtn() {
      const showMoreFab = document.getElementById("show-more-fab");
      const handleClick = () => {
        if (type === "search") {
          const searchConditions = document.querySelector(
            ".search-conditions"
          );
          if (searchConditions) {
            if (sessionStorage.getItem("show-conditions") !== "true") {
              searchConditions.style.transition = ".4s ease-in";
              searchConditions.classList.add("show");
              searchConditions.addEventListener(
                "transitionend",
                () => {
                  searchConditions.style.transition = "";
                },
                { once: true }
              );
              showMoreFab.classList.add("reverse");
              sessionStorage.setItem("show-conditions", "true");
            } else {
              searchConditions.style.transition = ".4s ease-in";
              searchConditions.classList.remove("show");
              searchConditions.addEventListener(
                "transitionend",
                () => {
                  searchConditions.style.transition = "";
                },
                { once: true }
              );
              showMoreFab.classList.remove("reverse");
              sessionStorage.setItem("show-conditions", "");
            }
          }
        } else if (type === "space") {
          const followRow = document.querySelector(".upinfo .operations");
          followRow.style.transition = ".4s ease-in";
          followRow == null ? void 0 : followRow.classList.toggle("show");
          followRow.addEventListener(
            "transitionend",
            () => {
              followRow.style.transition = "";
            },
            { once: true }
          );
          showMoreFab.classList.toggle("reverse");
        }
      };
      showMoreFab.addEventListener("click", handleClick);
    }
  }
  async function loadAI(card) {
    const aiCardElement = createAICardElement(
      card.querySelector(".bili-video-card__image--wrap")
    );
    const aiConclusionRes = await aiConclusion(card);
    const bvid = card.querySelector(".bili-video-card__image--link").dataset.bvid;
    genterateAIConclusionCard(aiConclusionRes, aiCardElement, bvid);
  }
  async function aiConclusion(card) {
    const cardImageLinkElement = card.querySelector(
      ".bili-video-card__image--link"
    );
    const match = /\/video\/([A-Za-z0-9]+)/.exec(cardImageLinkElement.dataset.targetUrl) || /\/video\/([A-Za-z0-9]+)/.exec(cardImageLinkElement.href);
    const bvid = match[1];
    if (aiData[bvid] && aiData[bvid].code === 0) {
      return aiData[bvid];
    }
    if (cardImageLinkElement.dataset.hasGotAi === void 0) {
      const cid = cardImageLinkElement.dataset.cid;
      const up_mid = cardImageLinkElement.dataset.upMid;
      const aiConclusionRes = await getAIConclusion({ bvid, cid, up_mid });
      aiData[bvid] = aiConclusionRes;
      cardImageLinkElement.dataset.hasGotAi = true.toString();
      if (aiConclusionRes.code === 0) {
        return aiData[bvid];
      }
    }
  }
  function createAICardElement(cardElement) {
    var _a;
    const overlay = document.createElement("div");
    overlay.id = "ai-conclusion-overlay";
    overlay.innerHTML = `
      <div class="ai-conclusion-card resizable-component">
        <div class="ai-conclusion-card-header">正在加载 AI 总结</div>
      </div>
    `;
    (_a = cardElement.closest(".bili-video-card")) == null ? void 0 : _a.appendChild(overlay);
    overlay.classList.add("show");
    overlay.addEventListener(
      "click",
      () => {
        overlay.classList.remove("show");
        overlay.addEventListener("transitionend", overlay.remove);
      },
      { once: true }
    );
    const div = overlay.querySelector(".ai-conclusion-card");
    div.addEventListener("click", (event) => event.stopPropagation());
    return div;
  }
  function genterateAIConclusionCard(aiConclusionRes, aiCardElement, bvid) {
    let aiCard = `
      <div class="ai-conclusion-card-header">
        <div class="ai-conclusion-card-header-left">
          <svg class=ai-summary-popup-icon fill=none height=30 viewBox="0 0 30 30"width=30 xmlns=http://www.w3.org/2000/svg><g clip-path=url(#clip0_8728_3421)><path d="M7.54 2.348a1.5 1.5 0 0 1 2.112.192l2.5 3a1.5 1.5 0 0 1-2.304 1.92l-2.5-3a1.5 1.5 0 0 1 .192-2.112z"fill=url(#paint0_linear_8728_3421) clip-rule=evenodd fill-rule=evenodd /><path d="M21.96 2.348a1.5 1.5 0 0 0-2.112.192l-2.5 3a1.5 1.5 0 0 0 2.304 1.92l2.5-3a1.5 1.5 0 0 0-.192-2.112z"fill=url(#paint1_linear_8728_3421) clip-rule=evenodd fill-rule=evenodd /><path d="M27 18.253C27 25.021 21.627 27 15 27S3 25.02 3 18.253C3 11.486 3.923 6 15 6c11.538 0 12 5.486 12 12.253z"fill=#D9D9D9 filter=url(#filter0_d_8728_3421) opacity=.2 /><path d="M28 18.949C28 26.656 22.18 28 15 28S2 26.656 2 18.949C2 10 3 6 15 6c12.5 0 13 4 13 12.949z"fill=url(#paint2_linear_8728_3421) filter=url(#filter1_ii_8728_3421) /><path d="M4.786 14.21c0-2.284 1.659-4.248 3.925-4.52 4.496-.539 8.057-.559 12.602-.01 2.257.274 3.902 2.234 3.902 4.507v5.005c0 2.14-1.46 4.034-3.57 4.396-4.742.815-8.474.658-13.086-.074-2.197-.35-3.773-2.282-3.773-4.506v-4.799z"fill=#191924 /><path d="M19.643 15.313v2.785"stroke=#2CFFFF stroke-linecap=round stroke-width=2.4 /><path d="M10.357 14.852l1.858 1.857-1.858 1.857"stroke=#2CFFFF stroke-linecap=round stroke-width=1.8 stroke-linejoin=round /></g><defs><filter color-interpolation-filters=sRGB filterUnits=userSpaceOnUse height=27 id=filter0_d_8728_3421 width=30 x=1 y=4><feFlood flood-opacity=0 result=BackgroundImageFix /><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"in=SourceAlpha result=hardAlpha /><feOffset dx=1 dy=1 /><feGaussianBlur stdDeviation=1.5 /><feComposite in2=hardAlpha operator=out /><feColorMatrix values="0 0 0 0 0.039545 0 0 0 0 0.0845023 0 0 0 0 0.200107 0 0 0 0.85 0"/><feBlend in2=BackgroundImageFix result=effect1_dropShadow_8728_3421 /><feBlend in2=effect1_dropShadow_8728_3421 result=shape in=SourceGraphic /></filter><filter color-interpolation-filters=sRGB filterUnits=userSpaceOnUse height=26.643 id=filter1_ii_8728_3421 width=30.786 x=0 y=4.143><feFlood flood-opacity=0 result=BackgroundImageFix /><feBlend in2=BackgroundImageFix result=shape in=SourceGraphic /><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"in=SourceAlpha result=hardAlpha /><feOffset dx=2.786 dy=3.714 /><feGaussianBlur stdDeviation=1.393 /><feComposite in2=hardAlpha operator=arithmetic k2=-1 k3=1 /><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"/><feBlend in2=shape result=effect1_innerShadow_8728_3421 /><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"in=SourceAlpha result=hardAlpha /><feOffset dx=-2 dy=-1.857 /><feGaussianBlur stdDeviation=1.857 /><feComposite in2=hardAlpha operator=arithmetic k2=-1 k3=1 /><feColorMatrix values="0 0 0 0 0 0 0 0 0 0.15445 0 0 0 0 0.454264 0 0 0 0.11 0"/><feBlend in2=effect1_innerShadow_8728_3421 result=effect2_innerShadow_8728_3421 /></filter><linearGradient gradientUnits=userSpaceOnUse id=paint0_linear_8728_3421 x1=6.804 x2=9.019 y1=2.849 y2=8.297><stop stop-color=#393946 /><stop stop-color=#23232E offset=.401 /><stop stop-color=#191924 offset=1 /></linearGradient><linearGradient gradientUnits=userSpaceOnUse id=paint1_linear_8728_3421 x1=22.696 x2=20.481 y1=2.849 y2=8.297><stop stop-color=#393946 /><stop stop-color=#23232E offset=.401 /><stop stop-color=#191924 offset=1 /></linearGradient><linearGradient gradientUnits=userSpaceOnUse id=paint2_linear_8728_3421 x1=7.671 x2=19.931 y1=10.807 y2=29.088><stop stop-color=#F4FCFF /><stop stop-color=#EAF5F9 offset=1 /></linearGradient><clipPath id=clip0_8728_3421><path d="M0 0h30v30H0z"fill=#fff /></clipPath></defs></svg>
          <span class="tips-text">已为你生成视频总结</span>
        </div>
      </div>
      <div class="ai-conclusion-card-summary">
        ${aiConclusionRes.model_result.summary}
      </div>
    `;
    aiConclusionRes.model_result.outline.forEach(
      (item) => {
        aiCard += `
        <div class="ai-conclusion-card-selection">
          <div class="ai-conclusion-card-selection-title">${item.title}</div>
          ${item.part_outline.map(
        (s) => `
            <a class="bullet" href="https://www.bilibili.com/video/${bvid}/?t=${s.timestamp}s">
              <span class="ai-conclusion-card-selection-timer">${timeNumberToTime(s.timestamp)}</span>
              <span>${s.content}</span>
            </a>
          `
      ).join("")}
        </div>
      `;
      }
    );
    function timeNumberToTime(time) {
      const min = Math.floor(time / 60);
      const sec = time % 60;
      return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    }
    aiCardElement.innerHTML = aiCard;
  }
  function preloadAnchor() {
    let anchor;
    let firstUnloadElem;
    let height;
    const container = document.querySelector(".container");
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.className === "load-more-anchor") {
            anchor = node;
            firstUnloadElem = document.querySelector(
              ".container>.bili-video-card:not(.is-rcmd)"
            );
            height = firstUnloadElem.clientHeight + 8;
            observer.disconnect();
          }
        });
      });
    });
    observer.observe(container, { childList: true });
    function preload() {
      if ((firstUnloadElem == null ? void 0 : firstUnloadElem.getBoundingClientRect().top) < height * 6) {
        window.removeEventListener("scroll", preload);
        anchor.parentNode.children[1].appendChild(anchor);
        setTimeout(() => {
          firstUnloadElem.parentNode.appendChild(anchor);
          window.addEventListener("scroll", preload);
        }, 500);
      }
    }
    window.addEventListener("scroll", preload);
  }
  function handleHeaderImage() {
    const source = _GM_getValue("header-image-source", "unsplash");
    const mapping = {
      bing: "https://api.suyanw.cn/api/bing.php",
      unsplash: "https://unsplash.it/1600/900?random",
      picsum: "https://picsum.photos/1600/900",
      meizi: "https://api.suyanw.cn/api/sjbz.php?method=pc&lx=meizi",
      dongman: "https://api.suyanw.cn/api/sjbz.php?method=pc&lx=dongman",
      fengjing: "https://api.suyanw.cn/api/sjbz.php?method=pc&lx=fengjing",
      suiji: "https://api.suyanw.cn/api/sjbz.php?method=pc&lx=suiji"
    };
    let url = mapping[source];
    const elementSelector = ".bili-header__banner";
    const key = "header-image";
    loadImage(key, elementSelector);
    if (source !== "local") {
      setTimeout(renewImage, 5e3);
    }
    window.addEventListener("variableChanged", (event) => {
      const e = event;
      if (e.detail.key === "header-image-source") {
        url = mapping[e.detail.newValue];
        setTimeout(() => renewImage(true), 0);
      }
    });
    async function renewImage(loadImmediately) {
      try {
        const img = await getImage(url);
        const base64Data = imageToBase64(img);
        storeImage(key, base64Data);
        if (loadImmediately) {
          loadImage(key, elementSelector);
        }
      } catch (error) {
        console.error("Failed to get image:", error);
      }
    }
    function getImage(url2) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url2;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    }
    function imageToBase64(img) {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx == null ? void 0 : ctx.drawImage(img, 0, 0);
      return canvas.toDataURL("image/jpeg");
    }
    function storeImage(key2, base64Data) {
      localStorage.setItem(key2, base64Data);
    }
    function loadImage(key2, elementSelector2) {
      const base64Data = localStorage.getItem(key2);
      if (base64Data) {
        applyStyle(elementSelector2, base64Data);
      } else {
        getImage(url).then((img) => {
          const base64Data2 = imageToBase64(img);
          storeImage(key2, base64Data2);
          applyStyle(elementSelector2, base64Data2);
        }).catch((error) => console.error("Failed to get image:", error));
      }
    }
    function applyStyle(elementSelector2, base64Data) {
      const style = document.createElement("style");
      style.innerHTML = `
      ${elementSelector2}::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        background-image: url(${base64Data});
        background-size: cover;
        background-position: center;
      }
    `;
      document.head.appendChild(style);
    }
  }
  function handleVideoCard() {
    judgeHasAi();
    let isLoading = false;
    new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (isLoading) {
          return;
        }
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("bili-video-card")) {
            isLoading = true;
            setTimeout(() => {
              judgeHasAi();
              isLoading = false;
            }, 2e3);
          }
        });
      });
    }).observe(
      document.querySelector(".recommended-container_floor-aside>.container"),
      { childList: true }
    );
    function judgeHasAi() {
      const imageLinks = document.querySelectorAll(
        ".bili-video-card__image--link"
      );
      let delay = 0;
      imageLinks.forEach(async (link) => {
        await new Promise((resolve) => setTimeout(resolve, delay));
        const card = link.closest(
          ".bili-video-card:not(:has(.bili-video-card__info--ad))"
        );
        if (card && !link.dataset.hasJudgedAi) {
          const aiJudgeRes = await judge(card);
          if (aiJudgeRes) {
            card.dataset.hasAi = "true";
          }
          delay += 100;
        }
        link.dataset.hasJudgedAi = "true";
      });
    }
    let lastPreviewCard = null;
    new MutationObserver((mutations) => {
      mutations.forEach(async (mutation) => {
        var _a;
        const firstChild = (_a = mutation.addedNodes[0]) == null ? void 0 : _a.firstChild;
        if (firstChild && firstChild.className === "v-popover is-bottom-end") {
          const panel = firstChild.querySelector(
            ".bili-video-card__info--no-interest-panel"
          );
          const previewOption = createOption("预览此视频");
          panel.insertBefore(previewOption, panel.firstChild);
          previewOption.addEventListener(
            "click",
            (event) => onPreviewOptionClick(event, firstChild)
          );
          const card = await getCard();
          if (!card) {
            return;
          }
          const hasAi = card.dataset.hasAi;
          if (!hasAi) {
            return;
          }
          const AIOption = createOption("生成视频总结");
          panel.insertBefore(AIOption, previewOption.nextSibling);
          AIOption.addEventListener("click", async (event) => {
            event.stopPropagation();
            firstChild.dispatchEvent(
              new MouseEvent("mouseleave", { bubbles: true })
            );
            loadAI(card);
          });
        }
      });
    }).observe(document.body, { childList: true });
    window.addEventListener("click", (event) => {
      const btn = document.querySelector(
        ".bili-video-card__info--no-interest.active"
      );
      if (btn == null ? void 0 : btn.contains(event.target)) {
        btn.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
        btn.classList.remove("use");
        btn.addEventListener(
          "click",
          () => {
            btn.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
          },
          { once: true }
        );
      }
    });
    function onPreviewOptionClick(event, firstChild) {
      event.stopPropagation();
      firstChild.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
      window.addEventListener(
        "click",
        () => {
          lastPreviewCard == null ? void 0 : lastPreviewCard.dispatchEvent(
            new MouseEvent("mouseleave", { bubbles: true })
          );
        },
        { once: true }
      );
      const card = document.querySelector(".bili-video-card__info--no-interest.active").closest(".bili-video-card");
      const cardEventWrap = card.querySelector(
        ".bili-video-card__image--wrap"
      );
      cardEventWrap.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
      lastPreviewCard = cardEventWrap;
      if (!cardEventWrap.querySelector(".inline-progress-bar")) {
        const intervalId = setInterval(() => {
          if (cardEventWrap.querySelector("video")) {
            createProgressBar(cardEventWrap);
            clearInterval(intervalId);
          }
        }, 1e3);
      }
    }
    function createProgressBar(cardEventWrap) {
      const progressBar = document.createElement("div");
      progressBar.className = "inline-progress-bar";
      progressBar.innerHTML = '<div class="inline-progress-bar-filled"></div><div class="inline-progress-bar-thumb"></div>';
      cardEventWrap.appendChild(progressBar);
      const video = cardEventWrap.querySelector("video");
      const progressBarFilled = progressBar.querySelector(
        ".inline-progress-bar-filled"
      );
      const progressBarThumb = progressBar.querySelector(
        ".inline-progress-bar-thumb"
      );
      const progressBarWidth = progressBar.offsetWidth;
      function updateProgressBar(progress) {
        progressBarFilled.style.width = `${progress * 100}%`;
        progressBarThumb.style.left = `${progress * progressBarWidth}px`;
      }
      video.addEventListener(
        "timeupdate",
        () => {
          const progress = Math.min(
            Math.max(video.currentTime / video.duration, 0),
            1
          );
          updateProgressBar(progress);
        },
        true
      );
      video.addEventListener(
        "timeupdate",
        (event) => event.stopImmediatePropagation(),
        true
      );
      function onTouchEvent(event) {
        const progress = (event.touches[0].clientX - progressBar.getBoundingClientRect().left) / progressBarWidth;
        updateProgressBar(progress);
        video.currentTime = progress * video.duration;
      }
      progressBar.addEventListener("touchstart", (event) => {
        onTouchEvent(event);
        document.addEventListener("touchmove", onTouchEvent);
      });
      document.addEventListener("touchend", () => {
        document.removeEventListener("touchmove", onTouchEvent);
      });
      progressBar.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
    }
    async function judge(card) {
      const cardImageLinkElement = card.querySelector(
        ".bili-video-card__image--link"
      );
      const match = /\/video\/([A-Za-z0-9]+)/.exec(cardImageLinkElement.dataset.targetUrl) || /\/video\/([A-Za-z0-9]+)/.exec(cardImageLinkElement.href);
      const bvid = match[1];
      try {
        const videoInfo = await getVideoInfo(bvid);
        cardImageLinkElement.dataset.cid = videoInfo.cid;
        cardImageLinkElement.dataset.bvid = videoInfo.bvid;
        cardImageLinkElement.dataset.upMid = videoInfo.owner.mid;
        const cid = videoInfo.cid;
        const up_mid = videoInfo.owner.mid;
        const aiJudgeRes = await getJudgeAI({ bvid, cid, up_mid });
        return aiJudgeRes.judge === 1;
      } catch (error) {
        console.error(error);
      }
    }
    function createOption(text) {
      return Object.assign(document.createElement("div"), {
        className: "bili-video-card__info--no-interest-panel--item",
        textContent: text
      });
    }
    async function getCard() {
      return new Promise((resolve) => {
        setTimeout(() => {
          const btn = document.querySelector(
            ".bili-video-card__info--no-interest.active:not(.use)"
          );
          if (!btn) {
            resolve(null);
            console.log("疑似弹窗动作被打断：未获取到激活的视频更多选项按钮");
            return;
          }
          const card = btn.closest(".bili-video-card");
          btn.classList.add("use");
          resolve(card);
        }, 50);
      });
    }
  }
  function videoInteraction() {
    handlePortrait();
    handlelVideoClick();
    handleVideoInteraction();
    foldDescTag();
    closeMiniPlayer();
    setEndingContent();
    modifyShadowDOMLate();
  }
  let isPortrait = false;
  function handlePortrait() {
    const video = document.querySelector(
      "#bilibili-player video"
    );
    video.addEventListener("resize", () => {
      isPortrait = video.videoHeight / video.videoWidth > 1;
    });
  }
  function handlelVideoClick() {
    const playerContainter = document.querySelector(
      ".bpx-player-container"
    );
    const videoArea = playerContainter.querySelector(
      ".bpx-player-video-area"
    );
    const videoPerch = videoArea.querySelector(
      ".bpx-player-video-perch"
    );
    const videoWrap = videoPerch.querySelector(
      ".bpx-player-video-wrap"
    );
    const video = videoWrap.querySelector("video");
    videoArea.insertBefore(videoWrap, videoPerch);
    video.playsInline = true;
    const oldControlWrap = videoArea.querySelector(
      ".bpx-player-control-wrap"
    );
    const controlEntity = oldControlWrap.querySelector(
      ".bpx-player-control-entity"
    );
    let clickTimer;
    let hideTimer;
    const controlWrap = Object.assign(document.createElement("div"), {
      className: "bpx-player-control-wrap new",
      innerHTML: '<div class="bpx-player-control-mask"></div>'
    });
    videoArea.insertBefore(controlWrap, oldControlWrap);
    controlWrap.appendChild(controlEntity);
    const isBpxStateShow = () => controlEntity.querySelector(
      ".bpx-player-control-bottom-right>.bpx-state-show"
    );
    const controlTop = controlEntity.querySelector(
      ".bpx-player-control-top"
    );
    const bottomRight = controlEntity.querySelector(
      ".bpx-player-control-bottom-right"
    );
    const isShown = () => playerContainter.getAttribute("ctrl-shown") === "true";
    playerContainter.setAttribute("ctrl-shown", "false");
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes[0].classList.contains(
          "bpx-player-ctrl-web"
        )) {
          if (video.paused) {
            showControlWrap();
          }
          const subtitleBtn = document.querySelector(".bpx-player-ctrl-subtitle");
          if (subtitleBtn) {
            window.addEventListener("click", (event) => {
              if (!subtitleBtn.contains(event.target)) {
                subtitleBtn.dispatchEvent(new MouseEvent("mouseleave"));
              }
            });
          }
          observer.disconnect();
        }
      });
    });
    observer.observe(bottomRight, { childList: true });
    function hideControlWrap(isEnd = false) {
      if (!video.paused && !isBpxStateShow() || isEnd) {
        playerContainter.setAttribute("ctrl-shown", "false");
        clearTimeout(hideTimer);
      } else {
        delayHideTimer();
      }
    }
    video.addEventListener("ended", () => {
      hideControlWrap(true);
    });
    function showControlWrap() {
      playerContainter.setAttribute("ctrl-shown", "true");
      delayHideTimer();
    }
    function delayHideTimer() {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(hideControlWrap, 3e3);
    }
    videoWrap.addEventListener("mousemove", (event) => {
      event.stopPropagation();
    });
    controlWrap.addEventListener("mousemove", (event) => {
      event.stopPropagation();
    });
    video.addEventListener("play", delayHideTimer);
    controlWrap.addEventListener("click", (event) => {
      event.stopPropagation();
      delayHideTimer();
    });
    controlTop.addEventListener("touchstart", delayHideTimer);
    videoWrap.addEventListener("click", () => {
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        if (isShown()) hideControlWrap();
        else showControlWrap();
        if (!_GM_getValue("ban-video-click-play", false)) {
          if (video.paused) video.play();
          else video.pause();
        }
      }, 250);
    });
    videoWrap.addEventListener("dblclick", () => {
      clearTimeout(clickTimer);
      unmute();
      if (isPortrait)
        document.querySelector(".bpx-player-ctrl-web").click();
      else videoPerch.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    });
    function unmute() {
      video.muted = false;
      if (video.volume === 0) {
        document.querySelector(".bpx-player-ctrl-muted-icon").click();
      }
    }
    videoArea.addEventListener("touchstart", (event) => {
      event.stopPropagation();
    });
    if (_GM_getValue("video-click-unmute", false)) {
      window.addEventListener("click", (event) => {
        console.log(event.target);
        if (!videoArea.contains(event.target)) {
          unmute();
        }
      });
    }
  }
  function closeMiniPlayer() {
    if (!localStorage.getItem("is-mini-player-closed")) {
      const miniPlayerBtn = document.getElementsByClassName(
        "mini-player-window"
      )[0];
      new MutationObserver(
        (mutations) => mutations.forEach((mutation) => {
          if (mutation.target.classList.contains("on")) {
            miniPlayerBtn.click();
            localStorage.setItem("is-mini-player-closed", "true");
          }
        })
      ).observe(miniPlayerBtn, { attributes: true, attributeFilter: ["class"] });
    }
  }
  function handleVideoInteraction() {
    const video = document.querySelector("video");
    let startX, startY, startTime;
    const threshold = 10;
    const initialCheckDuration = 300;
    let isLongPress = false;
    let isSliding = false;
    let timeoutId;
    let times;
    let isSlideAllowed;
    let progressInfo;
    let progressInfoCreated = false;
    let isCreatingProgressInfo = false;
    video.addEventListener("touchstart", (event) => {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      startTime = video.currentTime;
      times = Number(_GM_getValue("video-longpress-speed", "2"));
      isSlideAllowed = _GM_getValue("allow-video-slid", false);
      timeoutId = setTimeout(() => {
        video.playbackRate = video.playbackRate * times;
        isLongPress = true;
      }, initialCheckDuration);
    });
    video.addEventListener("touchmove", (event) => {
      if (!isSlideAllowed) {
        return;
      }
      const moveX = event.touches[0].clientX;
      const moveY = event.touches[0].clientY;
      const deltaX = moveX - startX;
      const deltaY = moveY - startY;
      if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
        if (!isLongPress) {
          clearTimeout(timeoutId);
          isSliding = true;
        } else {
          return;
        }
        if (isSliding) {
          if (!progressInfoCreated && !isCreatingProgressInfo) {
            isCreatingProgressInfo = true;
            progressInfo = document.createElement("div");
            progressInfo.id = "progress-info";
            video.parentNode.insertBefore(progressInfo, video.nextSibling);
            progressInfoCreated = true;
            isCreatingProgressInfo = false;
          }
          video.pause();
          const progressChange = deltaX / video.clientWidth * video.duration;
          video.currentTime = startTime + progressChange;
          if (progressInfoCreated) {
            progressInfo.textContent = `进度: ${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
            progressInfo.style.display = "block";
          }
        }
      }
    });
    video.addEventListener("touchend", () => {
      clearTimeout(timeoutId);
      if (isLongPress) {
        video.playbackRate = video.playbackRate / times;
        isLongPress = false;
      }
      if (isSliding) {
        video.play();
        progressInfo.style.display = "";
        isSliding = false;
      }
    });
    function formatTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor(seconds % 3600 / 60);
      const secs = Math.floor(seconds % 60);
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
  }
  function foldDescTag() {
    if (!_GM_getValue("fold-desc-tag", false)) return;
    const leftContainer = document.querySelector(".left-container");
    const commentApp = document.querySelector("#commentapp");
    const foldBtn = Object.assign(document.createElement("div"), {
      id: "fold-desc-btn",
      innerHTML: `
<svg width="18" height="18" viewBox="0 0 40 40" fill="currentColor" stroke="currentColor" stroke-width="3" xmlns="http://www.w3.org/2000/svg"><path transform="translate(4,4)" d="M0.256 23.481c0 0.269 0.106 0.544 0.313 0.75 0.412 0.413 1.087 0.413 1.5 0l14.119-14.119 13.913 13.912c0.413 0.413 1.087 0.413 1.5 0s0.413-1.087 0-1.5l-14.663-14.669c-0.413-0.412-1.088-0.412-1.5 0l-14.869 14.869c-0.213 0.212-0.313 0.481-0.313 0.756z"></path></svg>
    `
    });
    foldBtn.addEventListener("click", () => {
      leftContainer.toggleAttribute("unfold");
    });
    setTimeout(() => {
      var _a, _b;
      commentApp.insertBefore(foldBtn, commentApp.firstChild);
      (_a = document.querySelector(".toggle-btn")) == null ? void 0 : _a.click();
      (_b = document.querySelector(".tag:has(>.show-more-btn)")) == null ? void 0 : _b.click();
    }, 2e3);
  }
  function setEndingContent() {
    addEndingScale();
    function addEndingScale() {
      const style = Object.assign(document.createElement("style"), {
        id: "ending-content-scale",
        textContent: `
        .bpx-player-ending-content[screen-mode=little-screen] { transform: scale(calc(${window.innerWidth}/536*0.9)) !important; }
        .bpx-player-ending-content { transform: scale(calc(${window.innerWidth}/710*0.9)) !important; }
        .bpx-player-container[data-screen=full] .bpx-player-ending-content { transform: scale(calc(${window.innerWidth}/952*0.9)) !important; }
      `
      });
      document.head.appendChild(style);
    }
    function renewEndingScale() {
      var _a;
      (_a = document.head.querySelector("#ending-content-scale")) == null ? void 0 : _a.remove();
      addEndingScale();
    }
    screen.orientation.addEventListener("change", renewEndingScale);
    window.addEventListener("resize", renewEndingScale);
  }
  function createUnfoldBtn() {
    const observer = new MutationObserver(
      (mutations) => mutations.forEach((mutation) => {
        var _a;
        if ((_a = mutation.addedNodes[0]) == null ? void 0 : _a.classList.contains("bili-im")) {
          createElement();
          observer.disconnect();
        }
      })
    );
    const messageContainer = document.querySelector(
      "body>.container"
    );
    observer.observe(messageContainer, { childList: true, subtree: true });
    function createElement() {
      const unfoldBtn = Object.assign(document.createElement("div"), {
        id: "unfold-btn",
        textContent: "展开"
      });
      const messageList = document.querySelector(".bili-im .left");
      messageList.appendChild(unfoldBtn);
      unfoldBtn.addEventListener("click", () => {
        if (messageList.style.cssText === "") {
          messageList.style.cssText = "width: 240px !important";
          unfoldBtn.textContent = "折叠";
        } else {
          messageList.style.cssText = "";
          unfoldBtn.textContent = "展开";
        }
      });
    }
  }
  function coverContextMenu() {
    if (!_GM_getValue("cover-context-menu", false)) return;
    window.addEventListener(
      "contextmenu",
      (event) => {
        if (event.target.className === "message-content") {
          event.stopImmediatePropagation();
        }
      },
      true
      // 在捕获阶段
    );
  }
  (function() {
    if (window.top !== window.self) {
      return;
    }
    document.head.appendChild(
      Object.assign(document.createElement("meta"), {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      })
    );
    preventBeforeUnload();
    countViewTime();
    document.head.appendChild(
      Object.assign(document.createElement("link"), {
        rel: "stylesheet",
        href: "https://s1.hdslb.com/bfs/static/jinkela/space/css/space.8.22c06a62b42dec796d083a84f5a769f44a97b325.css"
      })
    );
    console.log("Bilibili mobile execute!");
    const firstSubdomain = location.hostname.substring(
      0,
      location.hostname.indexOf(".")
    );
    const pathToTypeMap = {
      "/video": "video",
      "/list": "list"
    };
    const getTypeFromPath = (map) => {
      for (const [prefix, type2] of Object.entries(map)) {
        if (location.pathname.startsWith(prefix)) {
          return type2;
        }
      }
      return "unknow";
    };
    const type = firstSubdomain === "www" ? location.pathname === "/" ? "home" : getTypeFromPath(pathToTypeMap) : firstSubdomain;
    function handleCommonSettings(type2) {
      handleScriptPreSetting();
      waitDOMContentLoaded(() => {
        handleScriptSetting();
        handleActionbar(type2);
        handleScroll(type2);
        setScriptHelp();
      });
    }
    handleCommonSettings(type);
    switch (type) {
      case "home":
        increaseVideoLoadSize();
        handleHeaderImage();
        waitDOMContentLoaded(() => {
          preloadAnchor();
          handleVideoCard();
        });
        break;
      case "video":
      case "list":
        waitDOMContentLoaded(videoInteraction);
        break;
      case "message":
        waitDOMContentLoaded(() => {
          createUnfoldBtn();
          coverContextMenu();
        });
        break;
    }
  })();

})();