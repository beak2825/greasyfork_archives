// ==UserScript==
// @name         泛微OA新标签打开
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hook openFullWindow
// @author       Echowxsy
// @match        http://oa1.makeblock.com:5050/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/375265/%E6%B3%9B%E5%BE%AEOA%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/375265/%E6%B3%9B%E5%BE%AEOA%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hook_openFullWindow(url){
        var redirectUrl = url ;
        window.open(redirectUrl,"new");
    }

    function hook_openFullWindowHaveBarForWFList(url,requestid){
        try{
            if(requestid>0){
                document.getElementById("wflist_"+requestid+"span").innerHTML = "";
            }
        }catch(e){}
        var redirectUrl = url ;
        window.open(redirectUrl,"") ;
    }

    function hook_openFullWindowForDoc(url,docid){
        try{
            $("#doclist_"+docid+"img").hide();
            $("#doclist_"+docid+"img").parent('.docdetail').find('.docnamedetail').removeAttr("style");
            $("#doclist_"+docid+"img").parent('.docdetail').find('.docnamedetail').css("color","#242424");
        }catch(e){}
        if(url.indexOf("/")==0){
            if (url.indexOf("?") != -1) {
                url += "&";
            } else {
                url += "?";
            }
            url += "e7" + new Date().getTime() + "=";
        }
        var redirectUrl = url ;
        window.open(redirectUrl,"");
    }

    unsafeWindow.openFullWindowForDoc = function (url,docid) {
        hook_openFullWindowForDoc(url,docid);
    }
    unsafeWindow.openFullWindow = function (url) {
        hook_openFullWindow(url);
    }
    unsafeWindow.openFullWindow1 = function (url) {
        hook_openFullWindow(url);
    }
    unsafeWindow.openFullWindowForXtable = function (url) {
        hook_openFullWindow(url);
    }
    unsafeWindow.openFullWindowHaveBar = function (url) {
        hook_openFullWindow(url);
    }
    unsafeWindow.openFullWindowHaveBarForWFList = function (url,requestid) {
        hook_openFullWindowHaveBarForWFList(url,requestid);
    }
})();