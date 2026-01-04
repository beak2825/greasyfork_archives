// ==UserScript==
// @name            考试资料网跳转显示答案
// @namespace       https://github.com/cuifeiran/ppkao/
// @version         0.1.4
// @description     对单个题目进行跳转，使得跳转后的页面显示题目的答案。期间可能需要验证,遇到问题可以在GitHub issue我～
// @author          Dave
// @match           *://www.ppkao.com/tiku/shiti/*
// @match           *://www.ppkao.com/kaoti/*
// @include         *://www.ppkao.com/tiku/shiti/*
// @include         *://www.ppkao.com/shiti/*
// @include         *://www.ppkao.com/kaoti/*
// @include         *://www.ppkao.com/daan/*
//@contributionURL
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/397742/%E8%80%83%E8%AF%95%E8%B5%84%E6%96%99%E7%BD%91%E8%B7%B3%E8%BD%AC%E6%98%BE%E7%A4%BA%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/397742/%E8%80%83%E8%AF%95%E8%B5%84%E6%96%99%E7%BD%91%E8%B7%B3%E8%BD%AC%E6%98%BE%E7%A4%BA%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {
 'use strict';
//清除限制题目访问数量的cookie
 var Days = 30;
 var exp = new Date();
 exp.setTime(exp.getTime() + Days*24*60*60*1000);
 document.cookie="PPKAO=PPKAOSTID=&PPKAOCEID=&PPKAOSJID=&UserName=&EDays=; domain=ppkao.com;expires="+exp.toGMTString()+";path=/";
//获取当前页面URL
 var iSite = window.location.href;
 var reg = /[1-9][0-9]*/g; 
 var numList = iSite.match(reg);   
 var isKaoti =new RegExp("kaoti").test(iSite);
 var isTiku =new RegExp("tiku").test(iSite);
 var isShiti =new RegExp("shiti").test(iSite);
 var isDaan =new RegExp("daan").test(iSite);
 var sUrl="";
 if (isKaoti===true){sUrl='https://api.ppkao.com/mnkc/kaoti/?id='+ numList;window.location.href =sUrl;}
    else{
        if(isTiku===true){sUrl='https://api.ppkao.com/mnkc/tiku/?id='+ numList;window.location.href =sUrl;}
        else{
            if(isShiti===true){sUrl='https://api.ppkao.com/mnkc/shiti/?id='+ numList;window.location.href =sUrl;}
           
        }
     }

   })();