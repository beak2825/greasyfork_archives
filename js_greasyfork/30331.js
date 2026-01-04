// ==UserScript==
// @name         indigo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://book.goindigo.in/*
// @match        https://www.goindigo.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30331/indigo.user.js
// @updateURL https://update.greasyfork.org/scripts/30331/indigo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ori;
    var ori2;
    var des2;
    if (window.location.href.includes("https://www.goindigo.in")=== true){
        //alert('h');
        $(document).ready(function() {
            setTimeout(function() {
                $('#navUiMobile > ul.center.nav-hash > li:nth-child(6) > a:contains(Login)').click();
            }, 100);
            setTimeout(function() {
                $('#loginTab > ul > li:nth-child(2) > a').click();
            }, 1000);
        });
    }
    if (window.location.href.includes("https://www.goindigo.in/booking/flight-select.html")=== true){
        //alert('h');


    }
    function doc_keyDown(e) {

        if (window.location.href.includes('book') === true){
            if (e.altKey && e.keyCode == 76) {
                $('#navUiMobile > ul.center > li.menuBtn6 > a:contains(Log In)').click();

                setTimeout(function() {
                    $('#agentLogin_Submit').click();
                }, 1000);
            }
        }
        else{
            if (e.altKey && e.keyCode == 76) {
                setTimeout(function() {
                    $('#navUiMobile > ul.center.nav-hash > li:nth-child(6) > a:contains(Login)').click();
                }, 100);
                setTimeout(function() {
                    $('#loginTab > ul > li:nth-child(2) > a').click();
                }, 1000);

                setTimeout(function() {
                    $('#Agency > form > ul > li.submit_tab > button').click();
                }, 1000);

            }
        }
    }
    document.addEventListener('keydown', doc_keyDown , false);

    if (localStorage.script === "on" || window.location.href.includes("/track/") === true )

    {
        if (window.location.href.includes("/track/") === true )

        {
            var st = window.location.href;
            var str = st.split('/track/');
            ori = str[1].split(";");

            localStorage.setItem("way", "one");

            localStorage.setItem("adt", ori[2]);
            localStorage.setItem("chd", ori[3]);
            localStorage.setItem("inf", ori[4]);
            localStorage.setItem("dep", ori[5]);
            localStorage.setItem("login", "on");
            if (typeof ori[6] !== "undefined"){
                //alert(ori[6]);
                localStorage.setItem("way", "two");
                localStorage.setItem("arr", ori[6]);
            }
            if (ori[1].includes("222") === true){

                ori[1]=ori[1].replace("222","");
                localStorage.two="on";
                //ori2 = ori[0];
                //des2 = ori[1];
                //alert(localStorage.two);
                var checkExist = setInterval(function() {

                    if (localStorage.two==="off") {
                        setTimeout(function() {
                        localStorage.setItem("ori2", ori[0]);
                        localStorage.setItem("des2", ori[1]);
                        //alert("Set"+localStorage.des);
                         
                        localStorage.setItem("script", "on");
                        localStorage.setItem("set", "on");
                              }, 2000);
                        clearInterval(checkExist);
                    }
                }, 100);

            }
            else{
                localStorage.setItem("script", "on");
                localStorage.setItem("ori", ori[0]);
                localStorage.setItem("des", ori[1]);

                //alert(localStorage.des);
            }
        }
        if ((window.location.href.includes("SessionExpired#") === true || $('#navUiMobile > ul.center > li.menuBtn6 > a:contains(Log In)').length) && localStorage.login ==="on" ){

            //alert('h');
            if (window.location.href.includes('book') === true){
                //alert('hi');
                $('#navUiMobile > ul.center > li.menuBtn6 > a:contains(Log In)').click();
                /*
                var checkExist = setInterval(function() {
                    if ($('#txtMemberId').val().length !== 0) {
                        $('#agentLogin_Submit').click();
                        //alert($('#txtMemberId').val());
                        clearInterval(checkExist);
                    }
                }, 100);
                */


                $('#agentCorpLogin').click();

                // setTimeout(function() {

                //$('#agentLogin_Submit').click();

                //}, 4000);
                localStorage.setItem("login", "off");
            }

            //



        }
        else if (window.location.href.includes("222") === false) {

            $('#navUiMobile > ul > li.menuBtn1 > a').click();
            if (localStorage.way === "two"){
                $('#txtOriginStationRound').click();
                $('#RoundTripSearch > li.xs1.chooseCity.city-dropdown.from_city > div').find('a[value='+localStorage.ori+']').click();
                $('#RoundTripSearch > li.xs1.chooseCity.city-dropdown.to_city > div').find('a[value="'+localStorage.des+'"]').click();
                $('#indiGoRoundTripSearch_PassengerCounts_0__Count').find('option[value="'+localStorage.adt+'"]').attr("selected","selected");
                if (localStorage.chd !== 0){
                    $('#indiGoRoundTripSearch_PassengerCounts_1__Count').find('option[value="'+localStorage.chd+'"]').attr("selected","selected");
                }
                if (localStorage.inf !== 0){
                    $('#indiGoRoundTripSearch_InfantCount').find('option[value="'+localStorage.inf+'"]').attr("selected","selected");
                }
                $('#indiGoRoundTripSearch_DepartureDate').val( localStorage.dep);
                $('#indiGoRoundTripSearch_ReturnDate').val(localStorage.arr);
                // $('#indiGoRoundTripSearch_CurrencyCodeSelectBoxItText').attr("data-val","OMR");
                var checkExi = setInterval(function() {
                    if (localStorage.two==="on") {
                        
                        localStorage.two="off";
                        //alert(localStorage.two);
                           
                        clearInterval(checkExi);
                    }
                }, 100);
                $('#indiGoRoundTripSearch_Submit').click();

                //alert(des2);


            }
            else{
                $('#Oneway_').click();
                $('#oneWaySearchModal > div > div > div.modal-footer > div > a').click();

                $('#txtOriginStation').click();
                $('#OneWaySearch > li.xs1.chooseCity.city-dropdown.from_city').find('a[value="'+localStorage.ori+'"]').click();

                $('#OneWaySearch > li.xs1.chooseCity.city-dropdown.to_city').find('a[value="'+localStorage.des+'"]').click();


                $('#indiGoOneWaySearch_PassengerCounts_0__Count').find('option[value="'+localStorage.adt+'"]').attr("selected","selected");
                if (localStorage.chd !== 0){
                    $('#indiGoOneWaySearch_PassengerCounts_1__Count').find('option[value="'+localStorage.chd+'"]').attr("selected","selected");
                }
                if (localStorage.inf !== 0){
                    $('#indiGoOneWaySearch_InfantCount').find('option[value="'+localStorage.inf+'"]').attr("selected","selected");
                }


                $('#indiGoOneWaySearch_DepartureDate').val( localStorage.dep);
                var checkEx = setInterval(function() {
                    if (localStorage.two==="on") {
                         
                        localStorage.two="off";
                        //alert(localStorage.two);
                              
                        clearInterval(checkEx);
                    }
                }, 100);
                //alert(des2);
                $('#indiGoOneWaySearch_Submit').click();
            }

            localStorage.setItem("script", "off");


        }
        else if (window.location.href.includes("222") === true) {
            var checkExis = setInterval(function() {

                if (localStorage.set==="on") {



                    $('#navUiMobile > ul > li.menuBtn1 > a').click();
                    if (localStorage.way === "two"){
                        $('#txtOriginStationRound').click();
                        $('#RoundTripSearch > li.xs1.chooseCity.city-dropdown.from_city > div').find('a[value='+localStorage.ori2+']').click();
                        $('#RoundTripSearch > li.xs1.chooseCity.city-dropdown.to_city > div').find('a[value="'+localStorage.des2+'"]').click();
                        $('#indiGoRoundTripSearch_PassengerCounts_0__Count').find('option[value="'+localStorage.adt+'"]').attr("selected","selected");
                        if (localStorage.chd !== 0){
                            $('#indiGoRoundTripSearch_PassengerCounts_1__Count').find('option[value="'+localStorage.chd+'"]').attr("selected","selected");
                        }
                        if (localStorage.inf !== 0){
                            $('#indiGoRoundTripSearch_InfantCount').find('option[value="'+localStorage.inf+'"]').attr("selected","selected");
                        }
                        $('#indiGoRoundTripSearch_DepartureDate').val( localStorage.dep);
                        $('#indiGoRoundTripSearch_ReturnDate').val(localStorage.arr);
                        // $('#indiGoRoundTripSearch_CurrencyCodeSelectBoxItText').attr("data-val","OMR");


                        $('#indiGoRoundTripSearch_Submit').click();
                        //alert(localStorage.des);


                    }
                    else{
                        $('#Oneway_').click();
                        $('#oneWaySearchModal > div > div > div.modal-footer > div > a').click();

                        $('#txtOriginStation').click();
                        $('#OneWaySearch > li.xs1.chooseCity.city-dropdown.from_city').find('a[value="'+localStorage.ori2+'"]').click();

                        $('#OneWaySearch > li.xs1.chooseCity.city-dropdown.to_city').find('a[value="'+localStorage.des2+'"]').click();


                        $('#indiGoOneWaySearch_PassengerCounts_0__Count').find('option[value="'+localStorage.adt+'"]').attr("selected","selected");
                        if (localStorage.chd !== 0){
                            $('#indiGoOneWaySearch_PassengerCounts_1__Count').find('option[value="'+localStorage.chd+'"]').attr("selected","selected");
                        }
                        if (localStorage.inf !== 0){
                            $('#indiGoOneWaySearch_InfantCount').find('option[value="'+localStorage.inf+'"]').attr("selected","selected");
                        }


                        $('#indiGoOneWaySearch_DepartureDate').val( localStorage.dep);


                        $('#indiGoOneWaySearch_Submit').click();
                        //alert(localStorage.des);

                    }

                    localStorage.setItem("script", "off");
                    localStorage.set="off";
                    clearInterval(checkExis);
                }
            }, 100);

        }
    }



})();