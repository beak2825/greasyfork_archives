// ==UserScript==
// @name           Przewijacz
// @namespace      https://greasyfork.org
// @description    Dodaje guziczek do przewijania stron jak na głównej
// @author         2013, suchar, 2019, woland
// @homepage       https://greasyfork.org/pl/scripts/376640-przewijacz
// @include        https*://fotka.com/*
// @exclude        https://fotka.com/
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @version        2.1
// @run-at         document-end
// @grant          unsafeWindow
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/376640/Przewijacz.user.js
// @updateURL https://update.greasyfork.org/scripts/376640/Przewijacz.meta.js
// ==/UserScript==
var u = unsafeWindow;
//var $ = u.$;
var $ = window.jQuery;

var przewijacz = document.createElement("div");
przewijacz.innerHTML = '<div id="index-gotop-header">Do góry</div><div id="index-gotop-footer" style="overflow: hidden; display: none;"><div id="index-gotop-separator"></div>Stopka</div>';
przewijacz.id = "index-gotop";
$("#content").append(przewijacz);

GM_addStyle("#index-gotop { display: none; position: fixed; z-index: 2; cursor: pointer; bottom: -4px; right: 20px; background-color: white; box-shadow: 0 1px 3px rgba(34,34,34,0.5); border-radius: 4px; border: 1px solid rgba(153,153,153,0.5); text-align: center; }");
GM_addStyle("#index-gotop-header { padding: 10px 10px 8px; }");
GM_addStyle("#index-gotop-header:hover, #index-gotop-footer:hover { color: #4996ba; }");
GM_addStyle("#index-gotop-footer { padding: 0 10px 8px; }");
GM_addStyle("#index-gotop-separator { margin-bottom: 8px; border-top: 1px solid rgba(153,153,153,0.5); }");

$('#index-gotop-header').bind('click', function() {
    $('html, body').animate({
        scrollTop: $("#header").offset().top
    }, 500);
});

$('#index-gotop-footer').bind('click', function() {
    $('html, body').animate({
        scrollTop: $(document).height()
    }, 500, function() {
        $('#index-gotop-footer').slideUp('fast');
    });
});

$(window).scroll(function() {
    if ($(document).scrollTop() > 400) {
        $('#index-gotop').slideDown('fast');
    } else {
        $('#index-gotop').slideUp('fast');
    }
    
    if ($(window).scrollTop() + $(window).height() === $(document).height()) {
        $('#index-gotop-footer').slideUp('fast');
    } else {
        $('#index-gotop-footer').slideDown('fast');
    }
});