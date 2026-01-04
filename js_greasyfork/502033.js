// ==UserScript==
// @name         简化微信公众号管理页外观
// @namespace    https://penicillin.github.io/
// @version      20241217
// @description  简化微信公众号管理页外观，方便功能调用
// @include        https://mp.weixin.qq.com/cgi-bin/appmsgpublish?*
// @include        https://mp.weixin.qq.com/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502033/%E7%AE%80%E5%8C%96%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E7%AE%A1%E7%90%86%E9%A1%B5%E5%A4%96%E8%A7%82.user.js
// @updateURL https://update.greasyfork.org/scripts/502033/%E7%AE%80%E5%8C%96%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E7%AE%A1%E7%90%86%E9%A1%B5%E5%A4%96%E8%A7%82.meta.js
// ==/UserScript==

var styleElement = document.createElement('style');
document.getElementsByTagName('body')[0].appendChild(styleElement);

//管理页
if (document.URL.match(/cgi-bin/)){
    styleElement.append('.weui-desktop-block__title {display: inline-block !important;}');
    styleElement.append('.weui-desktop-block__header__append-in {display: inline-block !important;}');
    styleElement.append('#footer {display: none !important;}');
    styleElement.append('.weui-desktop-layout__main {background-color: #ccc5;}');
    styleElement.append('.weui-desktop-mass__overview {margin: unset !important;min-width: 115px !important;}');
    styleElement.append('.weui-desktop-mass-appmsg__bd {padding-right: unset !important;}');
    styleElement.append('.weui-desktop-mass-appmsg__ft {display:block !important;}');
    styleElement.append('.weui-desktop__unfold-menu-opr-new {display: none !important;}');
    styleElement.append('.weui-desktop-mass-appmsg__bd a:hover {background-color: #00ff0005;box-shadow: 5px 5px 10px #3333;}');
    styleElement.append('.weui-desktop-pagination {background-color: white;margin-bottom: 5px;}');
    
    styleElement.append('.weui-desktop-pagination__num {display: inline-block !important;width: 30px;border: 1px solid #8888;border-radius: 10px;margin: 0px 5px !important;}');
    styleElement.append('.weui-desktop-pagination__num:hover {background: #fff5cd;}');
    
    styleElement.append('.weui-desktop-pagination__nav {background-color: white;padding:0px 5px;}');
    styleElement.append('.weui-desktop-pagination__form {background-color: white;padding:0px 5px;}');
    styleElement.append('.weui-desktop-pagination {padding: 4px 0px !important;border-radius: 8px; border: 3px solid #88b2e86e;}');
    styleElement.append('.publish_content {padding-bottom: 5px !important;}');
    styleElement.append('.weui-desktop-mass-media__opr {visibility: visible;opacity:0.5;}');//显示三个菜单
    styleElement.append('.weui-desktop-mass-media__opr :hov {opacity:1;}');//显示三个菜单
    styleElement.append('.head_append_in {opacity:0.5;}');

    //突显删除的项目
    var deleted=document.getElementsByClassName('weui-desktop-mass-media_del');
    for (let i=0;i<deleted.length;i++){
        //deleted[i].parentNode.style.display="none";
        deleted[i].parentNode.parentNode.parentNode.parentNode.style.backgroundColor="#dfced1";
    }

}

//查看文章页
if (document.URL.match(/mp.weixin.qq.com\/s/)){
    styleElement.append('#activity-detail {padding:0px;}');
    styleElement.append('#content_bottom_area {display:none !important;}');
    styleElement.append('#js_pc_qr_code {display:none !important;}');
}
