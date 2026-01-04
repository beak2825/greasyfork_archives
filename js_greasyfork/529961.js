// ==UserScript==
// @name        漫蛙去广告
// @namespace   ManwaAds
// @version     3.2
// @description 移除manwa网站广告
// @match       *://manwa.me/*
// @match       *://manwasa.cc/*
// @match       *://manwatn.cc/*
// @match       *://manwasu.cc/*
// @run-at      document-start
// @grant       GM_addStyle
// @license      pipi
// @downloadURL https://update.greasyfork.org/scripts/529961/%E6%BC%AB%E8%9B%99%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/529961/%E6%BC%AB%E8%9B%99%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
//manwa漫蛙

    // 主样式注入
    GM_addStyle(`
        /* 隐藏顶部横幅 */
        body .index-banner {
            margin-top: 80px;
            display: none !important;
        }

        /* 移除广告区域 */
        div .custom-ad-area,
        div .two-ad-area,
        div .ad-area {
            display: none !important;
        }

        /* 清理导航链接 */
        .normal-top:nth-child(4) > a:nth-child(1),
        .normal-top > a:nth-child(2),
        .normal-top > a:nth-child(3),
        .normal-top > a:nth-child(4),
        .normal-top > a:nth-child(5),
        .normal-top:nth-child(2) > a:nth-child(1) {
            display: none !important;
        }

        /* 侧边栏清理 */
        ul:nth-child(5) > li:nth-child(4),
        .footer li:nth-child(4),.footer li:nth-of-type(5) {
            display: none !important;
        }


        /* 浮动元素移除 */
        a:nth-child(3) .footer-float-icon,
        a:nth-child(2) .footer-float-icon {
            display: none !important;
        }

        /* 跑马灯和特定区块 */
        .index-marquee,
        #detail > div:nth-child(3),
        .img-hosts,
        #cp_img > img {
            display: none !important;
        }
        /* 美化 */
.normal-top:nth-child(5),.normal-top:nth-child(3),div.center-main-info {
    background: linear-gradient(#ffe5f2, #fff);
}

.normal-top:nth-child(4),.normal-top:nth-child(2) {
    background-color:#ffa3c6 !important;
}


.header-background {
    background: linear-gradient(#ffe5f2, #ffffff61);
}

.normal-top {

    box-shadow: 1px -3px 12px #ffa3d1c4;
}

.normal-top-logo,.view-fix-top-bar-center-logo img{
  content: url("https://github.com/pipiorange030/photoroom-public/blob/main/%E7%B4%A0%E6%9D%90/%E7%88%B1%E5%BF%831.png?raw=true") !important;
}


li:nth-child(1) > a > img,li:nth-child(2) > a > img,li:nth-child(3) > a > img,li:nth-child(6) > a > img,i.center-main-list-logo,img.center-main-list-logo,img.center-main-list-right,i.center-main-list-right,i.fa-eye,img.detail-bottom-1,img.normal-top-right-search{
  content: url("https://github.com/pipiorange030/photoroom-public/blob/main/%E7%B4%A0%E6%9D%90/%E7%B2%89%E8%89%B2%E6%98%9F%E6%98%9F.png?raw=true") !important;
}

p:nth-of-type(n+2) {color: #616161;font-size: small}

.manga-list-title.index:after,div.toast-info {
    background-color: #ffa3c6;
}

.manga-list-2-tip {font-size: 11px;}

div.manga-filter-row a.active,.blacklist-menu div div a,.menu-list div div a,button.folder_submit,span.info-tag-span {
  border: 1.5px solid rgb(255, 122, 173) !important;
  background-color: rgb(255, 163, 198) !important;
  box-shadow: rgb(255, 10, 104) 1px 1px 1px !IMPORTANT;
}

a.blacklist-toggle {
  background-color: rgb(255, 163, 198) !important ;
  border-top: 1px solid rgb(255, 102, 163);
  border-bottom: 1px solid rgb(255, 102, 163);
  border-left: 1px solid rgb(242, 97, 155);
  border: none !important;
  box-shadow: 1px 1px 1px #ffe1f0c4 !important;
}

li.active  {
  background-color: rgb(255, 163, 198) !IMPORTANT ;
  border-top: 1px solid rgb(255, 102, 163);
  border-bottom: 1px solid rgb(255, 102, 163);
  border-left: 1px solid rgb(242, 97, 155);
  box-shadow: 1px 1px 1px #ffe1f0c4;
}

a.blacklist-tag,a.panel-tag {
	border: 1px solid #a4a4a4;
	color: rgb(65, 65, 65);
	font-size:12px
}

.active a {color: #fff !important}

.pagination2 li {
  border-top: 1px solid #ffa3c6  !important;
  border-bottom: 1px solid #ffa3c6  !important;
  border-left: 1px solid #ffa3c6  !important;
 }

.pagination2 li:last-child {
	border-right: 1px solid #ffa3c6 !important}

.pagination2 li:nth-of-type(n+1) a {color: #ffa3c6}

#app > div > span,i.fa-sun,a#copy_mail,.center-main-list li:nth-of-type(1),i.fa-sort-amount-desc,i.fa-chevron-right,.scroll-content i,button#blacklistBtn{display: none !important}

.manga-list-2 p.manga-list-2-tip {color: #a8a8a8}

.tags-preview-more div {color: rgb(242, 97, 155) !important}

a.line-container-btn,button.edit-btn {
 background: rgb(255, 137, 184) !important;
 border-top-left-radius:11px;
 border-top-right-radius:11px;
 border-bottom-left-radius:11px;
 border-bottom-right-radius: 11px}

.line-container div:nth-of-type(3) {color: #a8a8a8 !important;font-size: 11px}

a.is-new {color: rgb(255,76,123) !important}

div.folder_id a  {border: 1px solid rgb(242, 97, 155)}

.selector-top-item.active:after {
    content: "";
    background-color: rgb(255, 10, 104);
    border-radius: 2.5px;
    width: 25px;
    height: 5px;
    display: block;
    position: absolute;
    bottom: 0;
    left: 50%;
    margin-left: -12.5px;
}

span.center-main-list-title,#app > div > p{color: #505050 !important;font-size:14px}

div.dl-overlay[data-original][src*="imagecover_s.png"] { opacity: 0 !important;
  /* 强制设置固定尺寸（需匹配真实图片比例） */
  width: 200px !important;
  height: 300px !important;
  /* 显示自定义网络图片作为背景 */
  background: url("https://github.com/pipiorange030/photoroom/blob/main/pic/M7KJOG0Q2HX2E.png?raw=true") no-repeat center/cover !important;
  /* 转换为块级元素确保背景可见 */
  display: block !important;
}

p.center-main-info-title:nth-of-type(1)::after {
  content: "pip"; /* 新文字 */
  display: block;  /* 确保覆盖原内容 */
}

/* 隐藏原文字 */
p.center-main-info-title:nth-of-type(1) {
  font-size: 0;    /* 隐藏原文本 */
  color: transparent;
}

.manga-list-2-title a,p.detail-desc ,p.buy-manga-new {font-size: 13px;color: #505050}

a.detail-bottom-btn {background-color: rgb(255, 130, 172)}

.detail-main-info-value a {color: rgb(255, 122, 173) !important}    

i.fa-info {border: 2px solid rgb(255, 130, 172) !important}

.view-fix-top-bar > div {background-color: #fff}

svg.comment-submit,.view-fix-top-bar-right svg  {fill:rgb(255, 130, 172) !important ;border: 2px solid #ff82ac !important }

span.view-fix-bottom-bar-item-chat-count {background-color: rgb(255, 122, 173)}

span.rank {color: #ff81a9 !important}

.search-top-input {
    background-color: white;
}
#searchtxt,a.search-top-right { background-color: #ffe3ee;
    font-size: 12px
}

.search-top { border-bottom:rgb(255,219,230) !important;
    background-color: #ffffff;
    box-shadow: 1px -3px 12px rgb(255,151,178);
line-height: 20px;}

span.active {font-size: 12px;color: rgb(249,65,130) !important}

span.book-list-info-bottom-right-font {font-size: 12px !important}

a.panel-tag,.scroll-content a {border-color: rgb(208,208,208) !important}

.menu-list span,.menu-list div div a {font-size: 12px !important}

a.blacklist-tag.active {
    background-color: rgb(255,182,212) !important; 
    border-color: rgb(255,213,241)    
}
.detail-selector-item.active:after {
    height: 5px;
    border-radius: 1.5px;
    background-color: rgba(255,129,182,0.76) !important;
}

li.blocked-manga,img[data-original='https://mwfimsvfast2.cc/static/upload2/ads/blocked.jpg'] {display: none !important;}

i.active{color: pink !important}


.active.chapteritem,.detail-list-select a:visited { background-color:rgb(255,152,191) !important;
    box-shadow: none !important;
color:white !important}

#feedback_add_bt {
    background-color:rgb(255,152,191) !important;box-shadow: none !important;}

    `);

    // 动态内容适配 (根据需要取消注释)
    /*
    new MutationObserver(() => {
        GM_addStyle(`...重复上述样式...`);
    }).observe(document, {
        subtree: true,
        childList: true
    });
    */

})();
