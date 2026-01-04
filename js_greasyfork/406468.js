
// ==UserScript==
// @name         扇贝 [ 扩展 ]
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  1.快捷播放例句 2.快捷播放单词
// @author       You
// @match        https://web.shanbay.com/wordsweb/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406468/%E6%89%87%E8%B4%9D%20%5B%20%E6%89%A9%E5%B1%95%20%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/406468/%E6%89%87%E8%B4%9D%20%5B%20%E6%89%A9%E5%B1%95%20%5D.meta.js
// ==/UserScript==

(function() {
    var fileref=document.createElement('script');
    fileref.setAttribute("type","text/javascript");
    fileref.setAttribute("src", 'https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js');
    document.getElementsByTagName("head")[0].appendChild(fileref);
    document.onkeyup = function() {
        if(event.keyCode == 81) {
            $("[alt='trumpet']")[2].click();
        }
        if(event.keyCode == 87) {
            $("[alt='trumpet']")[1].click();
        }
    }
})();