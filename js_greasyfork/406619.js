// ==UserScript==
// @name         A岛-PLUS adnmb
// @namespace    adplus_ccq
// @version      0.6.5
// @description  夜间模式,显示当前Cookie,Po主变色等
// @author       ccq
// @match        https://adnmb*.com/t/*
// @match        https://adnmb*.com/f/*
// @include        http*://adnmb*.com/*
// @match        https://adnmb.com/
// @match        https://adnmb*.com/Member/User/Cookie/index.html
// @match        https://adnmb3.com/t/*
// @match        https://adnmb3.com/f/*
// @match        https://adnmb3.com/Forum
// @match        https://adnmb3.com/Member/User/Cookie/index.html
// @grant GM_setValue
// @grant GM_getValue
// @note         https://github.com/chucongqing/greasy_scripts/edit/master/adplus.js
// @downloadURL https://update.greasyfork.org/scripts/406619/A%E5%B2%9B-PLUS%20adnmb.user.js
// @updateURL https://update.greasyfork.org/scripts/406619/A%E5%B2%9B-PLUS%20adnmb.meta.js
// ==/UserScript==
'use strict';

var darkCfg ={
    bodyBg:'#1d1f21',
    textAreaBg: '#282a2e',
    fontColor: '#c5c8c6',
    centreBg: '#2B2B2B',
    threadPoBg:'#323237' //"#3A3A42"

}

var defaultCfg = {

}

const Theme = {
    Default : 0,
    Dark : 1
}

let theme = Theme.Default



function dark_mode(){
    var config = darkCfg
    var cfg = {}
    cfg.html_bg = config.bodyBg
    cfg.html_color = config.fontColor
    cfg.h_threads_item_bg =  config.bodyBg // $('.h-threads-item').css("background",config.bodyBg)
    cfg.h_threads_content_color = config.fontColor//$('.h-threads-content').css("color",config.fontColor)
    cfg.htirm_bg = config.centreBg //$(".h-threads-item-reply-main").css("background",config.centreBg)
    cfg.hpft_bg = config.bodyBg //$('.h-post-form-title').css("background",config.bodyBg)
    cfg.ht_color =config.fontColor // $(".h-title").css("color",config.fontColor)
    cfg.left_menu_bg = config.bodyBg
    cfg.left_menu_font = "grey"
    setcss(cfg)
}

function default_mode() {
    setcss(defaultCfg)
}

function setcss(config){
 $('html').css("background",config.html_bg)
    $('html').css("color",config.html_color)
    $('.h-threads-item').css("background",config.h_threads_item_bg)
    $('.h-threads-content').css("color",config.h_threads_content_color)
    $(".h-threads-item-reply-main").css("background",config.htirm_bg)
    $('.h-post-form-title').css("background",config.hpft_bg)
    $(".h-title").css("color",config.hpft_bg)
   // $('.h-ref-view').css("background",config.centreBg)
   // $("#h-ref-view").css("background",config.h_threads_item_bg)
    $("font[color='#789922']").filter(function () {
            return /^((>>No\.)|(>>)|(>))\d+$/.test($(this).text());
        })
        .on("mouseenter",(e)=>{
        console.log("hello")
        let intv = setInterval(()=>{
         $("#h-ref-view").find(".h-threads-item-reply-main").css("background",config.htirm_bg)
        $("#h-ref-view").find(".h-threads-content").css("color",config.h_threads_content_color)
        $("#h-ref-view").find(".h-threads-item").css("background",config.h_threads_item_bg)
        },100)

        setTimeout( ()=>{
            clearInterval(intv)
        }, 500)

    })

    //left menu bar
    $("#h-menu").css("background",config.left_menu_bg)
    $("#h-menu a").css("color", config.left_menu_font)
    $("#h-bottom-nav").css("background",config.left_menu_bg)
    $('#h-bottom-nav a').css('color', config.left_menu_font)

}

function t_func() {
     // Your code here...
    let mainThread = $(".h-threads-item-main")
    let poerId = mainThread.find(".h-threads-info-uid").text();
    console.log(`poerId > ${poerId}`)

    let replys = $(".h-threads-item-reply")

    for(let i = 0; i < replys.length; i++){
        var reply = $(replys[i])
        var repId = reply.find(".h-threads-info-uid").text()
        if(repId === poerId){
            //reply.css("background-color","#55ee66")
            let color = ""
            if(theme === Theme.Dark)
            {
                color= darkCfg.threadPoBg
            }
            else{
                color = "rgb(255,237,191)"
            }
            reply.find(".h-threads-item-reply-main").css("background",color)
        }
    }

    $(".h-threads-info-id").css("font-size","19px")
}

function f_func() {
    var cl = $(".h-threads-list")
    var d = cl.children("div")
    console.log("begin replace reply " + `d length = ${d.length}`)
    for(var i = 0 ; i < d.length; i++ ) {
        var aa = $(d[i])
        //console.log(`id = ${ aa.attr("data-threads-id")}`)
        let wt = aa.find("span.warn_txt2")
        var rep = aa.find("span.h-threads-info-reply-btn")
        if(!wt || !rep)
        {
            console.error(`the wt= ${wt}  rep=${rep}`)
            continue;
        }
        let href = rep.children("a").attr("href")

        var wttxt = wt.text()
        wt.text("")
        wt.append(`<a href="${href}">${wttxt}</a>`)

    }
}

function OnChangeTheme(){
    if(theme == Theme.Dark)
    {
        dark_mode()
    }
    else{
         default_mode()
    }

     var pathname = window.location.pathname;

     if(pathname.indexOf("/f/") >= 0 ) {
        f_func()
     }
    else if(pathname.indexOf("/timeline/") >= 0){
f_func()
    }
    else if( pathname.indexOf("/t/") >= 0 ) {
        t_func()
    }
}

function exfunc(){
   let menu = $("#h-menu-content")
   let c = $("<li class=\"h-nav-item\">  <a>  Dark Mode </a></li>")
    c.children("a").click(()=>{
      if(theme == 0)
      {
          theme =1 }
       else if( theme == 1) {
         theme = 0
       }
       else{
           theme = 0
       }
       GM_setValue("theme",theme)
       OnChangeTheme()
   })
   menu.append(c)
}

function backupdefault(){

    defaultCfg.html_bg = $('html').css("background")
    defaultCfg.html_color = $('html').css("color")
    defaultCfg.h_threads_item_bg =  $('.h-threads-item').css("background")
    defaultCfg.h_threads_content_color = $('.h-threads-content').css("color")
    defaultCfg.htirm_bg = $(".h-threads-item-reply-main").css("background")
    defaultCfg.hpft_bg = $('.h-post-form-title').css("background")
    defaultCfg.ht_color = $(".h-title").css("color")
    defaultCfg.left_menu_bg = $("#h-menu").css("background")
    defaultCfg.left_menu_font = $("#h-menu a").css("color")
    //$('.h-ref-view').css("background",config.centreBg)
}

function CookieManage(){
    let trs = $($("tbody").children())

    console.log("trs length > " + trs.length)
    for(let i = 0; i < trs.length; i++)
    {
        let tds = $(trs[i])

        let cookie = tds.children().eq(2).text()
        let aa = $(tds.find(" div div a:first"))
        let href = aa.attr("href")
        console.log("href=" + href)
        aa.removeAttr("href")
        aa.click( ()=>{
            console.log("Set Cookie=" + cookie)
            GM_setValue("cookie",cookie)
            alert("set cookie ok")
            window.location.href=href
        })
    }
}

(function() {
    //console.log(window.location.pathname)
    if (window.location.pathname === "/Member/User/Cookie/index.html")
    {
        console.log("cookie manage")
        CookieManage();
        return;
    }
    let cookie = GM_getValue("cookie","0")
    if (cookie === "0") {
        console.log("还没捕获饼干设置")
    }
    else{
        let cstr = `当前饼干:${cookie}`
       // console.log(cstr)

        let form = $("#h-post-form form")

        form.prepend($(`<div>${cstr}</div>`))
        /*
        let dd = $("#h-post-form form div div:eq(2)")
        dd.clone
        if( dd.length == 1){
           dd.text(`当前饼干：${cookie}\n${dd.text()}`)
        }
*/
    }

    theme = GM_getValue("theme",Theme.Default)
    backupdefault();
    console.log("current theme = " + theme)
    OnChangeTheme();

    exfunc()

})();

