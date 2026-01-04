// ==UserScript==
// @name        摸鱼纯净版youtube
// @namespace   script
// @match       https://www.youtube.com/*
// @license     MIT
// @version     1.0.1
// @author      Ade
// @grant       GM_notification
// @grant       GM_setClipboard
// @require     https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @description 让你们神不知鬼不觉的看youtu
// @downloadURL https://update.greasyfork.org/scripts/470729/%E6%91%B8%E9%B1%BC%E7%BA%AF%E5%87%80%E7%89%88youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/470729/%E6%91%B8%E9%B1%BC%E7%BA%AF%E5%87%80%E7%89%88youtube.meta.js
// ==/UserScript==
initMethods();
/** 初始化 */
function initMethods() {
    $('#masthead-container,#contentContainer,#header,#secondary').hide();
    $('#page-manager').css({marginLeft:0,marginTop:0});
    setInterval(() => { $('#secondary,#below').hide(); $('#chips-wrapper').html("<h1 class='nb_class'>---------全网-最新-最牛逼-互联网技术科技论坛专区-欢迎鱼神位临---------</h1>");initCss();}, 1000);
}
function initCss(){
    $('.nb_class').css({margin:'30px auto',color:'red',fontSize:'30px'});
}