// ==UserScript==
// @name       ele.me get infomation
// @namespace  http://iamued.com
// @version    0.9.3
// @description  获取饿了么菜单页指定格式
// @include    https://www.ele.me/shop/*
// @copyright  2016
// @downloadURL https://update.greasyfork.org/scripts/14030/eleme%20get%20infomation.user.js
// @updateURL https://update.greasyfork.org/scripts/14030/eleme%20get%20infomation.meta.js
// ==/UserScript==


var myScript= document.createElement("script");
myScript.type = "text/javascript";
myScript.onload = function() {getFoodP();};
myScript.onerror = function() {alert("脚本失效了，请反馈")};
myScript.ontimeout = function() {alert("脚本失效了，请反馈")};
myScript.src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min.js";
document.body.appendChild(myScript);
function getFoodP() {
    $("body").append('<div style="position:fixed;z-index:100;left:0;bottom:0;"><div class="getinfomation" ><button>获取菜单信息 HOHO</button></div><div><textarea class="infoarea" rows="12" cols="36"></textarea></div></div>');
    $(".getinfomation").click(function() {
        $(".infoarea").val('');
        var infotext='';
        $.each($(".shopmenu-title"),function(){
            if($(this).text()!='美食分类'){
                var ftypename=$.trim($(this).text());
                infotext+="\n#"+ftypename+"\n";
                $.each($(this).parents(".shopmenu-list").find(".shopmenu-food"),function(){
                    var fname=$(this).find('.shopmenu-food-name').text();
                    var fprice=$(this).find('.shopmenu-food-price').text();
                    infotext+=$.trim(fname).replace(/\s+/g,"")+" "+$.trim(fprice).replace('餐厅休息','').replace('已售完','')+"\n";
                })
            }
        })
        $(".infoarea").val(infotext);
    })
}
