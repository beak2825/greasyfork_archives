// ==UserScript==
// @namespace    https://greasyfork.org/zh-TW/scripts/390589
// @name         今年一定島 旋轉圖片
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

// @downloadURL https://update.greasyfork.org/scripts/390589/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%97%8B%E8%BD%89%E5%9C%96%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/390589/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%97%8B%E8%BD%89%E5%9C%96%E7%89%87.meta.js
// ==/UserScript==





//jquery
try{
    $(document).ready(function() {
        //console.log( 'jquery ready' );
        //time = new Date();
        window.gg190928=[];
        //
        poi();
        color();
    });
    //throw "is empty";
}
catch(err){}
finally{}

function poi(){
    //檢查是不是回應模式
    var aa=$("div.bar_reply:contains('回應模式')");
    if( aa.length ){
        poi2(); //添加按鈕
        //poi4(); //直接點
    }
    
    //poi4(); //測試
}
function poi2(){
    //添加按鈕
    $(".thread").before('<poi><button type="button">旋轉圖片</button></poi>');
    var cc=0;
    $("poi > button:contains('旋轉圖片')").click(function(){
        console.log( '被按了' );
        if(cc>0){
            //沒事
        }else{
            $('.threadpost').after('<br clear=both>旋轉圖片');
            poi4();//綁定事件
            cc++;//只綁定一次
        }
    });
}
function poi4(){
    //綁定事件在body上 才抓得到動態新增的元件
    //var aa=$('body').on('click','.file-thumb',poi4_on);
    //$('.file-thumb').click(poi4_on);
    $('.file-thumb').on( "click",{value:1},poi4_on); //綁定事件
    //var aa=$._data( $('.file-thumb')[0], "events");
    //console.log( aa.click[1].handler.name);

}

function poi4_on(){
    console.log( 'poi4_on' );

    //if( v["image"].match(/\.webm$/)){
    //console.log( $(this) );
    //console.log( $(this).parent() );
    //console.log( $(this).children() );
    var bb=$(this).parent().find('.-expanded').find('img');
    console.log( bb );
    var bb2=bb.offset();
    //console.log( bb2 );
    var bb3=bb.attr('src');
    //console.log( bb3 );
    var bb_ww=bb.width();
    var bb_hh=bb.height();
    console.log( bb_ww,bb_hh );
    //window.gg190928=[bb_ww,bb_hh];
    $.data( $('#contents'), "qwq", {aaa: bb_ww, bbb:bb_hh,});
    //console.log( $.data( 暫存, "qwq" ) );

    //檢查點開的是不是圖片
    if(bb2){
        //console.log( 'if' );
        poi5(this);
    }//if
}

function poi5(in1){
    var _this=in1;
    console.log( $(_this) );//[a.file-thumb]
    //
    var cc=$(_this).parent().find('.-expanded');
    console.log( cc );
    var str='<div class="poi190928c">旋轉</div>';

    console.log( $('.poi190928c') );

    cc.append(str);
    //添加一個相對位置的元件
    cc.css({
        'position':'relative',
    });
    var dd=$('.poi190928c');
    console.log( dd );
    dd.css({
        'position':'absolute',
        'top':'10px',
        'left':'10px',
    });

    //把添加的元件 當成按鈕
    poi6(dd);



}//poi5


function poi6(in1){
    var dd=in1;//$('.poi190928c')
    //console.log( window.gg190928 );
    //console.log( $.data( $('#contents'), "qwq" ) );
    //
    var deg=0;
    var deg2=0;
    var info=0;
    var info2=0;
    var top_dd=0;
    var left_dd=0;
    var ww=0;
    var hh=0;
    var ww2=0;
    var hh2=0;
    dd.click(function(){
        console.log( $(this) );//$('.poi190928c')
        var div_expanded=$(this).parent(); //$('.-expanded')
        console.log( div_expanded );
        var img=$(this).parent().find('img');
        console.log( img );
        //紀錄原始長寬
        //if(info==0){info=img.offset();}
        info=div_expanded.offset(); //採用div_expanded的位置
        if(ww==0){ww=img.width();}
        if(hh==0){hh=img.height();}
        console.log( ww,hh );
        var max=Math.max(ww, hh);

        //處理角度
        deg=deg+90;
        deg=deg%360;
        deg2=Math.floor(deg/90);
        console.log( deg,deg2 );
        //
        switch(deg2) {
            case 0: //0度
                top_dd=0;
                left_dd=0;

                break;
            case 1: //90度
                top_dd=0;
                left_dd=hh;

                break;
            case 2: //180度
                top_dd=hh;
                left_dd=ww;

                break;
            case 3: //270度
                top_dd=ww;
                left_dd=0;

                break;
            default:
        }
        //
        img.css({
            'transform':'rotate('+deg+'deg)',
            'transform-origin':'top left',
            'position':'relative',
            'top':''+top_dd+'px',
            'left':''+left_dd+'px',
        });


        //info2=img.offset();
        info2=div_expanded.offset();
        console.log( info,info2 );

        img.css({
        });

    });//click

}//poi6

function color(){
    //console.log( 'color' );
    $('.cls190216').css({
        'display':'inline',
        "background-color":"rgb(200,255,255)",
        "border":"1px solid #FFF",
    });//連結上背景色 不想上色就把這段刪除


}//function color(){

