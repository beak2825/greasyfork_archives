// ==UserScript==
// @name        app活动页调试&插入调试 css
// @namespace   Violentmonkey Scripts
// @match       https://prom.m.gome.com.cn/*
// @match       http://cms.ds.gome.com.cn/gome-mobile-web/preview_page/*
// @require     https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant       none
// @version     1.0
// @author      小东西儿
// @description 2020/7/23 上午9:44:04
// @downloadURL https://update.greasyfork.org/scripts/412057/app%E6%B4%BB%E5%8A%A8%E9%A1%B5%E8%B0%83%E8%AF%95%E6%8F%92%E5%85%A5%E8%B0%83%E8%AF%95%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/412057/app%E6%B4%BB%E5%8A%A8%E9%A1%B5%E8%B0%83%E8%AF%95%E6%8F%92%E5%85%A5%E8%B0%83%E8%AF%95%20css.meta.js
// ==/UserScript==
$("#wap_address").css({
  'marginTop': '1rem'
})
var css_btn = `<button class="btn_jie" style="position: fixed;top: 0;right: .2rem;    width: 1rem;line-height: .5rem;background: #fff;z-index:9999999999999">确认</button>`;
var css_btn1 = `<button class="btn_jie1" style="position: fixed;top: .5rem;right: .2rem;    width: 1rem;line-height: .5rem;background: #fff;z-index:9999999999999">清除</button>`;
var css_dom = `<div class="css_wang"></div>`;
    var css_zdy = `<textarea class="css_yong" name="" id="" cols="30" rows="10" style="position: fixed;top: 0;left: 0;width: 6rem;height: 1rem;border: 1px solid #000;z-index:9999999999999"></textarea>`;
    $('#wrapper').prepend(css_dom)
// setTimeout(function(){
// $('[templetid="4485827"]').before(css_dom)
//         },5000)

$("#wrapper").css({
  // 'marginTop':"1rem"
})
$('body').append(css_btn)
$('body').append(css_btn1)
    $('body').append(css_zdy)
    $(".btn_jie").click(function(){
        $(".css_wang").html($(".css_yong").val())
    })

$(".btn_jie1").click(function(){
        $(".css_yong").val('')
    })


$("#nav_more").click(function(){
        $(".btn_jie,.btn_jie1,.css_yong").hide();
  $("#wap_address").css({
  'marginTop': '0rem !important'
})
    })
