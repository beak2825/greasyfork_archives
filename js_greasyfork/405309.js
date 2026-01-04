// ==UserScript==
// @name         pu签到-花花
// @namespace    http://github.com/aihuahua
// @version      1.0.2
// @description  破解pu网页签到签退
// @author       爱花花
// @match         https://m.pocketuni.net/event_school/sign/eventId/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/405309/pu%E7%AD%BE%E5%88%B0-%E8%8A%B1%E8%8A%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/405309/pu%E7%AD%BE%E5%88%B0-%E8%8A%B1%E8%8A%B1.meta.js
// ==/UserScript==


(function () {
    var signInDoc = document.createElement("p");
    signInDoc.innerHTML += '<a id="sign_in" class="button">签到</a>' +
        '<a id="sign_out" class="button">签退</a>';
    $(signInDoc).appendTo(".container > h2").first().detach("html")




    $("#sign_in").click(
        function () {
            signIn_time_clicks = true;
            signIn();
        }
    );

    $("#sign_out").click(
        function () {
            signOut_time_clicks = true;
            signOut();
        }
    );


})();