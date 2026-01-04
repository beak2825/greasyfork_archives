// ==UserScript==
// @name         今年一定島 搜尋結果顯示縮圖
// @description  汲汲營營大報社
// @author       稻米
// @version      2024.01.16.0010.build16299
// @namespace    https://greasyfork.org/zh-TW/scripts/483411

// @match        *://gaia.komica.org/00b/*
// @match        *://gaia.komica1.org/00b/*
// @match        *://gaia.komica2.net/00b/*

// @exclude      *://*/00b/src/*
// @exclude      *://*/00b/thumb/*

// @grant        none
// @license      WTFPL

// @downloadURL https://update.greasyfork.org/scripts/483411/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%90%9C%E5%B0%8B%E7%B5%90%E6%9E%9C%E9%A1%AF%E7%A4%BA%E7%B8%AE%E5%9C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/483411/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%90%9C%E5%B0%8B%E7%B5%90%E6%9E%9C%E9%A1%AF%E7%A4%BA%E7%B8%AE%E5%9C%96.meta.js
// ==/UserScript==


$(document).ready(function() {
    poi();
});

function poi(){
    //console.log( 'poi231230顯示縮圖1' );
    var aa =$('div#banner').find('div.bar_admin');
    if( aa.text() == "搜尋" && $('#search_result').length >0 ){
        //ok
    }else{
        return;
    }

    $.poi231230旅行者=[];
    poi231230顯示縮圖();
}

function poi231230顯示縮圖(){
    //console.log( 'poi231230顯示縮圖' );
    //找到每個結果中的連結
    var bb =$('div#search_result').find('div.threadpost').find('.name').next('a');
    //遍歷
    var array=[];
    $.each(bb, function( index, item ){
        if(index<10){
            //ok
        }else{
            return;//
        }//設定上限
        //
        var str = $(item).attr('href');//討論串連結
        var re = /res=([0-9]+)/;
        var found = str.match(re);//文章編號=found[1]
        //
        array[index]=[];
        array[index][0]=found[1];//討論串編號
        array[index][1]=$(item).text();//目標回文編號
    });//each
    //
    //console.log( array );
    array.forEach(function(item, index){
        //console.log( item, index );
    });
    $.poi231230旅行者=[0,array];
    poi231230取得縮圖資料();
}//poi231230顯示縮圖


function poi231230取得縮圖資料(){
    //console.log('poi231230取得縮圖資料');
    //console.log( $.poi231230旅行者 );
    var [index, array]=$.poi231230旅行者;
    //console.log( index, array );
    var FFF=array[index]
    var [討論串編號,目標編號]=FFF;
    //console.log( 討論串編號,目標編號 );
    
    //return;
    var apiurl='./pixmicat.php?mode=module&load=mod_ajax&action=thread&html=true&op='+ 討論串編號; //綜合版原生api
    //console.log(apiurl);

    //return;
    var [poi231231time1,poi231231time2]=[0,0];
    var jqXHR=$.ajax({
        url: apiurl,
        type: 'GET',
        data: {},
        beforeSend:function(x,y,z){
            poi231231time1=Date.now();//
        },
    });

    jqXHR.done(function(  data, textStatus, jqXHR ) {
        //console.log( 'jqXHR.done' );
        var json = $.parseJSON( data );//分析parse
        if(json.error >0){//出現錯誤 有可能是串被砍了
            console.log( json.msg );//錯誤訊息
            return;
        }
        //console.log( json.posts );//ok
        //return;
        var bb=json.posts; //討論串裡的內容
        var apidata_文章內容;
        $.each(bb,function(index,item){
            //console.log( item );
            if(目標編號 == item.no){
                apidata_文章內容=item.html;
            }
        });
        //console.log( apidata_文章內容 );
        var FFF=$(apidata_文章內容).find('img').attr('src');
        if(FFF){
            //ok
        }else{
            FFF='404';
        }
        console.log( index,FFF );//縮圖網址
        var aaa=$(".threadpost >a:contains('"+目標編號+"')");
        //console.log( aaa );
        if(FFF!='404'){
            aaa.parent().css({'background-image':'url(' + FFF + ')','background-repeat': 'no-repeat','background-position':'center'});
        }
        //完成
        //return;



    });//jqXHR.done

    ///
    jqXHR.fail(function( jqXHR, textStatus, errorThrown ){
        console.log( 'jqXHR.fail' );
        //console.log( jqXHR, textStatus, errorThrown );
        $('.poi231230').text(textStatus+jqXHR.status);
    });
    jqXHR.always(function( data, textStatus, jqXHR ){
        //console.log( 'jqXHR.always' );
        //console.log( textStatus );//success
    });
    jqXHR.then(function( data, textStatus, jqXHR ){
        //console.log( 'jqXHR.then' );
        var [index, array]=$.poi231230旅行者;
        //
        poi231231time2=Date.now();//
        var FFF=poi231231time2-poi231231time1;//ajax回應時間//毫秒
        console.log( 'ajax反應時間='+FFF+'ms' );//ajax反應時間
        if(FFF<1000){
            //ok
        }else{
            FFF='';
            FFF='伺服器回應時間大於一秒(較長)';
            console.log( FFF );//success
        }


        //增加index
        index=index+1;
        $.poi231230旅行者=[index, array];//更新index
        //檢查index
        if(index < array.length){
            //ok
            //poi231230取得縮圖資料( $.poi231230旅行者 );
        }else{
            console.log( '結束' );
            return;//
        }

        //利用jquery動畫 產生延遲
        poi231231time1=Date.now();//
        $(".bar_admin").fadeTo(500,0.9).fadeOut( 100 ).fadeIn( 100 ,function(){ //animate
            poi231230取得縮圖資料();
            poi231231time2=Date.now();//
            var FFF=poi231231time2-poi231231time1;//動畫時間
            //console.log( FFF +'ms');//ok //700ms+

        });

    });

}//poi231230取得資料()

