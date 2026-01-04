// ==UserScript==
// @name         mail-download
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.ems.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ems.com.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491328/mail-download.user.js
// @updateURL https://update.greasyfork.org/scripts/491328/mail-download.meta.js
// ==/UserScript==
var script = document.createElement('script');
script.src = 'https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js';
document.head.appendChild(script);
localStorage.setItem('listIndex',0);
(function() {
    'use strict';

    var listInterval = listClick();

    var detailInterval = dowloadPdf();

    function dowloadPdf(){
        return setInterval(function(){
            if($('.progresses').length>0){
                $('.unfold-btn').click();
                clearInterval(detailInterval);
                window.print();
                listInterval = listClick();
                $('.back-button span').click();
            }
        },8000);
    }
    function listClick(){
       return setInterval(function(){
        if($('.orderDetail_bottow .el-tooltip').length>0){
            clearInterval(listInterval);
            var queryBotton = $('.orderDetail_bottow .el-tooltip:odd img');
            var listIndex = parseInt(localStorage['listIndex']);
            console.log(listIndex)
            if(!listIndex){
              listIndex = 0;
            }
            localStorage.setItem('listIndex',listIndex+1);
            if(listIndex<queryBotton.length){
                detailInterval = dowloadPdf();
                $(queryBotton[listIndex]).click();
            }
            /*else if($('.el-pager li').length>1 && !$('.btn-next').prop("disabled")){
                localStorage.setItem('listIndex',0);
                $('.btn-next').click();
                listInterval = listClick();
            }*/
        }
       },1000);
    }
})();