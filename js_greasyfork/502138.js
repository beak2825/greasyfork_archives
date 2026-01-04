// ==UserScript==
// @name         SUPREME7 Emag CloudFlare Turnstile Solver
// @namespace    Supreme7
// @version      0.6
// @description  Solve Cloudflare turnstile captcha on emag.hu
// @author       SUPREME7
// @include      *emag.hu*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=emag.hu
// @grant        GM_xmlhttpRequest
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/502138/SUPREME7%20Emag%20CloudFlare%20Turnstile%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/502138/SUPREME7%20Emag%20CloudFlare%20Turnstile%20Solver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var dataArray = {};


    // S7 CF turnstile-solver init
    $('body').prepend(`<div id="recaptcha-solver" style="z-index: 9999;  opacity: 0.8; background: #000; width: 100%; text-align: center; color: #fff; padding: 10px; padding-top: 30px;">&#128992;<span style="font-weight: bold; color: #d54b0e;">SUPREME7</span> EMAG <span style="font-weight: bold; color: red;">CLOUDFLARE</span> TURNSTILE SOLVER</div>`);


    // Csak akkor fusson, ha túl sok lekérés van az URL-en
    if($('#masthead').length){

        $("#recaptcha-solver").append('<p style="color: orange"> --- Nincs szükség beavatkozásra --- </p>');

        // Ha nincs szükség beavatkozásra
        // X idő múlva ablak bezárása
        setTimeout(() => {
            window.close();
        }, 5000)

    }else{

        // Indítás


        // 2captcha adatok
        dataArray["key"] = "3dd439294edf9d9fcacc48e8e2fcff64"; // 2captcha.com API KEY
        dataArray["sitekey"] = '0x4AAAAAAARA5SOE3u-GQTp_'; 
        dataArray["pageurl"] = $(location).attr('href'); 
        dataArray["method"] = "turnstile";
        dataArray["json"] = true


        setTimeout(() => {

            // Adatok elküldése a 2captcha api-nak
            sendCaptcha(dataArray).then((result) =>{


                result = JSON.parse(result)


                if(result.hasOwnProperty("status") && result.status == "1"){


                    var requestId = result.request;

                    $("#recaptcha-solver").append('<p style="color: orange"> - CAPTCHA ELKÜLDVE! - </p>');
                    $("#recaptcha-solver").append('<p id="api-waiting" style="color: green"> - Várakozás ...</p>');


                    var count = 0;
                    const reqCheck = setInterval((interval) => {

                        count++;

                        $("#api-waiting").html("REQ Ellenőrzés "+ count +" ...")


                        var reqCheckData = {};
                        reqCheckData["key"] = dataArray.key;
                        reqCheckData["action"] = "get";
                        reqCheckData["id"] = requestId;
                        reqCheckData["json"] = true;

                        reqCheckFunc(reqCheckData).then((result) => {

                            var reqCheckResult = JSON.parse(result);

                            if(reqCheckResult.hasOwnProperty("status") && reqCheckResult.status == "1"){


                                clearInterval(reqCheck);



                                $("#api-waiting").html(" &#128994;  SIKERES CAPTCHA MEGOLDÁS ")
                                $("#api-waiting").append('<p id="api-waiting" style="color: green"> -- CLOUDFLARE FORM kitöltése - submit -- </p>');



                                pushNotification({title: "Emag CF Turnstile Megoldva!", message: "Emag CF Turnstile - Sikeresen Megoldva!", priority: "1", sound: "siren_1"});
                                sendLog({log_category: 'notification', log_type: "Emag CF Turnstile Megoldva!", log_msg: "Emag CF Turnstile - Sikeresen Megoldva!"});

                                $("input[name='cf-turnstile-response']").val(reqCheckResult.request);
                                $("input[name='g-recaptcha-response']").val(reqCheckResult.request);


                                setTimeout(function() {
                                    $('form').submit();
                                }, 500);



                            }

                        });


                        if(count >= 20){

                            clearInterval(reqCheck);

                            $("#api-waiting").append('<p id="api-waiting" style="color: red"> -- REQ Ellenőrzés - Leállítva! Nem jött sikeres megoldás! -- </p>');
                            sendLog({log_category: 'notification', log_type: "Emag CF Turnstile HIBA!", log_msg: "<span style='color: red;'>Emag CF Turnstile - REQ Ellenőrzés - Leállítva! Nem jött sikeres megoldás! --</span>"});


                        }

                    }, 5000);





                }else{

                    console.log("VÁRATLAN HIBA TÖRTÉNT");
                    sendLog({log_category: 'notification', log_type: "Emag CF Turnstile HIBA!", log_msg: "<span style='color: red;'>Emag CF Turnstile - VÁRATLAN HIBA TÖRTÉNT! --</span>"});


                }

            });

        }, 2000)

    }

    //////// FUNKCIÓK


    async function sendCaptcha(data){

        return new Promise((resolve, reject) => {


            GM_xmlhttpRequest({
                method: 'POST',
                url: 'http://2captcha.com/in.php?',
                data: $.param(data),
                headers:    {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload: function(response) {
                    console.log(response.responseText);
                    console.log(data)
                    resolve(response.responseText);
                },
                onerror: function(response) {
                    reject("Váratlan hiba történt!");
                }
            });


        });
    }


    async function reqCheckFunc(data){

        return new Promise((resolve, reject) => {


            GM_xmlhttpRequest({
                method: 'POST',
                url: 'http://2captcha.com/res.php?',
                data: $.param(data),
                headers:    {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload: function(response) {
                    console.log(response.responseText);
                    console.log(data)
                    resolve(response.responseText);
                },
                onerror: function(response) {
                    reject("Váratlan hiba történt!");
                }
            });


        });
    }


   function pushNotification(data){

        var params = $.param(data);

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://bb.supreme7.eu/api/push/send?' + params,
            headers:    {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
                console.log(response.responseText);

            },
            onerror: function(response) {
               console.log('Váratlan hiba történt');
            }
        });


    }

     function sendLog(data){

        var params = $.param(data);

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://bb.supreme7.eu/api/log/insertlog?' + params,
            headers:    {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
                console.log(response.responseText);

            },
            onerror: function(response) {
               console.log('Váratlan hiba történt');
            }
        });


    }

})();