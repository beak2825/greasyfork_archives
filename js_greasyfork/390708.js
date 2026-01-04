// ==UserScript==
// @name         微博头条免关注自动查看全文
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  ~~~~啦啦啦
// @author       You
// @grant        none
// @match        http*://card.weibo.com/article/*
// @match        http*://weibo.com/ttarticle/*
// @connect      weibo.com
// @connect      card.weibo.com
// @downloadURL https://update.greasyfork.org/scripts/390708/%E5%BE%AE%E5%8D%9A%E5%A4%B4%E6%9D%A1%E5%85%8D%E5%85%B3%E6%B3%A8%E8%87%AA%E5%8A%A8%E6%9F%A5%E7%9C%8B%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/390708/%E5%BE%AE%E5%8D%9A%E5%A4%B4%E6%9D%A1%E5%85%8D%E5%85%B3%E6%B3%A8%E8%87%AA%E5%8A%A8%E6%9F%A5%E7%9C%8B%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function show_all(see_more_button,article_box){
        if(see_more_buttom && see_more_buttom.length==1 ){
               see_more_buttom[0].remove();
        }
        if (article_box && article_box.length==1){
            article_box[0].style.overflow='';
            article_box[0].style.height='';
            // 微博JS 控制了 元素高度与展示 重新覆盖
            for(var i =1;i<10;i++){
                setTimeout(function(){
                    show_all(see_more_button,article_box);
                },500 *i);
            }
        }
    }

    // card.weibo.com
    var see_more_buttom = document.getElementsByClassName('f-art-opt'); // 查看更多按钮
    var article_box = document.getElementsByClassName('f-art'); //文章视图
     show_all(see_more_buttom,article_box);
    //weibo.com/ttarticle
    see_more_buttom = document.getElementsByClassName('artical_add_box'); // 查看更多按钮
    article_box = document.getElementsByClassName('WB_editor_iframe_new'); //文章视图
 
     show_all(see_more_buttom,article_box);
})();