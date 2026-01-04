// ==UserScript==
// @name         [AoR] Eeasy OTP 
// @namespace    tuxuuman:aor:easyotp
// @version      0.2.1
// @description  Быстрый ввод OTP
// @author       You
// @match        *://game.aor-game.ru/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      aor-game.ru
// @downloadURL https://update.greasyfork.org/scripts/372470/%5BAoR%5D%20Eeasy%20OTP.user.js
// @updateURL https://update.greasyfork.org/scripts/372470/%5BAoR%5D%20Eeasy%20OTP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getOtp(secret, cb) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://aor-game.ru/get_otp_key",
            data: `secret=${secret}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', "Cookie": unsafeWindow.document.cookie },
            onload: function(response) {
                let m = response.responseText.match(/Ваш код: (\d+)/);
                if (m) {
                    let [, otp] = m;
                    cb(null, otp);
                } else {
                    cb(new Error("Не удалось получить OTP"), response.responseText);
                }
            }, onerror: function(err) {
                cb(err);
            }
        });
    }
    
    let oldSendToLogin = unsafeWindow.SendToLogin;
    unsafeWindow.SendToLogin = function (msg) {
        if (/;/.test(msg.login)) {
            let [login, password, secret] = msg.login.split(";");
            msg.login = login;
            msg.password = password;
            msg.otp = secret;
        } 
        
        let  { login, password, otp:secret } = msg;
        
        console.log("login", msg);
        
        getOtp(secret, (err, otp) => {
            if (err) {
                console.error(err);
                alert(err.message);
            } else {
                oldSendToLogin({login, password, otp});
            }
        });
    }

    // Your code here...
})();