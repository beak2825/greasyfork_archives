// ==UserScript==
// @resource icon1 http://tampermonkey.net/favicon.ico
// @name         idHelper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       yao
// @match

// @include https://www.buyoyo.com/*
// @grant        none
//@require  http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/390086/idHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/390086/idHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var button = $("<input class='myBtn' type='button' value='id' />");
    button.css({
        "width":"70",
        "display": "inline-block",
        "zoom": "1",
        "display": "inline",
        "vertical-align": "baseline",
        "margin": "0 2px",
        "outline": "none",
        "cursor": "pointer",
        "height": "27px",
        "text-align": "center",
        "text-decoration": "none",
        "font": "14px/100% Arial, Helvetica, sans-serif",
        "text-shadow": "0 1px 1px rgba(0,0,0,.3)",
        "-webkit-border-radius": ".5em",
        "-moz-border-radius": ".5em",
        "border-radius": ".5em",
        "-webkit-box-shadow": "0 1px 2px rgba(0,0,0,.2)",
        "-moz-box-shadow": "0 1px 2px rgba(0,0,0,.2)",
        "box-shadow": "0 1px 2px rgba(0,0,0,.2)",
        "border": "solid 1px #555",
        "background": "#6e6e6e",
        "background": "-webkit-gradient(linear, left top, left bottom, from(#888), to(#575757))",
        "background": "-moz-linear-gradient(top,  #888,  #575757)",
        "filter":  "progid:DXImageTransform.Microsoft.gradient(startColorstr='#888888', endColorstr='#575757')"

    });
    var pa = /\d+/;
    button.click(function(){
        var id = $(this).siblings("i").text();
        // 创建'虚拟'DOM
        const input = document.createElement('input')
        document.body.appendChild(input)
        input.setAttribute('value', id)
        input.select()
        if (document.execCommand('copy')) {
            document.execCommand('copy')
        }
        // 删除'虚拟'DOM
        document.body.removeChild(input)
        console.log(id);
    });
    $("td[valign='top'][align='center'][width='15%']").append(button);

})();