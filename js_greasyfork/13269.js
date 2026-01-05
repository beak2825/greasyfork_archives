// ==UserScript==
// @name         bilibli 发弹幕无限制
// @namespace    http://bumaociyuan.github.io/
// @version      0.2
// @description  enter something useful
// @author       bumaociyuan
// @match        http://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13269/bilibli%20%E5%8F%91%E5%BC%B9%E5%B9%95%E6%97%A0%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/13269/bilibli%20%E5%8F%91%E5%BC%B9%E5%B9%95%E6%97%A0%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==


(function($) {

    var t = window.setInterval(function() { 
        if ($(".ABP-Comment-Input").length > 0) {
            window.clearInterval(t);
            console.log('done');
            var input = $(".ABP-Comment-Input");
            input.keypress(function(event){
                if(event.which == 13){

                    setTimeout(function(){
                        input.removeAttr('disabled');

                        input.focus();
                    },200)
                }
            });
        }
        console.log('waiting');
    }, 100);



})(jQuery);
