// ==UserScript==
// @name         鼠标的小跟班
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  给鼠标加个小跟班
// @author       Zz
// @include      *://www.baidu.com*
// @include      *://*.*.**
// @include      *://http://news.baidu.com/*
// @include      *://*.baidu.com/s_*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470216/%E9%BC%A0%E6%A0%87%E7%9A%84%E5%B0%8F%E8%B7%9F%E7%8F%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/470216/%E9%BC%A0%E6%A0%87%E7%9A%84%E5%B0%8F%E8%B7%9F%E7%8F%AD.meta.js
// ==/UserScript==
(function() {
    'use strict';
    $("#su").val("点小胖猪");
    $('.index-logo-src').attr('src','https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.huabanimg.com%2F7768c3dafa9b06eb1b17ad4bb77037921f0880bf7969e-sepkcL_fw658&refer=http%3A%2F%2Fhbimg.huabanimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652250050&t=0be29e0a94f6b8e238a98601d7d7c038')
    const seat={
        x:'',
        y:''
    }
    const img="<img id='angelImg' src='https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fc9c7b07ac70b55c006bb29177b2f6e36d1ee306f17132-yTgfV0_fw658&refer=http%3A%2F%2Fhbimg.b0.upaiyun.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652180616&t=aeb19e04f27219dd1c40584319a4f5de'/>"
    const body=$('body')
    body.append(img)
    body.css({
        //overflow:'hidden'
    })
     $('#angelImg').css({
         position:'fixed',
         zIndex:99999
    })
    let timer=null
    window.addEventListener('mousemove',e=>{
       e.stopPropagation()
       timer=setTimeout(()=>{
           console.log(123)
           clearTimeout(timer)
           seat.x=e.clientX;
           seat.y=e.clientY
           $('#angelImg').css({
               top:seat.y+5,
               left:seat.x+5,
           })
       },16)
       
    })

//zIndex:9999999999999
  // @match       https://www.baidu.com/
// @match      https://image.baidu.com/

})();
