// ==UserScript==
// @name        浏览javbus.co
// @namespace   Violentmonkey Scripts
// @match       https://www.javbus.co/*

// @include     https://www.javbus.com/*
// @include     https://www.javbus2.com/*
// @include     https://www.javbus3.com/*
// @include     https://www.javbus5.com/*
// @include     https://www.javbus7.com/*
// @include     https://www.javbus.me/*
// @include     http*://www.javbus.com/*
// @include     http*://www.seedmm.in/*
// @include     http*://www.seedmm.us/*
// @include     http*://www.busjav.us/*
// @include     http*://www.dmmbus.us/*

// @grant       none
// @version     1.03
// @author      Bemarvin
// @description 2020/2/14 下午1:22:18
// @downloadURL https://update.greasyfork.org/scripts/396413/%E6%B5%8F%E8%A7%88javbusco.user.js
// @updateURL https://update.greasyfork.org/scripts/396413/%E6%B5%8F%E8%A7%88javbusco.meta.js
// ==/UserScript==
(
  function(){
    swapDom();
    windowAddMouseWheel();
    
    function windowAddMouseWheel() {
    var scrollFunc = function (e) {
        e = e || window.event;
        if (e.wheelDelta && document.querySelector("body > div.mfp-bg.mfp-with-zoom.mfp-img-mobile.mfp-ready")) {  //判断浏览器IE，谷歌滑轮事件
            if (e.wheelDelta > 0) { //当滑轮向上滚动时
                //alert("滑轮向上滚动");
              document.querySelector("body > div.mfp-wrap.mfp-gallery.mfp-auto-cursor.mfp-with-zoom.mfp-img-mobile.mfp-ready > div > button.mfp-arrow.mfp-arrow-left.mfp-prevent-close").click();
            }
            if (e.wheelDelta < 0) { //当滑轮向下滚动时
                //alert("滑轮向下滚动");
              document.querySelector("body > div.mfp-wrap.mfp-gallery.mfp-auto-cursor.mfp-with-zoom.mfp-img-mobile.mfp-ready > div > button.mfp-arrow.mfp-arrow-right.mfp-prevent-close").click();
            }
        } else if (e.detail) {  //Firefox滑轮事件
            if (e.detail> 0) { //当滑轮向上滚动时
                //alert("滑轮向上滚动");
              document.querySelector("body > div.mfp-wrap.mfp-gallery.mfp-auto-cursor.mfp-with-zoom.mfp-img-mobile.mfp-ready > div > button.mfp-arrow.mfp-arrow-left.mfp-prevent-close").click();
            }
            if (e.detail< 0) { //当滑轮向下滚动时
                //alert("滑轮向下滚动");
              document.querySelector("body > div.mfp-wrap.mfp-gallery.mfp-auto-cursor.mfp-with-zoom.mfp-img-mobile.mfp-ready > div > button.mfp-arrow.mfp-arrow-right.mfp-prevent-close").click();
            }
        }
    };
    //给页面绑定滑轮滚动事件
    if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', scrollFunc, false);
    }
//滚动滑轮触发scrollFunc方法
    window.onmousewheel  = scrollFunc;//= document.onmousewheel
}
    function swapDom(){
      var content = document.querySelector("#sample-waterfall");
      var parent = content.parentNode;
      parent.insertBefore(content, parent.firstChild);
      parent.insertBefore(document.querySelector("body > div.container > h4:nth-child(10)"), parent.firstChild);
      parent.insertBefore(document.querySelector("body > div.container > div.row.movie"), parent.firstChild);
      parent.insertBefore(document.querySelector("body > div.container > h3"), parent.firstChild);
      
      
      /*samplePic = document.querySelector("#sample-waterfall");
      stardiv = document.querySelector("body > div.container > div:nth-child(7)");document.querySelector("#star-div");
      let temp = stardiv.innerHTML;
      stardiv.innerHTML = samplePic.innerHTML;
      samplePic.innerHTML = temp;*/
    }
    
  }
)()