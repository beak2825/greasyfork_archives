// ==UserScript==
// @name         百度美化
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  让百度首页好看一点
// @author       luosansui
// @match        https://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435840/%E7%99%BE%E5%BA%A6%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/435840/%E7%99%BE%E5%BA%A6%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //百度
    document.styleSheets[0].insertRule("body::-webkit-scrollbar {display:none;}", 0);
    function bc(){
        const skin = 'background-color:rgb(64, 64, 64);background-image:url("https://pc-index-skin.cdn.bcebos.com/dbca01a37ec03453deafb221e97d1415.jpg?x-bce-process=image/crop,x_384,y_144,w_2064,h_1288");'
        //document.querySelector('.s-skin-container').style.cssText
        document.body.style.cssText = skin
        document.body.style.backgroundAttachment = 'fixed'
        document.querySelector('#wrapper').style.backgroundColor = 'rgba(255,255,255,0.8)'
        document.styleSheets[0].insertRule("#head {background:none !important;}", 0);
        document.querySelector('#page').style.background = 'none'
        document.querySelector('#foot').style.background = 'none'
    }
    //百度主页
    if(window.location.pathname === '/'){
        let head_wrapper = document.querySelector('#head_wrapper');
        head_wrapper.style.height = '100%';
        head_wrapper.style.maxHeight = '560px';
        head_wrapper.style.paddingBottom = '0';
        let kw = document.querySelector('#kw')
        document.querySelector('#bottom_layer').style.display = 'none';
        kw.style.background = 'rgba(255,255,255,0.8)'
        document.styleSheets[0].insertRule(".bdsugbg {background:rgba(255,255,255,0.8) !important;top:42px !important;}", 0);
        document.styleSheets[0].insertRule(".bdsugbg>ul {border-top:none !important;}", 0);
        let flagClick = false
        kw.addEventListener("click",function(){
             document.styleSheets[0].insertRule("#kw{border-bottom:none !important;border-radius:10px 0 0 0 !important;}", 0);
            flagClick = true
        });
        kw.addEventListener("blur",function(){
            if(flagClick){
             document.styleSheets[0].deleteRule(0)
            }
        });
        let i = setInterval(function(){
                if(document.body.link === "#0000cc"){
                    kw.style.cssText = ''
                }
                if(document.querySelector('#foot')){
                    clearInterval(i)
                    bc()
                }
        },100)
        let count = 0;
        //img超链接
        let i3 = setInterval(function(){
            if(count > 9){
                clearInterval(i3)
                return
            }
            document.querySelector('#s_lg_img').src = 'https://i0.hdslb.com/bfs/archive/771bd6d35c782a31565675f6d04f00fa1c48d0b9.png'
            count++;
        },100)
        document.querySelector('#s_mp>area').href = 'https://www.bilibili.com/'
        //图标
        let i5 = setInterval(function(){
               if(document.querySelector('.soutu-btn')){
                   clearInterval(i5)
                   document.querySelector('.soutu-btn').style.backgroundColor = 'rgba(255,255,255,0)'
               }
         },100)

    }else if(window.location.pathname === '/s'){
     //百度搜索页
        bc()
    }
    // Your code here...
})();