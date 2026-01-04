// ==UserScript==
// @name         Slither-Feeder-Bot
// @namespace    Slither Feeder Bot  by l3mpik
// @version      1.0
// @description  Slither Feeder Bot
// @author       l3mpik
// @match        *://slither.io/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388357/Slither-Feeder-Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/388357/Slither-Feeder-Bot.meta.js
// ==/UserScript==

var vps = 0;

var updatespeed = 100;

var bname = "xxx";

$('iframe :first').hide();

$("canvas:eq(3)").after("<div style='height: 150px; background-color: #000000; opacity: 0.8; filter: alpha(opacity=40); zoom: 1; width: 205px; top: 1%; left: 1%; display: block; position: fixed; text-align: center; font-size: 15px; color: #ffffff; padding: 5px; font-family: Ubuntu; border: 0.5px solid #ffffff; border-radius: 5px; box-shadow: 0px 0px 5px 5px #ff0000;'> <div style='color:#ffffff; display: inline; -moz-opacity:1; -khtml-opacity: 1; opacity:1; filter:alpha(opacity=100); padding: 10px;'><a>Bots</a></div> <div style='color:#ffffff; display: inline; opacity:0.8; filter:alpha(opacity=100); padding: 10px;' position: fixed;><br>Status: <a id='count' > Off </a> </div> <div style='color:#ffffff; display: inline; -moz-opacity:1; -khtml-opacity: 1; opacity:1; filter:alpha(opacity=100); padding: 10px;'><br><a></a> Move To Head: <a id='moveh' >On</a> </div> <div style='color:#ffffff; display: inline; -moz-opacity:1; -khtml-opacity: 1; opacity:1; filter:alpha(opacity=100); padding: 10px;'><br><a>X</a> - Snake Speed: <a id='isspeed' >Off</a> <br><button id='start' style='width: 150px; height: 25px; background:#ff3333; border: 0px; border-radius: 5px;'>OFF</button><br>MODE: <font color='#00ff00'><a id='mode' ></a></font></div> ");

//ii.src = "http://www.designyourway.net/drb/ths/diverse/blacktextures/77462229.jpg";
//lbh.textContent = "l3mpik++";

if (vps == 1) {
    var socket = io.connect('ws://xxxxxxxxxx');
    $("#mode").text('VPS')
} 
 else {
    var socket = io.connect('ws://127.0.0.1:3000');
    $("#mode").text('LOCAL')
}

document.body.onmousewheel = zoom;

function zoom(e) {

    gsc *= Math.pow(0.9, e.wheelDelta / -120 || e.detail || 0);

}

setInterval(function() {

    if (window["snake"] !== undefined) {

        var x = snake.xx;
        var y = snake.yy;

        socket.emit('pos', x, y);

    }


}, updatespeed);

window.onkeydown = function(e) {

    if (e.keyCode === 88) {
        socket.emit('cmd', 1);
        $('#isspeed').text('On');
    }
}

window.onkeyup = function(e) {

    if (e.keyCode === 88) {
        socket.emit('cmd', 0);
        $('#isspeed').text('Off');
    }
}



socket.on('bcount', function(data) {

    $('#count').text(data);

});


var st_click = 0;

$("#start").click(function() {
    if (st_click == 0) {
        st_click = 1;

        $("#start").css('background', '#4dff4d');
        $("#start").text('On');

        if (window["bso"] !== undefined) {
            var ip = "" + bso.ip + ":" + bso.po;

            socket.emit('server', ip);

        } else {
            console.log('Try refresh page : /');
        }
    } else {
        st_click = 0;

        $("#start").css('background', '#ff3333');
        $("#start").text('OFf');
    }

});


socket.emit('bname', bname);
