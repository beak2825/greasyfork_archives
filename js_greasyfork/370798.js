// ==UserScript==
// @name         bypassbalabala
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  跳过知识产权局废话
// @author       peasshoter
// @include        http://cpservice.sipo.gov.cn/home/toDisclaimer.action
// @include       http://cpquery.cnipa.gov.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370798/bypassbalabala.user.js
// @updateURL https://update.greasyfork.org/scripts/370798/bypassbalabala.meta.js
// ==/UserScript==

if (location.hostname === 'cpservice.sipo.gov.cn') {
    window.location.href="http://cpservice.sipo.gov.cn/dzsq/business.jsp?witchPage=2";
}


//if (location.hostname === 'cpquery.sipo.gov.cn') {
//    var ps=document.querySelectorAll("img");
//    ps[7].click()
    //$('div.wrap').children('div.login_wrap').children('div.sear').children('img').click();


    //    $('#agreeid').attr("checked","checked");
    //    $('#disagreeid').removeAttr("checked");
    //    $('#goBtn').removeAttr("disabled");
    //    $('#goBtn').click();
//}
if (location.hostname === 'cpquery.cnipa.gov.cn') {

        $('#agreeid').attr("checked","checked");
        $('#disagreeid').removeAttr("checked");
        $('#goBtn').removeAttr("disabled");
        $('#goBtn').click();
}

//$(document).ready(click);}