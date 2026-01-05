// ==UserScript==
// @name         733 read all
// @version      0.2
// @description  读取全部漫画，删除广告
// @author       FeiLong
// @match        http://www.733dm.net/mh/*
// @grant        none
// @namespace https://greasyfork.org/users/28687
// @downloadURL https://update.greasyfork.org/scripts/24014/733%20read%20all.user.js
// @updateURL https://update.greasyfork.org/scripts/24014/733%20read%20all.meta.js
// ==/UserScript==

function isExitsVariable(variableName) {
    try {
        if (typeof(variableName) == "undefined") {
            //alert("value is undefined"); 
            return false;
        } else {
            //alert("value is true"); 
            return true;
        }
    } catch(e) {}
    return false;
}

function gonextpage()
{
    //var $jj = jQuery.noConflict(); 
    a = $j.post("/e/extend/ret_page/index.php",{id:viewid},"json");
    console.log(a);
    b = eval('(' + a.responseText + ')');
    console.log(b);
    return b.url;
}

if(isExitsVariable(photosr))
{
    document.body.innerHTML = '';
    //document.body.innerHTML = document.body.innerHTML + '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.2.1/css/bulma.css">';
    //document.body.innerHTML = document.body.innerHTML + '<a class="button" width=100%>上一章</a>';
    photosr.forEach(function a(element, index, array){console.log("<img src=\"http://733dm.zgkouqiang.cn/" + element + "\">");document.body.innerHTML = document.body.innerHTML + "<img width=100% src=\"http://733dm.zgkouqiang.cn/" + element + "\">"});
    //document.body.innerHTML = document.body.innerHTML + '<a class="button" width=100% href="' +  '">下一章</a>';
    a = $j.post("/e/extend/ret_page/index.php",{id:viewid},function(data){document.body.innerHTML = document.body.innerHTML + '<a class="button" width=100% href="' + data.url + '">下一章</a>';},"json");
}