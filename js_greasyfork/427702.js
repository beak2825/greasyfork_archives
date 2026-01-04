// ==UserScript==
// @name         今年一定島 討論串收合輔助
// @description  汲汲營營大報社
// @author       稻米
// @namespace    https://greasyfork.org/zh-TW/scripts/427702
// @version      2024.07.23.0020.build16299

// @match        *://gaia.komica.org/00b/*
// @match        *://gaia.komica1.org/00b/*
// @match        *://gaia.komica2.cc/00b/*
// @match        *://gita.komica1.org/00b/*

// @exclude      *://*/00b/src/*
// @exclude      *://*/00b/thumb/*

// @grant        none
// @license      WTFPL

// @downloadURL https://update.greasyfork.org/scripts/427702/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E8%A8%8E%E8%AB%96%E4%B8%B2%E6%94%B6%E5%90%88%E8%BC%94%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/427702/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E8%A8%8E%E8%AB%96%E4%B8%B2%E6%94%B6%E5%90%88%E8%BC%94%E5%8A%A9.meta.js
// ==/UserScript==

$(document).ready(function() {
    var FFF='';
    FFF=$("body").attr('poi211223');
    if(FFF){
        //console.log( 'yy' );
        console.log( '重複的腳本?' );

    }else{
        //console.log( 'nn' );
        $("body").attr('poi211223','1');
        poi();
    }

});

function poi(){
    var aa =$('body').find('.thread');
    //console.log( aa );
    //console.log( '討論串收合輔助' );

    //
    aa.each(function( index,item ){//個別討論串
        //var aa2=$(item).find('.-expand-thread.text-button');
        var aa2=$(item).find('.warn_txt2');

        //console.log( aa2 );
        aa2.attr('poi210608','123');
        var FFF=$(item).attr('data-no');
        aa2.after('<div class="poi210609" poi="'+FFF+'"> 💊 </div>');
        $('.poi210609').css({
            //'width':'40px',
            //'height':'2px',
            //'border':'1px solid #0FF',
            'display':'inline-block',
            'pointer-events':'none',
            'user-select':'none',
        });

        var aa3=$(item).find('.-expand-thread.text-button');
        if(aa3.length>0){
            //console.log(aa3); //找到一個 展開按鈕
        }else{
            return;//停止
        }
        aa3.css({
            "background-color":"yellow",
            "border":"1px solid #000",
        });//按鈕上色

        aa3.on('click',function(e){ //點擊後的行為
            //console.log('click 點擊原生展開按鈕'); //ok
            //console.log(this); //ok
            //poi2( item );//標記
            $(item).css({
                "border-left":"10px solid #0FF",
            });//box左側的粗線醒目顯示
            $(item).find('div.post.reply').css({
                "border-left":"4px solid #0FF",
            });//box左側的粗線醒目顯示

            //
            poi3( item );//跑動畫 等待ajax
        });

        return;


    });
}//poi



function poi2(in1){//直接抓會找不到動態元素 //非同步出現的動態元素
    //console.log( in1 );//展開的討論串
    //return;
    var aa =$( in1 ).find('.post-head');//留言的日期時間
    aa.each(function( index,item ){
        //console.log( item );
        $(item).prepend('p');//標記 //抓不到動態元素
    });
}//poi2

function poi3(in1){//跑動畫 等待ajax
    //console.log( in1 );//展開的討論串
    //return;
    var FFF=$(in1).attr('data-no');
    //console.log( FFF );//討論串編號
    var aa =$( in1 ).find('.poi210609[poi="'+FFF+'"]');//
    //console.log( aa );
    //return;
    $.poi210609=0;//全域變數
    //
    poi3b(aa[0]);//循環動畫
}//poi3


function poi3b(in1){//循環動畫
    //console.log( in1 ); //新增的動態元素 //旋轉的元素
    var 旋轉的元素=in1;
    var 目前的討論串=$(in1).parent().parent();//討論串
    //console.log( 目前的討論串 );
    //
    $(in1).animate( {變數: 180}, {
        duration: 100,
        //easing:'linear',
        step: function(now, fx){
            //console.log(now, fx); //ok
            $(this).css({'transform':'rotate('+now+'deg)'});
        },
    }).animate( {變數: 360}, {
        duration: 100,
        //easing:'linear',
        step: function(now, fx){
            //console.log(now, fx); //ok
            $(this).css({'transform':'rotate('+now+'deg)'});
        },
    }).animate( {變數: 0}, {
        duration: 0,
        easing:'linear',
        step: function(now, fx){
            //console.log(now, fx); //ok
            $(this).css({'transform':'rotate('+now+'deg)'});
        },
        complete: function(){
            var FFF=$.poi210609;//全域變數
            $.poi210609=FFF+1;
            if(FFF>=20){//跑太多次後停止 //最多跑20次 約2秒//
                $(in1).finish();//停止動畫
                $(in1).css({'transform':'rotate(0deg)'});//恢復變形角度
                $(in1).html('???');//錯誤訊息
                return;
            }

            FFF=目前的討論串.find('.-collapse-thread.text-button');//原生的收合按鈕
            //console.log( FFF ); //ok
            if(FFF.length >0){//找到展開後的動態元素 //會找到一個
                $(in1).finish();//找到就停止動畫
/*
.finish()
Stop the currently-running animation, remove all queued animations, and complete all animations for the matched elements.
.stop()
Stop the currently-running animation on the matched elements.
*/
                $(in1).css({'transform':'rotate(0deg)'});//恢復變形角度


                poi4(FFF);//添加自訂的收合按鈕
            }else{
                poi3b(旋轉的元素);//循環
            }//if

        },
    })
    ;

}//poi3b

function poi4(in1){//控制收合按鈕
    //console.log( 'poi4' );
    //console.log( in1 ); //文字按鈕 //上下兩個
    var 收合按鈕=in1;
    var 目前的討論串=$( in1[0] ).parent().parent().parent();//討論串
    //console.log( 目前的討論串 );
    $(in1[0]).css({
        "background-color":"yellow",
        "border":"1px solid #000",
    });//收合按鈕上色

    var aa=目前的討論串.find('.post-head');//留言的日期時間 //多個
    //console.log( aa ); //ok //有抓到展開的元素

    //.find('.post-head');//留言的日期時間
    //return;
    aa.each(function( index,item ){//遍歷元素
        //console.log( item );
        //$(item).prepend('g');//標記 //有抓到展開的元素
    });
    $(收合按鈕).on('click',function(e){ //點擊自訂收合按鈕後的行為
        console.log('click');
        目前的討論串.css({
            "border-left":"",
        });//移除box左邊的醒目顯示
        目前的討論串.find('.poi210609his1342').remove();//移除自訂收合按鈕

        var aa=目前的討論串.find('.-expand-thread.text-button');//原生的展開按鈕
        //console.log(aa);//有抓到
        //下面是重複利用的部分
        aa.css({
            "background-color":"yellow",
            "border":"1px solid #000",
        });//收合按鈕上色

        //對新產生的原生收合按鈕再次綁定事件 //動態產生的新元素
        aa.on('click',function(e){ //點擊後的行為
            console.log('click'); //ok
            //console.log(this); //ok
            //poi2( 目前的討論串 );//標記
            $(目前的討論串).css({//box左邊的醒目提示
                "border-left":"10px solid #0FF",
            });//box左側上粗線醒目顯示
            poi3( 目前的討論串 );//跑動畫 等待ajax

        });//click //重新綁定事件 //展開按鈕
    });//click //收合按鈕
    //
    poi4b(目前的討論串);//自訂收合按鈕

}//poi4

function poi4b(in1){//自訂收合按鈕
    var FFF='';
    //console.log( 'poi4b' );
    var 目前的討論串=in1;
    var aa=$(目前的討論串).find('.post.reply');
    //console.log( aa ); //ok
    aa.css({
        'position':'relative',
    });
    aa.each(function( index,item ){//遍歷元素
        $(item).append('<div class="poi210609his1342">poi210609his1342</div>');
    });
    目前的討論串.find('.poi210609his1342').css({
        'position':'absolute',
        'bottom':'0px',
        'right':'0px',
        'width':'40px',
        'height':'19px',
        'background':'#0FF',
    });
    目前的討論串.find('.poi210609his1342').html('收合');
    //綁定事件
    //點擊自訂收合按鈕後的行為
    目前的討論串.find('.poi210609his1342').on('click',function(e){
        //console.log( '點擊自訂收合按鈕後的行為' ); //this
        //console.log( 目前的討論串 ); //this
        var aa=目前的討論串.find('.-collapse-thread.text-button');//討論串裡的原生收合按鈕
        
        //console.log( aa[0] ); //ok //有兩個

        //要先收縮圖 再收合才不會歪
        //關閉原圖 變成縮圖
        FFF=目前的討論串.find('.expanded-element.expanded-close');//原圖的元素
        //console.log( FFF );//ok
        FFF.each(function( index,item ){//遍歷元素
            $(item).trigger('click');//模擬點擊 //原圖變成縮圖
        });

        //關閉影片 變成縮圖
        FFF=目前的討論串.find('.expanded-close.text-button');//影片的原生關閉按鈕元素
        //console.log( FFF );//ok
        FFF.each(function( index,item ){//遍歷元素
            $(item).trigger('click');//模擬點擊 //影片變成縮圖
        });

        //
        //要先收縮圖 再收合才不會歪
        $(aa[0]).trigger('click');//模擬點擊原生收合按鈕




        //

        console.log( '取得box位置' );
        //FFF=目前的討論串.find('.warn_txt2');
        FFF=目前的討論串.find('.post.threadpost');
        //console.log( FFF );
        FFF.css({
            'box-sizing': 'border-box',
            "border-right": "10px solid #0FF",
        });
        FFF.animate({
            'borderRightWidth':'0px',
        },1000,'linear',function(){
            //FFF=目前的討論串.find('.post.threadpost').first().attr('id');//
            //window.location.hash='#'+FFF;//取得id位置//同樣的hash會無法取得位置
        });
        //
        FFF=目前的討論串.find('.post.threadpost').prop('offsetTop');
        $(document).scrollTop(FFF);//捲軸移動到討論串的開頭

//box-sizing: border-box;
    });//click

}

/*
requestAnimationFrame

*/