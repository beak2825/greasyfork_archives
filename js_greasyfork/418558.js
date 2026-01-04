// ==UserScript==
// @name         yyetslinkdisplayer
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  对人人影视资源下载的在线看一栏加入一键链接复制（复制人人客户端下载链接）
// @author       Callback
// @match        http://got002.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/418558/yyetslinkdisplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/418558/yyetslinkdisplayer.meta.js
// ==/UserScript==

(function() {
    'use strict'
    /*setTimeout(function(){
     $(".btn-toggle-view").click()
    },1000);
    setTimeout(function(){
     $(".btn-toggle-view").click()
    },2000);*/
    //setInterval(function(){
    /*setInterval(function(){
        //$(".tab-side >li >a").each(function(index){$(this).click()})
        $("div[id$='-APP']")
        $(".showlinks2").remove()
        $("ul.down-list[format='APP']").parent().append('<div class="showlinks2"><a class="btn btn-default rrsharer" style="transition: background-color 0.3s ease 0s; border-color: rgba(0, 0, 0, 0.35); background-color: rgb(193, 230, 198);">复制以上人人下载链接</a></div>')

        $("a.rrsharer").click(function(){
            let links = []
            //根据同胞元素找到对应的需要copy的链接
            $(this).parent().siblings("ul.down-list[format='APP']").find("a[class='btn rrdown btn-download']").each(function(){
                links.push($(this).attr('data-url'))
            })
            GM_setClipboard(links.join('\n'), 'text')
            alert('Copy Success!')
        })
    }, 500);*/
    function displaylink() {
            $("div[id$='-APP']")
            $(".showlinks2").remove()
            $("ul.down-list[format='APP']").parent().append('<div class="showlinks2"><a class="btn btn-default rrsharer" style="transition: background-color 0.3s ease 0s; border-color: rgba(0, 0, 0, 0.35); background-color: rgb(193, 230, 198);">复制以上人人下载链接</a></div>')

            $("a.rrsharer").click(function(){
                let links = []
                //根据同胞元素找到对应的需要copy的链接
                $(this).parent().siblings("ul.down-list[format='APP']").find("a[class='btn rrdown btn-download']").each(function(){
                    links.push($(this).attr('data-url'))
                })
                GM_setClipboard(links.join('\n'), 'text')
                alert('Copy Success!')
            })

    }
    //这个方法使用无效    $(document).ready(function () {

    //setTimeout(function(){
    window.onload=function(){
        displaylink();
        $(".tab-side >li >a").click(function(){
            //$(".tab-side >li >a").each(function(index){$(this).click()})
            displaylink();
        })}
    //}, 1000);

    setTimeout(function(){
        displaylink();
        $(".tab-side >li >a").click(function(){
            //$(".tab-side >li >a").each(function(index){$(this).click()})
            displaylink();
        })
    }, 3000);
})()