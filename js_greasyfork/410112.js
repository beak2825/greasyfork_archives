// ==UserScript==
// @name         共享账号
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  分享指定页面的cookie
// @requir       https://code.jquery.com/jquery-latest.js
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/layer.js
// @author       那谁谁谁
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @grant        GM_notification
// @grant        GM_addStyle
// @match        http://ibaotu.com/*
// @match        https://588ku.com/*
// @match        https://*.58pic.com/*
// @match        http://699pic.com/*
// @match        https://*.picaoa.com/*
// @match        https://*.28ku.cn/*
// @match        http://www.28ku.cn:8080/*
// @downloadURL https://update.greasyfork.org/scripts/410112/%E5%85%B1%E4%BA%AB%E8%B4%A6%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/410112/%E5%85%B1%E4%BA%AB%E8%B4%A6%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //
    function check_login(site){
        if (site == 'ibaotu'){
            if ($(".baotu-id").html() != undefined){
                console.log('已登录')
                return true
            }else{
                console.log('未登录')
                return false
            }
        } else if (site == '58pic'){
            if ( $("#isLoginHidden").val() == '1' ){
                console.log('已登录')
                return true
            }else{
                console.log('未登录')
                return false
            }
        } else if (site == '588ku'){
            if (unsafeWindow.globaluid != '0'){
                console.log('已登录')
                return true
            }else{
                console.log('未登录')
                return false
            }
        } else if (site == '699pic'){
            if (unsafeWindow.CONFIG['isLogin'] != '0'){
                console.log('已登录')
                return true
            }else{
                console.log('未登录')
                return false
            }
        } else if (site == '588ku'){
            if (unsafeWindow.globaluid != '0'){
                console.log('已登录')
                return true
            }else{
                console.log('未登录')
                return false
            }
        } else if (site == '588ku'){
            if (unsafeWindow.globaluid != '0'){
                console.log('已登录')
                return true
            }else{
                console.log('未登录')
                return false
            }
        } else if (site == '588ku'){
            if (unsafeWindow.globaluid != '0'){
                console.log('已登录')
                return true
            }else{
                console.log('未登录')
                return false
            }
        } else if (site == '588ku'){
            if (unsafeWindow.globaluid != '0'){
                console.log('已登录')
                return true
            }else{
                console.log('未登录')
                return false
            }
        } else if (site == '588ku'){
            if (unsafeWindow.globaluid != '0'){
                console.log('已登录')
                return true
            }else{
                console.log('未登录')
                return false
            }
        } else if (site == '588ku'){
            if (unsafeWindow.globaluid != '0'){
                console.log('已登录')
                return true
            }else{
                console.log('未登录')
                return false
            }
        }
    }
    function setCookie(cname,cvalue,exhours){
        var d = new Date();
        d.setTime(d.getTime()+(exhours*60*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cname+"="+cvalue+"; "+expires;
    }
    function getCookie(cname){
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
        }
        return "";
    }
    var sleep = function(time) {
        var startTime = new Date().getTime() + parseInt(time, 10);
        while(new Date().getTime() < startTime) {}
    };
    function get_sitename(){
        var domain = document.location.host;
        var domain_list = domain.split('.');
        var sitename = '';
        if (domain_list.length == 2){
            sitename = domain_list[0]
        }else{
            sitename = domain_list[1]
        }
        return sitename
    }
    async function getUser(){
        var domain = document.URL
        var lcs = window.localStorage.vuex
        //var data = $.parseJSON(lcs)
        console.log(lcs)
        GM_setValue('login_data', lcs)
    }
    function saveData(data){
         GM_xmlhttpRequest({
             method: 'POST',
             data:JSON.stringify(data),
             url: "http://192.168.0.188:8000/api/add_cookie",
             dataType: "json",
             headers: {
                 "Content-Type": "application/json"
             },
             onload: function(response) {
                 data = $.parseJSON( response.responseText )
                 console.log(data);
                 if (data.code == 0){
                     var head = document.head || document.getElementsByTagName('head')[0];
                     var link = document.createElement("link");
                     link.rel = "stylesheet";
                     link.type = "text/css";
                     link.href = "https://www.layuicdn.com/layui/css/layui.css";
                     head.appendChild(link)
                     var ele= document.createElement("script");
                     ele.setAttribute("type", "text/javascript");
                     ele.setAttribute("src", "https://www.layuicdn.com/layer/layer.js");
                     head.appendChild(ele)
                     layer.msg('您已成功分享cookie', { icon: 1, time: 3000, shade: [0.1, '#000', true] });
                     setCookie('picaoa_share', '1', 1)
                 } else {
                     GM_openInTab('https://a.picaoa.com/', false)
                 }
                 //alert(data.msg);
             },
         });
     }
    if (document.URL.indexOf('picaoa') != -1 || document.URL.indexOf('28ku') != -1){
        getUser()
    } else {
        var picaoa_share = getCookie('picaoa_share');
        if (picaoa_share != '1'){
            var sitename = get_sitename();
            if (check_login(sitename)){
                var data = GM_getValue('login_data', '')
                if (data != ''){
                    data = $.parseJSON(data)
                    data['cookie'] = document.cookie;
                    data['site'] = sitename;
                    console.log(data)
                    saveData(data)
                } else {
                    GM_openInTab('https://a.picaoa.com/', false)
                }
            }
        }
    }
})();