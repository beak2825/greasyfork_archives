// ==UserScript==
// @name         码市价格筛选
// @version      1.0
// @include      https://mart.coding.net/*
// @description  码市价格筛选，接私人脚本，小程序定制！
// @author       单曲循环
// @grant        none
// @copyright    2017+, @单曲循环
// @联系QQ        1454781423 
// @namespace https://greasyfork.org/users/106373
// @downloadURL https://update.greasyfork.org/scripts/32566/%E7%A0%81%E5%B8%82%E4%BB%B7%E6%A0%BC%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/32566/%E7%A0%81%E5%B8%82%E4%BB%B7%E6%A0%BC%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==
//<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.min.js" type="text/javascript"></script> 
var $A = $('<div><p>输入价格区间:<input name="Min" type="text" value="0" size="10" maxlength="10" /> - <input name="Max" type="text" value="0" size="10" maxlength="10" /><input name="SouSuo" type="button" value="搜索" /></p></div>');
$(".nav-zone").append($A);
$("input[value='搜索']").click(function() {
    var $Min = parseInt($("input[name='Min']").val());
	var $Max = parseInt($("input[name='Max']").val());
    if($Min>=$Max){
     alert("价格区间不正确！第一个值应小于第二个值！");
        return;
    }
    $(".item").each(function() {
    var $Q = $(this).find("span[style='color: #c7c7c7;']").parent().text().substring(1);
    var $C;
    if($Q.lastIndexOf(',')== -1){
     $C = parseInt($Q);
    }else{
        $C = parseInt($Q.substring(0,$Q.lastIndexOf(','))+$Q.substring($Q.lastIndexOf(',')+1));
    }
    if($C < $Min || $C > $Max){
        $(this).remove();
    }
});
});