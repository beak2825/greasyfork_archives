// ==UserScript==
// @name         Login Kohls Transplace
// @namespace    https://greasyfork.org/users/4756
// @author       saibotshamtul (Michael Cimino)
// @version      0.1.11
// @description  try to take over the world!
// @match        https://fed.transplace.com/adfs/ls*
// @match        https://tms.transplace.com/security/baseLogon.do?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30137/Login%20Kohls%20Transplace.user.js
// @updateURL https://update.greasyfork.org/scripts/30137/Login%20Kohls%20Transplace.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var a = document.createElement("div");
    var pw = "WALnut60*100"; //"1246Walnut62";
    window.pw = pw;
    if (window.location.href.match("http.*://fed.")!==null){
        a.style.cssText="position:absolute;padding:10px;left:10px;top:10px;display:inline-block; border: 2px solid #ccc; font-family:Arial;color:#ccc;font-size:10pt";
    }
    if (window.location.href.match("http.*://tms.")!==null){
        a.style.cssText="position:absolute;padding:10px;left:10px;top:100px;display:inline-block; border: 2px solid #ccc; font-family:Arial;color:#ccc;font-size:10pt";
    }
    //a.innerHTML = (function(){/*<center>339gkuchinski<br>transplace123</center>*/}).toString().slice(14,-3);
    //a.innerHTML = (function(){/*<center>339gkuchinski<br>60walnut</center>*/}).toString().slice(14,-3);
    //a.innerHTML = (function(){/*<center>339gkuchinski<br>60outerstuff</center>*/}).toString().slice(14,-3);
    a.innerHTML = (function(){/*<center>339gkuchinski<br>password
    <br/><button id='easybutton' style='color:#aaa;background-color:transparent;border:0px;'>easy</button>
    </center>*/}).toString().slice(14,-3).replace("password",pw);
    document.body.appendChild(a);
    /*
    339gkuchinski / transplace123
    339gkuchinski / 60walnut
    339gkuchinski / 60outerstuff
    339gkuchinski / 1246Walnut60, 61, 62
    */
    easybutton.onclick = function(){
        if ((typeof userNameInput)!=="undefined"){
            userNameInput.value="339gkuchinski"; passwordInput.value=pw;submitButton.click();
        } else {
            document.querySelector('[name=textfield]').value="339gkuchinski"; document.querySelector('[name=textfield2]').value=pw;document.querySelector('[name=Submit]').click();
        }
    };
    a.style.left = window.screen.width - a.offsetWidth - 20 + "px";
    //

})();