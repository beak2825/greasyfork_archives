// ==UserScript==
// @name         畅玩4399
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  4399去未成年和登录限制弹窗,目前仅限h5小游戏
// @author       毅
// @match        *://*.4399.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require           https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js
// @license           GPL License
// @downloadURL https://update.greasyfork.org/scripts/470599/%E7%95%85%E7%8E%A94399.user.js
// @updateURL https://update.greasyfork.org/scripts/470599/%E7%95%85%E7%8E%A94399.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        $('#bigdiv').append(`
        <p style="position:absolute;top:150px;left:10px;width:150px;">破解未成年防沉迷脚本已启用，
        部分游戏任在破解中，开发者：小易
        </p>
        document.domain="4399.com";
        var gameid = parseInt(document.location.href.split("?")[1].replace("id=",""));
        $.getScript("/age/"+gameid+".js",function(res,status){
            if(status=="success"){
                $(".ageGame").html(age__cxn);
                $(".diaText").html(age__str);
                $(".ageTip").html('<img src="'+age__ageimg+'"/>');
            }
        });
        `);
        /*
                $('#bigdiv').append(`
        <button style="position:absolute;top:150px;left:10px;">edge切换IE</button>
        <script>
          window.onload = function(){
           }
        </script>
        `);
        */
        $('#Anti_mask').after(`
        <script>
          function a(){
            // 去除防未成年弹框
            $('#Anti_mask')[0].style.display = 'none';
            $('.fcmdialog')[0].style.display = 'none';
            
            // 如果有 pusher
            if($('#pusher')) {
                $('#pusher')[0].style.display = 'none';
            }
            // 如果发现就删除
            var myInterval = setInterval(()=>{
                if($('#ageIframes') && $('#ageIframes')[0] ) {
                    $('#ageIframes')[0].style.display = 'none';
                    $('#addiv')[0].style.display = 'none';
                    $('#pusher')[0].style.display = 'none';
                    clearInterval(myInterval);
                }
            },1000);
         }
        a();
        </script>
        `)
    }
})();