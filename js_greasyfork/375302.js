// ==UserScript==
// @name         看雪论坛优化显示自动签到+吾爱签到
// @description  看雪自动签到 + 移除久远的置顶主题+ 新帖标记显示+52pojie自动签到  
// @namespace    https://greasyfork.org/zh-CN/users/78403
// @version      2020.8.31
// @author       金社郎君
// @icon         https://www.pediy.com//favicon.ico
// @match        https://bbs.pediy.com/*
// @match        https://www.52pojie.cn/*
// @grant		GM_setValue
// @grant		GM_getValue
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @run-at 		document-end
// @downloadURL https://update.greasyfork.org/scripts/375302/%E7%9C%8B%E9%9B%AA%E8%AE%BA%E5%9D%9B%E4%BC%98%E5%8C%96%E6%98%BE%E7%A4%BA%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%2B%E5%90%BE%E7%88%B1%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/375302/%E7%9C%8B%E9%9B%AA%E8%AE%BA%E5%9D%9B%E4%BC%98%E5%8C%96%E6%98%BE%E7%A4%BA%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%2B%E5%90%BE%E7%88%B1%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function ()
{
    if (window.location.href.includes(".52pojie.cn"))
    {
        if (GetTimeINT() > 10)
        {
            q签到_52pojie();
        }
        $('.bml').remove();
        return;
    }
    if (GetTimeINT() > 10)
    {
        q签到_pediy();
    }
    $('.thread.top_1').each(zd置顶贴检测移除);
    $('.thread.top_2').each(zd置顶贴检测移除);
    $('.thread.top_3').each(zd置顶贴检测移除);

    //if (window.location.href.includes("/new-tid.htm"))   return;

    function zd置顶贴检测移除(i, item)
    {
        let timeSpan = $(this).find("span.date");
        if (timeSpan)
        {
            var timestr = timeSpan.html();
            if (!timestr)
            {
            }
            else if (timestr.includes("小时前") ||
                timestr.includes("分钟前"))
            {
            }
            else
            {
                $(this).remove();
            }
        }
    }
    $('.thread').each(function (i, item)
    {
        let timeSpan = $(this).find("span.date");
        if (timeSpan)
        {
            var timestr = timeSpan.html();
            if (!timestr)
            {
            }
            else if (timestr.includes("小时前") ||
                timestr.includes("分钟前"))
            {
                $(this).css({ "color": "blue", "border": "2px solid blue" });
            }
        }
    });
    function q签到_pediy()
    {
        var curday = new Date().toLocaleDateString();
        if (curday == localStorage.flag签到)
        {
        }
        else
        {
            $.post('user-signin.htm', function (code, message)
            {
                console.log("pediy 执行签到返回", code, message);
                localStorage.flag签到 = curday;
            });
        }
    }
    function GetTimeINT()
    {
        var curday = new Date();
        return curday.getHours() * 100 + curday.getMinutes();
    }
    function q签到_52pojie()
    {
        var curday = new Date().toLocaleDateString();
        if (curday == localStorage.flag签到)
        {
        }
        else
        {
            $.get("home.php?mod=task&do=apply&id=2", function (html, code)
            {
                if (html.includes("任务已完成"))
                {
                    console.log("52pojie 签到成功");
                }
                else if (html.includes("您已申请过此任务"))
                {
                    console.log("52pojie 已经签过");
                }
                else
                {
                    alert("签到发生错误.但我今天不会再签了");
                }
            });
        }
        localStorage.flag签到 = curday;
    }
})();

