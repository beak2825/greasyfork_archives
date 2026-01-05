// ==UserScript==
// @name        iconfont_iOS
// @description icon font unicode for iOS
// @namespace   https://github.com/chenshengzhi
// @include     *www.iconfont.cn/*
// @version     0.0.1
// @require     http://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19974/iconfont_iOS.user.js
// @updateURL https://update.greasyfork.org/scripts/19974/iconfont_iOS.meta.js
// ==/UserScript==

var btn = document.createElement("input");
btn.type = "button";
btn.value = "iOS";
btn.style.position = 'fixed';
var top = '30px';
btn.style.top = top;
btn.style.right = '30px';
btn.style.width = '60px';
btn.style.height = '60px';
btn.style.backgroundColor = '#208F72';
btn.style.borderStyle = 'none';
btn.style.borderRadius = '30px';
btn.style.color = 'white';
btn.style.fontSize = '16px';
btn.onclick = function (){
    var lists = $("ul.font-lists").children("li").children(".unicode");
    lists.each(function(){
        var normalUnicode = $(this).html().replace("&amp;", '&');
        console.log(normalUnicode);
        var index = normalUnicode.indexOf("#x") + 2;
        var temp = normalUnicode.substr(index);
        temp = temp.substr(0, temp.length-1);
        for (var i = temp.length; i < 8; i = temp.length) {
            temp = '0' + temp;
        }
        var newUnicode = "\\U" + temp;
        console.log(newUnicode);
        $(this).html(newUnicode);
    });

    var lists = $("ul.font-lists").children("li");
    lists.each(function(){
        var unicode = $(this).children(".unicode").html();
        $(this).children(".name").attr("data-clipboard-text", unicode);
    });
};
document.body.appendChild(btn);
