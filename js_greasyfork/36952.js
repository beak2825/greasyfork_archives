// ==UserScript==
// @name         thu网络学堂助手
// @namespace    exhen_js
// @version      20180102
// @description  增加醒目提醒，分区链接
// @require      http://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js
// @author       Exhen
// @match        http://learn.tsinghua.edu.cn/*
// @match        https://learn.tsinghua.edu.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      learn.tsinghua.edu.cn
// @downloadURL https://update.greasyfork.org/scripts/36952/thu%E7%BD%91%E7%BB%9C%E5%AD%A6%E5%A0%82%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/36952/thu%E7%BD%91%E7%BB%9C%E5%AD%A6%E5%A0%82%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


$(document).ready(function ()
{

    $('.info_tr2').each(function ()
{
    if ($(this).find('td[width="55%"] span').text() == '(新版)')
    {
        // alert('xinban');
        var url = $(this).find('td[width="55%"] a').attr('href').slice(54);
        var link_hw = $('<a></a>'), link_note = $('<a></a>'), link_file = $('<a></a>');
        link_hw.attr('href', 'http://learn.cic.tsinghua.edu.cn/f/student/homework/' + url);
        link_note.attr('href', 'http://learn.cic.tsinghua.edu.cn/f/student/coursenotice/' + url);
        link_file.attr('href', 'http://learn.cic.tsinghua.edu.cn/f/student/courseware/' + url);
    }
    else
    {
        var url = $(this).find('td[width="55%"] a').attr('href').slice(47);
        console.log(url);
        var link_hw = $('<a></a>'), link_note = $('<a></a>'), link_file = $('<a></a>');
        link_hw.attr('href', '/MultiLanguage/lesson/student/hom_wk_brw.jsp' + url);
        link_note.attr('href', '/MultiLanguage/public/bbs/getnoteid_student.jsp' + url);
        link_file.attr('href', '/MultiLanguage/lesson/student/download.jsp' + url);
    }
    $(this).find('.red_text').slice(0, 1).parent().wrapInner(link_hw);
    //alert($(this).find('.red_text').slice(0,1).text());
    $(this).find('.red_text').slice(1, 2).parent().wrapInner(link_note);
    $(this).find('.red_text').slice(2, 3).parent().wrapInner(link_file);
    // console.log(a);
    // a[0].wrap(link);
    // a[1].wrap('<b></b>')
});

$('.info_tr').each(function ()
{
    if ($(this).find('td[width="55%"] span').text() == '(新版)')
    {
        // alert('xinban');
        var url = $(this).find('td[width="55%"] a').attr('href').slice(54);
        var link_hw = $('<a></a>'), link_note = $('<a></a>'), link_file = $('<a></a>');
        link_hw.attr('href', 'http://learn.cic.tsinghua.edu.cn/f/student/homework/' + url);
        link_note.attr('href', 'http://learn.cic.tsinghua.edu.cn/f/student/coursenotice/' + url);
        link_file.attr('href', 'http://learn.cic.tsinghua.edu.cn/f/student/courseware/' + url);
    }
    else
    {
        var url = $(this).find('td[width="55%"] a').attr('href').slice(47);
        console.log(url);
        var link_hw = $('<a></a>'), link_note = $('<a></a>'), link_file = $('<a></a>');
        link_hw.attr('href', '/MultiLanguage/lesson/student/hom_wk_brw.jsp' + url);
        link_note.attr('href', '/MultiLanguage/public/bbs/getnoteid_student.jsp' + url);
        link_file.attr('href', '/MultiLanguage/lesson/student/download.jsp' + url);
    }
    $(this).find('.red_text').slice(0, 1).parent().wrapInner(link_hw);
    //alert($(this).find('.red_text').slice(0,1).text());
    $(this).find('.red_text').slice(1, 2).parent().wrapInner(link_note);
    $(this).find('.red_text').slice(2, 3).parent().wrapInner(link_file);
    // console.log(a);
    // a[0].wrap(link);
    // a[1].wrap('<b></b>')
});
    // $('head').append('<script type="text/javascript" src="http://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>');
    // $('head').append('<script type="text/javascript" src="https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js"></script>');
    $("span.red_text").each(function ()
    {
        if ($(this).text() != 0)
        {
            var size = $(this).text() * 4 + 21;
            //alert(size);
            $(this).attr("style", "font-size:" + String(size) + "px");
            // $(this).wrap('<a href="http://www.baidu.com"></a>');
        }
        else
        {
            $(this).attr("style", "color:black");
        }
    });


});




