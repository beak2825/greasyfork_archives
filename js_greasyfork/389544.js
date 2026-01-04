// ==UserScript==
// @name 斗鱼电影页面直达及直播页面全屏
// @namespace Violentmonkey Scripts
// @description 避免手动点击
// @match https://www.douyu.com/*
// @match https://www.douyu.com/g_yqk
// @grant none
// @run-at       document-end
// @version 0.0.2
// @downloadURL https://update.greasyfork.org/scripts/389544/%E6%96%97%E9%B1%BC%E7%94%B5%E5%BD%B1%E9%A1%B5%E9%9D%A2%E7%9B%B4%E8%BE%BE%E5%8F%8A%E7%9B%B4%E6%92%AD%E9%A1%B5%E9%9D%A2%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/389544/%E6%96%97%E9%B1%BC%E7%94%B5%E5%BD%B1%E9%A1%B5%E9%9D%A2%E7%9B%B4%E8%BE%BE%E5%8F%8A%E7%9B%B4%E6%92%AD%E9%A1%B5%E9%9D%A2%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==
(
    function()
    {
        window.full_screen_clicked = false
        window.full_screen = function()
        {
            if(window.full_screen_clicked == true) return
            else if(document.querySelector('div.wfs-2a8e83') == null) setTimeout('window.full_screen()',1000)
            else
            {
                try
                {
                    document.querySelector('div.wfs-2a8e83').click()
                    document.querySelector('label.layout-Player-asidetoggleButton').click()
                    window.full_screen_clicked = true
                    document.querySelector("#js-player-video-above > div.video-above > div > div.ChargeTask-closeBg.react-draggable").className = "ChargeTask-closeBg react-draggable __web-inspector-hide-shortcut__"
                    //alert('clicked')
                }
                catch(e)
                {
                    setTimeout('window.full_screen()',1000)
                }
            }
        }
        window.click_movie = function()
        {
            if(document.querySelector("#listAll > div.layout-Module-head.ListHeader--customer > div.ListHeader-pop > ul > li:nth-child(1)") == null)
            {
                setTimeout("window.click_movie()",500);
            }
            else{
                document.querySelector("#listAll > div.layout-Module-head.ListHeader--customer > div.ListHeader-pop > ul > li:nth-child(1)").click();
            }
        }
        //alert(window.location.href)
        if(window.location.href == "https://www.douyu.com/g_yqk")
        {
            //document.querySelector('section.layout-Customize').style = 'display: none'
            setTimeout("window.click_movie()",500)
            //document.querySelector("#listAll > div.layout-Module-head.ListHeader--customer > div.ListHeader-pop > ul > li:nth-child(1)").click();
        }
        else{
            window.full_screen();
        }
    }
)
()