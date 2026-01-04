// ==UserScript==
// @name         Grumpy Old King - Blumaroo Court Jester
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.neopets.com/medieval/grumpyking.phtml
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37733/Grumpy%20Old%20King%20-%20Blumaroo%20Court%20Jester.user.js
// @updateURL https://update.greasyfork.org/scripts/37733/Grumpy%20Old%20King%20-%20Blumaroo%20Court%20Jester.meta.js
// ==/UserScript==

$("#qp1").val("What");
$("#qp2").val("do");
$("#qp3").val("you do if");
$("#qp4").val("");
$("#qp5").val("fierce");
$("#qp6").val("Peophins");
$("#qp7").val("");
$("#qp8").val("has eaten too much");
$("#qp9").val("");
$("#qp10").val("tin of olives");

function select_random(css){
options = $(css+" > option");
options[Math.floor(Math.random() * options.length)].selected = true;

}

select_random('#ap1');
select_random('#ap2');
select_random('#ap3');
select_random('#ap4');
select_random('#ap5');
select_random('#ap6');
select_random('#ap7');
select_random('#ap8');