// ==UserScript==
// @name         店匠详情页获取图片链接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  x
// @author       You
// @match        https://www.picooly.com/products/*
// @icon         https://www.google.com/s2/favicons?domain=picooly.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431990/%E5%BA%97%E5%8C%A0%E8%AF%A6%E6%83%85%E9%A1%B5%E8%8E%B7%E5%8F%96%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/431990/%E5%BA%97%E5%8C%A0%E8%AF%A6%E6%83%85%E9%A1%B5%E8%8E%B7%E5%8F%96%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let is = document.querySelectorAll(".product-image__swiper_img")
    let s = ""
    is.forEach((i)=>{
        if(i==is[0]){
            s += i.src + "\n"
        }else{
            try{
                s += i.dataset.src.replace('\/\/',"https://") + "\n"
            }catch(e){
                console.log(e)
                console.log(i.dataset.src)
            }

        }
    })
    console.log(s)
    let pid = document.querySelector("[id^=product_detail]").dataset.trackId
    console.log(pid)

})();