// ==UserScript==
// @name         粉笔课堂显示暂停遮罩
// @namespace    http://tampermonkey.net/
// @version      2024-09-09
// @description  暂停时显示遮罩，可点击的图标在鼠标悬停时变为手形，在我的课程中未看完课程显示为红色背景
// @author       AN drew
// @match        https://*.fenbi.com/webclass/class/*
// @match        https://*.fenbi.com/spa/webclass/class/*
// @match        https://*.fenbi.com/spa/pwa/episodes/*
// @match        https://*.fenbi.com/pwa/episodes/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://lib.baomitu.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/404669/%E7%B2%89%E7%AC%94%E8%AF%BE%E5%A0%82%E6%98%BE%E7%A4%BA%E6%9A%82%E5%81%9C%E9%81%AE%E7%BD%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/404669/%E7%B2%89%E7%AC%94%E8%AF%BE%E5%A0%82%E6%98%BE%E7%A4%BA%E6%9A%82%E5%81%9C%E9%81%AE%E7%BD%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if($.cookie("maskon")==undefined)
        $.cookie('maskon', "1", { expires: 365, path: "/", domain: "fenbi.com" });
    if($.cookie("sidebar")==undefined)
        $.cookie('sidebar', "0", { expires: 365, path: "/", domain: "fenbi.com" });
    if($.cookie("fullscreen")==undefined)
        $.cookie('fullscreen', "0", { expires: 365, path: "/", domain: "fenbi.com" });

    var maskon = $.cookie("maskon")

    GM_addStyle(`
.switcher {
    width: 160px;
    user-select: none;
    cursor: pointer;
}

.btn_fath {
    margin-top: 12px;
    position: relative;
    border-radius: 16px;
    margin-top: 15px;
    float: left;
}

.tip {
    float: left;
    font-size: 14px;
    line-height: 50px;
}

.btn1 {
    float: left;
}

.btn2 {
    float: right;
}

.btnSwitch {
    height: 20px;
    width: 25px;
    border: none;
    color: #fff;
    line-height: 20px;
    font-size: 12px;
    text-align: center;
    z-index: 1;
}

.move {
    z-index: 100;
    width: 18px;
    border-radius: 18px;
    height: 18px;
    position: absolute;
    cursor: pointer;
    border: 1px solid #828282;
    background-color: #f1eff0;
    box-shadow: 1px 2px 2px 1px #fff inset, 0 0 5px 1px #999;
}

.on .move {
    left: 30px;
}

.on.btn_fath {
    background-color: #44b549;
    height: 20px
}

.off.btn_fath {
    background-color: #828282;
    height: 20px
}

.toolbtn.speed {
    color: black !important
}

.toolbtn.speed:hover {
    color: white !important
}

.progress-bg {
    z-index: 5000
}

#breviary {
    z-index: 5000
}

.wrap.push {
    z-index: 5000
}

.wrap.pull {
    z-index: 5000
}

#rightBlock {
    z-index: 5000
}

.breviary-bottom-panel {
    height: 17px !important;
    margin-top: -4px !important
}

.toolbtn-big {
    cursor: pointer
}

.keynote-btn {
    cursor: pointer
}

.toolbtn {
    cursor: pointer
}

.pull {
    cursor: pointer
}

.push {
    cursor: pointer
}

.nav-link {
    cursor: pointer
}

#playBtn {
    cursor: pointer
}

.header-wrapper h3 {
    color: black !important
}

p.ng-star-inserted,
.clock.ng-star-inserted {
    color: black !important
}

.keynote-btn.prespan {
    color: black !important
}

.like,
.toolbar .content-wrapper .unlike:hover {
    cursor: pointer;
    background: url(https://nodestatic.fbstatic.cn/weblts_spa_online/webclass/static/star.00c51cc376f8088c8f23.svg) !important;
    zoom: 1.1;
    height: 20px !important;
    width: 20px !important
}

.icon-close {
    cursor: pointer
}

:not(:root):fullscreen {
    display:none;
}
`)

    GM_addStyle(
        '.toolbar .content-wrapper .unlike {'+
        'cursor: pointer;'+
        'background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjJweCIgaGVpZ2h0PSIyMnB4IiB2aWV3Qm94PSIwIDAgMj'+
        'QgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz'+
        '0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0Ni4yIC'+
        'g0NDQ5NikgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPuaYn+'+
        'e6py3ngrnkuq5AMXg8L3RpdGxlPg0KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPg0KICAgID'+
        'xkZWZzPjwvZGVmcz4NCiAgICA8ZyBpZD0i5a2m55Sf56uvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMS'+
        'IgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4NCiAgICAgICAgPGcgaWQ9IuaIkeeahOivvueoiy3or7'+
        '7lkI7or4TliIbngrnkuq4iIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03ODIuMDAwMDAwLCAtMjM0LjAwMDAwMCkiPg'+
        '0KICAgICAgICAgICAgPGcgaWQ9IuivhOWIhiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTMwLjAwMDAwMCwgMTI5Lj'+
        'AwMDAwMCkiPg0KICAgICAgICAgICAgICAgIDxnIGlkPSLmmJ/nuqct54K55LquIiB0cmFuc2Zvcm09InRyYW5zbG'+
        'F0ZSgyNTEuMDAwMDAwLCAxMDQuMDAwMDAwKSI+DQogICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJTaG'+
        'FwZSIgcG9pbnRzPSIwIDAgMjQgMCAyNCAyNCAwIDI0Ij48L3BvbHlnb24+DQogICAgICAgICAgICAgICAgICAgID'+
        'xwYXRoICBkPSJNMTEuOTUxMzA2LDIuNCBDMTEuNzc2NTE2MywyLjQgMTEuNDI2NDU2OSwyLjUzNDkzNzM1IDEwLj'+
        'k2OTc5NSwzLjM5NjQyMzQ4IEM5Ljg3MTExNzQ3LDUuMjY5MjE5NDIgOC4xMzY2NjY2OSw4LjMyNjE5ODYzIDguMT'+
        'M2NjY2NjksOC4zMjYxOTg2MyBDOC4xMzY2NjY2OSw4LjMyNjE5ODYzIDUuNTA0NzM4NDYsOC45MTQ5Mjg4NCAzLj'+
        'Q1ODY0MzU2LDkuMjg1MTY2MiBDMi40NTU1MjQwNSw5LjQ0MjY3MzE0IDIuMTI4MDMzNjIsMTAuMjk3NDM2NCAyLj'+
        'YzNzAzNjM0LDEwLjg5ODE3MTcgQzQuMDc3MTI5ODksMTIuNTUzNDM1MiA2LjA4Mjg4ODcyLDE1LjI4NTc5NjUgNi'+
        '4wODI4ODg3MiwxNS4yODU3OTY1IEM2LjA4Mjg4ODcyLDE1LjI4NTc5NjUgNS42NjcwNDMxLDE4LjI4NzA3MiA1Lj'+
        'QzMzE4OTk3LDIwLjMzNjEwMjggQzUuMzU2ODM5NTYsMjEuMTIzMTU3MyA1Ljc5MDkzMjQ1LDIxLjU3MzU4ODggNi'+
        '4zOTY0NTM2MSwyMS41NzM1ODg4IEM2LjU5NDI5MjQsMjEuNTczNTg4OCA2LjgxMDM3ODQ2LDIxLjUyNTA4ODIgNy'+
        '4wMzI3MDcwMSwyMS40MjUyMDU3IEM4Ljc0OTM5MDcyLDIwLjYxMDc3OTYgMTEuMzYwNjcwNywxOS4zNjgwMTE0ID'+
        'ExLjk1MjI2NjMsMTkuMDg2NjExOCBDMTIuNTMzMjk3NywxOS4zNzA0MTI0IDE1LjExOTEyNzYsMjAuNjM0Nzg5OC'+
        'AxNi44MTc1NjQsMjEuNDUxMTM2NyBDMTcuMDM3MDExNCwyMS41NTE0OTk0IDE3LjI1MTE3NjcsMjEuNiAxNy40ND'+
        'Y2MTQ2LDIxLjYgQzE4LjA0NDQ1MjcsMjEuNiAxOC40NzM3NDM3LDIxLjE0OTA4ODQgMTguMzk4MzUzNiwyMC4zNj'+
        'A1OTMzIEMxOC4xNjY5MDE0LDE4LjMwODY4MTIgMTcuNzU1ODU3NywxNS4zMDM1NjQgMTcuNzU1ODU3NywxNS4zMD'+
        'M1NjQgQzE3Ljc1NTg1NzcsMTUuMzAzNTY0IDE5Ljk0MjY0ODcsMTIuNTY3MzYxMSAyMS4zNjU5MzU1LDEwLjkwOT'+
        'Y5NjYgQzIxLjg2ODY5NTgsMTAuMzA4NDgxMSAyMS41NDUwNDY5LDkuNDUyMjc3MjIgMjAuNTUzNDUxOSw5LjI5ND'+
        'I5MDA3IEMxOC41MzEzNjY2LDguOTI0MDUyNzIgMTUuNzI2NTY5NSw4LjMzNDM2MjEgMTUuNzI2NTY5NSw4LjMzND'+
        'M2MjEgQzE1LjcyNjU2OTUsOC4zMzQzNjIxIDE0LjAxMjI4NjgsNS4yNzMwNjEwNSAxMi45MjY1NzQ0LDMuMzk3OD'+
        'Y0MDkgQzEyLjU0MjkwMTYsMi43MDU0MDk4IDEyLjI0OTUwNDcsMi40ODMwNzUzMSAxMi4wNjMxOTA1LDIuNDIyMD'+
        'g5MzkgQzEyLjA0NTkwMzYsMi40MTM5MjU5MiAxMi4wMDc0ODgzLDIuNCAxMS45NTEzMDYsMi40IEwxMS45NTEzMD'+
        'YsMi40IEwxMS45NTEzMDYsMi40IFoiIGlkPSJTaGFwZSIgc3Ryb2tlPSIjQTRBRkI4IiBzdHJva2Utd2lkdGg9Ij'+
        'IiPjwvcGF0aD4NCiAgICAgICAgICAgICAgICA8L2c+DQogICAgICAgICAgICA8L2c+DQogICAgICAgIDwvZz4NCi'+
        'AgICA8L2c+DQo8L3N2Zz4=) !important;'+
        'zoom: 1.1;'+
        'height: 20px !important;'+
        ' width: 20px !important'+
        '}')

    if($('p.ng-star-inserted').length!=0)
        $('p.ng-star-inserted').get(0).childNodes[1].textContent=" / ";

    var $switcher = $('<div class="switcher">'+
                      '    <span class="tip">显示暂停遮罩&nbsp;</span>'+
                      '    <div class="btn_fath on">'+
                      '        <div class="move" data-state="on"></div>'+
                      '        <div class="btnSwitch btn1">开</div>'+
                      '        <div class="btnSwitch btn2">关</div>'+
                      '    </div>'+
                      '</div>')


    if($.cookie("maskon")=="0")
    {
        $switcher.find(".btn_fath").removeClass("on").addClass("off");
        $switcher.find(".move").attr("data-state", "off");
    }

    $switcher.click(function(){
        var ele = $(this).find(".move");
        var fath = $(this).find(".btn_fath");
        if (ele.attr("data-state") == "on") {
            ele.animate({
                left: "0"
            }, 100, function() {
                ele.attr("data-state", "off");
            });
            fath.removeClass("on").addClass("off");
            $.cookie('maskon', "0", { expires: 365, path: "/", domain: "fenbi.com" });
        } else if (ele.attr("data-state") == "off") {
            ele.animate({
                left: '30px'
            }, 100, function() {
                ele.attr("data-state", "on");
            });
            fath.removeClass("off").addClass("on");
            $.cookie('maskon', "1", { expires: 365, path: "/", domain: "fenbi.com" });
        }
    })

    setInterval(function(){
        if($(".switcher").length==0)
            $(".jubao").before($switcher);
    })

    $(".progress-bg").click(function(){
        $(".toolbtn-big").removeClass("play")
    })

    let menu_text1;
    if($.cookie("sidebar")=="1")
    {
        menu_text1='[✅] 固定显示侧边栏';
    }
    else
    {
        menu_text1='[❌] 固定显示侧边栏';
    }

    GM_registerMenuCommand(menu_text1, function(){
        if($.cookie("sidebar")=="1")
        {
            $.cookie('sidebar', "0", { expires: 365, path: "/", domain: "fenbi.com" });
            window.location.reload();
        }
        else
        {
            $.cookie('sidebar', "1", { expires: 365, path: "/", domain: "fenbi.com" });
            window.location.reload();
        }
    })

    let menu_text2;
    if($.cookie("fullscreen")=="1")
    {
        menu_text2='[✅] 网页全屏';
    }
    else
    {
        menu_text2='[❌] 网页全屏';
    }

    GM_registerMenuCommand(menu_text2, function(){
        if($.cookie("fullscreen")=="1")
        {
            $.cookie('fullscreen', "0", { expires: 365, path: "/", domain: "fenbi.com" });
            window.location.reload();
        }
        else
        {
            $.cookie('fullscreen', "1", { expires: 365, path: "/", domain: "fenbi.com" });
            window.location.reload();
        }
    })

    let t1=setInterval(function(){
        if($(".canvas_container").length>0)
        {
            $(".canvas_container").click(function(){
                $(".toolbtn-big").get(0).click();
            })
            clearInterval(t1);
        }
    },100);

    let t2=setInterval(function(){
        if($(".mask").length>0)
        {
            $(".mask").click(function(){
                $(".toolbtn-big").get(0).click();
            })
            clearInterval(t2);
        }
    },100);


    let t3=setInterval(function(){
        if($.cookie("fullscreen")=="1")
        {
            if($(".mask").length>0)
            {
                $(".toolbtn.fullScreen").click(function(e){
                    var el = e.srcElement || e.target; //target兼容Firefox
                    var isFullscreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                    if (!isFullscreen) { //进入全屏,多重短路表达式
                        (el.requestFullscreen && el.requestFullscreen()) ||
                            (el.mozRequestFullScreen && el.mozRequestFullScreen()) ||
                            (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) || (el.msRequestFullscreen && el.msRequestFullscreen());

                    } else { //退出全屏,三目运算符
                        document.exitFullscreen ? document.exitFullscreen() :
                        document.mozCancelFullScreen ? document.mozCancelFullScreen() :
                        document.webkitExitFullscreen ? document.webkitExitFullscreen() : '';
                    }
                })
                clearInterval(t3);
            }
        }
    },100);


    $(".toolbtn-big").click(function(){
        if($(".toolbtn-big").hasClass("play") && $.cookie("maskon")=="1")
            $("#playWrap").show()
        else
            $("#playWrap").hide()
    })

    setInterval(function(){

        if($(".nav-item:nth-of-type(1)").find(".nav-link").hasClass("active"))
            $(".nav-item:nth-of-type(1)").find("span").css({"color":"black"})
        else
            $(".nav-item:nth-of-type(1)").find("span").css({"color":"#999"})

        if($(".toolbtn-big").hasClass("play") && $.cookie("maskon")=="1")
            $("#playWrap").show()
        else
            $("#playWrap").hide()

        if($('.toolbtn-big.ng-star-inserted').hasClass('play'))
        {
            if($('title').text().indexOf('【暂停中】')==-1)
                $('title').text($('title').text()+'【暂停中】');
        }
        else
        {
            if($('title').text().indexOf('【暂停中】') > -1)
                $('title').text($('title').text().replace('【暂停中】',''));
        }

        if($.cookie("sidebar")=="1")
        {
            $(".pull").click();
        }

        $(".toolbtn.volume").parent().css({"z-index":"6000"})
        $(".toolbtn.speed").parent().css({"z-index":"6000"})
    },100)


    GM_addStyle(`.episode-wrapper.red{background:#ff00003b}`)

    let t=setInterval(function(){
        if($('.episode-item').length>0)
        {
            $('.episode-item').each(function(){
                if(!$(this).find('.episode-wrapper').hasClass('red'))
                {
                    let text=$(this).find('.progress').text();
                    let progress=parseInt(text.substring(4));
                    if(text=="未观看" || isNaN(progress) || progress<=96)
                    {
                        $(this).find('.episode-wrapper').addClass('red');
                    }
                }
            })
        }
    },1000);

})();