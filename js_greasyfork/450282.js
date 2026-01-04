// ==UserScript==
// @name         Bighard Maker
// @namespace    http://yxzl.top/
// @version      1.3.1
// @description  将任意网站变成巨硬（Windows10）风格。
// @author       Iron_Grey_
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @match        *://*/*
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/451231/Bighard%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/451231/Bighard%20Maker.meta.js
// ==/UserScript==

(function() {
    var val = "<style type='text/css'>*{border-radius:0px !important;border-bottom-left-radius:0px !important;border-bottom-right-radius:0px !important;border-top-right-radius:0px !important;border-top-left-radius:0px !important;}*::after{border-radius:0px !important;border-bottom-left-radius:0px !important;border-bottom-right-radius:0px !important;border-top-right-radius:0px !important;border-top-left-radius:0px !important;}*::before{border-radius:0px !important;border-bottom-left-radius:0px !important;border-bottom-right-radius:0px !important;border-top-right-radius:0px !important;border-top-left-radius:0px !important;}*.change{border-radius:0px !important;border-bottom-left-radius:0px !important;border-bottom-right-radius:0px !important;border-top-right-radius:0px !important;border-top-left-radius:0px !important;}*.change::after{border-radius:0px !important;border-bottom-left-radius:0px !important;border-bottom-right-radius:0px !important;border-top-right-radius:0px !important;border-top-left-radius:0px !important;}*.chage::before{border-radius:0px !important;border-bottom-left-radius:0px !important;border-bottom-right-radius:0px !important;border-top-right-radius:0px !important;border-top-left-radius:0px !important;}</style>";
    $("body").append(val);
    if(window.location.href=='https://cn.bing.com/chrome/newtab' || window.location.href=='https://bing.com/chrome/newtab'){
        $("body").parent().css("overflow-y","hidden");
        $(".vs_cont").hide();
    };
    $(".b_hPanel").remove();
})();