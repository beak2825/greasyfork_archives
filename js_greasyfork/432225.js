// ==UserScript==
// @name        大虾-冲浪工具
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0.0
// @require     https://libs.baidu.com/jquery/2.0.3/jquery.min.js
// @description 2021/9/11 上午11:12:17
// @downloadURL https://update.greasyfork.org/scripts/432225/%E5%A4%A7%E8%99%BE-%E5%86%B2%E6%B5%AA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/432225/%E5%A4%A7%E8%99%BE-%E5%86%B2%E6%B5%AA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function() {
    'use strict';
    
    $(function(){
            
        var href = window.location.href;
        
        if (href.indexOf('book.zongheng.com') != -1) {
            setTimeout(function(){
                /* 去除'禁止右键'限制 start */
                R("contextmenu");
                R("click");
                R("mousedown");
                R("mouseup");
                R("selectstart");
                /* 去除'禁止右键'限制 end */
            },500);
            console.log("检测到book.zongheng.com!")
            $('#readerFt').prepend($('.reader_box .content'));
            $('.rb_7 #readerFt .content').css({'color':'#000'});
            $('.rb_8 #readerFt .content').css({'color':'#fff'});
            $('#readerFt .content').css({'letter-spacing':'2px','line-height':'40px'});
            $('#readerFt .content p').css({'text-indent':'50px','padding':'20px'});
            $('#reader_warp').css({'margin':'0 460px 0 75px','width':'auto'});
            $('.reader_box').css({'position':'fixed','right':0,'top':0,'bottom':0,'padding':'0 20px','width':'420px','overflow-y':'auto'});
            $('.reader_box .big_donate').hide();
            $('#uiGPReaderAct').css({ 'left':'620px'});
            $('#uiGPUserAct').hide();
        }else if(href.indexOf('www.baidu.com') != -1){
            $('.op_exactqa_word_word_pronounce').css({'font-size':'28px'});
            $('.op_exactqa_word_word_text').css({'font-size':'16px'});
        }

    })
    
    /* 去除'禁止右键'限制 */
    function R(a) {
        var ona = "on" + a;
        if (window.addEventListener){
            window.addEventListener(a, function (e) {
                for (var n = e.originalTarget; n; n = n.parentNode){
                    n[ona] = null;
                }
            }, true);
        }
        window[ona] = null;
        document[ona] = null;
        if (document.body){
            document.body[ona] = null;
        }
        console.log("去除限制 - ", ona)
    }
    
})();