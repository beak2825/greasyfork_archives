// ==UserScript==
// @name         今年一定島 看大圖
// @description  汲汲營營大報社
// @author       稻米
// @version      2023.11.02.0010.build16299
// @namespace    https://greasyfork.org/zh-TW/scripts/39037

// @match        *://gaia.komica.org/00b/*
// @match        *://gaia.komica1.org/00b/*
// @match        *://gaia.komica2.cc/00b/*
// @match        *://gita.komica1.org/00b/*

// @exclude      *://*/00b/src/*
// @exclude      *://*/00b/thumb/*

// @grant        none
// @license      WTFPL


// @downloadURL https://update.greasyfork.org/scripts/39037/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E7%9C%8B%E5%A4%A7%E5%9C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/39037/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E7%9C%8B%E5%A4%A7%E5%9C%96.meta.js
// ==/UserScript==

//jquery
try{
    $(document).ready(function() {
        //console.log( 'jquery ready' );
        //全域變數//global
        //time = new Date();
        //gg=[];
        //gg.time=time;
        //$.gginin=gg;
        //
        poi();
    });
    //throw "is empty";
}
catch(err){}
finally{}


function poi(){
    //console.log(window.location.href);
    //window.location.href.match("\\?res=")
    //console.log(tmp);
    var FFF='';
    FFF=window.location.href;
    //網址不正確
    if( FFF.match("\\?res=") ){
        //沒事
    }else{
        //console.log('非回應');
        return 0;//網址不正確 中止
    }
    //回應模式只有一串討論串
    if( $('div.thread').length == 1 ){
        //沒事
    }else{
        return 0;//不正確 中止
    }
    //
    FFF='';
    FFF=$('body').attr('poi220815b');
    if( FFF == 1 ){
        return 0;//只執行一個腳本 中止
    }else{
        $('body').attr('poi220815b','1');
    }
    //
    poi建立啟動按鈕();//

}
function poi建立啟動按鈕(){
    //console.log(arguments.callee.name); //poi2
    //$("#threads").before('before');
    $(".thread").before('<poi><button type="reset">看大圖</button></poi>');
    $("poi >button:contains('看大圖')").click(function(){
        //console.log('按鈕');
        poi建立控制台();
    });
    //

}//poi2(){

/*
height:auto; width:auto;
min-width:20px; min-height:20px;
max-width:250px; max-height:250px;

*/
function poi建立控制台(){

    var FFF=$('#poi220815box');
    if( FFF.length > 0 ){
        return 0;//只產生一個控制台 中止
    }else{
        //沒事
    }
    //

    $('.thread').prepend('<div id="poi220815box">控制台</div>');
    //控制台樣式
    $('#poi220815box').css({
        'background':'rgb(200,200,200)',
        'color':'rgb(100,100,100)',
        'text-align':'initial',
        'width':'100px',
        'height':'50px',
    });

    FFF='';
    $('#poi220815box').after('<div id="poi221127bar">最大寬度</div>');

    var aa=$('#threads').innerWidth();
    aa=aa*0.9;

    $('#poi221127bar').css({
        'background':'rgb(200,200,200)',
        'color':'rgb(100,100,100)',
        'text-align':'initial',
        'width':''+aa+'px',
        'height':'10px',
        //'overflow':'hidden',
    });



    //把大圖關閉 變成縮圖
    var 目前的討論串=$('.thread');
    FFF=目前的討論串.find('.expanded-element.expanded-close');//原圖的元素
    //console.log( FFF );//ok
    FFF.each(function( index,item ){//遍歷元素
        //console.log( '把大圖關閉 變成縮圖' );//ok
        $(item).trigger('click');//模擬點擊 //原圖變成縮圖
    });
    //
    poi找出圖片();

}
function poi找出圖片(){
    var ary=[];
    $(".post").each(function(index,item){
        //console.log( index,item );//this
        var FFF='';
        FFF=$(item).find('.file-thumb');//找縮圖
        //console.log( FFF );
        //有找到
        if(FFF.length >0){
            //console.log( FFF[0] );
            var imgurl='';
            imgurl=$(FFF[0]).attr('href');//取得原圖網址
            //console.log( imgurl );
            //只接受jpg
            var cc=0;
            if( /jpg$/.test( imgurl ) ){ cc=cc+1;}//允許jpg
            if( /png$/.test( imgurl ) ){ cc=cc+1;}//允許png
            //true
            if(cc>0){
                //有符合一個就繼續
                ary.push( FFF );
            }else{
                //沒事
                //return 'skip';//跳過本次each迴圈
            }//if
        }//if
    });//each

    //
    if(ary.length >0){
        //沒事
    }else{
        console.log( '沒有符合的對象' );
        $('#poi220815box').text( '0符合' );//更新狀態
        return 0;//中止
    }//if

    ary=[0,ary];//加上迴圈計數器
    //
    var traveler=ary;
    console.log( traveler ); //[0,jq元素]
    poi展開大圖(traveler);//一張一張打開

}//poi找出圖片()

function poi展開大圖(traveler){
    //console.log( 'poi展開大圖' );
    //console.log( traveler );
    var ary=traveler;//[0,jq元素]
    //
    var cc=ary[0];
    var aaa=ary[1][cc];
    //

    //檢查loop迴圈範圍
    if( cc < ary[1].length){
        //console.log( 'yy' );
    }else{
        console.log( 'END' );
        $('#poi220815box').append('END');//更新狀態
        return 0;//中止
    }//if

    $('#poi220815box').text('('+ (cc+1) +'/'+ ary[1].length +')');//更新狀態
    //console.log( traveler );


    //console.log( aaa ); //有縮圖的元素
    //console.log( aaa[0] );

    //////aaaaaaaaaaaaaaa
    var imgurl='';
    imgurl=aaa.attr('href');//取得原圖網址
    //console.log( imgurl );
    //return 0;//中止

    //jpg使用CDN1 速度較快
    if( /jpg$/.test( imgurl ) ){
        //CDN1
        //imgurl=imgurl.substr(2);
        //imgurl='https://i0.wp.com/'+imgurl+'?fit=2048,2048&quality=85';//&&quality=85
        //imgurl='http:'+imgurl;
        //imgurl='https://images.weserv.nl/?url=' + imgurl + '&output=jpg&q=85&filename=' + imgurl.match(/[0-9]{10,}/) +'&w=2048&h=2048&fit=inside&we';//

    }//允許jpg
    if( /png$/.test( imgurl ) ){
        //CDN2
        //imgurl='http:'+imgurl;
        //imgurl='https://images.weserv.nl/?url=' + imgurl + '&output=jpg&q=85&filename=' + imgurl.match(/[0-9]{10,}/) +'&w=2048&h=2048&fit=inside&we';//
    }//允許png
    //wordpress的CDN會把圖片處理成webp 速度更快 但有人不喜歡webp
    //
    //console.log( imgurl );//原圖網址+CDN
    //


    poi展開大圖3(traveler,imgurl);//直接顯示圖片

    //使用xhr抓取圖片轉 再換成blob內容的jpg格式 下載檔案格式是jpg
    //poi展開大圖2(traveler,imgurl);


}//poi展開大圖(in1)


function poi展開大圖2(traveler,in2){
    //console.log( 'poi展開大圖2' );
    //console.log( traveler,in2 );
    var ary=traveler;//[0,jq元素]
    var imgurl=in2;//cdn網址
    //

    //使用xhr取得圖片
    var xhr = new XMLHttpRequest();
    xhr.onprogress = function(e){
        //console.log( 'xhr.onprogress' );
        var aa=0.0 + (e.loaded / e.total);
        aa= (aa * 100);//百分比
        var aa3 = aa.toFixed(2);//取小數2位
        var new_aa='';
        new_aa=''+aa3+'%';
        //console.log( new_aa );
        var ee = document.querySelector("#poi221127bar");
        //var aa = document.getElementById('poi221127bar');
        ee.innerHTML=new_aa;


    };
    //注意!非同步
    xhr.onreadystatechange = function(e){
        if(this.readyState == 4){
            if( this.status == 200 ){
                console.log( this.getAllResponseHeaders() );
                var blob內容 = window.URL.createObjectURL(this.response);
                //console.log( this );
                poi展開大圖3(traveler,blob內容);
                //return blob內容;
            }
        }
    };

    xhr.open('GET', imgurl);
    xhr.responseType = 'blob';
    xhr.send();

    //

}//

function poi展開大圖3(traveler,in2){
    //console.log( 'poi展開大圖3' );
    //console.log( traveler,in2 );
    //
    var ary=traveler;//[0,jq元素]
    var imgurl=in2;// blob網址
    //
    var cc=ary[0];//
    var aaa=ary[1][cc];//縮圖
    //
    //console.log( cc,aaa );
    aaa.after('<br clear=both>');//避免文繞圖 讓圖片展開到最寬

    var FFF=aaa.find('img');
    //console.log( FFF );
    var aaa_img=$(FFF[0]);
    //console.log( aaa_img );//file-thumb
    //
    //console.log( cc,aaa );
    //console.log( aaa );

    var aa=$('#poi221127bar').width();
    aaa_img.attr('src','');
    aaa_img.attr('src',imgurl);
    aaa_img.attr('style','display:block;width:auto;max-width:'+aa+'px;height:auto;max-height:'+aa+'px;border:2px blue solid;margin:0px;');//max-width:100%;=不要超出螢幕
    //
    aaa_img.one("load",function(){ //執行一次 //圖片讀取完成
        console.log( 'load' );//圖片讀取完成
        //
        //jq動畫當計時器
        $("#poi220815box").fadeOut( 100 ).fadeIn( 100 ,function(){ //animate
            traveler[0]=cc+1;
            poi展開大圖(traveler);//下一個
        });

    });
/*
注意：使用 on() 方法添加的事件处理程序适用于当前及未来的元素（比如由脚本创建的新元素）。
提示：如需移除事件处理程序，请使用 off() 方法。
提示：如需添加只运行一次的事件然后移除，请使用 one() 方法。
*/
    //$(this).find('img').after('<br clear=both>');
    //.css({'display':'',});

    //用jq動畫計算下一個的延遲
    /*
fadeIn()	逐渐改变被选元素的不透明度，从隐藏到可见
fadeOut()	逐渐改变被选元素的不透明度，从可见到隐藏
*/
    //$("#poi220815box").slideUp( 1000 ).slideDown( 1000 ,function(){

    //
    return 0 ;//停止
}//poi展開大圖3






