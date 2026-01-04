// ==UserScript==
// @name         斗鱼弹幕助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @icon         https://shark.douyucdn.cn/app/douyu/res/com/sg-taskicon.png
// @description  自动发弹幕
// @author       Kevin<kennwong3914@gmail.com>
// @match        https://www.douyu.com/485503
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374581/%E6%96%97%E9%B1%BC%E5%BC%B9%E5%B9%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/374581/%E6%96%97%E9%B1%BC%E5%BC%B9%E5%B9%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('欢迎使用斗鱼助手');
    var room = document.location.pathname.split('/')[1]
    var re = /^\d+$/;
    if(!re.test(room)){
        console.log('==outdoor==')
    }else{
        setTimeout(function (){
            var s = $('h5.ShieldTool-checkText')[0].innerText='屏蔽';
            var html_comp = "<div class='asst' style='display:inline-block;'><span class='GuessMainPanelHeader-icon myMore'></span></div>";
            var bsl = $('.BarrageSuperLink').after(html_comp);
            var asstBtn = bsl.next();
            $(asstBtn).on('click',function(){
                console.log('clk');
            });
            advsend();
        }, 2000);
    }
    // 自动发送txtList中的弹幕
    function advsend(){
        var txtList = ['💃💃💃💃💃💃💃💃💃','666666666666666','婷婷婷婷婷婷婷婷婷婷婷婷'];
        var len = txtList.length;
        var idx = 0;
        setInterval(function(){
            var timecount = $('.ChatSend-button')[0].innerText;
            if(timecount==='发送'){
                $('.ChatSend-txt').val(txtList[idx++]);
                console.log('t');
                $('.ChatSend-button').click();
                if(idx===len){
                    idx=0;
                }
            }
        },500);
    }
})();