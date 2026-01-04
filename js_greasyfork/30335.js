// ==UserScript==
// @name         WEGO 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://om.wego.com/en/flights*
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/30335/WEGO.user.js
// @updateURL https://update.greasyfork.org/scripts/30335/WEGO.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.href.includes(";") === true){
        var st = window.location.href;
        var str = st.split('flights/');
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

        //alert('hell');
        window.open("https://om.wego.com/en/flights","_self");
        /*
$('#container > div.main.new-results > div.main__search-form.js-search-form-sticky > div > div.search-form--fl.js-search_form_flights.tween.has-green-bar > form > div.search-form__fields > div.search-form__departure.js-search_form_flights-departure.js-search_form_flights-autocomplete > input.js-autocomplete-code-hidden').val('"'+ori[0]+'"');
$('#container > div.main.new-results.has-no-results > div.main__search-form.js-search-form-sticky > div > div.search-form--fl.js-search_form_flights.tween.has-green-bar > form > div.search-form__fields > div.search-form__arrival.js-search_form_flights-arrival.js-search_form_flights-autocomplete > input.js-autocomplete-code-hidden').val('"'+ori[1]+'"');
$('#container > div.main > div.main__search-form.js-search-form-sticky > div > div.search-form--fl.js-search_form_flights.tween.has-green-bar > form > div.search-form__fields > div.search-form__dates.js-search_form_flights-dates > div.search-form__outbound.js-search_form_flights-outbound > input.js-datepickers-field-hidden').val( ori[5]);
//$('#container > div.main > div.main__search-form.js-search-form-sticky > div > div.search-form--fl.js-search_form_flights.tween.has-green-bar > form > div.search-form__fields > div.search-form__submit.js-search_form_flights-submit > button').click();
//$('#container > div.main > div.main__search-form.js-search-form-sticky > div > div.search-form--fl.js-search_form_flights.tween.has-green-bar > form > div.search-form__fields > div.search-form__submit.js-search_form_flights-submit > button').click();
    // Your code here...
    */
    }
    else {

        if (localStorage.script === "on"){
           $(document).ready(function(){

            $('body > div.search-form--fl-index.js-search_form_flights.tween > form > div.search-form__fields > div.search-form__departure.js-search_form_flights-departure.js-search_form_flights-autocomplete > input.js-autocomplete-code-hidden').val( localStorage.ori);

            $('body > div.search-form--fl-index.js-search_form_flights.tween > form > div.search-form__fields > div.search-form__arrival.js-search_form_flights-arrival.js-search_form_flights-autocomplete > input.js-autocomplete-code-hidden').val( localStorage.des);
            $('#dropdown-form-extras > ul > li.search-form__counter.js-search_form_flights-adults > input').val( localStorage.adt);
            $('#dropdown-form-extras > ul > li.search-form__counter.js-search_form_flights-children > input').val( localStorage.chd);
            $('#dropdown-form-extras > ul > li.search-form__counter.js-search_form_flights-infants > input').val( localStorage.inf);
            $('body > div.search-form--fl-index.js-search_form_flights.tween > form > div.search-form__fields > div.search-form__dates.js-search_form_flights-dates > div.search-form__outbound.js-search_form_flights-outbound > input.js-datepickers-field-hidden').val(localStorage.dep);
            
            if (localStorage.way === "two"){
                //alert('h');
                $('body > div.search-form--fl-index.js-search_form_flights.tween > form > div.search-form__fields > div.js-search_form_flights-toggle.search-form__trips > div > ul > li:nth-child(2)').click();
                $('body > div.search-form--fl-index.js-search_form_flights.tween > form > div.search-form__fields > div.search-form__dates.js-search_form_flights-dates > div.search-form__inbound.js-search_form_flights-inbound > input.js-datepickers-field-hidden').val(localStorage.arr);
            }
            else{
                $('body > div.search-form--fl-index.js-search_form_flights.tween > form > div.search-form__fields > div.js-search_form_flights-toggle.search-form__trips > div > ul > li:nth-child(1)').click();
            }
            localStorage.setItem("script", "off");
            $('body > div.search-form--fl-index.js-search_form_flights.tween > form > div.search-form__fields > div.search-form__submit.js-search_form_flights-submit > button').click();
         });
           } 
                             
    }
})();