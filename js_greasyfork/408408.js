// ==UserScript==
// @name         今年一定島 只看開串圖
// @description  汲汲營營大報社
// @author       稻米
// @namespace    https://greasyfork.org/zh-TW/scripts/408408
// @version      2024.12.10.0011.build16299

// @match        *://gaia.komica.org/00b/*
// @match        *://gaia.komica1.org/00b/*
// @match        *://gaia.komica2.cc/00b/*
// @match        *://gita.komica1.org/00b/*

// @exclude      *.jpg
// @exclude      *.png
// @exclude      *.webm

// @grant        none
// @license      WTFPL

// @downloadURL https://update.greasyfork.org/scripts/408408/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E5%8F%AA%E7%9C%8B%E9%96%8B%E4%B8%B2%E5%9C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/408408/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E5%8F%AA%E7%9C%8B%E9%96%8B%E4%B8%B2%E5%9C%96.meta.js
// ==/UserScript==

try{}
catch(err){}
finally{}
//

$(document).ready(function(){
    var aa=$("div.thread");
    //console.log( aa );
    if( aa.length > 10 ){
        //poi(); //首頁模式才執行
        poi200808a();
        style();
    }
});

function style(){

}
function poi200808a(){
    //建立上方的列表區塊
    var aa=$("div#contents");
    //console.log( aa );
    //aa.before("<div id='id200808'>id200808</div>");
    //$('#id200808').html('<poi><button type="set">只看開串圖</button></poi>');//reset
    aa.before('<poi><button type="set">只看開串圖</button></poi>');

    $("poi >button:contains('只看開串圖')").click(function(){
        console.log('按鈕');
        poi200808b();
    });



}

function poi200808b(){
    //建立上方的列表區塊
    var aa=$("div.thread");
    //console.log( aa );
    $.each(aa,function(index,item){
        var aa2=$(item).find('div.post.reply');
        //console.log( aa2 );
        $.each(aa2,function(index,item){
            var aa3=$(item);
            //console.log( aa3 );
            //$(this)
            $(item).css({
                "border": "2px solid red",
                'display':'inline-block',
                'overflow': 'hidden',
                'margin':'0px',
                'padding':'0px',
                'width': '10px',
                'height':'10px',
            });//bottom
        });


    });




}
