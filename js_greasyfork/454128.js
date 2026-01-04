// ==UserScript==
// @name         干掉知乎头部广告
// @namespace    http://tampermonkey.net/
// @version      0.32
// @description  干掉知乎头部广告,如果网站版本更新了,那css名字可能会发生变化,脚本就失效了
// @author       mingchen3398
// @match        *://*.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @require     https://cdn.staticfile.org/jquery/3.6.1/jquery.min.js
// @license      MIT
// @supportURL   https://space.bilibili.com/86906776

// @downloadURL https://update.greasyfork.org/scripts/454128/%E5%B9%B2%E6%8E%89%E7%9F%A5%E4%B9%8E%E5%A4%B4%E9%83%A8%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/454128/%E5%B9%B2%E6%8E%89%E7%9F%A5%E4%B9%8E%E5%A4%B4%E9%83%A8%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var css = '.Topstory div'

    var cssArr = [['css-1vfyjeh','css-1x8hcdw'],['css-1pxivs0','css-1x8hcdw'],['css-11e2zdz','css-12n8klz'],['css-v1juu7','css-11bw1mm'],['css-rf6mh0','css-3q84jd'],['css-90wyh8','css-1m60na'],['css-1iyiq0j','css-1m60na']]

    function removeZhihuAD() {
        cssArr.forEach(i=>{
            $(`.${i[0]}`) && $(`.${i[0]}`).removeClass(i[0]).addClass(i[1])
        })
        $(css) && $(css).first().hide()
    }

    function throttle(fn, delay = 100) {
        let timer = null
        return function () {
            if(timer) return
            timer = setTimeout(() => {
                fn.apply(this,arguments)
                timer = null
            })
        }
    }

    try{
        removeZhihuAD()
    }catch(e){
        window.onload = function(){
            removeZhihuAD()
        }
    }

    window.onscroll =throttle(function () {
        removeZhihuAD()
        var t = document.documentElement.scrollTop || document.body.scrollTop;
        if (t === 0) {
            setTimeout(() => {
                removeZhihuAD()
            }, 80)
        }
    })


})();