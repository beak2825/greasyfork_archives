// ==UserScript==
// @name         新闻网图片透明度0.1
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  baidu,qq,sohu,zhihu,douban网站图片默认透明度0.1，方便摸鱼
// @author       winner800
// @license MIT
// @match        https://new.qq.com/*
// @include      *://new.qq.com/*
// @include      *://baijiahao.baidu.com/*
// @include      *://baijiahao.baidu.com/*
// @include      *://jingyan.baidu.com/article/*
// @include      *://*.baidu.com/*
// @include      *://www.sohu.com/a/*
// @include      *.zhihu.com/*
// @include      *movie.douban.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/450119/%E6%96%B0%E9%97%BB%E7%BD%91%E5%9B%BE%E7%89%87%E9%80%8F%E6%98%8E%E5%BA%A601.user.js
// @updateURL https://update.greasyfork.org/scripts/450119/%E6%96%B0%E9%97%BB%E7%BD%91%E5%9B%BE%E7%89%87%E9%80%8F%E6%98%8E%E5%BA%A601.meta.js
// ==/UserScript==
/**
   * example:
   * addNewStyle('.box {height: 100px !important;}')
   *
   * @param {*} newStyle string
   */
function addNewStyle(newStyle) {
    var styleElement = document.getElementById('styles_js')

    if (!styleElement) {
        styleElement = document.createElement('style')
        styleElement.type = 'text/css'
        styleElement.id = 'styles_js'
        document.getElementsByTagName('head')[0].appendChild(styleElement)
    }

    styleElement.appendChild(document.createTextNode(newStyle))
}
addNewStyle(`.opacity1 {opacity:1!important;}`);
(function() {
    'use strict';
    //目标dom元素
    var targetDomStr = 'img,.videoPlayer';

    var _style = document.createElement('style');
    _style.innerHTML = `${targetDomStr} {opacity:0.1}`;
    document.body.appendChild(_style);


    //    $(targetDomStr).css('opacity','0.1');

    //鼠标触摸清除透明度
    document.addEventListener('mouseover',function(){
        document.querySelectorAll(targetDomStr).forEach(function(item, index){
            item.onmouseover=function(){
                this.style.opacity= '1';
            }
            item.onmouseout=function(){
                this.style.opacity= '0.1';
            }
        })
    });
    //双击取消透明度效果
    document.addEventListener('dblclick',function(){
        var _style = document.createElement('style');
        _style.innerHTML = `${targetDomStr} {opacity:1!important;}`;
        document.body.appendChild(_style);
    });

    //单击图片透明度1
    $('img').on('click',function(){
        $(this).addClass('opacity1');
    });
})();