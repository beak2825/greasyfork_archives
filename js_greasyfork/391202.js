// ==UserScript==
// @name         sub
// @namespace    http://tampermonkey.net/
// @version      0.3.10
// @description  try to take over the world!
// @author       cx
// @match        https://buy.damai.cn/orderConfirm*
// @run-at       document-end
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/391202/sub.user.js
// @updateURL https://update.greasyfork.org/scripts/391202/sub.meta.js
// ==/UserScript==
var time;
(function() {
    var url = window.location.href;
    if(url.indexOf("umidToken") == -1){
        var cookie  = getCookie("UUrl");
        console.log(cookie);
        if(cookie != null && cookie != ''){
            window.location.href = cookie;
        }
    }
    $(".next-checkbox-label").click();
    sub();

    function sub() {
        if($(".ticket-buyer-detail-item").html()!=''){
            $(".submit-wrapper>button").click();
        }else{
            $(".next-checkbox-label").click();
            $(".submit-wrapper>button").click();
        }
        again();
    }

    function again() {
        var txt = $(".opened").closest("div").html();
        console.log("+++++++++++:"+txt);
        if(txt == undefined || txt.indexOf("请稍后") != -1){
            setTimeout(function (e) {
                requestAnimationFrame(again);
            },200);
        }else if(txt.indexOf("您今天下单次数太多啦，休息一下明天再来吧") == -1){
            if(txt.indexOf("爆") != -1 || txt.indexOf("休息") != -1 || txt.indexOf("订单") == -1 || txt.indexif("建议您稍后再试") != -1){
                window.location.reload();
            }
        }
    }


    // 读取cookie
    function getCookie(c_name) {
        if (document.cookie.length > 0)     {
            var c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1){
                c_start = c_start + c_name.length + 1;
                var c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1)
                    c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    }
})();
