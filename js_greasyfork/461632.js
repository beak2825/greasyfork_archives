// ==UserScript==
// @name         lavida自動更新訂單備註
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  lavida 自動更新訂單備註
// @author       You
// @match        https://www.lavida.tw/adm_PPot4F/order/?action=edit&id=*&q1=*&desc=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lavida.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461632/lavida%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0%E8%A8%82%E5%96%AE%E5%82%99%E8%A8%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/461632/lavida%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0%E8%A8%82%E5%96%AE%E5%82%99%E8%A8%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        let params = new URLSearchParams(document.location.search);
        let desc = params.get("desc");

        var originDesc = $('textarea[name="process_remark"]').val();
        var updateDesc = originDesc;
        var re = /\[\[(.*)?\]\]/gs;
        if(re.test(originDesc)){
            updateDesc = originDesc.replace(re, desc)
        }else{
            updateDesc = originDesc+desc;
        }
        $('textarea[name="process_remark"]').val(updateDesc);


        $('button:contains("儲存")').last().click();
        //alert(desc);

    },600);

    // Your code here...
})();