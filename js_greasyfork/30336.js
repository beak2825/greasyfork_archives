// ==UserScript==
// @name         us bangla redirect
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://apac.ttinteractive.com/newUI/index.asp*
// @match        https://apac.ttinteractive.com/library/include/html/error/500-100.html?aspxerrorpath=/Zenith/BackOffice/USBangla/en-GB/BookingEngine/Index
// @match        https://apac.ttinteractive.com/Zenith/BackOffice/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/30336/us%20bangla%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/30336/us%20bangla%20redirect.meta.js
// ==/UserScript==

(function() {


    if (window.location.href.includes("https://apac.ttinteractive.com/library/include/html/error/500-100.html?aspxerrorpath=/Zenith/BackOffice/USBangla/en-GB/BookingEngine/Index") === true){
        if (localStorage.script === "on"){
            localStorage.setItem("login", "on");
            window.open("https://apac.ttinteractive.com/otds/index.asp","_self");

        }
    }

    else if (window.location.href.includes("https://apac.ttinteractive.com/Zenith/BackOffice/") === true){

        if (localStorage.script === "on"){
            if (localStorage.way === "two"){
                //alert('h');
                $('#SearchCriteria > div.loaded > div > div:nth-child(1) > div > div:nth-child(2) > button').click();

            }

            var month = [];
            month[01] = "Jan";
            month[02] = "Feb";
            month[03] = "Mar";
            month[04] = "Apr";
            month[05] = "May";
            month[06] = "Jun";
            month[07] = "Jul";
            month[08] = "Aug";
            month[09] = "Sep";
            month[10] = "Oct";
            month[11] = "Nov";
            month[12] = "Dec";

            $('#SearchCriteria > div.loaded > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div > ul').find('a:contains("'+localStorage.ori+'")').click();
            $('#SearchCriteria > div.loaded > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div > ul').find('a:contains("'+localStorage.des+'")').click();

            for (i = 1; i < localStorage.adt; i++) {
                $('#SearchCriteria > div.loaded > div > div:nth-child(7) > div:nth-child(1) > div:nth-child(2) > div > div > span:nth-child(3) > button').click();
            }
            for (i = 0; i < localStorage.chd; i++) {
                $('#SearchCriteria > div.loaded > div > div:nth-child(7) > div:nth-child(2) > div:nth-child(2) > div > div > span:nth-child(3) > button').click();
            }
            for (i = 0; i < localStorage.inf; i++) {
                $('#SearchCriteria > div.loaded > div > div:nth-child(7) > div:nth-child(3) > div:nth-child(2) > div > div > span:nth-child(3) > button').click();
            }
            var arrsplt = localStorage.arr.split("-");
            var depsplt = localStorage.dep.split("-");
            if (parseInt(depsplt[2]) < 10){
                depsplt[2] = depsplt[2].replace("0","");         
            }
            if (parseInt(arrsplt[2]) < 10){          
                arrsplt[2] = arrsplt[2].replace("0","");
            }

            setTimeout(function() {
                if (localStorage.way === "two"){
                    //alert('h');

                    $('#DateTimePicker1 > div > div.datepicker-years > table > tbody > tr > td').find('span:contains("'+arrsplt[0]+'")').click();
                    $('#DateTimePicker1 > div > div.datepicker-months > table > tbody > tr > td').find('span:contains("'+month[parseInt(arrsplt[1])]+'")').click();
                    $('#DateTimePicker1 > div > div.datepicker-days > table > tbody').find('td.day:contains("'+arrsplt[2]+'")').click();


                }

                $('#DateTimePicker0 > div > div.datepicker-years > table > tbody > tr > td').find('span:contains("'+depsplt[0]+'")').click();
                $('#DateTimePicker0 > div > div.datepicker-months > table > tbody > tr > td:nth-child(1)').find('span:contains("'+month[parseInt(depsplt[1])]+'")').click();
                $('#DateTimePicker0 > div > div.datepicker-days > table > tbody').find('td.day:contains("'+depsplt[2]+'")').click();

                $('#SearchCriteria > div.loaded > div > div:nth-child(13) > div:nth-child(2) > button').click();


            }, 100);
            localStorage.setItem("script", "off");
            //alert('off');
            for (i = 0; i < 3; i++) {
                $('#SearchCriteria > div.loaded > div > div:nth-child(5) > div > div:nth-child(2) > div > div > span:nth-child(3) > button').click();
            }

            //alert('run');
        }

    }
    else if ((window.location.href.includes(";") === true || localStorage.script === "on") && window.location.href.includes("Zenith") !== true){

        if (window.location.href.includes(";") === true) {    
            var st = window.location.href;
            var str = st.split('index.asp/');
            var ori = str[1].split(";");
            localStorage.setItem("script", "on");
            localStorage.setItem("way", "one");
            localStorage.setItem("ori", ori[0]);
            localStorage.setItem("des", ori[1]);
            localStorage.setItem("adt", ori[2]);
            localStorage.setItem("chd", ori[3]);
            localStorage.setItem("inf", ori[4]);
            localStorage.setItem("dep", ori[5]);
            if (typeof ori[6] !== "undefined"){
                //alert(ori[6]);
                localStorage.setItem("way", "two");
                localStorage.setItem("arr", ori[6]);
            }
        }
        //alert('hell');
        if  (localStorage.script === "on"){   
            if (document.querySelector("#dashFrame")) {
                setTimeout(function() {
                    window.open("https://apac.ttinteractive.com/Zenith/BackOffice//USBangla/en-GB/BookingEngine/Index?CustomerId=10387430","_self");
                    //alert('h');
                }, 100);
            }else{
                window.open("https://apac.ttinteractive.com/Zenith/BackOffice//USBangla/en-GB/BookingEngine/Index?CustomerId=10387430","_self");
            }
        }
        //window.open("https://apac.ttinteractive.com/otds/index.asp","_self");
        /*
$('#container > div.main.new-results > div.main__search-form.js-search-form-sticky > div > div.search-form--fl.js-search_form_flights.tween.has-green-bar > form > div.search-form__fields > div.search-form__departure.js-search_form_flights-departure.js-search_form_flights-autocomplete > input.js-autocomplete-code-hidden').val('"'+ori[0]+'"');
$('#container > div.main.new-results.has-no-results > div.main__search-form.js-search-form-sticky > div > div.search-form--fl.js-search_form_flights.tween.has-green-bar > form > div.search-form__fields > div.search-form__arrival.js-search_form_flights-arrival.js-search_form_flights-autocomplete > input.js-autocomplete-code-hidden').val('"'+ori[1]+'"');
$('#container > div.main > div.main__search-form.js-search-form-sticky > div > div.search-form--fl.js-search_form_flights.tween.has-green-bar > form > div.search-form__fields > div.search-form__dates.js-search_form_flights-dates > div.search-form__outbound.js-search_form_flights-outbound > input.js-datepickers-field-hidden').val( ori[5]);
//$('#container > div.main > div.main__search-form.js-search-form-sticky > div > div.search-form--fl.js-search_form_flights.tween.has-green-bar > form > div.search-form__fields > div.search-form__submit.js-search_form_flights-submit > button').click();
//$('#container > div.main > div.main__search-form.js-search-form-sticky > div > div.search-form--fl.js-search_form_flights.tween.has-green-bar > form > div.search-form__fields > div.search-form__submit.js-search_form_flights-submit > button').click();
    // Your code here...
    */
    }
})();