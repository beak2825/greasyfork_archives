// ==UserScript==
// @name         今年一定島 查ID
// @description  汲汲營營大報社
// @author       稻米
// @namespace    https://greasyfork.org/en/scripts/34953
// @version      2024.07.24.0010.build16299

// @match        *://gaia.komica.org/00b/*
// @match        *://gaia.komica1.org/00b/*
// @match        *://gaia.komica2.cc/00b/*
// @match        *://gita.komica1.org/00b/*

// @exclude      *://*/00b/src/*
// @exclude      *://*/00b/thumb/*

// @grant        none
// @license      WTFPL


// @downloadURL https://update.greasyfork.org/scripts/34953/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%9F%A5ID.user.js
// @updateURL https://update.greasyfork.org/scripts/34953/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%9F%A5ID.meta.js
// ==/UserScript==




//jquery
try{
    //throw "is empty";
}
catch(err){}
finally{}
//

$(document).ready(function() {
    //console.log( 'jquery ready' );
    //全域變數//global
    //window.gg=[];
    //gg.time = new Date();
    //
    poi();
    color();
});

function color(){
    $(".id_poi171109").css({
        "background-color":"yellow",
        "border":"1px solid #000",
    });//連結上背景色 不想上色就把這段刪除
}



function poi(){
    var FFF='';
    //在文章標題插入 查詢ID的連結
    //FFF=$(".id").html();
    $(".id").each(function(){
        FFF=$(this).html().substr(3,8);
        //FFF='<a href="https://komica-cache.appspot.com/?search=ID&q='+FFF+'" target="_blank">查詢ID</a>';
        //FFF='<a href="https://www.homu-api.com/search?id='+FFF+'" target="_blank">查詢ID</a>';
        FFF='<a href="./pixmicat.php?mode=search&id='+FFF+'&poi231120=1&" target="_blank">查詢ID</a>';
        FFF='<span class="id_poi171109">'+FFF+'</span>';
        $(this).after(''+FFF);
    });
    //
    poi221201();//自訂處理id網址參數


}//function poi2(){




function poi221201(){//自訂處理id網址參數
    var FFF;
    //在查詢頁面
    FFF='';
    FFF=$('div#banner').find('div.bar_admin').text();
    if(FFF=="搜尋"){
        //有找到 繼續
        poi221225();
    }else{
        //console.log( 'return' );
        return;
    }
}//poi221201()

function poi221225(){
    //在查詢頁面+網址有含poi231120
    var URL123 = new URL( window.location.href );//?mode=search&id=Lr5Y5hFM
    var uu1=URL123.searchParams.get('poi231120');//
    //var uu2=URL123.searchParams.get('id');//
    if(uu1==1){
        poi221225a();//自動填入+送出查詢
    }else{
        //在查詢頁面 但網址沒有poi231120
        poi221225b();//取得參照來源//檢查參考url
        return;
    }

/*
    //console.log( uu2 );
    if(uu2){
        //有抓到id才繼續
        //console.log( 'yy' );
        poi221225a();//自動填入//送出查詢
    }else{
        //console.log( 'nn' );
        poi221225b();//取得參照來源//檢查參考url
        return;
    }

*/
}//poi221225

function poi221225a(){
    var FFF;
    var aa=$("#search>ul>li:contains('關鍵字')")
    //console.log( aa.length );
    if(aa.length >0 ){
        //繼續
    }else{
        return;
    }

    var URL123 = new URL( window.location.href );//?mode=search&id=Lr5Y5hFM
    var uu2=URL123.searchParams.get('id');


    $('input[name="keyword"]').val(uu2);//自動填入
    $('input[name="keyword"]').css({
        'border':'1px solid red',
    });
    //$('select[name="field"]').val('now');
    //$('select[name="field"]').val('now').change();
    $('select[name="field"]').find(' option').removeAttr('selected').filter('[value=now]').attr('selected', true);//自動選擇到id
    $('select[name="field"]').css({
        'border':'1px solid red',
    });
    //

    //產生動畫元素
    var aa2=$('li>p');//
    //console.log( aa2 );
    FFF='';
    FFF='<div id="poi221201"><div>div</div></div>';
    aa2.append(FFF);
    //$('form').submit();//送出查詢
    $('#poi221201').css({
        'width':'100px',
        'height':'10px',
        'border':'1px solid red',
        'overflow':'hidden',
        'display':'inline-block',
    });//上色
    $('#poi221201>div').css({
        'width':'100%',
        'border-top':'20px solid red',
        'overflow':'hidden',
        'display':'inline-block',
    });//上色



    //用jq動畫當計時器
    $('#poi221201>div').animate({
        'width':"0px", //100 -> 0
        //變數: 123, // 0 -> 123
    },{
        duration: 1*1000,
        easing:'linear',
        complete: function(){
            //$('form').first().submit();//送出查詢
            FFF='';
            FFF=$('form').first().find('input[type="submit"]');//送出查詢
            //console.log( FFF );
            FFF.click();//送出查詢
        },
        step: function(now,fx){ //now=上面設定的目標變數,fx=元件
            //console.log( now,fx );
        },
    });

}//poi221225a()

function poi221225b(){
    var FFF;
    var url=document.referrer;//取得參照來源
    //var 可讀時間=poi230905();
    var 可讀時間=poi230922();

    //console.log( 'ref url',url );
    var URL123 = new URL( url );//?mode=search&id=Lr5Y5hFM
    var uu1=URL123.searchParams.get('mode');
    //console.log( uu1 );
    var uu2=URL123.searchParams.get('id');
    //console.log( uu2 );
    var uu3=URL123.searchParams.get('poi231120');
    //console.log( uu3 );
    //URL123.searchParams.delete('poi231120');
    //uu3=URL123.searchParams.get('poi231120');
    //console.log( uu3 );


    URL123.searchParams.set('date',可讀時間);

    if(uu2){
        //console.log( 'yy' );
        //
        console.log( '修改網址' );
        history.pushState('','',URL123);//修改網址
        var aa1=$('div#banner');
        //console.log( aa1 );
        var aa2=URL123.toString();
        //console.log( aa2 );
        aa1.append( aa2 );//顯示參考url

    }else{
        //console.log( 'nn' );
        return;
    }
}//poi221225b()

function poi230922(){//id上的日期
    var FFF='';
    //
    var aa=$('div#search_result').find('div.threadpost');
    //console.log( aa );
    var data=[];
    aa.each(function(index,item){
        //console.log( index,item );
        //var bb=$(item).children();
        var bb=$(item).contents();
        bb=bb[4].data; //字串
        bb=bb.split('/');
/*
 [' [2023', '09', '22(五) 19:42:51.946 ID:LV58Ef6.] No.']
*/
        //bb=$.param(bb);
        var bb2=[];
        bb2[0]=bb[0].substring(4,6);//年2位 //23
        bb2[1]=bb[1].substring(0,2);//月2位 //09
        bb2[2]=bb[2].substring(0,2);//日2位 //22
        bb=bb[2].split(' ');//分割 //['22(五)', '19:42:51.946', 'ID:LV58Ef6.]', 'No.']
        bb2[3]=bb[1].substring(0,2);//時2位 //19

        //console.log( bb );
        //console.log( bb2 );
        data[index]=bb2;
    });
    //console.log( data ); //整理好的 時間日期
    //console.log( data[0],data[aa.length-1] ); //頭跟尾
    FFF=[];
    FFF[0]=data[0][0]+data[0][1]+data[0][2];
    FFF[1]=data[aa.length-1][0]+data[aa.length-1][1]+data[aa.length-1][2];
    //console.log( FFF );
    FFF=FFF[0]+' '+FFF[1];
    //console.log( FFF );
    return FFF;

}

function poi230905(){ //沒用到
    //可讀時間=230919
    var now = new Date();
    var year = now.getFullYear().toString().slice(-2);
    var month = (now.getMonth() + 1).toString().padStart(2, '0');
    var date = now.getDate().toString().padStart(2, '0');
/*
now.getFullYear()
now.getMonth();
now.getDate();
now.getHours();
now.getMinutes();
now.getSeconds();
*/
    var FFF='';
	FFF=year+month+date;
    FFF=''+FFF;
    //console.log(FFF);
    return FFF; //2309105
}//poi230905




/*
https://komica-cache.appspot.com/?search=ID&q=X6stzlu6
https://www.homu-api.com/search?id=X6stzlu6
*/
