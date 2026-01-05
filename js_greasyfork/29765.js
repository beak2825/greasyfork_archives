// ==UserScript==
// @name cashierem14.alipay.com 处理
// @namespace http://login.taobao.com
// @version 0.15
// @description 初次使用请先在“添加和删除用户”页面中添加淘宝用户名和密码
// @author Richard He
// @iconURL http://www.xuebalib.cn/userjs/icon.ico
// @match https://*.alipay.com/standard/lightpay/lightPayCashier.htm*
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_listValues
// @grant GM_deleteValue
// @grant GM_registerMenuCommand
// @grant window.close
// @grant window.open

// @downloadURL https://update.greasyfork.org/scripts/29765/cashierem14alipaycom%20%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/29765/cashierem14alipaycom%20%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(function() {
'use strict';

var url ="https://haidaoteam.com/taobao/";
    //var url = "http://127.0.0.1:8000/";
var taobao_username = '九如山的山';
var taobao_passwd = 'yunji789';
setTimeout(main,1000);

function GetQueryString(name)
{
var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
var r = window.location.search.substr(1).match(reg);
if(r!==null)
    return unescape(r[2]);
return null;
}
function main(){
var b_alipay_order_id = GetQueryString("outBizNo");
$.ajax({
type : "get",
async:false,
url : url+"end_taobao_order?taobao_username="+taobao_username+"&b_alipay_order_id="+b_alipay_order_id,
success : function(json){
console.log( GetQueryString("outBizNo") );
    window.open("https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm"); 
window.close();
}
});
}
  //window.close();    }
//console.log($(“.J_TSaleProp.tb-img.tb-clearfix li”));
})();