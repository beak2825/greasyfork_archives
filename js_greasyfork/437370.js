// ==UserScript==
// @name         获取云图梭用户cookie
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取云图梭用户cookie！
// @author       谷松
// @include      http://localhost:8080/pur/*
// @include      https://orderuat.longhu.net/pur/mobile.html/*
// @require      http://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=longfor.uat
// @grant        none
// @license       获取云图梭用户cookie
// @downloadURL https://update.greasyfork.org/scripts/437370/%E8%8E%B7%E5%8F%96%E4%BA%91%E5%9B%BE%E6%A2%AD%E7%94%A8%E6%88%B7cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/437370/%E8%8E%B7%E5%8F%96%E4%BA%91%E5%9B%BE%E6%A2%AD%E7%94%A8%E6%88%B7cookie.meta.js
// ==/UserScript==

(function() {
    'use strict';
     const cookieValue= getQueryString('CASTGC') ||getQueryString('account')
     if(cookieValue){
         document.cookie = `CASTGC=${cookieValue};path=/`;
         console.log('cookie==',cookieValue)
         replaceUrl()
     }
    //获取url上cookie信息
    function getQueryString(name) {
        const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        const r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }
    //替换当前地址，清除掉url上cookie信息
    function replaceUrl(){
     const localUrl = window.location.href
     const urlList1 = localUrl.split('?')
     const urlList2 = localUrl.split('#')
     const newUrl = `${urlList1[0]}#${urlList2}[1]`;
     history.replaceState({},'',newUrl);
    }

    // Your code here...
})();