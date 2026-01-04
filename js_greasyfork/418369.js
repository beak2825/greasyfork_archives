// ==UserScript==
// @name         weadmin pojie
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       xiaweihua
// @match        *://localhost:8080/webloader*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418369/weadmin%20pojie.user.js
// @updateURL https://update.greasyfork.org/scripts/418369/weadmin%20pojie.meta.js
// ==/UserScript==

(function (){
    'use strict';
    console.log('display:'+ $('body').css('display'));
    var div=$('body');
    $(div).css('opacity','0');
    setTimeout(a, 200);
    //判断是不是刷新页面，如果是，giaogiao5为空
    var giaogiao5=$('.giaogiao5');
    console.log(giaogiao5);
    if(giaogiao5.length==0){
    console.log('无元素');
        setTimeout(flush, 1000);
    }

}
)();
function a(){
    console.log('时辰已到');
    $('body>div').each(function(index,item){
        $(this).addClass("giaogiao"+index);
        if(index==5){
        var div=$('.giaogiao5');
        $(div).css('display','none');
        }
    });
        var uiContainer=$('#uiContainer');
        $(uiContainer).css('display','none');
        var svg1=$('div>svg');
        $(svg1).css('display','none');
        $('div>div').each(function(index,item){
           $(this).attr('id','id'+index);
        });
        //隐藏dom
        var id117=$('#id117');
        $(id117).css('display','none');
        var id130=$('#id130');
        $(id130).css('left','380px');
        var id128=$('#id128');
        $(id128).css('left','300px');
        var id133=$('#id133');
        $(id133).css('left','380px');
        var id131=$('#id131');
        $(id131).css('left','300px');
        var id122=$('#id122');
        $(id122).css('left','380px');
        var id137=$('#id137');
        $(id137).css('left','500px');
        var id140=$('#id140');
        $(id140).css('left','320px');
        var id134=$('#id134');
        $(id134).css('left','380px');
        var id118=$('#id118');
        $(id118).css('opacity','0');
        var id120=$('#id120');
        $(id120).css('display','none');
        $('#id141').click( function(e) {
        console.log('点击登陆');
        setTimeout(login, 2000);
        });
        setTimeout(b, 200);
}

function b(){
    var div=$('body');
    $(div).css('opacity','1');
    var div1=$('.giaogiao5');
    $(div1).css('display','inline');
    var div2=$('.fpsContainer giao0');
    $(div2).css('display','none');
}


function login(){
    $('body>div>div>div').each(function(index,item){
            $(this).attr('id','index'+index);
        if(index==43){
             var index43=$('#index43');
        $(index43).css('display','none');
        }

     });
}

function flush(){
    $('body>div>div>div').each(function(index,item){
            $(this).attr('id','index'+index);
        if(index==16){
             var index16=$('#index16');
        $(index16).css('display','none');
        }

     });
}