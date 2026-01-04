// ==UserScript==
// @name         translation replace character
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  first press F5
// @author       XMAN
// @match        https://fanyi.baidu.com/*
// @match        http://fanyi.youdao.com/
// @match        https://translate.google.cn/*
// @match        https://translate.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370938/translation%20replace%20character.user.js
// @updateURL https://update.greasyfork.org/scripts/370938/translation%20replace%20character.meta.js
// ==/UserScript==

(function() {
    var txt = "";
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

    txt = document.getElementById(id).value;
    for (var i=0;i<txt.length;i++)
    {
        if(txt.indexOf("\n"))txt = txt.replace("\n"," ");
    }
    document.getElementById(id).value = txt;

})();

    setTimeout("self.location.reload();",15000);//15s

