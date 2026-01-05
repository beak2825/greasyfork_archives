// ==UserScript==
// @name        wuxiaworld
// @namespace   wuxiaworld
// @include     http://www.wuxiaworld.com/*-index/*-chap*
// @include     http://www.wuxiaworld.com/cdindex-html/bo*
// @include     http://totobro.com/shen-yin-wang-zuo-chapter-*/
// @include     http://www.translationnations.com/translations/stellar-transformations/st-boo*
// @include     https://ultimatearcane.wordpress.com/jikuu-mahou/chapter-*
// @version     0.6.8.4
// @description remove all the style and merge with the successive chapters
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/26899/wuxiaworld.user.js
// @updateURL https://update.greasyfork.org/scripts/26899/wuxiaworld.meta.js
// ==/UserScript==

start = location.pathname.match(/[0-9]+/g);
start = parseInt(start[start.length-1]);
end = start+50;
start++;
title = $("head title").html();
document.head.innerHTML = "<title>"+title+"</title>";
bbbody = "";
bbbody = '<div style="background-color:white">'+$("article")[0].innerHTML+"</div>";

document.write("<head><title>"+title+"</title></head><body>"+bbbody+"</body>");
document.close();

for (i=start;i<end;i++){
    div2 = $('<div style="background-color:white" class="chapter" id="page-'+i+'"></div>\n<mbp:pagebreak/>\n');
    $("body").append(div2);
}
ajaxTime(start,end);


function ajaxTime(start,end){
    for (i=start;i<end;i++){
        test= location.href.replace(/-[^-/]*(\/?)$/,"-"+i+"$1");

        $.ajax({
            url: test,
            indexValue: i,
            success: function(data) {
                chap = $(data).find("article")[0].innerHTML;
                if ($(chap).find("a").eq(2).html().indexOf("Direct link") != -1)  testfunction($(chap).find("a").eq(2)[0].href,this.indexValue,"body","style,script","");
                else{
                    if (chap.length > 5000) {
                        $("#page-"+(this.indexValue))[0].innerHTML = chap;
                        $("#page-"+(this.indexValue)).find("#jp-post-flair").remove();
                    }
                }
            },
            error: function(data) {
                if (data.status == 500){
                    chap = $(data.responseText).find("article")[0].innerHTML;
                    if ($(chap).find("a").eq(2).html().indexOf("Direct link") != -1)  testfunction($(chap).find("a").eq(2)[0].href,this.indexValue,"#contents","","");
                    else{
                        if (chap.length > 5000) {
                            $("#page-"+(this.indexValue))[0].innerHTML = chap;
                            $("#page-"+(this.indexValue)).find("#jp-post-flair").remove();
                        }
                    }
                }
            }
        });
    }
}



function testfunction(url,i,classCss,remCss,remblabla){
    GM_xmlhttpRequest ( {
        method: 'GET',
        url: url,
        accept: 'text/xml',
        onreadystatechange: function (indexValue,css,css2,css3,urlFrom) {
            return function (response) {
                if (response.readyState != 4)
                    return;

                chap = response.responseText.replace(/<style.*?\/style>/g,"");
                $("#page-"+(indexValue))[0].innerHTML = chap;
                $("#page-"+(indexValue)).find(css2).remove();
                if (css3 != "")
                    $("#page-"+(indexValue)).find(css3).eq(0).prevAll().remove();
                oldHistory = JSON.parse(GM_getValue("history","{}"));
                if (!oldHistory[urlFrom] || oldHistory[urlFrom] < indexValue) oldHistory[urlFrom] = indexValue;
                GM_setValue("history",JSON.stringify(oldHistory));

            }
        }(i,classCss,remCss,remblabla,location.href.replace("https://","http://")),
        error: function (indexValue,css,css2,css3,urlFrom) {
            return function (response) {
                if (response.status == 500){
                    chap = $(response.responseText).find(css)[0].innerHTML + (css.indexOf(",") != -1 ? $(response.responseText).find(css)[1].innerHTML : "");

                    $("#page-"+(indexValue))[0].innerHTML = chap;
                    $("#page-"+(indexValue)).find(css2).remove();
                    if (css3 != "")
                        $("#page-"+(indexValue)).find(css3).eq(0).prevAll().remove();
                    oldHistory = JSON.parse(GM_getValue("history","{}"));
                    if (!oldHistory[urlFrom] || oldHistory[urlFrom] < indexValue) oldHistory[urlFrom] = indexValue;
                    GM_setValue("history",JSON.stringify(oldHistory));

                }
            }
        }(i,classCss,remCss,remblabla,location.href.replace("https://","http://"))
    } );

}
