// ==UserScript==
// @name        推特手機版網頁 top v2
// @description description
// @author      author
// @namespace   https://greasyfork.org/zh-TW/scripts/375902
// @require     https://code.jquery.com/jquery-3.7.0.min.js
// @version     250509.4



// @include     *//x.com/*




// @downloadURL https://update.greasyfork.org/scripts/375902/%E6%8E%A8%E7%89%B9%E6%89%8B%E6%A9%9F%E7%89%88%E7%B6%B2%E9%A0%81%20top%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/375902/%E6%8E%A8%E7%89%B9%E6%89%8B%E6%A9%9F%E7%89%88%E7%B6%B2%E9%A0%81%20top%20v2.meta.js
// ==/UserScript==

//jquery
//https://code.jquery.com/jquery-3.7.0.min.js
//https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js
//https://gist.github.com/wotupset/4d9df8a65b3d571d4a462d58f99f9f20

try{
    $(document).ready(function() {
        console.log( 'document ready' );//不會執行這段
        //poi();
        $.poi200114_poi2url='';
        setTimeout(function() {
            poi();
        }, 1000);
    });
    //throw "is empty";
}
catch(err){}
finally{}

document.addEventListener("DOMContentLoaded",function(e){
    console.log( "DOMContentLoaded" );
});
document.addEventListener('readystatechange', function(e){
    console.log( 'readystatechange',this.readyState );
});
window.addEventListener('popstate', function(e){
    console.log( 'popstate' );
});
window.addEventListener('hashchange', function(e){
    console.log( 'hashchange' );
});
window.addEventListener('locationchange', function(){
    console.log('locationchange');
})
window.addEventListener('load', function(e){
    console.log( 'load' );
    //window.poi200114_poi2url='';
    //poi();//window.location.href
});

function poi(){
    setTimeout(function(e){
        if(window.location.href == $.poi200114_poi2url){
            //沒事
            console.log( '網址沒變');
        }else{
            //
            console.log( '網址改變了',window.location.href );
            $.poi200114_poi2url =window.location.href;
            //poi_findimg();//顯示圖片長寬
            //poi230124計時間隔();//=>poi_findimg2();//顯示圖片長寬2
            poi_goto_top();//到網頁頂端
            poi250508尋找圖片();
            //poi250508測試();
        }
        //

        poi();//loop
    }, 1*1000);


}

function poi250508測試(){
    console.log('poi250508測試');
    var aa=$('div[role="group"]'); //中文介面限定?? //右下聊天欄位要收起來
    //console.log(aa);
    aa=aa.find('div[role="dialog"]'); //中文介面限定?? //右下聊天欄位要收起來
    console.log(aa);
    aa=aa.children().first();
    console.log(aa);
    aa=aa.children().first();
    console.log(aa);
    aa=aa.find('img');
    console.log(aa);

    console.log(aa.length);
    if(aa.length >0){
        //找到圖片
        console.log('找到圖片');
    }


}//poi250508測試()

function poi250508尋找圖片(){
    console.log('poi250508尋找圖片');
    //
    var FFF;
    FFF=function(){
        //console.log( '匿名函式' );
        if($(".poi200707").length >0){
            //$(".poi200707").remove();//ee1.length
            $(".poi200707").html('123');
        }else{
            var str='<div class="poi200707">poi200707</div>';
            $('body').append( str );//加入自訂div//header
            $(".poi200707").css({
                'z-index': '10',
                'position':'fixed',
                'top':'60px',
                'left':'40px',
                'pointer-events':'none',
            });
            //$(".poi200707").css('pointer-events','none');
        }
    };
    FFF();//匿名函式
    //
    var url=window.location.href;
    if( url.search("status") < 0 ){
        console.log('網址不符合');
        return;
    }
    var re = /photo\/([0-9])/;
    var found = url.match(re);
    if(found){
        var 第幾張圖片 =found[1];//數字 1~4
    }
    console.log('第幾張圖片='+第幾張圖片);
    //
    var aa=$('div[role="group"]'); //中文介面限定?? //右下聊天欄位要收起來
    //console.log(aa);
    aa=aa.find('div[role="dialog"]'); //中文介面限定?? //右下聊天欄位要收起來
    console.log(aa);
    aa=aa.children().first();
    console.log(aa);
    aa=aa.children().first();
    console.log(aa);
    aa=aa.find('img');
    console.log(aa);

    if(aa.length){
        //找到圖片
    }else{
        console.log( '找不到圖片?' );//jpg
        return;
    }
    //
    //找到圖片
    FFF=[aa,第幾張圖片];
    poi250508尋找圖片2(FFF);


    //

    //
}//poi250508尋找圖片()
function poi250508尋找圖片2(in1){
    console.log('poi250508尋找圖片2');
    var [aa,第幾張圖片]=in1;
    //

    aa=aa[第幾張圖片-1];
    console.log( aa );
    if(aa){}else{
        console.log( '圖片存在嗎?' );//jpg
        return;
    }

    //
    let parseURL = new URL( aa.src );//圖片連結
    var pic_format=parseURL.searchParams.get("format");
    console.log( pic_format );//jpg
    if(pic_format){}else{
        console.log( '圖片格式?' );//jpg
        return;
    }

    //



    var FFF=[];
    if(aa?.naturalWidth){
        //沒事
        console.log( '長寬2',aa.naturalWidth , aa.naturalHeight );
        FFF=[aa.naturalWidth , aa.naturalHeight,pic_format];
        poi250508尋找圖片3(FFF);
    }else{
        aa.addEventListener('load', function(e) {
            console.log( '圖片載入2',aa.naturalWidth , aa.naturalHeight );
            FFF=[aa.naturalWidth , aa.naturalHeight,pic_format];
            poi250508尋找圖片3(FFF);
        });
    }
}//poi250508尋找圖片2

function poi250508尋找圖片3(in1){
    console.log('poi250508尋找圖片3');
    console.log( in1 );
    var [ww,hh,pic_format]=in1;
    //

    //

    var ss1=''+ww +'x'+ hh+'#'+pic_format;
    var ss2='';
    ss2=ss2+'<span style="color:#FF0000;">'+ss1+'</span><br/>';
    ss2=ss2+'<span style="color:#00FF00;">'+ss1+'</span><br/>';
    ss2=ss2+'<span style="color:#0000FF;">'+ss1+'</span><br/>';
    ss2=ss2+'<br/>';

    $(".poi200707").prepend(ss2);


}//poi250508尋找圖片3


function poi_goto_top(){
    if( $('#poi190419').length == 0 ){
        //沒是
    }else{
        return 0;
    }
    var elem2 = document.querySelector("header");
    if(elem2){
        var elem3 = document.querySelector("#poi190419");
        if(elem3){
            elem3.outerHTML='';
        }
        elem2.insertAdjacentHTML('beforeend', '<div id="poi190419">www</div>');
        elem3 = document.querySelector("#poi190419");
        //console.log( elem3 );
        elem3.innerHTML='<a href="#top">TOP</a>';
        var str=`123`;
        if(str == 123){
            //console.log( '支援' );
        }else{
            console.log( '不支援' );
        }
        str=`
position: fixed;
left:0px;
top:100px;
border:1px solid red;
display: inline-block;
width:auto;
height:auto;
index-z:auto;
`;
        //pointer-events:none;
        elem3.setAttribute('style', str);
    }
}




//========================= 下面沒用到 250508

function poi_findimg(){//顯示圖片長寬a
    //console.log( 'poi_findimg' );
    var url;
    var FFF;
    //(function(){})();//立即函式
    //最後在函式最後加上一組括號代表立即執行
    FFF=function(){
        //console.log( '匿名函式' );
        if($(".poi200707").length >0){
            //$(".poi200707").remove();//ee1.length
            $(".poi200707").html('123');
        }else{
            var str='<div class="poi200707">poi200707</div>';
            $('body').append( str );//加入自訂div//header
            $(".poi200707").css({
                'z-index': '10',
                'position':'fixed',
                'top':'60px',
                'left':'40px',
                'pointer-events':'none',
            });
            //$(".poi200707").css('pointer-events','none');

        }
    };
    FFF();//匿名函式


    url=window.location.href;
    //
    var ss1=url.search("status");
    if( ss1 < 0 ){return;}
    //
    var re = /photo\/([0-9])/;
    var found = url.match(re);
    if(found){
        var url_found =found[1];//數字 1~4
    }
    //
    FFF='';
    FFF=[url_found];
    //console.log( FFF );
    poi250430抓出網頁中的圖片(FFF);
    //poi230112顯示圖片長寬b(FFF);//顯示圖片長寬b
    //setTimeout(function(e){}, 0.5*1000);
}//poi

function poi250430抓出網頁中的圖片(in1){//
    var [url_found]=in1;
    //
    var aa1 = $('img');
    var cc1=0;
    var cc2=[];
    $.each(aa1,function(index,item){
        var img_url=$(item).attr('src');//圖片連結
        //console.log( img_url );
        var bb1=img_url.search("format");
        //console.log( bb1 );
        var bb2=img_url.search("name");
        //console.log( bb2 );
        var bb3=img_url.search("media");
        //console.log( bb3 );
        if(bb3 == -1){
            console.log( 'return' );
            return;
        }//if

        console.log( img_url );

        cc2[cc1]=item; //收集符合的圖片
        cc1++;

    });//each

    //console.log( cc2 );
    var FFF='';
    FFF=[url_found,cc2];

    poi230112顯示圖片長寬b( FFF );

}//poi250430抓出網頁中的圖片(){//

function poi230112顯示圖片長寬b(in1){//顯示圖片長寬b
    var [url_found,收集符合的圖片] = in1;

    //
    //var aa1 = $('img');
    //console.log( aa1 );
    //$(".poi200707").remove();//ee1.length
    //

    $.each(收集符合的圖片,function(index,item){ //遍歷所有圖片
        //console.log( item );
        //分析圖片網址

        var img_url=$(item).attr('src');//圖片連結
        //console.log( img_url );



        let parseURL = new URL( img_url );//圖片連結
        var pic_format=parseURL.searchParams.get("format");
        //console.log( pic_format );
        var pic_name=parseURL.searchParams.get("name");
        //console.log( pic_name );

            if( index+1 == url_found ){ //數字 1~4
                console.log( '相同' );
                console.log( img_url );


                var time=Date.now();//時間戳
                var FFF='';
                FFF='230808';
                $(".poi200707").html(FFF);


                console.log( '長寬',item.naturalWidth , item.naturalHeight );
                //console.log( item.src );
                var ss1=''+item.naturalWidth +'x'+ item.naturalHeight+'#'+pic_format;
                var ss2='';
                ss2=ss2+'<span style="color:#FF0000;">'+ss1+'</span><br/>';
                ss2=ss2+'<span style="color:#00FF00;">'+ss1+'</span><br/>';
                ss2=ss2+'<span style="color:#0000FF;">'+ss1+'</span><br/>';
                ss2=ss2+'<br/>';

                $(".poi200707").prepend(ss2);


                item.addEventListener('load', function(e) {
                    console.log( '圖片載入',item.naturalWidth , item.naturalHeight );
                    var ss1=''+item.naturalWidth +'x'+ item.naturalHeight+'#'+pic_format;
                    var ss2='';
                    ss2=ss2+'<span style="color:#FF0000;">'+ss1+'</span>';
                    ss2=ss2+'<span style="color:#00FF00;">'+ss1+'</span>';
                    ss2=ss2+'<span style="color:#0000FF;">'+ss1+'</span>';
                    ss2=ss2+'<br/>';

                    $(".poi200707").prepend(ss2);

                });


            }//if






    });
}//poi230112()


