// ==UserScript==
// @name         微信公众号音频 助手
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  浏览微信公众号时自动发现音频，并生成下载按钮
// @author       BeihaiZhang
// @match        https://mp.weixin.qq.com/s*
// @grant GM_download

// @downloadURL https://update.greasyfork.org/scripts/416312/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E9%9F%B3%E9%A2%91%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/416312/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E9%9F%B3%E9%A2%91%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var mpvoices=document.querySelectorAll('mpvoice');
    var i;
    for (i = 0; i < mpvoices.length; i++) {
        let mpvoice = mpvoices[i]
        if(mpvoice){
            let fileid=mpvoice.getAttribute('voice_encode_fileid');
            let title=mpvoice.getAttribute('name');
            let url='https://res.wx.qq.com/voice/getvoice?mediaid='+fileid;
            let tips=document.createElement('div');
            tips.style="min-width:300px;min-height:30px;background:#ff0;color:#f00;font-size:120%;text-align:center;line-height:30px;cursor:pointer;padding:10px;border-radius:10px;border:1px solid #f00;";
            tips.innerHTML="下载音频“"+title+"”";
            tips.onclick=function(){
                GM_download(url,title+'.mp3');
            };
            mpvoice.after(tips);
        }
    }
})();