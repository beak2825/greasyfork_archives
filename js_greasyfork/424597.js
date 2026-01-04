// ==UserScript==
// @name         Google Calendar Alert Interrupter
// @namespace    http://dustindavis.me/
// @version      0.1
// @description  Interrupt me to get my attention where there is a meeting!
// @author       Dustin Davis
// @match        https://calendar.google.com/calendar/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/424597/Google%20Calendar%20Alert%20Interrupter.user.js
// @updateURL https://update.greasyfork.org/scripts/424597/Google%20Calendar%20Alert%20Interrupter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var alrtScope;
    if (typeof unsafeWindow === "undefined") {
        alrtScope = window;
    } else {
        alrtScope = unsafeWindow;
    }

    alrtScope.alert = function(msg) {
        console.log("Intercepted alert: ", msg);

        window.name = "gcal";
        var newWin = openWindow('', 900, 600);
        var html = `
            <style>
                body {
                    background: #4185f4  }
                section {
                    background: black;
                    color: white;
                    border-radius: 1em;
                    padding: 1em;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin-right: -50%;
                    cursor: pointer;
                    transform: translate(-50%, -50%) }
            </style>
            <section id="go">
                <h1>${msg}</h1>
            </section>
        `
        newWin.document.write(html);
        newWin.document.write('<script/>');

        var g = newWin.document.createElement('script');
        var s = newWin.document.getElementsByTagName('script')[0];
        g.text = 'document.getElementById("go").addEventListener("click", () => { window.open("", window.opener.name); window.close();})';
        s.parentNode.insertBefore(g, s);
    };

    function openWindow(url, width, height) {
        var myWindow;
        var center_left = (screen.width / 2) - (width / 2);
        var center_top = (screen.height / 2) - (height / 2);

        myWindow = window.open(url, "Title", "scrollbars=1, width="+width+", height="+height+", left="+center_left+", top="+center_top);
        myWindow.focus();
        return myWindow;
    }
})();


