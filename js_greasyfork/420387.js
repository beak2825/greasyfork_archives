// ==UserScript==
// @name           微信公众号
// @description    下载音频
// @author         018(lyb018@gmail.com)
// @contributor    Rhilip
// @connect        *
// @grant          GM_xmlhttpRequest
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require        https://greasyfork.org/scripts/420063-018-js/code/018js.js?version=890174
// @include        https://mp.weixin.qq.com
// @version        0.1.1
// @icon           https://mp.weixin.qq.com/favicon.ico
// @run-at         document-end
// @namespace      http://018.ai
// @downloadURL https://update.greasyfork.org/scripts/420387/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/420387/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7.meta.js
// ==/UserScript==

// This Userscirpt can't run under Greasemonkey 4.x platform
if (typeof GM_xmlhttpRequest === 'undefined') {
    alert('不支持Greasemonkey 4.x，请换用暴力猴或Tampermonkey')
    return
}

;(function () {
    'use strict';

    $(document).ready(function () {
        // 下载
        var mpvoices = $('mpvoice')
        var interval = setInterval(function() {
            mpvoices.each(function() {
                var fileid = $(this).attr('voice_encode_fileid')
                var audio_card_desc = $(this).next().find('.audio_card_desc')
                audio_card_desc.append(' <a target="_blank" href="https://res.wx.qq.com/voice/getvoice?mediaid=' + fileid + '" download="w3logo.mp3">(通过「链接另存为...」进行下载)</>')
            });
            clearInterval(interval)
        }, 1500)

        // 去掉
        $('.rich_pages').hide();
    })
})()