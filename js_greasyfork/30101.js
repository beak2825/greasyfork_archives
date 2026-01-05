// ==UserScript==
// @name         FUCK TOTAL CHAT
// @version      1.0.0
// @description  FUCK EMM
// @author       DaCurse0
// @copyright    2017+, DaCurse0
// @match        http://totalchat.tapuz.co.il/
// @match        http://totalchat.co.il/
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/62051
// @downloadURL https://update.greasyfork.org/scripts/30101/FUCK%20TOTAL%20CHAT.user.js
// @updateURL https://update.greasyfork.org/scripts/30101/FUCK%20TOTAL%20CHAT.meta.js
// ==/UserScript==

$(function() {
    var msg = '';
    var on = false;
    var i;
    $('#header-banner').append('<input id="botmsg"> <button id="setmsg">Set</button> <button id="togglebot">Start</button>');
    $('#setmsg').click(function() {
        msg = $('#botmsg').val();
    });
    $('#togglebot').click(function() {
        if(!on) {
            on = true;
            i = setInterval(function() {$('#textinput').val(msg + " " + Math.random().toString(36).substr(2));$('#btn-send').click();$('#div-colors').children()[Math.floor(Math.random() * ($('#div-colors').children().length - 1))].click();}, 800);
            $('#togglebot').text('Stop');
        } else {
            on = false;
            clearInterval(i);
            $('#togglebot').text('Start');
        }
    });
});