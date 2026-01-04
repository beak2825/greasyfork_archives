// ==UserScript==
// @name         +7小说去广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去除小说网站https://m.360xs.com/
// @author       aliang
//@match  *://m.360xs.com/*
// @include      *://m.360xs.com/*
// @run-at       document-body
// @note    2020.08-10-V0.2 修复网络较差情况下的广告问题
/// jQuery 留一份自己用
// @downloadURL https://update.greasyfork.org/scripts/408372/%2B7%E5%B0%8F%E8%AF%B4%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/408372/%2B7%E5%B0%8F%E8%AF%B4%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

$(document).ready(function (){

    $("body").css({
        "filter": "blur(50px)",
        "background":"rgba(204,232,207)",
        "transition":"all .3s"
    })
    $("body").animate({filter:"none"});
    // setTimeout(hidden_bg,300)
    setTimeout(deleteGG,300);//1000毫秒=1秒后执行test方法

    setTimeout(Blur,500);
    FindAbg()
   // setInterval(deleteGG, 3000);
});

function Blur(){
    $("body").css({
        "filter": "blur(0)"
    })
}

function FindAbg(){
    console.log($(".chapter").children("p"))
$(".chapter").children("p").remove()
    for(var i  = 0 ; i<$("a").length;i++){
     // console.log($("a").eq(i)[0].innerHTML)
        if($("a").eq(i)[0].innerHTML=="广告"){
           $("a").eq(i).remove()
          }
    }
}


function hidden_bg(){
    $(".lijiaqi").fadeOut();
}

function init_bg(){
    $("body").append("<div class='lijiaqi' style='z-index:99999999999999999999999999 !important'><div class='jqtext'>李佳奇的快乐小说时光</div>")

    $(".lijiaqi").css({
        "position":"absolute",
        "z-index":"2147483647 !important",
        "width":"100%",
        "height":"100%",
        "top":"0",
        "left":"0",
        "background-color":"#4358a5",
        "transition":"all .3s",

    })
    $(".jqtext").css({
        "position":"absolute",
        "background": "gold",
        "top":"50%",
        "left":"50%",
        "width": "5px",
        "font-size": "35px",
        "color": "azure",
        "transform": "translate(-50%, -50%)"
    })
}

function deleteGG(){
    var i= 0;
    var length = 0;
    var arr =[];
    var nowid ="";
    //去除kkNy广告
   // console.log($("h1[id*='kkNy']"))
    var h1length = $("h1[id*='kkNy']").length
    var j = 0
    var h1arr = []
    h1arr =$("h1[id*='kkNy']")
    for(j;j<h1length;j++){
        h1arr.eq(j).remove()
    }

    console.log("boot:" ,$("div[id*=nboot]").eq(0).length)
    var bootdiv ="";
    if($("div[id*=nboot]").length!==0){
        bootdiv = $("div[id*=nboot]").eq(0)
        console.log("bootdiv",bootdiv[0].style.height)

        "bootdiv",bootdiv[0].style.height="100%"
    }

    //去除跳转上线BT广告
    var btimgarr = []
    var u = 0
    var ulength =$("a>img").length

    console.log('ulength',ulength)

    btimgarr=$("a>img")

    console.log("img",$("a>img"))

    for(u ; u<ulength; u++){
        if(btimgarr.eq(u)[0].currentSrc.indexOf("360xs")>=0){
           // console.log("不是广告")

        }else{
            btimgarr.eq(u)[0].remove()
        }
    }

    //去除aside广告


    //去除iframe广告
    $("iframe").eq(0).remove()

    $("body brde").eq(0).prevObject.eq(0).empty()

    nowid = $("body brde").eq(0)[0].id

    length = $("div[id*="+nowid+"]").length

    arr = $("div[id*="+nowid+"]")


    //去除浮动广告
    for(i;i<length;i++){
        arr.eq(i).remove()
    }


}



