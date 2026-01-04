// ==UserScript==
// @name         杂七杂八的脚本
// @namespace    candy_muj
// @version      1.0.0
// @description  自动关闭知乎登录弹窗
// @author       CandyMuj
// @include      *://*.zhihu.com/*
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      AGPL License
// @charset		 UTF-8
// @downloadURL https://update.greasyfork.org/scripts/462914/%E6%9D%82%E4%B8%83%E6%9D%82%E5%85%AB%E7%9A%84%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/462914/%E6%9D%82%E4%B8%83%E6%9D%82%E5%85%AB%E7%9A%84%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var host = window.location.host

    // 知乎
    if(host.endsWith('zhihu.com')){
        // 关闭登录弹窗
        let canClose = 50
        let inte = setInterval(function(){
            if(canClose <= 0) clearInterval(inte)
            if($(".Modal-closeButton")){
                $(".Modal-closeButton").click()
            }
            canClose--
        },100)
    }

})();