// ==UserScript==
// @name         今年一定島 標示直播時間
// @description  汲汲營營大報社
// @author       稻米
// @namespace    https://greasyfork.org/zh-TW/scripts/486916
// @version      2024.10.29.0020.build16299

// @match        *://gaia.komica.org/00b/*
// @match        *://gaia.komica1.org/00b/*
// @match        *://gaia.komica2.cc/00b/*
// @match        *://gita.komica1.org/00b/*

// @exclude      *://*/00b/src/*
// @exclude      *://*/00b/thumb/*

// @grant        none
// @license      WTFPL

// @downloadURL https://update.greasyfork.org/scripts/486916/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%A8%99%E7%A4%BA%E7%9B%B4%E6%92%AD%E6%99%82%E9%96%93.user.js
// @updateURL https://update.greasyfork.org/scripts/486916/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%A8%99%E7%A4%BA%E7%9B%B4%E6%92%AD%E6%99%82%E9%96%93.meta.js
// ==/UserScript==

//jquery
try{}
catch(err){}
finally{}
//
$(document).ready(function() {
    poi();
});

function poi(){
    //console.log( 'poi' );
    var aa=window.location.href.match("\\?res=");
    //console.log( aa );
    if( aa ){
        //ok //確認是回應模式的網址
    }else{
        return;
    }
    //
    var bb=$("div.bar_reply:contains('回應模式')");
    //console.log( bb );
    if( bb.length ){
        //ok //確認是回應模式
    }else{
        return;
    }
    //
    var FFF='';
    FFF=$('body').attr('poi240208exists');
    if( FFF == 1 ){
        console.log( '只執行一個腳本' );
        return 0;//只執行一個腳本 中止
    }else{
        $('body').attr('poi240208exists','1');
    }
    //console.log( '回應模式才執行' );
    poi240208();
}//poi()


function poi240208(){
    //console.log( 'poi240208' );
    //$.poi240208=[14,30];//測試 沒用到
    poi240208建立啟動按鈕();
}

function poi240208建立啟動按鈕(){
    //console.log(arguments.callee.name); //poi2
    //$("#threads").before('before');
    $(".thread").before('<poi><button type="reset">標示直播時間</button></poi>');
    $("poi >button:contains('標示直播時間')").click(function(e){
        console.log( 'click' );
        e.preventDefault();//取消按鈕的預設事件1
        e.stopPropagation();//取消按鈕的預設事件2
        //
        poi240208建立按鈕事件(this);
    });
    //
}//poi2(){
function poi240208建立按鈕事件(in1){
    var 按鈕元素 = in1;
    //return;
    $(按鈕元素).parent().attr('class','poi240208box');//往上找poi標籤
    //console.log( $(this) );
    $('.poi240208box').text('123');
    $('.poi240208box').css({
        "border":"1px solid red",
        "background-color":"yellow",
        "color":"#000",
        "white-space":"nowrap",
    });//連結上背景色 不想上色就把這段刪除

    var str=`填入開播時間:
<input type="number" id="poi240208input1" pattern="[0-9]{1,2}"  min="0" max="23" required size="1" class="poi240209input">時
<input type="number" id="poi240208input2" pattern="[0-9]{1,2}"  min="0" max="59" required size="2" class="poi240209input">分
<input type="submit" value="ok" id="poi240208input3">
`;

    //type="number" min="1" max="24"
    $('.poi240208box').html(str);//插入元素
    //
    var FFF=$('.post.threadpost').find('.now').next().text();
    //console.log( FFF );
    //return;
    FFF=FFF.split(':');
    //console.log( FFF );//[時,分]
    $('#poi240208input1').val( FFF[0] );
    $('#poi240208input2').val( FFF[1] );

    //return;

    $("#poi240208input3").click(function(e){
        console.log( 'click3' );
        e.preventDefault();//取消按鈕的預設事件1
        e.stopPropagation();//取消按鈕的預設事件2
        //
        var aa1=$('#poi240208input1').val();//input的內容
        var aa2=$('#poi240208input2').val();//input的內容
        //console.log( aa1,aa2 );

        //input標籤裡的pattern規則
        if($('#poi240208input1').is(":invalid")){
            console.log( '錯誤1' );
            $('#poi240208input1').val( FFF[0] );
            //return;
        }
        if($('#poi240208input2').is(":invalid")){
            console.log( '錯誤2' );
            $('#poi240208input2').val( FFF[1] );
            //return;
        }
        //
        //$('#poi240208input1').trigger( "invalid");

        //
        poi240208每篇貼文的時間();
        //
    });//click
    //
str=`
input.poi240209input:invalid {
  background-color: #ffdddd;
  border: red solid 1px;
}
`;
document.styleSheets[0].insertRule(str,document.styleSheets[0].rules.length);//新增css規則
str=`
input.poi240209input:valid {
  background-color: #ddffdd;
}
`;
document.styleSheets[0].insertRule(str,document.styleSheets[0].rules.length);//新增css規則
//required??
//insertRule單次只能插入一個規則


    return;

}//poi240208建立按鈕事件

function poi240208送出查詢(in1){

}//poi240208送出查詢



function poi241029發文時間轉時間戳(in1){
    var [年月日,時分秒]=in1;//字串
    //console.log( 年月日,時分秒 );//ok

    var aa1=年月日.split('/');
    aa1[2]=aa1[2].split('(')[0];
    //console.log( aa1 );//.next()
/*
年aa1b[0]
月aa1b[1]
日aa1b[2]
*/
    var aa2=時分秒.split(':');
    aa2[2]=aa2[2].split('.')[0];
    //console.log( aa2 );//.next()
/*
時aa2b[0]
分aa2b[1]
秒aa2b[2]
*/

    //console.log( aa3 );//.next()
    //var aa3h=aa2.attr('poi240208時',aa3[0]);
    //var aa3i=aa2.attr('poi240208分',aa3[1]);
    //
    //發文時間_字串標準格式=aa1[0]+'-'+aa1[1]+'-'+aa1[2]+'T'+aa2[0]+':'+aa2[1]+':'+aa2[2];
    var 發文時間_時間戳='';
    發文時間_時間戳=Date.UTC(aa1[0], aa1[1],aa1[2]   ,aa2[0],aa2[1],aa2[2] );
    //console.log( 發文時間_時間戳 );//1732831248000
    return 發文時間_時間戳;


}//poi241029發文時間轉時間戳(in1)



function poi240208每篇貼文的時間(){
    var 目前的討論串=$('.thread');
    var 每篇貼文=目前的討論串.find('.post');//每篇貼文
    //console.log( 每篇貼文 );//ok
    每篇貼文.each(function( index,item ){//遍歷元素
        //console.log( '抓出時間' );//ok
        //console.log( $(item) );//ok
        var aa=$(item).find('.name');
        //console.log( aa );//.next()
        aa.css({
            "border":"1px solid red",
            "background-color":"yellow",
            "color":"#000",
            "white-space":"nowrap",
        });//連結上背景色 不想上色就把這段刪除
        //var aa2=aa.next();
        var aa1=aa.parent().find('.now').text();
        var aa2=aa.parent().find('.now').next().text();
        var FFF=[aa1,aa2];

        var 發文時間_時間戳=poi241029發文時間轉時間戳(FFF);
        //console.log( 發文時間_時間戳 );//ok
        //return;

        var 發文時間_時間差=poi240208計算時間差(發文時間_時間戳);
        //console.log( 發文時間_時間差 );//ok

        //console.log( FFF );//ok
        $(item).find('.name').text(發文時間_時間差);//更新網頁上的顯示

    });//each
    //
}//poi240208每篇貼文的時間

function poi240208計算時間差(in1){
    //console.log( in1 );
    var 發文時間_時間戳=in1;

    //
    var 自訂的開播時間_時=$('#poi240208input1').val();
    var 自訂的開播時間_分=$('#poi240208input2').val();
    var 自訂的開播時間_秒=0;
    //console.log( 自訂的開播時間_時,自訂的開播時間_分 );

    var FFF=new Date();
    //var [年,月,日]=[FFF.getFullYear(),FFF.getMonth()+1,FFF.getDate()];//失敗 非當日
    var 年月日=$('.post.threadpost').find('.now').text();
    var aa1=年月日.split('/');
    aa1[2]=aa1[2].split('(')[0];
    //console.log( aa1 );//.next()
    var [年,月,日]=aa1;
    //console.log( 年,月,日 );

    var 自訂的開播時間_時間戳=Date.UTC(年,月,日, 自訂的開播時間_時, 自訂的開播時間_分, 自訂的開播時間_秒);
    //console.log( 自訂的開播時間_時間戳 );//1732831248000

    //return;

    //var 自訂的開播時間_字串標準格式=年+'-'+月+'-'+日+'T'+自訂的開播時間_時+':'+自訂的開播時間_分+':'+自訂的開播時間_秒+'+08:00';
    //console.log( 自訂的開播時間_字串標準格式 ); //2024-10-29T18:57:0+08:00

    //console.log( 發文時間_時間戳 - 自訂的開播時間_時間戳 );

    var 發文時間_時間差 = 發文時間_時間戳 - 自訂的開播時間_時間戳;

    //return 發文時間_時間差;

    var 開播前後='經過';//0=開播後
    if(發文時間_時間差 <0){
        開播前後='提早';//1=開播前
        發文時間_時間差=Math.abs(發文時間_時間差);
    }


    var 發文時間_時間差_秒=0;
    發文時間_時間差_秒=Math.floor(發文時間_時間差/1000);//整數秒

    //大於一小時
    var 發文時間_時間差_時=0;
    if(FFF > 3600){
        發文時間_時間差_時=Math.floor(發文時間_時間差_秒/3600);//時
        var 發文時間_時間差_時_餘數=發文時間_時間差_秒%3600;
    }
    //處理剩下的餘數
    var 發文時間_時間差_分=0;
    if(發文時間_時間差_時_餘數 > 60){
        發文時間_時間差_分=Math.floor(發文時間_時間差_時_餘數/60);//分
        var 發文時間_時間差_分_餘數=發文時間_時間差_時_餘數%60;
    }



    return '('+開播前後+')'+發文時間_時間差_時+'時' +發文時間_時間差_分+'分' ;





}//poi240208計算時間差