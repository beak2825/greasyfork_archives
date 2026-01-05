// ==UserScript==
// @name         京东秒杀
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  京东秒杀关键词过滤商品
// @author       无限超频
// @match        https://miaosha.jd.com/category.html?cate_id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25126/%E4%BA%AC%E4%B8%9C%E7%A7%92%E6%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/25126/%E4%BA%AC%E4%B8%9C%E7%A7%92%E6%9D%80.meta.js
// ==/UserScript==

$(function(){
    console.info($('#catinfo'));

    var c=window.setInterval(function(){
        if($('.sk_mod_sectitle_container').size()==1){
            $('.sk_mod_sectitle_container').after('<div id="mserach" align="center"><input type="text"  placeholder="输入要过滤关键词" onChange="$.serach($(this).val())"/></div>');
            clearInterval(c);
        }
    },1000);


});

$.serach=function(keyword){
    $.each($('.seckill_mod_goods_title'),function(){
        if($(this).text().indexOf(keyword)==-1){
            $(this).parents('.seckill_mod_goods').hide();
        }else{
            $(this).parents('.seckill_mod_goods').show();
        }
    });
    $('a[title="正在抢购"]').click();
}