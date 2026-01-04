// ==UserScript==
// @name         百度去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @match        *://*.baidu.com/*
// @author       You
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382362/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/382362/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
     function clean(){
     let adv = $('#content_left').children();
    console.log('start');
    adv.each((index,item)=>{
        if(!$(item).hasClass('result')){
            $(item).remove();
            console.log('是广告');
        }else{
            console.log('不是广告');
        }
     });
     let after_adv = $('.f13 span');
     after_adv.each(function(index,item){
         if($(item).text()=='广告')
             $(item).parent().parent().hide();
         console.log('asd');
     });
     }
    clean();

    setInterval(clean,1000);
    // Your code here...
})();