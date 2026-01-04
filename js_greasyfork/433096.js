// ==UserScript==
// @name         lms easy life
// @namespace    http://tampermonkey.net/
// @version      0.3
// @author       Mo D Genesis
// @description  try to take over the world!
// @match        https://www.leermiddelenshop.nl/*
// @icon         https://www.google.com/s2/favicons?domain=leermiddelenshop.nl
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/433096/lms%20easy%20life.user.js
// @updateURL https://update.greasyfork.org/scripts/433096/lms%20easy%20life.meta.js
// ==/UserScript==
$(document).ready(function() {
    if (window.location.href.indexOf("cart/checkout") > -1) {
        function doSomething() {
            let data = $('#test').val();
            console.log(data);
            let arr = data.split('\t');
            document.getElementById("customer.contact.name").value = arr[0] + ' BOL.COM';
            document.getElementById("customer.contact.lastName").value = arr[2] + ' ' + arr[3];
            document.getElementById("customer.location.postcode").value = arr[9];
            document.getElementById("customer.location.number").value = arr[6];
            document.getElementById("customer.location.numberAddition").value = arr[7];
            document.getElementById("customer.location.address").value = arr[5];
            document.getElementById("customer.location.city").value = arr[10];
            document.getElementById("customer.location.countryCode").value = (arr[11] === "Nederland") ? "NL" : "BE";
        }

        $('.form').prepend(`<div class="flex">
<input class="form__input" type="text" id="test" value=""></input>
  <button class="button button is-primary" type="button" id="load">Data inladen</button>
  </div>`);

        $("#load").click(function() {
            doSomething();
        });
    }


});