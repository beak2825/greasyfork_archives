// ==UserScript==
// @name         电商助手
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  我的电商助手
// @author       Itsky71
// @match        https://jd.kuaidizs.cn/newIndex/index.xhtml?*
// @match        https://jd.kuaidizs.cn/handOrder/redirect?*
// @match        https://jdhand.kuaidizs.cn/newIndex/index.xhtml?*
// @match        https://www.baidu.com/s?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480300/%E7%94%B5%E5%95%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/480300/%E7%94%B5%E5%95%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    let cssStyle='.r12{margin-right:12px;}.check-box{position:fixed;border:1px solid #f0f0f0;left:50%;bottom:75px;margin-left:-365px;background-color:#ffffff;border-radius:3px;padding:10px 15px;box-shadow:0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);}';
    cssStyle += '.from-num,.to-num{height:22px;line-height:22px;border:1px solid #bbb;text-indent:0.5em;width:50px;margin:0px !important;}.check-ok{padding:2px;margin-left:10px;}.hidden{display:none;}';
    cssStyle += '.sc-cover-card{.show-progress_dpmxS{height:auto;.show-scroll_4JEGw{height:auto;overflow-y:hidden;padding-bottom:10px;.show-tracking-time_1ZPj6{height:auto;.show-track-item-content-message_795I5{-webkit-line-clamp:unset;}}}}.show-progress_3hiJL{height:auto;.show-scroll_5EsTL{height:auto;overflow-y:hidden;.show-tracking-time_5MSvt{height:auto;.show-track-item-content-message_1pUQw{-webkit-line-clamp:unset;}}}}';
    GM_addStyle(cssStyle);

    let unlockHtml = function(){
        $('.printBatchContent .batch_opbtn > .packageActionBtn').prepend('<button class="btn_cyanbig r12 unclock">解锁号码</button>');
    };
    $(document).on('click','#mdulPrintBatch > a',function(){
        setTimeout(unlockHtml, 3000);
    });
    $(document).on('click','.batch_opbtn > .packageActionBtn > .unclock', function(){
        $('.icon-lock.show-btn.encryptionMobile').each(function(i){
            $(this).click();
        });
    });

    $(document).on('click','.batch_opbtn > .packageActionBtn > .check', function(){
        $('.check-box').toggleClass('hidden');
    });

    $(document).on('click','.batch_opbtn > .packageActionBtn .check-ok', function(){
        let fromNum = $('.from-num').val();
        let toNum = $('.to-num').val();
        if(fromNum === '' || toNum === ''){
            alert('不能为空置！');
        }else if(parseInt(fromNum) > 0 && parseInt(toNum)> 0 && parseInt(toNum) > parseInt(fromNum)){
            $('#manualTradeTable input[name="tradeCheckBox"]').each(function(i){
                if(i>parseInt(fromNum)-2 && i< parseInt(toNum)){
                    $(this).click();
                    console.log(i);
                }
            });
        }else{
            alert('输入数值不正确！');
        }
    });

    let checkHtml = function(){
        $('#sygj-container .batch_opbtn > .packageActionBtn').prepend('<button class="btn_cyanbig r12 check">选&emsp;择</button><div class="check-box hidden"><input type="number" class="from-num" value="1" /> 到 <input type="number" class="to-num" /><button type="button" class="check-ok">确定</button></div>');
    };


    setTimeout(unlockHtml, 3000);
    setTimeout(checkHtml, 3000);
})($);