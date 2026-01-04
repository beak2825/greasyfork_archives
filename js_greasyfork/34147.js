// ==UserScript==
// @name         first_script_hh
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://hextracoin.co/ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34147/first_script_hh.user.js
// @updateURL https://update.greasyfork.org/scripts/34147/first_script_hh.meta.js
// ==/UserScript==


var submit = 0;
var begin = new Date().getTime() / 1000;
var end = begin;
var i = 1; 
 
    $('[name=captcha_key]').focus();
    var myVar = setInterval(function () {
        $('form [type=submit]').removeAttr('disabled');
        if ($('#hxt_amount').val() === '' || $('#hxt_amount').val() == '0') {
            $('#hxt_amount').val('300');
        }
        if (!$('form [type=checkbox]').prop('checked')) {
            $('form [type=checkbox]').prop('checked', true);
        }
        if ($('#password').val() === '') {
            $('#password').val('zzzzz');
        }
        //if ($('[name=aptcha_key]').val() !== '' && $('[name=captcha_key]').val().length == 4 && submit === 0) {
        //    $('form [type=submit]').click();
        //    submit = 1;
        //}
        console.log(i + ' times');
        console.log((end - begin) + ' seconds');
        i++;
        end = new Date().getTime() / 1000;
        if ((end - begin) > 10 || submit == 1) {
            clearInterval(myVar);
        }
    }, 10);