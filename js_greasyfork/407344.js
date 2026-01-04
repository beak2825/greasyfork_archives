// ==UserScript==
// @name         bilibili空间粉色透明化
// @namespace    https://github.com/wuxintlh/
// @version      0.1.2.3
// @description  将空间变得更加粉色透明
// @author       桜wuxin
// @match        *://space.bilibili.com/*
// @match        *://www.bilibili.com/*
// @match        https://t.bilibili.com/*
// @grant        none
// @QQgroup      793513923
// @downloadURL https://update.greasyfork.org/scripts/407344/bilibili%E7%A9%BA%E9%97%B4%E7%B2%89%E8%89%B2%E9%80%8F%E6%98%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/407344/bilibili%E7%A9%BA%E9%97%B4%E7%B2%89%E8%89%B2%E9%80%8F%E6%98%8E%E5%8C%96.meta.js
// ==/UserScript==

'use strict';

// Your code here...
function pink(){
    setTimeout(function(){
        var host = window.location.host
        if(host == 'space.bilibili.com'){ //分成两组
            var div = document.querySelectorAll('div');
            for(var i=0;i<div.length;i++){
                div[i].style.backgroundColor = 'rgba(255,192,203, .1)';
                if(div[i].className == 'van-popover van-popper van-popper-vip'|| div[i].className == 'van-popover van-popper van-popper-favorite'||div[i].className == 'van-popover van-popper van-popper-history'
                   ||div[i].className == 'vp-container'){
                    div[i].style.backgroundColor = 'rgba(255,192,203, .8)';
                }else if(div[i].className == 'SakuraDivd'){
                    //跳过
                }
            }
            if(div=document.querySelector('#i-ann-content')){ //将个人空间某处透明化
                div=document.querySelector('#i-ann-content');
                var text = div.querySelector('.be-textarea_inner');
                text.style.background = 'rgba(255,192,103,.1)';
            }
        } else{
            div = document.querySelectorAll('div');
            for(i=0;i<div.length;i++){
                if(div[i].className == 'van-popover van-popper van-popper-vip'|| div[i].className == 'van-popover van-popper van-popper-favorite'||div[i].className == 'van-popover van-popper van-popper-history'
                   ||div[i].className == 'vp-container'){
                    div[i].style.backgroundColor = 'rgba(255,192,203, .8)';
                }else if(div[i].className == 'SakuraDivd'){
                    //跳过
                }
            }
            if(div = document.querySelector('#internationalHeader')){ //将b站主页最上方的盒子透明化
                div = document.querySelector('#internationalHeader').querySelector('.bili-banner');
                div.style.backgroundImage = '';
                div.style.background = 'rgba(255,192,203,.1)';
            }
            if(div = document.querySelector('.footer-wrp')){ //将某些页面最低层变透明
                div = document.querySelector('.footer-wrp');
                div.style.background = 'rgba(0,0,0,0)';
                var father = div.parentNode;
                father.style.background = 'rgba(255,192,203,.1)';
            }
            if(div = document.querySelector('.international-footer')){ //将某些页面最低层变透明
                div = document.querySelector('.international-footer');
                div.style.background = 'rgba(255,192,203,.1)';
            }
        }
    },1000);
    //设定延迟,默认1s
}
pink();//初始化
//设置点击改变透明度
setTimeout(function(){
    if(click = document.querySelector('#navigator')){
        var click = document.querySelector('.n-tab-links');
        click = click.querySelectorAll('span');
        for(var i=0;i<click.length;i++){
            click[i].addEventListener('click',function(){
                pink();
            });
        }
    }
},1000);//个人主页点击时，也能将背景变成粉色透明