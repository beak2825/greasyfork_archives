// ==UserScript==
// @name         52pojie.cn吾愛破解論壇簽到
// @version      0.0.1
// @description  吾愛破解論壇簽到
// @author       Guan Da
// @include      http*://www.52pojie.cn/*
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-latest.js
// @run-at 		 document-end
// @namespace https://greasyfork.org/users/141503
// @downloadURL https://update.greasyfork.org/scripts/372013/52pojiecn%E5%90%BE%E6%84%9B%E7%A0%B4%E8%A7%A3%E8%AB%96%E5%A3%87%E7%B0%BD%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/372013/52pojiecn%E5%90%BE%E6%84%9B%E7%A0%B4%E8%A7%A3%E8%AB%96%E5%A3%87%E7%B0%BD%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    //52破解
    if(isURL("52pojie.cn")){
        var qdlink = $("img[src$='qds.png']").closest("a");
        if(qdlink){
            qdlink[0].click();
        }
        return;
    }

    function qd(){
        if (window.find("今天签到了吗") && window.find("写下今天最想说的话")) {
            $("#wl_s").attr('checked',true);
            $("#todaysay").val("每天签到水一发。。。");
            $("#qiandao").submit();
            return;
        }
    }

    function isURL(x){
        return window.location.href.indexOf(x) != -1;
    }

})();