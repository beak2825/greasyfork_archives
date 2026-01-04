// ==UserScript==
// @namespace    https://greasyfork.org/zh-TW/scripts/383425
// @name         今年一定島 看作者
// @description  汲汲營營大報社
// @author       稻米
// @version      2022.02.27.0030.build16299

// @include      *://*.komica.org/00/*
// @include      *://*.komica.org/00/*
// @exclude      *://*.komica.org/00/src/*
// @exclude      *://*.komica.org/00/thumb/*
// @exclude      *.jpg
// @exclude      *.png
// @exclude      *.webm

// @grant        none
// @license      WTFPL



// @downloadURL https://update.greasyfork.org/scripts/383425/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E7%9C%8B%E4%BD%9C%E8%80%85.user.js
// @updateURL https://update.greasyfork.org/scripts/383425/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E7%9C%8B%E4%BD%9C%E8%80%85.meta.js
// ==/UserScript==

//jquery
try{
    $(document).ready(function() {
        //console.log( 'jquery ready' );
        poi();
    });
    //throw "throw";
}
catch(err){}
finally{}
//
function poi(){
    //只在回應模式啟動
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
    //設置按鈕
    //console.log(arguments.callee.name); //poi2
    //$("#threads").before('before');
    $(".thread").before('<poi><button type="reset">看作者</button></poi>');
    $("poi >button:contains('看作者')").click(function(){
        //console.log('按鈕');
        poi3();
    });
    //
}//poi2()

/*
height:auto; width:auto;
min-width:20px; min-height:20px;
max-width:250px; max-height:250px;

*/

function poi3(){
    var aa=$(".post");
    //console.log( aa[0] ); //poi2
    var bb=$(aa[0]).find('.post-head').find('.id').attr('data-id');
    //console.log( bb ); //作者id

    //
    var cc;
    $(".post").each(function(index,item){
        //console.log( index,item ); //poi2
        cc=$(item).find('.post-head').find('.id').attr('data-id');
        //console.log( cc ); //id
        if(cc==bb){
            //console.log( '相同' ); //id
            $(item).css({
                "border":"5px solid #00ff00",
            });//高亮
        }
    });
}//poi3()




