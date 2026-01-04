// ==UserScript==
// @name         锐智2.0
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  try to take over the world!
// @author       liuxiangxiang
// @match        *://192.168.192.5:8098/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402316/%E9%94%90%E6%99%BA20.user.js
// @updateURL https://update.greasyfork.org/scripts/402316/%E9%94%90%E6%99%BA20.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.setTimeout = function(){};

   // <iframe id="SessionGoOn" src="./SessionGoOn.aspx" style="width: 213px; height: 213px; display: none;"></iframe>

    var iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    iframe.height = '213px'
    iframe.width = '213px'
    iframe.src="./SessionGoOn.aspx";
    iframe.id = 'SessionGoOn';
    iframe.style.display='none';


    var timer;
        //每隔10分钟刷新服务器空画面
    timer = setInterval(function () {

        document.getElementById('SessionGoOn').contentWindow.location.reload(true);}, 600000);



     //function keepsession(){
       // window.location.href ="/SessionKeeper.asp?RandStr="+Math.random();

         //window.setTimeout(keepsession(),900000);
  //}
 //keepsession();

})();