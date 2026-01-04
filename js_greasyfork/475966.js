// ==UserScript==
// @name         今年一定島 開串經過時間
// @description  汲汲營營大報社
// @author       稻米
// @namespace    https://greasyfork.org/zh-TW/scripts/475966
// @version      2024.07.27.0010.build16299

// @match        *://gaia.komica.org/00b/*
// @match        *://gaia.komica1.org/00b/*
// @match        *://gaia.komica2.cc/00b/*
// @match        *://gita.komica1.org/00b/*

// @exclude      *://*/00b/src/*
// @exclude      *://*/00b/thumb/*

// @grant        none
// @license      WTFPL

// @downloadURL https://update.greasyfork.org/scripts/475966/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E9%96%8B%E4%B8%B2%E7%B6%93%E9%81%8E%E6%99%82%E9%96%93.user.js
// @updateURL https://update.greasyfork.org/scripts/475966/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E9%96%8B%E4%B8%B2%E7%B6%93%E9%81%8E%E6%99%82%E9%96%93.meta.js
// ==/UserScript==
// @require     https://code.jquery.com/jquery-3.7.0.min.js
//jquery
//throw "is empty";
//console.log( 'jquery ready' );
//全域變數//global
//window.gg=[];
//gg.time = new Date();


//

$(document).ready(function() {
    //console.log( 'jquery ready' );
    poi();
});


var start=function(){};
try{
    //console.log( 'try' );
    start();
}catch(err){}finally{}
//
function poi(){
    //console.log( 'poi' );
    //
    var FFF;
    var aa=$("#postinfo>ul>li:contains('瀏覽器才能正常附加圖檔')");
    //
    //console.log( aa.length );

    if(aa.length >0){
        //console.log( 'yy' );
        poi230924();
        color();
    }else{
        //console.log( 'nn' );
    }

}//poi()
function color(){
    $('.class230924').css({
        "background-color":"yellow",
        "border":"1px solid #000",
    });
}


function poi230924(){
    //console.log( 'poi230924' );
    var FFF='';
    //
    var aa=$('#contents').find('.thread');
    //console.log( aa );

    var time_now=new Date();
    //console.log( '現在時間',time_now );
    time_now=time_now.getTime();
    //console.log( '現在時間',time_now );

    aa.each(function(index,item){
        $(item)
        var bb=$(item);

        //
        FFF='';
        FFF=bb.find('.post-head').find('.now').first();//開串的時間日期
        FFF=FFF.text() + FFF.next().text();
        //console.log( FFF );

        var time_開串時間=new Date( FFF );
        time_開串時間=time_開串時間.getTime();
        //console.log( '開串時間',time_開串時間 );

        FFF='';
        FFF=bb.find('.post-head').find('.now').last();//最新留言的時間日期
        FFF=FFF.text() + FFF.next().text();

        //console.log( FFF );

        var time_最新留言時間=new Date( FFF );
        time_最新留言時間=time_最新留言時間.getTime();
        //console.log( '最新留言時間',time_最新留言時間 );


        FFF=[];
        //console.log( time_now , time_開串時間 );//新增的box
        FFF[0]= time_now - time_開串時間 ;
        FFF[1]=FFF[0]+'毫秒';
        FFF[0]=Math.floor(FFF[0]/1000);//轉換成 秒
        FFF[1]=FFF[0]+'秒';
        FFF[0]=Math.floor(FFF[0]/60);//轉換成 分
        FFF[1]=FFF[0]+'分';

        if(FFF[0]>60){
            FFF[1]= Math.floor(FFF[0]/60) +'小時' + (FFF[0] % 60) +'分';
        }
        //console.log( FFF[1] );

        var xx=$(item).find('.post.threadpost').find('.file-text').first();
        //console.log( xx );
        //console.log( xx.length );

        if(xx.length >0){
            xx.append('<span class="class230924">'+FFF[1]+'</span>');
            //

        }else{
            //console.log( 'nn' );
            var xx2=$(item).find('.post.threadpost').find('.post-head');//.find('.post-head')
            xx2.prepend('<span class="class230924">'+FFF[1]+'</span>');
            //console.log( xx2 );
        }





    });





}