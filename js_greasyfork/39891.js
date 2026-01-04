// ==UserScript==
// @name         今年一定島 自動更新回文
// @description  汲汲營營大報社
// @author       稻米
// @namespace    https://greasyfork.org/zh-TW/scripts/39891
// @version      2024.07.23.0010.build16299

// @match        *://gaia.komica.org/00b/*
// @match        *://gaia.komica1.org/00b/*
// @match        *://gaia.komica2.cc/00b/*
// @match        *://gita.komica1.org/00b/*

// @exclude      *://*/00b/src/*
// @exclude      *://*/00b/thumb/*

// @grant        none
// @license      WTFPL



// @downloadURL https://update.greasyfork.org/scripts/39891/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0%E5%9B%9E%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/39891/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0%E5%9B%9E%E6%96%87.meta.js
// ==/UserScript==

//jquery
try{}
catch(err){}
finally{}
//
$(document).ready(function() {
    //var time=new Date();
    //
    //var url = new URL( window.location.href );
    //var res=url.searchParams.get('res');
    //console.log( res );
    //return;
    poi(); //回應模式才執行
});

function poi(){

    var aa=window.location.href.match("\\?res=");
    //console.log( aa );
    if( aa ){
        //ok //確認是回應模式的網址
    }else{
        return;
    }
    //
    var bb=$("div.bar_reply:contains('回應模式')");
    //console.log( bb );
    if( bb.length ){
        //ok //確認是回應模式
    }else{
        return;
    }
    //
    //console.log( '回應模式才執行' );
    poi231230倒數計時器();
}//poi()


function poi231230倒數計時器(){
    //console.log( 'poi231230倒數計時器' );
    //建立元素
    var aa =$('.thread');
    if(aa.length ){
        //ok //元素存在
    }else{
        return;
    }
    //建立元素
    aa.append('<span class="poi231230bigbox"><span class="poi231230">自動更新回文</span></span>');
    $(".poi231230").css({
        "background-color":"yellow",
        "border":"2px solid red",
    });//
    $(".poi231230").after('<span id="poi231230訊息box">-</span>');//放訊息的位置
    //after,before,append,prepend
    poi231230倒數計時器2();//倒數
    poi231230手動更新();//倒數
}//poi231230倒數計時器

function poi231230手動更新(){
    //console.log( 'poi231230手動更新' );
    $(".poi231230").after('<button type="reset">手動更新</button>');//新增按鈕
    $('.poi231230bigbox').attr('poi240101觸發ajax','0');//記錄ajax
    //
    $(".poi231230bigbox >button:contains('手動更新')").click(function(){
        console.log('click');
        poi240101通知('手動更新');
        //檢查是否有ajax正在處理
        var aa=$('.poi231230bigbox').attr('poi240101觸發ajax');//標記
        if(aa>0){
            console.log( 'poi240101觸發ajax' );
            return;//上一個ajax未處理完//防止點太快??
        }//if
        //避免快速連點
        var aa=$('#poi240101避免送出多次ajax請求');
        if(aa.length){
            //已經存在
            poi240101通知('等待伺服器回應');
            return;//防止點太快??
        }else{
            //不存在
            $('.poi231230bigbox').append('<span id="poi240101避免送出多次ajax請求">⌛</span>');
            aa=$('#poi240101避免送出多次ajax請求');
        }//aa
        //console.log( aa );
        //充當計時器的元素
        $("#poi240101避免送出多次ajax請求").fadeOut(1000, function(){
            $(this).remove();
        });
        //

        //console.log('沒佔用');
        clearTimeout( $.poi231230計時器 );//停止現有的計時器
        //$('#poi231230訊息box').text('手動更新');//訊息
        poi231230取得資料();//取得頁面的api新資料

        //
    });//click
}//poi231230手動更新()

function poi240101通知(in1){
    var 文字=''+in1;
    //console.log( document.hidden );
    if(document.hidden){
        //網頁在背景時不顯示通知
        return;//停止
    }
    //return;
    //網頁在前景時
    document.addEventListener("visibilitychange",function(){
        //console.log( "visibilitychange" );
    });

    var time =new Date().getTime();
    //console.log( time );
    var FFF=time.toString(36);//10進位 轉 36進位
    //console.log( FFF );
    //return;
    FFF='poi240101通知'+FFF;//新的id
    $('.poi231230bigbox').append('<span id="'+FFF+'">'+文字+'</span>');
    var aa=$('#'+FFF);
    //console.log( aa );
    aa.css({
        "background-color":"yellow",
        "border":"2px solid red",
    });//
    //存在5秒 就移除
    aa.fadeOut(5000, function(){
        $(this).remove();
    });
//檢查?

}//poi240101通知(in1)

function poi231230倒數計時器2(){
    //console.log( 'poi231230倒數計時器2' );
    var 紀錄的時間點= new Date().getTime();//更新當下的時間 //時間戳
    //
    var 計時器a1=function(){
        $.poi231230計時器=setTimeout(function(){
            var 檢查的新時間= new Date().getTime();//
            var 計時間隔=30;//秒
            var diff=檢查的新時間 - 紀錄的時間點;
            $(".poi231230").html(''+ 計時間隔 - Math.floor(diff/1000) );//取整數
            if(diff < 計時間隔*1000){ //設定每隔幾秒 更新頁面的新資料 //更新太快會有429錯誤
                clearTimeout( $.poi231230計時器 );//停止現有的計時器
                計時器a1();//重複
            }else{
                //window.clearTimeout( 計時器a1 );
                紀錄的時間點= new Date().getTime();//更新當下的時間
                //計時器a1();//重複//由getapi啟動
                poi231230取得資料();//取得頁面的api新資料
            }
        }, 1*1000);//setTimeout//每秒更新
        $.poi231230計時器;//啟動
    }//計時器a1
    計時器a1();//啟動
}//poi231230倒數計時器2


function poi231230取得資料(){
    //console.log('poi231230取得api資料');
    //var url = new URL( document.location.href );
    //var thread_no=url.searchParams.get("res");
    var thread_no = $('.post.threadpost').attr('data-no'); //首篇編號
    var apiurl='./pixmicat.php?mode=module&load=mod_ajax&action=thread&html=true&op='+thread_no; //綜合版原生api
    //console.log(apiurl);

    var [poi231231time1,poi231231time2]=[0,0];//計算ajax的反應時間
    var jqXHR=$.ajax({
        url: apiurl,
        type: 'GET',
        data: {},
        beforeSend:function(x,y,z){
            //送出請求前的準備
            $('.poi231230').text('正在取得api資料');//拋出訊息
            //$('#poi231230訊息box').text('');//拋出訊息 //太快看不到
            poi231231time1=Date.now();//performance.now();
            $('.poi231230bigbox').attr('poi240101觸發ajax','1');
        },
    });
    jqXHR.done(function(  data, textStatus, jqXHR ) {
        console.log( 'jqXHR.done' );
        //分析取得的json
        var json = $.parseJSON( data );//分析parse
        if(json.error >0){//出現錯誤 有可能是串被砍了
            console.log( json.msg );//來自api的錯誤訊息
            return;
        }
        //console.log( json.posts );//ok
        //return;
        var bb=json.posts; //post_json_ary
        var apidata_文章編號=[];
        var apidata_文章內容=[];
        $.each(bb,function(index,item){
            //console.log( item );
            //var bb2 = item.no;
            apidata_文章編號[index]=''+item.no;//用字串儲存
            apidata_文章內容[item.no]=item.html;
        });
        //console.log( apidata_文章編號,apidata_文章內容 );
        //return;
        var FFF=[apidata_文章編號,apidata_文章內容];
        poi231230比對資料( FFF );//比對資料
        //
    });//jqXHR.done

    ///
    jqXHR.fail(function( jqXHR, textStatus, errorThrown ){
        //console.log( 'jqXHR.fail' );
        //console.log( jqXHR, textStatus, errorThrown );
        $('.poi231230').text(textStatus+jqXHR.status);
        var time = new Date();
        console.log(jqXHR.status+'錯誤 1分鐘後重新嘗試'+time);
        setTimeout(function(){//1分鐘後重新嘗試
            console.log('再次嘗試');
            poi231230取得資料();//取得頁面的api新資料
        }, 60*1000);
    });
    jqXHR.always(function( data, textStatus, jqXHR ){
        //console.log( 'jqXHR.always' );
        //成功或失敗 都會執行這段
        //結束後 改變觸發紀錄
        $('.poi231230bigbox').attr('poi240101觸發ajax','0');
        //console.log( textStatus );//success
    });
    jqXHR.then(function( data, textStatus, jqXHR ){
        //成功才會跑到then
        //console.log( 'jqXHR.then' );
        poi231231time2=Date.now();//performance.now(); //時間戳
        //console.log( poi231231time1,poi231231time2 );//ok
        var FFF=poi231231time2-poi231231time1;//反應時間
        console.log( 'ajax反應時間='+FFF+'ms' );//ajax反應時間
        $('#poi231230訊息box').text( ''+FFF+'ms' );//在網頁上顯示訊息
        if(FFF>1000){
            poi240101通知('可能是尖峰時段');
        }else{
            poi240101通知('完成');
        }
        //console.log( Date() );//Sun Dec 31 2023 12:18:00 GMT+0800 (台北標準時間)
    });
/*
jqXHR.done
jqXHR.always
jqXHR.then
*/
}//poi231230取得資料()

function poi231230比對資料(FFF){
    //console.log( 'poi231230比對資料' );
    //$('.poi231230').text('比對api資料');//拋出訊息
    var [apidata_文章編號,apidata_文章內容]=FFF;
    //console.log( apidata_文章編號,apidata_文章內容 );//ok

    //找出現有的文章編號
    var aa =$('div.thread').find('div.post');
    var html_文章編號=[];
    //var html_文章編號2=[];
    FFF='';
    aa.each(function(index,item){
        FFF = $(item).find('span.qlink').attr('data-no');//.data('no')
        //console.log( FFF );
        html_文章編號[index]=''+FFF;//用字串儲存
        //html_文章編號2[index]=''+FFF;//用字串儲存
    });//each
    //console.log( html_文章編號 );

    //用新的文章編號 進行比對

    //遍歷
    //var html_文章編號2=html_文章編號;//淺拷貝
    //var html_文章編號2=JSON.parse(JSON.stringify( html_文章編號 ));//深拷貝

    $.each( apidata_文章編號 , function( index, item ) {
        //console.log( index, item );
        //var aa = html_文章編號.includes(item);//回傳T/F
        //var aa =$.inArray( item, html_文章編號 );
        //console.log( html_文章編號, item ,index );
        var aa =html_文章編號.indexOf( item );
        //console.log( aa );//回傳找到的index位置 //找不到會回傳-1
        if( aa == -1 ){
            //沒找到=新的 //更新
            //將api中的新資料放到html裡
            //$('div.thread').append( apidata_文章內容[item] );//prepend
            console.log( '新內容:'+ item );//
            $('.poi231230bigbox').before( apidata_文章內容[item] );//將api的新內容放到html
            poi231230更新標題();//
        }else{
            //找到位置=已經存在
            var aa2 =$.inArray( item, html_文章編號 );
            //console.log( item,html_文章編號2[aa2] );//ok
            html_文章編號.splice(aa2,1);//移除aa2位置的1個陣列元素
        }//if
    });//each

    //console.log( html_文章編號2 );
    //網頁上有文章是api中沒有提到的?? //出現的可能性??
    var aa1=$(".post.reply");
    aa1.css({
        "border-right":"0px solid red",
    });//加上顏色顯示

    if(html_文章編號.length >0){//文章遺失? 自刪
        console.log( '有文章遺失' );
        console.log( html_文章編號 );//遺失的文章編號
        //將遺失的文章上色
        $.each( html_文章編號 , function( index, item ){
            var aaa=$(".post>.post-head>.qlink:contains('"+item+"')");
            aaa=aaa.parent().parent();//往上層
            //console.log( aaa );
            aaa.css({
                //"background-color":"Silver",
                "border-right":"10px solid silver",//#C0C0C0
            });//加上顏色顯示
        });
    }//if

/*
parent() 只往上查找一層
closest() 往上查找 只要找到符合條件的 就停止
parents() 往上查找 不停止 找出所有符合條件的
*/
    //完成


    poi231230倒數計時器2();//重複

/*
    html_文章編號.forEach(function(value,index){
        //console.log(value,index);
    });//js

*/

}//poi231230比對資料(FFF)

function poi231230更新標題(){
    var FFF;
    //console.log( 'poi231230更新標題' );
    //
    //紀錄新文章累積數量
    var aa1=$('.poi231230bigbox').attr('poi231230新文章累積數量');
    //console.log( aa1 );
    //
    if(aa1>0){
        aa1= parseInt(aa1) + 1;
    }else{
        aa1=1;
    }
    //console.log( aa1 );
    $('.poi231230bigbox').attr('poi231230新文章累積數量',aa1);//寫下紀錄
    //
    //紀錄原始標題
    var aa2=$('.poi231230bigbox').attr('poi231230原始標題');
    //console.log( aa2 );
    if(aa2){//檢查是否有這個值
        //ok
    }else{
        //沒有=增加
        FFF=document.title;//原始標題
        if(FFF){
            //沒事
        }else{
            FFF=' ';
        }
        $('.poi231230bigbox').attr('poi231230原始標題',FFF);//寫下紀錄
    }
    //console.log( aa2 );

    //更新html ttile
    var aa1=$('.poi231230bigbox').attr('poi231230新文章累積數量');
    var aa2=$('.poi231230bigbox').attr('poi231230原始標題');
    document.title='('+aa1+')'+aa2;
    console.log( '更新標題' );
    //poi240101通知('更新標題');

    //$('title').text();
}//poi231230更新標題




/*
舊版本
https://greasyfork.org/zh-TW/scripts/39891-?version=1139339
*/





