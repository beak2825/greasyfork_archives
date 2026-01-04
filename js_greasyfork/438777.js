// ==UserScript==
// @name         cw_login
// @namespace    cw_login
// @version      0.1
// @description  cw
// @author       Azure
// @match        https://sso.cloudwalk.com:8443/cas/login*
// @include      https://sso.cloudwalk.com:8443/cas/login*
// @include      https://gitlab-research.cloudwalk.work/users/sign_in
// @icon         https://www.google.com/s2/favicons?domain=sensetime.com
// @grant        none
// @require      http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/438777/cw_login.user.js
// @updateURL https://update.greasyfork.org/scripts/438777/cw_login.meta.js
// ==/UserScript==

// you need to implement the getInfo function

function login() {
    let web_host = window.location.host;
    let pwinfo = getInfo();
    let last_attempt = localStorage.getItem("cw_pw_info" + "LastAttempt"); // setItem
    if (!last_attempt) last_attempt = 0;
    let currenttime = (new Date()).getTime();
    if (currenttime - last_attempt < 10 * 1000) { // 防止密码错误时快速反复尝试导致被封号
        alert("too close attempt");
        return;
    }
    localStorage.setItem("cw_pw_info" + "LastAttempt", currenttime);
    if (web_host == "gitlab-research.cloudwalk.work") {
        $(".nav-item").click();
        if ($("#username")) $("#username").val(pwinfo[0]);
        if ($("#password")) {
            $("#password").val(pwinfo[1]);
            $("#new_ldap_user .btn-save").click();
        }
    } else if (web_host == "sso.cloudwalk.com:8443") {
        if ($("#username")) $("#username").focus().val(pwinfo[0]).trigger('change');;
        if ($("#password")) {
            $("#password").focus().val(pwinfo[1]).trigger('change');
            setTimeout(function () {
                $('#fm1 input[name=submit]').removeAttr('disabled').click();
                // $("input .btn-primary .btn-block").click(); // 不知为何，能找到目标，但是不能操作
            }, 500);
        }
    }else{
        alert(web_host);
    }
}

login();
// setTimeout(function () { login(); }, 1000);


function encrypt(str, pwd) {
    if (pwd == null || pwd.length <= 0) {
        //alert("Please enter a password with which to encrypt the message.");
        return null;
    }
    var prand = "";
    for (var i = 0; i < pwd.length; i++) {
        prand += pwd.charCodeAt(i).toString();
    }
    var sPos = Math.floor(prand.length / 5);
    var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
    var incr = Math.ceil(pwd.length / 2);
    var modu = Math.pow(2, 31) - 1;
    if (mult < 2) {
        //alert("Algorithm cannot find a suitable hash. Please choose a different password. \nPossible considerations are to choose a more complex or longer password.");
        return null;
    }
    var salt = Math.round(Math.random() * 1000000000) % 100000000;
    prand += salt;
    while (prand.length > 10) {
        prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
    }
    prand = (mult * prand + incr) % modu;
    var enc_chr = "";
    var enc_str = "";
    for (let i = 0; i < str.length; i++) {
        enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
        if (enc_chr < 16) {
            enc_str += "0" + enc_chr.toString(16);
        } else enc_str += enc_chr.toString(16);
        prand = (mult * prand + incr) % modu;
    }
    salt = salt.toString(16);
    while (salt.length < 8) salt = "0" + salt;
    enc_str += salt;
    return enc_str;
}

function decrypt(str, pwd) {
    if (str == null || str.length < 8) {
        //alert("A salt value could not be extracted from the encrypted message because it's length is too short. The message cannot be decrypted.");
        return;
    }
    if (pwd == null || pwd.length <= 0) {
        alert("Please enter a password with which to decrypt the message.");
        return;
    }
    var prand = "";
    for (var i = 0; i < pwd.length; i++) {
        prand += pwd.charCodeAt(i).toString();
    }
    var sPos = Math.floor(prand.length / 5);
    var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
    var incr = Math.round(pwd.length / 2);
    var modu = Math.pow(2, 31) - 1;
    var salt = parseInt(str.substring(str.length - 8, str.length), 16);
    str = str.substring(0, str.length - 8);
    prand += salt;
    while (prand.length > 10) {
        prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
    }
    prand = (mult * prand + incr) % modu;
    var enc_chr = "";
    var enc_str = "";
    for (let i = 0; i < str.length; i += 2) {
        enc_chr = parseInt(parseInt(str.substring(i, i + 2), 16) ^ Math.floor((prand / modu) * 255));
        enc_str += String.fromCharCode(enc_chr);
        prand = (mult * prand + incr) % modu;
    }
    return enc_str;
}