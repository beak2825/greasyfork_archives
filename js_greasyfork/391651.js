// ==UserScript==
// @name         抓取header測試
// @description  測試用
// @namespace    https://greasyfork.org/zh-TW/scripts/391651
// @version      2019.11.01.3000
// @author       You
// @grant        none

// @include      *://*.komica.org/00/*
// @include      *://*.komica.org/00/*
// @exclude      *://*.komica.org/00/src/*
// @exclude      *://*.komica.org/00/thumb/*
// @exclude      *.jpg
// @exclude      *.png
// @exclude      *.webm

// @downloadURL https://update.greasyfork.org/scripts/391651/%E6%8A%93%E5%8F%96header%E6%B8%AC%E8%A9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/391651/%E6%8A%93%E5%8F%96header%E6%B8%AC%E8%A9%A6.meta.js
// ==/UserScript==

try{}
catch(err){}
finally{}

$(document).ready(function() {
    //console.log( '191027' );
    var aa=$("div.bar_reply:contains('回應模式')");
    if( aa.length ){
        $(".thread").before('<poi><button type="button">header測試</button></poi>');
        $("poi > button:contains('header測試')").click(function(){
            //var aa=$(this);
            //console.log( aa );
            $(this).after('go');
            poi(); //回應模式才執行
        });
    }
});

function poi(){
    var aa=$('.file-text');
    //console.log( aa );
    $.each(aa, function( index, value ) {
        var aa2=$(value).find('a').text();
        //console.log( aa2 );
        var aa3=$(value).find('a').attr('href');
        //console.log( aa3 );
        //
        //if( aa2.match(/webm$/) ){
        if( aa2.endsWith('webm') ){
            //console.log( '是' );
            //$(value).after('<img src="'+aa3+'" style="width:20px;height:20px;">');
        }else{
            //console.log( '否' );
            //$(value).after('<img src="'+aa3+'" style="width:20px;height:20px;">');
            //poi2(aa3);
        }
        //
        poi2(aa3,value);

    });

}
//
function poi2(in1,in2){
    var xhr = new XMLHttpRequest();
    var method = 'head';
    var url = in1;
    xhr.open(method,url,true);
    xhr.send(null);

    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            if(xhr.status == 200){
                //console.log(xhr.getAllResponseHeaders());
                $(in2).find('a')[0].append('成功');
                console.log('成功');
            }else{
                console.log('失敗');
            }
        }
    }
}//poi2()







///
