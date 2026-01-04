// ==UserScript==
// @name         0.1s坚果绘图加快自动保存速度
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.jianguoyun.com/static/drawio/*
// @grant        none
// @require      http://cdn.staticfile.org/jquery/1.8.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/392671/01s%E5%9D%9A%E6%9E%9C%E7%BB%98%E5%9B%BE%E5%8A%A0%E5%BF%AB%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E9%80%9F%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/392671/01s%E5%9D%9A%E6%9E%9C%E7%BB%98%E5%9B%BE%E5%8A%A0%E5%BF%AB%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E9%80%9F%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    var time = 0.1;
    setInterval(function(){
        $(".geStatusAlert").click()
    }, time*1000);
})();