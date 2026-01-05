// ==UserScript==
// @name buyertrade.taobao.com 订单跟支付ID 处理
// @namespace http://login.taobao.com
// @description 初次使用请先在“添加和删除用户”页面中添加淘宝用户名和密码
// @author Richard He
// @version 0.14
// @author dongchao
// @iconURL http://www.xuebalib.cn/userjs/icon.ico
// @match https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm*
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @grant window.close

// @downloadURL https://update.greasyfork.org/scripts/29764/buyertradetaobaocom%20%E8%AE%A2%E5%8D%95%E8%B7%9F%E6%94%AF%E4%BB%98ID%20%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/29764/buyertradetaobaocom%20%E8%AE%A2%E5%8D%95%E8%B7%9F%E6%94%AF%E4%BB%98ID%20%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(function() {
'use strict';
    
    setTimeout(main,1000);
    function main(){
        var a_list = $("p a");
        var count = 0;
        for(var i = 0 ;i< a_list.length;i++)
        {
            var a = a_list[i];
            
            if($(a).attr("id") == "viewDetail")
            {
                
                if(count < 1)
                {
                    console.log($(a));
                    //var time = Math.random()*10000;
                    //console.log(time);
                    //setTimeout($(a)[0].click(),time);
                    $(a)[0].click();
                    setTimeout(window.close(),1000);
                    count++;
                }
            }
        }
    }
})();