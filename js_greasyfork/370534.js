// ==UserScript==
// @name OTP Style
// @namespace Violentmonkey Scripts
// @match *://192.168.2.153/*
// @grant none
// @description OTP STYLEs
// @version 32
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/370534/OTP%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/370534/OTP%20Style.meta.js
// ==/UserScript==
  var a = 1;

jQuery = $;
(($) => {
  $(document).ready(() => {

var $ = document; // shortcut
var cssId = 'myCss';  // you could encode the css path itself to generate id..
    var head  = $.getElementsByTagName('head')[0];
    var link  = $.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'http://fo.hol.es/otp/1.css?'+getRandomArbitary(155, 33553);
    link.media = 'all';
    head.appendChild(link);

    var timerId = setInterval(function() {
var i = 1;
while (jQuery('body > div.right-desk > table > tbody > tr:nth-child('+i+') > td:nth-child(2)').text() != 'Старцев Юрий Олегович') {i++;}

jQuery('body > div.right-desk > table > tbody > tr:nth-child('+i+') > td:nth-child(2)');
jQuery('body > div.right-desk > table > tbody > tr:nth-child('+i+') > td:nth-child(1)').css('background', 'url(https://media.giphy.com/media/q4i4bXTlHUv3W/source.gif) no-repeat center');
jQuery('body > div.right-desk > table > tbody > tr:nth-child('+i+') > td:nth-child(1)').css('background-size', 'contain');
}, 500);


  });
})(jQuery);





function getRandomArbitary(min, max)
{
  return Math.random() * (max - min) + min;
}
