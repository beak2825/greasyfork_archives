// ==UserScript==
// @name         teaserfast.ru - keep tab open
// @description  auto "watch ads" without popups
// @author       WXC
// @match        https://teaserfast.ru/*
// @match        https://dogepick.io/*
// @version      1.1
// @grant        none
// @require      https://code.jquery.com/jquery-latest.min.js
// @run-at document-idle
// @noframes
// @namespace Terminator.Scripts
// @downloadURL https://update.greasyfork.org/scripts/491259/teaserfastru%20-%20keep%20tab%20open.user.js
// @updateURL https://update.greasyfork.org/scripts/491259/teaserfastru%20-%20keep%20tab%20open.meta.js
// ==/UserScript==


// DO NOT USE SERVERS, PROXY, VPN !!! ... user regular connection
// DO NOT RUN ALL DAY! ... about 8-11h daily seems fine - otherwise they will BAN you!
// DO NO RUN IN MULTIPLE TABS! ... only one per account and ip

// If you got banned ... you can create new acc BUT use new ip for reg and use new Payeer wallet
// Dont forget, you can withdraw from 1 RUB


// START register here: https://teaserfast.ru/u/exik
// maybe you need Payeer wallet: https://payeer.com/?partner=286029
// thank you for support to all my referrals :)

// how to use? Just keep tab open ... dont forget start tab tomorrow

// please allow site notification for captcha, once every few hours
// if you see: {"error":true} ... you need to login (turn off this script)

// you can set your daily limits and paused hours few lines below


(function() {
    'use strict';
    var $ = window.jQuery;

    $(document).ready(function() {

        const max_earntoday = 0; // max RUB earn daily, 0 = unlimited
        const max_viewsteaser = 0; // low income ads, 0 = unlimited
        const max_clickpopup = 0; // high income ads, 0 = unlimited

        const paused_hours = [ 10, 14, 18 ]; // this hours (0-23) be paused ex. [10, 14, 18], but keep tab open


        // -----


        var start = false;
        var captcha = false;

        if( location.pathname == "/check-captcha/" ) {

            if( $(".alert_success").is(":visible") ) {
                location.href = "/extn/account/";
            }
            else {

                document.title = "CAPTCHA!";
                captcha = true;

                function notify() {
                    const notification = new Notification("Need to solve CAPTCHA!", {
                        image: "https://www.coded.cz/_public/captcha_notify.png"
                    });
                }

                setInterval( function() {
                    notify();
                }, ( 30 * 1000 ) );

                notify();

            }

        }
        else if( location.pathname == "/login/" ) {
            // wait for login
        }
        else if( location.pathname !== "/extn/account/" ) {
            location.href = "/extn/account/";
        }
        else if( location.hostname == "dogepick.io" ) { // this domain is open out of iframe, so return back
            location.href = "https://teaserfast.ru/extn/account/";
        }
        else {
            start = true;
        }






        // ===== START =====
        if( captcha == false ) {

            $("body").append(`<style> body { text-align: center; } </style>`);
            $("body").css("background-color","#00bcd4"); // idle


            var info = $("<div>", {
                src: "", id: "info", style: "font: bold 36px arial; margin: 30px 0px;"
            });

            $('body').append(info);
            $("#info").text("READY, keep this tab open");


            var h = new Date().getHours();

            if( !paused_hours.includes(h) ) {


                setTimeout( () => {

                    $.getJSON('https://teaserfast.ru/extn/account/', function(data) {

                        var earntoday = data.earntoday.replace(",", "."); // fck

                        if( max_earntoday > 0 && earntoday >= max_earntoday ) start = false;
                        if( max_viewsteaser > 0 && data.viewsteaser >= max_viewsteaser ) start = false;
                        if( max_clickpopup > 0 && data.clickpopup >= max_clickpopup ) start = false;



                        if( start != false ) {


                            var iframe = $("<iframe>", {
                                src: "", id: "ifr", style: "width: 60%; height: 300px; display: block; margin: 50px auto;",
                                frameborder: 1, scrolling: "yes"
                            });

                            $('body').append(iframe);


                            if (earntoday > 0) {

                                function fetchRatesAndUpdateLocalStorage() {
                                    var apiURL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,rub';
                                    $.getJSON(apiURL, function(data) {
                                        var rates = {
                                            usd: data.bitcoin.usd,
                                            rub: data.bitcoin.rub,
                                            hour: new Date().getHours()
                                        };
                                        localStorage.setItem('rates', JSON.stringify(rates));
                                        calculateAndDisplay(rates);
                                    });
                                }

                                function calculateAndDisplay(rates) {
                                    var rubToBtc = earntoday / rates.rub;
                                    var rubToUsd = earntoday * (rates.usd / rates.rub);

                                    var rubToSatoshi = rubToBtc * 100000000; // btc


                                    var result = earntoday + ' RUB ~ ' + rubToUsd.toFixed(3) + ' USD ~ '+ rubToSatoshi.toFixed(0) + ' Sats'; // earned today rates


                                    $('#info').html(result);
                                    console.log( result );
                                }

                                function getRates() {
                                    var rates = JSON.parse(localStorage.getItem('rates'));
                                    var currentHour = new Date().getHours();

                                    if (rates && rates.hour === currentHour) {
                                        calculateAndDisplay(rates);
                                    } else {
                                        fetchRatesAndUpdateLocalStorage();
                                    }
                                }

                                getRates();

                            }




                            function generateRandomNumber(min, max) {
                                return Math.floor(Math.random() * (max - min + 1)) + min;
                            }



                            function getAdvert( tftype ) { // check ads

                                var time = (new Date()).valueOf();

                                var params = {
                                    extension: 1,
                                    tftype: tftype,
                                    version: 17,
                                    get: 'submit'
                                };

                                $.ajax({
                                    type: "POST",
                                    url: url_get_advert,
                                    data: $.param(params),
                                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                                    success: function(response) {

                                        var res = JSON.parse(response);

                                        if( res.error ) { // err
                                            console.log( "Waiting, its ok ..."+ JSON.stringify(res, null, 2));
                                        }
                                        else {

                                            $("body").css("background-color","#ffc107"); // working

                                            if (res.teaser) {

                                                clearInterval( check );
                                                console.log("TEASER");
                                                teaser_parser( res );

                                            }
                                            else if (res.popup) {

                                                clearInterval( check );
                                                console.log("POPUP");
                                                popup_parser( res );

                                            }
                                            else if (res.captcha) {

                                                clearInterval( check );
                                                location.href = "/check-captcha/#NotifyRe8";

                                            }
                                            else {
                                                // ...
                                            }

                                        }

                                    },
                                    error: function(xhr, status, error) {
                                        console.log(JSON.stringify(error, null, 2));
                                    }

                                });

                            }



                            function popup_parser( res ) {

                                console.log(JSON.stringify(res, null, 2));
                                var token = "";
                                var iframe_url = "";
                                var sec = 60;

                                if( res.url.indexOf("popup-no") > -1 ) { // forwarding popup

                                    token = res.url.replace( "https://teaserfast.ru/extn/popup-no/?hsa=", "" ) ;
                                    console.log( token );

                                    iframe_url = res.url;
                                    $("#ifr").attr("src", iframe_url );

                                    popup_reward( token, sec );

                                }
                                else { // classic popup

                                    token = res.url.replace( "https://teaserfast.ru/extn/popup-timer/?tzpha=", "" ) ;
                                    console.log( token );

                                    iframe_url = res.url;
                                    $("#ifr").attr("src", iframe_url );

                                    var parts = res.message.split("сек."); // "message": "Смотреть сайт в течение 15 сек. и заработать 0.045 руб.?\n\n(Вы можете отключить данный вид рекламы в личном кабинете, в разделе настройки показа)"
                                    if (parts.length > 1) {

                                        var numberParts = parts[0].trim().split(" ");
                                        sec = numberParts[numberParts.length - 1]; // parse sec

                                        popup_reward( token, sec );

                                    }
                                    else {

                                        popup_reward( token, sec );
                                        //alert("NO SECS - USE 60s!")

                                    }

                                }

                            }



                            function popup_reward( token, sec ) {

                                var rand = generateRandomNumber(5, 10); // sec
                                var counter = parseInt(sec) + parseInt(rand);

                                var scriptElement = document.createElement("script");
                                scriptElement.id = "wait_worker";
                                scriptElement.text = 'var i = ' + counter + '; var timer = setInterval(function() { if(i > 0) { i--; postMessage(i); } else { clearInterval(timer); } }, 1000);';
                                document.body.insertAdjacentElement("afterend", scriptElement);

                                var wait_worker = null, URL = window.URL || (window.webkitURL);
                                window.URL = URL;
                                var workerData = new Blob([document.getElementById('wait_worker').textContent], { type: "text/javascript" });

                                function init_wait() {
                                    if (typeof(Worker) === "undefined") {
                                        alert('No webworker supported');
                                        return false;
                                    }

                                    wait_worker = new Worker(window.URL.createObjectURL(workerData));
                                    wait_worker.onmessage = function(e) {
                                        if (e.data === 0) {

                                            clearInterval(timer);

                                            var params = {
                                                hash: token
                                            };
                                            console.log("POST: " + url_pcheck);
                                            console.log("DATA: " + $.param(params));
                                            $.ajax({
                                                type: "POST",
                                                url: url_pcheck,
                                                data: $.param(params),
                                                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                                                success: function(response) {
                                                    if (response.error) { // err
                                                        console.log("REWARD - ERR: " + JSON.stringify(response, null, 2));
                                                        //alert("REWARD-ERR-VIEWED?");
                                                    }
                                                    else { // ok
                                                        $("body").css("background-color", "#4caf50"); // ok
                                                        var res = JSON.parse(response);
                                                        console.log(JSON.stringify(res, null, 2));
                                                        document.title = "EARN +" + res.earn;
                                                        $("#info").text( document.title );
                                                        //alert("REWARD-OK?");
                                                        setTimeout(function() {
                                                            location.reload();
                                                        }, (3 * 1000));
                                                    }
                                                },
                                                error: function(xhr, status, error) {
                                                    console.log("REWARD-ERR: " + JSON.stringify(error, null, 2));
                                                }
                                            });
                                        }
                                        else {
                                            document.title = "WAIT " + e.data + "s";
                                            $("#info").text( document.title );
                                        }
                                    };
                                }

                                init_wait();

                            }



                            function teaser_parser( res ) {

                                console.log(JSON.stringify(res, null, 2));

                                var hash = res.hash;
                                var sec = res.timer; // sec

                                teaser_reward( hash, sec );

                            }



                            function teaser_reward( hash, sec ) {

                                var rand = generateRandomNumber(5, 10); // sec
                                var counter = parseInt(sec) + parseInt(rand);

                                var scriptElement = document.createElement("script");
                                scriptElement.id = "wait_worker";
                                scriptElement.text = 'var i = ' + counter + '; var timer = setInterval(function() { if(i > 0) { i--; postMessage(i); } else { clearInterval(timer); } }, 1000);';
                                document.body.insertAdjacentElement("afterend", scriptElement);

                                var wait_worker = null, URL = window.URL || (window.webkitURL);
                                window.URL = URL;
                                var workerData = new Blob([document.getElementById('wait_worker').textContent], { type: "text/javascript" });

                                function init_wait() {
                                    if (typeof(Worker) === "undefined") {
                                        alert('No webworker supported');
                                        return false;
                                    }

                                    wait_worker = new Worker(window.URL.createObjectURL(workerData));
                                    wait_worker.onmessage = function(e) {
                                        if (e.data === 0) {

                                            clearInterval(timer);

                                            var params = {
                                                hash: hash
                                            };

                                            console.log("POST: " + url_teaser_check);
                                            console.log("DATA: " + $.param(params));
                                            $.ajax({
                                                type: "POST",
                                                url: url_teaser_check,
                                                data: $.param(params),
                                                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                                                success: function(response) {

                                                    if( response.error ) { // err

                                                        console.log("REWARD - ERR: "+ JSON.stringify(response, null, 2));
                                                        //alert("REWARD-ERR-VIEWED?");

                                                    }
                                                    else { // ok

                                                        $("body").css("background-color","#4caf50"); // ok

                                                        var res = JSON.parse(response);
                                                        console.log(JSON.stringify(res, null, 2));

                                                        document.title = "EARN +"+ res.earn;
                                                        $("#info").text( document.title );
                                                        //alert("REWARD-OK?");

                                                        setTimeout( function() {
                                                            location.reload();
                                                        }, ( 3 * 1000 ) );

                                                    }
                                                },
                                                error: function(xhr, status, error) {
                                                    console.log( "REWARD-ERR: "+ JSON.stringify(error, null, 2));
                                                }

                                            });

                                        }
                                        else {
                                            document.title = "WAIT " + e.data + "s";
                                        }
                                    };
                                }

                                init_wait();

                            }



                            var domain = "teaserfast.ru";
                            var url_get_advert = "https://"+domain+"/extn/get/";
                            var url_pcheck = "https://"+domain+"/extn/popup-check/";
                            var url_teaser_check = "https://"+domain+"/extn/status/";



                            var type = 1; // 0 = ad,  1 = popup
                            if( generateRandomNumber(1, 2) == 1 ) type = 0;

                            var check = setInterval( function() {

                                getAdvert( type );
                                console.log( "CHECK getAdvert ["+ type +"]" );

                            }, ( generateRandomNumber(30, 45) * 1000 ) );

                            getAdvert( type );

                        }
                        else {

                            $("body").css("background-color","#f44336"); // stop
                            $("#info").text( "MY LIMIT REACHED!" );
                            //alert("MY LIMIT REACHED!");

                        }


                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        console.error('Data error:', textStatus, errorThrown);
                    });

                }, ( 3* 1000 ) );


            }
            else {

                $("#info").text("MY PAUSED HOUR");
                $("body").css("background-color","#607d8b"); // paused

                function hour_wait_worker() {
                    if (typeof(Worker) === "undefined") {
                        alert('No webworker supported');
                        return false;
                    }

                    var now = new Date();
                    var secondsUntilNextHour = (60 - now.getMinutes()) * 60 - now.getSeconds() +1;

                    var scriptElement = document.createElement("script");
                    scriptElement.id = "hour_wait_worker";
                    scriptElement.text = 'var i = ' + secondsUntilNextHour + '; var timer = setInterval(function() { if(i > 0) { i--; postMessage(i); } else { clearInterval(timer); } }, 1000);';
                    document.body.insertAdjacentElement("afterend", scriptElement);

                    var hour_wait_worker = null, URL = window.URL || (window.webkitURL);
                    window.URL = URL;
                    var workerData = new Blob([document.getElementById('hour_wait_worker').textContent], { type: "text/javascript" });


                    hour_wait_worker = new Worker(window.URL.createObjectURL(workerData));
                    hour_wait_worker.onmessage = function(e) {
                        if (e.data === 0 || e.data % 300 === 0) {
                            clearInterval(timer);
                            location.reload();
                        }
                        else {
                            document.title = "PAUSED " + e.data + "s";
                            $("#info").text( "MY PAUSED HOUR - "+ e.data +"s" );
                        }
                    };
                }

                hour_wait_worker();

            }

        }




        setTimeout( () => { // global reload
            console.log( "global reload" );
            location.reload();
        }, ( 10 * 60 * 1000 ) ); // 10m

    });

})();