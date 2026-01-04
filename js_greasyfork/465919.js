// ==UserScript==
// @name         xes_beautify增强
// @namespace    https://code.xueersi.com/
// @version      1.1.0
// @run-at       document-start
// @author       一只小兔子
// @license      GPL-3.0
// @description  xes_beautify增强，CZ工作室出品，原作者：akjjq
// @match        https://code.xueersi.com/*
// @icon         https://code.xueersi.com/static/images/code-home/qrlogo.png
// @grant        none
// @connect      *

// @downloadURL https://update.greasyfork.org/scripts/465919/xes_beautify%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/465919/xes_beautify%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

console.log("xes_beautify loaded");
const style = document.createElement("style");
style.innerHTML = `
.component-home-banner{display:none}
    footer,.cpt-loading-mask,.keduo-recommend,.floor-bar-wrapper,.cursor-follow-item-bottom,.cursor-follow-item-move,.cursor-follow-item-top,.title-icon,.headercon-logo
    {
        display:none !important;
    }
    body,.main-homepage,div .layout[data-v-704641f8],.content[data-v-05fc76c5]
    {
        background-attachment:fixed !important;
        background-size:cover !important;
        background-color: #4158D0 !important;
        background-image: url(https://api.dujin.org/bing/1920.php) !important;

    }
	#homePageKeduoGuide
    {
        margin-top:-1675px;
        transform:translateZ(0);
    }
	.header
	{
		backdrop-filter:blur(10px) brightness(130%);
        background: #ffffff7f !important;
	}
	.header-left-nav-item-active
	{
		background-color:#0000001f!important;
	}
    .header-left-nav-item:hover
    {
        background-color:#0000002f!important;
    }
	.hero
	{
		background: #00000000 !important;
	}
    .header-menu
    {
        background: #ffffff6f !important;
    }
    .header-menu-item:hover
    {
        background: #ffffff8f !important;
    }
    .title-icon
    {
        display:none !important;
    }
    .title-text
    {
        padding-left:10px;
        font-size:30px !important;
    }
    .div-content-buttons-left,.div-content-buttons-right
    {
        opacity:0.5;
    }
    .header-left-nav-item-create-btn[data-v-0ad9a040]:hover
    {
        background:#ffffff3f !important;
    }

	.user-introduction
	{
		background: #00000000 !important;
	}
	.user-name
	{
		color:#000000a8;
	}
	.signature-zone
	{
		color:#0000008f;
	}
	.user-count
	{
		color:#0000008f;
	}
	.headercon
	{
		background: #fafafa !important;
	}
	.editor-group-header
	{
		background: #fafafa !important;
	}
	.headercon-input
	{
		background-color:ffffff2f !important;
	}
	.headercon-right__btn
	{
		background:ffffff2f !important;
	}
	.headercon-center
	{
		margin:0 !important;
	}

    .card,.work-card,.user-master,.user-master-con,.rank-content,.search-center-component-work-card
    {
        background:#ffffff7f !important;
        backdrop-filter:blur(10px) brightness(130%);
    }
    .card-top,.work-thumbnail,.card-cover-box
    {
        opacity:0.95;
    }
    .card-bottom,.work-detail,.user-master-con,.card-content
    {
        opacity:0.95;
    }
    .card-bottom-data,.work-list
    {
        color:#000000cf !important;
    }
    .card-bottom-data-right-like:before,.card-bottom-data-right-view:before,.like_icon:before,.view_icon:before
    {
        filter:brightness(30%);
    }

    .detail-content
    {
        border-radius:8px;
        background:#ffffff7f !important;
        box-shadow:none !important;
        backdrop-filter:blur(20px) brightness(130%);
    }
    .reply-comment-box,.xes-textarea,.reply-comment-con,.user-access-con,.project-description-scratch,.project-recommend-scratch,.work-tags span
    {
        background:#ffffff4f !important;
        border-radius:8px !important;
        border:0px !important;
    }
    #comment-box
    {
        background:#ffffff00 !important;
    }
    .comment-box,.user-name,.grey-span,.comment-date,.emoji-btn,.description-con,.production-count
    {
        color:#0000007f !important;
    }
    .comment-area .comment-title[data-v-8e3d883e],.coment-list .reply-comment-con .reply-item[data-v-f8b7f6a6]
    {
        border-bottom:1px solid #ffffff3f !important;
    }
    .comment-area .comment-con .comment-list[data-v-8e3d883e]
    {
        border-top:1px solid #ffffff3f !important;
    }
    .project-detail-container .detail-content .project-detail-con .project-detail .works_activity_tags .work-tags span[data-v-135cd84a]
    {
        border-radius:15px !important;
        border:1px solid #ffffff3f !important;
    }
    .submit-btn,.user-icon,.user-access-icon,.production-img,.author-icon
    {
        opacity:0.8;
    }
    .emoji-box,.emoji-tab,.xes-emoji
    {
        border-radius:5px !important;
        border:0px !important;
        background:#ffffff2f !important;
        backdrop-filter:blur(15px) brightness(130%);
    }
    .project-operate-left > div , .project-operate-right > div
    {
        border:1px  solid #ffffff4f !important;
        border-radius:5px !important;
    }
    .project-detail__overview-data img:nth-child(1)
    {
        display:none !important;
    }
    .project-detail__overview-data>img
    {
        opacity:.5;
        border-radius:10px;
    }
    .view_icon,.like_icon
    {
        filter:brightness(50%);
    }


    .icon-bianji
    {
        opacity:0.5;
    }
    .user-master-icon
    {
        display:none;
    }
    .user-menu,.user-honor,.follow-list[data-v-1f68a1ae], .menu-tab[data-v-1f68a1ae],.follow-list,.show_medal
    {
        backdrop-filter:blur(20px) brightness(130%);
        background:#ffffff7f !important;
    }
    .user-menu
    {
        width:max(1120px , 80%) !important;
        border-radius:8px;
    }
    .rank-eye-img
    {
        display:none;
    }
    .personal-thumbnail,.follow-operate,.follow-thumbnail
    {
        opacity:0.8;
    }
    .work-menu
    {
        backdrop-filter:blur(20px) brightness(130%);
        background:#ffffff7f !important;
    }
    .user-master-title
    {
        background:#00000000 !important;
    }
    .user-master-thumbnail
    {
        background:##acb9ff0f !important;
    }
    .user-master
    {
        background:#00000000 !important;
    }
    .triangle_icon
    {
        opacity:0.5;
    }
    .tag_search
    {
        backdrop-filter:blur(20px) brightness(130%);
        background:#ffffff7f !important;

    }
    .radio-type,.header .tag_search .condition_list .tag_list ul li[data-v-33d0287b]
    {
        color:#0000007f !important;
    }
    .search_sub_condition
    {
        background:#ffffff00 !important;
    }
    .header[data-v-33d0287b]
    {
        background:#ffffff00 !important;
    }
    .active_tag
    {
        background:#ffffff3f !important;
    }
    .header .tag_search .condition_list[data-v-33d0287b]
    {
        border-bottom:1px solid #ffffff3f !important;
    }

    .user-tabs,.show-area .project-group[data-v-03ff86cb]
    {
        backdrop-filter:blur(15px) brightness(130%);
        background:#ffffff7f !important;
    }
    .user-tabs .select-type ul li[data-v-03ff86cb]
    {
        color:#0000007f !important;
    }

    .headercon,.editor-group-header
    {
        background-color:#ffffff4f !important;
        backdrop-filter:blur(15px) brightness(130%);
        background:#ffffff2f !important;
    }
    .ace-editor, .oj-ide-editor
    {
        background:#ffffff7f!important;
        backdrop-filter:blur(20px) brightness(130%);
        border-radius:8px !important;
    }
    .ace_gutter,.ace_gutter-layer,.headercon-input
    {
        background:#ffffff5f !important;
    }
    .editor-group-term
    {
        margin-top:12.5px;
    }
    .ws-term-comp-group
    {
        opacity:0.8;
    }
    .cursor-icon,.code-term-btn
    {
        opacity:0.5;
    }
    .headercon-right__btn,.tools-scale-btn-wrapper,.btn-ctrl .btn-no-border[data-v-02aa8db7]
    {
        background:#0000001f !important;
    }
    .btn-run
    {
        background:#2ecc715f !important;
    }

    .tabs-wrapper[data-v-89dc251c]
    {
        background:#ffffff5f !important;
        backdrop-filter:blur(15px) brightness(130%);
    }
    .tabs-wrapper .tab-item[data-v-89dc251c]
    {
        background:#ffffff2f !important;
    }
    .tabs-wrapper .tab-item.active[data-v-89dc251c]
    {
        background:#ffffff9f !important;
    }
    .file-list[data-v-62c5c9d5]
    {
        height:calc(100% + 10px) !important;
        background-color:transparent !important;
        border-right:none !important;
    }
    div[style$="position: relative; z-index: 503;"]
    {
        background:#00000000 !important;
    }
    .file-list__title,.file-list__content,.file-list__filesize
    {
        background:#ffffff7f !important;
        color:#000000cf !important;
        backdrop-filter:blur(15px) brightness(130%);
    }
    .file-list-content
    {
        background-color:#ffffff2f !important;
    }
    .flielist-animate-image
    {
        opacity:0.5;
    }
    .xes-node-selected
    {
        background-color:#ffffff3f !important;
    }

    .message-container,.message-con
    {
        background:#ffffff7f !important;
        backdrop-filter:blur(15px) brightness(130%);
        box-shadow:none !important;
        border-radius:8px;
    }
    .message-container .side-bar h2[data-v-262188f0]
    {
        border-bottom:0px !important;
    }
    .messageTitle[data-v-5a01af1b],.comment-reply .comment-reply-piece[data-v-36abc828]
    {
        border-bottom:1px solid #ffffff2f !important;
    }

    .component-search-box-input[data-v-ee58b124]
    {
        background:#ffffff3f !important;
    }
    .component-search-box-icon
    {
        opacity:0.7;
    }
    .component-search-box-recommend
    {
        background:#ffffffcf !important;
    }

    .card-style[data-v-3e341266]
    {
        backdrop-filter:blur(15px) brightness(130%);
        background:#ffffff7f !important;
    }
    .module-title
    {
        border-bottom:none !important;
    }
    .search-box_type-item.active[data-v-3e341266],.search-box_type-item-active-flag[data-v-3e341266]
    {
        opacity:0.5;
    }

    footer
    {
        background: ffffff7f!important;
        backdrop-filter:blur(20px) brightness(130%);
    }
    .signature-zone
    {
    background-color:rgba(225,225,225,0.5);
    border-radius: 10px;
    }
    .user-fans_count
    {
    background-color:rgba(225,225,225,0.5);
    border-radius: 10px;
    }
    .user-focus_count
    {
    background-color:rgba(225,225,225,0.5);
    border-radius: 10px;
    }
    .user-page_icon
    {
    background-color:rgba(225,225,225,0.5);
    border-radius: 10px;
    }
    .user-work_icon
    {
    background-color:rgba(225,225,225,0.5);
    border-radius: 10px;
    }
    .user-collect_icon
    {
    background-color:rgba(225,225,225,0.5);
    border-radius: 10px;
    }
    .work_total
    {
    background-color:rgba(225,225,225,0.5);
    border-radius: 10px;
    }
    .active-tab
    {
    background-color:rgba(225,225,225,0.5);
    border-radius: 10px;
    }
    .user-collect_icon
    {
    background-color:rgba(225,225,225,0.5);
    border-radius: 10px;
    }
    .favorites_total
    {
    background-color:rgba(225,225,225,0.5);
    border-radius: 10px;
    }
    .fans_total
    {
    background-color:rgba(225,225,225,0.5);
    border-radius: 10px;
    }
    .user-focus_icon
    {
    background-color:rgba(225,225,225,0.5);
    border-radius: 10px;
    }
    .follows_total
    {
    background-color:rgba(225,225,225,0.5);
    border-radius: 10px;
    }
    .personal-title
    {
    background-color:rgba(225,225,225,0.5);
    border-radius: 10px;
    }
    .user-name
    {
    background-color:rgba(225,225,225,0.5);
    border-radius: 10px;
    }
    .user-fans_icon
    {
    background-color:rgba(225,225,225,0.5);
    border-radius: 10px;
    }
    .medal-page_icon
    {
    background-color:rgba(225,225,225,0.5);
    border-radius: 10px;
    }
    .title-text
    {
    background-color:rgba(225,225,225,0.5);
    border-radius: 10px;
    }
    .animated normal_download_con container
    {
    background-color:rgba(225,225,225,0.5);
    border-radius: 10px;
    }
`


document.head.appendChild(style);