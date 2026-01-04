// ==UserScript==
// @namespace    https://greasyfork.org/zh-TW/scripts/36387
// @name         今年一定島 書籤
// @description  汲汲營營大報社
// @author       稻米
// @version      2022.02.27.0010.build16299

// @include      *://*.komica.org/00/*
// @include      *://*.komica.org/00/*

// @exclude      *://*.komica.org/00/src/*
// @exclude      *://*.komica.org/00/thumb/*
// @exclude      *.jpg
// @exclude      *.png
// @exclude      *.webm

// @grant        none
// @license      WTFPL

// @downloadURL https://update.greasyfork.org/scripts/36387/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%9B%B8%E7%B1%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/36387/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%9B%B8%E7%B1%A4.meta.js
// ==/UserScript==

//jquery
try{}
catch(err){}
finally{}
//
$(document).ready(function() {
    //console.log( 'jquery ready' );
    //全域變數//global
    //time = new Date();
    //poi();
    poi_191210();
});
//throw "is empty";




function poi_191210(){
    //console.log( document.location.href );
    //console.log( window.location.search );
    var searchParams = new URLSearchParams( window.location.search );
    //console.log( searchParams );
    //console.log( searchParams.get("mode") );
    if( searchParams.get("mode") ){
        //沒事
    }else{
        poi();
    }
}
function poi(){//搜尋每個首篇
    //console.log(''+$("div.thread").length);
    //遍歷元素01
    $("div.thread").each(function(index, value){ // div.post-head
        //$(this).after('[01]'+cc1);
        //console.log(index);
        //console.log(value);
        //console.log($(this));
        //console.log($(this).attr("data-no"));
        //.first().parent();
        $(this).find("div.post-head").first().css( "background-color", "#ddd"); //上色
        var idno=$(this).attr("data-no");
        $(this).find("div.post-head").first().append('<span class="cls_poi171213" idno="'+idno+'"></span>'); //添加元件
        //$(this).prepend('prepend');
    });
    //
    ypa();//建立按鈕
    //
}//function poi(){

function ypa(){//建立按鈕
    div = $("<div>").html("prepend").attr({
        'id':'id_poi171214_box01',
        'class':'class_poi171214_box01',
    });//{attribute:value, attribute:value ...}
    $("#threads").prepend(div);//#page_switch

    $(".class_poi171214_box01").html('');
    $(".class_poi171214_box01").append('<poi qwq="button">按鈕用的區塊</poi>');
    $(".class_poi171214_box01").append('<poi qwq="add">新增用的區塊</poi>');
    $(".class_poi171214_box01").append('<poi qwq="list">清單用的區塊</poi>');
    //css樣式
    $(".class_poi171214_box01").css({
        "background-color":"rgba(255,255,0,0.5)",
        //"background-color":"yellow",
        "border": "1px solid blue",
        "display":"block",
        "width":"200",
        "height":"200",
        "position":"fixed",
        "top":"0",
        "left":"0",
        "overflow":"scroll",
    });
    $(".class_poi171214_box01").css({
        "display":"none",
    });


    $(".cls_poi171213").prepend('<button type="button" class="poi191001">書籤</button>');
    $(".cls_poi171213 > button.poi191001").on('click', function(event) { //:contains('書籤')
        //console.log( $(this) );
        //console.log( event.originalEvent );
        var idno='';
        idno=$(this).parent().attr("idno");//.attr("data-no")
        //console.log( tmp );//.attr("data-no")
        if($(this).html() =='書籤'){//顯示書籤時被按 就開啟左上角
            $(".class_poi171214_box01").css({
                "display":"block",
            });//"background-color","yellow"
            $(this).html('開啟中'+idno);
            //
            ouo(idno);//點擊書籤按鈕後的反應(自訂函式)
        }else{//再按一次 就關閉左上角
            $(".class_poi171214_box01").css({
                "display":"none",
            });//"background-color","yellow"
            $(this).html('書籤');
        }
    });

    //
}//function ypa(){

function ppp(){//上色
    $(".class_poi171214_box01 > poi[qwq=list]>span").css({
        "border-right":"10px solid red",
        "border-left":"10px solid red",
    });
    $("button[qwq=edit]").css({
        "background-color":"red",
    });
    $("span.cls_poi171216_2010 > button[qwq=del]").on('click', function() {
        var idno='';
        idno=$(this).parent().attr('idno');
        //console.log( idno );
        cookie_del(idno);
        $(this).html('(已刪除)');
        $(this).css({
            "background-color":"#FFF",
            "color":"#000",
            "font-weight":"bold",
        });
    });
    $(".class_poi171214_box01 > poi[qwq=list] > button[qwq=delall]").on('click', function(){
        document.cookie="poi001=";//清空cookie
        cookie_list();//列出cookie(自訂函式)
    });
}//function ppp(){//


function cookie_del(x){//
    var del_idno=x;
    //console.log( del_idno );
    var tmp='';
    var array_tmp = [];
    var cookie_time = fnc_cookie_time();
    //
    if(document.cookie !== ""){  //有coolkie執行這部份
        array_tmp=document.cookie.split(";"); //分解字串
        array_tmp.forEach(function(element,index){
            array_tmp[index]=array_tmp[index].trim();//去掉頭尾空白
            array_tmp[index]=array_tmp[index].split("="); //分解字串
            //if( /poi[0-9]+/.test( array_tmp[index][0] ) ){
            //if( array_tmp[index][0].includes("poi") ){ //找自訂cookie
            if( array_tmp[index][0].startsWith("poi") ){ //找自訂cookie
                if(array_tmp[index][0] == 'poi001'){
                    //array_tmp[index][1]=array_tmp[index][1].split(","); //分解字串 //cookie內容
                    var ary=array_tmp[index][1].split(","); //分解字串 //cookie內容;
                    ary.forEach(function(v2,i2){
                        var aa = v2.split("OAO"); //分解字串
                        //console.log( aa );
                        if(aa[0] == del_idno){
                            console.log( '符合' );
                            ary.splice(i2,1);//移除陣列元素 //位置,數量
                        }else{
                            console.log( '不符合' );
                        }
                    });//forEach
                    console.log( ary );

                    array_tmp[index][1]=ary.join();//組合字串//預設用逗號分隔

                    //var i = array_tmp[index][1].indexOf(del_idno);//找出元素位置
                    //array_tmp[index][1].splice(i,1);//移除陣列元素

                    //console.log( array_tmp[index][1] );
                    //console.log( array_tmp[index][1] );
                    //array_tmp[index][1]=array_tmp[index][1].join();//組合字串//預設用逗號分隔
                    tmp=array_tmp[index][1];
                }//if
            }//if
        });//foreach
        document.cookie = "poi001="+tmp+cookie_time.addtime;//寫入新的cookie
        //console.log( document.cookie ); //改變後的cookie

    }//if
}//function cookie_del(){//

function ouo(x){//產生cookie
    var idno=x;//傳入的id編號
    var tmp='';
    //開啟左上角時 重新取得清單
    cookie_list();//列出cookie(自訂函式)
    //
    $(".class_poi171214_box01 > poi").css({
        "display":"block",
        "border": "1px solid blue",
        //"background-color":"#ddd",
    });//"background-color","yellow"

    //建立新增區的按鈕
    $(".class_poi171214_box01 > poi[qwq=add]").html('');
    $(".class_poi171214_box01 > poi[qwq=add]").append('<button type="button" qwq="add" idno="'+idno+'">新增'+idno+'</button>');
    //點擊新增按鈕的反應
    $(".class_poi171214_box01 >poi> button[qwq=add]").on('click', function() {
        //console.log( $(this).attr('idno') );
        //$(this).attr("disabled", true);
        //$(this).html('done');
        var poi191001aa = $('.thread'+'[data-no='+idno+']').find('.post.threadpost > .file-thumb  ').attr('href').match(/[0-9]{13}.+$/); //找出編號底下的圖檔名稱
        poi191001aa=poi191001aa[0].match(/[0-9]{13}/); //只取數字
        console.log( poi191001aa );
        var poi191001bb = $(this).attr('idno') +'OAO'+poi191001aa;

        cookie_add( poi191001bb );//新增cookie
        cookie_list();//列出cookie(自訂函式)//更新清單
        //
        //$("button[qwq=edit]").css({"background-color":"",});
        //$("button[qwq=edit]").html('編輯');
        var aa=$(".class_poi171214_box01 > poi[qwq=list] >span.cls_poi171216_2010:contains('"+idno+"')");
        //console.log( aa );
        aa.css({
            "background-color":"white",
        });
/*
        //延遲1秒後 出現new字串提醒
        $(this).clearQueue();
        $(this).delay(1000).queue(function(){//延遲1秒後 執行隊列
            tmp=$(".class_poi171214_box01 > poi[qwq=list] >span.cls_poi171216_2010:contains('"+idno+"')").append('<span style="vertical-align:super;">new</span>');
            //console.log( tmp );
            $(this).dequeue();//清除隊列
        });//delay

*/
    });
    //
       //console.log( $("poi[qwq=button]") );
    //console.log( $(".class_poi171214_box01") );
    //console.log( $(".class_poi171214_box01").find("poi[qwq=button]") );
    //建立按鈕區的按鈕
    $(".class_poi171214_box01").find("poi[qwq=button]").html('');
    $(".class_poi171214_box01").find("poi[qwq=button]").append('<button type="button" qwq="close">收合</button>');
    $(".class_poi171214_box01").find("poi[qwq=button]").append('<button type="button" qwq="edit">編輯</button>');
    //點擊收合按鈕的反應
    $(".class_poi171214_box01 >poi> button[qwq=close]").on('click', function() {
        //console.log( $(this).parent() );
        $(this).parent().parent().css({
            "display":"none",
        });//"background-color","yellow"
    });
    //點擊編輯按鈕的反應
    $(".class_poi171214_box01 >poi> button[qwq=edit]").on('click', function() {
        cookie_list();//列出cookie(自訂函式)
        if( $("button[qwq=edit]").css('background-color') == "rgb(255, 0, 0)" ){
            //正常模式
            $("button[qwq=edit]").css({
                "background-color":"",
            });
            $(this).html('編輯');
        }else{
            //編輯模式
            //$(".class_poi171214_box01 >poi> button[qwq=add]").clearQueue();
            $(".class_poi171214_box01 > poi[qwq=list] > span.cls_poi171216_2010").append('<button type="button" qwq="del">刪除</button>');
            $(".class_poi171214_box01 > poi[qwq=list]").prepend('<button type="button" qwq="delall">全部刪除</button>');
            $(this).html('返回');
            ppp();
        }
    });


}//function ouo(){

function fnc_cookie_time(){//
    var day7 = 3600*24*7;//7天的秒數
    //
    today = new Date();
    today.setTime(today.getTime()-1000*60);	// 刪除用的過期時間
    var deltime=";expires="+ today.toUTCString(); // 刪除用的過期時間
    //console.log( deltime );
    today = new Date();
    today.setTime(today.getTime()+1000*day7);	// 新增用的時間
    var addtime=";expires="+ today.toUTCString(); // 新增用的時間
    //console.log( addtime );
    today = new Date();
    //console.log( today );
    //console.log( today.toISOString() );
    //console.log( today.toUTCString() );
    //console.log( today.toLocaleString() ); //2017/12/16 上午6:11:21
    var array_tmp = [
        today.getFullYear(),
        today.getMonth()+1,
        today.getDate(),
        today.getHours(),
        today.getMinutes(),
        today.getSeconds(),
        today.getTime(),//時間戳
    ];
    //console.log( array_tmp );
    array_tmp.forEach(function(element,index) {
        array_tmp[index]=element.toString();
        //console.log( index );
        //console.log( element );
        //console.log( element.toString().length );
        if(0<element && element<10){
            array_tmp[index]='0'+array_tmp[index];
        }
        //str.substring(3,7);
        //str.slice(-4,2);
    });
    //console.log( array_tmp ); //["2017", "12", "16", "06", "11", "21", "1513375881786"]
    //console.log("可讀時間: "+array_tmp[0]+"/"+array_tmp[1]+"/"+array_tmp[2]+" "+array_tmp[3]+":"+array_tmp[4]+":"+array_tmp[5]+"");
    //
    //this.deltime=deltime;
    //this.addtime=addtime;
    //
    var x=[];
    x.deltime=deltime;
    x.addtime=addtime;
    return x;
}//function cookie_time(){//

function cookie_list(){//
    //console.log( '[]'+document.cookie );
    if(document.cookie !== ""){  //有coolkie執行這部份
        $(".class_poi171214_box01 > poi[qwq=list]").html('');
        var cc=0;
        var array_tmp = [];
        var array_tmp2 = [];
        array_tmp = document.cookie.split(";");
        array_tmp.forEach(function(element,index){ //遍歷所有元素
            array_tmp[index]=array_tmp[index].trim();//去掉頭尾空白
            array_tmp[index]=array_tmp[index].split("="); //分解字串
            //if( /poi[0-9]+/.test( array_tmp[index][0] ) ){
            if( array_tmp[index][0].includes("poi") ){ //找自訂cookie
                if(array_tmp[index][0] == 'poi001'){ //找自訂cookie
                    if(array_tmp[index][1] === ''){
                        //cookie沒有值
                    }else{
                        cc++;
                        array_tmp[index][1]=array_tmp[index][1].split(","); //分解字串
                        array_tmp[index][1].forEach(function(element,index){
                            //if(element == 999 ){return;}//
                            var aa=element.split("OAO"); //分解字串
                            //console.log( aa );
                            $(".class_poi171214_box01 > poi[qwq=list]").append('<span class="cls_poi171216_2010" idno="'+aa[0]+'"><img src="http://ram.komica2.net/00/thumb/'+aa[1]+'s.jpg" style="width: 40px; height: 40px;"><a href="./pixmicat.php?res='+aa[0]+'" target="_blank">'+aa[0]+'</a></span>');
                            //console.log( element );
                        });//forEach
                    }
                }//if-poi001
            }//if
        });//foreach
        if(cc>0){ //有找到cookie
            //沒事
        }else{
            $(".class_poi171214_box01 > poi[qwq=list]").append('沒有紀錄');
        }
        //css樣式
        $(".cls_poi171216_2010").css({
            "display":"block",
            "border": "1px solid #999999",
        });//"background-color","yellow"        //
    }else{
        $(".class_poi171214_box01 > poi[qwq=list]").html('沒有cookie');
    }//if
}//function cookie_list(){//


function cookie_add(x){//
    console.log( x ); //字串
    var idno=x.split("OAO");//傳入的id編號
    var idno2=x;
    console.log( idno ); //陣列
    //
    //事先處理過的時間字串
    //var cookie_time = new fnc_cookie_time(); //this
    //console.log( cookie_time.addtime );
    var cookie_time = fnc_cookie_time();
    //console.log( fnc_cookie_time().addtime );
    //console.log( cookie_time.addtime );
    //
    //document.cookie="poi123=0123456789"+cookie_time.addtime;//測試_建立cookie
    document.cookie="poi000=poi";//測試_建立cookie
    if(document.cookie !== ""){  //有coolkie執行這部份
        //console.log( document.cookie ); //cookie改變前
        document.cookie = "poi000=000"+cookie_time.deltime;//測試_刪除cookie
        //cookie清單
        var tmp = '';
        var array_tmp = [];
        var array_tmp2 = [];
        array_tmp = document.cookie.split(";"); //分解cookie字串
        for(i=0;i<array_tmp.length; i++) { //遍歷
            array_tmp[i]=array_tmp[i].trim();//去掉頭尾空白
            //console.log( array_tmp[i] );
            array_tmp[i] = array_tmp[i].split("="); //分解cookie字串
            //console.log( array_tmp[i][0] );
            //console.log( array_tmp[i][0].search(/poi[0-9]+/) ); //找到=大於等於0 沒找到=-1
            //console.log( array_tmp[i][0].match(/poi[0-9]+/) ); //找到=回傳陣列 沒找到=null
            //console.log( /poi[0-9]+/.test( array_tmp[i][0] ) ); //找到=true 沒找到=false
            //console.log( array_tmp[i][0].includes("poi")  ); //找到=true 沒找到=false

            //if( array_tmp[i][0].search(/poi[0-9]+/) >=0 ){
            //if( array_tmp[i][0].match(/poi[0-9]+/)  ){

            //取出自訂cookie
            //if( /poi[0-9]+/.test( array_tmp[i][0] ) ){
            if( array_tmp[i][0].includes("poi") ){

                //console.log( '找到'+array_tmp[i][0] );
                //console.log( array_tmp[i][0]+'/'+array_tmp[i][1] );
                if(array_tmp[i][0] == 'poi001'){
                    //console.log( '找到'+array_tmp[i][0] );
                    array_tmp[i][1]=array_tmp[i][1].split(","); //分解cookie字串
                    //console.log( array_tmp[i][1] );
                    array_tmp[i][1].sort();//排序
                    //console.log( array_tmp[i][1] );
                    if( array_tmp[i][1].includes(idno[0]) ){
                        $(".class_poi171214_box01 >poi> button[qwq=add]").html('已存在');
                        //console.log( '已存在' );
                    }else{
                        array_tmp[i][1].push(idno2);//加入資料
                        $(".class_poi171214_box01 >poi> button[qwq=add]").html('已加入');
                        //console.log( '已加入' );
                    }
                    //console.log( array_tmp[i][1] );
                    array_tmp[i][1].reverse();//反轉排序
                    array_tmp[i][1]=array_unique(array_tmp[i][1]);//刪除重複的資料(自訂函式)
                    array_tmp[i][1]=array_tmp[i][1].join();//合併成字串 預設用逗號分隔
                    //console.log( array_tmp[i][1] );
                    tmp=array_tmp[i][1];
                }
            }
        }//for
        //console.log( tmp );
        //tmp資料沒變動就直接新增 //沒找到poi001
        if(tmp===''){tmp=idno2;}
        //console.log( cookie_time.addtime );
        document.cookie = "poi001="+tmp+cookie_time.addtime;//寫入新的cookie
        console.log( document.cookie ); //cookie改變後
        //更新清單
    }//if

}//function cookie_time(){//

function array_unique(x){//
    var array_tmp=x;//傳入的陣列
    var array_tmp2=[];
    //有超過一個cookie才比對
    if(array_tmp.length>1){//if
        array_tmp.forEach(function(element,index){
            //只允許數字內容
            if( /[0-9]+/.test( element ) ){
                if(array_tmp2.includes(element)){//沒重複才加入
                    //沒事
                }else{
                    if( /[0-9]+/.test( array_tmp[i][0] ) ){//只允許全數字
                        array_tmp2.push(element);//加入資料
                    }
                }
            }
        });//forEach
    }else{
        array_tmp2=array_tmp;
    }
    //array_tmp.push('999');
    //
    x=array_tmp2;
    return x;
}








