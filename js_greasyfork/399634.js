// ==UserScript==
// @name         今年一定島 標註討論串經過時間
// @description  汲汲營營大報社
// @author       稻米
// @version      2024.10.29.0010.build16299
// @namespace    https://greasyfork.org/zh-TW/scripts/455500

// @match        *://gaia.komica.org/00b/*
// @match        *://gaia.komica1.org/00b/*
// @match        *://gaia.komica2.cc/00b/*
// @match        *://gita.komica1.org/00b/*

// @exclude      *://*/00b/src/*
// @exclude      *://*/00b/thumb/*

// @grant        none
// @license      WTFPL


// @downloadURL https://update.greasyfork.org/scripts/455500/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%A8%99%E8%A8%BB%E8%A8%8E%E8%AB%96%E4%B8%B2%E7%B6%93%E9%81%8E%E6%99%82%E9%96%93.user.js
// @updateURL https://update.greasyfork.org/scripts/455500/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%A8%99%E8%A8%BB%E8%A8%8E%E8%AB%96%E4%B8%B2%E7%B6%93%E9%81%8E%E6%99%82%E9%96%93.meta.js
// ==/UserScript==




try{}
catch(err){}
finally{}
//

$(document).ready(function() {
    //poi();
    poi();
});

function poi(){
    var FFF='';
    var cc=0;
    //
    FFF=window.location.href.match("\\?res=");
    if(FFF){
    }else{
        cc=cc+1;
    }

    FFF=$('div.thread').length;
    if( FFF == 1 ){
    }else{
        cc=cc+1;
    }
    FFF=$("div.bar_reply:contains('回應模式')");
    if(FFF.length ==1){
    }else{
        cc=cc+1;
    }

    if(cc==0){
        poi200406a();
        poi190927();
        poi230309a();
    }
    poi230924();//頂端的顯示時間

}//poi/

function poi230309a(){
    //console.log('這是幾分鐘前的回覆');
    var FFF='';
    //
    var 目前的討論串=$('.thread');
    var aa=$(目前的討論串).find('.post.reply');
    aa.css({
        'position':'relative',
    });
    aa.each(function( index,item ){//遍歷元素
        $(item).append('<div class="poi230309his1342">poi210609his1342</div>');
    });
    目前的討論串.find('.poi230309his1342').css({
        'position':'absolute',
        'bottom':'0px',
        'right':'0px',
        'width':'20px',
        'height':'20px',
        'background':'#FF0',
        'overflow':'visible',
        'white-space':'nowrap',
    });
    目前的討論串.find('.poi230309his1342').html('文字');
    //

    var aa2=$(目前的討論串).find('.post.reply');
    aa2.each(function( index,item ){//遍歷元素
        FFF=[$(item).find('.now').text(), $(item).find('.now').next().text()] ;
        //2023/03/09
        //13:28:59.546
        FFF=[
            parseInt(FFF[0].substr(0, 4), 10) ,
            parseInt(FFF[0].substr(5, 2), 10) -1 ,
            parseInt(FFF[0].substr(8, 2), 10) ,
            parseInt(FFF[1].substr(0, 2), 10) ,
            parseInt(FFF[1].substr(3, 2), 10) ,
            parseInt(FFF[1].substr(6, 2), 10) ,
            parseInt(FFF[1].substr(9, 3), 10) ,
        ];
        //console.log( FFF );
        var date = new Date().getTime();//
        date=date+8*60*60*1000;
        var date1 = new Date(FFF[0],FFF[1],FFF[2],FFF[3],FFF[4],FFF[5]).getTime();//
        date1=date1+8*60*60*1000;
        //console.log( date,date1 );
        FFF=date-date1;
        //console.log( FFF );
        FFF=Math.floor(FFF/1000);
        //console.log( FFF );
        FFF=Math.floor(FFF/60);
        //console.log( FFF );


        //var 相對時間=Math.floor(   );
        $(item).find('.poi230309his1342').text('#'+(index+1)+' #'+FFF+'分鐘前');


    });
}//poi230309a/

function poi190927(){
    //console.log( 'poi190927' );

    //console.log( 'yy' );
    var bb=$("div#contents");
    //var bb=$("div#threads");
    //console.log( bb );
    //bb.after('after');
    var bb2=$('div.post');//有幾個發文 //取bb2.length
    //console.log( bb2 );
    var bb3=$('div.file-text');//有幾個發文 //取bb2.length

    //
    var cc=$("div.post.threadpost > div.post-head > span.now");
    //console.log( cc );//發文者的時間1
    var cc2=cc.next();
    //console.log( cc2 );//發文者的時間2
    //
    //var dd=$("div.post.threadpost > div.file-text").find('a').text().split('.');
    var dd=$("div.post.threadpost > div.post-head > span.now")
    //console.log( dd.text(),dd.next().text() );//發文者的檔案名稱 //取dd[0]
    var dd2a=dd.text();
    var dd2b=dd.next().text();
    //dd2a=dd2a.substr(0,dd2a.indexOf("(")) ;
    //console.log( dd2a );// 2020/01/07
    var dd3 = dd2a+dd2b;//arr.join(" ")
    //console.log( dd3 );//2020/01/07(二)12:30:05.664
    var dd4 = Date.parse(dd3+'GMT+8');
    //console.log( dd4 );//1578371405664

    var tt=$.now();
    //console.log( tt );//時間戳記 1578385760139

    var tt2=Math.floor( (tt - dd4)/1000 ) ; //
    //console.log( tt2 );//相差的秒數

    var tt3=[];
    tt3[0]=tt2;
    tt3[1]='秒';
    if(tt3[0] >= 60){
        tt3[0]=Math.floor( tt3[0]/60 );
        tt3[1]='分';
    }
    if(tt3[0] >= 60){
        tt3[0]=Math.floor( tt3[0]/60 );
        tt3[1]='時';
    }
    //console.log( tt3 );//可讀時間1

    var tt4=new Date( tt2 *1000);
    //console.log( tt4.getUTCDate()-1, tt4.getUTCHours(), tt4.getUTCMinutes(), tt4.getUTCSeconds(), );//可讀時間2

    var str01=`
${tt4.getUTCDate()-1}天
${tt4.getUTCHours()}時
${tt4.getUTCMinutes()}分
${tt4.getUTCSeconds()}秒
${ bb2.length-1 }篇回文
${ bb3.length }張圖片
`;
    //console.log( str01 );//可讀時間1
    bb.after( str01 );

}//poi190927()/

function poi200406a(){
    //console.log( 'poi' );
    //建立上方的列表區塊
    var aa=$("div#contents");
    //console.log( aa );
    aa.before("<div id='id200406'>id200406</div>");
    $('#id200406').css({
        'background':'rgb(200,200,200)',
        'color':'rgb(100,100,100)',
        'text-align':'initial',
        "width":"600px",
    });
    $('#id200406').html('爬格子');

    poi200406b();

}

function poi200406b(){
    var aa=$("div.post");
    //console.log( aa );
    var bb=0;
    var bb2=[];

    $.each(aa,function(index,item){
        //console.log( index,item );
        let aa2=$(item).find('span.now').text();
        //console.log( aa2 );
        let aa3=$(item).find('span.now').next().text();
        //console.log( aa3 );
        let aa4 = ''+ aa2 + aa3 +'GMT+8';
        //console.log( aa4 );
        let aa5 = Date.parse( aa4 );
        aa5=Math.floor( aa5/1000 ); //秒數
        //console.log( aa5 );

        let aa10=$(item).find('div.backquote');
        let aa11='';
        if(aa10.length > 0 ){
            aa11=aa10.find('a').length;
            //console.log( aa11 );
        }

        if(bb==0){
            bb=aa5;
        }else{
            bb=aa5-bb;
            bb2.push([bb,aa11]);
            bb=aa5;
        }





    });//each
    //console.log( bb2 );
    //
    poi200406c( bb2 );


}

function poi200406c(in1){
    var data=in1;
    var html='';
    $.each(data,function(index,item){
        //console.log( index,item );
        var [data_aa,data_bb]=item;
        //console.log( data_aa,data_bb );

        let FFF='';
        FFF='紅';
        if(data_aa> 60*1 ) { FFF='橘'; }//
        if(data_aa> 60*2 ) { FFF='黃'; }//
        if(data_aa> 60*3 ) { FFF='綠'; }//
        if(data_aa> 60*5 ) { FFF='藍'; }//
        if(data_aa> 60*10 ){ FFF='白'; }//
        if(data_aa> 60*15 ){ FFF='紫'; }//

        //console.log( FFF );
        switch( FFF ){
            case '紅':
                FFF='#ff0300';
                break;
            case '橘':
                FFF='#f09b02';
                break;
            case '黃':
                FFF='#fffe00';
                break;
            case '綠':
                FFF='#00fe00';
                break;
            case '藍':
                FFF='#443eff';
                break;
            case '白':
                FFF='#fff';
                break;
            case '紫':
                FFF='#d9e';
                break;
            default:

        }
        //console.log( FFF );


        html=html+'<span style=" background-color:'+FFF+';border:1px solid #000;">-</span>';
    });

    $('#id200406').html(html);


}//poi200406c(in1){


function poi230924(){
    //console.log( 'poi230924' );
    var FFF='';
    //
    var aa=$('#contents').find('.thread');
    //console.log( aa );

    var time_now=new Date();
    //console.log( '現在時間',time_now );
    time_now=time_now.getTime();
    //console.log( '現在時間',time_now );

    aa.each(function(index,item){
        $(item)
        var bb=$(item);

        //
        FFF='';
        FFF=bb.find('.post-head').find('.now').first();//開串的時間日期
        FFF=FFF.text() + FFF.next().text();
        //console.log( FFF );

        var time_開串時間=new Date( FFF );
        time_開串時間=time_開串時間.getTime();
        //console.log( '開串時間',time_開串時間 );

        FFF='';
        FFF=bb.find('.post-head').find('.now').last();//最新留言的時間日期
        FFF=FFF.text() + FFF.next().text();

        //console.log( FFF );

        var time_最新留言時間=new Date( FFF );
        time_最新留言時間=time_最新留言時間.getTime();
        //console.log( '最新留言時間',time_最新留言時間 );


        FFF=[];
        //console.log( time_now , time_開串時間 );//新增的box
        FFF[0]= time_now - time_開串時間 ;
        FFF[1]=FFF[0]+'毫秒';
        FFF[0]=Math.floor(FFF[0]/1000);//轉換成 秒
        FFF[1]=FFF[0]+'秒';
        FFF[0]=Math.floor(FFF[0]/60);//轉換成 分
        FFF[1]=FFF[0]+'分';

        if(FFF[0]>60){
            FFF[1]= Math.floor(FFF[0]/60) +'小時' + (FFF[0] % 60) +'分';
        }
        //console.log( FFF[1] );

        var xx=$(item).find('.post.threadpost').find('.file-text').first();
        //console.log( xx );
        //console.log( xx.length );

        if(xx.length >0){
            xx.append('<span class="class230924">'+FFF[1]+'</span>');
            //

        }else{
            //console.log( 'nn' );
            var xx2=$(item).find('.post.threadpost').find('.post-head');//.find('.post-head')
            xx2.prepend('<span class="class230924">'+FFF[1]+'</span>');
            //console.log( xx2 );
        }

    });//each

    $('.class230924').css({
        "background-color":"yellow",
        "border":"1px solid #000",
    });

}//poi230924(){




/*

color: #ff0300; background-color: #ff0300; 紅
color: #f09b02; background-color: #f09b02; 橘
color: #fffe00; background-color: #fffe00; 黃
color: #00fe00; background-color: #00fe00; 綠
color: #443eff; background-color: #443eff; 藍
color: #fff; background-color: #fff; 白
color: #d9e; background-color: #d9e; 紫

*/
/*
http://sora.komica.org/00/pixmicat.php?mode=status
https://gaia.komica.org/00/pixmicat.php?mode=status
*/


