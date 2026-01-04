// ==UserScript==
// @name        百度搜索结果排版优化
// @namespace    https://zhang18.top
// @version      0.4
// @description  都不知道百度UI是怎么设计的，丑得一批，做做简单优化，仿谷歌优化排版，清爽明了
// @author       ZLOE
// @match       https://www.baidu.com/s?wd=*
// @match       https://www.baidu.com/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/372744/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%8E%92%E7%89%88%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/372744/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%8E%92%E7%89%88%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //移除侧栏
    $(".cr-offset").remove()
    //调整搜索结果
    $(".result").css({'margin-bottom':"25px",'font-family':'arial,sans-serif',"font-size":"14px",})
    //移除奇丑图片
    $(".result .c-span6").remove()
    //隐藏链接下的横线,调整链接样式
    $("h3.t a").css({'text-decoration':'none'})
    $("h3.t a em").css({'color':'#00c','text-decoration':'none'})
    //调整url位置
    $('.c-showurl').css({'position':'relative','top':'0px','font-size':'small','font-family':'arial,sans-serif'})
    $('h3.t').css({'margin-bottom':"4px"})
    //移除评价
   $(".c-tools").remove()
   $(".f13 a.m").remove()
    //修改字体
    $('.c-abstract').css({'font-size':'small','font-family':'arial,sans-serif'})
    $('.c-icons-inner').remove()
    //调整头部
    $('input#su').val('搜索一下！')
    $('.toindex').remove()
    $('#imsg').remove()
    $('.nums').remove()
    var logo = 'http://thyrsi.com/t6/378/1538361086x1822611437.png'
    //修改logo
    $('.index-logo-src').attr('src',logo)
    //修改设置字体
    $('.pf').css({'font-size':'small','font-family':'arial,sans-serif','text-decoration':'none'})
    //修改用户名字体
    $('.username').css({'font-size':'small','font-family':'arial,sans-serif','text-decoration':'none'})
    $('.lb').css({'font-size':'small','font-family':'arial,sans-serif','text-decoration':'none'})
    $('.c-gap-bottom-small').css({'font-size':'small','font-family':'arial,sans-serif'})
    $('.s_form').css({'background-color':'rgb(248, 248, 248)'})
    $('.s_tab_inner').css({'font-size':'small','font-family':'arial,sans-serif'})
    $('.res-queryext-pos').remove()
    $('.c-icon').remove()
    $('#foot').css({'font-size':'small','font-family':'arial,sans-serif','height':'70px'})//,'background-color':'rgb(0, 0, 0)','color':'rgb(255, 255, 255)',})
    $('.foot-inner').remove()
    $('#rs').remove()
    $('#foot').html("<p style='text-align: center;font-size: 20px;line-height: 3.5;color:black;'>@2018-10-1 京ICP备10241024号</p>")
    //为了去除已知Bug,去掉输入框，百度通过ajax提交获取搜索结果，无法刷新整个页面，导致网页被油猴锁死无法提交表单，所以去除
    $('#form').remove()
    //百度百科优化
    $(".c-gap-bottom-small a").css({'font-size':'18px','font-family':'arial,sans-serif'})
    $(".c-span-last").css({'font-size':'small','font-family':'arial,sans-serif'})



    // Your code here...
})();