// ==UserScript==
// @name         Xiaomi Forum Hour Hack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Lorem Ipsum
// @author       alxdjo
// @match        http://en.miui.com/*
// @grant        none
//@require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/21492/Xiaomi%20Forum%20Hour%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/21492/Xiaomi%20Forum%20Hour%20Hack.meta.js
// ==/UserScript==

(function() {

    'use strict';
    $(document).ready(function() {
        if(window.location.href =="http://en.miui.com/forum.php"){            
            setTimeout(function() {

                var hrefs = new Array();
                var elements = $("a[class='s xst']");
                elements.each(function() {
                    hrefs.push($(this).attr('href'));
                });
                var randomNumber = rand(0, hrefs.length - 1);
                var href = hrefs[randomNumber];
                window.location = "http://en.miui.com/"+href;

            }, 180000); //three minutes will elapse and then redirect to a random page            
        }
        else
        {
            setTimeout(function() {
                window.location = "http://en.miui.com/forum.php";
            }, 60000); //one minute will elapse and then redirect to a random page
        }
    });
})();


function rand(min, max) {
    var offset = min;
    var range = (max - min) + 1;

    var randomNumber = Math.floor( Math.random() * range) + offset;
    return randomNumber;
}