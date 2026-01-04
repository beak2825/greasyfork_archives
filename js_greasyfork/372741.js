// ==UserScript==
// @name         预览网页，悬停1.5s在本页面预览将要跳转的网页
// @namespace    https://github.com/zhchjiang95
// @version      1.0.1
// @description  来回切换窗口麻烦？该脚本能够让你不点击链接的情况下，在本页面预览链接的页面内容，你只需要鼠标悬停在超链接上1.5s即可。
// @author       zhchjiang95 <zhchjiang99@outlook.com>
// @include      http://*
// @include	     https://*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @match        http://*
// @match        https://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372741/%E9%A2%84%E8%A7%88%E7%BD%91%E9%A1%B5%EF%BC%8C%E6%82%AC%E5%81%9C15s%E5%9C%A8%E6%9C%AC%E9%A1%B5%E9%9D%A2%E9%A2%84%E8%A7%88%E5%B0%86%E8%A6%81%E8%B7%B3%E8%BD%AC%E7%9A%84%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/372741/%E9%A2%84%E8%A7%88%E7%BD%91%E9%A1%B5%EF%BC%8C%E6%82%AC%E5%81%9C15s%E5%9C%A8%E6%9C%AC%E9%A1%B5%E9%9D%A2%E9%A2%84%E8%A7%88%E5%B0%86%E8%A6%81%E8%B7%B3%E8%BD%AC%E7%9A%84%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

var div = $("<div id='preview-a'></div>"),
    iframe = $("<iframe name='link'></iframe>"),
    p = $("<p title='点击拖动，移动过程鼠标不要离开此按钮，如果出现异常，点击一次此按钮即可' class='move'></p><p title='关闭'>×</p>"),
    style = $("<style>.move::before{content: '▞'}</style>");
$('head').append(style);
var parentDiv = div.append(iframe).append(p);
var timer,istrue=false;

$("a").attr("target","link");
$("a").mouseover(function(){
    if(istrue) return;
    var athis = $(this)[0];
    timer = setTimeout(function(){
        $('body').append(parentDiv);
        sty();
        athis.click();
        istrue = true;
    },1500);
});
$("a").mouseout(function(){
    //$("#preview-a").remove();
    clearTimeout(timer);
});
$("body").on('click','#preview-a p:eq(1)',function(){
    $(this).parent().remove();
    istrue = false;
})
$('body').on('mousedown','#preview-a .move',function(){
    $(document).on('mousemove',function(e = window.event){
        moveGo(e);
    })
    function moveGo(e){
        var pL = $("#preview-a").offset().left,
            pT = $("#preview-a").offset().top,
            mL = $('.move').offset().left,
            mT = $('.move').offset().top,
            disW = mL - pL,
            disH = mT - pT;
        $("#preview-a").css({
            'left': e.clientX - disW - 15,
            'top': e.clientY - disH -15
        })
    }

    $(document).on('mouseup', function(){
        moveGo = ()=>{return;}
    })
})

function sty(){
    $("#preview-a").css({
        'background': '#fff',
        'position': 'fixed',
        'width': '70%',
        'height': '60%',
        'border': '2px solid #f1f1f1',
        'border-radius': '8px',
        'z-index': 9999999,
        'overflow': 'hidden',
        'top': '38%',
        'left': '29%'
    })
    $("#preview-a iframe").css({
        'border': 'none',
        'width': '100%',
        'height': '100%',
    });
    $("#preview-a p").css({
        'width': '30px',
        'height': '30px',
        'line-height': '29px',
        'background': 'red',
        'border-radius': '50%',
        'color':'#ffffff',
        'font-size':'20px',
        'text-align':'center',
        'cursor': 'pointer',
        'position':'absolute',
        'top':'48%',
        'left':10,
        'z-index': '999999'
    });
    $(".move").css({
        'line-height': '28px',
        'top': '40%',
        'font-size': '14px',
        'cursor': 'move'
    });
}