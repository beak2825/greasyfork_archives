// ==UserScript==
// @name         Login Amazon Vendor Central
// @namespace    https://greasyfork.org/users/4756
// @version      0.1.3.6
// @description  try to take over the world!
// @author       saibotshamtul (Michael Cimino)
// @match        https://vendorcentral.amazon.com/gp/vendor/sign-in*
// @match        https://vendorcentral.amazon.com/ap/signin*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30140/Login%20Amazon%20Vendor%20Central.user.js
// @updateURL https://update.greasyfork.org/scripts/30140/Login%20Amazon%20Vendor%20Central.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var a = document.createElement("div");
    //if (window.location.href.match("http.*://.")!==null){
    a.style.cssText="position:absolute;padding:10px;left:10px;top:10px;display:inline-block; border: 2px solid #888; font-family:Arial;color:#888;font-size:10pt";
    //}
    a.innerHTML = (function(){/*
    <center>
    <!--jtowsley@outerstuff.com<br/>--jennifer2--LICENSED-->
    ginak@outerstuff.com<br/>CLARK60
    <br/><button id='easybutton' style='color:#aaa;background-color:#fff;border:0px;'>easy</button>

    <br/><br/>OS3PLrouting@outerstuff.com<br/><!--walnut60-->60suite100
    <br/><button id='starterbutton' style='color:#aaa;background-color:#fff;border:0px;'>starter</button>

    <br/><br/>jvanderpool@outerstuff.com<br/><!-- -->CANADA
    <br/><button id='canadabutton' style='color:#aaa;background-color:#fff;border:0px;'>Canada</button>
    </center>*/}).toString().slice(14,-3);
    document.body.appendChild(a);
    easybutton.onclick = function(){
        var u,p;
        if (window.location.href.match("ap.signin")){
            u = ap_email;
            p = ap_password;
        } else {
            u = username;
            p = password;
        }
        u.value="ginak@outerstuff.com";
        p.value=["jennifer2","LICENSED","CLARK60"][2];
        document.querySelector("#login-button-container").click();
    };
    starterbutton.onclick = function(){
        var u,p;
        if (window.location.href.match("ap.signin")){
            u = ap_email;
            p = ap_password;
        } else {
            u = username;
            p = password;
        }
        u.value="OS3PLrouting@outerstuff.com";
        p.value=["walnut60","60suite100"][1];
        document.querySelector("#login-button-container").click();
    };
    canadabutton.onclick = function(){
        var u,p;
        if (window.location.href.match("ap.signin")){
            u = ap_email;
            p = ap_password;
        } else {
            u = username;
            p = password;
        }
        u.value="jvanderpool@outerstuff.com";
        p.value=["CANADA"][0];
        document.querySelector("#login-button-container").click();
    };

    a.style.left = window.screen.width - a.offsetWidth - 20 + "px";

})();


