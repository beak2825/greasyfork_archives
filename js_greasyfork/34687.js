// ==UserScript==
// @name         今年一定島 測試
// @description  汲汲營營大報社
// @author       稻米
// @namespace    https://greasyfork.org/zh-TW/scripts/34687
// @version      2025.04.21.0010.build16299

// @match        *://gaia.komica.org/00b/*
// @match        *://gaia.komica1.org/00b/*
// @match        *://gita.komica1.org/00b/*


// @exclude      *://*/00b/src/*
// @exclude      *://*/00b/thumb/*

// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/34687/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%B8%AC%E8%A9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/34687/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%B8%AC%E8%A9%A6.meta.js
// ==/UserScript==

/*
window.addEventListener("load", function(event) { //太早
    console.log("All resources finished loading!");
});
document.addEventListener("DOMContentLoaded", function(event) {
    console.log( 'DOMContentLoaded' );
});

$(document).ready(function(e){});

*/


//$(window).on("load",function(event){});

//console.log(arguments.callee.name);//函式名稱

//jquery
try{
    $(document).ready(function() {
        console.log( 'jquery ready' );
        //全域變數//global
        $.var181226=window.var181226=[];
        $.var181226=[];
        $.var181226.index=null;//上下篇
        //console.log( $.var181226 );

        //
        poi(); //頂端底部
        poi2(); //標題加上首頁
        poi4();//卷軸 進度條
        poi181226();//上下箭頭
        poi240123();//檔名連結網址加上問號

    });
    //throw "is empty";
}
catch(err){
    console.log( err );
    console.log( err.message );

    throw '錯誤';
}
finally{

}
/////////////

function poi240123(){
    //console.log( 'poi240123' );
    var aa=$('.file-text');
    //console.log( aa );
    $.each(aa, function( index, item ){
        var bb=$(item).find('a');
        //console.log( bb );
        var url=bb.attr('href');
        //console.log( url );
        bb.attr('href',url+'?');
        url=bb.attr('href');
        //console.log( url );

    });
}


function poi181226(){
    //建立上下箭頭
    var str='';
    str=str+"<button id='btn181226a'>︽</button><br/>";
    str=str+"<button id='btn181226b'>︾</button><br/>";
    $("#poi171031box").append( ""+str );

    var aa1=$("div.thread");
    //console.log( aa1 );
    if(aa1.length >1){
        //非回應模式
        poi181226a();
    }

    var aa=$("div.bar_reply:contains('回應模式')");
    //console.log( aa );
    if(aa.length ==1){
        //回應模式
        poi181226b();
    }
}//poi181226()

function poi181226a(){
    //console.log( $('.thread') );
    //console.log( $.gginin.var181226.index );
    //全域變數
    var cc=$.var181226.index;
    //本頁有幾篇文章
    var thread_n=$('.thread').length -1;

    //上箭頭
    $('#btn181226a').on('click',function(){
        if(cc === null){
            cc=0;
        }else{
            if(cc > 0){cc--;}
        }
        var FFF=$('.thread').eq(cc).prop('offsetTop');
        console.log( cc,FFF );//.offsetTop
        $(document).scrollTop(FFF);
    });
    //下箭頭
    $('#btn181226b').on('click',function(){
        if(cc === null){
            cc=0;
        }else{
            if( cc < thread_n ){cc++;}
        }
        var FFF=$('.thread').eq(cc).prop('offsetTop');//討論串在卷軸的高度
        console.log( cc,FFF );//.offsetTop
        $(document).scrollTop(FFF);
    });

}
function poi181226b(){
    //console.log( $('.thread') );
    //console.log( $.gginin.var181226.index );
    //全域變數
    var cc=$.var181226.index;
    //本頁有幾篇文章
    var thread_n=$('.post').length -1;

    //上箭頭
    $('#btn181226a').on('click',function(){
        if(cc === null){
            cc=0;
        }else{
            if(cc > 0){cc--;}
        }
        var FFF=$('.post').eq(cc).prop('offsetTop');
        console.log( cc,FFF );//.offsetTop
        $(document).scrollTop(FFF);
    });
    //下箭頭
    $('#btn181226b').on('click',function(){
        if(cc === null){
            cc=0;
        }else{
            if( cc < thread_n ){cc++;}
        }
        var FFF=$('.post').eq(cc).prop('offsetTop');//討論串在卷軸的高度
        console.log( cc,FFF );//.offsetTop
        $(document).scrollTop(FFF);
    });

}
function poi4(){
    var elm="<div id='poi181028'>div</div>";
    $("#poi171031box").append(elm);
    $("#poi181028").css({
        "border":"1px solid #000",
    });

    $(window).scroll(function () {
        var FFF1 = $(this).scrollTop();
        var FFF2 = $(document).height()-$(window).height();

        //console.log( FFF1,FFF2 );
        var FFF3 = (FFF1 / FFF2).toFixed(2);
        var FFF4 = Math.floor(FFF3 * 100);
        $("#poi181028").css({
            "width":FFF4+"%",
        });
        $("#poi181028").html( FFF4 );
        //$("#poi181028").html( "<div style='width:"+FFF4+"%';border:1px solid #000;'>"+FFF4+"</div>" );
        //style="width:50%;"

    });//scroll

}

function poi2(){
    //$("div.thread").each(function(index, value){});
    //console.log( $('div.thread').length );
    if($('div.thread').length > 1){
        document.title = document.title +'::首頁';

    }

}
function poi(){ //頂端底部

    $("#threads").css({
        "border-style": "solid",
        "border-color": "green",
        "border-width": "1px",
    });//"background-color","yellow"

    div = $("<div>").html("prepend").attr({
        'id':'poi171031prepend',
        'class':'class_poi171031',
    });//{attribute:value, attribute:value ...}
    $("#threads").prepend(div);//#page_switch

    div = $("<div>").html("append").attr({
        'id':'poi171031append',
        'class':'class_poi171031',
    });//'id','poi171031append'
    $("#threads").append(div);

    //樣式
    $(".class_poi171031").css({
        "background-color":"yellow",
        "font-size":"150%",
        "border-style": "solid",
        "border-color": "red",
    });//"background-color","yellow"


    div = $("<div>").html("box").attr({
        'id':'poi171031box',
    });//{attribute:value, attribute:value ...}
    $("#page_switch").append(div);
    $("#poi171031box").css({
        "z-index":"10",
        "position":"fixed",
        "bottom":"40%",
        "left":"0px",
        "border":"1px solid #000",
    });//"background-color","yellow"
    var ary = []; // 空陣列
    ary[0]='';
    ary[1]='<a href="#poi171031prepend">▲頂端</a>';
    ary[2]='<a href="#poi171031append">▼底部</a>';

    $("#poi171031box").html(ary[1]+'<br/>'+ary[2]+'<br/>');
    //.append(), prepend(), .after() .before()
    //timestamp=Date.parse(new Date()); //(new Date()).getTime(); //Date.now()

    var FFF='';
    FFF=Date.now();
    //FFF=Date.parse(new Date());
    //FFF=(new Date()).getTime();
    FFF='./?'+FFF+'#header';
    FFF='<a href="'+FFF+'">🌼首頁</a>';
    ary[3]=FFF;
    $("#poi171031box").append(ary[3]+'<br/>');
    $("#poi171031prepend").html(ary[1]+ary[2]+ary[3]);
    $("#poi171031append").html(ary[1]+ary[2]+ary[3]);
    FFF='';
    FFF='';





}//function


/*

測試小工具

https://httpbin.org/headers
https://httpbin.org/ip
https://httpbin.org/user-agent

*/

