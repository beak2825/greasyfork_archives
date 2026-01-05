// ==UserScript==
// @name         moomoo.io auto
// @namespace    moomoo.io auto
// @version      4.22
// @description  autoattack, autoheal
// @author       dabby
// @match        http://moomoo.io/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        #
// @connect      moomoo.io
// @downloadURL https://update.greasyfork.org/scripts/29015/moomooio%20auto.user.js
// @updateURL https://update.greasyfork.org/scripts/29015/moomooio%20auto.meta.js
// ==/UserScript==

setTimeout(function() {
    var c = setInterval(function() {
        if (typeof io !== "undefined" && io !== null)
            if (typeof storeBuy === "function" && typeof Object.keys(io.managers)[0] !== "undefined") {
                socket = io.managers[Object.keys(io.managers)[0]].nsps["/"];
                socket.on("1", function(a) {
                    SID = a;
                });
                var c2 = setInterval(function() {
                    if (typeof SID !== "undefined" && SID !== null) {
                        socket.on("10", function(a, b) {
                            if (a === SID && b < 100) {
                                $("#actionBarItem3")
                                    .click();
                                $("#actionBarItem4")
                                    .click();
                                setTimeout(function() {
                                    socket.emit("4", 1);
                                }, 15);
                                setTimeout(function() {
                                    socket.emit("4", 1);
                                }, 15);
                            }
                        });
                        clearInterval(c2);
                    }
                }, 200);
                clearInterval(c);
            }
    }, 200);
}, 3E3);
$('title')
    .html('dabby');
$('#leaderboard')
    .append('DABBY');