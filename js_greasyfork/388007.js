// ==UserScript==
// @name         pdf复制去回车脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  复制PDF的内容之后，点击Change按钮，实现去回车翻译
// @author       sun_liber
// @match        https://fanyi.baidu.com/*
// @match        http://fanyi.youdao.com/*
// @match        https://translate.google.cn/*
// @match        https://translate.google.com/*
// @match        https://translate.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/388007/pdf%E5%A4%8D%E5%88%B6%E5%8E%BB%E5%9B%9E%E8%BD%A6%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/388007/pdf%E5%A4%8D%E5%88%B6%E5%8E%BB%E5%9B%9E%E8%BD%A6%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    var txt = "";
    var id = "";
    var transButtonId=""
    var host = window.location.host;
    if( host == "fanyi.baidu.com" )
    {
       id = "baidu_translate_input";
        transButtonId="translate-button";
    }
    if( host == "fanyi.youdao.com" )
    {
       id = "inputOriginal";
        transButtonId="transMachine";
    }
    if( host == "translate.google.cn" || host == "translate.google.com" )
    {
       id = "source";
       //谷歌翻译好像没有按钮
    }


    var button = document.createElement('button');
    button.setAttribute('style','position:fixed;top:300px;left:30px;');
    button.textContent="Change";
    button.onclick=function(){
          txt = document.getElementById(id).value;
        for (var i=0;i<txt.length;i++)
        {
            if(txt.indexOf("\n"))txt = txt.replace("\n"," ");
        }
        document.getElementById(id).value = txt;

        transButtonId!==""?document.getElementById(transButtonId).click():console.log("谷歌大法好啊");

    }
    document.body.appendChild(button);
})();


