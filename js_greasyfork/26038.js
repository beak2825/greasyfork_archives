// ==UserScript==
// @name         Open Select url
// @version      2016.12.27
// @author      kiki
// @include     http*://*/*
// @description 鼠标划选url，对选择内容做简单修改，点击图标新窗口打开链接。
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @connect-src *
// @namespace https://greasyfork.org/users/15432
// @downloadURL https://update.greasyfork.org/scripts/26038/Open%20Select%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/26038/Open%20Select%20url.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.onclick=function(e){
        var x = e.pageX,y = e.pageY;
        if (!document.getElementById("img_link")){
            var img = document.createElement('img');
            img.setAttribute("id","img_link");
            img.setAttribute("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABjElEQVR42p3UyytEYRjH8WHHNOOSycKlzAaTIlmLlZCFSyk1Lisrf4KdlZWVS1kol62SrOxsFIWQQm4NyWpcxyXyfes39TbOjHPmqU+NM8fPc97nOXw+75WHcWzjGruYRJEvyxrGG76xhRN9PkCBl6BchT3iDA3Wd2MKHfUS2IcPhaV2koMHbLoNG8CzzqwmzT372HE7BHPzDcoQRAv81j2N+MG0m8ASPGFWPy/hXaE+TfcCr2hyExjSuXUozHSygAAiCosjqrN0rHwFhfSLVZi3wkxVIKZBRTN1NIgj7dq5wpa1Fuax2zCjMHMU3ek6M3vWq2nG9HidVmeLqMMdPnGs6aetEbV/hXJrAKazOYRRrO9KU6b857ySb8ApqrUa9gC6NJiQmylOIKGwoK61ajWSA1jRH3QVeKgBRKxrfu1ZQNO8xZ6W/N+Ka4pOVas3xAyq3+17eol1h+uFWhszqB4v/0XMOnyh3bpWrzDT/VCmN8CpwnosE7qGVX1OKCyrqsQU7vGCDTR77czUL2CsZM7vyjJlAAAAAElFTkSuQmCC");
            document.getElementsByTagName("body")[0].appendChild(img);
        }
        var imgs = document.getElementById("img_link");
        var txt = window.getSelection?window.getSelection():document.selection.createRange().text;
        var link = /(https?:\/\/)((\w|-|#|\?|=|\/|\+|%|&|:|;|!)+(\.)+)+/g;
        txt = txt.toString();
        if (txt.match(link) && imgs.style.display !== "block"){
            txt = txt.slice(txt.match(/(http)/) ? txt.match(/(http)/).index :0);
        var url = txt.match(/\s|[\u4e00-\u9fa5]|\n|\r|'|"/) ? txt.slice(0,txt.match(/\s|[\u4e00-\u9fa5]|\n|\r|'|"/).index):txt;
         // console.log(url);
            imgs.style.display = "block";
            imgs.style.position = "absolute" ;
            imgs.style.top = y - 15 + "px";
            imgs.style.left = x + "px" ;
          //  imgs.style.width = "20px" ;
            imgs.onmouseover = function(){imgs.style.opacity  = "0.6";};
            imgs.onmouseout = function(){imgs.style.opacity  = "1";};
      //    document.execCommand('copy');
            imgs.onclick = function(){window.open(url);};
        }else {
            imgs.style.display = "none";
        }
    };
})();