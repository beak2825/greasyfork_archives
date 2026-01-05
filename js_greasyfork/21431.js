// ==UserScript==
// @name         自动添加Steam礼物留言（米果电玩）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://store.steampowered.com/checkout/sendgift/*
// @match        https://store.steampowered.com/checkout/?purchasetype=gift*
// @downloadURL https://update.greasyfork.org/scripts/21431/%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0Steam%E7%A4%BC%E7%89%A9%E7%95%99%E8%A8%80%EF%BC%88%E7%B1%B3%E6%9E%9C%E7%94%B5%E7%8E%A9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/21431/%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0Steam%E7%A4%BC%E7%89%A9%E7%95%99%E8%A8%80%EF%BC%88%E7%B1%B3%E6%9E%9C%E7%94%B5%E7%8E%A9%EF%BC%89.meta.js
// ==/UserScript==

$1 = unsafeWindow.jQuery;

unsafeWindow.note = function () {
    $1('#gift_recipient_name').attr("value",'尊敬的顾客');
    $1('#gift_message_text').attr("value",'你好，欢迎光临米果电玩！\r\n\r\n小店经营Steam正版国区礼物\r\n\r\n我们的店铺地址是 https://miguodianwan.taobao.com');
    $1('#gift_signature').attr("value",'米果'); 
    $1('#gift_sentiment').attr("value",'~~~祝您每天都有好心情，记得再来哦~~~');
    document.getElementById('gift_sentiment_trigger').innerText='~~~祝您每天都有好心情，记得再来哦~~~'; 
    // alert('test');
};

var url = document.documentURI;
if (url.indexOf("https://store.steampowered.com/checkout/sendgift") > -1)
{
    $1('#submit_gift_note_btn').append("<a href='javascript:note();' class='btnv6_blue_hoverfade btn_medium'><span>填写留言</span></a>");
}
if (url.indexOf("https://store.steampowered.com/checkout/?purchasetype=gift") > -1)
{
  $1('#submit_gift_note_btn').before("<a href='javascript:note();' class='btnv6_blue_hoverfade btn_medium'><span>填写留言</span></a>");
}

