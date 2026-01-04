// ==UserScript==
// @name         Game Nuke
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.0
// @description  My red button is bigger than yours, and it actually works
// @author       Anonymous
// @match        https://epicmafia.com/lobby*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37037/Game%20Nuke.user.js
// @updateURL https://update.greasyfork.org/scripts/37037/Game%20Nuke.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const imgUrl = "https://i.imgur.com/6sV1hjV.png";
    const gameId = 6378882;
    const pass = "6220f239cf1740d5af0c7ac01310d488769836b8";
    const userId = $("#auth_top .user").attr("href").split("/")[2];;

    var timer, countdown, sock;

    var css = `<style>
        #nukeBtn img {
            width: 25px;
            margin-left: 15px;
            cursor: pointer;
        }
        #nukeBg {
            display: none;
            position: fixed;
            top: 0px;
            z-index: 100;
            width: 100%;
            height: 100%;
            background-color: black;
            opacity: .8;
        }
        #nukeModal {
            display: none;
            position: fixed;
            top: 30%;
            margin-top: -100px;
            left: 50%;
            margin-left: -250px;
            z-index: 101;
            width: 500px;
            height: 200px;
            background-color: #efefef;
            border-radius: 2px;
        }
        #nukeTitle {
            width: 100%;
            text-align: center;
            font-size: 35px;
            margin-top: 20px;
        }
        #nukeCount {
            width: 100%;
            text-align: center;
            font-size: 30px;
            margin-top: 20px;
        }
        #cancelNuke {
            display: block;
            margin: auto;
            margin-top: 40px;
            font-size: 20px;
            border: 0px;
            background-color: #c11;
            color: white;
            padding: 10px;
            border-radius: 3px;
            cursor: pointer;
        }
    </style>`;

    var clearModal = function () {
        $("#nukeBg, #nukeModal").hide();
        $("#nukeCount").text(10);
    };

    var stopTimers = function () {
        clearTimeout(timer);
        clearInterval(countdown);
    };

    var leave = function () {
        $.get("https://epicmafia.com/game/" + gameId + "/leave");
    };

    $("head").append(css);
    $("#lobby-nav ul.lt").append("<li id='nukeBtn'><img src='" + imgUrl + "' /></li>");
    $("body").append("<div id='nukeBg'></div>");
    $("body").append("<div id='nukeModal'>\
                        <div id='nukeTitle'>Nuking games in</div>\
                        <div id='nukeCount'>10</div>\
                        <button id='cancelNuke'>Cancel</button>\
                    </div>");

    $("#nukeBtn").click(() => {
        $("#nukeBg, #nukeModal").show();

        sock = new WebSocket("wss://epicmafia.com/m.io/");
        sock.onopen = () => {
            sock.send('["join", {"gameid": ' + gameId + ', "uid": ' + userId + ', "pass": "' + pass + '"}]');

            timer = setTimeout(() => {
                $("body").css("background", "url(https://i.imgur.com/JyszRA1.gif) scroll");
                stopTimers();
                clearModal();

                setTimeout(() => {
                    $("body").css("background", "url(https://epicmafia.com/images/scatter.png) scroll");
                }, 2000);
            }, 10000);

            countdown = setInterval(() => {
                $("#nukeCount").text(parseInt($("#nukeCount").text()) - 1);
            }, 1000);
        };
    });

    $("#cancelNuke").click(() => {
        leave();
        stopTimers();
        clearModal();
    });

    leave();
})();
