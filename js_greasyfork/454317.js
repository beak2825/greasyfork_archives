// ==UserScript==
// @name         Nura Name Fixer
// @namespace    https://www.youtube.com/c/NurarihyonMaou
// @version      1.0
// @description  Changes NurarihyonDesu na NurarihyonMaou
// @author       NurarihyonMaou
// @match        https://anilist.co/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @grant        none
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/454317/Nura%20Name%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/454317/Nura%20Name%20Fixer.meta.js
// ==/UserScript==

const $ = window.jQuery;

    $("window").ready(function(){
        $("body").on("input", "input, textarea", function(){
           ($(this).val().indexOf("NurarihyonDesu") >= 0) ? $(this).val($(this).val().replaceAll("NurarihyonDesu", "NurarihyonMaou")) : null;
        });
    });