// ==UserScript==
// @name         掘金签到
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动签到并跳转到抽奖页面!
// @author       C盘先生
// @match        https://juejin.cn/user/center/signin*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439184/%E6%8E%98%E9%87%91%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/439184/%E6%8E%98%E9%87%91%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('jquery','启动签到');
    $(document).ready(function(){
        setInterval(function(){
            console.log('jquery','签到工作中');
            var $btn = $('.signin.btn');
            var $choujiang = $('.success-modal .btn-area .btn');
            if($btn.length){
                $btn.click();
            }
            if($choujiang.length){
                $choujiang.click();
                // 抽奖
                setInterval(function(){
                    console.log('jquery','抽奖工作中');
                    let $free = $('.text-free')
                    if($free.length){
                        $free.click();
                        setTimeout(()=>{
                            window.location.href='https://juejin.cn/user/center/bugfix?enter_from=bugFix_bar'
                        },1000)
                    }
                },2000)
            }

        },2000)
    })
    
})();