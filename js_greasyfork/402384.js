// ==UserScript==
// @name         1.新的登录页面，读取用户信息登录，并且计入查询条件到cookie.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://bmypage.kuronekoyamato.co.jp/bmypage/servlet/jp.co.kuronekoyamato.wur.hmp.servlet.user.HMPLGI0010JspServlet?cstmrCd=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402384/1%E6%96%B0%E7%9A%84%E7%99%BB%E5%BD%95%E9%A1%B5%E9%9D%A2%EF%BC%8C%E8%AF%BB%E5%8F%96%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF%E7%99%BB%E5%BD%95%EF%BC%8C%E5%B9%B6%E4%B8%94%E8%AE%A1%E5%85%A5%E6%9F%A5%E8%AF%A2%E6%9D%A1%E4%BB%B6%E5%88%B0cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/402384/1%E6%96%B0%E7%9A%84%E7%99%BB%E5%BD%95%E9%A1%B5%E9%9D%A2%EF%BC%8C%E8%AF%BB%E5%8F%96%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF%E7%99%BB%E5%BD%95%EF%BC%8C%E5%B9%B6%E4%B8%94%E8%AE%A1%E5%85%A5%E6%9F%A5%E8%AF%A2%E6%9D%A1%E4%BB%B6%E5%88%B0cookie.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //设置常量到cookie
    let data = {};
    data.searchBatchNumer =getQueryVariable('searchBatchNumer');;
    data.searchDateStart = getQueryVariable('searchDateStart');;
    data.searchDateEnd = getQueryVariable('searchDateEnd');;
    data.callBackUrl = getQueryVariable('callBackUrl');;

    console.info(JSON.stringify(data));

    setCookie('searchData',JSON.stringify(data));

    let cstmrCd = getQueryVariable('cstmrCd');
    let cstmrUserId = getQueryVariable('cstmrUserId');
    let cstmrPswd =getQueryVariable('cstmrPswd');

    console.info("cstmrCd_"+cstmrCd+"  cstmrUserId_"+cstmrUserId+" cstmrPswd_"+cstmrPswd);

    $("input[name='CSTMR_CD']").val(cstmrCd);
    $("input[name='LOGIN_USER_ID']").val(cstmrUserId);
    $("input[name='CSTMR_PSWD']").val(cstmrPswd);
    console.info("1.开始自动登录yamato系统....")

    //调用登录js方法
    func_request_Link('LOGIN');

})();

//设置参数信息到cookie,cookie属于kuronekoyamato.co.jp的domain下可以访问.
function setCookie(name,value)
{
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";domain=.kuronekoyamato.co.jp;path=/";
}

//获取URL参数
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}