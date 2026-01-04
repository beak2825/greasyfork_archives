// ==UserScript==
// @name         云图梭注册cookie
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  云图梭注册cookie!
// @author       谷松
// @include     https://iwork-uat.longfor.com/*
// @require      http://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=longfor.uat
// @grant        none
// @license      云图梭注册cookie
// @downloadURL https://update.greasyfork.org/scripts/437368/%E4%BA%91%E5%9B%BE%E6%A2%AD%E6%B3%A8%E5%86%8Ccookie.user.js
// @updateURL https://update.greasyfork.org/scripts/437368/%E4%BA%91%E5%9B%BE%E6%A2%AD%E6%B3%A8%E5%86%8Ccookie.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function () {
     //获取cookie中CASTGC，供方CASTGC字段httpOnly,无法获取，取cookie值相同字段account
     let cookieValue= getCookieByString('CASTGC') || getCookieByString('account')
     $('body').prepend(`<div id="link-box"><a class="link" target="_blank" href="http://localhost:8080/pur/purchasing.html?CASTGC=${cookieValue}#/CollectManage/CollectList">我方-采购订单本地环境</a><br/>
     <a class="link" target="_blank" href="http://localhost:8080/pur/supplier.html?CASTGC=${cookieValue}#/">供方-采购订单本地环境</a><br/>
     <a class="link" target="_blank" href="http://localhost:8080/pur/mobile.html?CASTGC=${cookieValue}#/Halo">手机采购订单本地环境</a><br>
     <a class="link" target="_blank" href="https://orderuat.longhu.net/pur/mobile.html?CASTGC=${cookieValue}#/Halo">手机采购订单测试环境</a></div>
     `)
     addInfrastructure()
    })

    //跳转本地按钮样式
    function addInfrastructure() {
        let style = document.createElement("style");

        style.appendChild(document.createTextNode(`
        #link-box{
         position:absolute;
         top:50px;
         right:50px;
         z-index:999;
        }
        .link{
         width:150px;
         height:30px;
         line-height:30px;
         margin:10px;
         text-align:center;
         background:pink;
         color:blue;
        }
       `));

        document.head.appendChild(style);
    }
    //获取cookie
    function getCookieByString(cookieName){
        var start = document.cookie.indexOf(cookieName+'=');
        if (start == -1) return false;
        start = start+cookieName.length+1;
        var end = document.cookie.indexOf(';', start);
        if (end == -1) end=document.cookie.length;
        return document.cookie.substring(start, end);
    }

    // Your code here...
})();