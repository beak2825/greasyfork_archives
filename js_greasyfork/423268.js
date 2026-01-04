// ==UserScript==
// @name         MooMoo.io Improver  |  starter resources  |  Anti-AD  |  Big Store
// @namespace    -
// @version      3.1
// @description  This is a simple script that improves Moomoo.io! You have starter resources, no ads and some other modifications!
// @author       W4IT
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://*.moomoo.io/*
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423268/MooMooio%20Improver%20%20%7C%20%20starter%20resources%20%20%7C%20%20Anti-AD%20%20%7C%20%20Big%20Store.user.js
// @updateURL https://update.greasyfork.org/scripts/423268/MooMooio%20Improver%20%20%7C%20%20starter%20resources%20%20%7C%20%20Anti-AD%20%20%7C%20%20Big%20Store.meta.js
// ==/UserScript==

setInterval(() => window.follmoo && follmoo(), 10);
window.location.native_resolution = true;
document.querySelector("#pre-content-container").remove(); // anti ad
document.getElementById("storeHolder").style = "height: 1000px; width: 480px;"; // big store
$("#mapDisplay").css({background: `url('http://i.imgur.com/Qllo1mA.png')`}); //better map
document.getElementById("moomooio_728x90_home").style.display = "none";
$("#moomooio_728x90_home").parent().css({display: "none"});
document.getElementById('gameName').innerHTML = 'MooMoo.IO';
document.getElementById('gameName').style.color = "#fe1414";
document.getElementById('loadingText').innerHTML = ' Your Game is loading... ';
document.getElementById('loadingText').style.color = "#f76f16";
document.querySelector("#leaderboard").appendChild(
    (function() {
        let text = "Ping: ";
        let text2 = " ms";
        let oldPing = 0;
        const pingSpan = document.createElement("span");
        pingSpan.id = "pingTime";
        pingSpan.textContent = text;
        pingSpan.style.display = "inline-block";
        setInterval(function() {
            typeof pingTime !== "undefined" &&
                oldPing !== pingTime &&
                ((oldPing = pingTime),
                 (pingSpan.textContent = text + oldPing + text2),
                 (function() {
                if (oldPing <= 100) {
                    pingSpan.style.color = "green";
                }
                if (oldPing >= 101 && oldPing <= 250) {
                    pingSpan.style.color = "Orange";
                }
                if (oldPing >= 251) {
                    pingSpan.style.color = "red";
                }
            })());
        });
        return pingSpan;
    })()
);
document.getElementById("enterGame").addEventListener('click', autohide);
function autohide(){
    $("#ot-sdk-btn-floating").hide();
}