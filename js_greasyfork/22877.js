// ==UserScript==
// @name         Szybsza wyszukiwarka
// @namespace    http://www.wykop.pl/ludzie/aso824
// @supportURL   http://www.wykop.pl/ludzie/aso824
// @version      1.0
// @description  Wpisanie @nick lub #tag w wyszukiwarce przenosi od razu do celu
// @author       aso824

// @include      http://wykop.pl/*
// @include      http://*.wykop.pl/*
// @include      https://*.wykop.pl/*
// @include      https://wykop.pl/*

// @exclude      http://wykop.pl/wyszukiwarka/*
// @exclude      http://*.wykop.pl/wyszukiwarka/*
// @exclude      https://wykop.pl/wyszukiwarka/*
// @exclude      https://*.wykop.pl/wyszukiwarka/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22877/Szybsza%20wyszukiwarka.user.js
// @updateURL https://update.greasyfork.org/scripts/22877/Szybsza%20wyszukiwarka.meta.js
// ==/UserScript==

$(document).ready(function() {
    $("input[name='q']").bind('keypress', function(e) {
        if (e.keyCode == 13) {
            var val = $(this).val();
            console.log(val);
            
            //if (val.length() < 2)
            //    return true;
            
            if (val.charAt(0) == "@") {
                window.location.href = "/ludzie/" + val.substring(1);
                return false;
            }
            
            if (val.charAt(0) == "#") {
                window.location.href = "/tag/" + val.substring(1);
                return false;
            }
            
            return true;
        }
    });
});