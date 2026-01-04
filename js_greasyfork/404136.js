// ==UserScript==
// @icon            https://www.jianfast.com/favicon.ico
// @name            去除简法主页搜索框/去除简法主页背景图设置限制
// @namespace       http://www.lxzy.ml
// @version         2.0
// @note            2020.05.26 v1.0 去除简法主页搜索框
// @note            2020.05.29 V1.2 添加对极简主页去除搜索框的支持。 声明：希望大家还是能够支持正版简法主页：https://www.jianfast.com
// @note            2021.07.29 v2.0 修复去除简法主页搜索框的功能并取消对极简主页的支持。同时添加更改主页背景图的功能，通过本脚本修改背景图免登录，并不受强制https以及强制后缀格式为图片格式限制（即可以使用api做背景图）
// @description     将简法主页的搜索框去除，仅保留书签/去除简法主页背景图设置限制
// @license         GPL-3.0-only
// @author          银河以北吾彦最美
// @match           https://www.jianfast.com/
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/404136/%E5%8E%BB%E9%99%A4%E7%AE%80%E6%B3%95%E4%B8%BB%E9%A1%B5%E6%90%9C%E7%B4%A2%E6%A1%86%E5%8E%BB%E9%99%A4%E7%AE%80%E6%B3%95%E4%B8%BB%E9%A1%B5%E8%83%8C%E6%99%AF%E5%9B%BE%E8%AE%BE%E7%BD%AE%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/404136/%E5%8E%BB%E9%99%A4%E7%AE%80%E6%B3%95%E4%B8%BB%E9%A1%B5%E6%90%9C%E7%B4%A2%E6%A1%86%E5%8E%BB%E9%99%A4%E7%AE%80%E6%B3%95%E4%B8%BB%E9%A1%B5%E8%83%8C%E6%99%AF%E5%9B%BE%E8%AE%BE%E7%BD%AE%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
window.onload = function(){
  function removeSearchBox(){
    var searchBox = document.getElementById('search-wrap');
    searchBox.parentElement.removeChild(searchBox);
  }                                                                    
  //removeSearchBox();                                                   //移除搜索框函数:如果需要启用该功能请将本行开头的注释符删除(默认关闭)  
  function freeBg(){
    var bgObj = document.getElementById('bg-wrap');
    bgObj.parentElement.removeChild(bgObj);
    document.body.style.backgroundImage = "url('https://api.lxzy.ml/newest.php')";      //修改为你想要的背景图地址，修改url('')单引号中的内容即可
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center center';
  }                                                                   
  freeBg();                                                           //自由更改背景图函数:如果需要关闭该功能请在该行开头添加双斜线注释符(默认开启)
}

