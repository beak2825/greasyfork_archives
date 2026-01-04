// ==UserScript==
// @name         龙空-新浪百度图床修正
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在优书网后面增加一个按钮，点击直接加载新浪百度图床图片
// @author       SingHill
// @match        *://lkong.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387867/%E9%BE%99%E7%A9%BA-%E6%96%B0%E6%B5%AA%E7%99%BE%E5%BA%A6%E5%9B%BE%E5%BA%8A%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/387867/%E9%BE%99%E7%A9%BA-%E6%96%B0%E6%B5%AA%E7%99%BE%E5%BA%A6%E5%9B%BE%E5%BA%8A%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==


function setreferrerpolicy(){
    button='<button style="margin-top:5px" onclick="set();">点击加载图片</button>';
    html='<script type="text/javascript">var i;function set(){var link;$("img").each( (i,obj) => {var o = $(obj);if( o.attr("src").indexOf("sinaimg") > 0 ){link = o.attr("src");o.attr("referrerpolicy","no-referrer");o.attr("src",link);}if( o.attr("src").indexOf("baidu") > 0 ){link = o.attr("src");o.attr("referrerpolicy","no-referrer");o.attr("src",link);}});}</script>';
    $('.header-nav').after(button);
    $('.header-nav').append(html);


}
var html;var button;

setTimeout(setreferrerpolicy, 100);
