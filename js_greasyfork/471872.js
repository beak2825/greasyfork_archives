// ==UserScript==
// @name         BaiDu Check Fail
// @namespace    http://tampermonkey.net/
// @version      1
// @description  检查未通过
// @author       You
// @match        https://jingyan.baidu.com/user/nuc*
// @grant        none
// @license      MIT
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/471872/BaiDu%20Check%20Fail.user.js
// @updateURL https://update.greasyfork.org/scripts/471872/BaiDu%20Check%20Fail.meta.js
// ==/UserScript==
var jq = jQuery.noConflict(true);

(function() {
    'use strict';
    setTimeout(function () {
        var count = getPageValue();
        if(count!=0){
            var cookieCount = getCookieValue();
            console.log(count, cookieCount);
            if(cookieCount==0){
                saveCookieValue(count);
            }
            else{
                if(count!=cookieCount){
                    saveCookieValue(count);
                    if(count>cookieCount){
                        alert("有新的不通过数据！！！");
                    }
                }
            }
        }
    }, 600);
})();

function getPageValue(){
    var a = jq(".wgt-my-exp ul.line-tab li a");
    var text = jq(a[2]).html();
    if(text){
        text = text.replace("未通过 (", "");
        text = text.replace(")", "");
        return parseInt(text);
    }
    return 0;
}
function getCookieValue(){
    var data = jq.cookie('bd_check_fail');
    if(data){
        return parseInt(data);
    }
    return 0;
}
function saveCookieValue(count){
    jq.cookie('bd_check_fail', count, { expires: 3600, path: '/' });
}