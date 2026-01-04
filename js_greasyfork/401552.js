// ==UserScript==
// @name         拒绝小说网站背景色、修改字体、段落距离、去除起点阅读/笔趣阁等网站广告
// @namespace    https://xuexizuoye.com
// @version      1.32
// @description  我不要绿色，不要护眼色，不要你觉得，就要我觉得！
// @author       huansheng
// @include      http://*/*
// @include      https://*/*
// @exclude        *www.52pojie.cn*
// @exclude        *chinaz.com*
// @exclude        *greasyfork.org*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/401552/%E6%8B%92%E7%BB%9D%E5%B0%8F%E8%AF%B4%E7%BD%91%E7%AB%99%E8%83%8C%E6%99%AF%E8%89%B2%E3%80%81%E4%BF%AE%E6%94%B9%E5%AD%97%E4%BD%93%E3%80%81%E6%AE%B5%E8%90%BD%E8%B7%9D%E7%A6%BB%E3%80%81%E5%8E%BB%E9%99%A4%E8%B5%B7%E7%82%B9%E9%98%85%E8%AF%BB%E7%AC%94%E8%B6%A3%E9%98%81%E7%AD%89%E7%BD%91%E7%AB%99%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/401552/%E6%8B%92%E7%BB%9D%E5%B0%8F%E8%AF%B4%E7%BD%91%E7%AB%99%E8%83%8C%E6%99%AF%E8%89%B2%E3%80%81%E4%BF%AE%E6%94%B9%E5%AD%97%E4%BD%93%E3%80%81%E6%AE%B5%E8%90%BD%E8%B7%9D%E7%A6%BB%E3%80%81%E5%8E%BB%E9%99%A4%E8%B5%B7%E7%82%B9%E9%98%85%E8%AF%BB%E7%AC%94%E8%B6%A3%E9%98%81%E7%AD%89%E7%BD%91%E7%AB%99%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
function bgcwhite(){
    console.log("修改背景色，字体格式->starting……");
    GM_addStyle("body,.main-text-wrap,#content,.content,#main-text-wrap,.chapter-content,#chapter-content,#contentWp,.paper-box,.content-body,.content-body,.content-ext,#content p,#htmlContent,#chaptercontent {background-color: rgba(0, 0, 0, 0) !important;font-size: 16px!important;font-family: Helvetica Neue,Arial,PingFang SC,STHeiti,Microsoft YaHei,SimHei,sans-serif!important;line-height: 130%!important}");
console.log("修改背景色，字体格式->end……");
};
//#mys-wrapper
function addel(){
    console.log("尝试去除广告->starting……");
    GM_addStyle(".con_ad,#close-game-op,#mys-wrapper,.mys-wrapper,#google-center-div,.google-center-div,#mys-content,#GoogleActiveViewElement,.GoogleActiveViewElement,#google_image_div,.adsbygoogle,.adsbygoogle-noablate,boy.jar,.GoogleActiveViewInnerContainer,div .top-read-ad,ins.ee,img.img_ad,.GoogleActiveViewElement img,.GoogleActiveViewElement a,.top-read-ad img,.top-read-ad a,.downcode,#j-topBgBox,#j-topHeadBox .back-to-op,.right-op-wrap,.games-op-wrap,.jumpWrap,#j_bodyRecWrap,.body-rec-mask,.game-wrap,.banner-wrap,.focus-img.cf,.notice-banner,#float-op-wrap,#j_leftRecBox a,#j_leftRecBox a,.body-rec-wrap,.float-op-wrap,.notice-list>ul>li>.red，#appss>dd div {background-image: none!important;dispaly:none!important;width:0!important;height:0!important;margin-left:-99999px!important}");
    setTimeout(function () { GM_addStyle("body>div:last-child,#cs_kd_div {background-image: none!important;dispaly:none!important;width:0!important;height:0!important;margin-left:-99999px!important;z-index:0!important;overflow:visible!important;}"); }, 15000)
console.log("尝试去除广告->end……");
};
(function() {
    console.log("开始修改->end……");
    bgcwhite();
    console.log("修改网页结束->end……");
})();
window.onload=function(){
    console.log("网页加载完毕再次修改确保万一！……");
    addel();
    bgcwhite();
    console.log("再次修改确保结束！……");
}();