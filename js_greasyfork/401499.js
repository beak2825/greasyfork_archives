// ==UserScript==
// @name         今年一定島 圖片log
// @description  汲汲營營大報社
// @author       稻米
// @namespace    https://greasyfork.org/zh-TW/scripts/401499
// @version      2024.10.29.0010.build16299

// @match        *://gaia.komica.org/00b/*
// @match        *://gaia.komica1.org/00b/*
// @match        *://gaia.komica2.cc/00b/*
// @match        *://gita.komica1.org/00b/*

// @exclude      *://*/00b/src/*
// @exclude      *://*/00b/thumb/*

// @grant        none
// @license      WTFPL

// @downloadURL https://update.greasyfork.org/scripts/401499/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E5%9C%96%E7%89%87log.user.js
// @updateURL https://update.greasyfork.org/scripts/401499/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E5%9C%96%E7%89%87log.meta.js
// ==/UserScript==


try{}
catch(err){}
finally{}
//

$(document).ready(function(){
    var FFF='';
    poi();
});

function poi(){
    window.gg200414=[];


    //產生按鈕
    //var aa=$(".thread");
    var aa=$("div#contents");
    //console.log(aa);
    aa.before('<poi><button type="reset">圖片log</button></poi>');

    //點擊按鈕的行為
    $("poi >button:contains('圖片log')").click(function(){
        //console.log('按鈕');
        poi200406a();//產生右上角的區塊
    });


    //回文模式才收集
    var aa2=$("div.thread");
    //console.log( aa );
    if( aa2.length == 1 ){
        poi200406_dataload();//使用window.localStorage
        //poi200406_testsave2();//使用window.indexedDB
        poi200406b();//收集網頁上的縮圖 //並存檔json
        //
    }





}

function poi200406(){}
function poi200406a(){
    //產生右上角的區塊
    var aa = $('#id_poi200413_box01');
    //console.log( aa );
    if(aa.length>0){
        //存在
        $('#id_poi200413_box01').remove();

    }else{//if
        //不存在
        var div = $("<div>").html("").attr({
            'id':'id_poi200413_box01',
            'class':'cls_poi200413_box01',
        });
        $("#threads").after(div);//

        $("#id_poi200413_box01").css({
            "background-color":"rgba(255,255,0,0.5)",
            //"background-color":"yellow",
            "border": "1px solid blue",
            "display":"block",
            "width":"400",
            "height":"400",
            "position":"fixed",
            "top":"0",
            "right":"0",
            "overflow":"scroll",
        });
        //
        var div2 = $("<div>").html("html").attr({
            'id':'id_poi200413_box02',
        });
        $("#id_poi200413_box01").prepend(div2);//
        $("#id_poi200413_box02").html('點圖顯示紀錄');
        $("#id_poi200413_box02").css({
            "border": "1px solid blue",
            "background-color":"rgba(255,255,255,0.9)",
            "width":"100%",
            "height":"",
        });
        var btn = $("<button>").html("清空紀錄").attr({
            'type':'button',
            'id':'id_poi200413_clear',
        });
        //var poi = $("<poi>").html("ppp").attr({});
        //$("#id_poi200413_box02").html(poi);
        $("#id_poi200413_box02").prepend(btn);//加入按鈕
        $("#id_poi200413_box02>#id_poi200413_clear").click(function(){
            //console.log( 'click' );
            poi200406_dataclear();//清空紀錄
            $('#id_poi200413_box01').remove();//移除右上角的區塊
            poi200406a();//產生右上角的區塊 //會重新讀取
        });
        //
        var btn2 = $("<button>").html("移除這頁的紀錄").attr({
            'type':'button',
            'id':'id_poi200413_removethispage',
        });
        $("#id_poi200413_box02").prepend(btn2);//加入按鈕
        $("#id_poi200413_box02>#id_poi200413_removethispage").click(function(){
            //console.log( 'click' );
            poi200406_removethispage();//清空紀錄
        });



        //

        poi200406_img();//縮圖

    }//if


}
function poi200406b(){
    //var bb=$(".post");
    var bb= document.querySelectorAll(".post");
    //querySelectorAll()：返回靜態NodeList物件集合
    //console.log( bb );

    var json=window.localStorage.poi200413;
    json = JSON.parse( json );
    //console.log( '剛讀檔的json',json );



    var cc=0;
    $.each(bb,function(index,item){
        //console.log( index,item,this );
        let bb2c=item.cloneNode( true );//複製一份 避免影響網頁上的元素
        //console.log( bb2c );
        //let bb2=$(item).find('.file-text');
        //let bb2=item.querySelectorAll(".file-text");
        let bb2=bb2c.querySelector(".file-text");
        //console.log( bb2 );
        if(bb2){
            //有上傳附件
            let bb3=bb2.querySelector("a");
            //console.log( bb3 );
            let str=bb3.href;
            //bb3.remove();

            let bb4='';
            //bb4=str.indexOf("/"); //=5
            //console.log( bb4 );
            bb4=str.lastIndexOf("/"); //=29
            //console.log( bb4 );
            bb4=str.slice(bb4+1);
            //console.log( bb4 );//1586847346537.jpg
            str=bb4;
            bb4=str.split('.');
            //console.log( bb4 );//["1586847346537", "jpg"]
            var tt=$.now();
            var chk=poi200406_datacheck(json,bb4[0]);
            //console.log( chk );//沒找到會回傳undefined
            if(chk){
                $.each(json.data, function( index, item ){
                    if(item.filename == bb4[0]){
                        item.time=tt;//更新紀錄時間 //??
                    }
                });
                return 1;//已經記錄過就continue
            }else{
                //console.log( '新的紀錄' );
                cc++;
            }


            //
            var thread_num=$('.post.threadpost').attr('data-no'); //首篇編號
            let thread_num2=$(item).attr('id');//id "18210442#r18210442"
            //console.log( thread_num2 );

            //console.log( bb2.innerText );
            //console.log( bb2.textContent );
            let bb5=bb2.innerText.match(/\((.*)\)/);
            //console.log( bb5[1] );
            bb5=bb5[1].split(',');
            //console.log( bb5 ); ["4271 KB", " 4032x3024"]
            bb5[0]=bb5[0].split(' ');
            bb5[1]=bb5[1].trim().split('x');
            //console.log( bb5 );

            let ww=bb5[1][0];
            let hh=bb5[1][1];
            ww=parseInt( ww );
            hh=parseInt( hh );
            //console.log( ww,hh );
            let rr='';
            if(ww > hh){
                //console.log( '大' );
                rr=( ww / hh );
            }else{
                //console.log( '小' );
                rr=( ww / hh );
            }
            //rr=rr.toFixed(3);
            rr=''+rr;
            rr=rr.substring(0,rr.indexOf('.')+6);
            //console.log( rr );//圖片長寬比例


            //var tt=$.now();
            var feed = {
                filename: bb4[0],
                fileext: bb4[1],
                thread: thread_num+'#'+thread_num2,
                size:bb5[0][0],
                width:ww,
                height:hh,
                wh_rate:rr,
                time:tt,
                };
            json.data.push(feed);
            //console.log( json );
        }
    });//each
    //console.log( '新的紀錄=',cc );



    //console.log( '傳遞前的json',json );
    poi200406_datasave(json);
}

function poi200406_dataload(){
    var aa=window.localStorage;
    //console.log(aa);
    if(!aa){
        //console.log('不支援localStorage');
        $("poi >button:contains('圖片log')").css({
            'background-color':'red',
        });

        return;
    }else{
        //
    }
    ////
    if(window.localStorage.poi200413){
        //console.log( '存在');
        //檢查結構 是否能被解析
        //window.localStorage.setItem('poi200413', '{"ver":200414,"data":[]}');
        //window.localStorage.setItem('poi200413', '壞掉的資料');
        var json=window.localStorage.poi200413;
        //console.log( '原本的localStorage',json );
        json=poi200406_dataload_trycatch(json);
        //console.log( '檢查後的json',json );
        if(json=='error'){
            //失敗 重新產生json
            console.log( '資料異常' );
            window.localStorage.setItem('poi200413', '{"ver":200414,"data":[]}');
            json=window.localStorage.poi200413;
            json=poi200406_dataload_trycatch(json);
        }else{
            //成功
            //console.log( '測試用資料',json.ver );
        }
    }else{
        //console.log( '不存在');
        //重新產生
        window.localStorage.setItem('poi200413', '{"ver":200414,"data":[]}');
        json=window.localStorage.poi200413;
        json=poi200406_dataload_trycatch(json);
    }
    //console.log( 'localStorage.poi200413',json );
    //console.log( json );

    var new_array=[];
    $.each(json.data,function( index, item ){
        let pp0=(typeof item);
        //console.log( pp0 );//
        if(pp0=='object'){
            //正常
            new_array.push(item);
        }else{
            //不正常
            //json.data.splice(index, 1);
        }
    });
    //console.log( new_array );//
    json.data=new_array;


    //console.log( 'localStorage.poi200413',aa2 );
    //var json='{"ver":200414,"data":[]}';
    //window.localStorage.poi200413='{"ver":200414,"data":[]}';
    //var json=window.localStorage.poi200413;
    //json = JSON.parse( json );
    //console.log( '剛讀檔的json',json );

}


function poi200406_dataload_trycatch(in1){
    var json=in1;
    //
    var aa='';
    try{
        //console.log( 'try' );
        json = JSON.parse( json );
        aa=json;
    }
    catch(err){
        //console.log( 'catch',err );
        aa='error';
    }
    finally{
        //console.log( 'finally',aa );
        //return aa;
    }




    return aa;


}
function poi200406_dataclear(){
    window.localStorage.poi200413='{"ver":200414,"data":[]}';
}
function poi200406_removethispage(){
    console.log( 'removethispage' );
    var FFF=$('.post.threadpost');
    console.log( FFF );
    if(FFF.length >1){
        //終止
        console.log('只能在回文模式使用');
        return;
    }else{
        //繼續
    }



    var json=window.localStorage.poi200413;
    json = JSON.parse( json );
    //console.log( json );
    //
    var thread_num=$('.post.threadpost').attr('data-no'); //首篇編號
    //console.log( thread_num );
    //var str=/123/;//特殊 不用加引號的字串//gi
    var str=RegExp(''+thread_num);
    //console.log( str );
    $.each(json.data, function( index, item ){
        //console.log( index, item );
        //console.log( item.thread );
        let pp=item.thread.match(str);
        //console.log( pp );
        if(pp){
            //console.log( 'yy' );
            //json.data[index];
            json.data[index]='';
        }else{
            //console.log( 'nn' );
            //不符合
        }

        //
    });//each
    //console.log( json );
    poi200406_datasave(json);
    $('#id_poi200413_box01').remove();//移除右上角的區塊
    poi200406a();//產生右上角的區塊 //會重新讀取

}


function poi200406_datasave(in1){
    var json = in1;
    //


    //
    var tt=$.now();
    //console.log( tt );//時間戳記 1578385760139
    var new_array;
    new_array=[];
    $.each(json.data, function( index, item ){
        //console.log( index, item );//
        let pp0=(typeof item);
        //console.log( pp0 );//
        if(pp0=='object'){
            //正常
            let pp1=Object.keys(item);
            //console.log( pp1 );//
            let pp2=pp1.includes('filename');
            //console.log( pp2 );//
            if(pp2){
                new_array.push(item);
            }else{
                //??
            }
        }else{
            //不正常
        }
    });//each
    json.data=new_array;

    new_array=[];
    $.each(json.data, function( index, item ) {
        //console.log( index, item );//
        let tt2=Math.floor( (tt - item.filename)/1000 ) ; //
        //let tt2=Math.floor( (tt - item.time)/1000 ) ; //
        //console.log( tt2 );
        if( tt2 > 4*24*3600){ //24小時 //超過時間的就移除
            //console.log( '找到' );
            //return 1;
            //console.log( json.data[index] );
            //delete json.data[index];
            //json.data.splice(index, 1);
            //console.log( json.data[index] );
        }else{
            new_array.push(item);
            //console.log( '沒找到' );
            //return 0;
        }
    });//each
    json.data=new_array;



    var result=json.data.find(function(item,index){
        //console.log( item,index );
    });//find

    //console.log( '存檔前的json',json );
    var json_str=JSON.stringify( json );
    window.localStorage.poi200413=json_str;
    //console.log( window.localStorage.poi200413 );
}

function poi200406_datacheck(in1,in2){
    //檢查是否已經記錄過
    var json=in1;
    var name=in2;
    //
    //console.log( json.data );
    var result=json.data.find(function(item,index){
        //console.log( item,index );
        if(item){
            //
        }else{
            return 0;//不存在
        }
        if( item.filename == name ){
            //console.log( '找到' );
            return 1;//找到後跳出
        }else{
            //console.log( '沒找到' );
            return 0;
        }
    });//find
    return result;

}

function poi200406_img(){
    //return;
    console.log( 'poi200406_img' );
    var json=window.localStorage.poi200413;
    json = JSON.parse( json );
    console.log( '排序前',json );
    //
    json.data.sort(function(a,b){
        //console.log( a.filename,b.filename );
        var aa=parseInt( a.filename );
        var bb=parseInt( b.filename );
        //console.log( aa,bb );

        //return ( aa - bb );//舊的在前
        return ( bb - aa );//新的在前
    });
    console.log( '排序後',json );

    var str='';
    $.each(json.data, function( index, item ){
        //str=str+'<img src="https://gaia.komica.org/00/thumb/'+item.filename+'s.jpg" data_filename="'+item.filename+'">';
        str=str+'<img src="./thumb/'+item.filename+'s.jpg" data_filename="'+item.filename+'">';
    });
    $("#id_poi200413_box01").append(str);//產生縮圖
    //

    $("#id_poi200413_box01>img").css({ //設定圖片大小
        "width":"100",
        "height":"100",
        "box-sizing":"border-box",
    });
    //

    //
    $("#id_poi200413_box01>img").click(function(event){//點擊圖片的反應

        //console.log( '點擊圖片的反應' );
        //console.log( $(this) );
        //console.log( $(this).prop('x') );
        //console.log( $(this).prop('y') );
        //console.log( $(this).prop('offsetTop') );

        $("#id_poi200413_box01>img").css({
            "border": "0px",
        });
        $(this).css({
            "border": "5px solid blue",
        });

        let aa=$("#id_poi200413_box02").clone();//默认的clone中不包含事件处理器
        $("#id_poi200413_box02").remove();
        aa.insertAfter( $(this) );//在後面插入元素
        var aa2=$(this).attr('data_filename');
        //console.log( aa2 );

        var chk=json.data.find(function(item,index){
            //console.log( item,index );

            if(item.filename == aa2){
                //console.log( '找到' );
                return 1;
            }else{
                //console.log( '沒找到' );
                return 0;
            }
        });
        //
        //
        var tt=$.now();
        //console.log( tt );//時間戳記 1578385760139
        var tt2=parseInt(chk.filename);
        //console.log( tt2 );//時間戳記 1578385760139

        var tt3=Math.floor( (tt - tt2)/1000 ) ; //
        //console.log( tt3 );//相差的秒數

        var tt4=[];
        tt4[0]=tt3;//相差的秒數

        FFF=tt4[0];
        if(FFF >= 60){
            tt4[1]=[];
            tt4[1][0]='秒';
            tt4[1][1]=(FFF % 60);//餘數(秒)
            tt4[1][2]=Math.floor( FFF / 60 );//進位的分鐘數
            tt4[1][3]='分';
            //
            FFF=tt4[1][2];
            if(FFF >= 60){
                tt4[2]=[];
                tt4[2][0]='分';
                tt4[2][1]=(FFF % 60);//餘數(分)
                tt4[2][2]=Math.floor( FFF / 60 );//進位的小時數
                tt4[2][3]='時';
                //
                FFF=tt4[2][2];
                if(FFF >= 24){
                    tt4[3]=[];
                    tt4[3][0]='時';
                    tt4[3][1]=(FFF % 24);//餘數(時)
                    tt4[3][2]=Math.floor( FFF / 24 );//進位的天數
                    tt4[3][3]='天';
                    //
                    FFF=tt4[3][2];
                }else{

                }

            }
        }
        //tt4[0]=''+tt4[1][2]+'分'+tt4[1][1]+'秒';
        //console.log( tt4 );//可讀時間1

        FFF='';
        $.each(tt4, function( index, item ) {
            //console.log( index, item );
            if(index==0){return;}//跳過0
            FFF=''+item[1]+item[0]+FFF;
            if(tt4[index+1]){
                //console.log( 'yy' );
            }else{
                //console.log( 'nn' );
                FFF=''+item[2]+item[3]+FFF;
            }
            //console.log( FFF );


        });
        var str01=FFF;

        //console.log( chk );
        var FFF='';
        FFF=FFF+'<a href="./pixmicat.php?res='+chk.thread+'">原串</a>,';
        FFF=FFF+'<a href="./src/'+chk.filename+'.'+chk.fileext+'">原圖</a>,';
        FFF=FFF+'類型'+chk.fileext+','
        //FFF=FFF+'長寬'+chk.width+'x'+chk.height+','
        FFF=FFF+''+str01+','

        $("#id_poi200413_box02").html( FFF );//產生縮圖資料
        $("#id_poi200413_box02").css({
            'position':'absolute',
            'left':'0px',
            'top':''+$(this).prop('offsetTop')+'px',

        });



        event.stopPropagation();//阻止傳遞
        event.stopImmediatePropagation();//未執行的監聽器皆不會被呼叫。
        event.preventDefault();//取消預設行為
        $( "#id_poi200413_box01" ).stop();//停止動畫

    });//點擊圖片的反應



}
