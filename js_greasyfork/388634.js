// ==UserScript==
// @name         翻译回车格式整定助手
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  first press F5
// @author       XMAN
// @match        https://fanyi.baidu.com/*
// @match        http://fanyi.youdao.com/
// @match        https://translate.google.cn/*
// @match        https://translate.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388634/%E7%BF%BB%E8%AF%91%E5%9B%9E%E8%BD%A6%E6%A0%BC%E5%BC%8F%E6%95%B4%E5%AE%9A%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/388634/%E7%BF%BB%E8%AF%91%E5%9B%9E%E8%BD%A6%E6%A0%BC%E5%BC%8F%E6%95%B4%E5%AE%9A%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    var id = "";
    var host = window.location.host;
    if( host == "fanyi.baidu.com" )
    {
        id = "baidu_translate_input";
    }
    if( host == "fanyi.youdao.com" )
    {
        id = "inputOriginal";
    }
    if( host == "translate.google.cn" || host == "translate.google.com" )
    {
        id = "source";
    }
    document.getElementById(id).addEventListener('blur',function(){
        convert();
        var trigger_translate = new Event('click');
        if(host == 'fanyi.youdao.com'){
            document.getElementById('transMachine').dispatchEvent(trigger_translate);
        }else if(host == 'fanyi.baidu.com'){
            document.getElementById('translate-button').dispatchEvent(trigger_translate);
        }
    });
    function convert(){
        var txt = "";
        txt = document.getElementById(id).value;
        for (var i=0;i<txt.length;i++)
        {
            if(txt.indexOf("\n"))txt = txt.replace("\n"," ");
        }
        document.getElementById(id).value = txt;
    }
})();


