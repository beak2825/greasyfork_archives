// ==UserScript==
// @name         echo download link maker
// @version      0.1
// @description  get music download link
// @author       Julydate
// @include      http://*.app-echo.com/*
// @include      http://app-echo.com/*
// @include      https://*.app-echo.com/*
// @include      https://app-echo.com/*
// @grant        none
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/374285/echo%20download%20link%20maker.user.js
// @updateURL https://update.greasyfork.org/scripts/374285/echo%20download%20link%20maker.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
//检测框架是否加载完成并注入脚本
document.onreadystatechange = onPageLoad;
function onPageLoad(){
    if(document.readyState == "complete"){
        //我也不知道明明DOM加载完了还是检测不到“tags-list”，所以只好设置一个延迟再执行
        setTimeout(insertScript,5000);
    }
}
function insertScript() {
    var jsBox = document.getElementsByClassName("tags-list")[0];
    var Scriptbox = document.createElement('script');
    Scriptbox.text =
        "document.getElementsByClassName('play-btn')[0].addEventListener('click',function(){\n"+
        "    var ele=document.getElementsByTagName('audio')[0];\n"+
        "    var ul = document.getElementsByTagName('ul')[1];\n"+
        "    if(document.getElementById('downloadLink')){\n"+
        "        document.getElementById('downloadLink').innerHTML='<a href=\"'+ele.src+'\" download=\"'+ele.src+'\"target=\"_blank\">点击此处下载</a>';\n"+
        "    }else{\n"+
        "        var li = document.createElement('li');\n"+
        "        li.setAttribute('style', 'color:red');\n"+
        "        li.setAttribute('id', 'downloadLink');\n"+
        "        ul.appendChild(li);\n"+
        "        li.innerHTML='<a href=\"'+ele.src+'\" download=\"'+ele.src+'\"target=\"_blank\">点击此处下载</a>';\n"+
        "    }\n"+
        "});\n";
    jsBox.appendChild(Scriptbox);
}