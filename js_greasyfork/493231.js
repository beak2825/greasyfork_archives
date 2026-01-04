// ==UserScript==
// @name         [CSS][UI]百度网盘美化去广告[为美好生活添砖加瓦]
// @namespace    com.github.rikacelery
// @version      1.0.5
// @description  移除百度网盘主页的广告位, 和一些美化css,请配合ublock等插件使用
// @author       rikacelery
// @run-at       document-start
// @match        https://pan.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493231/%5BCSS%5D%5BUI%5D%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%BE%8E%E5%8C%96%E5%8E%BB%E5%B9%BF%E5%91%8A%5B%E4%B8%BA%E7%BE%8E%E5%A5%BD%E7%94%9F%E6%B4%BB%E6%B7%BB%E7%A0%96%E5%8A%A0%E7%93%A6%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/493231/%5BCSS%5D%5BUI%5D%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%BE%8E%E5%8C%96%E5%8E%BB%E5%B9%BF%E5%91%8A%5B%E4%B8%BA%E7%BE%8E%E5%A5%BD%E7%94%9F%E6%B4%BB%E6%B7%BB%E7%A0%96%E5%8A%A0%E7%93%A6%5D.meta.js
// ==/UserScript==
if (/disk\/main/.test(document.location.pathname)) {
    GM_addStyle(`
span.nd-sug-ad-item,
div.nd-game-entry,
.nd-chat-ai-btn,
.wp-s-header-user__drop-privilege,
.wp-s-header-user__drop-channel,
.nd-vip-btn
{
  display: none !important;
}
`);

} else if (/\/s\//.test(document.location.pathname)) {
    GM_addStyle(`
i.Ebdyswb,
.app-feedback,
.app-notice,
.app-download,
.app-user-vip-center,
.module-share-footer,
body::-webkit-scrollbar-track,
.bd-aside-ad,a[title="超值续费延长SVIP特权"],
span[node-type="disk-home"],
span[node-type="mbox-homepage"],
span[node-type="photo"],
span[node-type="convert"],
.two_dimension_qrcode_guide,
.two_dimension_code_bottom,
.g-button img,
.g-button[title="保存到网盘"] .text,
.g-button[title="下载"] .text,
.g-button[title="保存到手机"] .text,
.g-button[title="举报"],
.vip-notice,.vip-privilege,
.user-service-notice,
.aa
{
  display: none !important;
}
dt.EHazOI{
  background-image: url("https://pan.baidu.com/m-static/base/static/images/favicon.ico") !important;
  width: 30px!important;
  background-size: cover;
}
.cMEMEF{
  margin: 0 0px!important;
}
.header-find{
  display: block!important;
  width: 100vw!important;
  top:50px!important;
  left: -84px!important;
  padding: 0px!important;
  height: 0px!important;
  transition: all ease-in .3s .2s;
  /* transition-delay:0; */
  overflow: hidden;
  box-shadow: none !important;
  border: none!important;
}
span:hover .header-find.header-find.header-find{
  height: 200px!important;
  transition: all cubic-bezier(0.13, 1, 0.58, 1) .6s;
  box-shadow: 3px 3px 10px 0 #00000021 !important;

}
.header-find .find-item {
  padding-top: 6px!important;
  margin: 0!important;
  width: 80px!important;
  height: 80px!important;
}
.xtJbHcb .header-find .find-arrow {
  left: 92px!important;
}
.find-list{
  display: flex!important;
  flex-wrap: wrap;
}



.xtJbHcb .PvsOgyb .desc-header{
  display: flex !important;
}
.xtJbHcb .PvsOgyb{
    width: 220px!important;
    right: -25px!important;
}






.two_dimension_code_main_wrap,
.two_dimension_code_main{
  width: 112px !important;
  height: 112px !important;
}
.inner_two_dimension_code{
  width: unset !important;
  height: unset !important;
}


.bd-left .module-share-header .slide-show-header {
  padding:5px!important;
}
.slide-show-header .slide-show-other-infos{
  margin-top: 0!important;
}
.slide-show-header .module-share-person-info{
  margin-top: 5px!important;
}

body{overflow-:hidden;}
#bd-main .bd-left{margin:0px 0 0 0 ;}
#layoutApp,#bd{min-height:0;min-width:0;}
#layoutApp,#bd{height:100%}
#layoutApp{background-color:#ccced2 !important}
#layoutApp{padding-bottom:25px;padding-top:75px}
#shareqr >  div:nth-child(2){height:100% !important;}
#shareqr >  div:nth-child(2) > div{height:100% !important;}
#shareqr >  div:nth-child(2)>div:nth-child(3) > div{height:100% !important;}

.bd-left{
height: 100% !important;
}
#layoutApp{
  min-height:0 !important;

    padding-top: 63px !important;
  padding-bottom: 0 !important;
}
.module-share-header{
  position: sticky !important;
  top:0;
  z-index:5;
  background:#fff;
}
.two_dimension_qrcode_guide{
display: none;
}
#bd {
    margin: 0 !important;

}
#bd,
#bd-main .bd-left ,
.xtJbHcb{
    border-radius: 0!important;
min-width:0!important;
}
.bd-left{
    overflow-y: scroll !important;
}
#layoutApp .frame-main {
  width: 100% !important;
  height: 100% !important;
}
#layoutApp .frame-main .frame-content {
  /* margin-right: 0!important; */
  margin: 0!important;
  border-radius:0;

/*   padding-bottom:10px; */
}
.frame-all{
  background-color: rgb(173, 173, 173) !important;


`);
    var wwlload = window.onload;
    window.onload = () => {
        if (wwlload) wwlload();

        document.querySelector(".business-ad-content")?.remove();
    };

    document.addEventListener("DOMContentLoaded", function () {
        var style = document.createElement("style");
        style.innerHTML = "#bd-main .bd-left { margin: 0 !important; }";
        document.body.appendChild(style);
    });
}
