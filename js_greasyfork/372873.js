// ==UserScript==
// @name         参谋标记自家
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match       https://sycm.taobao.com/mc/mq/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/372873/%E5%8F%82%E8%B0%8B%E6%A0%87%E8%AE%B0%E8%87%AA%E5%AE%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/372873/%E5%8F%82%E8%B0%8B%E6%A0%87%E8%AE%B0%E8%87%AA%E5%AE%B6.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var styleStr = `

    `;
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = styleStr;
    document.getElementsByTagName('HEAD').item(0).appendChild(style);


    $('body').on('click',function(){
        var CatPoint = 1;
        $(".CatpointCss").remove();
        $(".myheartboom01").removeClass("myheartboom01");
        $(".myheartboom02").removeClass("myheartboom02");
        $(".myheartboom").removeClass("myheartboom");
        $(".mytableboom01").removeClass("mytableboom01");
        $(".wwwaafffaa").remove();
        $(".goodsShopName").each(function(){
            if($(this).text()=="私人空间瓷砖"){
                $(this).addClass("myheartboom01").addClass("myheartboom");
                $(this).parent().parent().parent().parent().addClass("mytableboom01");
                if($(this).next().attr("class")!="wwwaafffaa"){
                    $(this).after("<a class='wwwaafffaa' name='catpo"+CatPoint+"'></a>");
                    //console.log("in"+CatPoint);
                }
                CatPoint++;
            }else if ($(this).text()=="佛山市智凯企业"){
                $(this).addClass("myheartboom02").addClass("myheartboom");
                if($(this).next().attr("class")!="wwwaafffaa"){
                    $(this).after("<a class='wwwaafffaa' name='catpo"+CatPoint+"'></a>");
                }
                CatPoint++;
            }
        });
        var CatPointQ = 1;
        $(".myheartboom").each(function(){
            var mymylink=$(this).parent().prev().find(".mediaObject").attr("src");
            $(".ebase-FaCommonFilter__left").eq(1).append("<a href='#catpo"+CatPointQ+"' class='CatpointCss'><img class='myimgboom' src='"+mymylink+"'></a>");
            CatPointQ++;
        });
    })

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $('a :contains("竞品分析")').css('color','red');
})();
