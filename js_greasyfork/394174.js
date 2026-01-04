// ==UserScript==
// @name         MSDN语言切换
// @namespace    https://github.com/maidouofgithub
// @version      0.2.1
// @description  切换MSDN文档的中英语言版版本(switch Chinese/English language in MSDN)
// @author       landwind
// @match        https://docs.microsoft.com/*
// @downloadURL https://update.greasyfork.org/scripts/394174/MSDN%E8%AF%AD%E8%A8%80%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/394174/MSDN%E8%AF%AD%E8%A8%80%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Init();

    function  Init()
    {
        AppendButton();
    }

    function AppendButton()
    {

        console.log('will append language switch button!');
        let url = location.href;
        var a = document.createElement('a');
        a.style.cssText =  'background-color:#66CC99;text-align:center;opacity:0.7;color:white;cursor:pointer;position:fixed;bottom:70%;width:45px;height:25px;right:10px;z-index:9999';
        a.innerHTML ='中/英';
        a.addEventListener('click', function(){
            if (url.indexOf('en-us')> -1){
                window.location.replace(url.replace('en-us','zh-cn'));
            }
           else if (url.indexOf('zh-cn') >= -1){
                window.location.replace(url.replace('zh-cn','en-us'));
            }
        }, false );
        document.body.appendChild(a);
    }
})();