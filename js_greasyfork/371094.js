// ==UserScript==
// @name         耽美之家 一键复制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://danmeijia.net/body/bookid/*
// @grant        none
// @require      https://cdn.bootcss.com/clipboard.js/2.0.1/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/371094/%E8%80%BD%E7%BE%8E%E4%B9%8B%E5%AE%B6%20%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/371094/%E8%80%BD%E7%BE%8E%E4%B9%8B%E5%AE%B6%20%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

// add node
$(".read_title").append("<button class='copy-btn'>复制本页</button>");
$(".pagego").append("<button class='copy-btn'>复制本页</button>");
$(".pagego").append("<button class='auto-copy'>自动复制</button>");
$(".read_title").append("<textarea id='bar'>Novel</textarea>");
$(".read_title").append("<button class='btn-copy-hidden' id='copy' data-clipboard-action='cut' data-clipboard-target='#bar'>Cut to clipboard</button>");

// Clipboard
new ClipboardJS('#copy');
new ClipboardJS('.btn-copy-hidden');

$(".copy-btn").click(function () {
    var text = "\r\n" + $(".read_title > h1").text() + "\r\n";
    $(".read > .content > div > p:visible").each(function () {text += $(this).text() + '\r\n'});
    $("#bar").val(text);
    $("#copy").click();
});

// Auto scoll
var interval = setInterval(function () {
    console.log($("#cload").css("display") == "none");
    if($("#cload").css("display") == "none"){
        window.clearInterval(interval);
        check();
    }
    var top = $('.pagego').offset().top;
    $(window).scrollTop(top);
}, 500);

// Auto copy
function check(){
    if(window.localStorage["autocopy"] == "true"){
        autocopy();
    }
}

function autocopy(){
    var text = "\r\n" + $(".read_title > h1").text() + "\r\n";
    $(".read > .content > div > p:visible").each(function () {text += $(this).text() + '\r\n'});
    window.localStorage["text"] += text;
    // check end
    if($(".pagego > font > a")[1].href.substring(21,26) == "books"){
        window.localStorage["autocopy"] = "false";
        $("#bar").val(window.localStorage["text"]);
        $("#copy").click();
        // window.localStorage["text"] = "";
        $(window).scrollTop(0);
        alert("复制成功,请手动剪切");
    }else{
        $(".pagego > font > a")[1].click();
    }
}

$(".auto-copy").click(function (){
    window.localStorage["autocopy"] = "true";
    window.localStorage["text"] = "";
    autocopy();
});
