// ==UserScript==
// @name         Zillow Full image appender
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  show zillow full images at the bottom of the page, must scroll through mini slideshow first
// @author       Harry Groover
// @match        https://www.zillow.com/homedetails/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32221/Zillow%20Full%20image%20appender.user.js
// @updateURL https://update.greasyfork.org/scripts/32221/Zillow%20Full%20image%20appender.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(function() {
        /*
        setTimeout(function() {
            var body = $('body');
        
            $('.img-wrapper').each(function() {
                console.log($(this).html().replace('/p_h/', '/p_f/').replace('/p_c/', '/p_f/').replace('onload=""', '').replace('class="hip-photo"', '').replace('id="', 'id="zzz__'));
                $('body').append($('<div style="text-align: center; background-color: #fff;">'+$(this).html().replace('/p_h/', '/p_f/').replace('/p_c/', '/p_f/')+'</div>'));
            });
        }, 1000);
        */
        $('img.hip-photo').one('load',function() {
            var me = $(this);
            $('body').append($('<div style="text-align: center; background-color: #fff; margin: 40px 0;">'+me.get(0).outerHTML.replace('/p_h/', '/p_f/').replace('/p_c/', '/p_f/')+'</div>'));
        });
    });
})();