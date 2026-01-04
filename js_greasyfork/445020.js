// ==UserScript==
// @name         JD去广告商品
// @version      0.4
// @description  去除京东广告商品，广告横幅，推荐位
// @author       云在天
// @match        https://*.jd.com/*
// @icon         https://www.jd.com/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/662979
// @downloadURL https://update.greasyfork.org/scripts/445020/JD%E5%8E%BB%E5%B9%BF%E5%91%8A%E5%95%86%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/445020/JD%E5%8E%BB%E5%B9%BF%E5%91%8A%E5%95%86%E5%93%81.meta.js
// ==/UserScript==
function changeFunc()
{


    var top_Ad = document.getElementById("J_promotional-top");
    if(top_Ad != null)
    {
        top_Ad.parentNode.removeChild(top_Ad);
    }
    var left_Ad = document.getElementsByClassName("fs_act")[0];
    if(left_Ad != null)
    {
        left_Ad.parentNode.removeChild(left_Ad);
    }
    //promo_lk
    var search_Ad = document.getElementsByClassName("promo_lk")[0];
    if(search_Ad != null)
    {
        search_Ad.parentNode.removeChild(search_Ad);
    }
    //logo_scene logo_scene_hide
    var logo_Ad = document.getElementsByClassName("logo_scene logo_scene_hide")[0];
    if(logo_Ad != null)
    {
        logo_Ad.parentNode.removeChild(logo_Ad);
    }
    //J-trigger jdm-toolbar-tab jdm-tbar-tab-qrcode
    var right_down_qrcode = document.getElementsByClassName("J-trigger jdm-toolbar-tab jdm-tbar-tab-qrcode")[0];
    if(right_down_qrcode != null)
    {
        right_down_qrcode.parentNode.removeChild(right_down_qrcode);
    }
    //search_bg
    var search_bg = document.getElementsByClassName("search_bg")[0];
    if(search_bg != null)
    {
        search_bg.parentNode.removeChild(search_bg);
    }
    if($(".bigimg").length>0 && $(".bigimg").attr("src").indexOf("/n0/") > -1)
    {
        $(".bigimg").attr("src", $(".bigimg").attr("src").replace("/n0/","/n12/"));
    }
    $(".zoomImg").each(function(){
        if($(this).attr("src").indexOf("/n0/") > -1)
            $(this).attr("src", $(this).attr("src").replace("/n0/","/n12/"));
    })

    var table = document.getElementsByClassName("gl-warp clearfix");
    if(table.length != 0)
    {
        var list = table[0].getElementsByTagName("li");
        for (var i = 0; i < list.length; i++) {
            var flag = list[i].getElementsByClassName("p-promo-flag")
            if(flag.length != 0)
            {
                if(flag[0].innerHTML == "广告")
                {
                    console.log(flag[0].innerHTML)
                    list[i].parentNode.removeChild(list[i])
                }
            }
        }
    }

    //     var list_flag = document.getElementsByClassName("p-promo-flag");
    //     console.log(list_flag.length)
    //     for (var i = 0; i < list_flag.length; i++) {
    //         var gg = list_flag[i].parentNode.parentNode;
    //         console.log(gg.parentNode.removeChild(gg))
    //     }
}
(function() {
    'use strict';
    changeFunc();
    document.addEventListener('DOMNodeInserted', function() {
        changeFunc();

    }, false);
})();