// ==UserScript==
// @name         JavLibrary to Nyaa
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add a buton to search the video on nyaa
// @author       Anon
// @include      https://www.javlibrary.com/*
// @include      https://sukebei.nyaa.si/*
// @exclude      https://www.javlibrary.com/en/login.php
// @exclude      https://www.javlibrary.com/en/search.php
// @icon         https://www.google.com/s2/favicons?domain=javlibrary.com
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442609/JavLibrary%20to%20Nyaa.user.js
// @updateURL https://update.greasyfork.org/scripts/442609/JavLibrary%20to%20Nyaa.meta.js
// ==/UserScript==
//"https://sukebei.nyaa.si/?f=0&c=0_0&q=";
(function() {
    'use strict';
    $(".id").each(function () {
        var b ='<a target="_blank" href="https://sukebei.nyaa.si/?f=0&c=0_0&q='+$(this).text()+'&s=seeders&o=desc&script"><img src="https://sukebei.nyaa.si/static/favicon.png"></a> ';
        $(this).parent().siblings('.toolbar').append(b);
    });
    $("#video_id tr .text").each(function () {
        var b ='<a target="_blank" href="https://sukebei.nyaa.si/?f=0&c=0_0&q='+$(this).text()+'&s=seeders&o=desc&script"><img src="https://sukebei.nyaa.si/static/favicon.png"></a> ';
        $("#video_title h3").prepend(b);
    });
    if (window.location.href.indexOf("script") > -1) {
        var target = document.querySelector("td:nth-child(3) > a:nth-child(2) > i:nth-child(1)").click();
    }
}
)();