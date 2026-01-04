// ==UserScript==
// @namespace    https://greasyfork.org/zh-TW/scripts/398432
// @name         konomi 自動更新文章(api版本)
// @description  在回應模式自動更新文章(api版本)
// @author       稻米
// @version      2022.02.27.0010
// @grant        none
// @include      http://konomi.tw/00/pixmicat.php?res=*
// @include      https://konomi.tw/00/pixmicat.php?res=*
// @exclude      *.jpg
// @exclude      *.png
// @exclude      *.webm

// @license      WTFPL

// @downloadURL https://update.greasyfork.org/scripts/398432/konomi%20%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0%E6%96%87%E7%AB%A0%28api%E7%89%88%E6%9C%AC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/398432/konomi%20%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0%E6%96%87%E7%AB%A0%28api%E7%89%88%E6%9C%AC%29.meta.js
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
    $(".poi200321").css({
        "background-color":"yellow",
        "border":"1px solid #000",
    });//連結上背景色 不想上色就把這段刪除
}
function poi(){
    //console.log( document.location.href );
    //console.log( window.location.search );//window.location.href
    var url = new URL( document.location.href );
    //var searchParams = new URLSearchParams( document.location.href );
    //console.log( url.searchParams );
    //console.log( url.searchParams.get("res") );
    if( url.searchParams.get("res") >0 ){
        //poi2();//測試
        ypa();
    }
}
function ypa(){
    var aa =$('.thread');
    //console.log( aa );
    aa.each(function(index,item){
    });

    if(aa.length >1){
        return;
    }else{
        var bb=aa.find('hr')
        //console.log( bb );
        bb.before('<span class="poi200321">123</span>');
    }
    //console.log( aa );

    poi4();//計數器
    $(".poi200321:contains('123')").click(function(){
        //console.log( '黑色愛心' );

        //poi2( this );

    });
    //

}

function poi4(){//計數器
    //console.log( 'poi4' );
    var aa=$(".poi200321");
    var bb= new Date().getTime();
    var cc=0;
    var tt=function(){
        cc++;
        //console.log( 'tt' );
        //console.log( cc );
        setTimeout(function(){
        //setInterval(function() {
            //poi2( this );
            var dd= new Date().getTime();
            dd=dd-bb;
            aa.html(''+ Math.floor(dd/1000) );
            if(dd > 30*1000){ //設定每隔幾秒 更新頁面的新資料
                //window.clearTimeout( tt );
                bb= new Date().getTime();//更新
                poi2( );//取得頁面的新資料
                tt();
            }else{
                tt();
            }
        }, 1*1000);
        //
    };
    tt();
}

function poi2(  ){//取得頁面的新資料
    //console.log( in1 );//this
    var url = new URL( document.location.href );
    var thread_no=url.searchParams.get("res");

    //return;


    var jqXHR=$.ajax({
          url: 'http://konomi.tw/00/pixmicat.php?mode=module&load=mod_ajax&action=thread&html=true&op=' + thread_no ,
          type: 'GET',
          data: {},
    });
    jqXHR.done(function(  data, textStatus, jqXHR ) {
        console.log( 'jqXHR.done' );
        var json = $.parseJSON( data );//分析parse
        if(json.error >0){//錯誤
            console.log( json.msg );//錯誤訊息
            return;
        }
        //console.log( json.posts );
        //return;

        //var aa = $('<div/>').append( data );//避開html標籤問題
        //console.log( aa );

        //var bb = aa.find('div#contents >form >div#threads >div.thread >div.post');
        //console.log( bb );
        var bb=json.posts; //post_json_ary
        var post_new_ary=[];
        var post_new_ary2=[];
        $.each(bb,function(index,item){
            //let bb2 = $(item).find('span.qlink').attr('data-no');//.data('no')
            //console.log( item );
            let bb2 = item.no;
            //console.log( bb2 );
            post_new_ary[index]=''+bb2;//用字串儲存
            post_new_ary2[bb2]=item.html;
        });
        //return;

        //console.log( post_new_ary,post_new_ary2 );
        //return;
        poi3(post_new_ary,post_new_ary2);//比對文章編號


    });
    jqXHR.fail(function( jqXHR, textStatus, errorThrown ){
        //console.log( 'jqXHR.fail' );
    });
    jqXHR.always(function( data, textStatus, jqXHR ){
        //console.log( 'jqXHR.always' );
    });
    jqXHR.then(function( data, textStatus, jqXHR ){
        //console.log( 'jqXHR.then 11' );
    }, function( jqXHR, textStatus, errorThrown ){
        //console.log( 'jqXHR.then 22' );
    });


}//poi()



function poi3( in1,in2 ){
    var post_new_ary = in1;
    var post_new_ary2 = in2;
    //console.log( post_new_ary,post_new_ary2 );
    //return;

    //找出現有的文章編號
    var aa =$('div.thread').find('div.post');
    //console.log( aa );

    var post_orig_ary=[];
    aa.each(function(index,item){
        let aa2 = $(item).find('span.qlink').attr('data-no');//.data('no')
        //console.log( aa2 );
        post_orig_ary[index]=''+aa2;//用字串儲存
    });
    //console.log( post_orig_ary );
    //return;

    //用新的文章編號 進行比對
    post_new_ary.forEach(function(value,index){
        //console.log(value,index);
    });
    $.each(post_new_ary, function( index, value ) {
        //console.log( value );
        //console.log( post_orig_ary );

        let aa = post_orig_ary.includes(value);
        //console.log( aa );
        //console.log( post_new_ary2[value] );
        if( aa ){
            //存在=
            //console.log( '存在' );


        }else{
            //不存在 =新的文章
            //console.log( '不存在' );
            //加入在後面
            $('div.thread').append( post_new_ary2[value] );

        }
    });



}



