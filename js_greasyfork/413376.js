// ==UserScript==
// @name         抓黄书
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @include      *//www.cool18.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413376/%E6%8A%93%E9%BB%84%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/413376/%E6%8A%93%E9%BB%84%E4%B9%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var text = $("pre").text().replace(/cool18.com/g,"");
    function copyToClip(content, message) {
        var aux = document.createElement("input");
        aux.setAttribute("value", content);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
        if (message == null) {
            alert("复制成功");
        } else{
            alert(message);
        }
    }
    $("body").prepend('<button class="copyTxt"> Copy </button>');
    $(".copyTxt").click(function(){
       copyToClip(text);
    })
    // Your code here...
})();