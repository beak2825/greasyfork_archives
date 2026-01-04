// ==UserScript==
// @icon            http://taobao.com/favicon.ico
// @name            天天特卖报名显示最低价
// @namespace       [url=mailto:admin@dyyy.net]admin@dyyy.net[/url]
// @author          高海林
// @description     天天特卖报名显示历史售卖最低价到页面上，方便参考填写活动报名价格！
// @match           *://tttj.sale.taobao.com/apply/item.htm?action=1*
// @require         http://code.jquery.com/jquery-2.1.1.min.js
// @version         0.0.2
// @grant           GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/390630/%E5%A4%A9%E5%A4%A9%E7%89%B9%E5%8D%96%E6%8A%A5%E5%90%8D%E6%98%BE%E7%A4%BA%E6%9C%80%E4%BD%8E%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/390630/%E5%A4%A9%E5%A4%A9%E7%89%B9%E5%8D%96%E6%8A%A5%E5%90%8D%E6%98%BE%E7%A4%BA%E6%9C%80%E4%BD%8E%E4%BB%B7.meta.js
// ==/UserScript==
(function () {

var itemname="itemId";
var reg = new RegExp("(^|&)" + itemname + "=([^&]*)(&|$)");//构造一个含有目标参数的正则表达式对象
var r = window.location.search.substr(1).match(reg);//匹配目标参数
var itemid;
    var minprice;
    var maxprice;
    var minsaleprice;
if (r != null)
  {
    itemid=unescape(r[2]);
  }
//return null;//返回参数值
//    $.get("https://smf.taobao.com/index.htm?menu=yhjk&_input_charset=utf-8&module=yhjk&itemId="+itemid,function(data,status){
//        alert("数据：" + data + "状态：" + status);
//    });
var fullUrl = "https://smf.taobao.com/promotionmonitor/itemInfoQuery.htm?_tb_token_=fee16e55557ee&_input_charset=utf-8&keyword="+itemid;

GM_xmlhttpRequest({
    method: 'GET',
    url: fullUrl,
    dataType: "json",
    headers: {
        'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
        'Accept': 'application/atom+xml,application/xml,text/xml',
    },
    onload: function(responseDetails) {
        var pricejson=$.parseJSON(responseDetails.responseText);
        minprice=parseInt(pricejson.data.lastPriceRange.min)/100;
        maxprice=parseInt(pricejson.data.lastPriceRange.max)/100;
        minsaleprice=(minprice*0.9).toFixed(2);
        //alert(minsale);
       // $("div[label='库存类型：']").before("<div style='color:#F00; font-weight:bold; font-size:16px;'>历史最低价：<span style='color:#000;'>"+minprice+"</<span>元--<span style='color:#000;'>"+maxprice+"</<span>元</div>")
    }
});
    $(document).ready(function() {
       setTimeout(function(){
           $("div[label='库存类型：']").before("<div style='color:#F00; font-weight:bold; font-size:16px;'>历史最低价：<span style='color:#000;'>"+minprice.toString()+"</span>元--<span style='color:#000;'>"+maxprice.toString()+"</span>元  最低价的9折是：<span style='color:#000;'>"+minsaleprice.toString()+"</span>元  <span style='font-size:24px'>仅供参考,请综合考量后决断!</span></div>")
       },1000)
    });
//页面加载完，再等1秒执行
})();