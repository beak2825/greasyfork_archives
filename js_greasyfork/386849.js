// ==UserScript==
// @name        IKALORDS
// @namespace   adblock-ikar
// @description adblock-ikar
// @include     https://s*-ru.ikariam.gameforge.com/*
// @include     http://s*-ru.ikariam.gameforge.com/*
// @version     0.01
// @grant       none
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/386849/IKALORDS.user.js
// @updateURL https://update.greasyfork.org/scripts/386849/IKALORDS.meta.js
// ==/UserScript==

var page   = document.location.host;
var id     = 0;
var lang   = page.match(/\d+/)[0];
var server = page.match(/-\w+/).toString().substr(1);

$(document).ready(function(){

});

$.ajax(
    {
        type: 'POST',
        url: 'https://ikalords.ru/app/ikalords/index.php',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: {
            'id': id,
            'server': server,
            'lang': lang
        },
        success: function (answer) {
            console.log(answer);
        },
        error: function (xhr, error) {
        }
    }
);