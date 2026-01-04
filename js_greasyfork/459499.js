// ==UserScript==
// @name         Hax renew help
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hax renew help!
// @author       You
// @match        https://woiden.id/vps-renew*
// @include      https://hax.co.id/vps-renew*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=woiden.id
// @require      http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459499/Hax%20renew%20help.user.js
// @updateURL https://update.greasyfork.org/scripts/459499/Hax%20renew%20help.meta.js
// ==/UserScript==

(function() {
    //'use strict';
    let web_host = window.location.host;
    // alert(window.location.pathname);
    //alert(web_host)
    let web_addr_ipt = $("#web_address");
    if (web_addr_ipt){
        //alert(web_addr_ipt.prop("placeholder"));
        //web_addr_ipt.attr("value",web_host);
        web_addr_ipt.val(web_host);
    }
    let keep_data_check = $("input[name='agreement']")
    if (keep_data_check){
        keep_data_check.prop("checked",true);
    }

    // todo 需要延时处理
    let renew_code_btn =$("div['response'] a.btn-primar");
    if (renew_code_btn) renew_code_btn.click();


})();