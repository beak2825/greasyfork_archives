// ==UserScript==
// @name         MOOC假完成
// @namespace    https://lafish.fun/
// @version      1.2
// @description  仅在本地显示，仅供自我安慰，食用方法见下方。
// @author       lafish
// @match        https://www.icourse163.org/learn/*
// @match        http://www.icourse163.org/learn/*
// @match        http://www.icourse163.org/spoc/learn/*
// @match        https://www.icourse163.org/spoc/learn/*
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/404206/MOOC%E5%81%87%E5%AE%8C%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/404206/MOOC%E5%81%87%E5%AE%8C%E6%88%90.meta.js
// ==/UserScript==
var perSenti=0;
function changE(classnamE,addclassnamE){
    $(classnamE).addClass(addclassnamE);
}

$(document).keydown(function(event){
    if(event.keyCode == 49){
        changE("div.f-icon.lsicon.f-fl","learned");
    }
    if(event.keyCode == 50){
        changeP(1);
    }
    if(event.keyCode == 51){
        changeP(2);
    }
});

function changeP(a){
    for(var i =0;i<$("div.icon-"+a).length;i++){
       if( $("div.icon-"+a).eq(i).is($('.icon-3'))){
    continue;
       }else{
        $("div.icon-"+a).eq(i).addClass('icon-3');
    break;
       }
    }
}