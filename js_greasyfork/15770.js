// ==UserScript==
// @name       baidu wm get infomation
// @namespace  http://baidu.com
// @version    0.0.6
// @description  获取bd外卖菜单页指定格式
// @include    http://waimai.baidu.com/shopui/upc/*
// @include    https://waimai.baidu.com/shopui/upc/*
// @include    http://waimai.baidu.com/waimai/shop/*
// @include    https://waimai.baidu.com/waimai/shop/*
// @copyright  2016
// @downloadURL https://update.greasyfork.org/scripts/15770/baidu%20wm%20get%20infomation.user.js
// @updateURL https://update.greasyfork.org/scripts/15770/baidu%20wm%20get%20infomation.meta.js
// ==/UserScript==

if (typeof window.jQuery !== "function") {
    var myScript= document.createElement("script");
    myScript.type = "text/javascript";
    myScript.onload = function() {getFoodP();};
    myScript.onerror = function() {alert('脚本失效，请反馈');};
    myScript.ontimeout = function() {alert('脚本失效，请反馈');};
    myScript.src="//cdn.bootcss.com/jquery/1.12.4/jquery.min.js";
    document.body.appendChild(myScript);
} else {
    getFoodP();
}
function getFoodP() {
    $("body").append('<div style="position:fixed;z-index:100;left:0;bottom:0;"><div class="getinfomation" ><button>获取菜单信息 HOHO</button></div><div><textarea class="infoarea" rows="20"></textarea></div></div>');
    $(".getinfomation").click(function() {
        $(".infoarea").val('');
        var infotext='';
        $.each($(".list-wrap"),function(){
                var $this = $(this);
                var ftypename=$.trim($this.find('.list-status > span').text()) || $('.filter-item.cur .item-name').text();
                infotext+="\n#"+ftypename+"\n";
                $.each($this.find(".list-item"),function(){
                    var fname=$(this).find('.info h3').text();
                    var fprice=$(this).find('.m-price strong:first').text();
                    var rprice = $(this).find('.m-break strong:first').text();
                    infotext+=$.trim(fname).replace(/\s+/g,"")+" "+$.trim((fprice || rprice)).replace('餐厅休息','').replace('已售完','').replace('¥', '')+"\n";
                });
        });
        $(".infoarea").val(infotext);
    });
}