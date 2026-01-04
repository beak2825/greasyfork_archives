// ==UserScript==
// @name         今年一定島 搜尋影片看原串
// @description  汲汲營營大報社
// @author       稻米
// @version      2024.10.01.0010.build16299
// @namespace    http://greasyfork.org/zh-TW/scripts/393528

// @match        *://gaia.komica.org/00b/*
// @match        *://gaia.komica1.org/00b/*
// @match        *://gaia.komica2.cc/00b/*
// @match        *://gita.komica1.org/00b/*

// @exclude      *://*/00b/src/*
// @exclude      *://*/00b/thumb/*

// @grant        none
// @license      WTFPL


// @downloadURL https://update.greasyfork.org/scripts/393528/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%90%9C%E5%B0%8B%E5%BD%B1%E7%89%87%E7%9C%8B%E5%8E%9F%E4%B8%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/393528/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%90%9C%E5%B0%8B%E5%BD%B1%E7%89%87%E7%9C%8B%E5%8E%9F%E4%B8%B2.meta.js
// ==/UserScript==

//jquery
try{}
catch(err){}
finally{}

$(document).ready(function() {
    //console.log( 'jquery ready' );
    poi();
    color();
});
//throw "throw";


//
function color(){
    $(".poi191210").css({
        "background-color":"yellow",
        "border":"1px solid #000",
    });//連結上背景色 不想上色就把這段刪除
}
function poi(){
    //console.log( document.location.href );
    //console.log( window.location.search );
    var searchParams = new URLSearchParams( window.location.search );
    //console.log( searchParams );
    //console.log( searchParams.get("mode") );
    if( searchParams.get("mode") ){
        //console.log( searchParams.get("c") );
        if( searchParams.get("c") ){
            //poi2();//測試
            ypa();
        }
    }
}
function ypa(){
    var aa =$('.thread').find('.qlink');
    //console.log( aa );
    aa.each(function(index,item){
        //console.log( index,item );
        $(item).after('<span class="poi191210">🖤</span>');
    });
    $(".poi191210:contains('🖤')").click(function(){
        //console.log( '黑色愛心' );
        var aa = $(this);
        //console.log( aa );
        var bb = aa.prev().attr('data-no');
        //console.log( bb );//留言編號

        poi2( bb,this );

    });


}

function poi2( in1,in2 ){


    var jqXHR=$.ajax({
          url: './pixmicat.php?mode=search',
          type: 'POST',
          data: { keyword: in1 , field: "no",method:'AND' },
    });
    jqXHR.done(function(  data, textStatus, jqXHR ) {
        console.log( 'jqXHR.done' );
        //console.log( data );
        //var aa = $.parseHTML( data );
        //var aa = $( data );
        var aa = $('<div/>').append( data );//避開html標籤問題
        //console.log( aa );

        var bb = aa.find('div#search_result').find('.threadpost');
        //console.log( bb );

        var cc = bb[0];
        cc=$(cc);
        cc.find('div.quote').remove();
        cc.find('div.category').remove();
        //console.log( cc );

        var dd = cc.find('a');
        dd=dd[0].href;
        console.log( dd );//連結

        //$(in2).append('aaa');
        $(in2).html('<a href="'+dd+'">❤️連結</a>');//不是outerHTML 是innerHTML


    });
    jqXHR.fail(function( jqXHR, textStatus, errorThrown ){
        console.log( 'jqXHR.fail' );
    });
    jqXHR.always(function( data, textStatus, jqXHR ){
        console.log( 'jqXHR.always' );
    });
    jqXHR.then(function( data, textStatus, jqXHR ){
        console.log( 'jqXHR.then 11' );
    }, function( jqXHR, textStatus, errorThrown ){
        console.log( 'jqXHR.then 22' );
    });


    //console.log( aa );
    //var bb=$(aa.responseText);
    //var bb1 = aa.responseText;
    //console.log( bb1 );
    //var bb2= $.parseHTML( aa.responseText );
    //console.log( bb2 );
    //var bb=$('<div></div>').append( $.parseHTML(aa.responseText) );
    //console.log( bb );
}//poi()
//poi()




/*
https://sora.komica.org/00/pixmicat.php?mode=search
*/
