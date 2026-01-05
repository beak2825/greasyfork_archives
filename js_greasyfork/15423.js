// ==UserScript==
// @name         Changer Background Paypal
// @namespace     https://www.paypal.com/
// @version      1.0
// @description  try to take over the world!
// @author       Marentdu93
// @match        https://www.paypal.com/fr/webapps/mpp/merchant
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15423/Changer%20Background%20Paypal.user.js
// @updateURL https://update.greasyfork.org/scripts/15423/Changer%20Background%20Paypal.meta.js
// ==/UserScript==
$(document).ready(function(){

    var css = '.hero-bg{background-image:url("http://www.planwallpaper.com/static/images/2022725-wallpaper_625864_Iz6NK8G.jpg")}';

    $('head').append('<style>' + css + '</style>');

});