// ==UserScript==
// @name         GEAS with HiCOS
// @namespace    http://tampermonkey.net/
// @version      2024012901
// @description  小幫手
// @author       周詳
// @match        https://geas.dgbas.gov.tw/*
// @match        https://geas.moda.gov.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.tw
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482549/GEAS%20with%20HiCOS.user.js
// @updateURL https://update.greasyfork.org/scripts/482549/GEAS%20with%20HiCOS.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var script = document.createElement("script");
    script.src = "https://fido.moi.gov.tw//pt/assets/ChtICToken.js";
    document.head.appendChild(script);
    var pkilogin = document.getElementsByClassName("pkilogin")[0];
    var newElementHTML = '<input type="button" id="hicos" value="HiCOS登入">';
    pkilogin.insertAdjacentHTML('afterend', newElementHTML);
    document.getElementById("hicos").addEventListener("click", () => {
        var cardnum = "",
            tbs = "",
            B64Signature = "";
        var pkcs1 = "";
        var pkcs7 = "";
        let pin = prompt("請輸入PIN碼", "");
        makeSignature(pin);

        function makeSignature(a) {
            tbs = batchsign2.random;
            getICToken().goodDay(SignDo)
        }

        function makerandomletter() {
            var a = "",
                b = new Uint32Array(1);
            window.crypto.getRandomValues(b);
            for (var c = 0; c < b.length; c++)
                a += b[c];
            return a
        }

        function CardNumMsg() {
            var l_oToken = getICToken();
            console.log(l_oToken.RetObj);
            if (l_oToken.RetObj.RCode == 0) {
                console.log(l_oToken.RetObj.RCode);
                cardnum = l_oToken.RetObj.CardID;
            } else {
                consoloe.log(l_oToken.RetObj.RMsg);
                //alert("簽章時發生錯誤，錯誤碼：" + l_oToken.RetObj.RCode+", 錯誤原因：" + l_oToken.RetObj.RMsg);
            }

            var returnCode = l_oToken.RetObj.RCode;
        }

        function SignDo() {
            var a = getICToken();
            if (0 == a.RetObj.RCode) {
                var b = btoa(tbs);
                //b = encodeURIComponent(b);
                a.getSmartCardID(CardNumMsg);
                a.sign(b, pin, "SHA1", SignRetMsg, "PKCS1");
            } else
                console.log(a.RetObj.RCode, a.RetObj.RMsg);
        }

        function SignRetMsg() {
            var a = getICToken();
            var l_oToken = getICToken();
            if (l_oToken.RetObj.RCode == 0) {
                B64Signature = l_oToken.RetObj.B64Signature;
                pkcs1 = B64Signature;
                console.log("pkcs1: " +pkcs1);
                var b = btoa(tbs);
                //b = encodeURIComponent(b);
                a.getSmartCardID(CardNumMsg);
                a.sign(b, pin, "SHA1", SignRetMsg2, "PKCS7");
            } else {
                console.log(l_oToken.RetObj.RMsg);
            }
        }

        function SignRetMsg2() {
              var a = getICToken();
            var l_oToken = getICToken();
            if (l_oToken.RetObj.RCode == 0) {
                B64Signature = l_oToken.RetObj.B64Signature;
                pkcs7 = B64Signature;
                console.log("pkcs7: " + pkcs7);
                const req = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    body: "action=checkLoginLock&f_id="
                };
                fetch('/iftop/ajax_server/ajax_login.server.php', req);

                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        fun_name: "va_verify_p7",
                        f_sysno: "EAS",
                        p7: pkcs7 + pkcs1
                    }).toString()
                };
                fetch('/iftop/ajax_server/ajax_pki.server.php', requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        console.log("data");
                        console.log(data);
                        if (data.flag) {
                            window.location = "/eas/EA13R01.php?f_menuname=%E5%B7%A5%E4%BD%9C%E5%84%80%E8%A1%A8%E6%9D%BF";
                        } else {
                            alert(data.msg);
                        }
                    });


            } else {
                console.log(l_oToken.RetObj.RMsg);
            }
        }

    });

})();