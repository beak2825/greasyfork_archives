// ==UserScript==
// @name         Ocmp5 Pictures
// @author       Tehapollo
// @version      1.3
// @include      *mturkcontent.com*
// @include      *s3.amazonaws.com*
// @include      *wml1.crowdcomputingsystems.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  click pictures and mark boxes
// @downloadURL https://update.greasyfork.org/scripts/377962/Ocmp5%20Pictures.user.js
// @updateURL https://update.greasyfork.org/scripts/377962/Ocmp5%20Pictures.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.querySelector('a.inst-title').focus()

    document.getElementsByClassName('col-xs-2')[1]
        .addEventListener('click', function (event) {
$('input[type=checkbox]')[0].click();
document.getElementsByClassName('col-xs-2')[1].style.backgroundColor = "green";
        });

     document.getElementsByClassName('col-xs-2')[2]
        .addEventListener('click', function (event) {
$('input[type=checkbox]')[1].click();
document.getElementsByClassName('col-xs-2')[2].style.backgroundColor = "green";
        });

     document.getElementsByClassName('col-xs-2')[3]
        .addEventListener('click', function (event) {
$('input[type=checkbox]')[2].click();
document.getElementsByClassName('col-xs-2')[3].style.backgroundColor = "green";
        });

     document.getElementsByClassName('col-xs-2')[4]
        .addEventListener('click', function (event) {
$('input[type=checkbox]')[3].click();
document.getElementsByClassName('col-xs-2')[4].style.backgroundColor = "green";
        });

     document.getElementsByClassName('col-xs-2')[5]
        .addEventListener('click', function (event) {
$('input[type=checkbox]')[4].click();
document.getElementsByClassName('col-xs-2')[5].style.backgroundColor = "green";
        });

     document.getElementsByClassName('col-xs-2')[6]
        .addEventListener('click', function (event) {
$('input[type=checkbox]')[5].click();
document.getElementsByClassName('col-xs-2')[6].style.backgroundColor = "green";
        });

     document.getElementsByClassName('col-xs-2')[7]
        .addEventListener('click', function (event) {
$('input[type=checkbox]')[6].click();
document.getElementsByClassName('col-xs-2')[7].style.backgroundColor = "green";
        });

     document.getElementsByClassName('col-xs-2')[8]
        .addEventListener('click', function (event) {
$('input[type=checkbox]')[7].click();
 document.getElementsByClassName('col-xs-2')[8].style.backgroundColor = "green";
        });


     $(document).keydown(function (e) {
          if (e.keyCode == 49 || e.keyCode == 13){
          $('a.button.cc-button.submit-btn.btn.btn-primary').click();
     }
         else if (e.keyCode ==50){
             $('input[type=checkbox]')[8].click();
         }
         });
})();