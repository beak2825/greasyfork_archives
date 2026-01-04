// ==UserScript==
// @name         微信公众号音频发现下载工具
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  浏览微信公众号时自动发现音频，并弹出提示点击下载
// @author       riubin
// @match        https://mp.weixin.qq.com/s*
// @grant GM_download

// @downloadURL https://update.greasyfork.org/scripts/392388/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E9%9F%B3%E9%A2%91%E5%8F%91%E7%8E%B0%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/392388/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E9%9F%B3%E9%A2%91%E5%8F%91%E7%8E%B0%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var mpvoice=document.querySelector('mpvoice');
    if(mpvoice){
        var fileid=mpvoice.getAttribute('voice_encode_fileid');
        var title=mpvoice.getAttribute('name');
        var url='https://res.wx.qq.com/voice/getvoice?mediaid='+fileid;
        var tips=document.createElement('div');
        tips.style="min-width:300px;min-height:30px;background:#ff0;color:#f00;font-size:120%;text-align:center;line-height:30px;cursor:pointer;padding:10px;border-radius:10px;border:1px solid #f00;";
        tips.innerHTML="点击下载保存音频“"+title+"”";
        tips.onclick=function(){
            GM_download(url,title+'.mp3');
        };
        mpvoice.after(tips);
    }
})();