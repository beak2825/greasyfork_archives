// ==UserScript==
// @name       PaperTrade
// @namespace  papertrade
// @version    1.0.0
// @date       06-02-2020
// @author     nijevazno
// @description  Dark Theme for Paper Trade of Kisschart.com | Keep it simple and straightforward
// @match      https://kisschart.com/trade/
// @copyright  nijevazno 2020
// @grant      GM_addStyle
// @grant      GM_getValue
// @grant      GM_setValue
// @license    GPLv3
// @run-at     document-start
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/404539/PaperTrade.user.js
// @updateURL https://update.greasyfork.org/scripts/404539/PaperTrade.meta.js
// ==/UserScript==

$(document).ready(function () {

    GM_addStyle("body {background-color: #212335!important;color: #fff;} .navbar-light .navbar-brand, .navbar-light .navbar-nav .nav-link {color: #fff;} .navbar-light .navbar-nav .nav-link:hover, .navbar-light .navbar-nav .nav-link:focus, .navbar-light .navbar-nav .show>.nav-link { color: #999;} a {color: #038aff;} .bg-white {background-color: #212335!important;}.card {background-color: #222437;}.table { color: #fff!important;}.btn {color: #40c5c5} .btn:hover {color: #999;}");

});
