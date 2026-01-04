// ==UserScript==
// @name         今年一定島 影片縮圖
// @description  汲汲營營大報社
// @author       稻米
// @namespace    https://greasyfork.org/zh-TW/scripts/39842
// @version      2024.10.29.0010.build16299

// @match        *://gaia.komica.org/00b/*
// @match        *://gaia.komica1.org/00b/*
// @match        *://gaia.komica2.cc/00b/*
// @match        *://gita.komica1.org/00b/*

// @exclude      *://*/00b/src/*
// @exclude      *://*/00b/thumb/*

// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/39842/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E5%BD%B1%E7%89%87%E7%B8%AE%E5%9C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/39842/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E5%BD%B1%E7%89%87%E7%B8%AE%E5%9C%96.meta.js
// ==/UserScript==

//jquery
$(document).ready(function() {
    //console.log( 'jquery ready' );
    //全域變數//global
    //time = new Date();
    //gg=[];
    //
    poi();
    color();
});

function color(){
    $(".-expand-youtube").css({
        "background-color":"yellow",
        "border":"1px solid #000",
    });//連結上背景色 不想上色就把這段刪除
    $(".poi180324").css({
        "border":"5px solid #00ff00",
        "white-space":"nowrap",
    });//連結上背景色 不想上色就把這段刪除

}
function poi(){

    $("span.-expand-youtube").each(function(index, value){ // div.post-head
        //console.log(index, $(value).parent().prev().text() );//.next();.prev();.siblings();
        //var url_p = new URLSearchParams( $(value).parent().prev().text() );
        var url_p1 = new URL( $(value).parent().prev().text() );
        //console.log( url_p1 );//解析網址參數
        var tmp='';
        var poi241009vid='';
        switch(url_p1.hostname) {
            case 'youtube.com': //長網址的參數
            case 'www.youtube.com': //長網址的參數
            case 'm.youtube.com': //長網址的參數
                //console.log( 'switch' );
                //tmp=url_p1.search;//.substr(1)
                tmp=url_p1.searchParams;
                //console.log( tmp.get('v') );// 格式 https://www.youtube.com/watch?v=a0C_LAy82og
                //
                if( tmp.get('v') != null ){
                    //console.log( 'yy' );//
                    // 格式 https://www.youtube.com/watch?v=a0C_LAy82og
                    //tmp=url_p2.get('v');
                    poi241009vid=tmp.get('v');
                    //console.log( tmp );//
                }else{
                    //console.log( 'nn' );//
                    //search沒有值
                    //console.log( url_p1.pathname );//
                    tmp=url_p1.pathname;//pathname:"/live/VarjYd5IekA"
                    tmp=tmp.split('/');
                    //console.log( tmp );//

                    var cc=0;
                    if(tmp[1]=="shorts"){cc=cc+1;}
                    if(tmp[1]=="live"){cc=cc+1;}
                    if(cc==0){
                        break;
                    }

                    poi241009vid=tmp[2];
                    //console.log( tmp );//
                }//if
                //console.log( poi241009vid );


                break;
            case 'youtu.be': //短網址的參數
                poi241009vid=url_p1.pathname.substr(1);
                //console.log( poi241009vid );
                break;
            default:
                //console.log('switch default');//取得的video id
                break;
        }
        //console.log( poi241009vid );//取得的video id


        if(0){
            console.log( tmp );
            console.log( typeof tmp );
            console.log( void(0) );//產生undefined
            console.log( $.isEmptyObject(tmp) );//检查一个对象是否为空对象。
            console.log( $.isPlainObject(tmp) );//检查一个对象是否为纯粹对象。
        }
        //console.log( tmp );//解析網址參數
        //if(tmp == null){console.log( 'null.01' );}
        //if(tmp === null){console.log( 'null.02' );}

        var video_id=poi241009vid;
        if( video_id ){
            //console.log( tmp );//取得網址參數
            //tmp='http://img.youtube.com/vi/'+tmp+'/sddefault.jpg';//.substr(1)
            //console.log( tmp );//取得影片縮圖

            var html='';
            //tmp='http://img.youtube.com/vi/'+vid+'/sddefault.jpg';//.substr(1)
            //html=html+'<img src="'+tmp+'" width="200px" height="200px">';

            tmp='https://img.youtube.com/vi/'+video_id+'/default.jpg';//.substr(1) //0.jpg
            html=html+'<img src="'+tmp+'"> ';
            tmp='https://img.youtube.com/vi/'+video_id+'/1.jpg';//.substr(1)
            html=html+'<img src="'+tmp+'"> ';
            tmp='https://img.youtube.com/vi/'+video_id+'/2.jpg';//.substr(1)
            html=html+'<img src="'+tmp+'"> ';
            tmp='https://img.youtube.com/vi/'+video_id+'/3.jpg';//.substr(1)
            html=html+'<img src="'+tmp+'"> ';

            html='<br/><span class="poi180324">'+html+'</span>';
            $(value).parent().after(html);
            var box=$(value).parent().next().next();
            //console.log( box );
            var title=poi_191012(poi241009vid,box);//取得文字標題
        }






    });
    //
}//function poi(){

function poi_191012(in1,in2){
    //取得文字標題
    var [poi241009vid,box]=[in1,in2];
    //in1=
    var url='';
    url='https://www.youtube.com/watch?v='+poi241009vid;//poi241009vid
    url='https://noembed.com/embed?url='+url;
    //console.log(xx);

    try{
        $.getJSON( url, function( data ) {
            //console.log(data.title);
            //return data.title;
            if(data.title){
                box.append( '<br/>'+data.title );
            }else{
                box.append( '?' );
            }
        });
    }
    catch(err){
        console.log( ''+err.message );
    }
    finally {
        //console.log( 'try-catch-finally' );
    }
}//poi_191012(in1)







