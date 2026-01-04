// ==UserScript==
// @name         媒体平台自动分类图片-宠物
// @namespace    http://tampermonkey.net/
// @version      05
// @description  try to take over the world!
// @author       You
// @match        http://mp.sina.com.cn/article?type=send&vt=4
// @match        https://om.qq.com/article/articlePublish
// @match        http://mp.163.com/article/postpage/*
// @match        http://mp.toutiao.com/preview_article/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33027/%E5%AA%92%E4%BD%93%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%88%86%E7%B1%BB%E5%9B%BE%E7%89%87-%E5%AE%A0%E7%89%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/33027/%E5%AA%92%E4%BD%93%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%88%86%E7%B1%BB%E5%9B%BE%E7%89%87-%E5%AE%A0%E7%89%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if (location.hostname === 'mp.sina.com.cn') {
    window.setTimeout(function() { document.getElementsByClassName('editor_next btn_style_red')[0].click();}, 60000);//1分钟后自动点击下一步
    window.setTimeout(function() {$("span[data-oid=21]").click();},70000);//1分钟后自动设置文章类别为宠物
    window.setTimeout(function() {document.getElementsByClassName('editor_next')[0].click();},120000);//2分钟后自动提交文章
    //window.setTimeout(function() {document.getElementsByClassName('C_btn_alert C_btn_confirm')[0].click();},180000);//3分钟后自动关闭发布成功窗口
        }

    if (location.hostname === 'om.qq.com') {
     window.setTimeout(function() {$("label[class=ui-radio][data-id=auto]").click();},60000);//1分钟后设置文章封面为自动
     window.setTimeout(function() {$("div[class=item][data-id=63]").click();},70000);//1分钟后设置文章类别为宠物
     window.setTimeout(function() {document.getElementsByClassName("btn btn-primary")[0].click();},120000);//2分钟后自动提交文章
      window.setTimeout(function() {$('a.layui-layer-btn0').click();},180000);//3分钟后自动再次确认发布文章
    }

    if (location.hostname === 'mp.163.com') {
        window.setTimeout(function() {$("a:contains('动物')").click();},60000); //设置文章主类别为动物
        window.setTimeout(function() {$("a:contains('动物趣闻')").click();},70000);//设置文章次要类别为动物趣闻
        window.setTimeout(function() {$("#cover1").click();},80000);//设置文章封面为自动
        window.setTimeout(function() {document.getElementsByClassName('btn btn-netease btn-lg js_article_submit')[0].click();},120000);//2分钟后自动发布
        window.setTimeout(function() {document.getElementsByClassName('btn btn-netease btn-sm js-btn-ok')[0].click();},180000);//3分钟后自动关闭发布成功窗口
    }

    if (location.hostname === 'mp.yidianzixun.com') {
     window.setTimeout(function() {$("li:contains('其他')").click();},60000);//1分钟后设置文章类别为其他
     window.setTimeout(function() {$("button.btn.btn-publish").click();},120000);//2分钟后自动发布文章。
    }


    if (location.hostname === 'mp.toutiao.com') {
        document.getElementsByClassName("subtitle clearfix")[0].style.display="none";} //隐藏头条文章预览时的作者头像、时间。
        window.setTimeout(function() { {window.opener=null;window.open("","_self"); window.close();}},180000); //3分钟后自动关闭头条文章预览窗口


})();

