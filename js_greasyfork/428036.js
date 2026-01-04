// ==UserScript==
// @name         TUM auto login
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  auto click tum login
// @author       DerKleineLi
// @match        https://www.moodle.tum.de/*
// @match        https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/
// @match        https://login.tum.de/idp/profile/SAML2/*
// @icon         https://www.google.com/s2/favicons?domain=tum.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428036/TUM%20auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/428036/TUM%20auto%20login.meta.js
// ==/UserScript==
var host = location.host;
var paras;
var username = "你的用户名" //修改为你的用户名 change this to your username
var password = "你的密码" //修改为你的密码 change this to your password
var fc = function(){ //campus.tum.de
    switch(document.getElementsByClassName("ca-header-page-title ng-star-inserted")[0].outerText){
        case "Anmelden": //登录页
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent('input', true, true);
            var t = document.getElementById('id_brm-pm-dtop_login_uname_input')
            t.value = username;
            t.dispatchEvent(evt)
            t = document.getElementById('id_brm-pm-dtop_login_pw_input')
            t.value = password;
            t.dispatchEvent(evt)
            document.getElementById('id_brm-pm-dtop_login_submitbutton').click();
            break
        case "Aktuelle Informationen": //消息页
            paras = document.getElementById('idIframe').contentWindow.document.getElementsByClassName("commandButton");
            for(var i=0;i<paras.length;i++){
                if (paras[i].outerText=='Weiter'){
                    paras[i].click();
                }
            }
            break
        case "Startseite": //未登录主页
            if(document.getElementsByClassName("ca-login-header-slot ca-if-desktop ng-star-inserted")[0].firstElementChild.firstElementChild.firstElementChild.firstElementChild.children[1].outerText=="Anmelden"){
                document.getElementsByClassName("ca-login-header-slot ca-if-desktop ng-star-inserted")[0].firstElementChild.firstElementChild.firstElementChild.click()
            }
            break
    }
    //alert(fc)
}

var fl = function(){ //login.tum.de
    document.getElementById('username').value = username;
    document.getElementById('password').value = password;
    document.getElementById("donotcache-dummy").click();
    document.getElementById('btnLogin').click();
}

var f=function(){
   switch (host) {
        case 'www.moodle.tum.de':
            paras = document.getElementsByTagName('a');

            for(i=0;i<paras.length;i++){
                if(paras[i].outerText=="Mit TUM-Kennung"){
                    paras[i].click()
                }
            }

            paras = document.getElementsByClassName('icon-arrow-right');

            for(var i=0;i<paras.length;i++){
                if (paras[i].title=='TUM LOGIN'){
                    paras[i].click();
                }
            }
            break
        case 'campus.tum.de':
            try{
                document.getElementById("id-home").onload = (fc())
            }catch{
                setTimeout(f, 500 )
            }
            break
        case 'login.tum.de':
            try{
                document.getElementById("id-home").onload = (fl())
            }catch{
                setTimeout(f, 500 )
            }
            break
   }
}
f()