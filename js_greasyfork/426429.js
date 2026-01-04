// ==UserScript==
// @name         SpigotMC unofficial Darkmode
// @namespace    https://haer0248.me/
// @version      0.1
// @description  Just a dark mode.
// @author       Haer0248
// @match        https://*.spigotmc.org/*
// @icon         https://www.google.com/s2/favicons?domain=spigotmc.org
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/426429/SpigotMC%20unofficial%20Darkmode.user.js
// @updateURL https://update.greasyfork.org/scripts/426429/SpigotMC%20unofficial%20Darkmode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var addCSS = 'body{background:#252830;color:#ccc}footer{background:#252830}h1,p{color:#d8d8d8}a[href]:hover{color:#fff}.attribution a,.attribution a:focus{text-decoration:none;color:#eaeaea}.attribution a:hover{color:#fff}.attribution{color:#d8d8d8}.bubbles{background-color:#434857}.footer .pageContent{border-top:none}#logoBlock .pageContent{background-image:none}#logoBlock .spigot_colorOverlay{background:#252830}.spigot_headerReadAboutWrapper{background:#434857;border:none;border-radius:0;box-shadow:0 7px 10px -1px rgba(0,0,0,.37);transition:all .3s cubic-bezier(.175,.885,.32,1.275)}.spigot_headerReadAboutWrapper:hover{transform:translateY(-3px);box-shadow:0 7px 10px -1px rgba(0,0,0,.5)}#userBar .navTabs{background-image:none;background:#434857;border-color:#434857;box-shadow:0 7px 10px -1px rgba(0,0,0,.37);color:#d8d8d8}#navigation .navTabs,.breadcrumb,.uix_breadCrumb_toggleList li.toggleList_item{background:#434857;color:#d8d8d8}#userBar .navTabs .navTab.Popup.PopupContainerControl.PopupOpen{background:#1c1e23}.Popup .PopupControl.PopupOpen,.Popup.PopupContainerControl.PopupOpen{border-radius:0!important}.secondaryContent a{color:#b7b7b7}.navPopup .listItem{transition:.3s;border-bottom:none}.navPopup .PopupItemLinkActive:hover{background-color:#585e72;border-radius:0;margin:0 -9px;padding:5px 9px}.Menu{border:none!important;box-shadow:0 0 100px -5px rgba(0,0,0,.75)}.Menu .primaryContent,.Menu .secondaryContent,.Menu .sectionFooter{background:#434857}.Menu .primaryContent,.Menu .secondaryContent,.Menu .sectionFooter{padding:8px}.Menu .primaryContent .concealed:hover{color:#fff}.sectionFooter a{color:#d8d8d8}.statusEditorCounter{color:#eaeaea}.navTabs .navTab.selected .tabLinks{background-color:#1c1e23;border:none;box-shadow:0 7px 10px -1px rgba(0,0,0,.37)}.navTabs .navTab.selected .tabLinks a{color:#d8d8d8;text-shadow:none}.navTabs .navTab.selected .tabLinks a:hover{color:#fff}.Popup .PopupControl.PopupOpen,.Popup.PopupContainerControl.PopupOpen{box-shadow:none}#navigation .navTabs .navTab.PopupOpen,.navTab.selected .blockLinksList li.PopupOpen{margin-top:0}.hasTabLinks #navigation .navTabs .navTab.selected .navLink{background-color:#1c1e23}#navigation .navTabs .navTab.selected .navLink:after,#navigation .navTabs .navTab.selected .navLink:before{background:0 0}.navTabs .navTab.PopupClosed.selected .SplitCtrl,.navTabs .navTab.PopupClosed.selected .navLink,.navTabs .navTab.selected .navLink{color:#fff}.navTabs .navTab.PopupClosed .navLink{color:#d8d8d8}.navTabs .navTab.Popup.PopupOpen,.navTabs .navTab.selected.PopupOpen .navLink{background-color:#1c1e23}.navTabs{box-shadow:none}.Popup .PopupControl.PopupOpen,.Popup.PopupContainerControl.PopupOpen{background:#1c1e23}.breadcrumb{box-shadow:none;border-radius:0}.secondaryContent{border-bottom:none}#QuickSearch .formPopup .secondaryControls{border-radius:0;background-color:#252830;border:1px solid #252830;color:#fff;box-shadow:0 0 100px -5px rgba(0,0,0,.75)}#QuickSearch .formPopup .secondaryControls .textCtrl{background-color:#434857}.ctrlUnit>dd .explain{color:#d8d8d8}#QuickSearch .button,#QuickSearch .button:not(.primary){border-radius:0;background-color:#434857;color:#d8d8d8;box-shadow:0 7px 10px -1px rgba(0,0,0,.37)}#QuickSearch .button:hover,#QuickSearch a.button:hover{background-color:#434757}.blockLinksList a,.blockLinksList label{color:#d8d8d8}.blockLinksList a:focus,.blockLinksList a:hover,.blockLinksList label:focus,.blockLinksList label:hover,.blockLinksList li.kbSelect a,.blockLinksList li.kbSelect label{color:#fff}.breadcrumb .crust.firstVisibleCrumb a.crumb,.breadcrumb .crust:first-child a.crumb{border-radius:0}.categoryStrip__collapseToggle,.nodeList .categoryStrip .nodeTitle a{color:#eaeaea}.nodeList .categoryStrip .nodeTitle a:hover{color:#fff;text-decoration:none}.nodeList .categoryStrip .nodeDescription{color:#d8d8d8}.node .nodeLastPost{background:#434857}.category_view .nodeList,.forum_list .nodeList .nodeList,.forum_view .nodeList,.watch_forums .nodeList{background:0 0;border-radius:0}.nodeList .categoryForumNodeInfo,.nodeList .forumNodeInfo,.nodeList .linkNodeInfo,.nodeList .node.level_2:nth-child(even) .nodeInfo,.nodeList .node.level_2:nth-child(even) .nodeInfo .nodeLastPost,.nodeList .pageNodeInfo{background:#434857}#logo{height:100%;width:82%;background:0 0}#logo img{max-width:40%;width:100%}.node .categoryForumNodeInfo .nodeIcon,.node .categoryForumNodeInfo.unread .nodeIcon,.node .forumNodeInfo .nodeIcon,.node .forumNodeInfo.unread .nodeIcon{background:#434857 url(//i.p1g.pw/sprites.png) no-repeat 0 0}.navTabs .navTab.selected .navLink{margin-top:0;padding-top:3px;box-shadow:none;border-radius:0!important}#QuickSearch .primaryControls .uix_icon{background-color:#434857;border-radius:0}.textCtrl{border-radius:0;background-color:#252830;border:1px solid #252830;color:#d8d8d8;box-shadow:0 7px 10px -1px rgba(0,0,0,.37)}.textCtrl:focus{border:1px solid #252830}.mainContainer .mainContent,.mainContainer_noSidebar{border-radius:0;background-color:#252830;border:none;box-shadow:0 7px 119px -14px #000}.sectionMain{border:none;border-radius:0;background-color:#434857;padding:0;box-shadow:0 7px 10px -1px rgba(0,0,0,.37)}.sectionMain .subHeading{padding:10px 16px;background-color:#585e72;border-bottom:3px solid #4b5563;transition:all .3s cubic-bezier(.175,.885,.32,1.275);border-top:none;color:#d8d8d8}.sectionMain .subHeading:hover{transform:translateY(-3px);box-shadow:0 7px 10px -1px rgba(0,0,0,.37);border-bottom:3px solid #585e72;color:#fff}.sectionMain .subHeading a{color:#d8d8d8}.sectionMain .subHeading:hover a,.subHeading a:hover{color:#fff;text-decoration:none}.primaryContent{background-color:#434857;padding:8px 16px;color:#ccc;border-bottom:none}.messageUserBlock div.avatarHolder{background-color:transparent}.sectionFooter{background-color:#434857}.articleItem .metaData{border-bottom:none}.button{border-radius:0;box-shadow:0 7px 10px -1px rgba(0,0,0,.37);background-color:#1e2127;transition:all .3s cubic-bezier(.175,.885,.32,1.275);color:#d8d8d8}.button.primary{background-color:#1e2127}a.button{color:#d8d8d8}.button:hover,.buttonProxy:hover .button,.button[href]:hover{transform:translateY(-3px);box-shadow:0 7px 10px -1px rgba(0,0,0,.5);background-color:#1e2127;color:#fff}.messageList .message{background-color:#434857;border:none;border-radius:0}.primaryContent a:hover{color:#efb61c}.sectionMain.articlePager{padding:7px 16px 8px}.PageNav a{border-radius:0!important;transition:all .3s cubic-bezier(.175,.885,.32,1.275);box-shadow:0 7px 10px -1px rgba(0,0,0,.37);background-color:#4b5563;border:1px solid #4b5563;color:#d8d8d8}.PageNav a:focus,.PageNav a:hover{box-shadow:0 7px 10px -1px rgba(0,0,0,.5);transform:translateY(-2px);background-color:#4b5563;border:1px solid #4b5563;color:#fff}.PageNav a.currentPage{background-color:#1e2127;border:1px solid #1e2127}.PageNav .pageNavHeader,.PageNav .scrollable,.PageNav a{margin-bottom:0}.PageNav .scrollable{height:36px;padding-top:2px;margin-top:-2px}.search_form form .button,.search_form form .textCtrl{background-color:#434857}.bbCodeBlock{background-color:#252830!important;border:none!important}.bbCodeBlock .type{border-bottom:1px solid #454a59!important;background:#252830!important}.MultiQuoteItem .messageInfo,.bbCodeBlock .code,.bbCodeBlock .type,.bbCodeBlock pre{background-color:#252830!important;color:#d8d8d8!important}.sidebar .section .secondaryContent h3{background:#585e72;border:none;border-bottom:3px solid #4b5563;border-radius:0;transition:all .3s cubic-bezier(.175,.885,.32,1.275);box-shadow:none}.sidebar .section .secondaryContent h3:hover{transform:translateY(-3px);box-shadow:0 7px 10px -1px rgba(0,0,0,.37);border-bottom:3px solid #585e72}.sidebar .section .secondaryContent{background:#434857;border-radius:0;box-shadow:0 7px 10px -1px rgba(0,0,0,.37)}.pairsJustified dt{color:#d8d8d8}body .muted,body .muted a,body a.muted{color:#b7b7b7}.BBcodeInlineCode{background-color:#252830;border:1px solid #585e72;color:#d8d8d8}.threadListItem .title a{color:#eaeaea}.sidebar .section .secondaryContent .footnote,.sidebar .section .secondaryContent .minorHeading a{color:#eaeaea}.tabs li a,.tabs.noLinks li{background-color:#434857;color:#d8d8d8;border:1px solid #1c1e23;border-radius:0}.tabs li.active a,.tabs.noLinks li.active{background-color:#585e72;color:#fff;padding-bottom:0}.tabs li:hover a{background-color:#585e72!important;color:#fff}.tabs{border-bottom:1px solid #1c1e23}#donationTarget{margin-bottom:1px}#donationAmount,#donationTarget,select[name=currency_code]{border-radius:0;background-color:#252830;border:1px solid #252830;color:#d8d8d8;box-shadow:0 7px 10px -1px rgba(0,0,0,.37);padding:1px}select[name=currency_code]{padding:0}.threadListItem{border-top:1px solid #585e72}.footer .choosers a{border:none;border-radius:0;box-shadow:0 7px 10px -1px rgba(0,0,0,.37);background-color:#434857;transition:all .3s cubic-bezier(.175,.885,.32,1.275);color:#d8d8d8;padding:8px 14px}.footer .choosers a:hover{transform:translateY(-3px);box-shadow:0 7px 10px -1px rgba(0,0,0,.5);color:#fff}.xenOverlay.chooserOverlay{background:#434857}.xenOverlay .section{border:none;box-shadow:0 7px 10px -1px rgba(0,0,0,.37);background:#434857}.xenOverlay .section .heading{border-radius:0;background:#585e72;border-bottom:3px solid #4b5563;color:#d8d8d8;transition:all .3s cubic-bezier(.175,.885,.32,1.275)}.xenOverlay .section .heading:hover{transform:translateY(-3px);color:#fff;box-shadow:0 7px 10px -1px rgba(0,0,0,.37);border-bottom:3px solid #585e72}.xenOverlay .section .subHeading{border-top:none;background-color:#434857;color:#ccc;border-bottom:1px solid #585e72}.styleChooser .secondaryContent{background-color:#434857}.styleChooser .secondaryContent a{color:#eaeaea}.chooserColumns .description{color:#ccc!important}.chooserColumns li a:hover{background-color:#252830!important}.discussionList .sectionHeaders{border-top:none;background-color:#585e72;border-bottom:3px solid #4b5563;transition:all .3s cubic-bezier(.175,.885,.32,1.275)}.discussionList .sectionHeaders a{color:#eaeaea;transition:all .3s ease-in-out}.discussionList .sectionHeaders:hover a{color:#fff}.discussionList .sectionHeaders:hover{transform:translateY(-3px);box-shadow:0 7px 10px -1px rgba(0,0,0,.37);border-bottom:3px solid #585e72}.discussionListItem,.discussionListItem:nth-child(even){background-color:#434857;border-color:#585e72}.discussionListItem .muted a,.discussionListItem .muted abbr{color:#ccc}.sectionFooter{color:#d8d8d8}body .itemPageNav a,body .itemPageNav span{background-color:#4b5563;border:none;color:#ccc;padding:1px 5px;border-radius:0}.itemPageNav span:hover,body .itemPageNav a:hover{background-color:#585e72;cursor:pointer}.messageContent article{color:#eaeaea}.avatar .img,.avatar img,.avatarCropper{background-color:#252830}.username .style3{color:#f34747}.larger.textHeading{color:#ccc;border-bottom-color:#585e72}.alert-info{color:#5fc2f3!important}.alert-warning{color:#a9946f!important}.alert{background-color:#585e72!important;border:none!important;border-radius:0!important;box-shadow:0 7px 10px -1px rgba(0,0,0,.37)}.node.level_2:last-child .nodeInfo{border-radius:0}.node .unread .nodeText .nodeTitle{color:#d8d8d8}.node .nodeText .nodeTitle a:hover{color:#fff}.subForumList .nodeTitle a{color:#ccc}.subForumList .nodeTitle a:hover{color:#d8d8d8}.node.level_2:first-of-type .nodeInfo{border-top:none}.node.level_2 .nodeInfo{border-top:1px solid #585e72}.nodeList .node.level_1{background:#434857}.nodeList .categoryStrip{text-shadow:none;background-color:#585e72;box-shadow:none;border-radius:0;border-bottom:solid 3px #4b5563;transition:all .3s cubic-bezier(.175,.885,.32,1.275)}.nodeList .categoryStrip:hover{transform:translateY(-3px);box-shadow:0 7px 10px -1px rgba(0,0,0,.37);border-bottom:3px solid #585e72}.forum_list .nodeList .nodeList{margin-top:8px}.discussionList .sectionHeaders dd a[href]:hover{background-color:#4b5563;color:#fff}.xenPreviewTooltip{background-color:#1c1e23;border:none;border-radius:0}.xenPreviewTooltip .arrow,.xenPreviewTooltip .arrow span{border-top-color:#1c1e23}#DiscussionListOptionsHandle{bottom:-34px}#DiscussionListOptionsHandle a{margin-top:3px;color:#d8d8d8;background-color:#4b5563;border-radius:0;border:none;transition:all .3s cubic-bezier(.175,.885,.32,1.275);box-shadow:0 7px 10px -1px rgba(0,0,0,.37)}#DiscussionListOptionsHandle a:hover{transform:translateY(-3px);box-shadow:0 7px 10px -1px rgba(0,0,0,.5)}.DiscussionListOptions{border:none}.secondaryContent{border-radius:0;background:#434857}.discussionList{background:#434857}.bbCodeBlock .code span[style="color: #000000; font-weight: bold;"]{color:#e5e0d8!important}.bbCodeBlock .code span[style="color: #006699;"]{color:#7fc9eb!important}.bbCodeBlock .code span[style="color: #339933;"]{color:#95d18e!important}.bbCodeBlock .code span[style="color: #003399;"]{color:#7db3ea!important}.bbCodeBlock .code span[style="color: #009900;"]{color:#7ff178!important}.bbCodeBlock .code span[style="color: #000066; font-weight: bold;"]{color:#97b6eb!important}.bbCodeBlock .code span[style="color: #0000ff;"]{color:#9bf3c0!important}.bbCodeBlock .code span[style="color: #006633;"]{color:#457fe5!important}.dark_postrating,.message .dark_postrating.likesSummary{background:#252830;border:none;border-radius:0;color:#d8d8d8}.message .editDate{color:#a1a1a1}.messageUserInfo{background-color:#252830;border-radius:0;border:0;box-shadow:0 7px 10px -1px rgba(0,0,0,.37)}.messageUserBlock h3.userText{background-color:#252830}.messageUserBlock a.username{color:#d8d8d8}.messageUserBlock .arrow,.messageUserBlock .arrow span{border-left-color:#252830}.bbCodeBlock .code::-webkit-scrollbar-track{background:#585e72}.redactor_box{border:none}.redactor_toolbar{background-color:#585e72;border-bottom-color:#4b5563}html .redactor_toolbar li a{color:#d8d8d8}html .redactor_toolbar li a:hover{color:#fff}.redactor_toolbar li a.redactor_act,.redactor_toolbar li a:active,html .redactor_toolbar li a:hover{background:#1c1e23;border:1px solid #1c1e23;border-radius:0}.redactor_toolbar li.redactor_btn_group ul{background-color:#252830;border:none;border-radius:0}.profilePage .mast .section.infoBlock,.profilePage .mast .section.infoBlock .secondaryContent{border:none;border-radius:0}.profilePage .subHeading.textWithCount{border-top:none;background:#585e72;border-bottom:3px solid #4b5563;transition:all .3s cubic-bezier(.175,.885,.32,1.275)}.profilePage .subHeading.textWithCount:hover{transform:translateY(-3px);border-bottom:3px solid #585e72;box-shadow:0 7px 10px -1px rgba(0,0,0,.37)}.profilePage .subHeading.textWithCount:hover .text{color:#fff}.dark_postrating_member{border:none}.profilePage .textWithCount.subHeading .text{color:#d8d8d8}.profilePage .mainProfileColumn{border-left:none}.profilePage .mast .section{background:#434857}.profilePage .mast .section.infoBlock h3{border-top:none;background:#585e72;border-bottom:3px solid #4b5563;border-radius:0;box-shadow:none;color:#d8d8d8;transition:all .3s cubic-bezier(.175,.885,.32,1.275)}.profilePage .mast .section.infoBlock h3:hover{color:#fff;border-bottom:3px solid #585e72;margin:-8px -8px 11px;box-shadow:0 7px 10px -1px rgba(0,0,0,.37)}.pairsInline dt,body .dimmed{color:#aaa}body .dimmed .muted{color:#ccc}.profilePage .tabs.mainTabs{background:#434857}.profilePage .tabs.mainTabs li.active a{background:#585e72}.profilePage .primaryUserBlock .lastActivity{border-top-color:#585e72}.formValidationInlineError{z-index:-1}.eventList li,html .searchResult{border-bottom-color:#585e72}#userBar .navTabs .navLink .itemCount.alert{background-color:#e74c3c!important}.navPopup .listPlaceholder ol.secondaryContent.Unread{background-color:#585e72}.searchResult .snippet a{color:#d8d8d8!important}.searchResult .meta{color:#bbb!important}.searchResult .meta a{color:#ddd!important}.profilePage .mast .sectionFooter{border:none;padding-right:4px}.memberListItem{border-bottom-color:#585e72}.profileContent .textHeading{color:#d8d8d8;border-bottom-color:#585e72}.pairsColumns dt{color:#c5c5c5}.event .content .description em{color:#ccc!important}.resourceListItem{background-color:#434857!important;border-bottom-color:#585e72!important}.resourceListItem .resourceImage,.resourceListItem .resourceStats{background-color:#434857!important}.resourceListItem .resourceImage .resourceIcon img{background-color:#1c1e23!important}.innerContent .customResourceFields.aboveInfo{border-bottom-color:#585e72}.reviews .textHeading,.updates .textHeading{color:#d8d8d8;border-bottom-color:#585e72}.updates ol{border-bottom-color:#585e72!important}.resourceUpdate .likesSummary{background-color:#252830;border:none;border-radius:0}a.callToAction span:first-of-type{margin-bottom:4px}a.callToAction span{background:#434857;border:none;border-radius:0;box-shadow:0 7px 10px -1px rgba(0,0,0,.37);transition:all .3s cubic-bezier(.175,.885,.32,1.275);color:#d8d8d8}a.callToAction:hover span{background:#434857}a.callToAction span:hover{transform:translateY(-3px);box-shadow:0 7px 10px -1px rgba(0,0,0,.5);color:#fff;background:#434857}.MultiQuoteItem table .messageCell,.bbCodeQuote .quoteContainer{background-color:#585e72!important}.MultiQuoteItem .messageGradient,.bbCodeQuote .quoteContainer .quoteExpand{background:linear-gradient(to bottom,rgba(88,94,114,0) 0,#585e72 80%)!important}.MultiQuoteItem .avatarHolder,.bbCodeQuote .attribution,.bbCodeQuote .quoteContainer{border-color:#4b5563!important}.MultiQuoteItem{border-color:#585e72!important}.message .signature{border-color:#585e72}.dark_postrating_detail{background:#434857;color:#ccc}.xenOverlay .subHeading a{color:#eaeaea}.dark_postrating_column{border:none}.dark_postrating_header{border-color:#585e72}.staffHeading{color:#d8d8d8}.username .style3{color:#e15450}.username .style4{color:#8af182}.username .style5{color:#6ec7ea}.username .style6{color:#f072e9}.username .style9{color:#bab3a6}.username .style14{color:#79f2c8}.username .style17{color:#ccc6bb}.username .style18{color:#7aa7e1}.username .style20{color:#cdc7bd}.username .style21{color:#ef8f48}.username .style27{color:#ddac90}.resourceListMain{background:#434857;border:none;border-radius:0}.actionFilterRow{border-bottom-color:#585e72}.resourceListSidebar .secondaryContent{border:none;border-radius:0}.resourceListSidebar h3{border-radius:0;box-shadow:none;background:#585e72;border-bottom:3px solid #4b5563;transition:all .3s cubic-bezier(.175,.885,.32,1.275)}.resourceListSidebar h3:hover{box-shadow:0 7px 10px -1px rgba(0,0,0,.37);transform:translateY(-3px);border-bottom-color:#585e72}#jumpMenu .blockLinksList ul,#jumpMenu .nodeList li.d0,.xenOverlay #jumpMenu .nodeList{border-color:#585e72!important}.innerContent .rateBlock{background:#434857;border:none;border-radius:0}.innerContent .customResourceFields dt{color:#bbb}.dataTable tr.dataRow th{background:0 0;color:#fff}.dataTable tr.dataRow td,.dataTable tr.dataRow th{border-color:#585e72}.dataTable .dataRow .dataOptions a.secondaryContent{border:none}.dataTable .dataRow .dataOptions a.secondaryContent:hover{background:#585e72}.discussionListItem .noteRow{background-color:#252830}.discussionList .discussionListItem.sticky{background-color:#1c1e23;border-color:#585e72}.node.level_2:only-of-type .nodeInfo{border-radius:0!important}.forum_view .nodeList{border:none}.node .nodeText .nodeTitle a{color:#d8d8d8}.thread_view .threadAlerts{border:none;border-radius:0;background:#434857}.thread_view .threadAlerts dt{color:#aaa}.thread_view .threadAlerts dd{color:#ccc}.navigationSideBar h4.heading{background-color:#1c1e23}.navigationSideBar>ul{background-color:#434857;border:none;border-radius:0}.navigationSideBar>ul>li.section:last-child>ul>li:last-child a{border-radius:0}.smilieList .smilieText{background-color:#585e72;border:none;border-radius:0;color:#d8d8d8;padding:1px 5px}.bbCode>dl>dd{background:#585e72;border:none;border-radius:0;box-shadow:0 7px 10px -1px rgba(0,0,0,.37);margin-bottom:12px}.hasJs .bbCodeSpoilerText{background:#252830;border:none}.help_cookies .textHeading{color:#d8d8d8;border-color:#585e72}.help_cookies .baseHtml{padding:5px}.account_alerts .textHeading,.thread_create .textHeading{color:#d8d8d8}.thread_create .xenForm fieldset{border-color:#585e72}.thread_create .textCtrl{background:#434857}.textCtrl.Focus{border-color:#252830}#content .mainContent .xenForm .subHeading{color:#d8d8d8;background-color:#1c1e23;border:none}.explain .CurrentStatus{color:#d8d8d8}.discussionListItem .stats dl{border-color:#585e72}.conversation_view .message:first-child,.conversation_view .quickReply{border:none;border-radius:0}#userBar .navTabs .navTab.PopupClosed.selected .navLink,#userBar .navTabs .navTab.selected .navLink{padding-top:0}#userBar .navTabs .navTab.selected.PopupOpen .navLink{background:#1c1e23;border:none;border-radius:0}.navTabs .navTab.selected.PopupOpen .navLink{box-shadow:none}.account_alerts .textHeading{border-color:#585e72}.account_alerts .sectionMain{padding:5px}.button.smallButton{border-radius:0}.news_feed_page .smallButton{margin-bottom:3px;margin-right:3px}.watch_forums .nodeList{border:none;border-bottom:1px solid #585e72}.sectionMain h3.sectionHeader{color:#d8d8d8;border-color:#585e72}.account_privacy .xenForm fieldset{border-color:#585e72}.login_password_confirm input[type=password]{background:#434857}.dark_postrating_member td{border-color:#585e72}.redactor_dropdown{background-color:#252830;box-shadow:0 7px 10px -1px rgba(0,0,0,.37);border:none}.redactor_dropdown a{color:#d8d8d8}.redactor_dropdown a:hover{color:#fff;background-color:#1c1e23}#AjaxProgress.xenOverlay{background-color:transparent;box-shadow:none;padding:0}#redactor_modal .formOverlay,.xenOverlay .formOverlay{background-color:#434857;border:none;border-radius:0;box-shadow:0 7px 10px -1px rgba(0,0,0,.37);padding:0 0 8px;color:#ccc}#redactor_modal_header,.xenOverlay .formOverlay .heading{background-color:#585e72;border-radius:0;border-bottom:3px solid #4b5563;padding:8px 15px;transition:all .3s cubic-bezier(.175,.885,.32,1.275)}#redactor_modal_header:hover,.xenOverlay .formOverlay .heading:hover{border-color:#585e72;transform:translateY(-3px);box-shadow:0 7px 10px -1px rgba(0,0,0,.37)}#redactor_modal .textCtrl,.xenOverlay .formOverlay .textCtrl.Elastic{background-color:#252830;color:#d8d8d8}#redactor_modal a{color:#d8d8d8}.xenOverlay .formOverlay .textCtrl,.xenOverlay .formOverlay .textCtrl:focus{border-color:#252830}::-webkit-scrollbar{width:16px;box-shadow:0 0 38px 0 rgba(0,0,0,.61)}::-webkit-scrollbar-corner{background:#1c1e23}::-webkit-scrollbar-thumb{background:#1c1e23}::-webkit-scrollbar-track{background:#434857}';
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(addCSS);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(addCSS);
    } else if (typeof addStyle != "undefined") {
        addStyle(addCSS);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(addCSS));
        var heads = document.getElementsByTagName("html");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            document.documentElement.appendChild(node);
        }
    }

    var logohtml = `
  <a href="https://www.spigotmc.org/">
    <span></span>
    <img src="https://i.p1g.pw/spigot.png" alt="SpigotMC - High Performance Minecraft">
  </a>
`;
    var scroll = `
  ::-webkit-scrollbar {
    width: 16px;
    box-shadow: 0px 0px 38px 0px rgba(0,0,0,0.61);
  }
  ::-webkit-scrollbar-corner {
    background: #1c1e23;
  }
  ::-webkit-scrollbar-thumb {
    background: #1c1e23;
  }
  ::-webkit-scrollbar-track {
    background: #585e72;
  }
`;
    var twitter = `
  a {
    color: #efb61c
  }
  .SandboxRoot {
    color: #bbb
  }
  .timeline-Tweet-brand .Icon {
    background-image: url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2072%2072%22%3E%3Cpath%20fill%3D%22none%22%20d%3D%22M0%200h72v72H0z%22%2F%3E%3Cpath%20class%3D%22icon%22%20fill%3D%22%23667580%22%20d%3D%22M68.812%2015.14c-2.348%201.04-4.87%201.744-7.52%202.06%202.704-1.62%204.78-4.186%205.757-7.243-2.53%201.5-5.33%202.592-8.314%203.176C56.35%2010.59%2052.948%209%2049.182%209c-7.23%200-13.092%205.86-13.092%2013.093%200%201.026.118%202.02.338%202.98C25.543%2024.527%2015.9%2019.318%209.44%2011.396c-1.125%201.936-1.77%204.184-1.77%206.58%200%204.543%202.312%208.552%205.824%2010.9-2.146-.07-4.165-.658-5.93-1.64-.002.056-.002.11-.002.163%200%206.345%204.513%2011.638%2010.504%2012.84-1.1.298-2.256.457-3.45.457-.845%200-1.666-.078-2.464-.23%201.667%205.2%206.5%208.985%2012.23%209.09-4.482%203.51-10.13%205.605-16.26%205.605-1.055%200-2.096-.06-3.122-.184%205.794%203.717%2012.676%205.882%2020.067%205.882%2024.083%200%2037.25-19.95%2037.25-37.25%200-.565-.013-1.133-.038-1.693%202.558-1.847%204.778-4.15%206.532-6.774z%22%2F%3E%3C%2Fsvg%3E);
  }
  .timeline-Widget {
    background: #252830
  }
  .timeline-Header-title {
    color: #eaeaea
  }
  .timeline-Body {
    border-top: 1px solid #434857;
    border-bottom: 1px solid #434857;
  }
  .timeline-TweetList-tweet {
    border-bottom: 1px solid #434857;
  }
  .TwitterCard-container {
    border-color: #aaa
  }
  .TwitterCard-container--clickable:hover {
    background-color: #2e323d
  }
  .TwitterCard .SummaryCard-image {
    background-color: #aaa
  }
  ${scroll}
`;
    var editor = `
  html {
  background: #252830;
  color: #d8d8d8
  }
  ${scroll}
`;
    var editor2 = `
  html {
  background: #434857;
  color: #d8d8d8
  }
  ${scroll}
`;

    function addEditors() {
        var editors = document.getElementsByClassName('redactor_MessageEditor');

        if (editors !== null && editors.length >= 1) {
            for (var i = 0; i < editors.length; i++) {
                var d = editors[i].contentWindow.document;
                var style = document.createElement('style');
                style.type = "text/css";
                var href = window.location.href;

                if (href.indexOf("create-thread") > -1 || href.indexOf("save-inline") > -1) {
                    style.innerText = editor2;
                } else {
                    style.innerText = editor;
                }

                d.head.appendChild(style);
            }
        }
    }

    function edit() {
        document.getElementById('logo').innerHTML = logohtml;

        var t = document.getElementById('twitter-widget-0');

        if (t !== null && t.classList.contains('twitter-timeline')) {
            t = t.contentWindow.document;
            var s = document.createElement('style');
            s.type = "text/css";
            s.innerText = twitter;
            t.head.appendChild(s);
        }

        addEditors();
    }

    window.onload = edit;

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.previousSibling.innerText.indexOf("Edit") > -1) {
                addEditors();
            }
        });
    });

    var config = {
        attributes: true,
        childList: true,
        characterData: true
    };

    observer.observe(document.body, config);

})();