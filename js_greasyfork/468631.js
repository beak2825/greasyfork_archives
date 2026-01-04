// ==UserScript==
// @name         各学校一键评教
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一键评教
// @author       阿绿
// @contributionURL https://afdian.net/a/tiku_01
// @match        http://jw.nbdhyu.edu.cn/*
// @icon         https://bkimg.cdn.bcebos.com/pic/4ec2d5628535e5dde7114110e88eb0efce1b9c16c4e1
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468631/%E5%90%84%E5%AD%A6%E6%A0%A1%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/468631/%E5%90%84%E5%AD%A6%E6%A0%A1%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function (_this) {
    $('body').find("select").each( (index,div)=>{
        if(index == 0){
            return;
        }else if(index % 2){
            $(div).val("A");
        }else{
            $(div).val("B");
        }
        
    })
    

})();