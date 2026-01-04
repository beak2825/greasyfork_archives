// ==UserScript==
// @name         店小秘国家运费自动填充
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于读json填充表单
// @author       排骨
// @match        https://www.dianxiaomi.com/product/index.htm
// ==/UserScript==
var $=unsafeWindow.jQuery;
var cuy="AL AR AU AT BB BE BM BA BR BG CA CL CO CR HR CY CZ DK DO EC EG EE FI FR DE GR HK HN HU IN ID IE IL IT JM JP JO KW LV LI LT LU MK MY MX MD MC MA NL NZ NO PK PE PH PL PT PR RO RU SA RS SG SK SI ZA KR ES SE CH TW TH TR UA AE GB US VE VN VG VI"
var ary=cuy.split(" ");
function delary(a,ary){
    for(var i=0;i<ary.length;i++){
        if(a==ary[i]){ary.splice(i,1)}
    }
}
function tobool(val){
    val=val.toLowerCase()
    if(val=="true"){
        return true;
    }
    if(val=="false"){
        return false;
    }
}
$(window).keydown(function(e){
if(e.altKey && e.keyCode==49){
var tmp=$.trim(prompt("请输入产品ID"));
if(tmp){
    singleProductCountryShipping(tmp);

    if($(".batchWishSetShipping")){
        var tmp2=prompt("请输入json")
       // tmp2=decodeURIComponent(tmp2);
        var json=JSON.parse(tmp2);
        setTimeout(function(){
        for(var i=0;i<json.length;i++){
            var enable=json[i].ProductCountryShipping.enabled
            var country_code=json[i].ProductCountryShipping.country_code;//国家代码 英文简写 如BE
            var shipping_price=json[i].ProductCountryShipping.shipping_price;//运输费用 如6.00
            var wish_express=json[i].ProductCountryShipping.wish_express;//是否启用WishExpress 布尔值
            var use_product_shipping=json[i].ProductCountryShipping.use_product_shipping; //是否使用产品运费 布尔值
            //var tmpcode=$('[data-country="'+country_code+'"]');
                $('[data-country="'+country_code+'"] td .productCountryShippingSelect option[value="0"]').prop("selected",tobool(use_product_shipping));
                $('[data-country="'+country_code+'"] td div [name="shippingPrice"]').val(shipping_price);
                $('[data-country="'+country_code+'"] td [name="wishExpress"]').prop("checked",tobool(wish_express))
                if(tobool(use_product_shipping)){
                    $('[data-country="'+country_code+'"] td div [name="shippingPrice"]').prop("value","")
                    $('[data-country="'+country_code+'"] td div [name="shippingPrice"]').prop("disabled",true)
                }
            delary(country_code,ary)
        }
        for(var z=0;z<ary.length;z++){
             $('[data-country="'+ary[z]+'"] td .productCountryShippingSelect option[value="2"]').prop("selected",true);
             $('[data-country="'+ary[z]+'"] td div [name="shippingPrice"]').prop("value","")
             $('[data-country="'+ary[z]+'"] td div [name="shippingPrice"]').prop("disabled",true)
             $('[data-country="'+ary[z]+'"] td [name="wishExpress"]').prop("disabled",true)
        }
        },1000)

    }

}
}
})
