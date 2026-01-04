// ==UserScript==
// @name         DogeHeroes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  prueba de fauset en dogeheroes
// @author       Yinxo16
// @match        https://www.dogeheroes.com/*
// @icon         https://www.google.com/s2/favicons?domain=dogeheroes.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426821/DogeHeroes.user.js
// @updateURL https://update.greasyfork.org/scripts/426821/DogeHeroes.meta.js
// ==/UserScript==

(function() {
    'use strict';
setTimeout(function count() {
		 var startTime = document.getElementById('hms');
         var login = document.getElementsByClassName('sign_in')[1];
         var enter = document.getElementsByClassName('quest__btnx spinner')[0];
         var doge = document.getElementsByClassName('blue_btn spinner')[0];
         var faust = window.location.href;
         var wbpg = "https://dogeheroes.com/fauset.php";
    if(login){
        setTimeout(function login(){document.getElementsByClassName('sign_in')[1].click();},15000);
    }else{
        if(enter){
            setTimeout(function entrar(){document.getElementsByClassName('quest__btnx spinner')[0].click;},10000);
        }else{
            if(wbpg != faust){
            setTimeout(function redir(){window.location.href = "https://dogeheroes.com/fauset.php";},15000);
            }else{
		if (startTime == false || startTime == null)
        {
                        doge.click();
                    }else{
                        //alert(" ★·.·´¯`·.·★ αиитυυαи ѕє ℓα ¢σмє єитєяα ★·.·´¯`·.·★");
                        setTimeout(function reload(){location.reload();},1200000)
    }}}}},10000);
})();