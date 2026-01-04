// ==UserScript==
// @name         for-zxt-tools-mail-query
// @namespace    zxt-tools
// @version      0.11.3
// @description  mail-query
// @author       You
// @match        https://www.ems.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468189/for-zxt-tools-mail-query.user.js
// @updateURL https://update.greasyfork.org/scripts/468189/for-zxt-tools-mail-query.meta.js
// ==/UserScript==

(function() {
    var script = document.createElement('script');
    script.src = 'https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js';
    document.head.appendChild(script);
    window.onload = function(){
            var interval = setInterval(function(){
                if($('#pane-1').length > 0){
                    $('#pane-1>div').last().css('height','auto');
                    $('.unfold-btn').hide();
                    $('.reminder-main').append('<div class="noprint" style="background-color:#fff;position:fixed;top:80px;right:10px;"><input style="border:1px solid #aaa" id="pdfName"><button id="winPrint">打印/下载</button></div>');
                    $('#winPrint').click(function(){
                        $('title').html('中国邮政速递物流（'+$('#pdfName').val()+'）');
                        $('.noprint').hide();
                        window.print();
                    })
                    clearInterval(interval)
                }
            },1000)
    }
})();