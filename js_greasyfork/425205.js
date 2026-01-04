// ==UserScript==
// @name         今年一定島 列印模式
// @description  汲汲營營大報社
// @author       稻米
// @version      2024.11.04.0010.build16299
// @namespace    https://greasyfork.org/zh-TW/scripts/425205

// @match        *://gaia.komica.org/00b/*
// @match        *://gaia.komica1.org/00b/*
// @match        *://gaia.komica2.cc/00b/*
// @match        *://gita.komica1.org/00b/*

// @exclude      *://*/00b/src/*
// @exclude      *://*/00b/thumb/*

// @grant        none
// @license      WTFPL


// @downloadURL https://update.greasyfork.org/scripts/425205/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E5%88%97%E5%8D%B0%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/425205/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E5%88%97%E5%8D%B0%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

$(document).ready(function() {
    //poi();
    poi();
});
function poi(){

    //console.log( document.styleSheets );
    //console.log(window.location.href);
    var tmp=window.location.href;
    tmp=tmp.match("\\?res=");
    //window.location.href.match("\\?res=")
    //console.log(tmp);
    if(tmp){
        if( $('div.thread').length == 1 ){
            poi2();
        }
    }else{
        //console.log('非回應');
    }
}
function poi2(){
    //console.log(arguments.callee.name); //poi2
    //$("#threads").before('before');
    $(".thread").before('<poi><button type="reset">列印模式</button></poi>');
    $("poi >button:contains('列印模式')").click(function(){
        //console.log('按鈕');
        poi3();
        $(window).off();
    });
    //

}//poi2(){

function poi3(){
    var selfres = $('.post.threadpost').attr('data-no'); //首篇編號
    console.log( selfres );
    var apiurl='./pixmicat.php?mode=module&load=mod_ajax&action=thread&html=true&op='+selfres; //綜合版原生api
    console.log( apiurl );

    var jqxhr=$.ajax({
        dataType: "json",
        url: apiurl,
    });
    jqxhr.done(function(a,b,c){
        //console.log( a,b,c ); //json,success,readyState
        var json1=a; // $.parseJSON(); //已解析
        console.log( json1.posts ); //json
        var FFF='';
        $.each(json1.posts, function(index,item){
            //console.log( index,item ); //json
            //console.log( item.com ); //json
/*
com 留言
ext 檔案類型
html
id
image 圖片
mail
name
no
now
resto
sub 標題
thumb 縮圖
time
*/

            //var aa='<h3>'+'</h3>';
var aa1=`
<div><b>
${item.name}
${item.now}
ID:${item.id}
No.${item.no}
</b></div>
`;
var aa2=`
<blockquote>
${item.com}
</blockquote>
`;
            var aa3='';;
            var imgurl;
if(item.ext=='.jpg' || item.ext=='.png'){ //顯示原圖
    
    imgurl='http:'+item.image+'';
    //imgurl='https://images.weserv.nl/?url=' + imgurl + '&output=jpg&q=85&filename=' + imgurl.match(/[0-9]{10,}/) +'&w=2048&h=2048&fit=inside&we';// http://
    //imgurl='https:'+item.thumb+'';//縮圖連結
    imgurl='https:'+item.image+'';//原圖連結
    aa3='<img src='+imgurl+' style="width:auto;height:auto;max-width:250px;max-height:250px;">';
}
if(item.ext=='.gif' || item.ext=='.webm'){ //顯示縮圖
    imgurl='https:'+item.thumb+'';//縮圖連結
    aa3='<img src='+imgurl+' style="width:auto;height:auto;max-width:250px;max-height:250px;">';
}

            FFF=FFF+'<div>'+aa1+aa2+aa3+',</div>';
        });
        //FFF=FFF+'<small><sub>end</sub></small>'
        FFF=FFF+'<div><small><sub>end</sub></small></div>'
        FFF='<div>'+FFF+'</div>';
        //console.log( FFF ); //文字
        $('html').attr('style',  'all: initial;'); //reset style
        $('head').html('');
        $('body').html('');
        $('body').append(FFF);
        //$('body').append('<img src="https://imgpoi.com/i/KRKEDM.jpg">');


    });



};

/*


如果是要把討論串存成圖片 可以在chrome按F12 會出現開發人員工具
再按ctrl+shift+p 會出現命令菜單 先輸入cap 會跳到適當的位置
選擇 Capture full size screenshot 就能擷取目前的網頁

如果覺得擷取的檔案太大 可以按ctrl+shift+m 切換成畫面較小的手機模式再擷取
*/