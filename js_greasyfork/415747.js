// ==UserScript==
// @name         Envestio troll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://envestio.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415747/Envestio%20troll.user.js
// @updateURL https://update.greasyfork.org/scripts/415747/Envestio%20troll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function random(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var domains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'outlook.es', 'aol.com', 'gmx.de', 'gmx.com', 'zoho.com', 'protonmail.com', 'hubspot.com', 'icloud.com', 'yandex.ru', 'yandex.com', 'lycos.com'];
    var letters = 'abcdefghijklmnopqrstuvwxyz._';
    var letters_password = 'abcdefghijklmnopqrstuvwxyz0123456789._-';

    function generate_random_email(){
        var email = '';
        var email_tmp = '';
        var email_length = random(6,12);

        for(var i=0; i<email_length; i++){
            email_tmp += letters[random(0, letters.length-1)];
        }

        email += email_tmp;

        if(random(0,1) == 0){
            email += random(0, 99);
        }

        email += '@' + domains[random(0, domains.length-1)];
        return email;
    }

    function generate_random_password(){
        var password = '';
        var password_length = random(6,16);

        for(var i=0; i<password_length; i++){
            password += letters[random(0, letters.length-1)];
        }
        return password;
    }

    $('.login-form').show();
    $('#UserName').val(generate_random_email());
    $('#Password').val(generate_random_password());
    $('button[type=submit]').click();

})();