// ==UserScript==
// @name         Background themes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  themes alis.io
// @author       XaVier
// @match        *://alis.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31014/Background%20themes.user.js
// @updateURL https://update.greasyfork.org/scripts/31014/Background%20themes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("#maincard #ad_main iframe,#maincard #ad_main script")[0].remove();

    var $html = '<input style="position: absolute;'+
        'left: 303px;'+
        'bottom: 303px;'+
        'border: 0;'+
        'padding: 0;'+
        'width: 20px;" id="hx-chnl" type="color" value="">'+
        '<input id="hx-chnl2" class="uk-input" placeholder="NameColorGame" maxlength="150">'+
        '';
    $("#maincard #ad_main").html($html);

    var input = document.getElementById("hx-chnl");
    input.value = localStorage.getItem("cardcolorback") || "";

    var input2 = document.getElementById("hx-chnl2");
    input2.value = localStorage.getItem("cardcolorback2") || "";

    $("#hx-chnl, #hx-chnl2").on("input", function() {
        localStorage.setItem("cardcolorback", input.value);
        localStorage.setItem("cardcolorback2", input2.value);
    });

    $("#hx-chnl").on("input", function() {
        var regIs = $(this).val();
        $("html").css("background", regIs);
        $("#hx-chnl2").val(regIs);
    });
    $("#hx-chnl2").on("input", function() {
        var regI = $(this).val();
        $("html").css("background", regI);
        $("#hx-chnl").val(regI);
    });

    return $("#hx-chnl, #hx-chnl2").trigger("input");
})();