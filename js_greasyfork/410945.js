// ==UserScript==
// @name         老司机小说自动翻页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       ta
// @match        *://www.yulinzhanye.xyz/*
// @match       *://www.lsjxs.cc/*
// @match       *://www.biquge.info/*
// @grant        none
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/410945/%E8%80%81%E5%8F%B8%E6%9C%BA%E5%B0%8F%E8%AF%B4%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/410945/%E8%80%81%E5%8F%B8%E6%9C%BA%E5%B0%8F%E8%AF%B4%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==


(function() {

    $(window).scroll(function() {
        if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
            console.log("滚动条已经到达底部为" + $(document).scrollTop());
            var hrefStr = window.location.href
            if(hrefStr.indexOf('biquge')>0){
                autoPage()
            }else{
                console.log()
                tr()
            }
        }

    })

    function autoPage(){
        var st = $($('.bottem a')[3]).attr('href')
        getcontent1(st)
    }

    function getcontent1(url){
        $.ajax({
            type:'get',
            url:url,
            success:function(body,heads,status){
                var bot = $(body)
                $('.bottem').html(bot.find('.bottem'))
                $('#content').append(bot.find('#content').html());  //body就是内容了，也就是url网页中du的内容
            }
        });
    }

    function tr(){
        var leng = $('.chapterPages a').length
        var cur =  $('.chapterPages .curr').text().replace('【','').replace('】','')
        var ahref = ''
        if(cur < leng){
            ahref = $($('.chapterPages a')[cur]).attr('href')
        }
        if(cur == leng){
            ahref = $('.bd .next').attr('href')
        }

        getcontent(ahref)
    }
    function getcontent(url){

        $.ajax({
            type:'get',
            url:url,//这里是baiurl
            success:function(body,heads,status){
                var bot = $(body)
                $('.chapterPages').html(bot.find('.chapterPages'))
                $('.page-control .bd').html(bot.find('.page-control .bd'))
                $('.page-content p').append(bot.find('.page-content p').html())
            }
        });
    }
})();

