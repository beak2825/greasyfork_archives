// ==UserScript==
// @name         【龙笑天下】中间跳转链接自动跳转到目标URL
// @version       1.0.3
// @description    腾讯QQ、知乎、简书等等，打开链接会被拦截跳转到中转链接，本脚本可以帮助你自动跳转到目标网址
// @author       龙笑天
// @namespace     https://greasyfork.org/zh-CN/users/831228
// @homepage      https://greasyfork.org/zh-CN/scripts/533612
// @match        http*://c.pc.qq.com/middlem.html?*
// @match        http*://c.pc.qq.com/index.html?*
// @match        *://c.pc.qq.com/*
// @match        *://cloud.tencent.com/developer/tools/blog-entry?*
// @match        *://link.zhihu.com/*
// @match        *://gitee.com/link?*
// @match        https://www.jianshu.com/go-wild*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533612/%E3%80%90%E9%BE%99%E7%AC%91%E5%A4%A9%E4%B8%8B%E3%80%91%E4%B8%AD%E9%97%B4%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%9B%AE%E6%A0%87URL.user.js
// @updateURL https://update.greasyfork.org/scripts/533612/%E3%80%90%E9%BE%99%E7%AC%91%E5%A4%A9%E4%B8%8B%E3%80%91%E4%B8%AD%E9%97%B4%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%9B%AE%E6%A0%87URL.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 开始逻辑
    var url = null,
       host = window.location.host;

    switch (host) {
        case "c.pc.qq.com":
            url = dr_getParams('pfurl');
            if( dr_isEmpty(url) ){
                url = dr_getParams('url');
            }
    console.log(url);
            break;
        case "link.zhihu.com":
        case "gitee.com":
        case "cloud.tencent.com":
            url = dr_getParams('target');
            break;
        case "www.jianshu.com":
            url = dr_getParams('url');
            break;
        default:;
    }
    //console.log(host);
    //console.log(url);

    if ( !dr_isEmpty(url) ) window.location.href = dr_auto_http(url);
})();



// 获取url查询参数
function dr_getParams(name){
    var result;
    try{
        result = getParams(name);
    }catch(err){
        result = dr_get_urlParam(name);
        // result = decodeURIComponent(/pfurl\=(.*?)&+/.exec(window.location.href)[1]);
    }
    return result;
}
function dr_get_urlParam(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    if (result) return unescape(result[2]); return null; // decodeURI(result[2])
}

// /goto/aHR0cHM6Ly9teXNzbC5jb20vc3NsLmh0bWw=
function dr_get_queryvar(name){
    var url,
        href = window.location.href,
        q = '/'+name+'/',
        index = href.indexOf(q);
    url = href.substring(index+q.length);
    return url;
}

// 给链接加上协议头
function dr_auto_http(ourl){
    var url;
    if( ourl.indexOf('//')!=-1 ){
        url = ourl;
    }else{
        url = 'http://'+ourl;
    }
    return url;
}
// js的base64_decode()
function dr_base64_decode(input){
    var rv = window.atob(input);
    rv = escape(rv);
    rv = decodeURIComponent(rv);
    return rv;
}

//判断是否为空
function dr_isEmpty(obj){
    if(typeof obj === "undefined" || obj === null || obj === ""){
        return true;
    }else{
        return false;
    }
}


