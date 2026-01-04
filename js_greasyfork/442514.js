// ==UserScript==
// @name        readable Quora
// @author      qianjunlang
// @description 宽屏显示 + 护眼色 + 回答页大字号 + 页面动画美化。 Wide screen, big font-size, eye-protecting background color, animation effect.
// @match       *.quora.com/*
// @icon        https://qsf.cf2.quoracdn.net/-4-images.favicon-new.ico-26-07ecf7cd341b6919.ico
// @require     https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @version     5.3.3
// @run-at      document-idle
// @license MIT License
// @namespace https://greasyfork.org/users/861664
// @compatible  edge
// @compatible  chrome
// @downloadURL https://update.greasyfork.org/scripts/442514/readable%20Quora.user.js
// @updateURL https://update.greasyfork.org/scripts/442514/readable%20Quora.meta.js
// ==/UserScript==


var color_time = 5;
var move_time = 3;
var zoom_time = 0.8;

function anima(){

    var top_banner = "div.q-box:last-child > div.q-fixed.qu-fullX.qu-zIndex--header.qu-bg--raised.qu-borderBottom.qu-boxShadow--medium.qu-borderColor--raised:nth-child(2) > div.q-box > div.q-flex.qu-alignItems--center";
    $(top_banner).css({
        "width": parseInt(window.innerWidth -30) +"px",

        "transform":"translateX("+ (10- $(top_banner).position().left) +"px)",
        "transition-timing-function": "ease",
        "transition": move_time + 's',
        "transition-delay": color_time + 's',
    });

    $(".qu-display--inline-flex.qu-mr--large.Link___StyledBox-t2xg9c-0.dxHfBI.SiteHeader___StyledLink-us2uvv-1.inlymo.qu-cursor--pointer.qu-hover--textDecoration--underline").css({
        "transform":"scale(0.8) translateX("+ (14) +"px)",
        "transition-timing-function": "ease-out",
        "transition": zoom_time + 's',
        "transition-delay": (color_time + move_time) + 's',
    });
}
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

$(document).ready(function(){
    $($(".qu-px--small")[0]).hide();
    $(".qu-bg--red").css({
        "background-image": "linear-gradient(to right, #e3622f, #ff7b00 , #ffc65a , violet 83%, rgb(185, 043, 039) 100% )", // "#9a68af"
    });
    $(".ioqSAj div.q-box").css({
        "margin-left": 10 + "px",
        "margin-right":0
    });
    $(".ioqSAj div.q-box").find("div").css({"margin-left":0, "margin-right":0});

    if( window.location.href == "https://www.quora.com/" || window.location.href.indexOf("/search?q=") >=0 ){
        $(".qu-pb--large.qu-flexDirection--row").css({
            "position" : "relative",
            "left" : (window.innerWidth* -0.045) +"px",
        });

        $(".ioqSAj").css({"width": (window.innerWidth * 2) + "px",});

        $("#mainContent").css({"width": parseInt(
            window.innerWidth * (window.location.href.indexOf("/search?q=")<0 ? 0.655 : 0.84)
        )+"px",});

        $(".q-box.qu-mx--n_medium.PageContentsLayout___StyledBox-d2uxks-0").css({
            "width" : (window.innerWidth*0.1) +"px",
        });

    }else{

        $(".qu-pb--large.qu-flexDirection--row").css({
            "width" : (window.innerWidth * 0.98) +"px",
        });
        $(".ioqSAj").css({"width": (window.innerWidth) + "px",});
        $("#mainContent").css({
            "width": parseInt(window.innerWidth * 2.2)+"px",
            "font-family":"'Yu Gothic', Gadugi, copperplate, Calibri, Helvetica, Verdana, YouYuan,'Source Han Sans', Arial, Verdana, Sans-serif",
            "-webkit-font-smoothing": "antialiased",

            "font-size": "20px",
            "line-height": "24px",

            "transition-timing-function": "ease-out",
            "transition": 0.1 + 's',
        });

        $(".q-box.qu-overflowY--auto.qu-overflowX--hidden.qu-pb--medium.PageContentsLayout___StyledBox-d2uxks-0").css({
            "width": (window.innerWidth*0.15) +"px",
            "position":"relative",
            "left": -15 +"px",

            "font-size":"14px",
            "line-height": "15px",
            "font-family":" 'Trebuchet MS', Geneva, Tahoma, Gadugi, copperplate, Calibri, Helvetica, Verdana, YouYuan,'Source Han Sans', Arial, Verdana, Sans-serif",
            "-webkit-font-smoothing": "none",
        });
    }

    go_green();
    function go_green(){
        $(".qu-bg--raised").css({
            "-webkit-font-smoothing": "antialiased",
            "background":"#deecc2", //dbeec6
            "transition-timing-function": "ease",
            "transition": color_time + 's',
        })
    }
    setInterval(function(){go_green();}, 500);

    $("#root").css({
        "width": (window.innerWidth - 10) + "px",
        "overflow":"hidden",

        "background": "#d4ebc7",//"#EBF4BD",//"#CCE8CF",
        "transition-timing-function": "ease",
        "transition": color_time + 's',
    });

    window.onload = anima();
});
