// ==UserScript==
// @name         简书、CSDN、掘金等网页文章——宽屏看代码舒适版
// @namespace    http://tampermonkey.net/
// @version      0.4.4
// @description  没什么可说的，就是幸福你我他
// @author       Wangshengsheng
// @include        *://www.jianshu.com*
// @include        *://*.*.jianshu.com*
// @include        *://blog.csdn.net*
// @include        *://*.csdn.com*
// @include        *://ke.qq.com*
// @include        *://mp.weixin.qq.com*
// @include        *://juejin.cn*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404113/%E7%AE%80%E4%B9%A6%E3%80%81CSDN%E3%80%81%E6%8E%98%E9%87%91%E7%AD%89%E7%BD%91%E9%A1%B5%E6%96%87%E7%AB%A0%E2%80%94%E2%80%94%E5%AE%BD%E5%B1%8F%E7%9C%8B%E4%BB%A3%E7%A0%81%E8%88%92%E9%80%82%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/404113/%E7%AE%80%E4%B9%A6%E3%80%81CSDN%E3%80%81%E6%8E%98%E9%87%91%E7%AD%89%E7%BD%91%E9%A1%B5%E6%96%87%E7%AB%A0%E2%80%94%E2%80%94%E5%AE%BD%E5%B1%8F%E7%9C%8B%E4%BB%A3%E7%A0%81%E8%88%92%E9%80%82%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.info("脚本已生效");
    var currentUrl = window.location.href;
    var totalWidth = window.innerWidth;
    var contentWidth = totalWidth - 350;
	
	// rem和px互转工具
    function convertRemPx(value, mode) {
        // 获取根元素font-size大小
        const htmlFontSize = window.getComputedStyle(
            document.documentElement,
        ).fontSize;

        if (mode === "rem") {
            // 转rem
            return `${value / parseFloat(htmlFontSize)}`;
        } else if (mode === "px") {
            // 转px
            return `${value * parseFloat(htmlFontSize)}`;
        } else {
            console.error("参数错误！");
        }
    }
	

    // 1、CSDN页面
    if (currentUrl.indexOf("csdn.net") != -1) {
        //  $("#content_views").css("width",contentWidth + "px") ;
        $(".blog-content-box").css("width", contentWidth + "px");
        $(".blog_container_aside").css("display", "none");
        $(".mys-wrapper").css("display", "none");
        $("#rightAside").css("display", "none");
        $(".blog_container_aside").css("display", "none");
        $(".csdn-side-toolbar ").css("display", "none");
        $(".left-toolbox").css("display", "none");
        $(".justify-content-center")[0].style.setProperty("justify-content", "left", "important");
        setTimeout(function () {
            $(".csdn-side-toolbar")[0].style.setProperty("left", "");
            $(".csdn-side-toolbar")[0].style.setProperty("right", "45px", "important");
        }, 2000);
    }

    // 2、简书页面
    if (currentUrl.indexOf("jianshu.com") != -1) {
        $("._2OwGUo").css("display", "none");
        $("._gp-ck").css("width", contentWidth + "px");
        $("._3Pnjry").css("display", "none");
    }

     // 3、腾讯课堂去漂浮的“xxx正在观看视频”弹幕
    if (currentUrl.indexOf("ke.qq.com/webcourse") != -1) {
         setInterval(function(){
	    $("txpdiv[class^='player-inject']").css("display", "none");
	},200)
    }
    
    // 4、微信公众号页面
    if (currentUrl.indexOf("mp.weixin.qq") != -1) {
        $(".qr_code_pc ").css("display", "none");
        $(".pages_skin_pc.wx_wap_desktop_fontsize_2 .rich_media_area_primary_inner").css("max-width",contentWidth + "px");
        $("..pages_skin_pc.wx_wap_desktop_fontsize_2 .rich_media_area_extra_inner").css("max-width",contentWidth + "px");
    }
	
	// 5.掘金
     if (currentUrl.indexOf("juejin.cn") != -1) {
         const pxVal = convertRemPx(7, "px");
        //  console.log("我是掘金..............",  typeof(Number(pxVal)) );

         setTimeout(function () {
            $(".main-container").css("max-width", (totalWidth -30 -pxVal )  + "px");
            $(".main-container").css("margin-left", Number(pxVal) + "px");
            $(".main-area").css("width", "78%");
            $(".sidebar").css("width", "20%");
        }, 2000);


     }


})();