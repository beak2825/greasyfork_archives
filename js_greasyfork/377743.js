// ==UserScript==
// @name         今年一定島 概念式連結
// @description  汲汲營營大報社
// @author       稻米
// @namespace    https://greasyfork.org/zh-TW/scripts/377743
// @version      2025.04.22.0050.build16299
// @grant        none

// @match        *://gaia.komica.org/00b/*
// @match        *://gaia.komica1.org/00b/*
// @match        *://gita.komica1.org/00b/*


// @exclude      *://*/00b/src/*
// @exclude      *://*/00b/thumb/*

// @license      WTFPL

// @downloadURL https://update.greasyfork.org/scripts/377743/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%A6%82%E5%BF%B5%E5%BC%8F%E9%80%A3%E7%B5%90.user.js
// @updateURL https://update.greasyfork.org/scripts/377743/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%A6%82%E5%BF%B5%E5%BC%8F%E9%80%A3%E7%B5%90.meta.js
// ==/UserScript==

try{}
catch(err){}
finally{}

$(document).ready(function() {
    //console.log( 'jquery ready' );
    poi191210();
});

function poi191210(){
    //console.log( document.location.href );
    //console.log( window.location.search );
    var searchParams = new URLSearchParams( window.location.search );
    //console.log( searchParams );
    //console.log( searchParams.get("mode") );
    if( searchParams.get("mode") ){
        //沒事
    }else{
        //poi();
    }

    var aa=$("div.thread");
    //console.log( aa );
    if( aa.length > 10 ){
        //首頁模式才執行
        mode_html_css();//灰色的主題
        poi();
    }

}


/*
mode_html_css(){}
poi(){
  mode_read_session(){}
  mode_read_html(){}
  mode_1(){}
  mode_show_html(){}
  mode_save_session(){}
}

*/
function poi(){
    //console.log( gg );
    //console.log( $.gginin );
    //

    var json_array=[];
    var ary=[];
    ary={nn:'123',cc:1};
    json_array.push(ary);
    ary={nn:'456',cc:1};
    json_array.push(ary);


    [json_array]=mode_read_session();//讀取window.localStorage
    //console.log( json_array );
    //throw "is empty";

    var cc=0;
    json_array.forEach(function(item,index) {
        cc++;
        //console.log(item,index);
    });
    //json_array.length
    //console.log('資料筆數='+cc);

    if( cc>0 ){
        //console.log( '讀取記錄成功' );
    }else{
        //console.log( '讀取記錄失敗' );
        //throw '失敗';
    }

    var thread_all=[];
    var thread_all2=[];
    [thread_all,thread_all2]=mode_read_html();
    //console.log( thread_all );
    //console.log( thread_all2 );
    if( thread_all.length >0 ){
        //console.log( '目前網頁上的文章數量=',thread_all.length );//
    }else{
        throw '失敗';
    }
    //判斷目前網頁的模式
    switch( thread_all.length ){
        case 1:
            //console.log( '回應模式=',thread_all.length );//
            break;
        case 15: //數量可能會變
            //console.log( '首頁模式=',thread_all.length );//
            var qwq='';
            [json_array,qwq]=mode_1(thread_all,json_array,thread_all2);//比對紀錄 //合併紀錄
            //console.log( json_array,qwq );
            mode_show_html(json_array);
            //
            mode_save_session(json_array);//存進session
            //console.log( window.sessionStorage );
            break;
        default:
            console.log( '[x]例外=',thread_all.length );//
    }

}//ff
//



function mode_html_css(){
    $('#contents').before("<div id='id190214'>id190214</div>");
    $('#id190214').css({
        'background':'rgb(200,200,200)',
        'color':'rgb(100,100,100)',
        'text-align':'initial',
    });
}

function mode_read_html(){
    //console.log( 'mode_read_html' );//
    //var str='';
    var cc=0;
    var thread_all=[];
    var thread_all2=[];
    var ary=[];
    var FFF='';
    $('#contents').find('.thread').each(function(a,b){//讀取目前網頁上文章編號
        //console.log( a,b );//

        var str=$(b).attr('data-no');//文章編號
        //console.log( str );//
        //
        var str2=$(b).find('.post-head').next('.quote').first().text();//文字 //.substring(0,100)

        //console.log( str2 );//
        var str2b=[...str2];
        str2b=str2b.slice(0,20);
        str2b=str2b.join('');
        //console.log( str2b );//
        var str3=$(b).find('.post-head').find('.now').first().text();//時間
        //console.log( str3 );//
        var str3b=$(b).find('.post-head').find('.now').first().next('span').text();//時間
        //console.log( str3b );//
        var str3c=str3+' '+str3b;
        //console.log( str3c );

        var str4=$(b).find('.warn_txt2').text();
        //console.log( str4 );
        var str4q=0;
        if( str4.length >0 ){
            var re = /回應 ([0-9]+) 篇/;
            var found = str4.match(re);
            //console.log( found );
            str4q=found[1];
        }



        ary={
            nn:str,
            qq:str4q,
            date:str3c,
            text:str2b,
        };
        //console.log( ary );//
/*
nn=首篇編號
qq=隱藏的回應數量
date: '2025/04/21(一) 21:21:55.030',
text=內文

*/

        thread_all.push(str);
        thread_all2.push(ary);
    });
    return [thread_all,thread_all2];

}//ff
//
function mode_show_html(a){
    //console.log( 'mode_show_html' );//
    var json_array=a;
    //console.log( json_array );//
    //json_array抽出cc
    var json_array_cc = json_array.map(function(item, index, array){
        return [item.cc,index];
    });
    //console.log( json_array_cc );//被下面的.sort改了
    var json_array_cc2 = json_array.map(function(item, index, array){
        return [item.cc,index];
    });
    //console.log( json_array_cc2 );//被下面的.sort改了//???
    //
    //json_array_cc比大小 //排序 //大的在前
    var xx1=json_array_cc2.sort(function(a,b){
        return (a[0] - b[0])*(-1);//
    });
    //console.log( xx1 );//
    //console.log( json_array_cc );//

    var str='';
    var array_tmp='';
    var timestamp;
    var timestamp2;
    //cc=加權 //依照加權排序

    json_array_cc2.forEach(function(item,index,array){
        //console.log( item[0],item[1] );//cc,index
        //console.log( json_array[ item[1]] );//cc,index
        array_tmp=json_array[ item[1]];
        //console.log( array_tmp );//
        //array_tmp.tt = 時間戳
        //console.log( Date.now(),array_tmp.tt );//
        timestamp = Date.now() - array_tmp.tt;
        //console.log( timestamp );//
        timestamp = Math.floor( timestamp/1000 ); // 秒數
        timestamp2 ='秒';
        if( timestamp > 60 ){
            timestamp=Math.floor( timestamp/60 );//分
            timestamp2 ='分';
        }
        if( timestamp > 60 ){
            timestamp=Math.floor( timestamp/60 );//小時
            timestamp2 ='小時';
        }
        //console.log( timestamp,timestamp2 );//
        if(index > 5){ return; }//跳過 //只取前20

        var aa=array_tmp.text;
        aa.replace(/>/gi, "");
        array_tmp.text=aa;
        //console.log( timestamp,timestamp2 );
        str=str+"<tr><td><a href='./pixmicat.php?res="+array_tmp.nn+"'>"+array_tmp.nn+" </a></td><td>"+array_tmp.cc+'</td><td>'+timestamp+timestamp2+"</td><td>"+array_tmp.qq+"</td><td>"+array_tmp.text+"</td><td>"+array_tmp.date2+"</td><td>"+array_tmp.date+"</td></tr>"+"\n";
    });

    //console.log( str );//
    $('#id190214').html('<table id="id190216_table"><tr><td>nn?</td><td>cc?</td><td>tt?</td><td>qq?</td><td>text?</td><td>date2?</td><td>date?</td></tr>'+str+'</table>');
    $('#id190214').append('<button id="id190215btn">清空紀錄</button>');
    $("button#id190215btn").click(function(e){
        //session=window.sessionStorage.poi190214;
        window.localStorage.poi190214='';
        $('#id190214').html('重置');
    });
    $('table#id190216_table td').css({
        "white-space":"nowrap",
    });


}
function mode_read_url(){
    console.log( 'mode_read_url' );
    console.log( '網址='+location.pathname ); //網址=/00b/1.htm
    var FFF=location.pathname.length;
    console.log( FFF );//5 //10

    var str=location.pathname;
    var re = /([0-9]+)\.htm/i;
    var found = str.match(re);
    //console.log( found );//5 //10
    //console.log( found?.index );//5 //10

    var xx1=0.0;
    if( found?.index >0){
        if(found[1]<5){
            xx1=0.5;
        }else{
            xx1=0.4;
        }
    }else if(location.pathname.startsWith("/00b/pixmicat.php") ){
        console.log( '/00b/pixmicat.php');//
        xx1=0.0;
    }else if( location.pathname.startsWith("/00b/index.htm") ){
        console.log( '/00b/index.htm');//
        xx1=1.0;
    }else if( location.pathname.startsWith("/00b/") ){
        console.log( '/00b/');//
        xx1=1.0;
    }else{
        console.log( 'etc');//
        xx1=0.0;
    }

    console.log( '倍率',xx1 );//倍率


    return [xx1];

}//ff
//

function mode_read_session(){
    //console.log( 'mode_read_session' );//讀取session
    //mode_read_url();
    var session2='';
    if(window.localStorage){
        //console.log( window.sessionStorage );
        //console.log( window.localStorage );
        //session2=window.sessionStorage.poi190214;
        //console.log( window.localStorage.poi190214 );
        session2=window.localStorage.poi190214;
        //console.log( '資料=',session2 );
        var json_array=[];
        if( session2 ){ //.length >0
            //
            try{
                json_array=JSON.parse( session2 );//解析json字串
                //console.log( '把json字串轉成陣列=',json_array );
            }
            catch(e){
                console.log( 'try=',e );
            }
        }else{
            //throw '失敗 沒有從window.localStorage抓到資料';
        }
    }else{
        //不支援window.localStorage
    }
    //
    return [json_array];
}


function mode_save_session(a,b){
    //console.log( 'mode_save_session' );//寫入session
    var json_array=a;//舊紀錄
    var json_array2=[];
    //存檔前先處理 //微幅下修cc
    var FFF=0.0;
    //console.log( json_array );
    //console.log( json_array );
    json_array2 = json_array.filter(function(item, index, array){
        return item.cc > 0; // 大於
    });
    //console.log( json_array );
    //console.log( json_array2 );
    json_array=json_array2;
    //console.log( '最後的檢查=',json_array );//最後的檢查
    //console.log( '寫入筆數=',json_array.length );

    //
    if(window.localStorage){
        //儲存紀錄
        var json_str=JSON.stringify(json_array); //建立json字串
        //window.sessionStorage.poi190214=json_str;//存到session
        window.localStorage.poi190214=json_str;//存到session
        //console.log( 'Storage=',window.localStorage );
    }else{
    }
}//ff
//
function mode_timestamp_calc(a){ //(timestamp)
	//console.log( 'mode_timestamp_1' );//處理timestamp
	var timestamp=a;
	//console.log( timestamp );//處理timestamp
	//
	var FFF=[];
	FFF[0] = Date.now() - timestamp; //時間差
	FFF[0] = Math.floor( FFF[0]/1000 ); // 毫秒轉秒
	FFF[1] ='秒';
	if( FFF[0] > 60 ){
		FFF[0]=Math.floor( FFF[0]/60 );//分
		FFF[1] ='分';
	}
	if( FFF[0] > 60 ){
		FFF[0]=Math.floor( FFF[0]/60 );//小時
		FFF[1] ='小時';
	}
	FFF=''+FFF.join('');
	//
    return [FFF];
}
function mode_1(a,b,c){
    console.log( 'mode_1' );//資料的處理 //排序 //瘦身
    //
    var thread_all=a;
    var json_array=b;
    var thread_all2=c;
    //
    //console.log( json_array );//
    for(var i=0;i<json_array.length;i++){
        //console.log( json_array[i].nn );//
    }
    //從json_array產生一個只有文章編號的陣列
    var json_array_nn = json_array.map(function(item, index, array){
        return item.nn;
    });
    //console.log( json_array );//
    //console.log( json_array_nn );//

    //從thread_all2產生一個只有文章編號的陣列
    var thread_all2_nn = thread_all2.map(function(item, index, array){
        return item.nn;
    });
    //console.log( thread_all2 );//
    //console.log( thread_all2_nn );//
    //console.log( json_array );//
    //console.log( json_array_nn );//
    //console.log( json_array_nn[0] );//

    var ary={};
    var ary2={};
    var FFF='';
    var FFF2='';
    var [倍率]=mode_read_url();
    //console.log( '倍率=',倍率 );//

    thread_all.forEach(function(item,index,array){
        ary={};
        FFF=json_array_nn.indexOf(item);
        FFF2=thread_all2_nn.indexOf(item);
        //console.log( json_array[FFF] );//
        if( FFF >=0 ){
            //console.log( '舊',item,FFF );//
            //網頁上的編號 在json上也有
			//修改原本的資料紀錄
            ary=json_array[FFF];//沿用json上的舊資料
            //console.log( 'ary=',ary.cc );//
			ary.cc=parseFloat(ary.cc)+ 1.0*倍率;
            //console.log( 'ary=',ary.cc );//
			ary.cc=parseFloat(ary.cc).toFixed(1);
            ary.qq=thread_all2[FFF2].qq;//更新qq值
			//[ary.date2]=mode_timestamp_calc(json_array[FFF].date_tt);//更新時間差
            ary.date2='舊';//後面處理

            //json_array[FFF].qq=thread_all2[FFF].qq;
            //console.log( json_array[FFF] );//
        }else{
            //console.log( '新',item,FFF );//
            //網頁上的編號 在json上不存在
            //把新資料加進json_array
            //ary={nn:item,cc:1*倍率,tt:Date.now(),};
            ary={};//建立新的
            ary.nn=item;
			ary.cc=0;
			ary.cc=parseFloat(ary.cc)+1.0*倍率;
			ary.cc=parseFloat(ary.cc).toFixed(1);

            ary.tt=Date.now();//加入到json的時間
            //console.log( thread_all2,FFF2 );//
            //console.log( thread_all2[FFF2] );//
            ary.qq  =thread_all2[FFF2].qq;
            ary.text=thread_all2[FFF2].text;
            ary.date=thread_all2[FFF2].date;//日期字串
            //console.log( Date.parse(ary.date) );//1745243213133
            ary.date_tt=Date.parse(ary.date);//字串轉timestamp
			//[ary.date2]=mode_timestamp_calc(ary.date_tt);
            ary.date2='新';//後面處理
            //
            console.log( '中文mode_1更新資料', ary );//
            //console.log( Object.keys(ary) );//.length
            //json_array.push(ary);
            json_array.push(ary);//加進json_array
        }
        //
        //


        //console.log( 'indexOf',FFF );//
        //console.log( item,thread_all2_nn[FFF] );//
        //console.log( thread_all2[FFF] );//
        //thread_all2_nn 是從thread_all2 分出來的 所以不用判斷存在
        //console.log( Object.keys(ary),Object.keys(ary).length );//.length
        if( Object.keys(ary).length > 0 ){
            //ary.text=thread_all2[FFF].text;
            //ary.date=thread_all2[FFF].date;
            //ary.qq=thread_all2[FFF].qq;
            //console.log( ary );//
        }

    });//forEach

    //console.log( json_array );
    json_array.forEach(function(item,index,array){
		[item.date2]=mode_timestamp_calc(item.date_tt);//更新時間差
        FFF=parseFloat(item.cc) - 0.3;//每次重整分數下調
        item.cc=FFF.toFixed(1);//取到小數第一位
        //console.log( index,item.cc,item.date2 );
    });


    //console.log( json_array );
    //console.log( json_array );//
    //更新json_array_nn
    json_array_nn = json_array.map(function(item, index, array){
        return item.nn;
    });
    //json_array_nn比大小 //排序 //新的在前
    json_array_nn.sort(function(a,b){
        return (a - b)*(-1);//
    });
    //console.log( json_array_nn );//
    //json_array_nn剪裁 //瘦身
    json_array_nn=json_array_nn.slice(0, 100);//只取100個
    //console.log( json_array_nn );//
    //
    var json_array2=[];
    //依照排序後的json_array_nn 建立新的json_array
    json_array.forEach(function(item,index,array){
        //console.log( item );//
        //在json_array_nn尋找相同的編號 並回傳index
        var xx21 = json_array_nn.findIndex(function(item2, index2, array2){
            return (item2 == item.nn);
        });
        //console.log( xx21 );//陣列index位置
        //有找到
        if(xx21>=0){
            //json_array2[xx21]=item;//依照排序放進新陣列
            json_array2.push(item);
        }
    });
    //console.log( json_array2 );//
    json_array=json_array2;//取代原本的陣列
    json_array2=[];//清空

    return [json_array,'ouo'];
}//ff
//
function poi_old(){
    //console.log( 'poi' );
    $('.bar_reply').html('123');
    $('.bar_reply').css({
        'background':'rgb(200,200,200)',
        'color':'rgb(100,100,100)',
        'text-align':'initial',
    });
}//ff
//





/*

*/





