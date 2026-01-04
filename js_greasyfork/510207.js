// ==UserScript==
// @name         Show URL instead of QR
// @namespace    http://tampermonkey.net/
// @version      0.2·
// @description  直接显示二维码中的链接，用手机扫描太麻烦了。比如动漫领域的磁链...
// @author       etng
// @match        *://dmly.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dmly.me
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/510207/Show%20URL%20instead%20of%20QR.user.js
// @updateURL https://update.greasyfork.org/scripts/510207/Show%20URL%20instead%20of%20QR.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = unsafeWindow.jQuery;
    var cnt = 0
    $('img[src^="https://api.qrserver.com/v1/create-qr-code/"]').each((k,v)=>{
        var a=$(v);
        var u=new URL(a.attr('src'))
        var link = u.searchParams.get('data')
        a.after($('<div/>').append($('<a>').attr('href', link).text(link)))
        cnt +=1
    })
    if(cnt>0){
        GM_notification({text: `成功提取${cnt}个QR`, timeout: 800, onclick: function(){}});
    }
})();