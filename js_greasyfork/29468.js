// ==UserScript==
// @name         MSDN中英切换
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  switch Chinese/English language in MSDN
// @author       dangoron
// @match        http*://msdn.microsoft.com/en-us/*
// @match        http*://msdn.microsoft.com/zh-cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29468/MSDN%E4%B8%AD%E8%8B%B1%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/29468/MSDN%E4%B8%AD%E8%8B%B1%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = location.href;
    var a = document.createElement('span');
    function create_button(){
        var css = 'opacity:0.5;color:black;cursor:pointer;position:fixed;bottom:80%;width:40px;height:40px;right:0px;z-index:9999';
        a.style.cssText = css;
        a.innerHTML ='中/英';
        a.addEventListener('mouseover', function(){ a.style.opacity = 1;}, false);
        a.addEventListener('mouseout', function(){ a.style.opacity = 0.3; }, false);
        a.addEventListener('click', function(){
            if (url.search(/\/en-us\//) != -1){
                window.location.replace(url.replace(/\/en-us\//,'\/zh-cn\/'));
            }
            if (url.search(/\/zh-cn\//) != -1){
                window.location.replace(url.replace(/\/zh-cn\//,'\/en-us\/'));
            }
        }, false );
        document.body.appendChild(a);
    }
    create_button();
})();
