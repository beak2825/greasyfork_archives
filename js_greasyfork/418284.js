// ==UserScript==
// @name         Ngrok内网穿透Web检查页面美化
// @namespace    Zuoxiao
// @version      2.22
// @description  Ngrok内网穿透Web检查页面美化-@ByZuo,@ByKun
// @author       Zuoxiao
// @include      http://127.0.0.1:4040/http/in
// @include      http://127.0.0.1:4040/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/418284/Ngrok%E5%86%85%E7%BD%91%E7%A9%BF%E9%80%8FWeb%E6%A3%80%E6%9F%A5%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/418284/Ngrok%E5%86%85%E7%BD%91%E7%A9%BF%E9%80%8FWeb%E6%A3%80%E6%9F%A5%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==
GM_addStyle('pre{font-family:Consolas,Monaco,"Andale Mono","Ubuntu Mono",monospace;background:#2d2d2d} pre code{color:#ccc;font-family:Consolas,Monaco,"Andale Mono","Ubuntu Mono",monospace;word-wrap: normal;word-break: break-all;margin-top: 0;margin-bottom: 20px;border-radius: 4px;z-index: 0;padding: 1em;line-height: 1.5;color: #ccc;background: #2d2d2d;} pre code .attribute{color:#409EFF;font-family:Consolas,Monaco,"Andale Mono","Ubuntu Mono",monospace;} pre code .string{color:#F56C6C;font-family:Consolas,Monaco,"Andale Mono","Ubuntu Mono",monospace;}pre code .number{color:#67C23A;font-family:Consolas,Monaco,"Andale Mono","Ubuntu Mono",monospace;}');
$("body").css("background",'#f1f1f1');
$(".navbar").css("box-shadow",'0 0 15px 2px rgba(0,0,0,.5)');
$(".brand").html('Ngrok专业控制台').css("color","#f89406");
$(".nav").remove();
$(".row>.span6").css("background",'#ffffff').css('padding','10px').css('box-sizing','border-box');
$("body").css("font-family",'Consolas,Monaco,"Andale Mono","Ubuntu Mono",monospace').css('font-size','12px');
$(".txn-selector tr").css("font-size",'12px');
function  fliter_image_respon(){
    $(".txn-selector tr").each(function () {

        var respons_txt = $(this).find(".wrapped .path").text();
        if (confirmEnding(respons_txt, '.svg') ||confirmEnding(respons_txt, '.gif') ||confirmEnding(respons_txt, '.png')||confirmEnding(respons_txt, '.jpg')||confirmEnding(respons_txt, '.jpeg')||confirmEnding(respons_txt, '.ico')) {
            $(this).fadeOut('300ms');
        }
    })
}


setInterval(function (){
    fliter_image_respon();

},200)

function confirmEnding(str, target) {
    // 请把你的代码写在这里
    var start = str.length - target.length;
    var arr = str.substr(start, target.length);
    if (arr == target) {
        return true;
    }
    return false;
}

