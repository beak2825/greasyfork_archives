// ==UserScript==
// @name         UCAS sep login-page simplifier
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  Just simplify it!
// @author       Racosel
// @match        https://sep.ucas.ac.cn/
// @grant        none
// @license      MIT
// @icon         https://sep.ucas.ac.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/469765/UCAS%20sep%20login-page%20simplifier.user.js
// @updateURL https://update.greasyfork.org/scripts/469765/UCAS%20sep%20login-page%20simplifier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var errCode = 0;
    var errAcc = 0;
    var errPw = 0;
    var errMsg,er;
    try{
        errMsg = document.getElementsByClassName("alert-error")[0].innerHTML;
        document.getElementsByClassName("alert-error")[0].remove();
    }catch(er){
        errMsg = "there is no exception";
    }finally{;}

    if(errMsg == "Wrong username or password"){
        errAcc = 1;
        errPw = 1;
    }else if(errMsg == "Wrong validation code"){
        errCode = 1;
    }else if(errMsg.slice(0,14) == "Wrong password"){
        errPw = 1;
    }
    console.log(errMsg.slice(0,14), errAcc, errPw, errCode)


    var right = document.getElementsByClassName("rightlink")[0];
    right.remove();
    var left = document.getElementsByClassName("leftlongin")[0];
    left.style.borderRadius = "60px";
    left.style.width = "400px";
    left.style.height = "400px";
    left.style.marginLeft = "150px";
    left.style.lineHeight = "50px";
    left.style.fontFamily = "consolas";
    left.style.padding = "20px";
    document.getElementsByTagName("h1")[0].style.fontFamily = "consolas";
    document.getElementsByTagName("h1")[0].style.userSelect = "none";
    document.getElementsByTagName("h1")[0].style.marginTop = "15px";
    document.getElementsByTagName("h1")[0].style.marginBottom = "25px";
    document.getElementsByTagName("h1")[0].innerHTML = "UCAS metaverse";

    document.getElementsByClassName("row")[1].remove();

    var bars = document.getElementsByClassName("form-group");
    for(let i=0; i<3; i++){
        let lbl = bars[i].children[0];
        let ipt = bars[i].children[1];
        lbl.style.fontSize = "1.25em";
        lbl.style.lineHeight = "50px";
        lbl.style.userSelect = "none";
        if(i==0 && errAcc || i==1 && errPw || i==2 && errCode){
            lbl.style.color = "red";
            lbl.innerHTML += "❌";
        }
        if(i==2){
            lbl.innerHTML = "CAPTCHA";
        }
        bars[i].style.height = "50px";
        ipt.style.height = "30px";
        ipt.style.marginTop = "10px";
        ipt.placeholder = "";
    }

    document.getElementsByClassName("signin-footer")[0].style.marginTop = "0";

    document.getElementsByClassName("idCode")[1].remove();
    document.getElementById("code").onclick = function(){
        changeimg();
    };
    document.getElementById("code").style.right = "15px";
    document.getElementById("code").style.cursor = "pointer";

    var login = document.getElementById("sb1");
    console.log(login);
    login.style.width = "150px";
    login.style.height = "2.5em";
    login.style.marginTop = "10px";
    login.style.fontSize = "1.2em";
    login.innerHTML = "git commit";
    login.padding = "0";

})();