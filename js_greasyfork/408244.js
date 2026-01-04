// ==UserScript==
// @name         今年一定島 搜尋結果顏色輔助
// @description  汲汲營營大報社
// @author       稻米
// @namespace    https://greasyfork.org/zh-TW/scripts/408244
// @version      2024.07.26.0010.build16299

// @match        *://gaia.komica.org/00b/*
// @match        *://gaia.komica1.org/00b/*
// @match        *://gaia.komica2.cc/00b/*
// @match        *://gita.komica1.org/00b/*

// @exclude      *://*/00b/src/*
// @exclude      *://*/00b/thumb/*

// @grant        none
// @license      WTFPL

// @downloadURL https://update.greasyfork.org/scripts/408244/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%90%9C%E5%B0%8B%E7%B5%90%E6%9E%9C%E9%A1%8F%E8%89%B2%E8%BC%94%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/408244/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%90%9C%E5%B0%8B%E7%B5%90%E6%9E%9C%E9%A1%8F%E8%89%B2%E8%BC%94%E5%8A%A9.meta.js
// ==/UserScript==

$(document).ready(function() {
    poi();
});

function poi(){
    var aa =$('div#banner').find('div.bar_admin');
    //console.log( aa );
    if( aa.text() == "搜尋" && $('#search_result').length >0 ){
        poi2();//用顏色標記不同討論串
        poi3();//在新視窗開啟
        poi221129放置span();//放置span
        poi221129調整span位置();//調整span位置
        //


    }
}


function poi3(){//在新視窗開啟
    //var bb =$('div#search_result').find('div.threadpost').find('a');
    var bb =$('div#search_result').find('div.threadpost').find('.name').next('a');//a
    //console.log( bb );
    //return;
    bb.css({
        "background-color":"yellow",
        "border":"1px solid red",
    });//按鈕上色
    var FFF;
    $.each(bb, function( index, item ) {
        //console.log( item );
        FFF = $(item).attr('target','_blank');
    });
}
function poi2(){
    var bb =$('div#search_result').find('div.threadpost').find('.name').next('a');
    var FFF;

    $.each(bb, function( index, item ) {
        FFF = $(item).attr('href');//連結
        $(item).after('<span class="cls200805"></span>');
        let 旁邊的=$(item).next("span.cls200805");
        //console.log( FFF );
        //console.log( 旁邊的 );
        var str=FFF;
        var re = /res=([0-9]+)/;
        var found = str.match(re);//文章編號=found[1]
        //console.log( found );
        if(found){
            //有找到才繼續
            //console.log( found[1] );
            //console.log( $(item).text() );
            if(found[1] == $(item).text() ){
                $(item).after('<span class="cls231217">首</span>');
            }

        }else{
            return;
        }

        FFF=found[1];
        $(旁邊的).text(''+FFF);
        FFF=parseInt(found[1], 10);
        FFF=FFF.toString(16);//十進位 轉 16進位
        //console.log( FFF );
        //$(旁邊的).prepend( );
        FFF=FFF.substr(-3);//取最後三位
        //console.log( FFF );
        $(旁邊的).css({
            'backgroundColor': '#'+FFF,
            'float':'right',
        });
        //
    });//each
    //
    $('.cls231217').css({
        "background-color":"yellow",
        "border":"1px solid red",
    });//按鈕上色


}//poi2

function poi221129放置span(){//收集不重複的編號

    var aa= $('.cls200805');
    var chk_array=[];
    var FFF;
    $.each(aa, function( index, item ){
        //console.log( index, item );
        //
        FFF='';
        var str=$(item).text();//div裡頭的文章編號
        //console.log( str );
        FFF=chk_array.findIndex(function(item){ //findIndex//find
            let aa=(item==str);
            return aa;
        });

        //沒找到=-1
        var find_index=0;
        if(FFF >= 0){
            //有找到=重複的
            //console.log( FFF );
            find_index=FFF;
        }else{
            //沒找到
            chk_array.push( str );//放進陣列
            //console.log('L'+ chk_array.length );
            find_index=chk_array.length-1;
        }
        //
        FFF='';
        FFF='<span class="poi221129span" data-item="'+str+'" data-index="'+find_index+'">span</span>';
        $(item).prepend(FFF);
        $('.poi221129span').text('');
        //
    });//each
    //console.log( chk_array );//收集到的不重複字串

}//poi221129()

function poi221129調整span位置(){//
    var aa= $('.poi221129span');
    //console.log( aa );//
    //
    $.each(aa, function( index, item ){
        if(index >100){
            return;
        }
        //console.log( item );//新建立的span
        var bb=$(item).parent().parent().height();//width
        //console.log( bb );//
        var bb2=$(item).offset();
        //console.log( bb );
        var [bb2_top,bb2_left]=[bb2['top'],bb2['left']];//右邊顏色區塊
        //console.log( [bb2_top,bb2_left] );
        var bb3=$(item).parent().css('background-color');
        //console.log( bb3 );
        var bb4=$(item).data();//顏色區塊帶著的data資料
        //console.log( bb4['index'] );
        var bb4_px=bb4['index']*10;
        //console.log( bb4_px );
        var bb4_b16=bb4['item'].toString(16);//十進位 轉 16進位
        //console.log( bb4_b16 );
        //$('.poi221129span').text( bb4_b16 );
        var [bb5_width,bb5_height]=[$(item).parent().width(),$(item).parent().height()];
        //console.log( [bb5_width,bb5_height] );
        //
        $(item).css({
            'display':'inline-block',
            'width':10+bb4_px+'px',
            'height':bb+'px',
            'position':'absolute',
            'top':bb2_top+'px',
            //'left':bb2_left-bb4_px+'px',
            'right':bb5_width+'px',
            'border-top':'2px solid '+bb3,
            'border-left':'2px solid '+bb3,
            //'border-right':'2px solid '+bb3,
        });
        $(item).css('pointer-events','none');
    });

}//poi221129b


