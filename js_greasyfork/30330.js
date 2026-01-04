// ==UserScript==
// @name         shaheen
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://eticket.shaheenair.com/index.php
// @match        https://eticket.shaheenair.com/s/
// @match        https://eticket.shaheenair.com/track*
// @match        https://eticket.shaheenair.com/s/index.php
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/30330/shaheen.user.js
// @updateURL https://update.greasyfork.org/scripts/30330/shaheen.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.href.includes("https://eticket.shaheenair.com/index.php") === true){
        if (localStorage.script === "on"){
            var checkExist = setInterval(function() {
                if ($('body > table:nth-child(2) > tbody > tr:nth-child(1) > td:nth-child(1) > a > img', window.parent.frames[2].document).length) {
                    $('body > table:nth-child(2) > tbody > tr:nth-child(1) > td:nth-child(1) > a > img', window.parent.frames[2].document).click();
                    clearInterval(checkExist);
                }
            }, 100);
        }
    }
    else if (window.location.href.includes("https://eticket.shaheenair.com/track") === true){
        if (window.location.href.includes(";") === true){
            var st = window.location.href;
            var str = st.split('track');
            var ori = str[1].split(";");
            localStorage.setItem("script", "on");
            localStorage.setItem("way", "one");


            localStorage.setItem("adt", ori[2]);
            localStorage.setItem("chd", ori[3]);
            localStorage.setItem("inf", ori[4]);
            var dep= ori[5].split("-");
            
            localStorage.setItem("dep", dep[2]+"-"+dep[1]+"-"+dep[0]);
            if (typeof ori[6] !== "undefined"){
                //alert(ori[6]);
                localStorage.setItem("way", "two");
                var arr= ori[6].split("-");
                localStorage.setItem("arr", arr[2]+"-"+arr[1]+"-"+arr[0]);
            }
            if (ori[1].includes("2") === true){
                localStorage.setItem("two", "on");
                //alert(localStorage.two);
                ori[1]=ori[1].replace("2","");
                var checkExis = setInterval(function() {
                    if (localStorage.two==="off") {
                        localStorage.setItem("script", "on");
                        localStorage.setItem("ori", ori[0]);
                        localStorage.setItem("des", ori[1]);
                        window.open("https://eticket.shaheenair.com/s/","_self");
                        clearInterval(checkExis);
                    }
                }, 100);

            }
            else{
                localStorage.setItem("ori", ori[0]);
                localStorage.setItem("des", ori[1]);

                window.open("https://eticket.shaheenair.com/s/","_self");
            }
            //alert('hell');
            //window.open("https://eticket.shaheenair.com/","_self");

            /*
$('#container > div.main.new-results > div.main__search-form.js-search-form-sticky > div > div.search-form--fl.js-search_form_flights.tween.has-green-bar > form > div.search-form__fields > div.search-form__departure.js-search_form_flights-departure.js-search_form_flights-autocomplete > input.js-autocomplete-code-hidden').val('"'+ori[0]+'"');
$('#container > div.main.new-results.has-no-results > div.main__search-form.js-search-form-sticky > div > div.search-form--fl.js-search_form_flights.tween.has-green-bar > form > div.search-form__fields > div.search-form__arrival.js-search_form_flights-arrival.js-search_form_flights-autocomplete > input.js-autocomplete-code-hidden').val('"'+ori[1]+'"');
$('#container > div.main > div.main__search-form.js-search-form-sticky > div > div.search-form--fl.js-search_form_flights.tween.has-green-bar > form > div.search-form__fields > div.search-form__dates.js-search_form_flights-dates > div.search-form__outbound.js-search_form_flights-outbound > input.js-datepickers-field-hidden').val( ori[5]);
//$('#container > div.main > div.main__search-form.js-search-form-sticky > div > div.search-form--fl.js-search_form_flights.tween.has-green-bar > form > div.search-form__fields > div.search-form__submit.js-search_form_flights-submit > button').click();
//$('#container > div.main > div.main__search-form.js-search-form-sticky > div > div.search-form--fl.js-search_form_flights.tween.has-green-bar > form > div.search-form__fields > div.search-form__submit.js-search_form_flights-submit > button').click();
    // Your code here...
    */
        }
    }
    else if (window.location.href.includes("https://eticket.shaheenair.com/s/index.php") === true){
        $(document).ready(function(){

            if (localStorage.check === "on"){
                var checkExist = setInterval(function() {
                    if ($('#submit-button > input.btn.gradient').length) {
                        setTimeout(function() {
                            if (localStorage.way === "one"){
                                $('#dest_1113').find('option:contains("'+localStorage.des+'")').attr("selected","");
                            }
                            else{
                                $('#dest_1112').find('option:contains("'+localStorage.des+'")').attr("selected","");
                            }
                            localStorage.check = "off";
                            //alert(localStorage.des);
                            localStorage.two="off";
                            $('#submit-button > input.btn.gradient').click();
                        }, 500);
                        clearInterval(checkExist);
                    }
                }, 100);

                //alert('done');

            }
        });

    }
    else if (window.location.href.includes("https://eticket.shaheenair.com/s") === true){

        if (localStorage.script === "on"){
            if ($('#submit-button > input.btn.gradient').length) {
                $('table > tbody > tr:nth-child(2) > td:nth-child(2) > div > div.input-row-field').find('option:contains("'+localStorage.des+'")').attr("selected","");
                $('table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div.input-row-field').find('option:contains("'+localStorage.ori+'")').attr("selected","");

                $('#box-two-3 > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div.input-row-field').val( localStorage.adt);
                $('#box-two-3 > table > tbody > tr:nth-child(2) > td:nth-child(2) > div > div.input-row-field').val( localStorage.chd);
                $('#box-two-3 > table > tbody > tr:nth-child(3) > td:nth-child(2) > div > div.input-row-field').val( localStorage.inf);

                $('#dpdate').val( localStorage.dep);
                if (localStorage.way === "two"){
                    //alert('h');
                    try {
                        $('#button2').click();
                    }
                    catch(err) {
                    }
                    $('#rdpdate').val( localStorage.arr);
                }
                else{
                    try {
                        $('#button1').click();
                    }
                    catch(err) {
                    }
                }
                localStorage.setItem("script", "off");
                //alert('off');
                localStorage.setItem("check", "on");


                $('#submit-button > input.btn.gradient').click();
                // alert('me');

            }
        }
    }


})();