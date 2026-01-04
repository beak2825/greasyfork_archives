// ==UserScript==
// @name         Spacehey Profile Style Stripper
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Remove all custom styles from profile with a button click.
// @author       sudofry
// @match        https://spacehey.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spacehey.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503206/Spacehey%20Profile%20Style%20Stripper.user.js
// @updateURL https://update.greasyfork.org/scripts/503206/Spacehey%20Profile%20Style%20Stripper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;
    var css = document.createElement("style");
    css.innerHTML = `

    #divMain {
        width:auto;
        height:auto;
    }

    #removeStyle {
        color: #343536!important;
        position: fixed!important;
        top: 20px!important;
        right: 20px!important;
        background-color: #99ffcc!important;
        background-image: none!important;
        border: 1px solid #343536!important;
        border-radius: 6px!important;
        width: 23px!important;
        height: 23px!important;
        padding: 0!important;
        z-index: 100000!important;
    }`;

    document.head.appendChild(css);

    var divMain = document.createElement("div");
    divMain.id = "divMain";
    $("body").append(divMain);

    if ($('#code').length) {
        var removeStyle = document.createElement("button");
        removeStyle.id = "removeStyle";
        $("#divMain").append(removeStyle);
        $('#removeStyle').html('-');
    }

    $("#removeStyle").on("click", function(e) {
        e.preventDefault();
        $("#divMain").remove();
        $('link[rel="stylesheet"], style').remove();
        $('*').removeAttr('style');
        $('head').append('<link rel="stylesheet" type="text/css" \ href="https://spacehey.com/css/normalize.css" />');
        $('head').append('<link rel="stylesheet" type="text/css" \ href="https://spacehey.com/css/my.css" />');
    });

})();