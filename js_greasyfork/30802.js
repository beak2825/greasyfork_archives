// ==UserScript==
// @name           ExHentai.org自动登录
// @namespace    http://TouHou.DieMoe.net/
// @version        0.3
// @description  看本子更简单一点。
// @author       DieMoe
// @run-at       document-start
// @include        *://*.exhentai.org/*
// @include        *://exhentai.org/*
// @grant          unsafeWindow
// @compatible firefox
// @compatible chrome
// @compatible edge
// @downloadURL https://update.greasyfork.org/scripts/30802/ExHentaiorg%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/30802/ExHentaiorg%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var igneous,ipb_member_id,ipb_pass_hash,sl;
    igneous='322abe39d';
    ipb_member_id='3512590';
    ipb_pass_hash='cfb712ea2633f9894c5dae23146f78d0';
    sl='dm_1';
    if (location.host == 'exhentai.org' && document.cookie.split(';') .length < 2) {
        alert('您尚未登录私有账号，脚本将自动登录一个公共账号。');
        autoCookie();
        window.location = '';
    }else{
        igneous=getCookie('igneous');
        ipb_member_id=getCookie('ipb_member_id');
        ipb_pass_hash=getCookie('ipb_pass_hash');
        sl=getCookie('sl');
        autoCookie();
    }

    function setCookie(c_name,value,expiredays){
        var exdate=new Date();
        exdate.setDate(exdate.getDate()+expiredays);
        document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : "; expires="+exdate.toGMTString());
    }

    function getCookie(c_name)
    {
        if (document.cookie.length>0){ 
            var c_start=document.cookie.indexOf(c_name + "=");
            if (c_start!=-1) { 
                c_start=c_start + c_name.length+1;
                var c_end=document.cookie.indexOf(";",c_start);
                if (c_end==-1) c_end=document.cookie.length;
                return unescape(document.cookie.substring(c_start,c_end));
            } 
        }
        return "";
    }
    function autoCookie(){
        setCookie('igneous',igneous,365);
        setCookie('ipb_member_id',ipb_member_id,365);
        setCookie('ipb_pass_hash',ipb_pass_hash,365);
        setCookie('sl',sl,365);
    }
})();