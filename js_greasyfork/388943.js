// ==UserScript==
// @name         轴中心助手
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  copy title and rightclick to open
// @author       cvk792
// @match        https://*.jiku-chu.com/*
// @downloadURL https://update.greasyfork.org/scripts/388943/%E8%BD%B4%E4%B8%AD%E5%BF%83%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/388943/%E8%BD%B4%E4%B8%AD%E5%BF%83%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var replaceOnclick = function replaceOnclick(){
    $("td.title > a[onclick],td.photo > a[onclick],span.title > a[onclick],div.photo > a[onclick]").each(function(){
        let attrvalue = this.getAttribute("onclick");
        let url = attrvalue.slice(attrvalue.search("/"),attrvalue.search(",")-1);
        this.setAttribute("href", url);
        this.removeAttribute("onclick");
        /*另一种方式，影响页面加载
        let big_pic, cart;
        $.ajax({type:"get",url:url,async:false,success:function(htmldata){
            big_pic = $(htmldata).find('div#photo > a').attr('href');
            cart = $(htmldata).find('div#cartin > img').attr('src');
            //console.log(big_pic);
        }});
        this.setAttribute('big_pic', big_pic)
        */
    });
};

var addCopyBotton = function addCopyBotton(){
    $('\n<div id="userbtn">\n  <span  name="userCopyTittle" style="color: #00f;" title="Copy Tittle">Copy</span>\n</div>\n').appendTo("td.title");
    $('\n<div id="userbtn">\n  <span  name="userCopyTittle" style="color: #00f;" title="Copy Tittle">Copy</span>\n</div>\n').appendTo($("th > img[title='商品名']").parent().parent());
    $('[name="userCopyTittle"]').click(function (event) {
        //var title = event.target.parentNode.previousSibling.previousSibling.innerHTML;
        var rng = document.createRange();
        var selection = window.getSelection();
        selection.removeAllRanges();
        rng.selectNodeContents(event.target.parentNode.previousSibling.previousSibling);
        selection.addRange(rng);
        document.execCommand('copy');
        selection.removeAllRanges();
    });
};

var insertCSS = function insertCSS(){
    var style = document.createElement("style");
    style.type = "text/css";
    var text = document.createTextNode("#tip {position:absolute;color:#333;display:none;}\
\n#tip s {position:absolute;top:40px;left:-20px;display:block;width:0px;height:0px;font-size:0px;line-height:0px;border-color:transparent#BBAtransparenttransparent;border-style:dashedsoliddasheddashed;border-width:10px;}\
\n#tip s i {position:absolute;top:-10px;left:-8px;display:block;width:0px;height:0px;font-size:0px;line-height:0px;border-color:transparent#ffftransparenttransparent;border-style:dashedsoliddasheddashed;border-width:10px;}\
\n#tip .t_box {position:relative;background-color:#CCC;filter:alpha(opacity=50);-moz-opacity:0.5;bottom:-3px;right:-3px;}\
\n#tip .t_box div {position:relative;background-color:#FFF;border:1pxsolid#ACA899;background:#FFF;padding:1px;top:-3px;left:-3px;}\
\n.tip {width:82px;height:82px;border:1pxsolid#DDD;}");
    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
};

var mouseover_tip = function mouseover_tip(){
    $("td.photo, div.photo").on("mouseover mouseout mousemove", 'img', function(event){
        var pagewidth = document.documentElement.clientWidth;
        var type = event.type;
        if (type === "mouseover"){
            var url = $(this).parent().attr('href');
            var big_pic, cart;
            $.ajax({type:"get",url:url,async:false,success:function(htmldata){
                big_pic = $(htmldata).find('div#photo a.gallery').attr('href');
                cart = $(htmldata).find('img#cart').attr('src');
                if (cart === "/images/mcb_cartin.gif"){cart = "在庫あり"}else if(cart ==="/images/mcb_cartin_off.gif"){cart = "売り切れ"}
            }});
            var $tip=$('<div id="tip"><div class="t_box"><div><img src="'+ big_pic +'" /><br><table class="cmt"><b>' + cart + '</b></div></div></div>');
        	$('body').append($tip);
        	$('#tip').show('fast');
        }else if(type === "mouseout"){
        	$('#tip').remove();
        }else if(type === "mousemove"){
        	$('#tip').css({"top":(event.pageY-60)+"px","right":(pagewidth-event.pageX+30)+"px"});
        }
    });
};

(function() {
    'use strict';

    replaceOnclick();
    addCopyBotton();
    insertCSS();
    mouseover_tip();
    // Your code here...
})();
