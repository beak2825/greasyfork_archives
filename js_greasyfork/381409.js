// ==UserScript==
// @name         51Talk优化:解锁课程|屏蔽广告|优化体验
// @namespace    https://gist.github.com/qcminecraft/5498879f8b7fb9008d7d6ea540d56c12
// @version      0.3.1
// @description  解锁课程|屏蔽广告|优化体验
// @author       qingcaomc@gmail.com
// @license      GPLv3
// @match        http://www.51talk.com/*
// @match        https://www.51talk.com/*
// @icon         https://avatars3.githubusercontent.com/u/25388328
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381409/51Talk%E4%BC%98%E5%8C%96%3A%E8%A7%A3%E9%94%81%E8%AF%BE%E7%A8%8B%7C%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%7C%E4%BC%98%E5%8C%96%E4%BD%93%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/381409/51Talk%E4%BC%98%E5%8C%96%3A%E8%A7%A3%E9%94%81%E8%AF%BE%E7%A8%8B%7C%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%7C%E4%BC%98%E5%8C%96%E4%BD%93%E9%AA%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    switch(window.location.pathname){
        case '/reserve/course':{
            console.log("[51 Unlock]已为您解锁所有课程！");
            $('.disable').removeClass('disable');
            if(!window.localStorage.getItem('51unlock')){
                alert("已为您自动解锁所有课程！");
                window.localStorage.setItem('51unlock', 1);
            }
            break;
        }
        case '/user/index':{
            //移除服务号弹窗
            $('.sercice-dialog').remove();
            //移除二维码
            $('.scan-code-junior').remove();
            break;
        }
        case '/merge/index':{
            //优化体验，直接跳转到详情页
            window.location.href = "https://www.51talk.com/reserve/index";
            break;
        }
        case '/':{
            break;
        }
    }
    //强迫症移除消息的数字
    $('.num').remove();
})();