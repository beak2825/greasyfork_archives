// ==UserScript==
// @name         重庆大学统一认证自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  使用本脚本后，只需登陆一次重庆大学统一认证，之后就可以自动登陆了，重新登录请访问 http://ids.cqu.edu.cn/amserver/UI/Login#no_auto
// @author       wang0.618@qq.com
// @include  http://ids.cqu.edu.cn/amserver/UI/Login*
// @downloadURL https://update.greasyfork.org/scripts/39852/%E9%87%8D%E5%BA%86%E5%A4%A7%E5%AD%A6%E7%BB%9F%E4%B8%80%E8%AE%A4%E8%AF%81%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/39852/%E9%87%8D%E5%BA%86%E5%A4%A7%E5%AD%A6%E7%BB%9F%E4%B8%80%E8%AE%A4%E8%AF%81%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var QueryString = function() {
        // This function is anonymous, is executed immediately and
        // the return value is assigned to QueryString!
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return query_string;
    } ();

    console.log(window.location.href, window.location.href.indexOf('no_auto'));

    if(!localStorage.ts){
        localStorage.fail_count = 0;
        localStorage.ts = 0;
    }
    var ts = Date.parse(new Date());
    if(ts-parseInt(localStorage.ts) < 5000)
        localStorage.fail_count = parseInt(localStorage.fail_count)+1;
    else
        localStorage.fail_count = 0;
    localStorage.ts = ts;
    if(localStorage.stuid && localStorage.password && (parseInt(localStorage.fail_count)<2) && (window.location.href.indexOf('no_auto') == -1)){
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "http://ids.cqu.edu.cn/amserver/UI/Login", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("IDToken0=&IDToken1="+localStorage.stuid+"&IDToken2="+localStorage.password+"&IDButton=Submit&gx_charset=UTF-8");
        //window.history.go(-1);
        location.assign(QueryString.goto);
    }else{
        var fun = function() {
            localStorage.stuid = document.getElementById('IDToken1').value;
            localStorage.password = document.getElementById('IDToken2').value;
            //LoginSubmit(defaultBtn);
        };

        $('.button_left').bind('click',fun);
        $('form').bind('submit',fun);
    }

})();