// ==UserScript==
// @name         百度文库去广告
// @namespace    http://tampermonkey.net/
// @version      2024-09-09
// @description  隐藏AI助手和文档推荐
// @author       AN drew
// @match        https://wenku.baidu.com/*
// @match        https://eduai.baidu.com/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @require      https://lib.baomitu.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/406697/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/406697/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    #app-left.no-full-screen{display:none!important}
    .chat-entry-wrapper_logo{display:none!important}
    .vip-member-pop-content{display:none!important}
    .pay-layer-wrapper{display:none!important}
    #wk-chat{display:none!important}
    .pc-cashier-card{display:none!important}
    .vip-center{display:none!important}
    .vip-activity-wrap-new{display:none!important}
    #app-right{display:none!important}
    #right-wrapper-id{display:none!important}
    .pcstep-foot-pagination{display:none!important}
    .relative-recommend-wrapper{display:none!important}
    .vip-pay-pop-v2-wrap{display:none!important}
    .right-chat-wrapper{display:none!important}
    .full-screen .next-doc-wrap{display:none!important}
    #journal-view + .catalog{display:none!important}
    #journal-view{width:100%!important}
    .journal{width:100%!important}
    .journal li:nth-of-type(2){width:93%!important}
    .pcStepView{max-width:100%!important}
    .left-main-wrapper{width:100%!important}
    .center-wrapper{width:100%!important}
    .creader-root .pageNo{display:block!important; text-align:center!important}
    .creader-root{width:100%!important}
    #app.pcViewClient.classic .left-wrapper{width:100%!important}
    .reader-wrap.wk-web-4774{width:100%!important}
    .reader-topbar{display:block!important; width:100%!important}
    .reader-topbar[style*='fixed']{position:relative!important;}
    .full-screen .reader-topbar{display:none!important;}
    .tool-bar-wrapper.wk-web-4774{width:95%!important}
    #journal-view .tool-bar-wrapper{width:100%!important}
    .supernatant-tools{left:calc(92%)!important}
    .quill-editor{max-width:68%!important}
    `)



    let t=setInterval(function(){
        if($('.chat-header .close').length>0)
        {
            $('.chat-header .close').click();
        }

        if($('.fold-page-text .btn.unfold').length>0 && $('.fold-page-text .btn.unfold').text().indexOf('查看剩余全文') > -1)
        {
            $('.fold-page-text .btn.unfold').click();
        }

        if($('.liter-head-fold-btn').length>0 && $('.liter-head-fold-btn').text().indexOf('展开更多信息') > -1)
        {
            $('.liter-head-fold-btn').click();
        }
    },1000);

})();