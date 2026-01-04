// ==UserScript==

// @name         今年一定島 集合開串縮圖
// @description  汲汲營營大報社
// @author       稻米
// @namespace    https://greasyfork.org/zh-TW/scripts/399364
// @version      2024.07.24.0010.build16299


// @match        *://gaia.komica.org/00b/*
// @match        *://gaia.komica1.org/00b/*
// @match        *://gaia.komica2.cc/00b/*
// @match        *://gita.komica1.org/00b/*

// @exclude      *://*/00b/src/*
// @exclude      *://*/00b/thumb/*

// @grant        none
// @license      WTFPL

// @downloadURL https://update.greasyfork.org/scripts/399364/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E9%9B%86%E5%90%88%E9%96%8B%E4%B8%B2%E7%B8%AE%E5%9C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/399364/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E9%9B%86%E5%90%88%E9%96%8B%E4%B8%B2%E7%B8%AE%E5%9C%96.meta.js
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
        poi200401a();
        style();

    }
});

function style(){

}
function poi200401a(){
    //建立上方的列表區塊
    var aa=$("div#contents");
    //console.log( aa );
    aa.before("<div id='id200401'>id200401</div>");
    $('#id200401').css({
        'background':'rgb(200,200,200)',
        'color':'rgb(100,100,100)',
        'text-align':'initial',
        "width":"600px",
    });
    $('#id200401').html('');

    $("#page_switch").clone().appendTo("#id200401");
    poi200401b();
}

function poi200401b(){
    //建立上方的列表區塊
    var aa=$("div.thread");
    //console.log( aa );
    $.each(aa,function(index,item){
        //console.log( index,item );
        let aa2=$(item).find('div.threadpost');
        let aa2id=aa2.attr('data-no');
        //console.log( aa2id );

        let aa2img=aa2.find('img.img');
        if(aa2img.length > 0){
            aa2img=aa2img[0].src;
        }else{
            aa2img='404';
        }
        //console.log( aa2img );

        let aa2text=aa2.find('div.quote');
        if(aa2text.length > 0){
            aa2text=$(aa2text[0]).text();
            //console.log( aa2text );
            aa2text=aa2text.substring(0, 3);
        }else{
            aa2text='404';
        }
        //console.log( aa2text );

        let str='';
        str=str+'<img src="'+aa2img+'" style="width: 50px; height: 50px;">';
        //str='<a href="#r'+aa2id+'">'+str+'</a>';
        str=str+''+aa2text;
        str='<div class="cls200401" id="poi_'+aa2id+'" data-no="'+aa2id+'">'+str+'</div>, ';

        $('#id200401').append(str);


    });

    $('.cls200401').css({
        "border":"1px solid #000",
        "display":"inline-block",
        "white-space":"nowrap",
    });

    poi200401c();


}


function poi200401c(){
    var aa=$("div.cls200401");
    //console.log( aa );

    //滑鼠移到上面的效果
    aa.hover(
        function(){
            $(this).css({
                "background-color":"yellow",
                "color":"red",
            });
        },
        function(){
            $(this).css({
                "background-color":'initial',
                "color":'initial',
            });

        });
    //點擊區塊的反應
    aa.click(function(e) {
        e.stopPropagation(); //方法可阻止當前事件繼續進行捕捉（capturing）及冒泡（bubbling）階段的傳遞。
        let aa2id=$(this).attr('data-no');
        //console.log( aa2id );
        let aa2id2='#r'+aa2id;
        console.log( aa2id2 );


        window.location.href = ''+aa2id2;
    });

}
//