// ==UserScript==
// @name         🔥持续更新🔥 网页可编辑化，让你可以修改网页上的文字！
// @namespace    醉_Code
// @version      0.6
// @description  CSDN、简书去广告，和让你可以自由的编辑网站上的文字！！！
// @author       醉_Code
// @match        *
// @include      *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441350/%F0%9F%94%A5%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%F0%9F%94%A5%20%E7%BD%91%E9%A1%B5%E5%8F%AF%E7%BC%96%E8%BE%91%E5%8C%96%EF%BC%8C%E8%AE%A9%E4%BD%A0%E5%8F%AF%E4%BB%A5%E4%BF%AE%E6%94%B9%E7%BD%91%E9%A1%B5%E4%B8%8A%E7%9A%84%E6%96%87%E5%AD%97%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/441350/%F0%9F%94%A5%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%F0%9F%94%A5%20%E7%BD%91%E9%A1%B5%E5%8F%AF%E7%BC%96%E8%BE%91%E5%8C%96%EF%BC%8C%E8%AE%A9%E4%BD%A0%E5%8F%AF%E4%BB%A5%E4%BF%AE%E6%94%B9%E7%BD%91%E9%A1%B5%E4%B8%8A%E7%9A%84%E6%96%87%E5%AD%97%EF%BC%81.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var h1 = document.getElementsByTagName("h1");
    //h1[0].innerHTML = h1[0].innerHTML+"<style type=\"text/css\">.btn-block{position : fixed;right : 10px;Writing-mode : vertical-rl;}</style>";
    var button = document.createElement("button");
	button.id = "Write_Text";
	button.textContent = "开启或关闭自由编辑网页功能";
	button.style.width = "210px";
	button.style.height = "25px";
	button.style.align = "center";
    button.style.fontSize = "15px";
    //alert("1");
    //button.style.zindex = 9999;
    //button.class = "btn btn-block"
    h1[0].appendChild(button);
    //alert("1");
    console.log('start');
    button.onclick = function() {
        // 设置在此处单击#button时要发生的事件
        //code
        if(document.body.contentEditable=="true"){
            document.body.contentEditable="inherit";
            alert("已成功关闭编辑功能");
        } else{
            document.body.contentEditable="true";
            alert("已成功开启编辑功能");
        }

    };
})();