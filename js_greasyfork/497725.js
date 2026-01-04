// ==UserScript==
// @name         autoClickWX110
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  auto click weixin110.qq.com continue
// @author       You
// @match        https://weixin110.qq.com/cgi-bin/mmspamsupport-bin/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497725/autoClickWX110.user.js
// @updateURL https://update.greasyfork.org/scripts/497725/autoClickWX110.meta.js
// ==/UserScript==
function autoClick() {
    var url = '';
    if(window.cgiData != undefined) {
        if(window.cgiData.url && /^https?:/i.test(window.cgiData.url)) {
            url = window.cgiData.url.replace(/&#x?([a-f0-9]{2});/gi, function(m, c){
                return String.fromCharCode(parseInt(`0x${c}`,16))
            });
        } else if(window.cgiData.desc && window.cgiData.type == 'empty' && /^https?:/i.test(window.cgiData.desc)) {
            url = window.cgiData.desc.replace(/&#x?([a-f0-9]{2});/gi, function(m, c){
                return String.fromCharCode(parseInt(`0x${c}`,16))
            });
        }
    }
    if(!url) {
        var hurl = document.querySelector('div.ui-ellpisis-content>div>p');
        var durl = document.querySelector('p.weui-msg__desc')
        if(hurl){
            url = hurl.textContent.replace(/\s+/g,'')
        } else if(durl) {
            url = durl.textContent.replace(/\s+/g,'')
        }
    }
    if(url && /^https?:\/\//i.test(url)) {
        location.replace(url);
        return;
    }
    var btn = document.querySelector('.weui-btn.weui-btn_default')
    if(btn) {
        btn.dispatchEvent(new MouseEvent('click'))
    } else {
        setTimeout(autoClick,10);
    }
}
(function() {
    'use strict';
    autoClick()
})();