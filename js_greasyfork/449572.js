// ==UserScript==
// @name         今年一定島 自動下載圖片
// @description  汲汲營營大報社
// @namespace    https://greasyfork.org/zh-TW/scripts/449572
// @author       稻米
// @version      2022.11.27.0051.build16299
// @grant        none

// @include      *://*.komica.org/00/*
// @include      *://*.komica.org/00/*
// @exclude      *://*.komica.org/00/src/*
// @exclude      *://*.komica.org/00/thumb/*
// @exclude      *.jpg
// @exclude      *.png
// @exclude      *.webm
// @license      WTFPL

// @downloadURL https://update.greasyfork.org/scripts/449572/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E8%87%AA%E5%8B%95%E4%B8%8B%E8%BC%89%E5%9C%96%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/449572/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E8%87%AA%E5%8B%95%E4%B8%8B%E8%BC%89%E5%9C%96%E7%89%87.meta.js
// ==/UserScript==

$(document).ready(function() {
    //poi();
    poi();
});


function poi(){ //只在回應模式套用
    //console.log( document.styleSheets );
    //console.log(window.location.href);
    var tmp=window.location.href;
    tmp=tmp.match("\\?res=");
    //window.location.href.match("\\?res=")
    //console.log(tmp);
    if(tmp){
        //沒事
    }else{
        //console.log('非回應');
        return 0;//不正確 中止
    }

    if( $('div.thread').length == 1 ){
        //沒事
    }else{
        //回應模式只有一串討論串
        return 0;//不正確 中止
    }


    var FFF=$('body').attr('poi220815');
    if( FFF == 1 ){
        return 0;//只執行一個腳本 中止
    }else{
        $('body').attr('poi220815','1');
    }

    poi建立啟動按鈕();//

}


function poi建立啟動按鈕(){ //建立啟動按鈕
    //console.log(arguments.callee.name); //poi2
    //$("#threads").before('before');
    $(".thread").before('<poi><button type="reset">自動下載</button></poi>');
    $("poi >button:contains('自動下載')").click(function(){
        poi建立控制台();
    });
    //

}//poi2(){

function poi建立控制台(){ //建立控制台
    var FFF=$('#poi220814box');
    if( FFF.length > 0 ){
        return 0;//只產生一個控制台 中止
    }else{
        //沒事
    }


    $('.thread').prepend('<div id="poi220814box">未完成</div>');
    //$('#poi220814a').attr('style','');
    $('#poi220814box').css({
        'background':'rgb(200,200,200)',
        'color':'rgb(100,100,100)',
        'text-align':'initial',
        'width':'400px',
        'height':'400px',
        'overflow':'auto',
    });
    $('#poi220814box').text('');

    $('#poi220814box').append('<button type="reset" id="poi220814f"> 標示樓層</button><br/>');
    $("#poi220814f").click(function(){
        poi標示樓層();
    });

    $('#poi220814box').append('<input type="text" size="8" value="0,1,2,3-10" placeholder id="poi220814rgi"><button type="reset" id="poi220814rg">輸入範圍</button><br/>');
    $("#poi220814rg").click(function(){
        poi輸入範圍();
    });


    $('#poi220814box').append('<img id="poi220815img01"><a id="poi220815aa01" href="#">†</a><br/>');
    $('#poi220815img01').css({
        'width':'100px',
        'height':'100px',
    });
    $('#poi220815aa01').css({
        'width':'100px',
        'height':'100px',
    });
    //'border-right':'10px solid red',

    $('#poi220814box').append('<div id="poi220815m">訊息</div><br/>');
    $('#poi220815m').css({
        'display':'block',
        'font-family':'monospace',
        'white-space':'pre',
    });



}//

function poi輸入範圍(){ //輸入範圍
    //console.log( 'poi輸入範圍' );
    var FFF='';
    FFF=$('#poi220814rgi').val();
    //console.log( FFF );
    FFF=FFF.split(',');//字串轉陣列
    //console.log( FFF );
    var str_ary=FFF;
    str_ary.forEach(function( item,index ){//遍歷元素
        //console.log( item,index );
        var aa=item.search("-");
        //console.log( aa );
        if(aa != -1){
            //console.log( 'yy' );
            var aa2=item.split('-');
            //console.log( aa2 );
            var str='';
            if(aa2[0]==''){str='skip';}
            if(aa2[1]==''){str='skip';}
            if(str=='skip'){
                $('#poi220815m').append('<br/>輸入範圍 錯誤');
            }else{
                //console.log( '???' );
                aa2[0]=parseInt(aa2[0]);
                aa2[1]=parseInt(aa2[1]);
                //console.log( aa2 );
                for(let i = aa2[0]; i <= aa2[1]; i++) {
                    //console.log( i );
                    str_ary.push(i);
                }//for
                //delete str_ary[index];//處理過的元素就刪除
            }
            //console.log( str_ary );

        }//if
    });//foreach
    //
    poi輸入範圍2(str_ary);


}//輸入範圍
function poi輸入範圍2(in1){
    var str_ary=in1;
    //
    str_ary.forEach(function( item,index ){//遍歷元素
        str_ary[index]=parseInt(item);//轉換成整數
    });
    //console.log( FFF );

   	str_ary=str_ary.filter(function(item,index){
        //console.log( FFF );
        //var found=item.isInteger();
  		if( parseInt(item) === item ){return true;}//留下整數
    });

    str_ary.sort(function(a, b){return a - b});//排序 //由小到大

    str_ary.forEach(function( item,index ){//遍歷元素
        str_ary[index]=parseInt(item);//轉換成整數
    });

    str_ary.forEach(function( item,index ){//遍歷元素
        var found = str_ary.indexOf( item );
        if(found == index){
            //沒事
        }else{
            delete str_ary[index];//刪除
        }
    });

    //console.log( str_ary );

   	str_ary=str_ary.filter(function(item,index){
        //console.log( FFF );
        //var found=item.isInteger();
  		if( parseInt(item) === item ){return true;}//留下整數
    });

    //console.log( str_ary );//使用者輸入的範圍
    poi有效的樓層(str_ary);
}

function poi有效的樓層(str_ary){
    //console.log( 'poi有效的樓層' );

    var FFF=$('.thread').find('.post');
    //console.log( FFF );

    var aaa1=[];
    str_ary.forEach(function( item,index ){//遍歷元素 item=指定的樓層
        //console.log( item,index );
        //console.log( FFF[item] );
        aaa1.push( FFF[item] );
    });

    //console.log( aaa1 );//指定範圍內的文章

    FFF='';
    var aaa1b=[];
    aaa1.forEach(function( item,index ){//遍歷元素
        //console.log( item,index );
        FFF= $(item).find('.file-thumb');//img

        if( FFF.length > 0){ //有找到縮圖
            //console.log( FFF );
            //aaa1b.push( item );
            //aaa1b.push( $(FFF[0]).attr('src') );//縮圖

            var 連結=$(FFF[0]).attr('href');
            //console.log( 連結 );
            var chk=0;
            if(連結.match(/jpg$/)){chk=chk+1;}
            if(連結.match(/png$/)){chk=chk+1;}
            if( chk >0 ){
                aaa1b.push( 連結 );
            }else{
                //只接受jpg
                delete str_ary[index];
            }
        }else{
            //沒找到圖片
            delete str_ary[index];
        }
    });

    //console.log( str_ary );
   	str_ary=str_ary.filter(function(item,index){
        //console.log( FFF );
        //var found=item.isInteger();
  		if( parseInt(item) === item ){return true;}//留下整數 去掉空陣列
    });
    //
    if( str_ary.length > 0){ //有
        FFF=''+str_ary.toString();
    }else{
        FFF='無';
    }

    console.log( FFF );//有效的樓層
    $('#poi220815m').append('<br/>有效的樓層：'+FFF);

    //console.log( aaa1b );//要下載的圖片連結
    FFF='';
    FFF=[0,aaa1b];
    var traveler=FFF;
    //
    poi下載圖片(traveler); //啟動下載程序

}//





function poi下載圖片(traveler){
    var cc=traveler[0];
    var aaa1b=traveler[1];
    //
    console.log( cc,aaa1b.length );
    //
    if( cc < aaa1b.length){
        //沒事
        console.log( 'yy' );
    }else{
        console.log( 'nn' );
        $('#poi220815m').append('<br/>正常結束');
        return 0;//不正確 中止
    }//if
    var FFF=cc+1;
    $('#poi220815m').append('<br/>'+'('+FFF+'/'+aaa1b.length+')');

    var imgurl=aaa1b[cc];//取得原圖網址



    console.log( imgurl );
    var xhr = new XMLHttpRequest();
	xhr.onprogress = function(e){
		//console.log( 'xhr.onprogress' );
		var aa=0.0 + (e.loaded / e.total);
		aa= (aa * 100);//百分比
		var aa3 = aa.toFixed(2);//取小數2位
		var new_aa='';
		new_aa=''+aa3+'%';
		//console.log( new_aa );
	    var ee = document.querySelector("#poi220815aa01");
        //var aa = document.getElementById('poi220815aa01');
		ee.innerHTML=new_aa;


	};

    xhr.onreadystatechange = function(e){
        if(this.readyState == 4){
            if( this.status == 200 ){
                console.log( this.getAllResponseHeaders() );
                poi下載圖片2(traveler,this);//讀取圖片
            }
        }
    };



    xhr.open('GET', imgurl);
    xhr.responseType = 'blob';
    xhr.send();

}

function poi下載圖片2(traveler,this2){
    //console.log( traveler,this2 );
    var cc=traveler[0];
    //
    var img = document.getElementById('poi220815img01');
    img.onload = function(e){
        poi下載圖片3(traveler,img.src);
    };
    img.src = window.URL.createObjectURL(this2.response);

}//

function poi下載圖片3(traveler,in1){
    //console.log( traveler,in1 );
    var cc=traveler[0];
    //
    var aa = document.getElementById('poi220815aa01');
    aa.href = in1;
    aa.download='';//自動下載blob
    aa.click();
    //aa.href = '#';
    //使用jq動畫做計時器
    //$("#poi220815img01").slideUp( 1000 ).slideDown( 1000 ,function(){
    $("#poi220815img01").animate({width: "20px"}, 1000).animate({width: "100px"}, 1000 ,function(){
        traveler[0]=cc+1;
        //console.log( traveler );
        poi下載圖片(traveler);
    });
}


function poi標示樓層(){ //標示樓層
    var FFF='';
    FFF=$('.thread').find('.post-head');
    //console.log( FFF );
    var cc=0;
    FFF.each(function( index,item ){//遍歷元素
        //console.log( index,item );
        $(item).prepend('<h1 style="text-align:left;">'+cc+'</h1>');//append
        cc++;
    });

}


function poi_處理(){
    var aa = $('.file-text');
    //console.log( aa );
    aa.each(function( index,item ){//個別討論串
        var FFF=$(item).find('a').attr('href');
        console.log( FFF );
        if( /jpg$/.test( FFF ) ){
            poi4(item);
        } //不處理
    });

}


function 沒用到(){

    if( /jpg$/.test( imgurl ) ){
        //CDN1
        //imgurl=imgurl.substr(2);
        //imgurl='https://i0.wp.com/'+imgurl+'?fit=2048,2048&quality=85';//&&quality=85
    }//允許jpg
    if( /png$/.test( imgurl ) ){
        //CDN2
        //imgurl='http:'+imgurl;
        //imgurl='https://images.weserv.nl/?url=' + imgurl + '&output=jpg&q=85&filename=' + imgurl.match(/[0-9]{10,}/) +'&w=2048&h=2048&fit=inside&we';//
    }//允許png


    //blocked by CORS policy: No 'Access-Control-Allow-Origin'
    //K島圖片沒有允許跨來源資源共用 用圖片CDN處理一下



}
