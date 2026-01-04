// ==UserScript==
// @name         摸鱼神器-网页图片控制
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  打工都是人上人
// @author       csj
// @match       *
// @include     *
// @grant        none
// @require  https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/429115/%E6%91%B8%E9%B1%BC%E7%A5%9E%E5%99%A8-%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/429115/%E6%91%B8%E9%B1%BC%E7%A5%9E%E5%99%A8-%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==
(function() {
    'use strict';

    start()
    var defaultType = true
    var defaultWidth = '50px'
    //图片缩小或放大
    function strongImg(type){
        let imgs = $('img')
        for(let i=0;i<imgs.length;i++){
            const item = imgs[i]
            if((item.offsetHeight < 100 || item.offsetWidth < 100) && type){
                continue;
            }
            item.style.width = type ? defaultWidth : ""
            item.style.height = type ? defaultWidth : ""
        }
        type ? defaultWidth = '50px' : defaultWidth = ''
        console.log(type ? "缩小成功" : "放大成功")
    }

    //控制单个图片
    function controlOne(){
        let imgs = $('img')
        for(let i=0;i<imgs.length;i++){
            const item = imgs[i]
            if(item.offsetHeight < 100 || item.offsetWidth < 100){
                continue;
            }
            $(item).mouseout(function(){
                const img = this
                img.style.width = defaultWidth
                img.style.height = defaultWidth
            })
            $(item).mouseover(function(){
                const img = this
                img.style.width = ''
                img.style.height = ''
            })
        }
    }

    //添加控制按钮
    function start(){
        const button = "<button id='injectStrongImg' style='position: fixed;left: 10px;top: 10px;border: none;z-index: 99999;'>注入</button>"
        $('body').prepend(button)
        $('button#injectStrongImg').click(function(){
            //单个图片绑定单击事件控制
            controlOne()
            strongImg(defaultType);
            defaultType = !defaultType
        })
    }

    //测试更新



})();